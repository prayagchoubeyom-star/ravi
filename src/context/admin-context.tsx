
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useTrading } from './trading-context';
import { useAuth } from './auth-context';

interface AdminContextType {
  qrCodeUrl: string | null;
  setQrCodeUrl: (url: string) => void;
  addFunds: (amount: number, userId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { qrCodeUrl, setQrCodeUrl } = useTrading();
  const { updateUserBalance } = useAuth();

  const addFunds = (amount: number, userId: string) => {
    updateUserBalance(userId, amount);
  };

  return (
    <AdminContext.Provider value={{ qrCodeUrl, setQrCodeUrl, addFunds }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
