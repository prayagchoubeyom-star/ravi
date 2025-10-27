
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Order, Position } from '@/lib/data';
import { initialPositions, initialOrders, cryptos as initialCryptos } from '@/lib/data';

interface TradingContextType {
  orders: Order[];
  positions: Position[];
  watchlist: string[];
  balance: number;
  qrCodeUrl: string | null;
  addToWatchlist: (ticker: string) => void;
  removeFromWatchlist: (ticker: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'status' | 'date'>) => void;
  closePosition: (cryptoTicker: string, currentPrice: number) => void;
  addFunds: (amount: number, userId?: string) => void;
  withdrawFunds: (amount: number) => void;
  setQrCodeUrl: (url: string) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [balance, setBalance] = useState(50000);
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
        const savedWatchlist = localStorage.getItem('watchlist');
        return savedWatchlist ? JSON.parse(savedWatchlist) : initialCryptos.map(c => c.ticker);
    }
    return initialCryptos.map(c => c.ticker);
  });
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist]);

  const addFunds = (amount: number, userId?: string) => {
    // Admin editing a user's balance sets the balance directly.
    if (userId) {
        console.log(`Setting funds for user ${userId} to ${amount}`);
        setBalance(amount);
    } else { // User deposit adds to the balance.
        setBalance(prev => prev + amount);
    }
  }

  const withdrawFunds = (amount: number) => {
    setBalance(prev => prev - amount);
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
    const newOrder: Order = {
      ...orderData,
      id: (Math.random() * 1000000).toString(),
      status: 'Filled', // Simulate instant fill for prototype
      date: new Date().toISOString(),
    };
    
    setOrders(prev => [newOrder, ...prev]);

    // Update positions & balance
    const cost = newOrder.amount * newOrder.price;

    if (newOrder.type === 'Buy') {
        setBalance(prev => prev - cost);
        setPositions(prevPositions => {
            const existingPositionIndex = prevPositions.findIndex(p => p.cryptoTicker === newOrder.cryptoTicker);
            if (existingPositionIndex > -1) {
                // Update existing position
                const existingPosition = prevPositions[existingPositionIndex];
                const totalQuantity = existingPosition.quantity + newOrder.amount;
                const totalCost = (existingPosition.avgPrice * existingPosition.quantity) + cost;
                const newAvgPrice = totalCost / totalQuantity;

                const updatedPositions = [...prevPositions];
                updatedPositions[existingPositionIndex] = {
                    ...existingPosition,
                    quantity: totalQuantity,
                    avgPrice: newAvgPrice,
                };
                return updatedPositions;
            } else {
                // Add new position
                const newPosition: Position = {
                    cryptoTicker: newOrder.cryptoTicker,
                    quantity: newOrder.amount,
                    avgPrice: newOrder.price,
                };
                return [...prevPositions, newPosition];
            }
        });
    } else { // Sell order
        setBalance(prev => prev + cost);
        setPositions(prevPositions => {
            const existingPositionIndex = prevPositions.findIndex(p => p.cryptoTicker === newOrder.cryptoTicker);
            if (existingPositionIndex > -1) {
                const existingPosition = prevPositions[existingPositionIndex];
                const newQuantity = existingPosition.quantity - newOrder.amount;

                if (newQuantity <= 0.00001) { // Epsilon for float comparison
                    // Remove position if quantity is zero or negligible
                    return prevPositions.filter(p => p.cryptoTicker !== newOrder.cryptoTicker);
                } else {
                    const updatedPositions = [...prevPositions];
                    updatedPositions[existingPositionIndex] = {
                        ...existingPosition,
                        quantity: newQuantity,
                    };
                    return updatedPositions;
                }
            }
            return prevPositions; // Or handle short selling if desired
        });
    }
  };

  const closePosition = (cryptoTicker: string, currentPrice: number) => {
    const positionToClose = positions.find(p => p.cryptoTicker === cryptoTicker);
    if (!positionToClose) return;

    // Create a sell order at the current market price to log the transaction and update the balance
    addOrder({
        cryptoTicker: positionToClose.cryptoTicker,
        type: 'Sell',
        amount: positionToClose.quantity,
        price: currentPrice,
    });
  };


  return (
    <TradingContext.Provider value={{ orders, positions, watchlist, balance, qrCodeUrl, addToWatchlist, removeFromWatchlist, addOrder, closePosition, addFunds, withdrawFunds, setQrCodeUrl }}>
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
