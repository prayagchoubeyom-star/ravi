
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Order, Position } from '@/lib/data';
import { initialPositions, cryptos as initialCryptos } from '@/lib/data';
import { useAuth } from './auth-context';

const initialOrders: Order[] = [
  { id: '1', cryptoTicker: 'BTC', type: 'Buy', status: 'Filled', amount: 0.1, price: 67500, date: '2024-05-20T10:00:00Z' },
  { id: '2', cryptoTicker: 'ETH', type: 'Sell', status: 'Filled', amount: 2, price: 3600, date: '2024-05-20T11:30:00Z' },
  { id: '3', cryptoTicker: 'SOL', type: 'Buy', status: 'Open', amount: 50, price: 148, date: '2024-05-21T09:00:00Z' },
  { id: '4', cryptoTicker: 'ADA', type: 'Buy', status: 'Cancelled', amount: 10000, price: 0.44, date: '2024-05-19T14:00:00Z' },
  { id: '5', cryptoTicker: 'XRP', type: 'Sell', status: 'Open', amount: 5000, price: 0.55, date: '2024-05-21T10:15:00Z' },
];

interface TradingContextType {
  orders: Order[];
  positions: Position[];
  watchlist: string[];
  balance: number;
  addToWatchlist: (ticker: string) => void;
  removeFromWatchlist: (ticker: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'status' | 'date'>) => void;
  closePosition: (cryptoTicker: string, currentPrice: number) => void;
  addFunds: (amount: number) => void;
  withdrawFunds: (amount: number) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const { user, updateUserBalance } = useAuth();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [positions, setPositions] = useState<Position[]>(initialPositions);

  // Balance is now derived from the authenticated user
  const balance = user?.balance ?? 0;

  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
        const savedWatchlist = localStorage.getItem('watchlist');
        return savedWatchlist ? JSON.parse(savedWatchlist) : initialCryptos.map(c => c.ticker);
    }
    return initialCryptos.map(c => c.ticker);
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist]);

  const addFunds = (amount: number) => {
    if (user) {
      updateUserBalance(user.id, balance + amount);
    }
  }

  const withdrawFunds = (amount: number) => {
    if (user && balance >= amount) {
      updateUserBalance(user.id, balance - amount);
    }
  }

  const addToWatchlist = (ticker: string) => {
    setWatchlist(prev => {
        if (!prev.includes(ticker)) {
            return [...prev, ticker];
        }
        return prev;
    });
  }

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist(prev => prev.filter(t => t !== ticker));
  }

  const addOrder = (orderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    if (!user) return; // Should not happen if user is logged in

    const newOrder: Order = {
      ...orderData,
      id: (Math.random() * 1000000).toString(),
      status: 'Filled', // Simulate instant fill for prototype
      date: new Date().toISOString(),
    };
    
    setOrders(prev => [newOrder, ...prev]);

    const cost = newOrder.amount * newOrder.price;
    const isBuy = newOrder.type === 'Buy';

    if (isBuy) {
        updateUserBalance(user.id, prevBalance => prevBalance - cost);
    } else { // Sell
        updateUserBalance(user.id, prevBalance => prevBalance + cost);
    }

    setPositions(prevPositions => {
        const existingPositionIndex = prevPositions.findIndex(p => p.cryptoTicker === newOrder.cryptoTicker);
        
        if (existingPositionIndex > -1) {
            const existingPosition = prevPositions[existingPositionIndex];
            const newQuantity = isBuy ? existingPosition.quantity + newOrder.amount : existingPosition.quantity - newOrder.amount;
            
            if (Math.abs(newQuantity) < 0.000001) { // If position is closed
                return prevPositions.filter(p => p.cryptoTicker !== newOrder.cryptoTicker);
            }

            const totalCost = (existingPosition.avgPrice * existingPosition.quantity) + (isBuy ? cost : -cost);
            const newAvgPrice = (newQuantity > 0) ? Math.abs(totalCost / newQuantity) : 0;
            
            const updatedPositions = [...prevPositions];
            updatedPositions[existingPositionIndex] = { 
                ...existingPosition, 
                quantity: newQuantity, 
                avgPrice: newAvgPrice // avgPrice for shorts is more complex, but this is a simple approximation
            };
            return updatedPositions;
        } else { // No existing position
            const newPosition: Position = { 
                cryptoTicker: newOrder.cryptoTicker, 
                quantity: isBuy ? newOrder.amount : -newOrder.amount, 
                avgPrice: newOrder.price 
            };
            return [...prevPositions, newPosition];
        }
    });
  };

  const closePosition = (cryptoTicker: string, currentPrice: number) => {
    const positionToClose = positions.find(p => p.cryptoTicker === cryptoTicker);
    if (!positionToClose) return;

    // If long position, sell. If short position, buy.
    const orderType = positionToClose.quantity > 0 ? 'Sell' : 'Buy';
    const amountToClose = Math.abs(positionToClose.quantity);

    addOrder({
        cryptoTicker: positionToClose.cryptoTicker,
        type: orderType,
        amount: amountToClose,
        price: currentPrice,
    });
  };


  return (
    <TradingContext.Provider value={{ orders, positions, watchlist, balance, addToWatchlist, removeFromWatchlist, addOrder, closePosition, addFunds, withdrawFunds }}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTrading() {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
}
