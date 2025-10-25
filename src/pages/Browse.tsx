import { useState } from 'react';
import { mockDogs } from '@/data/mockDogs';
import DogCard from '@/components/DogCard';
import { Button } from '@/components/ui/button';
import { Heart, User, MessageSquare, Settings } from 'lucide-react';
import { toast } from 'sonner';

const Browse = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState<string[]>([]);

  const currentDog = mockDogs[currentIndex];

  const handleAccept = () => {
    if (currentDog) {
      toast.success(`It's a match with ${currentDog.name}! 🎉`, {
        description: "You can now start planning playdates together",
      });
      setMatches([...matches, currentDog.id]);
      nextDog();
    }
  };

  const handleDecline = () => {
    if (currentDog) {
      toast.info(`Passed on ${currentDog.name}`, {
        description: "Don't worry, there are more puppers to meet!",
      });
      nextDog();
    }
  };

  const nextDog = () => {
    if (currentIndex < mockDogs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      toast.success("You've seen all available dogs in your area!", {
        description: "Check back later for more matches",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-primary fill-primary" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(340_82%_62%)] bg-clip-text text-transparent">
              Dog Dates
            </h1>
          </div>

          <nav className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <MessageSquare className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <User className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          {currentIndex < mockDogs.length ? (
            <div className="w-full max-w-md space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-semibold">
                  Dog {currentIndex + 1} of {mockDogs.length}
                </h2>
                <p className="text-muted-foreground">
                  {matches.length} match{matches.length !== 1 ? "es" : ""} so far!
                </p>
              </div>

              <DogCard
                dog={currentDog}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />

              {/* Map Placeholder */}
              <div className="bg-muted/50 rounded-lg p-6 text-center space-y-2">
                <p className="text-sm font-medium">📍 Approximate Location</p>
                <p className="text-xs text-muted-foreground">
                  Google Maps integration coming soon
                </p>
                <p className="text-sm">
                  {currentDog.location.city}, {currentDog.location.state}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🐕</div>
              <h2 className="text-3xl font-bold">That's all for now!</h2>
              <p className="text-muted-foreground max-w-md">
                You've seen all the dogs in your area. Check back later for more potential playmates!
              </p>
              <Button variant="hero" onClick={() => setCurrentIndex(0)}>
                See Dogs Again
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;
