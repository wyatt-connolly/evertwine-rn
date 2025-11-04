-- Database trigger to automatically remove users from meetups when they leave meetup group chats
-- This ensures data consistency even if the frontend call fails

-- Create a function that removes a user from a meetup when they're removed from a meetup message room
CREATE OR REPLACE FUNCTION remove_user_from_meetup_on_chat_leave()
RETURNS TRIGGER AS $$
DECLARE
  meetup_id UUID;
  user_id TEXT;
  old_participants TEXT[];
  new_participants TEXT[];
  updated_participants TEXT[];
BEGIN
  -- Only process if this is a meetup chat
  IF NEW.type = 'meetup' AND NEW.meetup_ref IS NOT NULL THEN
    -- Get the meetup ID from the meetup_ref
    meetup_id := NEW.meetup_ref::UUID;
    
    -- Get old and new participant arrays
    old_participants := OLD.participants;
    new_participants := NEW.participants;
    
    -- Find users who were removed (in old but not in new)
    FOR user_id IN 
      SELECT unnest(old_participants) 
      EXCEPT 
      SELECT unnest(new_participants)
    LOOP
      -- Get current participants from meetup
      SELECT participants INTO updated_participants
      FROM meetups
      WHERE id = meetup_id;
      
      -- Only proceed if user is in participants
      IF user_id = ANY(updated_participants) THEN
        -- Remove the user and calculate new count
        updated_participants := array_remove(updated_participants, user_id);
        
        -- Update meetup with new participants and count
        UPDATE meetups
        SET 
          participants = updated_participants,
          current_participants = array_length(updated_participants, 1),
          updated_at = NOW()
        WHERE id = meetup_id;
        
        -- Log the removal (optional - can be removed if not needed)
        RAISE NOTICE 'Removed user % from meetup % via trigger', user_id, meetup_id;
      END IF;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_remove_user_from_meetup_on_chat_leave ON message_rooms;

CREATE TRIGGER trigger_remove_user_from_meetup_on_chat_leave
  AFTER UPDATE ON message_rooms
  FOR EACH ROW
  WHEN (
    -- Only trigger when participants array changes
    OLD.participants IS DISTINCT FROM NEW.participants
    AND NEW.type = 'meetup'
    AND NEW.meetup_ref IS NOT NULL
  )
  EXECUTE FUNCTION remove_user_from_meetup_on_chat_leave();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION remove_user_from_meetup_on_chat_leave() TO authenticated;
GRANT EXECUTE ON FUNCTION remove_user_from_meetup_on_chat_leave() TO service_role;

