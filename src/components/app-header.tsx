'use client';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';

export const AppHeader = ({ title, hasBack = false }: { title: string, hasBack?: boolean }) => {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-md items-center px-4">
        {hasBack && (
            <Button variant="ghost" size="icon" className="-ml-2 mr-2" onClick={() => router.back()}>
                <ChevronLeft className="h-6 w-6" />
            </Button>
        )}
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>
    </header>
  );
};
