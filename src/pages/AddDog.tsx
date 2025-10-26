import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Stepper } from '@/components/ui/stepper';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import pawfectLogo from '@/assets/pawfect-logo.png';

const AddDog = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useOwnerProfile();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const stepLabels = ['Basic Info', 'Personality', 'About & Photos'];

  const [dogData, setDogData] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    sex: '',
    neutered: '',
    sociability: 3,
    temperament: 3,
    about: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && profile && (!profile.city || !profile.state)) {
      toast({
        title: 'Profile incomplete',
        description: 'Please complete your owner profile first',
        variant: 'destructive',
      });
      navigate('/owner-onboarding');
    }
  }, [profile, profileLoading, navigate, toast]);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    if (!profile) return;

    // Validation
    if (!dogData.name || !dogData.breed || !dogData.age || !dogData.weight || !dogData.sex || !dogData.neutered) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('dogs').insert({
        owner_id: profile.id,
        name: dogData.name,
        breed: dogData.breed,
        age: parseInt(dogData.age),
        weight: parseInt(dogData.weight),
        sex: dogData.sex === 'male' ? 1 : 0,
        neutered: dogData.neutered === 'yes' ? 1 : 0,
        sociability: dogData.sociability,
        temperament: dogData.temperament,
        about: dogData.about,
        address: profile.address,
      });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: `${dogData.name}'s profile has been created`,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating dog:', error);
      toast({
        title: 'Error',
        description: 'Failed to create dog profile',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <img src={pawfectLogo} alt="Pawfect" className="h-20 w-auto" />
        </div>

        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Stepper steps={stepLabels} currentStep={step} className="mb-8" />

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Add a New Dog"}
              {step === 2 && "Dog's Personality"}
              {step === 3 && "About Your Dog"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Basic information about your furry friend"}
              {step === 2 && "Help us find the perfect playmates"}
              {step === 3 && "Tell us more and add photos"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Dog's Name *</Label>
                  <Input
                    id="name"
                    placeholder="Charlie"
                    value={dogData.name}
                    onChange={(e) => setDogData({ ...dogData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed *</Label>
                  <Input
                    id="breed"
                    placeholder="Golden Retriever"
                    value={dogData.breed}
                    onChange={(e) => setDogData({ ...dogData, breed: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age (years) *</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="3"
                      value={dogData.age}
                      onChange={(e) => setDogData({ ...dogData, age: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="65"
                      value={dogData.weight}
                      onChange={(e) => setDogData({ ...dogData, weight: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sex">Sex *</Label>
                    <Select value={dogData.sex} onValueChange={(value) => setDogData({ ...dogData, sex: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sex" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neutered">Neutered/Spayed *</Label>
                    <Select value={dogData.neutered} onValueChange={(value) => setDogData({ ...dogData, neutered: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-3 p-5 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Sociability with Dogs</Label>
                    <Badge variant="secondary" className="font-bold text-lg px-3 py-1">
                      {dogData.sociability}/5
                    </Badge>
                  </div>
                  <Slider
                    value={[dogData.sociability]}
                    onValueChange={([value]) => setDogData({ ...dogData, sociability: value })}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Not social</span>
                    <span>Very social</span>
                  </div>
                </div>

                <div className="space-y-3 p-5 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Overall Temperament</Label>
                    <Badge variant="secondary" className="font-bold text-lg px-3 py-1">
                      {dogData.temperament}/5
                    </Badge>
                  </div>
                  <Slider
                    value={[dogData.temperament]}
                    onValueChange={([value]) => setDogData({ ...dogData, temperament: value })}
                    min={1}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Energetic</span>
                    <span>Very calm</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="about">About Your Dog</Label>
                  <Textarea
                    id="about"
                    placeholder="Tell us about your dog's personality, favorite activities, and what they're looking for in a playmate..."
                    value={dogData.about}
                    onChange={(e) => setDogData({ ...dogData, about: e.target.value })}
                    rows={5}
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    📸 Photo uploads will be available soon
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div />
              )}

              <Button variant="hero" onClick={handleNext}>
                {step === totalSteps ? 'Complete' : 'Next'}
                {step < totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddDog;
