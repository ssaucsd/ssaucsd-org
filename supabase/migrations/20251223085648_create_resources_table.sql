-- Create resources table
CREATE TABLE public.resources (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    link text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now() NOT NULL
);
-- Enable RLS
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
-- Everyone can read resources
CREATE POLICY "Anyone can view resources" ON public.resources FOR
SELECT USING (true);
-- Only admins can insert resources
CREATE POLICY "Admins can create resources" ON public.resources FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Only admins can update resources
CREATE POLICY "Admins can update resources" ON public.resources FOR
UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Only admins can delete resources
CREATE POLICY "Admins can delete resources" ON public.resources FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);