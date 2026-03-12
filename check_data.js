import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_PUBLISHABLE_KEY);

async function checkData() {
  const { data: teachers } = await supabase.from('teachers').select('*');
  console.log('Teachers:', JSON.stringify(teachers, null, 2));
  
  const { data: subjects } = await supabase.from('subjects').select('*');
  console.log('Subjects:', JSON.stringify(subjects, null, 2));
}

checkData();
