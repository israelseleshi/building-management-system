# Building Management System (BMS) ER Diagram

This document provides a visual representation and detailed explanation of the database schema for the Building Management System.

## ER Diagram (Mermaid)

```mermaid
erDiagram
    USER ||--o| TENANT : "is a"
    USER ||--o| OWNER : "is a"
    USER ||--o| EMPLOYEE : "is a"
    USER ||--o{ MESSAGE : "sends"
    USER ||--o{ CONVERSATION_PARTICIPANT : "participates"
    USER ||--o{ METER_READING : "records"
    USER ||--o{ PAYMENT : "records"
    USER ||--o{ AUDIT_LOG : "triggers"
    USER ||--o{ LEAVE_REQUEST : "approves"
    USER ||--o{ PAYROLL : "pays"
    USER ||--o{ MAINTENANCE_ASSIGNMENT : "is assigned to"
    USER ||--o{ TENANT_DOCUMENT : "uploads/reviews"

    OWNER ||--o{ BUILDING : "owns"
    OWNER ||--o{ EMPLOYEE : "employs"
    OWNER ||--o{ LEAVE_TYPE : "defines"

    BUILDING ||--o{ UNIT : "contains"
    BUILDING ||--o{ LIFT_MONITOR : "monitored by"
    BUILDING ||--o{ SECURITY_CAMERA : "secured by"

    UNIT ||--o{ LEASE : "leased in"
    UNIT ||--o{ UTILITY_METER : "has"
    UNIT ||--o{ MAINTENANCE_REQUEST : "requires"

    TENANT ||--o{ LEASE : "signs"
    TENANT ||--o{ MAINTENANCE_REQUEST : "requests"
    TENANT ||--o{ PAYMENT : "makes"
    TENANT ||--o{ TENANT_DOCUMENT : "owns"

    EMPLOYEE ||--o{ PAYROLL : "receives"
    EMPLOYEE ||--o{ ATTENDANCE : "logs"
    EMPLOYEE ||--o{ LEAVE_REQUEST : "requests"
    EMPLOYEE ||--o{ LEAVE_BALANCE : "has"

    LEASE ||--o{ INVOICE : "generates"

    INVOICE ||--o{ INVOICE_ITEM : "contains"
    INVOICE ||--o{ PAYMENT : "settled by"
    INVOICE ||--o{ PENALTY : "accrues"

    UTILITY_METER ||--o{ METER_READING : "tracks"

    MAINTENANCE_REQUEST ||--o{ MAINTENANCE_ASSIGNMENT : "assigned to"

    CONVERSATION ||--o{ CONVERSATION_PARTICIPANT : "has"
    CONVERSATION ||--o{ MESSAGE : "contains"

    DOCUMENT_TYPE ||--o{ TENANT_DOCUMENT : "categorizes"

    USER {
        int user_id PK
        string username
        string email
        string password_hash
        UserRole role
        string full_name
        string phone
        string profile_picture
        datetime created_at
        datetime updated_at
    }

    TENANT {
        int tenant_id PK
        int user_id FK
        string national_id
        string tin_number
        int credit_score
        string blacklist_reason
        boolean is_blacklisted
        string notes
        datetime created_at
    }

    OWNER {
        int owner_id PK
        int user_id FK
        string company_name
        string tax_id
        string address
    }

    EMPLOYEE {
        int employee_id PK
        int user_id FK
        int owner_id FK
        string employee_code
        string designation
        string department
        datetime join_date
        decimal salary
        EmploymentType employment_type
        string bank_account_name
        string bank_account_number
        string bank_name
        boolean is_active
        datetime termination_date
        string notes
    }

    BUILDING {
        int building_id PK
        int owner_id FK
        string name
        string address
        string city
        string country
        int total_units
        int year_built
        json amenities
        datetime created_at
    }

    UNIT {
        int unit_id PK
        int building_id FK
        string unit_number
        int floor
        int bedrooms
        int bathrooms
        decimal sqft
        decimal base_rent
        UnitStatus status
    }

    LEASE {
        int lease_id PK
        int unit_id FK
        int tenant_id FK
        datetime start_date
        datetime end_date
        decimal monthly_rent
        decimal security_deposit
        decimal pet_deposit
        LeaseStatus status
        string termination_reason
        datetime created_at
    }

    INVOICE {
        int invoice_id PK
        int lease_id FK
        datetime period_start
        datetime period_end
        decimal rent_amount
        decimal utility_amount
        decimal penalty_amount
        datetime due_date
        InvoiceStatus status
        datetime generated_at
    }

    PAYMENT {
        int payment_id PK
        int invoice_id FK
        int tenant_id FK
        decimal amount
        datetime payment_date
        PaymentMethod method
        string reference_number
        int recorded_by FK
    }

    MAINTENANCE_REQUEST {
        int request_id PK
        int unit_id FK
        int tenant_id FK
        string description
        string category
        MaintenancePriority priority
        MaintenanceStatus status
        datetime submitted_at
        datetime resolved_at
    }
```

