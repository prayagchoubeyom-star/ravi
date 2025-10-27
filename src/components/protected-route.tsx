
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check on the client side if authenticated
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      router.replace('/login');
    }
  }, [isAuthenticated, router]);

  // While checking authentication, you can show a loader
  if (!isAuthenticated) {
    return (
        <div className="p-4 space-y-4 h-full flex flex-col items-center justify-center">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-[50px] w-full" />
            <Skeleton className="h-[400px] w-full" />
        </div>
    );
  }

  return <>{children}</>;
}
