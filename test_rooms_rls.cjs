const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRoomInsert() {
  console.log('--- Testing Room Insert (Anon) ---');
  const room = {
    name: 'Test Room ' + Date.now(),
    building: 'Test Building',
    capacity: 20,
    type: 'classroom',
    facilities: ['Test Facility'],
    status: 'available'
  };

  const { data, error } = await supabase.from('rooms').insert([room]).select();
  if (error) {
    console.error('Insert Error:', error.message);
    if (error.hint) console.log('Hint:', error.hint);
    if (error.details) console.log('Details:', error.details);
  } else {
    console.log('Insert Success:', JSON.stringify(data, null, 2));
    
    // Clean up
    console.log('--- Cleaning up Test Room ---');
    const { error: dError } = await supabase.from('rooms').delete().eq('id', data[0].id);
    if (dError) console.error('Delete Error:', dError.message);
    else console.log('Delete Success');
  }
}

testRoomInsert();
