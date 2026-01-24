-- Add foreign key from rsvps.user_id to profiles.id
-- This enables Supabase PostgREST to detect the relationship for joins
-- Required for the getEventRsvps query to properly join rsvps with profiles
ALTER TABLE public.rsvps
ADD CONSTRAINT rsvps_user_id_profiles_fkey
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
