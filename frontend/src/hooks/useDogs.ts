import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DogProfile } from '@/types/dog';
import dog1 from '@/assets/dog-1.jpg';
import dog2 from '@/assets/dog-2.jpg';
import dog3 from '@/assets/dog-3.jpg';

// Mock images for dogs
const mockImages = [dog1, dog2, dog3];

// Mock locations for dogs (Cambridge, MA area)
const mockLocations = [
  { city: 'Cambridge', state: 'MA', lat: 42.3736, lng: -71.1097 }, // Harvard Square
  { city: 'Cambridge', state: 'MA', lat: 42.3656, lng: -71.1044 }, // MIT area
  { city: 'Cambridge', state: 'MA', lat: 42.3756, lng: -71.1189 }, // Porter Square
  { city: 'Cambridge', state: 'MA', lat: 42.3689, lng: -71.1234 }, // Davis Square area
  { city: 'Cambridge', state: 'MA', lat: 42.3800, lng: -71.1000 }, // Central Square
  { city: 'Cambridge', state: 'MA', lat: 42.3700, lng: -71.1100 }, // Kendall Square
];

// Helper function to geocode address using Google Maps API
const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    }
    
    console.warn('Geocoding failed:', data.status);
    return null;
  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
};

// Helper function to parse address string into location object
const parseAddressToLocation = async (address: string, index: number) => {
  let city = 'Unknown';
  let state = 'MA';
  
  // First, try to geocode the address to get coordinates
  const geocoded = await geocodeAddress(address);
  
  if (geocoded) {
    // Use reverse geocoding to get detailed address components
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${geocoded.lat},${geocoded.lng}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const components = data.results[0].address_components;
        
        // Extract city
        const cityComponent = components.find((c: any) => c.types.includes('locality'));
        if (cityComponent) {
          city = cityComponent.long_name;
        }
        
        // Extract state
        const stateComponent = components.find((c: any) => c.types.includes('administrative_area_level_1'));
        if (stateComponent) {
          state = stateComponent.short_name;
        }
      }
    } catch (e) {
      console.error('Error reverse geocoding:', e);
    }
  }
  
  // Fallback: try to parse from the address string if geocoding failed
  if (city === 'Unknown' || !geocoded) {
    const parts = address.split(',').map(p => p.trim());
    
    if (parts.length >= 2) {
      // Second-to-last part is usually the city
      city = parts[parts.length - 2];
      
      // Last part contains state (and possibly ZIP)
      const lastPart = parts[parts.length - 1];
      const stateMatch = lastPart.match(/^([A-Z]{2})/);
      if (stateMatch) {
        state = stateMatch[1];
      }
    } else {
      city = address;
    }
  }
  
  return {
    city,
    state,
    lat: geocoded?.lat || mockLocations[index % mockLocations.length].lat,
    lng: geocoded?.lng || mockLocations[index % mockLocations.length].lng,
  };
};

export const useDogs = () => {
  return useQuery({
    queryKey: ['dogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select(`
          *,
          owners (
            id,
            name,
            email,
            age,
            gender,
            about,
            address
          )
        `);

      if (error) {
        console.error('Error fetching dogs:', error);
        throw error;
      }
      
      console.log('Fetched dogs from database:', data);

      // Transform database data to DogProfile type with geocoding
      const dogs: DogProfile[] = await Promise.all(
        (data || []).map(async (dog, index) => ({
        id: dog.id,
        name: dog.name || 'Unknown',
        images: dog.image_url && Array.isArray(dog.image_url) && dog.image_url.length > 0
          ? dog.image_url
          : dog.image_url && typeof dog.image_url === 'string'
          ? [dog.image_url]
          : [mockImages[index % mockImages.length]], // Use uploaded images or cycle through mock images
        location: dog.owners?.address 
          ? await parseAddressToLocation(dog.owners.address, index)
          : mockLocations[index % mockLocations.length],
        bio: dog.about || '',
        traits: {
          breed: dog.breed || 'Mixed',
          age: dog.age || 0,
          weight: dog.weight || 0,
          sex: dog.sex === 1 ? 'male' : 'female',
          neutered: dog.neutered === 1,
          vaccinated: true, // Default to true since not in DB
          dogSociability: dog.sociability || 3,
          humanSociability: dog.temperament || 3, // Using temperament as human sociability
          temperament: dog.temperament || 3,
        },
        ownerId: dog.owner_id,
        owner: dog.owners ? {
          id: dog.owners.id,
          name: dog.owners.name,
          email: dog.owners.email,
          age: dog.owners.age,
          gender: dog.owners.gender,
          about: dog.owners.about,
          address: dog.owners.address,
        } : undefined,
        }))
      );

      return dogs;
    },
  });
};

export const useDog = (id: string) => {
  return useQuery({
    queryKey: ['dog', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dogs')
        .select(`
          *,
          owners (
            id,
            name,
            email,
            age,
            gender,
            about,
            address
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      console.log('Fetched dog from database:', data);
      console.log('Image URLs from database:', data.image_url);

      // Get a consistent mock image and location based on the dog's ID
      const imageIndex = parseInt(id.replace(/\D/g, '')) % mockImages.length;
      const locationIndex = parseInt(id.replace(/\D/g, '')) % mockLocations.length;

      const dog: DogProfile = {
        id: data.id,
        name: data.name || 'Unknown',
        images: data.image_url && Array.isArray(data.image_url) && data.image_url.length > 0
          ? data.image_url
          : data.image_url && typeof data.image_url === 'string'
          ? [data.image_url]
          : [mockImages[imageIndex]],
        location: data.owners?.address 
          ? await parseAddressToLocation(data.owners.address, locationIndex)
          : mockLocations[locationIndex],
        bio: data.about || '',
        traits: {
          breed: data.breed || 'Mixed',
          age: data.age || 0,
          weight: data.weight || 0,
          sex: data.sex === 1 ? 'male' : 'female',
          neutered: data.neutered === 1,
          vaccinated: true,
          dogSociability: data.sociability || 3,
          humanSociability: data.temperament || 3,
          temperament: data.temperament || 3,
        },
        ownerId: data.owner_id,
        owner: data.owners ? {
          id: data.owners.id,
          name: data.owners.name,
          email: data.owners.email,
          age: data.owners.age,
          gender: data.owners.gender,
          about: data.owners.about,
          address: data.owners.address,
        } : undefined,
      };

      return dog;
    },
  });
};
