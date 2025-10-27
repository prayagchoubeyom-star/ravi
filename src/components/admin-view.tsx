
'use client';

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
import { Trash2, CheckCircle, XCircle, Circle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function AdminView() {
  
  const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Approved':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'Rejected':
            return <XCircle className="h-5 w-5 text-red-500" />;
        case 'Pending':
            return <Circle className="h-5 w-5 text-yellow-500" />;
        default:
            return null;
    }
  }

  return (
    <div className="p-4">
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="deposits">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
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
                                <TableCell className="text-right">
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
      </Tabs>
    </div>
  );
}
