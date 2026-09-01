'use client'

import type { Progreso } from './progress'

const PREFIJO = 'examen-web:'
const INDICE = 'examen-web:alumnos'

/* ---------------------------------------------------------------- local --- */

export function cargarLocal(slug: string): Progreso | null {
  try {
    const raw = localStorage.getItem(PREFIJO + slug)
    return raw ? (JSON.parse(raw) as Progreso) : null
  } catch {
    return null
  }
}

export function guardarLocal(p: Progreso) {
  try {
    localStorage.setItem(PREFIJO + p.slug, JSON.stringify(p))
    const lista = listarLocales().filter((a) => a.slug !== p.slug)
    lista.unshift({ slug: p.slug, nombre: p.nombre, puntos: p.puntos })
    localStorage.setItem(INDICE, JSON.stringify(lista.slice(0, 30)))
  } catch {
    /* El navegador puede tener el almacenamiento bloqueado (modo incógnito,
       cuota llena). No es motivo para tumbar el examen: se sigue jugando. */
  }
}

export function listarLocales(): { slug: string; nombre: string; puntos: number }[] {
  try {
    return JSON.parse(localStorage.getItem(INDICE) || '[]')
  } catch {
    return []
  }
}

export function olvidarLocal(slug: string) {
  try {
    localStorage.removeItem(PREFIJO + slug)
    localStorage.setItem(INDICE, JSON.stringify(listarLocales().filter((a) => a.slug !== slug)))
  } catch {
    /* ídem */
  }
}

/* ----------------------------------------------------------------- nube --- */

export async function cargarNube(slug: string): Promise<Progreso | null> {
  try {
    const r = await fetch(`/api/progreso?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
    const d = await r.json()
    return d?.progreso ?? null
  } catch {
    return null
  }
}

export async function guardarNube(p: Progreso): Promise<boolean> {
  try {
    const r = await fetch('/api/progreso', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    })
    const d = await r.json()
    return Boolean(d?.ok)
  } catch {
    return false
  }
}

export function registrarEvento(slug: string, tipo: string, reto?: string, detalle?: string) {
  // A propósito sin await: es telemetría del salón, nunca debe frenar al alumno.
  fetch('/api/evento', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, tipo, reto, detalle }),
    keepalive: true,
  }).catch(() => {})
}

/* --------------------------------------------------------------- fusión --- */

/**
 * Si hay progreso local y también en la nube, gana el que tenga más retos
 * resueltos. Así el alumno nunca pierde trabajo por cambiar de computador ni
 * por quedarse sin internet a mitad de clase.
 */
export function fusionar(local: Progreso | null, nube: Progreso | null): Progreso | null {
  if (!local) return nube
  if (!nube) return local
  const cuenta = (p: Progreso) => Object.values(p.retos ?? {}).filter((r) => r.resuelto).length
  return cuenta(nube) > cuenta(local) ? nube : local
}
