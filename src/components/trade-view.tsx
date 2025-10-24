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
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { TradingViewWidget } from './tradingview-widget';
import { useCryptoData } from '@/hooks/use-crypto-data';
import { tickerToSymbol } from '@/lib/data';
import { Skeleton } from './ui/skeleton';
import { useTrading } from '@/context/trading-context';
import { useRouter } from 'next/navigation';

const orderSchema = z.object({
  type: z.enum(['buy', 'sell']),
  amount: z.coerce.number().positive('Amount must be positive'),
  price: z.coerce.number().positive('Price must be positive'),
});

type TradeViewProps = {
  ticker: string;
};

export function TradeView({ ticker }: TradeViewProps) {
    const { cryptos, loading } = useCryptoData();
    const { addOrder } = useTrading();
    const { toast } = useToast();
    const router = useRouter();

    const crypto = cryptos.find(c => c.ticker === ticker);
    const tradingViewSymbol = crypto ? tickerToSymbol[crypto.ticker] || `${crypto.ticker}USDT` : `${ticker}USDT`;

    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: { type: 'buy', amount: 0, price: crypto?.price || 0 },
    });

    // Update form price when crypto price changes
    if (crypto && form.getValues('price') === 0) {
        form.setValue('price', crypto.price);
    }

    function onSubmit(values: z.infer<typeof orderSchema>) {
        if (!crypto) return;

        addOrder({
            cryptoTicker: crypto.ticker,
            type: values.type === 'buy' ? 'Buy' : 'Sell',
            amount: values.amount,
            price: values.price,
        });

        toast({
            title: 'Order Placed!',
            description: `Your ${values.type} order for ${values.amount} ${crypto.ticker} has been submitted.`,
        });
        
        // Simulate order fulfillment and redirect
        setTimeout(() => {
            router.push('/positions');
        }, 1000)
    }

    if (loading && !crypto) {
        return (
             <div className="p-4 space-y-4">
                <Skeleton className="h-[50px] w-full" />
                <Skeleton className="h-[400px] w-full" />
                <Skeleton className="h-[300px] w-full" />
            </div>
        )
    }

    if (!crypto) {
        return <div className="p-4">Crypto not found</div>;
    }

  return (
    <div className="p-4 space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>{crypto.name} ({crypto.ticker})</CardTitle>
                <CardDescription>
                    <span className="text-2xl font-bold">${crypto.price.toLocaleString()}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] w-full p-0">
                <TradingViewWidget symbol={tradingViewSymbol} />
            </CardContent>
        </Card>

        <Card>
        <CardHeader>
            <CardTitle>Place Order</CardTitle>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <FormLabel>Amount ({ticker})</FormLabel>
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
                    <FormLabel>Price (USD)</FormLabel>
                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90">Place {form.getValues('type')} Order</Button>
            </form>
            </Form>
        </CardContent>
        </Card>
    </div>
  );
}
