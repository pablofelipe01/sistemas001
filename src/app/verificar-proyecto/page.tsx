'use client'

import { useEffect, useRef, useState } from 'react'
import { ProyectoRunner, type ResultadoPrueba } from '@/lib/proyecto-runner'
import { PROYECTO_1, aplicarParches } from '@/lib/proyectos'

/**
 * Autodiagnóstico del proyecto guiado, hermano de /verificar.
 *
 * Resuelve cada misión con la llave de respuestas (los parches) y le corre su
 * propia revisión. Si algo sale en rojo aquí, esa misión quedó imposible de
 * pasar o su revisión no mide lo que promete: hay que arreglarla antes de
 * ponérsela a un niño enfrente.
 */
interface Fila {
  id: string
  titulo: string
  ok: boolean
  fallos: ResultadoPrueba[]
  error?: string
}

export default function VerificarProyecto() {
  const caja = useRef<HTMLDivElement>(null)
  const [filas, setFilas] = useState<Fila[]>([])
  const [corriendo, setCorriendo] = useState(true)
  const [vuelta, setVuelta] = useState(0)

  useEffect(() => {
    let vivo = true
    setFilas([])
    setCorriendo(true)
    if (!caja.current) return
    const runner = new ProyectoRunner(caja.current)

    ;(async () => {
      let codigo = { html: PROYECTO_1.html, css: PROYECTO_1.css, js: PROYECTO_1.js }
      const salida: Fila[] = []

      for (const m of PROYECTO_1.misiones) {
        codigo = aplicarParches(codigo, m.parches)
        const s = await runner.correr({ ...codigo, acciones: m.acciones, pruebas: m.pruebas })
        if (!vivo) return
        salida.push({
          id: m.id,
          titulo: m.titulo,
          ok: s.ok,
          fallos: s.resultados.filter((r) => !r.ok),
          error: s.error,
        })
        setFilas([...salida])
      }
      setCorriendo(false)
    })()

    return () => {
      vivo = false
      runner.destruir()
    }
  }, [vuelta])

  const malas = filas.filter((f) => !f.ok).length

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <p className="etiqueta mb-2">Herramienta del profesor</p>
      <h1 className="text-2xl font-black">Autodiagnóstico del proyecto guiado</h1>
      <p className="mt-2 text-xs leading-relaxed text-[#8fa1c6]">
        Cada misión se resuelve con la llave de respuestas y se le corre su propia revisión. Todo en verde significa
        que las {PROYECTO_1.misiones.length} misiones se pueden pasar de verdad.
      </p>

      <button
        onClick={() => setVuelta((v) => v + 1)}
        disabled={corriendo}
        className="boton boton-secundario mt-4"
      >
        Correr otra vez
      </button>

      <p className="mt-4 text-sm">
        {corriendo ? (
          <span className="text-[#fbbf24]">Corriendo…</span>
        ) : malas === 0 ? (
          <span className="text-[#4ade80]">✓ Las {filas.length} misiones pasan.</span>
        ) : (
          <span className="text-[#fb7185]">✗ {malas} misión(es) con problemas.</span>
        )}
      </p>

      <ul className="mt-5 space-y-2">
        {filas.map((f, i) => (
          <li
            key={f.id}
            className={`rounded-xl border px-4 py-3 text-sm ${
              f.ok ? 'border-[#166534] bg-[#0d2418] text-[#c9f7d8]' : 'border-[#7f1d3a] bg-[#2a0f1c] text-[#ffd7e2]'
            }`}
          >
            <p className="font-bold">
              {f.ok ? '✓' : '✗'} {i + 1}. {f.titulo}
            </p>
            {f.error && <p className="mt-1 text-xs">Error: {f.error}</p>}
            {f.fallos.map((r, k) => (
              <p key={k} className="mt-1 text-xs">
                · {r.msg}
              </p>
            ))}
          </li>
        ))}
      </ul>

      <p className="etiqueta mt-8 mb-2">Aquí se monta cada misión</p>
      <p className="mb-3 text-xs text-[#7f8fb3]">
        La ventanita tiene que estar a la vista: Chrome no le da maquetación a un iframe escondido o fuera de la
        pantalla, y entonces una misión como “centra la tarjeta” no se podría medir.
      </p>
      <div className="pointer-events-none h-[420px] w-full max-w-[640px] overflow-hidden rounded-xl border border-[#1e2b45]">
        <div ref={caja} className="h-full w-full" />
      </div>
    </main>
  )
}
