-- Add is_all_day column to events table
ALTER TABLE public.events ADD COLUMN is_all_day boolean DEFAULT false NOT NULL;
