import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  // Check if the current path starts with /login or other public routes
  const isPublicRoute = request.nextUrl.pathname.startsWith('/login');

  if (!isPublicRoute) {
    // For protected routes (everything except /login), we need to check if the user is authenticated
    // Check if session cookie exists (Better Auth uses 'better-auth.session_token')
    const sessionToken = request.cookies.get('better-auth.session_token')?.value ||
                         request.cookies.get('__Secure-better-auth.session_token')?.value;

    if (!sessionToken) {
      // Redirect to login if no session token exists
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Allow access to all routes, with authentication check applied as needed
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all routes except static assets and API routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};