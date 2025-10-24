import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types';
import { authAPI } from './api-client';
import { AuthService } from '../services/AuthService';
import { USE_BACKEND } from './config';
import { toast } from 'sonner';

const authService = new AuthService();

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const token = localStorage.getItem('authToken');
    if (token) {
      // Try to get user data from /me endpoint
      authAPI.me()
        .then((userData) => {
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          });
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (USE_BACKEND) {
        const token = await authAPI.login(email, password);
        localStorage.setItem('authToken', token);

        // Get user data after successful login
        const userData = await authAPI.me();
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        });
      } else {
        // Use local AuthService for mock authentication
        const token = authService.login(email, password);
        localStorage.setItem('authToken', token);

        // Get user data from local service
        const userData = authService.getCurrentUser(email);
        if (userData) {
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
          });
        }
      }

      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Login failed');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const register = async (userData: any) => {
    try {
      if (USE_BACKEND) {
        await authAPI.register(userData);
      } else {
        // Use local AuthService for mock registration
        authService.register(userData);
      }
      toast.success('Registration successful');
    } catch (error) {
      toast.error('Registration failed');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      register,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
