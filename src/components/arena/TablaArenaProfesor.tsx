'use client'

import { useState } from 'react'
import { Plegable } from '@/components/Plegable'
import { JUEGOS_ARENA, LIBRE } from '@/lib/arena'

export interface FilaArena {
  slug: string
  juego: string
  nombre: string
  hechas: string[]
  teclas: number
  pegados: number
  titulo: string | null
  publicado_en: string | null
  oculto: boolean
  jugadas: number
  actualizado: string
}

/**
 * La arena de juegos en el panel del profesor: un renglón por alumno, una
 * columna por juego guiado (partes hechas) y el libre, más los juegos que
 * publicaron. Desde aquí se saca un juego de la galería (no se borra nada).
 */
export function TablaArenaProfesor({ filas, clave }: { filas: FilaArena[]; clave: string }) {
  const [ocultos, setOcultos] = useState<Record<string, boolean>>({})
  const [error, setError] = useState('')

  const porAlumno = new Map<string, { nombre: string; ultimo: string; juegos: Record<string, FilaArena> }>()
  for (const a of filas) {
    const f = porAlumno.get(a.slug) ?? { nombre: a.nombre, ultimo: a.actualizado, juegos: {} }
    f.juegos[a.juego] = a
    if (a.actualizado > f.ultimo) f.ultimo = a.actualizado
    porAlumno.set(a.slug, f)
  }
  const partesHechas = (f: { juegos: Record<string, FilaArena> }) =>
    Object.values(f.juegos).reduce((n, j) => n + (j.hechas?.length ?? 0), 0)
  const alumnos = [...porAlumno.entries()].sort((a, b) => partesHechas(b[1]) - partesHechas(a[1]))
  const publicados = filas
    .filter((f) => f.publicado_en)
    .sort((a, b) => (b.publicado_en ?? '').localeCompare(a.publicado_en ?? ''))

  const llave = (f: FilaArena) => `${f.slug}|${f.juego}`
  const estaOculto = (f: FilaArena) => ocultos[llave(f)] ?? f.oculto

  async function cambiar(f: FilaArena) {
    const oculto = !estaOculto(f)
    setError('')
    try {
      const r = await fetch('/api/profesor/arena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave, slug: f.slug, juego: f.juego, oculto }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'No se pudo cambiar.')
      setOcultos((o) => ({ ...o, [llave(f)]: oculto }))
    } catch (e) {
      setError((e as Error).message)
    }
  }

  return (
    <Plegable id="arena" titulo="🕹️ Arena de juegos" resumen={`· ${alumnos.length} alumnos · ${publicados.length} publicados`}>
      <p className="mb-4 text-[11px] text-[#5a6b8f]">
        Partes hechas en cada juego guiado; ✨ es el modo libre. Pasa el mouse por encima para ver teclas y pegados
        bloqueados.
      </p>
      {alumnos.length === 0 ? (
        <p className="text-xs text-[#5a6b8f]">Nadie ha entrado a la arena todavía.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#1e2b45] text-[10px] uppercase tracking-wider text-[#5a6b8f]">
              <tr>
                <th className="px-3 py-2">Alumno</th>
                {JUEGOS_ARENA.map((j) => (
                  <th key={j.id} className="px-2 py-2 text-center" title={j.titulo}>
                    {j.emoji}
                  </th>
                ))}
                <th className="px-2 py-2 text-center" title="Modo libre">
                  ✨
                </th>
                <th className="px-3 py-2 text-right">Teclas</th>
                <th className="px-3 py-2 text-right">Pegados</th>
                <th className="px-3 py-2">Última vez</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map(([slug, f]) => {
                const lista = Object.values(f.juegos)
                const teclas = lista.reduce((n, j) => n + (j.teclas ?? 0), 0)
                const pegados = lista.reduce((n, j) => n + (j.pegados ?? 0), 0)
                const libre = f.juegos[LIBRE]
                return (
                  <tr key={slug} className="border-b border-[#141f36]">
                    <td className="px-3 py-2 font-bold">{f.nombre}</td>
                    {JUEGOS_ARENA.map((j) => {
                      const a = f.juegos[j.id]
                      const hechas = a?.hechas?.length ?? 0
                      const total = j.partes.length
                      const clase = !a
                        ? 'bg-[#141f36] text-[#3f5074]'
                        : hechas === total
                          ? 'bg-[#166534] text-[#c9f7d8]'
                          : hechas > 0
                            ? 'bg-[#164e63] text-[#cffafe]'
                            : 'bg-[#3f1d2b] text-[#ffd7e2]'
                      return (
                        <td key={j.id} className="px-1 py-2 text-center">
                          <span
                            title={`${j.titulo}${a ? ` — ${hechas}/${total} partes, ${a.teclas} teclas, ${a.pegados} pegado(s) bloqueado(s)` : ' — sin empezar'}`}
                            className={`inline-block min-w-11 rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${clase}`}
                          >
                            {a ? `${hechas}/${total}` : '—'}
                          </span>
                        </td>
                      )
                    })}
                    <td className="px-1 py-2 text-center">
                      <span
                        title={libre ? `Modo libre — ${libre.teclas} teclas` : 'No lo ha abierto'}
                        className={`inline-block min-w-11 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                          libre ? 'bg-[#3f3410] text-[#fcd34d]' : 'bg-[#141f36] text-[#3f5074]'
                        }`}
                      >
                        {libre ? (libre.publicado_en ? '🚀' : '✎') : '—'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-[#fbbf24]">{teclas}</td>
                    <td className={`px-3 py-2 text-right tabular-nums ${pegados ? 'text-[#fb7185]' : 'text-[#5a6b8f]'}`}>
                      {pegados}
                    </td>
                    <td className="px-3 py-2 text-xs text-[#5a6b8f]">{new Date(f.ultimo).toLocaleString('es-CO')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <h3 className="mb-2 mt-6 text-xs font-bold uppercase tracking-wider text-[#7f8fb3]">En la galería</h3>
      {error && <p className="mb-2 text-xs text-[#fb7185]">{error}</p>}
      {publicados.length === 0 ? (
        <p className="text-xs text-[#5a6b8f]">Nadie ha publicado todavía.</p>
      ) : (
        <ul className="space-y-1">
          {publicados.map((f) => {
            const j = JUEGOS_ARENA.find((x) => x.id === f.juego)
            const oculto = estaOculto(f)
            return (
              <li key={llave(f)} className={`flex flex-wrap items-center gap-3 text-xs ${oculto ? 'opacity-50' : ''}`}>
                <span>{j?.emoji ?? '✨'}</span>
                <span className="font-bold text-[#e2e8ff]">{f.titulo}</span>
                <span className="text-[#7f8fb3]">
                  de {f.nombre} · 🎮 {f.jugadas} · {new Date(f.publicado_en!).toLocaleString('es-CO')}
                </span>
                <button onClick={() => cambiar(f)} className="ml-auto text-[11px] text-[#fb7185] hover:underline">
                  {oculto ? '👁 Volver a mostrar' : '🙈 Sacar de la galería'}
                </button>
              </li>
            )
          })}
        </ul>
      )}
      <p className="mt-3 text-[11px] text-[#4b5b80]">
        La galería es pública: ahí solo sale el nombre corto (&quot;Emily O.&quot;). Sacar un juego no lo borra; el alumno lo
        sigue teniendo y se puede volver a mostrar.
      </p>
    </Plegable>
  )
}
