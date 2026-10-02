'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useAvanceCurso } from './useAvanceCurso'
import { leccionAbierta, leccionActual, minutosDelCurso, retosHechos, totalRetos } from '@/lib/cursos'
import { motorPython } from '@/lib/cursos/motor-python'
import type { Curso } from '@/lib/cursos/tipos'

/** La lista de lecciones del curso: cuáles van hechas, cuál sigue y cuáles están cerradas. */
export function MapaDelCurso({ curso }: { curso: Curso }) {
  const { nombre, avance, cargado } = useAvanceCurso(curso.id)
  const actual = leccionActual(curso, avance)
  const total = totalRetos(curso)
  const horas = Math.round(minutosDelCurso(curso) / 60)

  // Python pesa: se empieza a cargar desde aquí, mientras el alumno escoge lección.
  useEffect(() => {
    void motorPython().arrancar().catch(() => {})
  }, [])

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <header className="mb-8">
        <p className="etiqueta mb-2">
          Curso · {curso.lecciones.length} lecciones · unas {horas} horas
        </p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          {curso.emoji} <span className="text-[#4ade80]">{curso.titulo}</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9fb0d4]">{curso.descripcion}</p>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#7f8fb3]">
          Cada lección empieza con una explicación corta y sigue con cinco retos. Escribes el código, lo corres, ves lo
          que sale y cuando estés listo lo compruebas. Igual que en el examen: aquí no se copia ni se pega.
        </p>
        {nombre ? (
          <p className="mt-3 text-xs text-[#7f8fb3]">
            Trabajando como <span className="text-[#e2e8ff]">{nombre}</span> ·{' '}
            <span className="text-[#4ade80]">
              {avance.hechos.length}/{total}
            </span>{' '}
            retos
          </p>
        ) : (
          <p className="mt-3 text-xs text-[#7f8fb3]">
            Aún no has escrito tu nombre: entra por{' '}
            <Link href="/" className="text-[#4ade80] hover:underline">
              la portada
            </Link>{' '}
            para que se guarde tu avance y el profe lo pueda ver.
          </p>
        )}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#16233d]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#22d3ee] transition-all"
            style={{ width: `${(avance.hechos.length / total) * 100}%` }}
          />
        </div>
      </header>

      <ol className="space-y-3">
        {curso.lecciones.map((l, i) => {
          const hechos = retosHechos(l, avance)
          const abierta = cargado && leccionAbierta(curso, i, avance)
          const terminada = hechos === l.retos.length
          const esLaActual = cargado && i === actual && !terminada
          const contenido = (
            <div className="flex items-center gap-4">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl ${
                  terminada ? 'bg-[#166534]' : esLaActual ? 'bg-[#164e63]' : 'bg-[#141f36]'
                }`}
              >
                {abierta ? l.emoji : '🔒'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="etiqueta">
                  Lección {l.numero} · {l.minutos} min
                </p>
                <h2 className="truncate text-base font-bold text-[#e2e8ff]">{l.titulo}</h2>
              </div>
              <div className="flex gap-1">
                {l.retos.map((r) => (
                  <span
                    key={r.id}
                    className={`h-2.5 w-2.5 rounded-full ${avance.hechos.includes(r.id) ? 'bg-[#4ade80]' : 'bg-[#1e2b45]'}`}
                  />
                ))}
              </div>
              {esLaActual && <span className="hidden text-xs font-bold text-[#22d3ee] sm:block">Sigue ▶</span>}
              {terminada && <span className="hidden text-xs text-[#4ade80] sm:block">✓</span>}
            </div>
          )
          return (
            <li key={l.id}>
              {abierta ? (
                <Link
                  href={`/cursos/${curso.id}/${l.id}`}
                  className={`panel block p-4 transition hover:border-[#2f4067] hover:bg-[#101a2e] ${
                    esLaActual ? 'border-[#22d3ee]' : ''
                  }`}
                >
                  {contenido}
                </Link>
              ) : (
                <div className="panel p-4 opacity-50" title="Se abre al terminar la lección anterior">
                  {contenido}
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <footer className="mt-10 flex justify-center gap-6 text-xs text-[#4b5b80]">
        <Link href="/cursos" className="hover:text-[#7f8fb3]">
          ← Todos los cursos
        </Link>
        <Link href="/" className="hover:text-[#7f8fb3]">
          Portada
        </Link>
      </footer>
    </main>
  )
}
