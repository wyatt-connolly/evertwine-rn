-- Create push_notification_tokens table for Supabase
-- Run this in your Supabase SQL editor

-- 1. Create push_notification_tokens table
CREATE TABLE IF NOT EXISTS public.push_notification_tokens (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    expo_push_token TEXT NOT NULL,
    device_info JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_push_tokens_user_id ON public.push_notification_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_expo_token ON public.push_notification_tokens(expo_push_token);
CREATE INDEX IF NOT EXISTS idx_push_tokens_is_active ON public.push_notification_tokens(is_active);

-- 3. Create unique constraint to prevent duplicate tokens per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_push_tokens_user_expo_unique 
ON public.push_notification_tokens(user_id, expo_push_token) 
WHERE is_active = TRUE;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.push_notification_tokens ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
-- Users can only see their own push tokens
CREATE POLICY "Users can view their own push tokens" ON public.push_notification_tokens
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own push tokens
CREATE POLICY "Users can create their own push tokens" ON public.push_notification_tokens
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own push tokens
CREATE POLICY "Users can update their own push tokens" ON public.push_notification_tokens
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own push tokens
CREATE POLICY "Users can delete their own push tokens" ON public.push_notification_tokens
    FOR DELETE USING (auth.uid() = user_id);

-- 6. Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_push_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for auto-updating updated_at
CREATE TRIGGER trigger_update_push_tokens_updated_at
    BEFORE UPDATE ON public.push_notification_tokens
    FOR EACH ROW
    EXECUTE FUNCTION update_push_tokens_updated_at();

-- 8. Grant necessary permissions
GRANT ALL ON public.push_notification_tokens TO authenticated;
GRANT ALL ON public.push_notification_tokens TO service_role;
