import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDogs, userLocation } from '@/data/mockDogs';
import DogCard from '@/components/DogCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Heart, User, Settings, Search, LogIn, ClipboardList, MessageSquare } from 'lucide-react';
import { calculateDistance } from '@/lib/distance';
import { DogProfile } from '@/types/dog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Browse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate distances and sort by proximity
  const dogsWithDistance = mockDogs.map(dog => ({
    ...dog,
    distance: calculateDistance(
      userLocation.lat,
      userLocation.lng,
      dog.location.lat,
      dog.location.lng
    ),
  }));

  // For You section - closest dogs
  const forYouDogs = [...dogsWithDistance]
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Heart className="h-7 w-7 text-primary fill-primary" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(340_82%_62%)] bg-clip-text text-transparent">
                Pawfect
              </h1>
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
                  <DropdownMenuItem onClick={() => navigate('/login')}>
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
        {/* Location Banner */}
        <div className="mb-8 animate-fade-in">
          <p className="text-sm text-muted-foreground mb-1">Your location</p>
          <h2 className="text-2xl sm:text-3xl font-bold">
            {userLocation.city}, {userLocation.state}
          </h2>
        </div>

        {/* For You Section */}
        {!searchQuery && (
          <section className="mb-12 animate-fade-in">
            <div className="flex items-baseline justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">For You</h2>
                <p className="text-sm text-muted-foreground">
                  Dogs closest to you in {userLocation.city}
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

          {allDogs.length > 0 ? (
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
