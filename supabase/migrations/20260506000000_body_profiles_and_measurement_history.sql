create table if not exists public.body_profiles (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  profile_payload jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.measurement_histories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  brand text,
  source_url text not null,
  category text not null check (category in ('tops', 'pants')),
  size_label text not null,
  measurement_payload jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists measurement_histories_owner_created_idx
  on public.measurement_histories (owner_id, created_at desc);

drop trigger if exists body_profiles_set_updated_at on public.body_profiles;
create trigger body_profiles_set_updated_at
before update on public.body_profiles
for each row execute function public.set_updated_at();

alter table public.body_profiles enable row level security;
alter table public.measurement_histories enable row level security;

drop policy if exists body_profiles_select_owner on public.body_profiles;
create policy body_profiles_select_owner
on public.body_profiles for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists body_profiles_insert_owner on public.body_profiles;
create policy body_profiles_insert_owner
on public.body_profiles for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists body_profiles_update_owner on public.body_profiles;
create policy body_profiles_update_owner
on public.body_profiles for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists measurement_histories_select_owner on public.measurement_histories;
create policy measurement_histories_select_owner
on public.measurement_histories for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists measurement_histories_insert_owner on public.measurement_histories;
create policy measurement_histories_insert_owner
on public.measurement_histories for insert
to authenticated
with check (owner_id = auth.uid());

grant select, insert, update on public.body_profiles to authenticated;
grant select, insert on public.measurement_histories to authenticated;
