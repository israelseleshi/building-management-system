# API Specification

Base URL: `/` (e.g., `https://bmsbackend-dbdm.onrender.com/`)

## Authentication (`/auth`)

### Send OTP for Registration
- **URL:** `/auth/register/send-otp`
- **Method:** `POST`
- **Description:** Sends an OTP to the provided email for registration.
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  - `200 OK`: ` { "success": true, "message": "OTP sent successfully to your email", "hint": "Valid for 10 minutes" }`
  - `400 Bad Request`: `{ "error": "User already exists with this email" }`

### Complete Registration
- **URL:** `/auth/register/complete`
- **Method:** `POST`
- **Description:** Completes registration after verifying OTP.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "username": "user123",
    "role": "owner", // or 'super_admin', 'manager', 'tenant', 'staff', 'vendor'
    "full_name": "Full Name",
    "phone": "+1234567890", // optional
    "profile_picture": "http://..." // optional
  }
  ```
- **Response:**
  - `201 Created`:
    ```json
    {
      "success": true,
      "message": "Registration completed successfully",
      "data": {
        "user": { ... },
        "token": "jwt_token"
      }
    }
    ```

### Verify OTP
- **URL:** `/auth/verify-otp`
- **Method:** `POST`
- **Description:** Verifies the OTP sent to email.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "otp": "123456",
    "type": "registration" // or "password_reset"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "OTP verified successfully", "nextStep": "..." }`

### Resend OTP
- **URL:** `/auth/resend-otp`
- **Method:** `POST`
- **Description:** Resends the OTP.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "type": "registration" // or "password_reset"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "New OTP sent successfully" }`

### Login
- **URL:** `/auth/login`
- **Method:** `POST`
- **Description:** Authenticates a user.
- **Request Body:**
  ```json
  {
    "identifier": "user@example.com", // or username
    "password": "password123"
  }
  ```
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "data": {
        "user": { ... },
        "token": "jwt_token"
      }
    }
    ```

### Forgot Password
- **URL:** `/auth/forgot-password`
- **Method:** `POST`
- **Description:** Initiates password reset process.
- **Request Body:**
  ```json
  {
    "email": "user@example.com"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "..." }`

### Complete Password Reset
- **URL:** `/auth/reset-password/complete`
- **Method:** `POST`
- **Description:** Resets password after OTP verification.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "newPassword": "newPassword123"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Password reset successfully..." }`

### Logout
- **URL:** `/auth/logout`
- **Method:** `POST`
- **Description:** Logs out the user (clears cookie).
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Logged out successfully" }`

---

## User (`/user`)

### Get Current User Profile
- **URL:** `/user/me`
- **Method:** `GET`
- **Description:** data of the currently logged-in user.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "user": { ... } } }`

### Update Current User Profile
- **URL:** `/user/me`
- **Method:** `PUT`
- **Description:** Updates the profile of the logged-in user.
- **Request Body:**
  ```json
  {
    "full_name": "New Name", // optional
    "phone": "+9876543210", // optional
    "profile_picture": "http://..." // optional
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Profile updated successfully", "data": { "user": { ... } } }`

### Change Password
- **URL:** `/user/me/password`
- **Method:** `PUT`
- **Description:** Changes the password for the logged-in user.
- **Request Body:**
  ```json
  {
    "currentPassword": "oldPassword",
    "newPassword": "newPassword"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Password changed successfully" }`

### Get User by ID
- **URL:** `/user/:user_id`
- **Method:** `GET`
- **Description:** Gets user details by ID (Admin/Owner/Manager only).
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "user": { ... } } }`

---

## Owner (`/owner`)

### Create Owner (Admin Only)
- **URL:** `/owner`
- **Method:** `POST`
- **Description:** Creates a new owner account.
- **Request Body:**
  ```json
  {
    "username": "owner1",
    "email": "owner@example.com",
    "password": "password",
    "full_name": "Owner Name",
    "phone": "123",
    "company_name": "Company",
    "tax_id": "TAX123", // optional
    "address": "Address" // optional
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "data": { "user": ..., "owner": ... } }`

### Get Own Owner Profile
- **URL:** `/owner/me`
- **Method:** `GET`
- **Description:** Gets the owner profile of the current user.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "owner": { ... } } }`

