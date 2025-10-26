-- Remove the unique constraint that prevents multiple reviews per user per dog
ALTER TABLE reviews DROP CONSTRAINT IF EXISTS unique_reviewer_per_dog;
