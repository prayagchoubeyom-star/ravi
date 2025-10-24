'use client';

import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cryptos, chartData, type Crypto } from '@/lib/data';

const chartConfig = {
  price: {
    label: 'Price',
    color: 'hsl(var(--primary))',
  },
};

export function ChartsView() {
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto>(cryptos[0]);

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

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedCrypto.name} ({selectedCrypto.ticker})
          </CardTitle>
          <CardDescription>
            Last 30 days price movement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 w-full">
            <AreaChart
              data={chartData}
              margin={{ left: -20, right: 10, top: 10, bottom: 0 }}
            >
              <defs>
                  <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(-2)} />
              <YAxis
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="price"
                type="natural"
                fill="url(#fillPrice)"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
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
