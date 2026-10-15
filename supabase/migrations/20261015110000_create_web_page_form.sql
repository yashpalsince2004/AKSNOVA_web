-- Migration: 20261015110000_create_web_page_form.sql
-- Description: Create "Web-page form" table to capture name, number, email, and query leads directly from web pages.

-- 1. Create the table with the exact requested name "Web-page form"
CREATE TABLE IF NOT EXISTS public."Web-page form" (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  number text,
  email text,
  query text,
  created_at timestamptz DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public."Web-page form" ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous visitors (and authenticated users) to submit inquiries via the public anon key
DROP POLICY IF EXISTS "Allow anonymous insert on Web-page form" ON public."Web-page form";
CREATE POLICY "Allow anonymous insert on Web-page form"
  ON public."Web-page form"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4. Prevent anonymous public reads/updates to protect visitor privacy
DROP POLICY IF EXISTS "Deny public select on Web-page form" ON public."Web-page form";

COMMENT ON TABLE public."Web-page form" IS 'Direct web page career consultation inquiries (name, number, email, query)';
COMMENT ON COLUMN public."Web-page form".name IS 'Visitor full name';
COMMENT ON COLUMN public."Web-page form".number IS 'Visitor 10-digit mobile number';
COMMENT ON COLUMN public."Web-page form".email IS 'Visitor email address';
COMMENT ON COLUMN public."Web-page form".query IS 'Visitor career questions, goals, or inquiries';

-- Also create snake_case alias table for compatibility
CREATE TABLE IF NOT EXISTS public.web_page_form (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  number text,
  email text,
  query text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.web_page_form ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert on web_page_form" ON public.web_page_form;
CREATE POLICY "Allow anonymous insert on web_page_form"
  ON public.web_page_form
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
