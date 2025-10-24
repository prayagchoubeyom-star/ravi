export type Crypto = {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
};

// This is now just a static list of popular cryptos we are interested in.
// The live data will be fetched from the API.
export const cryptos: Crypto[] = [
  { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', price: 0, change24h: 0, volume24h: '0', marketCap: '0' },
  { id: 'ethereum', name: 'Ethereum', ticker: 'ETH', price: 0, change24h: 0, volume24h: '0', marketCap: '0' },
  { id: 'solana', name: 'Solana', ticker: 'SOL', price: 0, change24h: 0, volume24h: '0', marketCap: '0' },
  { id: 'cardano', name: 'Cardano', ticker: 'ADA', price: 0, change24h: 0, volume24h: '0', marketCap: '0' },
  { id: 'ripple', name: 'XRP', ticker: 'XRP', price: 0, change24h: 0, volume24h: '0', marketCap: '0' },
  { id: 'dogecoin', name: 'Dogecoin', ticker: 'DOGE', price: 0, change24h: 0, volume24h: '0', marketCap: '0' },
  { id: 'avalanche', name: 'Avalanche', ticker: 'AVAX', price: 0, change24h: 0, volume24h: '0', marketCap: '0' },
  { id: 'chainlink', name: 'Chainlink', ticker: 'LINK', price: 0, change24h: 0, volume24h: '0', marketCap: '0' },
  { id: 'polygon', name: 'Polygon', ticker: 'MATIC', price: 0, change24h: 0, volume24h: '0', marketCap: '0' },
  { id: 'litecoin', name: 'Litecoin', ticker: 'LTC', price: 0, change24h: 0, volume24h: '0', marketCap: '0' },
];

export const user = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
};

export const accountSummary = {
  totalBalance: 123456.78,
  dailyChange: 1234.56,
  dailyChangePercent: 1.01,
};

export type Position = {
  crypto: Pick<Crypto, 'id' | 'ticker' | 'name' | 'price'>;
  quantity: number;
  avgPrice: number;
};

export const positions: Position[] = [
  { crypto: { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', price: 0 }, quantity: 0.5, avgPrice: 65000 },
  { crypto: { id: 'ethereum', name: 'Ethereum', ticker: 'ETH', price: 0 }, quantity: 10, avgPrice: 3400 },
  { crypto: { id: 'solana', name: 'Solana', ticker: 'SOL', price: 0 }, quantity: 100, avgPrice: 120 },
];

export type Order = {
  id: string;
  crypto: Pick<Crypto, 'ticker'>;
  type: 'Buy' | 'Sell';
  status: 'Open' | 'Filled' | 'Cancelled';
  amount: number;
  price: number;
  date: string;
};

export const orders: Order[] = [
  { id: '1', crypto: { ticker: 'BTC' }, type: 'Buy', status: 'Filled', amount: 0.1, price: 67500, date: '2024-05-20T10:00:00Z' },
  { id: '2', crypto: { ticker: 'ETH' }, type: 'Sell', status: 'Filled', amount: 2, price: 3600, date: '2024-05-20T11:30:00Z' },
  { id: '3', crypto: { ticker: 'SOL' }, type: 'Buy', status: 'Open', amount: 50, price: 148, date: '2024-05-21T09:00:00Z' },
  { id: '4', crypto: { ticker: 'ADA' }, type: 'Buy', status: 'Cancelled', amount: 10000, price: 0.44, date: '2024-05-19T14:00:00Z' },
  { id: '5', crypto: { ticker: 'XRP' }, type: 'Sell', status: 'Open', amount: 5000, price: 0.55, date: '2024-05-21T10:15:00Z' },
];
