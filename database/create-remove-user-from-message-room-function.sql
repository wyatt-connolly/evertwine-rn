-- Database function to remove a user from a message room
-- Uses SECURITY DEFINER to bypass RLS for this specific operation
-- This allows users to remove themselves from message rooms even though
-- they won't be in the participants array after the update

CREATE OR REPLACE FUNCTION remove_user_from_message_room(
  room_id UUID,
  user_id_to_remove TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  current_participants TEXT[];
  updated_participants TEXT[];
  user_is_participant BOOLEAN;
  current_user_id TEXT;
BEGIN
  -- Get the current authenticated user ID
  current_user_id := auth.uid()::TEXT;
  
  -- Security check: Users can only remove themselves
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'User must be authenticated';
  END IF;
  
  IF current_user_id != user_id_to_remove THEN
    RAISE EXCEPTION 'Users can only remove themselves from message rooms';
  END IF;
  
  -- Get current participants from the message room
  SELECT participants INTO current_participants
  FROM message_rooms
  WHERE id = room_id;
  
  -- Check if room exists
  IF current_participants IS NULL THEN
    RAISE EXCEPTION 'Message room % not found', room_id;
  END IF;
  
  -- Check if user is a participant
  user_is_participant := user_id_to_remove = ANY(current_participants);
  
  IF NOT user_is_participant THEN
    -- User is not a participant, nothing to do
    RETURN FALSE;
  END IF;
  
  -- Remove user from participants array
  updated_participants := array_remove(current_participants, user_id_to_remove);
  
  -- Update the message room (this bypasses RLS because of SECURITY DEFINER)
  UPDATE message_rooms
  SET 
    participants = updated_participants,
    updated_time = NOW()
  WHERE id = room_id;
  
  -- Return success
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION remove_user_from_message_room(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_user_from_message_room(UUID, TEXT) TO service_role;

