-- Supabase Database Schema for Evertwine (Safe Version)
-- This version uses IF NOT EXISTS to avoid errors on re-run

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  phone_number TEXT,
  display_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  pronouns TEXT NOT NULL,
  bio TEXT NOT NULL,
  about TEXT NOT NULL,
  profile_pictures TEXT[] NOT NULL DEFAULT '{}',
  standout_photo_index INTEGER,
  location JSONB NOT NULL,
  location_name TEXT NOT NULL,
  school TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_company TEXT NOT NULL,
  professional_level TEXT NOT NULL,
  hometown TEXT NOT NULL,
  star_sign TEXT NOT NULL,
  hobbies TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT[] NOT NULL DEFAULT '{}',
  looking_for TEXT[] NOT NULL DEFAULT '{}',
  onboarding_complete BOOLEAN DEFAULT FALSE,
  is_verified TEXT DEFAULT 'pending',
  is_paused BOOLEAN DEFAULT FALSE,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  profile_views INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  views_this_week INTEGER DEFAULT 0,
  average_view_duration NUMERIC DEFAULT 0,
  preferences JSONB,
  created_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(uid) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  likes TEXT[] DEFAULT '{}',
  is_announcement BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post Comments Table
CREATE TABLE IF NOT EXISTS post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(uid) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetups Table
CREATE TABLE IF NOT EXISTS meetups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  creator_id UUID REFERENCES users(uid) ON DELETE CASCADE,
  location JSONB NOT NULL,
  location_name TEXT NOT NULL,
  address TEXT NOT NULL,
  time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  timezone TEXT NOT NULL,
  activity TEXT NOT NULL,
  activity_category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  participants TEXT[] DEFAULT '{}',
  waitlist TEXT[] DEFAULT '{}',
  declined_users TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active',
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern JSONB,
  requirements JSONB,
  cover_image TEXT,
  images TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  join_requests INTEGER DEFAULT 0,
  completion_rate NUMERIC DEFAULT 0,
  engagement_score NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Happy Hours Table
CREATE TABLE IF NOT EXISTS happy_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  organizer_id UUID REFERENCES users(uid),
  venue TEXT NOT NULL,
  venue_type TEXT,
  location JSONB NOT NULL,
  location_name TEXT NOT NULL,
  address TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  timezone TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  price NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  max_attendees INTEGER,
  current_attendees INTEGER DEFAULT 0,
  cover_image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  status TEXT DEFAULT 'published',
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern JSONB,
  features JSONB,
  views INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  attendees TEXT[] DEFAULT '{}',
  waitlist TEXT[] DEFAULT '{}',
  interested_users TEXT[] DEFAULT '{}',
  check_ins INTEGER DEFAULT 0,
  whos_going JSONB[] DEFAULT '{}',
  discount TEXT,
  discount_percentage NUMERIC,
  deal_time_window TEXT,
  special_menu_items JSONB[] DEFAULT '{}',
  deal_highlights TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message Rooms Table
CREATE TABLE IF NOT EXISTS message_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  participants TEXT[] NOT NULL DEFAULT '{}',
  admins TEXT[] NOT NULL DEFAULT '{}',
  name TEXT,
  description TEXT,
  avatar TEXT,
  meetup_ref UUID REFERENCES meetups(id),
  last_message JSONB,
  settings JSONB,
  created_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_room_ref UUID REFERENCES message_rooms(id) ON DELETE CASCADE,
  sender_ref UUID REFERENCES users(uid) ON DELETE CASCADE,
  text TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  media_url TEXT,
  media_thumbnail TEXT,
  media_size INTEGER,
  media_duration INTEGER,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  reply_to UUID REFERENCES messages(id),
  reactions JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  read_by JSONB DEFAULT '{}',
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  created_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receiver_ref UUID REFERENCES users(uid) ON DELETE CASCADE,
  sender_ref UUID REFERENCES users(uid),
  meetup_ref UUID REFERENCES meetups(id),
  post_ref UUID REFERENCES posts(id),
  happy_hour_ref UUID REFERENCES happy_hours(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  notification_type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  action_required BOOLEAN DEFAULT FALSE,
  action_taken BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  scheduled_for TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security (only if not already enabled)
DO $$ 
BEGIN
  ALTER TABLE users ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE meetups ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE happy_hours ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE message_rooms ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

DO $$ 
BEGIN
  ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN OTHERS THEN NULL;
END $$;

-- Create policies for users table (only if they don't exist)
DO $$ 
BEGIN
  CREATE POLICY "Users can view all profiles" ON users FOR SELECT USING (true);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = uid);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = uid);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policies for posts table
