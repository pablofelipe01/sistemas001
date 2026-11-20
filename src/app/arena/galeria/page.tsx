'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CodigoModelo } from '@/components/CodigoModelo'
import { Aviso } from '@/components/Aviso'
import { JUEGOS_ARENA, juegoPorId } from '@/lib/arena'
import { PantallaDeJuego, explicarError, type ErrorDeJuego } from '@/lib/arena-runner'

interface JuegoPublicado {
  slug: string
  juego: string
  autor: string
  titulo: string
  codigo: string
  publicado_en: string
  jugadas: number
}

function emojiDe(juego: string) {
  return juegoPorId(juego)?.emoji ?? '✨'
}

export default function Galeria() {
  const [juegos, setJuegos] = useState<JuegoPublicado[] | null>(null)
  const [nube, setNube] = useState(true)
  const [elegido, setElegido] = useState<JuegoPublicado | null>(null)
  const [verCodigo, setVerCodigo] = useState(false)
  const [error, setError] = useState<ErrorDeJuego | null>(null)
  const [colgado, setColgado] = useState(false)
  const [aviso, setAviso] = useState<string | null>(null)
  const caja = useRef<HTMLDivElement>(null)
  const pantalla = useRef<PantallaDeJuego | null>(null)

  useEffect(() => {
    fetch('/api/arena/galeria', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setNube(d.nube !== false)
        setJuegos(d.juegos ?? [])
      })
      .catch(() => {
        setNube(false)
        setJuegos([])
      })
  }, [])

  useEffect(() => {
    if (caja.current) pantalla.current = new PantallaDeJuego(caja.current)
    return () => pantalla.current?.detener()
  }, [])

  function jugar(j: JuegoPublicado) {
    setElegido(j)
    setVerCodigo(false)
    setError(null)
    setColgado(false)
    pantalla.current?.jugar(j.codigo, {
      onError: setError,
      onColgado: () => setColgado(true),
    })
    caja.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    fetch('/api/arena/galeria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: j.slug, juego: j.juego }),
    }).catch(() => {})
  }

  const controles = elegido ? juegoPorId(elegido.juego)?.controles : undefined

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <Aviso mensaje={aviso} tono="alerta" onCerrar={() => setAviso(null)} />

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="etiqueta mb-1">La arena de juegos</p>
          <h1 className="text-3xl font-black tracking-tight">
            🏟️ La galería del <span className="text-[#22d3ee]">salón</span>
          </h1>
          <p className="mt-2 max-w-xl text-xs leading-relaxed text-[#9fb0d4]">
            Todos estos juegos los escribió alguien del salón, tecla por tecla. Escoge uno y juégalo.
          </p>
        </div>
        <Link href="/arena" className="boton boton-secundario">
          ← Arena
        </Link>
      </header>

      <section className={`panel mb-6 overflow-hidden ${elegido ? '' : 'hidden'}`}>
        <div className="barra-ventana">
          <span className="text-sm">{elegido && emojiDe(elegido.juego)}</span>
          <span className="ml-1 text-sm font-bold text-[#e2e8ff]">{elegido?.titulo}</span>
          <span className="text-xs text-[#7f8fb3]">· de {elegido?.autor}</span>
          <div className="ml-auto flex gap-2">
            <button onClick={() => elegido && jugar(elegido)} className="boton boton-secundario !px-2 !py-1 text-xs">
              ↻ Otra vez
            </button>
            <button onClick={() => setVerCodigo((v) => !v)} className="boton boton-secundario !px-2 !py-1 text-xs">
              {verCodigo ? '🎮 El juego' : '📄 Ver el código'}
            </button>
          </div>
        </div>
        <div className={verCodigo ? 'hidden' : 'relative mx-auto aspect-[3/2] w-full max-w-3xl bg-[#070b16]'}>
          <div ref={caja} className="absolute inset-0" />
        </div>
        {verCodigo && elegido && (
          <div className="h-[460px]">
            <CodigoModelo
              key={`${elegido.slug}-${elegido.juego}`}
              lang="js"
              codigo={elegido.codigo}
              onIntentoDeCopia={() => setAviso('El código de tus compañeros se lee, no se copia. Si te gusta una idea, escríbela tú.')}
            />
          </div>
        )}
        {(controles || error || colgado) && (
          <div className="border-t border-[#1e2b45] px-4 py-2 text-xs">
            {controles && !verCodigo && <p className="text-[#7f8fb3]">🎮 Parecido a: {controles}</p>}
            {error && <p className="text-[#fb7185]">⚠ Este juego tiene un error: {explicarError(error)}</p>}
            {colgado && <p className="text-[#fb7185]">⚠ Este juego se quedó pensando para siempre y lo paramos.</p>}
          </div>
        )}
      </section>

      {juegos === null ? (
        <p className="text-sm text-[#7f8fb3]">Cargando la galería…</p>
      ) : !nube ? (
        <p className="panel p-5 text-sm text-[#fcd34d]">La galería necesita la nube y ahora no está disponible.</p>
      ) : juegos.length === 0 ? (
        <div className="panel p-6 text-center">
          <p className="text-4xl">🌱</p>
          <p className="mt-2 text-sm text-[#e2e8ff]">Todavía nadie ha publicado un juego.</p>
          <p className="mt-1 text-xs text-[#9fb0d4]">
            ¡Sé el primero!{' '}
            {JUEGOS_ARENA.map((j, i) => (
              <span key={j.id}>
                {i > 0 && ' · '}
                <Link href={`/arena/${j.id}`} className="text-[#4ade80] hover:underline">
                  {j.emoji} {j.titulo}
                </Link>
              </span>
            ))}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {juegos.map((j) => (
            <li key={`${j.slug}-${j.juego}`}>
              <button
                onClick={() => jugar(j)}
                className={`panel flex w-full items-center gap-3 p-4 text-left transition hover:-translate-y-0.5 hover:border-[#2f4067] ${
                  elegido?.slug === j.slug && elegido.juego === j.juego ? 'border-[#4ade80]' : ''
                }`}
              >
                <span className="text-3xl">{emojiDe(j.juego)}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[#e2e8ff]">{j.titulo}</span>
                  <span className="block text-[11px] text-[#7f8fb3]">
                    de {j.autor} · 🎮 {j.jugadas} {j.jugadas === 1 ? 'jugada' : 'jugadas'}
                  </span>
                </span>
                <span className="text-lg text-[#4ade80]">▶</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
