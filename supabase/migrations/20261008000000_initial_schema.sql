-- Brand System — initial schema
-- Tables: profiles, conversations, brand_assets + the private storage bucket "brand-assets".
-- Apply it once on a new Supabase project (SQL Editor > paste > Run, or `supabase db push`).
-- All authorization is enforced in the database with RLS; the client is never trusted.

-- ============================================================
-- PROFILES
-- ============================================================

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  role        text not null default 'staff' check (role in ('admin', 'staff')),
  name        text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- security definer avoids RLS recursion when a profiles policy reads profiles
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

create policy "profiles: read own, admins read all"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

create policy "profiles: edit own, admins edit all"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()))
  with check (id = (select auth.uid()) or (select public.is_admin()));

create policy "profiles: only admins delete"
  on public.profiles for delete
  to authenticated
  using ((select public.is_admin()) and id <> (select auth.uid()));

-- Blocks privilege escalation: only admins change a role, and nobody changes their own
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role then
    if auth.uid() is not null and (not public.is_admin() or new.id = auth.uid()) then
      raise exception 'Only administrators can change the role of other members';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Creates the profile on signup. The first user of the project becomes admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    case when exists (select 1 from public.profiles) then 'staff' else 'admin' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- CONVERSATIONS (AI chat history)
-- ============================================================

create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null default 'New conversation',
  messages    jsonb not null default '[]'::jsonb,
  pinned      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index conversations_user_id_idx on public.conversations (user_id, pinned desc, updated_at desc);

alter table public.conversations enable row level security;

create policy "conversations: owner has full access"
  on public.conversations for all
  to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- ============================================================
-- BRAND ASSETS
-- ============================================================

create table public.brand_assets (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  size          bigint not null,
  type          text not null,
  storage_path  text not null unique,
  category      text not null,
  uploaded_by   uuid references auth.users (id) on delete set null,
  created_at    timestamptz not null default now()
);

create index brand_assets_category_idx on public.brand_assets (category, created_at desc);

alter table public.brand_assets enable row level security;

create policy "brand_assets: members read"
  on public.brand_assets for select
  to authenticated
  using (true);

create policy "brand_assets: only admins upload"
  on public.brand_assets for insert
  to authenticated
  with check ((select public.is_admin()) and uploaded_by = (select auth.uid()));

create policy "brand_assets: only admins delete"
  on public.brand_assets for delete
  to authenticated
  using ((select public.is_admin()));

-- ============================================================
-- STORAGE: private bucket "brand-assets"
-- File path: {category}/{user_id}/{timestamp}-{id}.{ext}
-- The size limit and the allowed types are enforced by Supabase on the server,
-- whatever the browser sends. Change them here if your brand needs other formats.
-- ============================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'brand-assets',
  'brand-assets',
  false,
  52428800, -- 50 MB per file
  array[
    'image/*',
    'video/*',
    'audio/*',
    'font/*',
    'application/pdf',
    'application/postscript',
    'application/illustrator',
    'application/msword',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/x-font-ttf',
    'application/x-font-otf',
    'application/octet-stream', -- browsers report this type for .psd, .sketch, .fig and some fonts
    'text/plain'
  ]
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy "brand-assets: members read"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'brand-assets');

create policy "brand-assets: only admins upload, in their own folder"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'brand-assets'
    and (select public.is_admin())
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

create policy "brand-assets: only admins delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'brand-assets' and (select public.is_admin()));
