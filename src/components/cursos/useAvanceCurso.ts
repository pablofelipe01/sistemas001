'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  cargarAvanceLocal,
  cargarAvanceNube,
  cursoCompleto,
  cursoPorId,
  fusionarAvance,
  guardarAvanceLocal,
  guardarAvanceNube,
} from '@/lib/cursos'
import { avanceVacio, type AvanceCurso, type Curso } from '@/lib/cursos/tipos'
import { slugificar } from '@/lib/progress'

/**
 * El avance del alumno en un curso: lo lee del navegador y de la nube (gana el
 * que tenga más retos hechos), y lo guarda en los dos cada vez que cambia. A la
 * nube, sin martillarla: espera a que el alumno haga una pausa.
 */
export function useAvanceCurso(idCurso: string) {
  const [nombre, setNombre] = useState('')
  const [avance, setAvance] = useState<AvanceCurso>(avanceVacio)
  const [cargado, setCargado] = useState(false)
  const slug = useMemo(() => slugificar(nombre), [nombre])
  // Lo que falta mandar a la nube, por si el alumno se va antes de la pausa.
  const pendiente = useRef<(() => void) | null>(null)

  useEffect(() => {
    let vivo = true
    ;(async () => {
      let guardado = ''
      try {
        guardado = localStorage.getItem('examen-web:activo') || ''
      } catch {
        /* sin almacenamiento se trabaja como invitado */
      }
      const s = slugificar(guardado)
      const local = cargarAvanceLocal(idCurso, s)
      const nube = s ? await cargarAvanceNube(idCurso, s) : null
      if (!vivo) return
      setNombre(guardado)
      setAvance(fusionarAvance(local, nube))
      setCargado(true)
    })()
    return () => {
      vivo = false
    }
  }, [idCurso])

  useEffect(() => {
    if (!cargado) return
    guardarAvanceLocal(idCurso, slug, avance)
    // Un curso que solo se abrió y no se tocó no se manda.
    if (!slug || (avance.hechos.length === 0 && avance.teclas === 0)) return
    const mandar = () => {
      pendiente.current = null
      guardarAvanceNube(idCurso, slug, nombre, avance)
    }
    pendiente.current = mandar
    const t = setTimeout(mandar, 2500)
    return () => clearTimeout(t)
  }, [cargado, avance, slug, nombre, idCurso])

  useEffect(() => () => pendiente.current?.(), [])

  return { nombre, slug, avance, setAvance, cargado }
}

/**
 * Si el curso pide terminar otro antes (Python avanzado pide Python desde
 * cero), mira si el alumno ya lo terminó: en este navegador o en la nube, por
 * si lo hizo en otro computador.
 */
export function useCursoPrevio(curso: Curso) {
  const previo = curso.requiere ? cursoPorId(curso.requiere) : undefined
  const [estado, setEstado] = useState({ listo: !previo, abierto: !previo })

  useEffect(() => {
    if (!previo) return
    let vivo = true
    ;(async () => {
      let slug = ''
      try {
        slug = slugificar(localStorage.getItem('examen-web:activo') || '')
      } catch {
        /* sin almacenamiento: solo cuenta lo que diga la nube */
      }
      const local = cargarAvanceLocal(previo.id, slug)
      const avance = cursoCompleto(previo, local) || !slug ? local : fusionarAvance(local, await cargarAvanceNube(previo.id, slug))
      if (vivo) setEstado({ listo: true, abierto: cursoCompleto(previo, avance) })
    })()
    return () => {
      vivo = false
    }
  }, [previo])

  return { previo, ...estado }
}
