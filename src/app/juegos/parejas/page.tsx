'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ElegirModo, type Configuracion } from '@/components/ElegirModo'
import { Confeti } from '@/components/Confeti'
import { PAREJAS, barajar, type Pareja } from '@/lib/juegos'

const CUANTAS = 8

interface Carta {
  pareja: Pareja
  lado: 'vista' | 'codigo'
}

function repartir(): Carta[] {
  const elegidas = barajar(PAREJAS).slice(0, CUANTAS)
  return barajar(
    elegidas.flatMap((p) => [
      { pareja: p, lado: 'vista' as const },
      { pareja: p, lado: 'codigo' as const },
    ]),
  )
}

/** Qué tan buena memoria tiene la compu: la probabilidad de acordarse de una carta que vio. */
const MEMORIA_DE_LA_COMPU = 0.55

export default function Parejas() {
  const [config, setConfig] = useState<Configuracion | null>(null)
  const [cartas, setCartas] = useState<Carta[]>([])
  const [abiertas, setAbiertas] = useState<number[]>([])
  /** id de la pareja → quién la encontró (0 o 1). */
  const [dueno, setDueno] = useState<Record<string, 0 | 1>>({})
  const [turno, setTurno] = useState<0 | 1>(0)
  const [ultima, setUltima] = useState<Pareja | null>(null)
  const [fiesta, setFiesta] = useState(false)
  const memoria = useRef(new Map<number, string>())
  const segundaDeLaCompu = useRef<ReturnType<typeof setTimeout> | null>(null)

  const contraCompu = config?.modo === 'compu'
  const puntos = [0, 1].map((j) => Object.values(dueno).filter((d) => d === j).length)
  const terminado = cartas.length > 0 && Object.keys(dueno).length === CUANTAS
  const encontrada = (i: number) => cartas[i] && cartas[i].pareja.id in dueno

  function empezar(c: Configuracion) {
    setConfig(c)
    setCartas(repartir())
    setAbiertas([])
    setDueno({})
    setTurno(0)
    setUltima(null)
    memoria.current.clear()
    if (segundaDeLaCompu.current) clearTimeout(segundaDeLaCompu.current)
  }

  useEffect(() => () => {
    if (segundaDeLaCompu.current) clearTimeout(segundaDeLaCompu.current)
  }, [])

  function voltear(i: number) {
    setAbiertas((a) => {
      if (a.length >= 2 || a.includes(i)) return a
      return [...a, i]
    })
    if (Math.random() < MEMORIA_DE_LA_COMPU) memoria.current.set(i, cartas[i].pareja.id)
  }

  function tocar(i: number) {
    if (terminado || encontrada(i) || abiertas.length >= 2 || abiertas.includes(i)) return
    if (contraCompu && turno === 1) return
    voltear(i)
  }

  /* Dos cartas abiertas: ¿son pareja? */
  useEffect(() => {
    if (abiertas.length !== 2) return
    const [a, b] = abiertas
    const iguales = cartas[a].pareja.id === cartas[b].pareja.id
    const t = setTimeout(
      () => {
        if (iguales) {
          const p = cartas[a].pareja
          setDueno((d) => ({ ...d, [p.id]: turno }))
          setUltima(p)
          memoria.current.delete(a)
          memoria.current.delete(b)
          // Quien encuentra pareja, sigue jugando.
        } else {
          setTurno((t) => (t === 0 ? 1 : 0))
        }
        setAbiertas([])
      },
      iguales ? 700 : 1400,
    )
    return () => clearTimeout(t)
  }, [abiertas, cartas, turno])

  /* El turno de la compu: primero lo que recuerda, si no, a la suerte. */
  const compuPuedeJugar = Boolean(contraCompu && turno === 1 && !terminado && abiertas.length === 0)
  useEffect(() => {
    if (!compuPuedeJugar) return
    const libres = cartas.map((_, i) => i).filter((i) => !(cartas[i].pareja.id in dueno))
    const desconocidas = libres.filter((i) => !memoria.current.has(i))
    const alAzar = (lista: number[]) => lista[Math.floor(Math.random() * lista.length)]

    let primera: number | undefined
    let segunda: number | undefined
    const vistas = [...memoria.current.entries()].filter(([i]) => libres.includes(i))
    for (const [i, id] of vistas) {
      const otra = vistas.find(([j, idj]) => j !== i && idj === id)
      if (otra) {
        primera = i
        segunda = otra[0]
        break
      }
    }
    if (primera === undefined) {
      primera = alAzar(desconocidas.length ? desconocidas : libres)
      const id = cartas[primera].pareja.id
      const recordada = vistas.find(([j, idj]) => j !== primera && idj === id)
      segunda = recordada
        ? recordada[0]
        : alAzar(
            (desconocidas.length > 1 ? desconocidas : libres).filter((i) => i !== primera),
          )
    }

    // La segunda carta va en un ref: al voltear la primera, este efecto se
    // limpia (ya hay una carta abierta) y no debe llevarse la segunda por delante.
    const t = setTimeout(() => {
      voltear(primera!)
      segundaDeLaCompu.current = setTimeout(() => voltear(segunda!), 800)
    }, 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compuPuedeJugar])

  useEffect(() => {
    if (!terminado) return
    if (!contraCompu || puntos[0] >= puntos[1]) {
      setFiesta(true)
      setTimeout(() => setFiesta(false), 2600)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminado])

  if (!config) {
    return (
      <ElegirModo
        emoji="🃏"
        titulo="Parejas de código"
        reglas={[
          'Hay 16 cartas boca abajo: 8 muestran algo que se ve en la página y 8 muestran el código que lo hace.',
          'Voltea dos. Si el código y lo que se ve son pareja, te las quedas y sigues jugando.',
          'Por ejemplo: "¡Hola Mundo!" en letra gigante va con <h1>¡Hola Mundo!</h1>.',
          'Gana quien encuentre más parejas.',
        ]}
        textoCompu="Te turnas con la compu. Tiene buena memoria… pero no tanta."
        textoDos="Se turnan el computador. Quien falla, le pasa el turno al otro."
        onEmpezar={empezar}
      />
    )
  }

  const [n1, n2] = config.nombres
  const estado = terminado
    ? puntos[0] === puntos[1]
      ? '🤝 ¡Empate!'
      : `🏆 ¡Ganó ${puntos[0] > puntos[1] ? n1 : n2}!`
    : contraCompu && turno === 1
      ? '🤖 La compu está buscando…'
      : `Turno de ${turno === 0 ? n1 : n2}`

  return (
    <main className="mx-auto max-w-3xl px-5 py-6">
      <Confeti activo={fiesta} />

      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          🃏 <span className="text-[#22d3ee]">Parejas</span> de código
        </h1>
        <div className="flex gap-2">
          <button onClick={() => setConfig(null)} className="boton boton-secundario">
            Cambiar modo
          </button>
          <Link href="/juegos" className="boton boton-secundario">
            ← Juegos
          </Link>
        </div>
      </header>

      <div className="mb-4 grid grid-cols-2 gap-3 text-center">
        {[n1, n2].map((n, j) => (
          <div
            key={j}
            className={`panel px-3 py-3 transition ${turno === j && !terminado ? 'border-[#4ade80]' : ''}`}
          >
            <p className="etiqueta truncate">{n}</p>
            <p className={`text-3xl font-black tabular-nums ${j === 0 ? 'text-[#4ade80]' : 'text-[#f472b6]'}`}>
              {puntos[j]}
            </p>
          </div>
        ))}
      </div>

      <p className="mb-4 text-center text-sm font-bold text-[#e2e8ff]">{estado}</p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {cartas.map((c, i) => {
          const boca = abiertas.includes(i) || encontrada(i)
          const deQuien = dueno[c.pareja.id]
          return (
            <button
              key={i}
              onClick={() => tocar(i)}
              className={`flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl border p-2 transition ${
                !boca
                  ? 'border-[#2f4067] bg-gradient-to-br from-[#16233d] to-[#0d1426] hover:border-[#22d3ee]'
                  : c.lado === 'vista'
                    ? 'border-slate-300 bg-white'
                    : 'border-[#1e2b45] bg-[#0a1120]'
              } ${deQuien !== undefined ? (deQuien === 0 ? 'ring-2 ring-[#4ade80]' : 'ring-2 ring-[#f472b6]') : ''} ${
                deQuien !== undefined ? 'opacity-80' : ''
              }`}
            >
              {!boca ? (
                <span className="text-xl font-black text-[#3f5074]">{'</>'}</span>
              ) : c.lado === 'vista' ? (
                <span className={`aparecer ${c.pareja.clase}`}>{c.pareja.vista}</span>
              ) : (
                <code className="aparecer whitespace-pre-wrap break-all text-left text-[10px] leading-snug text-[#86efac] sm:text-xs">
                  {c.pareja.codigo}
                </code>
              )}
            </button>
          )
        })}
      </div>

      {ultima && (
        <p key={ultima.id} className="aparecer mt-5 rounded-xl border border-[#1e3a5f] bg-[#0e1c2f] px-4 py-3 text-center text-xs text-[#cfe4ff]">
          💡 {ultima.explica}
        </p>
      )}

      {terminado && (
        <div className="mt-6 text-center">
          <button onClick={() => empezar(config)} className="boton boton-primario px-8">
            Jugar otra vez ▶
          </button>
        </div>
      )}
    </main>
  )
}
