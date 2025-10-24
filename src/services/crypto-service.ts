import type { BinanceTicker } from "@/lib/binance-types";
import { cryptos, type Crypto } from "@/lib/data";

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

// A mapping from the ticker in our app to the symbol on Binance
const tickerToSymbol: Record<string, string> = {
    BTC: 'BTCUSDT',
    ETH: 'ETHUSDT',
    SOL: 'SOLUSDT',
    ADA: 'ADAUSDT',
    XRP: 'XRPUSDT',
    DOGE: 'DOGEUSDT',
    AVAX: 'AVAXUSDT',
    LINK: 'LINKUSDT',
    MATIC: 'MATICUSDT',
    LTC: 'LTCUSDT',
};

const symbolToTicker: Record<string, string> = Object.fromEntries(
    Object.entries(tickerToSymbol).map(([key, value]) => [value, key])
);

export async function fetchCryptoData(): Promise<Crypto[]> {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    if (!response.ok) {
      throw new Error(`Failed to fetch from Binance API: ${response.statusText}`);
    }
    const data: BinanceTicker[] = await response.json();
    
    const interestedSymbols = Object.values(tickerToSymbol);
    
    const liveData = data.filter(ticker => interestedSymbols.includes(ticker.symbol));

    const mergedData = cryptos.map(staticCrypto => {
        const symbol = tickerToSymbol[staticCrypto.ticker];
        const liveTickerData = liveData.find(d => d.symbol === symbol);

        if (liveTickerData) {
            return {
                ...staticCrypto,
                price: parseFloat(liveTickerData.lastPrice),
                change24h: parseFloat(liveTickerData.priceChangePercent),
                volume24h: formatNumber(parseFloat(liveTickerData.quoteVolume)),
                marketCap: formatNumber(parseFloat(liveTickerData.lastPrice) * 10000000) // Dummy marketcap
            };
        }
        return staticCrypto; // Fallback to static data if API fails for a specific crypto
    });

    return mergedData;
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    // In case of an API error, return the static data so the app doesn't crash.
    return cryptos;
  }
}
