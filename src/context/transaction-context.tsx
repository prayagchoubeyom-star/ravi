
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './auth-context';
import { adminDeposits, adminWithdrawals } from '@/lib/data';

type TransactionStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Deposit {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: TransactionStatus;
  date: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: TransactionStatus;
  upiId: string;
  date: string;
}

interface TransactionContextType {
  deposits: Deposit[];
  withdrawals: Withdrawal[];
  upiId: string | null;
  setUpiId: (url: string) => void;
  addDeposit: (depositData: Omit<Deposit, 'id' | 'status' | 'date'>) => void;
  addWithdrawal: (withdrawalData: Omit<Withdrawal, 'id' | 'status' | 'date'>) => void;
  updateDepositStatus: (depositId: string, status: TransactionStatus) => void;
  updateWithdrawalStatus: (withdrawalId: string, status: TransactionStatus) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const { updateUserBalance } = useAuth();

  const [deposits, setDeposits] = useState<Deposit[]>(() => {
     if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('deposits');
      return stored ? JSON.parse(stored) : adminDeposits;
    }
    return adminDeposits;
  });

  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('withdrawals');
      return stored ? JSON.parse(stored) : adminWithdrawals;
    }
    return adminWithdrawals;
  });

  const [upiId, setUpiId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('upiId');
    }
    return null;
  });

  useEffect(() => {
    localStorage.setItem('deposits', JSON.stringify(deposits));
  }, [deposits]);

  useEffect(() => {
    localStorage.setItem('withdrawals', JSON.stringify(withdrawals));
  }, [withdrawals]);

  useEffect(() => {
    if (upiId) {
      localStorage.setItem('upiId', upiId);
    } else {
      localStorage.removeItem('upiId');
    }
  }, [upiId]);

  const addDeposit = (depositData: Omit<Deposit, 'id' | 'status' | 'date'>) => {
    const newDeposit: Deposit = {
      ...depositData,
      id: `dep-${Date.now()}`,
      status: 'Pending',
      date: new Date().toISOString(),
    };
    setDeposits(prev => [newDeposit, ...prev]);
  };

  const addWithdrawal = (withdrawalData: Omit<Withdrawal, 'id' | 'status' | 'date'>) => {
    const newWithdrawal: Withdrawal = {
      ...withdrawalData,
      id: `wd-${Date.now()}`,
      status: 'Pending',
      date: new Date().toISOString(),
    };
    setWithdrawals(prev => [newWithdrawal, ...prev]);
  };

  const updateDepositStatus = (depositId: string, status: TransactionStatus) => {
    let depositToUpdate: Deposit | undefined;

    setDeposits(prev =>
      prev.map(d => {
        if (d.id === depositId && d.status === 'Pending') {
          depositToUpdate = { ...d, status };
          return depositToUpdate;
        }
        return d;
      })
    );
    
    if (depositToUpdate && status === 'Approved') {
        const { userId, amount } = depositToUpdate;
        updateUserBalance(userId, prevBalance => prevBalance + amount);
    }
  };

  const updateWithdrawalStatus = (withdrawalId: string, status: TransactionStatus) => {
    let withdrawalToUpdate: Withdrawal | undefined;
    
    setWithdrawals(prev =>
      prev.map(w => {
        if (w.id === withdrawalId && w.status === 'Pending') {
          withdrawalToUpdate = { ...w, status };
          return withdrawalToUpdate;
        }
        return w;
      })
    );

    if (withdrawalToUpdate && status === 'Approved') {
        const { userId, amount } = withdrawalToUpdate;
        updateUserBalance(userId, prevBalance => prevBalance - amount);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        deposits,
        withdrawals,
        upiId,
        setUpiId,
        addDeposit,
        addWithdrawal,
        updateDepositStatus,
        updateWithdrawalStatus,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}
