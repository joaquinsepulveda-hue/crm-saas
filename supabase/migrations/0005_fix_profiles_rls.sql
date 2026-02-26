-- Fix: Add INSERT policy for profiles so the trigger can create new profiles
-- The handle_new_user trigger needs to be able to insert profiles for new users

CREATE POLICY "Allow profile creation on signup" ON profiles
  FOR INSERT WITH CHECK (true);

-- Recreate the trigger function with proper search_path and error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Don't block user creation if profile insert fails
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
