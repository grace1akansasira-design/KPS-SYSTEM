const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = "https://jwrhdpqivxhrhenufjtz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log('Restoring Subjects...');
  const subjectDefaults = [
    { code: 'NUR-01', name: 'Play & Discovery', class: 'Baby', section: 'Nursery', periods_per_week: 5, pupils: 20, teacher: 'Mrs. Musisi Sarah', term: 'Term 1' },
    { code: 'NUR-02', name: 'Numbers & Shapes', class: 'Middle', section: 'Nursery', periods_per_week: 5, pupils: 25, teacher: 'Teacher Monica', term: 'Term 1' },
    { code: 'NUR-03', name: 'Reading Readiness', class: 'Top', section: 'Nursery', periods_per_week: 5, pupils: 30, teacher: 'Teacher Grace', term: 'Term 1' },
    { code: 'P1-MAT', name: 'Mathematics', class: 'Primary 1', section: 'Primary', periods_per_week: 6, pupils: 40, teacher: 'Mr. Robert Mukasa', term: 'Term 1 2025' },
  ];

  const { data, error } = await supabase.from('subjects').insert(subjectDefaults);
  
  if (error) {
    console.error('Error restoring subjects:', error);
    if (error.message.includes('column') || error.message.includes('section') || error.message.includes('class')) {
        console.log('Attempting fallback without section/class columns...');
        const fallback = subjectDefaults.map(({ section, class: className, ...rest }) => rest);
        const { data: d2, error: e2 } = await supabase.from('subjects').insert(fallback);
        if (e2) console.error('Fallback failed:', e2);
        else console.log('Fallback successful.');
    }
  } else {
    console.log('Subjects restored successfully.');
  }
}

seed();
