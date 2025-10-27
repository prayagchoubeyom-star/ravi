
'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTrading } from '@/context/trading-context';
import type { Crypto } from '@/lib/data';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';
import { ScrollArea } from './ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';

const orderSchema = z.object({
  product: z.enum(['limit', 'market']),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  price: z.coerce.number().optional(),
  target: z.coerce.number().optional(),
  stoploss: z.coerce.number().optional(),
  useTpSl: z.boolean(),
}).refine(data => data.product === 'limit' ? data.price && data.price > 0 : true, {
    message: 'Price is required for limit orders',
    path: ['price'],
});

type TradeViewProps = {
  crypto: Crypto;
  onClose: () => void;
};

export function TradeView({ crypto, onClose }: TradeViewProps) {
    const { addOrder, balance, positions } = useTrading();
    const { toast } = useToast();
    const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
    
    const currentPosition = useMemo(() => {
        return positions.find(p => p.cryptoTicker === crypto.ticker);
    }, [positions, crypto.ticker]);

    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: { 
            product: 'limit',
            quantity: 0,
            price: crypto.price,
            target: 0,
            stoploss: 0,
            useTpSl: false,
        },
    });
    
    const productType = form.watch('product');
    const useTpSl = form.watch('useTpSl');
    const quantity = form.watch('quantity');
    const price = productType === 'market' ? crypto.price : form.watch('price') || crypto.price;
    const cost = quantity * price;

    function onSubmit(values: z.infer<typeof orderSchema>) {
        const finalOrderSide = orderSide;

        if (finalOrderSide === 'buy' && cost > balance) {
            form.setError('quantity', { message: 'Insufficient balance.' });
            return;
        }

        if (finalOrderSide === 'sell') {
            if (!currentPosition) {
                form.setError('quantity', { message: `You have no ${crypto.ticker} to sell.` });
                return;
            }
            if (values.quantity > currentPosition.quantity) {
                form.setError('quantity', { message: `Cannot sell more than you own (${currentPosition.quantity.toFixed(6)}).` });
                return;
            }
        }

        addOrder({
            cryptoTicker: crypto.ticker,
            type: finalOrderSide === 'buy' ? 'Buy' : 'Sell',
            amount: values.quantity,
            price: values.product === 'limit' ? values.price! : crypto.price,
        });

        toast({
            title: 'Order Placed!',
            description: `Your ${finalOrderSide} order for ${values.quantity} ${crypto.ticker} has been submitted.`,
        });
        
        onClose();
    }
    
    const handleBuyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOrderSide('buy');
        form.handleSubmit(onSubmit)();
    };

    const handleSellClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOrderSide('sell');
        form.handleSubmit(onSubmit)();
    };


  return (
    <div className="flex flex-col h-full bg-background">
        <Form {...form}>
            <form onSubmit={e => e.preventDefault()} className="flex flex-col flex-1">
                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-4">
                        <Tabs defaultValue={orderSide} onValueChange={(value) => setOrderSide(value as 'buy' | 'sell')} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="buy">Buy</TabsTrigger>
                                <TabsTrigger value="sell">Sell</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        
                        <FormField
                            control={form.control}
                            name="product"
                            render={({ field }) => (
                                <FormItem>
                                    <Tabs onValueChange={field.onChange} defaultValue={field.value} className="w-full">
                                        <TabsList className="h-8 p-0 bg-transparent gap-2">
                                            <TabsTrigger value="limit" className="text-xs data-[state=active]:bg-muted data-[state=active]:shadow-none data-[state=active]:text-foreground rounded-sm px-2 py-1 h-auto">Limit</TabsTrigger>
                                            <TabsTrigger value="market" className="text-xs data-[state=active]:bg-muted data-[state=active]:shadow-none data-[state=active]:text-foreground rounded-sm px-2 py-1 h-auto">Market</TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 gap-4">
                            {productType === 'limit' && (
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
                            )}
                            <FormField
                                control={form.control}
                                name="quantity"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Quantity</FormLabel>
                                    <FormControl><Input type="number" step="any" {...field} /></FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <FormField
                            control={form.control}
                            name="useTpSl"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        TP/SL
                                    </FormLabel>
                                </FormItem>
                            )}
                        />

                        {useTpSl && (
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="target"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Target</FormLabel>
                                        <FormControl><Input type="number" step="any" {...field} placeholder="Target Price" /></FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stoploss"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Stop-loss</FormLabel>
                                        <FormControl><Input type="number" step="any" {...field} placeholder="Stop Price" /></FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t mt-auto bg-background">
                     <div className="flex justify-between text-sm text-muted-foreground mb-4">
                        {orderSide === 'buy' ? (
                            <span>Available: <span className="text-foreground font-medium">${balance.toLocaleString()}</span></span>
                        ) : (
                            <span>Holding: <span className="text-foreground font-medium">{currentPosition?.quantity.toFixed(6) || 0} {crypto.ticker}</span></span>
                        )}
                        <span>Cost: <span className="text-foreground font-medium">${cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Button onClick={handleBuyClick} size="lg" className="w-full text-lg bg-[hsl(142,76%,42%)] hover:bg-[hsl(142,76%,38%)] text-white">
                            Buy
                        </Button>
                         <Button onClick={handleSellClick} size="lg" className={cn("w-full text-lg bg-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,55%)] text-white", !currentPosition && "opacity-50 cursor-not-allowed hover:bg-[hsl(0,84%,60%)]")} disabled={!currentPosition}>
                            Sell
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    </div>
  );
}
