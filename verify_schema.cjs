const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAll() {
  const tables = ['teachers', 'subjects', 'pupils', 'time_slots'];
  console.log('Verifying schema updates...');
  
  for (const table of tables) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`${table} check failed: ${error.message}`);
    } else {
      const columns = Object.keys(data[0] || {});
      console.log(`${table} columns: ${columns.length > 0 ? columns.join(', ') : 'EMPTY TABLE'}`);
      if (columns.includes('section')) {
        console.log(`✅ ${table} has "section" column`);
      } else {
        console.log(`❌ ${table} MISSING "section" column`);
      }
      if (table === 'time_slots') {
        if (columns.includes('class')) {
          console.log(`✅ time_slots has "class" column`);
        } else {
          console.log(`❌ time_slots MISSING "class" column`);
        }
      }
    }
  }
}

checkAll();
