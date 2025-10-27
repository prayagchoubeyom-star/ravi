'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { user } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bell, ChevronRight, Fingerprint, LogOut, Shield, Wallet, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';

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
            <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <span>Push Notifications</span>
                </Label>
                <Switch id="notifications" />
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="face-id" className="flex items-center gap-3">
                    <Fingerprint className="w-5 h-5 text-muted-foreground" />
                    <span>Enable Face ID</span>
                </Label>
                <Switch id="face-id" defaultChecked />
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Wallet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-3">
                    <ArrowDownToLine className="w-5 h-5 text-muted-foreground" />
                    <span>Deposit</span>
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-3">
                    <ArrowUpFromLine className="w-5 h-5 text-muted-foreground" />
                    <span>Withdraw</span>
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-between">
                <span className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                    <span>Security Center</span>
                </span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Button variant="ghost" className="w-full justify-between text-red-500 hover:text-red-500 hover:bg-red-500/10">
                <span className="flex items-center gap-3">
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                </span>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
