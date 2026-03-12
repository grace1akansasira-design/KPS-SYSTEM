-- Adding sample Nursery teachers
INSERT INTO public.teachers (name, email, phone, class, section, status, subjects)
VALUES 
('Teacher Sarah', 'sarah@kps.ac.ug', '+256701111111', 'Baby', 'Nursery', 'active', '{}'),
('Teacher Monica', 'monica@kps.ac.ug', '+256702222222', 'Middle', 'Nursery', 'active', '{}'),
('Teacher Grace', 'grace@kps.ac.ug', '+256703333333', 'Top', 'Nursery', 'active', '{}');

-- Optionally add some Nursery subjects if none exist for easy testing
INSERT INTO public.subjects (code, name, class, section, periods_per_week, pupils, term)
VALUES 
('NUR-01', 'Play & Discovery', 'Baby', 'Nursery', 5, 20, 'Term 1'),
('NUR-02', 'Numbers & Shapes', 'Middle', 'Nursery', 5, 25, 'Term 1'),
('NUR-03', 'Reading Readiness', 'Top', 'Nursery', 5, 30, 'Term 1');
