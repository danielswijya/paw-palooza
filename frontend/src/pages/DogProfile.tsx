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
import { useDogs } from '@/hooks/useDogs';
import { calculateDogCompatibility } from '@/lib/compatibility';
import GoogleMap from '@/components/GoogleMap';

const DogProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: dog, isLoading } = useDog(id || '');
  const { data: allDogs } = useDogs();
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

    // Validate that description is not empty
    if (!reviewDescription || reviewDescription.trim() === '') {
      toast.error('Please write a review description');
      return;
    }

    console.log('Submitting review:', {
      rating: reviewRating,
      description: reviewDescription,
      dog_id: dog.id,
      owner_id: profile.id,
    });

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

      console.log('Review response status:', response.status);

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
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error?.message || 'Failed to submit review');
    }
  };

  // Calculate average rating and total reviews
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(2)
    : '0.00';
  const totalReviews = reviews.length;

  // Calculate compatibility score with the user's first dog (if they have one)
  const userDogs = allDogs?.filter(d => d.ownerId === profile?.id) || [];
  const userDog = userDogs[0]; // Use the first dog for compatibility
  const compatibility = userDog ? calculateDogCompatibility(dog, userDog) : null;
  const compatibilityPercentage = compatibility ? Math.round(compatibility.cosineSimilarity * 100) : 0;

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
              <div>
                <h2 className="text-xl md:text-2xl font-semibold mb-1">
                  {dog.traits.breed} in {dog.location.city}
                </h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span>{dog.traits.age} years old</span>
                  <span>·</span>
                  <span>{dog.traits.weight} lbs</span>
                  <span>·</span>
                  <span>{dog.traits.sex}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {compatibilityPercentage > 0 && (
                  <>
                    <span className="text-muted-foreground">{compatibilityPercentage}% Compatible</span>
                    <span className="text-muted-foreground">·</span>
                  </>
                )}
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{averageRating}</span>
                <span className="text-muted-foreground">·</span>            
                <span className="text-muted-foreground">{formatDistance(distance)}</span>
              </div>
            </div>
          

            <Separator />

            {/* About Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">About {dog.name}</h3>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {dog.bio}
              </p>
            </div>

            <Separator />

            {/* What this place offers */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">{dog.name}'s Attributes</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between max-w-md">
                  <span>Neutered/Spayed</span>
                  <span className="font-semibold">{dog.traits.neutered ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between max-w-md">
                  <span>Vaccinated</span>
                  <span className="font-semibold">{dog.traits.vaccinated ? 'Yes' : 'No'}</span>
                </div>
                <div className="flex items-center justify-between max-w-md">
                  <span>Sociability</span>
                  <span className="font-semibold">{dog.traits.dogSociability}/5</span>
                </div>
                <div className="flex items-center justify-between max-w-md">
                  <span>Temperament</span>
                  <span className="font-semibold">{dog.traits.temperament}/5</span>
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
                  <p className="font-semibold">{dog.owner?.address || 'Address not available'}</p>
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
                {dog.owner && (
                  <>
                    <div>
                      <h3 className="text-xl font-semibold mb-1">
                        {dog.owner.name}
                      </h3>
                      {dog.owner.age && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <span>{dog.owner.age} years old</span>
                        </div>
                      )}
                    </div>

                    {dog.owner.about && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">About the {dog.owner.gender?.toLowerCase() === 'female' ? 'Mom' : 'Dad'}</h3>
                          <p className="text-foreground leading-relaxed whitespace-pre-line">
                            {dog.owner.about}
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}

                <Separator />

                <div className="space-y-3">
                  
                  
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
