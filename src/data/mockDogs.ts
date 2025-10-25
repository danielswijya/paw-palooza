import { DogProfile } from '@/types/dog';
import dog1 from '@/assets/dog-1.jpg';
import dog2 from '@/assets/dog-2.jpg';
import dog3 from '@/assets/dog-3.jpg';

// User's current location (Boston, MA)
export const userLocation = {
  city: 'Boston',
  state: 'MA',
  lat: 42.3601,
  lng: -71.0589,
};

export const mockDogs: DogProfile[] = [
  {
    id: '1',
    name: 'Charlie',
    images: [dog1],
    location: {
      city: 'Cambridge',
      state: 'MA',
      lat: 42.3736,
      lng: -71.1097,
    },
    bio: 'Friendly golden retriever who loves playing fetch and making new friends! Always up for park adventures.',
    traits: {
      breed: 'Golden Retriever',
      age: 3,
      weight: 70,
      sex: 'male',
      neutered: true,
      vaccinated: true,
      dogSociability: 5,
      humanSociability: 5,
      temperament: 5,
    },
    ownerId: 'owner1',
  },
  {
    id: '2',
    name: 'Luna',
    images: [dog2],
    location: {
      city: 'Boston',
      state: 'MA',
      lat: 42.3505,
      lng: -71.0756,
    },
    bio: 'Energetic and playful Lab who enjoys long walks and swimming. Looking for active playmates!',
    traits: {
      breed: 'Labrador Retriever',
      age: 2,
      weight: 65,
      sex: 'female',
      neutered: true,
      vaccinated: true,
      dogSociability: 4,
      humanSociability: 5,
      temperament: 4,
    },
    ownerId: 'owner2',
  },
  {
    id: '3',
    name: 'Cooper',
    images: [dog3],
    location: {
      city: 'Somerville',
      state: 'MA',
      lat: 42.3876,
      lng: -71.0995,
    },
    bio: 'Sweet and gentle Corgi with a big personality! Loves treats and cuddling after playtime.',
    traits: {
      breed: 'Corgi',
      age: 4,
      weight: 28,
      sex: 'male',
      neutered: true,
      vaccinated: true,
      dogSociability: 4,
      humanSociability: 5,
      temperament: 5,
    },
    ownerId: 'owner3',
  },
];
