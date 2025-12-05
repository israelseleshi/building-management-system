# ✅ RLS Quick Fix - CORRECTED (Views Excluded)

## 🔧 The Issue

`payout_summary` is a **VIEW**, not a table. Views don't support RLS directly.

## ✅ Corrected SQL

Run this instead (skips views):

```sql
-- Disable RLS on TABLES ONLY (not views)
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE leases DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE payouts DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods DISABLE ROW LEVEL SECURITY;

-- Skip these (they are VIEWS, not tables):
-- payout_summary - VIEW
-- owner_profiles - VIEW (if exists)
```

---

## 🎯 What to Do

1. Copy the SQL above
2. Go to Supabase → SQL Editor
3. Paste and run
4. Refresh your app

**Expected result:** ✅ App works, no NetworkError

---

## 📝 Note on Views

Views inherit RLS from their underlying tables. So:
- If you disable RLS on `payouts` table → `payout_summary` view will work
- You don't need to disable RLS on the view itself

---

**Status:** Ready to run ✅
