-- 1. Ensure columns exist to prevent schema cache errors across all major tables
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
    
    -- Pupils
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pupils' AND column_name='section') THEN ALTER TABLE public.pupils ADD COLUMN section text DEFAULT 'Primary'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pupils' AND column_name='class') THEN ALTER TABLE public.pupils ADD COLUMN "class" text; END IF;
    
    -- Time Slots
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='time_slots' AND column_name='section') THEN ALTER TABLE public.time_slots ADD COLUMN section text DEFAULT 'Primary'; END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='time_slots' AND column_name='class') THEN ALTER TABLE public.time_slots ADD COLUMN "class" text; END IF;
END $$;

-- 2. DROP old restrictive policies for the rooms table
DROP POLICY IF EXISTS "Admins manage rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can insert rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can update rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can delete rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated can view rooms" ON public.rooms;
DROP POLICY IF EXISTS "Rooms viewable by authenticated" ON public.rooms;
DROP POLICY IF EXISTS "Full access for everyone on rooms" ON public.rooms;

-- 3. Ensure RLS is enabled
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- 4. Create a NEW permissive policy for BOTH 'anon' and 'authenticated' roles.
CREATE POLICY "Full access for everyone on rooms" ON public.rooms 
  FOR ALL 
  TO anon, authenticated 
  USING (true) 
  WITH CHECK (true);

-- 5. Notify PostgREST to reload the schema and recognize the new columns/policies
NOTIFY pgrst, 'reload schema';
