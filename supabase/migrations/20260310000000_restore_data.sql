-- 1. Fix RLS Policies: Ensure authenticated users can view data
-- It's possible SELECT policies were missing or too restrictive

DROP POLICY IF EXISTS "Authenticated can view teachers" ON public.teachers;
DROP POLICY IF EXISTS "Authenticated can view subjects" ON public.subjects;
DROP POLICY IF EXISTS "Authenticated can view rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated can view pupils" ON public.pupils;
DROP POLICY IF EXISTS "Authenticated can view time_slots" ON public.time_slots;

CREATE POLICY "Authenticated can view teachers" ON public.teachers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can view subjects" ON public.subjects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can view rooms" ON public.rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can view pupils" ON public.pupils FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can view time_slots" ON public.time_slots FOR SELECT TO authenticated USING (true);

-- 2. Restore Missing Data (Seed)
-- This section populates the tables if they are empty or missing records.

-- Restore Teachers
INSERT INTO public.teachers (name, email, phone, class, section, status, subjects)
VALUES 
('Mrs. Musisi Sarah', 'musisi@kps.ac.ug', '0701112223', 'Baby', 'Nursery', 'active', '{"Literacy", "Numbers"}'),
('Mr. Kato John', 'kato@kps.ac.ug', '0702223334', 'Middle', 'Nursery', 'active', '{"Songs", "Play"}'),
('Ms. Nabirye Grace', 'nabirye@kps.ac.ug', '0703334445', 'Top', 'Nursery', 'active', '{"Writing", "Drawing"}'),
('Mr. Robert Mukasa', 'robert@kps.ac.ug', '0704445556', 'Primary 1', 'Primary', 'active', '{"Mathematics", "English"}')
ON CONFLICT DO NOTHING;

-- Restore Subjects
INSERT INTO public.subjects (code, name, class, section, periods_per_week, pupils, teacher, term)
VALUES 
('NUR-01', 'Play & Discovery', 'Baby', 'Nursery', 5, 20, 'Mrs. Musisi Sarah', 'Term 1'),
('NUR-02', 'Numbers & Shapes', 'Middle', 'Nursery', 5, 25, 'Mrs. Musisi Sarah', 'Term 1'),
('NUR-03', 'Reading Readiness', 'Top', 'Nursery', 5, 30, 'Ms. Nabirye Grace', 'Term 1'),
('P1-MAT', 'Mathematics', 'Primary 1', 'Primary', 6, 40, 'Mr. Robert Mukasa', 'Term 1 2025')
ON CONFLICT (code) DO NOTHING;

-- Restore Rooms (Physical Infrastructure)
INSERT INTO public.rooms (name, building, capacity, type, facilities, status)
VALUES 
('Class A1', 'Main Block', 40, 'classroom', '{"Whiteboard", "Desks"}', 'available'),
('Class B2', 'Nursery Block', 30, 'classroom', '{"Toys", "Mats"}', 'available'),
('Science Lab', 'Lab Block', 25, 'lab', '{"Microscope", "Burners"}', 'available')
ON CONFLICT DO NOTHING;

-- Restore Pupils (Academic Records)
INSERT INTO public.pupils (name, email, pupil_id, class, age, status, subjects)
VALUES 
('David Okello', 'david@example.com', 'KPS-001', 'Primary 1', 6, 'active', '{"Mathematics", "English"}'),
('Sarah Namono', 'sarah@example.com', 'KPS-002', 'Baby', 3, 'active', '{"Literacy", "Numbers"}')
ON CONFLICT (pupil_id) DO NOTHING;

-- Restore Time Slots
INSERT INTO public.time_slots (day, start_time, end_time, subject, teacher, room, type, section)
VALUES 
('Monday', '08:00', '09:00', 'Mathematics', 'Mr. Robert Mukasa', 'Class A1', 'lesson', 'Primary'),
('Tuesday', '09:00', '10:00', 'Literacy', 'Mrs. Musisi Sarah', 'Class B2', 'lesson', 'Nursery')
ON CONFLICT DO NOTHING;
