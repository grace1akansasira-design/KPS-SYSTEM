-- ==========================================================
-- MASTER FIX & RESTORE SCRIPT
-- ==========================================================
-- This script fixes RLS, stabilizes the schema, and restores 
-- all data to its "Morning State".
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/jwrhdpqivxhrhenufjtz/sql/new
-- ==========================================================

-- 1. STABILIZE SCHEMA (Ensure columns exist)
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
    -- Add unique constraint to name for upserting
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

-- 2. RESET RLS POLICIES (Allow everyone for development)
-- This clears all "violate row-level security policy" errors.

DO $$ 
DECLARE 
    t text;
BEGIN 
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
        EXECUTE format('DROP POLICY IF EXISTS "Full access for everyone on %I" ON public.%I', t, t);
        EXECUTE format('CREATE POLICY "Full access for everyone on %I" ON public.%I FOR ALL TO anon, authenticated USING (true) WITH CHECK (true)', t, t);
    END LOOP;
END $$;

-- 3. RESTORE DATA (Morning State)

-- Teachers
INSERT INTO public.teachers (name, email, phone, class, section, status, subjects)
VALUES 
('Mrs. Musisi Sarah', 'musisi@kps.ac.ug', '0701112223', 'Baby', 'Nursery', 'active', '{"Literacy", "Numbers"}'),
('Teacher Monica', 'monica@kps.ac.ug', '+256702222222', 'Middle', 'Nursery', 'active', '{"Songs", "Play"}'),
('Teacher Grace', 'grace@kps.ac.ug', '+256703333333', 'Top', 'Nursery', 'active', '{"Writing", "Drawing"}'),
('Mr. Robert Mukasa', 'robert@kps.ac.ug', '0704445556', 'Primary 1', 'Primary', 'active', '{"Mathematics", "English"}'),
('Mr. Kato John', 'kato@kps.ac.ug', '0702223334', 'Middle', 'Nursery', 'active', '{"Songs", "Play"}')
ON CONFLICT (email) DO UPDATE SET 
    name = EXCLUDED.name, phone = EXCLUDED.phone, class = EXCLUDED.class, section = EXCLUDED.section, status = EXCLUDED.status, subjects = EXCLUDED.subjects;

-- Subjects
INSERT INTO public.subjects (code, name, class, section, periods_per_week, pupils, teacher, term)
VALUES 
('NUR-01', 'Play & Discovery', 'Baby', 'Nursery', 5, 20, 'Mrs. Musisi Sarah', 'Term 1'),
('NUR-02', 'Numbers & Shapes', 'Middle', 'Nursery', 5, 25, 'Teacher Monica', 'Term 1'),
('NUR-03', 'Reading Readiness', 'Top', 'Nursery', 5, 30, 'Teacher Grace', 'Term 1'),
('P1-MAT', 'Mathematics', 'Primary 1', 'Primary', 6, 40, 'Mr. Robert Mukasa', 'Term 1 2025')
ON CONFLICT (code) DO UPDATE SET 
    name = EXCLUDED.name, class = EXCLUDED.class, section = EXCLUDED.section, periods_per_week = EXCLUDED.periods_per_week, pupils = EXCLUDED.pupils, teacher = EXCLUDED.teacher, term = EXCLUDED.term;

-- Rooms
INSERT INTO public.rooms (name, building, capacity, type, facilities, status)
VALUES 
('Class A1', 'Main Block', 40, 'classroom', '{"Whiteboard", "Desks"}', 'available'),
('Class B2', 'Nursery Block', 30, 'classroom', '{"Toys", "Mats"}', 'available'),
('Science Lab', 'Lab Block', 25, 'lab', '{"Microscope", "Burners"}', 'available')
ON CONFLICT (name) DO UPDATE SET 
    building = EXCLUDED.building, capacity = EXCLUDED.capacity, type = EXCLUDED.type, facilities = EXCLUDED.facilities, status = EXCLUDED.status;

-- Pupils
INSERT INTO public.pupils (name, email, pupil_id, class, age, status, subjects)
VALUES 
('David Okello', 'david@example.com', 'KPS-001', 'Primary 1', 6, 'active', '{"Mathematics", "English"}'),
('Sarah Namono', 'sarah@example.com', 'KPS-002', 'Baby', 3, 'active', '{"Literacy", "Numbers"}')
ON CONFLICT (pupil_id) DO UPDATE SET 
    name = EXCLUDED.name, email = EXCLUDED.email, class = EXCLUDED.class, age = EXCLUDED.age, status = EXCLUDED.status, subjects = EXCLUDED.subjects;

-- Time Slots
INSERT INTO public.time_slots (day, start_time, end_time, subject, teacher, room, type, section)
VALUES 
('Monday', '08:00', '09:00', 'Mathematics', 'Mr. Robert Mukasa', 'Class A1', 'lesson', 'Primary'),
('Tuesday', '09:00', '10:00', 'Literacy', 'Mrs. Musisi Sarah', 'Class B2', 'lesson', 'Nursery')
ON CONFLICT DO NOTHING;

-- 4. RELOAD SCHEMA
NOTIFY pgrst, 'reload schema';

-- ==========================================================
-- VERIFICATION:
-- Everything should now be fixed and restored.
-- ==========================================================
