import type { Lang } from './types'
import { ALL_CHALLENGES, TOTAL } from './challenges'
import { difficultyOf } from './types'

export type TipoAyuda = 'pista' | 'esqueleto' | 'saltar'

export interface EstadoReto {
  resuelto: boolean
  saltado: boolean
  intentos: number
  ayudas: TipoAyuda[]
  /** Milisegundos que estuvo con el reto abierto. */
  tiempoMs: number
  /** Cuántas teclas escribió. Sirve para notar un pegado que se coló. */
  teclas: number
  puntos: number
  codigo: string
  resueltoEn?: string
}

export interface Progreso {
  nombre: string
  slug: string
  puntos: number
  indice: number
  rachaActual: number
  mejorRacha: number
  comodines: Record<Lang, number>
  insignias: string[]
  retos: Record<string, EstadoReto>
  inicio: string
  ultimo: string
}

export const COMODINES_POR_SECCION = 3

export function slugificar(nombre: string) {
  return nombre
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita las tildes
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function progresoNuevo(nombre: string): Progreso {
  const ahora = new Date().toISOString()
  return {
    nombre: nombre.trim(),
    slug: slugificar(nombre),
    puntos: 0,
    indice: 0,
    rachaActual: 0,
    mejorRacha: 0,
    comodines: { html: COMODINES_POR_SECCION, css: COMODINES_POR_SECCION, js: COMODINES_POR_SECCION },
    insignias: [],
    retos: {},
    inicio: ahora,
    ultimo: ahora,
  }
}

export function retoVacio(): EstadoReto {
  return { resuelto: false, saltado: false, intentos: 0, ayudas: [], tiempoMs: 0, teclas: 0, puntos: 0, codigo: '' }
}

const BASE: Record<string, number> = { facil: 100, medio: 200, dificil: 350 }

/**
 * Puntos de un reto resuelto.
 * Premia acertar de una y castiga (poquito) cada ayuda: la idea es que las
 * ayudas cuesten algo, no que den miedo usarlas.
 */
export function calcularPuntos(opts: {
  n: number
  intentos: number
  ayudas: TipoAyuda[]
  rachaAntes: number
}): { puntos: number; bonus: string[] } {
  const base = BASE[difficultyOf(opts.n)]
  const bonus: string[] = []
  let total = base

  if (opts.intentos <= 1) {
    total += Math.round(base * 0.5)
    bonus.push('Al primer intento +50%')
  }

  if (opts.ayudas.includes('pista')) total = Math.round(total * 0.75)
  if (opts.ayudas.includes('esqueleto')) total = Math.round(total * 0.5)

  const mult = 1 + Math.min(opts.rachaAntes, 5) * 0.1
  if (opts.rachaAntes > 0) {
    total = Math.round(total * mult)
    bonus.push(`Racha ×${mult.toFixed(1)}`)
  }

  return { puntos: total, bonus }
}

export interface Insignia {
  id: string
  nombre: string
  emoji: string
  descripcion: string
}

export const INSIGNIAS: Insignia[] = [
  { id: 'primer-paso', nombre: 'Primer paso', emoji: '👣', descripcion: 'Resolviste tu primer reto' },
  { id: 'html-listo', nombre: 'Arquitecto', emoji: '🧱', descripcion: 'Terminaste los 25 retos de HTML' },
  { id: 'css-listo', nombre: 'Diseñador', emoji: '🎨', descripcion: 'Terminaste los 25 retos de CSS' },
  { id: 'js-listo', nombre: 'Cerebro', emoji: '🧠', descripcion: 'Terminaste los 25 retos de JavaScript' },
  { id: 'racha-5', nombre: 'En llamas', emoji: '🔥', descripcion: '5 retos seguidos al primer intento' },
  { id: 'racha-10', nombre: 'Imparable', emoji: '⚡', descripcion: '10 retos seguidos al primer intento' },
  { id: 'sin-ayudas', nombre: 'Solo contra el mundo', emoji: '🦁', descripcion: 'Terminaste una sección sin gastar comodines' },
  { id: 'jefe-caido', nombre: 'Mata jefes', emoji: '👑', descripcion: 'Venciste un JEFE FINAL' },
  { id: 'maraton', nombre: 'Maratonista', emoji: '🏁', descripcion: 'Terminaste el examen completo' },
]

export function insigniaPorId(id: string) {
  return INSIGNIAS.find((i) => i.id === id)
}

/** Revisa qué insignias nuevas se ganó justo después de resolver un reto. */
export function insigniasGanadas(p: Progreso, idReto: string): string[] {
  const nuevas: string[] = []
  const add = (id: string) => {
    if (!p.insignias.includes(id) && !nuevas.includes(id)) nuevas.push(id)
  }

  const resueltos = Object.values(p.retos).filter((r) => r.resuelto).length
  if (resueltos >= 1) add('primer-paso')
  if (p.mejorRacha >= 5) add('racha-5')
  if (p.mejorRacha >= 10) add('racha-10')
  if (idReto.endsWith('-25')) add('jefe-caido')

  for (const lang of ['html', 'css', 'js'] as const) {
    const dela = ALL_CHALLENGES.filter((c) => c.lang === lang)
    const completa = dela.every((c) => p.retos[c.id]?.resuelto)
    if (completa) {
      add(`${lang}-listo`)
      if (p.comodines[lang] === COMODINES_POR_SECCION) add('sin-ayudas')
    }
  }

  if (ALL_CHALLENGES.every((c) => p.retos[c.id]?.resuelto)) add('maraton')

  return nuevas
}

export function resumen(p: Progreso) {
  const resueltos = ALL_CHALLENGES.filter((c) => p.retos[c.id]?.resuelto).length
  const saltados = ALL_CHALLENGES.filter((c) => p.retos[c.id]?.saltado).length
  return {
    resueltos,
    saltados,
    total: TOTAL,
    porcentaje: Math.round((resueltos / TOTAL) * 100),
  }
}
