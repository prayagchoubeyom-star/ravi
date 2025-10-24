'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { CryptoIcon } from '@/components/crypto-icon';
import { cn } from '@/lib/utils';
import { useCryptoData } from '@/hooks/use-crypto-data';
import { Skeleton } from './ui/skeleton';

export function WatchlistView() {
  const { cryptos, loading } = useCryptoData();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const filteredCryptos = cryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crypto.ticker.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleRowClick = (ticker: string) => {
    router.push(`/trade/${ticker}`);
  }

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
            {loading && (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-10 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-4 w-12 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
            {!loading && filteredCryptos.map((crypto) => (
              <TableRow key={crypto.id} onClick={() => handleRowClick(crypto.ticker)} className="cursor-pointer hover:bg-muted/50">
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
