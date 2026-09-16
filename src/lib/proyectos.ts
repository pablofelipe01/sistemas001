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
  /**
   * Deja pasar tiempo. En la revisión los temporizadores son de mentira: esto
   * adelanta el reloj de golpe y dispara los setTimeout y setInterval que tocaban.
   */
  | { t: 'esperar'; ms: number }

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
  /** El elemento lleva (o, con tiene: false, NO lleva) una clase de CSS. */
  | { t: 'clase'; sel: string; name: string; tiene?: boolean; msg: string }
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

/* ========================================================================== */
/* Proyecto 3 — números de verdad: leer inputs como números, un select,       */
/* validar antes de calcular y prender o apagar una clase de CSS desde JS.    */
/* ========================================================================== */

const HTML_3 = `<div class="calculadora">
  <h2>¿Cuánto nos toca?</h2>
  <label for="cuenta">Valor de la cuenta</label>
  <input id="cuenta" type="number" placeholder="0">
  <label for="propina">Propina</label>
  <select id="propina">
    <option value="0">Sin propina</option>
    <option value="10">10 %</option>
    <option value="15">15 %</option>
  </select>
  <label for="personas">Personas</label>
  <input id="personas" type="number" value="1">
  <button id="calcular">Calcular</button>
  <p id="resultado">Cada uno paga: $0</p>
</div>`

const CSS_3 = `body {
  background: #1e1b4b;
  font-family: Arial, sans-serif;
}
.calculadora {
  display: grid;
  gap: 6px;
  max-width: 300px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
}
h2 {
  margin: 0 0 8px;
}
input,
select {
  padding: 6px;
  border: 2px solid #c7d2fe;
}
#calcular {
  margin-top: 8px;
  padding: 10px;
  background: #4f46e5;
  color: #ffffff;
  border: none;
}
.error {
  color: #dc2626;
}`

const JS_3 = `const cuenta = document.getElementById("cuenta");
const propina = document.getElementById("propina");
const personas = document.getElementById("personas");
const boton = document.getElementById("calcular");
const resultado = document.getElementById("resultado");

function calcular() {
  const valor = Number(cuenta.value);
  const porcentaje = Number(propina.value);
  const gente = Number(personas.value);

  if (valor <= 0 || gente < 1) {
    resultado.textContent = "Revisa los números";
    resultado.classList.add("error");
    return;
  }

  const total = valor + valor * porcentaje / 100;
  const cadaUno = total / gente;
  resultado.textContent = "Cada uno paga: $" + cadaUno.toFixed(2);
  resultado.classList.remove("error");
}

boton.addEventListener("click", calcular);`

/** Lo que hace una persona para dividir una cuenta de 100 entre 4, con 10 % de propina. */
const CUENTA_DE_100: Accion[] = [
  { t: 'escribir', sel: '#cuenta', texto: '100' },
  { t: 'escribir', sel: '#propina', texto: '10' },
  { t: 'escribir', sel: '#personas', texto: '4' },
  { t: 'clic', sel: '#calcular' },
]

export const PROYECTO_3: Proyecto = {
  id: 'p3',
  numero: 3,
  titulo: 'La calculadora de la cuenta',
  nivel: 'Ya con soltura',
  lema: 'Proyecto 3 · Números, un select, validar y clases que se prenden y se apagan',
  descripcion:
    'Escribes cuánto costó la cena, eliges la propina y cuántos son, y te dice cuánto pone cada uno. Si pones algo que no tiene sentido, te avisa en rojo. Aquí el JavaScript convierte texto en números, decide con un if antes de calcular y le cambia la clase a un elemento.',
  html: HTML_3,
  css: CSS_3,
  js: JS_3,
  misiones: [
    {
      id: 'm1',
      titulo: 'Réplica exacta',
      enunciado:
        'Escribe los tres archivos hasta que tu calculadora funcione igual que el modelo: una cuenta de 100, con 10 % de propina, entre 4 personas, tiene que dar 27.50 para cada uno.',
      pista:
        'Ojo con los detalles del HTML: type="number" en los dos cuadros, value="1" en el de personas y un value en cada option. En el JavaScript, Number(…) es lo que convierte lo escrito en un número con el que se puede sumar.',
      parches: [],
      acciones: CUENTA_DE_100,
      pruebas: [
        { t: 'existe', sel: '.calculadora', msg: 'Falta el div con class="calculadora"' },
        { t: 'texto', sel: 'h2', eq: '¿Cuánto nos toca?', msg: 'El h2 debe decir: ¿Cuánto nos toca?' },
        { t: 'atributo', sel: '#cuenta', name: 'type', eq: 'number', msg: 'El input con id="cuenta" debe ser type="number"' },
        { t: 'conteo', sel: '#propina option', eq: 3, msg: 'El select con id="propina" debe tener tres opciones' },
        { t: 'atributo', sel: '#personas', name: 'value', eq: '1', msg: 'El input con id="personas" debe empezar en value="1"' },
        { t: 'texto', sel: '#calcular', eq: 'Calcular', msg: 'Falta el botón con id="calcular" que dice: Calcular' },
        { t: 'estilo', sel: 'body', prop: 'background-color', eq: '#1e1b4b', msg: 'El fondo de la página debe ser #1e1b4b' },
        { t: 'estilo', sel: '.calculadora', prop: 'display', eq: 'grid', msg: 'La calculadora necesita display: grid para apilar sus piezas' },
        { t: 'estilo', sel: '.calculadora', prop: 'row-gap', eq: '6px', msg: 'A la calculadora le falta el gap: 6px' },
        { t: 'estilo', sel: '.calculadora', prop: 'border-radius', eq: '12px', msg: 'A la calculadora le faltan las esquinas de 12px' },
        { t: 'estilo', sel: '#calcular', prop: 'background-color', eq: '#4f46e5', msg: 'El botón debe ser #4f46e5' },
        { t: 'texto', sel: '#resultado', eq: 'Cada uno paga: $27.50', msg: 'Con 100 de cuenta, 10 % de propina y 4 personas debería decir: Cada uno paga: $27.50' },
        { t: 'clase', sel: '#resultado', name: 'error', tiene: false, msg: 'Con números correctos, el resultado no debe llevar la clase error' },
      ],
    },
    {
      id: 'm2',
      titulo: 'Los generosos',
      enunciado: 'Hay mesas que dejan más propina. Agrega una cuarta opción al select: “20 %”, que valga 20.',
      pista:
        'Copia la forma de las otras opciones: <option value="20">20 %</option>. Lo que ve la persona va entre las etiquetas; el número con el que calcula el JavaScript va en value.',
      parches: [{ lang: 'html', de: '    <option value="15">15 %</option>', a: '    <option value="15">15 %</option>\n    <option value="20">20 %</option>' }],
      acciones: [
        { t: 'escribir', sel: '#cuenta', texto: '100' },
        { t: 'escribir', sel: '#propina', texto: '20' },
        { t: 'escribir', sel: '#personas', texto: '2' },
        { t: 'clic', sel: '#calcular' },
      ],
      pruebas: [
        { t: 'conteo', sel: '#propina option', eq: 4, msg: 'El select debería tener ahora cuatro opciones' },
        { t: 'texto', sel: '#resultado', eq: 'Cada uno paga: $60.00', msg: 'Elegí 20 % con una cuenta de 100 entre 2 y no dio $60.00: revisa el value de tu nueva opción' },
      ],
    },
    {
      id: 'm3',
      titulo: 'Un botón que invita',
      enunciado:
        'El botón es un ladrillo cuadrado y el mouse ni se entera de que se puede presionar. Dale esquinas redondeadas de 8px y haz que el puntero se vuelva una manito al pasar por encima.',
      pista: 'Dentro de #calcular agrega border-radius: 8px; y cursor: pointer;',
      parches: [{ lang: 'css', de: '  border: none;\n}', a: '  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n}' }],
      pruebas: [
        { t: 'estilo', sel: '#calcular', prop: 'border-radius', eq: '8px', msg: 'El botón todavía no tiene esquinas de 8px' },
        { t: 'estilo', sel: '#calcular', prop: 'cursor', eq: 'pointer', msg: 'Al botón le falta cursor: pointer' },
      ],
    },
    {
      id: 'm4',
      titulo: 'Un error que se vea',
      enunciado:
        'Si alguien le da a Calcular sin escribir nada, el aviso sale en rojo, pero pasa desapercibido. Haz que la clase error, además del rojo, ponga la letra en negrita y un fondo rosado #fee2e2.',
      pista:
        'No hay que tocar el JavaScript: él ya le pone la clase error al párrafo. Basta con agregarle a la regla .error un font-weight: bold; y un background: #fee2e2;',
      parches: [{ lang: 'css', de: '  color: #dc2626;\n}', a: '  color: #dc2626;\n  font-weight: bold;\n  background: #fee2e2;\n}' }],
      acciones: [{ t: 'clic', sel: '#calcular' }],
      pruebas: [
        { t: 'texto', sel: '#resultado', eq: 'Revisa los números', msg: 'Le di a Calcular sin escribir nada y no apareció: Revisa los números' },
        { t: 'clase', sel: '#resultado', name: 'error', msg: 'Con la cuenta vacía, el resultado debería llevar la clase error' },
        { t: 'estilo', sel: '#resultado', prop: 'font-weight', eq: 'bold', msg: 'El error todavía no sale en negrita' },
        { t: 'estilo', sel: '#resultado', prop: 'background-color', eq: '#fee2e2', msg: 'El error todavía no tiene el fondo #fee2e2' },
      ],
    },
    {
      id: 'm5',
      titulo: 'Sin centavos',
      enunciado:
        'Nadie paga 27.50 con monedas de cincuenta centavos. Redondea lo que paga cada uno al número entero más cercano: con la cuenta de 100 entre 4 debe decir “Cada uno paga: $28”.',
      pista: 'Cambia cadaUno.toFixed(2) por Math.round(cadaUno). Math.round redondea: 27.5 sube a 28 y 27.4 baja a 27.',
      parches: [{ lang: 'js', de: 'cadaUno.toFixed(2)', a: 'Math.round(cadaUno)' }],
      acciones: CUENTA_DE_100,
      pruebas: [{ t: 'texto', sel: '#resultado', eq: 'Cada uno paga: $28', msg: 'Con 100 entre 4 y 10 % de propina debería decir: Cada uno paga: $28' }],
    },
    {
      id: 'm6',
      titulo: '¿Y el total?',
      enunciado:
        'Aparte de lo que pone cada uno, muestra cuánto sale la cuenta completa con la propina. Agrega debajo del resultado un párrafo con id="total" que, al calcular, diga por ejemplo “Total con propina: $110”.',
      pista:
        'Dos cambios. En el HTML, un <p id="total"></p> nuevo. En el JavaScript, al final de calcular, busca ese párrafo con document.getElementById y ponle en textContent "Total con propina: $" + total. La variable total ya existe.',
      parches: [
        { lang: 'html', de: '  <p id="resultado">Cada uno paga: $0</p>', a: '  <p id="resultado">Cada uno paga: $0</p>\n  <p id="total"></p>' },
        {
          lang: 'js',
          de: '  resultado.classList.remove("error");',
          a: '  resultado.classList.remove("error");\n  document.getElementById("total").textContent = "Total con propina: $" + total;',
        },
      ],
      acciones: CUENTA_DE_100,
      pruebas: [
        { t: 'existe', sel: 'p#total', msg: 'Falta el párrafo con id="total"' },
        { t: 'texto', sel: '#total', eq: 'Total con propina: $110', msg: 'Con 100 de cuenta y 10 % de propina, el total debería decir: Total con propina: $110' },
        { t: 'texto', sel: '#resultado', eq: 'Cada uno paga: $28', msg: 'Lo que paga cada uno se tiene que seguir viendo: Cada uno paga: $28' },
      ],
    },
    {
      id: 'm7',
      titulo: 'Sin botón',
      enunciado:
        'Que la calculadora haga las cuentas sola mientras escribes, sin tener que darle a Calcular. Cualquier cambio en la cuenta, la propina o las personas debe volver a calcular.',
      pista:
        'La función calcular ya existe: solo hay que llamarla en más momentos. Los cuadros avisan con el evento "input" cada vez que cambia una letra, y el select avisa con "change". Por ejemplo: cuenta.addEventListener("input", calcular);',
      parches: [
        {
          lang: 'js',
          de: 'boton.addEventListener("click", calcular);',
          a: 'boton.addEventListener("click", calcular);\ncuenta.addEventListener("input", calcular);\npropina.addEventListener("change", calcular);\npersonas.addEventListener("input", calcular);',
        },
      ],
      acciones: [
        { t: 'escribir', sel: '#cuenta', texto: '200' },
        { t: 'escribir', sel: '#propina', texto: '15' },
        { t: 'escribir', sel: '#personas', texto: '5' },
      ],
      pruebas: [
        { t: 'texto', sel: '#resultado', eq: 'Cada uno paga: $46', msg: 'Escribí 200, elegí 15 % y puse 5 personas, sin dar clic: debería decir Cada uno paga: $46' },
        { t: 'texto', sel: '#total', eq: 'Total con propina: $230', msg: 'El total también se tiene que calcular solo: Total con propina: $230' },
      ],
    },
  ],
}

