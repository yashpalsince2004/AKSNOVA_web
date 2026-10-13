-- Migration: 20261013000000_make_email_nullable.sql
-- Description: Make email nullable in public.student_enquiries to support phone-only chatbot leads,
-- and ensure Row Level Security (RLS) is strictly enabled.

-- 1. Make email column nullable (backward-compatible; existing records remain untouched)
ALTER TABLE public.student_enquiries 
  ALTER COLUMN email DROP NOT NULL;

-- 2. Ensure RLS is active on public.student_enquiries
ALTER TABLE public.student_enquiries ENABLE ROW LEVEL SECURITY;

-- 3. Security guarantee:
-- Do NOT create anonymous SELECT, UPDATE, or DELETE policies.
-- Anonymous visitors and network inspectors cannot view, alter, or enumerate lead data.
-- Submissions are handled server-side via the Supabase Edge Function (`submit-enquiry`),
-- which uses the SUPABASE_SERVICE_ROLE_KEY to securely insert records bypassing RLS.

COMMENT ON TABLE public.student_enquiries IS 'Student career counselling and course enquiries from AKSNOVA chatbot';
COMMENT ON COLUMN public.student_enquiries.profession IS 'Normalized educational qualification: Graduate or above, Undergraduate, Class 12 or below';
COMMENT ON COLUMN public.student_enquiries.email IS 'Contact email address, nullable for telephone-only counselling leads';
