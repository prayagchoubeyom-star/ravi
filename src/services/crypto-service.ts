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

const getApiUrl = () => {
  // If running on the server, use the absolute URL.
  // The 'NEXT_PUBLIC_VERCEL_URL' is an example env var, you might need to adjust it for your hosting.
  // For Firebase App Hosting, it might be a different variable or might not be needed if same-origin.
  if (typeof window === 'undefined') {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL || process.env.URL || 'http://localhost:9002';
    return `${baseUrl.startsWith('http') ? '' : 'https://'}${baseUrl}/api/crypto`;
  }
  // If on the client, a relative path is fine.
  return '/api/crypto';
}

export async function fetchAllCryptoData(): Promise<Crypto[]> {
    try {
        const response = await fetch(getApiUrl(), {
          // Revalidate data every 10 seconds
          next: { revalidate: 10 }
        });
        if (!response.ok) {
            console.error(`Failed to fetch from API route: ${response.statusText}`);
            return [];
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
