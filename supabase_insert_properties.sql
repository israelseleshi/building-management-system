-- PostgreSQL INSERT statements for BMS properties table
-- This script inserts all 11 units from the buildings.ts file into the properties table

-- Landlord UUID: 2a4ec860-f9ad-47e1-9bcd-5df69d449884
-- Owner: Property Manager Account

-- Insert Unit 001
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Nano Computing ICT Solutions',
  'Office space in Bole. 12-floor building. Type: Office. Year Built: 2018. Manager: Abebe Kebede. Monthly Revenue: 15000. Tenant Count: 1. Avg Rent Per Unit: 15000.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  15000,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- Insert Unit 002
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Jewelry Boutique',
  'Retail space in Bole. 12-floor building. Type: Retail. Year Built: 2018. Manager: Abebe Kebede. Monthly Revenue: 16000. Tenant Count: 1. Avg Rent Per Unit: 16000.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  16000,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- Insert Unit 003
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Fashion Boutique',
  'Retail space in Bole. 12-floor building. Type: Retail. Year Built: 2018. Manager: Abebe Kebede. Monthly Revenue: 15500. Tenant Count: 1. Avg Rent Per Unit: 15500.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  15500,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- Insert Unit 201
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Tech Hub Addis',
  'Office space in Bole. 12-floor building. Type: Office. Year Built: 2018. Manager: Abebe Kebede. Monthly Revenue: 17000. Tenant Count: 1. Avg Rent Per Unit: 17000.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  17000,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- Insert Unit 202 (Vacant)
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Vacant Office',
  'Vacant office space in Bole. 12-floor building. Type: Office. Year Built: 2018. Manager: Abebe Kebede. Available for rent. Avg Rent Per Unit: 18000.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  18000,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- Insert Unit 203
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Coffee Shop Express',
  'Retail space in Bole. 12-floor building. Type: Retail. Year Built: 2018. Manager: Abebe Kebede. Monthly Revenue: 16500. Tenant Count: 1. Avg Rent Per Unit: 16500.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  16500,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- Insert Unit 301
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Digital Marketing Agency',
  'Office space in Bole. 12-floor building. Type: Office. Year Built: 2018. Manager: Abebe Kebede. Monthly Revenue: 17500. Tenant Count: 1. Avg Rent Per Unit: 17500.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  17500,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- Insert Unit 302
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Beauty Salon',
  'Retail space in Bole. 12-floor building. Type: Retail. Year Built: 2018. Manager: Abebe Kebede. Monthly Revenue: 16000. Tenant Count: 1. Avg Rent Per Unit: 16000.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  16000,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- Insert Unit 303
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Consulting Firm',
  'Office space in Bole. 12-floor building. Type: Office. Year Built: 2018. Manager: Abebe Kebede. Monthly Revenue: 15000. Tenant Count: 1. Avg Rent Per Unit: 15000.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  15000,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- Insert Unit 401
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Restaurant & Bar',
  'Retail space in Bole. 12-floor building. Type: Retail. Year Built: 2018. Manager: Abebe Kebede. Monthly Revenue: 18000. Tenant Count: 1. Avg Rent Per Unit: 18000.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  18000,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- Insert Unit 402 (Vacant)
INSERT INTO public.properties (
  landlord_id,
  title,
  description,
  address_line1,
  city,
  country,
  monthly_rent,
  status,
  is_active,
  created_at,
  updated_at
) VALUES (
  '2a4ec860-f9ad-47e1-9bcd-5df69d449884'::uuid,
  'Vacant Office',
  'Vacant office space in Bole. 12-floor building. Type: Office. Year Built: 2018. Manager: Abebe Kebede. Available for rent. Avg Rent Per Unit: 17000.',
  'Bole',
  'Addis Ababa',
  'Ethiopia',
  17000,
  'listed'::property_status,
  true,
  now(),
  now()
);

-- ============================================================================
-- INSTRUCTIONS FOR EXECUTION:
-- ============================================================================
-- 1. ✅ Landlord UUID already set: 2a4ec860-f9ad-47e1-9bcd-5df69d449884
--
-- 2. Copy the entire script into Supabase SQL Editor and execute
--
-- 3. Verify the data was inserted:
--    SELECT * FROM public.properties WHERE landlord_id = '2a4ec860-f9ad-47e1-9bcd-5df69d449884';
--
-- ============================================================================
-- SUMMARY OF INSERTED DATA:
-- ============================================================================
-- Total Properties: 11
-- Office Units: 6 (UNIT001, UNIT201, UNIT303, UNIT202, UNIT402, UNIT301)
-- Retail Units: 5 (UNIT002, UNIT003, UNIT203, UNIT302, UNIT401)
-- Occupied Units: 9
-- Vacant Units: 2 (UNIT202, UNIT402)
-- Total Monthly Revenue: 165,500 ETB
-- Location: Bole, Addis Ababa, Ethiopia
-- ============================================================================
