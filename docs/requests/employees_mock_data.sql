-- ============================================
-- EMPLOYEES TABLE MOCK DATA
-- ============================================

-- First, get the landlord ID (you'll need to replace this with actual ID)
SELECT id FROM public.profiles WHERE full_name = 'Israel Seleshi' AND role = 'owner';

-- ============================================
-- INSERT MOCK EMPLOYEES
-- ============================================
-- Replace 'LANDLORD_ID_HERE' with the actual landlord ID from above

INSERT INTO public.employees (id, owner_id, job_title, created_at, updated_at) VALUES
(gen_random_uuid(), 'LANDLORD_ID_HERE', 'Head Janitor', now(), now()),
(gen_random_uuid(), 'LANDLORD_ID_HERE', 'Security Officer', now(), now()),
(gen_random_uuid(), 'LANDLORD_ID_HERE', 'Maintenance Technician', now(), now()),
(gen_random_uuid(), 'LANDLORD_ID_HERE', 'Network Administrator', now(), now()),
(gen_random_uuid(), 'LANDLORD_ID_HERE', 'Cleaner', now(), now()),
(gen_random_uuid(), 'LANDLORD_ID_HERE', 'Security Officer', now(), now());

-- ============================================
-- VERIFY EMPLOYEES WERE INSERTED
-- ============================================

SELECT 
  e.id,
  p.full_name,
  e.job_title,
  e.created_at
FROM public.employees e
JOIN public.profiles p ON e.id = p.id
ORDER BY e.created_at DESC;

-- ============================================
-- COMPLETE EMPLOYEE DATA WITH PROFILES
-- ============================================
-- This creates employees with full profile information

-- Get landlord ID first
-- SELECT id FROM public.profiles WHERE full_name = 'Israel Seleshi';

-- Then use this template to create employees with full data:
/*
-- Employee 1: Ahmed Hassan - Head Janitor
INSERT INTO public.employees (id, owner_id, job_title, created_at, updated_at)
SELECT id, 'LANDLORD_ID', 'Head Janitor', now(), now()
FROM public.profiles
WHERE full_name = 'Ahmed Hassan' AND role = 'tenant';

-- Employee 2: Fatima Mohamed - Security Officer
INSERT INTO public.employees (id, owner_id, job_title, created_at, updated_at)
SELECT id, 'LANDLORD_ID', 'Security Officer', now(), now()
FROM public.profiles
WHERE full_name = 'Fatima Mohamed' AND role = 'tenant';

-- Employee 3: Abebe Tekle - Maintenance Technician
INSERT INTO public.employees (id, owner_id, job_title, created_at, updated_at)
SELECT id, 'LANDLORD_ID', 'Maintenance Technician', now(), now()
FROM public.profiles
WHERE full_name = 'Abebe Tekle' AND role = 'tenant';

-- Employee 4: Marta Desta - Network Administrator
INSERT INTO public.employees (id, owner_id, job_title, created_at, updated_at)
SELECT id, 'LANDLORD_ID', 'Network Administrator', now(), now()
FROM public.profiles
WHERE full_name = 'Marta Desta' AND role = 'tenant';

-- Employee 5: Yohannes Assefa - Cleaner
INSERT INTO public.employees (id, owner_id, job_title, created_at, updated_at)
SELECT id, 'LANDLORD_ID', 'Cleaner', now(), now()
FROM public.profiles
WHERE full_name = 'Yohannes Assefa' AND role = 'tenant';

-- Employee 6: Selam Girma - Security Officer
INSERT INTO public.employees (id, owner_id, job_title, created_at, updated_at)
SELECT id, 'LANDLORD_ID', 'Security Officer', now(), now()
FROM public.profiles
WHERE full_name = 'Selam Girma' AND role = 'tenant';
*/

-- ============================================
-- SAMPLE DATA WITH ACTUAL UUIDs
-- ============================================
-- Replace these UUIDs with your actual values:

/*
INSERT INTO public.employees (id, owner_id, job_title, created_at, updated_at) VALUES
('0975316d-d9d1-4827-9c0b-5c8c9abc1234', '2efc360-f9ad-47e1-9bcd-5df69d449884', 'Head Janitor', now(), now()),
('0975316d-d9d1-4827-9c0b-5c8c9abc1235', '2efc360-f9ad-47e1-9bcd-5df69d449884', 'Security Officer', now(), now()),
('0975316d-d9d1-4827-9c0b-5c8c9abc1236', '2efc360-f9ad-47e1-9bcd-5df69d449884', 'Maintenance Technician', now(), now()),
('0975316d-d9d1-4827-9c0b-5c8c9abc1237', '2efc360-f9ad-47e1-9bcd-5df69d449884', 'Network Administrator', now(), now()),
('0975316d-d9d1-4827-9c0b-5c8c9abc1238', '2efc360-f9ad-47e1-9bcd-5df69d449884', 'Cleaner', now(), now()),
('0975316d-d9d1-4827-9c0b-5c8c9abc1239', '2efc360-f9ad-47e1-9bcd-5df69d449884', 'Security Officer', now(), now());
*/
