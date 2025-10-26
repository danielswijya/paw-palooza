import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Compute a URL base that works locally, on Vercel previews, and in production
const getBaseUrl = () => {
  // Prefer explicitly configured site URL
  let url = (import.meta as any)?.env?.VITE_SITE_URL
    || (import.meta as any)?.env?.VITE_VERCEL_URL
    || window.location.origin;

  // Vercel can provide domain without protocol; add https if missing
  if (url && typeof url === 'string' && !url.startsWith('http')) {
    url = `https://${url}`;
  }
  // Ensure trailing slash
  if (url && !url.endsWith('/')) {
    url = `${url}/`;
  }
  return url as string;
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const redirectTo = `${getBaseUrl()}owner-onboarding`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        // Example additional params if needed:
        // queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut,
  };
};
