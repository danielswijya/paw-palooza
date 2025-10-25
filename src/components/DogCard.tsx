import { DogProfile } from '@/types/dog';
import { MapPin, Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from '@/lib/distance';
import { SpotlightCard } from '@/components/SpotlightCard';

interface DogCardProps {
  dog: DogProfile;
  distance?: number;
  onClick?: () => void;
}

const DogCard = ({ dog, distance, onClick }: DogCardProps) => {
  // Generate random match percentage (60-98%)
  const matchPercentage = Math.floor(Math.random() * 39) + 60;
  
  // Determine color based on match percentage
  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return { text: 'text-green-600', icon: 'text-green-600 fill-green-600' };
    if (percentage >= 70) return { text: 'text-green-400', icon: 'text-green-400 fill-green-400' };
    return { text: 'text-yellow-500', icon: 'text-yellow-500 fill-yellow-500' };
  };
  
  const matchColor = getMatchColor(matchPercentage);
  
  return (
    <SpotlightCard 
      className="group"
      spotlightColor="rgba(255, 127, 80, 0.18)"
    >
      <Card 
        className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer relative"
        onClick={onClick}
      >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
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
      <div className="p-3 space-y-2">
        {/* Name, Age, and Location */}
        <div>
          <h3 className="text-base font-bold mb-0.5 line-clamp-1">
            {dog.name}, {dog.traits.age}
          </h3>
          <div className="flex items-center text-muted-foreground text-xs">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
              {dog.location.city}, {dog.location.state}
            </span>
          </div>
          <div className="flex items-center text-xs mt-1">
            <Heart className={`w-3 h-3 mr-1 flex-shrink-0 ${matchColor.icon}`} />
            <span className={`font-semibold ${matchColor.text}`}>{matchPercentage}% Match</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-foreground/70 line-clamp-2 leading-relaxed">
          {dog.bio}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <Badge variant="outline" className="text-xs">
            {dog.traits.breed}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {dog.traits.weight} lbs
          </Badge>
          <Badge variant="outline" className="text-xs">
            {dog.traits.sex}
          </Badge>
        </div>

        {/* Ratings Preview */}
        <div className="flex gap-2 pt-1 text-xs">
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
      </div>
    </Card>
    </SpotlightCard>
  );
};

export default DogCard;
