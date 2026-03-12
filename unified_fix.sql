-- ==========================================================
-- FINAL REINFORCED FIX: PERMISSIONS & SCHEMA
-- ==========================================================

-- 1. FORCE COLUMN ADDITIONS (Ensure they exist)
ALTER TABLE IF EXISTS public.teachers ADD COLUMN IF NOT EXISTS section text DEFAULT 'Primary';
ALTER TABLE IF EXISTS public.teachers ADD COLUMN IF NOT EXISTS "class" text;

ALTER TABLE IF EXISTS public.subjects ADD COLUMN IF NOT EXISTS section text DEFAULT 'Primary';
ALTER TABLE IF EXISTS public.subjects ADD COLUMN IF NOT EXISTS "class" text;

ALTER TABLE IF EXISTS public.rooms ADD COLUMN IF NOT EXISTS section text DEFAULT 'Primary';
ALTER TABLE IF EXISTS public.rooms ADD COLUMN IF NOT EXISTS "class" text;

ALTER TABLE IF EXISTS public.pupils ADD COLUMN IF NOT EXISTS section text DEFAULT 'Primary';
ALTER TABLE IF EXISTS public.pupils ADD COLUMN IF NOT EXISTS "class" text;

ALTER TABLE IF EXISTS public.time_slots ADD COLUMN IF NOT EXISTS section text DEFAULT 'Primary';
ALTER TABLE IF EXISTS public.time_slots ADD COLUMN IF NOT EXISTS "class" text;

-- 2. UNIVERSAL RLS RESET (Open everything)
DO $$ 
DECLARE 
    t text;
BEGIN 
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "Full access for everyone on %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow all for authenticated" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Enable all for %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "admin_all_policy" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow all" ON public.%I', t);
        
        EXECUTE format('CREATE POLICY "Full access for everyone on %I" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)', t, t);
    END LOOP;
END $$;

-- 3. MISSION CRITICAL: Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- 4. VERIFY POLICIES
SELECT table_name, policyname FROM pg_policies WHERE schemaname = 'public' AND table_name IN ('teachers', 'subjects', 'rooms', 'pupils', 'time_slots');
