const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://bdzdrpigbtqrfnwdeibf.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkemRycGlnYnRxcmZud2RlaWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDI0NDksImV4cCI6MjA3Njk3ODQ0OX0.PuOjYconkFQ3UWT-UZX1sUliG5EKPwjsjF5nnR2m-BA',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// GET /api/reviews - Get all reviews
router.get('/', async (req, res) => {
  try {
    const { dog_id, owner_id } = req.query;
    let query = supabase.from('reviews').select('*');
    
    if (dog_id) query = query.eq('dog_id', dog_id);
    if (owner_id) query = query.eq('owner_id', owner_id);
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reviews/:id - Get review by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Review not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews - Create a new review
router.post('/', async (req, res) => {
  try {
    const { rating, dog_id, owner_id, description } = req.body;
    
    // Validate required fields
    if (!rating || !dog_id || !owner_id) {
      return res.status(400).json({ error: 'Missing required fields: rating, dog_id, owner_id' });
    }
    
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        { rating, dog_id, owner_id, description }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Review insert error:', error);
      // Check if it's a unique constraint violation
      if (error.message && error.message.includes('unique_reviewer_per_dog')) {
        return res.status(409).json({ error: 'You have already reviewed this dog. You can only review once.' });
      }
      throw error;
    }
    res.status(201).json(data);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: error.message || 'Failed to create review' });
  }
});

// PUT /api/reviews/:id - Update review by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Review not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reviews/:id - Delete review by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
