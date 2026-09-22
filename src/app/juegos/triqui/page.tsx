'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ElegirModo, type Configuracion } from '@/components/ElegirModo'
import { Confeti } from '@/components/Confeti'
import { PREGUNTAS, barajar, type Pregunta } from '@/lib/juegos'

type Marca = 'X' | 'O'
type Celda = Marca | null

const LINEAS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const SEGUNDOS = 15

function ganadorDe(t: Celda[]): { marca: Marca; linea: number[] } | null {
  for (const l of LINEAS) {
    const [a, b, c] = l
    if (t[a] && t[a] === t[b] && t[a] === t[c]) return { marca: t[a]!, linea: l }
  }
  return null
}

/**
 * La compu no es perfecta a propósito: casi siempre gana si puede, a veces se
 * le olvida tapar. Contra una compu perfecta un niño solo empata, y eso no es
 * divertido.
 */
function jugadaDeLaCompu(t: Celda[]): number {
  const libres = t.map((c, i) => (c ? -1 : i)).filter((i) => i >= 0)
  const completa = (m: Marca) =>
    libres.find((i) => {
      const prueba = [...t]
      prueba[i] = m
      return ganadorDe(prueba)?.marca === m
    })
  const ganar = completa('X')
  if (ganar !== undefined && Math.random() < 0.9) return ganar
  const tapar = completa('O')
  if (tapar !== undefined && Math.random() < 0.7) return tapar
  if (t[4] === null && Math.random() < 0.6) return 4
  return libres[Math.floor(Math.random() * libres.length)]
}

interface PreguntaEnJuego {
  p: Pregunta
  opciones: string[]
  celda: number
  marca: Marca
}

