create extension if not exists pgcrypto;

create table if not exists public.waitlist_customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  company text,
  phone text,
  message text not null,
  source text default 'website',
  created_at timestamptz not null default now()
);

create index if not exists idx_waitlist_customers_created_at
on public.waitlist_customers (created_at desc);

alter table public.waitlist_customers enable row level security;

drop policy if exists "allow_insert_waitlist" on public.waitlist_customers;
create policy "allow_insert_waitlist"
on public.waitlist_customers
for insert
to anon
with check (true);

drop policy if exists "allow_select_waitlist" on public.waitlist_customers;
create policy "allow_select_waitlist"
on public.waitlist_customers
for select
to anon
using (true);
