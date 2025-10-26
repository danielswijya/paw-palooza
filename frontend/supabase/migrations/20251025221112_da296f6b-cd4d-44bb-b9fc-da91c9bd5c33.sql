-- Link owners table to auth.users
ALTER TABLE public.owners ADD COLUMN IF NOT EXISTS user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add location fields to owners table
ALTER TABLE public.owners ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.owners ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.owners ADD COLUMN IF NOT EXISTS lat numeric;
ALTER TABLE public.owners ADD COLUMN IF NOT EXISTS lng numeric;

-- Update dogs table to reference owners properly
ALTER TABLE public.dogs DROP CONSTRAINT IF EXISTS dogs_owner_id_fkey;
ALTER TABLE public.dogs ADD CONSTRAINT dogs_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.owners(id) ON DELETE CASCADE;

-- Add location fields to dogs table
ALTER TABLE public.dogs ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE public.dogs ADD COLUMN IF NOT EXISTS state text;
ALTER TABLE public.dogs ADD COLUMN IF NOT EXISTS lat numeric;
ALTER TABLE public.dogs ADD COLUMN IF NOT EXISTS lng numeric;

-- Create trigger to auto-create owner profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.owners (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Update RLS policies for owners table
DROP POLICY IF EXISTS "Users can view their own owner profile" ON public.owners;
CREATE POLICY "Users can view their own owner profile"
  ON public.owners
  FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own owner profile" ON public.owners;
CREATE POLICY "Users can insert their own owner profile"
  ON public.owners
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own owner profile" ON public.owners;
CREATE POLICY "Users can update their own owner profile"
  ON public.owners
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Update RLS policies for dogs table
DROP POLICY IF EXISTS "Owners can insert their own dogs" ON public.dogs;
CREATE POLICY "Owners can insert their own dogs"
  ON public.dogs
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.owners
      WHERE owners.id = dogs.owner_id
      AND owners.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can update their own dogs" ON public.dogs;
CREATE POLICY "Owners can update their own dogs"
  ON public.dogs
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.owners
      WHERE owners.id = dogs.owner_id
      AND owners.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Owners can delete their own dogs" ON public.dogs;
CREATE POLICY "Owners can delete their own dogs"
  ON public.dogs
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.owners
      WHERE owners.id = dogs.owner_id
      AND owners.user_id = auth.uid()
    )
  );