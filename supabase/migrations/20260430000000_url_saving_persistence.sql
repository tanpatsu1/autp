-- URL Saving MVP persistence draft.
-- Safe usage: review and apply only to local/preview Supabase environments.
-- Do not run this migration against production from automation.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.prevent_owner_id_update()
returns trigger
language plpgsql
as $$
begin
  if old.owner_id <> new.owner_id then
    raise exception 'owner_id cannot be changed';
  end if;

  return new;
end;
$$;

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint categories_name_not_blank check (length(btrim(name)) > 0),
  constraint categories_normalized_name_not_blank check (length(btrim(normalized_name)) > 0),
  constraint categories_owner_normalized_unique unique (owner_id, normalized_name),
  constraint categories_id_owner_unique unique (id, owner_id)
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tags_name_not_blank check (length(btrim(name)) > 0),
  constraint tags_normalized_name_not_blank check (length(btrim(normalized_name)) > 0),
  constraint tags_owner_normalized_unique unique (owner_id, normalized_name),
  constraint tags_id_owner_unique unique (id, owner_id)
);

create table if not exists public.saved_urls (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  display_url text,
  title text not null,
  category_id uuid,
  memo text,
  is_favorite boolean not null default false,
  capture_source text not null default 'manual_form',
  organization_state text not null default 'needs_review',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saved_urls_url_not_blank check (length(btrim(url)) > 0),
  constraint saved_urls_title_not_blank check (length(btrim(title)) > 0),
  constraint saved_urls_capture_source_check check (
    capture_source in ('manual_form', 'fast_save', 'bookmarklet', 'web_share', 'extension', 'import')
  ),
  constraint saved_urls_organization_state_check check (
    organization_state in ('needs_review', 'organized')
  ),
  constraint saved_urls_id_owner_unique unique (id, owner_id),
  constraint saved_urls_category_owner_fk foreign key (category_id, owner_id)
    references public.categories(id, owner_id)
    on update cascade
    on delete restrict
);

create table if not exists public.saved_url_tags (
  owner_id uuid not null references auth.users(id) on delete cascade,
  saved_url_id uuid not null,
  tag_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (saved_url_id, tag_id),
  constraint saved_url_tags_saved_url_owner_fk foreign key (saved_url_id, owner_id)
    references public.saved_urls(id, owner_id)
    on update cascade
    on delete cascade,
  constraint saved_url_tags_tag_owner_fk foreign key (tag_id, owner_id)
    references public.tags(id, owner_id)
    on update cascade
    on delete cascade
);

create index if not exists saved_urls_owner_updated_idx
  on public.saved_urls (owner_id, updated_at desc);

create index if not exists saved_urls_owner_created_idx
  on public.saved_urls (owner_id, created_at desc);

create index if not exists saved_urls_owner_favorite_updated_idx
  on public.saved_urls (owner_id, is_favorite, updated_at desc);

create index if not exists saved_urls_owner_category_idx
  on public.saved_urls (owner_id, category_id);

create index if not exists saved_url_tags_owner_saved_url_idx
  on public.saved_url_tags (owner_id, saved_url_id);

create index if not exists saved_url_tags_owner_tag_idx
  on public.saved_url_tags (owner_id, tag_id);

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists tags_set_updated_at on public.tags;
create trigger tags_set_updated_at
before update on public.tags
for each row execute function public.set_updated_at();

drop trigger if exists saved_urls_set_updated_at on public.saved_urls;
create trigger saved_urls_set_updated_at
before update on public.saved_urls
for each row execute function public.set_updated_at();

drop trigger if exists categories_prevent_owner_id_update on public.categories;
create trigger categories_prevent_owner_id_update
before update of owner_id on public.categories
for each row execute function public.prevent_owner_id_update();

drop trigger if exists tags_prevent_owner_id_update on public.tags;
create trigger tags_prevent_owner_id_update
before update of owner_id on public.tags
for each row execute function public.prevent_owner_id_update();

drop trigger if exists saved_urls_prevent_owner_id_update on public.saved_urls;
create trigger saved_urls_prevent_owner_id_update
before update of owner_id on public.saved_urls
for each row execute function public.prevent_owner_id_update();

alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.saved_urls enable row level security;
alter table public.saved_url_tags enable row level security;

drop policy if exists categories_select_owner on public.categories;
create policy categories_select_owner
on public.categories for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists categories_insert_owner on public.categories;
create policy categories_insert_owner
on public.categories for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists categories_update_owner on public.categories;
create policy categories_update_owner
on public.categories for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists categories_delete_owner on public.categories;
create policy categories_delete_owner
on public.categories for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists tags_select_owner on public.tags;
create policy tags_select_owner
on public.tags for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists tags_insert_owner on public.tags;
create policy tags_insert_owner
on public.tags for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists tags_update_owner on public.tags;
create policy tags_update_owner
on public.tags for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists tags_delete_owner on public.tags;
create policy tags_delete_owner
on public.tags for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists saved_urls_select_owner on public.saved_urls;
create policy saved_urls_select_owner
on public.saved_urls for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists saved_urls_insert_owner on public.saved_urls;
create policy saved_urls_insert_owner
on public.saved_urls for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists saved_urls_update_owner on public.saved_urls;
create policy saved_urls_update_owner
on public.saved_urls for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

drop policy if exists saved_urls_delete_owner on public.saved_urls;
create policy saved_urls_delete_owner
on public.saved_urls for delete
to authenticated
using (owner_id = auth.uid());

drop policy if exists saved_url_tags_select_owner on public.saved_url_tags;
create policy saved_url_tags_select_owner
on public.saved_url_tags for select
to authenticated
using (owner_id = auth.uid());

drop policy if exists saved_url_tags_insert_owner on public.saved_url_tags;
create policy saved_url_tags_insert_owner
on public.saved_url_tags for insert
to authenticated
with check (
  owner_id = auth.uid()
  and exists (
    select 1 from public.saved_urls
    where saved_urls.id = saved_url_tags.saved_url_id
      and saved_urls.owner_id = auth.uid()
  )
  and exists (
    select 1 from public.tags
    where tags.id = saved_url_tags.tag_id
      and tags.owner_id = auth.uid()
  )
);

drop policy if exists saved_url_tags_delete_owner on public.saved_url_tags;
create policy saved_url_tags_delete_owner
on public.saved_url_tags for delete
to authenticated
using (owner_id = auth.uid());

grant usage on schema public to authenticated;
grant select, insert, update, delete on
  public.categories,
  public.tags,
  public.saved_urls,
  public.saved_url_tags
to authenticated;
