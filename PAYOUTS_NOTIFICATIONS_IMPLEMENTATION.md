# Payouts & Notification System Implementation Guide

## Overview
Complete implementation of Payment Processing (Payouts) and Real-time Notification System for the Building Management System.

---

## 1. Database Schema

### Files Created
- `supabase_payouts_notifications.sql` - Complete database schema

### Tables Created

#### **payouts** Table
Stores all payout requests from landlords.

```sql
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id),
  property_id UUID NOT NULL REFERENCES public.properties(id),
  amount DECIMAL(12, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ETB',
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  transaction_id VARCHAR(100) UNIQUE,
  payment_date TIMESTAMP,
  due_date TIMESTAMP,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

**Columns:**
- `id` - Unique payout identifier
- `landlord_id` - Reference to landlord user
- `property_id` - Reference to property
- `amount` - Payout amount
- `currency` - Currency code (ETB)
- `payment_method` - bank_transfer, mobile_money, check, cash
- `status` - pending, processing, completed, failed, cancelled
- `transaction_id` - External transaction reference
- `payment_date` - When payment was processed
- `due_date` - When payment is due
- `description` - Payout description
- `notes` - Additional notes

#### **notifications** Table
Real-time notifications for users.

```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  related_entity_type VARCHAR(50),
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  icon VARCHAR(50),
  priority VARCHAR(20) DEFAULT 'normal',
  created_at TIMESTAMP DEFAULT now(),
  read_at TIMESTAMP
)
```

**Columns:**
- `id` - Unique notification identifier
- `user_id` - Reference to user
- `title` - Notification title
- `message` - Notification message
- `type` - payment, inquiry, message, maintenance, listing, system
- `related_entity_type` - Type of related entity
- `related_entity_id` - ID of related entity
- `is_read` - Read status
- `action_url` - URL to navigate to when clicked
- `icon` - Lucide icon name
- `priority` - low, normal, high, urgent
- `created_at` - Creation timestamp
- `read_at` - When notification was read

#### **notification_preferences** Table
User notification preferences.

```sql
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  payment_notifications BOOLEAN DEFAULT TRUE,
  inquiry_notifications BOOLEAN DEFAULT TRUE,
  message_notifications BOOLEAN DEFAULT TRUE,
  maintenance_notifications BOOLEAN DEFAULT TRUE,
  listing_notifications BOOLEAN DEFAULT TRUE,
  system_notifications BOOLEAN DEFAULT TRUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  push_notifications BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

#### **payment_methods** Table
Stored payment methods for landlords.

```sql
CREATE TABLE public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landlord_id UUID NOT NULL REFERENCES auth.users(id),
  method_type VARCHAR(50) NOT NULL,
  account_name VARCHAR(255),
  account_number VARCHAR(100),
  bank_name VARCHAR(255),
  mobile_provider VARCHAR(100),
  mobile_number VARCHAR(20),
  is_default BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring users can only access their own data.

### Indexes
Performance indexes created on:
- `landlord_id`, `property_id`, `status`, `created_at` for payouts
- `user_id`, `is_read`, `created_at`, `type` for notifications

---

## 2. Frontend Components

### Hooks

#### **useNotifications Hook**
**File:** `src/hooks/useNotifications.ts`

**Features:**
- Fetch notifications from Supabase
- Real-time subscription to new notifications
- Mark as read functionality
- Mark all as read
- Delete notifications
- Create notifications (for testing)

**Usage:**
```typescript
const {
  notifications,      // Array of notifications
  unreadCount,        // Number of unread notifications
  loading,            // Loading state
  fetchNotifications, // Refetch notifications
  markAsRead,         // Mark single notification as read
  markAllAsRead,      // Mark all as read
  deleteNotification, // Delete notification
  createNotification, // Create new notification
} = useNotifications()
```

### Components

#### **NotificationsDropdown Component**
**File:** `src/components/dashboard/NotificationsDropdown.tsx`

**Features:**
- Bell icon with unread badge
- Dropdown menu with notification list
- Scrollable notification area
- Mark as read on click
- Delete individual notifications
- Link to full notifications page
- Color-coded by type and priority
- Shows notification timestamp

**Styling:**
- Type-specific icons and colors
- Priority-based background colors
- Hover effects for better UX
- Responsive design

#### **DashboardHeader Update**
**File:** `src/components/dashboard/DashboardHeader.tsx`

**Changes:**
- Replaced static bell icon with `<NotificationsDropdown />`
- Maintains search functionality
- Professional header layout

---

## 3. Pages

### Payouts Page
**File:** `src/app/dashboard/payouts/page.tsx`

**Features:**

#### Metrics Dashboard
- **Total Paid**: Sum of completed payouts
- **Pending**: Sum of pending payouts
- **Processing**: Sum of processing payouts
- **Success Rate**: Percentage of completed payouts

#### Payout Management
- View all payouts in table format
- Filter by status (pending, processing, completed, failed, cancelled)
- Filter by payment method (bank transfer, mobile money, check, cash)
- Search functionality
- Create new payout request
- View payout details
- Delete payout

#### Add Payout Modal
- Select property
- Enter amount
- Choose payment method
- Set due date
- Add description and notes
- Form validation

#### Payout Details Modal
- View all payout information
- Display transaction ID if available
- Show payment status with color coding
- Display creation and due dates

**Styling:**
- Brand color (#7D8B6F) for primary buttons
- Status-based color coding (green/blue/yellow/red)
- Professional card layout
- Responsive design

### Notifications Page
**File:** `src/app/dashboard/notifications/page.tsx`

**Features:**

#### Statistics Cards
- Total notifications count
- Unread notifications count
- Read notifications count

#### Filtering
- Filter by type (payment, inquiry, message, maintenance, listing, system)
- Filter by read status (all, unread, read)
- Search by title or message

#### Notification List
- Display all notifications with details
- Type-specific icons
- Priority badges
- Read/unread status indicator
- Timestamp display
- Delete individual notifications
- Click to navigate to related entity

#### Actions
- Mark all as read button
- Delete notifications
- Navigate to related content

**Styling:**
- Priority-based colors (low/normal/high/urgent)
- Type-specific icons
- Unread indicator (blue left border)
- Hover effects
- Responsive layout

---

## 4. Integration Points

### Dashboard Header
- NotificationsDropdown integrated into DashboardHeader
- Shows unread count badge
- Accessible from all dashboard pages

### Sidebar Navigation
- Payouts link in sidebar (already exists)
- Notifications link can be added to sidebar

### Real-time Updates
- Supabase real-time subscriptions for notifications
- Automatic UI updates when new notifications arrive
- Unread count updates in real-time

---

## 5. Database Setup Instructions

### Step 1: Run SQL Schema
Execute the SQL file in Supabase SQL Editor:
```bash
# Copy contents of supabase_payouts_notifications.sql
# Paste into Supabase SQL Editor
# Run the script
```

### Step 2: Enable RLS
All RLS policies are included in the SQL file. Verify they're enabled:
```sql
-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('payouts', 'notifications', 'notification_preferences', 'payment_methods');
```

### Step 3: Test Policies
Create test notifications to verify RLS policies work correctly.

---

## 6. Usage Examples

### Create a Payout
```typescript
const { error } = await supabase
  .from('payouts')
  .insert([
    {
      landlord_id: userId,
      property_id: propertyId,
      amount: 50000,
      currency: 'ETB',
      payment_method: 'bank_transfer',
      status: 'pending',
      description: 'Monthly rent collection',
    }
  ])
