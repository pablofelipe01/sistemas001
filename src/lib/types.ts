export type Lang = 'html' | 'css' | 'js'

/**
 * Una prueba declarativa. Se evalúan todas dentro del iframe aislado, después
 * de montar el HTML / inyectar el CSS / ejecutar el JS del alumno.
 * `msg` es lo que ve el alumno cuando la prueba falla: se escribe en su idioma,
 * como una pista, nunca como un regaño.
 */
export type Assertion =
  /** Existe al menos `min` (por defecto 1) elementos que coincidan con el selector. */
  | { t: 'exists'; sel: string; min?: number; msg: string }
  /** Hay exactamente `eq` elementos que coinciden. */
  | { t: 'count'; sel: string; eq: number; msg: string }
  /** El texto del elemento es / contiene algo. */
  | { t: 'text'; sel: string; eq?: string; has?: string; msg: string }
  /** Un atributo del elemento existe / vale algo. `minLen` exige que tenga contenido de verdad. */
  | { t: 'attr'; sel: string; name: string; eq?: string; has?: string; minLen?: number; msg: string }
  /** Estilo calculado. Compara colores y unidades ya normalizados por el navegador. */
  | { t: 'style'; sel: string; prop: string; eq?: string; oneOf?: string[]; has?: string; msg: string }
  /**
   * Mira las reglas CSS escritas, no el estilo calculado. Es la única forma de
   * calificar cosas que no se pueden "ver" sin interactuar, como :hover, y lo que
   * vive dentro de una media query.
   */
  | { t: 'rule'; sel: string; prop: string; eq?: string; has?: string; media?: string; msg: string }
  /** El elemento tiene (o no) una clase. */
  | { t: 'class'; sel: string; name: string; not?: boolean; msg: string }
  /** Algo que se imprimió con console.log. `at` fija la posición (0 = el primero). */
  | { t: 'log'; eq?: string; has?: string; at?: number; msg: string }
  /** Cuántas veces se llamó a console.log. */
  | { t: 'logCount'; eq?: number; min?: number; msg: string }
  /** Evalúa una expresión JS en el mismo ámbito del código del alumno. */
  | { t: 'expr'; code: string; eq: unknown; msg: string }
  /** Busca (o prohíbe) un patrón en el código fuente escrito por el alumno. */
  | { t: 'src'; re: string; flags?: string; not?: boolean; msg: string }

export interface Challenge {
  /** 'html-01', 'css-14', 'js-25' */
  id: string
  lang: Lang
  /** 1..25 dentro de su lenguaje */
  n: number
  title: string
  /** El enunciado. Es el texto que NO se puede copiar. */
  brief: string
  /** Lista de requisitos concretos. Tampoco se puede copiar. */
  goal: string[]
  /** Lo que aparece ya escrito en la terminal. */
  starter: string
  /** Fixture: el HTML de la página para los retos de CSS y de JS con DOM. */
  html?: string
  /**
   * Versión del fixture para mostrarle al alumno, cuando la de verdad tiene
   * ruido que no le aporta nada (una imagen incrustada como data URI, por
   * ejemplo). Solo cambia lo que lee, nunca lo que se ejecuta.
   */
  htmlVisible?: string
  /** Ayuda 1 — la pista. */
  hint: string
  /** Ayuda 2 — media respuesta, con huecos. */
  skeleton: string
  /** Solución de referencia (solo la ve el profesor). */
  solution: string
  tests: Assertion[]
}

export type Difficulty = 'facil' | 'medio' | 'dificil'

export function difficultyOf(n: number): Difficulty {
  if (n <= 8) return 'facil'
  if (n <= 17) return 'medio'
  return 'dificil'
}

export interface TestResult {
  ok: boolean
  msg: string
}

export interface RunOutcome {
  /** ¿Pasaron todas las pruebas? */
  passed: boolean
  results: TestResult[]
  logs: string[]
  /** Error de ejecución (sintaxis o runtime). */
  error?: string
  /** Se colgó (probablemente un ciclo infinito). */
  timedOut?: boolean
}
