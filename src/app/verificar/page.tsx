'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Runner } from '@/lib/runner'
import { ALL_CHALLENGES } from '@/lib/challenges'
import type { RunOutcome } from '@/lib/types'

interface Fila {
  id: string
  title: string
  ok: boolean
  detalle: string
}

/**
 * Autodiagnóstico del examen.
 *
 * Corre la solución de referencia de los 75 retos contra sus propias pruebas.
 * Si algo sale en rojo, es un reto mal calibrado: imposible de resolver o con
 * una prueba que no mide lo que dice. Vale la pena pasarlo cada vez que se
 * toque una pregunta.
 */
export default function Verificar() {
  const anfitrion = useRef<HTMLDivElement>(null)
  const motor = useRef<Runner | null>(null)
  const [filas, setFilas] = useState<Fila[]>([])
  const [corriendo, setCorriendo] = useState(false)
  const [listo, setListo] = useState(false)

  const correr = useCallback(async () => {
    if (!anfitrion.current || corriendo) return
    setCorriendo(true)
    setListo(false)
    setFilas([])

    motor.current?.destroy()
    motor.current = new Runner(anfitrion.current)

    const acumulado: Fila[] = []
    for (const c of ALL_CHALLENGES) {
      let salida: RunOutcome
      try {
        salida = await motor.current.run({ lang: c.lang, code: c.solution, html: c.html, tests: c.tests })
      } catch (e) {
        salida = { passed: false, results: [], logs: [], error: String(e) }
      }
      const fallidas = salida.results.filter((r) => !r.ok)
      acumulado.push({
        id: c.id,
        title: c.title,
        ok: salida.passed,
        detalle: salida.error
          ? `ERROR: ${salida.error}`
          : fallidas.length
            ? fallidas.map((f) => f.msg).join(' | ')
            : 'ok',
      })
      setFilas([...acumulado])
    }

    setCorriendo(false)
    setListo(true)
    const malos = acumulado.filter((f) => !f.ok)
    console.log(`VERIFICACION_FIN ${acumulado.length - malos.length}/${acumulado.length} OK`)
    malos.forEach((m) => console.log(`FALLA ${m.id}: ${m.detalle}`))
  }, [corriendo])

  useEffect(() => {
    void correr()
    return () => {
      motor.current?.destroy()
      motor.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const malos = filas.filter((f) => !f.ok)

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <h1 className="mb-1 text-2xl font-black">Autodiagnóstico del examen</h1>
      <p className="mb-5 text-xs text-[#7f8fb3]">
        Corre la solución de referencia de cada reto contra sus propias pruebas.
      </p>

      <div className="panel mb-5 p-4" id="resumen">
        <p className="text-lg font-bold">
          {corriendo ? '⏳ Corriendo… ' : listo ? '🏁 ' : ''}
          <span className="text-[#4ade80]">{filas.filter((f) => f.ok).length} bien</span>
          {' · '}
          <span className={malos.length ? 'text-[#fb7185]' : 'text-[#5a6b8f]'}>{malos.length} mal</span>
          {' · '}
          <span className="text-[#7f8fb3]">
            {filas.length}/{ALL_CHALLENGES.length}
          </span>
        </p>
        {listo && <p className="mt-1 text-xs text-[#5a6b8f]">ESTADO: {malos.length === 0 ? 'TODO_OK' : 'HAY_FALLAS'}</p>}
      </div>

      <button onClick={() => void correr()} disabled={corriendo} className="boton boton-secundario mb-5">
        Volver a correr
      </button>

      <div ref={anfitrion} className="pointer-events-none fixed left-[-10000px] top-0 h-[420px] w-[680px]" />

      <ul className="space-y-1 text-xs">
        {filas.map((f) => (
          <li
            key={f.id}
            className={`rounded-lg border px-3 py-2 ${
              f.ok ? 'border-[#16324a] bg-[#0b1520] text-[#5a6b8f]' : 'border-[#7f1d3a] bg-[#1c0a13] text-[#ffd7e2]'
            }`}
          >
            <span className="font-bold">{f.ok ? '✔' : '✘'} {f.id}</span> — {f.title}
            {!f.ok && <div className="mt-1 leading-relaxed">{f.detalle}</div>}
          </li>
        ))}
      </ul>
    </main>
  )
}
