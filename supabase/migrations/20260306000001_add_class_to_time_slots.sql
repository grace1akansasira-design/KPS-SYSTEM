ALTER TABLE public.time_slots 
ADD COLUMN IF NOT EXISTS class TEXT;

COMMENT ON COLUMN public.time_slots.class IS 'The class (e.g., Baby, Middle, Top, P1, etc.) this time slot is for.';
