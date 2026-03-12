-- fix_pages_rls.sql
-- Run this in the Supabase SQL Editor to enable admin access for 100% of tables
-- https://supabase.com/dashboard/project/jwrhdpqivxhrhenufjtz/sql/new

-- 1. STABILIZE SCHEMA (Ensure columns exist for all operations)
DO $$ 
BEGIN 
    -- Teachers
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='section') THEN ALTER TABLE public.teachers ADD COLUMN section text DEFAULT 'Primary'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='class') THEN ALTER TABLE public.teachers ADD COLUMN "class" text; END IF;
    
    -- Subjects
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subjects' AND column_name='section') THEN ALTER TABLE public.subjects ADD COLUMN section text DEFAULT 'Primary'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='subjects' AND column_name='class') THEN ALTER TABLE public.subjects ADD COLUMN "class" text; END IF;
    
    -- Rooms
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rooms' AND column_name='section') THEN ALTER TABLE public.rooms ADD COLUMN section text DEFAULT 'Primary'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='rooms' AND column_name='class') THEN ALTER TABLE public.rooms ADD COLUMN "class" text; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE table_name='rooms' AND constraint_type='UNIQUE' AND constraint_name='rooms_name_key') THEN
        ALTER TABLE public.rooms ADD CONSTRAINT rooms_name_key UNIQUE (name);
    END IF;

    -- Pupils
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pupils' AND column_name='section') THEN ALTER TABLE public.pupils ADD COLUMN section text DEFAULT 'Primary'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pupils' AND column_name='class') THEN ALTER TABLE public.pupils ADD COLUMN "class" text; END IF;
    
    -- Time Slots
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='time_slots' AND column_name='section') THEN ALTER TABLE public.time_slots ADD COLUMN section text DEFAULT 'Primary'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='time_slots' AND column_name='class') THEN ALTER TABLE public.time_slots ADD COLUMN "class" text; END IF;
END $$;

-- 2. UNIVERSAL RLS FIX (Loop through all tables)
-- This ensures that ANY table added recently or in the past is fully open.
DO $$ 
DECLARE 
    t text;
BEGIN 
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        -- Drop old name patterns
        EXECUTE format('DROP POLICY IF EXISTS "Full access for everyone on %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow all for authenticated" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Enable all for %I" ON public.%I', t, t);
        -- Create new universal policy
        EXECUTE format('CREATE POLICY "Full access for everyone on %I" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)', t, t);
    END LOOP;
END $$;

-- 3. MISSION CRITICAL: Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
