-- Run this once in the Supabase SQL editor.

create table if not exists links (
  id           text primary key,          -- public link id (random, 72 bits)
  manage_hash  text not null unique,      -- sha256 of the private management token
  phone        text not null,
  ip_hash      text,                      -- salted hash of creator IP, for rate limiting
  created_at   timestamptz not null default now()
);

create index if not exists links_ip_created_idx on links (ip_hash, created_at);

create table if not exists reports (
  id          bigserial primary key,
  link_id     text not null,
  reason      text,
  created_at  timestamptz not null default now()
);

-- Lock the tables down: with RLS on and no policies, the public (anon) key
-- can read nothing. Only the server, using the service role key, can access them.
alter table links   enable row level security;
alter table reports enable row level security;
