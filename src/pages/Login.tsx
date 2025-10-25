import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import heroImage from '@/assets/hero-dogs.jpg';

const Login = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    // Placeholder for Google OAuth
    // Will be connected to Supabase later
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="space-y-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-8">
            <Heart className="h-10 w-10 text-primary fill-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-[hsl(340_82%_62%)] bg-clip-text text-transparent">
              Pawfect
            </h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Find the perfect playmate for your pup
            </h2>
            <p className="text-xl text-muted-foreground">
              Connect with local dogs and plan fun playdates. Because every dog deserves a best friend!
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-2xl hidden md:block">
            <img 
              src={heroImage} 
              alt="Happy dogs playing together" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-2">
          <CardHeader className="space-y-4">
            <CardTitle className="text-3xl text-center">Welcome Back!</CardTitle>
            <CardDescription className="text-center text-base">
              Sign in to start connecting with dog lovers in your area
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full font-semibold"
              onClick={handleGoogleLogin}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Coming soon</span>
              </div>
            </div>

            <div className="space-y-3 opacity-50">
              <Button variant="outline" size="lg" className="w-full" disabled>
                Continue with Email
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
