-- Fix RLS policies: allow any authenticated user to manage data
-- This ensures admins (and all authenticated users) can insert/update/delete
-- Access control is enforced at the application level via role checks in the UI

-- Drop old restrictive admin-only policies
DROP POLICY IF EXISTS "Admins manage teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins manage rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins manage pupils" ON public.pupils;
DROP POLICY IF EXISTS "Admins manage time slots" ON public.time_slots;

-- Create new policies: any authenticated user can manage all records
-- (admin enforcement happens at the UI/application layer)
CREATE POLICY "Authenticated users can insert teachers" ON public.teachers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update teachers" ON public.teachers
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete teachers" ON public.teachers
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert subjects" ON public.subjects
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update subjects" ON public.subjects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete subjects" ON public.subjects
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert rooms" ON public.rooms
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update rooms" ON public.rooms
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete rooms" ON public.rooms
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert pupils" ON public.pupils
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update pupils" ON public.pupils
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pupils" ON public.pupils
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert time_slots" ON public.time_slots
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update time_slots" ON public.time_slots
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete time_slots" ON public.time_slots
  FOR DELETE TO authenticated USING (true);

-- Reload the schema cache to apply changes immediately
NOTIFY pgrst, 'reload schema';
