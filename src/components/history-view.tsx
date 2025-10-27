
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/auth-context";
import { useTransactions, type Deposit, type Withdrawal } from "@/context/transaction-context";
import { Badge } from "./ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function HistoryView() {
    const { user } = useAuth();
    const { deposits, withdrawals } = useTransactions();

    const userDeposits = deposits.filter(d => d.userId === user?.id);
    const userWithdrawals = withdrawals.filter(w => w.userId === user?.id);

    return (
        <div className="p-4">
            <Tabs defaultValue="deposits">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="deposits">Deposits</TabsTrigger>
                    <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                </TabsList>
                <TabsContent value="deposits">
                    <Card>
                        <CardHeader>
                            <CardTitle>Deposit History</CardTitle>
                            <CardDescription>Your history of deposit requests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {userDeposits.length === 0 ? (
                                <p className="text-center text-muted-foreground p-4">No deposit history.</p>
                            ) : (
                                <div className="rounded-lg border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {userDeposits.map((deposit) => (
                                                <TableRow key={deposit.id}>
                                                    <TableCell>${deposit.amount.toLocaleString()}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{format(new Date(deposit.date), 'dd MMM yyyy')}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant={deposit.status === 'Approved' ? 'default' : deposit.status === 'Pending' ? 'secondary' : 'destructive'} className="capitalize">{deposit.status}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="withdrawals">
                    <Card>
                        <CardHeader>
                            <CardTitle>Withdrawal History</CardTitle>
                            <CardDescription>Your history of withdrawal requests.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             {userWithdrawals.length === 0 ? (
                                <p className="text-center text-muted-foreground p-4">No withdrawal history.</p>
                            ) : (
                                <div className="rounded-lg border overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>UPI ID</TableHead>
                                                <TableHead className="text-right">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {userWithdrawals.map((withdrawal) => (
                                                <TableRow key={withdrawal.id}>
                                                    <TableCell>${withdrawal.amount.toLocaleString()}</TableCell>
                                                    <TableCell className="text-xs">{withdrawal.upiId}</TableCell>
                                                    <TableCell className="text-right">
                                                         <Badge variant={withdrawal.status === 'Approved' ? 'default' : withdrawal.status === 'Pending' ? 'secondary' : 'destructive'} className="capitalize">{withdrawal.status}</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

    