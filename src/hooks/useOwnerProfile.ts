import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface OwnerProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  about?: string;
  city?: string;
  state?: string;
  lat?: number;
  lng?: number;
}

export const useOwnerProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<OwnerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('owners')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<OwnerProfile>) => {
    if (!user || !profile) return { error: new Error('No user or profile') };

    try {
      const { error } = await supabase
        .from('owners')
        .update(updates)
        .eq('id', profile.id);

      if (error) throw error;
      
      await fetchProfile();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
  };
};
