import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, Dog, LogOut, User, Settings } from 'lucide-react';
import pawfectLogo from '@/assets/pawfect-logo.png';

interface DogProfile {
  id: string;
  name: string;
  breed: string;
  age: number;
  about: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useOwnerProfile();
  const [dogs, setDogs] = useState<DogProfile[]>([]);
  const [loadingDogs, setLoadingDogs] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && profile && !profile.address) {
      navigate('/owner-onboarding');
    }
  }, [profile, profileLoading, navigate]);

  useEffect(() => {
    if (profile) {
      fetchDogs();
    }
  }, [profile]);

  const fetchDogs = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('owner_id', profile.id);

      if (error) throw error;
      setDogs(data || []);
    } catch (error) {
      console.error('Error fetching dogs:', error);
    } finally {
      setLoadingDogs(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={pawfectLogo} alt="Pawfect" className="h-8 w-auto" />
              <nav className="hidden md:flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                  Browse
                </Button>
                <Button variant="ghost" size="sm" className="bg-muted">
                  Dashboard
                </Button>
              </nav>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.name}
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
            <div className="p-3 rounded-lg bg-muted">
              <Dog className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Your Dogs</p>
              <p className="text-2xl font-bold">{dogs.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
            <div className="p-3 rounded-lg bg-muted">
              <User className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="text-lg font-semibold">
                {profile?.address || 'Not set'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
            <div className="p-3 rounded-lg bg-muted">
              <Settings className="h-5 w-5 text-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Profile Settings</p>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Dogs Section */}
        <div className="border rounded-lg bg-card">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Your Dogs</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your dog profiles
                </p>
              </div>
              <Button onClick={() => navigate('/dog-onboarding')}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Dog
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            {loadingDogs ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                <p className="text-sm text-muted-foreground">Loading dogs...</p>
              </div>
            ) : dogs.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Dog className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No dogs yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Add your first dog to start connecting with the community
                </p>
                <Button onClick={() => navigate('/dog-onboarding')}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Your First Dog
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dogs.map((dog) => (
                  <div 
                    key={dog.id} 
                    className="border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer bg-card"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Dog className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{dog.name}</h3>
                          <p className="text-sm text-muted-foreground">{dog.breed}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age</span>
                        <span className="font-medium">{dog.age} years</span>
                      </div>
                      {dog.about && (
                        <p className="text-muted-foreground text-xs line-clamp-2 mt-2">
                          {dog.about}
                        </p>
                      )}
                    </div>
                    
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
