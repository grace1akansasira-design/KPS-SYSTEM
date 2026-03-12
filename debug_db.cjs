const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcGl2eGhyaGVudWZqdHoiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTc0MTE5NzE1MiwiZXhwIjoyMDU2NzczMTUyfQ.q0_Y8z4P9_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7_7';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugData() {
  console.log('Debugging database connection...');
  try {
    const { data, error } = await supabase.from('teachers').select('*').limit(1);
    console.log('Attempting SELECT on teachers:');
    if (error) {
      console.log('Error Type:', typeof error);
      console.log('Error Detail:', JSON.stringify(error, null, 2));
    } else {
      console.log('Data Success:', data);
    }
  } catch (e) {
    console.error('Exception caught:', e);
  }
}

debugData();
