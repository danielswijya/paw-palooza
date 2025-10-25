"""
Text Embedding Module

Converts text reviews into vector embeddings for sentiment analysis.
"""

import numpy as np
import re
from collections import Counter
import math
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer


class TextEmbedder:
    """Converts text to vector embeddings."""
    
    def __init__(self):
        self.vocabulary = {}
        self.idf_scores = {}
        self.is_fitted = False
        self.vader_analyzer = SentimentIntensityAnalyzer()
    
    def build_vocabulary(self, texts):
        """Build vocabulary from training texts."""
        word_counts = Counter()
        doc_counts = Counter()
        
        for text in texts:
            processed_text = re.sub(r'[^a-zA-Z\s]', '', text.lower())
            words = processed_text.split()
            unique_words = set(words)
            
            for word in words:
                word_counts[word] += 1
            for word in unique_words:
                doc_counts[word] += 1
        
        # Create vocabulary
        filtered_words = [word for word, count in word_counts.items() 
                         if count >= 2 and len(word) > 1]
        filtered_words.sort(key=lambda x: word_counts[x], reverse=True)
        filtered_words = filtered_words[:5000]  # Limit vocab size
        
        self.vocabulary = {word: idx for idx, word in enumerate(filtered_words)}
        
        # Calculate IDF scores
        total_docs = len(texts)
        for word in self.vocabulary:
            doc_freq = doc_counts.get(word, 1)
            self.idf_scores[word] = math.log(total_docs / doc_freq)
        
        self.is_fitted = True
    
    def create_embedding(self, text):
        """Convert text to vector embedding."""
        if not self.is_fitted:
            raise ValueError("Build vocabulary first")
        
        # Preprocess text
        processed_text = re.sub(r'[^a-zA-Z\s]', '', text.lower())
        words = processed_text.split()
        
        # TF-IDF vector
        word_counts = Counter(words)
        total_words = len(words)
        tf_idf_vector = np.zeros(len(self.vocabulary))
        
        for word, count in word_counts.items():
            if word in self.vocabulary:
                word_idx = self.vocabulary[word]
                tf = count / total_words
                idf = self.idf_scores[word]
                tf_idf_vector[word_idx] = tf * idf
        
        # Sentiment features using libraries
        # TextBlob sentiment
        blob = TextBlob(text)
        textblob_polarity = blob.sentiment.polarity  # -1 to 1
        textblob_subjectivity = blob.sentiment.subjectivity  # 0 to 1
        
        # VADER sentiment
        vader_scores = self.vader_analyzer.polarity_scores(text)
        vader_compound = vader_scores['compound']  # -1 to 1
        vader_pos = vader_scores['pos']  # 0 to 1
        vader_neg = vader_scores['neg']  # 0 to 1
        vader_neu = vader_scores['neu']  # 0 to 1
        
        # Additional features
        exclamation_count = text.count('!')
        caps_ratio = sum(1 for c in text if c.isupper()) / len(text) if text else 0
        
        sentiment_features = np.array([
            textblob_polarity, textblob_subjectivity,
            vader_compound, vader_pos, vader_neg, vader_neu,
            exclamation_count, caps_ratio, total_words
        ])
        
        # Normalize TF-IDF vector separately
        tf_idf_norm = np.linalg.norm(tf_idf_vector)
        if tf_idf_norm > 0:
            tf_idf_vector = tf_idf_vector / tf_idf_norm
        
        # Keep sentiment features unnormalized (they're already in proper ranges)
        combined_embedding = np.concatenate([tf_idf_vector, sentiment_features])
        
        return combined_embedding


# Example usage
if __name__ == "__main__":
    # Sample training data
    sample_reviews = [
        "This dog is absolutely amazing! So friendly and well-behaved.",
        "Terrible experience. The dog was aggressive and untrained.",
        "Great dog, very cute and playful. Would definitely recommend!",
        "Not good at all. The dog was loud and destructive."
    ]
    
    embedder = TextEmbedder()
    embedder.build_vocabulary(sample_reviews)
    
    # Test embedding
    test_review = "This is a wonderful dog! So loving and well-behaved."
    embedding = embedder.create_embedding(test_review)
    
    print(f"Review: {test_review}")
    print(f"Embedding shape: {embedding.shape}")
    print(f"Embedding norm: {np.linalg.norm(embedding):.4f}")
