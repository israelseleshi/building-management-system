# Building Management System (BMS) - Complete Features Documentation

**Project:** Building Management System (BMS)  
**Technology Stack:** Next.js 14, Supabase, TypeScript, Tailwind CSS, shadcn/ui  
**Target Market:** Property landlords, tenants, and building managers  

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Public Pages](#2-public-pages)
3. [Authentication System](#3-authentication-system)
4. [Landlord Dashboard Features](#4-landlord-dashboard-features)
5. [Tenant Dashboard Features](#5-tenant-dashboard-features)
6. [Database Schema](#6-database-schema)
7. [Technical Features](#7-technical-features)
8. [API Integration](#8-api-integration)
9. [Security Features](#9-security-features)

---

## 1. Project Overview

The Building Management System (BMS) is a comprehensive web-based platform designed to streamline property management operations for landlords and tenants. The application provides a modern, intuitive interface for managing properties, tenants, leases, payments, communications, and more.

### 1.1 Core Vision

- Digitize and streamline property management operations
- Centralize landlord-tenant communication
- Provide real-time insights through analytics
- Enable efficient document management
- Support multi-currency (ETB - Ethiopian Birr)

### 1.2 User Roles

| Role | Description |
|------|-------------|
| **Landlord/Owner** | Property owners who manage listings, tenants, employees, and finances |
| **Tenant** | Users who rent properties, view invoices, and communicate with landlords |

### 1.3 Application Structure

```
/                          # Landing page
├── /home                  # Public home page
│   ├── /listings          # Public property listings
│   ├── /about             # About page
│   ├── /services          # Services page
│   └── /contact           # Contact page
├── /auth                  # Authentication
│   ├── /signin           # Login page
│   ├── /signup           # Registration page
│   └── /reset-password   # Password reset
├── /dashboard             # Landlord dashboard
└── /tenant-dashboard     # Tenant dashboard
```

---

## 2. Public Pages

### 2.1 Landing Page (`/`)

The landing page serves as the main entry point for unauthenticated users.

**Features:**
- **Hero Section**
  - Background video with overlay
  - Trust indicators ("Trusted by 10,000+ Users")
  - Animated status dots
  - Call-to-action buttons (Browse Listings, List Property)

- **Search Bar**
  - Real-time search functionality
  - Redirects to `/home/listings?q={query}`

- **Features Section**
  - Six feature cards showcasing platform capabilities
  - Features include:
    - Advanced Search
    - Direct Messaging
    - Secure Payments
    - Verified Listings
    - Virtual Tours
    - E-Signature

- **Vertical Ad Sliders**
  - Left and right sidebar advertisements
  - Auto-rotating banner ads

### 2.2 Property Listings (`/home/listings`)

Public-facing property search and browse interface.

**Features:**
- **Search & Filter**
  - Search by location, property type
  - Filter by price range
  - Filter by bedrooms/bathrooms
  - Sort options (price, newest)

- **View Modes**
  - Grid view (card layout)
  - List view (compact layout)

- **Pagination**
  - 6 properties per page
  - URL-based pagination state

- **Property Cards**
  - Property image
  - Title and location
  - Price (ETB currency)
  - Bedroom/bathroom count
  - Save/favorite button

### 2.3 About Page (`/home/about`)

Static informational page about the platform.

### 2.4 Services Page (`/home/services`)

Overview of services offered through the platform.

### 2.5 Contact Page (`/home/contact`)

Contact information and inquiry form.

---

## 3. Authentication System

### 3.1 Registration (`/auth/signup`)

**Features:**
- Email and password registration
- Role selection (Landlord/Tenant)
- Full name input
- Phone number (optional)
- Profile picture upload
- Terms acceptance

**User Flow:**
1. User fills registration form
2. System validates input
3. User account created in Supabase Auth
4. Profile record created in database
5. User redirected to appropriate dashboard

### 3.2 Login (`/auth/signin`)

**Features:**
- Email/password authentication
- Remember me option
- Forgot password link
- Role-based redirect (landlord → dashboard, tenant → tenant-dashboard)

### 3.3 Password Reset (`/auth/reset-password`)

**Features:**
- Email input for reset link
- OTP verification
- New password entry
- Password confirmation

### 3.4 Protected Routes

- `ProtectedRoute` component wraps all authenticated pages
- Role-based access control enforcement
- Automatic redirect to sign-in for unauthenticated users

---

## 4. Landlord Dashboard Features

### 4.1 Dashboard Overview (`/dashboard`)

Main landing page after landlord login.

**Metrics Displayed:**
- **Collection Statistics**
  - Collected vs Unpaid percentages
  - Total rent amount
  - Outstanding amount
  - Units with invoices paid/due
  - Month/year selector

- **Occupancy Statistics**
  - Donut chart visualization
  - Vacant units (listed/unlisted)
  - Occupied units (listed/unlisted)
  - Total unit count

- **Maintenance Requests**
  - New requests count
  - Urgent requests count

- **Applications Processing**
  - Recent applicant information

**Key Features:**
- Building name and address display
- Building motto/tagline
- Building logo support
- Welcome message with user name
- Quick action buttons (New Listing, Attendance)

### 4.2 Property Listings Management (`/dashboard/listings`)

Unit/listing management interface.

**Features:**
- **Statistics Cards**
  - Total units
  - Occupied units
  - Vacant units
  - Total rent amount

- **Data Table**
  - Unit number
  - Tenant name
  - Floor number
  - Size (sqm)
  - Rent amount
  - Status (Vacant/Occupied/Maintenance)
  - Actions (View, Edit, Delete)

- **Filtering**
  - Search by unit number or ID
  - Filter by status

- **CRUD Operations**
  - View unit details in modal
  - Edit unit information
  - Delete unit with confirmation
  - Real-time updates via API

### 4.3 Create Listing (`/dashboard/create`)

Form for adding new property units.

**Fields:**
- Unit number
- Floor number
- Bedrooms count
- Bathrooms count
- Size (sqm)
- Rent amount
- Status (Vacant/Occupied/Maintenance)

### 4.4 Employee Management (`/dashboard/employees`)

Workforce management for landlords.

**Features:**
- **Statistics Dashboard**
  - Total employees
  - Active employees percentage
  - Monthly payroll total
  - Average attendance rate

- **Tabbed Interface**
  - All Employees
  - Attendance Tracking
  - Payroll Information

- **Employee Data**
  - Name, email, phone
  - Position/department
  - Salary
  - Join date
  - Status (Active/Inactive/On Leave)
  - Attendance rate

- **CRUD Operations**
  - Add new employee
  - View employee details
  - Edit employee information
  - Delete employee with confirmation

- **Filtering & Search**
  - Search by name/email/position
  - Filter by department
  - Filter by status

### 4.5 Rent/Lease Management (`/dashboard/leases`)

Lease agreement management.

**Features:**
- Lease listing with status indicators
- Create new lease
- View lease details
- Update lease terms
- Terminate lease
- Link leases to properties and tenants

### 4.6 Documents Management (`/dashboard/documents`)

Tenant document review interface for landlords.

**Features:**
- **Document List**
  - Document name
  - Tenant name
  - Upload date
  - Status (Pending/Approved/Rejected)

- **Filtering**
  - Filter by status

- **Document Actions**
  - View document
  - Download document
  - Approve document
  - Reject document with reason

### 4.7 Real-Time Chat (`/dashboard/chat`)

Messaging system for landlord-tenant communication.

**Features:**
- **Conversation List**
  - Participant name and avatar
  - Last message preview
  - Timestamp
  - Unread message count

- **Message Display**
  - Message history per conversation
  - Sender identification (you vs other)
  - Timestamp display
  - Message alignment (right for self, left for others)

- **Message Composition**
  - Text input field
  - Emoji picker
  - File attachment button
  - Send button

- **Real-Time Updates**
  - Supabase Realtime subscriptions
  - Instant message delivery
  - Unread count synchronization

### 4.8 Reports (`/dashboard/reports`)

Report generation and export.

**Features:**
- **Report Types**
  - Property listings report
  - Financial summary report
  - Tenant directory report
  - Maintenance log report
  - Occupancy report

- **Filters**
  - Date range selection
  - Property selection
  - Report format (PDF, CSV, Excel)

- **Export Functionality**
  - Generate report button
  - Download report

### 4.9 Payouts Management (`/dashboard/payouts`)

Financial payout tracking.

**Features:**
- **Metrics Dashboard**
  - Total paid amount
  - Pending amount
  - Processing amount
  - Success rate percentage

- **Payout List**
  - Amount
  - Payment method
  - Status (Pending/Processing/Completed/Failed/Cancelled)
  - Transaction ID
  - Payment date

- **Filtering**
  - Filter by status
  - Filter by payment method

- **Create Payout**
  - Select property
  - Enter amount
  - Choose payment method
  - Add description
  - Set due date

- **View Payout Details**
  - Complete payout information
  - Associated property
  - Payment method details

### 4.10 Analytics (`/dashboard/analytics`)

Data visualization and insights.

**Features:**
- **Revenue Charts**
  - Line charts for revenue trends
  - Bar charts for comparisons
  - Period selection (month/year)

- **Dashboard Metrics**
  - Total revenue
  - Occupancy rate
  - Maintenance requests
  - Tenant satisfaction

- **Data Visualization**
  - Line charts
  - Bar charts
  - Pie charts
  - Gauge indicators

### 4.11 Attendance Management (`/dashboard/attendance`)

Business attendance tracking system.

**Features:**
- **Attendance Records**
  - Shop/unit name
  - Status (On Time/Slight Late/Late/Closed)
  - Opening time
  - Actual check-in time
  - Delay minutes

- **Attendance Issues (Exceptions)**
  - Late openings
  - Not opened cases
  - Warning templates

- **Raw Device Logs**
  - Fingerprint/scanner logs
  - Timestamp data

- **Manual Adjustments**
  - Manual time corrections
  - Adjustment reasons

- **Configurations**
  - Business hours settings
  - Alert thresholds

- **PDF Export**
  - Download attendance reports

### 4.12 Invoices Management (`/dashboard/invoices`)

Invoice generation and management.

**Features:**
- Invoice list with status
- Invoice preview (PDF viewer)
- Download invoice as PDF
- Invoice details:
  - Invoice number
  - Tenant information
  - Bill from/to
  - Line items
  - Subtotal, tax, total
  - Payment status

### 4.13 Applications Management (`/dashboard/applications`)

Tenant application tracking.

**Features:**
- **Tabs**
  - Applications
  - Templates
  - Requests Sent

- **Application List**
  - Applicant name
  - Property applied
  - Status (For Review/Pending/Approved/Rejected)
  - Residential score
  - Annual income
  - Background check status

- **Filtering & Grouping**
  - Filter by status
  - Group by property
  - Group by status

### 4.14 Notices Management (`/dashboard/notices`)

Global notice posting for landlords.

**Features:**
- Create new notices
- View posted notices
- Edit existing notices
- Delete notices
- Notices visible to all tenants

### 4.15 Settings (`/dashboard/settings`)

Account and application settings.

**Features:**
- Profile information management
- Password change
- Notification preferences
- Payment methods configuration

---

## 5. Tenant Dashboard Features

### 5.1 Dashboard Overview (`/tenant-dashboard`)

Main landing page after tenant login.

**Features:**
- Notice board display
- Quick access to common actions
- Building/landlord information
- Chat messaging (inline)

### 5.2 Property Listings (`/tenant-dashboard/listings`)

Browse available properties.

**Features:**
- Grid view of available listings
- Property details display
- Save/favorite functionality
- Contact landlord option

### 5.3 My Rents/Leases (`/tenant-dashboard/leases`)

View lease agreements.

**Features:**
- Current lease information
- Lease status display
- Rent amount details
- Lease term dates

### 5.4 Documents (`/tenant-dashboard/documents`)

Document upload and management for tenants.

**Features:**
- **Document Upload**
  - Select document type
  - Drag and drop support
  - File type validation
  - Upload progress indicator

- **Document Types**
  - ID Card
  - Proof of Income
  - Bank Statement
  - Employment Verification
  - Rental History

- **Document List**
  - Document name
  - Document type
  - Upload date
  - Status (Pending/Approved/Rejected)
  - Rejection reason (if applicable)

- **Actions**
  - Upload new document
  - View document
  - Delete document

### 5.5 Chat (`/tenant-dashboard/chat`)

Direct messaging with landlord.

**Features:**
- Conversation with landlord
- Message history display
- Real-time message delivery
- Emoji support

### 5.6 Invoices (`/tenant-dashboard/invoices`)

View and download rent invoices.

**Features:**
- Invoice list with status badges
- Invoice preview (PDF viewer)
- Download invoice as PDF
- Invoice details display
- Status colors (Paid/Pending/Overdue)

### 5.7 Reports (`/tenant-dashboard/reports`)

Tenant-specific reports.

**Features:**
- Payment history report
- Document status report
- Lease summary report

### 5.8 Settings (`/tenant-dashboard/settings`)

Account management for tenants.

**Features:**
- **Profile Settings**
  - Full name
  - Email
  - Phone number
  - Save changes

- **Password Settings**
  - Current password
  - New password
  - Confirm password
  - Update password

- **Notification Preferences**
  - Email notifications toggle
  - Chat notifications toggle
  - Maintenance notifications toggle

---

## 6. Database Schema

### 6.1 User & Authentication Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profile information (extends auth.users) |
| `owner_profiles` | Owner-specific profile data |
| `tenant_profiles` | Tenant-specific profile data |

**Profile Fields:**
- `id` (UUID, FK to auth.users)
- `full_name`
- `role` (tenant/owner)
- `email`
- `phone`
- `avatar_url`
- `is_email_verified`
- `notify_email`, `notify_chat`, `notify_maintenance`

### 6.2 Property Tables

| Table | Description |
|-------|-------------|
| `properties` | Property listings |
| `property_images` | Multiple images per property |

**Property Fields:**
- `id`, `landlord_id`
- `title`, `description`
- `address_line1`, `city`, `country`
- `monthly_rent`
- `status` (draft/active/pending/rented/inactive)
- `is_active`
- `image_url`, `category`, `tags`

### 6.3 Lease Tables

| Table | Description |
|-------|-------------|
| `leases` | Lease agreements |

**Lease Fields:**
- `id`, `property_id`, `landlord_id`, `tenant_id`
- `monthly_rent`
- `status` (pending/active/expired/terminated)
- `start_date`, `end_date`
- `is_active`

### 6.4 Employee Tables

| Table | Description |
|-------|-------------|
| `employees` | Employee records |

**Employee Fields:**
- `id`, `owner_id`
- `name`, `email`, `phone`
- `position`, `department`
- `salary`
- `join_date`
- `status` (Active/Inactive/On Leave)
- `attendance_rate`
- `last_attendance`

### 6.5 Communication Tables

| Table | Description |
|-------|-------------|
| `conversations` | Chat conversations |
| `conversation_participants` | Conversation membership |
| `messages` | Individual messages |

**Conversation Fields:**
- `id`, `property_id`, `lease_id`
- `is_group`
- `status`
- `last_message`, `last_message_at`

**Message Fields:**
- `id`, `conversation_id`, `sender_id`
- `content`
- `msg_type` (text/image/file)
- `created_at`, `read_at`
- `is_deleted`

### 6.6 Financial Tables

| Table | Description |
|-------|-------------|
| `payouts` | Landlord payout requests |
| `payment_methods` | Saved payment methods |

**Payout Fields:**
- `id`, `landlord_id`, `property_id`
- `amount`, `currency` (ETB)
- `payment_method`
- `status` (pending/processing/completed/failed/cancelled)
- `transaction_id`
- `payment_date`, `due_date`

### 6.7 Notification Tables

| Table | Description |
|-------|-------------|
| `notifications` | User notifications |
| `notification_preferences` | Notification settings |

**Notification Fields:**
- `id`, `user_id`
- `title`, `message`
- `type` (payment/inquiry/message/maintenance/listing/system)
- `priority` (low/normal/high/urgent)
- `is_read`
- `action_url`
- `related_entity_type`, `related_entity_id`

### 6.8 Document Tables

| Table | Description |
|-------|-------------|
| `document_types` | Document categories |
| `tenant_documents` | Uploaded tenant documents |

**Document Type Fields:**
- `id`, `name`, `description`
- `is_required`

**Tenant Document Fields:**
- `id`, `tenant_id`, `landlord_id`
- `document_type_id`
- `file_name`, `file_path`, `file_size`
- `status` (pending/approved/rejected)
- `rejection_reason`

---

## 7. Technical Features

### 7.1 Frontend Architecture

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **State Management:** React hooks (useState, useEffect, useContext)
- **Internationalization:** next-intl

### 7.2 Backend Integration

- **Backend-as-a-Service:** Supabase
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth
- **Real-time:** Supabase Realtime
- **Storage:** Supabase Storage

### 7.3 Key Libraries

| Library | Purpose |
|---------|---------|
| `@tanstack/react-table` | Data tables |
| `recharts` | Data visualization |
| `@react-pdf/renderer` | PDF generation |
| `framer-motion` | Animations |
| `lucide-react` | Icons |
| `zod` | Schema validation |
| `react-hook-form` | Form handling |
| `dayjs` | Date manipulation |

### 7.4 Real-Time Features

- **Chat Messaging:** Supabase Realtime subscriptions for instant message delivery
- **Notifications:** Real-time notification updates
- **Unread Counts:** Synchronized unread message tracking

### 7.5 PDF Generation

- Invoice PDF templates using `@react-pdf/renderer`
- Downloadable reports
- In-browser PDF preview

---

## 8. API Integration

### 8.1 API Client

Centralized API client (`/src/lib/apiClient.ts`) with:
- JWT token authentication
- Automatic timeout handling
- Error handling
- Response parsing

### 8.2 Key API Endpoints

**Authentication:**
- `POST /auth/login`
- `POST /auth/register/send-otp`
- `POST /auth/register/complete`
- `POST /auth/forgot-password`
- `POST /auth/logout`

**User:**
- `GET /user/me`
- `PUT /user/me`
- `PUT /user/me/password`

**Buildings & Units:**
- `GET/POST /buildings`
- `GET/PUT/DELETE /buildings/:building_id`
- `GET/POST /buildings/:building_id/units`
- `GET/PUT/DELETE /units/:unit_id`

**Employees:**
- `GET/POST /employees`
- `GET/PUT /employees/:employee_id`
- `POST /employees/:employee_id/terminate`

**Leases:**
- `GET/POST /leases`
- `GET/PUT /leases/:lease_id`
- `POST /leases/:lease_id/terminate`

**Chat:**
- `GET /conversations`
- `POST /conversations`
- `GET/POST /conversations/:conversation_id/messages`

**Documents:**
- `GET /document/document-types`
- `GET/POST /document/tenant-documents/upload`
- `PUT /document/tenant-documents/:id/approve`
- `PUT /document/tenant-documents/:id/reject`

---

## 9. Security Features

### 9.1 Authentication Security

- Email/password authentication
- JWT token-based sessions
- Protected route middleware
- Session timeout handling

### 9.2 Authorization

- Role-based access control (RBAC)
- Landlord vs Tenant permissions
- Owner role for additional privileges

### 9.3 Row Level Security (RLS)

Database-level security policies:
- Users can only access their own data
- Landlords can only manage their properties
- Tenants can only view their lease information
- Document access restricted to relevant parties

### 9.4 Data Protection

- HTTPS encryption
- Input validation and sanitization
- SQL injection prevention (via Supabase)
- XSS protection (via React)

---

## 10. Feature Status Summary

### Fully Implemented
- User authentication and authorization
- Property listings management (CRUD)
- Real-time chat system
- Employee management
- Payouts tracking
- Notifications system
- Document management
- Lease management
- Attendance tracking
- Invoice generation
- Analytics dashboard
- Reports generation
- Settings management

### UI Implemented (Backend Needed)
- Analytics visualizations
- Reports export functionality
- Employee backend integration
- Chat file attachments

### Partially Available
- Public property listings search
- Tenant document upload
- Payment method management

---

## 11. Future Roadmap (From Product Roadmap)

### Phase 1: Foundation (Months 1-3)
- Complete analytics backend integration
- Implement tenant document management
- Develop comprehensive lease module
- Complete employee management backend

### Phase 2: Experience Enhancement (Months 4-6)
- User research and UX audit
- Navigation improvements
- Visual design enhancement
- Mobile optimization
- Accessibility improvements

### Phase 3: Growth (Months 7-12)
- Subscription tier structure
- Premium feature development
- Marketing and user acquisition
- Customer success initiatives

---

## 12. File Structure

```
/src
├── /app
│   ├── /dashboard           # Landlord pages
│   ├── /tenant-dashboard   # Tenant pages
│   ├── /home               # Public pages
│   ├── /auth               # Authentication pages
│   └── page.tsx            # Landing page
├── /components
│   ├── /ui                 # shadcn/ui components
│   ├── /dashboard          # Dashboard-specific components
│   ├── /home               # Home page components
│   ├── /auth               # Auth components
│   └── /documents          # Document components
├── /lib
│   ├── apiClient.ts        # API utilities
│   ├── chat.ts             # Chat utilities
│   ├── attendance.ts       # Attendance types
│   └── mockInvoices.ts     # Mock data
├── /hooks                  # Custom React hooks
├── /constants              # Static configuration
├── /data                   # Static data
└── /types                  # TypeScript types
```

---

*Document generated: March 2026*  
*Building Management System (BMS) - Complete Features Documentation*
