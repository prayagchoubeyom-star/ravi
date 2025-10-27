
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTrading } from '@/context/trading-context';
import Image from 'next/image';

const QrCodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg aria-hidden="true" viewBox="0 0 128 128" {...props}>
      <path
        fill="currentColor"
        d="M36 36h20V16H36zm40 0h32V16H76zM16 36h20V16H16zm20 20H16v20h20zm0 20H16v36h20zm0-40H16v20h20zM56 56H36v20h20zm-20 0H16v20h20zm60-20h32v20H96zm-20 0h20V16H76zM56 16v20H36V16zM36 56v20H16V56zm40 0h20V36H76zm20 0h20V36H96zm-20 20H76v20h20zm0 0v20H56v-20zm0 0H76v20h20zM56 76v20H36V76zm40 20H76v36h20zm-20 0H56v20h20zm-20 0H36v20h20zm40-20H76v20h20zm20 20h20V76H96zM76 76v20H56V76zm40-20v20H96V56zm-20 0v20H76V56zm20 0h20V36H96zM36 76H16v20h20zm40-20H56v20h20zM36 96v20H16V96z"
      />
      <path
        fill="currentColor"
        d="M16 16H0v40h40V16H16zm20 20H4V20h32zM76 16H56v20h20zM16 76H0v40h40V76H16zm20 20H4V80h32zM96 96H76v20h20zm-20-20H56v20h20zm-20 0H36v20h20zm-20 0H16v20h20zm40 20H56v20h20zM112 16h-4v4h-4v4h-4v4h-4v4h-4v4h4v-4h4v-4h4v-4h4v-4h4zm-20 0h-4v4h-4v4h4v-4h4zM16 56H0v20h20V56H0v20h20v-4h-4v-4h-4v-4h-4v-4h-4zm20 20H16v20h20v-4h-4v-4h-4v-4h-4v-4h-4zm20-20H36v20h20v-4h-4v-4h-4v-4h-4v-4h-4zM16 112H0v20h20v-4h-4v-4h-4v-4h-4v-4h-4zm20-20H16v20h20v-4h-4v-4h-4v-4h-4v-4h-4zm76-40h20v40h-4v-4h-4v-4h-4v-4h-4v-4h-4zm-20 4h-4v4h4zM56 116h4v4h4v4h-4v-4h-4zM116 16h-4v4h-4v4h4v-4h4zm-40-4v-4h4v-4h-4v-4h-4v4h4v4z"
      />
    </svg>
  );

export function DepositView() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const { qrCodeUrl, addFunds } = useTrading();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please upload a payment screenshot.',
      });
      return;
    }

    // In a real app, you would handle the file upload and a webhook would credit the account.
    // For this prototype, we'll simulate a deposit of $1,000 for demonstration purposes.
    const mockDepositAmount = 1000;
    addFunds(mockDepositAmount);

    toast({
      title: 'Deposit Submitted',
      description: `Your deposit request has been received. $${mockDepositAmount.toLocaleString()} has been added to your balance.`,
    });

    // Reset form and navigate back to profile
    setSelectedFile(null);
    router.push('/profile');
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Deposit Funds</CardTitle>
          <CardDescription>Scan the QR code with your payment app to deposit funds into your wallet.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6">
          <div className="p-4 bg-white rounded-lg">
             {qrCodeUrl ? <Image src={qrCodeUrl} alt="Deposit QR Code" width={192} height={192} className="h-48 w-48" /> : <QrCodeIcon className="h-48 w-48 text-black" />}
          </div>
          <p className="text-sm text-muted-foreground text-center">
            After payment, upload a screenshot of the transaction for verification.
          </p>
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Payment Screenshot</Label>
              <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
              {selectedFile && <p className="text-xs text-muted-foreground mt-1">File: {selectedFile.name}</p>}
            </div>
            <Button type="submit" className="w-full">
              Submit for Verification
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
