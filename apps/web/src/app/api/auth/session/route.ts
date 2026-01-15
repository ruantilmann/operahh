import { auth } from '@operahh/auth';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get the session using Better Auth
    const session = await auth.api.getSession({
      headers: Object.fromEntries(request.headers.entries()),
    });

    if (session) {
      return Response.json({ authenticated: true, user: session.user });
    } else {
      return Response.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Session validation error:', error);
    return Response.json({ authenticated: false, error: 'Internal server error' }, { status: 500 });
  }
}