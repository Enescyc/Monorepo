import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/login', '/register'];

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;

    // Allow public routes
    if (publicRoutes.includes(path)) {
      // If authenticated, redirect to dashboard from auth pages
      if (req.nextauth.token) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    // All other routes require authentication
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: [
    // Protected routes
    '/dashboard/:path*',
    '/settings/:path*',
    '/practice/:path*',
    '/words/:path*',
    // Auth routes
    '/login',
    '/register',
  ],
};
