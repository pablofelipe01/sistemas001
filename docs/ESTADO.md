# Dónde vamos

Última actualización: 20 de octubre de 2026 (Rust avanzado)

Este archivo es la memoria del proyecto entre sesiones: qué hay hecho, qué quedó a
medias y qué conviene revisar antes de ponerle esto a un niño enfrente.

---

## Lo que hay, en una frase

Una app de Next.js para el salón, con cuatro partes:

1. **El examen** (`/examen`): 75 retos de HTML, CSS y JavaScript.
2. **Los proyectos guiados** (`/proyecto`): 8 proyectos que el alumno vuelve a
   escribir con sus dedos y después modifica con misiones.
3. **Los cursos** (`/cursos`): Python desde cero, Python avanzado, TypeScript, TypeScript
   avanzado, Rust desde cero y Rust avanzado (10 lecciones × 5 retos cada uno).
4. **Los juegos** (`/juegos`): cinco juegos de recreo para repasar sin darse cuenta.

Y el **panel del profesor** (`/profesor`), que muestra cómo va el salón en el examen,
en los cursos y en los proyectos.

La regla de fondo, en todo: **se escribe, no se pega.**

## Lo último que se hizo (20 de octubre de 2026)

### Rust avanzado (`/cursos/rust-avanzado`)

A pedido del profesor: la segunda parte de Rust, como curso aparte, con el mismo formato
(10 lecciones × 5 retos, unas 5 horas) y los cuatro bloques que escogió. El contenido
está en `src/lib/cursos/rust-avanzado.ts`; los id son `rsa-N` y `rsa-N-M`. **Se abre al
terminar Rust desde cero** (campo `requiere`).

Lecciones: cada cosa tiene un dueño (mover, `.clone()`, prestar con `&`) · prestar para
cambiar (`&mut`, `*x`) · structs con `impl`, `&self` y `&mut self` · enums con datos y
`match` · `Option` (`Some`/`None`, `if let`, `get`, `unwrap_or`) · iteradores (`map`,
`filter`, `sum`, `count`, `zip`, `sort`) · textos letra por letra (`chars`, `rev`,
`split_whitespace`) · `HashMap` (`entry().or_insert`) · `Result` y el signo `?` · traits
(`impl Trait for`, `&impl Trait`, `derive(Debug)`, `Display`), cerrando con una mascota
virtual que junta struct, enum, Result y Display.

- **Mismo motor que el primero**, sin cambios: Playground por `/api/rust`. Las pruebas
  `expr` aquí pueden ser un bloque `{ … }` que arma algo y devuelve lo último.
- **Sin lifetimes** (`'a`, `'static`): el calificador quita comentarios tratando la
  comilla sencilla como inicio de texto. Las funciones devuelven `String`.
- **Pistas nuevas** en `errores-rust.ts`: dato movido (E0382), préstamo de solo lectura
  (E0596/E0594, también con `&self`), préstamos que chocan (E0502), caso que falta en un
  match (E0004, nombra el caso), falta `#[derive(Debug)]` o `Display`, `==` sin
  `PartialEq`, `?` en una función que no devuelve Result, falta `Some(…)`/`Ok(…)`, campo
  que falta o que no existe, método que falta en el `impl` o en el trait, tipo sin
  crear, y `HashMap` sin su `use`.
- **Verificado**: la llave con el `rustc` local (50 soluciones y 19 ejemplos) y
  `/verificar-curso?curso=rust-avanzado` contra el Playground: 69 de 69 en 175 s. En
  Chrome sin pantalla: candado, desbloqueo y "Sigue con 🦾 Rust avanzado".
- No hubo que tocar Supabase.

**Pendiente de ver en clase**: dueños y préstamos (L1 y L2) son lo más nuevo para ellos;
si cuestan, se pueden partir en más lecciones.

## Antes (20 de octubre de 2026): Rust desde cero

### Rust desde cero (`/cursos/rust`)

