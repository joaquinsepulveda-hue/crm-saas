-- Fix: organizations table has no INSERT policy.
-- Any authenticated user needs to be able to create an org during onboarding.
CREATE POLICY "Authenticated users can create org" ON organizations
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
