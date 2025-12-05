# Quick SQL Reference - Cleanup & Leases

## 🚀 Quick Start

### 1️⃣ Delete All Tenants Except Two
```sql
DELETE FROM public.profiles 
WHERE role = 'tenant' 
AND full_name NOT IN ('Israel Theodros', 'Abel Theodor');
```

### 2️⃣ Get Required IDs
```sql
-- Get Israel Theodros ID
SELECT id FROM public.profiles WHERE full_name = 'Israel Theodros';

-- Get Abel Theodor ID
SELECT id FROM public.profiles WHERE full_name = 'Abel Theodor';

-- Get Israel Seleshi (owner) ID
SELECT id FROM public.profiles WHERE full_name = 'Israel Seleshi';

-- Get Property ID
SELECT id FROM public.properties LIMIT 1;
```

### 3️⃣ Create Leases
```sql
-- Replace XXXXX with actual UUIDs from step 2

-- Lease 1: Israel Theodros
INSERT INTO public.leases (property_id, landlord_id, tenant_id, monthly_rent, status, start_date, end_date, is_active)
VALUES ('PROPERTY_ID', 'OWNER_ID', 'ISRAEL_THEODROS_ID', 5000, 'active', '2025-01-01', '2026-01-01', true);

-- Lease 2: Abel Theodor
INSERT INTO public.leases (property_id, landlord_id, tenant_id, monthly_rent, status, start_date, end_date, is_active)
VALUES ('PROPERTY_ID', 'OWNER_ID', 'ABEL_THEODOR_ID', 5000, 'active', '2025-01-01', '2026-01-01', true);
```

### 4️⃣ Verify
```sql
SELECT 
  p1.full_name as landlord,
  p2.full_name as tenant,
  l.monthly_rent,
  l.status
FROM public.leases l
JOIN public.profiles p1 ON l.landlord_id = p1.id
JOIN public.profiles p2 ON l.tenant_id = p2.id;
```

---

## 📋 Copy-Paste Template

**Step 1:** Run these to get IDs:
```sql
SELECT id, full_name FROM public.profiles WHERE full_name IN ('Israel Theodros', 'Abel Theodor', 'Israel Seleshi');
SELECT id FROM public.properties LIMIT 1;
```

**Step 2:** Copy the IDs and paste into this template:
```sql
DELETE FROM public.profiles WHERE role = 'tenant' AND full_name NOT IN ('Israel Theodros', 'Abel Theodor');

INSERT INTO public.leases (property_id, landlord_id, tenant_id, monthly_rent, status, start_date, end_date, is_active) VALUES ('PROP_ID', 'OWNER_ID', 'ISRAEL_ID', 5000, 'active', '2025-01-01', '2026-01-01', true);
INSERT INTO public.leases (property_id, landlord_id, tenant_id, monthly_rent, status, start_date, end_date, is_active) VALUES ('PROP_ID', 'OWNER_ID', 'ABEL_ID', 5000, 'active', '2025-01-01', '2026-01-01', true);
```

---

## ✅ What to Expect

After running these queries:

| What | Before | After |
|------|--------|-------|
| Tenant profiles | 8 | 2 |
| Leases | 0 | 2 |
| Chat tenants visible | None | 2 |

---

## 🔍 Verification Queries

Check if deletion worked:
```sql
SELECT COUNT(*) FROM public.profiles WHERE role = 'tenant';
-- Should return: 2
```

Check if leases created:
```sql
SELECT COUNT(*) FROM public.leases;
-- Should return: 2
```

Check lease details:
```sql
SELECT l.id, p1.full_name, p2.full_name, l.status 
FROM public.leases l
JOIN public.profiles p1 ON l.landlord_id = p1.id
JOIN public.profiles p2 ON l.tenant_id = p2.id;
```

---

## ⚠️ Important

- **Backup first** - These changes are permanent
- **Replace placeholders** - Don't forget to replace XXXXX with actual UUIDs
- **Run in order** - Delete first, then create leases
- **Verify each step** - Use verification queries to confirm

---

## 📁 Full Documentation

See `CLEANUP_LEASES_GUIDE.md` for detailed step-by-step instructions.

---

**Ready to execute!** ✅