/* ========================================================================== */
/* Proyecto 4 — datos que mandan: un arreglo de objetos, un índice que avanza, */
/* botones que nacen de un forEach y una pantalla final que se destapa.       */
/* ========================================================================== */

const HTML_4 = `<div class="quiz">
  <p id="progreso">Pregunta 1 de 3</p>
  <h2 id="pregunta"></h2>
  <div id="opciones"></div>
  <div id="final" hidden>
    <h2 id="puntaje"></h2>
    <button id="otra-vez">Jugar otra vez</button>
  </div>
</div>`

const CSS_4 = `body {
  background: #064e3b;
  font-family: Arial, sans-serif;
}
.quiz {
  max-width: 360px;
  margin: 20px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 12px;
}
#progreso {
  margin: 0;
  color: #6b7280;
  font-size: 13px;
}
#opciones {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
#opciones button {
  padding: 12px;
  background: #f0fdf4;
  border: 2px solid #d1fae5;
  border-radius: 8px;
  cursor: pointer;
}
#opciones button:hover {
  border-color: #10b981;
}`

const JS_4 = `const preguntas = [
  { texto: "¿Cuántas patas tiene una araña?", opciones: ["6", "8", "10", "4"], correcta: 1 },
  { texto: "¿Qué planeta es el más grande?", opciones: ["Tierra", "Marte", "Júpiter", "Venus"], correcta: 2 },
  { texto: "¿Cuánto es 7 por 8?", opciones: ["56", "54", "64", "48"], correcta: 0 }
];

const progreso = document.getElementById("progreso");
const pregunta = document.getElementById("pregunta");
const opciones = document.getElementById("opciones");
const final = document.getElementById("final");
const puntaje = document.getElementById("puntaje");

let actual = 0;
let aciertos = 0;

function mostrar() {
  const p = preguntas[actual];
  progreso.textContent = "Pregunta " + (actual + 1) + " de " + preguntas.length;
  pregunta.textContent = p.texto;
  opciones.innerHTML = "";
  p.opciones.forEach(function (opcion, i) {
    const boton = document.createElement("button");
    boton.textContent = opcion;
    boton.addEventListener("click", function () {
      responder(i);
    });
    opciones.appendChild(boton);
  });
}

function responder(i) {
  if (i === preguntas[actual].correcta) {
    aciertos = aciertos + 1;
  }
  actual = actual + 1;
  if (actual < preguntas.length) {
    mostrar();
  } else {
    terminar();
  }
}

function terminar() {
  progreso.textContent = "¡Terminaste!";
  pregunta.textContent = "";
  opciones.innerHTML = "";
  final.hidden = false;
  puntaje.textContent = "Acertaste " + aciertos + " de " + preguntas.length;
}

document.getElementById("otra-vez").addEventListener("click", function () {
  actual = 0;
  aciertos = 0;
  final.hidden = true;
  mostrar();
});

mostrar();`

/** Clic en la opción número n (empezando en 1) de la pregunta que esté en pantalla. */
const opcion = (n: number): Accion => ({ t: 'clic', sel: `#opciones button:nth-child(${n})` })

/** Las cuatro preguntas respondidas bien, una vez agregada la cuarta (la del cielo). */
const TODAS_BIEN = [opcion(2), opcion(3), opcion(1), opcion(2)]

export const PROYECTO_4: Proyecto = {
  id: 'p4',
  numero: 4,
  titulo: 'El quiz',
  nivel: 'Difícil',
  lema: 'Proyecto 4 · Un arreglo de objetos manda y la página obedece',
  descripcion:
    'Preguntas con cuatro opciones, una detrás de otra, y al final tu puntaje con un botón para jugar otra vez. Las preguntas no están en el HTML: viven en un arreglo de JavaScript, y un forEach fabrica los botones de cada una. Cambias los datos y el juego cambia solo.',
  html: HTML_4,
  css: CSS_4,
  js: JS_4,
  misiones: [
    {
      id: 'm1',
      titulo: 'Réplica exacta',
      enunciado:
        'Escribe los tres archivos hasta que tu quiz funcione igual que el modelo: se responden las tres preguntas, aparece “¡Terminaste!”, el puntaje y el botón para jugar otra vez.',
      pista:
        'El arreglo preguntas es lo más delicado: cada pregunta es un objeto entre { } separado por comas, y correcta es la POSICIÓN de la respuesta buena, contando desde 0. Si el quiz no arranca, revisa que la última línea sea mostrar();',
      parches: [],
      acciones: [opcion(2), opcion(1), opcion(1)],
      pruebas: [
        { t: 'existe', sel: '.quiz', msg: 'Falta el div con class="quiz"' },
        { t: 'estilo', sel: 'body', prop: 'background-color', eq: '#064e3b', msg: 'El fondo de la página debe ser #064e3b' },
        { t: 'estilo', sel: '.quiz', prop: 'border-radius', eq: '12px', msg: 'Al quiz le faltan las esquinas de 12px' },
        { t: 'estilo', sel: '#progreso', prop: 'font-size', eq: '13px', msg: 'El progreso debe ir en letra de 13px' },
        { t: 'estilo', sel: '#opciones', prop: 'display', eq: 'grid', msg: 'Las opciones necesitan display: grid' },
        { t: 'estilo', sel: '#opciones', prop: 'column-gap', eq: '8px', msg: 'A las opciones les falta el gap: 8px' },
        { t: 'texto', sel: '#progreso', eq: '¡Terminaste!', msg: 'Respondí las tres preguntas y el progreso no dice: ¡Terminaste!' },
        { t: 'conteo', sel: '#opciones button', eq: 0, msg: 'Al terminar, los botones de opciones deberían desaparecer' },
        { t: 'estilo', sel: '#final', prop: 'display', eq: 'block', msg: 'Al terminar, el div con id="final" se tiene que ver' },
        { t: 'texto', sel: '#puntaje', eq: 'Acertaste 2 de 3', msg: 'Acerté la primera y la tercera: el puntaje debería decir Acertaste 2 de 3' },
        { t: 'texto', sel: '#otra-vez', eq: 'Jugar otra vez', msg: 'Falta el botón con id="otra-vez" que dice: Jugar otra vez' },
      ],
    },
    {
      id: 'm2',
      titulo: 'Tu propia pregunta',
      enunciado:
        'Agrega una cuarta pregunta al final del arreglo, con cuatro opciones: “¿De qué color es el cielo despejado?”, con las opciones Verde, Azul, Rojo y Gris. La buena es Azul.',
      pista:
        'Pon una coma después de la } de la tercera pregunta y escribe otro objeto con la misma forma. Azul está en la segunda posición, y como se cuenta desde 0, correcta vale 1. No hay que tocar nada más: el “de 4” sale solo de preguntas.length.',
      parches: [
        {
          lang: 'js',
          de: 'correcta: 0 }\n];',
          a: 'correcta: 0 },\n  { texto: "¿De qué color es el cielo despejado?", opciones: ["Verde", "Azul", "Rojo", "Gris"], correcta: 1 }\n];',
        },
      ],
      acciones: [opcion(2), opcion(3), opcion(1)],
      pruebas: [
        { t: 'texto', sel: '#progreso', eq: 'Pregunta 4 de 4', msg: 'Respondí tres preguntas y no llegué a la “Pregunta 4 de 4”' },
        { t: 'texto', sel: '#pregunta', eq: '¿De qué color es el cielo despejado?', msg: 'La cuarta pregunta debe decir: ¿De qué color es el cielo despejado?' },
        { t: 'conteo', sel: '#opciones button', eq: 4, msg: 'La cuarta pregunta debe tener cuatro opciones' },
        { t: 'texto', sel: '#opciones button:nth-child(2)', eq: 'Azul', msg: 'La segunda opción debe ser: Azul' },
      ],
    },
    {
      id: 'm3',
      titulo: 'Que la pregunta mande',
      enunciado: 'La pregunta se pierde entre los botones. Ponla en verde oscuro #065f46 y con letra de 22px.',
      pista: 'Crea una regla nueva para #pregunta con color y font-size.',
      parches: [{ lang: 'css', de: '#opciones {', a: '#pregunta {\n  color: #065f46;\n  font-size: 22px;\n}\n#opciones {' }],
      pruebas: [
        { t: 'estilo', sel: '#pregunta', prop: 'color', eq: '#065f46', msg: 'La pregunta todavía no es #065f46' },
        { t: 'estilo', sel: '#pregunta', prop: 'font-size', eq: '22px', msg: 'La pregunta todavía no mide 22px' },
      ],
    },
    {
      id: 'm4',
      titulo: 'En porcentaje',
      enunciado:
        'Al final, además de cuántas acertaste, muestra el porcentaje redondeado entre paréntesis. Con 3 de 4 debe decir exactamente: “Acertaste 3 de 4 (75 %)”.',
      pista:
        'En terminar, calcula aciertos / preguntas.length * 100 y pásalo por Math.round. Después pégalo al final del texto: … + " (" + porcentaje + " %)". Fíjate en el espacio antes del %.',
      parches: [
        {
          lang: 'js',
          de: '  puntaje.textContent = "Acertaste " + aciertos + " de " + preguntas.length;',
          a: '  const porcentaje = Math.round(aciertos / preguntas.length * 100);\n  puntaje.textContent = "Acertaste " + aciertos + " de " + preguntas.length + " (" + porcentaje + " %)";',
        },
      ],
      acciones: [opcion(2), opcion(1), opcion(1), opcion(2)],
      pruebas: [{ t: 'texto', sel: '#puntaje', eq: 'Acertaste 3 de 4 (75 %)', msg: 'Fallé solo la segunda: debería decir Acertaste 3 de 4 (75 %)' }],
    },
    {
      id: 'm5',
      titulo: '¡Perfecto!',
      enunciado:
        'Quien acierta todas se merece una celebración. Si no falló ninguna, el puntaje empieza con “¡Perfecto! ”: por ejemplo, “¡Perfecto! Acertaste 4 de 4 (100 %)”. Si falló alguna, queda como antes.',
      pista:
        'Arma el texto en una variable con let, y antes de ponerlo en la página pregunta con un if si aciertos === preguntas.length. Si es así, pégale "¡Perfecto! " adelante.',
      parches: [
        {
          lang: 'js',
          de: '  puntaje.textContent = "Acertaste " + aciertos + " de " + preguntas.length + " (" + porcentaje + " %)";',
          a: '  let mensaje = "Acertaste " + aciertos + " de " + preguntas.length + " (" + porcentaje + " %)";\n  if (aciertos === preguntas.length) {\n    mensaje = "¡Perfecto! " + mensaje;\n  }\n  puntaje.textContent = mensaje;',
        },
      ],
      acciones: TODAS_BIEN,
      pruebas: [{ t: 'texto', sel: '#puntaje', eq: '¡Perfecto! Acertaste 4 de 4 (100 %)', msg: 'Acerté las cuatro: debería decir ¡Perfecto! Acertaste 4 de 4 (100 %)' }],
    },
    {
      id: 'm6',
      titulo: 'La barra de avance',
      enunciado:
        'Pon debajo del progreso una barra verde que crece según lo que llevas: vacía en la primera pregunta, a la mitad en la tercera de cuatro. La barra es un div con id="barra", de 6px de alto y color #10b981.',
      pista:
        'HTML: <div id="barra"></div> justo después del párrafo de progreso. CSS: una regla #barra con height y background. JavaScript: en mostrar, cámbiale el ancho con barra.style.width = (actual / preguntas.length * 100) + "%";',
      parches: [
        { lang: 'html', de: '  <p id="progreso">Pregunta 1 de 3</p>', a: '  <p id="progreso">Pregunta 1 de 3</p>\n  <div id="barra"></div>' },
        { lang: 'css', de: '#pregunta {', a: '#barra {\n  height: 6px;\n  background: #10b981;\n}\n#pregunta {' },
        {
          lang: 'js',
          de: '  pregunta.textContent = p.texto;',
          a: '  pregunta.textContent = p.texto;\n  document.getElementById("barra").style.width = (actual / preguntas.length * 100) + "%";',
        },
      ],
      acciones: [opcion(2), opcion(3)],
      pruebas: [
        { t: 'estilo', sel: '#barra', prop: 'height', eq: '6px', msg: 'La barra debe medir 6px de alto' },
        { t: 'estilo', sel: '#barra', prop: 'background-color', eq: '#10b981', msg: 'La barra debe ser #10b981' },
        { t: 'atributo', sel: '#barra', name: 'style', has: 'width: 50%', msg: 'Voy en la tercera pregunta de cuatro: la barra debería tener width: 50%' },
      ],
    },
    {
      id: 'm7',
      titulo: 'Saltar pregunta',
      enunciado:
        'Agrega un botón con id="saltar" que diga “Saltar pregunta”, debajo de las opciones. Al presionarlo se pasa a la siguiente pregunta sin sumar punto, como si hubieras fallado.',
      pista:
        'La función responder ya hace todo el trabajo de avanzar. Si le pasas un número que nunca es la respuesta correcta —por ejemplo -1—, cuenta como fallo. Entonces el clic de saltar solo tiene que llamar responder(-1).',
      parches: [
        { lang: 'html', de: '  <div id="opciones"></div>', a: '  <div id="opciones"></div>\n  <button id="saltar">Saltar pregunta</button>' },
        {
          lang: 'js',
          de: '});\n\nmostrar();',
          a: '});\n\ndocument.getElementById("saltar").addEventListener("click", function () {\n  responder(-1);\n});\n\nmostrar();',
        },
      ],
      acciones: [{ t: 'clic', sel: '#saltar' }, opcion(3), opcion(1), opcion(2)],
      pruebas: [
        { t: 'texto', sel: '#saltar', eq: 'Saltar pregunta', msg: 'Falta el botón con id="saltar" que dice: Saltar pregunta' },
        { t: 'texto', sel: '#puntaje', eq: 'Acertaste 3 de 4 (75 %)', msg: 'Salté la primera y acerté las otras tres: debería decir Acertaste 3 de 4 (75 %)' },
      ],
    },
    {
      id: 'm8',
      titulo: 'El botón que sobra',
      enunciado:
        'Termina el quiz y mira: el botón Saltar sigue ahí, y si lo presionas, tu programa se rompe porque ya no hay pregunta que saltar. Escóndelo al terminar y vuelve a mostrarlo al jugar otra vez.',
      pista:
        'Igual que final: en terminar, document.getElementById("saltar").hidden = true; y en el clic de otra-vez, lo mismo con false.',
      parches: [
        { lang: 'js', de: '  final.hidden = false;', a: '  final.hidden = false;\n  document.getElementById("saltar").hidden = true;' },
        { lang: 'js', de: '  final.hidden = true;', a: '  final.hidden = true;\n  document.getElementById("saltar").hidden = false;' },
      ],
      acciones: TODAS_BIEN,
      pruebas: [
        { t: 'texto', sel: '#progreso', eq: '¡Terminaste!', msg: 'Respondí las cuatro y el quiz no terminó' },
        { t: 'estilo', sel: '#saltar', prop: 'display', eq: 'none', msg: 'Al terminar, el botón Saltar todavía se ve' },
      ],
    },
  ],
}

