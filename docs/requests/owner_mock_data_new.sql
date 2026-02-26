-- BMS Project - Mock Data SQL (Owner/Building/Unit)
 --
 -- IMPORTANT:
 -- - This script REUSES existing records.
 -- - It DOES NOT insert Users or Owners.
 -- - It inserts additional Buildings and Units linked properly via:
 --   Building.owner_id -> Owner.owner_id
 --   Unit.building_id  -> Building.building_id
 --
 -- Existing data you already have (from your DB dump):
 -- - Owner: owner_id=1 (user_id=5), owner_id=2 (user_id=4)
 -- - Building: building_id=2 belongs to owner_id=1
 
 BEGIN;
 
 -- 1) Add extra buildings for existing owners (idempotent by name + owner_id)
 INSERT INTO "Building" (owner_id, name, address, city, country, total_units, year_built, amenities)
 SELECT 1,
        'Bole Atlas Heights',
        'Bole Atlas, Behind Edna Mall',
        'Addis Ababa',
        'Ethiopia',
        25,
        2023,
        '["gym", "underground parking", "24/7 security"]'::jsonb
 WHERE EXISTS (SELECT 1 FROM "Owner" o WHERE o.owner_id = 1)
   AND NOT EXISTS (
     SELECT 1 FROM "Building" b
     WHERE b.owner_id = 1 AND b.name = 'Bole Atlas Heights'
   );
 
 INSERT INTO "Building" (owner_id, name, address, city, country, total_units, year_built, amenities)
 SELECT 2,
        'Ephrem Executive Suites',
        'Old Airport area',
        'Addis Ababa',
        'Ethiopia',
        12,
        2024,
        '["garden", "backup generator", "water tank"]'::jsonb
 WHERE EXISTS (SELECT 1 FROM "Owner" o WHERE o.owner_id = 2)
   AND NOT EXISTS (
     SELECT 1 FROM "Building" b
     WHERE b.owner_id = 2 AND b.name = 'Ephrem Executive Suites'
   );
 
 -- 2) Units for the EXISTING building_id=2 (Kazanchis Skyline Residences)
 -- (Your DB already has Unit A-101; we add more units safely.)
 INSERT INTO "Unit" (building_id, unit_number, floor, bedrooms, bathrooms, sqft, base_rent, status)
 VALUES
   (2, 'A-102', 1, 1, 1, 600.00, 12000.00, 'occupied'),
   (2, 'B-201', 2, 3, 2, 1200.00, 25000.00, 'vacant'),
   (2, 'B-202', 2, 2, 2, 950.00, 20000.00, 'maintenance')
 ON CONFLICT (building_id, unit_number) DO NOTHING;
 
 -- 3) Units for NEW/ADDED buildings (resolve building_id by name)
 INSERT INTO "Unit" (building_id, unit_number, floor, bedrooms, bathrooms, sqft, base_rent, status)
 SELECT b.building_id, '101', 1, 2, 2, 950.00, 20000.00, 'vacant'
 FROM "Building" b
 WHERE b.owner_id = 1 AND b.name = 'Bole Atlas Heights'
 ON CONFLICT (building_id, unit_number) DO NOTHING;
 
 INSERT INTO "Unit" (building_id, unit_number, floor, bedrooms, bathrooms, sqft, base_rent, status)
 SELECT b.building_id, '102', 1, 2, 2, 950.00, 20000.00, 'maintenance'
 FROM "Building" b
 WHERE b.owner_id = 1 AND b.name = 'Bole Atlas Heights'
 ON CONFLICT (building_id, unit_number) DO NOTHING;
 
 INSERT INTO "Unit" (building_id, unit_number, floor, bedrooms, bathrooms, sqft, base_rent, status)
 SELECT b.building_id, 'S-1', 1, 1, 1, 500.00, 15000.00, 'vacant'
 FROM "Building" b
 WHERE b.owner_id = 2 AND b.name = 'Ephrem Executive Suites'
 ON CONFLICT (building_id, unit_number) DO NOTHING;
 
 COMMIT;

