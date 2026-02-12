import { writable } from 'svelte/store';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth store
export const auth = writable({
  user: null,
  session: null,
  loading: true
});

// Initialize auth
export async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession();
  
  auth.set({
    user: session?.user ?? null,
    session: session,
    loading: false
  });
  
  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    auth.set({
      user: session?.user ?? null,
      session: session,
      loading: false
    });
    
    // Store token for API calls
    if (session?.access_token) {
      localStorage.setItem('auth_token', session.access_token);
    } else {
      localStorage.removeItem('auth_token');
    }
  });
}

// Auth actions
export const authActions = {
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('auth_token');
  },
  
  async resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });
    
    if (error) throw error;
  }
};

// Derived stores
export const isAuthenticated = derived(auth, $auth => !!$auth.user);
export const isLoading = derived(auth, $auth => $auth.loading);

function derived(store, fn) {
  const derivedStore = writable(fn(store));
  store.subscribe(value => derivedStore.set(fn(value)));
  return derivedStore;
}
