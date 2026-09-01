'use client'

import { useEffect, useState } from 'react'

const COLORES = ['#4ade80', '#22d3ee', '#a78bfa', '#f472b6', '#fbbf24', '#fb7185']

/** Papelitos de colores cayendo. Dura lo que dura y se va solo. */
export function Confeti({ activo, piezas = 90 }: { activo: boolean; piezas?: number }) {
  const [semilla, setSemilla] = useState(0)

  useEffect(() => {
    if (activo) setSemilla((s) => s + 1)
  }, [activo])

  if (!activo) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {Array.from({ length: piezas }).map((_, i) => {
        const izquierda = (i * 97) % 100
        const retraso = ((i * 37) % 100) / 100
        const duracion = 2 + (((i * 53) % 100) / 100) * 1.8
        return (
          <span
            key={`${semilla}-${i}`}
            className="papelito"
            style={{
              left: `${izquierda}%`,
              background: COLORES[i % COLORES.length],
              animationDuration: `${duracion}s`,
              animationDelay: `${retraso}s`,
              ['--giro' as string]: `${(i % 2 ? 1 : -1) * (360 + (i % 5) * 180)}deg`,
            }}
          />
        )
      })}
    </div>
  )
}
