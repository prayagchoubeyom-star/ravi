'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Order, Position } from '@/lib/data';
import { initialPositions, initialOrders, cryptos as initialCryptos } from '@/lib/data';

interface TradingContextType {
  orders: Order[];
  positions: Position[];
  watchlist: string[];
  addToWatchlist: (ticker: string) => void;
  removeFromWatchlist: (ticker: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'status' | 'date'>) => void;
  closePosition: (cryptoTicker: string) => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [positions, setPositions] = useState<Position[]>(initialPositions);
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

    // Update positions if it's a "Buy" order for now
    if (newOrder.type === 'Buy' && newOrder.status === 'Filled') {
        setPositions(prevPositions => {
            const existingPositionIndex = prevPositions.findIndex(p => p.cryptoTicker === newOrder.cryptoTicker);
            if (existingPositionIndex > -1) {
                // Update existing position
                const existingPosition = prevPositions[existingPositionIndex];
                const totalQuantity = existingPosition.quantity + newOrder.amount;
                const totalCost = (existingPosition.avgPrice * existingPosition.quantity) + (newOrder.price * newOrder.amount);
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
    }
  };

  const closePosition = (cryptoTicker: string) => {
    const positionToClose = positions.find(p => p.cryptoTicker === cryptoTicker);
    if (!positionToClose) return;

    // Create a sell order to log the transaction
     const sellOrder: Order = {
      id: (Math.random() * 1000000).toString(),
      cryptoTicker: positionToClose.cryptoTicker,
      type: 'Sell',
      status: 'Filled',
      amount: positionToClose.quantity,
      price: 0, // In a real app, this would be the current market price
      date: new Date().toISOString(),
    };
    setOrders(prev => [sellOrder, ...prev]);

    // Remove position from state
    setPositions(prev => prev.filter(p => p.cryptoTicker !== cryptoTicker));
  };


  return (
    <TradingContext.Provider value={{ orders, positions, watchlist, addToWatchlist, removeFromWatchlist, addOrder, closePosition }}>
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
