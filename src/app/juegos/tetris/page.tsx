'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Confeti } from '@/components/Confeti'
import { PREGUNTAS, barajar, type Pregunta } from '@/lib/juegos'

/* El Tetris de siempre, con preguntas de código en el medio. Si contestas bien,
 * la ficha se congela en el aire y la acomodas con calma. Si contestas mal, se
 * pone en turbo y cae rapidísimo. */

const COLUMNAS = 10
const FILAS = 20
const SEGUNDOS = 15
/** Cada cuántas fichas sale una pregunta sorpresa, la pida o no. */
const CADA = 5
/** Milisegundos por renglón de una ficha en turbo. */
const TURBO = 60
const PUNTOS_LINEAS = [0, 100, 300, 500, 800]
const NOMBRE_LINEAS = ['', '¡Línea!', '¡Doble!', '¡Triple!', '¡TETRIS! 🎉']
const PUNTOS_PREGUNTA = 50
const LLAVE_RECORD = 'examen-web:tetris'

type Tipo = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L'
type Forma = number[][]

const TIPOS: Tipo[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L']

const FORMAS: Record<Tipo, Forma> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
}

const COLOR: Record<Tipo, string> = {
  I: '#22d3ee',
  O: '#fbbf24',
  T: '#a78bfa',
  S: '#4ade80',
  Z: '#fb7185',
  J: '#60a5fa',
  L: '#fb923c',
}

const TECLAS_JUEGO = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', ' '])

interface Pieza {
  tipo: Tipo
  forma: Forma
  fila: number
  col: number
}

/** Normal cae sola; congelada se queda quieta hasta que la sueltes; turbo cae volando. */
type Modo = 'normal' | 'congelada' | 'turbo'

interface Juego {
  tablero: (Tipo | null)[]
  pieza: Pieza
  bolsa: Tipo[]
  puntos: number
  lineas: number
  piezas: number
  modo: Modo
  /** Una sola pregunta por ficha. */
  pregunto: boolean
  acumulado: number
}

type Estado = 'listo' | 'jugando' | 'pausa' | 'pregunta' | 'fin'

interface PreguntaEnJuego {
  p: Pregunta
  opciones: string[]
  sorpresa: boolean
}

function girar(f: Forma): Forma {
  const n = f.length
  return f.map((_, fila) => f.map((__, col) => f[n - 1 - col][fila]))
}

function choca(t: (Tipo | null)[], forma: Forma, fila: number, col: number): boolean {
  for (let f = 0; f < forma.length; f++) {
    for (let c = 0; c < forma.length; c++) {
      if (!forma[f][c]) continue
      const ff = fila + f
      const cc = col + c
      if (cc < 0 || cc >= COLUMNAS || ff >= FILAS) return true
      if (ff >= 0 && t[ff * COLUMNAS + cc]) return true
    }
  }
  return false
}

function piezaNueva(tipo: Tipo): Pieza {
  const forma = FORMAS[tipo]
  return { tipo, forma, fila: tipo === 'I' ? -1 : 0, col: Math.floor((COLUMNAS - forma.length) / 2) }
}

/** Las fichas salen de a bolsas de siete: nunca pasa mucho sin que salga el palito. */
function sacarDeBolsa(g: Juego): Tipo {
  if (g.bolsa.length < 2) g.bolsa.push(...barajar(TIPOS))
  return g.bolsa.shift()!
}

function nivelDe(lineas: number) {
  return 1 + Math.floor(lineas / 10)
}

function velocidad(nivel: number) {
  return Math.max(100, 800 - (nivel - 1) * 75)
}