/* ========================================================================== */
/* Proyecto 5 — una app pequeñita de verdad: el estado vive en un arreglo,    */
/* la página se vuelve a pintar desde él, un solo listener atiende muchos     */
/* botones (delegación) y map, find, filter y reduce hacen el trabajo.        */
/* ========================================================================== */

const HTML_5 = `<header class="barra">
  <h1>La tiendita</h1>
  <span id="insignia">0</span>
</header>
<main class="tienda">
  <section id="catalogo"></section>
  <aside class="carrito">
    <h2>Tu carrito</h2>
    <ul id="items"></ul>
    <p id="vacio">Todavía no has agregado nada.</p>
    <p id="total">Total: $0</p>
  </aside>
</main>`

const CSS_5 = `* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #fff7ed;
  font-family: Arial, sans-serif;
}
.barra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #ea580c;
  color: #ffffff;
}
.barra h1 {
  margin: 0;
  font-size: 20px;
}
#insignia {
  padding: 2px 10px;
  background: #ffffff;
  color: #ea580c;
  border-radius: 999px;
}
.tienda {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
  padding: 12px;
}
#catalogo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.producto,
.carrito {
  padding: 10px;
  background: #ffffff;
  border-radius: 10px;
}
.producto {
  text-align: center;
}
button {
  padding: 6px 10px;
  background: #ea580c;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
#items {
  padding: 0;
  list-style: none;
}
#items li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}`

const JS_5 = `const productos = [
  { id: 1, nombre: "Lápiz", precio: 1500 },
  { id: 2, nombre: "Cuaderno", precio: 4000 },
  { id: 3, nombre: "Borrador", precio: 800 },
  { id: 4, nombre: "Regla", precio: 2500 }
];

let carrito = [];

const catalogo = document.getElementById("catalogo");
const items = document.getElementById("items");
const vacio = document.getElementById("vacio");
const total = document.getElementById("total");
const insignia = document.getElementById("insignia");

function buscar(id) {
  return productos.find((p) => p.id === id);
}

function pintarCatalogo() {
  catalogo.innerHTML = productos.map((p) => \`
    <div class="producto">
      <p>\${p.nombre}</p>
      <p>$\${p.precio}</p>
      <button data-id="\${p.id}">Agregar</button>
    </div>\`).join("");
}

function pintarCarrito() {
  items.innerHTML = carrito.map((c) => \`
    <li>
      <span>\${buscar(c.id).nombre} x \${c.cantidad}</span>
      <button data-quitar="\${c.id}">Quitar</button>
    </li>\`).join("");

  const suma = carrito.reduce((acc, c) => acc + buscar(c.id).precio * c.cantidad, 0);
  const unidades = carrito.reduce((acc, c) => acc + c.cantidad, 0);

  total.textContent = "Total: $" + suma;
  insignia.textContent = unidades;
  vacio.hidden = carrito.length > 0;
}

catalogo.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id);
  if (!id) return;
  const ya = carrito.find((c) => c.id === id);
  if (ya) {
    ya.cantidad++;
  } else {
    carrito.push({ id: id, cantidad: 1 });
  }
  pintarCarrito();
});

items.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.quitar);
  if (!id) return;
  carrito = carrito.filter((c) => c.id !== id);
  pintarCarrito();
});

pintarCatalogo();
pintarCarrito();`

const agregar = (id: number, veces = 1): Accion => ({ t: 'clic', sel: `#catalogo [data-id="${id}"]`, veces })
const quitar = (id: number): Accion => ({ t: 'clic', sel: `#items [data-quitar="${id}"]` })

/** Dos cuadernos y un borrador: 8.800 en total, 3 unidades. */
const COMPRA: Accion[] = [agregar(2, 2), agregar(3)]

