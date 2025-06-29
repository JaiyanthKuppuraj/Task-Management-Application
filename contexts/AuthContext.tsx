import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  login: () => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo purposes
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@example.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    try {
      // Simulate checking for existing session
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user was previously logged in (in a real app, this would check secure storage)
      const storedUserId = null; // In real app: await SecureStore.getItemAsync('userId');
      
      if (storedUserId) {
        const storedUser = mockUsers.find(u => u.id === storedUserId);
        if (storedUser) {
          setUser(storedUser);
        }
      }
    } catch (err) {
      console.log('No existing session found');
    } finally {
      setIsInitialized(true);
    }
  };

  const login = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate authentication process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, randomly select a user
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      
      // In a real app, you would:
      // 1. Open OAuth flow with proper Google OAuth URLs
      // 2. Handle the callback with authorization code
      // 3. Exchange code for tokens
      // 4. Get user info from Google API
      // 5. Store tokens securely
      
      setUser(randomUser);
      
      // In real app: await SecureStore.setItemAsync('userId', randomUser.id);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // In real app: await SecureStore.deleteItemAsync('userId');
      setUser(null);
      setError(null);
    } catch (err) {
      console.log('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isInitialized, 
      login, 
      logout, 
      error 
    }}>
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