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
    if (!profileLoading && profile && (!profile.city || !profile.state)) {
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={pawfectLogo} alt="Pawfect" className="h-8 w-auto" />
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/browse')}>
                Browse Dogs
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile?.name}!</h1>
          <p className="text-muted-foreground text-lg">
            Manage your dogs and connect with the community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Your Dogs
              </CardTitle>
              <Dog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dogs.length}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Location
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {profile?.city}, {profile?.state}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Profile
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm" className="mt-1">
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Dogs Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Your Dogs</CardTitle>
                <CardDescription className="mt-2">
                  Manage your dog profiles and add new ones
                </CardDescription>
              </div>
              <Button variant="hero" onClick={() => navigate('/dog-onboarding')}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Dog
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loadingDogs ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading dogs...</p>
              </div>
            ) : dogs.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <Dog className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No dogs yet</h3>
                <p className="text-muted-foreground mb-6">
                  Add your first dog to start connecting with others
                </p>
                <Button variant="hero" onClick={() => navigate('/dog-onboarding')}>
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Your First Dog
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dogs.map((dog) => (
                  <Card key={dog.id} className="hover:shadow-lg transition-all cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Dog className="w-5 h-5 text-primary" />
                        {dog.name}
                      </CardTitle>
                      <CardDescription>{dog.breed}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Age:</span> {dog.age} years</p>
                        {dog.about && (
                          <p className="text-muted-foreground line-clamp-2">{dog.about}</p>
                        )}
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        View Profile
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
