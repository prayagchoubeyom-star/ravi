
'use client';

import { useState } from 'react';
import Link from 'next/link';
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
import { Button } from './ui/button';
import { useTrading } from '@/context/trading-context';
import { PlusCircle, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import type { Crypto } from '@/lib/data';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Sheet, SheetContent, SheetDescription, SheetTitle } from './ui/sheet';
import { TradeView } from './trade-view';
import { useAuth } from '@/context/auth-context';

export function WatchlistView() {
  const { allCryptos, loading } = useCryptoData();
  const { watchlist, addToWatchlist, removeFromWatchlist } = useTrading();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | null>(null);
  const { user } = useAuth();
  
  const watchlistCryptos = allCryptos.filter(c => watchlist.includes(c.ticker));

  const searchResults = searchTerm 
    ? allCryptos.filter(
        (crypto) =>
          (crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.ticker.toLowerCase().includes(searchTerm.toLowerCase())) &&
          !watchlist.includes(crypto.ticker)
      ).slice(0, 20) // Limit search results
    : [];
  
  const handleRowClick = (crypto: Crypto) => {
    setSelectedCrypto(crypto);
  }

  const renderCryptoRow = (crypto: Crypto, isWatchlist: boolean) => (
    <TableRow 
      key={crypto.id} 
      onClick={() => isWatchlist && handleRowClick(crypto)} 
      className={cn(isWatchlist && "cursor-pointer hover:bg-muted/50")}
    >
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
          crypto.change24h >= 0 ? 'text-[hsl(142,76%,42%)]' : 'text-[hsl(0,84%,60%)]'
        )}
      >
        {crypto.change24h >= 0 ? '+' : ''}
        {crypto.change24h.toFixed(2)}%
      </TableCell>
      <TableCell className="text-right">
        {isWatchlist ? (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); removeFromWatchlist(crypto.ticker); }}>-</Button>
        ) : (
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); addToWatchlist(crypto.ticker); }}>
                <PlusCircle className="h-4 w-4" />
            </Button>
        )}
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <div className="p-4 space-y-4">
        <div className="space-y-2">
            <h2 className="text-2xl font-bold">Welcome, {user?.name.split(' ')[0]}!</h2>
            <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline">
                    <Link href="/deposit">
                        <ArrowDownToLine className="w-4 h-4 mr-2"/>
                        Deposit
                    </Link>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/withdraw">
                        <ArrowUpFromLine className="w-4 h-4 mr-2"/>
                        Withdraw
                    </Link>
                </Button>
            </div>
        </div>

        <Input
          placeholder="Search to add coins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-card"
        />
        
        {searchTerm && (
          <Card>
              <CardContent className="p-0">
                  <Table>
                      <TableHeader>
                          <TableRow>
                              <TableHead>Asset</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">24h</TableHead>
                              <TableHead className="text-right">Add</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {loading && searchTerm && <TableRow><TableCell colSpan={4} className="text-center">Searching...</TableCell></TableRow>}
                          {!loading && searchResults.map(crypto => renderCryptoRow(crypto, false))}
                          {!loading && searchResults.length === 0 && searchTerm && (
                              <TableRow><TableCell colSpan={4} className="text-center">No results found.</TableCell></TableRow>
                          )}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
        )}

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">24h</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && watchlistCryptos.length === 0 && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}>
                          <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              )}
              {!loading && watchlistCryptos.length > 0 && watchlistCryptos.map(crypto => renderCryptoRow(crypto, true))}
              {!loading && watchlistCryptos.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center h-24">Your watchlist is empty. Search above to add coins.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Sheet open={!!selectedCrypto} onOpenChange={(open) => !open && setSelectedCrypto(null)}>
        <SheetContent side="bottom" className="h-[90%] flex flex-col p-0">
          <SheetTitle className="sr-only">Trade</SheetTitle>
          <SheetDescription className="sr-only">Place a buy or sell order for the selected cryptocurrency.</SheetDescription>
          {selectedCrypto && <TradeView crypto={selectedCrypto} onClose={() => setSelectedCrypto(null)} />}
        </SheetContent>
      </Sheet>
    </>
  );
}
