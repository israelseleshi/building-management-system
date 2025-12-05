-- ============================================
-- CLEANUP: Delete all tenants except Israel Theodros and Abel Theodor
-- ============================================

-- Step 1: Get the IDs of Israel Theodros and Abel Theodor
-- Run this first to see the IDs
SELECT id, full_name, role FROM public.profiles 
WHERE full_name IN ('Israel Theodros', 'Abel Theodor')
ORDER BY full_name;

-- Step 2: Delete all tenant profiles EXCEPT Israel Theodros and Abel Theodor
-- WARNING: This will delete all other tenant profiles and their auth records

DELETE FROM public.profiles 
WHERE role = 'tenant' 
AND full_name NOT IN ('Israel Theodros', 'Abel Theodor');

-- Verify deletion
SELECT id, full_name, role FROM public.profiles WHERE role = 'tenant';

-- ============================================
-- CREATE LEASES: Link tenants to owner
-- ============================================

-- First, identify the IDs (you'll need to update these with actual UUIDs)
-- Get owner ID (Israel Seleshi - the owner)
SELECT id, full_name, role FROM public.profiles 
WHERE full_name = 'Israel Seleshi' AND role = 'owner';

-- Get tenant IDs
SELECT id, full_name, role FROM public.profiles 
WHERE full_name IN ('Israel Theodros', 'Abel Theodor') AND role = 'tenant';

-- Get a property ID to link to
SELECT id, title, landlord_id FROM public.properties LIMIT 1;

-- ============================================
-- INSERT LEASES (Update UUIDs with actual values from above)
-- ============================================

-- Lease 1: Israel Theodros
INSERT INTO public.leases (
  id,
  property_id,
  landlord_id,
  tenant_id,
  monthly_rent,
  status,
  start_date,
  end_date,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'PROPERTY_ID_HERE',           -- Replace with actual property ID
  'ISRAEL_SELESHI_ID_HERE',     -- Replace with Israel Seleshi's profile ID
  'ISRAEL_THEODROS_ID_HERE',    -- Replace with Israel Theodros's profile ID
  5000,
  'active',
  '2025-01-01',
  '2026-01-01',
  true,
  now(),
  now()
);

-- Lease 2: Abel Theodor
INSERT INTO public.leases (
  id,
  property_id,
  landlord_id,
  tenant_id,
  monthly_rent,
  status,
  start_date,
  end_date,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'PROPERTY_ID_HERE',           -- Replace with actual property ID
  'ISRAEL_SELESHI_ID_HERE',     -- Replace with Israel Seleshi's profile ID
  'ABEL_THEODOR_ID_HERE',       -- Replace with Abel Theodor's profile ID
  5000,
  'active',
  '2025-01-01',
  '2026-01-01',
  true,
  now(),
  now()
);

-- Verify leases were created
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

-- ============================================
-- ALTERNATIVE: Complete SQL with actual IDs
-- ============================================
-- After you run the SELECT queries above and get the actual UUIDs,
-- use this template to insert the leases with real IDs:

/*
-- Example (replace with your actual IDs):
INSERT INTO public.leases (property_id, landlord_id, tenant_id, monthly_rent, status, start_date, end_date, is_active)
VALUES 
  ('550c8d0f-3f8a-4e9b-a3e9-1234567890ab', '2efc360-f9ad-47e1-9bcd-5df69d449884', 'israel-theodros-id', 5000, 'active', '2025-01-01', '2026-01-01', true),
  ('550c8d0f-3f8a-4e9b-a3e9-1234567890ab', '2efc360-f9ad-47e1-9bcd-5df69d449884', 'abel-theodor-id', 5000, 'active', '2025-01-01', '2026-01-01', true);
*/
