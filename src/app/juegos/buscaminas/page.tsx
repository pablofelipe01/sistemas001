'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Confeti } from '@/components/Confeti'
import { PREGUNTAS, barajar, type Pregunta } from '@/lib/juegos'

/* El buscaminas de toda la vida, con una sola trampita de código: si pisas una
 * mina, la puedes desactivar contestando una pregunta. Pero solo tres veces. */

interface Nivel {
  id: 'facil' | 'medio' | 'dificil'
  nombre: string
  filas: number
  columnas: number
  minas: number
  ancho: string
}

const NIVELES: Nivel[] = [
  { id: 'facil', nombre: '🌱 Fácil', filas: 9, columnas: 9, minas: 10, ancho: 'max-w-sm' },
  { id: 'medio', nombre: '🔥 Medio', filas: 12, columnas: 12, minas: 24, ancho: 'max-w-md' },
  { id: 'dificil', nombre: '💀 Difícil', filas: 16, columnas: 16, minas: 40, ancho: 'max-w-xl' },
]

const RESCATES = 3
const SEGUNDOS = 20

/** Los colores de siempre (1 azul, 2 verde, 3 rojo…), pasados a fondo oscuro. */
const COLOR_NUMERO = ['', '#60a5fa', '#4ade80', '#fb7185', '#a78bfa', '#fbbf24', '#22d3ee', '#f472b6', '#e2e8ff']

interface Celda {
  mina: boolean
  vecinas: number
  abierta: boolean
  bandera: boolean
  /** Era mina, la pisó y contestó bien. */
  desactivada: boolean
}

type Estado = 'listo' | 'jugando' | 'gano' | 'perdio'

interface PreguntaEnJuego {
  p: Pregunta
  opciones: string[]
  celda: number
}

function vecinos(i: number, filas: number, columnas: number): number[] {
  const f = Math.floor(i / columnas)
  const c = i % columnas
  const lista: number[] = []
  for (let df = -1; df <= 1; df++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (df === 0 && dc === 0) continue
      const nf = f + df
      const nc = c + dc
      if (nf >= 0 && nf < filas && nc >= 0 && nc < columnas) lista.push(nf * columnas + nc)
    }
  }
  return lista
}

function tableroVacio(n: Nivel): Celda[] {
  return Array.from({ length: n.filas * n.columnas }, () => ({
    mina: false,
    vecinas: 0,
    abierta: false,
    bandera: false,
    desactivada: false,
  }))
}

/** Las minas se ponen después del primer toque: el primero nunca explota. */
function sembrarMinas(n: Nivel, primera: number): Celda[] {
  const prohibidas = new Set([primera, ...vecinos(primera, n.filas, n.columnas)])
  const posibles = Array.from({ length: n.filas * n.columnas }, (_, i) => i).filter((i) => !prohibidas.has(i))
  const minas = new Set(barajar(posibles).slice(0, n.minas))
  const t = tableroVacio(n)
  t.forEach((celda, i) => {
    celda.mina = minas.has(i)
    celda.vecinas = vecinos(i, n.filas, n.columnas).filter((v) => minas.has(v)).length
  })
  return t
}

/** Abre una casilla. Si no tiene minas alrededor, abre sola todas las de al lado. */
function abrirDesde(t: Celda[], inicio: number, n: Nivel) {
  const pendientes = [inicio]
  while (pendientes.length) {
    const i = pendientes.pop()!
    const celda = t[i]
    if (celda.abierta || celda.bandera || celda.mina) continue
    celda.abierta = true
    if (celda.vecinas === 0) pendientes.push(...vecinos(i, n.filas, n.columnas))
  }
}

function copiar(t: Celda[]): Celda[] {
  return t.map((c) => ({ ...c }))
}

