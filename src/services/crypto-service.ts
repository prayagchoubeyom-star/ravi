
import type { BinanceTicker } from "@/lib/binance-types";
import { cryptos as initialCryptos, tickerToSymbol, type Crypto } from "@/lib/data";

// Helper function to format large numbers
function formatNumber(num: number) {
  if (num > 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num > 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num > 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

const getCryptoName = (ticker: string): string => {
    const known = initialCryptos.find(c => c.ticker === ticker);
    return known ? known.name : ticker;
}

// This is the core logic that can be shared between the API route and server components.
export async function getLiveCryptoData(): Promise<Crypto[]> {
    try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch from Binance API: ${response.statusText}`);
        }
        
        const data: BinanceTicker[] = await response.json();

        const relevantSymbols = new Set(Object.values(tickerToSymbol));
        const usdtPairs = data.filter(d => relevantSymbols.has(d.symbol));

        const allData: Crypto[] = usdtPairs.map(liveTickerData => {
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
        console.error("Error in getLiveCryptoData:", error);
        // In case of an error, return an empty array to prevent crashes
        return [];
    }
}


// This function is for CLIENT-SIDE components to call the internal API route.
export async function fetchAllCryptoData(): Promise<Crypto[]> {
    try {
        // Fetch data from our own API route
        const response = await fetch('/api/crypto');

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            console.error(`Failed to fetch from internal API: ${errorData.message}`);
            return [];
        }
        
        const data: Crypto[] = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching all crypto data:", error);
        return [];
    }
}
