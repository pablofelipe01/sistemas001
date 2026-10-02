/**
 * Los cursos interactivos: una explicación corta por lección y cinco retos que
 * se resuelven en orden. El primero es Python.
 *
 * Este archivo y calificar.ts no importan nada en tiempo de ejecución, a
 * propósito: así la llave de respuestas se puede probar también desde Node.
 */

/** Un pedazo de la explicación de una lección. Los textos aceptan `código` entre comillas invertidas. */
export type Bloque =
  | { t: 'p'; texto: string }
  /** Código de ejemplo que se puede correr desde la explicación, pero no copiar. */
  | { t: 'codigo'; codigo: string; entradas?: string[] }
  /** Lo mismo en JavaScript (que ya conocen) y en Python, lado a lado. */
  | { t: 'compara'; js: string; py: string }
  /** Un ojo con esto: el error típico de la lección. */
  | { t: 'ojo'; texto: string }

/**
 * Una prueba del reto. Todas las que miran la salida comparan "suave": sin
 * importar mayúsculas, tildes ni espacios de más al final de cada renglón,
 * salvo que digan `exacto`. `entradas` corre el programa otra vez con esas
 * respuestas para input(); sin ellas se usan las del reto.
 */
export type Prueba =
  /** Toda la salida: igual a, contiene (exactamente `veces`, si se da), o no contiene. */
  | { t: 'salida'; igual?: string; contiene?: string; veces?: number; no?: string; exacto?: boolean; entradas?: string[]; msg: string }
  /** Un renglón de la salida. `n` negativo cuenta desde el final (-1 = el último). */
  | { t: 'linea'; n: number; igual?: string; contiene?: string; entradas?: string[]; msg: string }
  /** Una expresión de Python que se evalúa después del programa. `igual` es su repr: '8', "'hola'", 'True'. */
  | { t: 'expr'; code: string; igual: string; entradas?: string[]; msg: string }
  /**
   * Busca (o prohíbe, con `not`) un patrón en el código. `min` exige que aparezca varias veces.
   * Mira el código sin comentarios, salvo que diga `crudo`.
   */
  | { t: 'src'; re: string; flags?: string; not?: boolean; min?: number; crudo?: boolean; msg: string }

export interface Reto {
  /** 'py-3-2': lección 3, reto 2. */
  id: string
  titulo: string
  /** Lo que se pide. No se puede copiar. */
  enunciado: string
  /** Lo que ya aparece escrito en el editor. */
  inicial: string
  /** Respuestas de ejemplo para input(). El alumno las puede cambiar al correr. */
  entradas?: string[]
  pista: string
  /** La respuesta de referencia. Solo la usa /verificar-curso. */
  solucion: string
  pruebas: Prueba[]
}

export interface Leccion {
  id: string
  numero: number
  titulo: string
  emoji: string
  /** Minutos que debería tomar en clase, explicación incluida. */
  minutos: number
  explicacion: Bloque[]
  retos: Reto[]
}

export interface Curso {
  id: string
  titulo: string
  emoji: string
  descripcion: string
  /** Para el editor: qué resaltado usa. */
  lenguaje: 'python'
  lecciones: Leccion[]
}

/** Lo que se guarda de cada alumno en un curso, en el navegador y en la nube. */
export interface AvanceCurso {
  /** Los id de los retos resueltos. */
  hechos: string[]
  /** Cuántas veces le dio "Comprobar" a cada reto. */
  intentos: Record<string, number>
  /** Los retos donde abrió la pista. */
  pistas: string[]
  teclas: number
  pegados: number
  /** El último código de cada reto, para volver donde iba (y para que el profesor lo vea). */
  codigo: Record<string, string>
}

export function avanceVacio(): AvanceCurso {
  return { hechos: [], intentos: {}, pistas: [], teclas: 0, pegados: 0, codigo: {} }
}
