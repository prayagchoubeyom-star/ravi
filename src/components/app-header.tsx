'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/context/auth-context';

export const AppHeader = ({ title, hasBack = false }: { title: string, hasBack?: boolean }) => {
  const router = useRouter();
  const { userRole, logout } = useAuth();
  const isAdmin = userRole === 'admin';

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-md items-center justify-between px-4">
        <div className="flex items-center">
            {hasBack && (
                <Button variant="ghost" size="icon" className="-ml-2 mr-2" onClick={() => router.back()}>
                    <ChevronLeft className="h-6 w-6" />
                </Button>
            )}
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
        </div>
        {isAdmin && title === "Admin Panel" && (
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground">
                <LogOut className="h-5 w-5" />
            </Button>
        )}
      </div>
    </header>
  );
};
