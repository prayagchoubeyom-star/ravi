
import { NextResponse } from 'next/server';
import type { BinanceTicker } from "@/lib/binance-types";
import { cryptos as initialCryptos, tickerToSymbol, type Crypto } from "@/lib/data";

// Helper function to format large numbers into a more readable format (e.g., 1.2B, 500M, 25K)
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

// Helper function to get the full name of a crypto from its ticker
const getCryptoName = (ticker: string): string => {
    const known = initialCryptos.find(c => c.ticker === ticker);
    return known ? known.name : ticker;
}

// This function handles GET requests to /api/crypto
export async function GET() {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
      cache: 'no-store' // This is the crucial change to prevent caching on Vercel
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Binance API: ${response.statusText}`);
    }
    
    const data: BinanceTicker[] = await response.json();

    // We are only interested in USDT pairs that we have defined in our app
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

    return NextResponse.json(allData);

  } catch (error)
{
    console.error("Error in /api/crypto route:", error);
    // In case of an error, return an empty array with a 500 status code
    return NextResponse.json({ message: (error as Error).message || 'Internal Server Error' }, { status: 500 });
  }
}

// This tells Next.js to treat this route as dynamic, ensuring it's not cached incorrectly.
export const dynamic = 'force-dynamic';

