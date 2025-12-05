# Quick Setup Guide - Payouts & Notifications

## Prerequisites
- Supabase project set up
- Authentication configured
- `properties` table exists

## Setup Steps

### 1. Create Database Tables

**Option A: Using Supabase Dashboard**
1. Go to Supabase Dashboard → SQL Editor
2. Create new query
3. Copy contents of `supabase_payouts_notifications.sql`
4. Run the query

**Option B: Using Supabase CLI**
```bash
supabase db push
```

### 2. Verify Tables Created
```sql
-- Check if tables exist
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('payouts', 'notifications', 'notification_preferences', 'payment_methods');
```

### 3. Verify RLS is Enabled
```sql
-- Check RLS status
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('payouts', 'notifications', 'notification_preferences', 'payment_methods');
```

All should show `rowsecurity = true`

### 4. Test Notification Creation
```sql
-- Insert test notification (replace with your user ID)
INSERT INTO public.notifications (
  user_id,
  title,
  message,
  type,
  priority
) VALUES (
  'your-user-id-here',
  'Test Notification',
  'This is a test notification',
  'system',
  'normal'
);
```

### 5. Access New Features

**Payouts Page:**
- Navigate to `/dashboard/payouts`
- Create, view, and manage payout requests

**Notifications:**
- Click bell icon in dashboard header
- View notifications dropdown
- Go to `/dashboard/notifications` for full page

## Testing Checklist

### Payouts
- [ ] Navigate to `/dashboard/payouts`
- [ ] Page loads without errors
- [ ] Metrics cards display
- [ ] Create payout button works
- [ ] Modal opens and closes
- [ ] Can create new payout
- [ ] Payouts appear in table
- [ ] Filters work
- [ ] Delete works

### Notifications
- [ ] Bell icon appears in header
- [ ] Dropdown opens on click
- [ ] Shows "No notifications" initially
- [ ] Can create test notification in SQL
- [ ] Notification appears in dropdown
- [ ] Mark as read works
- [ ] Delete works
- [ ] Navigate to `/dashboard/notifications`
- [ ] Full page loads
- [ ] Filters work
- [ ] Search works

## Troubleshooting

### Tables Not Created
- Check Supabase connection
- Verify SQL syntax
- Check for error messages in SQL Editor
- Try running individual CREATE TABLE statements

### RLS Policies Not Working
- Verify RLS is enabled on all tables
- Check policy conditions
- Test with authenticated user
- Check user ID in data

### Notifications Not Appearing
- Verify notification was inserted
- Check user_id matches current user
- Check browser console for errors
- Verify Supabase client is configured

### Payouts Page Blank
- Check browser console for errors
- Verify user is authenticated
- Check Supabase connection
- Try refreshing page

## Next Steps

1. **Integrate Payment Processor**
   - Add Stripe/PayPal integration
   - Update payout status when payment processed
   - Send notifications on payment completion

2. **Email Notifications**
   - Set up email templates
   - Send emails for important notifications
   - Add email preferences

3. **Push Notifications**
   - Implement web push notifications
   - Add service worker
   - Request notification permissions

4. **Analytics**
   - Track payout metrics
   - Monitor notification delivery
   - Generate reports

## Support

For issues or questions:
1. Check browser console for errors
2. Review Supabase logs
3. Check database queries
4. Verify RLS policies
5. Test with SQL directly

## Files Reference

| File | Purpose |
|------|---------|
| `supabase_payouts_notifications.sql` | Database schema |
| `src/hooks/useNotifications.ts` | Notification hook |
| `src/components/dashboard/NotificationsDropdown.tsx` | Dropdown component |
| `src/app/dashboard/payouts/page.tsx` | Payouts page |
| `src/app/dashboard/notifications/page.tsx` | Notifications page |
| `PAYOUTS_NOTIFICATIONS_IMPLEMENTATION.md` | Full documentation |

## Quick Commands

```bash
# Check if tables exist
supabase db list

# View table structure
supabase db describe payouts

# Run migrations
supabase db push

# Reset database (careful!)
supabase db reset
```

---

**Status:** ✅ Ready to use

**Last Updated:** December 5, 2025
