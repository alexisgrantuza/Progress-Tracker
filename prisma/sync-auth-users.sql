create or replace function public.sync_auth_user_to_public_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_name text;
  profile_role text;
begin
  profile_name := coalesce(
    nullif(new.raw_user_meta_data ->> 'name', ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    split_part(new.email, '@', 1),
    'Tracker User'
  );

  profile_role := coalesce(nullif(new.raw_user_meta_data ->> 'role', ''), 'Supervisor');

  if profile_role not in ('Admin', 'Supervisor', 'Site Engineer', 'QA/QC') then
    profile_role := 'Supervisor';
  end if;

  insert into public.users (id, name, email, role)
  values (new.id, profile_name, new.email, profile_role)
  on conflict (email) do update
    set
      name = excluded.name,
      role = case
        when public.users.role in ('Admin', 'Supervisor', 'Site Engineer', 'QA/QC')
          then public.users.role
        else excluded.role
      end;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.sync_auth_user_to_public_user();

insert into public.users (id, name, email, role)
select
  auth_users.id,
  coalesce(
    nullif(auth_users.raw_user_meta_data ->> 'name', ''),
    nullif(auth_users.raw_user_meta_data ->> 'full_name', ''),
    split_part(auth_users.email, '@', 1),
    'Tracker User'
  ) as name,
  auth_users.email,
  case
    when auth_users.raw_user_meta_data ->> 'role' in ('Admin', 'Supervisor', 'Site Engineer', 'QA/QC')
      then auth_users.raw_user_meta_data ->> 'role'
    else 'Supervisor'
  end as role
from auth.users as auth_users
where auth_users.email is not null
on conflict (email) do update
  set
    name = excluded.name,
    role = case
      when public.users.role in ('Admin', 'Supervisor', 'Site Engineer', 'QA/QC')
        then public.users.role
      else excluded.role
    end;
