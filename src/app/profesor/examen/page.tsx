'use client'

import { Fragment, useEffect, useState } from 'react'
import { correrCon, motorDe } from '@/lib/cursos/motor'
import { EXAMEN_PYTHON } from '@/lib/examen/python-basico'
import { contestada, puntuar, type Puntaje } from '@/lib/examen/puntuar'
import { PUNTOS_POR_PREGUNTA, type Presentacion } from '@/lib/examen/tipos'

const EXAMEN = EXAMEN_PYTHON
const PREGUNTAS = EXAMEN.preguntas
const MAXIMO = PREGUNTAS.length * PUNTOS_POR_PREGUNTA
const CIERRE = Date.parse(EXAMEN.cierre)

type Notas = Record<string, Puntaje[]>

function totalPistas(p: Presentacion) {
  return Object.values(p.pistas ?? {}).reduce((s, n) => s + n, 0)
}

function duracion(ms: number) {
  const m = Math.max(0, Math.round(ms / 60000))
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`
}

function hora(iso: string) {
  return new Date(iso).toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Bogota' })
}

/** Nota en la escala del colegio: de 0 a 5, con un decimal. */
function nota(puntos: number) {
  return ((puntos / MAXIMO) * 5).toFixed(1)
}

/**
 * Las presentaciones del examen. La calificación se hace aquí, en el navegador
 * del profesor, con el mismo Python del curso: así sirve también para los que
 * no alcanzaron a darle Terminar (el examen se cerró solo) y, si se arregla una
 * pregunta, basta con recargar.
 */
export default function ExamenProfesor() {
  const [clave, setClave] = useState('')
  const [lista, setLista] = useState<Presentacion[] | null>(null)
  const [ahora, setAhora] = useState(0)
  const [notas, setNotas] = useState<Notas>({})
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [abierto, setAbierto] = useState<string | null>(null)

  useEffect(() => {
    void motorDe('python').arrancar().catch(() => {})
  }, [])

  async function entrar() {
    setCargando(true)
    setError('')
    try {
      const r = await fetch('/api/examen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'profesor', clave }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error ?? 'No se pudo entrar.')
      if (d.nube === false) throw new Error('Supabase no está configurado: no hay exámenes guardados en la nube.')
      const ps = (d.presentaciones as Presentacion[]).filter((p) => p.examen === EXAMEN.id)
      setLista(ps)
      setAhora(Date.parse(d.ahora))
      void calificarTodos(ps)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo hablar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  async function calificarTodos(ps: Presentacion[]) {
    const correr = correrCon('python')
    for (const p of ps) {
      const puntajes: Puntaje[] = []
      for (const q of PREGUNTAS) puntajes.push(await puntuar(q, p.respuestas[q.id], correr, p.pistas?.[q.id] ?? 0))
      setNotas((n) => ({ ...n, [p.slug]: puntajes }))
    }
  }

  async function reabrir(p: Presentacion) {
    const ok = window.confirm(
      `¿Borrar el examen de ${p.nombre} para que lo pueda presentar otra vez desde cero? Se pierden sus respuestas.`,
    )
    if (!ok) return
    const r = await fetch('/api/examen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accion: 'reabrir', clave, slug: p.slug, examen: p.examen }),
    })
    if (r.ok) setLista((l) => l?.filter((x) => x.slug !== p.slug) ?? null)
    else setError('No se pudo reabrir.')
  }

  function descargar() {
    if (!lista) return
    const enc = ['Nombre', 'Estado', 'Inicio', 'Minutos', 'Puntos', `Sobre ${MAXIMO}`, 'Nota (0-5)', 'Pistas', 'Salidas', 'Segundos fuera', 'Pegados', 'Capturas', ...PREGUNTAS.map((_, i) => `P${i + 1}`)]
    const filas = lista.map((p) => {
      const ns = notas[p.slug] ?? []
      const total = ns.reduce((s, x) => s + x.puntos, 0)
      const fin = p.fin ? Date.parse(p.fin) : Math.min(ahora, CIERRE)
      return [p.nombre, estado(p), hora(p.inicio), Math.round((fin - Date.parse(p.inicio)) / 60000), total, MAXIMO, nota(total), totalPistas(p), p.salidas, p.segundos_fuera, p.pegados, p.capturas, ...ns.map((x) => x.puntos)]
    })
    const csv = [enc, ...filas].map((f) => f.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }))
    a.download = `examen-python-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
  }

  function estado(p: Presentacion) {
    if (p.terminado_por === 'alumno') return 'Terminó'
    if (p.terminado_por === 'cierre' || ahora >= CIERRE) return 'Se cerró a la hora'
    return 'Presentando'
  }

  if (!lista) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <div className="panel p-7">
          <h1 className="mb-1 text-xl font-black">
            {EXAMEN.emoji} {EXAMEN.titulo}
          </h1>
          <p className="mb-5 text-xs leading-relaxed text-[#7f8fb3]">Panel del profesor: quién lo presentó, sus puntos y sus respuestas.</p>
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
        </div>
      </main>
    )
  }

  const calificados = lista.filter((p) => notas[p.slug]).length

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <header className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-black">
          {EXAMEN.emoji} {EXAMEN.titulo}{' '}
          <span className="text-sm font-normal text-[#7f8fb3]">· {lista.length} alumnos · cierra {EXAMEN.cierreTexto}</span>
        </h1>
        <div className="flex gap-2">
          <button onClick={entrar} className="boton boton-secundario">
            ↻ Actualizar
          </button>
          <button onClick={descargar} disabled={calificados < lista.length} className="boton boton-primario disabled:opacity-40">
            ⬇ Descargar CSV
          </button>
        </div>
      </header>
      {calificados < lista.length && (
        <p className="mb-3 animate-pulse text-xs text-[#fbbf24]">
          Calificando con Python… {calificados} de {lista.length}
        </p>
      )}
      {error && <p className="mb-3 text-sm text-[#fb7185]">{error}</p>}
      <p className="mb-4 text-xs leading-relaxed text-[#7f8fb3]">
        Cada pregunta vale de 0 a {PUNTOS_POR_PREGUNTA}. En las de código, los puntos salen de la parte de las pruebas que
        pasa, menos lo que costaron las pistas (la primera 1 punto, la segunda 2 más); en la selección múltiple, algunas
        respuestas a medio camino dan algo. La nota es los puntos llevados a la
        escala de 0 a 5. <b>Salidas</b> son las veces que se fue de la página del examen (a Teams, a YouTube o a otra
        parte): mírelo junto con el tiempo fuera.
      </p>

      <div className="panel overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="text-[#7f8fb3]">
            <tr className="border-b border-[#1e2b45]">
              <th className="p-2.5">Alumno</th>
              <th className="p-2.5">Estado</th>
              <th className="p-2.5">Inicio</th>
              <th className="p-2.5">Tiempo</th>
              <th className="p-2.5">Contestó</th>
              <th className="p-2.5">Puntos</th>
              <th className="p-2.5">Nota</th>
              <th className="p-2.5">Pistas</th>
              <th className="p-2.5">Salidas</th>
              <th className="p-2.5">Pegados</th>
              <th className="p-2.5">Capturas</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((p) => {
              const ns = notas[p.slug]
              const total = ns?.reduce((s, x) => s + x.puntos, 0)
              const fin = p.fin ? Date.parse(p.fin) : Math.min(ahora, CIERRE)
              const hechas = PREGUNTAS.filter((q) => contestada(q, p.respuestas[q.id])).length
              const fuera = p.salidas > 5 || p.segundos_fuera > 120
              return (
                <Fragment key={p.slug}>
                  <tr
                    onClick={() => setAbierto(abierto === p.slug ? null : p.slug)}
                    className="cursor-pointer border-b border-[#1e2b45] hover:bg-[#101a2e]"
                  >
                    <td className="p-2.5 font-bold text-[#e2e8ff]">{p.nombre}</td>
                    <td className="p-2.5">{estado(p)}</td>
                    <td className="p-2.5">{hora(p.inicio)}</td>
                    <td className="p-2.5">{duracion(fin - Date.parse(p.inicio))}</td>
                    <td className="p-2.5">
                      {hechas}/{PREGUNTAS.length}
                    </td>
                    <td className="p-2.5">{total === undefined ? '…' : `${total}/${MAXIMO}`}</td>
                    <td className="p-2.5 text-sm font-black text-[#86efac]">{total === undefined ? '…' : nota(total)}</td>
                    <td className="p-2.5">{totalPistas(p)}</td>
                    <td className={`p-2.5 ${fuera ? 'font-bold text-[#fbbf24]' : ''}`}>
                      {p.salidas} · {duracion(p.segundos_fuera * 1000)}
                    </td>
                    <td className={`p-2.5 ${p.pegados ? 'font-bold text-[#fb7185]' : ''}`}>{p.pegados}</td>
                    <td className={`p-2.5 ${p.capturas ? 'font-bold text-[#fb7185]' : ''}`}>{p.capturas}</td>
                  </tr>
                  {abierto === p.slug && (
                    <tr>
                      <td colSpan={11} className="bg-[#0a1120] p-4">
                        <Detalle p={p} puntajes={ns} />
                        <button onClick={() => void reabrir(p)} className="boton boton-secundario mt-4">
                          ♻ Dar otra oportunidad (borra este intento)
                        </button>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
        {lista.length === 0 && <p className="p-5 text-sm text-[#7f8fb3]">Nadie ha empezado el examen todavía.</p>}
      </div>
    </main>
  )
}

function Detalle({ p, puntajes }: { p: Presentacion; puntajes: Puntaje[] | undefined }) {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {PREGUNTAS.map((q, i) => {
        const r = p.respuestas[q.id]
        const pts = puntajes?.[i]
        let respuesta: string
        if (!contestada(q, r)) respuesta = '(sin contestar)'
        else if (q.tipo === 'opcion') respuesta = q.opciones[r as number]?.texto ?? '?'
        else if (q.tipo === 'vf') respuesta = r ? 'Verdadero' : 'Falso'
        else respuesta = String(r)
        return (
          <li key={q.id} className="rounded-lg border border-[#1e2b45] p-3">
            <p className="mb-1 flex justify-between gap-2 font-bold text-[#e2e8ff]">
              <span>
                {i + 1}. {q.titulo}
              </span>
              <span className={pts?.puntos === PUNTOS_POR_PREGUNTA ? 'text-[#86efac]' : pts?.puntos ? 'text-[#fbbf24]' : 'text-[#fb7185]'}>
                {pts ? `${pts.puntos}/${PUNTOS_POR_PREGUNTA}` : '…'}
              </span>
            </p>
            {pts?.descuento ? (
              <p className="mb-1 text-[10px] font-bold text-[#fbbf24]">
                💡 Abrió {p.pistas?.[q.id]} {p.pistas?.[q.id] === 1 ? 'pista' : 'pistas'}: −{pts.descuento}
              </p>
            ) : null}
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap font-mono text-[11px] text-[#d6e4ff]">{respuesta}</pre>
            {pts?.pruebas && (
              <ul className="mt-1.5 space-y-0.5">
                {pts.pruebas.map((x, k) => (
                  <li key={k} className={`text-[10px] ${x.ok ? 'text-[#86efac]' : 'text-[#fb7185]'}`}>
                    {x.ok ? '✓' : '✗'} {x.msg}
                  </li>
                ))}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )
}
