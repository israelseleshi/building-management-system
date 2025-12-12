I'll provide you with a comprehensive guide on implementing the PDF document upload feature for tenants using Supabase. Let me create a detailed implementation plan.

# PDF Document Upload Feature Implementation Guide

Based on your project structure, here's a complete guide to implement the tenant document upload feature using Supabase:

## 1. **Supabase Storage Setup**

### Create a Storage Bucket
- Go to your Supabase dashboard → **Storage**
- Create a new bucket named `tenant-documents`
- Set it as **Private** (not public) for security
- Configure the bucket to allow PDF uploads only

### Storage Policies (RLS)

Go to **Storage** → **tenant-documents** → **Policies** and add these policies:

```sql
-- Policy 1: Tenants can UPLOAD documents to their own folder
CREATE POLICY "tenant_upload_policy" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'tenant-documents' AND
    auth.uid()::text = (storage.foldername(name))[1] AND
    (storage.filename(name))::text ~* '\.(pdf)$'
  );

-- Policy 2: Tenants can READ their own documents
CREATE POLICY "tenant_read_own_policy" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'tenant-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Landlords can READ documents from their tenants
CREATE POLICY "landlord_read_policy" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'tenant-documents' AND
    EXISTS (
      SELECT 1 FROM public.tenant_documents td
      WHERE td.file_path = name
      AND td.landlord_id = auth.uid()
    )
  );

-- Policy 4: Tenants can DELETE their own documents
CREATE POLICY "tenant_delete_policy" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'tenant-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 5: Landlords can DELETE documents
CREATE POLICY "landlord_delete_policy" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'tenant-documents' AND
    EXISTS (
      SELECT 1 FROM public.tenant_documents td
      WHERE td.file_path = name
      AND td.landlord_id = auth.uid()
    )
  );
```

### Storage Folder Structure:
Files should be organized as: `{tenant_id}/{document_type}/{filename}.pdf`

Example: `550e8400-e29b-41d4-a716-446655440000/trade_license/trade_license_2024.pdf`

### Storage Policies Explanation:

| Policy | Action | Who | Condition |
|--------|--------|-----|-----------|
| tenant_upload_policy | INSERT | Tenants | Can upload PDFs only to their own folder |
| tenant_read_own_policy | SELECT | Tenants | Can read files in their own folder |
| landlord_read_policy | SELECT | Landlords | Can read documents linked to them in DB |
| tenant_delete_policy | DELETE | Tenants | Can delete files in their own folder |
| landlord_delete_policy | DELETE | Landlords | Can delete documents linked to them in DB |

---

## 2. **Database Schema Changes**

### Create `document_types` Table (Reference Data)

```sql
CREATE TABLE public.document_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  description text,
  is_required boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT document_types_pkey PRIMARY KEY (id),
  CONSTRAINT document_types_name_unique UNIQUE (name)
);

-- Enable RLS
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read document types (public reference data)
CREATE POLICY "document_types_select_policy" ON public.document_types
  FOR SELECT
  USING (true);
```

### Create `tenant_documents` Table (Main Documents Table)

```sql
CREATE TABLE public.tenant_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  landlord_id uuid NOT NULL,
  document_type_id uuid NOT NULL,
  file_name character varying NOT NULL,
  file_path character varying NOT NULL,
  file_size integer NOT NULL,
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[])),
  rejection_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tenant_documents_pkey PRIMARY KEY (id),
  CONSTRAINT tenant_documents_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT tenant_documents_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT tenant_documents_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.document_types(id) ON DELETE RESTRICT
);

-- Enable RLS
ALTER TABLE public.tenant_documents ENABLE ROW LEVEL SECURITY;

-- Policy 1: Tenants can INSERT their own documents
CREATE POLICY "tenant_documents_insert_policy" ON public.tenant_documents
  FOR INSERT
  WITH CHECK (
    auth.uid() = tenant_id AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'tenant')
  );

-- Policy 2: Tenants can SELECT their own documents
CREATE POLICY "tenant_documents_select_own_policy" ON public.tenant_documents
  FOR SELECT
  USING (
    auth.uid() = tenant_id
  );

-- Policy 3: Landlords can SELECT documents from their tenants
CREATE POLICY "tenant_documents_select_landlord_policy" ON public.tenant_documents
  FOR SELECT
  USING (
    auth.uid() = landlord_id
  );

-- Policy 4: Tenants can UPDATE their own documents (only if status is pending or rejected)
CREATE POLICY "tenant_documents_update_tenant_policy" ON public.tenant_documents
  FOR UPDATE
  USING (
    auth.uid() = tenant_id AND
    status IN ('pending', 'rejected')
  )
  WITH CHECK (
    auth.uid() = tenant_id AND
    status IN ('pending', 'rejected')
  );

-- Policy 5: Landlords can UPDATE documents (approve/reject)
CREATE POLICY "tenant_documents_update_landlord_policy" ON public.tenant_documents
  FOR UPDATE
  USING (
    auth.uid() = landlord_id
  )
  WITH CHECK (
    auth.uid() = landlord_id
  );

-- Policy 6: Tenants can DELETE their own documents (only if pending or rejected)
CREATE POLICY "tenant_documents_delete_tenant_policy" ON public.tenant_documents
  FOR DELETE
  USING (
    auth.uid() = tenant_id AND
    status IN ('pending', 'rejected')
  );

-- Policy 7: Landlords can DELETE documents
CREATE POLICY "tenant_documents_delete_landlord_policy" ON public.tenant_documents
  FOR DELETE
  USING (
    auth.uid() = landlord_id
  );
```

