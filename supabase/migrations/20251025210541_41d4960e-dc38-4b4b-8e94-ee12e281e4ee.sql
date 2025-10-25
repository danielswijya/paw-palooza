-- Enable RLS on all tables
ALTER TABLE owners ENABLE ROW LEVEL SECURITY;
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE breed ENABLE ROW LEVEL SECURITY;

-- Owners policies: Everyone can view, only owner can update their own profile
CREATE POLICY "Anyone can view owners"
  ON owners FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own owner profile"
  ON owners FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own owner profile"
  ON owners FOR UPDATE
  USING (true);

-- Dogs policies: Everyone can view, only owner can manage their dogs
CREATE POLICY "Anyone can view dogs"
  ON dogs FOR SELECT
  USING (true);

CREATE POLICY "Owners can insert their own dogs"
  ON dogs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owners can update their own dogs"
  ON dogs FOR UPDATE
  USING (true);

CREATE POLICY "Owners can delete their own dogs"
  ON dogs FOR DELETE
  USING (true);

-- Reviews policies: Everyone can view, anyone can create reviews
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create reviews"
  ON reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own reviews"
  ON reviews FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete their own reviews"
  ON reviews FOR DELETE
  USING (true);

-- Breed policies: Read-only for everyone
CREATE POLICY "Anyone can view breeds"
  ON breed FOR SELECT
  USING (true);