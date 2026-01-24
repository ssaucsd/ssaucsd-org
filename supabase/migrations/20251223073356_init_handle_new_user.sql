-- inserts a row into public.profiles
create function public.handle_new_user() returns trigger language plpgsql security definer
set search_path = '' as $$ begin
insert into public.profiles (id, first_name, last_name, email)
values (
        new.id,
        coalesce(
            new.raw_user_meta_data->>'first_name',
            split_part(new.raw_user_meta_data->>'full_name', ' ', 1)
        ),
        coalesce(
            new.raw_user_meta_data->>'last_name',
            split_part(new.raw_user_meta_data->>'full_name', ' ', 2)
        ),
        new.email
    );
return new;
end;
$$;
-- trigger the function every time a user is created
create trigger on_auth_user_created
after
insert on auth.users for each row execute procedure public.handle_new_user();