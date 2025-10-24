-- Fix RLS policies for blocked_users table
-- This script fixes the issue where users can't read their own blocked users list

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'blocked_users';

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can view their own blocks" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can insert their own blocks" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can delete their own blocks" ON public.blocked_users;

-- Create new, more permissive policies
-- Allow users to read their own blocked users (both directions)
CREATE POLICY "Users can view their own blocks" ON public.blocked_users
    FOR SELECT
    USING (
        auth.uid() = user_id OR 
        auth.uid() = blocked_user_id
    );

-- Allow users to insert blocks where they are the user_id
CREATE POLICY "Users can insert their own blocks" ON public.blocked_users
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own blocks (both directions)
CREATE POLICY "Users can delete their own blocks" ON public.blocked_users
    FOR DELETE
    USING (
        auth.uid() = user_id OR 
        auth.uid() = blocked_user_id
    );

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON public.blocked_users TO authenticated;

-- Test the policies by checking if we can read the table
-- This should now work without RLS errors
SELECT COUNT(*) as total_blocked_records FROM public.blocked_users;

-- Show the final policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'blocked_users';
