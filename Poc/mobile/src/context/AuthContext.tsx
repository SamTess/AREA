import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiGet } from '../services/api';

export type User = { id: number; username: string; email?: string | null } | null;

type AuthCtx = {
  user: User;
  loading: boolean;
  refresh: () => Promise<User>;
  setUser: (u: User) => void;
  logout: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    setLoading(true);
    try {
      const me = await apiGet<User>('/auth/me');
      setUser(me);
      return me;
    } catch (e) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const logout = useCallback(async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL || ''}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch {}
    setUser(null);
  }, []);

  return (
    <Ctx.Provider value={{ user, loading, refresh: fetchMe, setUser, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuthContext() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuthContext must be inside AuthProvider');
  return v;
}
