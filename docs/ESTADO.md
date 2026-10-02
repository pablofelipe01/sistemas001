# Dónde vamos

Última actualización: 2 de octubre de 2026

Este archivo es la memoria del proyecto entre sesiones: qué hay hecho, qué quedó a
medias y qué conviene revisar antes de ponerle esto a un niño enfrente.

---

## Lo que hay, en una frase

Una app de Next.js para el salón, con cuatro partes:

1. **El examen** (`/examen`): 75 retos de HTML, CSS y JavaScript.
2. **Los proyectos guiados** (`/proyecto`): 8 proyectos que el alumno vuelve a
   escribir con sus dedos y después modifica con misiones.
3. **Los cursos** (`/cursos`): por ahora uno, Python desde cero (10 lecciones × 5 retos).
4. **Los juegos** (`/juegos`): cinco juegos de recreo para repasar sin darse cuenta.

Y el **panel del profesor** (`/profesor`), que muestra cómo va el salón en el examen,
en el curso de Python y en los proyectos.

La regla de fondo, en todo: **se escribe, no se pega.**

## Lo último que se hizo (2 de octubre de 2026)

### El curso de Python (`/cursos/python`)

A pedido del profesor: primera vez en Python para niños que ya vieron HTML, CSS y JS,
pensado para unas 4 horas (245 minutos sumando lo calculado por lección). 10 lecciones,
cada una con una explicación corta y 5 retos que se resuelven en orden; la lección
siguiente se abre al terminar la anterior. Las explicaciones ponen lado a lado el
JavaScript que ya saben y el Python nuevo, y sus ejemplos se pueden correr pero no copiar.

Lecciones: print · operaciones · variables · texto y f-strings · input() · if/elif/else ·
for y range · while · listas · funciones (cierra con piedra, papel o tijera).

Cómo funciona por dentro:

- **Python de verdad en el navegador** con Pyodide (v314.0.7 desde jsdelivr), dentro de
  un Web Worker *de tipo módulo* (`public/python/worker.js`; con `importScripts` Chrome
  no lo deja cargar). La primera carga baja unos megas; después queda en caché.
- **Ciclos infinitos:** si un programa no contesta en 5 segundos se apaga el worker y
  se levanta otro. Un `print` dentro de un `while True` se corta antes, a los 20.000
  caracteres. Las dos cosas le dan al niño una pista, no un cuelgue.
- **input():** en la página no se puede esperar al teclado, así que el alumno escribe
  las respuestas antes de correr, en unas cajitas bajo el editor.
- **La revisión** (`src/lib/cursos/calificar.ts`) corre el programa con varios juegos
  de respuestas y compara la salida "suave" (sin mayúsculas, tildes ni espacios de más),
  evalúa expresiones de Python después (`doble(4)` → `8`) y mira el código sin comentarios.
- **Los errores de Python se traducen** a pistas en español
  (`src/lib/cursos/errores-python.ts`), y cazan los vicios de JavaScript: console.log,
  let, llaves, &&, else if, true en minúscula, push.
- **Correr** no cuenta como intento; **Comprobar** sí. Mismo guardia contra pegar del
  examen (la terminal ahora acepta `python`, con sangría de 4 espacios).
- **Se guarda** en el navegador y en la tabla nueva `cursos` de Supabase (ya creada en
  `fxsimxiazztmuroivqei`, y en `supabase/schema.sql`): retos hechos, intentos por reto,
  pistas abiertas, teclas, pegados y el último código de cada reto.
- **Panel del profesor:** tabla nueva con L1…L10 por alumno, una marca de "atascado"
  (5+ intentos en el reto donde va), los 3 retos que más le cuestan al salón y, al tocar
  un alumno, reto por reto y **el código que lleva en el reto donde está pegado**.
- **`/verificar-curso`**: corre las 50 soluciones (deben pasar), los 50 códigos
  iniciales (no deben pasar solos) y los 18 ejemplos. Hoy: 68 de 68 bien.

Se probó en Chrome: la lección 1 completa con un error de JavaScript de por medio, el
while infinito de la lección 8 y el panel recibiendo el avance (el alumno de prueba ya se
borró de Supabase). Falta: **probarlo con niños** — ver si 5 retos por lección alcanzan
para 25 minutos y si las cajitas de input() se entienden sin explicarlas — y ver cuánto
tarda la primera carga de Python con el internet del colegio (conviene abrir
`/cursos/python` en cada computador un rato antes de la clase).

## Lo que se hizo el 29 de septiembre de 2026

### El tetris (`/juegos/tetris`)

