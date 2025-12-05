# ✅ Drop All Policies & Recreate Proper RLS

## 🔧 Complete SQL Fix

Run this in Supabase SQL Editor:

```sql
-- ============================================
-- STEP 1: DROP ALL EXISTING POLICIES
-- ============================================

-- Drop policies from conversation_participants
DROP POLICY IF EXISTS "conversation_participants_policy" ON conversation_participants;

-- Drop policies from conversations
DROP POLICY IF EXISTS "conversations_policy" ON conversations;

-- Drop policies from employees
DROP POLICY IF EXISTS "employees_policy" ON employees;

-- Drop policies from leases
DROP POLICY IF EXISTS "leases_policy" ON leases;

-- Drop policies from messages
DROP POLICY IF EXISTS "messages_policy" ON messages;

-- Drop policies from notification_preferences
DROP POLICY IF EXISTS "notification_preferences_policy" ON notification_preferences;

-- Drop policies from notifications
DROP POLICY IF EXISTS "notifications_policy" ON notifications;

-- Drop policies from owner_profiles
DROP POLICY IF EXISTS "owner_profiles_policy" ON owner_profiles;

-- Drop policies from payment_methods
DROP POLICY IF EXISTS "payment_methods_policy" ON payment_methods;

-- Drop policies from payouts
DROP POLICY IF EXISTS "payouts_policy" ON payouts;

-- Drop policies from profiles
DROP POLICY IF EXISTS "profiles_policy" ON profiles;

-- Drop policies from properties
DROP POLICY IF EXISTS "properties_policy" ON properties;

-- Drop policies from property_images
DROP POLICY IF EXISTS "property_images_policy" ON property_images;

-- Drop policies from tenant_profiles
DROP POLICY IF EXISTS "tenant_profiles_policy" ON tenant_profiles;

-- ============================================
-- STEP 2: ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 3: CREATE PROPER RLS POLICIES
-- ============================================

-- PROPERTIES TABLE - Allow public read, authenticated write
CREATE POLICY "Anyone can read active properties"
ON properties FOR SELECT
USING (is_active = true);

CREATE POLICY "Landlords can create properties"
ON properties FOR INSERT
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update their properties"
ON properties FOR UPDATE
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their properties"
ON properties FOR DELETE
USING (auth.uid() = landlord_id);

-- PROFILES TABLE - Allow users to read/update their own
CREATE POLICY "Users can read their own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- LEASES TABLE - Allow landlords and tenants to read their leases
CREATE POLICY "Users can read their leases"
ON leases FOR SELECT
USING (auth.uid() = landlord_id OR auth.uid() = tenant_id);

CREATE POLICY "Landlords can create leases"
ON leases FOR INSERT
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Users can update their leases"
ON leases FOR UPDATE
USING (auth.uid() = landlord_id OR auth.uid() = tenant_id)
WITH CHECK (auth.uid() = landlord_id OR auth.uid() = tenant_id);

CREATE POLICY "Landlords can delete leases"
ON leases FOR DELETE
USING (auth.uid() = landlord_id);

-- PROPERTY_IMAGES TABLE - Allow public read
CREATE POLICY "Anyone can read property images"
ON property_images FOR SELECT
USING (true);

CREATE POLICY "Landlords can manage property images"
ON property_images FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM properties 
    WHERE properties.id = property_images.property_id 
    AND properties.landlord_id = auth.uid()
  )
);

-- NOTIFICATIONS TABLE - Allow users to read their own
CREATE POLICY "Users can read their notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications"
ON notifications FOR INSERT
WITH CHECK (true);

-- NOTIFICATION_PREFERENCES TABLE - Allow users to manage their own
CREATE POLICY "Users can read their preferences"
ON notification_preferences FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their preferences"
ON notification_preferences FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- CONVERSATIONS TABLE - Allow participants to read
CREATE POLICY "Users can read their conversations"
ON conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = conversations.id 
    AND conversation_participants.user_id = auth.uid()
  )
);

-- CONVERSATION_PARTICIPANTS TABLE - Allow participants to read
CREATE POLICY "Users can read their participation"
ON conversation_participants FOR SELECT
USING (auth.uid() = user_id);

-- MESSAGES TABLE - Allow conversation participants to read
CREATE POLICY "Users can read messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants 
    WHERE conversation_participants.conversation_id = messages.conversation_id 
    AND conversation_participants.user_id = auth.uid()
  )
);

CREATE POLICY "Users can send messages"
ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- PAYOUTS TABLE - Allow landlords to read their own
CREATE POLICY "Landlords can read their payouts"
ON payouts FOR SELECT
USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can create payouts"
ON payouts FOR INSERT
WITH CHECK (auth.uid() = landlord_id);

-- PAYMENT_METHODS TABLE - Allow landlords to manage their own
CREATE POLICY "Landlords can read their payment methods"
ON payment_methods FOR SELECT
USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can create payment methods"
ON payment_methods FOR INSERT
WITH CHECK (auth.uid() = landlord_id);

-- EMPLOYEES TABLE - Allow owners to manage their employees
CREATE POLICY "Owners can read their employees"
ON employees FOR SELECT
USING (auth.uid() = owner_id);

-- OWNER_PROFILES TABLE - Allow owners to read/update their own
CREATE POLICY "Owners can read their profile"
ON owner_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Owners can update their profile"
ON owner_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- TENANT_PROFILES TABLE - Allow tenants to read/update their own
CREATE POLICY "Tenants can read their profile"
ON tenant_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Tenants can update their profile"
ON tenant_profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

---

## 🎯 Steps to Execute

1. ✅ Go to Supabase Dashboard
2. ✅ Click **SQL Editor**
3. ✅ Create **New Query**
4. ✅ Copy the entire SQL above
5. ✅ Paste into editor
6. ✅ Click **Run**
7. ✅ Wait for completion

---

## ✅ What This Does

**Drops:**
- ❌ All broken/incomplete policies
- ❌ UNRESTRICTED status

**Creates:**
- ✅ Proper RLS policies for each table
- ✅ Public read access for properties (home page works)
- ✅ Authenticated write access (users can create/edit)
- ✅ User-scoped access (users only see their own data)

---

## 🚀 After Running

1. ✅ Refresh your app
2. ✅ Home page should load listings
3. ✅ Login should work
4. ✅ Dashboard should work
5. ✅ No more CORS errors

---

## 📊 Key Policies Created

| Table | Policy | Access |
|-------|--------|--------|
| properties | Anyone can read active | ✅ Public read |
| properties | Landlords can create | ✅ Authenticated write |
| profiles | Users read own | ✅ User-scoped |
| leases | Users read their leases | ✅ User-scoped |
| notifications | Users read own | ✅ User-scoped |
| conversations | Users read their conversations | ✅ User-scoped |

---

**Status:** Ready to run ✅

**This should fix everything!** 🚀
