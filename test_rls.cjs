const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsert() {
  console.log('--- Testing Teacher Insert ---');
  const teacher = {
    name: 'Test Teacher',
    email: 'test@kps.ac.ug',
    phone: '0000000000',
    class: 'Primary 1',
    section: 'Primary',
    status: 'active',
    subjects: []
  };

  const { data, error } = await supabase.from('teachers').insert([teacher]).select();
  if (error) {
    console.error('Insert Error:', error.message);
    if (error.hint) console.log('Hint:', error.hint);
    if (error.details) console.log('Details:', error.details);
  } else {
    console.log('Insert Success:', JSON.stringify(data, null, 2));
    
    // Clean up
    console.log('--- Cleaning up Test Teacher ---');
    const { error: dError } = await supabase.from('teachers').delete().eq('id', data[0].id);
    if (dError) console.error('Delete Error:', dError.message);
    else console.log('Delete Success');
  }
}

testInsert();
