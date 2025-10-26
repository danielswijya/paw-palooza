import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stepper } from '@/components/ui/stepper';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOwnerProfile } from '@/hooks/useOwnerProfile';
import { useToast } from '@/hooks/use-toast';
import pawfectLogo from '@/assets/pawfect-logo.png';
import LocationAutocomplete from '@/components/LocationAutocomplete';

const OwnerOnboarding = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useOwnerProfile();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const totalSteps = 2;
  const stepLabels = ['Basic Info', 'Location'];

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    about: '',
    address: '',
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (profile && profile.address) {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        age: profile.age?.toString() || '',
        gender: profile.gender || '',
        about: profile.about || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Validate required fields
      if (!formData.name || !formData.address) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields (Name, Address)',
          variant: 'destructive',
        });
        return;
      }

      // Complete onboarding
      const { error } = await updateProfile({
        name: formData.name,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        about: formData.about,
        address: formData.address,
      });

      if (error) {
        toast({
          title: 'Error',
          description: 'Failed to update profile',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: 'Profile completed!',
        });
        navigate('/dashboard');
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
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

        <Stepper steps={stepLabels} currentStep={step} className="mb-8" />

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "Tell us about yourself"}
              {step === 2 && "Where are you located?"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Basic information to help others know you"}
              {step === 2 && "Help us find dogs nearby"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about">About You</Label>
                  <Textarea
                    id="about"
                    placeholder="Tell us about yourself, your experience with dogs, and what you're looking for..."
                    value={formData.about}
                    onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                    rows={5}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <LocationAutocomplete
                  value={formData.address}
                  onChange={(location) => {
                    setFormData({
                      ...formData,
                      address: location.address,
                    });
                  }}
                  label="Your Location *"
                  placeholder="Enter your full address or just city name..."
                />

                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-foreground">
                    📍 Enter any address - from a specific street address like "175 Freeman St, Boston" to just a city name like "Boston". We'll extract the city and state automatically.
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

export default OwnerOnboarding;
