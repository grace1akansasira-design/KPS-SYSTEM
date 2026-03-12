const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  console.log('--- Checking Teachers ---');
  const { data: teachers, error: tError } = await supabase.from('teachers').select('*');
  if (tError) console.error('Teachers Error:', tError.message);
  else {
    console.log('Teachers Count:', teachers?.length || 0);
    if (teachers?.length > 0) console.log('First Teacher:', JSON.stringify(teachers[0], null, 2));
  }

  console.log('--- Checking Subjects ---');
  const { data: subjects, error: sError } = await supabase.from('subjects').select('*');
  if (sError) console.error('Subjects Error:', sError.message);
  else {
    console.log('Subjects Count:', subjects?.length || 0);
    if (subjects?.length > 0) console.log('First Subject:', JSON.stringify(subjects[0], null, 2));
  }
  
  console.log('--- Checking Rooms ---');
  const { data: rooms, error: rError } = await supabase.from('rooms').select('*');
  if (rError) console.error('Rooms Error:', rError.message);
  else console.log('Rooms Count:', rooms?.length || 0);
  
  console.log('--- Checking Pupils ---');
  const { data: pupils, error: pError } = await supabase.from('pupils').select('*');
  if (pError) console.error('Pupils Error:', pError.message);
  else console.log('Pupils Count:', pupils?.length || 0);
}

checkData();