```

### Create a Notification
```typescript
const { error } = await supabase
  .from('notifications')
  .insert([
    {
      user_id: userId,
      title: 'Payment Received',
      message: 'Your payout of ETB 50,000 has been processed',
      type: 'payment',
      priority: 'high',
      action_url: '/dashboard/payouts',
      icon: 'DollarSign',
    }
  ])
```

### Subscribe to Notifications
```typescript
const channel = supabase
  .channel(`notifications-${userId}`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    },
    (payload) => {
      console.log('New notification:', payload.new)
    }
  )
  .subscribe()
```

---

## 7. Features & Capabilities

### Payouts System
✅ Create payout requests
✅ Track payout status
✅ Filter by status and method
✅ View payout details
✅ Delete payouts
✅ Calculate metrics
✅ Responsive design
✅ Form validation

### Notification System
✅ Real-time notifications
✅ Multiple notification types
✅ Priority levels
✅ Read/unread status
✅ Notification preferences
✅ Search and filter
✅ Delete notifications
✅ Navigate to related content
✅ Unread badge
✅ Dropdown menu

---

## 8. Future Enhancements

### Payouts
- [ ] Payment processing integration (Stripe, PayPal)
- [ ] Automatic payout scheduling
- [ ] Payout history and reports
- [ ] Tax document generation
- [ ] Multi-currency support
- [ ] Bulk payout operations
- [ ] Payout analytics

### Notifications
- [ ] Email notifications
- [ ] Push notifications
- [ ] SMS notifications
- [ ] Notification templates
- [ ] Scheduled notifications
- [ ] Notification analytics
- [ ] Notification history export

---

## 9. Testing Checklist

### Payouts Page
- [ ] Load payouts page
- [ ] View all payouts in table
- [ ] Filter by status works
- [ ] Filter by payment method works
- [ ] Create new payout request
- [ ] View payout details
- [ ] Delete payout
- [ ] Metrics calculate correctly
- [ ] Responsive on mobile/tablet
- [ ] Form validation works

### Notifications
- [ ] Notifications dropdown opens
- [ ] Unread badge displays correctly
- [ ] Mark as read works
- [ ] Mark all as read works
- [ ] Delete notification works
- [ ] Notifications page loads
- [ ] Filter by type works
- [ ] Filter by read status works
- [ ] Search works
- [ ] Real-time updates work
- [ ] Responsive design works

### Integration
- [ ] NotificationsDropdown in header
- [ ] Payouts link in sidebar
- [ ] Navigation between pages works
- [ ] All pages use consistent styling
- [ ] Brand colors applied correctly

---

## 10. Troubleshooting

### Notifications Not Appearing
1. Check Supabase connection
2. Verify RLS policies are enabled
3. Check user_id in notifications table
4. Verify real-time subscriptions are active

### Payouts Not Saving
1. Check landlord_id is set correctly
2. Verify property_id exists
3. Check amount is valid number
4. Verify RLS policies allow insert

### Performance Issues
1. Check database indexes are created
2. Verify queries are optimized
3. Check for N+1 query problems
4. Monitor Supabase usage

---

## 11. File Structure

```
src/
├── app/
│   └── dashboard/
│       ├── payouts/
│       │   └── page.tsx
│       └── notifications/
│           └── page.tsx
├── components/
│   └── dashboard/
│       ├── DashboardHeader.tsx (updated)
│       └── NotificationsDropdown.tsx
├── hooks/
│   └── useNotifications.ts
└── lib/
    └── supabaseClient.ts (existing)

supabase_payouts_notifications.sql
```

---

## 12. Status

✅ **COMPLETE** - All features implemented and ready for testing

### Implemented
- Database schema with RLS
- Payouts page with full CRUD
- Notifications system with real-time updates
- NotificationsDropdown component
- useNotifications hook
- Notifications page with filtering
- Form validation
- Error handling
- Responsive design

### Ready for
- User testing
- Payment processor integration
- Email notification setup
- Push notification setup
- Analytics implementation
