'use client'

import { Fragment, useState } from 'react'
import { ALL_CHALLENGES, SECCIONES, TOTAL } from '@/lib/challenges'
import type { Progreso } from '@/lib/progress'

interface FilaAlumno {
  slug: string
  nombre: string
  puntos: number
  indice: number
  resueltos: number
  mejor_racha: number
  progreso: Progreso
  inicio: string | null
  actualizado: string
}

interface Evento {
  id: number
  slug: string
  reto: string | null
  tipo: string
  detalle: string | null
  creado: string
}

const NOMBRE_EVENTO: Record<string, string> = {
  'pegado-bloqueado': '✋ intentó pegar',
  'copia-bloqueada': '📋 intentó copiar el enunciado',
  ayuda: '💡 gastó un comodín',
  salto: '⏭️ saltó un reto',
  resuelto: '✅ resolvió',
  fallo: '✕ falló',
}

export default function Profesor() {
  const [clave, setClave] = useState('')
  const [datos, setDatos] = useState<{ alumnos: FilaAlumno[]; eventos: Evento[]; nube: boolean } | null>(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [abierto, setAbierto] = useState<string | null>(null)

  async function entrar() {
    setCargando(true)
    setError('')
    try {
      const r = await fetch('/api/profesor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave }),
      })
      const d = await r.json()
      if (!r.ok) {
        setError(d.error ?? 'No se pudo entrar.')
        return
      }
      setDatos(d)
      if (d.error) setError(d.error)
    } catch {
      setError('No se pudo hablar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  if (!datos) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <div className="panel p-7">
          <h1 className="mb-1 text-xl font-black">Panel del profesor</h1>
          <p className="mb-5 text-xs leading-relaxed text-[#7f8fb3]">
            Aquí ves cómo va todo el salón: quién va en qué reto, cuántos intentos lleva, qué comodines gastó y en qué
            momento alguien intentó pegar código.
          </p>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && entrar()}
            placeholder="Clave"
            className="mb-3 w-full rounded-xl border border-[#1e2b45] bg-[#0a1120] px-4 py-3 outline-none focus:border-[#4ade80]"
          />
          <button onClick={entrar} disabled={cargando} className="boton boton-primario w-full">
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
          {error && <p className="mt-3 text-sm text-[#fb7185]">{error}</p>}
          <p className="mt-5 text-[11px] leading-relaxed text-[#4b5b80]">
            La clave se configura en la variable de entorno <code className="text-[#7dd3fc]">PROFESOR_CLAVE</code>.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-black">
          Panel del profesor <span className="text-sm font-normal text-[#7f8fb3]">· {datos.alumnos.length} alumnos</span>
        </h1>
        <button onClick={entrar} className="boton boton-secundario">
          Actualizar
        </button>
      </header>

      {error && (
        <p className="mb-5 rounded-lg border border-[#78350f] bg-[#241a08] px-4 py-3 text-sm text-[#fde8c0]">{error}</p>
      )}

      {datos.alumnos.length === 0 ? (
        <p className="panel p-6 text-sm text-[#7f8fb3]">Todavía no ha entrado nadie.</p>
      ) : (
        <div className="panel mb-8 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#1e2b45] text-[10px] uppercase tracking-wider text-[#5a6b8f]">
              <tr>
                <th className="px-4 py-3">Alumno</th>
                <th className="px-4 py-3">Avance</th>
                <th className="px-4 py-3 text-right">Puntos</th>
                <th className="px-4 py-3 text-right">Intentos</th>
                <th className="px-4 py-3 text-right">Comodines</th>
                <th className="px-4 py-3 text-right">Tiempo</th>
                <th className="px-4 py-3">Última vez</th>
              </tr>
            </thead>
            <tbody>
              {datos.alumnos.map((a) => {
                const retos = Object.values(a.progreso?.retos ?? {})
                const intentos = retos.reduce((s, r) => s + r.intentos, 0)
                const gastados =
                  9 -
                  ((a.progreso?.comodines?.html ?? 3) +
                    (a.progreso?.comodines?.css ?? 3) +
                    (a.progreso?.comodines?.js ?? 3))
                const minutos = Math.round(retos.reduce((s, r) => s + r.tiempoMs, 0) / 60000)
                const enReto = ALL_CHALLENGES[Math.min(a.indice, TOTAL - 1)]
                const pct = Math.round((a.resueltos / TOTAL) * 100)

                return (
                  <Fragment key={a.slug}>
                    <tr
                      onClick={() => setAbierto(abierto === a.slug ? null : a.slug)}
                      className="cursor-pointer border-b border-[#141f36] hover:bg-[#101a2e]"
                    >
                      <td className="px-4 py-3 font-bold">{a.nombre}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#16213a]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#7f8fb3]">
                            {a.resueltos}/{TOTAL}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#5a6b8f]">en {enReto?.title ?? '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums text-[#fbbf24]">{a.puntos}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#7f8fb3]">{intentos}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#a78bfa]">{gastados}/9</td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#7f8fb3]">{minutos} min</td>
                      <td className="px-4 py-3 text-xs text-[#5a6b8f]">
                        {new Date(a.actualizado).toLocaleString('es-CO')}
                      </td>
                    </tr>
                    {abierto === a.slug && (
                      <tr className="border-b border-[#141f36] bg-[#0a1120]">
                        <td colSpan={7} className="px-4 py-4">
                          <DetalleAlumno progreso={a.progreso} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <section className="panel p-5">
        <h2 className="mb-3 text-sm font-bold">Últimos movimientos</h2>
        {datos.eventos.length === 0 ? (
          <p className="text-xs text-[#5a6b8f]">Nada todavía.</p>
        ) : (
          <ul className="max-h-96 space-y-1 overflow-auto text-xs">
            {datos.eventos.map((e) => (
              <li key={e.id} className="flex flex-wrap gap-x-3 border-b border-[#141f36] py-1.5 last:border-0">
                <span className="w-36 shrink-0 text-[#5a6b8f]">{new Date(e.creado).toLocaleTimeString('es-CO')}</span>
                <span className="w-32 shrink-0 font-bold text-[#9fb0d4]">{e.slug}</span>
                <span
                  className={
                    e.tipo.includes('bloquead') ? 'text-[#fb7185]' : e.tipo === 'resuelto' ? 'text-[#4ade80]' : 'text-[#7f8fb3]'
                  }
                >
                  {NOMBRE_EVENTO[e.tipo] ?? e.tipo}
                </span>
                <span className="text-[#4b5b80]">{e.reto}</span>
                {e.detalle && <span className="text-[#3f5074]">· {e.detalle}</span>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

function DetalleAlumno({ progreso }: { progreso: Progreso }) {
  if (!progreso?.retos) return <p className="text-xs text-[#5a6b8f]">Sin datos.</p>

  return (
    <div className="space-y-4">
      {SECCIONES.map((s) => {
        const retos = ALL_CHALLENGES.filter((c) => c.lang === s.lang)
        return (
          <div key={s.lang}>
            <p className="etiqueta mb-1.5">
              {s.emoji} {s.nombre} · quedan {progreso.comodines?.[s.lang] ?? 3} comodines
            </p>
            <div className="flex flex-wrap gap-1">
              {retos.map((c) => {
                const e = progreso.retos[c.id]
                const clase = e?.resuelto
                  ? 'bg-[#166534] text-[#c9f7d8]'
                  : e?.saltado
                    ? 'bg-[#78350f] text-[#fde8c0]'
                    : e
                      ? 'bg-[#3f1d2b] text-[#ffd7e2]'
                      : 'bg-[#141f36] text-[#3f5074]'
                return (
                  <span
                    key={c.id}
                    title={`${c.n}. ${c.title}${e ? ` — ${e.intentos} intento(s), ${e.teclas} teclas` : ' — sin empezar'}`}
                    className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold ${clase}`}
                  >
                    {c.n}
                  </span>
                )
              })}
            </div>
          </div>
        )
      })}
      <p className="text-[11px] text-[#4b5b80]">
        Verde: resuelto · Naranja: saltado · Rojo: lo intentó y no le salió · Gris: no ha llegado. Pasa el mouse por
        encima para ver intentos y cuántas teclas escribió.
      </p>
    </div>
  )
}
