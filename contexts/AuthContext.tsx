'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import { supabase, getSession, onAuthStateChange } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    const setupAuth = async () => {
      // Check for initial session
      const initialSession = await getSession();
      setSession(initialSession);
      setLoading(false);

      // Listen for auth changes
      const { data } = await onAuthStateChange((session) => {
        setSession(session);
        const pathname = window.location.pathname;
        if (!session && pathname.startsWith('/dashboard')) {
          router.push('/signup');
        }
      });
      subscription = data.subscription;
    };

    setupAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, [router]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    loading,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
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
