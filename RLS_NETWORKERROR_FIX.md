# 🔧 Supabase RLS NetworkError - Complete Fix Guide

## ❌ Problem
Getting `NetworkError when attempting to fetch resource` after enabling RLS on all tables.

## ✅ Root Causes & Solutions

### **Cause 1: RLS Policies Too Restrictive**

RLS policies are blocking authenticated requests. The error happens when:
- User is authenticated but RLS policy denies access
- No policy exists for the operation
- Policy references wrong column/user_id

### **Cause 2: Missing Authentication Context**

The app needs to properly pass the user context to Supabase.

---

## 🛠️ Fix Steps

### **Step 1: Check RLS Status in Supabase**

1. Go to Supabase Dashboard
2. Click "Authentication" → "Users" - verify users exist
3. Go to "SQL Editor"
4. Run this to check RLS status:

```sql
-- Check which tables have RLS enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
```

### **Step 2: Temporarily Disable RLS for Testing**

To confirm RLS is the issue:

```sql
-- Disable RLS on all tables temporarily
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE leases DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ... other tables
```

**Test:** If it works now, RLS is the problem.

### **Step 3: Create Proper RLS Policies**

Once confirmed, re-enable RLS with proper policies:

```sql
-- Re-enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to read their own properties
CREATE POLICY "Users can read their own properties"
ON properties FOR SELECT
USING (auth.uid() = landlord_id);

-- Create policy for authenticated users to insert their own properties
CREATE POLICY "Users can insert their own properties"
ON properties FOR INSERT
WITH CHECK (auth.uid() = landlord_id);

-- Create policy for authenticated users to update their own properties
CREATE POLICY "Users can update their own properties"
ON properties FOR UPDATE
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);

-- Create policy for authenticated users to delete their own properties
CREATE POLICY "Users can delete their own properties"
ON properties FOR DELETE
USING (auth.uid() = landlord_id);
```

### **Step 4: Fix Frontend Authentication**

Ensure your Supabase client is properly initialized:

```typescript
// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Verify user is authenticated before making requests
export const getAuthenticatedUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Auth error:', error)
    return null
  }
  return user
}
```

### **Step 5: Verify User is Authenticated**

Add this check before fetching data:

```typescript
useEffect(() => {
  const fetchProperties = async () => {
    try {
      // Verify user is authenticated
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        console.error('Not authenticated:', authError)
        return
      }

      console.log('Authenticated as:', user.id)

      // Now fetch data
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('landlord_id', user.id)

      if (error) throw error
      
      setBuildings(transformData(data))
    } catch (err) {
      console.error('Error:', err)
    }
  }

  fetchProperties()
}, [])
```

---

## 📋 RLS Policy Template for All Tables

### **Properties Table**
```sql
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
```

### **Leases Table**
```sql
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

### **Users Table**
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

---

## 🧪 Testing RLS Policies

### **Test 1: Check Policy Exists**
```sql
SELECT * FROM pg_policies 
WHERE tablename = 'properties';
```

### **Test 2: Test as Authenticated User**
```sql
-- This should return data if policy is correct
SELECT * FROM properties 
WHERE landlord_id = auth.uid();
```

### **Test 3: Test in Browser Console**
```javascript
// Check if user is authenticated
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user?.id)

// Try to fetch
const { data, error } = await supabase
  .from('properties')
  .select('*')
  
console.log('Data:', data)
console.log('Error:', error)
```

---

## 🚨 Quick Fixes (In Order)

### **Option 1: Temporarily Disable RLS (Development Only)**
```sql
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE leases DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

⚠️ **WARNING:** Only for development/testing. Re-enable before production!

### **Option 2: Create Permissive Policies (Development Only)**
```sql
-- Allow all authenticated users to read
CREATE POLICY "Allow all authenticated users"
ON properties FOR SELECT
USING (auth.role() = 'authenticated');
```

⚠️ **WARNING:** Not secure for production!

### **Option 3: Fix Policies Properly (Production)**
Use the templates above to create proper, restrictive policies.

---

## 🔍 Debugging Checklist

- [ ] Check if user is authenticated: `supabase.auth.getUser()`
- [ ] Verify `landlord_id` column exists in properties table
- [ ] Verify `auth.uid()` matches user ID in database
- [ ] Check RLS policies exist: `SELECT * FROM pg_policies`
- [ ] Test with RLS disabled first
- [ ] Check browser console for detailed error
- [ ] Check Supabase logs for policy violations
- [ ] Verify environment variables are correct
- [ ] Clear browser cache and restart dev server

---

## 📊 Common RLS Issues

| Issue | Cause | Fix |
|-------|-------|-----|
| NetworkError | RLS denies access | Create proper policies |
| Empty results | Wrong user_id | Verify `auth.uid()` matches |
| 403 Forbidden | No policy for operation | Add INSERT/UPDATE/DELETE policy |
| Slow queries | Complex policies | Optimize policy conditions |

---

## ✅ Verification

After fixing, test with:

```typescript
// This should work without errors
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .eq('landlord_id', user.id)

if (error) {
  console.error('RLS Error:', error.message)
} else {
  console.log('Success! Data:', data)
}
```

---

**Status:** 🔧 **TROUBLESHOOTING GUIDE**

**Last Updated:** December 5, 2025

**Next Steps:**
1. Check if user is authenticated
2. Disable RLS temporarily to confirm it's the issue
3. Create proper RLS policies
4. Test and verify
