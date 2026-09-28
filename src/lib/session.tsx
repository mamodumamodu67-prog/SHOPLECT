'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '@/lib/api';
import type { User } from '@/lib/types';

type Ctx = { user: User | null; loading: boolean; refresh: () => Promise<void>; signOut: () => Promise<void> };
const SessionCtx = createContext<Ctx>({ user: null, loading: true, refresh: async () => {}, signOut: async () => {} });
export const useSession = () => useContext(SessionCtx);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { setUser(await authApi.me()); setLoading(false); }, []);
  const signOut = useCallback(async () => { await authApi.logout(); setUser(null); }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return <SessionCtx.Provider value={{ user, loading, refresh, signOut }}>{children}</SessionCtx.Provider>;
}
