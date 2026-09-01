-- ============================================================================
--  Examen de HTML, CSS y JavaScript — esquema de Supabase
--
--  Cómo se usa:
--    1. Entra a tu proyecto en supabase.com
--    2. Menú de la izquierda → SQL Editor → New query
--    3. Pega todo este archivo y dale Run
--
--  Las dos tablas van con RLS activo y SIN políticas: eso significa que nadie
--  puede leerlas ni escribirlas desde el navegador. Solo las rutas de API de la
--  app, que usan la service role key desde el servidor, tienen acceso.
--  Es a propósito: como los alumnos entran solo con su nombre (sin contraseña),
--  si el navegador pudiera escribir, cualquiera podría editar el progreso de
--  cualquier otro.
-- ============================================================================

create table if not exists public.alumnos (
  slug         text primary key,
  nombre       text not null,
  puntos       integer not null default 0,
  indice       integer not null default 0,
  resueltos    integer not null default 0,
  mejor_racha  integer not null default 0,
  progreso     jsonb   not null,
  inicio       timestamptz,
  actualizado  timestamptz not null default now()
);

create index if not exists alumnos_puntos_idx on public.alumnos (puntos desc);

comment on table  public.alumnos           is 'Un renglón por alumno. La columna progreso guarda el estado completo del examen.';
comment on column public.alumnos.slug      is 'El nombre normalizado (sin tildes, en minúsculas). Es la llave con la que el alumno vuelve a entrar.';
comment on column public.alumnos.resueltos is 'Cuántos de los 75 retos lleva resueltos. Se recalcula en cada guardado.';

create table if not exists public.eventos (
  id      bigserial primary key,
  slug    text not null,
  reto    text,
  tipo    text not null,
  detalle text,
  creado  timestamptz not null default now()
);

create index if not exists eventos_slug_idx   on public.eventos (slug);
create index if not exists eventos_creado_idx on public.eventos (creado desc);

comment on table public.eventos    is 'Bitácora de lo que vale la pena que el profesor vea.';
comment on column public.eventos.tipo is 'pegado-bloqueado | copia-bloqueada | ayuda | salto | resuelto | fallo';

alter table public.alumnos enable row level security;
alter table public.eventos enable row level security;

-- Sin políticas a propósito: el acceso anónimo queda cerrado por completo.
