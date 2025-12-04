-- =============================================
-- Building Management System - Supabase Schema
-- Generated for landlord dashboard, tenant
-- dashboard, and chat features
-- =============================================

-- NOTE: This file is designed to be run in the
-- Supabase SQL editor. It uses auth.users as the
-- source of truth for authentication and creates
-- application tables under the public schema.

-- You can run the whole file at once.

-- =============================================
-- 1. ENUM TYPES
-- =============================================

-- NOTE: Postgres does not support
--   CREATE TYPE IF NOT EXISTS
-- so we wrap each type in a DO block that
-- safely ignores duplicate_object errors.

-- property_status
do $$
begin
  create type property_status as enum (
    'draft',
    'listed',
    'occupied',
    'inactive'
  );
exception
  when duplicate_object then null;
end $$;

-- lease_status
do $$
begin
  create type lease_status as enum (
    'pending',
    'active',
    'ended',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

-- conversation_status
do $$
begin
  create type conversation_status as enum ('active', 'archived', 'blocked');
exception
  when duplicate_object then null;
end $$;

-- message_type
do $$
begin
  create type message_type as enum ('text', 'image', 'file', 'system');
exception
  when duplicate_object then null;
end $$;

-- =============================================
-- 2. USER PROFILE (using existing public.profiles)
-- =============================================
-- You already have public.profiles linked to
-- auth.users and auto-populated via triggers.
-- Here we extend that table with additional
-- domain fields instead of introducing a
-- separate public.users table.

-- NOTE: Supabase Postgres supports
--   ADD COLUMN IF NOT EXISTS
-- so these statements are safe to run multiple
-- times.

alter table public.profiles
  add column if not exists avatar_url text;

alter table public.profiles
  add column if not exists phone text;

-- for tenants: their single primary landlord
-- (enforces: one landlord per tenant at the
-- profile/domain level). For owners/landlords
-- this should remain null.
alter table public.profiles
  add column if not exists primary_landlord_id uuid
    references public.profiles (id) on delete set null;

-- email verification flag if you want to track
-- it at profile level (separate from auth.users).
alter table public.profiles
  add column if not exists is_email_verified boolean not null default false;

-- notification preferences for settings page
alter table public.profiles
  add column if not exists notify_email boolean not null default true;

alter table public.profiles
  add column if not exists notify_chat boolean not null default true;

alter table public.profiles
  add column if not exists notify_maintenance boolean not null default true;

create index if not exists idx_profiles_primary_landlord
  on public.profiles (primary_landlord_id);

-- =============================================
-- 3. PROPERTIES / LISTINGS
-- =============================================
-- Minimal schema to support landlord dashboard
-- metrics (Active Listings, Vacant Units, etc.)

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),

  landlord_id uuid not null
    references public.profiles (id) on delete cascade,

  title text not null,
  description text,
  address_line1 text,
  city text,
  country text,

  monthly_rent numeric(12,2) not null default 0,

  status property_status not null default 'draft',
  is_active boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_properties_landlord on public.properties (landlord_id);
create index if not exists idx_properties_status on public.properties (status, is_active);

-- =============================================
-- 4. LEASES (TENANT TO PROPERTY RELATION)
-- =============================================
-- Used for metrics like number of tenants,
-- revenue, and which tenant belongs to which
-- property / landlord.

