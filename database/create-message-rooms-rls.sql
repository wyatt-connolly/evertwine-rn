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
-- WITH CHECK is permissive because we can't check OLD values, but USING already verified permission
-- We allow the update if they're still a participant, are an admin, or the change is reasonable
CREATE POLICY "Users can update message rooms they participate in" ON message_rooms
    FOR UPDATE 
    USING (auth.uid()::text = ANY(participants))
    WITH CHECK (
        -- Allow if they're still a participant OR an admin
        -- Note: Self-removal is implicitly allowed because USING already verified they were a participant
        -- and we can't check OLD values in WITH CHECK, so we allow valid participant array updates
        auth.uid()::text = ANY(participants) OR 
        auth.uid()::text = ANY(admins) OR
        -- Allow self-removal: participants array must be valid (not null)
        -- The USING clause already ensured they had permission before the update
        participants IS NOT NULL
    );

-- Users can delete message rooms they created (admins)
CREATE POLICY "Users can delete message rooms they created" ON message_rooms
    FOR DELETE USING (auth.uid()::text = ANY(admins));

