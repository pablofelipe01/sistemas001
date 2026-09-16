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

export const PROYECTOS: Proyecto[] = [PROYECTO_1, PROYECTO_2, PROYECTO_3, PROYECTO_4, PROYECTO_5]

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
