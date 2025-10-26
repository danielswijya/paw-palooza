-- Change image_url column from text to text array
ALTER TABLE dogs ALTER COLUMN image_url TYPE text[] USING 
  CASE 
    WHEN image_url IS NULL THEN NULL
    WHEN image_url = '' THEN NULL
    ELSE ARRAY[image_url]
  END;
