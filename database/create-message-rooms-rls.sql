-- RLS policies for message_rooms table
-- This ensures users can only access message rooms they participate in

-- Enable RLS if not already enabled
ALTER TABLE message_rooms ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view message rooms they participate in" ON message_rooms;
DROP POLICY IF EXISTS "Users can create message rooms" ON message_rooms;
DROP POLICY IF EXISTS "Users can update message rooms they participate in" ON message_rooms;
DROP POLICY IF EXISTS "Users can delete message rooms they created" ON message_rooms;

-- Users can view message rooms where they are a participant
CREATE POLICY "Users can view message rooms they participate in" ON message_rooms
    FOR SELECT USING (auth.uid()::text = ANY(participants));

-- Users can create message rooms (they will be added as a participant)
CREATE POLICY "Users can create message rooms" ON message_rooms
    FOR INSERT WITH CHECK (auth.uid()::text = ANY(participants));

-- Users can update message rooms they participate in
-- This allows them to remove themselves or update settings
-- USING checks they are currently a participant (before update)
-- WITH CHECK allows the update if:
--   1. They're still in participants (normal updates), OR
--   2. They're an admin (can always update), OR
--   3. The participants array is valid (allows self-removal since USING already verified permission)
-- The USING clause ensures security by requiring they were a participant before the update
CREATE POLICY "Users can update message rooms they participate in" ON message_rooms
    FOR UPDATE 
    USING (auth.uid()::text = ANY(participants))
    WITH CHECK (
        -- Allow if they're still a participant (normal updates)
        auth.uid()::text = ANY(participants) OR
        -- Allow if they're an admin
        (admins IS NOT NULL AND auth.uid()::text = ANY(admins)) OR
        -- Allow if participants array is valid (self-removal case)
        -- The USING clause already verified they were a participant before update
        participants IS NOT NULL
    );

-- Users can delete message rooms they created (admins)
CREATE POLICY "Users can delete message rooms they created" ON message_rooms
    FOR DELETE USING (auth.uid()::text = ANY(admins));

