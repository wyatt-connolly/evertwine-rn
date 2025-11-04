-- Update RLS policies for meetups table to handle participants properly
-- This ensures users can see meetups they're participating in and their own created meetups

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all meetups" ON meetups;
DROP POLICY IF EXISTS "Users can view their own meetups" ON meetups;
DROP POLICY IF EXISTS "Users can view meetups they participate in" ON meetups;
DROP POLICY IF EXISTS "Users can update their own meetups" ON meetups;
DROP POLICY IF EXISTS "Users can update meetups they participate in" ON meetups;
DROP POLICY IF EXISTS "Users can view all public meetups" ON meetups;
DROP POLICY IF EXISTS "Users can view meetups they created" ON meetups;
DROP POLICY IF EXISTS "Users can create meetups" ON meetups;
DROP POLICY IF EXISTS "Users can delete their own meetups" ON meetups;

-- Create comprehensive RLS policies for meetups
CREATE POLICY "Users can view all public meetups" ON meetups
    FOR SELECT USING (
        status = 'published' 
        AND time > NOW() 
        AND (max_participants IS NULL OR current_participants < max_participants)
    );

CREATE POLICY "Users can view meetups they created" ON meetups
    FOR SELECT USING (auth.uid() = creator_id);

CREATE POLICY "Users can view meetups they participate in" ON meetups
    FOR SELECT USING (auth.uid()::text = ANY(participants));

CREATE POLICY "Users can create meetups" ON meetups
    FOR INSERT WITH CHECK (auth.uid() = creator_id);

-- Allow creators to update their own meetups
CREATE POLICY "Users can update their own meetups" ON meetups
    FOR UPDATE USING (auth.uid() = creator_id);

-- Allow participants to update meetups to add/remove themselves from participants
-- This policy allows users who are in the participants array to update the meetup
-- USING checks if they can perform the update (they must currently be a participant)
-- WITH CHECK allows them to update the participants array (including removing themselves)
-- Note: We can't check OLD values in WITH CHECK, so we allow the update if:
-- 1. They're still a participant (normal updates), OR
-- 2. They're the creator (can update freely), OR
-- 3. The participants array is valid (allows self-removal since USING already verified permission)
CREATE POLICY "Users can update meetups they participate in" ON meetups
    FOR UPDATE 
    USING (auth.uid()::text = ANY(participants))
    WITH CHECK (
        -- Allow if they're still a participant OR if they're the creator
        -- OR allow if participants array is valid (self-removal case)
        -- The USING clause already ensured they had permission before the update
        auth.uid()::text = ANY(participants) OR 
        auth.uid() = creator_id OR
        -- Allow self-removal: participants array must be valid (not null)
        -- This allows users to remove themselves since USING already verified they were a participant
        participants IS NOT NULL
    );

CREATE POLICY "Users can delete their own meetups" ON meetups
    FOR DELETE USING (auth.uid() = creator_id);

-- Update RLS policies for happy_hours table
DROP POLICY IF EXISTS "Users can view all events" ON happy_hours;
DROP POLICY IF EXISTS "Users can view events they created" ON happy_hours;
DROP POLICY IF EXISTS "Users can view events they attend" ON happy_hours;
DROP POLICY IF EXISTS "Users can view all public events" ON happy_hours;
DROP POLICY IF EXISTS "Users can create events" ON happy_hours;
DROP POLICY IF EXISTS "Users can update their own events" ON happy_hours;
DROP POLICY IF EXISTS "Users can delete their own events" ON happy_hours;

CREATE POLICY "Users can view all public events" ON happy_hours
    FOR SELECT USING (
        status = 'published' 
        AND start_time > NOW()
    );

CREATE POLICY "Users can view events they created" ON happy_hours
    FOR SELECT USING (auth.uid() = organizer_id);

CREATE POLICY "Users can view events they attend" ON happy_hours
    FOR SELECT USING (auth.uid()::text = ANY(attendees));

CREATE POLICY "Users can create events" ON happy_hours
    FOR INSERT WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Users can update their own events" ON happy_hours
    FOR UPDATE USING (auth.uid() = organizer_id);

CREATE POLICY "Users can delete their own events" ON happy_hours
    FOR DELETE USING (auth.uid() = organizer_id);
