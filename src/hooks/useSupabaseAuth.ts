
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

    const handleAuthStateChange = async (event: string, session: Session | null) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;
      
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
            console.log('Setting user profile:', authUser);
            setUser(authUser);
          } else {
            console.log('User profile not found, creating basic user');
            const basicUser: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email || '',
              userType: 'attendee',
            };
            setUser(basicUser);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          const basicUser: AuthUser = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email || '',
            userType: 'attendee',
          };
          setUser(basicUser);
        }
      } else {
        setUser(null);
      }
      
      if (mounted) {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) setLoading(false);
          return;
        }
        
        if (session) {
          await handleAuthStateChange('INITIAL_SESSION', session);
        } else {
          if (mounted) setLoading(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        if (mounted) setLoading(false);
      }
    };

    checkInitialSession();

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
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
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
