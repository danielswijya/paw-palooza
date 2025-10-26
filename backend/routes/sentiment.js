const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const { analyzeSentimentJS } = require('../lib/sentiment');

// POST /api/sentiment - Analyze sentiment of review texts
router.post('/', async (req, res) => {
  try {
    const { reviews } = req.body;
    
    if (!reviews || !Array.isArray(reviews)) {
      return res.status(400).json({ error: 'Reviews array is required' });
    }

    // Create a temporary Python script to run sentiment analysis
    const pythonScript = `
import sys
import json
from sentiment_analysis import SentimentAnalyzer

def analyze_reviews(reviews):
    analyzer = SentimentAnalyzer()
    analyzer.build_vocabulary(reviews)
    
    results = []
    for review in reviews:
        score = analyzer.analyze_sentiment(review)
        results.append(score)
    
    return results

if __name__ == "__main__":
    reviews = json.loads(sys.argv[1])
    results = analyze_reviews(reviews)
    print(json.dumps(results))
`;

    // Write temporary script
    const fs = require('fs');
    const tempScriptPath = path.join(__dirname, '../temp_sentiment.py');
    fs.writeFileSync(tempScriptPath, pythonScript);

    // Run Python script
    const pythonProcess = spawn('python3', [tempScriptPath, JSON.stringify(reviews)]);
    
    let output = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // Clean up temporary file
      try {
        fs.unlinkSync(tempScriptPath);
      } catch (cleanupError) {
        console.warn('Failed to clean up temporary file:', cleanupError);
      }

      if (code !== 0) {
        console.warn('Python script failed, falling back to JavaScript sentiment analysis');
        // Fallback to JavaScript sentiment analysis
        const jsResult = analyzeSentimentJS(reviews);
        return res.json(jsResult);
      }

      try {
        const sentimentScores = JSON.parse(output.trim());
        const averageSentiment = sentimentScores.reduce((sum, score) => sum + score, 0) / sentimentScores.length;
        
        res.json({
          scores: sentimentScores,
          averageSentiment: averageSentiment,
          count: sentimentScores.length
        });
      } catch (parseError) {
        console.error('Failed to parse Python output, falling back to JavaScript:', parseError);
        const jsResult = analyzeSentimentJS(reviews);
        res.json(jsResult);
      }
    });

  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
