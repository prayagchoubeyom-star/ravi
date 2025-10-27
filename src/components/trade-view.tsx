
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
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { useMemo } from 'react';

const orderSchema = z.object({
  type: z.enum(['buy', 'sell']),
  product: z.enum(['intraday', 'longterm']),
  orderType: z.enum(['market', 'limit']),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  price: z.coerce.number().optional(),
}).refine(data => data.orderType === 'limit' ? data.price && data.price > 0 : true, {
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
            product: 'longterm', 
            orderType: 'limit',
            quantity: 0,
            price: crypto.price
        },
    });
    
    const orderType = form.watch('orderType');
    const orderSide = form.watch('type');
    const quantity = form.watch('quantity');
    const price = form.watch('price') || crypto.price;
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
            price: values.orderType === 'limit' ? values.price! : crypto.price,
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
                                        <Label htmlFor="buy" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-lg font-bold hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-600/10 peer-data-[state=checked]:text-blue-600">
                                            BUY
                                        </Label>
                                    </FormItem>
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="sell" id="sell" className="peer sr-only" disabled={!currentPosition} />
                                        </FormControl>
                                        <Label htmlFor="sell" className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 text-lg font-bold",
                                            !currentPosition ? "cursor-not-allowed opacity-50" : "hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-red-600 peer-data-[state=checked]:bg-red-600/10 peer-data-[state=checked]:text-red-600"
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
                                            <RadioGroupItem value="intraday" id="intraday" className="peer sr-only" />
                                        </FormControl>
                                        <Label htmlFor="intraday" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                            Intraday <span className="text-xs text-muted-foreground">MIS</span>
                                        </Label>
                                    </FormItem>
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="longterm" id="longterm" className="peer sr-only" />
                                        </FormControl>
                                        <Label htmlFor="longterm" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                            Investment <span className="text-xs text-muted-foreground">CNC</span>
                                        </Label>
                                    </FormItem>
                                </RadioGroup>
                            </FormItem>
                        )}
                    />

                     <FormField
                        control={form.control}
                        name="orderType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Order Type</FormLabel>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-2">
                                     {['Market', 'Limit'].map(type => (
                                         <FormItem key={type}>
                                            <FormControl>
                                                <RadioGroupItem value={type.toLowerCase()} id={type.toLowerCase()} className="peer sr-only" />
                                            </FormControl>
                                            <Label htmlFor={type.toLowerCase()} className={cn("text-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary")}>
                                                {type}
                                            </Label>
                                        </FormItem>
                                     ))}
                                </RadioGroup>
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl><Input type="number" step="any" {...field} className="text-base" /></FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl><Input type="number" step="any" {...field} disabled={orderType === 'market'} placeholder={orderType === 'market' ? 'At Market' : ''} className="text-base" /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    {form.formState.errors.quantity && <p className="text-sm font-medium text-destructive">{form.formState.errors.quantity.message}</p>}
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
                    <Button type="submit" size="lg" className={cn("w-full text-lg", orderSide === 'buy' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700', orderSide === 'sell' && !currentPosition && "opacity-50 cursor-not-allowed")} disabled={orderSide === 'sell' && !currentPosition}>
                        {orderSide.toUpperCase()}
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  );
}
