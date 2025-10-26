"""
Cosine Similarity Module for Dog Compatibility System

This module calculates the cosine similarity between two dog vector embeddings
to determine compatibility in the dog dating app.
"""

import numpy as np
from typing import Tuple, List, Dict, Any, Optional
from dataclasses import dataclass
from vector_embedding import DogVectorEmbedder, DogTraits


@dataclass
class CompatibilityResult:
    """Data class to represent compatibility calculation results."""
    dog1_id: str
    dog2_id: str
    cosine_similarity: float
    is_compatible: bool
    compatibility_threshold: float = 0.85


class DogCompatibilityCalculator:
    """
    Calculates compatibility between dogs using cosine similarity of their vector embeddings.
    """
    
    def __init__(self, compatibility_threshold: float = 0.85):
        """
        Initialize the compatibility calculator.
        
        Args:
            compatibility_threshold: Minimum cosine similarity for compatibility (default: 0.85)
        """
        self.compatibility_threshold = compatibility_threshold
        self.embedder = DogVectorEmbedder()
    
    def calculate_cosine_similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Calculate cosine similarity between two vector embeddings.
        
        Args:
            embedding1: First dog's vector embedding
            embedding2: Second dog's vector embedding
            
        Returns:
            Cosine similarity value between -1 and 1
        """
        # Ensure vectors are normalized (should already be from embedder)
        norm1 = np.linalg.norm(embedding1)
        norm2 = np.linalg.norm(embedding2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        # Calculate cosine similarity
        dot_product = np.dot(embedding1, embedding2)
        cosine_sim = dot_product / (norm1 * norm2)
        
        # Clamp to [-1, 1] to handle floating point precision issues
        return np.clip(cosine_sim, -1.0, 1.0)
    
    def calculate_compatibility(self, dog1_traits: DogTraits, dog2_traits: DogTraits, 
                              dog1_id: str = "dog1", dog2_id: str = "dog2") -> CompatibilityResult:
        """
        Calculate compatibility between two dogs based on their traits.
        
        Args:
            dog1_traits: First dog's traits
            dog2_traits: Second dog's traits
            dog1_id: First dog's identifier
            dog2_id: Second dog's identifier
            
        Returns:
            CompatibilityResult with similarity score and compatibility status
        """
        # Create vector embeddings
        embedding1 = self.embedder.create_embedding(dog1_traits)
        embedding2 = self.embedder.create_embedding(dog2_traits)
        
        # Calculate cosine similarity
        cosine_sim = self.calculate_cosine_similarity(embedding1, embedding2)
        
        # Determine compatibility
        is_compatible = cosine_sim >= self.compatibility_threshold
        
        return CompatibilityResult(
            dog1_id=dog1_id,
            dog2_id=dog2_id,
            cosine_similarity=cosine_sim,
            is_compatible=is_compatible,
            compatibility_threshold=self.compatibility_threshold
        )
    
    def calculate_compatibility_from_dicts(self, dog1_traits: Dict[str, int], 
                                         dog2_traits: Dict[str, int],
                                         dog1_id: str = "dog1", dog2_id: str = "dog2") -> CompatibilityResult:
        """
        Calculate compatibility between two dogs from trait dictionaries.
        
        Args:
            dog1_traits: First dog's traits as dictionary
            dog2_traits: Second dog's traits as dictionary
            dog1_id: First dog's identifier
            dog2_id: Second dog's identifier
            
        Returns:
            CompatibilityResult with similarity score and compatibility status
        """
        # Create DogTraits objects
        dog1 = DogTraits(
            age=dog1_traits.get('age', 0),
            weight=dog1_traits.get('weight', 0),
            sex=dog1_traits.get('sex', 0),
            neutered=dog1_traits.get('neutered', 0),
            sociability=dog1_traits.get('sociability', 1),
            temperament=dog1_traits.get('temperament', 1)
        )
        
        dog2 = DogTraits(
            age=dog2_traits.get('age', 0),
            weight=dog2_traits.get('weight', 0),
            sex=dog2_traits.get('sex', 0),
            neutered=dog2_traits.get('neutered', 0),
            sociability=dog2_traits.get('sociability', 1),
            temperament=dog2_traits.get('temperament', 1)
        )
        
        return self.calculate_compatibility(dog1, dog2, dog1_id, dog2_id)
    
    def calculate_compatibility_from_embeddings(self, embedding1: np.ndarray, 
                                              embedding2: np.ndarray,
                                              dog1_id: str = "dog1", dog2_id: str = "dog2") -> CompatibilityResult:
        """
        Calculate compatibility directly from vector embeddings.
        
        Args:
            embedding1: First dog's vector embedding
            embedding2: Second dog's vector embedding
            dog1_id: First dog's identifier
            dog2_id: Second dog's identifier
            
        Returns:
            CompatibilityResult with similarity score and compatibility status
        """
        cosine_sim = self.calculate_cosine_similarity(embedding1, embedding2)
        is_compatible = cosine_sim >= self.compatibility_threshold
        
        return CompatibilityResult(
            dog1_id=dog1_id,
            dog2_id=dog2_id,
            cosine_similarity=cosine_sim,
            is_compatible=is_compatible,
            compatibility_threshold=self.compatibility_threshold
        )
    
    def find_compatible_dogs(self, target_dog_traits: DogTraits, 
                           candidate_dogs: List[Tuple[str, DogTraits]]) -> List[CompatibilityResult]:
        """
        Find all compatible dogs from a list of candidates.
        
        Args:
            target_dog_traits: Traits of the target dog
            candidate_dogs: List of (dog_id, traits) tuples
            
        Returns:
            List of CompatibilityResult objects for compatible dogs
        """
        compatible_dogs = []
        
        for dog_id, dog_traits in candidate_dogs:
            result = self.calculate_compatibility(target_dog_traits, dog_traits, "target", dog_id)
            if result.is_compatible:
                compatible_dogs.append(result)
        
        # Sort by cosine similarity (highest first)
        compatible_dogs.sort(key=lambda x: x.cosine_similarity, reverse=True)
        
        return compatible_dogs
    
    def update_compatibility_threshold(self, new_threshold: float) -> None:
        """
        Update the compatibility threshold.
        
        Args:
            new_threshold: New minimum cosine similarity for compatibility
        """
        self.compatibility_threshold = new_threshold
    
    def get_compatibility_threshold(self) -> float:
        """
        Get the current compatibility threshold.
        
        Returns:
            Current compatibility threshold
        """
        return self.compatibility_threshold


# Example usage and testing
if __name__ == "__main__":
    # Create compatibility calculator
    calculator = DogCompatibilityCalculator(compatibility_threshold=0.85)
    
    # Example dog traits
    dog1_traits = DogTraits(
        age=3,
        weight=45,
        sex=1,  # male
        neutered=1,  # yes
        sociability=8,
        temperament=7
    )
    
    dog2_traits = DogTraits(
        age=2,
        weight=40,
        sex=0,  # female
        neutered=1,  # yes
        sociability=9,
        temperament=8
    )
    
    dog3_traits = DogTraits(
        age=5,
        weight=60,
        sex=1,  # male
        neutered=0,  # no
        sociability=4,
        temperament=3
    )
    
    # Calculate compatibility
    result = calculator.calculate_compatibility(dog1_traits, dog2_traits, "dog1", "dog2")
    
    print(f"Compatibility between dog1 and dog2:")
    print(f"  Cosine Similarity: {result.cosine_similarity:.4f}")
    print(f"  Is Compatible: {result.is_compatible}")
    print(f"  Threshold: {result.compatibility_threshold}")
    
    # Test with multiple candidates
    candidates = [
        ("dog2", dog2_traits),
        ("dog3", dog3_traits)
    ]
    
    compatible_dogs = calculator.find_compatible_dogs(dog1_traits, candidates)
    print(f"\nCompatible dogs for dog1: {len(compatible_dogs)}")
    for result in compatible_dogs:
        print(f"  {result.dog2_id}: {result.cosine_similarity:.4f}")
