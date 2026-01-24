-- Create events table
CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    location text NOT NULL,
    start_time timestamptz NOT NULL,
    end_time timestamptz NOT NULL,
    image_url text NOT NULL DEFAULT 'https://5wetyecq6s.ufs.sh/f/Lsf1uVmBmzfPMAFxGuITPqywjaelK1S42Q9umrXCOIV8cHsz',
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);
-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
-- Everyone can read events
CREATE POLICY "Anyone can view events" ON public.events FOR
SELECT USING (true);
-- Only admins can insert events
CREATE POLICY "Admins can create events" ON public.events FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
-- Only admins can update events
CREATE POLICY "Admins can update events" ON public.events FOR
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
-- Only admins can delete events
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);