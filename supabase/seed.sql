-- Seed file for local development
-- This file is executed after migrations when running `supabase db reset`
INSERT INTO public.events (
        title,
        description,
        location,
        start_time,
        end_time,
        image_url
    )
VALUES (
        'Winter Showcase',
        'Join us for our annual winter showcase featuring performances from all sections of the band.',
        'Main Auditorium',
        '2025-12-28 18:00:00+00',
        '2025-12-28 21:00:00+00',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800'
    ),
    (
        'New Year''s Jazz Night',
        'Ring in the new year with an evening of jazz featuring our top performers. Light refreshments will be served.',
        'Music Hall',
        '2025-12-31 20:00:00+00',
        '2026-01-01 01:00:00+00',
        'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800'
    ),
    (
        'Spring Concert',
        'Our biggest concert of the year! Come support the band as we perform pieces from around the world.',
        'Campus Theater',
        '2026-03-08 17:30:00+00',
        '2026-03-08 20:30:00+00',
        'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800'
    ),
    (
        'Ensemble Workshop',
        'Practice session for all ensemble members. Bring your instruments and sheet music.',
        'Practice Room B',
        '2026-01-15 14:00:00+00',
        '2026-01-15 16:00:00+00',
        ''
    ),
    (
        'Chamber Music Recital',
        'An intimate evening showcasing our talented chamber groups performing classical masterpieces.',
        'Recital Hall',
        '2026-02-14 19:00:00+00',
        '2026-02-14 21:00:00+00',
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800'
    ),
    (
        'Community Outreach Concert',
        'Free concert open to the community! Join us for a family-friendly afternoon of music and fun.',
        'Central Park Amphitheater',
        '2026-04-20 14:00:00+00',
        '2026-04-20 17:00:00+00',
        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800'
    );
-- Seed resources
-- Seed resources
INSERT INTO public.resources (name, link, description, is_pinned)
VALUES (
        'Practice Room Booking',
        'https://example.com/book-practice-room',
        'Reserve practice rooms for individual or group rehearsals. Rooms are available daily from 8am to 10pm.',
        true
    ),
    (
        'Sheet Music Library',
        'https://imslp.org',
        'Access our extensive collection of public domain sheet music. Perfect for finding classical repertoire.',
        true
    ),
    (
        'Metronome Tool',
        'https://www.metronomeonline.com',
        'Free online metronome for practicing. Supports various time signatures and tempos.',
        false
    ),
    (
        'Music Theory Guide',
        'https://www.musictheory.net',
        'Interactive lessons and exercises covering fundamentals of music theory from basics to advanced concepts.',
        false
    ),
    (
        'Tuner App',
        'https://tuner.ninja',
        'Free chromatic tuner for all instruments. Essential for ensuring proper intonation.',
        false
    ),
    (
        'Practice Log Template',
        'https://docs.google.com/spreadsheets/d/example',
        'Track your practice sessions with this template. Monitor progress and set goals.',
        false
    ),
    (
        'Ensemble Repertoire Recordings',
        'https://drive.google.com/drive/folders/example',
        'Listen to professional recordings of pieces we are currently rehearsing.',
        true
    ),
    (
        'Performance Attire Guidelines',
        'https://example.com/dress-code',
        'Official dress code and uniform requirements for concerts and performances.',
        false
    );
-- Seed sample tags for local development
INSERT INTO public.tags (name, slug, display_order)
VALUES ('Practice Tools', 'practice-tools', 1),
    ('Sheet Music', 'sheet-music', 2),
    ('Guides & Resources', 'guides-resources', 3),
    ('Recordings', 'recordings', 4);
-- Assign tags to resources
INSERT INTO public.resource_tags (resource_id, tag_id)
SELECT r.id,
    t.id
FROM public.resources r,
    public.tags t
WHERE r.name = 'Practice Room Booking'
    AND t.slug = 'practice-tools'
UNION ALL
SELECT r.id,
    t.id
FROM public.resources r,
    public.tags t
WHERE r.name = 'Sheet Music Library'
    AND t.slug = 'sheet-music'
UNION ALL
SELECT r.id,
    t.id
FROM public.resources r,
    public.tags t
WHERE r.name = 'Metronome Tool'
    AND t.slug = 'practice-tools'
UNION ALL
SELECT r.id,
    t.id
FROM public.resources r,
    public.tags t
WHERE r.name = 'Music Theory Guide'
    AND t.slug = 'guides-resources'
UNION ALL
SELECT r.id,
    t.id
FROM public.resources r,
    public.tags t
WHERE r.name = 'Tuner App'
    AND t.slug = 'practice-tools'
UNION ALL
SELECT r.id,
    t.id
FROM public.resources r,
    public.tags t
WHERE r.name = 'Practice Log Template'
    AND t.slug = 'practice-tools'
UNION ALL
SELECT r.id,
    t.id
FROM public.resources r,
    public.tags t
WHERE r.name = 'Ensemble Repertoire Recordings'
    AND t.slug = 'recordings'
UNION ALL
SELECT r.id,
    t.id
FROM public.resources r,
    public.tags t
WHERE r.name = 'Performance Attire Guidelines'
    AND t.slug = 'guides-resources';