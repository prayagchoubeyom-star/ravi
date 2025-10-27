
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { useTransactions } from './transaction-context';

interface AdminContextType {
  upiId: string | null;
  setUpiId: (id: string) => void;
  addFunds: (amount: number, userId: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { upiId, setUpiId } = useTransactions();
  const { updateUserBalance } = useAuth();

  const addFunds = (amount: number, userId: string) => {
    updateUserBalance(userId, amount);
  };

  return (
    <AdminContext.Provider value={{ upiId, setUpiId, addFunds }}>
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
