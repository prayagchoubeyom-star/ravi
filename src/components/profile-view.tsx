'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { user } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ChevronRight, ArrowDownToLine, ArrowUpFromLine, LogOut } from 'lucide-react';
import Link from 'next/link';

export function ProfileView() {
  const userAvatar = PlaceHolderImages.find(img => img.id === 'user-avatar');

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
            {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt={user.name} data-ai-hint={userAvatar.imageHint} />}
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button asChild variant="ghost" className="w-full justify-between">
                <Link href="/deposit">
                    <span className="flex items-center gap-3">
                        <ArrowDownToLine className="w-5 h-5 text-muted-foreground" />
                        <span>Deposit</span>
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-between">
                <Link href="/withdraw">
                    <span className="flex items-center gap-3">
                        <ArrowUpFromLine className="w-5 h-5 text-muted-foreground" />
                        <span>Withdraw</span>
                    </span>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
            </Button>
        </CardContent>
      </Card>

      <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10 text-base">
          <span className="flex items-center gap-3">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
          </span>
      </Button>
    </div>
  );
}
