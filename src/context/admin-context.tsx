
'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useTrading } from './trading-context';

interface AdminContextType {
  qrCodeUrl: string | null;
  setQrCodeUrl: (url: string) => void;
  addFunds: (amount: number) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const { qrCodeUrl, setQrCodeUrl, addFunds } = useTrading();

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
