alter table public.profiles
add column major text,
    add column graduation_year integer,
    add column is_onboarded boolean not null default false;