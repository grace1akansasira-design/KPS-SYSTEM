const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyAll() {
  const tables = ['teachers', 'subjects', 'rooms', 'pupils', 'time_slots'];
  
  for (const table of tables) {
    console.log(`--- Verifying ${table} ---`);
    let payload = {};
    if (table === 'teachers') payload = { name: 'Final Teacher', email: 'final@kps.ac.ug', phone: '0000', class: 'P', section: 'Primary', status: 'active', subjects: [] };
    if (table === 'subjects') payload = { name: 'Final Subject', code: 'F01', class: 'P', section: 'Primary', teacher: 'T', periods_per_week: 1, pupils: 1, term: '1' };
    if (table === 'rooms') payload = { name: 'Final Room', building: 'B', capacity: 1, type: 'classroom', facilities: [], status: 'available' };
    if (table === 'pupils') payload = { name: 'Final Pupil', email: 'f@p.com', pupil_id: 'FID1', class: 'P', age: 7, status: 'active', subjects: [] };
    if (table === 'time_slots') payload = { day: 'Friday', start_time: '12:00', end_time: '13:00', subject: 'S', teacher: 'T', room: 'R', type: 'lesson', section: 'Primary' };

    const { data, error } = await supabase.from(table).insert([payload]).select();
    if (error) {
      console.log(`${table} Error:`, error.message);
    } else {
      console.log(`${table} Success: ID ${data[0].id}`);
      await supabase.from(table).delete().eq('id', data[0].id);
      console.log(`${table} Cleanup Done`);
    }
  }
}

verifyAll();
