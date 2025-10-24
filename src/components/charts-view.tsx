'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
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
import { useCryptoData } from '@/hooks/use-crypto-data';
import type { Crypto } from '@/lib/data';
import { TradingViewWidget } from './tradingview-widget';
import { tickerToSymbol } from '@/lib/data';

export function ChartsView() {
  const { cryptos, loading } = useCryptoData();
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto | undefined>();

  useEffect(() => {
    if (cryptos.length > 0 && !selectedCrypto) {
      setSelectedCrypto(cryptos[0]);
    }
  }, [cryptos, selectedCrypto]);
  
  const tradingViewSymbol = selectedCrypto ? tickerToSymbol[selectedCrypto.ticker] || `${selectedCrypto.ticker}USDT` : 'BTCUSDT';


  if (loading && !selectedCrypto) {
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
          const crypto = cryptos.find((c) => c.id === value);
          if (crypto) setSelectedCrypto(crypto);
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a cryptocurrency" />
        </SelectTrigger>
        <SelectContent>
          {cryptos.map((crypto) => (
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
                <p className={`font-bold ${selectedCrypto.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>{selectedCrypto.change24h.toFixed(2)}%</p>
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
