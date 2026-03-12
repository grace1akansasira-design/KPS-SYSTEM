const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function finalCheck() {
  console.log('--- FINAL DIAGNOSIS ---');
  const { data, error } = await supabase.from('teachers').select('id, name').limit(1);
  if (error) {
    console.log('Read Error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Read Success:', data);
  }

  const { error: insError } = await supabase.from('teachers').insert([{ name: 'Check', email: 'c@c.com', phone: '0', class: 'P', section: 'Primary' }]).select();
  if (insError) {
    console.log('Insert Error:', JSON.stringify(insError, null, 2));
  } else {
    console.log('Insert Success');
  }
}

finalCheck();
