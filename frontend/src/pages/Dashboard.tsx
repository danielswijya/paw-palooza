import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { useDogs } from '@/hooks/useDogs';
import { PlusCircle, Dog, LogOut } from 'lucide-react';
import pawfectLogo from '@/assets/pawfect-logo.png';
import DogCard from '@/components/DogCard';
import { DogProfile } from '@/types/dog';


const Dashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading } = useOwnerProfile();
  const { data: allDogs, isLoading: loadingDogs } = useDogs();

  // Filter dogs for the current user
  const dogs = allDogs?.filter(dog => dog.ownerId === profile?.id) || [];

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
              <img src={pawfectLogo} alt="Pawfect" className="h-20 w-auto" />
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

        {/* Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-4 border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground mb-2">Personal Info</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Age</span>
                <span className="text-sm font-medium">
                  {profile?.age ? `${profile.age} years old` : 'Not set'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gender</span>
                <span className="text-sm font-medium">
                  {profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1).toLowerCase() : 'Not set'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground mb-1">About</p>
            <p className="text-sm line-clamp-3">
              {profile?.about || 'Not set'}
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-card">
            <p className="text-sm text-muted-foreground mb-1">Address</p>
            <p className="text-sm line-clamp-3">
              {profile?.address || 'Not set'}
            </p>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dogs.map((dog, index) => (
                  <div
                    key={dog.id}
                    className="animate-fade-in h-full"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <DogCard 
                      dog={dog} 
                      onClick={undefined}
                      hideMatchPercentage={true}
                    />
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
