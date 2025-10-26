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
            about
          )
        `);

      if (error) {
        console.error('Error fetching dogs:', error);
        throw error;
      }
      
      console.log('Fetched dogs from database:', data);

      // Transform database data to DogProfile type
      const dogs: DogProfile[] = (data || []).map((dog, index) => ({
        id: dog.id,
        name: dog.name || 'Unknown',
        images: dog.image_url && Array.isArray(dog.image_url) && dog.image_url.length > 0
          ? dog.image_url
          : dog.image_url && typeof dog.image_url === 'string'
          ? [dog.image_url]
          : [mockImages[index % mockImages.length]], // Use uploaded images or cycle through mock images
        location: mockLocations[index % mockLocations.length], // Cycle through mock locations
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
        } : undefined,
      }));

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
            about
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
        location: mockLocations[locationIndex],
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
        } : undefined,
      };

      return dog;
    },
  });
};