DO $$ 
BEGIN
  CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can insert own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (auth.uid() = user_id);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policies for post_comments table
DO $$ 
BEGIN
  CREATE POLICY "Comments are viewable by everyone" ON post_comments FOR SELECT USING (true);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can insert own comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can update own comments" ON post_comments FOR UPDATE USING (auth.uid() = user_id);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can delete own comments" ON post_comments FOR DELETE USING (auth.uid() = user_id);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policies for meetups table
DO $$ 
BEGIN
  CREATE POLICY "Meetups are viewable by everyone" ON meetups FOR SELECT USING (true);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can insert own meetups" ON meetups FOR INSERT WITH CHECK (auth.uid() = creator_id);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can update own meetups" ON meetups FOR UPDATE USING (auth.uid() = creator_id);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can delete own meetups" ON meetups FOR DELETE USING (auth.uid() = creator_id);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policies for happy_hours table
DO $$ 
BEGIN
  CREATE POLICY "Happy hours are viewable by everyone" ON happy_hours FOR SELECT USING (true);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Organizers can insert happy hours" ON happy_hours FOR INSERT WITH CHECK (auth.uid() = organizer_id OR organizer_id IS NULL);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Organizers can update happy hours" ON happy_hours FOR UPDATE USING (auth.uid() = organizer_id OR organizer_id IS NULL);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policies for message_rooms table
DO $$ 
BEGIN
  CREATE POLICY "Users can view their message rooms" ON message_rooms FOR SELECT USING (auth.uid()::text = ANY(participants));
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can insert message rooms they participate in" ON message_rooms FOR INSERT WITH CHECK (auth.uid()::text = ANY(participants));
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Admins can update their message rooms" ON message_rooms FOR UPDATE USING (auth.uid()::text = ANY(admins));
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policies for messages table
DO $$ 
BEGIN
  CREATE POLICY "Users can view messages in their rooms" ON messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM message_rooms 
      WHERE message_rooms.id = messages.message_room_ref 
      AND auth.uid()::text = ANY(message_rooms.participants)
    )
  );
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can insert messages in their rooms" ON messages FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM message_rooms 
      WHERE message_rooms.id = message_room_ref 
      AND auth.uid()::text = ANY(message_rooms.participants)
    ) AND auth.uid() = sender_ref
  );
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

-- Create policies for notifications table
DO $$ 
BEGIN
  CREATE POLICY "Users can view their notifications" ON notifications FOR SELECT USING (auth.uid() = receiver_ref);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ 
BEGIN
  CREATE POLICY "Users can update their notifications" ON notifications FOR UPDATE USING (auth.uid() = receiver_ref);
EXCEPTION 
  WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_meetups_creator_id ON meetups(creator_id);
CREATE INDEX IF NOT EXISTS idx_meetups_time ON meetups(time);
CREATE INDEX IF NOT EXISTS idx_happy_hours_start_time ON happy_hours(start_time);
CREATE INDEX IF NOT EXISTS idx_messages_room_ref ON messages(message_room_ref);
CREATE INDEX IF NOT EXISTS idx_messages_created_time ON messages(created_time);
CREATE INDEX IF NOT EXISTS idx_notifications_receiver ON notifications(receiver_ref);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Schema setup complete! Tables, RLS policies, and indexes are ready.';
END $$;

