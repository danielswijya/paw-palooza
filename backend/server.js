const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Import routes
const ownersRoutes = require('./routes/owners');
const dogsRoutes = require('./routes/dogs');
const reviewsRoutes = require('./routes/reviews');
const breedsRoutes = require('./routes/breeds');
const sentimentRoutes = require('./routes/sentiment');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/owners', ownersRoutes);
app.use('/api/dogs', dogsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/breeds', breedsRoutes);
app.use('/api/sentiment', sentimentRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Paw Palooza API is running' });
});

// Custom endpoint: Get dogs with owner information
app.get('/api/dogs-with-owner', async (req, res) => {
  try {
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      'https://bdzdrpigbtqrfnwdeibf.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkemRycGlnYnRxcmZud2RlaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDI0NDksImV4cCI6MjA3Njk3ODQ0OX0.PuOjYconkFQ3UWT-UZX1sUliG5EKPwjsjF5nnR2m-BA',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { data, error } = await supabase
      .from('dogs')
      .select(`
        *,
        owners (
          id,
          name,
          email,
          city,
          state,
          lat,
          lng
        )
      `);
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server (only in local/dev). In Vercel, export the app as a serverless function.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`   GET    /health - Health check`);
    console.log(`   GET    /api/owners - Get all owners`);
    console.log(`   GET    /api/dogs - Get all dogs`);
    console.log(`   GET    /api/reviews - Get all reviews`);
    console.log(`   GET    /api/breeds - Get all breeds`);
  });
}

module.exports = app;
