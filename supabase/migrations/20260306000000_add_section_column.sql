-- Add section column to key tables to support Primary/Nursery split

ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'Primary';
ALTER TABLE public.subjects ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'Primary';
ALTER TABLE public.pupils ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'Primary';
ALTER TABLE public.time_slots ADD COLUMN IF NOT EXISTS section TEXT DEFAULT 'Primary';

-- Note: This ensures that existing records are defaulted to 'Primary' 
-- while allowing new records to specify 'Nursery' or 'Primary'.
