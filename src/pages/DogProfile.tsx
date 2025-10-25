import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MapPin, Heart, MessageSquare, Share2, ArrowLeft } from 'lucide-react';
import { mockDogs } from '@/data/mockDogs';
import { formatDistance } from '@/lib/distance';
import { toast } from 'sonner';

const DogProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const dog = mockDogs.find(d => d.id === id);
  
  if (!dog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Dog not found</h2>
          <Button onClick={() => navigate('/')}>Back to Browse</Button>
        </div>
      </div>
    );
  }

  // Calculate distance (mock for now)
  const distance = Math.random() * 10;

  const handleConnect = () => {
    toast.success(`Sent a playdate request to ${dog.name}!`, {
      description: "They'll be notified and can respond soon",
    });
  };

  const handleMessage = () => {
    navigate('/messages', { state: { dogId: dog.id, dogName: dog.name } });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Image Gallery */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 rounded-xl overflow-hidden max-h-[500px]">
          <div className="relative aspect-square md:aspect-auto">
            <img
              src={dog.images[0]}
              alt={`${dog.name}, ${dog.traits.age} year old ${dog.traits.breed}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:grid grid-cols-2 gap-2">
            {dog.images.slice(1, 5).map((image, idx) => (
              <div key={idx} className="relative aspect-square">
                <img
                  src={image}
                  alt={`${dog.name} photo ${idx + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Location */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {dog.name}, {dog.traits.age}
                  </h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{dog.location.city}, {dog.location.state}</span>
                    {distance !== undefined && (
                      <span className="ml-2">· {formatDistance(distance)}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-sm">{dog.traits.breed}</Badge>
                <Badge variant="outline" className="text-sm">{dog.traits.weight} lbs</Badge>
                <Badge variant="outline" className="text-sm">{dog.traits.sex}</Badge>
                {dog.traits.neutered && <Badge variant="outline" className="text-sm">Neutered</Badge>}
                {dog.traits.vaccinated && <Badge variant="outline" className="text-sm">Vaccinated</Badge>}
              </div>
            </div>

            <Separator />

            {/* About Section */}
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">About {dog.name}</h2>
              <p className="text-foreground/80 leading-relaxed text-lg">{dog.bio}</p>
            </div>

            <Separator />

            {/* Personality Traits */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Personality</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">🐕</div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Dog Friendly
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {dog.traits.dogSociability}/5
                  </div>
                </Card>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">👤</div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    People Friendly
                  </div>
                  <div className="text-3xl font-bold text-secondary">
                    {dog.traits.humanSociability}/5
                  </div>
                </Card>
                <Card className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-3">⭐</div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">
                    Temperament
                  </div>
                  <div className="text-3xl font-bold text-accent">
                    {dog.traits.temperament}/5
                  </div>
                </Card>
              </div>
            </div>

            <Separator />

            {/* What This Dog Offers */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">What {dog.name} enjoys</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-2xl">🎾</span>
                  <div>
                    <div className="font-medium">Playtime</div>
                    <div className="text-sm text-muted-foreground">Loves to play fetch and run</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-2xl">🌳</span>
                  <div>
                    <div className="font-medium">Park visits</div>
                    <div className="text-sm text-muted-foreground">Enjoys outdoor adventures</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-2xl">🦴</span>
                  <div>
                    <div className="font-medium">Treats</div>
                    <div className="text-sm text-muted-foreground">Food motivated</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className="text-2xl">🏊</span>
                  <div>
                    <div className="font-medium">Swimming</div>
                    <div className="text-sm text-muted-foreground">Water enthusiast</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Contact Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6 shadow-xl space-y-4">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-primary">
                  {formatDistance(distance)}
                </div>
                <p className="text-sm text-muted-foreground">from your location</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button 
                  variant="accept" 
                  size="lg" 
                  className="w-full"
                  onClick={handleConnect}
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Send Playdate Request
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full"
                  onClick={handleMessage}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Message
                </Button>
              </div>

              <div className="pt-4 text-center text-sm text-muted-foreground">
                <p>You won't be charged yet</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogProfile;
