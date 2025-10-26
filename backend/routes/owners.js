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

// GET /api/owners - Get all owners
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('owners')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/owners/:id - Get owner by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('owners')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Owner not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/owners - Create a new owner
router.post('/', async (req, res) => {
  try {
    const { name, email, age, gender, about, city, state, lat, lng } = req.body;
    const { data, error } = await supabase
      .from('owners')
      .insert([
        { name, email, age, gender, about, city, state, lat, lng }
      ])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/owners/:id - Update owner by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from('owners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Owner not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/owners/:id - Delete owner by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('owners')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    res.json({ message: 'Owner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/owners/:id/dogs - Get all dogs for a specific owner
router.get('/:id/dogs', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('dogs')
      .select('*')
      .eq('owner_id', id);
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
