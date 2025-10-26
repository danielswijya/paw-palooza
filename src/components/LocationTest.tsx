import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoogleMap from '@/components/GoogleMap';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import { calculateDistance, formatDistance } from '@/lib/distance';
import { userLocation } from '@/data/mockDogs';

interface LocationData {
  name?: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

const LocationTest: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');

  useEffect(() => {
    // Check if Google Maps API key is configured
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    console.log('Testing Google Maps API Key:', {
      exists: !!apiKey,
      length: apiKey?.length,
      startsCorrectly: apiKey?.startsWith('AIzaSy'),
      value: apiKey // Remove this in production for security
    });

    if (apiKey && apiKey.length >= 30 && apiKey.startsWith('AIzaSy')) {
      setApiKeyStatus('valid');
    } else {
      setApiKeyStatus('invalid');
    }
  }, []);

  const testLocations = [
    { name: 'Boston (Downtown)', ...userLocation },
    { name: 'Cambridge (Harvard)', city: 'Cambridge', state: 'MA', lat: 42.3736, lng: -71.1097 },
    { name: 'Somerville (Davis Sq)', city: 'Somerville', state: 'MA', lat: 42.3876, lng: -71.0995 },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🗺️ Location & Google Maps API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* API Key Status */}
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold mb-2">Google Maps API Status</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                apiKeyStatus === 'valid' ? 'bg-green-500' : 
                apiKeyStatus === 'invalid' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span>
                {apiKeyStatus === 'valid' && 'API Key is configured and valid'}
                {apiKeyStatus === 'invalid' && 'API Key is missing or invalid'}
                {apiKeyStatus === 'checking' && 'Checking API Key...'}
              </span>
            </div>
          </div>

          {/* Test Locations */}
          <div>
            <h3 className="font-semibold mb-2">Test Locations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {testLocations.map((location, index) => (
                <Button
                  key={index}
                  variant={selectedLocation?.lat === location.lat ? 'default' : 'outline'}
                  onClick={() => setSelectedLocation(location)}
                  className="text-left justify-start"
                >
                  <div>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs opacity-75">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>          {/* Location Autocomplete Test */}
          <div>
            <h3 className="font-semibold mb-2">Address Autocomplete Test</h3>
            <LocationAutocomplete
              label="Search for an address"
              placeholder="Try typing '123 Main St, Cambridge, MA' or any full address"
              onLocationSelect={(location) => {
                console.log('Address selected:', location);
                setSelectedLocation({
                  name: location.fullAddress || `${location.city}, ${location.state}`,
                  city: location.city,
                  state: location.state,
                  lat: location.lat,
                  lng: location.lng,
                });
              }}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Now searches by full address instead of just cities for more precise locations
            </p>
          </div>

          {/* Distance Calculation Test */}
          {selectedLocation && (
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Distance Calculation</h3>              <p className="text-sm">
                Distance from Boston to {selectedLocation.name || `${selectedLocation.city}, ${selectedLocation.state}`}: {' '}
                <span className="font-medium">
                  {formatDistance(calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    selectedLocation.lat,
                    selectedLocation.lng
                  ))}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Google Map Test */}
      {selectedLocation && (
        <Card>
          <CardHeader>
            <CardTitle>Google Map Test - {selectedLocation.name || `${selectedLocation.city}, ${selectedLocation.state}`}</CardTitle>
          </CardHeader>
          <CardContent>
            <GoogleMap
              lat={selectedLocation.lat}
              lng={selectedLocation.lng}
              zoom={14}
              dogName={selectedLocation.name || `${selectedLocation.city}, ${selectedLocation.state}`}
              className="w-full h-[400px] rounded-lg"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationTest;
