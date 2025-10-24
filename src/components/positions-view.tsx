'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cryptos as initialCryptos, positions as initialPositions } from '@/lib/data';
import { cn } from '@/lib/utils';
import { CryptoIcon } from './crypto-icon';

export function PositionsView() {
  const [cryptos, setCryptos] = useState(initialCryptos);

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptos((prevCryptos) =>
        prevCryptos.map((crypto) => {
          const change = (Math.random() - 0.5) * (crypto.price * 0.01);
          return { ...crypto, price: Math.max(0, crypto.price + change) };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  
  const positionsWithCurrentPrice = initialPositions.map(pos => {
      const currentCryptoData = cryptos.find(c => c.id === pos.crypto.id);
      return {
          ...pos,
          currentPrice: currentCryptoData?.price || pos.crypto.price,
      };
  });
  
  const totalValue = positionsWithCurrentPrice.reduce((acc, pos) => acc + pos.quantity * pos.currentPrice, 0);
  const totalCost = positionsWithCurrentPrice.reduce((acc, pos) => acc + pos.quantity * pos.avgPrice, 0);
  const totalPL = totalValue - totalCost;
  const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

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
                <div className={cn('text-2xl font-bold', totalPL >= 0 ? 'text-green-500' : 'text-red-500')}>
                    {totalPL >= 0 ? '+' : ''}${totalPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={cn('text-sm font-medium', totalPL >= 0 ? 'text-green-500' : 'text-red-500')}>
                    ({totalPL >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%)
                </div>
            </div>
        </CardContent>
      </Card>
      
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">P/L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {positionsWithCurrentPrice.map(pos => {
                const currentValue = pos.quantity * pos.currentPrice;
                const costBasis = pos.quantity * pos.avgPrice;
                const pl = currentValue - costBasis;
                const plPercent = (pl / costBasis) * 100;

                return (
                    <TableRow key={pos.crypto.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <CryptoIcon ticker={pos.crypto.ticker} className="w-8 h-8"/>
                                <div>
                                    <p className="font-bold">{pos.crypto.ticker}</p>
                                    <p className="text-sm text-muted-foreground font-mono">{pos.quantity} @ ${pos.avgPrice.toLocaleString()}</p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                            <p>${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="text-sm text-muted-foreground">Qty: {pos.quantity}</p>
                        </TableCell>
                        <TableCell className={cn('text-right font-mono', pl >= 0 ? 'text-green-500' : 'text-red-500')}>
                            <p>{pl >= 0 ? '+' : ''}${pl.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            <p className="text-sm">{pl >= 0 ? '+' : ''}{plPercent.toFixed(2)}%</p>
                        </TableCell>
                    </TableRow>
                )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
