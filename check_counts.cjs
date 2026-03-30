const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  'https://jwrhdpqivxhrhenufjtz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcGl2eGhyaGVudWZqdHoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0MTE5NzE1MiwiZXhwIjoyMDU2NzczMTUyfQ.q0_Y8z4P9_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7'
);

async function checkData() {
  console.log('Checking database table counts...');
  
  const tables = ['teachers', 'subjects', 'pupils', 'rooms', 'time_slots'];
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.error(`Error checking table ${table}:`, error.message);
    } else {
      console.log(`Table ${table}: ${count} records`);
    }
  }
}

checkData();
