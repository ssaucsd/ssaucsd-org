CREATE TYPE role AS ENUM ('admin', 'user');
create table public.profiles (
    id uuid not null references auth.users on delete cascade,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    instrument text,
    role role DEFAULT 'user' NOT NULL,
    primary key (id)
);
alter table public.profiles enable row level security;