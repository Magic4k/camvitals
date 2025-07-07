"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  userEmail: string;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setUserEmail: (email: string) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = () => {
      try {
        // Check for CamVitals token first (new approach)
        const camvitalsToken = localStorage.getItem('camvitals_token');
        const camvitalsUser = localStorage.getItem('camvitals_user');
        
        if (camvitalsToken && camvitalsUser) {
          const parsedUser = JSON.parse(camvitalsUser);
          setToken(camvitalsToken);
          setUser(parsedUser);
          setUserEmail(parsedUser.email);
          console.log('Restored CamVitals session:', { 
            userId: parsedUser.id, 
            userName: parsedUser.name, 
            role: parsedUser.role 
          });
        } else {
          // Fallback to old token storage (for backward compatibility)
          const storedToken = localStorage.getItem('token');
          const storedUser = localStorage.getItem('user');
          const storedEmail = localStorage.getItem('userEmail');
          
          if (storedToken && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
            setUserEmail(parsedUser.email);
            console.log('Restored legacy session:', { 
              userId: parsedUser.id, 
              userName: parsedUser.name, 
              role: parsedUser.role 
            });
          } else if (storedEmail) {
            setUserEmail(storedEmail);
          }
        }
      } catch (error) {
        console.error('Error loading session:', error);
        // Clear corrupted data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('camvitals_token');
        localStorage.removeItem('camvitals_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  // Update localStorage when user data changes
  useEffect(() => {
    if (user && token) {
      // Store in both old and new format for compatibility
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', user.email);
      
      // Store in CamVitals format (primary)
      localStorage.setItem('camvitals_token', token);
      localStorage.setItem('camvitals_user', JSON.stringify(user));
      
      console.log('Updated stored session data:', {
        userId: user.id,
        userName: user.name,
        role: user.role,
        tokenStored: !!token
      });
    }
  }, [user, token]);

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      setUserEmail(newUser.email);
    }
  };

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('token', newToken);
      localStorage.setItem('camvitals_token', newToken);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('camvitals_token');
    }
  };

  const logout = () => {
    console.log('Logging out user...');
    setUser(null);
    setUserEmail("");
    setToken(null);
    
    // Clear all stored data (including chatbot-related storage)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('camvitals_token');
    localStorage.removeItem('camvitals_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    
    console.log('User logged out and all storage cleared');
  };

  const isAuthenticated = !!(user && token);

  return (
    <UserContext.Provider value={{ 
      user,
      userEmail, 
      token,
      isAuthenticated,
      isLoading,
      setUser: handleSetUser,
      setUserEmail, 
      setToken: handleSetToken,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 