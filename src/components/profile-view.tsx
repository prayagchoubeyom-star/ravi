
'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { ChevronRight, LogOut, Newspaper, TrendingUp, HelpCircle, Mail, KeyRound, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/context/theme-context';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const menuItems = [
    { href: "/news", icon: Newspaper, label: "News" },
    { href: "/market-movers", icon: TrendingUp, label: "Top Gainers/Losers" },
    { href: "/help-center", icon: HelpCircle, label: "Help Center" },
    { href: "/contact", icon: Mail, label: "Contact Us" },
    { href: "/change-password", icon: KeyRound, label: "Change Password" },
];

export function ProfileView() {
  const { logout, user: authUser } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold">{authUser?.name}</h2>
            <p className="text-muted-foreground">{authUser?.email}</p>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-2">
            <div className="space-y-1">
                <div className="flex items-center justify-between p-2">
                    <Label htmlFor="dark-mode" className="flex items-center gap-3">
                        {theme === 'dark' ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
                        <span>Dark Mode</span>
                    </Label>
                    <Switch
                        id="dark-mode"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                </div>
                {menuItems.map((item) => (
                     <Button asChild variant="ghost" className="w-full justify-between" key={item.href}>
                        <Link href={item.href}>
                            <span className="flex items-center gap-3">
                                <item.icon className="w-5 h-5 text-muted-foreground" />
                                <span>{item.label}</span>
                            </span>
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </Link>
                    </Button>
                ))}
            </div>
        </CardContent>
      </Card>

      <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10 text-base" onClick={logout}>
          <span className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
          </span>
      </Button>
    </div>
  );
}
