-- Additional schema corrections applied on top of base migrations
-- These are safe no-ops if columns already exist

ALTER TABLE organizations
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS industry TEXT;