### Update Own Owner Profile
- **URL:** `/owner/me`
- **Method:** `PUT`
- **Description:** Updates the owner profile.
- **Request Body:**
  ```json
  {
    "company_name": "New Company", // optional
    "tax_id": "NEWTAX", // optional
    "address": "New Address", // optional
    "full_name": "New Name", // optional
    "phone": "New Phone" // optional
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "owner": ..., "user": ... } }`

---

## Building (`/buildings`)

### Create Building
- **URL:** `/buildings`
- **Method:** `POST`
- **Description:** Creates a new building.
- **Request Body:**
  ```json
  {
    "name": "Building A",
    "address": "123 Main St",
    "total_floors": 5, // optional
    "description": "..." // optional,
    "image_url": "http://..." // optional
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "message": "Building created successfully", "data": { "building": { ... } } }`

### List Buildings
- **URL:** `/buildings`
- **Method:** `GET`
- **Description:** Lists buildings owned by the current user (Owner).
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "buildings": [ ... ] } }`

### Get Building Details
- **URL:** `/buildings/:building_id`
- **Method:** `GET`
- **Description:** Gets details of a specific building.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "building": { ... } } }`

### Update Building
- **URL:** `/buildings/:building_id`
- **Method:** `PUT`
- **Description:** Updates building details.
- **Request Body:**
  ```json
  {
    "name": "New Name",
    "address": "New Address"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Building updated successfully", "data": { "building": { ... } } }`

### Delete Building
- **URL:** `/buildings/:building_id`
- **Method:** `DELETE`
- **Description:** Deletes a building (only if no units exist).
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Building deleted successfully" }`

---

## Unit (`/units` or `/buildings/:building_id/units`)

### Add Unit
- **URL:** `/buildings/:building_id/units`
- **Method:** `POST`
- **Description:** Adds a new unit to a building.
- **Request Body:**
  ```json
  {
    "unit_number": "101",
    "floor_number": 1, // optional
    "bedrooms": 2, // optional
    "bathrooms": 1, // optional
    "size_sqm": 75.5, // optional
    "rent_amount": 1500.00,
    "status": "vacant" // optional
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "message": "Unit added successfully", "data": { "unit": { ... } } }`

### List Units in Building
- **URL:** `/buildings/:building_id/units`
- **Method:** `GET`
- **Description:** Lists all units in a specific building.
- **Query Params:**
  - `status`: Filter by status (e.g., `vacant`, `occupied`)
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "units": [ ... ] } }`

### Get Unit Details
- **URL:** `/units/:unit_id`
- **Method:** `GET`
- **Description:** Gets details of a specific unit.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "unit": { ... } } }`

### Update Unit
- **URL:** `/units/:unit_id`
- **Method:** `PUT`
- **Description:** Updates unit details.
- **Request Body:**
  ```json
  {
    "rent_amount": 1600.00,
    "status": "maintenance"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Unit updated successfully", "data": { "unit": { ... } } }`

### Delete Unit
- **URL:** `/units/:unit_id`
- **Method:** `DELETE`
- **Description:** Deletes a unit (only if no active lease).
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Unit deleted successfully" }`

---

## Tenant (`/tenants`)

### Search Tenants
- **URL:** `/tenants/search`
- **Method:** `GET`
- **Description:** Searches for tenants by name, email, or phone.
- **Query Params:**
  - `q`: Search query
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "tenants": [ ... ] } }`

### Get Tenant Profile
- **URL:** `/tenants/:tenant_id`
- **Method:** `GET`
- **Description:** Gets the profile of a specific tenant.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "tenant": { ... } } }`

### Update Tenant Profile
- **URL:** `/tenants/me` (or specific ID/route depending on implementation, mostly `/tenants/me` for self)
- **Method:** `PUT`
- **Description:** Update tenant's own profile.
- **Request Body:**
  ```json
  {
     "emergency_contact_name": "...",
     "emergency_contact_phone": "..."
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Tenant profile updated" }`

