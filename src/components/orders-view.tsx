'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cryptos, orders as mockOrders } from '@/lib/data';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CryptoIcon } from './crypto-icon';
import { cn } from '@/lib/utils';

const orderSchema = z.object({
  crypto: z.string().min(1, 'Please select a crypto'),
  type: z.enum(['buy', 'sell']),
  amount: z.coerce.number().positive('Amount must be positive'),
  price: z.coerce.number().positive('Price must be positive'),
});

function NewOrderForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: { type: 'buy', amount: 0, price: 0 },
  });

  function onSubmit(values: z.infer<typeof orderSchema>) {
    console.log(values);
    toast({
      title: 'Order Placed!',
      description: `Your ${values.type} order for ${values.amount} of ${values.crypto} has been submitted.`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="crypto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cryptocurrency</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select a coin" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cryptos.map(c => <SelectItem key={c.id} value={c.ticker}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex gap-4"
              >
                <FormItem className="flex items-center space-x-2">
                  <FormControl><RadioGroupItem value="buy" id="buy" /></FormControl>
                  <FormLabel htmlFor="buy" className="font-normal text-green-500">Buy</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2">
                  <FormControl><RadioGroupItem value="sell" id="sell" /></FormControl>
                  <FormLabel htmlFor="sell" className="font-normal text-red-500">Sell</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl><Input type="number" step="any" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl><Input type="number" step="any" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Place Order</Button>
      </form>
    </Form>
  );
}

export function OrdersView() {
  const openOrders = mockOrders.filter(o => o.status === 'Open');
  const historyOrders = mockOrders.filter(o => o.status !== 'Open');

  const renderOrderTable = (orders: typeof mockOrders) => (
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
                    <CryptoIcon ticker={order.crypto.ticker} className="w-6 h-6" />
                    <span className="font-medium">{order.crypto.ticker}</span>
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
  );

  return (
    <div className="p-4">
      <Tabs defaultValue="new-order">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new-order">New Order</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="new-order">
          <Card>
            <CardHeader>
              <CardTitle>Create Order</CardTitle>
              <CardDescription>Place a buy or sell order.</CardDescription>
            </CardHeader>
            <CardContent>
              <NewOrderForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="open" className="space-y-4">
            <h3 className="font-semibold tracking-tight">Open Orders</h3>
            {renderOrderTable(openOrders)}
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
            <h3 className="font-semibold tracking-tight">Order History</h3>
            {renderOrderTable(historyOrders)}
        </TabsContent>
      </Tabs>
    </div>
  );
}
