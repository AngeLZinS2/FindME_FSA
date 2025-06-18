
// Mock Supabase client to replace the deleted one for admin pages
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ data: null, error: new Error('Supabase removed') }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
  },
  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({ data: [], error: null }),
      order: (column: string, options?: any) => ({ data: [], error: null }),
      limit: (count: number) => ({ data: [], error: null }),
      data: [],
      error: null
    }),
    insert: (data: any) => ({ data: null, error: null }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({ data: null, error: null }),
      data: null,
      error: null
    }),
    delete: () => ({
      eq: (column: string, value: any) => ({ data: null, error: null }),
      data: null,
      error: null
    }),
  }),
  rpc: async (functionName: string, params?: any) => ({ data: null, error: new Error('Database functions not available') }),
};
