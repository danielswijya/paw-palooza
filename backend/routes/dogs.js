const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// GET /api/dogs - Get all dogs
router.get('/', async (req, res) => {
  try {
    const { owner_id, breed, city } = req.query;
    let query = supabase.from('dogs').select('*');
    
    if (owner_id) query = query.eq('owner_id', owner_id);
    if (breed) query = query.ilike('breed', `%${breed}%`);
    if (city) query = query.ilike('city', `%${city}%`);
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dogs/:id - Get dog by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Dog not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/dogs - Create a new dog
router.post('/', async (req, res) => {
  try {
    const { owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament, city, state, lat, lng } = req.body;
    const { data, error } = await supabase
      .from('dogs')
      .insert([
        { owner_id, name, breed, about, age, weight, sex, neutered, sociability, temperament, city, state, lat, lng }
      ])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/dogs/:id - Update dog by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('dogs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Dog not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/dogs/:id - Delete dog by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('dogs')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ message: 'Dog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/dogs/:id/reviews - Get all reviews for a specific dog
router.get('/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('dog_id', id);
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
