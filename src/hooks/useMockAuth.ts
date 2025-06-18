
import { useState, useEffect } from 'react';
import { mockUser, MockUser } from '@/data/mockData';

export const useMockAuth = () => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simular usuário logado
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const signUp = async (email: string, password: string, name: string, userType: string) => {
    setLoading(true);
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      userType,
    };
    
    setUser(newUser);
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    setLoading(false);
    
    return { data: { user: newUser }, error: null };
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    setLoading(false);
    
    return { data: { user: mockUser }, error: null };
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(null);
    localStorage.removeItem('mockUser');
    setLoading(false);
    
    return { error: null };
  };

  const updateProfile = async (updates: Partial<MockUser>) => {
    if (!user) return { error: new Error('No user logged in') };

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('mockUser', JSON.stringify(updatedUser));
    
    return { data: updatedUser, error: null };
  };

  return {
    user,
    session: user ? { user } : null,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };
};