export default function Buscaminas() {
  const [nivel, setNivel] = useState<Nivel>(NIVELES[0])
  const [tablero, setTablero] = useState<Celda[]>(() => tableroVacio(NIVELES[0]))
  const [estado, setEstado] = useState<Estado>('listo')
  const [rescates, setRescates] = useState(RESCATES)
  const [modoBandera, setModoBandera] = useState(false)
  const [explosion, setExplosion] = useState<number | null>(null)
  const [pregunta, setPregunta] = useState<PreguntaEnJuego | null>(null)
  const [elegida, setElegida] = useState<string | null>(null)
  const [restante, setRestante] = useState(SEGUNDOS)
  const [tiempo, setTiempo] = useState(0)
  const [record, setRecord] = useState<number | null>(null)
  const [recordNuevo, setRecordNuevo] = useState(false)
  const [fiesta, setFiesta] = useState(false)
  const mazo = useRef<Pregunta[]>([])
  const limite = useRef(0)
  const inicio = useRef(0)
  const pausa = useRef(0)

  const llaveRecord = `examen-web:buscaminas:${nivel.id}`

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(llaveRecord)
      setRecord(guardado ? Number(guardado) : null)
    } catch {
      setRecord(null)
    }
  }, [llaveRecord])

  /* El reloj de la partida. Mientras hay pregunta, no corre. */
  useEffect(() => {
    if (estado !== 'jugando' || pregunta) return
    const t = setInterval(() => setTiempo(Math.floor((Date.now() - inicio.current) / 1000)), 250)
    return () => clearInterval(t)
  }, [estado, pregunta])

  function nuevaPartida(n: Nivel = nivel) {
    setNivel(n)
    setTablero(tableroVacio(n))
    setEstado('listo')
    setRescates(RESCATES)
    setExplosion(null)
    setPregunta(null)
    setElegida(null)
    setTiempo(0)
    setRecordNuevo(false)
    setModoBandera(false)
  }

  function sacarPregunta(): Pregunta {
    if (mazo.current.length === 0) mazo.current = barajar(PREGUNTAS)
    return mazo.current.pop()!
  }

  function perder(t: Celda[], i: number) {
    t.forEach((c) => {
      if (c.mina && !c.desactivada) c.abierta = true
    })
    setTablero(t)
    setExplosion(i)
    setEstado('perdio')
  }

  function revisarSiGano(t: Celda[]) {
    if (!t.every((c) => c.mina || c.abierta)) return false
    // Al ganar, las minas que faltaban quedan con bandera, como en el original.
    t.forEach((c) => {
      if (c.mina && !c.desactivada) c.bandera = true
    })
    const segundos = Math.floor((Date.now() - inicio.current) / 1000)
    setTiempo(segundos)
    setEstado('gano')
    setFiesta(true)
    setTimeout(() => setFiesta(false), 2600)
    if (record === null || segundos < record) {
      setRecord(segundos)
      setRecordNuevo(true)
      try {
        localStorage.setItem(llaveRecord, String(segundos))
      } catch {
        /* sin almacenamiento: el récord dura lo que dure la página */
      }
    }
    return true
  }

  /** Pisó una mina: si le quedan rescates, pregunta; si no, ¡bum! */
  function pisarMina(t: Celda[], i: number) {
    if (rescates <= 0) {
      perder(t, i)
      return
    }
    setTablero(t)
    const p = sacarPregunta()
    setPregunta({ p, opciones: barajar([p.bien, ...p.mal]), celda: i })
    setElegida(null)
    setRestante(SEGUNDOS)
    limite.current = Date.now() + SEGUNDOS * 1000
    pausa.current = Date.now()
  }

  function tocar(i: number) {
    if (estado === 'gano' || estado === 'perdio' || pregunta) return
    const celda = tablero[i]

    if (modoBandera) {
      marcar(i)
      return
    }
    if (celda.bandera || celda.desactivada) return

    let t: Celda[]
    if (estado === 'listo') {
      t = sembrarMinas(nivel, i)
      inicio.current = Date.now()
      setEstado('jugando')
    } else {
      t = copiar(tablero)
    }

    // Tocar un número ya abierto que tiene todas sus banderas puestas abre las
    // de alrededor de una vez (el "clic de los dos botones" del original).
    if (celda.abierta) {
      if (celda.vecinas === 0) return
      const alrededor = vecinos(i, nivel.filas, nivel.columnas)
      const marcadas = alrededor.filter((v) => t[v].bandera || t[v].desactivada).length
      if (marcadas !== celda.vecinas) return
      const cerradas = alrededor.filter((v) => !t[v].abierta && !t[v].bandera && !t[v].desactivada)
      const mina = cerradas.find((v) => t[v].mina)
      cerradas.filter((v) => !t[v].mina).forEach((v) => abrirDesde(t, v, nivel))
      if (mina !== undefined) pisarMina(t, mina)
      else {
        revisarSiGano(t)
        setTablero(t)
      }
      return
    }

    if (t[i].mina) {
      pisarMina(t, i)
      return
    }
    abrirDesde(t, i, nivel)
    revisarSiGano(t)
    setTablero(t)
  }

  function marcar(i: number) {
    if (estado !== 'jugando' || pregunta) return
    const celda = tablero[i]
    if (celda.abierta || celda.desactivada) return
    const t = copiar(tablero)
    t[i].bandera = !t[i].bandera
    setTablero(t)
  }

  const responder = useCallback(
    (opcion: string) => {
      if (!pregunta || elegida !== null) return
      setElegida(opcion)
      const bien = opcion === pregunta.p.bien
      setRescates((r) => r - 1)
      setTimeout(
        () => {
          // El tiempo pensando la pregunta no cuenta para el récord.
          inicio.current += Date.now() - pausa.current
          const t = copiar(tablero)
          if (bien) {
            t[pregunta.celda].desactivada = true
            revisarSiGano(t)
            setTablero(t)
          } else {
            perder(t, pregunta.celda)
          }
          setPregunta(null)
          setElegida(null)
        },
        bien ? 1100 : 2600,
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pregunta, elegida, tablero],
  )

  /* El reloj de la pregunta. Si se acaba, explota. */
  useEffect(() => {
    if (!pregunta || elegida !== null) return
    if (restante <= 0) {
      responder('')
      return
    }
    const t = setTimeout(() => setRestante((limite.current - Date.now()) / 1000), 100)
    return () => clearTimeout(t)
  }, [pregunta, elegida, restante, responder])

  const banderas = tablero.filter((c) => c.bandera || c.desactivada).length
  const minasPorMarcar = nivel.minas - banderas
  const cara = estado === 'perdio' ? '😵' : estado === 'gano' ? '😎' : pregunta ? '😨' : '🙂'
  const letra = nivel.columnas > 12 ? 'text-xs sm:text-sm' : nivel.columnas > 9 ? 'text-sm sm:text-base' : 'text-base sm:text-lg'

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <Confeti activo={fiesta} />

      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          💣 <span className="text-[#fbbf24]">Buscaminas</span> de código
        </h1>
        <Link href="/juegos" className="boton boton-secundario">
          ← Juegos
        </Link>
      </header>

      <details className="panel mb-5 p-4 text-xs leading-relaxed text-[#9fb0d4]">
        <summary className="cursor-pointer font-bold text-[#e2e8ff]">¿Cómo se juega?</summary>
        <ul className="mt-2 space-y-1">
          <li>· Destapa casillas sin pisar las minas. El primer toque nunca explota.</li>
          <li>· Cada número dice cuántas minas hay pegadas a esa casilla, contando las de las esquinas.</li>
          <li>· Pon una 🚩 donde creas que hay mina: clic derecho, o prende el modo bandera.</li>
          <li>
            · Si pisas una mina, puedes desactivarla contestando una pregunta de código en {SEGUNDOS} segundos. Solo
            tienes {RESCATES} rescates por partida, y se gastan aunque falles.
          </li>
          <li>· Si tocas un número que ya tiene todas sus banderas, se abre todo lo de alrededor.</li>
        </ul>
      </details>

      <div className="mb-4 flex flex-wrap justify-center gap-2">
        {NIVELES.map((n) => (
          <button
            key={n.id}
            onClick={() => nuevaPartida(n)}
            className={`rounded-xl border px-4 py-2 text-xs font-bold transition ${
              n.id === nivel.id
                ? 'border-[#fbbf24] bg-[#2a2208] text-[#fde68a]'
                : 'border-[#1e2b45] bg-[#0a1120] text-[#9fb0d4] hover:border-[#2f4067]'
            }`}
          >
            {n.nombre} · {n.minas} minas
          </button>
        ))}
      </div>

      <div className={`mx-auto ${nivel.ancho}`}>
        <div className="panel mb-3 flex items-center justify-between gap-2 px-4 py-2">
          <div className="text-center">
            <p className="etiqueta">Minas</p>
            <p className="text-xl font-black tabular-nums text-[#fb7185]">💣 {minasPorMarcar}</p>
          </div>
          <button
            onClick={() => nuevaPartida()}
            title="Nueva partida"
            className="rounded-xl border border-[#1e2b45] bg-[#0d1426] px-3 py-1 text-3xl transition hover:border-[#fbbf24]"
          >
            {cara}
          </button>
          <div className="text-center">
            <p className="etiqueta">Tiempo</p>
            <p className="text-xl font-black tabular-nums text-[#22d3ee]">⏱ {tiempo}</p>
          </div>
        </div>

        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-xs text-[#9fb0d4]">
            Rescates:{' '}
            <span className="text-base">
              {'🛟'.repeat(rescates)}
              <span className="opacity-25">{'🛟'.repeat(RESCATES - rescates)}</span>
            </span>
          </p>
          <button
            onClick={() => setModoBandera((m) => !m)}
            className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
              modoBandera
                ? 'border-[#fb7185] bg-[#2a0f1c] text-[#ffd7e2]'
                : 'border-[#1e2b45] bg-[#0a1120] text-[#9fb0d4] hover:border-[#2f4067]'
            }`}
          >
            🚩 Modo bandera: {modoBandera ? 'prendido' : 'apagado'}
          </button>
        </div>

        <div
          className="grid select-none gap-[3px] rounded-xl border border-[#1e2b45] bg-[#0a1120] p-[3px]"
          style={{ gridTemplateColumns: `repeat(${nivel.columnas}, minmax(0, 1fr))` }}
          onContextMenu={(e) => e.preventDefault()}
        >
          {tablero.map((c, i) => {
            let contenido: React.ReactNode = null
            let clase = 'bg-[#1a2745] enabled:hover:bg-[#23345c] shadow-[inset_0_-2px_0_#0d1426]'
            if (c.desactivada) {
              contenido = '🛡️'
              clase = 'bg-[#0d2418] border border-[#22c55e]/40'
            } else if (c.abierta && c.mina) {
              contenido = '💣'
              clase = i === explosion ? 'bg-[#7f1d1d]' : 'bg-[#2a0f1c]'
            } else if (c.abierta) {
              contenido = c.vecinas || null
              clase = 'bg-[#0d1426]'
            } else if (c.bandera) {
              contenido = estado === 'perdio' && !c.mina ? '❌' : '🚩'
            }
            const terminado = estado === 'gano' || estado === 'perdio'
            return (
              <button
                key={i}
                onClick={() => tocar(i)}
                onContextMenu={(e) => {
                  e.preventDefault()
                  marcar(i)
                }}
                disabled={terminado || Boolean(pregunta)}
                className={`flex aspect-square items-center justify-center rounded-[4px] font-black transition ${letra} ${clase} ${
                  pregunta?.celda === i ? 'latir ring-2 ring-[#fb7185]' : ''
                }`}
                style={c.abierta && !c.mina ? { color: COLOR_NUMERO[c.vecinas] } : undefined}
              >
                {contenido}
              </button>
            )
          })}
        </div>

        {estado === 'gano' && (
          <div className="panel aparecer mt-4 p-5 text-center">
            <p className="text-lg font-black text-[#4ade80]">🏆 ¡Limpiaste el campo en {tiempo} segundos!</p>
            <p className="mt-1 text-xs text-[#9fb0d4]">
              {recordNuevo ? '¡Récord nuevo en este nivel!' : `Tu récord en este nivel: ${record} s`}
            </p>
            <button onClick={() => nuevaPartida()} className="boton boton-primario mt-4 px-8">
              Otra partida ▶
            </button>
          </div>
        )}
        {estado === 'perdio' && (
          <div className="panel aparecer mt-4 p-5 text-center">
            <p className="text-lg font-black text-[#fb7185]">💥 ¡Bum! Pisaste una mina.</p>
            <p className="mt-1 text-xs text-[#9fb0d4]">
              Mira los números otra vez: siempre dicen la verdad. ¿Otra más?
            </p>
            <button onClick={() => nuevaPartida()} className="boton boton-primario mt-4 px-8">
              Otra partida ▶
            </button>
          </div>
        )}
        {estado !== 'gano' && record !== null && (
          <p className="mt-3 text-center text-[11px] text-[#5a6b8f]">Récord en este nivel: {record} s</p>
        )}
      </div>

      {pregunta && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#070b18]/80 px-4 backdrop-blur-sm">
          <div className="panel aparecer w-full max-w-md p-6">
            <div className="mb-3 flex items-center justify-between">
              <p className="etiqueta">💣 ¡Pisaste una mina! Desactívala</p>
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
                  ? '¡Bien! Mina desactivada 🛡️'
                  : elegida === ''
                    ? '⏰ Se acabó el tiempo…'
                    : 'Esa no era…'}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
