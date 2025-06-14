
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  userType: string;
  phone?: string;
  city?: string;
}

// Function to clean up any existing auth state
const cleanupAuthState = () => {
  // Clear all auth-related items from localStorage
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  // Clear sessionStorage as well
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Clean up any existing problematic auth state first
    cleanupAuthState();

    // Force sign out any existing session
    const forceCleanStart = async () => {
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (error) {
        console.log('No existing session to sign out');
      }
    };

    forceCleanStart();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user && event === 'SIGNED_IN') {
          // Only fetch user profile after successful sign in
          try {
            const { data: userProfile, error } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single();
            
            if (userProfile && !error && mounted) {
              setUser({
                id: userProfile.id,
                email: userProfile.email,
                name: userProfile.name,
                userType: userProfile.user_type,
                phone: userProfile.phone,
                city: userProfile.city,
              });
            } else {
              console.log('User profile not found:', error);
              setUser(null);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(null);
          }
        } else {
          setUser(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    // Don't check for existing session - start fresh
    if (mounted) {
      setLoading(false);
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, userType: string) => {
    try {
      // Clean up before attempting signup
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (data.user && !error) {
        // Create user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            email,
            name,
            user_type: userType,
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }

      return { data, error };
    } catch (error) {
      console.error('Signup error:', error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Clean up before attempting signin
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      setUser(null);
      setSession(null);
      
      // Force page reload to ensure clean state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
      return { error };
    } catch (error) {
      console.error('Signout error:', error);
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return { error: new Error('No user logged in') };

    const { data, error } = await supabase
      .from('users')
      .update({
        name: updates.name,
        phone: updates.phone,
        city: updates.city,
      })
      .eq('id', user.id);

    if (!error && data) {
      setUser({ ...user, ...updates });
    }

    return { data, error };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
};