### Get Tenant History
- **URL:** `/tenants/:tenant_id/history`
- **Method:** `GET`
- **Description:** Gets lease and payment history.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "history": [ ... ] } }`

### Toggle Blacklist Status
- **URL:** `/tenants/:tenant_id/blacklist`
- **Method:** `PUT`
- **Description:** Blacklists or un-blacklists a tenant.
- **Request Body:**
  ```json
  {
    "is_blacklisted": true,
    "reason": "Repeated late payments"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Tenant blacklist status updated" }`

---

## Lease (`/leases`)

### Create Lease
- **URL:** `/leases`
- **Method:** `POST`
- **Description:** Creates a new lease for a tenant in a unit.
- **Request Body:**
  ```json
  {
    "unit_id": 1,
    "tenant_id": 1,
    "start_date": "2023-01-01",
    "end_date": "2024-01-01",
    "rent_amount": 1500,
    "security_deposit": 1500,
    "payment_frequency": "monthly" // optional
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "message": "Lease created successfully", "data": { "lease": { ... } } }`

### List Leases
- **URL:** `/leases`
- **Method:** `GET`
- **Description:** Lists leases (with optional filters).
- **Query Params:**
  - `status`: `active`, `terminated`, `expired`
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "leases": [ ... ] } }`

### Get Lease Details
- **URL:** `/leases/:lease_id`
- **Method:** `GET`
- **Description:** Gets details of a specific lease.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "lease": { ... } } }`

### Update Lease Terms
- **URL:** `/leases/:lease_id`
- **Method:** `PUT`
- **Description:** Updates lease terms (e.g., rent amount, end date).
- **Request Body:**
  ```json
  {
    "rent_amount": 1600,
    "end_date": "2025-01-01"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Lease updated successfully", "data": { "lease": { ... } } }`

### Terminate Lease
- **URL:** `/leases/:lease_id/terminate`
- **Method:** `POST`
- **Description:** Terminates a lease early.
- **Request Body:**
  ```json
  {
    "termination_date": "2023-06-01",
    "reason": "Moved out"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Lease terminated successfully" }`

---

## Billing (`/bills`)

### Get Lease Invoices
- **URL:** `/bills/lease/:lease_id`
- **Method:** `GET`
- **Description:** Lists all invoices for a specific lease.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "invoices": [ ... ] } }`

### Get Invoice Details
- **URL:** `/bills/:invoice_id`
- **Method:** `GET`
- **Description:** Gets details of a specific invoice.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "invoice": { ... } } }`

### Generate Invoice
- **URL:** `/bills`
- **Method:** `POST`
- **Description:** Manually generates an invoice (or batch generation).
- **Request Body:**
  ```json
  {
    "lease_id": 1,
    "amount": 1500,
    "due_date": "2023-02-01",
    "type": "rent", // or 'utility', 'maintenance'
    "description": "February Rent"
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "message": "Invoice generated", "data": { "invoice": { ... } } }`

### Record Payment
- **URL:** `/bills/:invoice_id/pay`
- **Method:** `POST`
- **Description:** Records a payment for an invoice.
- **Request Body:**
  ```json
  {
    "amount_paid": 1500,
    "payment_method": "bank_transfer", // 'cash', 'card', 'check'
    "transaction_reference": "REF123", // optional
    "paid_at": "2023-02-01" // optional
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Payment recorded", "data": { "invoice": { ... } } }`

---

## Utility (`/utilities`)

### Add Utility Meter
- **URL:** `/utilities`
- **Method:** `POST`
- **Description:** Adds a utility meter to a unit.
- **Request Body:**
  ```json
  {
    "unit_id": 1,
    "utility_type": "electricity", // 'water', 'gas'
    "meter_number": "METER001",
    "provider": "City Power" // optional
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "message": "Meter added", "data": { "meter": { ... } } }`

### List Unit Meters
- **URL:** `/utilities/unit/:unit_id`
- **Method:** `GET`
- **Description:** Lists all utility meters for a unit.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "meters": [ ... ] } }`

### Record Meter Reading
- **URL:** `/utilities/reading`
- **Method:** `POST`
- **Description:** Records a new meter reading.
- **Request Body:**
  ```json
  {
    "meter_id": 1,
    "reading_value": 150.5,
    "reading_date": "2023-02-01",
    "image_url": "http://..." // optional
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "message": "Reading recorded", "data": { "reading": { ... } } }`

### Get Meter Reading History
- **URL:** `/utilities/meter/:meter_id/readings`
- **Method:** `GET`
- **Description:** Gets history of readings for a meter.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "readings": [ ... ] } }`

