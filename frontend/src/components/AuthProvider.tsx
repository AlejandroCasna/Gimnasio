'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';

interface User { id: number; email: string; plan: string | null; }

export const AuthCtx = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}>({ user: null, login: async () => {}, logout: () => {} });

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  async function login(email: string, password: string) {
    const { data } = await api.post('/api/token/', { email, password });
    // guarda tokens en localStorage o cookies, luego:
    const me = await api.get('/api/me/');
    setUser(me.data);
  }

  function logout() { setUser(null); /* limpiar tokens */ }

  // TODO: auto‑refrescar tokens

  return <AuthCtx.Provider value={{ user, login, logout }}>{children}</AuthCtx.Provider>;
}