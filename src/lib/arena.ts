/**
 * La arena de juegos: se arma un juego de verdad, parte por parte.
 *
 * Cada parte trae una explicación corta, el código COMPLETO del juego hasta esa
 * parte (las líneas nuevas se pintan de verde) y una revisión. El alumno lo
 * escribe en su terminal (no se pega nada), le da ▶ Jugar para verlo en
 * pantalla, y ✔ Comprobar para pasar a la siguiente.
 *
 * La revisión corre el juego del alumno escondido y con un reloj de mentira
 * (public/arena.html): avanza cuadros, oprime teclas y mira las variables. Por
 * eso las pruebas usan los mismos nombres del modelo (canasta, fruta, puntos…).
 */

/** Un paso de la revisión. Se hacen en orden, sobre el mismo juego. */
export type PasoArena =
  /** Avanza n cuadros (1/60 de segundo cada uno). */
  | { t: 'cuadros'; n: number }
  /** Oprime una tecla y la deja oprimida. */
  | { t: 'tecla'; key: string }
  /** Suelta una tecla. */
  | { t: 'soltar'; key: string }
  /** Cambia algo del juego antes de mirar (pone la fruta encima de la canasta, por ejemplo). */
  | { t: 'ejecutar'; js: string }
  /** Mira algo. Si da falso, se le muestra msg con una ✗. */
  | { t: 'ver'; js: string; msg: string }

export interface ParteJuego {
  id: string
  titulo: string
  /** Párrafos cortos. Lo que va entre `comillas invertidas` se ve como código. */
  explicacion: string[]
  /** El juego completo hasta esta parte. */
  codigo: string
  pruebas: PasoArena[]
  /** Una idea para cambiarlo a su gusto, que se ofrece al pasar la parte. No se revisa. */
  idea: string
}

export interface JuegoArena {
  id: string
  emoji: string
  titulo: string
  nivel: string
  color: string
  lema: string
  descripcion: string
  /** Cómo se juega, para la galería y la pantalla. */
  controles: string
  partes: ParteJuego[]
}

/** Quita el primer salto de línea de un bloque de código. */
const c = (s: string) => s.replace(/^\n/, '')

/* Pruebas que se repiten. */
const pintadoEn = (x: string, y: string) => `String(__pixel(${x}, ${y})) !== String(__pixel(2, 2))`

/* ================================================================ 1. fruta */

const FRUTA_1 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

pincel.fillStyle = '#0b1224'
pincel.fillRect(0, 0, 600, 400)

pincel.fillStyle = '#fbbf24'
pincel.fillRect(260, 360, 80, 20)
`)

const FRUTA_2 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let canasta = { x: 260, y: 360, ancho: 80, alto: 20 }

function dibujar() {
  pincel.fillStyle = '#0b1224'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#fbbf24'
  pincel.fillRect(canasta.x, canasta.y, canasta.ancho, canasta.alto)
}

dibujar()
`)

const FRUTA_3 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let canasta = { x: 260, y: 360, ancho: 80, alto: 20 }
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function mover() {
  if (teclas['ArrowLeft']) canasta.x = canasta.x - 6
  if (teclas['ArrowRight']) canasta.x = canasta.x + 6
}

function dibujar() {
  pincel.fillStyle = '#0b1224'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#fbbf24'
  pincel.fillRect(canasta.x, canasta.y, canasta.ancho, canasta.alto)
}

