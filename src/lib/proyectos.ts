/**
 * Proyectos guiados, al estilo de CodePen: el alumno ve el código terminado y
 * el resultado funcionando, y tiene que volver a escribirlo con sus dedos en su
 * propia terminal. No hay copiar y pegar: el modelo no se deja seleccionar y la
 * terminal rechaza cualquier pegado (ver Terminal.tsx).
 *
 * Después de replicarlo vienen las misiones: cambios pequeños al proyecto que
 * obligan a entender qué línea hace qué. Cada misión se revisa ejecutando el
 * proyecto del alumno de verdad dentro de un iframe aislado.
 */

/**
 * El cambio exacto que resuelve una misión, escrito como un reemplazo de texto.
 * Solo lo usa /verificar-proyecto, la página de autodiagnóstico: sirve para
 * comprobar que la misión SÍ se puede pasar y que su revisión mide lo que dice.
 * El alumno nunca lo ve.
 */
export type Parche = { lang: 'html' | 'css' | 'js'; de: string; a: string }

/** Algo que hacemos sobre la página del alumno ANTES de revisar (un clic, por ejemplo). */
export type Accion = { t: 'clic'; sel: string; veces?: number }

export type PruebaProyecto =
  /** Existe al menos un elemento con ese selector. */
  | { t: 'existe'; sel: string; msg: string }
  /** El texto del elemento es / contiene / NO es algo. */
  | { t: 'texto'; sel: string; eq?: string; has?: string; not?: string; msg: string }
  /** Estilo ya calculado por el navegador: acepta red, #ff0000 y rgb(255,0,0) como lo mismo. */
  | { t: 'estilo'; sel: string; prop: string; eq?: string; oneOf?: string[]; msg: string }
  /** El elemento queda con el mismo aire a izquierda y derecha: está centrado. */
  | { t: 'centrado'; sel: string; msg: string }

export interface Mision {
  id: string
  titulo: string
  /** Lo que hay que lograr. No se puede copiar. */
  enunciado: string
  /** Se destapa cuando el alumno la pide. */
  pista: string
  acciones?: Accion[]
  pruebas: PruebaProyecto[]
  /** Cómo se resuelve. Solo para el autodiagnóstico del profesor. */
  parches?: Parche[]
}

export interface Proyecto {
  id: string
  titulo: string
  lema: string
  descripcion: string
  html: string
  css: string
  js: string
  misiones: Mision[]
}

const HTML = `<div class="tarjeta">
  <h1 id="titulo">¡Hola, soy Ana!</h1>
  <p class="frase">Estoy aprendiendo a programar.</p>
  <button id="boton">Dame un clic</button>
  <p id="marcador">Clics: 0</p>
</div>`

const CSS = `body {
  background: #0f172a;
  font-family: Arial, sans-serif;
}
.tarjeta {
  width: 260px;
  margin: 30px;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  text-align: center;
}
h1 {
  color: #2563eb;
}
button {
  background: #22c55e;
  border: none;
  padding: 10px 16px;
}`

const JS = `const boton = document.getElementById("boton");
const marcador = document.getElementById("marcador");
let clics = 0;

boton.addEventListener("click", function () {
  clics = clics + 1;
  marcador.textContent = "Clics: " + clics;
  if (clics === 5) {
    marcador.textContent = "¡Llegaste a 5 clics!";
  }
});`

