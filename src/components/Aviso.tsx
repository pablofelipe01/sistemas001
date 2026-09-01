'use client'

import { useEffect } from 'react'

export type TonoAviso = 'alerta' | 'bien' | 'info'

const TONOS: Record<TonoAviso, string> = {
  alerta: 'border-[#7f1d3a] bg-[#2a0f1c] text-[#ffd7e2]',
  bien: 'border-[#166534] bg-[#0d2418] text-[#c9f7d8]',
  info: 'border-[#1e3a5f] bg-[#0e1c2f] text-[#cfe4ff]',
}

/** Mensajito flotante arriba. Se va solo a los pocos segundos. */
export function Aviso({
  mensaje,
  tono = 'info',
  onCerrar,
}: {
  mensaje: string | null
  tono?: TonoAviso
  onCerrar: () => void
}) {
  useEffect(() => {
    if (!mensaje) return
    const t = setTimeout(onCerrar, 3800)
    return () => clearTimeout(t)
  }, [mensaje, onCerrar])

  if (!mensaje) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex justify-center px-4">
      <div
        role="status"
        className={`aparecer pointer-events-auto max-w-lg rounded-xl border px-4 py-3 text-sm shadow-2xl ${TONOS[tono]}`}
      >
        {mensaje}
      </div>
    </div>
  )
}
