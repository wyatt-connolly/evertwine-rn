-- Fix the INSERT policy for blocked_users table
-- The current INSERT policy is too restrictive

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert their own blocks" ON public.blocked_users;

-- Create a new, more permissive INSERT policy
CREATE POLICY "Users can insert their own blocks" ON public.blocked_users
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Verify the policy was created correctly
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'blocked_users' AND cmd = 'INSERT';
