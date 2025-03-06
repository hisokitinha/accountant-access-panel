
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'accountant' | 'client';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: 'accountant' | 'client') => Promise<void>;
  addClient: (email: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'accountant',
  },
  {
    id: '2',
    email: 'client@example.com',
    name: 'Client User',
    role: 'client',
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for saved session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      // Save to localStorage for persistence
      localStorage.setItem('user', JSON.stringify(foundUser));
      setUser(foundUser);
      toast.success('Login successful');
    } catch (error) {
      toast.error('Login failed: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.info('Logged out successfully');
  };

  const signup = async (email: string, password: string, name: string, role: 'accountant' | 'client') => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('User already exists with this email');
      }

      const newUser: User = {
        id: (mockUsers.length + 1).toString(),
        email,
        name,
        role,
      };

      // In a real app, we would make an API call here
      mockUsers.push(newUser);
      
      // Auto login the new user
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success('Account created successfully');
    } catch (error) {
      toast.error('Signup failed: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (email: string, name: string) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if client already exists
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Client already exists with this email');
      }

      const newClient: User = {
        id: (mockUsers.length + 1).toString(),
        email,
        name,
        role: 'client',
      };

      // In a real app, we would make an API call here
      mockUsers.push(newClient);
      
      toast.success('Client added successfully');
      return;
    } catch (error) {
      toast.error('Failed to add client: ' + (error as Error).message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, addClient }}>
      {children}
    </AuthContext.Provider>
  );
};
