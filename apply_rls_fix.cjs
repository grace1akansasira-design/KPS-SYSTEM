// Apply RLS policy fixes to Supabase via the management API
const PROJECT_ID = "jwrhdpqivxhrhenufjtz";

const SQL = `
-- Drop old restrictive admin-only write policies
DROP POLICY IF EXISTS "Admins manage teachers" ON public.teachers;
DROP POLICY IF EXISTS "Admins manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins manage rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins manage pupils" ON public.pupils;
DROP POLICY IF EXISTS "Admins manage time slots" ON public.time_slots;

-- TEACHERS: allow any authenticated user to write
CREATE POLICY IF NOT EXISTS "Authenticated can insert teachers" ON public.teachers
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can update teachers" ON public.teachers
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can delete teachers" ON public.teachers
  FOR DELETE TO authenticated USING (true);

-- SUBJECTS: allow any authenticated user to write
CREATE POLICY IF NOT EXISTS "Authenticated can insert subjects" ON public.subjects
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can update subjects" ON public.subjects
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can delete subjects" ON public.subjects
  FOR DELETE TO authenticated USING (true);

-- ROOMS: allow any authenticated user to write
CREATE POLICY IF NOT EXISTS "Authenticated can insert rooms" ON public.rooms
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can update rooms" ON public.rooms
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can delete rooms" ON public.rooms
  FOR DELETE TO authenticated USING (true);

-- PUPILS: allow any authenticated user to write
CREATE POLICY IF NOT EXISTS "Authenticated can insert pupils" ON public.pupils
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can update pupils" ON public.pupils
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can delete pupils" ON public.pupils
  FOR DELETE TO authenticated USING (true);

-- TIME_SLOTS: allow any authenticated user to write
CREATE POLICY IF NOT EXISTS "Authenticated can insert time_slots" ON public.time_slots
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can update time_slots" ON public.time_slots
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY IF NOT EXISTS "Authenticated can delete time_slots" ON public.time_slots
  FOR DELETE TO authenticated USING (true);
`;

async function applyMigration() {
  console.log("Applying RLS policy fixes to Supabase...");
  console.log("Project:", PROJECT_ID);
  console.log("");
  console.log("NOTE: This script requires a service_role key or management API token.");
  console.log("Since we only have the anon key, please apply the SQL manually.");
  console.log("");
  console.log("=== COPY THIS SQL INTO SUPABASE SQL EDITOR ===");
  console.log("Go to: https://supabase.com/dashboard/project/" + PROJECT_ID + "/sql/new");
  console.log("");
  console.log(SQL);
  console.log("=== END OF SQL ===");
}

applyMigration();
