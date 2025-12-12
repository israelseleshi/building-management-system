# Fix: Document Type Dropdown Empty Issue

## Problem
The document type dropdown shows "Select a document type..." but doesn't populate with actual document types from the database.

## Root Cause
The RLS policy on the `document_types` table may not be allowing authenticated users to read the data.

## Solution

### Step 1: Run the RLS Fix SQL (2 minutes)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy and paste the entire content from `FIX_DOCUMENT_TYPES_RLS.sql`
3. Click **"Run"**
4. Verify you see output showing document types were inserted

### Step 2: Verify Document Types Exist

In Supabase SQL Editor, run:
```sql
SELECT id, name, is_required FROM public.document_types ORDER BY name;
```

You should see 8 document types:
- Trade License (Required)
- TIN Certificate (Required)
- Passport
- National ID
- Proof of Address
- Bank Statement
- Employment Letter
- Other

### Step 3: Check RLS Policies

In Supabase Dashboard → Authentication → Policies:
1. Go to `document_types` table
2. Verify policy `document_types_select_authenticated` exists
3. It should allow authenticated users to SELECT

### Step 4: Test in Browser

1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache if needed
3. Login as tenant
4. Go to Documents tab
5. The dropdown should now show all document types

---

## If Still Not Working

### Debug Steps:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Go to Console tab
   - Look for error messages about document_types

2. **Check Supabase Logs**
   - Go to Supabase Dashboard → Logs
   - Look for any RLS policy violations

3. **Verify RLS is Enabled**
   - Go to Supabase Dashboard → Tables
   - Click `document_types` table
   - Check "RLS Enabled" toggle is ON

4. **Check User Authentication**
   - Verify you're logged in as a tenant
   - Check auth token is valid

---

## What Was Fixed

### RLS Policy Change
**Before:**
```sql
CREATE POLICY "document_types_select_policy" ON public.document_types
  FOR SELECT
  USING (true);
```

**After:**
```sql
CREATE POLICY "document_types_select_authenticated" ON public.document_types
  FOR SELECT
  USING (auth.role() = 'authenticated');
```

This ensures only authenticated users can read document types, which is more secure.

---

## Document Types Available After Fix

| Name | Required | Description |
|------|----------|-------------|
| Trade License | ✅ Yes | Business trade license document |
| TIN Certificate | ✅ Yes | Tax Identification Number certificate |
| Passport | ❌ No | Passport copy for identification |
| National ID | ❌ No | National identification document |
| Proof of Address | ❌ No | Utility bill or lease agreement |
| Bank Statement | ❌ No | Recent bank statement (3 months) |
| Employment Letter | ❌ No | Employment verification letter |
| Other | ❌ No | Other relevant documents |

---

## Upload Flow After Fix

1. ✅ Select document type from dropdown
2. ✅ Choose PDF file (drag-drop or click)
3. ✅ Click "Upload Document"
4. ✅ See upload progress
5. ✅ Document appears in list with "pending" status
6. ✅ Landlord reviews and approves/rejects

---

## Testing Checklist

- [ ] Run FIX_DOCUMENT_TYPES_RLS.sql
- [ ] Verify 8 document types in database
- [ ] Hard refresh browser
- [ ] Login as tenant
- [ ] Navigate to Documents tab
- [ ] Dropdown shows all 8 document types
- [ ] Select a document type
- [ ] Upload a PDF file
- [ ] Document appears in list

---

## Still Having Issues?

If the dropdown is still empty after following these steps:

1. **Clear Supabase Cache**
   - Go to Supabase Dashboard
   - Click your project
   - Go to Settings → Database
   - Look for cache settings and clear if available

2. **Restart Dev Server**
   - Stop your dev server (Ctrl+C)
   - Run `npm run dev` again

3. **Check Network Tab**
   - Open DevTools → Network tab
   - Reload page
   - Look for request to `document_types`
   - Check response status (should be 200)
   - Check response body has data

4. **Verify Supabase Connection**
   - Check `.env.local` has correct Supabase URL and keys
   - Verify you're connected to the right Supabase project

---

## Quick Reference

**File to Run:** `FIX_DOCUMENT_TYPES_RLS.sql`
**Location:** Supabase SQL Editor
**Time:** 2 minutes
**Result:** Document types dropdown populated with 8 options
