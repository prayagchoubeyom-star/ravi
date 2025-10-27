
'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { adminUsers, adminDeposits, adminWithdrawals } from '@/lib/data';
import { Button } from './ui/button';
import { Trash2, CheckCircle, XCircle, Circle, DollarSign, Upload } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAdmin } from '@/context/admin-context';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
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


export function AdminView() {
  const { qrCodeUrl, setQrCodeUrl, addFunds } = useAdmin();
  const { toast } = useToast();

  const handleQrCodeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCodeUrl(reader.result as string);
        toast({
            title: "QR Code Updated",
            description: "The new QR code has been uploaded and will be shown to users.",
        })
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddFunds = (userId: string, userName: string) => {
    // In a real app, you'd likely use a dialog to ask for the amount.
    // For this prototype, we'll just add a fixed amount.
    const amountToAdd = 1000;
    addFunds(amountToAdd);
    toast({
        title: "Funds Added",
        description: `$${amountToAdd} has been added to ${userName}'s wallet.`,
    });
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
            <Card>
                <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>View and manage all registered users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {adminUsers.map((user) => (
                                <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell className="text-right space-x-1">
                                    <Button variant="outline" size="sm" onClick={() => handleAddFunds(user.id, user.name)}>
                                        <DollarSign className="h-4 w-4 mr-2" /> Add Funds
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="deposits">
            <Card>
                <CardHeader>
                    <CardTitle>Deposit Requests</CardTitle>
                    <CardDescription>Approve or reject user deposit requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminDeposits.map((deposit) => (
                                    <TableRow key={deposit.id}>
                                        <TableCell>{deposit.userName}</TableCell>
                                        <TableCell>${deposit.amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Badge variant={deposit.status === 'Approved' ? 'default' : deposit.status === 'Pending' ? 'secondary' : 'destructive'} className="capitalize">{deposit.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="ghost" size="icon" disabled={deposit.status !== 'Pending'}>
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" disabled={deposit.status !== 'Pending'}>
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="withdrawals">
           <Card>
                <CardHeader>
                    <CardTitle>Withdrawal Requests</CardTitle>
                    <CardDescription>Approve or reject user withdrawal requests.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Bank</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminWithdrawals.map((withdrawal) => (
                                    <TableRow key={withdrawal.id}>
                                        <TableCell>{withdrawal.userName}</TableCell>
                                        <TableCell>${withdrawal.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-xs">
                                            <p>{withdrawal.bankName}</p>
                                            <p className="text-muted-foreground">{withdrawal.accountNumber}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={withdrawal.status === 'Approved' ? 'default' : withdrawal.status === 'Pending' ? 'secondary' : 'destructive'} className="capitalize">{withdrawal.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="ghost" size="icon" disabled={withdrawal.status !== 'Pending'}>
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" disabled={withdrawal.status !== 'Pending'}>
                                                <XCircle className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="settings">
            <Card>
                <CardHeader>
                    <CardTitle>Deposit Settings</CardTitle>
                    <CardDescription>Manage the QR code for user deposits.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-medium mb-2">Current QR Code</h3>
                        <div className="p-4 bg-white rounded-lg inline-block">
                             {qrCodeUrl ? <Image src={qrCodeUrl} alt="Deposit QR Code" width={192} height={192} className="h-48 w-48" /> : <QrCodeIcon className="h-48 w-48 text-black" />}
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="qr-upload">Upload New QR Code</Label>
                        <div className="flex items-center gap-2">
                            <Input id="qr-upload" type="file" accept="image/*" className="max-w-sm" onChange={handleQrCodeUpload} />
                        </div>
                     </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