A pedido del profesor: una introducción muy básica a Rust, 10 lecciones × 5 retos (unas
4 horas y media), **abierta para todos**. El contenido está en `src/lib/cursos/rust.ts`;
los id son `rs-N` y `rs-N-M`. Lecciones: println! · variables y `mut` · tipos (`i32`,
`f64`, `bool`, `char`, `&str`, `as f64`) · cuentas (`/` entre enteros, `%`, `+=`,
`{:.1}`) · textos (`format!`, `len`, `String`, `push_str`) · preguntar y `parse` · `if`
y `match` · ciclos (`for`, `while`, `loop`) · funciones (lo que devuelve la última línea
sin `;`) · listas con `Vec`, cerrando con piedra, papel o tijera.

- **Rust no corre en el navegador**: el código se compila en el **Rust Playground
  oficial** (play.rust-lang.org), como escogió el profesor. La página llama a
  `/api/rust` (`src/app/api/rust/route.ts`), que llama al Playground, guarda en caché
  lo repetido (si el salón corre el mismo ejemplo, compila una vez) y pone límites de
  tamaño. Cada corrida tarda **un par de segundos**; el botón dice "⏳ Compilando…".
- **Riesgo a vigilar**: el Playground es un servicio gratuito de la comunidad de Rust, sin
  garantías. Si un día no contesta, el niño ve "El compilador no contestó" (no es culpa
  de su código). Si con el salón entero empieza a frenar, la salida es montar rustc
  propio (por ejemplo en un Vercel Sandbox) detrás de la misma ruta `/api/rust`.
- **Un "Comprobar" es una sola compilación**: `corredor-rust.ts` envuelve el programa
  del alumno (su `main` pasa a `main_del_alumno`) con un `main` propio que lo corre con
  cada juego de respuestas y evalúa las expresiones de la revisión (con `{:?}`), todo
  separado con marcas `\u{1}`. El envoltorio va **al final**, para que las líneas de los
  errores sean las del alumno. Para eso `calificar` ahora acepta `correr.varios` (lo da
  `correrCon(lenguaje)` en `motor.ts`); Python y TypeScript siguen igual, uno por uno.
- **preguntar("…")**: el Playground no tiene teclado, así que la arena le da al alumno
  esa función (devuelve un String con la respuesta de las cajitas). Las explicaciones
  dicen que es de la arena y no de Rust.
- **Ciclos infinitos**: un hilo del envoltorio apaga el programa a los 3 segundos; un
  chorro de texto lo corta el Playground a los 640 KB. Los dos dan su pista.
- **Pistas** en `errores-rust.ts`, por código de error (E0384 falta `mut`, E0308 tipos o
  el `;` de más al devolver, E0277 mezclar i32 con f64 o imprimir una lista con `{}`…),
  por mensaje (falta `;`, llaves sin cerrar, `{}` que no cuadran) y los vicios de
  JavaScript (`console.log`, `function`, `===`). Los `panic` también: posición que no
  existe, `parse` de algo que no es número, dividir por cero, desbordes.
- **Verificado**: la llave con el `rustc` 1.94 del computador (50 soluciones y 19
  ejemplos, y los códigos iniciales no pasan solos) y `/verificar-curso?curso=rust` en
  Chrome contra el Playground de verdad: 69 de 69 en 149 s. `?curso=` es nuevo: revisa
  un solo curso, porque el de Rust tarda.
- No hubo que tocar Supabase.

**Pendiente de ver en clase**: si los dos segundos por corrida se sienten lentos, y cómo
responde el Playground con todo el salón a la vez.

## Antes (20 de octubre de 2026): TypeScript avanzado

### TypeScript avanzado (`/cursos/typescript-avanzado`)

A pedido del profesor: la segunda parte de TypeScript, como curso aparte y con el mismo
formato (10 lecciones × 5 retos, unas 4 horas y media). El contenido está en
`src/lib/cursos/typescript-avanzado.ts`; los id son `tsa-N` y `tsa-N-M`. Se hizo en la
rama `curso-typescript-avanzado`, que sale de `curso-typescript` (el PR #4 todavía no
estaba fusionado): hay que fusionar primero el #4 y después este.