export const PROYECTO_5: Proyecto = {
  id: 'p5',
  numero: 5,
  titulo: 'La tiendita con carrito',
  nivel: 'El más difícil',
  lema: 'Proyecto 5 · El estado manda: map, find, filter, reduce y un listener para muchos botones',
  descripcion:
    'Un catálogo de útiles, un carrito que suma cantidades, un total y una insignia arriba con cuántas cosas llevas. Aquí nada se cambia a mano: todo vive en el arreglo carrito, y cada vez que cambia, la página se vuelve a pintar desde él. Así están hechas las apps de verdad.',
  html: HTML_5,
  css: CSS_5,
  js: JS_5,
  misiones: [
    {
      id: 'm1',
      titulo: 'Réplica exacta',
      enunciado:
        'Escribe los tres archivos hasta que tu tiendita funcione igual que el modelo: agregar productos, ver cómo sube la cantidad si repites, quitarlos del carrito, y que el total y la insignia siempre cuadren.',
      pista:
        'Lo nuevo aquí son las comillas invertidas ` ` que dejan meter variables dentro del texto con ${…}. En $${p.precio}, el primer $ es el signo de pesos y el segundo abre la variable. Y data-id="…" es un atributo inventado por ti: el JavaScript lo lee con dataset.id.',
      parches: [],
      acciones: [...COMPRA, agregar(1), quitar(1)],
      pruebas: [
        { t: 'texto', sel: '.barra h1', eq: 'La tiendita', msg: 'Falta el h1 “La tiendita” dentro del header con class="barra"' },
        { t: 'estilo', sel: '.barra', prop: 'display', eq: 'flex', msg: 'La barra de arriba necesita display: flex' },
        { t: 'estilo', sel: '.barra', prop: 'background-color', eq: '#ea580c', msg: 'La barra de arriba debe ser #ea580c' },
        { t: 'estilo', sel: '#insignia', prop: 'border-radius', eq: '999px', msg: 'La insignia debe ser redonda: border-radius: 999px' },
        { t: 'estilo', sel: '.tienda', prop: 'display', eq: 'grid', msg: 'La tienda necesita display: grid' },
        { t: 'conteo', sel: '#catalogo .producto', eq: 4, msg: 'El catálogo debería mostrar los 4 productos' },
        { t: 'estilo', sel: '.producto', prop: 'border-radius', eq: '10px', msg: 'Cada producto lleva esquinas de 10px' },
        { t: 'conteo', sel: '#items li', eq: 2, msg: 'Agregué cuadernos, un borrador y un lápiz, y quité el lápiz: deberían quedar 2 renglones en el carrito' },
        { t: 'texto', sel: '#items li:nth-child(1) span', eq: 'Cuaderno x 2', msg: 'El primer renglón debería decir: Cuaderno x 2' },
        { t: 'texto', sel: '#items li:nth-child(2) span', eq: 'Borrador x 1', msg: 'El segundo renglón debería decir: Borrador x 1' },
        { t: 'texto', sel: '#total', eq: 'Total: $8800', msg: 'Dos cuadernos y un borrador suman: Total: $8800' },
        { t: 'texto', sel: '#insignia', eq: '3', msg: 'La insignia debería contar 3 cosas en el carrito' },
        { t: 'estilo', sel: '#vacio', prop: 'display', eq: 'none', msg: 'Con cosas en el carrito, el aviso “Todavía no has agregado nada” se tiene que esconder' },
      ],
    },
    {
      id: 'm2',
      titulo: 'Llegaron los colores',
      enunciado: 'A la tiendita le llegó un producto nuevo: “Colores”, a 6000, con el id 5. Agrégalo al catálogo.',
      pista:
        'Solo toca el arreglo productos: una coma después del último objeto y uno nuevo con la misma forma. El catálogo, el botón y el carrito salen solos, porque se pintan desde el arreglo.',
      parches: [
        { lang: 'js', de: 'precio: 2500 }\n];', a: 'precio: 2500 },\n  { id: 5, nombre: "Colores", precio: 6000 }\n];' },
      ],
      acciones: [agregar(5)],
      pruebas: [
        { t: 'conteo', sel: '#catalogo .producto', eq: 5, msg: 'El catálogo debería mostrar 5 productos' },
        { t: 'texto', sel: '#items li:nth-child(1) span', eq: 'Colores x 1', msg: 'Agregué el producto 5 y el carrito no dice: Colores x 1' },
        { t: 'texto', sel: '#total', eq: 'Total: $6000', msg: 'Unos colores deberían costar: Total: $6000' },
      ],
    },
    {
      id: 'm3',
      titulo: 'Precios en verde',
      enunciado:
        'El precio de cada producto tiene que resaltar: ponle al párrafo del precio la clase precio, y haz que esa clase lo pinte de verde #16a34a y en negrita.',
      pista:
        'El párrafo del precio no está en el HTML: nace dentro del texto que arma pintarCatalogo. Ponle class="precio" ahí mismo. Después crea en el CSS la regla .precio.',
      parches: [
        { lang: 'js', de: '      <p>$${p.precio}</p>', a: '      <p class="precio">$${p.precio}</p>' },
        { lang: 'css', de: '.producto {\n  text-align: center;\n}', a: '.producto {\n  text-align: center;\n}\n.precio {\n  color: #16a34a;\n  font-weight: bold;\n}' },
      ],
      pruebas: [
        { t: 'conteo', sel: '#catalogo .precio', eq: 5, msg: 'Cada uno de los 5 productos debería tener su párrafo con class="precio"' },
        { t: 'estilo', sel: '.precio', prop: 'color', eq: '#16a34a', msg: 'El precio todavía no es verde #16a34a' },
        { t: 'estilo', sel: '.precio', prop: 'font-weight', eq: 'bold', msg: 'El precio todavía no está en negrita' },
      ],
    },
    {
      id: 'm4',
      titulo: 'Pesos con puntos',
      enunciado:
        '8800 se lee mal. Escribe los precios como se escriben en Colombia, con punto de miles: “$4.000” en el catálogo y “Total: $8.800” en el carrito.',
      pista:
        'Los números saben escribirse solos a la manera de un país: precio.toLocaleString("es-CO") devuelve "4.000". Úsalo en los dos lugares donde se muestra dinero.',
      parches: [
        { lang: 'js', de: '$${p.precio}', a: '$${p.precio.toLocaleString("es-CO")}' },
        { lang: 'js', de: '"Total: $" + suma', a: '"Total: $" + suma.toLocaleString("es-CO")' },
      ],
      acciones: COMPRA,
      pruebas: [
        { t: 'texto', sel: '.producto:nth-child(2) .precio', eq: '$4.000', msg: 'El precio del cuaderno debería verse así: $4.000' },
        { t: 'texto', sel: '#total', eq: 'Total: $8.800', msg: 'Dos cuadernos y un borrador deberían verse así: Total: $8.800' },
      ],
    },
    {
      id: 'm5',
      titulo: 'Quitar de a uno',
      enunciado:
        'Si llevas tres cuadernos y le das a Quitar, se van los tres. Cámbialo: cada clic en Quitar le resta uno a la cantidad, y el renglón solo desaparece cuando llega a cero.',
      pista:
        'En el listener de items, antes de filtrar, busca el producto dentro del carrito con find y réstale uno con cantidad--. Solo si quedó en 0, usa el filter que ya tienes para sacarlo.',
      parches: [
        {
          lang: 'js',
          de: '  carrito = carrito.filter((c) => c.id !== id);',
          a: '  const item = carrito.find((c) => c.id === id);\n  item.cantidad--;\n  if (item.cantidad === 0) {\n    carrito = carrito.filter((c) => c.id !== id);\n  }',
        },
      ],
      acciones: [...COMPRA, quitar(2), quitar(3)],
      pruebas: [
        { t: 'conteo', sel: '#items li', eq: 1, msg: 'Quité un cuaderno y el único borrador: debería quedar un solo renglón' },
        { t: 'texto', sel: '#items li:nth-child(1) span', eq: 'Cuaderno x 1', msg: 'Tenía dos cuadernos y quité uno: debería decir Cuaderno x 1' },
        { t: 'texto', sel: '#insignia', eq: '1', msg: 'La insignia debería bajar a 1' },
        { t: 'texto', sel: '#total', eq: 'Total: $4.000', msg: 'Con un solo cuaderno: Total: $4.000' },
      ],
    },
    {
      id: 'm6',
      titulo: 'Vaciar el carrito',
      enunciado:
        'Agrega debajo del total un botón con id="vaciar" que diga “Vaciar carrito”. Al presionarlo, el carrito queda vacío, el total en $0, la insignia en 0 y vuelve a verse el aviso de que no hay nada.',
      pista:
        'No borres los renglones uno por uno: deja el arreglo vacío con carrito = []; y llama pintarCarrito(). Todo lo demás se arregla solo, porque la página se pinta desde el arreglo.',
      parches: [
        { lang: 'html', de: '    <p id="total">Total: $0</p>', a: '    <p id="total">Total: $0</p>\n    <button id="vaciar">Vaciar carrito</button>' },
        {
          lang: 'js',
          de: '\npintarCatalogo();\npintarCarrito();',
          a: '\ndocument.getElementById("vaciar").addEventListener("click", () => {\n  carrito = [];\n  pintarCarrito();\n});\n\npintarCatalogo();\npintarCarrito();',
        },
      ],
      acciones: [...COMPRA, agregar(1), { t: 'clic', sel: '#vaciar' }],
      pruebas: [
        { t: 'texto', sel: '#vaciar', eq: 'Vaciar carrito', msg: 'Falta el botón con id="vaciar" que dice: Vaciar carrito' },
        { t: 'conteo', sel: '#items li', eq: 0, msg: 'Después de vaciar, el carrito no debería tener renglones' },
        { t: 'texto', sel: '#total', eq: 'Total: $0', msg: 'Después de vaciar, el total debería ser: Total: $0' },
        { t: 'texto', sel: '#insignia', eq: '0', msg: 'Después de vaciar, la insignia debería volver a 0' },
        { t: 'estilo', sel: '#vacio', prop: 'display', eq: 'block', msg: 'Después de vaciar, tiene que volver a verse “Todavía no has agregado nada.”' },
      ],
    },
    {
      id: 'm7',
      titulo: 'Envío gratis',
      enunciado:
        'Las compras desde $10.000 tienen envío gratis. Agrega un párrafo con id="envio" debajo del total. Si la compra llega a 10.000, dice “¡Envío gratis!”; si no, dice cuánto falta, así: “Te faltan $1.200 para el envío gratis”.',
      pista:
        'En pintarCarrito ya tienes suma. Con un if decide qué texto va: si suma >= 10000, uno; si no, calcula 10000 - suma y escríbelo con toLocaleString("es-CO").',
      parches: [
        { lang: 'html', de: '    <p id="total">Total: $0</p>', a: '    <p id="total">Total: $0</p>\n    <p id="envio"></p>' },
        {
          lang: 'js',
          de: '  vacio.hidden = carrito.length > 0;',
          a: '  vacio.hidden = carrito.length > 0;\n\n  const envio = document.getElementById("envio");\n  if (suma >= 10000) {\n    envio.textContent = "¡Envío gratis!";\n  } else {\n    envio.textContent = "Te faltan $" + (10000 - suma).toLocaleString("es-CO") + " para el envío gratis";\n  }',
        },
      ],
      acciones: COMPRA,
      pruebas: [
        { t: 'existe', sel: 'p#envio', msg: 'Falta el párrafo con id="envio"' },
        { t: 'texto', sel: '#envio', eq: 'Te faltan $1.200 para el envío gratis', msg: 'Con una compra de 8.800 debería decir: Te faltan $1.200 para el envío gratis' },
      ],
    },
    {
      id: 'm8',
      titulo: 'El cupón del profe',
      enunciado:
        'Agrega un cuadro de texto con id="cupon" y un botón con id="aplicar" que diga “Aplicar”. Si alguien escribe el cupón PROFE10 —con mayúsculas o minúsculas, da igual— y lo aplica, el total baja un 10 %. El aviso del envío gratis se sigue calculando sin el descuento.',
      pista:
        'Guarda el descuento en una variable nueva al lado de carrito: let descuento = 0; El botón lee el cuadro, lo pasa por trim() y toUpperCase(), y si es "PROFE10" pone descuento = 10 y vuelve a pintar. En pintarCarrito, el total que se muestra es suma - suma * descuento / 100.',
      parches: [
        {
          lang: 'html',
          de: '    <p id="envio"></p>',
          a: '    <p id="envio"></p>\n    <input id="cupon" placeholder="Cupón">\n    <button id="aplicar">Aplicar</button>',
        },
        { lang: 'js', de: 'let carrito = [];', a: 'let carrito = [];\nlet descuento = 0;' },
        {
          lang: 'js',
          de: '  total.textContent = "Total: $" + suma.toLocaleString("es-CO");',
          a: '  const aPagar = suma - suma * descuento / 100;\n  total.textContent = "Total: $" + aPagar.toLocaleString("es-CO");',
        },
        {
          lang: 'js',
          de: '\npintarCatalogo();\npintarCarrito();',
          a: '\ndocument.getElementById("aplicar").addEventListener("click", () => {\n  const codigo = document.getElementById("cupon").value.trim().toUpperCase();\n  if (codigo === "PROFE10") {\n    descuento = 10;\n  }\n  pintarCarrito();\n});\n\npintarCatalogo();\npintarCarrito();',
        },
      ],
      acciones: [{ t: 'escribir', sel: '#cupon', texto: ' profe10 ' }, { t: 'clic', sel: '#aplicar' }, ...COMPRA],
      pruebas: [
        { t: 'texto', sel: '#aplicar', eq: 'Aplicar', msg: 'Falta el botón con id="aplicar" que dice: Aplicar' },
        { t: 'texto', sel: '#total', eq: 'Total: $7.920', msg: 'Apliqué “ profe10 ” y compré 8.800: con el 10 % menos debería decir Total: $7.920' },
        { t: 'texto', sel: '#envio', eq: 'Te faltan $1.200 para el envío gratis', msg: 'El envío gratis se calcula sin descuento: debería seguir diciendo Te faltan $1.200 para el envío gratis' },
      ],
    },
  ],
}

/* ========================================================================== */
/* Proyecto 6 — el tiempo entra en juego: setInterval y clearInterval, un     */
/* estado que dice si corre o no, formato con padStart, botones que se        */
/* desactivan y un atajo de teclado para toda la página.                      */
/* ========================================================================== */

const HTML_6 = `<div class="reloj">
  <p id="pantalla">00:00.0</p>
  <div class="botones">
    <button id="iniciar">Iniciar</button>
    <button id="vuelta" disabled>Vuelta</button>
    <button id="reiniciar">Reiniciar</button>
  </div>
  <ol id="vueltas"></ol>
</div>`

const CSS_6 = `body {
  background: #18181b;
  font-family: Arial, sans-serif;
}
.reloj {
  max-width: 320px;
  margin: 20px auto;
  padding: 20px;
  background: #27272a;
  color: #fafafa;
  border-radius: 16px;
  text-align: center;
}
#pantalla {
  margin: 0 0 16px;
  font-family: "Courier New", monospace;
  font-size: 48px;
}
.botones {
  display: flex;
  justify-content: center;
  gap: 8px;
}
button {
  padding: 8px 14px;
  background: #22c55e;
  color: #052e16;
  border: none;
  border-radius: 999px;
  font-weight: bold;
  cursor: pointer;
}
button:disabled {
  opacity: 0.4;
  cursor: default;
}
#vueltas {
  text-align: left;
}`

const JS_6 = `const pantalla = document.getElementById("pantalla");
const iniciar = document.getElementById("iniciar");
const vuelta = document.getElementById("vuelta");
const reiniciar = document.getElementById("reiniciar");
const vueltas = document.getElementById("vueltas");

let decimas = 0;
let intervalo = null;

function formato(d) {
  const minutos = Math.floor(d / 600);
  const segundos = Math.floor(d / 10) % 60;
  const decima = d % 10;
  return String(minutos).padStart(2, "0") + ":" + String(segundos).padStart(2, "0") + "." + decima;
}

function pintar() {
  pantalla.textContent = formato(decimas);
}

iniciar.addEventListener("click", function () {
  if (intervalo === null) {
    intervalo = setInterval(function () {
      decimas++;
      pintar();
    }, 100);
    iniciar.textContent = "Pausar";
    vuelta.disabled = false;
  } else {
    clearInterval(intervalo);
    intervalo = null;
    iniciar.textContent = "Seguir";
    vuelta.disabled = true;
  }
});

vuelta.addEventListener("click", function () {
  const item = document.createElement("li");
  item.textContent = formato(decimas);
  vueltas.appendChild(item);
});

reiniciar.addEventListener("click", function () {
  clearInterval(intervalo);
  intervalo = null;
  decimas = 0;
  pintar();
  vueltas.innerHTML = "";
  iniciar.textContent = "Iniciar";
  vuelta.disabled = true;
});`

