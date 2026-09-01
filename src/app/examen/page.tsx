'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Terminal, type TerminalHandle } from '@/components/Terminal'
import { Confeti } from '@/components/Confeti'
import { Aviso, type TonoAviso } from '@/components/Aviso'
import { Runner } from '@/lib/runner'
import { ALL_CHALLENGES, TOTAL, seccionDe } from '@/lib/challenges'
import { difficultyOf, type RunOutcome, type TestResult } from '@/lib/types'
import {
  calcularPuntos,
  insigniaPorId,
  insigniasGanadas,
  progresoNuevo,
  resumen,
  retoVacio,
  slugificar,
  type EstadoReto,
  type Progreso,
  type TipoAyuda,
} from '@/lib/progress'
import { cargarLocal, cargarNube, fusionar, guardarLocal, guardarNube, registrarEvento } from '@/lib/storage'

const NOMBRE_DIFICULTAD = { facil: 'Fácil', medio: 'Medio', dificil: 'Difícil' } as const
const COLOR_DIFICULTAD = {
  facil: 'text-[#4ade80] border-[#166534] bg-[#0d2418]',
  medio: 'text-[#fbbf24] border-[#78350f] bg-[#241a08]',
  dificil: 'text-[#fb7185] border-[#7f1d3a] bg-[#2a0f1c]',
} as const

const BURLAS_AL_PEGAR = [
  '✋ Nada de pegar. Aquí se escribe con los dedos.',
  '🚫 Ese atajo está sellado. Escríbelo, que para eso viniste.',
  '⌨️ Bloqueado. Pregúntale a quien quieras, pero teclea tú.',
  '😏 Buen intento. Ahora escríbelo.',
]

const NOMBRE_ARCHIVO = { html: 'index.html', css: 'estilos.css', js: 'script.js' } as const