Lecciones, en los cuatro bloques que escogió el profesor:
uniones con etiqueta (L1) · `never` para que no se olvide un caso, `in` y guardianes
con `is` (L2) · `keyof`, `typeof` y `as const` (L3) · `Partial`, `Pick`, `Omit` y
`Readonly` (L4) · funciones como tipo, callbacks y fábricas (L5) · `map`, `filter` y
`reduce` (L6) · genéricos con `extends` y `K extends keyof T` (L7) · tuplas (L8, cierra
con las vecinas de una casilla del triqui) · `unknown`, `throw` y `try/catch` (L9) · el
tipo `Resultado<T>` (L10, cierra con un cajero que junta todo el curso).

- **Se abre al terminar TypeScript desde JavaScript** (campo `requiere`), igual que Python
  avanzado: candado, desbloqueo y "Sigue con 💎 TypeScript avanzado" al final del primero.
- **Las pruebas `rechaza` cargan el curso**: se probó también al revés, con soluciones
  tramposas (con `any`, un guardián que devuelve `boolean`, `return c` con la clave
  adentro, `Partial<Producto>` que deja cambiar el id…). Las 17 trampas se atajan.
  Truco útil para el guardián de L2: dentro del `if`, `v === "hola"` con un number da
  error (TS2367), y con `number | string` no.
- **Ojo con las `expr`**: se corren después de quitar los tipos, así que van en
  JavaScript puro (sin `as` ni anotaciones). Las `rechaza` sí son TypeScript.
- **Pistas nuevas** en `errores-typescript.ts`: el `never` del `default` ("Te faltó un
  caso: triangulo…"), propiedades de una unión que creó el alumno (Figura,
  `Resultado<number>`: "pregunta primero cuál es"), `T` sin regla ("ponle extends"),
  `unknown` (TS18046), posición de tupla que no existe (TS2493), regla de `extends` que no
  se cumple (TS2344), listas `readonly`, y un error lanzado sin `try` sugiere atraparlo.
- **Verificado**: la llave en Node con el TypeScript 5.9.3 de `node_modules` (76/76) y
  `/verificar-curso` en un Chrome sin pantalla: 286 revisados (los cuatro cursos), 0 con
  problemas. No se escribió un reto a mano en la página: el motor es el mismo del primero.
- No hubo que tocar Supabase.

**Pendiente de ver en clase**: L2 (`never`) y L7 (`K extends keyof T`) son los saltos más
grandes; si cuestan, se pueden partir en dos lecciones.

## Antes (19 de octubre de 2026)

### TypeScript (`/cursos/typescript`)

A pedido del profesor: "TypeScript desde JavaScript", 10 lecciones × 5 retos (unas 4
horas), **abierto para todos** (no pide terminar Python: ya saben JavaScript). El
contenido está en `src/lib/cursos/typescript.ts`; los id son `ts-N` y `ts-N-M`.
Temas: tipos básicos, inferencia y `prompt`, funciones, listas, objetos (`type` e
`interface`), opcionales y `??`, uniones y `typeof`, tipos literales y `Record`,
genéricos, y clases (`private`, `readonly`, `implements`), cerrando con una mascota.

- **Revisa los tipos con el compilador de verdad**, como pidió el profesor.
  `public/typescript/worker.js` trae del CDN TypeScript 5.9.3 (la misma versión de
  `package.json`), sus mensajes en español y los `lib.*.d.ts`; `corredor.js` revisa los
  tipos (`strict`) y, **si hay un error de tipos, no corre el programa**: ese es el
  punto del curso. Si no hay, quita los tipos y lo corre con un `console.log` y un
  `prompt` propios (`prompt` siempre devuelve `string`, sin `null`).
- **Pesa unos 1,5 MB comprimido**: la primera carga en un Chrome sin caché tardó unos
  6 segundos; después cada corrida tarda unos 10 ms. Igual que con Python, conviene
  abrir `/cursos/typescript` en cada computador antes de la clase.
- **Prueba nueva `rechaza`** (en `tipos.ts` y `calificar.ts`): pega un pedazo al final del
  programa y exige que los tipos se quejen (`saludar(5)` si saludar recibe un string).
  Así se comprueba que pusieron bien los tipos, y atrapa a quien usa `any`.
