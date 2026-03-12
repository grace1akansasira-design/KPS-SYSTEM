const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  try {
    console.log('Testing Teacher Insert...');
    const teacher = {
      name: 'Verification Teacher',
      email: 'verify@kps.ac.ug',
      phone: '0000000000',
      class: 'Primary 1',
      section: 'Primary',
      status: 'active',
      subjects: []
    };
    const { data, error } = await supabase.from('teachers').insert([teacher]).select();
    if (error) {
      console.log('Insert Error:', JSON.stringify(error, null, 2));
    } else {
      console.log('Insert Success:', data[0].id);
      await supabase.from('teachers').delete().eq('id', data[0].id);
      console.log('Cleanup Success');
    }
  } catch (err) {
    console.log('Caught Err:', err);
  }
}

check();
