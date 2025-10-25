import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import pawfectLogo from '@/assets/pawfect-logo.png';

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Dog traits state
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
    bio: '',
    images: [] as string[],
  });

  // User traits state (simplified for now)
  const [userData, setUserData] = useState({
    city: '',
    state: '',
  });

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding
      navigate('/browse');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img src={pawfectLogo} alt="Pawfect" className="h-10 w-auto" />
          </div>
          <div className="text-sm text-muted-foreground">
            Step {step} of {totalSteps}
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-8" />

        {/* Form Card */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Tell us about your dog"}
              {step === 2 && "Dog's personality & health"}
              {step === 3 && "Location & final details"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Basic information about your furry friend"}
              {step === 2 && "Help us find the perfect playmates"}
              {step === 3 && "Where can we find you?"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Dog's Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Charlie"
                    value={dogData.name}
                    onChange={(e) => setDogData({ ...dogData, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed">Breed *</Label>
                  <Input
                    id="breed"
                    placeholder="e.g., Golden Retriever"
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
              </div>
            )}

            {/* Step 2: Personality & Health */}
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

                <div className="space-y-3 p-5 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50 select-none">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Sociability with Dogs</Label>
                    <Badge variant="secondary" className="font-bold text-lg px-3 py-1">
                      {dogData.dogSociability}/5
                    </Badge>
                  </div>
                  <div className="py-2">
                    <Slider
                      value={[dogData.dogSociability]}
                      onValueChange={([value]) => setDogData({ ...dogData, dogSociability: value })}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full cursor-grab active:cursor-grabbing touch-none"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-1">
                    <span>Not social</span>
                    <span>Very social</span>
                  </div>
                  <p className="text-xs text-muted-foreground">How well does your dog play with other dogs?</p>
                </div>

                <div className="space-y-3 p-5 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50 select-none">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Sociability with Humans</Label>
                    <Badge variant="secondary" className="font-bold text-lg px-3 py-1">
                      {dogData.humanSociability}/5
                    </Badge>
                  </div>
                  <div className="py-2">
                    <Slider
                      value={[dogData.humanSociability]}
                      onValueChange={([value]) => setDogData({ ...dogData, humanSociability: value })}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full cursor-grab active:cursor-grabbing touch-none"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-1">
                    <span>Shy</span>
                    <span>Very friendly</span>
                  </div>
                  <p className="text-xs text-muted-foreground">How friendly is your dog with people?</p>
                </div>

                <div className="space-y-3 p-5 rounded-lg bg-muted/30 transition-all duration-200 hover:bg-muted/50 select-none">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Overall Temperament</Label>
                    <Badge variant="secondary" className="font-bold text-lg px-3 py-1">
                      {dogData.temperament}/5
                    </Badge>
                  </div>
                  <div className="py-2">
                    <Slider
                      value={[dogData.temperament]}
                      onValueChange={([value]) => setDogData({ ...dogData, temperament: value })}
                      min={1}
                      max={5}
                      step={1}
                      className="w-full cursor-grab active:cursor-grabbing touch-none"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-1">
                    <span>Energetic</span>
                    <span>Very calm</span>
                  </div>
                  <p className="text-xs text-muted-foreground">How calm and well-behaved is your dog?</p>
                </div>
              </div>
            )}

            {/* Step 3: Location & Bio */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="San Francisco"
                      value={userData.city}
                      onChange={(e) => setUserData({ ...userData, city: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="CA"
                      value={userData.state}
                      onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About Your Dog</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about your dog's personality, favorite activities, and what they're looking for in a playmate..."
                    value={dogData.bio}
                    onChange={(e) => setDogData({ ...dogData, bio: e.target.value })}
                    rows={5}
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    📸 Photo uploads will be available after connecting to Supabase storage
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
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

export default Onboarding;
