-- Fix: Allow users to always read their own profile regardless of organization_id being null.
-- The existing policy "organization_id = get_my_org_id()" fails when both are NULL
-- because NULL = NULL is UNKNOWN (not TRUE) in SQL.
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (id = auth.uid());
