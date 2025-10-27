
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminUsers as initialAdminUsers } from '@/lib/data'; // Import mock users

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: 'admin' | 'user' | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addUser: (user: User) => void;
  deleteUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [users, setUsers] = useState<User[]>(initialAdminUsers);
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
    
    // Check for regular user credentials from the managed user list
    const user = users.find(u => u.email === email && u.password === password);
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

  const addUser = (user: User) => {
    setUsers(prevUsers => [user, ...prevUsers]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
  };


  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, users, login, logout, addUser, deleteUser }}>
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
