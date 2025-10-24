-- Create meetups table for Evertwine app
-- Run this in your Supabase SQL editor

-- 1. Create meetups table
CREATE TABLE IF NOT EXISTS public.meetups (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Basic Info
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    creator_id UUID NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    
    -- Location & Time
    location JSONB NOT NULL, -- {latitude: number, longitude: number}
    location_name TEXT NOT NULL,
    address TEXT NOT NULL,
    time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    timezone TEXT NOT NULL DEFAULT 'UTC',
    
    -- Activity Details
    activity TEXT NOT NULL,
    activity_category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    
    -- Participant Management
    max_participants INTEGER DEFAULT 50,
    current_participants INTEGER DEFAULT 0,
    participants UUID[] DEFAULT '{}',
    waitlist UUID[] DEFAULT '{}',
    declined_users UUID[] DEFAULT '{}',
    
    -- Status & State
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'full', 'completed', 'cancelled')),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_pattern JSONB, -- {frequency: string, daysOfWeek?: number[], endDate?: timestamp}
    
    -- Requirements & Restrictions
    requirements JSONB DEFAULT '{"verificationRequired": false}', -- {minAge?: number, maxAge?: number, genderRestriction?: string, verificationRequired: boolean}
    
    -- Media
    cover_image TEXT,
    images TEXT[] DEFAULT '{}',
    
    -- Analytics
    views INTEGER DEFAULT 0,
    join_requests INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    engagement_score DECIMAL(5,2) DEFAULT 0.00,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.meetups ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
-- Users can view all active meetups
CREATE POLICY "meetups_select_policy" ON public.meetups
    FOR SELECT USING (status = 'active' OR creator_id = auth.uid());

-- Users can create their own meetups
CREATE POLICY "meetups_insert_policy" ON public.meetups
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Users can update their own meetups
CREATE POLICY "meetups_update_policy" ON public.meetups
    FOR UPDATE USING (auth.uid() = creator_id);

-- Users can delete their own meetups
CREATE POLICY "meetups_delete_policy" ON public.meetups
    FOR DELETE USING (auth.uid() = creator_id);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_meetups_creator_id ON public.meetups(creator_id);
CREATE INDEX IF NOT EXISTS idx_meetups_time ON public.meetups(time);
CREATE INDEX IF NOT EXISTS idx_meetups_status ON public.meetups(status);
CREATE INDEX IF NOT EXISTS idx_meetups_activity_category ON public.meetups(activity_category);
CREATE INDEX IF NOT EXISTS idx_meetups_location ON public.meetups USING GIN(location);
CREATE INDEX IF NOT EXISTS idx_meetups_participants ON public.meetups USING GIN(participants);

-- 5. Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_meetups_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_meetups_updated_at
    BEFORE UPDATE ON public.meetups
    FOR EACH ROW
    EXECUTE FUNCTION update_meetups_updated_at();

-- 7. Grant necessary permissions
GRANT ALL ON public.meetups TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
