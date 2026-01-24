-- Add is_pinned column to resources table
ALTER TABLE public.resources
ADD COLUMN is_pinned boolean NOT NULL DEFAULT false;