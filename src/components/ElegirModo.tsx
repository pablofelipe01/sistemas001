'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export type Modo = 'compu' | 'dos'

export interface Configuracion {
  modo: Modo
  /** [jugador 1, jugador 2 o "la compu"] */
  nombres: [string, string]
}

/** La portada de cada juego: cómo se juega y contra quién. */
export function ElegirModo({
  emoji,
  titulo,
  reglas,
  textoCompu,
  textoDos,
  onEmpezar,
}: {
  emoji: string
  titulo: string
  reglas: string[]
  textoCompu: string
  textoDos: string
  onEmpezar: (c: Configuracion) => void
}) {
  const [modo, setModo] = useState<Modo>('compu')
  const [uno, setUno] = useState('')
  const [dos, setDos] = useState('')

  useEffect(() => {
    try {
      setUno(localStorage.getItem('examen-web:activo') || '')
    } catch {
      /* sin almacenamiento: que escriban el nombre */
    }
  }, [])

  function empezar() {
    const a = uno.trim() || 'Jugador 1'
    const b = modo === 'compu' ? 'La compu' : dos.trim() || 'Jugador 2'
    onEmpezar({ modo, nombres: [a, b] })
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-5 py-10">
      <div className="panel aparecer p-6 sm:p-8">
        <p className="etiqueta mb-2">Recreo · juego</p>
        <h1 className="mb-4 text-3xl font-black tracking-tight">
          <span className="mr-2">{emoji}</span>
          <span className="text-[#22d3ee]">{titulo}</span>
        </h1>
        <ul className="mb-6 space-y-1.5 text-xs leading-relaxed text-[#9fb0d4]">
          {reglas.map((r) => (
            <li key={r}>· {r}</li>
          ))}
        </ul>

        <p className="etiqueta mb-2">¿Contra quién?</p>
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          {(
            [
              ['compu', '🤖 Contra la compu', textoCompu],
              ['dos', '👫 Dos jugadores', textoDos],
            ] as const
          ).map(([m, nombre, texto]) => (
            <button
              key={m}
              onClick={() => setModo(m)}
              className={`rounded-xl border p-4 text-left transition ${
                modo === m ? 'border-[#4ade80] bg-[#0d2418]' : 'border-[#1e2b45] bg-[#0a1120] hover:border-[#2f4067]'
              }`}
            >
              <p className="text-sm font-bold text-[#e2e8ff]">{nombre}</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#8fa1c6]">{texto}</p>
            </button>
          ))}
        </div>

        <div className={`mb-6 grid gap-3 ${modo === 'dos' ? 'sm:grid-cols-2' : ''}`}>
          <input
            value={uno}
            onChange={(e) => setUno(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && empezar()}
            placeholder={modo === 'dos' ? 'Jugador 1' : 'Tu nombre'}
            className="rounded-xl border border-[#1e2b45] bg-[#0a1120] px-4 py-3 text-sm outline-none focus:border-[#4ade80]"
          />
          {modo === 'dos' && (
            <input
              value={dos}
              onChange={(e) => setDos(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && empezar()}
              placeholder="Jugador 2"
              className="rounded-xl border border-[#1e2b45] bg-[#0a1120] px-4 py-3 text-sm outline-none focus:border-[#4ade80]"
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/juegos" className="text-xs text-[#5a6b8f] hover:text-[#9fb0d4]">
            ← Otros juegos
          </Link>
          <button onClick={empezar} className="boton boton-primario px-8">
            ¡A jugar! ▶
          </button>
        </div>
      </div>
    </main>
  )
}
