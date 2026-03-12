-- FIX: Update time_slots type constraint to allow 'break' and 'lunch'
-- This resolves the "violates check constraint" error when adding breaks/lunch.

-- 1. Drop the existing constraint (handling common automated names)
ALTER TABLE public.time_slots DROP CONSTRAINT IF EXISTS time_slots_type_check;

-- 2. Add the updated constraint
ALTER TABLE public.time_slots ADD CONSTRAINT time_slots_type_check 
CHECK (type IN ('lesson', 'practical', 'games', 'break', 'lunch'));

-- 3. Reload schema cache
NOTIFY pgrst, 'reload schema';