## Detailed Schema Explanation

### 1. User Identity and Roles
The schema follows a **Class Table Inheritance** (or similar) pattern for users.

*   **`User` Model**: The central hub for authentication and profile information.
    *   **Multiplicity**: 
        *   `User` to `Tenant`: 1:0..1 (A user can be a tenant).
        *   `User` to `Owner`: 1:0..1 (A user can be an owner/landlord).
        *   `User` to `Employee`: 1:0..1 (A user can be an employee).
    *   **Roles**: Managed via the `UserRole` enum (`super_admin`, `owner`, `manager`, `tenant`, `staff`, `vendor`).

### 2. Property Management Hierarchy
The core of the BMS revolves around buildings and their components.

*   **`Owner` & `Building`**: An `Owner` can own multiple `Buildings` (1:N).
*   **`Building` & `Unit`**: A `Building` contains multiple `Units` (1:N).
*   **`Unit` & `Lease`**: A `Unit` can have multiple `Leases` over time, but typically only one `active` lease at a point (1:N).
*   **`Lease` & `Tenant`**: A `Lease` connects a `Tenant` to a `Unit` (N:1).

### 3. Financials (Invoicing & Payments)
*   **`Lease` & `Invoice`**: A `Lease` triggers recurring `Invoices` (1:N).
*   **`Invoice` & `InvoiceItem`**: An `Invoice` can have multiple line items like rent, utilities, and penalties (1:N).
*   **`Invoice` & `Payment`**: An `Invoice` can be settled by one or more `Payments` (1:N). If `invoice_id` is null, it's a general payment by a tenant.
*   **`Invoice` & `Penalty`**: Late payments trigger `Penalties` linked to the `Invoice` (1:N).

### 4. Human Resources & Payroll
*   **`Owner` & `Employee`**: An `Owner` (landlord/company) employs multiple `Employees` (1:N).
*   **`Employee` & `Payroll`**: Each `Employee` receives monthly/periodic `Payroll` records (1:N).
*   **`Employee` & `Attendance`**: Daily logs for work hours (1:N).
*   **`Employee` & `LeaveManagement`**: 
    *   `LeaveType`: Defined by the owner (e.g., Sick, Annual).
    *   `LeaveRequest`: Submitted by employees (1:N).
    *   `LeaveBalance`: Tracks remaining days per type per year.

### 5. Maintenance & Operations
*   **`MaintenanceRequest`**: Submitted by a `Tenant` for a specific `Unit`.
*   **`MaintenanceAssignment`**: Links a request to a `User` (usually staff/vendor) responsible for fixing it.
*   **Utility Tracking**: 
    *   `UtilityMeter`: Linked to a `Unit`.
    *   `MeterReading`: Periodic readings recorded by a `User` (staff).

### 6. Communication & Documentation
*   **Messaging**: 
    *   `Conversation`: A group of participants.
    *   `ConversationParticipant`: Junction table between `User` and `Conversation` (M:N).
    *   `Message`: Individual messages within a conversation sent by a `User`.
*   **Documents**:
    *   `TenantDocument`: Stores binary content (`file_content`) for IDs, leases, etc.
    *   `DocumentType`: Categories for documents.
    *   Relationship: Linked to `Tenant` (owner) and `User` (uploader/reviewer).

### 7. IoT & Monitoring
*   **`LiftMonitor`**: Real-time status tracking for elevators in a `Building`.
*   **`SecurityCamera`**: Stream URLs and locations for cameras in a `Building`.

### 8. System Integrity
*   **`AuditLog`**: Tracks all sensitive changes (`action`, `changes` as JSON) performed by any `User`.
