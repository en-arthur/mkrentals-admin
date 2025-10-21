import { cookies } from 'next/headers';
import { verifyToken, getAdminFromToken } from './admin-auth';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'admin_session';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Create a session cookie
 * @param {string} token - JWT token
 */
export async function createSession(token) {
  const cookieStore = await cookies();
  
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  });
}

/**
 * Get session from cookie
 * @returns {Promise<object|null>} - Admin user data or null
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) {
    return null;
  }
  
  const admin = await getAdminFromToken(token);
  return admin;
}

/**
 * Destroy session cookie
 */
export async function destroySession() {
  const cookieStore = await cookies();
  
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>}
 */
export async function isAuthenticated() {
  const session = await getSession();
  return session !== null;
}

/**
 * Require authentication (for use in API routes and server components)
 * @returns {Promise<object>} - Admin user data
 * @throws {Error} - If not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session) {
    throw new Error('Unauthorized');
  }
  
  return session;
}
