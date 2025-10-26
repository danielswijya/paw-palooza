// JavaScript sentiment analysis fallback for Vercel deployment
// This replaces the Python sentiment analysis when deployed

const Sentiment = require('sentiment');
const sentiment = new Sentiment();

function analyzeSentimentJS(reviews) {
  if (!reviews || reviews.length === 0) {
    return { averageSentiment: 0 };
  }

  const scores = reviews.map(review => {
    const result = sentiment.analyze(review);
    // Normalize score to -1 to 1 range
    return Math.max(-1, Math.min(1, result.score / 10));
  });

  const averageSentiment = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  return { averageSentiment };
}

module.exports = { analyzeSentimentJS };
