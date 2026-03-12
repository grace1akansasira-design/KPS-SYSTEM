-- 1. Ensure columns exist (Fix schema cache error)
DO $$ 
BEGIN 
    -- Teachers
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='section') THEN
        ALTER TABLE public.teachers ADD COLUMN section text DEFAULT 'Primary';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='teachers' AND column_name='class') THEN
        ALTER TABLE public.teachers ADD COLUMN "class" text;
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

    -- Time Slots
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='time_slots' AND column_name='section') THEN
        ALTER TABLE public.time_slots ADD COLUMN section text DEFAULT 'Primary';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='time_slots' AND column_name='class') THEN
        ALTER TABLE public.time_slots ADD COLUMN "class" text;
    END IF;
END $$;

-- 2. Update RLS policies to allow EVERYTHING for both 'anon' and 'authenticated'
-- This is a development-friendly fix that "clears" all RLS blocks.

-- First, drop ALL possible conflicting policies
DROP POLICY IF EXISTS "Admins manage teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow anon teachers CRUD" ON public.teachers;
DROP POLICY IF EXISTS "Authenticated users can insert teachers" ON public.teachers;
DROP POLICY IF EXISTS "Authenticated users can update teachers" ON public.teachers;
DROP POLICY IF EXISTS "Authenticated users can delete teachers" ON public.teachers;

DROP POLICY IF EXISTS "Admins manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Allow anon subjects CRUD" ON public.subjects;
DROP POLICY IF EXISTS "Authenticated users can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Authenticated users can update subjects" ON public.subjects;
DROP POLICY IF EXISTS "Authenticated users can delete subjects" ON public.subjects;

DROP POLICY IF EXISTS "Admins manage rooms" ON public.rooms;
DROP POLICY IF EXISTS "Allow anon rooms CRUD" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can insert rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can update rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can delete rooms" ON public.rooms;

DROP POLICY IF EXISTS "Admins manage pupils" ON public.pupils;
DROP POLICY IF EXISTS "Allow anon pupils CRUD" ON public.pupils;
DROP POLICY IF EXISTS "Authenticated users can insert pupils" ON public.pupils;
DROP POLICY IF EXISTS "Authenticated users can update pupils" ON public.pupils;
DROP POLICY IF EXISTS "Authenticated users can delete pupils" ON public.pupils;

DROP POLICY IF EXISTS "Admins manage time slots" ON public.time_slots;
DROP POLICY IF EXISTS "Allow anon time_slots CRUD" ON public.time_slots;
DROP POLICY IF EXISTS "Authenticated users can insert time_slots" ON public.time_slots;
DROP POLICY IF EXISTS "Authenticated users can update time_slots" ON public.time_slots;
DROP POLICY IF EXISTS "Authenticated users can delete time_slots" ON public.time_slots;

-- Enable RLS (ensures it is on)
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pupils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_slots ENABLE ROW LEVEL SECURITY;

-- Create ALL-ACCESS policies for both anon and authenticated
CREATE POLICY "Full access for everyone on teachers" ON public.teachers FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for everyone on subjects" ON public.subjects FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for everyone on rooms" ON public.rooms FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for everyone on pupils" ON public.pupils FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Full access for everyone on time_slots" ON public.time_slots FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 3. Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
