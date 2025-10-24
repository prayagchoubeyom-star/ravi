'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { cryptos as initialCryptos, type Crypto } from '@/lib/data';
import { CryptoIcon } from '@/components/crypto-icon';
import { cn } from '@/lib/utils';

export function WatchlistView() {
  const [cryptos, setCryptos] = useState<Crypto[]>(initialCryptos);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setCryptos((prevCryptos) =>
        prevCryptos.map((crypto) => {
          const change = (Math.random() - 0.5) * (crypto.price * 0.01);
          const newPrice = Math.max(0, crypto.price + change);
          const newChange24h = crypto.change24h + (Math.random() - 0.5) * 0.5;
          return {
            ...crypto,
            price: newPrice,
            change24h: newChange24h,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4">
      <Input
        placeholder="Search up to 100 coins..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="bg-card"
      />
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCryptos.map((crypto) => (
              <TableRow key={crypto.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CryptoIcon ticker={crypto.ticker} className="h-8 w-8" />
                    <div>
                      <div className="font-bold">{crypto.ticker}</div>
                      <div className="text-sm text-muted-foreground">{crypto.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-medium',
                    crypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {crypto.change24h >= 0 ? '+' : ''}
                  {crypto.change24h.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
