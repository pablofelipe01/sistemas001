-- ============================================================================
--  Examen de HTML, CSS y JavaScript — esquema de Supabase
--
--  Cómo se usa:
--    1. Entra a tu proyecto en supabase.com
--    2. Menú de la izquierda → SQL Editor → New query
--    3. Pega todo este archivo y dale Run
--
--  Las tablas van con RLS activo y SIN políticas: eso significa que nadie
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
comment on column public.eventos.tipo is 'pegado-bloqueado | copia-bloqueada | ayuda | salto | resuelto | fallo | mision';

create table if not exists public.proyectos (
  slug         text not null,
  proyecto     text not null,
  nombre       text not null,
  hechas       jsonb   not null default '[]'::jsonb,
  teclas       integer not null default 0,
  pegados      integer not null default 0,
  codigo       jsonb   not null default '{}'::jsonb,
  actualizado  timestamptz not null default now(),
  primary key (slug, proyecto)
);

comment on table  public.proyectos        is 'Un renglón por alumno y proyecto guiado: misiones hechas, teclas, pegados bloqueados y el código.';
comment on column public.proyectos.hechas is 'Los id de las misiones cumplidas, en orden.';

create table if not exists public.cursos (
  slug         text not null,
  curso        text not null,
  nombre       text not null,
  hechos       jsonb   not null default '[]'::jsonb,
  intentos     jsonb   not null default '{}'::jsonb,
  pistas       jsonb   not null default '[]'::jsonb,
  teclas       integer not null default 0,
  pegados      integer not null default 0,
  codigo       jsonb   not null default '{}'::jsonb,
  actualizado  timestamptz not null default now(),
  primary key (slug, curso)
);

comment on table  public.cursos          is 'Un renglón por alumno y curso (hoy: python): retos resueltos, intentos, pistas y el último código de cada reto.';
comment on column public.cursos.hechos   is 'Los id de los retos resueltos, en el orden en que los resolvió (py-3-2 = lección 3, reto 2).';
comment on column public.cursos.intentos is 'Cuántas veces le dio Comprobar a cada reto: { "py-3-2": 4 }.';

alter table public.alumnos   enable row level security;
alter table public.eventos   enable row level security;
alter table public.proyectos enable row level security;
alter table public.cursos    enable row level security;

-- Sin políticas a propósito: el acceso anónimo queda cerrado por completo.

-- Los exámenes de los cursos (hoy: Python desde cero). Una sola oportunidad:
-- si el renglón ya tiene fin, la ruta /api/examen no deja volver a empezar.
create table if not exists public.examenes (
  slug            text not null,
  examen          text not null,
  nombre          text not null,
  inicio          timestamptz not null default now(),
  fin             timestamptz,
  terminado_por   text,
  respuestas      jsonb   not null default '{}'::jsonb,
  pistas          jsonb   not null default '{}'::jsonb,
  salidas         integer not null default 0,
  segundos_fuera  integer not null default 0,
  pegados         integer not null default 0,
  capturas        integer not null default 0,
  teclas          integer not null default 0,
  actualizado     timestamptz not null default now(),
  primary key (slug, examen)
);

comment on table  public.examenes               is 'Un renglón por alumno y examen. Una sola oportunidad: si ya tiene fin, no se puede volver a presentar.';
comment on column public.examenes.terminado_por is 'alumno (le dio Terminar) | cierre (se acabó la hora). Vacío mientras lo está presentando.';
comment on column public.examenes.salidas       is 'Cuántas veces salió de la página del examen (otra pestaña u otra ventana).';
comment on column public.examenes.capturas      is 'Intentos de captura de pantalla que se alcanzaron a ver (Imprimir pantalla, Cmd+Shift, Win+Shift).';

alter table public.examenes enable row level security;