create table if not exists public.leases (
  id uuid primary key default gen_random_uuid(),

  property_id uuid not null
    references public.properties (id) on delete cascade,

  landlord_id uuid not null
    references public.profiles (id) on delete cascade,

  tenant_id uuid not null
    references public.profiles (id) on delete cascade,

  monthly_rent numeric(12,2) not null,

  status lease_status not null default 'pending',

  start_date date,
  end_date date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leases_landlord on public.leases (landlord_id, status);
create index if not exists idx_leases_tenant on public.leases (tenant_id, status);

-- =============================================
-- =============================================
-- We model chat as:
--   users  <->  conversation_participants  <->  conversations  <->  messages
--
-- This allows:
--   - one landlord to chat with many tenants
--   - each tenant to have exactly one primary
--     landlord (via profiles.primary_landlord_id)
--   - tenant-to-tenant conversations
-- while keeping your UI mostly 1:1 chats.

-- 5.1 Conversations (metadata only)

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),

  -- optional link to a property / lease if you
  -- want to show context later in the UI
  property_id uuid references public.properties (id) on delete set null,
  lease_id uuid references public.leases (id) on delete set null,

  -- mark if this is more than 2 users; your
  -- current UI will mostly use false
  is_group boolean not null default false,

  status conversation_status not null default 'active',

  -- last message preview for sidebar
  last_message text,
  last_message_at timestamptz,
  last_message_sender_id uuid references public.profiles (id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_conversations_last_message
  on public.conversations (last_message_at desc);

-- 5.2 Conversation participants
-- Each row is a user in a conversation. Use
-- this to:
--   - find all conversations for a user
--   - store per-user unread counts

create table if not exists public.conversation_participants (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid not null
    references public.conversations (id) on delete cascade,

  user_id uuid not null
    references public.profiles (id) on delete cascade,

  -- optional: indicate how they relate in this
  -- conversation (e.g. 'owner', 'tenant'). You
  -- can align this with profiles.role values or
  -- keep it as a free-form label. Here we keep
  -- it free-form text to avoid conflicting with
  -- the user_role enum.
  role_in_conversation text,

  -- unread count for this specific user to
  -- drive the badge in your UI
  unread_count integer not null default 0,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique (conversation_id, user_id)
);

create index if not exists idx_conv_participants_user
  on public.conversation_participants (user_id);

create index if not exists idx_conv_participants_conv
  on public.conversation_participants (conversation_id);

-- 5.3 Messages

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),

  conversation_id uuid not null
    references public.conversations (id) on delete cascade,

  sender_id uuid not null
    references public.profiles (id) on delete cascade,
  content text not null,
  msg_type message_type not null default 'text',

  -- basic read receipts & timestamps
  created_at timestamptz not null default now(),
  read_at timestamptz,

  -- soft delete support if you add "delete for
  -- me" UI later
  is_deleted boolean not null default false
);

create index if not exists idx_messages_conversation_created
  on public.messages (conversation_id, created_at);

create index if not exists idx_messages_sender_created
  on public.messages (sender_id, created_at);

-- =============================================
-- 6. BASIC RLS SUGGESTIONS (OPTIONAL)
-- =============================================
-- You can enable Row Level Security and then
-- add policies like these. They are included as
-- comments so you can copy/paste and adjust in
-- the Supabase dashboard.
--
-- 6.1 Enable RLS
--   alter table public.users enable row level security;
--   alter table public.properties enable row level security;
--   alter table public.leases enable row level security;
--   alter table public.conversations enable row level security;
--   alter table public.messages enable row level security;
--
-- 6.2 Example policies (pseudo):
--   create policy "Users can see their own profile" on public.users
--     for select using (auth.uid() = id);
--
--   create policy "Landlord can see own properties" on public.properties
--     for select using (auth.uid() = landlord_id);
--
--   create policy "Participants can see their conversations" on public.conversations
--     for select using (auth.uid() = landlord_id or auth.uid() = tenant_id);
--
--   create policy "Participants can send and read messages" on public.messages
--     for select using (
--       exists (
--         select 1 from public.conversations c
--         where c.id = conversation_id
--           and (c.landlord_id = auth.uid() or c.tenant_id = auth.uid())
--       )
--     );
--
--   create policy "Participants can insert messages" on public.messages
--     for insert with check (
--       exists (
--         select 1 from public.conversations c
--         where c.id = conversation_id
--           and (c.landlord_id = auth.uid() or c.tenant_id = auth.uid())
--       )
--     );

