create extension if not exists pgcrypto;

create table if not exists public.waitlist_customers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null unique,
  company text,
  phone text,
  message text not null,
  source text not null default 'website'
);

create index if not exists idx_waitlist_customers_created_at
  on public.waitlist_customers (created_at desc);
