'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { JUEGOS_ARENA, LIBRE } from '@/lib/arena'
import { leerArenaLocal } from '@/components/arena/TallerArena'
import { slugificar } from '@/lib/progress'

export default function Arena() {
  const [nombre, setNombre] = useState('')
  const [avance, setAvance] = useState<Record<string, number>>({})
  const [libre, setLibre] = useState(false)

  useEffect(() => {
    let n = ''
    try {
      n = localStorage.getItem('examen-web:activo') || ''
    } catch {
      /* sin almacenamiento: la portada se ve igual */
    }
    setNombre(n)
    const s = slugificar(n)
    const a: Record<string, number> = {}
    for (const j of JUEGOS_ARENA) a[j.id] = leerArenaLocal(j.id, s)?.hechas?.length ?? 0
    setAvance(a)
    setLibre(Boolean(leerArenaLocal(LIBRE, s)?.codigo))
  }, [])

  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <header className="mb-8 text-center">
        <p className="etiqueta mb-2">Actividad recreativa</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          🕹️ La arena de <span className="text-[#fbbf24]">juegos</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#9fb0d4]">
          Aquí no se juega a lo que hizo otro: <b className="text-[#e2e8ff]">se arma el juego</b>. Parte por parte, con
          JavaScript: escribes un pedazo, le das ▶ Jugar y lo ves funcionando en la pantalla. Al final lo cambias a tu
          gusto y lo publicas para que lo jueguen tus compañeros.
        </p>
        <p className="mt-3 text-xs text-[#7f8fb3]">
          {nombre ? (
            <>
              Jugando como <span className="text-[#e2e8ff]">{nombre}</span>.
            </>
          ) : (
            <>
              Aún no has escrito tu nombre: entra por{' '}
              <Link href="/" className="text-[#4ade80] hover:underline">
                la portada
              </Link>{' '}
              para que se guarde tu juego y lo puedas publicar.
            </>
          )}
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-3">
        {JUEGOS_ARENA.map((j) => {
          const hechas = avance[j.id] ?? 0
          const listo = hechas === j.partes.length
          return (
            <li key={j.id}>
              <Link
                href={`/arena/${j.id}`}
                className="panel flex h-full flex-col p-5 transition hover:-translate-y-1 hover:border-[#2f4067] hover:bg-[#101a2e]"
              >
                <p className="etiqueta">
                  {j.lema} · {j.nivel}
                </p>
                <p className="mt-2 text-4xl">{j.emoji}</p>
                <h2 className="mt-2 text-lg font-black" style={{ color: j.color }}>
                  {j.titulo}
                </h2>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-[#9fb0d4]">{j.descripcion}</p>
                <div className="mt-4">
                  <div className="h-1.5 overflow-hidden rounded-full bg-[#16233d]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(hechas / j.partes.length) * 100}%`, background: j.color }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-[#7f8fb3]">
                    {listo ? '🏆 Terminado' : hechas > 0 ? `Vas en la parte ${hechas + 1} de ${j.partes.length}` : `${j.partes.length} partes`}
                  </p>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Link
          href={`/arena/${LIBRE}`}
          className="panel flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:border-[#2f4067] hover:bg-[#101a2e]"
        >
          <span className="text-4xl">✨</span>
          <div>
            <h2 className="text-base font-black text-[#fbbf24]">Modo libre: inventa el tuyo</h2>
            <p className="mt-1 text-xs leading-relaxed text-[#9fb0d4]">
              {libre
                ? 'Sigue con tu juego.'
                : 'Lienzo en blanco, la base de todo juego y una caja de herramientas. La idea la pones tú.'}
            </p>
          </div>
        </Link>
        <Link
          href="/arena/galeria"
          className="panel flex items-center gap-4 p-5 transition hover:-translate-y-1 hover:border-[#2f4067] hover:bg-[#101a2e]"
        >
          <span className="text-4xl">🏟️</span>
          <div>
            <h2 className="text-base font-black text-[#22d3ee]">La galería del salón</h2>
            <p className="mt-1 text-xs leading-relaxed text-[#9fb0d4]">
              Los juegos que publicaron tus compañeros. Juégalos, mira su código y supera sus récords.
            </p>
          </div>
        </Link>
      </div>

      <section className="panel mt-6 p-5 text-xs leading-relaxed text-[#9fb0d4]">
        <p className="etiqueta mb-2">Cómo funciona</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Cada parte te explica qué vamos a agregar y te muestra el código del juego; las líneas nuevas salen en verde.</li>
          <li>Lo escribes en tu terminal. Como en todo el salón, aquí no se pega: se teclea.</li>
          <li>
            Le das <b className="text-[#e2e8ff]">▶ Jugar</b> y lo pruebas. Cuando funcione, <b className="text-[#e2e8ff]">✔ Comprobar</b>: la
            compu juega tu juego por ti y revisa que haga lo que tiene que hacer.
          </li>
          <li>Al terminar las partes, cámbialo a tu gusto y publícalo en la galería.</li>
        </ol>
        <p className="mt-3">
          ¿Ya terminaste los juegos de recreo?{' '}
          <Link href="/juegos" className="text-[#4ade80] hover:underline">
            Están aquí
          </Link>
          .
        </p>
      </section>
    </main>
  )
}
