create type rsvp_status as enum ('going', 'maybe', 'not_going');
create table public.rsvps (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    event_id uuid not null references public.events(id) on delete cascade,
    status rsvp_status not null default 'going',
    created_at timestamp with time zone not null default now(),
    primary key (id),
    unique (user_id, event_id)
);
alter table public.rsvps enable row level security;
create policy "Users can insert their own rsvp" on public.rsvps for
insert to authenticated with check (auth.uid() = user_id);
create policy "Users can update their own rsvp" on public.rsvps for
update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own rsvp" on public.rsvps for delete to authenticated using (auth.uid() = user_id);
create policy "Anyone can view rsvps" on public.rsvps for
select to authenticated,
    anon using (true);