const express = require('express');
const router = express.Router();
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
    const { data, error } = await supabase
      .from('reviews')
      .insert([
        { rating, dog_id, owner_id, description }
      ])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
