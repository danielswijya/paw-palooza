"""
Sentiment Analysis Module

Analyzes sentiment of reviews using vector embeddings.
Returns sentiment score from -1 (negative) to +1 (positive).
"""

import numpy as np
from text_embedding import TextEmbedder


class SentimentAnalyzer:
    """Analyzes sentiment from text embeddings."""
    
    def __init__(self):
        self.embedder = TextEmbedder()
    
    def build_vocabulary(self, texts):
        """Build vocabulary from training texts."""
        self.embedder.build_vocabulary(texts)
    
    def analyze_sentiment(self, text):
        """
        Analyze sentiment of text.
        
        Args:
            text: Review text
            
        Returns:
            sentiment_score: Float from -1 (negative) to +1 (positive)
        """
        # Create embedding
        embedding = self.embedder.create_embedding(text)
        
        # Extract sentiment features (last 9 elements)
        sentiment_features = embedding[-9:]
        
        # textblob_polarity, textblob_subjectivity, vader_compound, vader_pos, 
        # vader_neg, vader_neu, exclamation_count, caps_ratio, total_words
        textblob_polarity = sentiment_features[0]
        vader_compound = sentiment_features[2]
        vader_pos = sentiment_features[3]
        vader_neg = sentiment_features[4]
        exclamation_count = sentiment_features[6]
        caps_ratio = sentiment_features[7]
        
        # Combine TextBlob and VADER scores (weighted average)
        combined_sentiment = (textblob_polarity * 0.4 + vader_compound * 0.6)
        
        # Adjust sentiment based on punctuation and caps
        punctuation_bonus = min(exclamation_count * 0.1, 0.3)
        caps_bonus = caps_ratio * 0.2
        
        # Calculate final sentiment score
        sentiment_score = combined_sentiment + punctuation_bonus + caps_bonus
        
        # Clamp to [-1, 1]
        return np.clip(sentiment_score, -1.0, 1.0)


# Example usage
if __name__ == "__main__":
    # Sample training data
    sample_reviews = [
        "This dog is absolutely amazing! So friendly and well-behaved.",
        "Terrible experience. The dog was aggressive and untrained.",
        "Great dog, very cute and playful. Would definitely recommend!",
        "Not good at all. The dog was loud and destructive."
    ]
    
    analyzer = SentimentAnalyzer()
    analyzer.build_vocabulary(sample_reviews)
    
    # Test sentiment analysis
    test_reviews = [
        "This is a wonderful dog! So loving and well-behaved.",
        "Terrible dog. Very aggressive and mean.",
        "Okay dog, nothing special."
    ]
    
    for review in test_reviews:
        score = analyzer.analyze_sentiment(review)
        print(f"Review: {review}")
        print(f"Sentiment Score: {score:.3f}")
        print()