function bucle() {
  mover()
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const FRUTA_4 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let canasta = { x: 260, y: 360, ancho: 80, alto: 20 }
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function mover() {
  if (teclas['ArrowLeft']) canasta.x = canasta.x - 6
  if (teclas['ArrowRight']) canasta.x = canasta.x + 6

  if (canasta.x < 0) canasta.x = 0
  if (canasta.x > 600 - canasta.ancho) canasta.x = 600 - canasta.ancho
}

function dibujar() {
  pincel.fillStyle = '#0b1224'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#fbbf24'
  pincel.fillRect(canasta.x, canasta.y, canasta.ancho, canasta.alto)
}

function bucle() {
  mover()
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const FRUTA_5 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let canasta = { x: 260, y: 360, ancho: 80, alto: 20 }
let fruta = { x: 300, y: 0, tamano: 16, velocidad: 3 }
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function mover() {
  if (teclas['ArrowLeft']) canasta.x = canasta.x - 6
  if (teclas['ArrowRight']) canasta.x = canasta.x + 6

  if (canasta.x < 0) canasta.x = 0
  if (canasta.x > 600 - canasta.ancho) canasta.x = 600 - canasta.ancho
}

function moverFruta() {
  fruta.y = fruta.y + fruta.velocidad
  if (fruta.y > 400) {
    fruta.y = 0
    fruta.x = Math.random() * 560 + 20
  }
}

function dibujar() {
  pincel.fillStyle = '#0b1224'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#fbbf24'
  pincel.fillRect(canasta.x, canasta.y, canasta.ancho, canasta.alto)

  pincel.fillStyle = '#f43f5e'
  pincel.beginPath()
  pincel.arc(fruta.x, fruta.y, fruta.tamano, 0, Math.PI * 2)
  pincel.fill()
}

function bucle() {
  mover()
  moverFruta()
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const FRUTA_6 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let canasta = { x: 260, y: 360, ancho: 80, alto: 20 }
let fruta = { x: 300, y: 0, tamano: 16, velocidad: 3 }
let puntos = 0
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function mover() {
  if (teclas['ArrowLeft']) canasta.x = canasta.x - 6
  if (teclas['ArrowRight']) canasta.x = canasta.x + 6

  if (canasta.x < 0) canasta.x = 0
  if (canasta.x > 600 - canasta.ancho) canasta.x = 600 - canasta.ancho
}

function moverFruta() {
  fruta.y = fruta.y + fruta.velocidad
  if (fruta.y > 400) {
    fruta.y = 0
    fruta.x = Math.random() * 560 + 20
  }
}

function atrapar() {
  const dentro = fruta.x > canasta.x && fruta.x < canasta.x + canasta.ancho
  if (dentro && fruta.y + fruta.tamano > canasta.y) {
    puntos = puntos + 1
    fruta.y = 0
    fruta.x = Math.random() * 560 + 20
  }
}

function dibujar() {
  pincel.fillStyle = '#0b1224'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#fbbf24'
  pincel.fillRect(canasta.x, canasta.y, canasta.ancho, canasta.alto)

  pincel.fillStyle = '#f43f5e'
  pincel.beginPath()
  pincel.arc(fruta.x, fruta.y, fruta.tamano, 0, Math.PI * 2)
  pincel.fill()

  pincel.fillStyle = 'white'
  pincel.font = '20px sans-serif'
  pincel.fillText('Puntos: ' + puntos, 10, 30)
}

function bucle() {
  mover()
  moverFruta()
  atrapar()
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const FRUTA_7 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let canasta = { x: 260, y: 360, ancho: 80, alto: 20 }
let fruta = { x: 300, y: 0, tamano: 16, velocidad: 3 }
let puntos = 0
let vidas = 3
let jugando = true
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function mover() {
  if (teclas['ArrowLeft']) canasta.x = canasta.x - 6
  if (teclas['ArrowRight']) canasta.x = canasta.x + 6

  if (canasta.x < 0) canasta.x = 0
  if (canasta.x > 600 - canasta.ancho) canasta.x = 600 - canasta.ancho
}

function moverFruta() {
  fruta.y = fruta.y + fruta.velocidad
  if (fruta.y > 400) {
    vidas = vidas - 1
    if (vidas === 0) jugando = false
    fruta.y = 0
    fruta.x = Math.random() * 560 + 20
  }
}

function atrapar() {
  const dentro = fruta.x > canasta.x && fruta.x < canasta.x + canasta.ancho
  if (dentro && fruta.y + fruta.tamano > canasta.y) {
    puntos = puntos + 1
    fruta.velocidad = fruta.velocidad + 0.3
    fruta.y = 0
    fruta.x = Math.random() * 560 + 20
  }
}

function dibujar() {
  pincel.fillStyle = '#0b1224'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#fbbf24'
  pincel.fillRect(canasta.x, canasta.y, canasta.ancho, canasta.alto)

  pincel.fillStyle = '#f43f5e'
  pincel.beginPath()
  pincel.arc(fruta.x, fruta.y, fruta.tamano, 0, Math.PI * 2)
  pincel.fill()

  pincel.fillStyle = 'white'
  pincel.font = '20px sans-serif'
  pincel.fillText('Puntos: ' + puntos, 10, 30)
  pincel.fillText('Vidas: ' + vidas, 500, 30)

  if (!jugando) {
    pincel.font = '40px sans-serif'
    pincel.fillText('¡Se acabó!', 210, 200)
  }
}

function bucle() {
  if (jugando) {
    mover()
    moverFruta()
    atrapar()
  }
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const FRUTA: JuegoArena = {
  id: 'fruta',
  emoji: '🍎',
  titulo: 'Atrapa la fruta',
  nivel: 'Para empezar',
  color: '#f43f5e',
  lema: 'Juego 1',
  descripcion:
    'Una canasta que se mueve con las flechas y frutas que caen del cielo. Aprendes a pintar en el lienzo, a mover cosas con el teclado y a contar puntos.',
  controles: '⬅️ ➡️ mueven la canasta',
  partes: [
    {
      id: 'f1',
      titulo: 'El lienzo y la canasta',
      explicacion: [
        'Todo juego empieza con un lienzo: un rectángulo donde se pinta. El nuestro mide 600 de ancho y 400 de alto, y ya está en la página con el nombre `lienzo`.',
        'Para pintar necesitamos un pincel: `lienzo.getContext(\'2d\')`. Con `fillStyle` escogemos el color y con `fillRect(x, y, ancho, alto)` pintamos un rectángulo.',
        'Ojo: el punto (0, 0) es la esquina de ARRIBA a la izquierda. La x crece hacia la derecha y la y crece hacia ABAJO. Por eso la canasta, en y = 360, queda abajo.',
      ],
      codigo: FRUTA_1,
      pruebas: [
        { t: 'ver', js: 'typeof pincel === "object" && pincel !== null', msg: 'Tienes un pincel sacado del lienzo con getContext(\'2d\')' },
        { t: 'ver', js: '__pintado() > 50', msg: 'Se ve la canasta pintada en el lienzo' },
      ],
      idea: 'Cambia el color de la canasta (prueba "lime" o "#22d3ee") o hazla más ancha.',
    },
    {
      id: 'f2',
      titulo: 'La canasta es un objeto',
      explicacion: [
        'La canasta se va a mover, así que sus números no pueden quedar fijos en el `fillRect`. Los guardamos en un objeto: `canasta.x`, `canasta.y`, `canasta.ancho`, `canasta.alto`.',
        'Y todo lo que se pinta lo metemos en una función `dibujar()`. Primero se pinta el fondo (eso borra lo anterior) y encima la canasta.',
      ],
      codigo: FRUTA_2,
      pruebas: [
        { t: 'ver', js: 'typeof canasta === "object" && typeof canasta.x === "number"', msg: 'Hay un objeto canasta con su x' },
        { t: 'ver', js: 'typeof dibujar === "function"', msg: 'Hay una función dibujar()' },
        { t: 'ejecutar', js: 'canasta.x = 40; dibujar()' },
        { t: 'ver', js: pintadoEn('60', 'canasta.y + 10'), msg: 'dibujar() pinta la canasta donde diga canasta.x' },
      ],
      idea: 'Cambia el color del fondo. ¿Qué pasa si en dibujar() borras la línea que pinta el fondo?',
    },
    {
      id: 'f3',
      titulo: 'El bucle del juego y las flechas',
      explicacion: [
        'Un juego es un dibujo que se repite 60 veces por segundo. `requestAnimationFrame(bucle)` le dice al navegador: "en el próximo cuadro, vuelve a llamar a bucle". Así nunca para.',
        'Para el teclado guardamos qué teclas están oprimidas en el objeto `teclas`: con `keydown` se ponen en true y con `keyup` en false.',
        'En cada vuelta, `mover()` mira las flechas y cambia `canasta.x`. Fíjate que el `dibujar()` del final se cambió por `bucle()`.',
      ],
      codigo: FRUTA_3,
      pruebas: [
        { t: 'ejecutar', js: 'window.__x0 = canasta.x' },
        { t: 'tecla', key: 'ArrowRight' },
        { t: 'cuadros', n: 10 },
        { t: 'ver', js: 'canasta.x > __x0 + 30', msg: 'Con la flecha derecha la canasta va a la derecha' },
        { t: 'soltar', key: 'ArrowRight' },
        { t: 'ejecutar', js: 'window.__x0 = canasta.x' },
        { t: 'cuadros', n: 5 },
        { t: 'ver', js: 'canasta.x === __x0', msg: 'Al soltar la flecha, la canasta se queda quieta' },
        { t: 'tecla', key: 'ArrowLeft' },
        { t: 'cuadros', n: 10 },
        { t: 'ver', js: 'canasta.x < __x0 - 30', msg: 'Con la flecha izquierda va a la izquierda' },
      ],
      idea: 'Cambia el 6 por otro número. ¿La canasta va más rápido o más lento?',
    },
    {
      id: 'f4',
      titulo: 'Que no se salga',
      explicacion: [
        'Si dejas la flecha oprimida, la canasta se va del lienzo y no vuelve. Le ponemos paredes: si `canasta.x` es menor que 0, la devolvemos a 0.',
        'Al otro lado el límite no es 600, porque la x es la esquina izquierda de la canasta: el límite es `600 - canasta.ancho`.',
      ],
      codigo: FRUTA_4,
      pruebas: [
        { t: 'tecla', key: 'ArrowLeft' },
        { t: 'cuadros', n: 100 },
        { t: 'ver', js: 'canasta.x >= 0 && canasta.x < 6', msg: 'No se sale por la izquierda' },
        { t: 'soltar', key: 'ArrowLeft' },
        { t: 'tecla', key: 'ArrowRight' },
        { t: 'cuadros', n: 150 },
        { t: 'ver', js: 'canasta.x + canasta.ancho <= 600 && canasta.x + canasta.ancho > 594', msg: 'No se sale por la derecha' },
      ],
      idea: '¿Y si en vez de pararse, la canasta apareciera por el otro lado? Pista: canasta.x = 600 - canasta.ancho cuando se pasa de 0.',
    },
    {
      id: 'f5',
      titulo: 'La fruta cae',
      explicacion: [
        'La fruta es otro objeto, con su x, su y, su tamaño y su velocidad. En cada cuadro, `moverFruta()` le suma la velocidad a la y: eso es caer.',
        'Cuando llega al piso (y mayor que 400) vuelve a salir arriba en una x al azar: `Math.random()` da un número entre 0 y 1, y por 560 más 20 queda entre 20 y 580.',
        'Para pintar un círculo: `beginPath()`, `arc(x, y, radio, 0, Math.PI * 2)` y `fill()`.',
      ],
      codigo: FRUTA_5,
      pruebas: [
        { t: 'ver', js: 'typeof fruta === "object" && typeof fruta.y === "number"', msg: 'Hay un objeto fruta' },
        { t: 'ejecutar', js: 'window.__y0 = fruta.y' },
        { t: 'cuadros', n: 10 },
        { t: 'ver', js: 'fruta.y > __y0 + 10', msg: 'La fruta cae' },
        { t: 'ver', js: pintadoEn('fruta.x', 'fruta.y'), msg: 'Se ve la fruta en el lienzo' },
        { t: 'ejecutar', js: 'fruta.y = 395' },
        { t: 'cuadros', n: 4 },
        { t: 'ver', js: 'fruta.y < 50', msg: 'Cuando llega al piso, vuelve a salir arriba' },
      ],
      idea: 'Hazla más grande, de otro color, o que caiga más rápido.',
    },
    {
      id: 'f6',
      titulo: '¡Atrapada! Los puntos',
      explicacion: [
        '`atrapar()` pregunta dos cosas: ¿la x de la fruta está entre el borde izquierdo y el derecho de la canasta? ¿Y ya bajó hasta la canasta? Si las dos son verdad (`&&`), es un punto.',
        'Al atraparla, la fruta vuelve a salir arriba. Y con `fillText` escribimos los puntos en la esquina.',
      ],
      codigo: FRUTA_6,
      pruebas: [
        { t: 'ejecutar', js: 'puntos = 0; fruta.x = canasta.x + canasta.ancho / 2; fruta.y = canasta.y - 30' },
        { t: 'cuadros', n: 15 },
        { t: 'ver', js: 'puntos === 1', msg: 'Si la fruta cae en la canasta, sube un punto' },
        { t: 'ver', js: 'fruta.y < 100', msg: 'y la fruta vuelve a salir arriba' },
        { t: 'ejecutar', js: 'puntos = 0; canasta.x = 0; fruta.x = 500; fruta.y = 300' },
        { t: 'cuadros', n: 40 },
        { t: 'ver', js: 'puntos === 0', msg: 'Si no la atrapas, no hay punto' },
      ],
      idea: 'Que cada fruta valga 10 puntos, o escribe "Frutas: " en vez de "Puntos: ".',
    },
    {
      id: 'f7',
      titulo: 'Vidas y fin del juego',
      explicacion: [
        'Sin perder no hay juego. Cada fruta que llega al piso quita una vida, y cuando `vidas` llega a 0, `jugando` pasa a false.',
        'En el bucle, todo lo que mueve va dentro de `if (jugando)`: cuando se acaba, todo se congela, pero se sigue dibujando para que se vea el letrero.',
        'Y para que tenga gracia, cada fruta atrapada hace que la siguiente caiga un poquito más rápido.',
      ],
      codigo: FRUTA_7,
      pruebas: [
        { t: 'ejecutar', js: 'vidas = 3; jugando = true; canasta.x = 0; fruta.x = 500; fruta.y = 390' },
        { t: 'cuadros', n: 5 },
        { t: 'ver', js: 'vidas === 2', msg: 'Si se te cae una fruta, pierdes una vida' },
        { t: 'ejecutar', js: 'vidas = 1; fruta.x = 500; fruta.y = 390' },
        { t: 'cuadros', n: 5 },
        { t: 'ver', js: 'jugando === false', msg: 'Sin vidas, se acaba el juego' },
        { t: 'ejecutar', js: 'window.__y0 = fruta.y' },
        { t: 'cuadros', n: 10 },
        { t: 'ver', js: 'fruta.y === __y0', msg: 'Cuando se acaba, la fruta deja de caer' },
      ],
      idea: 'Que con Enter se vuelva a jugar: en el keydown, si e.key es "Enter" y no estás jugando, pon puntos en 0, vidas en 3 y jugando en true.',
    },
  ],
}

/* =========================================================== 2. meteoritos */

const METEORITOS_1 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let nave = { x: 300, y: 340, velocidad: 5 }

function dibujarNave() {
  pincel.fillStyle = '#22d3ee'
  pincel.beginPath()
  pincel.moveTo(nave.x, nave.y - 18)
  pincel.lineTo(nave.x - 14, nave.y + 14)
  pincel.lineTo(nave.x + 14, nave.y + 14)
  pincel.closePath()
  pincel.fill()
}

function dibujar() {
  pincel.fillStyle = '#050816'
  pincel.fillRect(0, 0, 600, 400)
  dibujarNave()
}

function bucle() {
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const METEORITOS_2 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let nave = { x: 300, y: 340, velocidad: 5 }
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function moverNave() {
  if (teclas['ArrowLeft']) nave.x = nave.x - nave.velocidad
  if (teclas['ArrowRight']) nave.x = nave.x + nave.velocidad
  if (teclas['ArrowUp']) nave.y = nave.y - nave.velocidad
  if (teclas['ArrowDown']) nave.y = nave.y + nave.velocidad

  nave.x = Math.max(15, Math.min(585, nave.x))
  nave.y = Math.max(20, Math.min(385, nave.y))
}

function dibujarNave() {
  pincel.fillStyle = '#22d3ee'
  pincel.beginPath()
  pincel.moveTo(nave.x, nave.y - 18)
  pincel.lineTo(nave.x - 14, nave.y + 14)
  pincel.lineTo(nave.x + 14, nave.y + 14)
  pincel.closePath()
  pincel.fill()
}

function dibujar() {
  pincel.fillStyle = '#050816'
  pincel.fillRect(0, 0, 600, 400)
  dibujarNave()
}

function bucle() {
  moverNave()
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const METEORITOS_3 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let nave = { x: 300, y: 340, velocidad: 5 }
let meteoritos = []
let cuadros = 0
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function moverNave() {
  if (teclas['ArrowLeft']) nave.x = nave.x - nave.velocidad
  if (teclas['ArrowRight']) nave.x = nave.x + nave.velocidad
  if (teclas['ArrowUp']) nave.y = nave.y - nave.velocidad
  if (teclas['ArrowDown']) nave.y = nave.y + nave.velocidad

  nave.x = Math.max(15, Math.min(585, nave.x))
  nave.y = Math.max(20, Math.min(385, nave.y))
}

function crearMeteorito() {
  meteoritos.push({
    x: Math.random() * 600,
    y: -20,
    r: 10 + Math.random() * 15,
    velocidad: 2 + Math.random() * 3,
  })
}

function moverMeteoritos() {
  cuadros = cuadros + 1
  if (cuadros % 40 === 0) crearMeteorito()

  for (const m of meteoritos) {
    m.y = m.y + m.velocidad
  }
}

function dibujarNave() {
  pincel.fillStyle = '#22d3ee'
  pincel.beginPath()
  pincel.moveTo(nave.x, nave.y - 18)
  pincel.lineTo(nave.x - 14, nave.y + 14)
  pincel.lineTo(nave.x + 14, nave.y + 14)
  pincel.closePath()
  pincel.fill()
}

function dibujarMeteoritos() {
  pincel.fillStyle = '#b45309'
  for (const m of meteoritos) {
    pincel.beginPath()
    pincel.arc(m.x, m.y, m.r, 0, Math.PI * 2)
    pincel.fill()
  }
}

function dibujar() {
  pincel.fillStyle = '#050816'
  pincel.fillRect(0, 0, 600, 400)
  dibujarNave()
  dibujarMeteoritos()
}

function bucle() {
  moverNave()
  moverMeteoritos()
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const METEORITOS_4 = METEORITOS_3.replace(
  `  for (const m of meteoritos) {
    m.y = m.y + m.velocidad
  }
}`,
  `  for (const m of meteoritos) {
    m.y = m.y + m.velocidad
  }

  meteoritos = meteoritos.filter((m) => m.y < 430)
}`,
)

const METEORITOS_5 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let nave = { x: 300, y: 340, velocidad: 5 }
let meteoritos = []
let cuadros = 0
let jugando = true
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function moverNave() {
  if (teclas['ArrowLeft']) nave.x = nave.x - nave.velocidad
  if (teclas['ArrowRight']) nave.x = nave.x + nave.velocidad
  if (teclas['ArrowUp']) nave.y = nave.y - nave.velocidad
  if (teclas['ArrowDown']) nave.y = nave.y + nave.velocidad

  nave.x = Math.max(15, Math.min(585, nave.x))
  nave.y = Math.max(20, Math.min(385, nave.y))
}

function crearMeteorito() {
  meteoritos.push({
    x: Math.random() * 600,
    y: -20,
    r: 10 + Math.random() * 15,
    velocidad: 2 + Math.random() * 3,
  })
}

function moverMeteoritos() {
  cuadros = cuadros + 1
  if (cuadros % 40 === 0) crearMeteorito()

  for (const m of meteoritos) {
    m.y = m.y + m.velocidad
  }

  meteoritos = meteoritos.filter((m) => m.y < 430)
}

function chocar() {
  for (const m of meteoritos) {
    const distancia = Math.hypot(m.x - nave.x, m.y - nave.y)
    if (distancia < m.r + 12) {
      jugando = false
    }
  }
}

function dibujarNave() {
  pincel.fillStyle = '#22d3ee'
  pincel.beginPath()
  pincel.moveTo(nave.x, nave.y - 18)
  pincel.lineTo(nave.x - 14, nave.y + 14)
  pincel.lineTo(nave.x + 14, nave.y + 14)
  pincel.closePath()
  pincel.fill()
}

function dibujarMeteoritos() {
  pincel.fillStyle = '#b45309'
  for (const m of meteoritos) {
    pincel.beginPath()
    pincel.arc(m.x, m.y, m.r, 0, Math.PI * 2)
    pincel.fill()
  }
}

function dibujar() {
  pincel.fillStyle = '#050816'
  pincel.fillRect(0, 0, 600, 400)
  dibujarNave()
  dibujarMeteoritos()

  if (!jugando) {
    pincel.fillStyle = 'white'
    pincel.font = '40px sans-serif'
    pincel.fillText('💥 ¡Te dieron!', 180, 200)
  }
}

function bucle() {
  if (jugando) {
    moverNave()
    moverMeteoritos()
    chocar()
  }
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const METEORITOS_6 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let nave = { x: 300, y: 340, velocidad: 5 }
let meteoritos = []
let cuadros = 0
let jugando = true
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function segundos() {
  return Math.floor(cuadros / 60)
}

function moverNave() {
  if (teclas['ArrowLeft']) nave.x = nave.x - nave.velocidad
  if (teclas['ArrowRight']) nave.x = nave.x + nave.velocidad
  if (teclas['ArrowUp']) nave.y = nave.y - nave.velocidad
  if (teclas['ArrowDown']) nave.y = nave.y + nave.velocidad

  nave.x = Math.max(15, Math.min(585, nave.x))
  nave.y = Math.max(20, Math.min(385, nave.y))
}

function crearMeteorito() {
  meteoritos.push({
    x: Math.random() * 600,
    y: -20,
    r: 10 + Math.random() * 15,
    velocidad: 2 + Math.random() * 3 + segundos() / 10,
  })
}

function moverMeteoritos() {
  cuadros = cuadros + 1
  const cada = Math.max(10, 40 - segundos())
  if (cuadros % cada === 0) crearMeteorito()

  for (const m of meteoritos) {
    m.y = m.y + m.velocidad
  }

  meteoritos = meteoritos.filter((m) => m.y < 430)
}

function chocar() {
  for (const m of meteoritos) {
    const distancia = Math.hypot(m.x - nave.x, m.y - nave.y)
    if (distancia < m.r + 12) {
      jugando = false
    }
  }
}

function dibujarNave() {
  pincel.fillStyle = '#22d3ee'
  pincel.beginPath()
  pincel.moveTo(nave.x, nave.y - 18)
  pincel.lineTo(nave.x - 14, nave.y + 14)
  pincel.lineTo(nave.x + 14, nave.y + 14)
  pincel.closePath()
  pincel.fill()
}

function dibujarMeteoritos() {
  pincel.fillStyle = '#b45309'
  for (const m of meteoritos) {
    pincel.beginPath()
    pincel.arc(m.x, m.y, m.r, 0, Math.PI * 2)
    pincel.fill()
  }
}

function dibujar() {
  pincel.fillStyle = '#050816'
  pincel.fillRect(0, 0, 600, 400)
  dibujarNave()
  dibujarMeteoritos()

  pincel.fillStyle = 'white'
  pincel.font = '20px sans-serif'
  pincel.fillText('Tiempo: ' + segundos() + ' s', 10, 30)

  if (!jugando) {
    pincel.font = '40px sans-serif'
    pincel.fillText('💥 ¡Te dieron!', 180, 200)
  }
}

function bucle() {
  if (jugando) {
    moverNave()
    moverMeteoritos()
    chocar()
  }
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const METEORITOS_7 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let nave = { x: 300, y: 340, velocidad: 5 }
let meteoritos = []
let cuadros = 0
let jugando = true
let record = 0
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !jugando) reiniciar()
})

function reiniciar() {
  nave.x = 300
  nave.y = 340
  meteoritos = []
  cuadros = 0
  jugando = true
}

function segundos() {
  return Math.floor(cuadros / 60)
}

function moverNave() {
  if (teclas['ArrowLeft']) nave.x = nave.x - nave.velocidad
  if (teclas['ArrowRight']) nave.x = nave.x + nave.velocidad
  if (teclas['ArrowUp']) nave.y = nave.y - nave.velocidad
  if (teclas['ArrowDown']) nave.y = nave.y + nave.velocidad

  nave.x = Math.max(15, Math.min(585, nave.x))
  nave.y = Math.max(20, Math.min(385, nave.y))
}

function crearMeteorito() {
  meteoritos.push({
    x: Math.random() * 600,
    y: -20,
    r: 10 + Math.random() * 15,
    velocidad: 2 + Math.random() * 3 + segundos() / 10,
  })
}

function moverMeteoritos() {
  cuadros = cuadros + 1
  const cada = Math.max(10, 40 - segundos())
  if (cuadros % cada === 0) crearMeteorito()

  for (const m of meteoritos) {
    m.y = m.y + m.velocidad
  }

  meteoritos = meteoritos.filter((m) => m.y < 430)
}

function chocar() {
  for (const m of meteoritos) {
    const distancia = Math.hypot(m.x - nave.x, m.y - nave.y)
    if (distancia < m.r + 12) {
      jugando = false
      if (segundos() > record) record = segundos()
    }
  }
}

function dibujarNave() {
  pincel.fillStyle = '#22d3ee'
  pincel.beginPath()
  pincel.moveTo(nave.x, nave.y - 18)
  pincel.lineTo(nave.x - 14, nave.y + 14)
  pincel.lineTo(nave.x + 14, nave.y + 14)
  pincel.closePath()
  pincel.fill()
}

function dibujarMeteoritos() {
  pincel.fillStyle = '#b45309'
  for (const m of meteoritos) {
    pincel.beginPath()
    pincel.arc(m.x, m.y, m.r, 0, Math.PI * 2)
    pincel.fill()
  }
}

function dibujar() {
  pincel.fillStyle = '#050816'
  pincel.fillRect(0, 0, 600, 400)
  dibujarNave()
  dibujarMeteoritos()

  pincel.fillStyle = 'white'
  pincel.font = '20px sans-serif'
  pincel.fillText('Tiempo: ' + segundos() + ' s', 10, 30)
  pincel.fillText('Récord: ' + record + ' s', 460, 30)

  if (!jugando) {
    pincel.font = '40px sans-serif'
    pincel.fillText('💥 ¡Te dieron!', 180, 200)
    pincel.font = '18px sans-serif'
    pincel.fillText('Enter para volver a jugar', 200, 240)
  }
}

function bucle() {
  if (jugando) {
    moverNave()
    moverMeteoritos()
    chocar()
  }
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const METEORITOS: JuegoArena = {
  id: 'meteoritos',
  emoji: '☄️',
  titulo: 'Lluvia de meteoritos',
  nivel: 'Un paso más',
  color: '#22d3ee',
  lema: 'Juego 2',
  descripcion:
    'Una nave que esquiva meteoritos cada vez más rápidos. Aprendes listas (arreglos), ciclos for, choques entre círculos y a llevar el tiempo.',
  controles: '⬅️ ➡️ ⬆️ ⬇️ mueven la nave · Enter vuelve a empezar',
  partes: [
    {
      id: 'm1',
      titulo: 'La nave y el bucle',
      explicacion: [
        'Arrancamos como en el juego de la fruta: el lienzo, el pincel, un objeto `nave` y el bucle que dibuja 60 veces por segundo.',
        'La nave es un triángulo. Se pinta con un camino: `moveTo` pone el pincel en la punta y cada `lineTo` traza una línea hasta otra esquina. `closePath()` cierra y `fill()` lo rellena.',
        'Las esquinas se calculan desde `nave.x` y `nave.y` (el centro): así, cuando la nave se mueva, el triángulo se mueve con ella.',
      ],
      codigo: METEORITOS_1,
      pruebas: [
        { t: 'ver', js: 'typeof nave === "object" && typeof nave.x === "number"', msg: 'Hay un objeto nave con su x y su y' },
        { t: 'ver', js: 'typeof dibujarNave === "function"', msg: 'Hay una función dibujarNave()' },
        { t: 'cuadros', n: 2 },
        { t: 'ver', js: pintadoEn('nave.x', 'nave.y'), msg: 'Se ve la nave en el lienzo' },
        { t: 'ejecutar', js: 'nave.x = 100' },
        { t: 'cuadros', n: 2 },
        { t: 'ver', js: pintadoEn('100', 'nave.y') + ' && !(' + pintadoEn('300', 'nave.y') + ')', msg: 'La nave se vuelve a dibujar en cada cuadro (el bucle funciona)' },
      ],
      idea: 'Cambia el color de la nave o hazla más grande (cambia los 14 y el 18).',
    },
    {
      id: 'm2',
      titulo: 'Volar en cuatro direcciones',
      explicacion: [
        'Las mismas `teclas` de antes, pero ahora con las cuatro flechas: arriba resta a la y, abajo le suma.',
        'Las paredes, esta vez en una sola línea: `Math.min(585, nave.x)` no deja pasar de 585 y `Math.max(15, …)` no deja bajar de 15.',
      ],
      codigo: METEORITOS_2,
      pruebas: [
        { t: 'ejecutar', js: 'window.__x0 = nave.x; window.__y0 = nave.y' },
        { t: 'tecla', key: 'ArrowRight' },
        { t: 'cuadros', n: 10 },
        { t: 'soltar', key: 'ArrowRight' },
        { t: 'ver', js: 'nave.x > __x0 + 20', msg: 'La flecha derecha mueve la nave a la derecha' },
        { t: 'tecla', key: 'ArrowUp' },
        { t: 'cuadros', n: 10 },
        { t: 'soltar', key: 'ArrowUp' },
        { t: 'ver', js: 'nave.y < __y0 - 20', msg: 'La flecha de arriba la sube' },
        { t: 'tecla', key: 'ArrowLeft' },
        { t: 'cuadros', n: 200 },
        { t: 'ver', js: 'nave.x >= 0 && nave.x <= 20', msg: 'No se sale por la izquierda' },
        { t: 'tecla', key: 'ArrowDown' },
        { t: 'cuadros', n: 200 },
        { t: 'ver', js: 'nave.y <= 400 && nave.y >= 370', msg: 'Ni por abajo' },
      ],
      idea: 'Que la nave vaya más rápido: cambia velocidad en el objeto nave.',
    },
    {
      id: 'm3',
      titulo: 'Una lluvia de meteoritos',
      explicacion: [
        'Ya no es UN meteorito: son muchos. Por eso van en una lista (un arreglo): `meteoritos = []`. Con `push` se agrega uno nuevo al final.',
        '`cuadros` cuenta las vueltas del bucle. `cuadros % 40 === 0` es verdad una vez cada 40 cuadros: ahí nace un meteorito, con tamaño y velocidad al azar.',
        'Para mover y pintar TODOS, recorremos la lista con `for (const m of meteoritos)`: en cada vuelta `m` es uno de ellos.',
      ],
      codigo: METEORITOS_3,
      pruebas: [
        { t: 'ver', js: 'Array.isArray(meteoritos)', msg: 'Hay una lista meteoritos' },
        { t: 'cuadros', n: 200 },
        { t: 'ver', js: 'meteoritos.length >= 3', msg: 'Cada rato nace un meteorito nuevo' },
        { t: 'ver', js: 'meteoritos.some((m) => m.y > 50)', msg: 'Los meteoritos caen' },
        { t: 'ver', js: 'meteoritos.some((m) => ' + pintadoEn('m.x', 'm.y') + ')', msg: 'Se ven en el lienzo' },
      ],
      idea: 'Cambia el 40 por 15. ¿Qué pasa? ¿Y si cambias el color a "gray"?',
    },
    {
      id: 'm4',
      titulo: 'Barrer los que ya pasaron',
      explicacion: [
        'Los meteoritos que se salen por abajo siguen en la lista para siempre, cayendo donde nadie los ve. En un rato serían miles y el juego se pondría lento.',
        '`filter` hace una lista nueva solo con los que cumplen la condición: los que todavía tienen la y menor que 430. Los demás desaparecen.',
      ],
      codigo: METEORITOS_4,
      pruebas: [
        { t: 'cuadros', n: 1200 },
        { t: 'ver', js: 'meteoritos.length > 0 && meteoritos.length < 16', msg: 'Los que salieron por abajo se borran de la lista' },
        { t: 'ver', js: 'meteoritos.every((m) => m.y < 430)', msg: 'En la lista solo quedan los que se ven' },
      ],
      idea: 'Escribe console.log(meteoritos.length) dentro de moverMeteoritos y mira abajo cuántos hay.',
    },
    {
      id: 'm5',
      titulo: '¡Choque!',
      explicacion: [
        '¿Cuándo choca un círculo con la nave? Cuando la distancia entre los dos centros es menor que el radio del meteorito más el "radio" de la nave (unos 12).',
        '`Math.hypot(dx, dy)` calcula esa distancia (es el teorema de Pitágoras). Si hay choque, `jugando` pasa a false y el bucle deja de mover las cosas.',
      ],
      codigo: METEORITOS_5,
      pruebas: [
        { t: 'ejecutar', js: 'jugando = true; nave.x = 300; nave.y = 340; meteoritos = [{ x: 500, y: 300, r: 15, velocidad: 4 }]' },
        { t: 'cuadros', n: 20 },
        { t: 'ver', js: 'jugando === true', msg: 'Si el meteorito pasa lejos, se sigue jugando' },
        { t: 'ejecutar', js: 'meteoritos = [{ x: nave.x, y: nave.y - 60, r: 15, velocidad: 4 }]' },
        { t: 'cuadros', n: 20 },
        { t: 'ver', js: 'jugando === false', msg: 'Si un meteorito toca la nave, se acaba el juego' },
        { t: 'ejecutar', js: 'window.__c = cuadros' },
        { t: 'cuadros', n: 10 },
        { t: 'ver', js: 'cuadros === __c', msg: 'Cuando se acaba, todo se queda quieto' },
      ],
      idea: 'Cambia el 12 por 2. ¿Se vuelve más fácil? ¿Por qué?',
    },
    {
      id: 'm6',
      titulo: 'El tiempo y cada vez más difícil',
      explicacion: [
        'El puntaje es cuánto aguantas. Como el bucle da 60 cuadros por segundo, los segundos son `cuadros / 60`, sin decimales (`Math.floor`).',
        'Y para que se ponga duro: cada segundo los meteoritos nacen más seguido (`40 - segundos()`, pero nunca menos de 10) y caen un poquito más rápido.',
      ],
      codigo: METEORITOS_6,
      pruebas: [
        { t: 'ver', js: 'typeof segundos === "function"', msg: 'Hay una función segundos()' },
        { t: 'ejecutar', js: 'chocar = function () {}' },
        { t: 'cuadros', n: 600 },
        { t: 'ver', js: 'segundos() >= 9 && segundos() <= 11', msg: 'Después de 10 segundos, segundos() da 10' },
        { t: 'ejecutar', js: 'window.__antes = meteoritos.length; meteoritos = []' },
        { t: 'cuadros', n: 1200 },
        { t: 'ver', js: 'meteoritos.length > __antes', msg: 'Con el tiempo salen más meteoritos' },
      ],
      idea: 'Que el tiempo se vea más grande, o en otro color cuando pases de 30 segundos.',
    },
    {
      id: 'm7',
      titulo: 'Récord y otra vez',
      explicacion: [
        'Al chocar, si este tiempo es mejor que `record`, se guarda. El récord no se borra al volver a empezar: así hay algo que superar.',
        '`reiniciar()` deja todo como al principio. La llamamos con Enter, pero solo si ya no se está jugando (`!jugando`).',
      ],
      codigo: METEORITOS_7,
      pruebas: [
        { t: 'ejecutar', js: 'cuadros = 300; meteoritos = [{ x: nave.x, y: nave.y, r: 15, velocidad: 0 }]' },
        { t: 'cuadros', n: 2 },
        { t: 'ver', js: 'jugando === false', msg: 'El meteorito te dio' },
        { t: 'ver', js: 'record === 5', msg: 'El récord guarda los segundos que aguantaste (5)' },
        { t: 'tecla', key: 'Enter' },
        { t: 'soltar', key: 'Enter' },
        { t: 'cuadros', n: 1 },
        { t: 'ver', js: 'jugando === true && cuadros < 5 && meteoritos.length === 0', msg: 'Con Enter vuelve a empezar, sin meteoritos y con el tiempo en 0' },
        { t: 'ver', js: 'record === 5', msg: 'y el récord sigue ahí' },
      ],
      idea: 'Agrega estrellas al fondo: una lista de puntos blancos que bajan despacito.',
    },
  ],
}

/* ============================================================ 3. ping pong */

const PING_1 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let izquierda = { x: 20, y: 160, ancho: 12, alto: 80 }
let derecha = { x: 568, y: 160, ancho: 12, alto: 80 }

function dibujarPaleta(p) {
  pincel.fillRect(p.x, p.y, p.ancho, p.alto)
}

function dibujar() {
  pincel.fillStyle = '#052e16'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#86efac'
  for (let y = 0; y < 400; y = y + 30) {
    pincel.fillRect(298, y, 4, 15)
  }

  pincel.fillStyle = 'white'
  dibujarPaleta(izquierda)
  dibujarPaleta(derecha)
}

function bucle() {
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const PING_2 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let izquierda = { x: 20, y: 160, ancho: 12, alto: 80 }
let derecha = { x: 568, y: 160, ancho: 12, alto: 80 }
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function moverPaletas() {
  if (teclas['w']) izquierda.y = izquierda.y - 6
  if (teclas['s']) izquierda.y = izquierda.y + 6
  if (teclas['ArrowUp']) derecha.y = derecha.y - 6
  if (teclas['ArrowDown']) derecha.y = derecha.y + 6

  izquierda.y = Math.max(0, Math.min(400 - izquierda.alto, izquierda.y))
  derecha.y = Math.max(0, Math.min(400 - derecha.alto, derecha.y))
}

function dibujarPaleta(p) {
  pincel.fillRect(p.x, p.y, p.ancho, p.alto)
}

function dibujar() {
  pincel.fillStyle = '#052e16'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#86efac'
  for (let y = 0; y < 400; y = y + 30) {
    pincel.fillRect(298, y, 4, 15)
  }

  pincel.fillStyle = 'white'
  dibujarPaleta(izquierda)
  dibujarPaleta(derecha)
}

function bucle() {
  moverPaletas()
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const PING_3 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let izquierda = { x: 20, y: 160, ancho: 12, alto: 80 }
let derecha = { x: 568, y: 160, ancho: 12, alto: 80 }
let pelota = { x: 300, y: 200, r: 8, vx: 4, vy: 3 }
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function moverPaletas() {
  if (teclas['w']) izquierda.y = izquierda.y - 6
  if (teclas['s']) izquierda.y = izquierda.y + 6
  if (teclas['ArrowUp']) derecha.y = derecha.y - 6
  if (teclas['ArrowDown']) derecha.y = derecha.y + 6

  izquierda.y = Math.max(0, Math.min(400 - izquierda.alto, izquierda.y))
  derecha.y = Math.max(0, Math.min(400 - derecha.alto, derecha.y))
}

function moverPelota() {
  pelota.x = pelota.x + pelota.vx
  pelota.y = pelota.y + pelota.vy

  if (pelota.y - pelota.r < 0 || pelota.y + pelota.r > 400) {
    pelota.vy = -pelota.vy
  }
}

function dibujarPaleta(p) {
  pincel.fillRect(p.x, p.y, p.ancho, p.alto)
}

function dibujar() {
  pincel.fillStyle = '#052e16'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#86efac'
  for (let y = 0; y < 400; y = y + 30) {
    pincel.fillRect(298, y, 4, 15)
  }

  pincel.fillStyle = 'white'
  dibujarPaleta(izquierda)
  dibujarPaleta(derecha)

  pincel.beginPath()
  pincel.arc(pelota.x, pelota.y, pelota.r, 0, Math.PI * 2)
  pincel.fill()
}

function bucle() {
  moverPaletas()
  moverPelota()
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const PING_4 = PING_3.replace(
  `function moverPelota() {`,
  `function tocaPaleta(p) {
  return (
    pelota.x + pelota.r > p.x &&
    pelota.x - pelota.r < p.x + p.ancho &&
    pelota.y > p.y &&
    pelota.y < p.y + p.alto
  )
}

function moverPelota() {`,
).replace(
  `    pelota.vy = -pelota.vy
  }
}`,
  `    pelota.vy = -pelota.vy
  }

  if (tocaPaleta(izquierda) && pelota.vx < 0) pelota.vx = -pelota.vx
  if (tocaPaleta(derecha) && pelota.vx > 0) pelota.vx = -pelota.vx
}`,
)

const PING_5 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let izquierda = { x: 20, y: 160, ancho: 12, alto: 80 }
let derecha = { x: 568, y: 160, ancho: 12, alto: 80 }
let pelota = { x: 300, y: 200, r: 8, vx: 4, vy: 3 }
let puntosIzquierda = 0
let puntosDerecha = 0
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function moverPaletas() {
  if (teclas['w']) izquierda.y = izquierda.y - 6
  if (teclas['s']) izquierda.y = izquierda.y + 6
  if (teclas['ArrowUp']) derecha.y = derecha.y - 6
  if (teclas['ArrowDown']) derecha.y = derecha.y + 6

  izquierda.y = Math.max(0, Math.min(400 - izquierda.alto, izquierda.y))
  derecha.y = Math.max(0, Math.min(400 - derecha.alto, derecha.y))
}

function tocaPaleta(p) {
  return (
    pelota.x + pelota.r > p.x &&
    pelota.x - pelota.r < p.x + p.ancho &&
    pelota.y > p.y &&
    pelota.y < p.y + p.alto
  )
}

function sacar(direccion) {
  pelota.x = 300
  pelota.y = 200
  pelota.vx = 4 * direccion
  pelota.vy = Math.random() * 6 - 3
}

function moverPelota() {
  pelota.x = pelota.x + pelota.vx
  pelota.y = pelota.y + pelota.vy

  if (pelota.y - pelota.r < 0 || pelota.y + pelota.r > 400) {
    pelota.vy = -pelota.vy
  }

  if (tocaPaleta(izquierda) && pelota.vx < 0) pelota.vx = -pelota.vx
  if (tocaPaleta(derecha) && pelota.vx > 0) pelota.vx = -pelota.vx

  if (pelota.x < 0) {
    puntosDerecha = puntosDerecha + 1
    sacar(1)
  }
  if (pelota.x > 600) {
    puntosIzquierda = puntosIzquierda + 1
    sacar(-1)
  }
}

function dibujarPaleta(p) {
  pincel.fillRect(p.x, p.y, p.ancho, p.alto)
}

function dibujar() {
  pincel.fillStyle = '#052e16'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#86efac'
  for (let y = 0; y < 400; y = y + 30) {
    pincel.fillRect(298, y, 4, 15)
  }

  pincel.fillStyle = 'white'
  dibujarPaleta(izquierda)
  dibujarPaleta(derecha)

  pincel.beginPath()
  pincel.arc(pelota.x, pelota.y, pelota.r, 0, Math.PI * 2)
  pincel.fill()

  pincel.font = '40px monospace'
  pincel.fillText(puntosIzquierda, 240, 50)
  pincel.fillText(puntosDerecha, 335, 50)
}

function bucle() {
  moverPaletas()
  moverPelota()
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const PING_6 = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let izquierda = { x: 20, y: 160, ancho: 12, alto: 80 }
let derecha = { x: 568, y: 160, ancho: 12, alto: 80 }
let pelota = { x: 300, y: 200, r: 8, vx: 4, vy: 3 }
let puntosIzquierda = 0
let puntosDerecha = 0
let ganador = ''
let teclas = {}

document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && ganador !== '') {
    puntosIzquierda = 0
    puntosDerecha = 0
    ganador = ''
    sacar(1)
  }
})

function moverPaletas() {
  if (teclas['w']) izquierda.y = izquierda.y - 6
  if (teclas['s']) izquierda.y = izquierda.y + 6
  if (teclas['ArrowUp']) derecha.y = derecha.y - 6
  if (teclas['ArrowDown']) derecha.y = derecha.y + 6

  izquierda.y = Math.max(0, Math.min(400 - izquierda.alto, izquierda.y))
  derecha.y = Math.max(0, Math.min(400 - derecha.alto, derecha.y))
}

function tocaPaleta(p) {
  return (
    pelota.x + pelota.r > p.x &&
    pelota.x - pelota.r < p.x + p.ancho &&
    pelota.y > p.y &&
    pelota.y < p.y + p.alto
  )
}

function sacar(direccion) {
  pelota.x = 300
  pelota.y = 200
  pelota.vx = 4 * direccion
  pelota.vy = Math.random() * 6 - 3
}

function moverPelota() {
  pelota.x = pelota.x + pelota.vx
  pelota.y = pelota.y + pelota.vy

  if (pelota.y - pelota.r < 0 || pelota.y + pelota.r > 400) {
    pelota.vy = -pelota.vy
  }

  if (tocaPaleta(izquierda) && pelota.vx < 0) pelota.vx = -pelota.vx * 1.1
  if (tocaPaleta(derecha) && pelota.vx > 0) pelota.vx = -pelota.vx * 1.1

  if (pelota.x < 0) {
    puntosDerecha = puntosDerecha + 1
    if (puntosDerecha === 5) ganador = 'la derecha'
    sacar(1)
  }
  if (pelota.x > 600) {
    puntosIzquierda = puntosIzquierda + 1
    if (puntosIzquierda === 5) ganador = 'la izquierda'
    sacar(-1)
  }
}

function dibujarPaleta(p) {
  pincel.fillRect(p.x, p.y, p.ancho, p.alto)
}

function dibujar() {
  pincel.fillStyle = '#052e16'
  pincel.fillRect(0, 0, 600, 400)

  pincel.fillStyle = '#86efac'
  for (let y = 0; y < 400; y = y + 30) {
    pincel.fillRect(298, y, 4, 15)
  }

  pincel.fillStyle = 'white'
  dibujarPaleta(izquierda)
  dibujarPaleta(derecha)

  pincel.beginPath()
  pincel.arc(pelota.x, pelota.y, pelota.r, 0, Math.PI * 2)
  pincel.fill()

  pincel.font = '40px monospace'
  pincel.fillText(puntosIzquierda, 240, 50)
  pincel.fillText(puntosDerecha, 335, 50)

  if (ganador !== '') {
    pincel.font = '30px sans-serif'
    pincel.fillText('🏆 Ganó ' + ganador, 180, 200)
    pincel.font = '18px sans-serif'
    pincel.fillText('Enter para la revancha', 205, 240)
  }
}

function bucle() {
  if (ganador === '') {
    moverPaletas()
    moverPelota()
  }
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

const PINGPONG: JuegoArena = {
  id: 'pingpong',
  emoji: '🏓',
  titulo: 'Ping pong para dos',
  nivel: 'El reto',
  color: '#4ade80',
  lema: 'Juego 3',
  descripcion:
    'Dos paletas, una pelota y un compañero al lado. Aprendes rebotes con velocidad en x y en y, choques de pelota con rectángulo, marcador y ganador.',
  controles: 'Izquierda: W y S · Derecha: ⬆️ ⬇️ · Enter: revancha',
  partes: [
    {
      id: 'p1',
      titulo: 'La cancha y las paletas',
      explicacion: [
        'Dos paletas, dos objetos: `izquierda` y `derecha`. Como se pintan igualitas, hacemos UNA función `dibujarPaleta(p)` que recibe cuál pintar. Así no repetimos código.',
        'La línea del medio es un `for`: arranca en y = 0 y cada vuelta baja 30, pintando un rayita de 15 de alto. Así sale punteada.',
      ],
      codigo: PING_1,
      pruebas: [
        { t: 'ver', js: 'typeof izquierda === "object" && typeof derecha === "object"', msg: 'Hay dos paletas: izquierda y derecha' },
        { t: 'ver', js: 'typeof dibujarPaleta === "function"', msg: 'Hay una función dibujarPaleta(p)' },
        { t: 'cuadros', n: 2 },
        { t: 'ver', js: pintadoEn('izquierda.x + 5', 'izquierda.y + 40'), msg: 'Se ve la paleta de la izquierda' },
        { t: 'ver', js: pintadoEn('derecha.x + 5', 'derecha.y + 40'), msg: 'Se ve la paleta de la derecha' },
        { t: 'ver', js: pintadoEn('300', '5'), msg: 'Se ve la línea del medio' },
      ],
      idea: 'Cambia los colores de la cancha. ¿Te atreves con un fondo azul de hockey?',
    },
    {
      id: 'p2',
      titulo: 'Cada uno con su paleta',
      explicacion: [
        'Dos jugadores en el mismo teclado: el de la izquierda con W (sube) y S (baja), el de la derecha con las flechas.',
        'Ojo: `e.key` para la w es "w" en minúscula. Si tienen las mayúsculas puestas (Bloq Mayús), llega "W" y no se mueve.',
        'Las paredes, como en la nave: entre 0 y `400 - alto`.',
      ],
      codigo: PING_2,
      pruebas: [
        { t: 'ejecutar', js: 'window.__i = izquierda.y; window.__d = derecha.y' },
        { t: 'tecla', key: 'w' },
        { t: 'cuadros', n: 10 },
        { t: 'soltar', key: 'w' },
        { t: 'ver', js: 'izquierda.y < __i - 20', msg: 'Con la W sube la paleta de la izquierda' },
        { t: 'ver', js: 'derecha.y === __d', msg: 'y la de la derecha no se mueve' },
        { t: 'tecla', key: 'ArrowDown' },
        { t: 'cuadros', n: 10 },
        { t: 'soltar', key: 'ArrowDown' },
        { t: 'ver', js: 'derecha.y > __d + 20', msg: 'Con la flecha de abajo baja la de la derecha' },
        { t: 'tecla', key: 's' },
        { t: 'cuadros', n: 200 },
        { t: 'ver', js: 'izquierda.y + izquierda.alto <= 400 && izquierda.y + izquierda.alto > 393', msg: 'Las paletas no se salen de la cancha' },
      ],
      idea: 'Haz las paletas más cortas para que sea más difícil, o más rápidas.',
    },
    {
      id: 'p3',
      titulo: 'La pelota rebota',
      explicacion: [
        'La pelota tiene velocidad en x (`vx`, a los lados) y en y (`vy`, arriba y abajo). En cada cuadro se le suman: así va en diagonal.',
        'Rebotar es facilísimo: cuando toca el techo o el piso, `vy` cambia de signo. Si bajaba (positivo), ahora sube (negativo).',
        'Todavía se sale por los lados: eso lo arreglan las paletas en la siguiente parte.',
      ],
      codigo: PING_3,
      pruebas: [
        { t: 'ver', js: 'typeof pelota === "object" && typeof pelota.vx === "number"', msg: 'Hay una pelota con vx y vy' },
        { t: 'ejecutar', js: 'window.__x0 = pelota.x' },
        { t: 'cuadros', n: 5 },
        { t: 'ver', js: 'pelota.x !== __x0', msg: 'La pelota se mueve' },
        { t: 'ejecutar', js: 'pelota.x = 300; pelota.vx = 0; pelota.y = 385; pelota.vy = 4' },
        { t: 'cuadros', n: 6 },
        { t: 'ver', js: 'pelota.vy < 0', msg: 'Rebota en el borde de abajo' },
        { t: 'ejecutar', js: 'pelota.y = 15; pelota.vy = -4' },
        { t: 'cuadros', n: 6 },
        { t: 'ver', js: 'pelota.vy > 0', msg: 'y en el de arriba' },
      ],
      idea: 'Cambia vx y vy. ¿Qué pasa si vy es 0?',
    },
    {
      id: 'p4',
      titulo: 'Rebotar en las paletas',
      explicacion: [
        '`tocaPaleta(p)` pregunta si la pelota está metida en el rectángulo de la paleta: entre su borde izquierdo y el derecho, Y entre el de arriba y el de abajo. Cuatro condiciones con `&&`.',
        'Si toca, `vx` cambia de signo. El `pelota.vx < 0` sirve para que solo rebote cuando VA hacia esa paleta; si no, se quedaría temblando adentro.',
      ],
      codigo: PING_4,
      pruebas: [
        { t: 'ver', js: 'typeof tocaPaleta === "function"', msg: 'Hay una función tocaPaleta(p)' },
        { t: 'ejecutar', js: 'izquierda.y = 160; pelota.x = 80; pelota.y = 200; pelota.vx = -4; pelota.vy = 0' },
        { t: 'cuadros', n: 20 },
        { t: 'ver', js: 'pelota.vx > 0', msg: 'La pelota rebota en la paleta de la izquierda' },
        { t: 'ejecutar', js: 'derecha.y = 160; pelota.x = 520; pelota.y = 200; pelota.vx = 4; pelota.vy = 0' },
        { t: 'cuadros', n: 20 },
        { t: 'ver', js: 'pelota.vx < 0', msg: 'y en la de la derecha' },
        { t: 'ejecutar', js: 'izquierda.y = 0; pelota.x = 80; pelota.y = 350; pelota.vx = -4; pelota.vy = 0' },
        { t: 'cuadros', n: 20 },
        { t: 'ver', js: 'pelota.vx < 0', msg: 'Si la paleta no está, la pelota pasa de largo' },
      ],
      idea: 'Haz la pelota más grande o de otro color.',
    },
    {
      id: 'p5',
      titulo: 'Goles y marcador',
      explicacion: [
        'Si la pelota se sale por la izquierda (x menor que 0), el punto es para la derecha, y al revés.',
        'Después de cada punto, `sacar()` pone la pelota en el centro y la manda hacia el que ganó el punto (`direccion` es 1 o -1), con una `vy` al azar entre -3 y 3.',
      ],
      codigo: PING_5,
      pruebas: [
        { t: 'ejecutar', js: 'izquierda.y = 0; puntosDerecha = 0; pelota.x = 60; pelota.y = 350; pelota.vx = -5; pelota.vy = 0' },
        { t: 'cuadros', n: 20 },
        { t: 'ver', js: 'puntosDerecha === 1', msg: 'Si se le pasa a la izquierda, punto para la derecha' },
        { t: 'ver', js: 'Math.abs(pelota.x - 300) < 120', msg: 'y la pelota vuelve a salir del centro' },
        { t: 'ejecutar', js: 'derecha.y = 0; puntosIzquierda = 0; pelota.x = 540; pelota.y = 350; pelota.vx = 5; pelota.vy = 0' },
        { t: 'cuadros', n: 20 },
        { t: 'ver', js: 'puntosIzquierda === 1', msg: 'Si se le pasa a la derecha, punto para la izquierda' },
      ],
      idea: 'Ponle nombre a cada jugador encima de su número.',
    },
    {
      id: 'p6',
      titulo: 'Ganador y revancha',
      explicacion: [
        'El primero que llegue a 5 gana: `ganador` deja de estar vacío y el bucle deja de mover la pelota y las paletas.',
        'Con Enter, si ya hay ganador, todo vuelve a 0 a 0. Y un detalle que lo cambia todo: cada golpe de paleta multiplica la velocidad por 1.1 (un 10 % más rápido).',
      ],
      codigo: PING_6,
      pruebas: [
        { t: 'ejecutar', js: 'puntosDerecha = 4; izquierda.y = 0; pelota.x = 60; pelota.y = 350; pelota.vx = -5; pelota.vy = 0' },
        { t: 'cuadros', n: 20 },
        { t: 'ver', js: 'ganador !== ""', msg: 'Al llegar a 5 puntos hay ganador' },
        { t: 'ejecutar', js: 'window.__x = pelota.x' },
        { t: 'cuadros', n: 10 },
        { t: 'ver', js: 'pelota.x === __x', msg: 'Con ganador, la pelota se queda quieta' },
        { t: 'tecla', key: 'Enter' },
        { t: 'soltar', key: 'Enter' },
        { t: 'cuadros', n: 2 },
        { t: 'ver', js: 'ganador === "" && puntosDerecha === 0 && puntosIzquierda === 0', msg: 'Con Enter empieza la revancha, 0 a 0' },
        { t: 'ejecutar', js: 'izquierda.y = 160; pelota.x = 80; pelota.y = 200; pelota.vx = -4; pelota.vy = 0' },
        { t: 'cuadros', n: 20 },
        { t: 'ver', js: 'pelota.vx > 4', msg: 'Cada golpe de paleta, la pelota va más rápido' },
      ],
      idea: 'Que el partido sea a 3, o a 10. ¿Y si la pelota cambia de color cada vez que la golpean?',
    },
  ],
}

export const JUEGOS_ARENA: JuegoArena[] = [FRUTA, METEORITOS, PINGPONG]

export function juegoPorId(id: string): JuegoArena | undefined {
  return JUEGOS_ARENA.find((j) => j.id === id)
}

/** El modo libre: un juego que el alumno se inventa. */
export const LIBRE = 'libre'

/** Los id que acepta la nube: los guiados y el libre. */
export function juegoValido(id: string) {
  return id === LIBRE || Boolean(juegoPorId(id))
}

/** El esqueleto de cualquier juego, para arrancar el modo libre. */
export const PLANTILLA_LIBRE = c(`
const lienzo = document.getElementById('lienzo')
const pincel = lienzo.getContext('2d')

let teclas = {}
document.addEventListener('keydown', (e) => { teclas[e.key] = true })
document.addEventListener('keyup', (e) => { teclas[e.key] = false })

function mover() {
  // aquí cambian las cosas: posiciones, puntos, choques…
}

function dibujar() {
  pincel.fillStyle = '#0b1224'
  pincel.fillRect(0, 0, 600, 400)
  // aquí se pinta todo
}

function bucle() {
  mover()
  dibujar()
  requestAnimationFrame(bucle)
}

bucle()
`)

/** La caja de herramientas: lo que más se usa para hacer un juego. */
export const HERRAMIENTAS: { que: string; codigo: string }[] = [
  { que: 'Color para lo que vas a pintar', codigo: "pincel.fillStyle = 'red'" },
  { que: 'Rectángulo (x, y, ancho, alto)', codigo: 'pincel.fillRect(10, 20, 50, 30)' },
  { que: 'Círculo (x, y, radio)', codigo: 'pincel.beginPath()\npincel.arc(300, 200, 25, 0, Math.PI * 2)\npincel.fill()' },
  { que: 'Texto', codigo: "pincel.font = '24px sans-serif'\npincel.fillText('Hola', 10, 30)" },
  { que: 'Solo el borde de un rectángulo', codigo: "pincel.strokeStyle = 'white'\npincel.strokeRect(10, 20, 50, 30)" },
  { que: '¿Está oprimida una tecla?', codigo: "if (teclas['ArrowUp']) { … }\nif (teclas[' ']) { … }   // la barra espaciadora\nif (teclas['a']) { … }" },
  { que: 'Un número al azar entre 0 y 600', codigo: 'Math.random() * 600' },
  { que: 'Distancia entre dos puntos', codigo: 'Math.hypot(a.x - b.x, a.y - b.y)' },
  { que: '¿Se tocan dos rectángulos?', codigo: 'a.x < b.x + b.ancho && a.x + a.ancho > b.x &&\na.y < b.y + b.alto && a.y + a.alto > b.y' },
  { que: 'Una lista de cosas', codigo: 'let balas = []\nbalas.push({ x: 10, y: 20 })\nfor (const b of balas) { b.y = b.y - 5 }\nbalas = balas.filter((b) => b.y > 0)' },
  { que: 'Hacer algo cada cierto tiempo', codigo: 'cuadros = cuadros + 1\nif (cuadros % 60 === 0) { … }   // una vez por segundo' },
  { que: 'Ver un valor mientras juegas', codigo: 'console.log(puntos)' },
]

/* ---------------------------------------------------------------- diferencias */

/**
 * Qué líneas de `ahora` son nuevas o cambiaron respecto de `antes` (números
 * desde 1). Es una comparación línea por línea (la subsecuencia común más
 * larga), suficiente para pintar de verde lo que hay que escribir en la parte.
 */
export function lineasNuevas(antes: string, ahora: string): number[] {
  const a = antes ? antes.split('\n') : []
  const b = ahora.split('\n')
  const n = a.length
  const m = b.length
  const t: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1])
    }
  }
  const nuevas: number[] = []
  let i = 0
  let j = 0
  while (j < m) {
    if (i < n && a[i] === b[j]) {
      i++
      j++
    } else if (i < n && t[i + 1][j] >= t[i][j + 1]) {
      i++
    } else {
      if (b[j].trim() !== '') nuevas.push(j + 1)
      j++
    }
  }
  return nuevas
}

/** Nombre corto para la galería, que es pública: "Emily Orjuela" → "Emily O." */
export function nombreCorto(nombre: string) {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return 'Alguien'
  const primero = partes[0].charAt(0).toUpperCase() + partes[0].slice(1).toLowerCase()
  return partes.length > 1 ? `${primero} ${partes[1].charAt(0).toUpperCase()}.` : primero
}
