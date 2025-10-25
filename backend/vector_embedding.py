"""
Vector Embedding Module for Dog Compatibility System

This module handles the conversion of dog traits into vector embeddings
for compatibility calculations in the dog dating app.
"""

import numpy as np
from typing import List, Dict, Any, Optional
from dataclasses import dataclass


@dataclass
class DogTraits:
    """Data class to represent dog traits for vector embedding."""
    age: int
    weight: int
    sex: int  # 0 for female, 1 for male
    neutered: int  # 0 for no, 1 for yes
    sociability: int  # Scale 1-10
    temperament: int  # Scale 1-10


class DogVectorEmbedder:
    """
    Converts dog traits into normalized vector embeddings for compatibility calculations.
    """
    
    def __init__(self):
        """Initialize the vector embedder with normalization parameters."""
        # Define normalization ranges for each trait
        self.trait_ranges = {
            'age': (0, 20),  # Assuming max age of 20 years
            'weight': (1, 200),  # Assuming weight range 1-200 lbs
            'sex': (0, 1),  # Binary: 0 or 1
            'neutered': (0, 1),  # Binary: 0 or 1
            'sociability': (1, 10),  # Scale 1-10
            'temperament': (1, 10)  # Scale 1-10
        }
        
        # Define weights for each trait (can be adjusted based on importance)
        self.trait_weights = {
            'age': 1.0,
            'weight': 0.8,
            'sex': 0.6,
            'neutered': 0.7,
            'sociability': 1.2,
            'temperament': 1.1
        }
    
    def normalize_trait(self, trait_name: str, value: int) -> float:
        """
        Normalize a trait value to a 0-1 range.
        
        Args:
            trait_name: Name of the trait
            value: Raw trait value
            
        Returns:
            Normalized value between 0 and 1
        """
        min_val, max_val = self.trait_ranges[trait_name]
        return (value - min_val) / (max_val - min_val)
    
    def create_embedding(self, dog_traits: DogTraits) -> np.ndarray:
        """
        Create a vector embedding from dog traits.
        
        Args:
            dog_traits: DogTraits object containing all trait values
            
        Returns:
            Normalized vector embedding as numpy array
        """
        # Convert traits to dictionary for easier processing
        traits_dict = {
            'age': dog_traits.age,
            'weight': dog_traits.weight,
            'sex': dog_traits.sex,
            'neutered': dog_traits.neutered,
            'sociability': dog_traits.sociability,
            'temperament': dog_traits.temperament
        }
        
        # Normalize and weight each trait
        embedding = []
        for trait_name, value in traits_dict.items():
            normalized_value = self.normalize_trait(trait_name, value)
            weighted_value = normalized_value * self.trait_weights[trait_name]
            embedding.append(weighted_value)
        
        # Convert to numpy array and normalize the entire vector
        embedding_vector = np.array(embedding)
        
        # L2 normalization to ensure unit vector
        norm = np.linalg.norm(embedding_vector)
        if norm > 0:
            embedding_vector = embedding_vector / norm
        
        return embedding_vector
    
    def create_embedding_from_dict(self, traits_dict: Dict[str, int]) -> np.ndarray:
        """
        Create a vector embedding from a dictionary of traits.
        
        Args:
            traits_dict: Dictionary with trait names as keys and values as integers
            
        Returns:
            Normalized vector embedding as numpy array
        """
        dog_traits = DogTraits(
            age=traits_dict.get('age', 0),
            weight=traits_dict.get('weight', 0),
            sex=traits_dict.get('sex', 0),
            neutered=traits_dict.get('neutered', 0),
            sociability=traits_dict.get('sociability', 1),
            temperament=traits_dict.get('temperament', 1)
        )
        
        return self.create_embedding(dog_traits)
    
    def update_trait_weights(self, new_weights: Dict[str, float]) -> None:
        """
        Update the weights for trait importance.
        
        Args:
            new_weights: Dictionary with trait names and their new weights
        """
        self.trait_weights.update(new_weights)
    
    def get_embedding_dimension(self) -> int:
        """
        Get the dimension of the embedding vector.
        
        Returns:
            Number of dimensions in the embedding
        """
        return len(self.trait_weights)


# Example usage and testing
if __name__ == "__main__":
    # Create embedder instance
    embedder = DogVectorEmbedder()
    
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
    
    # Create embeddings
    embedding1 = embedder.create_embedding(dog1_traits)
    embedding2 = embedder.create_embedding(dog2_traits)
    
    print(f"Dog 1 embedding: {embedding1}")
    print(f"Dog 2 embedding: {embedding2}")
    print(f"Embedding dimension: {embedder.get_embedding_dimension()}")
