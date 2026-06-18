import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const API_URL = 'https://functions.poehali.dev/5f709de2-ccfd-4b79-9f7c-cb0a8c2e4f09';

interface User {
  user_id: number;
  email: string;
  token: string;
  free_requests_used: number;
  has_subscription: boolean;
  subscription_expires: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  updateUsage: (free_used: number, has_sub: boolean) => void;
  canSendRequest: () => boolean;
  requestsLeft: () => number;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('sonnik_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) { void e; }
    }
    setLoading(false);
  }, []);

  const saveUser = (u: User) => {
    setUser(u);
    localStorage.setItem('sonnik_user', JSON.stringify(u));
  };

  const login = async (email: string, password: string) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Ошибка входа' };
    saveUser(data);
    return {};
  };

  const register = async (email: string, password: string) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password }),
    });
    const data = await res.json();
    if (!res.ok) return { error: data.error || 'Ошибка регистрации' };
    saveUser(data);
    return {};
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sonnik_user');
  };

  const updateUsage = (free_used: number, has_sub: boolean) => {
    if (!user) return;
    const updated = { ...user, free_requests_used: free_used, has_subscription: has_sub };
    saveUser(updated);
  };

  const canSendRequest = () => {
    if (!user) return false;
    return user.has_subscription || user.free_requests_used < 3;
  };

  const requestsLeft = () => {
    if (!user) return 0;
    if (user.has_subscription) return 999;
    return Math.max(0, 3 - user.free_requests_used);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUsage, canSendRequest, requestsLeft }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}