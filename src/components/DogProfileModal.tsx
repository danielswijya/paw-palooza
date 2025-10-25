import { DogProfile } from '@/types/dog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Heart, MessageSquare, X } from 'lucide-react';
import { formatDistance } from '@/lib/distance';
import { toast } from 'sonner';

interface DogProfileModalProps {
  dog: DogProfile | null;
  distance?: number;
  open: boolean;
  onClose: () => void;
}

const DogProfileModal = ({ dog, distance, open, onClose }: DogProfileModalProps) => {
  if (!dog) return null;

  const handleConnect = () => {
    toast.success(`Sent a playdate request to ${dog.name}!`, {
      description: "They'll be notified and can respond soon",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Hero Image */}
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={dog.images[0]}
            alt={`${dog.name}, ${dog.traits.age} year old ${dog.traits.breed}`}
            className="w-full h-full object-cover"
          />
          {distance !== undefined && (
            <Badge 
              variant="secondary" 
              className="absolute top-4 left-4 backdrop-blur-sm bg-background/90 shadow-lg"
            >
              {formatDistance(distance)}
            </Badge>
          )}
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <DialogTitle className="text-3xl font-bold">
                  {dog.name}, {dog.traits.age}
                </DialogTitle>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{dog.location.city}, {dog.location.state}</span>
                </div>
              </div>
            </div>
          </DialogHeader>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-sm">{dog.traits.breed}</Badge>
            <Badge variant="outline" className="text-sm">{dog.traits.weight} lbs</Badge>
            <Badge variant="outline" className="text-sm">{dog.traits.sex}</Badge>
            {dog.traits.neutered && <Badge variant="outline" className="text-sm">Neutered</Badge>}
            {dog.traits.vaccinated && <Badge variant="outline" className="text-sm">Vaccinated</Badge>}
          </div>

          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">About {dog.name}</h3>
            <p className="text-foreground/80 leading-relaxed">{dog.bio}</p>
          </div>

          {/* Personality Traits */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Personality</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="text-3xl mb-2">🐕</div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Dog Friendly
                </div>
                <div className="text-2xl font-bold text-primary">
                  {dog.traits.dogSociability}/5
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="text-3xl mb-2">👤</div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  People Friendly
                </div>
                <div className="text-2xl font-bold text-secondary">
                  {dog.traits.humanSociability}/5
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  Temperament
                </div>
                <div className="text-2xl font-bold text-accent">
                  {dog.traits.temperament}/5
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={onClose}
            >
              <X className="w-5 h-5 mr-2" />
              Close
            </Button>
            <Button
              variant="accept"
              size="lg"
              className="flex-1"
              onClick={handleConnect}
            >
              <Heart className="w-5 h-5 mr-2" />
              Send Playdate Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DogProfileModal;