- **El motor ahora es de cualquier lenguaje**: `motor-python.ts` pasó a `motor.ts`
  (`motorDe(lenguaje)`), los tipos del calificador se llaman `Pedido`, `Resultado` y
  `ErrorDelPrograma`, y las pistas de error se reparten en `errores.ts` (Python en
  `errores-python.ts`, TypeScript en `errores-typescript.ts`, que además caza los vicios
  de Python: print, input, True).
- **El calificador quita los comentarios según el lenguaje** (`#` en Python; `//` y `/* */`
  en TypeScript, donde `#` es otra cosa).
- **Verificado**: `/verificar-curso` en Chrome dio 210 revisados (los tres cursos) y 0
  con problemas. La llave de TypeScript también se puede probar en Node con el
  `typescript` de `node_modules`, porque `corredor.js` recibe el compilador por parámetro.
- No hizo falta tocar Supabase: la columna `curso` de la tabla `cursos` es texto libre.

**Pendiente de ver en clase**: cuánto tarda la primera carga con el internet del
colegio, y si los errores de tipos se entienden (el título y la pista son nuestros, el
renglón pequeño es el mensaje del compilador).

## Antes (14 de octubre de 2026)

### Python avanzado (`/cursos/python-avanzado`)

A pedido del profesor: la segunda parte, como curso aparte, con el mismo formato
(10 lecciones × 5 retos, unas 4 horas y media). El contenido está en
`src/lib/cursos/python-avanzado.ts`; los id son `pya-N` y `pya-N-M`, para no chocar
con los de la primera parte.

Lecciones: listas a fondo (rebanadas, in, sort, remove/pop, enumerate) · texto a fondo
(split, join, replace, count) · diccionarios · recorrer diccionarios (items, contar,
listas de diccionarios) · tuplas y tableros (cierra con un `gano()` de triqui) · listas
en una línea (comprensiones) · funciones a fondo (valores por defecto, devolver varios,
lo local) · recursión · try/except con random y math · clases (cierra con una mascota
virtual).

- **Se abre al terminar Python desde cero** (campo `requiere` del curso). Se mira el
  avance del primer curso en el navegador y, si ahí no está completo, en la nube, por si
  el alumno lo terminó en otro computador. Cerrado, el mapa y las lecciones muestran
  un candado con el botón para ir al primero; `/cursos` avisa con "🔒 Se abre al
  terminar…". Al terminar el primero, la tarjeta final ofrece "Sigue con 🚀 Python
  avanzado".
- **El azar no rompe la revisión:** los retos con random (el dado, la jugada de la
  compu) se prueban llamando la función cientos de veces y mirando que salga de todo y
  nada por fuera.
- **Las clases se prueban desde una expresión** con un `lambda` que crea el objeto,
  llama los métodos y devuelve lo último (ver `enMascota`).
- **Pistas de error nuevas** en `errores-python.ts`: KeyError, `perro.nombre` en un
  diccionario, llaves sin comillas, `this`, `new`, métodos sin self, `__init__` mal
  escrito, falta `import random`, `randint` sin `random.`, tuplas y textos que no se
  cambian, None después de `sort()`, desempacar de más o de menos, variables locales y
  recursión sin caso base. Además, un diccionario que sigue en el otro renglón (`d = {`)
  ya no se confunde con una llave de JavaScript.
- **No hubo que tocar Supabase:** la tabla `cursos` ya guarda un renglón por alumno y por
  curso, y el panel del profesor muestra la tabla nueva solo.

Se probó: `/verificar-curso` da 141 de 141 (los 68 de antes, más 50 soluciones y 23
ejemplos nuevos), las pistas de error contra los errores reales de Pyodide, y en un
Chromium sin pantalla el candado, el desbloqueo y un reto escrito a mano (primero mal y
después bien). Falta: **probarlo con niños**, sobre todo recursión (L8) y clases (L10),
que son los saltos más grandes; si cuestan mucho, se pueden partir en dos lecciones.

## Lo que se hizo el 2 de octubre de 2026

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
src/lib/cursos/         Los cursos: python.ts, python-avanzado.ts y typescript.ts (contenido), calificar.ts, errores*.ts, motor.ts
public/python/          El worker de Pyodide y corredor.py, que ejecuta el código del alumno
public/typescript/      El worker del compilador de TypeScript y corredor.js, que revisa los tipos y corre el código
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
