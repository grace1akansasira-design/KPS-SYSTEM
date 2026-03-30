-- KPS SYSTEM: CONSOLIDATED FIX AND UPDATE
-- Run this in your Supabase SQL Editor to allow data fetching and adding.

-- 1. Ensure tables exist (Basic survival check)
CREATE TABLE IF NOT EXISTS public.teachers (id uuid DEFAULT gen_random_uuid(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS public.subjects (id uuid DEFAULT gen_random_uuid(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS public.pupils (id uuid DEFAULT gen_random_uuid(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS public.rooms (id uuid DEFAULT gen_random_uuid(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS public.time_slots (id uuid DEFAULT gen_random_uuid(), created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS public.notifications (id uuid DEFAULT gen_random_uuid(), created_at timestamptz DEFAULT now());

-- 2. Add missing columns (Fix schema matching)
DO $$ 
BEGIN 
    -- Teachers
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='section') THEN
        ALTER TABLE public.teachers ADD COLUMN section text DEFAULT 'Primary';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='status') THEN
        ALTER TABLE public.teachers ADD COLUMN status text DEFAULT 'active';
    END IF;

    -- Subjects
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subjects' AND column_name='section') THEN
        ALTER TABLE public.subjects ADD COLUMN section text DEFAULT 'Primary';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subjects' AND column_name='class') THEN
        ALTER TABLE public.subjects ADD COLUMN "class" text;
    END IF;

    -- Pupils
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pupils' AND column_name='section') THEN
        ALTER TABLE public.pupils ADD COLUMN section text DEFAULT 'Primary';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pupils' AND column_name='class') THEN
        ALTER TABLE public.pupils ADD COLUMN "class" text;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pupils' AND column_name='pupil_id') THEN
        ALTER TABLE public.pupils ADD COLUMN pupil_id text;
    END IF;

    -- Time Slots
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='time_slots' AND column_name='section') THEN
        ALTER TABLE public.time_slots ADD COLUMN section text DEFAULT 'Primary';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='time_slots' AND column_name='class') THEN
        ALTER TABLE public.time_slots ADD COLUMN "class" text;
    END IF;

    -- Notifications
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notifications' AND column_name='title') THEN
        ALTER TABLE public.notifications ADD COLUMN title text, ADD COLUMN message text, ADD COLUMN type text DEFAULT 'info', ADD COLUMN read boolean DEFAULT false;
    END IF;
END $$;

-- 3. Reset RLS (Allow data to be fetched and added without blocks)
-- This clears all existing rules and creates a fresh "EVERYONE ACCESS" rule.

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(t) || ' ENABLE ROW LEVEL SECURITY';
        EXECUTE 'DROP POLICY IF EXISTS "allow_full_access" ON public.' || quote_ident(t);
        EXECUTE 'CREATE POLICY "allow_full_access" ON public.' || quote_ident(t) || ' FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)';
    END LOOP;
END $$;

-- 4. Grant Permissions (Final permissions check)
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, postgres, service_role;

-- 5. Reload Schema cache
NOTIFY pgrst, 'reload schema';

COMMIT;
