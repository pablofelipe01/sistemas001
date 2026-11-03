'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

/*
 * El mismo seguro del examen, para los cursos que lo piden (el de
 * preparación): si intentan una captura de pantalla o se van a otra pestaña u
 * otra aplicación (por ejemplo, a pegarle el pantallazo a una IA), la página se
 * tapa y queda registrado para el profe. No se copia, no hay clic derecho ni
 * herramientas del navegador, y todo lleva el nombre del alumno en marca de
 * agua.
 *
 * No es a prueba de balas: una foto con el celular no se puede impedir. Pero
 * el pantallazo rápido que se pega en otra parte sí queda tapado y contado.
 */

export interface Vigilancia {
  /** true mientras la página está tapada. */
  tapado: boolean
}

export function useVigilancia({
  activo,
  onCaptura,
  onSalida,
  avisar,
}: {
  activo: boolean
  onCaptura: () => void
  /** Cuando vuelve: cuántos segundos estuvo fuera. */
  onSalida: (segundos: number) => void
  avisar: (texto: string) => void
}): Vigilancia {
  const [tapado, setTapado] = useState(false)
  // Las funciones cambian en cada render; los escuchadores se quedan con la última.
  const llamadas = useRef({ onCaptura, onSalida, avisar })
  llamadas.current = { onCaptura, onSalida, avisar }

  useEffect(() => {
    if (!activo) return
    let fueraDesde: number | null = null
    let tapadoPorTeclas = false

    const salir = () => {
      if (fueraDesde !== null) return
      fueraDesde = Date.now()
      setTapado(true)
    }
    const volver = () => {
      if (fueraDesde === null || document.visibilityState === 'hidden' || !document.hasFocus()) return
      const segundos = Math.round((Date.now() - fueraDesde) / 1000)
      fueraDesde = null
      if (!tapadoPorTeclas) setTapado(false)
      // Un parpadeo de menos de un segundo no es haberse ido.
      if (segundos < 1) return
      llamadas.current.onSalida(segundos)
      llamadas.current.avisar('👀 Saliste de la página. Mientras no estás, se tapa, y queda registrado para el profe.')
    }
    const alCambiarVisibilidad = () => (document.visibilityState === 'hidden' ? salir() : volver())

    const alTeclear = (e: KeyboardEvent) => {
      const k = e.key
      const combo = (e.metaKey && e.shiftKey) || (k === 'Meta' && e.shiftKey) || (k === 'Shift' && e.metaKey)
      if (k === 'PrintScreen' || combo) {
        if (!tapadoPorTeclas) {
          tapadoPorTeclas = true
          setTapado(true)
          llamadas.current.onCaptura()
          llamadas.current.avisar('📸 Nada de pantallazos. Aquí se aprende escribiendo, no preguntándole a otro. Queda registrado para el profe.')
        }
        if (k === 'PrintScreen') {
          void navigator.clipboard?.writeText('').catch(() => {})
          window.setTimeout(() => {
            tapadoPorTeclas = false
            if (fueraDesde === null) setTapado(false)
          }, 1500)
        }
        e.preventDefault()
        return
      }
      const mod = e.ctrlKey || e.metaKey
      const herramientas =
        k === 'F12' ||
        (mod && e.shiftKey && /^[ijc]$/i.test(k)) ||
        (e.metaKey && e.altKey && /^[ijcu]$/i.test(k)) ||
        (mod && /^[usp]$/i.test(k))
      if (herramientas) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    const alSoltar = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        // En Windows, Imprimir pantalla a veces solo avisa al soltar.
        void navigator.clipboard?.writeText('').catch(() => {})
        if (!tapadoPorTeclas) llamadas.current.onCaptura()
        return
      }
      if (tapadoPorTeclas && (e.key === 'Meta' || e.key === 'Shift')) {
        tapadoPorTeclas = false
        if (fueraDesde === null) setTapado(false)
      }
    }
    const bloquear = (e: Event) => {
      e.preventDefault()
      if (e.type === 'copy' || e.type === 'cut') llamadas.current.avisar('📋 Aquí no se copia nada.')
    }

    window.addEventListener('blur', salir)
    window.addEventListener('focus', volver)
    document.addEventListener('visibilitychange', alCambiarVisibilidad)
    window.addEventListener('keydown', alTeclear, true)
    window.addEventListener('keyup', alSoltar, true)
    document.addEventListener('copy', bloquear, true)
    document.addEventListener('cut', bloquear, true)
    document.addEventListener('contextmenu', bloquear, true)
    document.addEventListener('dragstart', bloquear, true)
    return () => {
      window.removeEventListener('blur', salir)
      window.removeEventListener('focus', volver)
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
      window.removeEventListener('keydown', alTeclear, true)
      window.removeEventListener('keyup', alSoltar, true)
      document.removeEventListener('copy', bloquear, true)
      document.removeEventListener('cut', bloquear, true)
      document.removeEventListener('contextmenu', bloquear, true)
      document.removeEventListener('dragstart', bloquear, true)
    }
  }, [activo])

  return { tapado: activo && tapado }
}

/** La cortina que tapa todo mientras el alumno no está o intenta un pantallazo. */
export function Cortina({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#05080f] px-6 text-center">
      <div>
        <p className="mb-3 text-5xl">🙈</p>
        <p className="text-lg font-black text-[#e8eeff]">La lección se esconde cuando no estás aquí</p>
        <p className="mt-2 text-sm text-[#9fb0d4]">
          Haz clic en esta página para volver. Los pantallazos y las salidas quedan registrados para el profe.
        </p>
      </div>
    </div>
  )
}

/** El nombre del alumno repetido en diagonal: si sale una foto o una captura, se sabe de quién es. */
export function MarcaDeAgua({ nombre }: { nombre: string }) {
  const svg = useMemo(() => {
    const texto = (nombre || 'invitado').replace(/[<>&"']/g, '')
    const s = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><text x="20" y="120" transform="rotate(-20 180 100)" fill="rgba(148,163,255,0.07)" font-family="sans-serif" font-size="20" font-weight="700">${texto}</text></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(s)}")`
  }, [nombre])
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-40" style={{ backgroundImage: svg }} />
}
