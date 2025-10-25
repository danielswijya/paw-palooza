"""
Compatibility Calculator with Reviews and Ratings

Combines cosine similarity, sentiment analysis, and ratings to calculate
overall compatibility between two dogs.
"""

import numpy as np
from cosine_similarity import DogCompatibilityCalculator
from sentiment_analysis import SentimentAnalyzer


def calculate_pairwise_compatibility_with_reviews(cosComp, writtenA, writtenB, ratingsA, ratingsB, k=1.0):
    """
    Calculate overall compatibility using the specified formula.
    
    Args:
        cosComp: Cosine similarity value from dog traits (0-1)
        writtenA: Sentiment score for dog A reviews (-1 to +1)
        writtenB: Sentiment score for dog B reviews (-1 to +1)
        ratingsA: Sum of ratings for dog A (from database)
        ratingsB: Sum of ratings for dog B (from database)
        k: Smoothing parameter (default: 1.0)
        
    Returns:
        Overall compatibility score
    """
    # Use the exact formula you specified
    score = cosComp * ((writtenA + 0.5 * k) / (writtenA + k)) * ((writtenB + 3 * k) / (writtenB + 5 * k))
    return score


def calculate_compatibility_pipeline(dog_a_traits, dog_b_traits, dog_a_reviews, dog_b_reviews, 
                                   dog_a_ratings_sum, dog_b_ratings_sum, k=1.0):
    """
    Complete pipeline to calculate compatibility from raw data.
    
    Args:
        dog_a_traits: DogTraits object for dog A
        dog_b_traits: DogTraits object for dog B
        dog_a_reviews: List of review texts for dog A
        dog_b_reviews: List of review texts for dog B
        dog_a_ratings_sum: Sum of ratings for dog A
        dog_b_ratings_sum: Sum of ratings for dog B
        k: Smoothing parameter
        
    Returns:
        Dictionary with all scores and final compatibility
    """
    # Calculate cosine similarity
    compatibility_calc = DogCompatibilityCalculator()
    cosine_result = compatibility_calc.calculate_compatibility(dog_a_traits, dog_b_traits)
    cosine_similarity = cosine_result.cosine_similarity
    
    # Calculate sentiment scores
    sentiment_analyzer = SentimentAnalyzer()
    
    # Build vocabulary from all reviews
    all_reviews = dog_a_reviews + dog_b_reviews
    sentiment_analyzer.build_vocabulary(all_reviews)
    
    # Calculate average sentiment for each dog
    sentiment_a_scores = [sentiment_analyzer.analyze_sentiment(review) for review in dog_a_reviews]
    sentiment_b_scores = [sentiment_analyzer.analyze_sentiment(review) for review in dog_b_reviews]
    
    avg_sentiment_a = np.mean(sentiment_a_scores) if sentiment_a_scores else 0.0
    avg_sentiment_b = np.mean(sentiment_b_scores) if sentiment_b_scores else 0.0
    
    # Calculate overall compatibility
    overall_compatibility = calculate_pairwise_compatibility_with_reviews(
        cosine_similarity, avg_sentiment_a, avg_sentiment_b,
        dog_a_ratings_sum, dog_b_ratings_sum, k
    )
    
    return {
        'cosine_similarity': cosine_similarity,
        'sentiment_score_a': avg_sentiment_a,
        'sentiment_score_b': avg_sentiment_b,
        'ratings_component_a': (dog_a_ratings_sum + 2.5 * k) / (dog_a_ratings_sum + 5 * k),
        'ratings_component_b': (dog_b_ratings_sum + 2.5 * k) / (dog_b_ratings_sum + 5 * k),
        'overall_compatibility': overall_compatibility,
        'is_compatible': overall_compatibility >= 0.4  # Adjust threshold as needed
    }


# Example usage
if __name__ == "__main__":
    from vector_embedding import DogTraits
    
    # Example data
    dog_a_traits = DogTraits(age=3, weight=45, sex=1, neutered=1, sociability=8, temperament=7)
    dog_b_traits = DogTraits(age=2, weight=40, sex=0, neutered=1, sociability=9, temperament=8)
    
    dog_a_reviews = [
        "This dog is amazing! So friendly and well-behaved.",
        "Great companion, very loving and gentle."
    ]
    dog_b_reviews = [
        "Wonderful dog! Perfect temperament and very smart.",
        "Excellent pet, highly recommend!"
    ]
    
    dog_a_ratings_sum = 45  # Sum of all ratings for dog A
    dog_b_ratings_sum = 38  # Sum of all ratings for dog B
    
    # Calculate compatibility
    result = calculate_compatibility_pipeline(
        dog_a_traits, dog_b_traits, dog_a_reviews, dog_b_reviews,
        dog_a_ratings_sum, dog_b_ratings_sum
    )
    
    print("Compatibility Analysis:")
    print(f"Cosine Similarity: {result['cosine_similarity']:.3f}")
    print(f"Dog A Sentiment: {result['sentiment_score_a']:.3f}")
    print(f"Dog B Sentiment: {result['sentiment_score_b']:.3f}")
    print(f"Overall Compatibility: {result['overall_compatibility']:.3f}")
    print(f"Are Compatible: {result['is_compatible']}")

