/**
 * Compatibility Scoring System for Dog Matching
 * 
 * Implements the backend algorithm for calculating compatibility scores
 * based on vector embeddings, cosine similarity, and sentiment analysis.
 */

import { DogProfile, DogTraits } from '@/types/dog';

// Types for compatibility calculations
export interface DogTraitsVector {
  age: number;
  weight: number;
  sex: number; // 0 for female, 1 for male
  neutered: number; // 0 for no, 1 for yes
  sociability: number; // 1-10 scale
  temperament: number; // 1-10 scale
}

export interface CompatibilityResult {
  dogId: string;
  compatibilityScore: number;
  cosineSimilarity: number;
  sentimentScore: number;
  isCompatible: boolean;
}

export interface ReviewData {
  dogId: string;
  reviews: string[];
  ratingsSum: number;
}

// Mock review data for testing
const mockReviews: ReviewData[] = [
  {
    dogId: '1',
    reviews: [
      "This dog is absolutely amazing! So friendly and well-behaved.",
      "Great companion, very loving and gentle.",
      "Perfect temperament and very smart.",
      "Incredible dog! Highly recommend to anyone!"
    ],
    ratingsSum: 45
  },
  {
    dogId: '2',
    reviews: [
      "Wonderful dog! Perfect temperament and very smart.",
      "Excellent pet, highly recommend!",
      "Very playful and energetic.",
      "Amazing personality and so well-trained!"
    ],
    ratingsSum: 38
  },
  {
    dogId: '3',
    reviews: [
      "Good dog overall, but can be a bit shy.",
      "Nice dog, takes time to warm up.",
      "Decent companion.",
      "Okay dog, nothing too special."
    ],
    ratingsSum: 25
  },
  {
    dogId: '4',
    reviews: [
      "Fantastic dog! So energetic and fun!",
      "Perfect playmate for other dogs.",
      "Amazing temperament and very social.",
      "Best dog ever! So loving and playful!"
    ],
    ratingsSum: 42
  },
  {
    dogId: '5',
    reviews: [
      "Great dog with a wonderful personality.",
      "Very well-behaved and friendly.",
      "Excellent companion for families.",
      "Sweet and gentle dog!"
    ],
    ratingsSum: 35
  },
  {
    dogId: '6',
    reviews: [
      "Nice dog but can be a bit stubborn.",
      "Good overall, needs some training.",
      "Decent dog, average temperament.",
      "Okay pet, nothing extraordinary."
    ],
    ratingsSum: 20
  }
];

/**
 * Convert DogTraits to vector format for compatibility calculations
 */
function convertToVectorTraits(traits: DogTraits): DogTraitsVector {
  return {
    age: traits.age,
    weight: traits.weight,
    sex: traits.sex === 'male' ? 1 : 0,
    neutered: traits.neutered ? 1 : 0,
    sociability: Math.round(traits.dogSociability * 2), // Convert 1-5 to 1-10 scale
    temperament: Math.round(traits.temperament * 2) // Convert 1-5 to 1-10 scale
  };
}

/**
 * Create vector embedding from dog traits
 */
function createVectorEmbedding(traits: DogTraitsVector): number[] {
  // Normalization ranges
  const ranges = {
    age: [0, 20],
    weight: [1, 200],
    sex: [0, 1],
    neutered: [0, 1],
    sociability: [1, 10],
    temperament: [1, 10]
  };

  // Weights for each trait
  const weights = {
    age: 1.0,
    weight: 0.8,
    sex: 0.6,
    neutered: 0.7,
    sociability: 1.2,
    temperament: 1.1
  };

  // Normalize and weight each trait
  const embedding = [
    ((traits.age - ranges.age[0]) / (ranges.age[1] - ranges.age[0])) * weights.age,
    ((traits.weight - ranges.weight[0]) / (ranges.weight[1] - ranges.weight[0])) * weights.weight,
    ((traits.sex - ranges.sex[0]) / (ranges.sex[1] - ranges.sex[0])) * weights.sex,
    ((traits.neutered - ranges.neutered[0]) / (ranges.neutered[1] - ranges.neutered[0])) * weights.neutered,
    ((traits.sociability - ranges.sociability[0]) / (ranges.sociability[1] - ranges.sociability[0])) * weights.sociability,
    ((traits.temperament - ranges.temperament[0]) / (ranges.temperament[1] - ranges.temperament[0])) * weights.temperament
  ];

  // L2 normalization
  const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return norm > 0 ? embedding.map(val => val / norm) : embedding;
}

/**
 * Calculate cosine similarity between two vectors
 */
function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) return 0;
  
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const norm1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const norm2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return Math.max(-1, Math.min(1, dotProduct / (norm1 * norm2)));
}

/**
 * Simple sentiment analysis for review text
 */
