const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAll() {
  const tables = ['teachers', 'subjects', 'rooms', 'pupils', 'time_slots'];
  
  for (const table of tables) {
    console.log(`--- Testing ${table} ---`);
    let payload = {};
    if (table === 'teachers') payload = { name: 'Test Teacher', email: 'test@kps.ac.ug', phone: '0000', class: 'P1', section: 'Primary', status: 'active', subjects: [] };
    if (table === 'subjects') payload = { name: 'Test Subject', code: 'T01', class: 'P1', section: 'Primary', teacher: 'Test', periods_per_week: 1, pupils: 1, term: '1' };
    if (table === 'rooms') payload = { name: 'Test Room', building: 'Test', capacity: 1, type: 'classroom', facilities: [], status: 'available' };
    if (table === 'pupils') payload = { name: 'Test Pupil', email: 'p@test.com', pupil_id: 'ID1', class: 'P1', age: 6, status: 'active', subjects: [] };
    if (table === 'time_slots') payload = { day: 'Monday', start_time: '08:00', end_time: '09:00', subject: 'Test', teacher: 'Test', room: 'Test', type: 'lesson', section: 'Primary' };

    const { data, error } = await supabase.from(table).insert([payload]).select();
    if (error) {
      console.error(`${table} Insert Error:`, error.message);
    } else {
      console.log(`${table} Insert Success`);
      await supabase.from(table).delete().eq('id', data[0].id);
    }
  }
}

testAll();