/** Pega la ficha al tablero y borra las líneas llenas. */
function fijar(g: Juego): { lineas: number; perdio: boolean } {
  const { forma, fila, col, tipo } = g.pieza
  let fuera = false
  forma.forEach((renglon, f) =>
    renglon.forEach((v, c) => {
      if (!v) return
      if (fila + f < 0) fuera = true
      else g.tablero[(fila + f) * COLUMNAS + col + c] = tipo
    }),
  )
  if (fuera) return { lineas: 0, perdio: true }

  const quedan: (Tipo | null)[][] = []
  for (let f = 0; f < FILAS; f++) {
    const renglon = g.tablero.slice(f * COLUMNAS, (f + 1) * COLUMNAS)
    if (!renglon.every(Boolean)) quedan.push(renglon)
  }
  const lineas = FILAS - quedan.length
  if (lineas) {
    const vacios = Array.from({ length: lineas }, () => Array<Tipo | null>(COLUMNAS).fill(null))
    g.tablero = [...vacios, ...quedan].flat()
  }
  return { lineas, perdio: false }
}

function Mini({ tipo }: { tipo: Tipo }) {
  const forma = FORMAS[tipo]
  const filas = forma.filter((r) => r.some(Boolean))
  const cols = forma[0].map((_, c) => c).filter((c) => forma.some((r) => r[c]))
  return (
    <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${cols.length}, 14px)` }}>
      {filas.flatMap((r, f) =>
        cols.map((c) => (
          <div
            key={`${f}-${c}`}
            className="h-[14px] rounded-[3px]"
            style={r[c] ? { background: COLOR[tipo] } : undefined}
          />
        )),
      )}
    </div>
  )
}

export default function Tetris() {
  const [estado, setEstado] = useState<Estado>('listo')
  const [, setCuadro] = useState(0)
  const [pregunta, setPregunta] = useState<PreguntaEnJuego | null>(null)
  const [elegida, setElegida] = useState<string | null>(null)
  const [restante, setRestante] = useState(SEGUNDOS)
  const [aviso, setAviso] = useState<string | null>(null)
  const [record, setRecord] = useState<number | null>(null)
  const [recordNuevo, setRecordNuevo] = useState(false)
  const [fiesta, setFiesta] = useState(false)
  const m = useRef<Juego | null>(null)
  const estadoRef = useRef<Estado>('listo')
  const recordRef = useRef<number | null>(null)
  const mazo = useRef<Pregunta[]>([])
  const limite = useRef(0)
  const avisoReloj = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const teclaRef = useRef<(e: KeyboardEvent) => void>(() => {})

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(LLAVE_RECORD)
      recordRef.current = guardado ? Number(guardado) : null
      setRecord(recordRef.current)
    } catch {
      /* sin almacenamiento: no hay récord guardado */
    }
  }, [])

  function refrescar() {
    setCuadro((c) => c + 1)
  }

  function cambiar(e: Estado) {
    estadoRef.current = e
    setEstado(e)
  }

  function avisar(texto: string) {
    setAviso(texto)
    clearTimeout(avisoReloj.current)
    avisoReloj.current = setTimeout(() => setAviso(null), 1800)
  }

  function celebrar() {
    setFiesta(true)
    setTimeout(() => setFiesta(false), 2600)
  }

  function empezar() {
    const bolsa = barajar(TIPOS)
    m.current = {
      tablero: Array(FILAS * COLUMNAS).fill(null),
      pieza: piezaNueva(bolsa.shift()!),
      bolsa,
      puntos: 0,
      lineas: 0,
      piezas: 1,
      modo: 'normal',
      pregunto: false,
      acumulado: 0,
    }
    setRecordNuevo(false)
    setAviso(null)
    cambiar('jugando')
    refrescar()
  }

  function terminar(g: Juego) {
    cambiar('fin')
    if (g.puntos > 0 && (recordRef.current === null || g.puntos > recordRef.current)) {
      recordRef.current = g.puntos
      setRecord(g.puntos)
      setRecordNuevo(true)
      celebrar()
      try {
        localStorage.setItem(LLAVE_RECORD, String(g.puntos))
      } catch {
        /* sin almacenamiento: el récord dura lo que dure la página */
      }
    }
  }

  function abrirPregunta(sorpresa: boolean) {
    const g = m.current
    if (!g || g.pregunto || g.modo !== 'normal') return
    g.pregunto = true
    if (mazo.current.length === 0) mazo.current = barajar(PREGUNTAS)
    const p = mazo.current.pop()!
    setPregunta({ p, opciones: barajar([p.bien, ...p.mal]), sorpresa })
    setElegida(null)
    setRestante(SEGUNDOS)
    limite.current = Date.now() + SEGUNDOS * 1000
    cambiar('pregunta')
  }

  function siguientePieza(g: Juego) {
    g.pieza = piezaNueva(sacarDeBolsa(g))
    g.piezas++
    g.modo = 'normal'
    g.pregunto = false
    g.acumulado = 0
    if (choca(g.tablero, g.pieza.forma, g.pieza.fila, g.pieza.col)) {
      terminar(g)
      return
    }
    if (g.piezas % CADA === 0) abrirPregunta(true)
  }

  function asentar(g: Juego) {
    const r = fijar(g)
    if (r.perdio) {
      terminar(g)
      return
    }
    if (r.lineas) {
      const antes = nivelDe(g.lineas)
      g.lineas += r.lineas
      g.puntos += PUNTOS_LINEAS[r.lineas] * antes
      const ahora = nivelDe(g.lineas)
      avisar(NOMBRE_LINEAS[r.lineas] + (ahora > antes ? ` · ¡Nivel ${ahora}!` : ''))
      if (r.lineas === 4) celebrar()
    }
    siguientePieza(g)
  }

  /** Baja un renglón. Si ya no puede, la ficha se queda ahí. */
  function bajar(g: Juego, aMano: boolean) {
    const { forma, fila, col } = g.pieza
    if (!choca(g.tablero, forma, fila + 1, col)) {
      g.pieza.fila++
      if (aMano) g.puntos += 1
      return
    }
    asentar(g)
  }

  function soltar(g: Juego) {
    const { forma, col } = g.pieza
    while (!choca(g.tablero, forma, g.pieza.fila + 1, col)) {
      g.pieza.fila++
      g.puntos += 2
    }
    asentar(g)
  }

  function mover(g: Juego, d: number) {
    const { forma, fila, col } = g.pieza
    if (!choca(g.tablero, forma, fila, col + d)) g.pieza.col += d
  }

  /** Si al girar se choca con la pared, prueba corriéndola un poquito. */
  function rotar(g: Juego) {
    const forma = girar(g.pieza.forma)
    for (const corrida of [0, -1, 1, -2, 2]) {
      if (!choca(g.tablero, forma, g.pieza.fila, g.pieza.col + corrida)) {
        g.pieza.forma = forma
        g.pieza.col += corrida
        return
      }
    }
  }

  function pausar() {
    if (estadoRef.current === 'jugando') cambiar('pausa')
    else if (estadoRef.current === 'pausa') {
      if (m.current) m.current.acumulado = 0
      cambiar('jugando')
    }
  }

  function responder(opcion: string) {
    const g = m.current
    if (!pregunta || elegida !== null || !g) return
    setElegida(opcion)
    const bien = opcion === pregunta.p.bien
    if (bien) {
      g.modo = 'congelada'
      g.puntos += PUNTOS_PREGUNTA
    } else {
      g.modo = 'turbo'
    }
    setTimeout(
      () => {
        setPregunta(null)
        setElegida(null)
        g.acumulado = 0
        if (estadoRef.current === 'pregunta') cambiar('jugando')
      },
      bien ? 1000 : 2400,
    )
  }

  /** Lo que hacen los botones de pantalla: lo mismo que las teclas. */
  function accion(hacer: (g: Juego) => void) {
    const g = m.current
    if (!g || estadoRef.current !== 'jugando') return
    hacer(g)
    refrescar()
  }

  useEffect(() => {
    teclaRef.current = (e: KeyboardEvent) => {
      const k = e.key
      const est = estadoRef.current
      const g = m.current
      if (TECLAS_JUEGO.has(k)) e.preventDefault()

      if (est === 'pregunta') {
        const n = ['1', '2', '3'].indexOf(k)
        if (n >= 0 && !e.repeat && pregunta) responder(pregunta.opciones[n])
        return
      }
      // Al perder no se arranca con Espacio: si venía soltando fichas, se saltaría el resultado.
      if (est === 'listo' || est === 'fin') {
        if (!e.repeat && (k === 'Enter' || (k === ' ' && est === 'listo'))) {
          e.preventDefault()
          empezar()
        }
        return
      }
      if (k === 'p' || k === 'P' || k === 'Escape') {
        if (!e.repeat) pausar()
        return
      }
      if (est !== 'jugando' || !g) return

      switch (k.length === 1 ? k.toLowerCase() : k) {
        case 'ArrowLeft':
        case 'a':
          mover(g, -1)
          break
        case 'ArrowRight':
        case 'd':
          mover(g, 1)
          break
        case 'ArrowDown':
        case 's':
          bajar(g, true)
          g.acumulado = 0
          break
        case 'ArrowUp':
        case 'w':
          if (!e.repeat) rotar(g)
          break
        case ' ':
          if (!e.repeat) soltar(g)
          break
        case 'c':
          if (!e.repeat) abrirPregunta(false)
          break
        default:
          return
      }
      refrescar()
    }
  })

  useEffect(() => {
    const escuchar = (e: KeyboardEvent) => teclaRef.current(e)
    // Si se va a otra ventana, se pausa sola.
    const alSalir = () => {
      if (estadoRef.current === 'jugando') {
        estadoRef.current = 'pausa'
        setEstado('pausa')
      }
    }
    window.addEventListener('keydown', escuchar)
    window.addEventListener('blur', alSalir)
    return () => {
      window.removeEventListener('keydown', escuchar)
      window.removeEventListener('blur', alSalir)
    }
  }, [])

  /* La gravedad. Solo corre mientras se juega. */
  useEffect(() => {
    if (estado !== 'jugando') return
    let pedido = 0
    let antes = performance.now()
    const paso = (ahora: number) => {
      const g = m.current
      if (!g) return
      // Si la pestaña estuvo escondida, no cae todo de golpe al volver.
      g.acumulado += Math.min(ahora - antes, 100)
      antes = ahora
      if (g.modo === 'congelada') g.acumulado = 0
      const intervalo = g.modo === 'turbo' ? TURBO : velocidad(nivelDe(g.lineas))
      let cambio = false
      while (g.modo !== 'congelada' && g.acumulado >= intervalo && estadoRef.current === 'jugando') {
        g.acumulado -= intervalo
        bajar(g, false)
        cambio = true
      }
      if (cambio) refrescar()
      if (estadoRef.current === 'jugando') pedido = requestAnimationFrame(paso)
    }
    pedido = requestAnimationFrame(paso)
    return () => cancelAnimationFrame(pedido)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado])

  /* El reloj de la pregunta. Si se acaba, cuenta como mala. */
  useEffect(() => {
    if (!pregunta || elegida !== null) return
    if (restante <= 0) {
      responder('')
      return
    }
    const t = setTimeout(() => setRestante((limite.current - Date.now()) / 1000), 100)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pregunta, elegida, restante])

  const g = m.current
  const hayPieza = g !== null && estado !== 'listo' && estado !== 'fin'
  const modo: Modo = hayPieza ? g.modo : 'normal'

  // Lo que se pinta: el tablero, la sombra de dónde va a caer y la ficha.
  const vista: { tipo: Tipo | null; capa: 'fija' | 'sombra' | 'ficha' }[] = Array.from(
    { length: FILAS * COLUMNAS },
    (_, i) => ({ tipo: g?.tablero[i] ?? null, capa: 'fija' as const }),
  )
  if (hayPieza) {
    const p = g.pieza
    let sombra = p.fila
    while (!choca(g.tablero, p.forma, sombra + 1, p.col)) sombra++
    const pintar = (fila: number, capa: 'sombra' | 'ficha') =>
      p.forma.forEach((r, f) =>
        r.forEach((v, c) => {
          if (v && fila + f >= 0) vista[(fila + f) * COLUMNAS + p.col + c] = { tipo: p.tipo, capa }
        }),
      )
    pintar(sombra, 'sombra')
    pintar(p.fila, 'ficha')
  }

  const nivel = nivelDe(g?.lineas ?? 0)
  const faltan = g ? CADA - (g.piezas % CADA) : CADA
  const puedeCongelar = estado === 'jugando' && g !== null && !g.pregunto && g.modo === 'normal'
  const borde =
    modo === 'congelada'
      ? 'border-[#7dd3fc] shadow-[0_0_24px_#7dd3fc55]'
      : modo === 'turbo'
        ? 'border-[#fb7185] shadow-[0_0_24px_#fb718555]'
        : 'border-[#1e2b45]'

  const sinFoco = (e: React.MouseEvent) => e.preventDefault()
  const botonControl =
    'rounded-xl border border-[#1e2b45] bg-[#0a1120] py-2 text-lg font-black text-[#e2e8ff] transition active:bg-[#16233d] hover:border-[#2f4067]'

  return (
    <main className="mx-auto max-w-3xl px-5 py-6">
      <Confeti activo={fiesta} />

      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          🧱 <span className="text-[#a78bfa]">Tetris</span> de código
        </h1>
        <Link href="/juegos" className="boton boton-secundario">
          ← Juegos
        </Link>
      </header>

      <div className="flex flex-wrap items-start justify-center gap-4">
        <div className="w-[min(100%,40vh,18rem)]">
          <div className={`relative rounded-xl border-2 bg-[#0a1120] p-[3px] transition ${borde}`}>
            <div className="grid select-none gap-px" style={{ gridTemplateColumns: `repeat(${COLUMNAS}, minmax(0, 1fr))` }}>
              {vista.map((c, i) => {
                if (!c.tipo) return <div key={i} className="aspect-square rounded-[3px] bg-[#0d1426]" />
                const color = COLOR[c.tipo]
                if (c.capa === 'sombra')
                  return (
                    <div
                      key={i}
                      className="aspect-square rounded-[3px] border-2 bg-[#0d1426]"
                      style={{ borderColor: `${color}66` }}
                    />
                  )
                const efecto =
                  c.capa === 'ficha' && modo === 'congelada'
                    ? 'ring-2 ring-inset ring-[#e0f2fe]'
                    : c.capa === 'ficha' && modo === 'turbo'
                      ? 'ring-2 ring-inset ring-[#fff1f2]'
                      : ''
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-[3px] ${efecto}`}
                    style={{
                      background: color,
                      boxShadow: 'inset 0 -3px 0 rgba(0,0,0,.3), inset 0 2px 0 rgba(255,255,255,.3)',
                    }}
                  />
                )
              })}
            </div>

            {aviso && (
              <p className="aparecer pointer-events-none absolute inset-x-0 top-1/3 text-center text-2xl font-black text-[#fde68a] drop-shadow-[0_2px_6px_#000]">
                {aviso}
              </p>
            )}

            {estado === 'listo' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-[#070b18]/85 p-4 text-center">
                <p className="text-5xl">🧱</p>
                <p className="text-sm text-[#9fb0d4]">Llena líneas completas para borrarlas. ¡Que no llegue hasta arriba!</p>
                <button onClick={empezar} className="boton boton-primario px-8">
                  Empezar ▶
                </button>
                <p className="text-[11px] text-[#5a6b8f]">o presiona Espacio</p>
              </div>
            )}
            {estado === 'pausa' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-[#070b18]/85 p-4 text-center">
                <p className="text-lg font-black">⏸ En pausa</p>
                <button onClick={pausar} className="boton boton-primario px-8">
                  Seguir ▶
                </button>
                <p className="text-[11px] text-[#5a6b8f]">o presiona P</p>
              </div>
            )}
            {estado === 'fin' && g && (
              <div className="aparecer absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-[#070b18]/90 p-4 text-center">
                <p className="text-lg font-black text-[#fb7185]">Se llenó hasta arriba</p>
                <p className="text-3xl font-black tabular-nums text-[#fde68a]">{g.puntos} puntos</p>
                <p className="text-xs text-[#9fb0d4]">
                  {g.lineas} {g.lineas === 1 ? 'línea' : 'líneas'} · nivel {nivel}
                </p>
                <p className="text-xs font-bold text-[#4ade80]">
                  {recordNuevo ? '🏆 ¡Récord nuevo!' : record !== null ? `Tu récord: ${record}` : ''}
                </p>
                <button onClick={empezar} className="boton boton-primario mt-2 px-8">
                  Otra partida ▶
                </button>
              </div>
            )}
          </div>

          {/* Debajo del tablero y no encima: arriba taparía la ficha que acaba de salir. */}
          <p
            className={`mt-2 flex min-h-8 items-center justify-center rounded-lg px-2 py-1 text-center text-[11px] font-bold ${
              modo === 'congelada'
                ? 'bg-[#0c2233] text-[#bae6fd]'
                : modo === 'turbo'
                  ? 'latir bg-[#2a0f1c] text-[#ffd7e2]'
                  : 'text-transparent'
            }`}
          >
            {modo === 'congelada'
              ? '🧊 Congelada: acomódala y suéltala con Espacio'
              : modo === 'turbo'
                ? '🚀 ¡Turbo! Cae rapidísimo'
                : '·'}
          </p>

          <div className="mt-2 grid grid-cols-5 gap-2">
            <button onMouseDown={sinFoco} onClick={() => accion((j) => mover(j, -1))} className={botonControl} title="Izquierda (←)">
              ←
            </button>
            <button onMouseDown={sinFoco} onClick={() => accion(rotar)} className={botonControl} title="Girar (↑)">
              ↻
            </button>
            <button onMouseDown={sinFoco} onClick={() => accion((j) => mover(j, 1))} className={botonControl} title="Derecha (→)">
              →
            </button>
            <button onMouseDown={sinFoco} onClick={() => accion((j) => bajar(j, true))} className={botonControl} title="Bajar (↓)">
              ↓
            </button>
            <button onMouseDown={sinFoco} onClick={() => accion(soltar)} className={botonControl} title="Soltar (Espacio)">
              ⤓
            </button>
          </div>
        </div>

        <aside className="flex w-full flex-col gap-3 sm:w-44">
          <div className="panel p-3">
            <p className="etiqueta mb-2">Siguiente</p>
            <div className="flex h-10 items-center justify-center">{hayPieza && <Mini tipo={g.bolsa[0]} />}</div>
          </div>

          <div className="panel grid grid-cols-3 gap-2 p-3 text-center sm:grid-cols-1 sm:text-left">
            <div>
              <p className="etiqueta">Puntos</p>
              <p className="text-xl font-black tabular-nums text-[#fde68a]">{g?.puntos ?? 0}</p>
            </div>
            <div>
              <p className="etiqueta">Líneas</p>
              <p className="text-xl font-black tabular-nums text-[#4ade80]">{g?.lineas ?? 0}</p>
            </div>
            <div>
              <p className="etiqueta">Nivel</p>
              <p className="text-xl font-black tabular-nums text-[#22d3ee]">{nivel}</p>
            </div>
          </div>

          <div className="panel p-3">
            <button
              onMouseDown={sinFoco}
              onClick={() => abrirPregunta(false)}
              disabled={!puedeCongelar}
              className="w-full rounded-xl border border-[#7dd3fc]/60 bg-[#0c2233] px-3 py-2 text-xs font-bold text-[#bae6fd] transition enabled:hover:border-[#7dd3fc] disabled:opacity-40"
            >
              🧊 Congelar ficha (C)
            </button>
            <p className="mt-2 text-[11px] leading-snug text-[#8fa1c6]">
              📣 Pregunta sorpresa en <span className="font-bold text-[#e2e8ff]">{faltan}</span>{' '}
              {faltan === 1 ? 'ficha' : 'fichas'}
            </p>
          </div>

          <button
            onMouseDown={sinFoco}
            onClick={pausar}
            disabled={estado !== 'jugando' && estado !== 'pausa'}
            className="boton boton-secundario text-xs disabled:opacity-40"
          >
            {estado === 'pausa' ? '▶ Seguir (P)' : '⏸ Pausa (P)'}
          </button>

          {record !== null && <p className="text-center text-[11px] text-[#5a6b8f]">Récord: {record} puntos</p>}
        </aside>
      </div>

      <details className="panel mx-auto mt-5 max-w-xl p-4 text-xs leading-relaxed text-[#9fb0d4]">
        <summary className="cursor-pointer font-bold text-[#e2e8ff]">¿Cómo se juega?</summary>
        <ul className="mt-2 space-y-1">
          <li>· ← → mueven la ficha, ↑ la gira, ↓ la baja más rápido y Espacio la suelta de una.</li>
          <li>· Cuando llenas una línea de lado a lado, se borra. Cada 10 líneas sube el nivel y todo cae más rápido.</li>
          <li>
            · ¿Una ficha te quedó mal? Presiona C y contesta una pregunta de código en {SEGUNDOS} segundos. Si aciertas, la
            ficha se <b className="text-[#bae6fd]">congela</b> 🧊 en el aire y la acomodas con calma. Si fallas, se pone en{' '}
            <b className="text-[#fb7185]">turbo</b> 🚀 y cae rapidísimo.
          </li>
          <li>· Cada {CADA} fichas sale una pregunta sorpresa, con las mismas reglas.</li>
          <li>· Contestas con clic o con las teclas 1, 2 y 3. Cada pregunta buena da {PUNTOS_PREGUNTA} puntos.</li>
          <li>· P pausa el juego.</li>
        </ul>
      </details>

      {pregunta && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#070b18]/80 px-4 backdrop-blur-sm">
          <div className="panel aparecer w-full max-w-md p-6">
            <div className="mb-1 flex items-center justify-between">
              <p className="etiqueta">{pregunta.sorpresa ? '📣 ¡Pregunta sorpresa!' : '🧊 Pregunta para congelar'}</p>
              <span className={`text-sm font-bold tabular-nums ${restante < 5 ? 'text-[#fb7185]' : 'text-[#fbbf24]'}`}>
                {Math.ceil(Math.max(0, restante))} s
              </span>
            </div>
            <p className="mb-3 text-[11px] text-[#8fa1c6]">Bien: la ficha se congela 🧊 · Mal: se pone en turbo 🚀</p>
            <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#16233d]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#7dd3fc] to-[#a78bfa]"
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
                    ? 'border-[#1e2b45] bg-[#0a1120] hover:border-[#7dd3fc]'
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
                    <span className="rounded border border-[#2f4067] px-1.5 text-xs text-[#8fa1c6]">{k + 1}</span>
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
                  ? '¡Bien! Ficha congelada 🧊'
                  : elegida === ''
                    ? '⏰ Se acabó el tiempo… ¡turbo! 🚀'
                    : 'Esa no era… ¡turbo! 🚀'}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
