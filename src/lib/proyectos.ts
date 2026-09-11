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

/** Algo que le hacemos a la página del alumno ANTES de revisar, como lo haría un usuario. */
export type Accion =
  /** Clic en el primer elemento que coincida. */
  | { t: 'clic'; sel: string; veces?: number }
  /** Escribe en un input, como si lo tecleara alguien (dispara el evento input). */
  | { t: 'escribir'; sel: string; texto: string }
  /** Presiona una tecla sobre un elemento (keydown, keypress y keyup). */
  | { t: 'tecla'; sel: string; key: string }

export type PruebaProyecto =
  /** Existe al menos un elemento con ese selector. */
  | { t: 'existe'; sel: string; msg: string }
  /** Cuántos elementos hay. Sirve para listas que el JavaScript va creando. */
  | { t: 'conteo'; sel: string; eq: number; msg: string }
  /** El texto del elemento es / contiene / NO es algo. */
  | { t: 'texto'; sel: string; eq?: string; has?: string; not?: string; msg: string }
  /** Lo que tiene escrito adentro un input. */
  | { t: 'valor'; sel: string; eq: string; msg: string }
  /** Un atributo del HTML: placeholder, type, href… */
  | { t: 'atributo'; sel: string; name: string; eq?: string; has?: string; msg: string }
  /**
   * Estilo ya calculado por el navegador: acepta red, #ff0000 y rgb(255,0,0) como lo
   * mismo. Sin eq / oneOf / has, basta con que la propiedad tenga algún valor de
   * verdad (así se pide una sombra sin exigir una sombra exacta).
   */
  | { t: 'estilo'; sel: string; prop: string; eq?: string; oneOf?: string[]; has?: string; msg: string }
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
  /** Número que se ve: “Proyecto 2”. */
  numero: number
  titulo: string
  /** Qué tan duro está. Se muestra en el índice. */
  nivel: string
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
  numero: 1,
  titulo: 'La tarjeta que saluda',
  nivel: 'Para empezar',
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

/* ========================================================================== */
/* Proyecto 2 — más largo y con más piezas móviles que el primero:            */
/* un input que se lee, elementos que nacen desde JavaScript, una lista que   */
/* crece y se borra sola, y flexbox de verdad.                                */
/* ========================================================================== */

const HTML_2 = `<div class="caja">
  <h2 id="titulo">Mi lista</h2>
  <div class="fila">
    <input id="texto" placeholder="¿Qué tienes que hacer?">
    <button id="agregar">Agregar</button>
  </div>
  <ul id="lista"></ul>
  <p id="contador">0 tareas</p>
</div>`

const CSS_2 = `body {
  background: #111827;
  font-family: Arial, sans-serif;
}
.caja {
  width: 320px;
  margin: 24px auto;
  padding: 20px;
  background: #ffffff;
}
.fila {
  display: flex;
  gap: 8px;
}
#lista li {
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
}
#lista li:hover {
  background: #fef3c7;
}`

const JS_2 = `const entrada = document.getElementById("texto");
const boton = document.getElementById("agregar");
const lista = document.getElementById("lista");
const contador = document.getElementById("contador");

function agregar() {
  const texto = entrada.value.trim();
  if (texto === "") return;
  const item = document.createElement("li");
  item.textContent = texto;
  item.addEventListener("click", function () {
    item.remove();
    actualizar();
  });
  lista.appendChild(item);
  entrada.value = "";
  actualizar();
}

function actualizar() {
  contador.textContent = lista.children.length + " tareas";
}

boton.addEventListener("click", agregar);`

