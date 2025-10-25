"""
Test script for the dog compatibility system with fake data.
"""

from vector_embedding import DogTraits, DogVectorEmbedder
from cosine_similarity import DogCompatibilityCalculator
from sentiment_analysis import SentimentAnalyzer
from compatibilitywithReviewsandRatings import calculate_pairwise_compatibility_with_reviews, calculate_compatibility_pipeline


def create_fake_data():
    """Create fake data for testing."""
    
    # Fake dog traits
    dog_a_traits = DogTraits(
        age=3,
        weight=45,
        sex=1,  # male
        neutered=1,  # yes
        sociability=8,
        temperament=7
    )
    
    dog_b_traits = DogTraits(
        age=2,
        weight=40,
        sex=0,  # female
        neutered=1,  # yes
        sociability=9,
        temperament=8
    )
    
    dog_c_traits = DogTraits(
        age=5,
        weight=60,
        sex=1,  # male
        neutered=0,  # no
        sociability=4,
        temperament=3
    )
    
    # Fake reviews
    dog_a_reviews = [
        "This dog is absolutely amazing! So friendly and well-behaved.",
        "Great companion, very loving and gentle.",
        "Perfect dog for families. Very calm and obedient.",
        "Wonderful pet! Highly recommend to anyone."
    ]
    
    dog_b_reviews = [
        "Beautiful dog with excellent temperament.",
        "Very smart and well-trained. Love this dog!",
        "Amazing personality, so sweet and caring.",
        "Best dog ever! So playful and energetic."
    ]
    
    dog_c_reviews = [
        "This dog is okay, nothing special.",
        "Had some issues with training. Not very obedient.",
        "Aggressive at times, needs more training.",
        "Not the best choice for families with kids."
    ]
    
    # Fake ratings (sum of all ratings for each dog)
    dog_a_ratings_sum = 45  # High ratings
    dog_b_ratings_sum = 38  # High ratings
    dog_c_ratings_sum = 12  # Low ratings
    
    return {
        'dogs': {
            'A': {'traits': dog_a_traits, 'reviews': dog_a_reviews, 'ratings_sum': dog_a_ratings_sum},
            'B': {'traits': dog_b_traits, 'reviews': dog_b_reviews, 'ratings_sum': dog_b_ratings_sum},
            'C': {'traits': dog_c_traits, 'reviews': dog_c_reviews, 'ratings_sum': dog_c_ratings_sum}
        }
    }


def test_individual_components():
    """Test each component individually."""
    print("=== Testing Individual Components ===\n")
    
    data = create_fake_data()
    
    # Test vector embedding
    print("1. Testing Vector Embedding:")
    embedder = DogVectorEmbedder()
    dog_a_embedding = embedder.create_embedding(data['dogs']['A']['traits'])
    dog_b_embedding = embedder.create_embedding(data['dogs']['B']['traits'])
    print(f"   Dog A embedding shape: {dog_a_embedding.shape}")
    print(f"   Dog B embedding shape: {dog_b_embedding.shape}")
    print(f"   Dog A embedding norm: {dog_a_embedding.dot(dog_a_embedding):.4f}")
    print()
    
    # Test cosine similarity
    print("2. Testing Cosine Similarity:")
    calculator = DogCompatibilityCalculator()
    result = calculator.calculate_compatibility(
        data['dogs']['A']['traits'], 
        data['dogs']['B']['traits'], 
        "Dog A", "Dog B"
    )
    print(f"   Cosine similarity: {result.cosine_similarity:.4f}")
    print(f"   Are compatible: {result.is_compatible}")
    print()
    
    # Test sentiment analysis
    print("3. Testing Sentiment Analysis:")
    sentiment_analyzer = SentimentAnalyzer()
    
    # Build vocabulary from all reviews
    all_reviews = []
    for dog_data in data['dogs'].values():
        all_reviews.extend(dog_data['reviews'])
    sentiment_analyzer.build_vocabulary(all_reviews)
    
    for dog_name, dog_data in data['dogs'].items():
        sentiment_scores = [sentiment_analyzer.analyze_sentiment(review) for review in dog_data['reviews']]
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores)
        print(f"   Dog {dog_name} average sentiment: {avg_sentiment:.4f}")
        print(f"   Sample review: '{dog_data['reviews'][0]}'")
        print(f"   Sentiment: {sentiment_scores[0]:.4f}")
    print()


