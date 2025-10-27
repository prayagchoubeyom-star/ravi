
'use client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTrading } from '@/context/trading-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTransactions } from '@/context/transaction-context';
import { useAuth } from '@/context/auth-context';

const withdrawalSchema = z.object({
  upiId: z.string().min(3, 'A valid UPI ID is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
});

export function WithdrawView() {
  const { balance } = useTrading();
  const { addWithdrawal } = useTransactions();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof withdrawalSchema>>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      upiId: '',
      amount: 0,
    },
  });

  function onSubmit(values: z.infer<typeof withdrawalSchema>) {
    if (!user) return;

    if (values.amount > balance) {
      form.setError('amount', {
        type: 'manual',
        message: 'Withdrawal amount cannot exceed your balance.',
      });
      return;
    }

    addWithdrawal({
        userId: user.id,
        userName: user.name,
        amount: values.amount,
        upiId: values.upiId,
    });


    toast({
      title: 'Withdrawal Request Submitted',
      description: `Your request to withdraw $${values.amount.toLocaleString()} has been received and is pending approval.`,
    });

    router.push('/profile');
  }

  return (
    <div className="p-4 space-y-4">
        <Card>
            <CardHeader>
                <CardTitle>Available Balance</CardTitle>
                <CardDescription>Your total withdrawable balance.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>Enter your UPI ID and the amount to withdraw.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="upiId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your UPI ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="yourname@upi" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="any" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Request Withdrawal
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
