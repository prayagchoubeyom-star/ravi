
'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

export function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { isAuthenticated, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // This check runs on the client side after the component mounts
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole');

    if (authStatus !== 'true') {
      router.replace('/login');
    } else if (adminOnly && role !== 'admin') {
      // If it's an admin-only route and user is not admin, redirect
      router.replace('/');
    }
  }, [isAuthenticated, userRole, router, adminOnly]);

  // While checking authentication, you can show a loader
  if (!isAuthenticated || (adminOnly && userRole !== 'admin')) {
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
