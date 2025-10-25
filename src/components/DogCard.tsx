import { DogProfile } from '@/types/dog';
import { MapPin, Heart, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DogCardProps {
  dog: DogProfile;
  onAccept: () => void;
  onDecline: () => void;
}

const DogCard = ({ dog, onAccept, onDecline }: DogCardProps) => {
  return (
    <Card className="overflow-hidden shadow-2xl border-2 max-w-md w-full mx-auto">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={dog.images[0]}
          alt={dog.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
            {dog.traits.breed}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Name and Location */}
        <div>
          <h2 className="text-3xl font-bold mb-2">
            {dog.name}, {dog.traits.age}
          </h2>
          <div className="flex items-center text-muted-foreground">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {dog.location.city}, {dog.location.state}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-foreground/80 leading-relaxed">
          {dog.bio}
        </p>

        {/* Traits */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{dog.traits.weight} lbs</Badge>
            <Badge variant="outline">{dog.traits.sex}</Badge>
            {dog.traits.neutered && <Badge variant="outline">Neutered</Badge>}
            {dog.traits.vaccinated && <Badge variant="outline">Vaccinated</Badge>}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium">Dog Friendly</div>
              <div className="text-lg font-bold text-primary">
                {dog.traits.dogSociability}/5
              </div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium">People Friendly</div>
              <div className="text-lg font-bold text-secondary">
                {dog.traits.humanSociability}/5
              </div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-lg">
              <div className="text-sm font-medium">Temperament</div>
              <div className="text-lg font-bold text-accent">
                {dog.traits.temperament}/5
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            variant="destructive"
            size="lg"
            className="flex-1"
            onClick={onDecline}
          >
            <X className="w-5 h-5 mr-2" />
            Pass
          </Button>
          <Button
            variant="accept"
            size="lg"
            className="flex-1"
            onClick={onAccept}
          >
            <Heart className="w-5 h-5 mr-2" />
            Connect
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DogCard;