const esperar = (ms: number): Accion => ({ t: 'esperar', ms })
const clic = (sel: string): Accion => ({ t: 'clic', sel })

export const PROYECTO_6: Proyecto = {
  id: 'p6',
  numero: 6,
  titulo: 'El cronómetro',
  nivel: 'Avanzado',
  lema: 'Proyecto 6 · El tiempo entra en juego: setInterval, clearInterval y un estado que manda',
  descripcion:
    'Un cronómetro con décimas, pausa, vueltas y reinicio. Aquí el JavaScript ya no solo reacciona a clics: se programa para hacer algo cada 100 milisegundos, lo detiene cuando toca y recuerda en qué estado está. Tus misiones le agregan la duración de cada vuelta, un atajo con la barra espaciadora y la vuelta récord.',
  html: HTML_6,
  css: CSS_6,
  js: JS_6,
  misiones: [
    {
      id: 'm1',
      titulo: 'Réplica exacta',
      enunciado:
        'Escribe los tres archivos hasta que tu cronómetro funcione igual que el modelo: inicia, marca vueltas, se pausa y los minutos pasan bien de 59 segundos a 01:00.0.',
      pista:
        'La parte fina es formato: una décima es una vuelta del setInterval, 10 décimas son un segundo y 600 son un minuto. El % 60 hace que los segundos vuelvan a 0 al llegar a 60, y padStart(2, "0") pone el cero de adelante. La revisión no espera de verdad: adelanta el reloj de golpe.',
      parches: [],
      acciones: [clic('#iniciar'), esperar(61500), clic('#vuelta'), esperar(1000), clic('#iniciar'), esperar(3000)],
      pruebas: [
        { t: 'texto', sel: '#pantalla', eq: '01:02.5', msg: 'Corrí el cronómetro 62 segundos y medio y lo pausé: la pantalla debería decir 01:02.5' },
        { t: 'texto', sel: '#iniciar', eq: 'Seguir', msg: 'Con el cronómetro en pausa, el primer botón debería decir: Seguir' },
        { t: 'existe', sel: '#vuelta:disabled', msg: 'En pausa, el botón Vuelta tiene que quedar desactivado (disabled)' },
        { t: 'conteo', sel: '#vueltas li', eq: 1, msg: 'Marqué una sola vuelta: debería haber un li en la lista' },
        { t: 'texto', sel: '#vueltas li', eq: '01:01.5', msg: 'La vuelta la marqué en 01:01.5' },
        { t: 'texto', sel: '#reiniciar', eq: 'Reiniciar', msg: 'Falta el botón con id="reiniciar" que dice: Reiniciar' },
        { t: 'estilo', sel: 'body', prop: 'background-color', eq: '#18181b', msg: 'El fondo de la página debe ser #18181b' },
        { t: 'estilo', sel: '.reloj', prop: 'border-radius', eq: '16px', msg: 'Al reloj le faltan las esquinas de 16px' },
        { t: 'estilo', sel: '#pantalla', prop: 'font-size', eq: '48px', msg: 'La pantalla debe tener letra de 48px' },
        { t: 'estilo', sel: '.botones', prop: 'display', eq: 'flex', msg: 'Los botones necesitan display: flex' },
        { t: 'estilo', sel: '#iniciar', prop: 'border-radius', eq: '999px', msg: 'Los botones deben ser redondos: border-radius: 999px' },
        { t: 'estilo', sel: '#vuelta', prop: 'opacity', eq: '0.4', msg: 'Un botón desactivado se ve apagado: opacity: 0.4' },
      ],
    },
    {
      id: 'm2',
      titulo: 'Pantalla de reloj digital',
      enunciado: 'Haz que los números de la pantalla se vean verdes, #4ade80, y un poco más separados entre sí: 2px.',
      pista: 'En la regla #pantalla agrega color y letter-spacing, que es la propiedad que separa las letras.',
      parches: [{ lang: 'css', de: '  font-size: 48px;\n}', a: '  font-size: 48px;\n  color: #4ade80;\n  letter-spacing: 2px;\n}' }],
      pruebas: [
        { t: 'estilo', sel: '#pantalla', prop: 'color', eq: '#4ade80', msg: 'La pantalla todavía no es #4ade80' },
        { t: 'estilo', sel: '#pantalla', prop: 'letter-spacing', eq: '2px', msg: 'A la pantalla le falta letter-spacing: 2px' },
      ],
    },
    {
      id: 'm3',
      titulo: 'Reiniciar da miedo',
      enunciado: 'Reiniciar borra todo, así que debe verse distinto: fondo rojo #ef4444 y letra blanca. Los otros botones se quedan verdes.',
      pista:
        'Crea una regla #reiniciar. Aunque venga antes o después, un selector con # le gana a la regla button, porque es más específico.',
      parches: [{ lang: 'css', de: '#vueltas {', a: '#reiniciar {\n  background: #ef4444;\n  color: #ffffff;\n}\n#vueltas {' }],
      pruebas: [
        { t: 'estilo', sel: '#reiniciar', prop: 'background-color', eq: '#ef4444', msg: 'El botón Reiniciar todavía no es #ef4444' },
        { t: 'estilo', sel: '#reiniciar', prop: 'color', eq: '#ffffff', msg: 'La letra de Reiniciar debe ser blanca' },
        { t: 'estilo', sel: '#iniciar', prop: 'background-color', eq: '#22c55e', msg: 'El botón Iniciar se tiene que quedar verde' },
      ],
    },
    {
      id: 'm4',
      titulo: 'La última, arriba',
      enunciado: 'Cuando hay muchas vueltas, la última queda perdida al fondo. Haz que cada vuelta nueva aparezca de primera en la lista.',
      pista: 'appendChild pone al final. Su hermano prepend pone al principio.',
      parches: [{ lang: 'js', de: '  vueltas.appendChild(item);', a: '  vueltas.prepend(item);' }],
      acciones: [clic('#iniciar'), esperar(1000), clic('#vuelta'), esperar(1000), clic('#vuelta')],
      pruebas: [
        { t: 'conteo', sel: '#vueltas li', eq: 2, msg: 'Marqué dos vueltas: debería haber dos' },
        { t: 'texto', sel: '#vueltas li:nth-child(1)', eq: '00:02.0', msg: 'La primera de la lista debería ser la más nueva: 00:02.0' },
        { t: 'texto', sel: '#vueltas li:nth-child(2)', eq: '00:01.0', msg: 'La segunda de la lista debería ser la más vieja: 00:01.0' },
      ],
    },
    {
      id: 'm5',
      titulo: '¿Cuánto duró la vuelta?',
      enunciado:
        'Al lado de cada vuelta, entre paréntesis, muestra cuánto duró desde la anterior: “00:02.5 (+00:01.5)”. Ojo: al reiniciar, la cuenta de la vuelta anterior también vuelve a cero.',
      pista:
        'Necesitas recordar en qué décima se marcó la vuelta anterior: una variable let ultima = 0; al lado de decimas. La duración es decimas - ultima, y la puedes pasar por formato igual que el tiempo. Después de escribirla, ultima = decimas. Y en reiniciar, ultima = 0.',
      parches: [
        { lang: 'js', de: 'let intervalo = null;', a: 'let intervalo = null;\nlet ultima = 0;' },
        {
          lang: 'js',
          de: '  item.textContent = formato(decimas);',
          a: '  item.textContent = formato(decimas) + " (+" + formato(decimas - ultima) + ")";\n  ultima = decimas;',
        },
        { lang: 'js', de: '  decimas = 0;', a: '  decimas = 0;\n  ultima = 0;' },
      ],
      acciones: [
        clic('#iniciar'), esperar(1000), clic('#vuelta'), esperar(1500), clic('#vuelta'),
        clic('#reiniciar'), clic('#iniciar'), esperar(700), clic('#vuelta'),
      ],
      pruebas: [
        { t: 'conteo', sel: '#vueltas li', eq: 1, msg: 'Después de reiniciar marqué una sola vuelta: debería haber una' },
        { t: 'texto', sel: '#vueltas li', eq: '00:00.7 (+00:00.7)', msg: 'Reinicié y marqué a las 7 décimas: debería decir 00:00.7 (+00:00.7). ¿Volviste ultima a 0 al reiniciar?' },
      ],
    },
    {
      id: 'm6',
      titulo: 'Con la barra espaciadora',
      enunciado:
        'Que la barra espaciadora haga lo mismo que el primer botón: si el cronómetro está quieto, arranca; si está corriendo, se pausa. Debe funcionar en toda la página, no solo sobre un botón.',
      pista:
        'Escucha keydown en document, que es la página entera. Si e.key es " " (un espacio), llama iniciar.click(): así no repites la lógica. Pon también e.preventDefault(), para que el espacio no haga bajar la página.',
      parches: [
        {
          lang: 'js',
          de: '  vuelta.disabled = true;\n});',
          a: '  vuelta.disabled = true;\n});\n\ndocument.addEventListener("keydown", function (e) {\n  if (e.key === " ") {\n    e.preventDefault();\n    iniciar.click();\n  }\n});',
        },
      ],
      acciones: [{ t: 'tecla', sel: 'body', key: ' ' }, esperar(1000), { t: 'tecla', sel: 'body', key: ' ' }, esperar(2000)],
      pruebas: [
        { t: 'texto', sel: '#pantalla', eq: '00:01.0', msg: 'Espacio, un segundo, espacio otra vez: el cronómetro debería quedar pausado en 00:01.0' },
        { t: 'texto', sel: '#iniciar', eq: 'Seguir', msg: 'Después del segundo espacio, el botón debería decir: Seguir' },
      ],
    },
    {
      id: 'm7',
      titulo: 'La vuelta récord',
      enunciado:
        'Pinta de verde #4ade80 la vuelta que menos duró, dándole la clase record. Si después llega una más rápida, la récord cambia: solo una lleva la clase a la vez.',
      pista:
        'Guarda la duración en cada li: item.dataset.duracion = decimas - ultima; Después de agregarla, recorre todas con [...vueltas.children], saca la menor con Math.min(...) y usa classList.toggle("record", condición) en cada una: la pone si la condición es verdad y la quita si no.',
      parches: [
        { lang: 'js', de: '  ultima = decimas;', a: '  item.dataset.duracion = decimas - ultima;\n  ultima = decimas;' },
        { lang: 'js', de: '  vueltas.prepend(item);', a: '  vueltas.prepend(item);\n  marcarRecord();' },
        {
          lang: 'js',
          de: 'function pintar() {',
          a: 'function marcarRecord() {\n  const items = [...vueltas.children];\n  const mejor = Math.min(...items.map((li) => Number(li.dataset.duracion)));\n  items.forEach((li) => {\n    li.classList.toggle("record", Number(li.dataset.duracion) === mejor);\n  });\n}\n\nfunction pintar() {',
        },
        { lang: 'css', de: '#vueltas {\n  text-align: left;\n}', a: '#vueltas {\n  text-align: left;\n}\n.record {\n  color: #4ade80;\n}' },
      ],
      acciones: [clic('#iniciar'), esperar(2000), clic('#vuelta'), esperar(800), clic('#vuelta'), esperar(1500), clic('#vuelta')],
      pruebas: [
        { t: 'clase', sel: '#vueltas li:nth-child(2)', name: 'record', msg: 'Las vueltas duraron 2 s, 0.8 s y 1.5 s: la de 0.8 s (la segunda de la lista) debería llevar la clase record' },
        { t: 'clase', sel: '#vueltas li:nth-child(1)', name: 'record', tiene: false, msg: 'La vuelta de 1.5 s no es récord: no debería llevar la clase record' },
        { t: 'clase', sel: '#vueltas li:nth-child(3)', name: 'record', tiene: false, msg: 'La vuelta de 2 s dejó de ser récord: hay que quitarle la clase' },
        { t: 'estilo', sel: '#vueltas li:nth-child(2)', prop: 'color', eq: '#4ade80', msg: 'La vuelta récord debería verse verde #4ade80' },
      ],
    },
  ],
}

