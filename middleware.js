import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth/admin-auth';

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'admin_session';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware executing for path:', pathname);
  
  // Allow access to login page
  if (pathname === '/login') {
    console.log('Allowing access to login page');
    return NextResponse.next();
  }
  
  // Check for session token
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) {
    console.log('No session token found, redirecting to login');
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  console.log('Session token found, verifying...');
  
  // Verify token (now async)
  const decoded = await verifyToken(token);
  
  if (!decoded) {
    console.log('Token verification failed, redirecting to login');
    // Redirect to login if token is invalid
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
  
  console.log('Token verified successfully for user:', decoded.username);
  // Token is valid, allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - /login (login page)
     * - /api (all API routes)
     * - /_next (Next.js internals)
     * - /favicon.ico, /robots.txt (static files)
     * - Static assets (images, videos, fonts, etc.)
     */
    '/((?!login|api|_next/static|_next/image|favicon.ico|robots.txt|.*\\.(?:jpg|jpeg|png|gif|svg|webp|ico|mp4|webm|woff|woff2|ttf|eot)).*)',
  ],
};
