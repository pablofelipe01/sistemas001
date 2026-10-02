import { CURSO_PYTHON } from './python'
import { avanceVacio, type AvanceCurso, type Curso, type Leccion } from './tipos'

export const CURSOS: Curso[] = [CURSO_PYTHON]

export function cursoPorId(id: string) {
  return CURSOS.find((c) => c.id === id)
}

export function leccionPorId(curso: Curso, id: string) {
  return curso.lecciones.find((l) => l.id === id)
}

export function totalRetos(curso: Curso) {
  return curso.lecciones.reduce((n, l) => n + l.retos.length, 0)
}

/** Minutos de todo el curso, sumando lo que se calculó para cada lección. */
export function minutosDelCurso(curso: Curso) {
  return curso.lecciones.reduce((n, l) => n + l.minutos, 0)
}

export function retosHechos(leccion: Leccion, avance: Pick<AvanceCurso, 'hechos'>) {
  return leccion.retos.filter((r) => avance.hechos.includes(r.id)).length
}

/** Una lección se abre cuando la anterior quedó completa. La primera siempre está abierta. */
export function leccionAbierta(curso: Curso, indice: number, avance: AvanceCurso) {
  if (indice === 0) return true
  const anterior = curso.lecciones[indice - 1]
  return retosHechos(anterior, avance) === anterior.retos.length
}

/** El índice de la lección donde va el alumno: la primera sin terminar. */
export function leccionActual(curso: Curso, avance: AvanceCurso) {
  const i = curso.lecciones.findIndex((l) => retosHechos(l, avance) < l.retos.length)
  return i === -1 ? curso.lecciones.length - 1 : i
}

/* ---------------------------------------------------- dónde se guarda --- */

export function llaveDeCurso(idCurso: string, slug: string) {
  return `examen-web:curso:${idCurso}:${slug || 'invitado'}`
}

export function cargarAvanceLocal(idCurso: string, slug: string): AvanceCurso {
  try {
    const crudo = localStorage.getItem(llaveDeCurso(idCurso, slug))
    if (crudo) return { ...avanceVacio(), ...(JSON.parse(crudo) as Partial<AvanceCurso>) }
  } catch {
    /* almacenamiento bloqueado: se sigue trabajando, solo que sin recordar */
  }
  return avanceVacio()
}

export function guardarAvanceLocal(idCurso: string, slug: string, a: AvanceCurso) {
  try {
    localStorage.setItem(llaveDeCurso(idCurso, slug), JSON.stringify(a))
  } catch {
    /* ídem */
  }
}

export async function cargarAvanceNube(idCurso: string, slug: string): Promise<AvanceCurso | null> {
  try {
    const r = await fetch(`/api/curso-avance?slug=${encodeURIComponent(slug)}&curso=${encodeURIComponent(idCurso)}`, {
      cache: 'no-store',
    })
    const d = await r.json()
    return d?.avance ? { ...avanceVacio(), ...d.avance } : null
  } catch {
    return null
  }
}

export function guardarAvanceNube(idCurso: string, slug: string, nombre: string, a: AvanceCurso) {
  // Sin await: si no hay internet, el avance igual queda en el navegador.
  fetch('/api/curso-avance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, nombre: nombre.trim(), curso: idCurso, ...a }),
    // keepalive: que llegue aunque el alumno ya se haya ido de la página.
    keepalive: true,
  }).catch(() => {})
}

/** Igual que en el examen y los proyectos: si en la nube hay más retos hechos, gana la nube. */
export function fusionarAvance(local: AvanceCurso, nube: AvanceCurso | null): AvanceCurso {
  if (!nube) return local
  return nube.hechos.length > local.hechos.length ? nube : local
}
