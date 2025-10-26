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
  // Use compatibility score if provided, otherwise generate random match percentage
  const matchPercentage = compatibilityScore 
    ? Math.round(compatibilityScore * 100) 
    : Math.floor(Math.random() * 39) + 60;
  
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
      <div className="p-3 space-y-2 flex-1 flex flex-col">
        {/* Name, Age, and Location */}
        <div className="mb-2">
          <h3 className="text-base font-bold mb-1 line-clamp-1">
            {dog.name}, {dog.traits.age}
          </h3>
          <div className="flex items-center text-muted-foreground text-xs mb-2">
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
          <Badge variant="outline" className="text-xs">
            {dog.traits.breed}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {dog.traits.weight} lbs
          </Badge>
          <Badge variant="outline" className="text-xs">
            {dog.traits.sex}
          </Badge>
          <Badge variant="outline" className="text-xs">
            Neutered {dog.traits.neutered ? '✓' : '✗'}
          </Badge>
        </div>

        {/* Ratings Preview */}
        <div className="flex gap-2 text-xs mt-2">
          <div className="flex items-center gap-0.5">
            <span className="text-muted-foreground text-xs">🐕</span>
            <span className="font-medium">{dog.traits.dogSociability}/5</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-muted-foreground text-xs">👤</span>
            <span className="font-medium">{dog.traits.humanSociability}/5</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="text-muted-foreground text-xs">⭐</span>
            <span className="font-medium">{dog.traits.temperament}/5</span>
          </div>
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
