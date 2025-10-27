
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

// A mapping from the ticker in our app to the symbol on Binance
export const tickerToSymbol: Record<string, string> = {
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
  cryptoTicker: string;
  quantity: number;
  avgPrice: number;
};

export const initialPositions: Position[] = [
  { cryptoTicker: 'BTC', quantity: 0.5, avgPrice: 65000 },
  { cryptoTicker: 'ETH', quantity: 10, avgPrice: 3400 },
  { cryptoTicker: 'SOL', quantity: 100, avgPrice: 120 },
];

export type Order = {
  id: string;
  cryptoTicker: string;
  type: 'Buy' | 'Sell';
  status: 'Open' | 'Filled' | 'Cancelled';
  amount: number;
  price: number;
  date: string;
};

export const initialOrders: Order[] = [
  { id: '1', cryptoTicker: 'BTC', type: 'Buy', status: 'Filled', amount: 0.1, price: 67500, date: '2024-05-20T10:00:00Z' },
  { id: '2', cryptoTicker: 'ETH', type: 'Sell', status: 'Filled', amount: 2, price: 3600, date: '2024-05-20T11:30:00Z' },
  { id: '3', cryptoTicker: 'SOL', type: 'Buy', status: 'Open', amount: 50, price: 148, date: '2024-05-21T09:00:00Z' },
  { id: '4', cryptoTicker: 'ADA', type: 'Buy', status: 'Cancelled', amount: 10000, price: 0.44, date: '2024-05-19T14:00:00Z' },
  { id: '5', cryptoTicker: 'XRP', type: 'Sell', status: 'Open', amount: 5000, price: 0.55, date: '2024-05-21T10:15:00Z' },
];

// Mock data for Admin Panel
export const adminUsers = [
    { id: '1', name: 'Alex Doe', email: 'alex.doe@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: '3', name: 'John Johnson', email: 'john.johnson@example.com' },
];

export const adminDeposits = [
    { id: 'dep1', userId: '2', userName: 'Jane Smith', amount: 1000, status: 'Pending', date: '2024-05-22T10:00:00Z' },
    { id: 'dep2', userId: '1', userName: 'Alex Doe', amount: 500, status: 'Approved', date: '2024-05-21T15:30:00Z' },
    { id: 'dep3', userId: '3', userName: 'John Johnson', amount: 2500, status: 'Rejected', date: '2024-05-20T12:00:00Z' },
];

export const adminWithdrawals = [
    { id: 'wd1', userId: '1', userName: 'Alex Doe', amount: 200, status: 'Approved', bankName: 'Global Bank', accountNumber: '...1234', date: '2024-05-22T11:00:00Z' },
    { id: 'wd2', userId: '2', userName: 'Jane Smith', amount: 1500, status: 'Pending', bankName: 'National Bank', accountNumber: '...5678', date: '2024-05-23T09:45:00Z' },
];

