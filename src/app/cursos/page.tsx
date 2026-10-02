'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CURSOS, cargarAvanceLocal, minutosDelCurso, totalRetos } from '@/lib/cursos'
import { slugificar } from '@/lib/progress'

export default function Cursos() {
  const [hechos, setHechos] = useState<Record<string, number>>({})

  useEffect(() => {
    let slug = ''
    try {
      slug = slugificar(localStorage.getItem('examen-web:activo') || '')
    } catch {
      /* sin almacenamiento, se ve igual pero sin avance */
    }
    setHechos(Object.fromEntries(CURSOS.map((c) => [c.id, cargarAvanceLocal(c.id, slug).hechos.length])))
  }, [])

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <header className="mb-8">
        <p className="etiqueta mb-2">Cursos</p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Un lenguaje <span className="text-[#4ade80]">nuevo</span>, paso a paso
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9fb0d4]">
          Ya sabes HTML, CSS y JavaScript. Aquí aprendes otro lenguaje desde cero: una explicación corta, cinco retos, y
          a la siguiente lección. Todo se escribe con tus dedos.
        </p>
      </header>

      <ul className="space-y-4">
        {CURSOS.map((c) => {
          const total = totalRetos(c)
          const llevo = hechos[c.id] ?? 0
          return (
            <li key={c.id}>
              <Link href={`/cursos/${c.id}`} className="panel block p-6 transition hover:border-[#2f4067] hover:bg-[#101a2e]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="etiqueta mb-1">
                      {c.lecciones.length} lecciones · {total} retos · unas {Math.round(minutosDelCurso(c) / 60)} horas
                    </p>
                    <h2 className="text-xl font-black text-[#e2e8ff]">
                      {c.emoji} {c.titulo}
                    </h2>
                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#8fa1c6]">{c.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <p className="etiqueta">Retos</p>
                    <p className="text-lg font-bold text-[#4ade80]">
                      {llevo}
                      <span className="text-[#3f5074]">/{total}</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#16233d]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#22d3ee]"
                    style={{ width: `${(llevo / total) * 100}%` }}
                  />
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <footer className="mt-10 text-center text-xs text-[#4b5b80]">
        <Link href="/" className="hover:text-[#7f8fb3]">
          ← Volver a la portada
        </Link>
      </footer>
    </main>
  )
}