/* ========================================================================== */
/* Proyecto 7 — un algoritmo de verdad: el tablero es un arreglo, las líneas  */
/* ganadoras otro, y find, every y includes deciden quién ganó.               */
/* ========================================================================== */

const HTML_7 = `<div class="juego">
  <h2 id="estado">Turno de X</h2>
  <div id="tablero"></div>
  <button id="nueva">Nueva partida</button>
</div>`

const CSS_7 = `body {
  background: #0c4a6e;
  font-family: Arial, sans-serif;
}
.juego {
  width: fit-content;
  margin: 16px auto;
  color: #ffffff;
  text-align: center;
}
#estado {
  margin: 0 0 10px;
}
#tablero {
  display: grid;
  grid-template-columns: repeat(3, 60px);
  gap: 6px;
}
.casilla {
  height: 60px;
  background: #e0f2fe;
  color: #0c4a6e;
  border: none;
  border-radius: 8px;
  font-size: 32px;
  font-weight: bold;
  cursor: pointer;
}
.gana {
  background: #fde047;
}
#nueva {
  margin-top: 10px;
  padding: 8px 14px;
  cursor: pointer;
}`

const JS_7 = `const LINEAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const tablero = document.getElementById("tablero");
const estado = document.getElementById("estado");

let casillas = Array(9).fill("");
let turno = "X";
let terminado = false;
let ganadora = [];

function pintar() {
  tablero.innerHTML = "";
  casillas.forEach((valor, i) => {
    const boton = document.createElement("button");
    boton.className = "casilla";
    boton.dataset.i = i;
    boton.textContent = valor;
    if (ganadora.includes(i)) {
      boton.classList.add("gana");
    }
    tablero.appendChild(boton);
  });
}

function buscarGanador() {
  return LINEAS.find((linea) => {
    const [a, b, c] = linea;
    return casillas[a] !== "" && casillas[a] === casillas[b] && casillas[a] === casillas[c];
  });
}

tablero.addEventListener("click", (e) => {
  const i = e.target.dataset.i;
  if (i === undefined || terminado || casillas[i] !== "") return;

  casillas[i] = turno;
  const linea = buscarGanador();

  if (linea) {
    ganadora = linea;
    terminado = true;
    estado.textContent = "¡Ganó " + turno + "!";
  } else if (casillas.every((valor) => valor !== "")) {
    terminado = true;
    estado.textContent = "Empate";
  } else {
    turno = turno === "X" ? "O" : "X";
    estado.textContent = "Turno de " + turno;
  }
  pintar();
});

document.getElementById("nueva").addEventListener("click", () => {
  casillas = Array(9).fill("");
  turno = "X";
  terminado = false;
  ganadora = [];
  estado.textContent = "Turno de X";
  pintar();
});

pintar();`

/** Clic en la casilla número n, de 0 (arriba a la izquierda) a 8 (abajo a la derecha). */
const casilla = (n: number): Accion => clic(`#tablero [data-i="${n}"]`)
const jugadas = (...ns: number[]) => ns.map(casilla)

/** X hace la fila de arriba: 0, 1, 2. */
const GANA_X = jugadas(0, 3, 1, 4, 2)
/** Nueve jugadas sin ninguna línea. */
const EMPATE = jugadas(0, 1, 2, 4, 3, 5, 7, 6, 8)

export const PROYECTO_7: Proyecto = {
  id: 'p7',
  numero: 7,
  titulo: 'Tres en raya',
  nivel: 'Muy avanzado',
  lema: 'Proyecto 7 · Un algoritmo de verdad: el tablero es un arreglo y find, every e includes deciden',
  descripcion:
    'El triqui de toda la vida: X contra O, resalta la línea ganadora, detecta el empate y deja jugar otra. El tablero entero es un arreglo de nueve casillas, y ganar es encontrar, entre las ocho líneas posibles, una con las tres iguales. Tus misiones le suman marcador, deshacer y una pista que busca la jugada ganadora.',
  html: HTML_7,
  css: CSS_7,
  js: JS_7,
  misiones: [
    {
      id: 'm1',
      titulo: 'Réplica exacta',
      enunciado:
        'Escribe los tres archivos hasta que tu tres en raya funcione igual que el modelo: los turnos se alternan, se detecta quién gana, se resalta la línea y ya no se puede jugar después de ganar.',
      pista:
        'LINEAS es un arreglo de arreglos: cada uno son las tres posiciones de una línea. En buscarGanador, const [a, b, c] = linea saca las tres de una vez. La condición turno === "X" ? "O" : "X" es un if cortico: si es X, pasa a O; si no, a X.',
      parches: [],
      acciones: [...GANA_X, casilla(5)],
      pruebas: [
        { t: 'conteo', sel: '#tablero .casilla', eq: 9, msg: 'El tablero debería tener 9 casillas con class="casilla"' },
        { t: 'texto', sel: '#estado', eq: '¡Ganó X!', msg: 'X hizo la fila de arriba: el estado debería decir ¡Ganó X!' },
        { t: 'conteo', sel: '.casilla.gana', eq: 3, msg: 'Las tres casillas de la línea ganadora deberían llevar la clase gana' },
        { t: 'texto', sel: '#tablero [data-i="3"]', eq: 'O', msg: 'La casilla 3 la jugó O' },
        { t: 'texto', sel: '#tablero [data-i="5"]', eq: '', msg: 'Después de ganar, hice clic en la casilla 5 y se llenó: el juego tiene que quedar quieto' },
        { t: 'texto', sel: '#nueva', eq: 'Nueva partida', msg: 'Falta el botón con id="nueva" que dice: Nueva partida' },
        { t: 'estilo', sel: 'body', prop: 'background-color', eq: '#0c4a6e', msg: 'El fondo de la página debe ser #0c4a6e' },
        { t: 'estilo', sel: '#tablero', prop: 'display', eq: 'grid', msg: 'El tablero necesita display: grid' },
        { t: 'estilo', sel: '#tablero', prop: 'column-gap', eq: '6px', msg: 'Al tablero le falta el gap: 6px' },
        { t: 'estilo', sel: '.casilla', prop: 'border-radius', eq: '8px', msg: 'Las casillas llevan esquinas de 8px' },
        { t: 'estilo', sel: '.casilla.gana', prop: 'background-color', eq: '#fde047', msg: 'Las casillas ganadoras deben verse amarillas: #fde047' },
      ],
    },
    {
      id: 'm2',
      titulo: 'La O de otro color',
      enunciado: 'Cuesta distinguir las X de las O. Ponle a cada casilla con O la clase o, y haz que esa clase la pinte de rosado #db2777.',
      pista:
        'En pintar ya tienes valor. Junto al if de la clase gana, agrega otro: si valor es "O", boton.classList.add("o"). Después crea la regla .o en el CSS.',
      parches: [
        { lang: 'js', de: '    if (ganadora.includes(i)) {', a: '    if (valor === "O") {\n      boton.classList.add("o");\n    }\n    if (ganadora.includes(i)) {' },
        { lang: 'css', de: '.gana {', a: '.o {\n  color: #db2777;\n}\n.gana {' },
      ],
      acciones: jugadas(0, 4),
      pruebas: [
        { t: 'clase', sel: '#tablero [data-i="4"]', name: 'o', msg: 'La casilla de la O debería llevar la clase o' },
        { t: 'estilo', sel: '#tablero [data-i="4"]', prop: 'color', eq: '#db2777', msg: 'La O debería verse rosada: #db2777' },
        { t: 'estilo', sel: '#tablero [data-i="0"]', prop: 'color', eq: '#0c4a6e', msg: 'La X se tiene que quedar de su color: #0c4a6e' },
      ],
    },
    {
      id: 'm3',
      titulo: 'Un empate que se note',
      enunciado:
        'Cuando hay empate, el estado debe decir “Empate: nadie gana” y el tablero quedar medio transparente, con la clase empate y opacity: 0.5. Al empezar una partida nueva, el tablero vuelve a verse normal.',
      pista:
        'Donde hoy se escribe "Empate", cambia el texto y agrega tablero.classList.add("empate"). En Nueva partida, tablero.classList.remove("empate"). Y en el CSS, la regla .empate.',
      parches: [
        { lang: 'js', de: '    estado.textContent = "Empate";', a: '    estado.textContent = "Empate: nadie gana";\n    tablero.classList.add("empate");' },
        { lang: 'js', de: '  ganadora = [];', a: '  ganadora = [];\n  tablero.classList.remove("empate");' },
        { lang: 'css', de: '#nueva {', a: '.empate {\n  opacity: 0.5;\n}\n#nueva {' },
      ],
      acciones: EMPATE,
      pruebas: [
        { t: 'texto', sel: '#estado', eq: 'Empate: nadie gana', msg: 'Llené el tablero sin línea: el estado debería decir Empate: nadie gana' },
        { t: 'clase', sel: '#tablero', name: 'empate', msg: 'Con empate, el tablero debería llevar la clase empate' },
        { t: 'estilo', sel: '#tablero', prop: 'opacity', eq: '0.5', msg: 'Con empate, el tablero debería quedar con opacity: 0.5' },
      ],
    },
    {
      id: 'm4',
      titulo: 'El marcador',
      enunciado:
        'Agrega debajo del estado un párrafo con id="marcador" que empiece en “X: 0 | O: 0” y sume una partida al que gane. El marcador no se borra con Nueva partida.',
      pista:
        'Guarda los puntos en un objeto: const puntos = { X: 0, O: 0 }; Como turno vale "X" o "O", puntos[turno]++ le suma al que acaba de ganar. Después escribe el marcador con puntos.X y puntos.O.',
      parches: [
        { lang: 'html', de: '  <h2 id="estado">Turno de X</h2>', a: '  <h2 id="estado">Turno de X</h2>\n  <p id="marcador">X: 0 | O: 0</p>' },
        { lang: 'js', de: 'let ganadora = [];', a: 'let ganadora = [];\nconst puntos = { X: 0, O: 0 };' },
        {
          lang: 'js',
          de: '    estado.textContent = "¡Ganó " + turno + "!";',
          a: '    estado.textContent = "¡Ganó " + turno + "!";\n    puntos[turno]++;\n    document.getElementById("marcador").textContent = "X: " + puntos.X + " | O: " + puntos.O;',
        },
      ],
      acciones: [...GANA_X, clic('#nueva'), ...jugadas(0, 3, 1, 4, 8, 5)],
      pruebas: [
        { t: 'texto', sel: '#estado', eq: '¡Ganó O!', msg: 'En la segunda partida O hizo la fila del medio: debería decir ¡Ganó O!' },
        { t: 'texto', sel: '#marcador', eq: 'X: 1 | O: 1', msg: 'Ganó X la primera y O la segunda: el marcador debería decir X: 1 | O: 1' },
      ],
    },
    {
      id: 'm5',
      titulo: 'Turnarse para empezar',
      enunciado:
        'Siempre empieza X y eso no es justo. Haz que cada partida nueva la empiece el que no empezó la anterior: la primera X, la segunda O, la tercera X…',
      pista:
        'Una variable let empieza = "X"; recuerda quién abrió. En Nueva partida, cámbiala con el mismo truco de los turnos, pon turno = empieza y escribe "Turno de " + turno en vez del texto fijo.',
      parches: [
        { lang: 'js', de: 'let turno = "X";', a: 'let turno = "X";\nlet empieza = "X";' },
        { lang: 'js', de: '  turno = "X";', a: '  empieza = empieza === "X" ? "O" : "X";\n  turno = empieza;' },
        { lang: 'js', de: '  estado.textContent = "Turno de X";', a: '  estado.textContent = "Turno de " + turno;' },
      ],
      acciones: [...GANA_X, clic('#nueva'), casilla(0)],
      pruebas: [
        { t: 'texto', sel: '#tablero [data-i="0"]', eq: 'O', msg: 'En la segunda partida, la primera jugada debería ser de O' },
        { t: 'texto', sel: '#estado', eq: 'Turno de X', msg: 'Después de que O abre, el estado debería decir: Turno de X' },
      ],
    },
    {
      id: 'm6',
      titulo: 'Deshacer',
      enunciado:
        'Agrega un botón con id="deshacer" que diga “Deshacer”, debajo del tablero. Borra la última jugada y le devuelve el turno a quien la hizo. Si la partida ya terminó, no hace nada.',
      pista:
        'Lleva un historial: let historial = []; y en cada jugada, historial.push(i). Deshacer saca la última con historial.pop(), vacía esa casilla, cambia el turno, actualiza el estado y vuelve a pintar. En Nueva partida, el historial también se vacía.',
      parches: [
        { lang: 'html', de: '  <div id="tablero"></div>', a: '  <div id="tablero"></div>\n  <button id="deshacer">Deshacer</button>' },
        { lang: 'js', de: 'let ganadora = [];', a: 'let ganadora = [];\nlet historial = [];' },
        { lang: 'js', de: '  casillas[i] = turno;', a: '  casillas[i] = turno;\n  historial.push(i);' },
        { lang: 'js', de: '  ganadora = [];', a: '  ganadora = [];\n  historial = [];' },
        {
          lang: 'js',
          de: '});\n\npintar();',
          a: '});\n\ndocument.getElementById("deshacer").addEventListener("click", () => {\n  if (terminado || historial.length === 0) return;\n  const ultima = historial.pop();\n  casillas[ultima] = "";\n  turno = turno === "X" ? "O" : "X";\n  estado.textContent = "Turno de " + turno;\n  pintar();\n});\n\npintar();',
        },
      ],
      acciones: [casilla(0), casilla(4), clic('#deshacer'), casilla(8)],
      pruebas: [
        { t: 'texto', sel: '#deshacer', eq: 'Deshacer', msg: 'Falta el botón con id="deshacer" que dice: Deshacer' },
        { t: 'texto', sel: '#tablero [data-i="4"]', eq: '', msg: 'Deshice la O de la casilla 4: debería quedar vacía' },
        { t: 'texto', sel: '#tablero [data-i="8"]', eq: 'O', msg: 'Después de deshacer le tocaba otra vez a O, y jugó en la 8' },
        { t: 'texto', sel: '#estado', eq: 'Turno de X', msg: 'Después de la O en la 8, el estado debería decir: Turno de X' },
      ],
    },
    {
      id: 'm7',
      titulo: 'La pista',
      enunciado:
        'Agrega un botón con id="pista" que diga “Pista”. Al presionarlo, busca una línea donde el jugador de turno ya tenga dos y la tercera esté libre, y a esa casilla libre le pone la clase sugerida, con un borde de afuera amarillo: outline: 3px solid #fde047. Solo ayuda al que tiene el turno.',
      pista:
        'Con LINEAS.find busca la línea: saca sus tres valores con linea.map((j) => casillas[j]), cuenta los del turno con filter(…).length === 2 y revisa que includes("") sea verdad. La casilla libre de esa línea es linea.find((j) => casillas[j] === ""), y su botón es tablero.children[libre].',
      parches: [
        { lang: 'html', de: '  <button id="deshacer">Deshacer</button>', a: '  <button id="deshacer">Deshacer</button>\n  <button id="pista">Pista</button>' },
        { lang: 'css', de: '.empate {', a: '.sugerida {\n  outline: 3px solid #fde047;\n}\n.empate {' },
        {
          lang: 'js',
          de: '});\n\npintar();',
          a: '});\n\ndocument.getElementById("pista").addEventListener("click", () => {\n  if (terminado) return;\n  const linea = LINEAS.find((l) => {\n    const valores = l.map((j) => casillas[j]);\n    return valores.filter((v) => v === turno).length === 2 && valores.includes("");\n  });\n  if (linea) {\n    const libre = linea.find((j) => casillas[j] === "");\n    tablero.children[libre].classList.add("sugerida");\n  }\n});\n\npintar();',
        },
      ],
      acciones: [...jugadas(0, 3, 1, 4), clic('#pista')],
      pruebas: [
        { t: 'clase', sel: '#tablero [data-i="2"]', name: 'sugerida', msg: 'X tiene 0 y 1: la pista debería marcar la casilla 2 con la clase sugerida' },
        { t: 'clase', sel: '#tablero [data-i="5"]', name: 'sugerida', tiene: false, msg: 'La casilla 5 le sirve a O, pero el turno es de X: no debería marcarse' },
        { t: 'estilo', sel: '#tablero [data-i="2"]', prop: 'outline-style', eq: 'solid', msg: 'La casilla sugerida debería tener outline: 3px solid #fde047' },
      ],
    },
  ],
}

