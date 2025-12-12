# 🔧 Listings Error Fix - Complete Troubleshooting

## 🔴 The Error

`Error fetching listings: {}` on home page listings

**Root Causes:**
1. RLS disabled (shouldn't cause this, but let's verify)
2. Supabase client not initialized
3. Network connectivity issue
4. Wrong table/column names
5. Authentication context missing

---

## ✅ Step 1: Verify RLS Status

Go to Supabase Dashboard and check:

```sql
-- Check RLS status on properties table
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'properties';
```

**Expected:** `rowsecurity = false` (RLS disabled)

If `rowsecurity = true`, RLS is still enabled and blocking requests.

---

## ✅ Step 2: Check Supabase Connection

Add this to your listings page to debug:

```typescript
// src/app/home/listings/page.tsx

useEffect(() => {
  const testConnection = async () => {
    try {
      console.log('Testing Supabase connection...')
      
      // Test 1: Check if client is initialized
      console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      
      // Test 2: Try to fetch from properties table
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .limit(1)
      
      console.log('Test query data:', data)
      console.log('Test query error:', error)
      
      if (error) {
        console.error('Supabase error:', error.message)
      } else {
        console.log('Connection successful!')
      }
    } catch (err) {
      console.error('Connection test failed:', err)
    }
  }
  
  testConnection()
}, [])
```

---

## ✅ Step 3: Check Your Listings Fetch Code

Make sure your fetch code looks like this:

```typescript
useEffect(() => {
  const fetchListings = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Fetching from properties table...')
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_active', true)
      
      if (error) {
        console.error('Supabase error:', error)
        throw error
      }
      
      console.log('Fetched data:', data)
      
      // Transform data
      const transformed = (data || []).map((property: any) => ({
        id: property.id,
        title: property.title,
        location: `${property.address_line1}, ${property.city}`,
        price: property.monthly_rent,
        // ... other fields
      }))
      
      setAllListings(transformed)
    } catch (err: any) {
      console.error('Error fetching listings:', err)
      console.error('Error message:', err?.message)
      console.error('Error details:', err?.details)
      setError('Failed to load listings. Please try again.')
      setAllListings([])
    } finally {
      setLoading(false)
    }
  }
  
  fetchListings()
}, [])
```

---

## ✅ Step 4: Verify Database Has Data

In Supabase SQL Editor:

```sql
-- Check if properties table has data
SELECT COUNT(*) as total_properties FROM properties;

-- Check specific properties
SELECT id, title, city, monthly_rent, is_active 
FROM properties 
LIMIT 5;
```

**Expected:** Should show properties with `is_active = true`

If empty, you need to create test data.

---

## ✅ Step 5: Re-enable RLS with Proper Policies

If you want RLS enabled (recommended for production):

```sql
-- Enable RLS on properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for home page listings)
CREATE POLICY "Anyone can read active properties"
ON properties FOR SELECT
USING (is_active = true);

-- Create policy for landlords to manage their properties
CREATE POLICY "Landlords can manage their properties"
ON properties FOR ALL
USING (auth.uid() = landlord_id)
WITH CHECK (auth.uid() = landlord_id);
```

---

## 🧪 Quick Diagnostic

Run this in browser console:

```javascript
// 1. Check Supabase client
console.log('Supabase:', supabase)

// 2. Test simple query
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .limit(1)

console.log('Data:', data)
console.log('Error:', error)

// 3. Check if data exists
if (data && data.length > 0) {
  console.log('✅ Data exists!')
} else {
  console.log('❌ No data in properties table')
}
```

---

## 📋 Checklist

- [ ] RLS is disabled on properties table
- [ ] Supabase environment variables are set
- [ ] Properties table has data with `is_active = true`
- [ ] Supabase client is properly initialized
- [ ] No CORS errors in browser console
- [ ] Network tab shows successful requests

---

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Empty properties table | Insert test data |
| RLS still enabled | Run disable RLS SQL |
| Wrong table name | Check schema for actual table names |
| Env vars missing | Add to `.env.local` |
| Network error | Check internet connection |

---

## 📝 Next Steps

1. Run the diagnostic SQL queries
2. Add console.log statements to your fetch code
3. Check browser console for detailed errors
4. Verify properties table has data
5. Test with the browser console snippet above

---

**Status:** Troubleshooting Guide

**Priority:** 🔴 HIGH - Blocks home page listings
