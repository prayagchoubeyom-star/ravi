
'use client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTrading } from '@/context/trading-context';
import type { Crypto } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useMemo } from 'react';

const orderSchema = z.object({
  type: z.enum(['buy', 'sell']),
  product: z.enum(['market', 'limit']),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  price: z.coerce.number().optional(),
  target: z.coerce.number().optional(),
  stoploss: z.coerce.number().optional(),
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

    const currentPosition = useMemo(() => {
        return positions.find(p => p.cryptoTicker === crypto.ticker);
    }, [positions, crypto.ticker]);

    const form = useForm<z.infer<typeof orderSchema>>({
        resolver: zodResolver(orderSchema),
        defaultValues: { 
            type: 'buy', 
            product: 'limit',
            quantity: 0,
            price: crypto.price,
            target: 0,
            stoploss: 0
        },
    });
    
    const productType = form.watch('product');
    const orderSide = form.watch('type');
    const quantity = form.watch('quantity');
    const price = productType === 'market' ? crypto.price : form.watch('price') || crypto.price;
    const margin = quantity * price;

    function onSubmit(values: z.infer<typeof orderSchema>) {
        if (values.type === 'buy' && margin > balance) {
            form.setError('quantity', { message: 'Insufficient balance.' });
            return;
        }

        if (values.type === 'sell') {
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
            type: values.type === 'buy' ? 'Buy' : 'Sell',
            amount: values.quantity,
            price: values.product === 'limit' ? values.price! : crypto.price,
        });

        toast({
            title: 'Order Placed!',
            description: `Your ${values.type} order for ${values.quantity} ${crypto.ticker} has been submitted.`,
        });
        
        onClose();
    }

  return (
    <div className="flex flex-col h-full bg-background">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                    
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem className="space-y-0">
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-2">
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="buy" id="buy" className="peer sr-only" />
                                        </FormControl>
                                        <Label htmlFor="buy" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-lg font-bold hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[hsl(142,76%,42%)] peer-data-[state=checked]:bg-[hsl(142,76%,42%)]/10 peer-data-[state=checked]:text-[hsl(142,76%,42%)]">
                                            BUY
                                        </Label>
                                    </FormItem>
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="sell" id="sell" className="peer sr-only" disabled={!currentPosition} />
                                        </FormControl>
                                        <Label htmlFor="sell" className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-lg font-bold",
                                            !currentPosition ? "cursor-not-allowed opacity-50" : "hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-[hsl(0,84%,60%)] peer-data-[state=checked]:bg-[hsl(0,84%,60%)]/10 peer-data-[state=checked]:text-[hsl(0,84%,60%)]"
                                        )}>
                                            SELL
                                        </Label>
                                    </FormItem>
                                </RadioGroup>
                            </FormItem>
                        )}
                    />
                    
                    <FormField
                        control={form.control}
                        name="product"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product</FormLabel>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-2">
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="market" id="market-product" className="peer sr-only" />
                                        </FormControl>
                                        <Label htmlFor="market-product" className="flex flex-col items-center justify-center text-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                            Market
                                        </Label>
                                    </FormItem>
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="limit" id="limit-product" className="peer sr-only" />
                                        </FormControl>
                                        <Label htmlFor="limit-product" className="flex flex-col items-center justify-center text-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                            Limit
                                        </Label>
                                    </FormItem>
                                </RadioGroup>
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl><Input type="number" step="any" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl><Input type="number" step="any" {...field} disabled={productType === 'market'} placeholder={productType === 'market' ? 'At Market' : ''} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    {form.formState.errors.quantity && <p className="text-sm font-medium text-destructive">{form.formState.errors.quantity.message}</p>}
                    {form.formState.errors.price && <p className="text-sm font-medium text-destructive">{form.formState.errors.price.message}</p>}
                    
                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="target"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Target (Optional)</FormLabel>
                                <FormControl><Input type="number" step="any" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="stoploss"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Stop-loss (Optional)</FormLabel>
                                <FormControl><Input type="number" step="any" {...field} /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <div className="p-4 border-t mt-auto bg-background">
                     <div className="flex justify-between text-sm text-muted-foreground mb-4">
                        {orderSide === 'buy' ? (
                            <span>Available: <span className="text-foreground font-medium">${balance.toLocaleString()}</span></span>
                        ) : (
                            <span>Holding: <span className="text-foreground font-medium">{currentPosition?.quantity.toFixed(6) || 0} {crypto.ticker}</span></span>
                        )}
                        <span>Approx. cost: <span className="text-foreground font-medium">${margin.toFixed(2)}</span></span>
                    </div>
                    <Button type="submit" size="lg" className={cn("w-full text-lg", orderSide === 'buy' ? 'bg-[hsl(142,76%,42%)] hover:bg-[hsl(142,76%,38%)]' : 'bg-[hsl(0,84%,60%)] hover:bg-[hsl(0,84%,55%)]', orderSide === 'sell' && !currentPosition && "opacity-50 cursor-not-allowed")} disabled={orderSide === 'sell' && !currentPosition}>
                        {orderSide.toUpperCase()}
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  );
}
