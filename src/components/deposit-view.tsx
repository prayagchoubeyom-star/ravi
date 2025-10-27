
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTransactions } from '@/context/transaction-context';
import { useAuth } from '@/context/auth-context';
import { Copy } from 'lucide-react';

export function DepositView() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { addDeposit, upiId } = useTransactions();
  const { user } = useAuth();
  const [amount, setAmount] = useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  
  const handleCopyUpi = () => {
    if (upiId) {
        navigator.clipboard.writeText(upiId);
        toast({
            title: "Copied!",
            description: "UPI ID copied to clipboard."
        });
    }
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    if (amount <= 0) {
        toast({
            variant: 'destructive',
            title: 'Invalid amount',
            description: 'Please enter a valid deposit amount.',
        });
        return;
    }

    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a payment screenshot.',
      });
      return;
    }

    addDeposit({
      userId: user.id,
      userName: user.name,
      amount: amount
    });

    toast({
      title: 'Deposit Request Submitted',
      description: `Your request to deposit $${amount.toLocaleString()} has been received and is pending approval.`,
    });

    router.push('/profile');
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Deposit Funds</CardTitle>
          <CardDescription>Send funds to the UPI ID below, then submit your deposit amount and payment proof.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          
          <div className="w-full space-y-2 text-center">
            <Label>Pay to this UPI ID</Label>
            {upiId ? (
                <div className="flex items-center justify-center gap-2 p-3 bg-muted rounded-lg">
                    <span className="font-mono text-lg">{upiId}</span>
                    <Button variant="ghost" size="icon" onClick={handleCopyUpi}>
                        <Copy className="h-5 w-5" />
                    </Button>
                </div>
            ) : (
                <div className="p-3 bg-muted rounded-lg">
                    <p className="text-muted-foreground">Admin has not set a UPI ID yet.</p>
                </div>
            )}
          </div>
          
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
                <Label htmlFor="amount">Deposit Amount (USD)</Label>
                <Input id="amount" type="number" value={amount > 0 ? amount : ''} onChange={(e) => setAmount(Number(e.target.value))} placeholder="e.g., 1000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="picture">Payment Screenshot</Label>
              <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
              {selectedFile && <p className="text-xs text-muted-foreground mt-1">File: {selectedFile.name}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={!upiId}>
              Submit Deposit Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