### Get Unit Utility Summary
- **URL:** `/utilities/unit/:unit_id/summary`
- **Method:** `GET`
- **Description:** Gets usage summary for a unit.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "summary": { ... } } }`

---

## Maintenance (`/maintenance`)

### Submit Maintenance Request
- **URL:** `/maintenance`
- **Method:** `POST`
- **Description:** Submits a new maintenance request (Tenant/Owner).
- **Request Body:**
  ```json
  {
    "unit_id": 1, // optional if tenant knows unit
    "title": "Leaking Faucet",
    "description": "The faucet in the kitchen is leaking.",
    "priority": "medium", // 'low', 'medium', 'high', 'emergency'
    "image_urls": ["http://..."] // optional
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "message": "Request submitted", "data": { "request": { ... } } }`

### List Maintenance Requests
- **URL:** `/maintenance`
- **Method:** `GET`
- **Description:** Lists maintenance requests (with filters).
- **Query Params:**
  - `status`: `pending`, `in_progress`, `completed`, `cancelled`
  - `priority`: `high`, etc.
  - `building_id`: Filter by building
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "requests": [ ... ] } }`

### Get Request Details
- **URL:** `/maintenance/:request_id`
- **Method:** `GET`
- **Description:** Gets details of a specific request.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "request": { ... } } }`

### Update Request Status
- **URL:** `/maintenance/:request_id/status`
- **Method:** `PUT`
- **Description:** Updates the status of a request (Manager/Owner/Staff).
- **Request Body:**
  ```json
  {
    "status": "in_progress",
    "notes": "Technician assigned" // optional
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Status updated", "data": { "request": { ... } } }`

### Assign Request
- **URL:** `/maintenance/:request_id/assign`
- **Method:** `PUT`
- **Description:** Assigns the request to a staff member or vendor.
- **Request Body:**
  ```json
  {
    "assigned_to": 123 // User ID of staff/vendor
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Request assigned", "data": { "request": { ... } } }`

## Employee (`/employees`)

### Hire Employee
- **URL:** `/employees`
- **Method:** `POST`
- **Description:** Hires a new employee (creates User + Employee logic).
- **Request Body:**
  ```json
  {
    "username": "staff1",
    "email": "staff@example.com",
    "password": "password",
    "full_name": "Staff Name",
    "employee_code": "EMP001",
    "salary": 50000,
    "designation": "Manager",
    "department": "Operations",
    "join_date": "2023-01-01"
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "message": "Employee hired successfully", "data": { "employee": { ... } } }`

### List Employees
- **URL:** `/employees`
- **Method:** `GET`
- **Description:** Lists all employees.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "employees": [ ... ] } }`

### Get Employee Details
- **URL:** `/employees/:employee_id`
- **Method:** `GET`
- **Description:** Gets details of a specific employee.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "employee": { ... } } }`

### Update Employee
- **URL:** `/employees/:employee_id`
- **Method:** `PUT`
- **Description:** Updates employee details.
- **Request Body:**
  ```json
  {
    "salary": 55000,
    "designation": "Senior Manager"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Employee updated successfully" }`

### Terminate Employee
- **URL:** `/employees/:employee_id/terminate`
- **Method:** `POST`
- **Description:** Terminates an employee.
- **Request Body:**
  ```json
  {
    "termination_date": "2023-06-01",
    "notes": "Resigned"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Employee terminated successfully" }`

---

## Payroll (`/payroll`)

### Generate Payroll
- **URL:** `/payroll/generate`
- **Method:** `POST`
- **Description:** Generates payroll for a period.
- **Request Body:**
  ```json
  {
    "pay_period_start": "2023-02-01",
    "pay_period_end": "2023-02-28" // optional
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "message": "Generated X payroll records" }`

### List Payroll Records
- **URL:** `/payroll`
- **Method:** `GET`
- **Description:** Lists payroll records.
- **Query Params:**
  - `status`: `pending`, `paid`
  - `employee_id`: Filter by employee
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "payrolls": [ ... ] } }`

### Get Payroll Details
- **URL:** `/payroll/:payroll_id`
- **Method:** `GET`
- **Description:** Gets details of a payroll record.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "payroll": { ... } } }`