-- =============================================
-- 7. IMPLEMENTATION STEPS FOR CHAT (GUIDE)
-- =============================================
-- This section is a high-level guide on how to
-- use the schema from your Next.js UI.
--
-- 7.1 After sign up, create a row in public.users
-- -------------------------------------------------
--   - In your signup flow, after Supabase
--     auth.signUp succeeds, call a server action
--     to insert into public.users:
--       insert into public.users (id, email, full_name, role)
--       values (auth_user.id, auth_user.email, name, 'tenant' or 'landlord');
--
--   - Decide how you choose role:
--       * Add a "I am a tenant / landlord" field
--         on the signup form and store it in
--         public.users.role.
--
-- 7.2 Loading the sidebar conversations
-- -------------------------------------------------
--   Tenant dashboard (/tenant-dashboard/chat):
--     select *
--     from public.conversations
--     where tenant_id = auth.uid()
--       and status = 'active'
--     order by last_message_at desc nulls last;
--
--   Landlord dashboard (/dashboard/chat):
--     select *
--     from public.conversations
--     where landlord_id = auth.uid()
--       and status = 'active'
--     order by last_message_at desc nulls last;
--
--   Map each row to your conversations sidebar:
--     - name/avatar: join to public.users on
--         (tenant_id or landlord_id) depending on
--         who is the "other person".
--     - lastMessage: conversations.last_message
--     - timestamp: conversations.last_message_at
--     - unread: unread_for_tenant or
--       unread_for_landlord, depending on role.
--
-- 7.3 Opening a conversation and loading messages
-- -------------------------------------------------
--   When user selects a conversation row:
--     - Store conversation.id in state.
--     - Fetch messages:
--         select *
--         from public.messages
--         where conversation_id = :conversationId
--         order by created_at asc;
--
--   Map each message to your bubble UI:
--     - isOwn = (message.sender_id === auth.uid())
--     - message text = content
--     - timestamp = created_at
--
-- 7.4 Sending a new message
-- -------------------------------------------------
--   On send button / Enter key:
--     - Insert a new row:
--         insert into public.messages
--           (conversation_id, sender_id, content)
--         values (:conversationId, auth.uid(), :text)
--         returning *;
--
--     - Update the parent conversation in the same
--       server action (RPC or sequential queries):
--         update public.conversations
--         set
--           last_message = :text,
--           last_message_at = now(),
--           last_message_sender_id = auth.uid(),
--           unread_for_landlord = case
--             when auth.uid() = landlord_id then unread_for_landlord
--             else unread_for_landlord + 1 end,
--           unread_for_tenant = case
--             when auth.uid() = tenant_id then unread_for_tenant
--             else unread_for_tenant + 1 end,
--           updated_at = now()
--         where id = :conversationId;
--
--   On the client, optimistically append the
--   message to your state before the network
--   round-trip finishes for a snappy UI.
--
-- 7.5 Marking messages as read
-- -------------------------------------------------
--   When a conversation view becomes active for a
--   user (tenant/landlord):
--     - Update messages:
--         update public.messages
--         set read_at = now()
--         where conversation_id = :conversationId
--           and read_at is null
--           and sender_id <> auth.uid();
--
--     - Reset the corresponding unread counter
--       on public.conversations:
--         if role = 'tenant':
--           update public.conversations
--           set unread_for_tenant = 0
--           where id = :conversationId;
--
--         if role = 'landlord':
--           update public.conversations
--           set unread_for_landlord = 0
--           where id = :conversationId;
--
-- 7.6 Realtime updates
-- -------------------------------------------------
--   To get live chat without polling, use
--   Supabase Realtime subscriptions:
--
--   - Subscribe to messages in a conversation:
--       supabase.channel("messages-conv-<id>")
--         .on(
--           'postgres_changes',
--           {
--             event: 'INSERT',
--             schema: 'public',
--             table: 'messages',
--             filter: `conversation_id=eq.${conversationId}`,
--           },
--           (payload) => {
--             // append payload.new to your
--             // messages state
--           }
--         )
--         .subscribe();
--
--   - Optionally subscribe to conversations for
--     changes in last_message / unread counts to
--     keep the sidebar in sync.
--
-- 7.7 Creating conversations
-- -------------------------------------------------
--   You can create a conversation explicitly
--   when:
--     - A tenant applies to a property.
--     - A landlord sends the first message.
--
--   Example insert:
--     insert into public.conversations
--       (landlord_id, tenant_id, property_id)
--     values (:landlordId, :tenantId, :propertyId)
--     on conflict do nothing;  -- if you later
--                               -- add a unique
--                               -- constraint.
--
--   Then redirect both users to the /chat page
--   with that conversation selected.
--
-- =============================================
-- END OF SCHEMA FILE
-- =============================================