export default function Examen() {
  const router = useRouter()

  const [progreso, setProgreso] = useState<Progreso | null>(null)
  const [cargando, setCargando] = useState(true)
  const [codigo, setCodigo] = useState('')
  const [resultado, setResultado] = useState<RunOutcome | null>(null)
  const [ejecutando, setEjecutando] = useState(false)
  const [aviso, setAviso] = useState<{ texto: string; tono: TonoAviso } | null>(null)
  const [verPista, setVerPista] = useState(false)
  const [celebrando, setCelebrando] = useState(false)
  const [insigniasNuevas, setInsigniasNuevas] = useState<string[]>([])
  const [temblando, setTemblando] = useState(false)
  const [pestana, setPestana] = useState<'resultado' | 'consola'>('resultado')

  const anfitrion = useRef<HTMLDivElement>(null)
  const motor = useRef<Runner | null>(null)
  const terminal = useRef<TerminalHandle>(null)
  const inicioReto = useRef<number>(Date.now())
  const teclasReto = useRef(0)
  const temporizadorNube = useRef<number | null>(null)

  const reto = progreso && progreso.indice < TOTAL ? ALL_CHALLENGES[progreso.indice] : null
  const estado: EstadoReto = (reto && progreso && progreso.retos[reto.id]) || retoVacio()
  const seccion = progreso ? seccionDe(Math.min(progreso.indice, TOTAL - 1)) : null
  const terminado = Boolean(progreso && progreso.indice >= TOTAL)

  const avisar = useCallback((texto: string, tono: TonoAviso = 'info') => setAviso({ texto, tono }), [])

  /* ------------------------------------------------------------- arranque */

  useEffect(() => {
    const nombre = localStorage.getItem('examen-web:activo')
    if (!nombre) {
      router.replace('/')
      return
    }
    const slug = slugificar(nombre)
    let vivo = true

    void (async () => {
      const local = cargarLocal(slug)
      const nube = await cargarNube(slug)
      if (!vivo) return
      setProgreso(fusionar(local, nube) ?? progresoNuevo(nombre))
      setCargando(false)
    })()

    return () => {
      vivo = false
    }
  }, [router])

  /* --------------------------------------------------------- persistencia */

  useEffect(() => {
    if (!progreso) return
    guardarLocal(progreso)
    // La nube se actualiza con calma: el alumno no debe esperar por la red.
    if (temporizadorNube.current) window.clearTimeout(temporizadorNube.current)
    temporizadorNube.current = window.setTimeout(() => void guardarNube(progreso), 1200)
  }, [progreso])

  /* -------------------------------------------------------------- motor */

  useEffect(() => {
    if (cargando || !anfitrion.current || motor.current) return
    motor.current = new Runner(anfitrion.current)
    return () => {
      motor.current?.destroy()
      motor.current = null
    }
  }, [cargando])

  /* ---------------------------------------- al cambiar de reto, todo limpio */

  useEffect(() => {
    if (!reto) return
    setCodigo(estado.codigo || reto.starter)
    setResultado(null)
    setVerPista(false)
    setPestana(reto.lang === 'js' && !reto.html ? 'consola' : 'resultado')
    inicioReto.current = Date.now()
    teclasReto.current = 0
    // Depende solo del reto: el resto lo maneja la terminal, que se remonta con key.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reto?.id])

  /* ------------------------------------------------------------ acciones */

  const guardarEstadoReto = useCallback(
    (cambios: Partial<EstadoReto>) => {
      setProgreso((p) => {
        if (!p || !reto) return p
        const previo = p.retos[reto.id] ?? retoVacio()
        return {
          ...p,
          ultimo: new Date().toISOString(),
          retos: { ...p.retos, [reto.id]: { ...previo, ...cambios } },
        }
      })
    },
    [reto],
  )

  const ejecutar = useCallback(async () => {
    if (!reto || !progreso || ejecutando || !motor.current) return
    setEjecutando(true)

    const salida = await motor.current.run({
      lang: reto.lang,
      code: codigo,
      html: reto.html,
      tests: reto.tests,
    })

    setResultado(salida)
    setEjecutando(false)
    if (reto.lang === 'js' && salida.logs.length > 0 && !salida.passed) setPestana('consola')

    const previo = progreso.retos[reto.id] ?? retoVacio()
    const intentos = previo.intentos + 1
    const tiempoMs = previo.tiempoMs + (Date.now() - inicioReto.current)
    const teclas = previo.teclas + teclasReto.current
    inicioReto.current = Date.now()
    teclasReto.current = 0

    if (!salida.passed) {
      setTemblando(true)
      window.setTimeout(() => setTemblando(false), 450)
      guardarEstadoReto({ intentos, tiempoMs, teclas, codigo })
      if (progreso.rachaActual > 0) setProgreso((p) => (p ? { ...p, rachaActual: 0 } : p))
      registrarEvento(
        progreso.slug,
        'fallo',
        reto.id,
        salida.error ?? `${salida.results.filter((r) => !r.ok).length} pruebas sin pasar`,
      )
      return
    }

    /* ---------------------------- lo logró ---------------------------- */
    const limpio = intentos <= 1 && previo.ayudas.length === 0
    const { puntos, bonus } = calcularPuntos({
      n: reto.n,
      intentos,
      ayudas: previo.ayudas,
      rachaAntes: progreso.rachaActual,
    })

    setProgreso((p) => {
      if (!p) return p
      const rachaActual = limpio ? p.rachaActual + 1 : 0
      const siguiente: Progreso = {
        ...p,
        puntos: p.puntos + puntos,
        rachaActual,
        mejorRacha: Math.max(p.mejorRacha, rachaActual),
        ultimo: new Date().toISOString(),
        retos: {
          ...p.retos,
          [reto.id]: {
            ...previo,
            resuelto: true,
            intentos,
            tiempoMs,
            teclas,
            puntos,
            codigo,
            resueltoEn: new Date().toISOString(),
          },
        },
      }
      const ganadas = insigniasGanadas(siguiente, reto.id)
      if (ganadas.length) setInsigniasNuevas(ganadas)
      return { ...siguiente, insignias: [...siguiente.insignias, ...ganadas] }
    })

    setCelebrando(true)
    window.setTimeout(() => setCelebrando(false), 2600)
    avisar(`✅ ¡Correcto! +${puntos} puntos${bonus.length ? ' · ' + bonus.join(' · ') : ''}`, 'bien')
    registrarEvento(progreso.slug, 'resuelto', reto.id, `${intentos} intento(s)`)
  }, [reto, progreso, ejecutando, codigo, guardarEstadoReto, avisar])

  const siguiente = useCallback(() => {
    setProgreso((p) => (p ? { ...p, indice: Math.min(p.indice + 1, TOTAL) } : p))
  }, [])

  const usarComodin = useCallback(
    (tipo: TipoAyuda) => {
      if (!reto || !progreso) return
      const previo = progreso.retos[reto.id] ?? retoVacio()
      const yaPagada = previo.ayudas.includes(tipo)

      if (!yaPagada && progreso.comodines[reto.lang] <= 0) {
        avisar(`Ya gastaste tus 3 comodines de ${reto.lang.toUpperCase()}. Este tramo lo sacas solo. 💪`, 'alerta')
        return
      }

      if (!yaPagada) {
        setProgreso((p) =>
          p
            ? {
                ...p,
                comodines: { ...p.comodines, [reto.lang]: p.comodines[reto.lang] - 1 },
                retos: { ...p.retos, [reto.id]: { ...previo, ayudas: [...previo.ayudas, tipo] } },
              }
            : p,
        )
        registrarEvento(progreso.slug, tipo === 'saltar' ? 'salto' : 'ayuda', reto.id, tipo)
      }

      if (tipo === 'pista') {
        setVerPista(true)
      } else if (tipo === 'esqueleto') {
        terminal.current?.reemplazar(reto.skeleton)
        setCodigo(reto.skeleton)
        avisar('Ahí tienes el esqueleto. Los guiones bajos los llenas tú.', 'info')
      } else {
        setProgreso((p) =>
          p
            ? {
                ...p,
                indice: Math.min(p.indice + 1, TOTAL),
                rachaActual: 0,
                retos: {
                  ...p.retos,
                  [reto.id]: {
                    ...previo,
                    saltado: true,
                    ayudas: previo.ayudas.includes('saltar') ? previo.ayudas : [...previo.ayudas, 'saltar'],
                    codigo,
                  },
                },
              }
            : p,
        )
        avisar('Reto saltado. Queda marcado como no resuelto y vale 0 puntos.', 'alerta')
      }
    },
    [reto, progreso, codigo, avisar],
  )

  const pegadoBloqueado = useCallback(() => {
    avisar(BURLAS_AL_PEGAR[Math.floor(Math.random() * BURLAS_AL_PEGAR.length)], 'alerta')
    setTemblando(true)
    window.setTimeout(() => setTemblando(false), 450)
    if (progreso && reto) registrarEvento(progreso.slug, 'pegado-bloqueado', reto.id)
  }, [avisar, progreso, reto])

  /*
   * Guarda lo que va escribiendo, sin esperar a que ejecute. En un salón un
   * refresco accidental es cuestión de tiempo, y perder diez minutos de tecleo
   * por eso sería exactamente el castigo equivocado.
   */
  useEffect(() => {
    if (!reto || codigo === (estado.codigo || reto.starter)) return
    const t = window.setTimeout(() => guardarEstadoReto({ codigo }), 1500)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo, reto?.id])

  /*
   * Ctrl/Cmd + Enter ejecuta, como en cualquier editor de verdad.
   * Va en fase de captura y corta la propagación a propósito: si no, la
   * terminal atiende el Enter primero y mete un salto de línea justo antes de
   * ejecutar, dejando una línea suelta al final del código del alumno.
   */
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        void ejecutar()
      }
    }
    window.addEventListener('keydown', alTeclear, true)
    return () => window.removeEventListener('keydown', alTeclear, true)
  }, [ejecutar])

  const bloquearCopia = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault()
      avisar('📋 El enunciado no se copia. Si se lo vas a preguntar a alguien, escríbelo tú.', 'alerta')
      if (progreso && reto) registrarEvento(progreso.slug, 'copia-bloqueada', reto.id)
    },
    [avisar, progreso, reto],
  )

  /* --------------------------------------------------------------- vista */

  const hayVistaPrevia = Boolean(reto && (reto.lang !== 'js' || reto.html))
  const vistaVisible = hayVistaPrevia && pestana === 'resultado'
  const avance = progreso ? resumen(progreso) : null
  const fallidas = useMemo(() => (resultado ? resultado.results.filter((r) => !r.ok) : []), [resultado])

  if (cargando || !progreso || !avance) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-[#7f8fb3]">Cargando tu progreso…</p>
      </main>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Confeti activo={celebrando} />
      <Aviso mensaje={aviso?.texto ?? null} tono={aviso?.tono} onCerrar={() => setAviso(null)} />

      <BarraSuperior
        progreso={progreso}
        avance={avance}
        seccion={seccion!}
        onSalir={() => router.push('/')}
      />

      {terminado || !reto ? (
        <Final progreso={progreso} />
      ) : (
        <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 overflow-auto p-3 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)_minmax(300px,400px)] lg:overflow-hidden">
          {/* ------------------------------------------------- el enunciado */}
          <section className="panel flex min-h-0 flex-col overflow-hidden">
            <BarraVentana nombre="enunciado.txt" />

            <div
              className="no-copiar min-h-0 flex-1 overflow-auto p-5"
              onCopy={bloquearCopia}
              onCut={bloquearCopia}
              onContextMenu={bloquearCopia}
              onDragStart={bloquearCopia}
            >
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-md border border-[#1e2b45] bg-[#101a2e] px-2 py-1 text-[10px] font-bold tracking-wider text-[#22d3ee]">
                  {seccion!.emoji} {seccion!.nombre} {reto.n}/25
                </span>
                <span
                  className={`rounded-md border px-2 py-1 text-[10px] font-bold tracking-wider ${COLOR_DIFICULTAD[difficultyOf(reto.n)]}`}
                >
                  {NOMBRE_DIFICULTAD[difficultyOf(reto.n)]}
                </span>
                {estado.intentos > 0 && (
                  <span className="text-[10px] text-[#5a6b8f]">
                    {estado.intentos} intento{estado.intentos === 1 ? '' : 's'}
                  </span>
                )}
              </div>

              <h1 className="mb-3 text-xl font-black leading-tight text-[#e8eeff]">{reto.title}</h1>
              <p className="mb-5 text-sm leading-relaxed text-[#a9bad9]">{reto.brief}</p>

              <p className="etiqueta mb-2">Tiene que cumplir</p>
              <ul className="space-y-1.5">
                {reto.goal.map((g, i) => (
                  <li key={i} className="flex gap-2 text-sm leading-snug text-[#9fb0d4]">
                    <span className="mt-0.5 text-[#4ade80]">▸</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>

              {verPista && (
                <div className="aparecer mt-5 rounded-xl border border-[#78350f] bg-[#241a08] p-4">
                  <p className="etiqueta mb-1.5 text-[#fbbf24]">💡 Pista</p>
                  <p className="text-sm leading-relaxed text-[#fde8c0]">{reto.hint}</p>
                </div>
              )}

              {reto.html && (
                <div className="mt-5">
                  <p className="etiqueta mb-2">Este HTML ya existe, no lo escribas</p>
                  <pre className="max-h-52 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-[#1e2b45] bg-[#0a1120] p-3 text-[11px] leading-relaxed text-[#7dd3fc]">
                    {reto.htmlVisible ?? reto.html}
                  </pre>
                </div>
              )}
            </div>

            <Comodines restantes={progreso.comodines[reto.lang]} yaUsadas={estado.ayudas} onUsar={usarComodin} />
          </section>

          {/* -------------------------------------------------- la terminal */}
          <section className={`panel flex min-h-[360px] flex-col overflow-hidden lg:min-h-0 ${temblando ? 'temblar' : ''}`}>
            <BarraVentana nombre={NOMBRE_ARCHIVO[reto.lang]} nota="aquí no se pega" />

            <div className="min-h-0 flex-1 overflow-hidden bg-[#0a1120]">
              <Terminal
                key={reto.id}
                ref={terminal}
                lang={reto.lang}
                inicial={estado.codigo || reto.starter}
                onCambio={setCodigo}
                onTeclas={(n) => {
                  teclasReto.current += n
                }}
                onPegadoBloqueado={pegadoBloqueado}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-[#1e2b45] p-3">
              <button
                onClick={() => {
                  terminal.current?.reemplazar(reto.starter)
                  setCodigo(reto.starter)
                  setResultado(null)
                }}
                className="boton boton-secundario"
              >
                Empezar de nuevo
              </button>

              <span className="hidden text-[10px] text-[#3f5074] sm:block">Ctrl + Enter</span>

              {estado.resuelto ? (
                <button onClick={siguiente} className="boton boton-primario latir ml-auto">
                  Siguiente reto →
                </button>
              ) : (
                <button onClick={() => void ejecutar()} disabled={ejecutando} className="boton boton-primario ml-auto">
                  {ejecutando ? 'Probando…' : '▶ Ejecutar y probar'}
                </button>
              )}
            </div>
          </section>

          {/* ------------------------------------------------- el resultado */}
          <section className="panel flex min-h-[320px] flex-col overflow-hidden lg:min-h-0">
            <div className="flex border-b border-[#1e2b45]">
              {hayVistaPrevia && (
                <BotonPestana activa={pestana === 'resultado'} onClick={() => setPestana('resultado')}>
                  Resultado
                </BotonPestana>
              )}
              {reto.lang === 'js' && (
                <BotonPestana activa={pestana === 'consola'} onClick={() => setPestana('consola')}>
                  Consola{resultado?.logs.length ? ` (${resultado.logs.length})` : ''}
                </BotonPestana>
              )}
              <span className="ml-auto self-center pr-3 text-[10px] text-[#3f5074]">
                {reto.tests.length} prueba{reto.tests.length === 1 ? '' : 's'}
              </span>
            </div>

            <div className="relative min-h-0 flex-1 overflow-hidden">
              {/*
                Este div es el iframe donde corre el código. Nunca se desmonta:
                cuando no toca mostrarlo se va fuera de la pantalla pero conserva
                un tamaño real, porque un iframe sin tamaño no calcula estilos y
                los retos de CSS dejarían de poder revisarse.
              */}
              <div
                ref={anfitrion}
                className={
                  vistaVisible
                    ? 'h-full w-full bg-white'
                    : 'pointer-events-none fixed left-[-10000px] top-0 h-[420px] w-[680px]'
                }
              />
              {!vistaVisible && <Consola logs={resultado?.logs ?? []} lang={reto.lang} />}
            </div>

            <Pruebas resultado={resultado} fallidas={fallidas} total={reto.tests.length} />
          </section>
        </main>
      )}

      {insigniasNuevas.length > 0 && <ModalInsignias ids={insigniasNuevas} onCerrar={() => setInsigniasNuevas([])} />}
    </div>
  )
}

/* ========================================================================== */

function BarraVentana({ nombre, nota }: { nombre: string; nota?: string }) {
  return (
    <div className="barra-ventana">
      <span className="punto bg-[#fb7185]" />
      <span className="punto bg-[#fbbf24]" />
      <span className="punto bg-[#4ade80]" />
      <span className="ml-2 text-xs text-[#7f8fb3]">{nombre}</span>
      {nota && <span className="ml-auto text-[10px] text-[#3f5074]">{nota}</span>}
    </div>
  )
}

function BotonPestana({
  activa,
  onClick,
  children,
}: {
  activa: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-xs font-bold tracking-wide transition-colors ${
        activa ? 'border-b-2 border-[#4ade80] text-[#4ade80]' : 'text-[#5a6b8f] hover:text-[#9fb0d4]'
      }`}
    >
      {children}
    </button>
  )
}

function BarraSuperior({
  progreso,
  avance,
  seccion,
  onSalir,
}: {
  progreso: Progreso
  avance: ReturnType<typeof resumen>
  seccion: { nombre: string; emoji: string }
  onSalir: () => void
}) {
  return (
    <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#1e2b45] bg-[#0a1020]/85 px-4 py-2.5 backdrop-blur">
      <span className="text-sm font-black tracking-tight">
        <span className="text-[#4ade80]">ARENA</span>
        <span className="text-[#22d3ee]">·</span>
        <span className="text-[#7f8fb3]">{progreso.nombre}</span>
      </span>

      <div className="flex min-w-[140px] flex-1 items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#16213a]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4ade80] to-[#22d3ee] transition-[width] duration-500"
            style={{ width: `${avance.porcentaje}%` }}
          />
        </div>
        <span className="text-[11px] tabular-nums text-[#7f8fb3]">
          {avance.resueltos}/{avance.total}
        </span>
      </div>

      <span className="text-xs text-[#7f8fb3]">
        {seccion.emoji} {seccion.nombre}
      </span>
      <span className="text-xs font-bold tabular-nums text-[#fbbf24]">{progreso.puntos} pts</span>
      {progreso.rachaActual > 0 && <span className="text-xs font-bold text-[#fb7185]">🔥 {progreso.rachaActual}</span>}
      <span className="text-xs text-[#a78bfa]" title="Comodines que te quedan: HTML / CSS / JS">
        🎁 {progreso.comodines.html}/{progreso.comodines.css}/{progreso.comodines.js}
      </span>
      {progreso.insignias.length > 0 && (
        <span className="text-xs" title={progreso.insignias.map((i) => insigniaPorId(i)?.nombre).join(', ')}>
          {progreso.insignias.map((i) => insigniaPorId(i)?.emoji).join('')}
        </span>
      )}
      <button onClick={onSalir} className="text-xs text-[#5a6b8f] hover:text-[#fb7185]">
        Salir
      </button>
    </header>
  )
}

const OPCIONES_COMODIN: { tipo: TipoAyuda; emoji: string; nombre: string; costo: string }[] = [
  { tipo: 'pista', emoji: '💡', nombre: 'Pista', costo: '−25% pts' },
  { tipo: 'esqueleto', emoji: '🦴', nombre: 'Media respuesta', costo: '−50% pts' },
  { tipo: 'saltar', emoji: '⏭️', nombre: 'Saltar', costo: '0 pts' },
]

function Comodines({
  restantes,
  yaUsadas,
  onUsar,
}: {
  restantes: number
  yaUsadas: TipoAyuda[]
  onUsar: (t: TipoAyuda) => void
}) {
  return (
    <div className="border-t border-[#1e2b45] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="etiqueta">Comodines de esta sección</span>
        <span className="text-[11px] text-[#a78bfa]">
          {restantes > 0 ? '🎁'.repeat(restantes) : <span className="text-[#5a6b8f]">se acabaron</span>}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {OPCIONES_COMODIN.map((o) => {
          const usada = yaUsadas.includes(o.tipo)
          const bloqueada = restantes <= 0 && !usada
          return (
            <button
              key={o.tipo}
              onClick={() => onUsar(o.tipo)}
              disabled={bloqueada}
              title={bloqueada ? 'Ya no te quedan comodines en esta sección' : `${o.nombre} · ${o.costo}`}
              className={`rounded-lg border px-1.5 py-2 text-center transition-colors ${
                usada
                  ? 'border-[#5b21b6] bg-[#1e1338] text-[#c4b5fd]'
                  : bloqueada
                    ? 'cursor-not-allowed border-[#1a2438] bg-[#0c1322] text-[#3f5074]'
                    : 'border-[#1e2b45] bg-[#101a2e] text-[#9fb0d4] hover:border-[#a78bfa] hover:text-[#c4b5fd]'
              }`}
            >
              <span className="block text-base leading-none">{o.emoji}</span>
              <span className="mt-1 block text-[10px] font-bold leading-tight">{o.nombre}</span>
              <span className="block text-[9px] text-[#5a6b8f]">{usada ? 'ya usada' : o.costo}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Consola({ logs, lang }: { logs: string[]; lang: string }) {
  return (
    <div className="absolute inset-0 overflow-auto bg-[#060a14] p-3 text-[12.5px] leading-relaxed">
      {logs.length === 0 ? (
        <p className="text-[#3f5074]">
          {lang === 'js'
            ? 'Aquí sale todo lo que imprimas con console.log. Dale a Ejecutar.'
            : 'Este reto no imprime nada en la consola.'}
        </p>
      ) : (
        logs.map((l, i) => (
          <div key={i} className="flex gap-2 border-b border-[#0f1729] py-1 last:border-0">
            <span className="w-6 shrink-0 select-none text-right tabular-nums text-[#2c3a5a]">{i + 1}</span>
            <span className="whitespace-pre-wrap break-words text-[#c9f7d8]">{l}</span>
          </div>
        ))
      )}
    </div>
  )
}

function Pruebas({
  resultado,
  fallidas,
  total,
}: {
  resultado: RunOutcome | null
  fallidas: TestResult[]
  total: number
}) {
  if (!resultado) {
    return (
      <div className="border-t border-[#1e2b45] p-4 text-xs leading-relaxed text-[#5a6b8f]">
        Cuando le des a <span className="text-[#4ade80]">Ejecutar</span>, tu código corre de verdad y aquí te digo qué
        falta. Son {total} prueba{total === 1 ? '' : 's'}.
      </div>
    )
  }

  if (resultado.error) {
    return (
      <div className="max-h-[45%] overflow-auto border-t border-[#7f1d3a] bg-[#1c0a13] p-4">
        <p className="etiqueta mb-1.5 text-[#fb7185]">
          {resultado.timedOut ? '⏱️ Se quedó colgado' : '💥 Tu código dio error'}
        </p>
        <p className="whitespace-pre-wrap break-words text-xs leading-relaxed text-[#ffd7e2]">{resultado.error}</p>
      </div>
    )
  }

  const pasadas = resultado.results.length - fallidas.length

  return (
    <div className="max-h-[45%] overflow-auto border-t border-[#1e2b45] p-3">
      <p className={`mb-2 text-xs font-bold ${resultado.passed ? 'text-[#4ade80]' : 'text-[#fbbf24]'}`}>
        {resultado.passed
          ? '✅ ¡Todas las pruebas pasaron!'
          : `${pasadas} de ${resultado.results.length} pruebas bien`}
      </p>
      {resultado.passed ? (
        <p className="text-xs text-[#8fa1c6]">Dale a “Siguiente reto” para continuar.</p>
      ) : (
        <ul className="space-y-1.5">
          {fallidas.map((f, i) => (
            <li key={i} className="flex gap-2 rounded-lg border border-[#2a1420] bg-[#170d16] px-2.5 py-2">
              <span className="text-[#fb7185]">✕</span>
              <span className="text-xs leading-snug text-[#ffd7e2]">{f.msg}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ModalInsignias({ ids, onCerrar }: { ids: string[]; onCerrar: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4" onClick={onCerrar}>
      <div className="aparecer panel max-w-sm p-7 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="etiqueta mb-4 text-[#fbbf24]">Insignia desbloqueada</p>
        {ids.map((id) => {
          const ins = insigniaPorId(id)
          if (!ins) return null
          return (
            <div key={id} className="mb-4">
              <div className="mb-1 text-5xl">{ins.emoji}</div>
              <p className="text-lg font-black text-[#e8eeff]">{ins.nombre}</p>
              <p className="text-xs text-[#8fa1c6]">{ins.descripcion}</p>
            </div>
          )
        })}
        <button onClick={onCerrar} className="boton boton-primario mt-2 w-full">
          ¡Seguir!
        </button>
      </div>
    </div>
  )
}

function Final({ progreso }: { progreso: Progreso }) {
  const r = resumen(progreso)
  const minutos = Math.round(Object.values(progreso.retos).reduce((s, x) => s + x.tiempoMs, 0) / 60000)

  return (
    <main className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-6">
      <div className="panel max-w-lg p-8 text-center">
        <div className="mb-3 text-6xl">🏁</div>
        <h1 className="mb-2 text-3xl font-black text-[#e8eeff]">Terminaste el examen</h1>
        <p className="mb-6 text-sm text-[#8fa1c6]">
          {progreso.nombre}, estuviste {minutos} minutos escribiendo código y llegaste hasta el final.
        </p>

        <div className="mb-6 grid grid-cols-3 gap-3">
          <Dato valor={String(progreso.puntos)} etiqueta="puntos" color="text-[#fbbf24]" />
          <Dato valor={`${r.resueltos}/${r.total}`} etiqueta="resueltos" color="text-[#4ade80]" />
          <Dato valor={String(progreso.mejorRacha)} etiqueta="mejor racha" color="text-[#fb7185]" />
        </div>

        {r.saltados > 0 && (
          <p className="mb-5 rounded-lg border border-[#78350f] bg-[#241a08] px-3 py-2 text-xs text-[#fde8c0]">
            Saltaste {r.saltados} reto{r.saltados === 1 ? '' : 's'}. Vale la pena volver por {r.saltados === 1 ? 'ese' : 'esos'}.
          </p>
        )}

        {progreso.insignias.length > 0 && (
          <div className="mb-6">
            <p className="etiqueta mb-2">Insignias</p>
            <div className="flex flex-wrap justify-center gap-2">
              {progreso.insignias.map((id) => {
                const ins = insigniaPorId(id)
                return ins ? (
                  <span
                    key={id}
                    title={ins.descripcion}
                    className="rounded-lg border border-[#1e2b45] bg-[#101a2e] px-2.5 py-1.5 text-xs"
                  >
                    {ins.emoji} {ins.nombre}
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}

        <Ranking yo={progreso.nombre} />

        <a href="/" className="boton boton-primario mt-6 inline-block">
          Volver al inicio
        </a>
      </div>
    </main>
  )
}

/**
 * Tabla de posiciones del salón. Solo aparece si Supabase está conectado:
 * sin nube no hay con quién compararse, y una tabla de un solo nombre no es
 * una tabla, es un espejo.
 */
function Ranking({ yo }: { yo: string }) {
  const [filas, setFilas] = useState<{ nombre: string; puntos: number; resueltos: number }[] | null>(null)

  useEffect(() => {
    void fetch('/api/ranking', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setFilas(d?.nube ? (d.ranking ?? []) : []))
      .catch(() => setFilas([]))
  }, [])

  if (!filas || filas.length < 2) return null

  return (
    <div className="mt-2 text-left">
      <p className="etiqueta mb-2 text-center">Tabla del salón</p>
      <ol className="space-y-1">
        {filas.slice(0, 10).map((f, i) => (
          <li
            key={f.nombre + i}
            className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-xs ${
              f.nombre === yo ? 'bg-[#0d2418] text-[#c9f7d8]' : 'text-[#8fa1c6]'
            }`}
          >
            <span className="w-5 text-right tabular-nums text-[#5a6b8f]">{i + 1}</span>
            <span className="flex-1 truncate">{f.nombre}</span>
            <span className="tabular-nums text-[#5a6b8f]">{f.resueltos}/75</span>
            <span className="w-16 text-right font-bold tabular-nums text-[#fbbf24]">{f.puntos}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Dato({ valor, etiqueta, color }: { valor: string; etiqueta: string; color: string }) {
  return (
    <div className="rounded-xl border border-[#1e2b45] bg-[#0d1426] p-3">
      <div className={`text-2xl font-black tabular-nums ${color}`}>{valor}</div>
      <div className="etiqueta mt-0.5">{etiqueta}</div>
    </div>
  )
}
