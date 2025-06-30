import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/authService';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  handleGoogleCallback: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  canEditCanvas: (canvasId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    validateAuth();
  }, []);

  const validateAuth = async () => {
    try {
      const validatedUser = await authService.validateToken();
      setUser(validatedUser);
    } catch (error) {
      console.error('Auth validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    // This triggers the OAuth flow
    await authService.loginWithGoogle();
  };

  const handleGoogleCallback = async (token: string) => {
    try {
      const user = await authService.handleGoogleCallback(token);
      setUser(user);
      // Redirect to canvas or dashboard
      window.location.href = '/canvas';
    } catch (error) {
      console.error('Google authentication failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    // Redirect to home/login page
    window.location.href = '/';
  };

  // Simplified permission check for open source
  const canEditCanvas = (canvasId?: string): boolean => {
    // All authenticated users can edit in open source version
    return !!user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        loginWithGoogle,
        handleGoogleCallback,
        logout,
        canEditCanvas,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Wrap AuthProvider with GoogleOAuthProvider
export const AuthProviderWithGoogle: React.FC<{ 
  children: React.ReactNode;
  clientId: string;
}> = ({ children, clientId }) => {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>{children}</AuthProvider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Alternative: Client-side only Auth Context (no backend required)
export const LocalAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage on init
    const savedUser = localStorage.getItem('floranodus_local_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleGoogleLogin = (googleUser: any) => {
    const user: User = {
      id: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      picture: googleUser.picture
    };
    
    setUser(user);
    localStorage.setItem('floranodus_local_user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('floranodus_local_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading: false,
        loginWithGoogle: async () => {
          // This would be handled by the Google Login button
          console.log('Use Google Login button component');
        },
        handleGoogleCallback: async (token: string) => {
          // For local auth, this would be called directly from Google button
          console.log('Token:', token);
        },
        logout: async () => logout(),
        canEditCanvas: () => !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 