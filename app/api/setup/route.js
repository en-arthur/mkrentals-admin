import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase/admin';
import { hasAnyAdminUsers, createAdminUser } from '@/lib/supabase/queries';
import { generateSimpleCredentials, validatePasswordStrength } from '@/lib/auth/credential-generator';

/**
 * POST /api/setup
 *
 * Create the first admin user during initial setup
 * Only works if no admin users exist yet
 */
export async function POST() {
  try {
    console.log('Setup API called - checking for existing admins...');

    // Security check: Only allow if no admin users exist
    const hasAdmins = await hasAnyAdminUsers();

    if (hasAdmins) {
      console.log('Setup blocked - admin users already exist');
      return NextResponse.json(
        {
          success: false,
          message: 'Setup already completed. Admin users already exist.',
          code: 'SETUP_ALREADY_COMPLETED'
        },
        { status: 400 }
      );
    }

    console.log('No existing admins found - proceeding with setup...');

    // Generate simple, memorable credentials
    const { username, password, info } = generateSimpleCredentials();

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      console.error('Generated password validation failed:', passwordValidation);
      return NextResponse.json(
        {
          success: false,
          message: 'Generated password does not meet security requirements'
        },
        { status: 500 }
      );
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create admin user
    const adminData = {
      username,
      password_hash: passwordHash,
      full_name: 'MK Rentals Admin',
      role: 'super_admin',
      is_active: true
    };

    console.log('Creating admin user:', { username, role: adminData.role });

    const newAdmin = await createAdminUser(adminData);

    // Log successful setup (don't log credentials)
    console.log('✅ First admin user created successfully');
    console.log(`   Username: ${username}`);
    console.log(`   Role: ${newAdmin.role}`);
    console.log(`   Created: ${new Date(newAdmin.created_at).toLocaleString()}`);

    // Return success with credentials (only shown once)
    return NextResponse.json({
      success: true,
      message: 'Admin account created successfully',
      credentials: {
        username,
        password, // Plain password for user to see/save
      },
      info: {
        ...info,
        note: 'Save these credentials securely. You won\'t be able to see the password again.'
      }
    });

  } catch (error) {
    console.error('Setup creation error:', error);

    // Handle specific database errors
    if (error.code === '23505') {
      console.error('Duplicate username error - admin already exists');
      return NextResponse.json(
        {
          success: false,
          message: 'An admin user with this username already exists',
          code: 'DUPLICATE_USERNAME'
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create admin account',
        error: error.message
      },
      { status: 500 }
    );
  }
}
