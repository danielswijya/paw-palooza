// Location utilities for better location handling
export interface LocationCoords {
  lat: number;
  lng: number;
}

export interface LocationData {
  city: string;
  state: string;
  lat: number;
  lng: number;
}

// Common Massachusetts locations for fallback
export const MA_LOCATIONS: Record<string, LocationCoords> = {
  'Boston': { lat: 42.3601, lng: -71.0589 },
  'Cambridge': { lat: 42.3736, lng: -71.1097 },
  'Somerville': { lat: 42.3876, lng: -71.0995 },
  'Newton': { lat: 42.3370, lng: -71.2092 },
  'Brookline': { lat: 42.3317, lng: -71.1211 },
  'Arlington': { lat: 42.4162, lng: -71.1564 },
  'Medford': { lat: 42.4184, lng: -71.1061 },
  'Malden': { lat: 42.4251, lng: -71.0662 },
  'Watertown': { lat: 42.3709, lng: -71.1828 },
  'Belmont': { lat: 42.3959, lng: -71.1786 },
};

/**
 * Get coordinates for a city in Massachusetts
 */
export function getLocationCoords(city: string, state: string): LocationCoords | null {
  if (state !== 'MA' && state !== 'Massachusetts') {
    return null;
  }
  
  return MA_LOCATIONS[city] || null;
}

/**
 * Find the nearest known location
 */
export function findNearestLocation(lat: number, lng: number): LocationData | null {
  let nearest: LocationData | null = null;
  let shortestDistance = Infinity;
  
  for (const [city, coords] of Object.entries(MA_LOCATIONS)) {
    const distance = calculateDistance(lat, lng, coords.lat, coords.lng);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearest = {
        city,
        state: 'MA',
        lat: coords.lat,
        lng: coords.lng,
      };
    }
  }
  
  return nearest;
}

/**
 * Simple distance calculation (Haversine formula)
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Validate that coordinates are reasonable for Massachusetts
 */
export function isValidMACoords(lat: number, lng: number): boolean {
  // Massachusetts bounds (approximately)
  const MA_BOUNDS = {
    north: 42.89,
    south: 41.24,
    east: -69.86,
    west: -73.51
  };
  
  return lat >= MA_BOUNDS.south && 
         lat <= MA_BOUNDS.north && 
         lng >= MA_BOUNDS.west && 
         lng <= MA_BOUNDS.east;
}

/**
 * Get user's current location using browser geolocation
 */
export function getCurrentLocation(): Promise<LocationCoords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}
