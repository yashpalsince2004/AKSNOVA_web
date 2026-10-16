-- Migration: 20261016130000_create_query_table.sql
-- Description: Create "query" / "Query" table to capture submissions from the "Let's Connect And Plan Your Career Ahead" form

-- 1. Create the table public.query
CREATE TABLE IF NOT EXISTS public.query (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  number text NOT NULL,
  phone text,
  email text NOT NULL,
  query text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Ensure optional alias columns exist
ALTER TABLE public.query ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.query ADD COLUMN IF NOT EXISTS number text;

-- 2. Create public."Query" table for capitalized table access
CREATE TABLE IF NOT EXISTS public."Query" (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  number text NOT NULL,
  phone text,
  email text NOT NULL,
  query text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public."Query" ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public."Query" ADD COLUMN IF NOT EXISTS number text;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.query ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Query" ENABLE ROW LEVEL SECURITY;

-- 4. RLS policies allowing anonymous and authenticated inserts
DROP POLICY IF EXISTS "Allow anonymous insert on query" ON public.query;
CREATE POLICY "Allow anonymous insert on query"
  ON public.query
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anonymous insert on Query" ON public."Query";
CREATE POLICY "Allow anonymous insert on Query"
  ON public."Query"
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 5. Table grants
GRANT ALL ON public.query TO anon, authenticated, service_role;
GRANT ALL ON public."Query" TO anon, authenticated, service_role;

-- 6. Two-way sync trigger so data is present in both query and Query
CREATE OR REPLACE FUNCTION sync_query_tables()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF pg_trigger_depth() <= 1 THEN
    IF TG_OP = 'INSERT' THEN
      IF TG_TABLE_NAME = 'query' THEN
        INSERT INTO public."Query" (id, name, number, phone, email, query, created_at)
        VALUES (NEW.id, NEW.name, NEW.number, COALESCE(NEW.phone, NEW.number), NEW.email, NEW.query, NEW.created_at)
        ON CONFLICT (id) DO NOTHING;
      ELSIF TG_TABLE_NAME = 'Query' THEN
        INSERT INTO public.query (id, name, number, phone, email, query, created_at)
        VALUES (NEW.id, NEW.name, NEW.number, COALESCE(NEW.phone, NEW.number), NEW.email, NEW.query, NEW.created_at)
        ON CONFLICT (id) DO NOTHING;
      END IF;
    ELSIF TG_OP = 'DELETE' THEN
      IF TG_TABLE_NAME = 'query' THEN
        DELETE FROM public."Query" WHERE id = OLD.id;
      ELSIF TG_TABLE_NAME = 'Query' THEN
        DELETE FROM public.query WHERE id = OLD.id;
      END IF;
    ELSIF TG_OP = 'UPDATE' THEN
      IF TG_TABLE_NAME = 'query' THEN
        UPDATE public."Query"
        SET name = NEW.name, number = NEW.number, phone = COALESCE(NEW.phone, NEW.number), email = NEW.email, query = NEW.query, created_at = NEW.created_at
        WHERE id = NEW.id;
      ELSIF TG_TABLE_NAME = 'Query' THEN
        UPDATE public.query
        SET name = NEW.name, number = NEW.number, phone = COALESCE(NEW.phone, NEW.number), email = NEW.email, query = NEW.query, created_at = NEW.created_at
        WHERE id = NEW.id;
      END IF;
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_to_query_capital ON public.query;
CREATE TRIGGER trg_sync_to_query_capital
AFTER INSERT OR UPDATE OR DELETE ON public.query
FOR EACH ROW EXECUTE FUNCTION sync_query_tables();

DROP TRIGGER IF EXISTS trg_sync_to_query_lower ON public."Query";
CREATE TRIGGER trg_sync_to_query_lower
AFTER INSERT OR UPDATE OR DELETE ON public."Query";
CREATE TRIGGER trg_sync_to_query_lower
AFTER INSERT OR UPDATE OR DELETE ON public."Query"
FOR EACH ROW EXECUTE FUNCTION sync_query_tables();

COMMENT ON TABLE public.query IS 'Visitor query and career guidance requests from Let’s Connect And Plan Your Career Ahead form';
COMMENT ON TABLE public."Query" IS 'Visitor query and career guidance requests from Let’s Connect And Plan Your Career Ahead form (capital alias)';
