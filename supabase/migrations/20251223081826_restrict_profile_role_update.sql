-- Security fix: Prevent users from updating their own role column
-- Drop the existing unrestricted update policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
-- Create a new update policy that prevents role changes
-- The WITH CHECK clause ensures the role column cannot be changed
CREATE POLICY "Users can update their own profile" ON public.profiles FOR
UPDATE USING (auth.uid() = id) WITH CHECK (
        auth.uid() = id
        AND role = (
            SELECT role
            FROM public.profiles
            WHERE id = auth.uid()
        )
    );