### Mark Payroll as Paid
- **URL:** `/payroll/:payroll_id/mark-paid`
- **Method:** `POST`
- **Description:** Marks a payroll record as paid.
- **Request Body:**
  ```json
  {
    "payment_date": "2023-03-01",
    "notes": "Bank transfer"
  }
  ```
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Payroll marked as paid" }`

### Get Employee Payroll History
- **URL:** `/employees/:employee_id/payroll-history`
- **Method:** `GET`
- **Description:** Gets payroll history for a specific employee.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "history": [ ... ] } }`

---

## Attendance (`/attendance`)

### Clock In
- **URL:** `/attendance/clock-in`
- **Method:** `POST`
- **Description:** Employee clocks in.
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Clocked in successfully" }`

### Clock Out
- **URL:** `/attendance/clock-out`
- **Method:** `POST`
- **Description:** Employee clocks out.
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Clocked out successfully" }`

### List Today's Attendance
- **URL:** `/attendance`
- **Method:** `GET`
- **Description:** Lists attendance records for today.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "attendance": [ ... ] } }`

### Get Monthly Attendance
- **URL:** `/employees/:employee_id/attendance`
- **Method:** `GET`
- **Description:** Gets monthly attendance for an employee.
- **Query Params:**
  - `month`: `YYYY-MM`
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "attendance": [ ... ], "summary": { ... } } }`

---

## Leave (`/leave-requests` & `/leave-types`)

### List Leave Types
- **URL:** `/leave-types`
- **Method:** `GET`
- **Description:** Lists available leave types.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "leaveTypes": [ ... ] } }`

### Submit Leave Request
- **URL:** `/leave-requests`
- **Method:** `POST`
- **Description:** Submits a leave request.
- **Request Body:**
  ```json
  {
    "leave_type_id": 1,
    "start_date": "2023-03-01",
    "end_date": "2023-03-03",
    "days_requested": 3,
    "reason": "Vacation"
  }
  ```
- **Response:**
  - `201 Created`: `{ "success": true, "message": "Leave request submitted" }`

### List Leave Requests
- **URL:** `/leave-requests`
- **Method:** `GET`
- **Description:** Lists leave requests.
- **Query Params:**
  - `status`: `pending`, `approved`, `rejected`
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "requests": [ ... ] } }`

### Approve Leave Request
- **URL:** `/leave-requests/:request_id/approve`
- **Method:** `PUT`
- **Description:** Approves a leave request.
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Leave request approved" }`

### Reject Leave Request
- **URL:** `/leave-requests/:request_id/reject`
- **Method:** `PUT`
- **Description:** Rejects a leave request.
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Leave request rejected" }`

### Get Leave Balance
- **URL:** `/employees/:employee_id/leave-balance`
- **Method:** `GET`
- **Description:** Gets leave balance key for an employee.
- **Response:**
  - `200 OK`: `{ "success": true, "data": { "balances": [ ... ] } }`

---

## Messaging (`/conversations`)

### List Conversations
- **URL:** `/conversations`
- **Method:** `GET`
- **Description:** Lists all conversations for the current user, including the last message and unread count.
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "data": {
        "conversations": [
          {
            "conversation_id": 1,
            "participants": [
              {
                "user": {
                  "user_id": 1,
                  "full_name": "John Doe",
                  "username": "johndoe",
                  "profile_picture": "http://...",
                  "role": "owner"
                }
              }
            ],
            "messages": [
              {
                "message_id": 100,
                "content": "Last message content",
                "sent_at": "2023-10-01T10:00:00Z",
                "is_read": false,
                "sender": {
                  "full_name": "John Doe",
                  "profile_picture": "http://..."
                }
              }
            ],
            "unreadCount": 1,
            "_count": { "messages": 50 }
          }
        ]
      }
    }
    ```

### Start Conversation
- **URL:** `/conversations`
- **Method:** `POST`
- **Description:** Starts a new conversation (1:1 or group).
- **Request Body:**
  ```json
  {
    "participantIds": [2, 3]
  }
  ```
- **Response:**
  - `201 Created`:
    ```json
    {
      "success": true,
      "message": "Conversation started",
      "data": {
        "conversation": {
          "conversation_id": 2,
          "participants": [...]
        }
      }
    }
    ```
  - `400 Bad Request`: `{ "success": false, "error": "participantIds must be a non-empty array of user IDs" }`

### Get Conversation Details
- **URL:** `/conversations/:conversation_id`
- **Method:** `GET`
- **Description:** Gets conversation details and metadata.
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "data": {
        "conversation": {
          "conversation_id": 1,
          "participants": [...],
          "messages": [...],
          "_count": { "messages": 50 }
        }
      }
    }
    ```