-- ============================================================================
-- TENANTS AND LEASES MOCK DATA
-- ============================================================================
-- This creates tenant profiles and leases using EXISTING users from your DB
-- Existing tenant users: user_id=1 (Mickey), user_id=2 (Sayzana), user_id=3 (Dagmawi), user_id=6 (Israel)
-- Existing owner users: user_id=4 (Admin - owner_id=2), user_id=5 (Abebe - owner_id=1)
-- Existing building: building_id=2 (Kazanchis Skyline Residences, owner_id=1)
-- Existing unit: unit_id=1 (A-101)

BEGIN;

-- Create tenant profiles for EXISTING tenant users (idempotent by user_id)
INSERT INTO "Tenant" (user_id, national_id, tin_number, credit_score, notes)
SELECT u.user_id, 'NID-' || u.user_id, 'TIN' || u.user_id, NULL, 'Auto-created for chat testing'
FROM "User" u
WHERE u.role = 'tenant' 
  AND u.user_id IN (1, 2, 3, 6)
  AND NOT EXISTS (SELECT 1 FROM "Tenant" t WHERE t.user_id = u.user_id);

-- Create leases linking EXISTING tenants to units
-- Using EXACT IDs from your database

-- Lease for Mickey Ephrem (tenant_id=1, user_id=1) in unit_id=1 (A-101, building_id=2)
INSERT INTO "Lease" (unit_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status)
SELECT 
  1,
  1,
  '2024-01-01'::date,
  '2025-01-01'::date,
  12000.00,
  24000.00,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM "Lease" l 
  WHERE l.unit_id = 1 AND l.tenant_id = 1
);

-- Lease for Sayzana Ephrem (tenant_id=2, user_id=2) in unit_id=3 (B-201, building_id=2)
INSERT INTO "Lease" (unit_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status)
SELECT 
  3,
  2,
  '2024-02-01'::date,
  '2025-02-01'::date,
  25000.00,
  50000.00,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM "Lease" l 
  WHERE l.unit_id = 3 AND l.tenant_id = 2
);

-- Lease for Dagmawi Kebede (tenant_id=3, user_id=3) in unit_id=4 (B-202, building_id=2)
INSERT INTO "Lease" (unit_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status)
SELECT 
  4,
  3,
  '2024-03-01'::date,
  '2025-03-01'::date,
  20000.00,
  40000.00,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM "Lease" l 
  WHERE l.unit_id = 4 AND l.tenant_id = 3
);

-- Lease for Israel Seleshi (tenant_id=4, user_id=6) in unit_id=5 (101, building_id=4 - Bole Atlas Heights)
INSERT INTO "Lease" (unit_id, tenant_id, start_date, end_date, monthly_rent, security_deposit, status)
SELECT 
  5,
  4,
  '2024-01-15'::date,
  '2025-01-15'::date,
  20000.00,
  40000.00,
  'active'
WHERE NOT EXISTS (
  SELECT 1 FROM "Lease" l 
  WHERE l.unit_id = 5 AND l.tenant_id = 4
);

COMMIT;

-- ============================================================================
-- NOTES FOR CHAT TESTING:
-- ============================================================================
-- After running this script:
-- - Owner 1 (owner_id=1, user_id=5 - Abebe Kebede) can chat with tenants in:
--   * Building 2 (Kazanchis): Mickey (user_id=1), Sayzana (user_id=2), Dagmawi (user_id=3)
--   * Bole Atlas Heights: Israel (user_id=6)
-- - Owner 2 (owner_id=2, user_id=4 - Admin Ephrem) has no tenants yet (no leases created)
-- - Tenants can chat with their owner AND other tenants in same building
-- - For example: Mickey, Sayzana, Dagmawi (all in building 2) can chat with each other
