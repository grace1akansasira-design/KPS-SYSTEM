const axios = require('axios');

const supabaseUrl = 'https://jwrhdpqivxhrhenufjtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3cmhkcHFpdnhocmhlbnVmanR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NzQ1ODMsImV4cCI6MjA4ODE1MDU4M30.gLKXOx6kGGUTD6_xfD9bPn5kPj5AGCCRJ8TyG-uvNUs';

async function checkSchema() {
  try {
    const response = await axios.get(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    console.log('Schema Metadata Keys:', Object.keys(response.data.definitions));
    
    const teachers = response.data.definitions.teachers;
    if (teachers) {
      console.log('Teachers Properties:', Object.keys(teachers.properties));
    } else {
      console.log('Teachers not found in definitions');
    }
  } catch (error) {
    console.error('Error fetching schema:', error.message);
    if (error.response) {
      console.error('Data:', error.response.data);
    }
  }
}

checkSchema();
