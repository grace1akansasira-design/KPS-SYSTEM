const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectColumns() {
  console.log('--- Inspecting Teachers ---');
  // Insert minimal data to see what we get back
  const { data, error } = await supabase.from('teachers').insert([{ name: 'Temp' }]).select();
  if (error) {
    console.error('Teachers Error:', error.message);
  } else {
    console.log('Teachers Columns:', Object.keys(data[0]));
    // Delete it
    await supabase.from('teachers').delete().eq('id', data[0].id);
  }

  console.log('--- Inspecting Subjects ---');
  const { data: sData, error: sError } = await supabase.from('subjects').insert([{ name: 'Temp', code: 'T', class: 'T', teacher: 'T' }]).select();
  if (sError) {
    console.error('Subjects Error:', sError.message);
  } else {
    console.log('Subjects Columns:', Object.keys(sData[0]));
    await supabase.from('subjects').delete().eq('id', sData[0].id);
  }
}

inspectColumns();
