
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
          // Fetch user profile from our users table
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
              console.error('Error fetching user profile:', error);
              // If user doesn't exist in our users table, create a basic profile
              if (error?.code === 'PGRST116' && session.user.email) {
                console.log('Creating user profile for authenticated user');
                const { data: newProfile, error: createError } = await supabase
                  .from('users')
                  .insert({
                    email: session.user.email,
                    name: session.user.email.split('@')[0], // Use email prefix as default name
                    user_type: 'participant',
                  })
                  .select()
                  .single();

                if (newProfile && !createError && mounted) {
                  setUser({
                    id: newProfile.id,
                    email: newProfile.email,
                    name: newProfile.name,
                    userType: newProfile.user_type,
                    phone: newProfile.phone,
                    city: newProfile.city,
                  });
                } else {
                  console.error('Error creating user profile:', createError);
                }
              }
            }
          } catch (error) {
            console.error('Error in auth state change:', error);
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
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        // The onAuthStateChange will handle the session
      } catch (error) {
        console.error('Error in getInitialSession:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name: string, userType: string) => {
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
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { data, error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
    }
    return { error };
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
