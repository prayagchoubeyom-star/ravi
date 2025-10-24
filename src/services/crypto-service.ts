import type { BinanceTicker } from "@/lib/binance-types";
import { cryptos as initialCryptos, tickerToSymbol, type Crypto } from "@/lib/data";

function formatNumber(num: number) {
  if (num > 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num > 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num > 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
}

const getCryptoName = (ticker: string): string => {
    const known = initialCryptos.find(c => c.ticker === ticker);
    if (known) return known.name;
    return ticker;
}

export async function fetchAllCryptoData(): Promise<Crypto[]> {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        if (!response.ok) {
            throw new Error(`Failed to fetch from Binance API: ${response.statusText}`);
        }
        const data: BinanceTicker[] = await response.json();

        // We are only interested in USDT pairs
        const usdtPairs = data.filter(d => d.symbol.endsWith('USDT'));

        const allData = usdtPairs.map(liveTickerData => {
            const ticker = liveTickerData.symbol.replace('USDT', '');
            return {
                id: liveTickerData.symbol,
                ticker: ticker,
                name: getCryptoName(ticker),
                price: parseFloat(liveTickerData.lastPrice),
                change24h: parseFloat(liveTickerData.priceChangePercent),
                volume24h: formatNumber(parseFloat(liveTickerData.quoteVolume)),
                marketCap: formatNumber(parseFloat(liveTickerData.lastPrice) * 10000000) // Dummy marketcap
            };
        });

        return allData;

    } catch (error) {
        console.error("Error fetching all crypto data:", error);
        return [];
    }
}
