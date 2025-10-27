
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

export function SignupView() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { addUser, users } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        toast({
            variant: 'destructive',
            title: 'Passwords do not match',
            description: 'Please re-enter your password.',
        });
        return;
    }

    if (users.some(user => user.email === email)) {
        toast({
            variant: 'destructive',
            title: 'User already exists',
            description: 'An account with this email already exists. Please log in.',
        });
        return;
    }

    addUser({ name, email, password });

    toast({
        title: 'Registration Successful',
        description: 'Your account has been created. Please log in.',
    });

    router.push('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background p-4">
      <div className="mb-8 text-4xl font-extrabold tracking-tighter uppercase drop-shadow-md bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        WELLFIREE
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>Create a new account to start trading.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>
        </CardContent>
         <CardFooter className="text-sm justify-center">
            <p className="text-muted-foreground">Already have an account? <Link href="/login" className="text-primary hover:underline">Log In</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}
