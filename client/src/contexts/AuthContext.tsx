import React, {
    createContext,
    useState,
    useEffect,
    ReactNode
  } from 'react';
  import api, { setToken } from '../services/api';
  import { useNavigate } from 'react-router-dom';
  
  interface AuthContextType {
    login: (u: string, p: string) => Promise<void>;
    register: (u: string, p: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
  }
  
  export const AuthContext = createContext<AuthContextType>({
    login: async () => {},
    register: async () => {},
    logout: () => {},
    isAuthenticated: false,
  });
  
  export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setTokenState] = useState<string>(
      () => localStorage.getItem('token') || ''
    );
    const nav = useNavigate();
  
    useEffect(() => {
      if (token) {
        localStorage.setItem('token', token);
        setToken(token);
      } else {
        localStorage.removeItem('token');
      }
    }, [token]);
  
    const login = async (username: string, password: string) => {
      const { data } = await api.post<{ token: string }>('/auth/login', {
        username,
        password
      });
      setTokenState(data.token);
      nav('/dashboard');
    };
  
    const register = async (username: string, password: string) => {
      await api.post('/auth/register', { username, password });
      nav('/login');
    };
  
    const logout = () => {
      setTokenState('');
      nav('/login');
    };
  
    return (
      <AuthContext.Provider
        value={{
          login,
          register,
          logout,
          isAuthenticated: !!token
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  