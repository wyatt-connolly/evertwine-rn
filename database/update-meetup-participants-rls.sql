-- Update RLS policies for meetups table to handle participants properly
-- This ensures users can see meetups they're participating in and their own created meetups

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all meetups" ON meetups;
DROP POLICY IF EXISTS "Users can view their own meetups" ON meetups;
DROP POLICY IF EXISTS "Users can view meetups they participate in" ON meetups;

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

CREATE POLICY "Users can update their own meetups" ON meetups
    FOR UPDATE USING (auth.uid() = creator_id);

CREATE POLICY "Users can delete their own meetups" ON meetups
    FOR DELETE USING (auth.uid() = creator_id);

-- Update RLS policies for happy_hours table
DROP POLICY IF EXISTS "Users can view all events" ON happy_hours;
DROP POLICY IF EXISTS "Users can view events they created" ON happy_hours;
DROP POLICY IF EXISTS "Users can view events they attend" ON happy_hours;

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
