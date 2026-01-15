'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback = null }: ProtectedRouteProps) {
  const router = useRouter();
  const [hasValidSession, setHasValidSession] = useState<boolean | null>(null);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending) {
      if (session) {
        setHasValidSession(true);
      } else {
        setHasValidSession(false);
        // Redirect to login
        router.push('/login');
      }
    }
  }, [session, isPending, router]);

  if (hasValidSession === false) {
    return fallback || <div>Redirecting to login...</div>;
  }

  if (hasValidSession === null || isPending) {
    // Show loading state while checking session
    return fallback || <div>Checking authentication...</div>;
  }

  return <>{children}</>;
}