import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load env vars
dotenv.config({ path: resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function promoteToAdmin() {
  console.log('Fetching users to find the active account...');
  
  // Try to find the user roles directly since we can't easily list auth.users with anon key
  const { data: roles, error: rolesError } = await supabase
    .from('user_roles')
    .select('*');

  if (rolesError) {
    console.error('Error fetching roles:', rolesError.message);
    return;
  }

  if (!roles || roles.length === 0) {
    console.log('No user roles found. Please sign up or login first so a role is created.');
    return;
  }

  console.log('Found existing roles:', roles);

  // Promote all found roles to admin to ensure the user gets access
  for (const role of roles) {
    console.log(`Promoting user ${role.user_id} to admin...`);
    const { error: updateError } = await supabase
      .from('user_roles')
      .update({ role: 'admin' })
      .eq('user_id', role.user_id);

    if (updateError) {
      console.error(`Failed to promote user ${role.user_id}:`, updateError.message);
    } else {
      console.log(`Successfully promoted user ${role.user_id} to admin!`);
    }
  }
}

promoteToAdmin();
