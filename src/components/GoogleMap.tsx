import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

// Declare global google object
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
  dogName?: string;
  radiusMeters?: number; // Radius in meters for privacy circle
  maxZoom?: number; // Maximum zoom level allowed
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  lat, 
  lng, 
  zoom = 13, 
  className = "w-full h-[400px] rounded-xl",
  dogName = "Dog",
  radiusMeters = 500, // 500 meter radius for privacy
  maxZoom = 15 // Maximum zoom level
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const initMap = () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.GOOGLE_MAPS_API_KEY;
      
      console.log('Google Maps API Key found:', !!apiKey);
      console.log('API Key length:', apiKey?.length);
      console.log('API Key starts with AIzaSy:', apiKey?.startsWith('AIzaSy'));
      console.log('Environment variables:', {
        VITE_GOOGLE_MAPS_API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        GOOGLE_MAPS_API_KEY: import.meta.env.GOOGLE_MAPS_API_KEY
      });
      
      if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || apiKey.includes('kaggle.com') || apiKey.length < 30) {
        setError('Google Maps API key not configured properly. Showing location info instead.');
        return;
      }

      // Check if Google Maps is already loaded
      if (window.google && window.google.maps) {
        createMap();
        return;
      }

      // Load Google Maps script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        createMap();
      };
      
      script.onerror = (error) => {
        console.error('Google Maps script loading error:', error);
        setError('Failed to load Google Maps. Please check your API key and console for details.');
      };
      
      document.head.appendChild(script);
    };

    const createMap = () => {
      if (mapRef.current && window.google) {
        try {
          // Create the map with privacy settings
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: Math.min(zoom, maxZoom), // Limit zoom level
            maxZoom: maxZoom, // Set maximum zoom for privacy
            mapTypeId: 'roadmap',
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              },
              {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ],
            // Disable street view for privacy
            streetViewControl: false,
            // Disable satellite view for privacy
            mapTypeControl: false
          });

          // Add a privacy circle instead of exact marker
          const circle = new window.google.maps.Circle({
            strokeColor: '#FF6B6B',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF6B6B',
            fillOpacity: 0.15,
            map: map,
            center: { lat, lng },
            radius: radiusMeters // Privacy radius in meters
          });

          // No exact location marker - only the privacy circle          // Add info window explaining privacy
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 8px; text-align: center;">
                <strong>${dogName} is in this area</strong><br>
                <small style="color: #666;">Approximate location shown within ${Math.round(radiusMeters/1000*10)/10}km radius for privacy</small>
              </div>
            `
          });

          // Show info window on circle click
          circle.addListener('click', () => {
            infoWindow.open(map, circle);
          });

          setIsLoaded(true);
        } catch (err) {
          console.error('Error creating map:', err);
          setError('Failed to create map.');
        }
      }
    };

    initMap();
  }, [lat, lng, zoom, dogName]);

  if (error) {
    return (
      <div className={`${className} bg-muted rounded-xl flex items-center justify-center`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />          <p className="text-muted-foreground mb-2">{error}</p>
          <p className="text-sm text-muted-foreground">
            📍 Approximate location: Cambridge, MA area
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Add your Google Maps API key to see the precise location on an interactive map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className={className}
        style={{ minHeight: '400px' }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
