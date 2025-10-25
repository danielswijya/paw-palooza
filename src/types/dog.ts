export interface DogTraits {
  breed: string;
  age: number; // actual age in years
  weight: number; // in lbs
  sex: 'male' | 'female';
  neutered: boolean;
  vaccinated: boolean;
  dogSociability: number; // 1-5, stored as 0-1 in DB
  humanSociability: number; // 1-5, stored as 0-1 in DB
  temperament: number; // 1-5, stored as 0-1 in DB
}

export interface DogProfile {
  id: string;
  name: string;
  images: string[];
  location: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
  bio: string;
  traits: DogTraits;
  ownerId: string;
}

export interface UserTraits {
  name: string;
  email: string;
  location: {
    city: string;
    state: string;
    lat: number;
    lng: number;
  };
}
