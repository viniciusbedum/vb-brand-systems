-- Brand System — schema inicial
-- Tabelas: profiles, conversations, brand_assets + bucket de storage brand-assets.
-- Toda autorização é aplicada no banco via RLS; o client nunca é confiável.

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

-- security definer evita recursão de RLS ao consultar profiles dentro de uma policy de profiles
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

create policy "profiles: ler o próprio ou admin lê todos"
  on public.profiles for select
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()));

create policy "profiles: editar o próprio ou admin edita todos"
  on public.profiles for update
  to authenticated
  using (id = (select auth.uid()) or (select public.is_admin()))
  with check (id = (select auth.uid()) or (select public.is_admin()));

create policy "profiles: apenas admin remove"
  on public.profiles for delete
  to authenticated
  using ((select public.is_admin()) and id <> (select auth.uid()));

-- Impede escalada de privilégio: só admin altera role, e ninguém altera o próprio role
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.role is distinct from old.role then
    if auth.uid() is not null and (not public.is_admin() or new.id = auth.uid()) then
      raise exception 'Somente administradores podem alterar o papel de outros membros';
    end if;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_protect_role
  before update on public.profiles
  for each row execute function public.protect_profile_role();

-- Cria o profile no signup. O primeiro usuário do projeto vira admin.
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
-- CONVERSATIONS (histórico do chat de IA)
-- ============================================================

create table public.conversations (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users (id) on delete cascade,
  title       text not null default 'Nova conversa',
  messages    jsonb not null default '[]'::jsonb,
  pinned      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index conversations_user_id_idx on public.conversations (user_id, pinned desc, updated_at desc);

alter table public.conversations enable row level security;

create policy "conversations: dono tem acesso total"
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

create policy "brand_assets: membros leem"
  on public.brand_assets for select
  to authenticated
  using (true);

create policy "brand_assets: membros enviam em nome próprio"
  on public.brand_assets for insert
  to authenticated
  with check (uploaded_by = (select auth.uid()));

create policy "brand_assets: apenas admin remove"
  on public.brand_assets for delete
  to authenticated
  using ((select public.is_admin()));

-- ============================================================
-- STORAGE: bucket privado brand-assets
-- Caminho dos arquivos: {category}/{user_id}/{timestamp}-{id}.{ext}
-- ============================================================

insert into storage.buckets (id, name, public)
values ('brand-assets', 'brand-assets', false)
on conflict (id) do nothing;

create policy "brand-assets: membros leem"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'brand-assets');

create policy "brand-assets: membros enviam na própria pasta"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'brand-assets'
    and (storage.foldername(name))[2] = (select auth.uid())::text
  );

create policy "brand-assets: apenas admin remove"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'brand-assets' and (select public.is_admin()));
