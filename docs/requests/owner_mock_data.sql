-- Mock data for Building Management System (BMS) - Owner Focused
-- Target: Users, Owners, Buildings, Units, Employees, LeaveTypes

-- 1. Insert Users (Landlords/Owners)
INSERT INTO "User" (username, email, password_hash, role, full_name, phone, created_at)
VALUES 
('john_owner', 'john@example.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6L6s5S6s5S6s5S6s', 'owner', 'John Doe', '+251911223344', NOW()),
('jane_owner', 'jane@example.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6L6s5S6s5S6s5S6s', 'owner', 'Jane Smith', '+251911556677', NOW());

-- 2. Insert Owners
INSERT INTO "Owner" (user_id, company_name, tax_id, address)
VALUES 
(1, 'JD Real Estate', 'TIN123456789', 'Bole, Addis Ababa'),
(2, 'JS Properties', 'TIN987654321', 'Kazanchis, Addis Ababa');

-- 3. Insert Buildings for John Doe
INSERT INTO "Building" (owner_id, name, address, city, country, total_units, year_built, amenities)
VALUES 
(1, 'Sunshine Plaza', 'Bole Road', 'Addis Ababa', 'Ethiopia', 20, 2020, '{"gym": true, "parking": true, "security": "24/7"}'),
(1, 'Moonlight Apartments', 'Old Airport', 'Addis Ababa', 'Ethiopia', 15, 2018, '{"garden": true, "elevator": true}');

-- 4. Insert Buildings for Jane Smith
INSERT INTO "Building" (owner_id, name, address, city, country, total_units, year_built, amenities)
VALUES 
(2, 'City View Tower', 'Kazanchis', 'Addis Ababa', 'Ethiopia', 30, 2022, '{"rooftop_pool": true, "fiber_internet": true}');

-- 5. Insert Units for Sunshine Plaza (Building 1)
INSERT INTO "Unit" (building_id, unit_number, floor, bedrooms, bathrooms, sqft, base_rent, status)
VALUES 
(1, '101', 1, 2, 2, 120.5, 15000, 'vacant'),
(1, '102', 1, 1, 1, 85.0, 10000, 'occupied'),
(1, '201', 2, 3, 2, 150.0, 20000, 'vacant'),
(1, '202', 2, 2, 2, 115.0, 14000, 'maintenance');

-- 6. Insert Units for City View Tower (Building 3)
INSERT INTO "Unit" (building_id, unit_number, floor, bedrooms, bathrooms, sqft, base_rent, status)
VALUES 
(3, 'A-01', 0, 0, 1, 45.5, 8000, 'vacant'),
(3, 'A-02', 0, 1, 1, 65.0, 11000, 'occupied');

-- 7. Insert Leave Types for Owners
INSERT INTO "LeaveType" (owner_id, name, max_days_per_year, is_paid)
VALUES 
(1, 'Annual Leave', 20, true),
(1, 'Sick Leave', 10, true),
(2, 'Vacation', 15, true);

-- 8. Insert Employees for John Doe (Owner 1)
-- First create Users for Employees
INSERT INTO "User" (username, email, password_hash, role, full_name, phone, created_at)
VALUES 
('emp_kevin', 'kevin@example.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6L6s5S6s5S6s5S6s', 'staff', 'Kevin Staff', '+251922334455', NOW()),
('emp_sara', 'sara@example.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6L6s5S6s5S6s5S6s', 'manager', 'Sara Manager', '+251933445566', NOW());

INSERT INTO "Employee" (user_id, owner_id, employee_code, designation, department, join_date, salary, employment_type, is_active)
VALUES 
(3, 1, 'EMP001', 'Maintenance Lead', 'Maintenance', '2023-01-15', 8000, 'full_time', true),
(4, 1, 'EMP002', 'Building Manager', 'Management', '2023-03-01', 15000, 'full_time', true);

-- 9. Insert some Leave Balances for Employees
INSERT INTO "LeaveBalance" (employee_id, leave_type_id, year, entitled_days, taken_days)
VALUES 
(1, 1, 2024, 20, 2),
(1, 2, 2024, 10, 0),
(2, 1, 2024, 20, 5);
