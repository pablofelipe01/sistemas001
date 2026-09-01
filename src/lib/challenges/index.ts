import type { Challenge, Lang } from '../types'
import { HTML_CHALLENGES } from './html'
import { CSS_CHALLENGES } from './css'
import { JS_CHALLENGES } from './js'

/** El examen completo, en orden: primero los 25 de HTML, luego CSS, luego JS. */
export const ALL_CHALLENGES: Challenge[] = [...HTML_CHALLENGES, ...CSS_CHALLENGES, ...JS_CHALLENGES]

export const TOTAL = ALL_CHALLENGES.length

export const SECCIONES: { lang: Lang; nombre: string; emoji: string; desde: number; hasta: number }[] = [
  { lang: 'html', nombre: 'HTML', emoji: '🧱', desde: 0, hasta: 24 },
  { lang: 'css', nombre: 'CSS', emoji: '🎨', desde: 25, hasta: 49 },
  { lang: 'js', nombre: 'JavaScript', emoji: '🧠', desde: 50, hasta: 74 },
]

export function seccionDe(indice: number) {
  return SECCIONES.find((s) => indice >= s.desde && indice <= s.hasta) ?? SECCIONES[0]
}

export { HTML_CHALLENGES, CSS_CHALLENGES, JS_CHALLENGES }
