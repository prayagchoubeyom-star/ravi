
'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CryptoIcon } from './crypto-icon';
import { cn } from '@/lib/utils';
import { useTrading } from '@/context/trading-context';
import type { Order } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { format } from 'date-fns';
import { Badge } from './ui/badge';
import { useEffect, useState } from 'react';

export function OrdersView() {
  const { orders: initialOrders } = useTrading();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Parse dates on the client to avoid hydration mismatch
    const parsedOrders = initialOrders.map(order => ({...order, date: new Date(order.date)}));
    setOrders(parsedOrders);
  }, [initialOrders]);
  
  const openOrders = orders.filter(o => o.status === 'Open');
  const historyOrders = orders.filter(o => o.status !== 'Open');

  const renderOrderTable = (orders: Order[], isHistory: boolean) => {
    if (orders.length === 0) {
        return <p className="text-muted-foreground text-center p-8">No orders to display.</p>
    }
    return (
        <div className="rounded-lg border overflow-x-auto">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead className="px-2">Asset</TableHead>
                    <TableHead className="px-2">Details</TableHead>
                    <TableHead className="text-right px-2">Total</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {orders.map(order => (
                    <TableRow key={order.id}>
                    <TableCell className="whitespace-nowrap px-2">
                        <div className="flex items-center gap-2">
                            <CryptoIcon ticker={order.cryptoTicker} className="w-6 h-6" />
                            <div>
                                <span className="font-medium">{order.cryptoTicker}</span>
                                <p className={cn("text-sm", order.type === 'Buy' ? 'text-[hsl(142,76%,42%)]' : 'text-[hsl(0,84%,60%)]')}>{order.type}</p>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-nowrap px-2">
                        <p>Qty: {order.amount.toFixed(4)}</p>
                        <p>Price: ${order.price.toFixed(2)}</p>
                        <p className="text-muted-foreground">{format(order.date, 'dd MMM yyyy, HH:mm')}</p>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap px-2">
                        <p className="font-mono font-medium">${(order.amount * order.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        {isHistory && (
                            <Badge variant={order.status === 'Filled' ? 'default' : 'destructive'} className="mt-1 capitalize text-xs">{order.status}</Badge>
                        )}
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>
    )
  };

  return (
    <div className="p-4 space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Open Orders</CardTitle>
                <CardDescription>Your orders that have not been filled yet.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderOrderTable(openOrders, false)}
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Your past filled or cancelled orders.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderOrderTable(historyOrders, true)}
            </CardContent>
        </Card>
    </div>
  );
}
