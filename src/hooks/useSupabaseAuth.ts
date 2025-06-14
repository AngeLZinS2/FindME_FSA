
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

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          try {
            const { data: userProfile, error } = await supabase
              .from('users')
              .select('*')
              .eq('email', session.user.email)
              .single();
            
            if (userProfile && !error && mounted) {
              const authUser = {
                id: userProfile.id,
                email: userProfile.email,
                name: userProfile.name,
                userType: userProfile.user_type,
                phone: userProfile.phone,
                city: userProfile.city,
              };
              console.log('Setting user:', authUser);
              setUser(authUser);
            } else {
              console.log('User profile not found or error:', error);
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

    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        // The onAuthStateChange will handle the session update
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        if (mounted && !session) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, userType: string) => {
    try {
      setLoading(true);
      
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
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
      } else {
        console.log('Sign in successful:', data.user?.email);
      }

      return { data, error };
    } catch (error) {
      console.error('Signin error:', error);
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (!error) {
        setUser(null);
        setSession(null);
      }
      
      return { error };
    } catch (error) {
      console.error('Signout error:', error);
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
      console.error('Update profile error:', error);
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
