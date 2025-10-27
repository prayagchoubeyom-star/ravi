
'use client';

import type { FC, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, BarChart3, ArrowLeftRight, PieChart, User, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '@/context/auth-context';

interface NavItem {
  href: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { href: '/', icon: LayoutGrid, label: 'Watchlist' },
  { href: '/charts', icon: BarChart3, label: 'Charts' },
  { href: '/orders', icon: ArrowLeftRight, label: 'Orders' },
  { href: '/positions', icon: PieChart, label: 'Positions' },
  { href: '/admin', icon: ShieldCheck, label: 'Admin', adminOnly: true },
  { href: '/profile', icon: User, label: 'Profile' },
];

const BottomNav = () => {
  const pathname = usePathname();
  const { userRole } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly) {
      return userRole === 'admin';
    }
    return userRole !== 'admin'; // Hide user items for admin
  });

  // If login page, signup page, or no role, don't show nav
  if (pathname === '/login' || pathname === '/signup' || !userRole) return null;

  return (
    <nav className="border-t bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center text-center w-16 p-1 rounded-md transition-colors duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-6 w-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const MainLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const noNavPages = ['/login', '/signup'];
  const showNav = !noNavPages.includes(pathname);

  return (
    <div className="relative flex h-full flex-col bg-background">
      <div className={cn("flex-1 overflow-hidden", showNav ? "pb-16" : "")}>
        <ScrollArea className="h-full">
            {children}
        </ScrollArea>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <BottomNav />
      </div>
    </div>
  );
};
