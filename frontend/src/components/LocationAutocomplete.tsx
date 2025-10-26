import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LocationAutocompleteProps {
  value: string;
  onChange: (location: { address: string }) => void;
  label?: string;
  placeholder?: string;
}

const LocationAutocomplete = ({
  value,
  onChange,
  label = "Location",
  placeholder = "Enter any address like '175 Freeman St, Boston' or 'Boston'..."
}: LocationAutocompleteProps) => {
  const [inputValue, setInputValue] = useState(value);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);

      script.onload = () => {
        initAutocomplete();
      };
    } else {
      initAutocomplete();
    }

    return () => {
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []);

  const initAutocomplete = () => {
    if (inputRef.current && window.google) {
      const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: 'us' },
        fields: ['address_components', 'geometry', 'formatted_address'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        if (place.address_components) {
          const fullAddress = place.formatted_address || '';
          const displayValue = fullAddress;

          onChange({
            address: fullAddress,
          });

          setInputValue(displayValue);
        }
      });

      autocompleteRef.current = autocomplete;
    }
  };

  return (
    <div className="space-y-2 relative">
      <Label>{label}</Label>
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  );
};

export default LocationAutocomplete;