def test_compatibility_formula():
    """Test the compatibility formula with fake data."""
    print("=== Testing Compatibility Formula ===\n")
    
    data = create_fake_data()
    
    # Test different combinations
    test_cases = [
        ("Dog A vs Dog B", "A", "B"),
        ("Dog A vs Dog C", "A", "C"),
        ("Dog B vs Dog C", "B", "C")
    ]
    
    for test_name, dog1_name, dog2_name in test_cases:
        print(f"Testing {test_name}:")
        
        # Get cosine similarity
        calculator = DogCompatibilityCalculator()
        cosine_result = calculator.calculate_compatibility(
            data['dogs'][dog1_name]['traits'],
            data['dogs'][dog2_name]['traits']
        )
        cosine_sim = cosine_result.cosine_similarity
        
        # Get sentiment scores
        sentiment_analyzer = SentimentAnalyzer()
        all_reviews = []
        for dog_data in data['dogs'].values():
            all_reviews.extend(dog_data['reviews'])
        sentiment_analyzer.build_vocabulary(all_reviews)
        
        sentiment1_scores = [sentiment_analyzer.analyze_sentiment(review) 
                           for review in data['dogs'][dog1_name]['reviews']]
        sentiment2_scores = [sentiment_analyzer.analyze_sentiment(review) 
                           for review in data['dogs'][dog2_name]['reviews']]
        
        avg_sentiment1 = sum(sentiment1_scores) / len(sentiment1_scores)
        avg_sentiment2 = sum(sentiment2_scores) / len(sentiment2_scores)
        
        # Calculate compatibility using the formula
        compatibility_score = calculate_pairwise_compatibility_with_reviews(
            cosine_sim,
            avg_sentiment1,
            avg_sentiment2,
            data['dogs'][dog1_name]['ratings_sum'],
            data['dogs'][dog2_name]['ratings_sum'],
            k=1.0
        )
        
        print(f"   Cosine similarity: {cosine_sim:.4f}")
        print(f"   {dog1_name} sentiment: {avg_sentiment1:.4f}")
        print(f"   {dog2_name} sentiment: {avg_sentiment2:.4f}")
        print(f"   {dog1_name} ratings sum: {data['dogs'][dog1_name]['ratings_sum']}")
        print(f"   {dog2_name} ratings sum: {data['dogs'][dog2_name]['ratings_sum']}")
        print(f"   Final compatibility: {compatibility_score:.4f}")
        print()


def test_complete_pipeline():
    """Test the complete pipeline."""
    print("=== Testing Complete Pipeline ===\n")
    
    data = create_fake_data()
    
    # Test Dog A vs Dog B (should be highly compatible)
    print("Testing Dog A vs Dog B (expected: high compatibility):")
    result = calculate_compatibility_pipeline(
        data['dogs']['A']['traits'],
        data['dogs']['B']['traits'],
        data['dogs']['A']['reviews'],
        data['dogs']['B']['reviews'],
        data['dogs']['A']['ratings_sum'],
        data['dogs']['B']['ratings_sum']
    )
    
    print(f"   Cosine similarity: {result['cosine_similarity']:.4f}")
    print(f"   Dog A sentiment: {result['sentiment_score_a']:.4f}")
    print(f"   Dog B sentiment: {result['sentiment_score_b']:.4f}")
    print(f"   Overall compatibility: {result['overall_compatibility']:.4f}")
    print(f"   Are compatible: {result['is_compatible']}")
    print()
    
    # Test Dog A vs Dog C (should be lower compatibility)
    print("Testing Dog A vs Dog C (expected: lower compatibility):")
    result = calculate_compatibility_pipeline(
        data['dogs']['A']['traits'],
        data['dogs']['C']['traits'],
        data['dogs']['A']['reviews'],
        data['dogs']['C']['reviews'],
        data['dogs']['A']['ratings_sum'],
        data['dogs']['C']['ratings_sum']
    )
    
    print(f"   Cosine similarity: {result['cosine_similarity']:.4f}")
    print(f"   Dog A sentiment: {result['sentiment_score_a']:.4f}")
    print(f"   Dog C sentiment: {result['sentiment_score_b']:.4f}")
    print(f"   Overall compatibility: {result['overall_compatibility']:.4f}")
    print(f"   Are compatible: {result['is_compatible']}")
    print()


if __name__ == "__main__":
    print("🐕 Dog Compatibility System Test 🐕\n")
    
    try:
        test_individual_components()
        test_compatibility_formula()
        test_complete_pipeline()
        
        print("✅ All tests completed successfully!")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()
