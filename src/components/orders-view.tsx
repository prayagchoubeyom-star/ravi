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

export function OrdersView() {
  const { orders } = useTrading();
  const openOrders = orders.filter(o => o.status === 'Open');
  const historyOrders = orders.filter(o => o.status !== 'Open');

  const renderOrderTable = (orders: Order[]) => {
    if (orders.length === 0) {
        return <p className="text-muted-foreground text-center p-8">No orders to display.</p>
    }
    return (
        <div className="rounded-lg border">
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Price</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {orders.map(order => (
                <TableRow key={order.id}>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <CryptoIcon ticker={order.cryptoTicker} className="w-6 h-6" />
                        <span className="font-medium">{order.cryptoTicker}</span>
                    </div>
                </TableCell>
                <TableCell className={cn(order.type === 'Buy' ? 'text-green-500' : 'text-red-500')}>
                    {order.type}
                </TableCell>
                <TableCell className="text-right font-mono">{order.amount.toFixed(4)}</TableCell>
                <TableCell className="text-right font-mono">${order.price.toFixed(2)}</TableCell>
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
                {renderOrderTable(openOrders)}
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>Your past filled or cancelled orders.</CardDescription>
            </CardHeader>
            <CardContent>
                {renderOrderTable(historyOrders)}
            </CardContent>
        </Card>
    </div>
  );
}
