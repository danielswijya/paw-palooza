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
import ImageUpload from '@/components/ImageUpload';

const DogOnboarding = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useOwnerProfile();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const stepLabels = ['Basic Info', 'Personality & Health'];

  const [dogData, setDogData] = useState({
    name: '',
    breed: '',
    age: '',
    weight: '',
    sex: '',
    neutered: '',
    vaccinated: '',
    dogSociability: 3,
    humanSociability: 3,
    temperament: 3,
    about: '',
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!profileLoading && profile && !profile.address) {
      navigate('/owner-onboarding');
    }
  }, [profile, profileLoading, navigate]);

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

    // Validate required fields
    if (!dogData.name || !dogData.breed || !dogData.age || !dogData.weight || !dogData.sex || !dogData.neutered || !dogData.vaccinated) {
      toast({
        title: 'Validation Error',
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
        sociability: dogData.dogSociability,
        temperament: dogData.temperament,
        about: dogData.about,
        image_url: images.length > 0 ? images[0] : null, // Save the first image URL
      });

      if (error) throw error;

      toast({
        title: 'Success! 🎉',
        description: 'Dog profile created successfully!',
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
          <img src={pawfectLogo} alt="Pawfect" className="h-10 w-auto" />
        </div>

        <Stepper steps={stepLabels} currentStep={step} className="mb-8" />

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Tell us about your dog"}
              {step === 2 && "Dog's personality & health"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Basic information about your furry friend"}
              {step === 2 && "Help us find the perfect playmates"}
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
                  <Label>Upload Images (up to 5)</Label>
                  <ImageUpload 
                    images={images} 
                    onImagesChange={setImages}
                    maxImages={5}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="vaccinated">Vaccinated *</Label>
                    <Select value={dogData.vaccinated} onValueChange={(value) => setDogData({ ...dogData, vaccinated: value })}>
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

                <div className="space-y-3 p-5 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Sociability with Dogs</Label>
                    <Badge variant="secondary" className="font-bold text-lg px-3 py-1">
                      {dogData.dogSociability}/5
                    </Badge>
                  </div>
                  <Slider
                    value={[dogData.dogSociability]}
                    onValueChange={([value]) => setDogData({ ...dogData, dogSociability: value })}
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

export default DogOnboarding;
