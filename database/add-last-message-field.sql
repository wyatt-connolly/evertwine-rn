-- Add last_message field to message_rooms table
ALTER TABLE message_rooms 
ADD COLUMN last_message JSONB;

-- Add comment to describe the field
COMMENT ON COLUMN message_rooms.last_message IS 'Last message in the room for quick preview';
