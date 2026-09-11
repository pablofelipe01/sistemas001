'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PROYECTOS } from '@/lib/proyectos'
import { llaveDeProyecto } from '@/components/TallerProyecto'
import { slugificar } from '@/lib/progress'

/** Lo poquito que el índice necesita saber de cada proyecto guardado. */
interface Avance {
  hechas: number
  teclas: number
}

export default function IndiceDeProyectos() {
  const [nombre, setNombre] = useState('')
  const [avances, setAvances] = useState<Record<string, Avance>>({})

  useEffect(() => {
    const guardado = localStorage.getItem('examen-web:activo') || ''
    setNombre(guardado)
    const slug = slugificar(guardado)
    const leidos: Record<string, Avance> = {}
    for (const p of PROYECTOS) {
      try {
        const crudo = localStorage.getItem(llaveDeProyecto(p.id, slug))
        if (!crudo) continue
        const g = JSON.parse(crudo)
        leidos[p.id] = { hechas: (g.hechas || []).length, teclas: g.teclas || 0 }
      } catch {
        /* almacenamiento bloqueado: el índice se ve igual, solo que sin avances */
      }
    }
    setAvances(leidos)
  }, [])

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <header className="mb-8">
        <p className="etiqueta mb-2">Proyectos guiados</p>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Se ve, <span className="text-[#22d3ee]">se escribe</span>, se cambia
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#9fb0d4]">
          Cada proyecto te muestra el código terminado y el resultado funcionando. Tú lo vuelves a escribir en tu
          terminal —no se puede copiar ni pegar nada— y después le haces una lista de cambios. Cuando termines,
          entendiste cada línea, porque cada línea pasó por tus dedos.
        </p>
        {nombre ? (
          <p className="mt-3 text-xs text-[#7f8fb3]">
            Trabajando como <span className="text-[#e2e8ff]">{nombre}</span>.
          </p>
        ) : (
          <p className="mt-3 text-xs text-[#7f8fb3]">
            Aún no has escrito tu nombre: entra por{' '}
            <Link href="/" className="text-[#4ade80] hover:underline">
              la portada
            </Link>{' '}
            para que se guarde tu avance.
          </p>
        )}
      </header>

      <ul className="space-y-4">
        {PROYECTOS.map((p) => {
          const avance = avances[p.id]
          const hechas = avance?.hechas ?? 0
          const total = p.misiones.length
          const terminado = hechas === total
          return (
            <li key={p.id}>
              <Link
                href={`/proyecto/${p.id}`}
                className="panel block p-5 transition hover:border-[#2f4067] hover:bg-[#101a2e]"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="etiqueta mb-1">
                      Proyecto {p.numero} · {p.nivel}
                    </p>
                    <h2 className="text-lg font-bold text-[#e2e8ff]">
                      {terminado ? '🏆 ' : ''}
                      {p.titulo}
                    </h2>
                    <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#8fa1c6]">{p.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <p className="etiqueta">Misiones</p>
                    <p className="text-lg font-bold text-[#4ade80]">
                      {hechas}
                      <span className="text-[#3f5074]">/{total}</span>
                    </p>
                    {avance?.teclas ? <p className="mt-1 text-[10px] text-[#fbbf24]">{avance.teclas} teclas</p> : null}
                  </div>
                </div>
                <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#16233d]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#22d3ee] transition-all"
                    style={{ width: `${(hechas / total) * 100}%` }}
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
