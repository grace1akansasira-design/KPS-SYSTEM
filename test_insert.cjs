const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('Testing insert without "section" column...');
  const { data, error } = await supabase.from('teachers').insert([
    { name: 'Test Teacher', email: 'test@kps.ac.ug', phone: '000', class: 'None', status: 'active', subjects: [] }
  ]).select();
  
  if (error) {
    console.error('Insert failed:', error.message);
    if (error.message.includes('section')) {
       console.log('Confirmed: "section" column is the issue.');
    }
  } else {
    console.log('Insert SUCCEEDED without "section" column!');
    // Clean up
    await supabase.from('teachers').delete().eq('email', 'test@kps.ac.ug');
  }
}

testInsert();
