-- Fixed database setup for blocking and reporting functionality
-- Run this in your Supabase SQL editor

-- 1. Create blocked_users table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.blocked_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    blocked_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, blocked_user_id)
);

-- 2. Create conversation_reports table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.conversation_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reporter_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reported_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES public.message_rooms(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    conversation_content JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES public.users(id),
    resolution_notes TEXT
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_reports ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own blocks" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can block others" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can unblock others" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can view their own reports" ON public.conversation_reports;
DROP POLICY IF EXISTS "Users can create reports" ON public.conversation_reports;

-- 5. Create simplified RLS policies for blocked_users
CREATE POLICY "blocked_users_select_policy" ON public.blocked_users
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "blocked_users_insert_policy" ON public.blocked_users
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "blocked_users_delete_policy" ON public.blocked_users
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Create simplified RLS policies for conversation_reports
CREATE POLICY "conversation_reports_select_policy" ON public.conversation_reports
    FOR SELECT USING (auth.uid() = reporter_id);

CREATE POLICY "conversation_reports_insert_policy" ON public.conversation_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- 7. Create indexes for better performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_blocked_users_user_id ON public.blocked_users(user_id);
CREATE INDEX IF NOT EXISTS idx_blocked_users_blocked_user_id ON public.blocked_users(blocked_user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_reports_reporter_id ON public.conversation_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_conversation_reports_reported_user_id ON public.conversation_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_reports_status ON public.conversation_reports(status);

-- 8. Grant necessary permissions
GRANT ALL ON public.blocked_users TO authenticated;
GRANT ALL ON public.conversation_reports TO authenticated;
