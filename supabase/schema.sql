-- FreeTypingCourse — Supabase Schema
-- Run this in the Supabase SQL editor

-- ============================================================
-- LESSONS
-- ============================================================
create table if not exists lessons (
  id int primary key,
  phase int not null check (phase between 1 and 5),
  phase_name text not null,
  "order" int not null,
  title text not null,
  text text not null,
  unlock_wpm int not null default 0,
  description text,
  created_at timestamptz not null default now()
);

-- Index for ordered fetching
create index if not exists lessons_phase_order_idx on lessons (phase, "order");

-- RLS: anyone can read, only admins can write
alter table lessons enable row level security;

create policy "Public read lessons"
  on lessons for select
  using (true);

-- Admin write: only authenticated users with admin role
-- (You'll set this role in Supabase Dashboard → Auth → Users)
create policy "Admin write lessons"
  on lessons for all
  using (
    auth.role() = 'authenticated' and
    (auth.jwt() ->> 'role') = 'admin'
  );

-- ============================================================
-- PROGRESS
-- ============================================================
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id int not null references lessons(id) on delete cascade,
  best_wpm int not null default 0,
  best_accuracy numeric(5,2) not null default 0,
  attempts int not null default 1,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

-- Index for fast user lookups
create index if not exists progress_user_id_idx on progress (user_id);
create index if not exists progress_completed_at_idx on progress (user_id, completed_at desc);

-- RLS: users own their progress
alter table progress enable row level security;

create policy "Users own their progress"
  on progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
