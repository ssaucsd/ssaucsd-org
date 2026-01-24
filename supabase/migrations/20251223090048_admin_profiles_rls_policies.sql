-- Allow admins to read all profiles
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR
SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Allow admins to update all profiles (including role changes)
CREATE POLICY "Admins can update all profiles" ON public.profiles FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Allow admins to delete profiles
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- Allow admins to insert new profiles
CREATE POLICY "Admins can insert profiles" ON public.profiles FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );