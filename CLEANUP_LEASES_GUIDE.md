# Cleanup & Leases Setup Guide

## Overview
This guide will help you:
1. Delete all tenant profiles except Israel Theodros and Abel Theodor
2. Create leases linking these two tenants to the owner

---

## Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

---

### Step 2: Get the Required IDs

Run these queries **one at a time** to find the IDs you need:

#### Query 1: Find Israel Theodros and Abel Theodor IDs
```sql
SELECT id, full_name, role FROM public.profiles 
WHERE full_name IN ('Israel Theodros', 'Abel Theodor')
ORDER BY full_name;
```

**Copy the results:**
- Israel Theodros ID: `_________________`
- Abel Theodor ID: `_________________`

#### Query 2: Find the Owner ID (Israel Seleshi)
```sql
SELECT id, full_name, role FROM public.profiles 
WHERE full_name = 'Israel Seleshi' AND role = 'owner';
```

**Copy the result:**
- Israel Seleshi ID: `_________________`

#### Query 3: Find a Property ID
```sql
SELECT id, title, landlord_id FROM public.properties LIMIT 1;
```

**Copy the result:**
- Property ID: `_________________`

---

### Step 3: Delete All Other Tenants

Run this query to delete all tenant profiles except Israel Theodros and Abel Theodor:

```sql
DELETE FROM public.profiles 
WHERE role = 'tenant' 
AND full_name NOT IN ('Israel Theodros', 'Abel Theodor');
```

**Verify it worked:**
```sql
SELECT id, full_name, role FROM public.profiles WHERE role = 'tenant';
```

You should see only 2 rows: Israel Theodros and Abel Theodor

---

### Step 4: Create Leases

Now create leases linking both tenants to the owner.

**Replace the placeholders with the IDs you copied above:**

```sql
-- Lease 1: Israel Theodros
INSERT INTO public.leases (
  property_id,
  landlord_id,
  tenant_id,
  monthly_rent,
  status,
  start_date,
  end_date,
  is_active
) VALUES (
  'PROPERTY_ID_HERE',           -- Replace with property ID from Step 2, Query 3
  'ISRAEL_SELESHI_ID_HERE',     -- Replace with owner ID from Step 2, Query 2
  'ISRAEL_THEODROS_ID_HERE',    -- Replace with Israel Theodros ID from Step 2, Query 1
  5000,
  'active',
  '2025-01-01',
  '2026-01-01',
  true
);

-- Lease 2: Abel Theodor
INSERT INTO public.leases (
  property_id,
  landlord_id,
  tenant_id,
  monthly_rent,
  status,
  start_date,
  end_date,
  is_active
) VALUES (
  'PROPERTY_ID_HERE',           -- Replace with property ID from Step 2, Query 3
  'ISRAEL_SELESHI_ID_HERE',     -- Replace with owner ID from Step 2, Query 2
  'ABEL_THEODOR_ID_HERE',       -- Replace with Abel Theodor ID from Step 2, Query 1
  5000,
  'active',
  '2025-01-01',
  '2026-01-01',
  true
);
```

---

### Step 5: Verify Everything

Run this query to verify the leases were created:

```sql
SELECT 
  l.id,
  l.property_id,
  p1.full_name as landlord_name,
  p2.full_name as tenant_name,
  l.monthly_rent,
  l.status
FROM public.leases l
JOIN public.profiles p1 ON l.landlord_id = p1.id
JOIN public.profiles p2 ON l.tenant_id = p2.id
ORDER BY l.created_at DESC;
```

You should see 2 rows:
- Lease 1: Israel Seleshi → Israel Theodros
- Lease 2: Israel Seleshi → Abel Theodor

---

## Complete Example

Here's what it looks like with actual UUIDs (example values):

```sql
-- Step 1: Delete other tenants
DELETE FROM public.profiles 
WHERE role = 'tenant' 
AND full_name NOT IN ('Israel Theodros', 'Abel Theodor');

-- Step 2: Create Lease 1
INSERT INTO public.leases (
  property_id,
  landlord_id,
  tenant_id,
  monthly_rent,
  status,
  start_date,
  end_date,
  is_active
) VALUES (
  '550c8d0f-3f8a-4e9b-a3e9-1234567890ab',  -- Property ID
  '2efc360-f9ad-47e1-9bcd-5df69d449884',    -- Israel Seleshi (owner)
  '0975316d-d9d1-4827-9c0b-5c8c9abc1234',   -- Israel Theodros (tenant)
  5000,
  'active',
  '2025-01-01',
  '2026-01-01',
  true
);

-- Step 3: Create Lease 2
INSERT INTO public.leases (
  property_id,
  landlord_id,
  tenant_id,
  monthly_rent,
  status,
  start_date,
  end_date,
  is_active
) VALUES (
  '550c8d0f-3f8a-4e9b-a3e9-1234567890ab',  -- Property ID
  '2efc360-f9ad-47e1-9bcd-5df69d449884',    -- Israel Seleshi (owner)
  '2efc360-f9ad-47e1-9bcd-5df69d449885',    -- Abel Theodor (tenant)
  5000,
  'active',
  '2025-01-01',
  '2026-01-01',
  true
);
```

---

## What Happens Next

After creating the leases:

1. **Chat will work** - The two tenants will appear in the owner's chat
2. **Conversations will be created** - When you send a message, a conversation is automatically created
3. **Messages will persist** - All messages are stored in the database
4. **Real-time updates** - Messages appear instantly via Supabase subscriptions

---

## Testing Chat After Setup

### As Owner (Israel Seleshi):
1. Sign in
2. Go to Dashboard → Chat
3. You should see:
   - Israel Theodros
   - Abel Theodor
4. Click on either to start chatting

### As Tenant (Israel Theodros or Abel Theodor):
1. Sign in
2. Go to Tenant Dashboard → Chat
3. You should see Israel Seleshi (the owner)
4. Click to start chatting

---

## Troubleshooting

### Leases not created?
- Check that you replaced all placeholders with actual UUIDs
- Verify the IDs exist in the profiles table
- Check for error messages in Supabase

### Chat still shows no tenants?
- Refresh the browser
- Check that leases were created (run verify query)
- Check browser console for errors (F12)

### Can't find the IDs?
- Run the SELECT queries from Step 2
- Make sure you're looking at the correct results
- Copy the exact UUID (including hyphens)

---

## SQL File Reference

All the SQL code is also available in:
```
cleanup_and_leases.sql
```

You can copy and paste from there instead of typing manually.

---

## Important Notes

⚠️ **Warning:** The DELETE query will permanently remove all tenant profiles except Israel Theodros and Abel Theodor. Make sure this is what you want before running it.

✅ **Backup:** Consider backing up your database before running these queries.

✅ **Verification:** Always run the verification queries to confirm changes were applied correctly.

---

**Status:** Ready to execute

**Last Updated:** December 5, 2025