/* ========================================================================== */
/* Proyecto 8 — el jefe final: barajar, un estado con varias piezas que se    */
/* vigilan entre sí, un setTimeout que bloquea el tablero, un reloj que       */
/* arranca y se detiene, récord y niveles.                                    */
/* ========================================================================== */

const HTML_8 = `<div class="memoria">
  <div class="info">
    <span id="movimientos">Movimientos: 0</span>
    <span id="parejas">Parejas: 0 de 4</span>
  </div>
  <div id="tablero"></div>
  <p id="mensaje"></p>
</div>`

const CSS_8 = `body {
  background: #3b0764;
  font-family: Arial, sans-serif;
}
.memoria {
  width: 300px;
  margin: 16px auto;
  color: #ffffff;
}
.info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
#tablero {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}
.carta {
  height: 64px;
  background: #a855f7;
  color: transparent;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}
.carta.volteada {
  background: #ffffff;
  color: #3b0764;
}
.carta.pareja {
  background: #bbf7d0;
  color: #14532d;
}`

const JS_8 = `const figuras = ["sol", "luna", "mar", "flor"];

const tablero = document.getElementById("tablero");
const movimientos = document.getElementById("movimientos");
const parejas = document.getElementById("parejas");
const mensaje = document.getElementById("mensaje");

let primera = null;
let bloqueado = false;
let jugadas = 0;
let encontradas = 0;

function barajar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function repartir() {
  tablero.innerHTML = "";
  barajar([...figuras, ...figuras]).forEach((figura) => {
    const carta = document.createElement("button");
    carta.className = "carta";
    carta.dataset.figura = figura;
    carta.textContent = figura;
    tablero.appendChild(carta);
  });
}

tablero.addEventListener("click", (e) => {
  const carta = e.target;
  if (!carta.classList.contains("carta")) return;
  if (bloqueado || carta === primera || carta.classList.contains("pareja")) return;

  carta.classList.add("volteada");

  if (primera === null) {
    primera = carta;
    return;
  }

  jugadas++;
  movimientos.textContent = "Movimientos: " + jugadas;

  if (primera.dataset.figura === carta.dataset.figura) {
    primera.classList.add("pareja");
    carta.classList.add("pareja");
    primera = null;
    encontradas++;
    parejas.textContent = "Parejas: " + encontradas + " de " + figuras.length;
    if (encontradas === figuras.length) {
      mensaje.textContent = "¡Ganaste en " + jugadas + " movimientos!";
    }
  } else {
    bloqueado = true;
    setTimeout(() => {
      primera.classList.remove("volteada");
      carta.classList.remove("volteada");
      primera = null;
      bloqueado = false;
    }, 800);
  }
});

repartir();`

/**
 * Voltea una carta de esa figura que todavía esté boca abajo. Las cartas salen
 * barajadas, así que la revisión no las busca por posición sino por figura.
 */
const voltear = (figura: string): Accion => clic(`.carta[data-figura="${figura}"]:not(.volteada)`)
const pareja = (figura: string) => [voltear(figura), voltear(figura)]
/** Las seis parejas, sin un solo error: 6 movimientos. */
const GANAR = ['sol', 'luna', 'mar', 'flor', 'nube', 'pez'].flatMap(pareja)

