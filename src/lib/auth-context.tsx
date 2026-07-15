'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { demoUsers } from '@/lib/demo-data';
import { dataStore } from '@/lib/data-store';
import type { User } from '@/lib/types';

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  loginAs: (userId: string) => void;
  logout: () => void;
  demoPersonas: typeof demoUsers;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const current = dataStore.getCurrentUser();
    setUser(current);
    setIsLoading(false);
  }, []);

  const loginAs = (userId: string) => {
    const u = dataStore.loginAs(userId);
    setUser(u);
  };

  const logout = () => {
    dataStore.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, loginAs, logout, demoPersonas: demoUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
