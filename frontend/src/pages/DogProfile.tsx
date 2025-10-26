import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { useAuth } from '@/hooks/useAuth';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import GoogleMap from '@/components/GoogleMap';

const DogProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: dog, isLoading } = useDog(id || '');
  const { user } = useAuth();
  const { profile } = useOwnerProfile();
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewDescription, setReviewDescription] = useState('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch reviews when component mounts or dog changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!dog?.id) return;
      
      setReviewsLoading(true);
      try {
        const response = await fetch(`http://localhost:3001/api/reviews?dog_id=${dog.id}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        
        const data = await response.json();
        setReviews(data || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [dog?.id]);
  
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

  const handleSubmitReview = async () => {
    if (!user || !profile || !dog) {
      toast.error('Please login to submit a review');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: reviewRating,
          description: reviewDescription,
          dog_id: dog.id,
          owner_id: profile.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Failed to submit review');
      }

      toast.success('Review submitted successfully!');
      setIsReviewDialogOpen(false);
      setReviewRating(5);
      setReviewDescription('');

      // Refresh reviews list
      const reviewsResponse = await fetch(`http://localhost:3001/api/reviews?dog_id=${dog.id}`);
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData || []);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  // Calculate average rating and total reviews
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(2)
    : '0.00';
  const totalReviews = reviews.length;

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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-xl overflow-hidden h-[500px]">
            {dog.images.slice(0, 3).map((image, idx) => (
              <div key={idx} className="relative group cursor-pointer">
                <img
                  src={image || '/placeholder.svg'}
                  alt={`${dog.name} photo ${idx + 1}`}
                  className="w-full h-full object-cover hover:brightness-90 transition-all"
                />
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
                <span className="font-semibold">{averageRating}</span>
                <span className="text-muted-foreground">·</span>
                <button className="underline font-semibold">
                  {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-current" />
                  <h3 className="text-xl font-semibold">
                    {averageRating} · {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                  </h3>
                </div>
                <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="font-semibold">
                      Add Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Write a Review</DialogTitle>
                      <DialogDescription>
                        Share your experience with {dog.name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Rating</Label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setReviewRating(rating)}
                              className={`p-2 rounded-lg transition-colors ${
                                rating <= reviewRating
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted hover:bg-muted/80'
                              }`}
                            >
                              <Star className={`w-5 h-5 ${rating <= reviewRating ? 'fill-current' : ''}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Review</Label>
                        <Textarea
                          id="description"
                          placeholder="Share your experience..."
                          value={reviewDescription}
                          onChange={(e) => setReviewDescription(e.target.value)}
                          rows={5}
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsReviewDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button onClick={handleSubmitReview}>
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Individual Reviews */}
              {reviewsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">No reviews yet. Be the first to review {dog.name}!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {reviews.map((review) => {
                    const reviewDate = review.created_at ? new Date(review.created_at) : new Date();
                    return (
                      <div key={review.id} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{review.owner_id?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">User</p>
                            <p className="text-sm text-muted-foreground">
                              {reviewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= (review.rating || 0)
                                  ? 'fill-current text-yellow-500'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm">{review.description || 'No description provided.'}</p>
                      </div>
                    );
                  })}
                </div>
              )}
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
                    <span className="font-semibold">{averageRating}</span>
                    <span className="text-muted-foreground">·</span>
                    <button className="underline text-muted-foreground">
                      {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
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