export const PROYECTO_8: Proyecto = {
  id: 'p8',
  numero: 8,
  titulo: 'El juego de memoria',
  nivel: 'Nivel jefe',
  lema: 'Proyecto 8 · El jefe final: barajar, un estado con muchas piezas y el tiempo de tu lado',
  descripcion:
    'Cartas boca abajo, se voltean de a dos y, si son iguales, se quedan. Si no, el tablero se bloquea un momento y se vuelven a esconder. Aquí se junta todo: barajar un arreglo, un estado que se vigila a sí mismo para que nadie haga trampa y temporizadores. Tus misiones le agregan un reloj, nueva partida, récord y niveles.',
  html: HTML_8,
  css: CSS_8,
  js: JS_8,
  misiones: [
    {
      id: 'm1',
      titulo: 'Réplica exacta',
      enunciado:
        'Escribe los tres archivos hasta que tu juego funcione igual que el modelo: las cartas salen barajadas, las parejas se quedan, las que no coinciden se esconden solas y mientras tanto no se puede voltear otra.',
      pista:
        'Tres piezas del estado hacen todo el trabajo: primera guarda la carta que ya está volteada, bloqueado impide jugar mientras se esconden, y encontradas cuenta parejas. [...figuras, ...figuras] pone cada figura dos veces, y barajar las revuelve intercambiando posiciones al azar.',
      parches: [],
      acciones: [
        voltear('sol'), voltear('luna'), esperar(1000),
        ...pareja('sol'), ...pareja('mar'),
        voltear('luna'), voltear('flor'), voltear('flor'),
      ],
      pruebas: [
        { t: 'conteo', sel: '#tablero .carta', eq: 8, msg: 'El tablero debería tener 8 cartas con class="carta"' },
        { t: 'conteo', sel: '.carta[data-figura="sol"]', eq: 2, msg: 'Cada figura va dos veces: debería haber dos cartas de sol' },
        { t: 'texto', sel: '#movimientos', eq: 'Movimientos: 4', msg: 'Hice 4 intentos: debería decir Movimientos: 4' },
        { t: 'texto', sel: '#parejas', eq: 'Parejas: 2 de 4', msg: 'Encontré sol y mar: debería decir Parejas: 2 de 4' },
        { t: 'conteo', sel: '.carta.pareja', eq: 4, msg: 'Las 4 cartas de las dos parejas deberían llevar la clase pareja' },
        { t: 'conteo', sel: '.carta.volteada', eq: 6, msg: 'Voltee luna y flor, no coincidieron, y antes de que se escondieran quise voltear otra flor: el tablero tenía que estar bloqueado' },
        { t: 'estilo', sel: 'body', prop: 'background-color', eq: '#3b0764', msg: 'El fondo de la página debe ser #3b0764' },
        { t: 'estilo', sel: '.info', prop: 'display', eq: 'flex', msg: 'La barra de información necesita display: flex' },
        { t: 'estilo', sel: '#tablero', prop: 'display', eq: 'grid', msg: 'El tablero necesita display: grid' },
        { t: 'estilo', sel: '#tablero', prop: 'column-gap', eq: '8px', msg: 'Al tablero le falta el gap: 8px' },
        { t: 'estilo', sel: '.carta', prop: 'border-radius', eq: '10px', msg: 'Las cartas llevan esquinas de 10px' },
        { t: 'estilo', sel: '.carta.pareja', prop: 'background-color', eq: '#bbf7d0', msg: 'Las parejas encontradas deben verse verdes: #bbf7d0' },
      ],
    },
    {
      id: 'm2',
      titulo: 'Más cartas',
      enunciado:
        'Cuatro parejas se acaban muy rápido. Agrega dos figuras más, “nube” y “pez”, para jugar con 12 cartas. Y que el contador de parejas diga “de 6” desde el principio.',
      pista:
        'Las cartas salen del arreglo figuras: agrega ahí las dos. El JavaScript ya usa figuras.length, pero el texto con el que arranca la página está escrito a mano en el HTML.',
      parches: [
        { lang: 'js', de: '"flor"];', a: '"flor", "nube", "pez"];' },
        { lang: 'html', de: 'Parejas: 0 de 4', a: 'Parejas: 0 de 6' },
      ],
      acciones: pareja('nube'),
      pruebas: [
        { t: 'conteo', sel: '#tablero .carta', eq: 12, msg: 'Con seis figuras debería haber 12 cartas' },
        { t: 'conteo', sel: '.carta[data-figura="pez"]', eq: 2, msg: 'Debería haber dos cartas de pez' },
        { t: 'texto', sel: '#parejas', eq: 'Parejas: 1 de 6', msg: 'Encontré la pareja de nube: debería decir Parejas: 1 de 6' },
      ],
    },
    {
      id: 'm3',
      titulo: 'El dorso de las cartas',
      enunciado: 'Las cartas boca abajo se ven planas. Cámbiales el fondo a #7e22ce y ponles un borde de 3px sólido #d8b4fe.',
      pista: 'Todo va en la regla .carta: cambia el background y reemplaza border: none; por el borde nuevo.',
      parches: [
        { lang: 'css', de: '  background: #a855f7;', a: '  background: #7e22ce;' },
        { lang: 'css', de: '  border: none;', a: '  border: 3px solid #d8b4fe;' },
      ],
      pruebas: [
        { t: 'estilo', sel: '.carta', prop: 'background-color', eq: '#7e22ce', msg: 'Las cartas boca abajo todavía no son #7e22ce' },
        { t: 'estilo', sel: '.carta', prop: 'border-top-width', eq: '3px', msg: 'A las cartas les falta el borde de 3px' },
        { t: 'estilo', sel: '.carta', prop: 'border-top-color', eq: '#d8b4fe', msg: 'El borde de las cartas debe ser #d8b4fe' },
      ],
    },
    {
      id: 'm4',
      titulo: 'Menos espera',
      enunciado: 'Cuando dos cartas no coinciden, el juego espera 800 milisegundos antes de esconderlas. Bájalo a 400: ya sabemos jugar.',
      pista: 'El número que va al final del setTimeout es cuánto espera, en milisegundos.',
      parches: [{ lang: 'js', de: '}, 800);', a: '}, 400);' }],
      acciones: [voltear('sol'), voltear('luna'), esperar(500), voltear('mar')],
      pruebas: [
        { t: 'conteo', sel: '.carta.volteada', eq: 1, msg: 'Pasado medio segundo, sol y luna ya tenían que haberse escondido y yo poder voltear otra: debería quedar una sola carta volteada' },
      ],
    },
    {
      id: 'm5',
      titulo: 'El reloj de la partida',
      enunciado:
        'Agrega en la barra de información un span con id="tiempo" que diga “Tiempo: 0 s”. El reloj arranca con la primera carta que volteas, sube cada segundo y se detiene al ganar.',
      pista:
        'Dos variables nuevas: let segundos = 0; y let reloj = null; Al voltear, si reloj es null, arráncalo con setInterval de 1000. Al ganar, clearInterval(reloj). Así el reloj no se arranca dos veces ni sigue contando después.',
      parches: [
        { lang: 'html', de: 'Parejas: 0 de 6</span>', a: 'Parejas: 0 de 6</span>\n    <span id="tiempo">Tiempo: 0 s</span>' },
        { lang: 'js', de: 'let encontradas = 0;', a: 'let encontradas = 0;\nlet segundos = 0;\nlet reloj = null;' },
        {
          lang: 'js',
          de: '  carta.classList.add("volteada");',
          a: '  if (reloj === null) {\n    reloj = setInterval(() => {\n      segundos++;\n      document.getElementById("tiempo").textContent = "Tiempo: " + segundos + " s";\n    }, 1000);\n  }\n\n  carta.classList.add("volteada");',
        },
        {
          lang: 'js',
          de: '      mensaje.textContent = "¡Ganaste en " + jugadas + " movimientos!";',
          a: '      mensaje.textContent = "¡Ganaste en " + jugadas + " movimientos!";\n      clearInterval(reloj);',
        },
      ],
      acciones: [voltear('sol'), esperar(2000), voltear('sol'), esperar(1000), ...GANAR.slice(2), esperar(5000)],
      pruebas: [
        { t: 'texto', sel: '#mensaje', eq: '¡Ganaste en 6 movimientos!', msg: 'Encontré las seis parejas sin fallar: debería decir ¡Ganaste en 6 movimientos!' },
        { t: 'texto', sel: '#tiempo', eq: 'Tiempo: 3 s', msg: 'Gané a los 3 segundos y esperé 5 más: el reloj tenía que quedarse en Tiempo: 3 s' },
      ],
    },
    {
      id: 'm6',
      titulo: 'Nueva partida',
      enunciado:
        'Agrega debajo del mensaje un botón con id="nueva" que diga “Nueva partida”. Vuelve a barajar y deja todo en cero: movimientos, parejas, tiempo y mensaje. El reloj no vuelve a correr hasta que voltees una carta.',
      pista:
        'Haz una lista de todo lo que el juego recuerda —cada let de arriba— y devuélvelo a como empezó. Para el reloj: clearInterval(reloj) y después reloj = null, porque así sabe que puede volver a arrancar. Al final, repartir().',
      parches: [
        { lang: 'html', de: '  <p id="mensaje"></p>', a: '  <p id="mensaje"></p>\n  <button id="nueva">Nueva partida</button>' },
        {
          lang: 'js',
          de: '});\n\nrepartir();',
          a: '});\n\ndocument.getElementById("nueva").addEventListener("click", () => {\n  clearInterval(reloj);\n  reloj = null;\n  segundos = 0;\n  primera = null;\n  bloqueado = false;\n  jugadas = 0;\n  encontradas = 0;\n  movimientos.textContent = "Movimientos: 0";\n  parejas.textContent = "Parejas: 0 de " + figuras.length;\n  document.getElementById("tiempo").textContent = "Tiempo: 0 s";\n  mensaje.textContent = "";\n  repartir();\n});\n\nrepartir();',
        },
      ],
      acciones: [...GANAR, esperar(2000), clic('#nueva'), esperar(3000)],
      pruebas: [
        { t: 'texto', sel: '#nueva', eq: 'Nueva partida', msg: 'Falta el botón con id="nueva" que dice: Nueva partida' },
        { t: 'conteo', sel: '.carta.volteada', eq: 0, msg: 'En la partida nueva todas las cartas deberían estar boca abajo' },
        { t: 'texto', sel: '#movimientos', eq: 'Movimientos: 0', msg: 'La partida nueva debería arrancar en Movimientos: 0' },
        { t: 'texto', sel: '#parejas', eq: 'Parejas: 0 de 6', msg: 'La partida nueva debería arrancar en Parejas: 0 de 6' },
        { t: 'texto', sel: '#mensaje', eq: '', msg: 'En la partida nueva no debería quedar el mensaje de ganaste' },
        { t: 'texto', sel: '#tiempo', eq: 'Tiempo: 0 s', msg: 'Empecé partida nueva y esperé 3 segundos sin voltear nada: el tiempo tenía que seguir en 0 s' },
      ],
    },
    {
      id: 'm7',
      titulo: 'El récord',
      enunciado:
        'Agrega debajo del mensaje un párrafo con id="record" que empiece diciendo “Récord: sin jugar”. Cada vez que alguien gane con menos movimientos que el récord, se actualiza: “Récord: 6 movimientos”. Si gana con más, el récord no cambia.',
      pista:
        'let record = null; guarda el mejor. Al ganar: si record es null (nunca se ha jugado) o jugadas < record, entonces record = jugadas y escribes el texto. No lo reinicies en Nueva partida: la gracia es que dure.',
      parches: [
        { lang: 'html', de: '  <p id="mensaje"></p>', a: '  <p id="mensaje"></p>\n  <p id="record">Récord: sin jugar</p>' },
        { lang: 'js', de: 'let reloj = null;', a: 'let reloj = null;\nlet record = null;' },
        {
          lang: 'js',
          de: '      clearInterval(reloj);',
          a: '      clearInterval(reloj);\n      if (record === null || jugadas < record) {\n        record = jugadas;\n        document.getElementById("record").textContent = "Récord: " + record + " movimientos";\n      }',
        },
      ],
      acciones: [...GANAR, clic('#nueva'), voltear('sol'), voltear('luna'), esperar(500), ...GANAR],
      pruebas: [
        { t: 'texto', sel: '#mensaje', eq: '¡Ganaste en 7 movimientos!', msg: 'En la segunda partida fallé una vez: debería decir ¡Ganaste en 7 movimientos!' },
        { t: 'texto', sel: '#record', eq: 'Récord: 6 movimientos', msg: 'Gané en 6 y después en 7: el récord se tiene que quedar en Récord: 6 movimientos' },
      ],
    },
    {
      id: 'm8',
      titulo: 'Niveles',
      enunciado:
        'Agrega antes del tablero un select con id="nivel" y tres opciones: Fácil (4 parejas), Normal (6, la que viene elegida) y Difícil (8). Para el Difícil suma las figuras “luz” y “pan”. Al cambiar de nivel empieza una partida nueva con esa cantidad de parejas.',
      pista:
        'Cada option lleva la cantidad en value, y Normal lleva selected. Crea una función cantidad() que devuelva Number(nivel.value) y úsala en vez de figuras.length (son tres lugares). Para repartir, toma solo las que tocan con figuras.slice(0, cantidad()). Y en el change del select, basta con hacerle click() al botón de Nueva partida.',
      parches: [
        { lang: 'js', de: '"nube", "pez"];', a: '"nube", "pez", "luz", "pan"];' },
        {
          lang: 'html',
          de: '  <div id="tablero"></div>',
          a: '  <select id="nivel">\n    <option value="4">Fácil</option>\n    <option value="6" selected>Normal</option>\n    <option value="8">Difícil</option>\n  </select>\n  <div id="tablero"></div>',
        },
        { lang: 'js', de: 'function barajar(lista) {', a: 'function cantidad() {\n  return Number(document.getElementById("nivel").value);\n}\n\nfunction barajar(lista) {' },
        { lang: 'js', de: '  barajar([...figuras, ...figuras])', a: '  const elegidas = figuras.slice(0, cantidad());\n  barajar([...elegidas, ...elegidas])' },
        // figuras.length aparece tres veces y cada parche reemplaza la primera que encuentre.
        { lang: 'js', de: 'figuras.length', a: 'cantidad()' },
        { lang: 'js', de: 'figuras.length', a: 'cantidad()' },
        { lang: 'js', de: 'figuras.length', a: 'cantidad()' },
        {
          lang: 'js',
          de: '});\n\nrepartir();',
          a: '});\n\ndocument.getElementById("nivel").addEventListener("change", () => {\n  document.getElementById("nueva").click();\n});\n\nrepartir();',
        },
      ],
      acciones: [{ t: 'escribir', sel: '#nivel', texto: '8' }, ...pareja('pan')],
      pruebas: [
        { t: 'conteo', sel: '#nivel option', eq: 3, msg: 'El select con id="nivel" debería tener tres opciones' },
        { t: 'conteo', sel: '#tablero .carta', eq: 16, msg: 'Elegí Difícil: debería haber 16 cartas' },
        { t: 'texto', sel: '#parejas', eq: 'Parejas: 1 de 8', msg: 'En Difícil encontré la pareja de pan: debería decir Parejas: 1 de 8' },
      ],
    },
  ],
}

export const PROYECTOS: Proyecto[] = [
  PROYECTO_1,
  PROYECTO_2,
  PROYECTO_3,
  PROYECTO_4,
  PROYECTO_5,
  PROYECTO_6,
  PROYECTO_7,
  PROYECTO_8,
]

export function proyectoPorId(id: string) {
  return PROYECTOS.find((p) => p.id === id)
}

/** Aplica los parches de una misión sobre el código. Solo para el autodiagnóstico. */
export function aplicarParches(codigo: Record<'html' | 'css' | 'js', string>, parches: Parche[] = []) {
  const salida = { ...codigo }
  // Con una función y no con el texto directo: así un $$ o un $& dentro del
  // parche (el proyecto 5 los tiene) se copian tal cual y no como patrones.
  for (const p of parches) salida[p.lang] = salida[p.lang].replace(p.de, () => p.a)
  return salida
}
