import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

declare global {
  interface Window {
    google: any;
  }
}

interface LocationAutocompleteProps {
  onLocationSelect: (location: {
    city: string;
    state: string;
    lat: number;
    lng: number;
    fullAddress?: string;
    streetNumber?: string;
    route?: string;
    postalCode?: string;
  }) => void;
  initialValue?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  onLocationSelect,
  initialValue = '',
  label = 'Address',
  placeholder = 'Enter your address',
  required = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(initialValue);
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const initAutocomplete = () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

      console.log('LocationAutocomplete - API Key found:', !!apiKey);
      console.log('LocationAutocomplete - API Key length:', apiKey?.length);

      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.length < 30) {
        console.warn('Google Maps API key not configured properly for LocationAutocomplete');
        return;
      }

      if (window.google && window.google.maps && window.google.maps.places) {
        setupAutocomplete();
        return;
      }

      // Load Google Maps script with Places library
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setupAutocomplete();
      };

      script.onerror = () => {
        console.error('Failed to load Google Maps script');
      };

      document.head.appendChild(script);
    };    const setupAutocomplete = () => {
      if (!inputRef.current || !window.google) return;

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'], // Changed from ['(cities)'] to ['address'] for full addresses
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'formatted_address', 'geometry', 'name']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          console.warn('No location data for this place');
          return;
        }        // Extract city and state from address components
        let city = '';
        let state = '';
        let streetNumber = '';
        let route = '';
        let postalCode = '';

        place.address_components?.forEach((component: any) => {
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            state = component.short_name;
          }
          if (component.types.includes('street_number')) {
            streetNumber = component.long_name;
          }
          if (component.types.includes('route')) {
            route = component.long_name;
          }
          if (component.types.includes('postal_code')) {
            postalCode = component.long_name;
          }
        });

        // If we don't have a city, try to extract it from sublocality or neighborhood
        if (!city) {
          place.address_components?.forEach((component: any) => {
            if (component.types.includes('sublocality_level_1') || 
                component.types.includes('neighborhood')) {
              city = component.long_name;
            }
          });
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        setInputValue(place.formatted_address || '');

        console.log('Address selected:', {
          formatted_address: place.formatted_address,
          city,
          state,
          streetNumber,
          route,
          postalCode,
          lat,
          lng
        });        onLocationSelect({
          city,
          state,
          lat,
          lng,
          fullAddress: place.formatted_address,
          streetNumber,
          route,
          postalCode,
        });
      });

      setIsLoaded(true);
    };

    initAutocomplete();
  }, [onLocationSelect]);

  return (
    <div className="space-y-2">
      <Label htmlFor="location">
        {label} {required && '*'}
      </Label>
      <Input
        ref={inputRef}
        id="location"
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoComplete="off"
      />
      {!isLoaded && (
        <p className="text-xs text-muted-foreground">
          Loading location search...
        </p>
      )}
    </div>
  );
};

export default LocationAutocomplete;
