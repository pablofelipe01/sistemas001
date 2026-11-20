'use client'

import { useEffect, useState } from 'react'
import { JUEGOS_ARENA } from '@/lib/arena'
import { explicarError, revisarParte } from '@/lib/arena-runner'

/**
 * Autodiagnóstico de la arena de juegos, hermano de /verificar-proyecto.
 *
 * Para cada parte: el modelo de esa parte TIENE que pasar su revisión, y el
 * modelo de la parte anterior NO (si pasara, la revisión no mide lo nuevo).
 * Si algo sale en rojo, hay que arreglarlo antes de ponérselo a un niño.
 */
interface Fila {
  id: string
  titulo: string
  pasa: boolean
  fallos: string[]
  anteriorNoPasa: boolean
}

export default function VerificarArena() {
  const [filas, setFilas] = useState<Fila[]>([])
  const [listo, setListo] = useState(false)

  useEffect(() => {
    let vivo = true
    ;(async () => {
      for (const j of JUEGOS_ARENA) {
        for (let i = 0; i < j.partes.length; i++) {
          const p = j.partes[i]
          const r = await revisarParte(p.codigo, p.pruebas)
          const antes = i > 0 ? await revisarParte(j.partes[i - 1].codigo, p.pruebas) : { ok: false }
          if (!vivo) return
          const fallos = r.resultados.filter((x) => !x.ok).map((x) => x.msg)
          if (r.error) fallos.push(explicarError(r.error))
          if (r.colgado) fallos.push('se colgó')
          setFilas((f) => [...f, { id: `${j.id}/${p.id}`, titulo: p.titulo, pasa: r.ok, fallos, anteriorNoPasa: !antes.ok }])
        }
      }
      if (vivo) setListo(true)
    })()
    return () => {
      vivo = false
    }
  }, [])

  const malas = filas.filter((f) => !f.pasa || !f.anteriorNoPasa).length

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-2xl font-black">Autodiagnóstico de la arena</h1>
      <p id="resumen" data-listo={listo ? 'si' : 'no'} className="mt-2 text-sm text-[#9fb0d4]">
        {listo ? (malas === 0 ? `TODO BIEN: ${filas.length} partes` : `HAY ${malas} CON PROBLEMAS de ${filas.length}`) : 'Revisando…'}
      </p>
      <ul className="mt-4 space-y-1 text-xs">
        {filas.map((f) => (
          <li key={f.id} className={f.pasa && f.anteriorNoPasa ? 'text-[#86efac]' : 'text-[#fb7185]'}>
            {f.pasa && f.anteriorNoPasa ? '✓' : '✗'} {f.id} · {f.titulo}
            {!f.pasa && ` — el modelo no pasa: ${f.fallos.join(' | ')}`}
            {!f.anteriorNoPasa && ' — la parte anterior ya la pasaba'}
          </li>
        ))}
      </ul>
    </main>
  )
}
