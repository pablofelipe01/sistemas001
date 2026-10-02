'use client'

import { Fragment, useState } from 'react'
import { CURSOS, retosHechos, totalRetos } from '@/lib/cursos'
import type { Curso } from '@/lib/cursos/tipos'

export interface FilaCurso {
  slug: string
  curso: string
  nombre: string
  hechos: string[]
  intentos: Record<string, number>
  pistas: string[]
  teclas: number
  pegados: number
  codigo: Record<string, string>
  actualizado: string
}

/** Con tantos intentos en el mismo reto, vale la pena que el profe se acerque. */
const ATASCADO = 5

/** "Python L3·R2" para la bitácora de eventos. */
export function nombreDeReto(id: string) {
  for (const c of CURSOS) {
    for (const l of c.lecciones) {
      const i = l.retos.findIndex((r) => r.id === id)
      if (i !== -1) return `${c.emoji} L${l.numero}·R${i + 1} ${l.retos[i].titulo}`
      if (l.id === id) return `${c.emoji} Lección ${l.numero}`
    }
  }
  return null
}

/** El reto donde va el alumno: el primero sin resolver, en orden. */
function dondeVa(curso: Curso, f: FilaCurso) {
  for (const l of curso.lecciones) {
    for (const [i, r] of l.retos.entries()) {
      if (!f.hechos.includes(r.id)) return { leccion: l, reto: r, n: i + 1 }
    }
  }
  return null
}

export function TablaCursosProfesor({ filas }: { filas: FilaCurso[] }) {
  return (
    <>
      {CURSOS.map((c) => (
        <TablaDeUnCurso key={c.id} curso={c} filas={filas.filter((f) => f.curso === c.id)} />
      ))}
    </>
  )
}

