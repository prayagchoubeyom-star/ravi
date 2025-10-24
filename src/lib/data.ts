export type Crypto = {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change24h: number;
  volume24h: string;
  marketCap: string;
};

export const cryptos: Crypto[] = [
  { id: 'bitcoin', name: 'Bitcoin', ticker: 'BTC', price: 67890.12, change24h: 2.5, volume24h: '35.4B', marketCap: '1.3T' },
  { id: 'ethereum', name: 'Ethereum', ticker: 'ETH', price: 3567.89, change24h: -1.2, volume24h: '22.1B', marketCap: '428.5B' },
  { id: 'solana', name: 'Solana', ticker: 'SOL', price: 150.45, change24h: 5.8, volume24h: '4.2B', marketCap: '69.1B' },
  { id: 'cardano', name: 'Cardano', ticker: 'ADA', price: 0.45, change24h: 0.5, volume24h: '500M', marketCap: '16.2B' },
  { id: 'ripple', name: 'XRP', ticker: 'XRP', price: 0.52, change24h: -2.1, volume24h: '1.8B', marketCap: '28.9B' },
  { id: 'dogecoin', name: 'Dogecoin', ticker: 'DOGE', price: 0.16, change24h: 10.3, volume24h: '2.5B', marketCap: '23.0B' },
  { id: 'avalanche', name: 'Avalanche', ticker: 'AVAX', price: 35.80, change24h: 3.1, volume24h: '900M', marketCap: '14.1B' },
  { id: 'chainlink', name: 'Chainlink', ticker: 'LINK', price: 18.20, change24h: 1.9, volume24h: '750M', marketCap: '10.7B' },
  { id: 'polygon', name: 'Polygon', ticker: 'MATIC', price: 0.72, change24h: -0.8, volume24h: '600M', marketCap: '7.1B' },
  { id: 'litecoin', name: 'Litecoin', ticker: 'LTC', price: 85.50, change24h: 0.2, volume24h: '800M', marketCap: '6.4B' },
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

export const chartData = Array.from({ length: 30 }, (_, i) => ({
  date: `2023-01-${i + 1}`,
  price: 67000 + (Math.random() - 0.5) * 2000 + i * 50,
}));

export type Position = {
  crypto: Crypto;
  quantity: number;
  avgPrice: number;
};

export const positions: Position[] = [
  { crypto: cryptos[0], quantity: 0.5, avgPrice: 65000 },
  { crypto: cryptos[1], quantity: 10, avgPrice: 3400 },
  { crypto: cryptos[2], quantity: 100, avgPrice: 120 },
];

export type Order = {
  id: string;
  crypto: Crypto;
  type: 'Buy' | 'Sell';
  status: 'Open' | 'Filled' | 'Cancelled';
  amount: number;
  price: number;
  date: string;
};

export const orders: Order[] = [
  { id: '1', crypto: cryptos[0], type: 'Buy', status: 'Filled', amount: 0.1, price: 67500, date: '2024-05-20T10:00:00Z' },
  { id: '2', crypto: cryptos[1], type: 'Sell', status: 'Filled', amount: 2, price: 3600, date: '2024-05-20T11:30:00Z' },
  { id: '3', crypto: cryptos[2], type: 'Buy', status: 'Open', amount: 50, price: 148, date: '2024-05-21T09:00:00Z' },
  { id: '4', crypto: cryptos[3], type: 'Buy', status: 'Cancelled', amount: 10000, price: 0.44, date: '2024-05-19T14:00:00Z' },
  { id: '5', crypto: cryptos[4], type: 'Sell', status: 'Open', amount: 5000, price: 0.55, date: '2024-05-21T10:15:00Z' },
];
