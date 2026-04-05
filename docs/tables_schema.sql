-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.conversation_participants (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role_in_conversation text,
  unread_count integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT conversation_participants_pkey PRIMARY KEY (id),
  CONSTRAINT conversation_participants_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id),
  CONSTRAINT conversation_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.conversations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid,
  lease_id uuid,
  is_group boolean NOT NULL DEFAULT false,
  status USER-DEFINED NOT NULL DEFAULT 'active'::conversation_status,
  last_message text,
  last_message_at timestamp with time zone,
  last_message_sender_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT conversations_pkey PRIMARY KEY (id),
  CONSTRAINT conversations_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id),
  CONSTRAINT conversations_lease_id_fkey FOREIGN KEY (lease_id) REFERENCES public.leases(id),
  CONSTRAINT conversations_last_message_sender_id_fkey FOREIGN KEY (last_message_sender_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.document_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL UNIQUE,
  description text,
  is_required boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT document_types_pkey PRIMARY KEY (id)
);
CREATE TABLE public.employees (
  id uuid NOT NULL,
  owner_id uuid NOT NULL,
  job_title text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  name character varying,
  email character varying,
  phone character varying,
  position character varying,
  department character varying,
  salary integer,
  join_date date,
  status character varying DEFAULT 'Active'::character varying,
  attendance_rate integer DEFAULT 0,
  last_attendance timestamp without time zone,
  CONSTRAINT employees_pkey PRIMARY KEY (id),
  CONSTRAINT employees_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.owner_profiles(id)
);
CREATE TABLE public.leases (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  landlord_id uuid NOT NULL,
  tenant_id uuid NOT NULL,
  monthly_rent numeric NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'pending'::lease_status,
  start_date date,
  end_date date,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true,
  CONSTRAINT leases_pkey PRIMARY KEY (id),
  CONSTRAINT leases_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id),
  CONSTRAINT leases_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.profiles(id),
  CONSTRAINT leases_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  content text NOT NULL,
  msg_type USER-DEFINED NOT NULL DEFAULT 'text'::message_type,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  read_at timestamp with time zone,
  is_deleted boolean NOT NULL DEFAULT false,
  CONSTRAINT messages_pkey PRIMARY KEY (id),
  CONSTRAINT messages_conversation_id_fkey FOREIGN KEY (conversation_id) REFERENCES public.conversations(id),
  CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.notification_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  payment_notifications boolean DEFAULT true,
  inquiry_notifications boolean DEFAULT true,
  message_notifications boolean DEFAULT true,
  maintenance_notifications boolean DEFAULT true,
  listing_notifications boolean DEFAULT true,
  system_notifications boolean DEFAULT true,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT notification_preferences_pkey PRIMARY KEY (id),
  CONSTRAINT notification_preferences_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title character varying NOT NULL,
  message text NOT NULL,
  type character varying NOT NULL DEFAULT 'system'::character varying CHECK (type::text = ANY (ARRAY['payment'::character varying, 'inquiry'::character varying, 'message'::character varying, 'maintenance'::character varying, 'listing'::character varying, 'system'::character varying]::text[])),
  related_entity_type character varying,
  related_entity_id uuid,
  is_read boolean DEFAULT false,
  action_url character varying,
  icon character varying,
  priority character varying DEFAULT 'normal'::character varying CHECK (priority::text = ANY (ARRAY['low'::character varying, 'normal'::character varying, 'high'::character varying, 'urgent'::character varying]::text[])),
  created_at timestamp without time zone DEFAULT now(),
  read_at timestamp without time zone,
  is_global boolean DEFAULT false,
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.owner_profiles (
  id uuid NOT NULL,
  company_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT owner_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT owner_profiles_id_fkey FOREIGN KEY (id) REFERENCES public.profiles(id)
);
CREATE TABLE public.payment_methods (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  method_type character varying NOT NULL CHECK (method_type::text = ANY (ARRAY['bank_account'::character varying, 'mobile_money'::character varying, 'check'::character varying]::text[])),
  account_name character varying,
  account_number character varying,
  bank_name character varying,
  mobile_provider character varying,
  mobile_number character varying,
  is_default boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT payment_methods_pkey PRIMARY KEY (id),
  CONSTRAINT payment_methods_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES auth.users(id)
);
CREATE TABLE public.payouts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  property_id uuid NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0::numeric),
  currency character varying DEFAULT 'ETB'::character varying,
  payment_method character varying NOT NULL,
  status character varying DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'processing'::character varying, 'completed'::character varying, 'failed'::character varying, 'cancelled'::character varying]::text[])),
  transaction_id character varying UNIQUE,
  payment_date timestamp without time zone,
  due_date timestamp without time zone,
  description text,
  notes text,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  CONSTRAINT payouts_pkey PRIMARY KEY (id),
  CONSTRAINT payouts_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES auth.users(id),
  CONSTRAINT payouts_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'tenant'::text CHECK (role = ANY (ARRAY['tenant'::text, 'owner'::text])),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  avatar_url text,
  phone text,
  is_email_verified boolean NOT NULL DEFAULT false,
  notify_email boolean NOT NULL DEFAULT true,
  notify_chat boolean NOT NULL DEFAULT true,
  notify_maintenance boolean NOT NULL DEFAULT true,
  first_name text,
  last_name text,
  email text UNIQUE,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.properties (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  landlord_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  address_line1 text,
  city text,
  country text,
  monthly_rent numeric NOT NULL DEFAULT 0,
  status USER-DEFINED NOT NULL DEFAULT 'draft'::property_status,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  image_url text,
  category text,
  tags ARRAY,
  CONSTRAINT properties_pkey PRIMARY KEY (id),
  CONSTRAINT properties_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.property_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL,
  image_url text NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT property_images_pkey PRIMARY KEY (id),
  CONSTRAINT property_images_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id)
);
CREATE TABLE public.tenant_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  landlord_id uuid NOT NULL,
  document_type_id uuid NOT NULL,
  file_name character varying NOT NULL,
  file_path character varying NOT NULL,
  file_size integer NOT NULL,
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying::text, 'approved'::character varying::text, 'rejected'::character varying::text])),
  rejection_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tenant_documents_pkey PRIMARY KEY (id),
  CONSTRAINT tenant_documents_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.profiles(id),
  CONSTRAINT tenant_documents_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.profiles(id),
  CONSTRAINT tenant_documents_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.document_types(id)
);
CREATE TABLE public.tenant_profiles (
  id uuid NOT NULL,
  bio text,
  address text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tenant_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT tenant_profiles_id_fkey FOREIGN KEY (id) REFERENCES public.profiles(id)
);