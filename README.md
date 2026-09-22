# Arena de Código

Examen de HTML, CSS y JavaScript para el salón, en formato tipo CodeWars: **75 retos**
(25 de HTML, 25 de CSS y 25 de JavaScript), de lo más fácil a lo más difícil, sacados
de las guías 1, 2 y 3 que están en `guias/`.

La idea de fondo es una sola: **se escribe, no se pega.** Los alumnos pueden
preguntarle a quien quieran —a un compañero o a una inteligencia artificial— pero la
pregunta y la respuesta las teclean ellos. Eso es lo que se queda.

---

## Arrancar

```bash
npm install
npm run dev
```

Y abrir <http://localhost:3000>.

Así de simple funciona ya: el progreso se guarda en el navegador de cada alumno. Para
que además sobreviva a cambiar de computador y para tener panel de profesor, hay que
conectar Supabase (ver abajo).

## Las pantallas

| Ruta | Para qué |
|---|---|
| `/` | El alumno escribe su nombre y entra. Ese nombre es su llave. |
| `/examen` | El examen. Enunciado, terminal y resultado. |
| `/proyecto` | Índice de los proyectos guiados, con el avance de cada uno. |
| `/proyecto/p1` … `/proyecto/p8` | El taller: código del modelo, terminal del alumno y misiones. |
| `/profesor` | Panel del profesor. Pide la clave de `PROFESOR_CLAVE`. |
| `/juegos` | Los tres juegos de recreo: triqui, parejas e invasores. |
| `/verificar` | Autodiagnóstico: corre las 75 soluciones de referencia contra sus propias pruebas. |
| `/verificar-proyecto` | Autodiagnóstico de los proyectos guiados: resuelve sus 58 misiones y las revisa. |

Las dos pantallas de `/verificar` valen la pena cada vez que se toque una pregunta o
una misión: si algo sale en rojo, eso quedó imposible de resolver o su prueba no mide
lo que dice.

## Los proyectos guiados

Es lo más parecido a CodePen que hay aquí, con una diferencia: **el código del modelo
no se puede seleccionar ni copiar**. A la izquierda el alumno ve el proyecto terminado
—alrededor de 20 líneas de HTML, de CSS y de JavaScript— y abajo el resultado
funcionando, con sus botones y todo. A la derecha tiene su propia terminal, la misma
del examen, que rechaza cualquier pegado. La única forma de avanzar es teclearlo.

Cuando lo replica, empiezan las misiones, y ahí es donde se aprende: son cambios
pequeños que solo salen si entendió qué línea hace qué.

| # | Proyecto | Qué enseña | Misiones |
|---|---|---|---|
| 1 | La tarjeta que saluda | Etiquetas, colores, centrar con `margin: auto`, un contador de clics | 6 |
| 2 | La lista de tareas | Leer un `input`, crear elementos con JavaScript, flexbox, singular/plural, la tecla Enter | 7 |
| 3 | La calculadora de la cuenta | `Number()`, un `select`, validar con `if`, `classList`, `Math.round`, calcular mientras se escribe | 7 |
| 4 | El quiz | Un arreglo de objetos, `forEach`, un índice que avanza, `hidden`, porcentajes, arreglar un botón que rompe el juego | 8 |
| 5 | La tiendita con carrito | Estado en un arreglo, plantillas con `${}`, `data-*` y delegación, `map`/`find`/`filter`/`reduce`, `toLocaleString`, un cupón | 8 |
| 6 | El cronómetro | `setInterval` y `clearInterval`, `padStart`, `disabled`, `prepend`, un atajo con `document.addEventListener`, `classList.toggle` | 7 |
| 7 | Tres en raya | El tablero como arreglo, líneas ganadoras con `find`/`every`/`includes`, desestructurar, marcador, deshacer con un historial, una pista | 7 |
| 8 | El juego de memoria | Barajar, un estado que se vigila (`primera`, `bloqueado`), `setTimeout`, un reloj que arranca y para, nueva partida, récord y niveles | 8 |

Cada misión se revisa **ejecutando el proyecto del alumno de verdad**: se monta en la
ventanita, se usa como lo usaría una persona —escribir en el cuadro, dar clics,
presionar Enter— y después se mide el resultado: texto, estilo calculado, cuántos
elementos hay, qué quedó escrito en un input, si lleva una clase, si la caja está centrada.

Los temporizadores tienen truco. En la vista previa son de verdad y el cronómetro corre;
en la revisión son de mentira, y la acción `esperar` adelanta el reloj de golpe, disparando
en orden los `setTimeout` y `setInterval` que tocaban. Así “esperar un minuto” tarda un
instante y da siempre el mismo resultado. Como la ventanita se reutiliza entre corridas,
al montar un proyecto se barren los temporizadores y los listeners de `document` y
`window` que dejó el anterior.

Esa revisión corre en la misma ventana donde el alumno ve su resultado, y no en un
iframe escondido: Chrome no le da maquetación a un iframe invisible o fuera de la
pantalla, y ahí toda medida da cero. De paso, el alumno ve los clics que le dio la
revisión.

