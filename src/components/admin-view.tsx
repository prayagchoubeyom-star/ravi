
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
import { adminUsers as initialAdminUsers, adminDeposits, adminWithdrawals } from '@/lib/data';
import { Button } from './ui/button';
import { Trash2, CheckCircle, XCircle, UserPlus, Eye, Edit } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAdmin } from '@/context/admin-context';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation';

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
  const router = useRouter();
  const [adminUsers, setAdminUsers] = useState(initialAdminUsers);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [editFundsAmount, setEditFundsAmount] = useState(0);

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

  const handleCreateUser = () => {
    if (newUserName && newUserEmail && newUserPassword) {
        const newUser = {
            id: (Math.random() * 1000000).toString(),
            name: newUserName,
            email: newUserEmail,
        };
        setAdminUsers(prevUsers => [newUser, ...prevUsers]);
        toast({
            title: "User Created",
            description: `User ${newUserName} has been created.`,
        });
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
    } else {
        toast({
            variant: 'destructive',
            title: "Error",
            description: "Please fill all fields to create a user.",
        });
    }
  };
  
  const handleDeleteUser = (userId: string) => {
    setAdminUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    toast({
        title: "User Deleted",
        description: `The user has been removed.`,
    });
  };


  const handleEditFunds = (userId: string, userName: string) => {
    addFunds(editFundsAmount, userId); // In real app, pass userId
    toast({
        title: "Funds Updated",
        description: `Funds for ${userName} have been set to $${editFundsAmount.toLocaleString()}.`,
    });
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>View and manage all registered users.</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button><UserPlus className="h-4 w-4 mr-2" /> Create</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                                <DialogDescription>Enter the details for the new user.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="name" className="text-right">Name</Label>
                                    <Input id="name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">Email</Label>
                                    <Input id="email" type="email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} className="col-span-3" />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="password"  className="text-right">Password</Label>
                                    <Input id="password" type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} className="col-span-3" />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" onClick={handleCreateUser}>Create User</Button>
                                </DialogClose>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden sm:table-cell">Email</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {adminUsers.map((user) => (
                                <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell className="hidden sm:table-cell">{user.email}</TableCell>
                                <TableCell className="text-right">
                                    <div className="inline-flex flex-wrap items-center justify-end gap-1">
                                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.push(`/admin/users/${user.id}`)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Funds for {user.name}</DialogTitle>
                                                    <DialogDescription>Set the new wallet balance for this user.</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                    <Label htmlFor="funds" className="text-right">
                                                        Balance
                                                    </Label>
                                                    <Input
                                                        id="funds"
                                                        type="number"
                                                        defaultValue={0} // In a real app, you'd fetch the user's current balance
                                                        onChange={(e) => setEditFundsAmount(Number(e.target.value))}
                                                        className="col-span-3"
                                                    />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button onClick={() => handleEditFunds(user.id, user.name)}>Save changes</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteUser(user.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
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
                                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminDeposits.map((deposit) => (
                                    <TableRow key={deposit.id}>
                                        <TableCell>{deposit.userName}</TableCell>
                                        <TableCell>${deposit.amount.toLocaleString()}</TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge variant={deposit.status === 'Approved' ? 'default' : deposit.status === 'Pending' ? 'secondary' : 'destructive'} className="capitalize">{deposit.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={deposit.status !== 'Pending'}>
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={deposit.status !== 'Pending'}>
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
                                    <TableHead className="hidden sm:table-cell">Bank</TableHead>
                                    <TableHead className="hidden md:table-cell">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {adminWithdrawals.map((withdrawal) => (
                                    <TableRow key={withdrawal.id}>
                                        <TableCell>{withdrawal.userName}</TableCell>
                                        <TableCell>${withdrawal.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-xs hidden sm:table-cell">
                                            <p>{withdrawal.bankName}</p>
                                            <p className="text-muted-foreground">{withdrawal.accountNumber}</p>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell">
                                            <Badge variant={withdrawal.status === 'Approved' ? 'default' : withdrawal.status === 'Pending' ? 'secondary' : 'destructive'} className="capitalize">{withdrawal.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={withdrawal.status !== 'Pending'}>
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={withdrawal.status !== 'Pending'}>
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

    