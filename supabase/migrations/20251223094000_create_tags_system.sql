-- Create tags table
CREATE TABLE public.tags (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    slug text NOT NULL UNIQUE,
    display_order integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now() NOT NULL
);
-- Create index for ordering
CREATE INDEX idx_tags_display_order ON public.tags(display_order);
-- Enable RLS
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
-- RLS Policies for tags table
CREATE POLICY "Anyone can view tags" ON public.tags FOR
SELECT USING (true);
CREATE POLICY "Admins can create tags" ON public.tags FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can update tags" ON public.tags FOR
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
CREATE POLICY "Admins can delete tags" ON public.tags FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);
-- Create resource_tags junction table
CREATE TABLE public.resource_tags (
    resource_id uuid NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
    tag_id uuid NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now() NOT NULL,
    PRIMARY KEY (resource_id, tag_id)
);
-- Create indexes for efficient querying
CREATE INDEX idx_resource_tags_resource_id ON public.resource_tags(resource_id);
CREATE INDEX idx_resource_tags_tag_id ON public.resource_tags(tag_id);
-- Enable RLS
ALTER TABLE public.resource_tags ENABLE ROW LEVEL SECURITY;
-- RLS Policies for resource_tags table
CREATE POLICY "Anyone can view resource_tags" ON public.resource_tags FOR
SELECT USING (true);
CREATE POLICY "Admins can create resource_tags" ON public.resource_tags FOR
INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.profiles
            WHERE id = auth.uid()
                AND role = 'admin'
        )
    );
CREATE POLICY "Admins can delete resource_tags" ON public.resource_tags FOR DELETE USING (
    EXISTS (
        SELECT 1
        FROM public.profiles
        WHERE id = auth.uid()
            AND role = 'admin'
    )
);