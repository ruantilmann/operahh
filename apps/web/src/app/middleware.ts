import { NextRequest, NextResponse } from 'next/server';

// Define protected routes
const protectedRoutes = [
  '/dashboard',
  '/caixa',
  '/checklists',
  '/configuracoes',
  '/custo-fixo',
  '/estoque',
  '/faturamento',
  '/inventario',
  '/lucro',
  '/precificacao',
  '/producao'
];

export async function middleware(request: NextRequest) {
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // For protected routes, we need to check if the user is authenticated
    // Check if session cookie exists (Better Auth uses 'better-auth.session_token')
    const sessionToken = request.cookies.get('better-auth.session_token')?.value ||
                         request.cookies.get('__Secure-better-auth.session_token')?.value;

    if (!sessionToken) {
      // Redirect to login if no session token exists
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Optionally, we could validate the session token by making a request to the auth API
    // For now, we'll just check for the presence of the session token

    return NextResponse.next();
  }

  // Allow access to unprotected routes (like login, signup, etc.)
  return NextResponse.next();
}

// Specify which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match the protected routes that need authentication
     */
    '/dashboard/:path*',
    '/caixa/:path*',
    '/checklists/:path*',
    '/configuracoes/:path*',
    '/custo-fixo/:path*',
    '/estoque/:path*',
    '/faturamento/:path*',
    '/inventario/:path*',
    '/lucro/:path*',
    '/precificacao/:path*',
    '/producao/:path*',
  ],
};