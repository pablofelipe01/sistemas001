'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/*
 * Los informes del mes (PDF y Word) para descargar. Los archivos están en un
 * bucket privado de Supabase: aquí no hay ni un nombre de alumno escrito.
 */

/** Por aquí le pasa la clave el panel del profesor, para no escribirla otra vez. */
const LLAVE_CLAVE = 'profesor:clave-informes'

interface Informe {
  carpeta: string
  nombre: string
  tamano: number
  subido: string
  url: string
}

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
function fechaDe(carpeta: string) {
  const m = carpeta.match(/^(\d{4})-(\d{2})-(\d{2})/)
  return m ? `${+m[3]} de ${MESES[+m[2] - 1]} de ${m[1]}` : carpeta
}
const peso = (b: number) => (b > 1e6 ? `${(b / 1e6).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`)

export default function Informes() {
  const [clave, setClave] = useState('')
  const [informes, setInformes] = useState<Informe[] | null>(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    try {
      const c = sessionStorage.getItem(LLAVE_CLAVE)
      if (c) {
        sessionStorage.removeItem(LLAVE_CLAVE)
        setClave(c)
        void entrar(c)
      }
    } catch {
      /* sin almacenamiento: se escribe la clave */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function entrar(c = clave) {
    setCargando(true)
    setError('')
    try {
      const r = await fetch('/api/profesor/informes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clave: c }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error ?? 'No se pudo entrar.')
      setInformes(d.informes)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo hablar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  if (!informes) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <div className="panel p-7">
          <h1 className="mb-1 text-xl font-black">📁 Informes del profesor</h1>
          <p className="mb-5 text-xs leading-relaxed text-[#7f8fb3]">Los informes del mes en PDF y Word, para descargar y compartir.</p>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && entrar()}
            placeholder="Clave"
            className="mb-3 w-full rounded-xl border border-[#1e2b45] bg-[#0a1120] px-4 py-3 outline-none focus:border-[#4ade80]"
          />
          <button onClick={() => entrar()} disabled={cargando} className="boton boton-primario w-full">
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
          {error && <p className="mt-3 text-sm text-[#fb7185]">{error}</p>}
        </div>
      </main>
    )
  }

  const carpetas = [...new Set(informes.map((i) => i.carpeta))]

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-black">📁 Informes del profesor</h1>
        <div className="flex gap-2">
          <Link href="/profesor" className="boton boton-secundario">
            ← Panel del profesor
          </Link>
          <button onClick={() => entrar()} disabled={cargando} className="boton boton-secundario disabled:opacity-70">
            {cargando ? 'Actualizando…' : '↻ Actualizar'}
          </button>
        </div>
      </header>

      {carpetas.length === 0 && <p className="text-sm text-[#7f8fb3]">Todavía no hay informes subidos.</p>}

      {carpetas.map((c) => (
        <section key={c} className="panel mb-4 p-5">
          <h2 className="mb-3 text-sm font-bold text-[#9fb0d4]">Informe del {fechaDe(c)}</h2>
          <ul className="space-y-2">
            {informes
              .filter((i) => i.carpeta === c)
              .map((i) => (
                <li key={i.nombre} className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm">
                    {i.nombre.endsWith('.pdf') ? '📕' : '📘'} {i.nombre}{' '}
                    <span className="text-xs text-[#5a6b8f]">· {peso(i.tamano)}</span>
                  </span>
                  <a href={i.url} className="boton boton-primario text-xs">
                    ⬇ Descargar {i.nombre.endsWith('.pdf') ? 'PDF' : 'Word'}
                  </a>
                </li>
              ))}
          </ul>
        </section>
      ))}

      <p className="mt-6 text-[11px] leading-relaxed text-[#4b5b80]">
        Tienen nombres y notas de los alumnos: compártelos solo con quien corresponda. Los enlaces vencen a los 10
        minutos; si uno ya no sirve, dale Actualizar.
      </p>
    </main>
  )
}