export const PROYECTO_1: Proyecto = {
  id: 'p1',
  titulo: 'La tarjeta que saluda',
  lema: 'Proyecto 1 · HTML + CSS + JavaScript trabajando juntos',
  descripcion:
    'Una tarjeta blanca con tu saludo y un botón que cuenta los clics. Tres lenguajes, tres oficios: el HTML pone las cosas, el CSS las viste y el JavaScript las hace reaccionar.',
  html: HTML,
  css: CSS,
  js: JS,
  misiones: [
    {
      id: 'm1',
      titulo: 'Réplica exacta',
      enunciado:
        'Escribe los tres archivos hasta que tu resultado se vea igual al modelo y el botón cuente los clics. Nada de inventar todavía: esta misión es copiar con los dedos, no con el mouse.',
      parches: [],
      pista:
        'Ve de arriba hacia abajo y de a un archivo: primero todo el HTML, luego todo el CSS, al final el JavaScript. Dale a “Ver resultado” cada tanto para no acumular errores.',
      acciones: [{ t: 'clic', sel: '#boton', veces: 2 }],
      pruebas: [
        { t: 'existe', sel: '.tarjeta', msg: 'Falta el div con class="tarjeta"' },
        { t: 'texto', sel: '#titulo', eq: '¡Hola, soy Ana!', msg: 'El h1 con id="titulo" debe decir: ¡Hola, soy Ana!' },
        { t: 'texto', sel: '.frase', eq: 'Estoy aprendiendo a programar.', msg: 'Falta el párrafo con class="frase" y su texto' },
        { t: 'texto', sel: '#boton', eq: 'Dame un clic', msg: 'Falta el botón con id="boton" que dice: Dame un clic' },
        { t: 'existe', sel: '#marcador', msg: 'Falta el párrafo con id="marcador"' },
        { t: 'estilo', sel: 'body', prop: 'background-color', eq: '#0f172a', msg: 'El fondo de la página debe ser #0f172a' },
        { t: 'estilo', sel: '.tarjeta', prop: 'background-color', eq: '#ffffff', msg: 'La tarjeta debe ser blanca (#ffffff)' },
        { t: 'estilo', sel: '.tarjeta', prop: 'width', eq: '260px', msg: 'La tarjeta debe medir 260px de ancho' },
        { t: 'estilo', sel: '.tarjeta', prop: 'border-radius', eq: '16px', msg: 'A la tarjeta le faltan las esquinas redondeadas de 16px' },
        { t: 'estilo', sel: '#titulo', prop: 'color', eq: '#2563eb', msg: 'El título debe ser azul (#2563eb)' },
        { t: 'estilo', sel: '#boton', prop: 'background-color', eq: '#22c55e', msg: 'El botón debe ser verde (#22c55e)' },
        { t: 'texto', sel: '#marcador', eq: 'Clics: 2', msg: 'Le di 2 clics a tu botón y el marcador no dice “Clics: 2”: revisa tu JavaScript' },
      ],
    },
    {
      id: 'm2',
      titulo: 'Ponle tu nombre',
      enunciado:
        'Esa tarjeta es de Ana y tú no eres Ana. Cambia el título para que salude con TU nombre. Tiene que seguir empezando por “¡Hola, soy ”.',
      parches: [{ lang: 'html', de: '¡Hola, soy Ana!', a: '¡Hola, soy Pablo!' }],
      pista: 'El texto que se ve en la página es el que está entre <h1 …> y </h1>. Cambia solo eso, en tu archivo HTML.',
      pruebas: [
        { t: 'texto', sel: '#titulo', has: 'Hola, soy', msg: 'El título debe seguir empezando por: ¡Hola, soy' },
        { t: 'texto', sel: '#titulo', not: '¡Hola, soy Ana!', msg: 'Todavía dice Ana: pon tu propio nombre' },
      ],
    },
    {
      id: 'm3',
      titulo: 'Píntalo de rojo',
      enunciado: 'El título ya no es azul: ahora es rojo. Usa el color red.',
      parches: [{ lang: 'css', de: 'color: #2563eb', a: 'color: red' }],
      pista: 'En el CSS busca la regla h1. La propiedad que manda el color de la letra es color.',
      pruebas: [
        { t: 'estilo', sel: '#titulo', prop: 'color', oneOf: ['red', '#ff0000', '#dc2626'], msg: 'El título todavía no es rojo' },
      ],
    },
    {
      id: 'm4',
      titulo: 'Centra la tarjeta',
      enunciado:
        'La tarjeta está pegada a la izquierda. Ponla justo en la mitad de la página, con el mismo aire a lado y lado.',
      parches: [{ lang: 'css', de: 'margin: 30px', a: 'margin: 30px auto' }],
      pista: 'En .tarjeta cambia margin: 30px por margin: 30px auto. Ese auto significa “repártete el espacio que sobra por igual”.',
      pruebas: [{ t: 'centrado', sel: '.tarjeta', msg: 'La tarjeta no está centrada: le sobra más espacio de un lado que del otro' }],
    },
    {
      id: 'm5',
      titulo: 'Botón morado',
      enunciado: 'Cambia el color de fondo del botón a morado. El morado exacto es #7c3aed.',
      parches: [{ lang: 'css', de: 'background: #22c55e', a: 'background: #7c3aed' }],
      pista: 'La regla button tiene background: #22c55e. El numerito con almohadilla es el color.',
      pruebas: [{ t: 'estilo', sel: '#boton', prop: 'background-color', eq: '#7c3aed', msg: 'El fondo del botón todavía no es #7c3aed' }],
    },
    {
      id: 'm6',
      titulo: 'La sorpresa llega antes',
      enunciado:
        'Tu programa esconde un mensaje sorpresa que aparece a los 5 clics. Haz que aparezca a los 3, y que el mensaje diga: ¡Llegaste a 3 clics!',
      parches: [
        { lang: 'js', de: 'clics === 5', a: 'clics === 3' },
        { lang: 'js', de: 'Llegaste a 5 clics', a: 'Llegaste a 3 clics' },
      ],
      pista: 'En el JavaScript hay un if que compara clics === 5. Hay dos cincos que cambiar: el de la comparación y el del mensaje.',
      acciones: [{ t: 'clic', sel: '#boton', veces: 3 }],
      pruebas: [
        { t: 'texto', sel: '#marcador', has: 'Llegaste a 3', msg: 'Después de 3 clics el marcador debería decir: ¡Llegaste a 3 clics!' },
      ],
    },
  ],
}

export const PROYECTOS = [PROYECTO_1]

/** Aplica los parches de una misión sobre el código. Solo para el autodiagnóstico. */
export function aplicarParches(codigo: Record<'html' | 'css' | 'js', string>, parches: Parche[] = []) {
  const salida = { ...codigo }
  for (const p of parches) salida[p.lang] = salida[p.lang].replace(p.de, p.a)
  return salida
}