### RLS Policies Explanation:

| Policy | Action | Who | Condition |
|--------|--------|-----|-----------|
| tenant_documents_insert_policy | INSERT | Tenants | Can only insert documents for themselves |
| tenant_documents_select_own_policy | SELECT | Tenants | Can view their own documents |
| tenant_documents_select_landlord_policy | SELECT | Landlords | Can view documents from their tenants |
| tenant_documents_update_tenant_policy | UPDATE | Tenants | Can update only pending/rejected documents |
| tenant_documents_update_landlord_policy | UPDATE | Landlords | Can update any documents (approve/reject) |
| tenant_documents_delete_tenant_policy | DELETE | Tenants | Can delete only pending/rejected documents |
| tenant_documents_delete_landlord_policy | DELETE | Landlords | Can delete any documents |

### Schema Notes & Changes from Original Plan:
- **document_type_id**: Changed from TEXT to UUID foreign key for better data integrity (references document_types table)
- **rejection_reason**: Renamed from "notes" for clarity
- **upload_date**: Removed (use created_at instead)
- **ON DELETE CASCADE**: Ensures documents are deleted if tenant/landlord is deleted
- **Status CHECK constraint**: Enforces only valid statuses at database level
- **file_size**: Stored in bytes for accurate tracking

---

## 3. **Frontend Components Needed**

### New Components to Create:

**`TenantDocumentUpload.tsx`** - Main upload component
- File input for PDF selection
- Document type selector dropdown
- Upload progress indicator
- Validation (file size, type, etc.)
- Success/error messages

**`DocumentList.tsx`** - Display uploaded documents
- List of uploaded documents with status badges
- Download button for each document
- Delete button (for pending/rejected only)
- Status indicators (pending, approved, rejected)

**`DocumentViewer.tsx`** - Preview/view documents
- Embed PDF viewer or link to download
- Show document metadata (upload date, size, status)

**`LandlordDocumentReview.tsx`** - For landlords
- List of tenant documents awaiting review
- Approve/Reject buttons
- Add notes/comments field
- Filter by tenant or document type

---

## 4. **Where to Add UI in Your Project**

### For Tenants:
- Add a new tab in **Tenant Dashboard Sidebar**: "Documents" or "My Documents"
- Create route: `/tenant-dashboard/documents`
- Display upload form + document list

### For Landlords:
- Add a new tab in **Landlord Dashboard Sidebar**: "Tenant Documents" or "Document Review"
- Create route: `/dashboard/documents`
- Show pending documents for review

---

## 5. **API/Backend Logic Needed**

### API Routes to Create:

**`/api/documents/upload`** (POST)
- Validate file (PDF only, max 10MB)
- Upload to Supabase Storage
- Create database record
- Return file path and metadata

**`/api/documents/list`** (GET)
- Get documents for current user (tenant or landlord)
- Filter by status, document type, date range
- Return paginated results

**`/api/documents/delete`** (DELETE)
- Delete document from storage and database
- Only allow if user owns it or is landlord

**`/api/documents/approve`** (PATCH)
- Update document status to "approved"
- Only landlords can approve

**`/api/documents/reject`** (PATCH)
- Update document status to "rejected"
- Add rejection reason/notes
- Only landlords can reject

**`/api/documents/download`** (GET)
- Generate signed URL for document download
- Verify user has permission

---

## 6. **Key Implementation Steps**

