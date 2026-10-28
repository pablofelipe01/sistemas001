import { calificar, type Correr, type ResultadoPrueba } from '../cursos/calificar'
import { PUNTOS_POR_PREGUNTA, type Pregunta, type Respuesta } from './tipos'

export interface Puntaje {
  puntos: number
  /** Solo en las de código: cada prueba, para que el profesor vea qué le faltó. */
  pruebas?: ResultadoPrueba[]
}

/** ¿El alumno hizo algo en esta pregunta? El código que ya venía escrito no cuenta. */
export function contestada(p: Pregunta, r: Respuesta | undefined): boolean {
  if (r === undefined || r === null) return false
  if (p.tipo === 'codigo') return typeof r === 'string' && r.trim() !== '' && r.trim() !== p.inicial.trim()
  return true
}

/**
 * De 0 a 5. En el código, la parte de las pruebas que pasa (si pasa la mitad,
 * saca la mitad). En la selección múltiple, lo que valga la opción escogida.
 * En falso o verdadero, 5 o 0.
 */
export async function puntuar(p: Pregunta, r: Respuesta | undefined, correr: Correr): Promise<Puntaje> {
  if (!contestada(p, r)) return { puntos: 0 }
  if (p.tipo === 'opcion') return { puntos: typeof r === 'number' ? (p.opciones[r]?.puntos ?? 0) : 0 }
  if (p.tipo === 'vf') return { puntos: r === p.verdadero ? PUNTOS_POR_PREGUNTA : 0 }

  const c = await calificar(p, r as string, correr, 'python')
  const bien = c.resultados.filter((x) => x.ok).length
  const puntos = Math.round((PUNTOS_POR_PREGUNTA * bien) / c.resultados.length)
  return { puntos, pruebas: c.resultados }
}

/** Un número sacado del texto, siempre el mismo para el mismo texto. */
function semilla(texto: string) {
  let h = 2166136261
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/**
 * El orden en que ve las opciones cada alumno: revuelto, pero siempre igual
 * para el mismo alumno. Así el vecino no tiene la "b" en el mismo sitio.
 */
export function ordenDeOpciones(slug: string, idPregunta: string, cuantas: number): number[] {
  const orden = Array.from({ length: cuantas }, (_, i) => i)
  let s = semilla(`${slug}:${idPregunta}`)
  for (let i = orden.length - 1; i > 0; i--) {
    s = Math.imul(s ^ (s >>> 15), 2246822507) >>> 0
    s = Math.imul(s ^ (s >>> 13), 3266489909) >>> 0
    const j = s % (i + 1)
    ;[orden[i], orden[j]] = [orden[j], orden[i]]
  }
  return orden
}
