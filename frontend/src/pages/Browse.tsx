import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLocation } from '@/data/mockDogs';
import DogCard from '@/components/DogCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Search, LogIn, ClipboardList, Heart, LayoutDashboard } from 'lucide-react';
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
import { useAuth } from '@/hooks/useAuth';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { rankDogsByCompatibility, CompatibilityResult, calculateCosineSimilarityOnly, calculateDogCompatibility } from '@/lib/compatibility';

const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: dogs = [], isLoading } = useDogs();
  const { user } = useAuth();
  const { profile } = useOwnerProfile();

  // Get current user's dog for compatibility calculations
  const currentUserDog = useMemo(() => {
    if (!profile?.id || !dogs.length) return null;
    
    // Find the user's first dog from the actual database
    const userDogs = dogs.filter(dog => dog.ownerId === profile.id);
    return userDogs.length > 0 ? userDogs[0] : null;
  }, [profile?.id, dogs]);

  // Filter out user's own dogs and calculate distances
  const dogsWithDistance = dogs
    .filter(dog => dog.ownerId !== profile?.id) // Exclude user's own dogs
    .map(dog => ({
      ...dog,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        dog.location.lat,
        dog.location.lng
      ),
    }));

  // For You section - dogs with cosine similarity >= 0.85 threshold
  const forYouDogs = useMemo(() => {
    if (dogsWithDistance.length === 0 || !currentUserDog) return [];
    
    // Filter dogs from the same state as the user's dog
    const sameStateDogs = dogsWithDistance.filter(dog => 
      dog.location.state === currentUserDog.location.state
    );
    
    // Calculate cosine similarity for each dog and filter by 0.85 threshold
    const compatibleDogs = sameStateDogs
      .map(dog => {
        const cosineSimilarity = calculateCosineSimilarityOnly(currentUserDog, dog);
        return { 
          ...dog, 
          compatibilityScore: cosineSimilarity, // For display
          fullCompatibilityScore: cosineSimilarity // For now, use cosine similarity for sorting
        };
      })
      .filter(dog => dog.compatibilityScore >= 0.85) // Only dogs meeting 0.85 cosine threshold
      .sort((a, b) => b.fullCompatibilityScore - a.fullCompatibilityScore); // Sort by compatibility score
    
    return compatibleDogs;
  }, [dogsWithDistance, currentUserDog]);

  // All listings - show all dogs (regardless of compatibility)
  const allDogs = useMemo(() => {
    // Apply search filter if there's a search query
    if (searchQuery) {
      return dogsWithDistance.filter(dog =>
        dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dog.traits.breed.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return dogsWithDistance;
  }, [dogsWithDistance, searchQuery]);

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
              <img src={pawfectLogo} alt="Pawfect" className="h-20 w-auto" />
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
                  {user ? (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dog-onboarding')}>
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Add Your Dog
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/auth')}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Login / Sign Up
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/dog-onboarding')}>
                        <ClipboardList className="w-4 h-4 mr-2" />
                        Add Your Dog
                      </DropdownMenuItem>
                    </>
                  )}
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {forYouDogs.map((dog, index) => (
                <div
                  key={dog.id}
                  className="animate-fade-in h-full"
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
                  className="animate-fade-in h-full"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <DogCard 
                    dog={dog} 
                    distance={dog.distance}
                    compatibilityScore={currentUserDog ? calculateCosineSimilarityOnly(currentUserDog, dog) : undefined}
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
