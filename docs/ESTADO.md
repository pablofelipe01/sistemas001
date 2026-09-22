# Dónde vamos

Última actualización: 22 de septiembre de 2026 · commit `5138b27`

Este archivo es la memoria del proyecto entre sesiones: qué hay hecho, qué quedó a
medias y qué conviene revisar antes de ponerle esto a un niño enfrente.

---

## Lo que hay, en una frase

Una app de Next.js para el salón, con tres partes:

1. **El examen** (`/examen`): 75 retos de HTML, CSS y JavaScript.
2. **Los proyectos guiados** (`/proyecto`): 8 proyectos que el alumno vuelve a
   escribir con sus dedos y después modifica con misiones.
3. **Los juegos** (`/juegos`): tres juegos de recreo para repasar sin darse cuenta.

Y el **panel del profesor** (`/profesor`), que muestra cómo va el salón en el examen y
en los proyectos.

La regla de fondo, en todo: **se escribe, no se pega.**

## Lo último que se hizo (22 de septiembre de 2026)

### 1. El profesor ya ve el avance de los proyectos

Antes el avance de los proyectos guiados vivía solo en el navegador del alumno
(`localStorage`), así que el panel no tenía nada que mostrar. Ahora:

- Tabla nueva `proyectos` en Supabase (ya creada en el proyecto
  `fxsimxiazztmuroivqei`; también está en `supabase/schema.sql` por si hay que
  levantar otro proyecto desde cero).
- `TallerProyecto.tsx` guarda en la nube 2,5 segundos después de que el alumno deja de
  teclear. Si un proyecto solo se abrió y no se tocó, no se manda nada.
- Al abrir un proyecto, si en la nube hay más misiones hechas que en el navegador, gana
  la nube. Así el alumno puede cambiar de computador.
- `/profesor` tiene una tabla nueva: un renglón por alumno y una columna por proyecto
  (P1…P8), con misiones hechas, teclas escritas, pegados bloqueados y última vez.
- La bitácora de eventos también registra `mision` (cumplió una misión) y los intentos
  de pegar dentro de un proyecto.

### 2. Los juegos de recreo

Tres juegos en `/juegos`, todos con dos modos: contra la compu o dos jugadores
turnándose el mismo computador. El contenido está todo en `src/lib/juegos.ts`.

| Juego | Ruta | Cómo funciona |
|---|---|---|
| ⭕ Triqui de código | `/juegos/triqui` | La compu es X y pone ficha sin contestar. Para poner la O hay que contestar una pregunta de 3 opciones en 15 segundos. Si falla, se le muestra la buena y pierde el turno. 41 preguntas. |
| 🃏 Parejas de código | `/juegos/parejas` | 16 cartas: 8 con lo que se ve en la página, 8 con el código que lo hace. Al encontrar pareja sale una explicación corta. 22 parejas, se sacan 8 por partida. |
| 👾 Invasores del código | `/juegos/invasores` | El láser arranca vacío: se carga escribiendo 2 o 3 líneas de código (12 retos). El juego se congela mientras se escribe. Cada carga da 6 disparos, o 3 si pidió ver el ejemplo. |

Las dos compus (la del triqui y la de las parejas) fallan a propósito de vez en cuando:
contra una compu perfecta un niño solo empata, y eso no divierte a nadie.

## Lo que falta o conviene revisar

- **Jugar una partida de invasores en una pantalla de verdad.** Se probó toda la lógica
  (cargar → disparar → recargar → fin del juego), pero el Chrome de pruebas tenía la
  pestaña oculta y el navegador no dibuja animación así. Falta verle el movimiento a
  velocidad normal y calibrar si está muy difícil: hoy son 3 vidas y los invasores
  sueltan bombas cada 1,5 segundos más o menos.
- **Los juegos no guardan nada.** No hay puntajes en la nube ni aparecen en el panel del
  profesor. Si se quiere, la vía es la misma de los proyectos: una tabla y una ruta de
  API.
- **Nadie ha jugado esto todavía con niños.** Falta ver si las preguntas del triqui están
  al nivel y si 15 segundos alcanzan.

## Mapa del código

```
src/lib/challenges/     Los 75 retos del examen (html.ts, css.ts, js.ts)
src/lib/proyectos.ts    Los 8 proyectos guiados con sus misiones
src/lib/juegos.ts       Preguntas, parejas y códigos de carga de los juegos
src/lib/progress.ts     Progreso del examen: puntos, comodines, insignias
src/lib/storage.ts      Guardar local + nube + fusión de los dos
src/components/Terminal.tsx        La terminal que no deja pegar (CodeMirror)
src/components/TallerProyecto.tsx  El taller de los proyectos guiados
src/components/ElegirModo.tsx      Portada común de los tres juegos
src/app/api/            progreso, proyecto-avance, evento, ranking, profesor
supabase/schema.sql     Las tres tablas: alumnos, eventos, proyectos
```

## Cosas que hay que saber

- **Supabase es opcional.** Sin las variables de entorno la app funciona igual, guardando
  en el navegador. Las rutas de API responden `{ nube: false }` y el panel del profesor
  avisa.
- **Las tablas van con RLS activo y sin políticas**, a propósito: solo el servidor, con la
  service role key, puede tocarlas. Como los alumnos entran con el puro nombre, dejar
  escribir desde el navegador sería dejar que cualquiera editara el progreso de otro.
- **`/verificar` y `/verificar-proyecto`** son el autodiagnóstico: resuelven todo con la
  llave de respuestas y le corren sus propias pruebas. Vale la pena abrirlas cada vez que
  se toque un reto o una misión.
- **El identificador del alumno** es su nombre normalizado (`slugificar`). Si un niño
  escribe su nombre distinto, es otro alumno.
