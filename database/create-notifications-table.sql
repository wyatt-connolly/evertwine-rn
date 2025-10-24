-- Create notifications table for Supabase
-- Run this in your Supabase SQL editor

-- 1. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    receiver_ref UUID NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    sender_ref UUID REFERENCES public.users(uid) ON DELETE CASCADE,
    meetup_ref UUID REFERENCES public.meetups(id) ON DELETE CASCADE,
    post_ref UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    comment_ref UUID REFERENCES public.post_comments(id) ON DELETE CASCADE,
    happy_hour_ref UUID REFERENCES public.happy_hours(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL CHECK (notification_type IN (
        'profile_view', 'profile_like', 'profile_view_return',
        'meetup_request', 'meetup_accepted', 'meetup_declined', 'meetup_reminder', 'meetup_starting_soon', 'meetup_cancelled',
        'new_follower', 'mutual_connection', 'friend_suggestion', 'friend_request',
        'meetup_liked', 'meetup_shared', 'meetup_commented',
        'post_liked', 'post_commented', 'post_shared', 'comment_reply', 'comment_liked',
        'message',
        'verification_complete', 'new_feature',
        'happy_hour_starting_soon', 'happy_hour_invite'
    )),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    action_required BOOLEAN DEFAULT FALSE,
    action_taken BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    scheduled_for TIMESTAMP WITH TIME ZONE
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_receiver_ref ON public.notifications(receiver_ref);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_notifications_sender_ref ON public.notifications(sender_ref);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = receiver_ref);

-- Users can insert notifications (for system notifications)
CREATE POLICY "Users can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (auth.uid() = receiver_ref);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = receiver_ref);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications" ON public.notifications
    FOR DELETE USING (auth.uid() = receiver_ref);

-- 5. Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for auto-updating updated_at
CREATE TRIGGER trigger_update_notifications_updated_at
    BEFORE UPDATE ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- 7. Grant necessary permissions
GRANT ALL ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
