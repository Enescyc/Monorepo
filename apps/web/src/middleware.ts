import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Add custom headers or modify the request/response here
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
  // Protected routes that require authentication
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*',
    '/practice/:path*',
    '/words/:path*',
  ],
}; 