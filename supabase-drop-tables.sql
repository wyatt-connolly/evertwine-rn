-- Drop all tables in reverse order of dependencies
-- WARNING: This will delete ALL data in these tables!
-- Only run this if you want to start fresh

-- Drop tables with foreign key dependencies first
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS message_rooms CASCADE;
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS meetups CASCADE;
DROP TABLE IF EXISTS happy_hours CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop any existing policies (optional, CASCADE will handle this)
-- But explicit drop can help with debugging

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'All tables dropped successfully. You can now run supabase-schema.sql';
END $$;

