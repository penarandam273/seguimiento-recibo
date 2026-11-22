-- Seguimiento de Recibo: tablas de la nube (Supabase / Postgres)
-- Se corre una sola vez en el proyecto nuevo: SQL Editor -> pegar -> Run.
-- Las tablas quedan cerradas (RLS sin politicas): solo la funcion "recibo" entra, con la llave de servicio.

create table if not exists public.recibo_docs (
  coleccion       text        not null,
  id              text        not null,
  datos           jsonb       not null default '{}'::jsonb,
  version         integer     not null default 1,
  borrado         boolean     not null default false,
  actualizado_por text,
  actualizado_en  timestamptz not null default now(),
  primary key (coleccion, id)
);
create index if not exists recibo_docs_actualizado on public.recibo_docs (actualizado_en);

-- Codigo general del equipo (se guarda solo el hash con sal)
create table if not exists public.recibo_equipo (
  id     text        primary key,
  hash   text        not null,
  sal    text        not null,
  creado timestamptz not null default now()
);

-- Personas invitadas, cada una con su codigo personal (solo el hash)
create table if not exists public.recibo_miembros (
  id         uuid        primary key default gen_random_uuid(),
  nombre     text        not null,
  hash       text        not null unique,
  creado     timestamptz not null default now(),
  ultimo_uso timestamptz,
  quitado    boolean     not null default false,
  quitado_en timestamptz
);

alter table public.recibo_docs     enable row level security;
alter table public.recibo_equipo   enable row level security;
alter table public.recibo_miembros enable row level security;
