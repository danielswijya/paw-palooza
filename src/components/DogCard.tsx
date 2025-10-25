import { DogProfile } from '@/types/dog';
import { MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from '@/lib/distance';

interface DogCardProps {
  dog: DogProfile;
  distance?: number;
  onClick?: () => void;
}

const DogCard = ({ dog, distance, onClick }: DogCardProps) => {
  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={dog.images[0]}
          alt={`${dog.name}, ${dog.traits.age} year old ${dog.traits.breed}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {distance !== undefined && (
          <Badge 
            variant="secondary" 
            className="absolute top-3 left-3 backdrop-blur-sm bg-card shadow-lg border"
          >
            {formatDistance(distance)}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name, Age, and Location */}
        <div>
          <h3 className="text-lg font-bold mb-1 line-clamp-1">
            {dog.name}, {dog.traits.age}
          </h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">
              {dog.location.city}, {dog.location.state}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-foreground/70 line-clamp-2 leading-relaxed">
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
        <div className="flex gap-2 pt-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">🐕</span>
            <span className="font-medium">{dog.traits.dogSociability}/5</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">👤</span>
            <span className="font-medium">{dog.traits.humanSociability}/5</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">⭐</span>
            <span className="font-medium">{dog.traits.temperament}/5</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DogCard;