function TablaDeUnCurso({ curso, filas }: { curso: Curso; filas: FilaCurso[] }) {
  const [abierto, setAbierto] = useState<string | null>(null)
  const total = totalRetos(curso)
  const ordenadas = [...filas].sort((a, b) => b.hechos.length - a.hechos.length)

  // Los retos que más le están costando al salón: intentos que no terminaron en acierto.
  const fallos = new Map<string, number>()
  for (const f of filas) {
    for (const [id, n] of Object.entries(f.intentos ?? {})) {
      fallos.set(id, (fallos.get(id) ?? 0) + n - (f.hechos.includes(id) ? 1 : 0))
    }
  }
  const dificiles = [...fallos.entries()].filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 3)

  return (
    <section className="panel mb-8 p-5">
      <h2 className="mb-1 text-sm font-bold">
        {curso.emoji} Curso: {curso.titulo} <span className="font-normal text-[#7f8fb3]">· {filas.length} alumnos</span>
      </h2>
      <p className="mb-4 text-[11px] text-[#5a6b8f]">
        Retos resueltos en cada lección (de 5). Toca un alumno para ver reto por reto y el código del reto donde va.
      </p>

      {dificiles.length > 0 && (
        <p className="mb-4 rounded-lg border border-[#78350f] bg-[#241a08] px-3 py-2 text-[11px] text-[#fde8c0]">
          Los que más están costando:{' '}
          {dificiles.map(([id, n], i) => (
            <span key={id}>
              {i > 0 && ' · '}
              <b>{nombreDeReto(id)}</b> ({n} intento{n === 1 ? '' : 's'} fallido{n === 1 ? '' : 's'})
            </span>
          ))}
        </p>
      )}

      {filas.length === 0 ? (
        <p className="text-xs text-[#5a6b8f]">Nadie ha empezado este curso todavía.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[#1e2b45] text-[10px] uppercase tracking-wider text-[#5a6b8f]">
              <tr>
                <th className="px-3 py-2">Alumno</th>
                {curso.lecciones.map((l) => (
                  <th key={l.id} className="px-1 py-2 text-center" title={l.titulo}>
                    L{l.numero}
                  </th>
                ))}
                <th className="px-3 py-2">Avance</th>
                <th className="px-3 py-2 text-right">Intentos</th>
                <th className="px-3 py-2 text-right">Pistas</th>
                <th className="px-3 py-2 text-right">Teclas</th>
                <th className="px-3 py-2 text-right">Pegados</th>
                <th className="px-3 py-2">Última vez</th>
              </tr>
            </thead>
            <tbody>
              {ordenadas.map((f) => {
                const va = dondeVa(curso, f)
                const intentosAhi = va ? (f.intentos?.[va.reto.id] ?? 0) : 0
                const intentos = Object.values(f.intentos ?? {}).reduce((s, n) => s + n, 0)
                const pct = Math.round((f.hechos.length / total) * 100)
                return (
                  <Fragment key={f.slug}>
                    <tr
                      onClick={() => setAbierto(abierto === f.slug ? null : f.slug)}
                      className="cursor-pointer border-b border-[#141f36] hover:bg-[#101a2e]"
                    >
                      <td className="px-3 py-2">
                        <span className="font-bold">{f.nombre}</span>
                        {intentosAhi >= ATASCADO && (
                          <span
                            className="ml-2 rounded bg-[#7f1d3a] px-1.5 py-0.5 text-[9px] font-bold text-[#ffd7e2]"
                            title={`${intentosAhi} intentos en el reto donde va`}
                          >
                            atascado
                          </span>
                        )}
                      </td>
                      {curso.lecciones.map((l) => {
                        const n = retosHechos(l, f)
                        const tocada = l.retos.some((r) => f.intentos?.[r.id] || f.codigo?.[r.id])
                        const clase =
                          n === l.retos.length
                            ? 'bg-[#166534] text-[#c9f7d8]'
                            : n > 0 || tocada
                              ? 'bg-[#164e63] text-[#cffafe]'
                              : 'bg-[#141f36] text-[#3f5074]'
                        return (
                          <td key={l.id} className="px-0.5 py-2 text-center">
                            <span className={`inline-block min-w-8 rounded px-1 py-0.5 text-[10px] font-bold tabular-nums ${clase}`}>
                              {n || tocada ? n : '—'}
                            </span>
                          </td>
                        )
                      })}
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#16213a]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs tabular-nums text-[#7f8fb3]">
                            {f.hechos.length}/{total}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums text-[#7f8fb3]">{intentos}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-[#a78bfa]">{f.pistas?.length ?? 0}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-[#fbbf24]">{f.teclas}</td>
                      <td className={`px-3 py-2 text-right tabular-nums ${f.pegados ? 'text-[#fb7185]' : 'text-[#5a6b8f]'}`}>
                        {f.pegados}
                      </td>
                      <td className="px-3 py-2 text-xs text-[#5a6b8f]">{new Date(f.actualizado).toLocaleString('es-CO')}</td>
                    </tr>
                    {abierto === f.slug && (
                      <tr className="border-b border-[#141f36] bg-[#0a1120]">
                        <td colSpan={curso.lecciones.length + 7} className="px-4 py-4">
                          <DetalleCurso curso={curso} fila={f} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
          <p className="mt-3 text-[11px] text-[#4b5b80]">
            Verde: lección terminada · Azul: va en ella · Gris: no ha llegado. “Atascado” sale cuando lleva {ATASCADO} o
            más intentos en el mismo reto.
          </p>
        </div>
      )}
    </section>
  )
}

function DetalleCurso({ curso, fila: f }: { curso: Curso; fila: FilaCurso }) {
  const va = dondeVa(curso, f)
  const codigo = va ? f.codigo?.[va.reto.id] : undefined

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-2">
        {curso.lecciones.map((l) => (
          <div key={l.id} className="flex items-center gap-2">
            <span className="w-40 truncate text-[11px] text-[#7f8fb3]">
              {l.numero}. {l.titulo}
            </span>
            <div className="flex gap-1">
              {l.retos.map((r, i) => {
                const hecho = f.hechos.includes(r.id)
                const intentos = f.intentos?.[r.id] ?? 0
                const pista = f.pistas?.includes(r.id)
                const clase = hecho
                  ? 'bg-[#166534] text-[#c9f7d8]'
                  : intentos > 0
                    ? 'bg-[#3f1d2b] text-[#ffd7e2]'
                    : f.codigo?.[r.id]
                      ? 'bg-[#164e63] text-[#cffafe]'
                      : 'bg-[#141f36] text-[#3f5074]'
                return (
                  <span
                    key={r.id}
                    title={`${r.titulo} — ${hecho ? 'resuelto' : intentos ? 'sin resolver' : 'sin comprobar'}, ${intentos} intento(s)${pista ? ', usó la pista' : ''}`}
                    className={`relative flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold ${clase}`}
                  >
                    {i + 1}
                    {pista && <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[#fbbf24]" />}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
        <p className="pt-1 text-[11px] text-[#4b5b80]">
          Verde: resuelto · Rojo: lo comprobó y no le ha salido · Azul: escribió algo pero no lo ha comprobado · Puntico
          amarillo: abrió la pista.
        </p>
      </div>

      <div>
        {va ? (
          <>
            <p className="etiqueta mb-2">
              Dónde va: L{va.leccion.numero}·R{va.n} — {va.reto.titulo} · {f.intentos?.[va.reto.id] ?? 0} intento(s)
            </p>
            <p className="mb-2 text-[11px] leading-relaxed text-[#7f8fb3]">{va.reto.enunciado}</p>
            <pre className="max-h-72 overflow-auto rounded-lg border border-[#1e2b45] bg-[#060a14] p-3 text-[12px] leading-relaxed text-[#d6e4ff]">
              {codigo?.trim() ? codigo : '(todavía no ha escrito nada en este reto)'}
            </pre>
          </>
        ) : (
          <p className="text-sm text-[#4ade80]">🏆 Terminó el curso completo.</p>
        )}
      </div>
    </div>
  )
}
