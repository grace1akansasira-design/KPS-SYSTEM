const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectPolicies() {
  console.log('--- Inspecting Policies for "rooms" table ---');
  
  // Note: Standard Supabase users cannot directly query pg_policies.
  // We'll try to check if we can even SELECT from rooms.
  const { data, error } = await supabase.from('rooms').select('*').limit(1);
  
  if (error) {
    console.error('Select Error:', error.message);
  } else {
    console.log('Select Success, found data:', data);
  }

  console.log('\n--- Testing Room Insert (Anon) ---');
  const room = {
    name: 'Inspection Room ' + Date.now(),
    building: 'Main',
    capacity: 10,
    type: 'classroom',
    status: 'available'
  };

  const { error: insertError } = await supabase.from('rooms').insert([room]);
  if (insertError) {
    console.error('Insert Error:', insertError.message);
  } else {
    console.log('Insert Success!');
  }
}

inspectPolicies();
