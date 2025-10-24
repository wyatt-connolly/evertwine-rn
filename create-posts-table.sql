-- Create posts and post_comments tables for Supabase
-- Run this in your Supabase SQL editor

-- 1. Create posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    likes TEXT[] DEFAULT '{}',
    is_announcement BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create post_comments table
CREATE TABLE IF NOT EXISTS public.post_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies for posts
-- Allow everyone to read posts
CREATE POLICY "posts_select_policy" ON public.posts
    FOR SELECT USING (true);

-- Allow authenticated users to insert posts
CREATE POLICY "posts_insert_policy" ON public.posts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own posts
CREATE POLICY "posts_update_policy" ON public.posts
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own posts
CREATE POLICY "posts_delete_policy" ON public.posts
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Create RLS policies for post_comments
-- Allow everyone to read comments
CREATE POLICY "post_comments_select_policy" ON public.post_comments
    FOR SELECT USING (true);

-- Allow authenticated users to insert comments
CREATE POLICY "post_comments_insert_policy" ON public.post_comments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments
CREATE POLICY "post_comments_update_policy" ON public.post_comments
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own comments
CREATE POLICY "post_comments_delete_policy" ON public.post_comments
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts(created_at);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON public.post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_created_at ON public.post_comments(created_at);

-- 7. Grant necessary permissions
GRANT ALL ON public.posts TO authenticated;
GRANT ALL ON public.posts TO anon;
GRANT ALL ON public.post_comments TO authenticated;
GRANT ALL ON public.post_comments TO anon;

-- 8. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. Create trigger to automatically update updated_at
CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON public.posts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