function analyzeSentiment(text: string): number {
  const positiveWords = ['amazing', 'wonderful', 'great', 'excellent', 'perfect', 'friendly', 'loving', 'gentle', 'smart', 'playful', 'energetic', 'good', 'nice', 'recommend'];
  const negativeWords = ['terrible', 'bad', 'aggressive', 'mean', 'shy', 'destructive', 'loud', 'untrained'];
  
  const words = text.toLowerCase().split(/\s+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pos => word.includes(pos))) score += 0.1;
    if (negativeWords.some(neg => word.includes(neg))) score -= 0.1;
  });
  
  // Add bonus for exclamation marks and caps
  const exclamationCount = (text.match(/!/g) || []).length;
  const capsRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  
  score += Math.min(exclamationCount * 0.1, 0.3);
  score += capsRatio * 0.2;
  
  return Math.max(-1, Math.min(1, score));
}

/**
 * Calculate average sentiment for a list of reviews
 */
function calculateAverageSentiment(reviews: string[]): number {
  if (reviews.length === 0) return 0;
  
  const sentiments = reviews.map(analyzeSentiment);
  return sentiments.reduce((sum, sentiment) => sum + sentiment, 0) / sentiments.length;
}

/**
 * Calculate compatibility score using the backend formula
 */
function calculateCompatibilityScore(
  cosineSimilarity: number,
  sentimentA: number,
  sentimentB: number,
  ratingsA: number,
  ratingsB: number,
  k: number = 1.0
): number {
  // Use the exact formula from compatibilitywithReviewsandRatings.py
  // score = cosComp * ((writtenA + 0.5 * k) / (writtenA + k)) * ((writtenB + 3 * k) / (writtenB + 5 * k))
  return cosineSimilarity * ((sentimentA + 0.5 * k) / (sentimentA + k)) * ((sentimentB + 3 * k) / (sentimentB + 5 * k));
}

/**
 * Get review data for a dog
 */
function getReviewData(dogId: string): ReviewData {
  const reviewData = mockReviews.find(r => r.dogId === dogId);
  return reviewData || { dogId, reviews: [], ratingsSum: 0 };
}

/**
 * Calculate cosine similarity only (for DogCard display)
 */
export function calculateCosineSimilarityOnly(
  targetDog: DogProfile,
  candidateDog: DogProfile
): number {
  // Convert traits to vector format
  const targetTraits = convertToVectorTraits(targetDog.traits);
  const candidateTraits = convertToVectorTraits(candidateDog.traits);
  
  // Create vector embeddings
  const targetEmbedding = createVectorEmbedding(targetTraits);
  const candidateEmbedding = createVectorEmbedding(candidateTraits);
  
  // Calculate and return only cosine similarity
  return calculateCosineSimilarity(targetEmbedding, candidateEmbedding);
}

/**
 * Calculate compatibility between two dogs
 */
export function calculateDogCompatibility(
  targetDog: DogProfile,
  candidateDog: DogProfile
): CompatibilityResult {
  // Convert traits to vector format
  const targetTraits = convertToVectorTraits(targetDog.traits);
  const candidateTraits = convertToVectorTraits(candidateDog.traits);
  
  // Create vector embeddings
  const targetEmbedding = createVectorEmbedding(targetTraits);
  const candidateEmbedding = createVectorEmbedding(candidateTraits);
  
  // Calculate cosine similarity
  const cosineSimilarity = calculateCosineSimilarity(targetEmbedding, candidateEmbedding);
  
  // Get review data
  const targetReviews = getReviewData(targetDog.id);
  const candidateReviews = getReviewData(candidateDog.id);
  
  // Calculate sentiment scores
  const targetSentiment = calculateAverageSentiment(targetReviews.reviews);
  const candidateSentiment = calculateAverageSentiment(candidateReviews.reviews);
  
  // Calculate overall compatibility score
  const compatibilityScore = calculateCompatibilityScore(
    cosineSimilarity,
    targetSentiment,
    candidateSentiment,
    targetReviews.ratingsSum,
    candidateReviews.ratingsSum
  );
  
  return {
    dogId: candidateDog.id,
    compatibilityScore,
    cosineSimilarity,
    sentimentScore: candidateSentiment,
    isCompatible: compatibilityScore >= 0.85
  };
}

/**
 * Rank dogs by compatibility score for the "For You" section
 */
export function rankDogsByCompatibility(
  targetDog: DogProfile,
  candidateDogs: DogProfile[]
): CompatibilityResult[] {
  const results = candidateDogs.map(candidate => 
    calculateDogCompatibility(targetDog, candidate)
  );
  
  // Sort by compatibility score in descending order
  return results.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}

/**
 * Get the current user's dog (mock implementation)
 * In a real app, this would come from authentication/user context
 */
export function getCurrentUserDog(): DogProfile {
  // Mock user dog - in real app, this would be from user context
  return {
    id: 'user-dog',
    name: 'Buddy',
    images: ['/placeholder.svg'],
    location: {
      city: 'Boston',
      state: 'MA',
      lat: 42.3601,
      lng: -71.0589
    },
    bio: 'Friendly and energetic dog looking for playmates!',
    traits: {
      breed: 'Golden Retriever',
      age: 3,
      weight: 65,
      sex: 'male',
      neutered: true,
      vaccinated: true,
      dogSociability: 4,
      humanSociability: 5,
      temperament: 4
    },
    ownerId: 'user-1'
  };
}
