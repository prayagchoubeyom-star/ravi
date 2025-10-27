
'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CryptoIcon } from './crypto-icon';
import { useTrading } from '@/context/trading-context';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from 'react';
import type { Crypto } from '@/lib/data';
import { fetchAllCryptoData } from '@/services/crypto-service';

export function PositionsView() {
  const [allCryptos, setAllCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const { positions, closePosition } = useTrading();
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllCryptoData();
        setAllCryptos(data);
      } catch (error) {
        console.error("Failed to fetch crypto data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    const interval = setInterval(loadData, 1000); // Poll every 1 second
    return () => clearInterval(interval);
  }, []);

  if (loading && positions.length === 0) {
      return <div className="p-4 text-center">Loading portfolio...</div>
  }

  const positionsWithCurrentPrice = positions.map(pos => {
      const currentCryptoData = allCryptos.find(c => c.ticker === pos.cryptoTicker);
      return {
          ...pos,
          currentPrice: currentCryptoData?.price || pos.avgPrice, // Fallback to avgPrice if not found
          cryptoName: currentCryptoData?.name || pos.cryptoTicker,
      };
  });
  
  const totalValue = positionsWithCurrentPrice.reduce((acc, pos) => {
    const quantity = pos.quantity;
    // For short positions, value is what you owe. We calculate it as (entry_value - current_value) + entry_value
    // A simpler P/L based approach is better for total value.
    if (quantity > 0) { // Long
      return acc + quantity * pos.currentPrice;
    } else { // Short
      const costBasis = Math.abs(quantity) * pos.avgPrice;
      const pl = Math.abs(quantity) * pos.avgPrice - Math.abs(quantity) * pos.currentPrice;
      return acc + (costBasis + pl);
    }
  }, 0);

  const totalCost = positions.reduce((acc, pos) => acc + Math.abs(pos.quantity) * pos.avgPrice, 0);
  
  // Recalculate total P/L based on a clearer definition
  const totalPL = positionsWithCurrentPrice.reduce((acc, pos) => {
    const quantity = pos.quantity;
    const currentValue = Math.abs(quantity) * pos.currentPrice;
    const costBasis = Math.abs(quantity) * pos.avgPrice;
    const pl = (quantity > 0) ? (currentValue - costBasis) : (costBasis - currentValue);
    return acc + pl;
  }, 0);
  
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

  const handleExitPosition = (ticker: string, currentPrice: number) => {
    closePosition(ticker, currentPrice);
    toast({
        title: "Position Closed",
        description: `Your position in ${ticker} has been closed at market price.`,
    });
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
            <div>
                <p className="text-sm text-muted-foreground">Total P/L</p>
                <div className={cn('text-2xl font-bold', totalPL >= 0 ? 'text-[hsl(142,76%,42%)]' : 'text-[hsl(0,84%,60%)]')}>
                    {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={cn('text-sm font-medium', totalPL >= 0 ? 'text-[hsl(142,76%,42%)]' : 'text-[hsl(0,84%,60%)]')}>
                    ({totalPL >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%)
                </div>
            </div>
        </CardContent>
      </Card>
      
      {positionsWithCurrentPrice.length > 0 ? (
        <div className="space-y-3">
            {positionsWithCurrentPrice.map(pos => {
                const isShort = pos.quantity < 0;
                const quantity = Math.abs(pos.quantity);
                const currentValue = quantity * pos.currentPrice;
                const costBasis = quantity * pos.avgPrice;
                const pl = isShort ? costBasis - currentValue : currentValue - costBasis;
                const plPercent = costBasis > 0 ? (pl / costBasis) * 100 : 0;

                return (
                    <Card key={pos.cryptoTicker}>
                        <CardContent className="p-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <CryptoIcon ticker={pos.cryptoTicker} className="w-10 h-10"/>
                                    <div>
                                        <p className="font-bold text-base flex items-center gap-2">
                                            {pos.cryptoTicker}
                                            <span className={cn(
                                                "text-xs font-semibold px-2 py-0.5 rounded-full",
                                                isShort ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                                            )}>
                                                {isShort ? 'SHORT' : 'LONG'}
                                            </span>
                                        </p>
                                        <p className="text-sm text-muted-foreground font-mono">{quantity.toFixed(4)} @ ${pos.avgPrice.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono font-semibold">${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    <p className={cn('text-sm font-mono', pl >= 0 ? 'text-[hsl(142,76%,42%)]' : 'text-[hsl(0,84%,60%)]')}>
                                        {pl >= 0 ? '+' : ''}{plPercent.toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="text-sm">
                                    <span className="text-muted-foreground">P/L: </span>
                                    <span className={cn('font-medium', pl >= 0 ? 'text-[hsl(142,76%,42%)]' : 'text-[hsl(0,84%,60%)]')}>
                                        {pl >= 0 ? '+' : ''}${pl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">Exit</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will close your entire position in {pos.cryptoTicker} at the current market price. This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => handleExitPosition(pos.cryptoTicker, pos.currentPrice)}>
                                        Confirm Exit
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
      ) : (
        <Card className="mt-4">
            <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">You have no open positions.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
