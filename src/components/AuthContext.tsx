'use client';
import React, { createContext, useContext } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface AuthUser {
  name: string;
  email: string;
  avatar: string;
  token?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, name?: string) => Promise<void>;
  signup: (name: string, email: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => void;
  updateUserSession: (name: string, email: string, avatar?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status, update } = useSession();

  const user: AuthUser | null = session?.user ? {
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || session.user.email || 'U')}&background=random&color=fff&size=150`,
  } : null;

  const loading = status === 'loading';

  const login = async (email: string, name?: string) => {
    await signIn('credentials', { email, password: 'password', callbackUrl: '/dashboard' });
  };

  const signup = async (name: string, email: string) => {
    await signIn('credentials', { email, password: 'password', callbackUrl: '/dashboard' });
  };

  const googleLogin = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const logout = () => {
    signOut({ callbackUrl: '/' });
  };

  const updateUserSession = async (name: string, email: string, avatar?: string) => {
    await update({ name, email, image: avatar || user?.avatar });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, googleLogin, logout, updateUserSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
