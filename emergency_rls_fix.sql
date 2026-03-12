-- ==========================================================
-- EMERGENCY RLS BYPASS: ALL TABLES
-- ==========================================================
-- This script completely opens up permissions for the 
-- requested tables to stop the "Permission Denied" errors.
-- ==========================================================

DO $$ 
DECLARE 
    t text;
BEGIN 
    -- Target tables
    FOR t IN SELECT unnest(ARRAY['teachers', 'subjects', 'rooms', 'pupils', 'time_slots'])
    LOOP
        -- OPTION A: Disable RLS entirely for these tables (Most direct fix)
        EXECUTE format('ALTER TABLE public.%I DISABLE ROW LEVEL SECURITY', t);
        
        -- OPTION B: In case it's re-enabled, create a bypass policy
        EXECUTE format('DROP POLICY IF EXISTS "Full access for everyone on %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow all for authenticated" ON public.%I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Enable all for %I" ON public.%I', t, t);
        EXECUTE format('DROP POLICY IF EXISTS "admin_all_policy" ON public.%I', t);
        
        EXECUTE format('CREATE POLICY "Emergency Bypass %I" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)', t, t);
    END LOOP;
END $$;

-- Specifically for the 'rooms' table error message mention
ALTER TABLE IF EXISTS public.rooms DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for everyone on rooms" ON public.rooms;
CREATE POLICY "Full access for everyone on rooms" ON public.rooms FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- RELOAD SCHEMA
NOTIFY pgrst, 'reload schema';
