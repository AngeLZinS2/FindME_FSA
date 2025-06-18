
// Mock Supabase client to replace the deleted one for admin pages
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase removed') }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({ data: [], error: null }),
    }),
    insert: () => ({ data: null, error: null }),
    update: () => ({ data: null, error: null }),
    delete: () => ({ data: null, error: null }),
  }),
};
