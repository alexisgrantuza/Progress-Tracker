create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role text not null check (role in ('Admin', 'Supervisor', 'Site Engineer', 'QA/QC')),
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  location text not null,
  start_date date not null,
  end_date date not null,
  total_target_area numeric(12,2) not null default 0,
  total_completed_area numeric(12,2) not null default 0,
  overall_progress numeric(8,2) not null default 0,
  status text not null default 'Planning',
  created_by uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.task_heads (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  target_area numeric(12,2) not null default 0,
  completed_area numeric(12,2) not null default 0,
  progress_percentage numeric(8,2) not null default 0,
  start_date date not null,
  end_date date not null,
  status text not null default 'On Track',
  created_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  task_head_id uuid not null references public.task_heads(id) on delete cascade,
  name text not null,
  target_area numeric(12,2) not null,
  unit text not null default 'sq.m',
  completed_area numeric(12,2) not null default 0,
  progress_percentage numeric(8,2) not null default 0,
  start_date date not null,
  end_date date not null,
  skilled_workers integer not null default 1,
  helpers integer not null default 2,
  standard_output numeric(12,2) not null default 0,
  status text not null default 'On Track',
  created_at timestamptz not null default now(),
  constraint helpers_linear_to_skilled check (helpers = skilled_workers * 2)
);

create table if not exists public.progress_updates (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  update_type text not null check (update_type in ('Weekly', 'Monthly')),
  date_covered date not null,
  actual_completed_area numeric(12,2) not null default 0,
  remarks text,
  updated_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.productivity_standards (
  id uuid primary key default gen_random_uuid(),
  task_type text not null,
  skilled_workers integer not null default 1,
  helpers integer not null default 2,
  standard_output numeric(12,2) not null default 0,
  unit text not null default 'sq.m',
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  month text not null,
  summary text not null,
  status text not null,
  created_at timestamptz not null default now()
);
