import { useState, useEffect } from 'react';
import { DogProfile } from '@/types/dog';
import { MapPin, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from '@/lib/distance';
import { SpotlightCard } from '@/components/SpotlightCard';

interface DogCardProps {
  dog: DogProfile;
  distance?: number;
  compatibilityScore?: number;
  onClick?: () => void;
}

const DogCard = ({ dog, distance, compatibilityScore, onClick }: DogCardProps) => {
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [hasReviews, setHasReviews] = useState(false);

  // Fetch reviews and calculate average rating
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/reviews?dog_id=${dog.id}`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        
        const reviews = await response.json();
        
        if (reviews && reviews.length > 0) {
          const totalRating = reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0);
          const average = totalRating / reviews.length;
          setAvgRating(average);
          setHasReviews(true);
        } else {
          setHasReviews(false);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setHasReviews(false);
      }
    };

    fetchReviews();
  }, [dog.id]);

  // Use compatibility score if provided, otherwise show 0
  const matchPercentage = compatibilityScore 
    ? Math.round(compatibilityScore * 100) 
    : 0;
  
  // Determine color based on compatibility score
  const getMatchColor = (score: number) => {
    if (score >= 0.8) return { text: 'text-green-600', icon: 'text-green-600 fill-green-600', bg: 'bg-green-50' };
    if (score >= 0.6) return { text: 'text-green-500', icon: 'text-green-500 fill-green-500', bg: 'bg-green-50' };
    if (score >= 0.4) return { text: 'text-yellow-500', icon: 'text-yellow-500 fill-yellow-500', bg: 'bg-yellow-50' };
    return { text: 'text-orange-500', icon: 'text-orange-500 fill-orange-500', bg: 'bg-orange-50' };
  };
  
  const matchColor = getMatchColor(compatibilityScore || 0.5);
  
  return (
    <SpotlightCard 
      className="group"
      spotlightColor="rgba(255, 127, 80, 0.18)"
    >
      <Card 
        className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative h-full flex flex-col"
        onClick={onClick}
      >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden flex-shrink-0">
        <img
          src={dog.images[0]}
          alt={`${dog.name}, ${dog.traits.age} year old ${dog.traits.breed}`}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {distance !== undefined && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 backdrop-blur-sm bg-card shadow-lg border text-foreground"
          >
            {formatDistance(distance)}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex-1 flex flex-col space-y-2">
        {/* Name and Breed */}
        <div>
          <h3 className="text-base font-bold line-clamp-1">
            {dog.name}, {dog.traits.breed}
          </h3>
        </div>

        {/* Location and Compatibility on same row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center text-muted-foreground text-xs">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
              {dog.location.city}, {dog.location.state}
            </span>
          </div>
          <div className={`flex items-center text-xs px-2 py-1 rounded-full w-fit ${matchColor.bg}`}>
            <Heart className={`w-3 h-3 mr-1 flex-shrink-0 ${matchColor.icon}`} />
            <span className={`font-semibold ${matchColor.text}`}>
              {compatibilityScore ? `${(compatibilityScore * 100).toFixed(1)}% Compatible` : `${matchPercentage}% Match`}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {hasReviews && avgRating && (
            <Badge variant="outline" className="text-xs">
              {avgRating.toFixed(1)} ⭐
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {dog.traits.weight} lbs
          </Badge>
          <Badge variant="outline" className="text-xs">
            {dog.traits.sex.charAt(0).toUpperCase() + dog.traits.sex.slice(1)}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Neutered {dog.traits.neutered ? '✓' : '✗'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Sociability {dog.traits.dogSociability > 3 ? '✓' : dog.traits.dogSociability === 3 ? '-' : '✗'}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Temperament {dog.traits.temperament > 3 ? '✓' : dog.traits.temperament === 3 ? '-' : '✗'}
          </Badge>
        </div>

        {/* Compatibility Score Debug Info */}
        {compatibilityScore && (
          <div className="text-xs text-muted-foreground pt-1 border-t border-muted">
            <span className="font-mono">Score: {compatibilityScore.toFixed(4)}</span>
          </div>
        )}
      </div>
    </Card>
    </SpotlightCard>
  );
};

export default DogCard;