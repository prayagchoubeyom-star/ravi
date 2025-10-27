
'use client';

import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { initialOrders } from "@/lib/data";
import { useRouter } from "next/navigation";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/context/auth-context";


export default function UserDetailsPage({ params: { userId } }: { params: { userId: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const { users } = useAuth();
    const [editPrice, setEditPrice] = useState(0);

    const user = users.find(u => u.id === userId);

    if (!user) {
        return (
            <div className="p-4 text-center">
                <p>User not found.</p>
                <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
            </div>
        );
    }
    
    // Mock data for this specific user. In a real app, you would fetch this.
    const userOrders = initialOrders.slice(0,3);

    const handlePriceChange = (orderId: string) => {
        toast({
            title: "Price Updated (Mock)",
            description: `Order ${orderId} price changed to $${editPrice}.`
        });
    }

  return (
    <ProtectedRoute adminOnly={true}>
      <AppHeader title={`${user.name}'s Details`} hasBack />
      <div className="p-4 space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>User Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Trade History</CardTitle>
                <CardDescription>Order history for this user.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Asset</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {userOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.cryptoTicker}</TableCell>
                                    <TableCell>{order.type}</TableCell>
                                    <TableCell>{order.amount}</TableCell>
                                    <TableCell className="text-right">${order.price.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" size="sm">Modify</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Modify Position Price</DialogTitle>
                                                    <DialogDescription>Change the executed price for this order.</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-4 py-4">
                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                        <Label htmlFor="price" className="text-right">New Price</Label>
                                                        <Input id="price" type="number" defaultValue={order.price} onChange={(e) => setEditPrice(Number(e.target.value))} className="col-span-3" />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button onClick={() => handlePriceChange(order.id)}>Save</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

    