### Step 1: Supabase Configuration
- Enable Storage in your Supabase project
- Create bucket and set RLS policies
- Create database tables

### Step 2: Environment Variables
Add to [.env.local](cci:7://file:///c:/Users/ISUG/Documents/BMS/building-management-system/.env.local:0:0-0:0):
```
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=tenant-documents
NEXT_PUBLIC_MAX_FILE_SIZE=10485760 (10MB in bytes)
```

### Step 3: Create Utility Functions
- `uploadDocument()` - Handle file upload to Supabase Storage
- `deleteDocument()` - Remove file from storage
- `getSignedUrl()` - Generate temporary download links
- `validateFile()` - Check file type and size

### Step 4: Frontend Integration
- Add document upload form to tenant dashboard
- Add document review panel to landlord dashboard
- Implement real-time status updates

### Step 5: Security Considerations
- Validate file types on backend (not just frontend)
- Implement file size limits
- Use RLS policies to prevent unauthorized access
- Generate signed URLs with expiration for downloads
- Scan uploaded files for malware (optional but recommended)

---

## 7. **User Flow**

### Tenant Flow:
1. Navigate to "My Documents" tab
2. Click "Upload Document"
3. Select document type from dropdown
4. Choose PDF file
5. Click upload
6. See upload progress
7. Document appears in list with "pending" status
8. Wait for landlord approval

### Landlord Flow:
1. Navigate to "Tenant Documents" tab
2. See list of pending documents
3. Click on document to review
4. Download/preview PDF
5. Click "Approve" or "Reject"
6. If rejecting, add reason/notes
7. Document status updates

---

## 8. **Database Queries You'll Need**

- Get all documents for a tenant
- Get all pending documents for a landlord
- Get documents by status and date range
- Count documents by type and status
- Get documents for a specific lease/property

---

## 9. **Additional Features (Optional)**

- **Document expiration**: Set expiry dates for documents
- **Bulk upload**: Allow uploading multiple documents at once
- **Document templates**: Provide downloadable templates
- **Notifications**: Notify tenants when documents are approved/rejected
- **Audit trail**: Track all document actions (upload, approval, deletion)
- **Email notifications**: Send emails when documents need attention

---

## 10. **Testing Checklist**

- Test file upload with valid PDF
- Test file rejection (wrong format, too large)
- Test RLS policies (tenant can't see other tenant's docs)
- Test landlord approval/rejection workflow
- Test document deletion
- Test download functionality
- Test concurrent uploads
- Test with various file sizes

---

This is the complete roadmap. Would you like me to start implementing any specific part of this?

---

## 11. **Complete SQL Initialization Script**

Run this complete script in your Supabase SQL Editor to set up all tables and policies:

```sql
-- ============================================
-- DOCUMENT TYPES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.document_types (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name character varying NOT NULL,
  description text,
  is_required boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT document_types_pkey PRIMARY KEY (id),
  CONSTRAINT document_types_name_unique UNIQUE (name)
);

ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "document_types_select_policy" ON public.document_types
  FOR SELECT
  USING (true);

-- ============================================
-- TENANT DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.tenant_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  landlord_id uuid NOT NULL,
  document_type_id uuid NOT NULL,
  file_name character varying NOT NULL,
  file_path character varying NOT NULL,
  file_size integer NOT NULL,
  status character varying NOT NULL DEFAULT 'pending'::character varying CHECK (status::text = ANY (ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying]::text[])),
  rejection_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tenant_documents_pkey PRIMARY KEY (id),
  CONSTRAINT tenant_documents_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT tenant_documents_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT tenant_documents_document_type_id_fkey FOREIGN KEY (document_type_id) REFERENCES public.document_types(id) ON DELETE RESTRICT
);

ALTER TABLE public.tenant_documents ENABLE ROW LEVEL SECURITY;

-- Tenant INSERT policy
CREATE POLICY "tenant_documents_insert_policy" ON public.tenant_documents
  FOR INSERT
  WITH CHECK (
    auth.uid() = tenant_id AND
    auth.uid() IN (SELECT id FROM public.profiles WHERE role = 'tenant')
  );

-- Tenant SELECT own documents
CREATE POLICY "tenant_documents_select_own_policy" ON public.tenant_documents
  FOR SELECT
  USING (auth.uid() = tenant_id);

-- Landlord SELECT documents from their tenants
CREATE POLICY "tenant_documents_select_landlord_policy" ON public.tenant_documents
  FOR SELECT
  USING (auth.uid() = landlord_id);

-- Tenant UPDATE (only pending/rejected)
CREATE POLICY "tenant_documents_update_tenant_policy" ON public.tenant_documents
  FOR UPDATE
  USING (
    auth.uid() = tenant_id AND
    status IN ('pending', 'rejected')
  )
  WITH CHECK (
    auth.uid() = tenant_id AND
    status IN ('pending', 'rejected')
  );

-- Landlord UPDATE (approve/reject)
CREATE POLICY "tenant_documents_update_landlord_policy" ON public.tenant_documents
  FOR UPDATE
  USING (auth.uid() = landlord_id)
  WITH CHECK (auth.uid() = landlord_id);

-- Tenant DELETE (only pending/rejected)
CREATE POLICY "tenant_documents_delete_tenant_policy" ON public.tenant_documents
  FOR DELETE
  USING (
    auth.uid() = tenant_id AND
    status IN ('pending', 'rejected')
  );

-- Landlord DELETE
CREATE POLICY "tenant_documents_delete_landlord_policy" ON public.tenant_documents
  FOR DELETE
  USING (auth.uid() = landlord_id);

-- ============================================
-- INSERT SAMPLE DOCUMENT TYPES
-- ============================================
INSERT INTO public.document_types (name, description, is_required) VALUES
  ('Trade License', 'Business trade license document', true),
  ('TIN Certificate', 'Tax Identification Number certificate', true),
  ('Passport', 'Passport copy for identification', false),
  ('National ID', 'National identification document', false),
  ('Proof of Address', 'Utility bill or lease agreement', false),
  ('Bank Statement', 'Recent bank statement (3 months)', false),
  ('Employment Letter', 'Employment verification letter', false),
  ('Other', 'Other relevant documents', false)
ON CONFLICT (name) DO NOTHING;
```

---

## 12. **Storage Bucket Setup Instructions**

### Step-by-Step Storage Configuration:

1. **Create Bucket**
   - Go to Supabase Dashboard → Storage
   - Click "New Bucket"
   - Name: `tenant-documents`
   - Uncheck "Public bucket" (keep it private)
   - Click "Create bucket"

2. **Add Storage Policies**
   - Click on `tenant-documents` bucket
   - Go to "Policies" tab
   - Click "New Policy" and add each policy from Section 1 above

3. **Verify Bucket Settings**
   - File size limit: 10 MB (or your preferred limit)
   - Allowed file types: `.pdf` only
   - Auto-delete old files: Optional (set retention policy if needed)

---

## 13. **Summary of Changes from Original Schema**

### New Tables Added:
1. **document_types** - Reference table for document categories
2. **tenant_documents** - Main table storing document metadata and status

### Key Design Decisions:
| Aspect | Decision | Reason |
|--------|----------|--------|
| document_type_id | UUID FK instead of TEXT | Data integrity & easier to manage |
| rejection_reason | TEXT field | Allow landlords to explain rejections |
| file_path | VARCHAR | Store full path for Storage access |
| file_size | INTEGER | Track file sizes for quota management |
| status | CHECK constraint | Enforce valid statuses at DB level |
| ON DELETE CASCADE | For tenant/landlord | Auto-cleanup if user deleted |
| ON DELETE RESTRICT | For document_type | Prevent accidental type deletion |

### No Conflicts with Existing Schema:
- ✅ Uses existing `profiles` table (no changes needed)
- ✅ No conflicts with `leases`, `properties`, or other tables
- ✅ Follows same naming conventions and patterns
- ✅ Compatible with existing RLS structure

---

## 14. **Implementation Checklist**

### Phase 1: Database Setup
- [ ] Run SQL initialization script in Supabase SQL Editor
- [ ] Verify `document_types` table created with sample data
- [ ] Verify `tenant_documents` table created
- [ ] Test RLS policies (try SELECT as different users)
- [ ] Verify foreign key constraints work

### Phase 2: Storage Setup
- [ ] Create `tenant-documents` bucket in Supabase Storage
- [ ] Add all 5 storage RLS policies
- [ ] Test upload with valid PDF (should succeed)
- [ ] Test upload with non-PDF (should fail)
- [ ] Test upload to different folder (should fail if not own folder)

### Phase 3: Backend API Routes
- [ ] Create `/api/documents/upload` endpoint
- [ ] Create `/api/documents/list` endpoint
- [ ] Create `/api/documents/delete` endpoint
- [ ] Create `/api/documents/approve` endpoint
- [ ] Create `/api/documents/reject` endpoint
- [ ] Create `/api/documents/download` endpoint
- [ ] Add file validation (PDF only, max 10MB)
- [ ] Add error handling and logging

### Phase 4: Frontend Components
- [ ] Create `TenantDocumentUpload.tsx` component
- [ ] Create `DocumentList.tsx` component
- [ ] Create `DocumentViewer.tsx` component
- [ ] Create `LandlordDocumentReview.tsx` component
- [ ] Add "Documents" tab to tenant dashboard sidebar
- [ ] Add "Tenant Documents" tab to landlord dashboard sidebar
- [ ] Create `/tenant-dashboard/documents` route
- [ ] Create `/dashboard/documents` route

### Phase 5: Integration & Testing
- [ ] Test tenant upload workflow
- [ ] Test landlord review workflow
- [ ] Test approval/rejection workflow
- [ ] Test document deletion
- [ ] Test RLS policies (cross-user access)
- [ ] Test file download with signed URLs
- [ ] Test error scenarios
- [ ] Test with various file sizes

### Phase 6: Security & Optimization
- [ ] Implement file scanning (optional)
- [ ] Add rate limiting to upload endpoint
- [ ] Add audit logging
- [ ] Optimize queries with indexes
- [ ] Test concurrent uploads
- [ ] Review all RLS policies

---

## 15. **Quick Reference: File Paths**

When uploading files, use this structure:

```
tenant-documents/
├── {tenant_id}/
│   ├── trade_license/
│   │   └── trade_license_2024.pdf
│   ├── tin_certificate/
│   │   └── tin_cert_2024.pdf
│   └── passport/
│       └── passport_scan.pdf
└── {another_tenant_id}/
    └── ...
```

Example full path: `550e8400-e29b-41d4-a716-446655440000/trade_license/trade_license_2024.pdf`

---

## 16. **Environment Variables to Add**

Add these to your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=tenant-documents
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_DOCUMENT_UPLOAD_TIMEOUT=30000
```

---

## 17. **Database Indexes (Optional but Recommended)**

For better query performance, add these indexes:

```sql
-- Index for tenant documents lookup
CREATE INDEX idx_tenant_documents_tenant_id ON public.tenant_documents(tenant_id);
CREATE INDEX idx_tenant_documents_landlord_id ON public.tenant_documents(landlord_id);
CREATE INDEX idx_tenant_documents_status ON public.tenant_documents(status);
CREATE INDEX idx_tenant_documents_created_at ON public.tenant_documents(created_at DESC);

-- Composite index for common queries
CREATE INDEX idx_tenant_documents_tenant_status ON public.tenant_documents(tenant_id, status);
CREATE INDEX idx_tenant_documents_landlord_status ON public.tenant_documents(landlord_id, status);
```

---

## 18. **Common Queries You'll Need**

```sql
-- Get all documents for a tenant
SELECT * FROM public.tenant_documents 
WHERE tenant_id = 'user-id' 
ORDER BY created_at DESC;

-- Get pending documents for a landlord
SELECT td.*, dt.name as document_type_name, p.full_name as tenant_name
FROM public.tenant_documents td
JOIN public.document_types dt ON td.document_type_id = dt.id
JOIN public.profiles p ON td.tenant_id = p.id
WHERE td.landlord_id = 'landlord-id' AND td.status = 'pending'
ORDER BY td.created_at DESC;

-- Get document statistics
SELECT 
  status,
  COUNT(*) as count,
  SUM(file_size) as total_size
FROM public.tenant_documents
WHERE landlord_id = 'landlord-id'
GROUP BY status;

-- Get documents by type
SELECT dt.name, COUNT(*) as count
FROM public.tenant_documents td
JOIN public.document_types dt ON td.document_type_id = dt.id
WHERE td.tenant_id = 'tenant-id'
GROUP BY dt.name;
```

---

## 19. **Error Handling Best Practices**

When implementing the API routes, handle these errors:

```
- File too large (> 10MB)
- Invalid file type (not PDF)
- Unauthorized access (RLS violation)
- Storage quota exceeded
- Database constraint violation
- File already exists
- Document type not found
- User not authenticated
- Concurrent upload conflict
```

---

## 20. **Next Steps**

1. **Run the SQL script** (Section 11) in Supabase SQL Editor
2. **Set up Storage bucket** (Section 13)
3. **Create API routes** (Section 5)
4. **Build frontend components** (Section 3)
5. **Test thoroughly** (Section 14)
6. **Deploy and monitor**

---

**Implementation Status**: Ready to code 