export const PROYECTO_2: Proyecto = {
  id: 'p2',
  numero: 2,
  titulo: 'La lista de tareas',
  nivel: 'Un poco más difícil',
  lema: 'Proyecto 2 · Leer lo que el usuario escribe y crear cosas con JavaScript',
  descripcion:
    'Escribes una tarea, le das a Agregar y aparece en la lista; le das clic a una tarea y se borra; abajo, un contador que siempre sabe cuántas van. Aquí el JavaScript ya no cambia un texto: crea elementos nuevos y los mete en la página.',
  html: HTML_2,
  css: CSS_2,
  js: JS_2,
  misiones: [
    {
      id: 'm1',
      titulo: 'Réplica exacta',
      enunciado:
        'Escribe los tres archivos hasta que tu lista funcione igual que el modelo: agregar una tarea, verla aparecer, hacerle clic para borrarla y que el contador te siga el paso. Otra vez: copiar con los dedos, no con el mouse.',
      pista:
        'Empieza por el HTML completo, sigue con el CSS y deja el JavaScript de último: es el más largo. Dale a “Ver mi resultado” cada tanto y prueba tú mismo el botón antes de comprobar.',
      parches: [],
      acciones: [
        { t: 'escribir', sel: '#texto', texto: 'Sacar la basura' },
        { t: 'clic', sel: '#agregar' },
        { t: 'escribir', sel: '#texto', texto: 'Estudiar CSS' },
        { t: 'clic', sel: '#agregar' },
        { t: 'clic', sel: '#lista li' },
      ],
      pruebas: [
        { t: 'existe', sel: '.caja', msg: 'Falta el div con class="caja"' },
        { t: 'texto', sel: '#titulo', eq: 'Mi lista', msg: 'El h2 con id="titulo" debe decir: Mi lista' },
        { t: 'existe', sel: '.fila', msg: 'Falta el div con class="fila" que envuelve el cuadro y el botón' },
        { t: 'atributo', sel: '#texto', name: 'placeholder', eq: '¿Qué tienes que hacer?', msg: 'Al input con id="texto" le falta su placeholder' },
        { t: 'texto', sel: '#agregar', eq: 'Agregar', msg: 'Falta el botón con id="agregar" que dice: Agregar' },
        { t: 'existe', sel: 'ul#lista', msg: 'Falta la lista vacía: <ul id="lista"></ul>' },
        { t: 'estilo', sel: 'body', prop: 'background-color', eq: '#111827', msg: 'El fondo de la página debe ser #111827' },
        { t: 'estilo', sel: '.caja', prop: 'width', eq: '320px', msg: 'La caja debe medir 320px de ancho' },
        { t: 'estilo', sel: '.fila', prop: 'display', eq: 'flex', msg: 'La fila necesita display: flex para poner el cuadro y el botón lado a lado' },
        { t: 'estilo', sel: '.fila', prop: 'column-gap', eq: '8px', msg: 'A la fila le falta el gap: 8px de separación' },
        { t: 'conteo', sel: '#lista li', eq: 1, msg: 'Agregué dos tareas y le di clic a la primera: debería quedar una sola en la lista' },
        { t: 'texto', sel: '#lista li', eq: 'Estudiar CSS', msg: 'La tarea que queda debería ser la segunda que escribí: Estudiar CSS' },
        { t: 'estilo', sel: '#lista li', prop: 'border-bottom-color', eq: '#e5e7eb', msg: 'Cada tarea lleva una rayita abajo: border-bottom de 1px sólido #e5e7eb' },
        { t: 'texto', sel: '#contador', eq: '1 tareas', msg: 'Con una tarea en la lista, el contador debería decir: 1 tareas' },
        { t: 'valor', sel: '#texto', eq: '', msg: 'Después de agregar, el cuadro de texto tiene que quedar vacío' },
      ],
    },
    {
      id: 'm2',
      titulo: 'Habla como tú',
      enunciado:
        'Cambia dos textos del HTML: el botón ahora dice “Agregar tarea”, y el cuadro de escribir sugiere “¿Qué hay que hacer hoy?” cuando está vacío.',
      pista:
        'El texto del botón va entre <button …> y </button>. Lo que se ve en gris dentro del cuadro vacío es el atributo placeholder del input.',
      parches: [
        { lang: 'html', de: '>Agregar<', a: '>Agregar tarea<' },
        { lang: 'html', de: '¿Qué tienes que hacer?', a: '¿Qué hay que hacer hoy?' },
      ],
      pruebas: [
        { t: 'texto', sel: '#agregar', eq: 'Agregar tarea', msg: 'El botón debe decir exactamente: Agregar tarea' },
        { t: 'atributo', sel: '#texto', name: 'placeholder', eq: '¿Qué hay que hacer hoy?', msg: 'El placeholder debe decir: ¿Qué hay que hacer hoy?' },
      ],
    },
    {
      id: 'm3',
      titulo: 'Más ancha y con sombra',
      enunciado:
        'La caja queda apretada. Hazla de 380px de ancho y ponle una sombra por debajo para que parezca despegada del fondo.',
      pista:
        'El ancho es la propiedad width de .caja. La sombra se llama box-shadow y se escribe con cuatro datos: hacia el lado, hacia abajo, qué tan borrosa y de qué color. Por ejemplo: box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);',
      parches: [
        { lang: 'css', de: 'width: 320px', a: 'width: 380px' },
        { lang: 'css', de: '  background: #ffffff;\n}', a: '  background: #ffffff;\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);\n}' },
      ],
      pruebas: [
        { t: 'estilo', sel: '.caja', prop: 'width', eq: '380px', msg: 'La caja todavía no mide 380px' },
        { t: 'estilo', sel: '.caja', prop: 'box-shadow', msg: 'La caja todavía no tiene ninguna sombra' },
      ],
    },
    {
      id: 'm4',
      titulo: 'Que el cuadro se estire',
      enunciado:
        'El cuadro de escribir es chiquito y al lado le sobra espacio. Haz que se estire y se quede con todo el espacio libre de la fila, sin tocar el tamaño del botón.',
      pista:
        'Dentro de un contenedor flex, el hijo que lleva flex: 1 se queda con lo que sobra. Crea una regla nueva para #texto con esa sola línea.',
      parches: [{ lang: 'css', de: '  gap: 8px;\n}', a: '  gap: 8px;\n}\n#texto {\n  flex: 1;\n}' }],
      pruebas: [
        { t: 'estilo', sel: '#texto', prop: 'flex-grow', eq: '1', msg: 'Al cuadro de texto le falta el flex: 1 que lo hace crecer' },
      ],
    },
    {
      id: 'm5',
      titulo: 'Una tarea, no una tareas',
      enunciado:
        'Cuando queda una sola tarea, el contador dice “1 tareas” y suena feo. Arréglalo: con una debe decir “1 tarea” y con dos o más, “2 tareas”, “3 tareas”…',
      pista:
        'Adentro de actualizar, guarda el número en una variable y decide el texto con un if: si es 1, la palabra va en singular; si no, en plural.',
      parches: [
        {
          lang: 'js',
          de: '  contador.textContent = lista.children.length + " tareas";',
          a: '  const n = lista.children.length;\n  if (n === 1) {\n    contador.textContent = "1 tarea";\n  } else {\n    contador.textContent = n + " tareas";\n  }',
        },
      ],
      acciones: [
        { t: 'escribir', sel: '#texto', texto: 'Sacar la basura' },
        { t: 'clic', sel: '#agregar' },
        { t: 'escribir', sel: '#texto', texto: 'Estudiar CSS' },
        { t: 'clic', sel: '#agregar' },
        { t: 'clic', sel: '#lista li' },
      ],
      pruebas: [
        { t: 'conteo', sel: '#lista li', eq: 1, msg: 'Agregué dos tareas y borré una: debería quedar una' },
        { t: 'texto', sel: '#contador', eq: '1 tarea', msg: 'Con una sola tarea el contador debe decir: 1 tarea' },
      ],
    },
    {
      id: 'm6',
      titulo: 'Tachar en vez de borrar',
      enunciado:
        'Borrar una tarea al primer clic es muy bruto: si te equivocas, se perdió. Cambia el comportamiento: al hacerle clic, la tarea se queda en la lista pero aparece tachada.',
      pista:
        'Donde hoy dice item.remove(), pon en su lugar item.style.textDecoration = "line-through"; Tachar no cambia cuántas tareas hay, así que el contador se queda igual.',
      parches: [{ lang: 'js', de: '    item.remove();', a: '    item.style.textDecoration = "line-through";' }],
      acciones: [
        { t: 'escribir', sel: '#texto', texto: 'Sacar la basura' },
        { t: 'clic', sel: '#agregar' },
        { t: 'clic', sel: '#lista li' },
      ],
      pruebas: [
        { t: 'conteo', sel: '#lista li', eq: 1, msg: 'Le di clic a la tarea y desapareció: ahora tiene que quedarse' },
        { t: 'estilo', sel: '#lista li', prop: 'text-decoration-line', eq: 'line-through', msg: 'La tarea que recibió el clic debería quedar tachada' },
        { t: 'texto', sel: '#contador', eq: '1 tarea', msg: 'Tachar no borra: el contador debe seguir diciendo 1 tarea' },
      ],
    },
    {
      id: 'm7',
      titulo: 'Con Enter también',
      enunciado:
        'Nadie que escriba rápido quiere soltar el teclado para buscar el botón. Haz que al presionar Enter dentro del cuadro, la tarea se agregue igual que si hubieran hecho clic en Agregar.',
      pista:
        'Escucha el evento keydown del cuadro: entrada.addEventListener("keydown", function (e) { … }). Adentro, revisa si e.key es "Enter" y, si lo es, llama a la función agregar que ya tienes escrita.',
      parches: [
        {
          lang: 'js',
          de: 'boton.addEventListener("click", agregar);',
          a: 'boton.addEventListener("click", agregar);\n\nentrada.addEventListener("keydown", function (e) {\n  if (e.key === "Enter") {\n    agregar();\n  }\n});',
        },
      ],
      acciones: [
        { t: 'escribir', sel: '#texto', texto: 'Tender la cama' },
        { t: 'tecla', sel: '#texto', key: 'Enter' },
      ],
      pruebas: [
        { t: 'conteo', sel: '#lista li', eq: 1, msg: 'Escribí una tarea y presioné Enter, pero no se agregó nada' },
        { t: 'texto', sel: '#lista li', eq: 'Tender la cama', msg: 'La tarea agregada con Enter debería decir: Tender la cama' },
      ],
    },
  ],
}

export const PROYECTOS: Proyecto[] = [PROYECTO_1, PROYECTO_2]

export function proyectoPorId(id: string) {
  return PROYECTOS.find((p) => p.id === id)
}

/** Aplica los parches de una misión sobre el código. Solo para el autodiagnóstico. */
export function aplicarParches(codigo: Record<'html' | 'css' | 'js', string>, parches: Parche[] = []) {
  const salida = { ...codigo }
  for (const p of parches) salida[p.lang] = salida[p.lang].replace(p.de, p.a)
  return salida
}
