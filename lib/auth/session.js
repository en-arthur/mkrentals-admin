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
  
  // Cookie configuration for production with custom domain
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/'
  };
  
  // In production, explicitly set the domain to allow subdomain access
  if (process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_ADMIN_URL) {
    try {
      const url = new URL(process.env.NEXT_PUBLIC_ADMIN_URL);
      // Set domain to the root domain (e.g., .mkrentalservices.com)
      // This allows the cookie to work on admin.mkrentalservices.com
      const hostname = url.hostname;
      const parts = hostname.split('.');
      if (parts.length >= 2) {
        // For admin.mkrentalservices.com, set domain to .mkrentalservices.com
        cookieOptions.domain = `.${parts.slice(-2).join('.')}`;
      }
    } catch (error) {
      console.error('Error parsing NEXT_PUBLIC_ADMIN_URL for cookie domain:', error);
    }
  }
  
  cookieStore.set(SESSION_COOKIE_NAME, token, cookieOptions);
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
