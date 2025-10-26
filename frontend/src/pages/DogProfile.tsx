import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MapPin, 
  Heart, 
  Share2, 
  ArrowLeft, 
  Star,
  Shield,
  Award,
  Calendar,
  CheckCircle2,
  MessageSquare,
  ChevronRight
} from 'lucide-react';
import { formatDistance } from '@/lib/distance';
import { toast } from 'sonner';
import pawfectLogo from '@/assets/pawfect-logo.png';
import { useDog } from '@/hooks/useDogs';
import GoogleMap from '@/components/GoogleMap';

const DogProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: dog, isLoading } = useDog(id || '');
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
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

  const handleShare = () => {
    toast.success('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-20 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/')}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="rounded-full"
              >
                <Share2 className="h-4 w-4 mr-2" />
                <span className="underline">Share</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="rounded-full"
              >
                <Heart className="h-4 w-4 mr-2" />
                <span className="underline">Save</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-20 py-6">
        {/* Title Section - Above Images */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            Meet {dog.name}
          </h1>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden h-[400px] md:h-[450px]">
            {/* Large main image */}
            <div className="md:col-span-2 md:row-span-2 relative group cursor-pointer">
              <img
                src={dog.images[0]}
                alt={`${dog.name}`}
                className="w-full h-full object-cover hover:brightness-90 transition-all"
              />
            </div>
            {/* Grid of smaller images */}
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="hidden md:block relative group cursor-pointer">
                <img
                  src={dog.images[idx % dog.images.length]}
                  alt={`${dog.name} photo ${idx + 2}`}
                  className="w-full h-full object-cover hover:brightness-90 transition-all"
                />
                {idx === 3 && (
                  <button className="absolute bottom-4 right-4 bg-background border border-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-muted transition-colors">
                    Show all photos
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold mb-1">
                    {dog.traits.breed} in {dog.location.city}, {dog.location.state}
                  </h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>{dog.traits.age} years old</span>
                    <span>·</span>
                    <span>{dog.traits.weight} lbs</span>
                    <span>·</span>
                    <span>{dog.traits.sex}</span>
                  </div>
                </div>
                <Avatar className="w-14 h-14">
                  <AvatarImage src={dog.images[0]} alt="Owner" />
                  <AvatarFallback>
                    {dog.name[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">4.95</span>
                <span className="text-muted-foreground">·</span>
                <button className="underline font-semibold">
                  25 reviews
                </button>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{formatDistance(distance)}</span>
              </div>
            </div>

            <Separator />

            {/* Hosted by Section */}
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage src={dog.images[0]} alt="Owner" />
                <AvatarFallback>{dog.owner?.name?.[0] || dog.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  Hosted by {dog.owner?.name || 'Owner'}
                </h3>
                <p className="text-muted-foreground text-sm">Hosting since 2023</p>
              </div>
            </div>

            <Separator />

            {/* Key Features */}
            <div className="space-y-6">
              <div className="flex gap-4">
                <Shield className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Fully vaccinated</h4>
                  <p className="text-muted-foreground text-sm">
                    {dog.name} is up to date on all vaccinations and health checks
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Award className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Great with other dogs</h4>
                  <p className="text-muted-foreground text-sm">
                    Rated {dog.traits.dogSociability}/5 for dog sociability
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Calendar className="w-6 h-6 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-1">Available for playdates</h4>
                  <p className="text-muted-foreground text-sm">
                    Flexible schedule for meetups and playdates
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">About {dog.name}</h3>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {dog.bio}
              </p>
              <button className="font-semibold underline flex items-center gap-1 hover:gap-2 transition-all">
                Show more
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Separator />

            {/* What this place offers */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">What {dog.name} offers</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Friendly with dogs</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Good with people</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Vaccinated</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Neutered/Spayed</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>House trained</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Leash trained</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reviews Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 fill-current" />
                <h3 className="text-xl font-semibold">4.95 · 25 reviews</h3>
              </div>

              {/* Review Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span>Friendliness</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-foreground rounded-full"></div>
                    <span className="font-semibold text-sm">4.9</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Energy level</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-foreground rounded-full"></div>
                    <span className="font-semibold text-sm">4.8</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Obedience</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-foreground rounded-full"></div>
                    <span className="font-semibold text-sm">5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Playfulness</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-1 bg-foreground rounded-full"></div>
                    <span className="font-semibold text-sm">4.9</span>
                  </div>
                </div>
              </div>

              {/* Individual Reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((review) => (
                  <div key={review} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-muted-foreground">October 2024</p>
                      </div>
                    </div>
                    <p className="text-sm">
                      Amazing playdate! {dog.name} was so friendly and energetic. Our dogs had a blast together at the park.
                    </p>
                  </div>
                ))}
              </div>

              <button className="border border-foreground px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors">
                Show all 25 reviews
              </button>
            </div>

            <Separator />

            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Where you'll find {dog.name}</h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">{dog.location.city}, {dog.location.state}</p>
                  <p className="text-muted-foreground text-sm">{formatDistance(distance)} away</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    📍 Location shown within 0.5km radius for privacy
                  </p>
                </div>
              </div>
              <GoogleMap 
                lat={dog.location.lat} 
                lng={dog.location.lng} 
                dogName={dog.name}
                className="w-full h-[400px] rounded-xl"
                radiusMeters={500}
                maxZoom={15}
                zoom={13}
              />
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6 shadow-xl border-2">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">4.95</span>
                    <span className="text-muted-foreground">·</span>
                    <button className="underline text-muted-foreground">
                      25 reviews
                    </button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(340_82%_52%)] hover:opacity-90 text-white font-semibold"
                    onClick={handleConnect}
                  >
                    Request playdate
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full font-semibold"
                    onClick={handleMessage}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </div>

                <p className="text-center text-sm text-muted-foreground">
                  You won't be charged yet
                </p>

                <Separator />

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Report this listing</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-20 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={pawfectLogo} alt="Pawfect" className="h-6 w-auto" />
              <span className="text-sm text-muted-foreground">
                © 2024 Pawfect, Inc.
              </span>
            </div>
            <div className="flex gap-4 text-sm">
              <button className="hover:underline">Terms</button>
              <button className="hover:underline">Privacy</button>
              <button className="hover:underline">Support</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DogProfile;
