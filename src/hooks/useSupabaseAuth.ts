
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authCleanup';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  userType: string;
  phone?: string;
  city?: string;
}

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    let authSubscription: any = null;

    const handleAuthStateChange = async (event: string, session: Session | null) => {
      console.log('🔐 [useSupabaseAuth] Auth state change:', event, session?.user?.email);
      
      if (!mounted) {
        console.log('⚠️ [useSupabaseAuth] Component unmounted, ignoring auth change');
        return;
      }
      
      setSession(session);
      
      if (session?.user) {
        try {
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userProfile && !error && mounted) {
            const authUser: AuthUser = {
              id: userProfile.id,
              email: userProfile.email,
              name: userProfile.name,
              userType: userProfile.user_type,
              phone: userProfile.phone,
              city: userProfile.city,
            };
            console.log('✅ [useSupabaseAuth] Setting user profile:', authUser.name);
            setUser(authUser);
          } else {
            console.log('⚠️ [useSupabaseAuth] User profile not found, creating basic user');
            const basicUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email || '',
              userType: 'attendee',
            };
            setUser(basicUser);
          }
        } catch (error) {
          console.error('❌ [useSupabaseAuth] Error fetching user profile:', error);
          const basicUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email || '',
            userType: 'attendee',
          };
          setUser(basicUser);
        }
      } else {
        console.log('👤 [useSupabaseAuth] No session, clearing user');
        setUser(null);
      }
      
      if (mounted && !initialized) {
        setLoading(false);
        setInitialized(true);
        console.log('🏁 [useSupabaseAuth] Auth initialization complete');
      }
    };

    const initializeAuth = async () => {
      try {
        console.log('🚀 [useSupabaseAuth] Initializing auth...');
        
        // Set up auth state listener FIRST
        const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
        authSubscription = subscription;

        // Check for existing session only once
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [useSupabaseAuth] Error getting session:', error);
          // Clean up any corrupted auth state
          cleanupAuthState();
          if (mounted) {
            setLoading(false);
            setInitialized(true);
          }
          return;
        }

        if (session && mounted) {
          console.log('📱 [useSupabaseAuth] Found existing session for:', session.user?.email);
          await handleAuthStateChange('INITIAL_SESSION', session);
        } else if (mounted) {
          console.log('📭 [useSupabaseAuth] No existing session found');
          setLoading(false);
          setInitialized(true);
        }
      } catch (exception) {
        console.error('💥 [useSupabaseAuth] Exception during initialization:', exception);
        cleanupAuthState();
        if (mounted) {
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('🧹 [useSupabaseAuth] Cleanup hook');
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, []); // Empty dependency array to run only once

  const signUp = async (email: string, password: string, name: string, userType: string) => {
    try {
      setLoading(true);
      console.log('📝 [useSupabaseAuth] Signing up:', email);
      
      // Clean up before sign up
      cleanupAuthState();
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      if (data.user && !error) {
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email,
            name,
            user_type: userType,
          });

        if (profileError) {
          console.error('❌ [useSupabaseAuth] Error creating user profile:', profileError);
        }
      }

      return { data, error };
    } catch (error) {
      console.error('❌ [useSupabaseAuth] Signup error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔑 [useSupabaseAuth] Attempting signIn for:', email);
      
      // Clean up existing state first
      cleanupAuthState();
      
      // Attempt global sign out to clear any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('⚠️ [useSupabaseAuth] Error during cleanup signout (continuing):', err);
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 [useSupabaseAuth] SignIn response:', { success: !!data.user, error: !!error });
      
      if (data.user && !error) {
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
      
      return { data, error };
    } catch (error) {
      console.error('❌ [useSupabaseAuth] Signin error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('🚪 [useSupabaseAuth] Signing out...');
      
      // Clean up auth state first
      cleanupAuthState();
      
      // Clear state immediately
      setUser(null);
      setSession(null);
      
      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        console.log('⚠️ [useSupabaseAuth] Error during signout (continuing):', err);
      }
      
      // Force page reload for clean state
      window.location.href = '/';
      
      return { error: null };
    } catch (error) {
      console.error('❌ [useSupabaseAuth] Signout error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          phone: updates.phone,
          city: updates.city,
        })
        .eq('id', user.id);

      if (!error) {
        setUser({ ...user, ...updates });
      }

      return { data, error };
    } catch (error) {
      console.error('❌ [useSupabaseAuth] Update profile error:', error);
      return { data: null, error };
    }
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
