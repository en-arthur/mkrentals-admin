import { NextResponse } from 'next/server';
import { hasAnyAdminUsers } from '@/lib/supabase/queries';

/**
 * GET /api/setup/check
 *
 * Check if first-time setup is needed
 * Returns whether admin users exist in the database
 */
export async function GET() {
  try {
    console.log('🔍 Setup check API called');

    const hasAdmins = await hasAnyAdminUsers();

    console.log('🔍 hasAnyAdminUsers result:', hasAdmins);

    return NextResponse.json({
      needsSetup: !hasAdmins,
      message: hasAdmins
        ? 'Admin users already exist'
        : 'First-time setup required'
    });
  } catch (error) {
    console.error('Setup check error:', error);
    return NextResponse.json(
      {
        needsSetup: false,
        message: 'Error checking setup status',
        error: error.message
      },
      { status: 500 }
    );
  }
}