A pedido del profesor. Tablero de 10×20, las 7 fichas (salen de a bolsas de siete),
sombra de dónde va a caer, y cada 10 líneas sube el nivel y todo cae más rápido. Se
juega con flechas (o WASD), Espacio suelta la ficha, P pausa, y hay botones en
pantalla para quien no tenga teclado. Se pausa solo si el alumno se va a otra ventana.

El toque de código, con las mismas `PREGUNTAS` del triqui (15 segundos, se contesta con
clic o con las teclas 1, 2 y 3):

- **🧊 Congelar (tecla C):** una vez por ficha. Si contesta bien, la ficha se queda
  quieta en el aire hasta que la suelte, y gana 50 puntos. Si contesta mal o se acaba
  el tiempo, esa ficha se pone en **🚀 turbo** (un renglón cada 60 ms).
- **📣 Pregunta sorpresa** cada 5 fichas, la pida o no, con las mismas reglas.

Récord de puntos en `localStorage`. Se probó en un Chromium sin pantalla (congelar,
turbo, sorpresas, perder y récord); falta jugarlo con niños y ver si el turbo es muy
castigo.

## Lo que se hizo el 25 de septiembre de 2026

### El buscaminas (`/juegos/buscaminas`)

El de los 90, a pedido del profesor. Tres niveles (9×9 con 10 minas, 12×12 con 24,
16×16 con 40), el primer toque nunca explota, se abre en cascada donde no hay minas,
bandera con clic derecho o con el botón "modo bandera" (para los que usan el
trackpad), y tocar un número con todas sus banderas abre lo de alrededor.

El toque de código: si pisa una mina, puede desactivarla contestando una pregunta del
triqui (mismas `PREGUNTAS`, 20 segundos). Hay 3 rescates por partida y se gastan aunque
falle. El reloj se detiene mientras piensa, y el récord por nivel queda en
`localStorage`. No tiene modo de dos jugadores: es un juego de uno, como el original.

## Lo que se hizo el 22 de septiembre de 2026

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

Tres juegos en `/juegos` (el buscaminas y el tetris llegaron después), todos con dos modos: contra la compu o dos jugadores
turnándose el mismo computador. El contenido está todo en `src/lib/juegos.ts`.

| Juego | Ruta | Cómo funciona |
|---|---|---|
| ⭕ Triqui de código | `/juegos/triqui` | La compu es X y pone ficha sin contestar. Para poner la O hay que contestar una pregunta de 3 opciones en 15 segundos. Si falla, se le muestra la buena y pierde el turno. 41 preguntas. |
| 🃏 Parejas de código | `/juegos/parejas` | 16 cartas: 8 con lo que se ve en la página, 8 con el código que lo hace. Al encontrar pareja sale una explicación corta. 22 parejas, se sacan 8 por partida. |
| 👾 Invasores del código | `/juegos/invasores` | El láser arranca vacío: se carga escribiendo 2 o 3 líneas de código (12 retos). El juego se congela mientras se escribe. Cada carga da 25 disparos, o 18 si pidió ver el ejemplo: la idea es que se la pasen jugando, no recargando. |

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
src/lib/cursos/         Los cursos: python.ts (contenido), calificar.ts, errores-python.ts, motor-python.ts
public/python/          El worker de Pyodide y corredor.py, que ejecuta el código del alumno
src/components/cursos/  TallerCurso (la lección), MapaDelCurso, la tabla del panel del profesor
src/lib/progress.ts     Progreso del examen: puntos, comodines, insignias
src/lib/storage.ts      Guardar local + nube + fusión de los dos
src/components/Terminal.tsx        La terminal que no deja pegar (CodeMirror)
src/components/TallerProyecto.tsx  El taller de los proyectos guiados
src/components/ElegirModo.tsx      Portada común de los tres juegos
src/app/api/            progreso, proyecto-avance, curso-avance, evento, ranking, profesor
supabase/schema.sql     Las cuatro tablas: alumnos, eventos, proyectos, cursos
```

## Cosas que hay que saber

- **Supabase es opcional.** Sin las variables de entorno la app funciona igual, guardando
  en el navegador. Las rutas de API responden `{ nube: false }` y el panel del profesor
  avisa.
- **Las tablas van con RLS activo y sin políticas**, a propósito: solo el servidor, con la
  service role key, puede tocarlas. Como los alumnos entran con el puro nombre, dejar
  escribir desde el navegador sería dejar que cualquiera editara el progreso de otro.
- **`/verificar`, `/verificar-proyecto` y `/verificar-curso`** son el autodiagnóstico: resuelven todo con la
  llave de respuestas y le corren sus propias pruebas. Vale la pena abrirlas cada vez que
  se toque un reto o una misión.
- **El identificador del alumno** es su nombre normalizado (`slugificar`). Si un niño
  escribe su nombre distinto, es otro alumno.
