const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
  const tables = ['teachers', 'subjects', 'rooms', 'pupils', 'time_slots'];
  
  console.log('| Table | Columns | Policy Test |');
  console.log('|-------|---------|-------------|');
  
  for (const table of tables) {
    // Check columns by fetching one row
    const { data: colsData, error: colsError } = await supabase.from(table).select('*').limit(1);
    const columns = colsData && colsData.length > 0 ? Object.keys(colsData[0]).join(', ') : 'Empty/Error';
    
    // Check RLS by trying a dummy insert (it will fail if RLS is on and no policy matches)
    const { error: insError } = await supabase.from(table).insert([{}]).select();
    const rlsStatus = insError ? `Fail: ${insError.message}` : 'Success';
    
    console.log(`| ${table} | ${columns} | ${rlsStatus} |`);
    
    if (insError && insError.message.includes('column')) {
       console.log(`  -> Specific Column Error on ${table}: ${insError.message}`);
    }
  }
}

diagnose();
