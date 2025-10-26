import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

// Declare global google object
declare global {
  interface Window {
    google: any;
  }
}

interface GoogleMapProps {
  // Make coordinates optional to support address-only schema
  lat?: number;
  lng?: number;
  // New optional address prop (geocoded to center)
  address?: string;
  zoom?: number;
  className?: string;
  dogName?: string;
  radiusMeters?: number; // Radius in meters for privacy circle
  maxZoom?: number; // Maximum zoom level allowed
  // Optional nearby cafes overlay (non-breaking)
  showNearbyCafes?: boolean;
  searchRadiusMeters?: number; // radius for places search
  resultsLimit?: number; // max results to show as markers
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  lat, 
  lng, 
  address,
  zoom = 13, 
  className = "w-full h-[400px] rounded-xl",
  dogName = "Dog",
  radiusMeters = 500, // 500 meter radius for privacy
  maxZoom = 15, // Maximum zoom level
  showNearbyCafes = false,
  searchRadiusMeters = 2000,
  resultsLimit = 7,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    typeof lat === 'number' && typeof lng === 'number' ? { lat, lng } : null
  );
  const [isGeocoding, setIsGeocoding] = useState(false);
  const cafeMarkersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || import.meta.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE' || String(apiKey).includes('kaggle.com')) {
      setError('Google Maps API key not configured. Showing location info instead.');
      return;
    }

    const ensureScript = () => {
      if (window.google && window.google.maps && window.google.maps.places) return Promise.resolve();
      // Avoid duplicate script tags
      const existing = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]') as HTMLScriptElement | null;
      if (existing) {
        return new Promise<void>((resolve) => {
          existing.addEventListener('load', () => resolve(), { once: true });
        });
      }
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
      });
    };

    const geocodeIfNeeded = async () => {
      if (center) return center;
      if (!address) return null;
      if (isGeocoding) return null;
      setIsGeocoding(true);
      try {
        const geocoder = new window.google.maps.Geocoder();
        const result: { lat: number; lng: number } | null = await new Promise((resolve) => {
          geocoder.geocode({ address }, (results: any[], status: string) => {
            if (status === 'OK' && results?.[0]) {
              const loc = results[0].geometry.location;
              resolve({ lat: loc.lat(), lng: loc.lng() });
            } else {
              resolve(null);
            }
          });
        });
        if (result) {
          setCenter(result);
          return result;
        } else {
          setError(`Could not find location for: ${address}`);
          return null;
        }
      } finally {
        setIsGeocoding(false);
      }
    };

    const addNearbyCafes = (map: any, mapCenter: { lat: number; lng: number }) => {
      try {
        const service = new window.google.maps.places.PlacesService(map);
        const request: any = {
          location: mapCenter,
          radius: searchRadiusMeters,
          type: 'cafe',
          keyword: 'dog friendly',
        };
        service.nearbySearch(request, (results: any[], status: string) => {
          if (status !== window.google.maps.places.PlacesServiceStatus.OK || !results) return;
          // Clean old markers
          cafeMarkersRef.current.forEach((m) => m.setMap(null));
          cafeMarkersRef.current = [];

          // Coffee cup icon (SVG -> data URL)
          const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#8B4513">
              <path d="M3 7h11v6a4 4 0 01-4 4H7a4 4 0 01-4-4V7zm13 0h3a3 3 0 110 6h-3v-2h3a1 1 0 100-2h-3V7zM2 18h13v2H2z"/>
            </svg>`;
          const cafeIcon = {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
            scaledSize: new window.google.maps.Size(26, 26),
            anchor: new window.google.maps.Point(13, 13),
          };

          results.slice(0, resultsLimit).forEach((place) => {
            if (!place.geometry?.location) return;
            const marker = new window.google.maps.Marker({
              map,
              position: place.geometry.location,
              title: place.name,
              icon: cafeIcon,
            });
            marker.addListener('click', () => {
              if (!infoWindowRef.current) infoWindowRef.current = new window.google.maps.InfoWindow();
              const rating = place.rating ? `⭐ ${place.rating}` : '';
              const openNow = place.opening_hours?.open_now === true ? 'Open now' : place.opening_hours?.open_now === false ? 'Closed now' : '';
              const addressText = place.vicinity || place.formatted_address || '';
              infoWindowRef.current.setContent(`
                <div style="min-width:200px;">
                  <div style="font-weight:600;">${place.name || 'Cafe'}</div>
                  <div style="font-size:12px;color:#555;">${[rating, openNow].filter(Boolean).join(' · ')}</div>
                  <div style="font-size:12px;color:#555;margin-top:4px;">${addressText}</div>
                </div>
              `);
              infoWindowRef.current.open(map, marker);
            });
            cafeMarkersRef.current.push(marker);
          });
        });
      } catch (e) {
        console.error('Error loading nearby cafes:', e);
      }
    };

    const createMap = (mapCenter: { lat: number; lng: number }) => {
      if (!mapRef.current) return;
      try {
        // Reuse instance if exists, just recenter/zoom
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(mapCenter);
          mapInstanceRef.current.setZoom(Math.min(zoom, maxZoom));
        } else {
          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center: mapCenter,
            zoom: Math.min(zoom, maxZoom),
            maxZoom: maxZoom,
            mapTypeId: 'roadmap',
            styles: [
              { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
              { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
            ],
            streetViewControl: false,
            mapTypeControl: false,
          });
        }

        // Draw privacy circle
        new window.google.maps.Circle({
          strokeColor: '#FF6B6B',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#FF6B6B',
          fillOpacity: 0.15,
          map: mapInstanceRef.current,
          center: mapCenter,
          radius: radiusMeters,
        });

        // Optional nearby cafes overlay
        if (showNearbyCafes) {
          addNearbyCafes(mapInstanceRef.current, mapCenter);
        } else {
          // Clean markers if turning off
          cafeMarkersRef.current.forEach((m) => m.setMap(null));
          cafeMarkersRef.current = [];
        }

        setIsLoaded(true);
      } catch (err) {
        console.error('Error creating map:', err);
        setError('Failed to create map.');
      }
    };

    const run = async () => {
      try {
        await ensureScript();
        // Decide center: prefer lat/lng, else geocode address
        let mapCenter = center;
        if (!mapCenter) {
          mapCenter = await geocodeIfNeeded();
        }
        if (!mapCenter) return;
        createMap(mapCenter);
      } catch (e) {
        console.error('Google Maps initialization failed:', e);
        setError('Failed to load Google Maps.');
      }
    };

    run();

    // Cleanup on unmount
    return () => {
      cafeMarkersRef.current.forEach((m) => m.setMap(null));
      cafeMarkersRef.current = [];
      // keep map instance for perf; it will be GC'd if DOM removed
    };
  // Recompute if inputs change
  }, [lat, lng, address, zoom, dogName, showNearbyCafes, searchRadiusMeters, resultsLimit]);

  if (error) {
    return (
      <div className={`${className} bg-muted rounded-xl flex items-center justify-center`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">{error}</p>
          <p className="text-sm text-muted-foreground">
            📍 {address || (typeof lat === 'number' && typeof lng === 'number' ? `${lat}, ${lng}` : 'Location not available')}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Add your Google Maps API key to see the interactive map
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