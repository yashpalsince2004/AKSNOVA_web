-- Migration: 20261016120000_create_hiring_table.sql
-- Description: Create "Hiring" table to capture career and job application submissions (name, phone, qualification, role)

-- 1. Create the table with exact name "Hiring"
CREATE TABLE IF NOT EXISTS public."Hiring" (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  qualification text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public."Hiring" ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous applicants to submit applications via the public anon key
DROP POLICY IF EXISTS "Allow anonymous insert on Hiring" ON public."Hiring";
CREATE POLICY "Allow anonymous insert on Hiring"
  ON public."Hiring"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4. Comments for schema documentation
COMMENT ON TABLE public."Hiring" IS 'Applicant submissions from the Apply to Work with AKSNOVA form';
COMMENT ON COLUMN public."Hiring".name IS 'Applicant full name';
COMMENT ON COLUMN public."Hiring".phone IS 'Applicant 10-digit contact mobile number';
COMMENT ON COLUMN public."Hiring".qualification IS 'Applicant highest educational qualification';
COMMENT ON COLUMN public."Hiring".role IS 'Selected job role applied for';

-- 5. Lowercase alias table public.hiring for case-insensitive compatibility
CREATE TABLE IF NOT EXISTS public.hiring (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  qualification text NOT NULL,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.hiring ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert on hiring" ON public.hiring;
CREATE POLICY "Allow anonymous insert on hiring"
  ON public.hiring
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
