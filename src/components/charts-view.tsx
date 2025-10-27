
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Crypto } from '@/lib/data';
import { TradingViewWidget } from './tradingview-widget';
import { tickerToSymbol } from '@/lib/data';
import { fetchAllCryptoData } from '@/services/crypto-service';

export function ChartsView({ initialData }: { initialData: Crypto[] }) {
  const [allCryptos, setAllCryptos] = useState<Crypto[]>(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | undefined>(initialData[0]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchAllCryptoData();
        setAllCryptos(data);
        // update selected crypto with fresh data
        setSelectedCrypto(prevSelected => {
          if (!prevSelected) return data.length > 0 ? data[0] : undefined;
          return data.find(c => c.id === prevSelected.id) || prevSelected;
        });
      } catch (error) {
        console.error("Failed to refresh crypto data", error);
      }
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (allCryptos.length > 0 && !selectedCrypto) {
      setSelectedCrypto(allCryptos[0]);
    }
  }, [allCryptos, selectedCrypto]);
  
  const tradingViewSymbol = selectedCrypto ? tickerToSymbol[selectedCrypto.ticker] || `${selectedCrypto.ticker}USDT` : 'BTCUSDT';


  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (!selectedCrypto) {
    return <div className="p-4">No data available</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <Select
        defaultValue={selectedCrypto.id}
        onValueChange={(value) => {
          const crypto = allCryptos.find((c) => c.id === value);
          if (crypto) setSelectedCrypto(crypto);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a cryptocurrency" />
        </SelectTrigger>
        <SelectContent>
          {allCryptos.map((crypto) => (
            <SelectItem key={crypto.id} value={crypto.id}>
              {crypto.name} ({crypto.ticker})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Card className="h-[400px] w-full">
        <CardContent className="p-0 h-full">
          <TradingViewWidget symbol={tradingViewSymbol} />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Market Stats</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
                <p className="text-muted-foreground">Market Cap</p>
                <p className="font-bold">{selectedCrypto.marketCap}</p>
            </div>
            <div>
                <p className="text-muted-foreground">24h Volume</p>
                <p className="font-bold">{selectedCrypto.volume24h}</p>
            </div>
            <div>
                <p className="text-muted-foreground">24h Change</p>
                <p className={`font-bold ${selectedCrypto.change24h >= 0 ? 'text-[hsl(142,76%,42%)]' : 'text-[hsl(0,84%,60%)]'}`}>{selectedCrypto.change24h.toFixed(2)}%</p>
            </div>
            <div>
                <p className="text-muted-foreground">Current Price</p>
                <p className="font-bold">${selectedCrypto.price.toLocaleString()}</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
