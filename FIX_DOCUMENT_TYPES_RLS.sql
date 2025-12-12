-- FIX: Document Types RLS Policy
-- Run this in Supabase SQL Editor to fix the document type dropdown issue

-- Step 1: Drop existing policies if they exist
DROP POLICY IF EXISTS "document_types_select_policy" ON public.document_types;

-- Step 2: Enable RLS (if not already enabled)
ALTER TABLE public.document_types ENABLE ROW LEVEL SECURITY;

-- Step 3: Create a new policy that allows authenticated users to read
CREATE POLICY "document_types_select_authenticated" ON public.document_types
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Step 4: Verify the table has data
SELECT COUNT(*) as total_document_types FROM public.document_types;

-- Step 5: If no data, insert the document types
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

-- Step 6: Verify the data was inserted
SELECT id, name, is_required FROM public.document_types ORDER BY name;
