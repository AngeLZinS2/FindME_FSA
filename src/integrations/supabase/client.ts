
// Mock client that connects to Python Flask backend
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Set auth token
const setAuthToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

// Remove auth token
const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return { data, error: null };
};

export const supabase = {
  auth: {
    signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          setAuthToken(data.token);
          return { data: { user: data.user }, error: null };
        } else {
          return { data: null, error: new Error(data.error) };
        }
      } catch (error) {
        return { data: null, error: error as Error };
      }
    },

    signUp: async ({ email, password, options }: { email: string; password: string; options?: { data?: { name?: string } } }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            password, 
            name: options?.data?.name || 'User' 
          }),
        });

        const data = await response.json();

        if (response.ok) {
          return { data: { user: { email } }, error: null };
        } else {
          return { data: null, error: new Error(data.error) };
        }
      } catch (error) {
        return { data: null, error: error as Error };
      }
    },

    signOut: async () => {
      removeAuthToken();
      return { error: null };
    },

    getUser: async () => {
      const token = getAuthToken();
      if (!token) {
        return { data: { user: null }, error: null };
      }

      try {
        // Decode JWT to get user info (simplified)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { 
          data: { 
            user: { 
              id: payload.user_id,
              email: 'user@example.com' // Would need to fetch from backend
            } 
          }, 
          error: null 
        };
      } catch {
        removeAuthToken();
        return { data: { user: null }, error: null };
      }
    }
  },

  from: (table: string) => ({
    select: (columns?: string) => ({
      eq: (column: string, value: any) => ({
        order: (column: string, options?: { ascending?: boolean }) => ({
          limit: (count: number) => {
            // Return events data for now
            if (table === 'events') {
              return apiRequest('/events').then(result => ({
                data: result.data.slice(0, count),
                error: result.error
              }));
            }
            return Promise.resolve({ data: [], error: null });
          },
          data: [],
          error: null
        }),
        data: [],
        error: null
      }),
      order: (column: string, options?: { ascending?: boolean }) => ({
        limit: (count: number) => {
          if (table === 'events') {
            return apiRequest('/events').then(result => ({
              data: result.data.slice(0, count),
              error: result.error
            }));
          }
          return Promise.resolve({ data: [], error: null });
        },
        data: [],
        error: null
      }),
      data: [],
      error: null
    }),

    insert: (data: any) => {
      if (table === 'events') {
        return apiRequest('/events', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
      return Promise.resolve({ data: null, error: null });
    },

    update: (data: any) => ({
      eq: (column: string, value: any) => {
        return Promise.resolve({ data: null, error: null });
      }
    }),

    delete: () => ({
      eq: (column: string, value: any) => {
        return Promise.resolve({ data: null, error: null });
      }
    })
  }),

  rpc: (functionName: string, params?: any) => {
    // Handle RPC calls based on function name
    if (functionName === 'admin_login') {
      return fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }).then(async response => {
        const data = await response.json();
        if (response.ok) {
          setAuthToken(data.token);
          return { data: data.user, error: null };
        } else {
          return { data: null, error: new Error(data.error) };
        }
      });
    }

    if (functionName === 'toggle_user_status') {
      return Promise.resolve({ data: null, error: null });
    }

    if (functionName === 'make_user_admin') {
      return Promise.resolve({ data: null, error: null });
    }

    return Promise.resolve({ data: null, error: null });
  }
};
