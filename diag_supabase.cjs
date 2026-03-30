const { createClient } = require('@supabase/supabase-js');

// Hardcoded for diagnostic purposes only
const SUPABASE_URL = "https://jwrhdpqivxhrhenufjtz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function diag() {
  console.log('--- Supabase Diagnostic ---');
  console.log('URL:', SUPABASE_URL);
  
  const tables = ['teachers', 'subjects', 'pupils', 'rooms', 'time_slots'];
  
  for (const table of tables) {
    try {
      const { data, count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(1);
      
      if (error) {
        console.error(`Error on ${table}:`, error.message);
      } else {
        console.log(`Table ${table}: SUCCESS. Count: ${count}. Sample:`, (data && data.length > 0) ? 'exists' : 'empty');
      }
    } catch (err) {
      console.error(`Exception on ${table}:`, err.message);
    }
  }
}

diag();
