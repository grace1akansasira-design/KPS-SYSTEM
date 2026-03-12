const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = "https://jwrhdpqivxhrhenufjtz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function seed() {
  console.log('Seeding Nursery Teachers...');
  // Check if they exist first to avoid duplicates if possible, or just insert
  const { data: t, error: te } = await supabase.from('teachers').insert([
    { name: 'Mrs. Musisi Sarah', email: 'musisi@kps.ac.ug', phone: '0701112223', class: 'Baby', status: 'active', subjects: ['Literacy', 'Numbers'] },
    { name: 'Mr. Kato John', email: 'kato@kps.ac.ug', phone: '0702223334', class: 'Middle', status: 'active', subjects: ['Songs', 'Play'] },
    { name: 'Ms. Nabirye Grace', email: 'nabirye@kps.ac.ug', phone: '0703334445', class: 'Top', status: 'active', subjects: ['Writing', 'Drawing'] }
  ]);
  if (te) console.error('Error seeding teachers:', te);

  console.log('Seeding Nursery Subjects...');
  const { data: s, error: se } = await supabase.from('subjects').insert([
    { code: 'N-LIT', name: 'Literacy', class: 'Baby', teacher: 'Mrs. Musisi Sarah', pupils: 30, term: 'Term 1 2025' },
    { code: 'N-NUM', name: 'Numbers', class: 'Baby', teacher: 'Mrs. Musisi Sarah', pupils: 30, term: 'Term 1 2025' },
    { code: 'N-WRT', name: 'Writing', class: 'Top', teacher: 'Ms. Nabirye Grace', pupils: 35, term: 'Term 1 2025' }
  ]);
  if (se) console.error('Error seeding subjects:', se);
  
  console.log('Seed completed.');
}

seed();