export default function Triqui() {
  const [config, setConfig] = useState<Configuracion | null>(null)
  const [tablero, setTablero] = useState<Celda[]>(Array(9).fill(null))
  const [turno, setTurno] = useState<Marca>('O')
  const [empieza, setEmpieza] = useState<Marca>('O')
  const [marcador, setMarcador] = useState({ O: 0, X: 0, empates: 0 })
  const [aciertos, setAciertos] = useState({ O: 0, X: 0 })
  const [pregunta, setPregunta] = useState<PreguntaEnJuego | null>(null)
  const [elegida, setElegida] = useState<string | null>(null)
  const [restante, setRestante] = useState(SEGUNDOS)
  const [fiesta, setFiesta] = useState(false)
  const mazo = useRef<Pregunta[]>([])
  const limite = useRef(0)

  const contraCompu = config?.modo === 'compu'
  // El jugador 1 siempre es O; el jugador 2 (o la compu) es X.
  const nombre = (m: Marca) => (m === 'O' ? config?.nombres[0] : config?.nombres[1]) ?? m
  const final = ganadorDe(tablero)
  const empate = !final && tablero.every(Boolean)
  const terminado = Boolean(final) || empate

  function sacarPregunta(): Pregunta {
    if (mazo.current.length === 0) mazo.current = barajar(PREGUNTAS)
    return mazo.current.pop()!
  }

  function tocar(i: number) {
    if (terminado || pregunta || tablero[i]) return
    if (contraCompu && turno === 'X') return
    const p = sacarPregunta()
    setPregunta({ p, opciones: barajar([p.bien, ...p.mal]), celda: i, marca: turno })
    setElegida(null)
    setRestante(SEGUNDOS)
    limite.current = Date.now() + SEGUNDOS * 1000
  }

  const responder = useCallback(
    (opcion: string) => {
      if (!pregunta || elegida !== null) return
      setElegida(opcion)
      const bien = opcion === pregunta.p.bien
      if (bien) setAciertos((a) => ({ ...a, [pregunta.marca]: a[pregunta.marca] + 1 }))
      // Si se equivoca, se queda un ratico más para que alcance a leer la buena.
      setTimeout(
        () => {
          if (bien) {
            setTablero((t) => {
              const n = [...t]
              n[pregunta.celda] = pregunta.marca
              return n
            })
          }
          setPregunta(null)
          setElegida(null)
          setTurno(pregunta.marca === 'O' ? 'X' : 'O')
        },
        bien ? 1100 : 2600,
      )
    },
    [pregunta, elegida],
  )

  /* El reloj de la pregunta. Si se acaba, pierde el turno. */
  useEffect(() => {
    if (!pregunta || elegida !== null) return
    if (restante <= 0) {
      responder('')
      return
    }
    // Se mide contra la hora de verdad: un setTimeout encadenado se atrasa
    // cuando el navegador frena la pestaña.
    const t = setTimeout(() => setRestante((limite.current - Date.now()) / 1000), 100)
    return () => clearTimeout(t)
  }, [pregunta, elegida, restante, responder])

  /* El turno de la compu. */
  useEffect(() => {
    if (!contraCompu || turno !== 'X' || terminado || pregunta) return
    const t = setTimeout(() => {
      setTablero((tab) => {
        if (ganadorDe(tab) || tab.every(Boolean)) return tab
        const n = [...tab]
        n[jugadaDeLaCompu(tab)] = 'X'
        return n
      })
      setTurno('O')
    }, 750)
    return () => clearTimeout(t)
  }, [contraCompu, turno, terminado, pregunta])

  /* Cuando se acaba la ronda, se anota. */
  useEffect(() => {
    if (!terminado) return
    if (final) {
      setMarcador((m) => ({ ...m, [final.marca]: m[final.marca] + 1 }))
      if (!contraCompu || final.marca === 'O') {
        setFiesta(true)
        setTimeout(() => setFiesta(false), 2600)
      }
    } else {
      setMarcador((m) => ({ ...m, empates: m.empates + 1 }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terminado])

  function nuevaPartida(c: Configuracion) {
    setConfig(c)
    setTablero(Array(9).fill(null))
    setTurno('O')
    setEmpieza('O')
    setMarcador({ O: 0, X: 0, empates: 0 })
    setAciertos({ O: 0, X: 0 })
  }

  function otraRonda() {
    const siguiente: Marca = empieza === 'O' ? 'X' : 'O'
    setEmpieza(siguiente)
    setTurno(siguiente)
    setTablero(Array(9).fill(null))
  }

  if (!config) {
    return (
      <ElegirModo
        emoji="⭕"
        titulo="Triqui de código"
        reglas={[
          'Es el triqui de siempre: tres en línea gana.',
          'Pero para poner tu ficha tienes que contestar una pregunta de código. Tienes 15 segundos y 3 opciones.',
          'Si fallas o se te acaba el tiempo, pierdes el turno y la casilla queda libre.',
        ]}
        textoCompu="La compu juega con X y no tiene que contestar nada. Tú eres O."
        textoDos="Los dos contestan preguntas para poder poner su ficha. Se turnan el computador."
        onEmpezar={nuevaPartida}
      />
    )
  }

  const estado = final
    ? contraCompu && final.marca === 'X'
      ? '🤖 Ganó la compu. ¡La revancha!'
      : `🏆 ¡Ganó ${nombre(final.marca)}!`
    : empate
      ? '🤝 Empate'
      : contraCompu && turno === 'X'
        ? '🤖 La compu está pensando…'
        : `Turno de ${nombre(turno)} (${turno}): toca una casilla`

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <Confeti activo={fiesta} />

      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          ⭕ <span className="text-[#22d3ee]">Triqui</span> de código
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

      <div className="mb-5 grid grid-cols-3 gap-3 text-center">
        <Tablita titulo={`${nombre('O')} · O`} valor={marcador.O} extra={`${aciertos.O} respuestas buenas`} color="#4ade80" />
        <Tablita titulo="Empates" valor={marcador.empates} color="#7f8fb3" />
        <Tablita
          titulo={`${nombre('X')} · X`}
          valor={marcador.X}
          extra={contraCompu ? 'no contesta' : `${aciertos.X} respuestas buenas`}
          color="#f472b6"
        />
      </div>

      <p className="mb-4 text-center text-sm font-bold text-[#e2e8ff]">{estado}</p>

      <div className="mx-auto grid aspect-square w-full max-w-sm grid-cols-3 grid-rows-3 gap-2">
        {tablero.map((c, i) => {
          const enLinea = final?.linea.includes(i)
          const puedeTocar = !terminado && !pregunta && !c && !(contraCompu && turno === 'X')
          return (
            <button
              key={i}
              onClick={() => tocar(i)}
              disabled={!puedeTocar}
              className={`flex items-center justify-center rounded-2xl border text-6xl font-black transition ${
                enLinea
                  ? 'border-[#fbbf24] bg-[#2a2208]'
                  : 'border-[#1e2b45] bg-[#0d1426] enabled:hover:border-[#4ade80] enabled:hover:bg-[#101a2e]'
              } ${pregunta?.celda === i ? 'latir border-[#22d3ee]' : ''}`}
            >
              {c && (
                <span className={`aparecer ${c === 'O' ? 'text-[#4ade80]' : 'text-[#f472b6]'}`}>{c}</span>
              )}
            </button>
          )
        })}
      </div>

      {terminado && (
        <div className="mt-6 text-center">
          <button onClick={otraRonda} className="boton boton-primario px-8">
            Otra ronda ▶
          </button>
        </div>
      )}

      {pregunta && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#070b18]/80 px-4 backdrop-blur-sm">
          <div className="panel aparecer w-full max-w-md p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="etiqueta">
                Pregunta para {nombre(pregunta.marca)} ({pregunta.marca})
              </p>
              <span className={`text-sm font-bold tabular-nums ${restante < 5 ? 'text-[#fb7185]' : 'text-[#fbbf24]'}`}>
                {Math.ceil(Math.max(0, restante))} s
              </span>
            </div>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#16233d]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#fbbf24] to-[#fb7185]"
                style={{ width: `${(Math.max(0, restante) / SEGUNDOS) * 100}%` }}
              />
            </div>
            <p className="mb-3 text-base font-bold text-[#e2e8ff]">{pregunta.p.q}</p>
            {pregunta.p.codigo && (
              <pre className="mb-4 overflow-x-auto rounded-lg border border-[#1e2b45] bg-[#0a1120] px-4 py-3 text-sm text-[#86efac]">
                {pregunta.p.codigo}
              </pre>
            )}
            <div className="space-y-2">
              {pregunta.opciones.map((o, k) => {
                const esBuena = o === pregunta.p.bien
                const clase =
                  elegida === null
                    ? 'border-[#1e2b45] bg-[#0a1120] hover:border-[#22d3ee]'
                    : esBuena
                      ? 'border-[#22c55e] bg-[#0d2418] text-[#c9f7d8]'
                      : o === elegida
                        ? 'temblar border-[#fb7185] bg-[#2a0f1c] text-[#ffd7e2]'
                        : 'border-[#141f36] bg-[#0a1120] opacity-50'
                return (
                  <button
                    key={o}
                    onClick={() => responder(o)}
                    disabled={elegida !== null}
                    className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left font-mono text-sm transition ${clase}`}
                  >
                    <span className="text-xs text-[#5a6b8f]">{'ABC'[k]}</span>
                    {o}
                  </button>
                )
              })}
            </div>
            {elegida !== null && (
              <p
                className={`mt-4 text-center text-sm font-bold ${elegida === pregunta.p.bien ? 'text-[#4ade80]' : 'text-[#fb7185]'}`}
              >
                {elegida === pregunta.p.bien
                  ? '¡Bien! Pones tu ficha.'
                  : elegida === ''
                    ? '⏰ Se acabó el tiempo. Pierdes el turno.'
                    : 'Esa no era. Pierdes el turno.'}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

function Tablita({ titulo, valor, extra, color }: { titulo: string; valor: number; extra?: string; color: string }) {
  return (
    <div className="panel px-3 py-3">
      <p className="etiqueta truncate">{titulo}</p>
      <p className="text-3xl font-black tabular-nums" style={{ color }}>
        {valor}
      </p>
      {extra && <p className="text-[10px] text-[#5a6b8f]">{extra}</p>}
    </div>
  )
}