### List Messages
- **URL:** `/conversations/:conversation_id/messages`
- **Method:** `GET`
- **Description:** Lists messages in a conversation (paginated).
- **Query Params:**
  - `limit`: Number of messages (default 20)
  - `before`: ISO timestamp for pagination (fetches messages older than this)
- **Response:**
  - `200 OK`:
    ```json
    {
      "success": true,
      "data": {
        "messages": [
          {
            "message_id": 101,
            "sender_id": 1,
            "content": "Hello",
            "attachments": null,
            "sent_at": "...",
            "is_read": true,
            "sender": { "full_name": "...", "profile_picture": "..." }
          }
        ]
      }
    }
    ```

### Send Message
- **URL:** `/conversations/:conversation_id/messages`
- **Method:** `POST`
- **Description:** Sends a message in a conversation.
- **Request Body:**
  ```json
  {
    "content": "Hello world",
    "attachments": ["http://url1.com", "http://url2.com"] // optional
  }
  ```
- **Response:**
  - `201 Created`:
    ```json
    {
      "success": true,
      "message": "Message sent",
      "data": {
        "message": {
          "message_id": 102,
          "content": "Hello world",
          "sent_at": "...",
          "sender": { ... }
        }
      }
    }
    ```

### Mark Message Read
- **URL:** `/conversations/messages/:message_id/read`
- **Method:** `PUT`
- **Description:** Marks a specific message as read.
- **Response:**
  - `200 OK`: `{ "success": true, "message": "Message marked as read" }`

---

## Documents (`/document`)

### Get Document Types
- **URL:** `/document/document-types`
- **Method:** `GET`
- **Description:** Returns a list of available document types.
- **Response:**
  - `200 OK`:
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 1,
          "name": "ID Card",
          "code": "ID_CARD",
          "description": "National ID or Passport"
        }
      ]
    }
    ```

### Get My Documents (Tenant)
- **URL:** `/document/tenant-documents`
- **Method:** `GET`
- **Description:** Returns documents uploaded by the logged-in tenant.
- **Response:**
  - `200 OK`:
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": 10,
          "tenant_id": 5,
          "document_type_id": 1,
          "custom_title": "My Passport",
          "file_name": "passport.pdf",
          "mime_type": "application/pdf",
          "file_size_bytes": 102456,
          "status": "pending",
          "uploaded_at": "...",
          "documentType": { "id": 1, "name": "ID Card", "code": "ID_CARD" }
        }
      ]
    }
    ```

### Upload Tenant Document
- **URL:** `/document/tenant-documents/upload`
- **Method:** `POST`
- **Description:** Uploads a document (PDF, JPG, PNG). Max 10MB.
- **Request Body (Multipart/form-data):**
  - `file`: The document file.
  - `documentTypeId`: ID of the document type (optional).
  - `customTitle`: Custom name for the document (optional).
- **Response:**
  - `201 Created`:
    ```json
    {
      "status": "success",
      "data": { "id": 11, "file_name": "contract.pdf", "status": "pending", ... }
    }
    ```

### Approve Document
- **URL:** `/document/tenant-documents/:id/approve`
- **Method:** `PUT`
- **Description:** Approves a pending document (Owner/Admin only).
- **Response:**
  - `200 OK`: `{ "status": "success", "data": { "id": 10, "status": "approved", ... } }`

### Reject Document
- **URL:** `/document/tenant-documents/:id/reject`
- **Method:** `PUT`
- **Description:** Rejects a pending document with a comment (Owner/Admin only).
- **Request Body:**
  ```json
  {
    "comment": "File is blurry, please re-upload."
  }
  ```
- **Response:**
  - `200 OK`: `{ "status": "success", "data": { "id": 10, "status": "rejected", ... } }`

### Download Document
- **URL:** `/document/tenant-documents/:id/download`
- **Method:** `GET`
- **Description:** Downloads the binary content of a document.
- **Response:**
  - `200 OK`: Binary stream with appropriate `Content-Type` and `Content-Disposition`.
