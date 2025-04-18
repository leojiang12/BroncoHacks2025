import React, { createContext, useState, ReactNode } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  login:    (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout:   () => void;
  setToken: (token: string) => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  login:    async () => {},
  register: async () => {},
  logout:   () => {},
  setToken: () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  // Initialize token and set default header if present
  const [token, _setToken] = useState<string | null>(() => {
    const t = localStorage.getItem('token');
    if (t) {
      api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
    }
    return t;
  });
  const isAuthenticated = Boolean(token);

  // Wrap localStorage + state, and update default header immediately
  const setToken = (t: string) => {
    localStorage.setItem('token', t);
    _setToken(t);
    api.defaults.headers.common['Authorization'] = `Bearer ${t}`;
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post<{ token: string }>('/auth/login', { email, password });
    setToken(data.token);
    navigate('/dashboard', { replace: true });
  };

  const register = async (email: string, username: string, password: string) => {
    await api.post('/auth/register', { email, username, password });
    navigate('/login', { replace: true });
  };

  const logout = () => {
    localStorage.removeItem('token');
    _setToken(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ login, register, logout, setToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
