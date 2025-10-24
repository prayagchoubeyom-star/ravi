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
import { ChevronRight, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { cn } from '@/lib/utils';
import { Separator } from './ui/separator';

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
    const { addOrder, balance } = useTrading();
    const { toast } = useToast();

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
        <header className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold">{orderSide === 'buy' ? "Buy" : "Sell"} {crypto.ticker}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
            </Button>
        </header>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1">
                <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                    <Tabs defaultValue="regular">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="regular">Regular</TabsTrigger>
                            <TabsTrigger value="cover" disabled>Cover</TabsTrigger>
                            <TabsTrigger value="amo" disabled>AMO</TabsTrigger>
                            <TabsTrigger value="iceberg" disabled>Iceberg</TabsTrigger>
                        </TabsList>
                    </Tabs>

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
                                <FormControl><Input type="number" step="any" {...field} disabled={orderType === 'market'} placeholder={orderType === 'market' ? 'Market' : ''} className="text-base" /></FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    
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
                                        <Label htmlFor="intraday" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                            Intraday <span className="text-xs text-muted-foreground">MIS</span>
                                        </Label>
                                    </FormItem>
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="longterm" id="longterm" className="peer sr-only" />
                                        </FormControl>
                                        <Label htmlFor="longterm" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                            Longterm <span className="text-xs text-muted-foreground">CNC</span>
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
                                <FormLabel>Type</FormLabel>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-4 gap-2">
                                     {['Market', 'Limit', 'SL', 'SL-M'].map(type => (
                                         <FormItem key={type}>
                                            <FormControl>
                                                <RadioGroupItem value={type.toLowerCase()} id={type.toLowerCase()} className="peer sr-only" disabled={type.startsWith('SL')}/>
                                            </FormControl>
                                            <Label htmlFor={type.toLowerCase()} className={cn("text-center rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary", type.startsWith('SL') && "opacity-50 cursor-not-allowed")}>
                                                {type}
                                            </Label>
                                        </FormItem>
                                     ))}
                                </RadioGroup>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="p-4 border-t mt-auto bg-background">
                     <div className="flex justify-between text-sm text-muted-foreground mb-4">
                        <span>Approx. margin: <span className="text-foreground font-medium">${margin.toFixed(2)}</span></span>
                        <span>Available: <span className="text-foreground font-medium">${balance.toLocaleString()}</span></span>
                    </div>
                    <Button type="submit" size="lg" className={cn("w-full text-lg", orderSide === 'buy' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700' )}>
                        <span className="flex-1 text-center">SWIPE TO {orderSide.toUpperCase()}</span>
                        <div className="bg-white/20 rounded-full p-1">
                            <ChevronRight className="h-6 w-6" />
                        </div>
                    </Button>
                </div>
            </form>
        </Form>
    </div>
  );
}