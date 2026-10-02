'use client'

import { useEffect, useState } from 'react'
import { CURSOS } from '@/lib/cursos'
import { calificar } from '@/lib/cursos/calificar'
import { motorPython } from '@/lib/cursos/motor-python'

/**
 * Autodiagnóstico de los cursos, hermano de /verificar y /verificar-proyecto.
 *
 * Por cada reto corre la solución de referencia (tiene que pasar) y el código
 * con que arranca el editor (no debe pasar solo). También corre los ejemplos de
 * las explicaciones. Si algo sale en rojo, hay que arreglarlo antes de
 * ponérselo a un niño enfrente.
 */
interface Fila {
  id: string
  titulo: string
  ok: boolean
  detalle: string
}

export default function VerificarCurso() {
  const [filas, setFilas] = useState<Fila[]>([])
  const [corriendo, setCorriendo] = useState(true)

  useEffect(() => {
    let vivo = true
    const motor = motorPython()
    const correr = (p: Parameters<typeof motor.correr>[0]) => motor.correr(p)

    ;(async () => {
      const salida: Fila[] = []
      const anotar = (f: Fila) => {
        salida.push(f)
        if (vivo) setFilas([...salida])
      }

      for (const c of CURSOS) {
        for (const l of c.lecciones) {
          for (const [i, b] of l.explicacion.entries()) {
            if (b.t !== 'codigo') continue
            const r = await correr({ codigo: b.codigo, entradas: b.entradas })
            anotar({
              id: `${l.id}-ejemplo-${i}`,
              titulo: `${c.emoji} L${l.numero} · ejemplo de la explicación`,
              ok: !r.error && !r.tiempoAgotado,
              detalle: r.error ? `${r.error.tipo}: ${r.error.mensaje}` : '',
            })
          }
          for (const r of l.retos) {
            const bien = await calificar(r, r.solucion, correr)
            const inicial = await calificar(r, r.inicial, correr)
            const fallos = bien.resultados.filter((x) => !x.ok).map((x) => x.msg)
            anotar({
              id: r.id,
              titulo: `${c.emoji} L${l.numero} · ${r.titulo}`,
              ok: bien.ok && !inicial.ok,
              detalle: !bien.ok
                ? `La solución no pasa: ${bien.rota?.error?.mensaje ?? fallos.join(' · ')}`
                : inicial.ok
                  ? 'El código inicial pasa solo, sin que el alumno haga nada'
                  : '',
            })
          }
        }
      }
      if (vivo) setCorriendo(false)
    })()

    return () => {
      vivo = false
    }
  }, [])

  const malas = filas.filter((f) => !f.ok)

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="mb-1 text-2xl font-black">Verificar los cursos</h1>
      <p className="mb-6 text-xs text-[#7f8fb3]">
        {corriendo ? 'Corriendo… (la primera vez hay que esperar a que cargue Python)' : 'Listo.'} {filas.length} revisados,{' '}
        <span className={malas.length ? 'text-[#fb7185]' : 'text-[#4ade80]'}>{malas.length} con problemas</span>.
      </p>
      <ul className="space-y-1 text-xs">
        {filas.map((f) => (
          <li key={f.id} className={f.ok ? 'text-[#5a6b8f]' : 'text-[#fb7185]'}>
            {f.ok ? '✓' : '✗'} {f.titulo}
            {f.detalle && <span className="block pl-4 text-[#fbc4d2]">{f.detalle}</span>}
          </li>
        ))}
      </ul>
    </main>
  )
}
