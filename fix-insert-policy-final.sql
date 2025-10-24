-- Final fix for INSERT policy on blocked_users table
-- This should resolve the RLS policy violation errors

-- First, let's see what policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'blocked_users';

-- Drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own blocks" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can insert their own blocks" ON public.blocked_users;
DROP POLICY IF EXISTS "Users can delete their own blocks" ON public.blocked_users;

-- Create new, comprehensive policies
-- SELECT policy: Allow users to see blocks where they are involved
CREATE POLICY "Users can view their own blocks" ON public.blocked_users
    FOR SELECT
    USING (
        auth.uid() = user_id OR 
        auth.uid() = blocked_user_id
    );

-- INSERT policy: Allow users to create blocks where they are the user_id
CREATE POLICY "Users can insert their own blocks" ON public.blocked_users
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- DELETE policy: Allow users to delete blocks where they are involved
CREATE POLICY "Users can delete their own blocks" ON public.blocked_users
    FOR DELETE
    USING (
        auth.uid() = user_id OR 
        auth.uid() = blocked_user_id
    );

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON public.blocked_users TO authenticated;

-- Show the final policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'blocked_users';
