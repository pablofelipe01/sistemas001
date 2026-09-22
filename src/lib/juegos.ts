/**
 * Contenido de los juegos de recreo: preguntas rápidas para el triqui, parejas
 * para el juego de memoria y los códigos que cargan el láser de los invasores.
 *
 * Todo sale de lo que ya se vio en las guías 1, 2 y 3. La idea es repasar
 * jugando, no enseñar nada nuevo en un día en que los niños están cansados.
 */
import type { Lang } from './types'

export function barajar<T>(lista: readonly T[]): T[] {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

/* ------------------------------------------------------------- triqui --- */

/** Pregunta de selección múltiple: la buena y dos que se le parecen. */
export interface Pregunta {
  q: string
  codigo?: string
  bien: string
  mal: [string, string]
}

export const PREGUNTAS: Pregunta[] = [
  // HTML
  { q: '¿Qué etiqueta hace el título más grande?', bien: '<h1>', mal: ['<h6>', '<title>'] },
  { q: '¿Qué etiqueta crea un enlace?', bien: '<a>', mal: ['<link>', '<href>'] },
  { q: '¿Qué atributo dice a dónde lleva un enlace?', bien: 'href', mal: ['src', 'alt'] },
  { q: '¿Qué atributo le dice a <img> qué imagen mostrar?', bien: 'src', mal: ['href', 'alt'] },
  {
    q: '¿Para qué sirve alt en una imagen?',
    bien: 'Describe la imagen',
    mal: ['Cambia su tamaño', 'La pone de fondo'],
  },
  { q: '¿Qué etiqueta hace un párrafo?', bien: '<p>', mal: ['<par>', '<text>'] },
  { q: '¿Qué etiqueta hace una lista con viñetas?', bien: '<ul>', mal: ['<ol>', '<li>'] },
  { q: '¿Cuál está bien cerrado?', bien: '<p>Hola</p>', mal: ['<p>Hola<p>', '</p>Hola<p>'] },
  { q: '¿Dónde va lo que se ve en la página?', bien: '<body>', mal: ['<head>', '<title>'] },
  { q: '¿Qué etiqueta crea una cajita para escribir?', bien: '<input>', mal: ['<button>', '<label>'] },
  { q: '¿Qué es esto?', codigo: '<!-- hola -->', bien: 'Un comentario', mal: ['Un título', 'Un error'] },
  { q: '¿Qué etiqueta crea un botón?', bien: '<button>', mal: ['<btn>', '<click>'] },

  // CSS
  { q: '¿Qué propiedad cambia el color de las letras?', bien: 'color', mal: ['background', 'font-color'] },
  { q: '¿Qué propiedad cambia el color del fondo?', bien: 'background-color', mal: ['color', 'border'] },
  { q: '¿Cómo se selecciona la clase "nave"?', bien: '.nave', mal: ['#nave', 'nave()'] },
  { q: '¿Cómo se selecciona el id "titulo"?', bien: '#titulo', mal: ['.titulo', '*titulo'] },
  {
    q: '¿Qué hace esto?',
    codigo: 'text-align: center;',
    bien: 'Centra el texto',
    mal: ['Pone negrita', 'Agranda la letra'],
  },
  { q: '¿Qué propiedad agranda la letra?', bien: 'font-size', mal: ['text-size', 'font-big'] },
  {
    q: '¿Qué le pasa a un cuadrado con esto?',
    codigo: 'border-radius: 50%;',
    bien: 'Se vuelve círculo',
    mal: ['Pierde el borde', 'Se hace invisible'],
  },
  {
    q: '¿Qué hace esto?',
    codigo: 'display: none;',
    bien: 'Esconde el elemento',
    mal: ['Lo pone en fila', 'Lo centra'],
  },
  { q: '¿Qué pone a los hijos en fila?', bien: 'display: flex;', mal: ['display: none;', 'position: row;'] },
  {
    q: '¿Qué espacio va DENTRO de la caja, entre el borde y el contenido?',
    bien: 'padding',
    mal: ['margin', 'gap'],
  },
  { q: '¿Qué signo termina cada línea de CSS?', bien: ';', mal: [':', '.'] },
  {
    q: '¿Cuándo se aplica esto?',
    codigo: 'a:hover { color: red; }',
    bien: 'Con el mouse encima',
    mal: ['Con doble clic', 'Siempre'],
  },

  // JavaScript
  { q: '¿Qué muestra?', codigo: 'console.log(2 + 3)', bien: '5', mal: ['2 + 3', '23'] },
  { q: '¿Qué muestra?', codigo: "console.log('2' + 3)", bien: '23', mal: ['5', 'Un error'] },
  { q: '¿Cuál guarda un valor que puede cambiar?', bien: 'let', mal: ['const', 'log'] },
  { q: '¿Cuánto vale x al final?', codigo: 'let x = 5;\nx = x + 1;', bien: '6', mal: ['5', '51'] },
  { q: '¿Qué escribe un mensaje en la consola?', bien: 'console.log()', mal: ['print()', 'alert.log()'] },
  { q: '¿Qué da esto?', codigo: '10 > 3', bien: 'true', mal: ['false', '7'] },
  {
    q: 'Si edad vale 18, ¿qué pasa?',
    codigo: 'if (edad >= 18) { ... }',
    bien: 'Entra al if',
    mal: ['No entra', 'Da error'],
  },
  {
    q: '¿Qué da frutas[0]?',
    codigo: "let frutas = ['pera', 'uva', 'kiwi'];",
    bien: "'pera'",
    mal: ["'uva'", "'kiwi'"],
  },
  {
    q: '¿Qué da frutas.length?',
    codigo: "let frutas = ['pera', 'uva', 'kiwi'];",
    bien: '3',
    mal: ['2', "'kiwi'"],
  },
  { q: '¿Cuántas veces se repite?', codigo: 'for (let i = 0; i < 4; i++)', bien: '4', mal: ['3', '5'] },
  {
    q: '¿Qué busca un elemento de la página?',
    bien: 'document.querySelector()',
    mal: ['document.find()', 'page.get()'],
  },
  { q: '¿Cómo se llama el evento de hacer clic?', bien: "'click'", mal: ["'press'", "'touch'"] },
  { q: '¿Qué significa === ?', bien: 'Compara si son iguales', mal: ['Guarda un valor', 'Suma'] },
  {
    q: '¿Cómo se llama (se usa) esta función?',
    codigo: 'function saludar() { ... }',
    bien: 'saludar()',
    mal: ['function saludar', 'saludar{}'],
  },
  { q: '¿Qué da esto?', codigo: 'Math.max(4, 9, 2)', bien: '9', mal: ['4', '15'] },
  { q: '¿Qué da esto?', codigo: "'hola'.toUpperCase()", bien: "'HOLA'", mal: ["'hola'", "'Hola'"] },
  { q: '¿Qué da esto? (el resto de dividir)', codigo: '7 % 2', bien: '1', mal: ['3.5', '3'] },
]

/* ------------------------------------------------------------ parejas --- */

/**
 * Una pareja: lo que se VE en la página (o en la consola) y el código que lo
 * produce. `clase` dibuja la vista con Tailwind, sobre una tarjeta blanca como
 * si fuera una ventanita del navegador.
 */
export interface Pareja {
  id: string
  vista: string
  clase: string
  codigo: string
  explica: string
}

export const PAREJAS: Pareja[] = [
  {
    id: 'h1',
    vista: '¡Hola Mundo!',
    clase: 'text-lg font-black text-slate-900',
    codigo: '<h1>¡Hola Mundo!</h1>',
    explica: '<h1> es el título más grande de la página.',
  },
  {
    id: 'p',
    vista: 'Había una vez un robot…',
    clase: 'text-[11px] text-slate-700',
    codigo: '<p>Había una vez un robot…</p>',
    explica: '<p> es un párrafo: texto normal.',
  },
  {
    id: 'a',
    vista: 'Ir a Google',
    clase: 'text-sm text-blue-600 underline',
    codigo: '<a href="https://google.com">Ir a Google</a>',
    explica: '<a> es un enlace: azul y subrayado. href dice a dónde lleva.',
  },
  {
    id: 'button',
    vista: 'Jugar',
    clase: 'rounded border border-slate-400 bg-slate-200 px-3 py-1 text-xs text-slate-900',
    codigo: '<button>Jugar</button>',
    explica: '<button> dibuja un botón.',
  },
  {
    id: 'em',
    vista: 'un susurro',
    clase: 'text-sm italic text-slate-700',
    codigo: '<em>un susurro</em>',
    explica: '<em> pone el texto en cursiva, para darle énfasis.',
  },
  {
    id: 'ul',
    vista: '• Pan\n• Leche',
    clase: 'whitespace-pre text-left text-xs text-slate-800',
    codigo: '<ul>\n  <li>Pan</li>\n  <li>Leche</li>\n</ul>',
    explica: '<ul> es una lista con viñetas.',
  },
  {
    id: 'ol',
    vista: '1. Pan\n2. Leche',
    clase: 'whitespace-pre text-left text-xs text-slate-800',
    codigo: '<ol>\n  <li>Pan</li>\n  <li>Leche</li>\n</ol>',
    explica: '<ol> es una lista con números.',
  },
  {
    id: 'input',
    vista: 'Escribe aquí…',
    clase: 'rounded border border-slate-400 bg-white px-2 py-1 text-[10px] text-slate-400',
    codigo: '<input placeholder="Escribe aquí…">',
    explica: '<input> es una cajita para escribir.',
  },
  {
    id: 'img',
    vista: '🐱',
    clase: 'text-4xl',
    codigo: '<img src="gato.jpg" alt="Un gato">',
    explica: '<img> muestra una imagen. src dice cuál.',
  },
  {
    id: 'color',
    vista: 'Texto rojo',
    clase: 'text-sm font-bold text-red-600',
    codigo: 'color: red;',
    explica: 'color cambia el color de las letras.',
  },
  {
    id: 'fondo',
    vista: 'Fondo amarillo',
    clase: 'bg-yellow-300 px-2 py-1 text-xs text-slate-900',
    codigo: 'background: yellow;',
    explica: 'background cambia el fondo.',
  },
  {
    id: 'font-size',
    vista: 'Letra gigante',
    clase: 'text-2xl leading-tight text-slate-900',
    codigo: 'font-size: 40px;',
    explica: 'font-size cambia el tamaño de la letra.',
  },
  {
    id: 'circulo',
    vista: '',
    clase: 'h-10 w-10 rounded-full bg-emerald-500',
    codigo: 'border-radius: 50%;',
    explica: 'border-radius: 50% vuelve círculo a un cuadrado.',
  },
  {
    id: 'borde',
    vista: 'Caja',
    clase: 'border-2 border-slate-900 px-3 py-1 text-xs text-slate-900',
    codigo: 'border: 2px solid black;',
    explica: 'border le pone un borde: grosor, estilo y color.',
  },
  {
    id: 'none',
    vista: '(aquí no se ve nada)',
    clase: 'text-[10px] italic text-slate-400',
    codigo: 'display: none;',
    explica: 'display: none esconde el elemento.',
  },
  {
    id: 'flex',
    vista: '▢ ▢ ▢',
    clase: 'text-xl tracking-widest text-slate-700',
    codigo: 'display: flex;',
    explica: 'display: flex pone a los hijos en fila.',
  },
  {
    id: 'suma',
    vista: '▶ 5',
    clase: 'font-mono text-base font-bold text-emerald-700',
    codigo: 'console.log(2 + 3);',
    explica: 'Números con + se suman: 2 + 3 da 5.',
  },
  {
    id: 'pega',
    vista: '▶ 23',
    clase: 'font-mono text-base font-bold text-emerald-700',
    codigo: "console.log('2' + '3');",
    explica: 'Textos con + se pegan: \'2\' + \'3\' da \'23\'.',
  },
  {
    id: 'mayus',
    vista: '▶ HOLA',
    clase: 'font-mono text-base font-bold text-emerald-700',
    codigo: "console.log('hola'.toUpperCase());",
    explica: 'toUpperCase() pasa el texto a mayúsculas.',
  },
  {
    id: 'length',
    vista: '▶ 4',
    clase: 'font-mono text-base font-bold text-emerald-700',
    codigo: "console.log(['a', 'b', 'c', 'd'].length);",
    explica: '.length dice cuántas cosas tiene el arreglo.',
  },
  {
    id: 'for',
    vista: '▶ 0\n▶ 1\n▶ 2',
    clase: 'whitespace-pre font-mono text-xs font-bold text-emerald-700',
    codigo: 'for (let i = 0; i < 3; i++) {\n  console.log(i);\n}',
    explica: 'El for repite: i vale 0, 1 y 2.',
  },
  {
    id: 'alert',
    vista: '⚠️ ¡Cuidado!\n[ Aceptar ]',
    clase: 'whitespace-pre text-xs text-slate-800',
    codigo: "alert('¡Cuidado!');",
    explica: 'alert() abre una ventanita de aviso.',
  },
]

/* ---------------------------------------------------------- invasores --- */

/** Un pedacito de lo que debe tener el código, y qué decirle al niño si falta. */
interface Regla {
  re: RegExp
  falta: string
}

/** Un código que carga el láser. Se escribe completo, sin pegar. */
export interface Carga {
  id: string
  lang: Lang
  pide: string
  ejemplo: string
  reglas: Regla[]
}

const COMILLA = `['"\`]`

export const CARGAS: Carga[] = [
  {
    id: 'energia',
    lang: 'js',
    pide: 'Crea una variable llamada energia que valga 100, y muéstrala con console.log.',
    ejemplo: 'let energia = 100;\nconsole.log(energia);',
    reglas: [
      { re: /\b(let|const|var)\s+energia\s*=\s*100\b/, falta: 'Falta crear la variable: let energia = 100;' },
      { re: /console\.log\(\s*energia\s*\)/, falta: 'Falta mostrarla: console.log(energia);' },
    ],
  },
  {
    id: 'fuego',
    lang: 'html',
    pide: 'Escribe un título h1 que diga Fuego y debajo un párrafo que diga Láser listo.',
    ejemplo: '<h1>Fuego</h1>\n<p>Láser listo</p>',
    reglas: [
      { re: /<h1>\s*fuego\s*<\/h1>/i, falta: 'Falta el título: <h1>Fuego</h1>' },
      { re: /<p>\s*l[aá]ser listo\s*<\/p>/i, falta: 'Falta el párrafo: <p>Láser listo</p>' },
    ],
  },
  {
    id: 'laser-css',
    lang: 'css',
    pide: 'Dale estilo a la clase laser: color red y width de 10px.',
    ejemplo: '.laser {\n  color: red;\n  width: 10px;\n}',
    reglas: [
      { re: /\.laser\s*\{/, falta: 'Falta el selector de la clase: .laser {' },
      { re: /color\s*:\s*red\s*;?/i, falta: 'Falta color: red;' },
      { re: /width\s*:\s*10px\s*;?/i, falta: 'Falta width: 10px;' },
      { re: /\}/, falta: 'Falta cerrar la llave }' },
    ],
  },
  {
    id: 'disparar',
    lang: 'js',
    pide: 'Crea una función llamada disparar que haga console.log de "pium".',
    ejemplo: "function disparar() {\n  console.log('pium');\n}",
    reglas: [
      { re: /function\s+disparar\s*\(\s*\)\s*\{/, falta: 'Falta empezar la función: function disparar() {' },
      { re: new RegExp(`console\\.log\\(\\s*${COMILLA}pium${COMILLA}\\s*\\)`, 'i'), falta: "Falta console.log('pium');" },
      { re: /\}\s*$/, falta: 'Falta cerrar la función con }' },
    ],
  },
  {
    id: 'balas-if',
    lang: 'js',
    pide: 'Escribe un if: si balas es mayor que 0, haz console.log de "fuego".',
    ejemplo: "if (balas > 0) {\n  console.log('fuego');\n}",
    reglas: [
      { re: /if\s*\(\s*balas\s*>\s*0\s*\)\s*\{/, falta: 'Falta la condición: if (balas > 0) {' },
      { re: new RegExp(`console\\.log\\(\\s*${COMILLA}fuego${COMILLA}\\s*\\)`, 'i'), falta: "Falta console.log('fuego');" },
      { re: /\}\s*$/, falta: 'Falta cerrar el if con }' },
    ],
  },
  {
    id: 'boton',
    lang: 'html',
    pide: 'Escribe un botón con id="disparo" que diga Disparar, y un párrafo que diga Balas: 5.',
    ejemplo: '<button id="disparo">Disparar</button>\n<p>Balas: 5</p>',
    reglas: [
      {
        re: /<button\s+id\s*=\s*["']disparo["']\s*>\s*disparar\s*<\/button>/i,
        falta: 'Falta el botón: <button id="disparo">Disparar</button>',
      },
      { re: /<p>\s*balas:\s*5\s*<\/p>/i, falta: 'Falta el párrafo: <p>Balas: 5</p>' },
    ],
  },
  {
    id: 'suma',
    lang: 'js',
    pide: 'Crea la variable a con 5, la variable b con 3, y muestra a + b con console.log.',
    ejemplo: 'let a = 5;\nlet b = 3;\nconsole.log(a + b);',
    reglas: [
      { re: /\b(let|const|var)\s+a\s*=\s*5\b/, falta: 'Falta let a = 5;' },
      { re: /\b(let|const|var)\s+b\s*=\s*3\b/, falta: 'Falta let b = 3;' },
      { re: /console\.log\(\s*a\s*\+\s*b\s*\)/, falta: 'Falta console.log(a + b);' },
    ],
  },
  {
    id: 'cuenta',
    lang: 'js',
    pide: 'Escribe un for que cuente de 1 a 3 y muestre i con console.log.',
    ejemplo: 'for (let i = 1; i <= 3; i++) {\n  console.log(i);\n}',
    reglas: [
      {
        re: /for\s*\(\s*(let|var)\s+i\s*=\s*1\s*;\s*i\s*(<=\s*3|<\s*4)\s*;\s*i\+\+\s*\)\s*\{/,
        falta: 'Revisa el for: for (let i = 1; i <= 3; i++) {',
      },
      { re: /console\.log\(\s*i\s*\)/, falta: 'Falta console.log(i);' },
      { re: /\}\s*$/, falta: 'Falta cerrar el for con }' },
    ],
  },
  {
    id: 'espacio',
    lang: 'css',
    pide: 'Pinta el body: background black y color white.',
    ejemplo: 'body {\n  background: black;\n  color: white;\n}',
    reglas: [
      { re: /body\s*\{/, falta: 'Falta el selector: body {' },
      { re: /background(-color)?\s*:\s*black\s*;?/i, falta: 'Falta background: black;' },
      { re: /(^|[\s;{])color\s*:\s*white\s*;?/i, falta: 'Falta color: white;' },
      { re: /\}/, falta: 'Falta cerrar la llave }' },
    ],
  },
  {
    id: 'naves',
    lang: 'js',
    pide: 'Crea un arreglo naves con "roja" y "azul", y muestra cuántas hay con console.log.',
    ejemplo: "let naves = ['roja', 'azul'];\nconsole.log(naves.length);",
    reglas: [
      {
        re: new RegExp(
          `\\b(let|const|var)\\s+naves\\s*=\\s*\\[\\s*${COMILLA}roja${COMILLA}\\s*,\\s*${COMILLA}azul${COMILLA}\\s*\\]`,
          'i',
        ),
        falta: "Falta el arreglo: let naves = ['roja', 'azul'];",
      },
      { re: /console\.log\(\s*naves\.length\s*\)/, falta: 'Falta console.log(naves.length);' },
    ],
  },
  {
    id: 'lista',
    lang: 'html',
    pide: 'Escribe una lista ul con dos elementos: Láser y Escudo.',
    ejemplo: '<ul>\n  <li>Láser</li>\n  <li>Escudo</li>\n</ul>',
    reglas: [
      { re: /<ul>/i, falta: 'Falta abrir la lista: <ul>' },
      { re: /<li>\s*l[aá]ser\s*<\/li>/i, falta: 'Falta <li>Láser</li>' },
      { re: /<li>\s*escudo\s*<\/li>/i, falta: 'Falta <li>Escudo</li>' },
      { re: /<\/ul>/i, falta: 'Falta cerrar la lista: </ul>' },
    ],
  },
  {
    id: 'nave-css',
    lang: 'css',
    pide: 'Dale estilo a la clase nave: border-radius de 50% y background green.',
    ejemplo: '.nave {\n  border-radius: 50%;\n  background: green;\n}',
    reglas: [
      { re: /\.nave\s*\{/, falta: 'Falta el selector de la clase: .nave {' },
      { re: /border-radius\s*:\s*50%\s*;?/i, falta: 'Falta border-radius: 50%;' },
      { re: /background(-color)?\s*:\s*green\s*;?/i, falta: 'Falta background: green;' },
      { re: /\}/, falta: 'Falta cerrar la llave }' },
    ],
  },
]

/** Devuelve lo primero que le falta al código, o null si carga el láser. */
export function revisarCarga(c: Carga, codigo: string): string | null {
  const limpio = codigo.trim()
  if (!limpio) return 'La terminal está vacía: escribe el código.'
  for (const r of c.reglas) if (!r.re.test(limpio)) return r.falta
  return null
}
