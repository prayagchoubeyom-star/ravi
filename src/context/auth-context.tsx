
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminUsers } from '@/lib/data'; // Import mock users

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'admin' | 'user' | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check for auth status in localStorage on initial load
    const authStatus = localStorage.getItem('isAuthenticated');
    const role = localStorage.getItem('userRole') as 'admin' | 'user' | null;
    if (authStatus === 'true' && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const login = (email: string, password: string) => {
    // Check for admin credentials
    if (email === 'wellfiree' && password === 'Arpit@54321') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'admin');
      setIsAuthenticated(true);
      setUserRole('admin');
      router.push('/admin');
      return true;
    }
    
    // Check for regular user credentials from mock data
    const user = adminUsers.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', 'user');
      setIsAuthenticated(true);
      setUserRole('user');
      router.push('/');
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
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
