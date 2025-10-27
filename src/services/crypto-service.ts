
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
    // For unknown tickers, just return the ticker itself.
    // The API might return more symbols than we have in our static list.
    return ticker;
}

export async function fetchAllCryptoData(): Promise<Crypto[]> {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
            // Revalidate data every 10 seconds for static generation, but client-side will fetch more often.
            next: { revalidate: 10 }
        });

        if (!response.ok) {
            console.error(`Failed to fetch from Binance API: ${response.statusText}`);
            return [];
        }
        
        const data: BinanceTicker[] = await response.json();

        // We are only interested in USDT pairs that we have defined in our app
        const relevantSymbols = new Set(Object.values(tickerToSymbol));
        const usdtPairs = data.filter(d => relevantSymbols.has(d.symbol));

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
