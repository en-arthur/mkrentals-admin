import { NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/auth/admin-auth';
import { createSession } from '@/lib/auth/session';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('Login attempt for username:', username);

    // Authenticate admin
    const result = await authenticateAdmin(username, password);

    if (!result.success) {
      console.log('Authentication failed for username:', username);
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    console.log('Authentication successful for username:', username);

    // Create session
    await createSession(result.token);
    console.log('Session cookie created successfully');

    return NextResponse.json({
      success: true,
      admin: result.admin
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
