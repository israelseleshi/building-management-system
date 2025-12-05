# 🔍 Quick RLS Diagnostic - Run These Steps

## Step 1: Check Authentication Status

Open browser console (F12) and run:

```javascript
// Check if user is logged in
const { data: { user } } = await supabase.auth.getUser()
console.log('Current User:', user)
console.log('User ID:', user?.id)
```

**Expected:** Should show user object with ID
**If null:** User not authenticated - need to login first

---

## Step 2: Check RLS Status

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

**Expected:** Should show `rowsecurity = true` for your tables
**If false:** RLS is disabled (not the problem)

---

## Step 3: Check RLS Policies

```sql
-- See all RLS policies
SELECT * FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected:** Should show policies for each table
**If empty:** No policies exist - this is the problem!

---

## Step 4: Quick Fix - Disable RLS Temporarily

If you confirmed RLS is the issue:

```sql
-- Disable RLS on all tables
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE leases DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
-- ... any other tables
```

**Test:** Refresh your app - should work now

---

## Step 5: Proper Fix - Create RLS Policies

Once confirmed it's RLS, create proper policies:

```sql
-- For properties table
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Landlords can read their properties"
ON properties FOR SELECT
USING (auth.uid() = landlord_id);

CREATE POLICY "Landlords can create properties"
ON properties FOR INSERT
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can update their properties"
ON properties FOR UPDATE
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Landlords can delete their properties"
ON properties FOR DELETE
USING (auth.uid() = landlord_id);

-- For leases table
ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their leases"
ON leases FOR SELECT
USING (auth.uid() = landlord_id OR auth.uid() = tenant_id);

CREATE POLICY "Landlords can create leases"
ON leases FOR INSERT
WITH CHECK (auth.uid() = landlord_id);

CREATE POLICY "Users can update their leases"
ON leases FOR UPDATE
USING (auth.uid() = landlord_id OR auth.uid() = tenant_id)
WITH CHECK (auth.uid() = landlord_id OR auth.uid() = tenant_id);

CREATE POLICY "Landlords can delete leases"
ON leases FOR DELETE
USING (auth.uid() = landlord_id);
```

---

## 🎯 Most Likely Causes

### **Cause 1: RLS Enabled But No Policies**
- ✅ **Fix:** Create policies using Step 5 above
- ⏱️ **Time:** 5 minutes

### **Cause 2: Policies Reference Wrong Column**
- ✅ **Fix:** Verify `landlord_id` exists in properties table
- ⏱️ **Time:** 2 minutes

### **Cause 3: User Not Authenticated**
- ✅ **Fix:** Ensure user is logged in before fetching
- ⏱️ **Time:** 1 minute

### **Cause 4: auth.uid() Doesn't Match**
- ✅ **Fix:** Verify user ID in database matches auth.uid()
- ⏱️ **Time:** 3 minutes

---

## 🚀 Quick Test

After applying fixes, test in browser console:

```javascript
// 1. Check user
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user?.id)

// 2. Try to fetch
const { data, error } = await supabase
  .from('properties')
  .select('*')

console.log('Data:', data)
console.log('Error:', error)
```

**Expected:** `data` should have results, `error` should be null

---

## 📞 If Still Not Working

1. Check Supabase logs for detailed error
2. Verify environment variables are correct
3. Clear browser cache: Ctrl+Shift+Delete
4. Restart dev server: `npm run dev`
5. Check if user_id column name matches in database

---

**Priority:** 🔴 **HIGH** - This blocks all data fetching

**Estimated Fix Time:** 5-10 minutes
