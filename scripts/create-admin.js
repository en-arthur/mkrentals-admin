/**
 * Create Admin User Script
 * 
 * This script creates the first admin user in the database.
 * 
 * Usage: node scripts/create-admin.js
 */

import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import readline from 'readline';

// Load environment variables from .env.local
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  console.log('\n🔐 Create Admin User\n');
  
  try {
    // Get user input
    const username = await question('Username: ');
    const password = await question('Password: ');
    const fullName = await question('Full Name: ');
    
    if (!username || !password) {
      console.error('\n❌ Username and password are required');
      process.exit(1);
    }
    
    if (password.length < 8) {
      console.error('\n❌ Password must be at least 8 characters long');
      process.exit(1);
    }
    
    console.log('\n⏳ Creating admin user...');
    
    // Check if username already exists
    const { data: existing } = await supabase
      .from('admin_users')
      .select('username')
      .eq('username', username)
      .single();
    
    if (existing) {
      console.error('\n❌ Username already exists');
      process.exit(1);
    }
    
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Insert admin user
    const { data, error } = await supabase
      .from('admin_users')
      .insert([{
        username,
        password_hash: passwordHash,
        full_name: fullName || username,
        role: 'super_admin',
        is_active: true
      }])
      .select()
      .single();
    
    if (error) {
      console.error('\n❌ Error creating admin user:', error.message);
      process.exit(1);
    }
    
    console.log('\n✅ Admin user created successfully!');
    console.log('\nUser Details:');
    console.log(`  Username: ${data.username}`);
    console.log(`  Full Name: ${data.full_name}`);
    console.log(`  Role: ${data.role}`);
    console.log(`  Created: ${new Date(data.created_at).toLocaleString()}`);
    console.log('\n🎉 You can now login to the admin dashboard!\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
