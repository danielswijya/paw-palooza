import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLocation } from '@/data/mockDogs';
import DogCard from '@/components/DogCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Settings, Search, LogIn, ClipboardList, MessageSquare, Heart } from 'lucide-react';
import { calculateDistance } from '@/lib/distance';
import { DogProfile } from '@/types/dog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import pawfectLogo from '@/assets/pawfect-logo.png';
import { useDogs } from '@/hooks/useDogs';
import { rankDogsByCompatibility, getCurrentUserDog, CompatibilityResult } from '@/lib/compatibility';

const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: dogs = [], isLoading } = useDogs();

  // Get current user's dog for compatibility calculations
  const currentUserDog = getCurrentUserDog();

  // Calculate distances and sort by proximity
  const dogsWithDistance = dogs.map(dog => ({
    ...dog,
    distance: calculateDistance(
      userLocation.lat,
      userLocation.lng,
      dog.location.lat,
      dog.location.lng
    ),
  }));

  // For You section - dogs ranked by compatibility score
  const forYouDogs = useMemo(() => {
    if (dogsWithDistance.length === 0) return [];
    
    // Calculate compatibility scores for all dogs
    const compatibilityResults = rankDogsByCompatibility(currentUserDog, dogsWithDistance);
    
    // Get the top 3 most compatible dogs
    const topCompatibleDogs = compatibilityResults
      .slice(0, 3)
      .map(result => {
        const dog = dogsWithDistance.find(d => d.id === result.dogId);
        return dog ? { ...dog, compatibilityScore: result.compatibilityScore } : null;
      })
      .filter(Boolean) as (DogProfile & { compatibilityScore: number })[];
    
    return topCompatibleDogs;
  }, [dogsWithDistance, currentUserDog]);

  // All listings
  const allDogs = searchQuery
    ? dogsWithDistance.filter(dog =>
        dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dog.traits.breed.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : dogsWithDistance;

  const handleCardClick = (dog: DogProfile) => {
    navigate(`/dog/${dog.id}`);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={pawfectLogo} alt="Pawfect" className="h-8 w-auto" />
            </div>

            {/* Search Bar */}
            <div className="hidden sm:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name or breed..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50"
                />
              </div>
            </div>

            <nav className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover-scale">
                    <User className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/messages')}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Messages
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/auth')}>
                    <LogIn className="w-4 h-4 mr-2" />
                    Login / Sign Up
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/onboarding')}>
                    <ClipboardList className="w-4 h-4 mr-2" />
                    Add Your Dog
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* For You Section */}
        {!searchQuery && (
          <section className="mb-12 animate-fade-in">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-red-500" />
                  For You
                </h2>
                <p className="text-sm text-muted-foreground">
                  Dogs with the highest compatibility scores based on traits, reviews, and ratings
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {forYouDogs.map((dog, index) => (
                <div
                  key={dog.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <DogCard 
                    dog={dog} 
                    distance={dog.distance}
                    compatibilityScore={dog.compatibilityScore}
                    onClick={() => handleCardClick(dog)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* All Listings */}
        <section className="animate-fade-in">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {searchQuery ? 'Search Results' : 'All Nearby Dogs'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {allDogs.length} dog{allDogs.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading dogs...</p>
            </div>
          ) : allDogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allDogs.map((dog, index) => (
                <div
                  key={dog.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <DogCard 
                    dog={dog} 
                    distance={dog.distance}
                    onClick={() => handleCardClick(dog)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No dogs found matching your search.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Browse;
