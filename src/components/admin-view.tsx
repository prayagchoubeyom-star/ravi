
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
import { Button } from './ui/button';
import { Trash2, CheckCircle, XCircle, UserPlus, Eye, Edit } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAdmin } from '@/context/admin-context';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
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
import { useAuth } from '@/context/auth-context';
import { useTransactions } from '@/context/transaction-context';
import type { Deposit, Withdrawal } from '@/context/transaction-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';


export function AdminView() {
  const { upiId, setUpiId, addFunds } = useAdmin();
  const { users, addUser, deleteUser } = useAuth();
  const { deposits, withdrawals, updateDepositStatus, updateWithdrawalStatus } = useTransactions();
  const { toast } = useToast();
  const router = useRouter();
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [editFundsAmount, setEditFundsAmount] = useState(0);
  const [newUpiId, setNewUpiId] = useState(upiId || '');

  const handleUpiIdUpdate = () => {
    setUpiId(newUpiId);
    toast({
        title: "UPI ID Updated",
        description: "The new UPI ID will be shown to users for deposits.",
    })
  };

  const handleCreateUser = () => {
    if (newUserName && newUserEmail && newUserPassword) {
        addUser({
            name: newUserName,
            email: newUserEmail,
            password: newUserPassword,
        });
        toast({
            title: "User Created",
            description: `User ${newUserName} has been created. They can now log in.`,
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
    deleteUser(userId);
    toast({
        title: "User Deleted",
        description: `The user has been removed.`,
    });
  };


  const handleEditFunds = (userId: string, userName: string) => {
    addFunds(editFundsAmount, userId);
    toast({
        title: "Funds Updated",
        description: `Funds for ${userName} have been set to $${editFundsAmount.toLocaleString()}.`,
    });
  }

  const handleDepositAction = (deposit: Deposit, newStatus: 'Approved' | 'Rejected') => {
    updateDepositStatus(deposit.id, newStatus);
    toast({
        title: `Deposit ${newStatus}`,
        description: `Request from ${deposit.userName} for $${deposit.amount.toLocaleString()} has been ${newStatus.toLowerCase()}.`
    });
  }

  const handleWithdrawalAction = (withdrawal: Withdrawal, newStatus: 'Approved' | 'Rejected') => {
    const user = users.find(u => u.id === withdrawal.userId);
    if (newStatus === 'Approved' && user && user.balance < withdrawal.amount) {
        toast({
            variant: 'destructive',
            title: "Insufficient Balance",
            description: `${withdrawal.userName} does not have enough funds to approve this withdrawal.`,
        });
        return;
    }
    updateWithdrawalStatus(withdrawal.id, newStatus);
     toast({
        title: `Withdrawal ${newStatus}`,
        description: `Request from ${withdrawal.userName} for $${withdrawal.amount.toLocaleString()} has been ${newStatus.toLowerCase()}.`
    });
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="deposits">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>User Management</CardTitle>
                        <CardDescription>View and manage all registered users.</CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm"><UserPlus className="h-4 w-4 mr-2" /> Create</Button>
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
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="px-2">User</TableHead>
                                <TableHead className="text-right px-2">Actions</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {users.filter(u => u.email !== 'wellfiree').map((user) => (
                                <TableRow key={user.id}>
                                <TableCell className="font-medium px-2 whitespace-nowrap">
                                    <div>{user.name}</div>
                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                </TableCell>
                                <TableCell className="text-right px-2">
                                    <div className="flex flex-wrap items-center justify-end gap-1">
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
                                                        defaultValue={user.balance}
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
        <TabsContent value="deposits" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Deposit Requests</CardTitle>
                    <CardDescription>Approve or reject user deposit requests.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-2">User</TableHead>
                                    <TableHead className="px-2">Amount</TableHead>
                                    <TableHead className="px-2">Status</TableHead>
                                    <TableHead className="text-right px-2">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {deposits.map((deposit) => (
                                    <TableRow key={deposit.id}>
                                        <TableCell className="whitespace-nowrap px-2">{deposit.userName}</TableCell>
                                        <TableCell className="px-2">${deposit.amount.toLocaleString()}</TableCell>
                                        <TableCell className="px-2">
                                            <Badge variant={deposit.status === 'Approved' ? 'default' : deposit.status === 'Pending' ? 'secondary' : 'destructive'} className="capitalize">{deposit.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-1 px-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={deposit.status !== 'Pending'} onClick={() => handleDepositAction(deposit, 'Approved')}>
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={deposit.status !== 'Pending'} onClick={() => handleDepositAction(deposit, 'Rejected')}>
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
        <TabsContent value="withdrawals" className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>Withdrawal Requests</CardTitle>
                    <CardDescription>Approve or reject user withdrawal requests.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-2">User</TableHead>
                                    <TableHead className="px-2">Details</TableHead>
                                    <TableHead className="text-right px-2">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {withdrawals.map((withdrawal) => (
                                    <TableRow key={withdrawal.id}>
                                        <TableCell className="whitespace-nowrap px-2">{withdrawal.userName}</TableCell>
                                        <TableCell className="px-2 whitespace-nowrap">
                                            <p>${withdrawal.amount.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">{withdrawal.upiId}</p>
                                        </TableCell>
                                        <TableCell className="text-right space-x-1 px-2">
                                             <Badge variant={withdrawal.status === 'Approved' ? 'default' : withdrawal.status === 'Pending' ? 'secondary' : 'destructive'} className="capitalize mr-2">{withdrawal.status}</Badge>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={withdrawal.status !== 'Pending'} onClick={() => handleWithdrawalAction(withdrawal, 'Approved')}>
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={withdrawal.status !== 'Pending'} onClick={() => handleWithdrawalAction(withdrawal, 'Rejected')}>
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
        <TabsContent value="settings" className="mt-4">
             <Card>
                <CardHeader>
                    <CardTitle>Deposit Settings</CardTitle>
                    <CardDescription>Manage the UPI ID for user deposits.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="upi-id">Company UPI ID</Label>
                        <div className="flex items-center gap-2">
                            <Input id="upi-id" value={newUpiId} onChange={(e) => setNewUpiId(e.target.value)} placeholder="yourcompany@upi" className="max-w-sm" />
                            <Button onClick={handleUpiIdUpdate}>Save</Button>
                        </div>
                        {upiId && <p className="text-sm text-muted-foreground">Current UPI ID: {upiId}</p>}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    
    