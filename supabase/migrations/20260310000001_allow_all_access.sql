-- Update Supabase RLS Policies to allow full storage and retrieval for all authenticated users
-- This file drops existing restrictive policies and creates new "Allow All" policies for key tables.

-- 1. DROP EXISTING POLICIES (Comprehensive cleanup)
-- Teachers
DROP POLICY IF EXISTS "Authenticated users can insert teachers" ON public.teachers;
DROP POLICY IF EXISTS "Authenticated users can update teachers" ON public.teachers;
DROP POLICY IF EXISTS "Authenticated users can delete teachers" ON public.teachers;
DROP POLICY IF EXISTS "Teachers viewable by authenticated" ON public.teachers;
DROP POLICY IF EXISTS "Admins manage teachers" ON public.teachers;
DROP POLICY IF EXISTS "Authenticated can view teachers" ON public.teachers;

-- Subjects
DROP POLICY IF EXISTS "Authenticated users can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Authenticated users can update subjects" ON public.subjects;
DROP POLICY IF EXISTS "Authenticated users can delete subjects" ON public.subjects;
DROP POLICY IF EXISTS "Subjects viewable by authenticated" ON public.subjects;
DROP POLICY IF EXISTS "Admins manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Authenticated can view subjects" ON public.subjects;

-- Rooms
DROP POLICY IF EXISTS "Authenticated users can insert rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can update rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can delete rooms" ON public.rooms;
DROP POLICY IF EXISTS "Rooms viewable by authenticated" ON public.rooms;
DROP POLICY IF EXISTS "Admins manage rooms" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated can view rooms" ON public.rooms;

-- Pupils
DROP POLICY IF EXISTS "Authenticated users can insert pupils" ON public.pupils;
DROP POLICY IF EXISTS "Authenticated users can update pupils" ON public.pupils;
DROP POLICY IF EXISTS "Authenticated users can delete pupils" ON public.pupils;
DROP POLICY IF EXISTS "Pupils viewable by authenticated" ON public.pupils;
DROP POLICY IF EXISTS "Admins manage pupils" ON public.pupils;
DROP POLICY IF EXISTS "Authenticated can view pupils" ON public.pupils;

-- Time Slots
DROP POLICY IF EXISTS "Authenticated users can insert time_slots" ON public.time_slots;
DROP POLICY IF EXISTS "Authenticated users can update time_slots" ON public.time_slots;
DROP POLICY IF EXISTS "Authenticated users can delete time_slots" ON public.time_slots;
DROP POLICY IF EXISTS "Time slots viewable by authenticated" ON public.time_slots;
DROP POLICY IF EXISTS "Admins manage time_slots" ON public.time_slots;
DROP POLICY IF EXISTS "Authenticated can view time_slots" ON public.time_slots;

-- Profiles
DROP POLICY IF EXISTS "Profiles viewable by authenticated" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;

-- User Roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;


-- 2. CREATE NEW "ALLOW ALL" POLICIES FOR AUTHENTICATED USERS

-- Teachers
CREATE POLICY "Allow all for authenticated" ON public.teachers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Subjects
CREATE POLICY "Allow all for authenticated" ON public.subjects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Rooms
CREATE POLICY "Allow all for authenticated" ON public.rooms
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Pupils
CREATE POLICY "Allow all for authenticated" ON public.pupils
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Time Slots
CREATE POLICY "Allow all for authenticated" ON public.time_slots
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Profiles
CREATE POLICY "Allow all for authenticated" ON public.profiles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- User Roles
CREATE POLICY "Allow all for authenticated" ON public.user_roles
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