Los proyectos y sus misiones viven en `src/lib/proyectos.ts`; agregar uno nuevo es
agregar otro objeto a ese archivo (la ruta `/proyecto/<id>` y el índice se arman
solos). Cada misión guarda además el cambio exacto que la resuelve (`parches`), y eso
es lo que le permite a `/verificar-proyecto` comprobar que todas se pueden pasar.

## Cómo se califica

No se compara texto contra texto: **el código del alumno se ejecuta de verdad** dentro
de un iframe aislado (`public/runner.html`, con `sandbox="allow-scripts"` y sin
`allow-same-origin`, o sea en un origen opaco que no ve ni cookies ni la app), y sobre
el resultado se corren pruebas declarativas.

Eso significa que cualquier solución válida pasa, no solo la que se nos ocurrió a
nosotros. Los tipos de prueba están en `src/lib/types.ts`:

- **HTML** — se parsea el documento con `DOMParser`, así que se puede exigir el
  `<!DOCTYPE>`, el `head`, el `title` y el `charset` de verdad.
- **CSS** — se monta un HTML fijo, se le inyecta el CSS del alumno y se lee el estilo
  *calculado*. El valor esperado se normaliza pasándolo por el mismo motor, así `red`,
  `#FF0000` y `rgb(255,0,0)` cuentan como iguales, y un borde de `2px` se compara
  contra lo que ese monitor de verdad dibuja. También se leen las reglas escritas, que
  es la única forma de calificar `:hover` y lo que vive dentro de un `@media`.
- **JavaScript** — el código corre y después las pruebas evalúan expresiones **en su
  mismo ámbito**: `sumar(5, 3)`, `esPar(101)`, `mayor(-8, -3)`. Se llama a las
  funciones del alumno con datos que él nunca vio, se simulan clics reales y se revisa
  la consola. Acertar de casualidad no alcanza.

Un ciclo infinito no cuelga la pestaña: el iframe se destruye a los 4 segundos y el
alumno recibe un mensaje que se entiende.

## El bloqueo de copiar y pegar

- **El enunciado** no se puede seleccionar, copiar ni arrastrar (`user-select: none`
  más los eventos bloqueados).
- **La terminal** rechaza pegar en tres capas: `beforeinput` (atrapa el pegado del
  celular, el del clic derecho y el del botón del medio en Linux), los eventos
  `paste`/`drop`, y un filtro de transacciones de CodeMirror que ve cualquier insertazo
  que nadie tecleó. También se cuenta cuántas teclas escribió en cada reto, y ese
  número le queda visible al profesor.

**Sé honesto con esto:** no es a prueba de balas y no pretende serlo. Quien abra las
herramientas de desarrollo se lo salta, y las soluciones de referencia viajan en el
código que se descarga el navegador. Pero incluso en el peor caso el alumno **tiene que
escribir la respuesta con los dedos**, que es justamente lo que queríamos que hiciera.

## Los comodines

Tres por sección (3 en HTML, 3 en CSS, 3 en JS). En cada uso el alumno escoge:

| Comodín | Qué hace | Cuesta |
|---|---|---|
| 💡 Pista | Un empujón, sin dar la respuesta | −25% de los puntos |
| 🦴 Media respuesta | El esqueleto del código, con huecos que él llena | −50% de los puntos |
| ⏭️ Saltar | Pasa al siguiente | 0 puntos, queda marcado como no resuelto |

Los puntos base van de 100 (fácil) a 350 (difícil), con +50% por acertar al primer
intento y un multiplicador por racha. La racha se rompe al fallar o al pedir ayuda.

## Dónde vamos

En `docs/ESTADO.md` está el estado del proyecto: lo último que se hizo, lo que falta y
el mapa del código.

## Conectar Supabase (opcional)

1. Crear un proyecto en [supabase.com](https://supabase.com).
2. **SQL Editor → New query**, pegar `supabase/schema.sql` y darle Run.
3. Copiar `.env.example` a `.env.local` y llenarlo:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
PROFESOR_CLAVE=inventate-una
```

4. Reiniciar el servidor.

Las dos tablas van con RLS activo y **sin políticas**: nadie puede tocarlas desde el
navegador. Solo las rutas de API del servidor tienen acceso. Es a propósito: como los
alumnos entran solo con un nombre y sin contraseña, si el navegador pudiera escribir,
cualquiera podría editar el progreso de cualquier otro.

Si Supabase no está configurado, la app no se rompe: guarda todo en `localStorage` y
el panel del profesor avisa que no hay nada en la nube.

## Tocar las preguntas

Cada reto vive en `src/lib/challenges/{html,css,js}.ts` y se explica solo:

```ts
{
  id, lang, n,        // 'html-07', 'html', 7
  title, brief, goal, // lo que ve el alumno (y no puede copiar)
  starter,            // lo que aparece escrito en la terminal
  html,               // el HTML fijo, para los retos de CSS y de JS con DOM
  hint, skeleton,     // las dos primeras ayudas
  solution,           // la solución de referencia, la usa /verificar
  tests,              // cómo se califica
}
```

Después de cambiar cualquier cosa, correr `/verificar`.
