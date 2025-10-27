
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminUsers as initialAdminUsers } from '@/lib/data';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  balance: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: 'admin' | 'user' | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: Omit<User, 'balance' | 'id'>) => void;
  deleteUser: (userId: string) => void;
  updateUserBalance: (userId: string, newBalance: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [users, setUsers] = useState<User[]>(initialAdminUsers);
  const router = useRouter();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole') as 'admin' | 'user' | null;
    const storedUser = localStorage.getItem('user');

    if (authStatus === 'true' && role && storedUser) {
      setIsAuthenticated(true);
      setUserRole(role);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const role = foundUser.email === 'wellfiree' ? 'admin' : 'user';
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', role);
      localStorage.setItem('user', JSON.stringify(foundUser));
      setIsAuthenticated(true);
      setUserRole(role);
      setUser(foundUser);
      router.push(role === 'admin' ? '/admin' : '/');
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
    router.push('/login');
  };

  const addUser = (userData: Omit<User, 'balance' | 'id'>) => {
    const newUser: User = {
      ...userData,
      id: (Math.random() * 1000000).toString(),
      balance: 0,
    };
    setUsers(prevUsers => [newUser, ...prevUsers]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };
  
  const updateUserBalance = (userId: string, newBalance: number) => {
    setUsers(prevUsers =>
      prevUsers.map(u => (u.id === userId ? { ...u, balance: newBalance } : u))
    );
    // If the updated user is the currently logged-in user, update their state too
    if (user && user.id === userId) {
        const updatedUser = {...user, balance: newBalance};
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, user, userRole, users, login, logout, addUser, deleteUser, updateUserBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
