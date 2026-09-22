'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ElegirModo, type Configuracion } from '@/components/ElegirModo'
import { Confeti } from '@/components/Confeti'
import { Terminal } from '@/components/Terminal'
import { CARGAS, barajar, revisarCarga, type Carga } from '@/lib/juegos'

/* ------------------------------------------------------------ el juego --- */

const ANCHO = 480
const ALTO = 540
const NAVE_Y = ALTO - 44
const NAVE_ANCHO = 38
const FILAS = 4
const COLUMNAS = 8
const INVASOR = 30
const VIDAS = 3
const BALAS_POR_CARGA = 6
const BALAS_CON_EJEMPLO = 3
const DIBUJOS = ['🛸', '👾', '👽', '👾']

interface Invasor {
  x: number
  y: number
  vivo: boolean
  fila: number
}

interface Mundo {
  naveX: number
  disparos: { x: number; y: number }[]
  bombas: { x: number; y: number }[]
  invasores: Invasor[]
  dir: 1 | -1
  espera: number
  proximaBomba: number
  invencible: number
  teclas: Set<string>
  estrellas: { x: number; y: number; r: number }[]
}

function oleadaNueva(oleada: number): Invasor[] {
  const lista: Invasor[] = []
  for (let f = 0; f < FILAS; f++)
    for (let c = 0; c < COLUMNAS; c++)
      lista.push({ x: 40 + c * 48, y: 60 + f * 40 + Math.min(oleada - 1, 4) * 10, vivo: true, fila: f })
  return lista
}

function mundoNuevo(): Mundo {
  return {
    naveX: ANCHO / 2,
    disparos: [],
    bombas: [],
    invasores: oleadaNueva(1),
    dir: 1,
    espera: 0,
    proximaBomba: 1.5,
    invencible: 0,
    teclas: new Set(),
    estrellas: Array.from({ length: 60 }, () => ({
      x: Math.random() * ANCHO,
      y: Math.random() * ALTO,
      r: Math.random() * 1.4 + 0.3,
    })),
  }
}

type Fase = 'cargando' | 'jugando' | 'fin-turno' | 'final'

interface Marcador {
  puntos: number
  vidas: number
  balas: number
  oleada: number
  cargas: number
}

const MARCADOR_INICIAL: Marcador = { puntos: 0, vidas: VIDAS, balas: 0, oleada: 1, cargas: 0 }

export default function Invasores() {
  const [config, setConfig] = useState<Configuracion | null>(null)
  const [fase, setFase] = useState<Fase>('cargando')
  const [jugador, setJugador] = useState<0 | 1>(0)
  const [resultados, setResultados] = useState<Marcador[]>([])
  const [hud, setHud] = useState<Marcador>(MARCADOR_INICIAL)
  const [motivo, setMotivo] = useState('')
  const [fiesta, setFiesta] = useState(false)

  // Lo de la terminal de recarga.
  const [carga, setCarga] = useState<Carga | null>(null)
  const [codigo, setCodigo] = useState('')
  const [falta, setFalta] = useState<string | null>(null)
  const [conEjemplo, setConEjemplo] = useState(false)
  const [temblor, setTemblor] = useState(0)
  const [pegados, setPegados] = useState(0)

  const lienzo = useRef<HTMLCanvasElement>(null)
  const mundo = useRef<Mundo>(mundoNuevo())
  const marcador = useRef<Marcador>({ ...MARCADOR_INICIAL })
  const mazo = useRef<Carga[]>([])
  const turnosJugados = useRef<Marcador[]>([])

  const sacarCarga = useCallback(() => {
    if (mazo.current.length === 0) mazo.current = barajar(CARGAS)
    setCarga(mazo.current.pop()!)
    setCodigo('')
    setFalta(null)
    setConEjemplo(false)
  }, [])

  const empezarTurno = useCallback(() => {
    mundo.current = mundoNuevo()
    marcador.current = { ...MARCADOR_INICIAL }
    setHud({ ...MARCADOR_INICIAL })
    setMotivo('')
    sacarCarga()
    setFase('cargando')
  }, [sacarCarga])

  function empezar(c: Configuracion) {
    setConfig(c)
    setJugador(0)
    setResultados([])
    turnosJugados.current = []
    setPegados(0)
    empezarTurno()
  }

  const terminarTurno = useCallback(
    (por: string) => {
      setMotivo(por)
      setHud({ ...marcador.current })
      const nuevos = [...turnosJugados.current, { ...marcador.current }]
      turnosJugados.current = nuevos
      setResultados(nuevos)
      setFase(config?.modo !== 'dos' || nuevos.length === 2 ? 'final' : 'fin-turno')
    },
    [config],
  )

  /* ------------------------------------------------------------ dibujar */

  const dibujar = useCallback(() => {
    const ctx = lienzo.current?.getContext('2d')
    if (!ctx) return
    const m = mundo.current

    ctx.fillStyle = '#050816'
    ctx.fillRect(0, 0, ANCHO, ALTO)
    for (const e of m.estrellas) {
      ctx.fillStyle = `rgba(200,220,255,${0.3 + e.r / 3})`
      ctx.fillRect(e.x, e.y, e.r, e.r)
    }

    ctx.font = `${INVASOR - 4}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    for (const inv of m.invasores) if (inv.vivo) ctx.fillText(DIBUJOS[inv.fila], inv.x, inv.y)

    ctx.fillStyle = '#4ade80'
    ctx.shadowColor = '#4ade80'
    ctx.shadowBlur = 10
    for (const d of m.disparos) ctx.fillRect(d.x - 1.5, d.y - 8, 3, 14)
    ctx.shadowBlur = 0

    ctx.fillStyle = '#fb7185'
    for (const b of m.bombas) {
      ctx.beginPath()
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    // La nave parpadea mientras es invencible, después de que la golpean.
    if (m.invencible <= 0 || Math.floor(m.invencible * 10) % 2 === 0) {
      const x = m.naveX
      ctx.fillStyle = marcador.current.balas > 0 ? '#22d3ee' : '#64748b'
      ctx.beginPath()
      ctx.moveTo(x, NAVE_Y - 16)
      ctx.lineTo(x + NAVE_ANCHO / 2, NAVE_Y + 12)
      ctx.lineTo(x, NAVE_Y + 6)
      ctx.lineTo(x - NAVE_ANCHO / 2, NAVE_Y + 12)
      ctx.closePath()
      ctx.fill()
    }

    ctx.strokeStyle = '#1e2b45'
    ctx.beginPath()
    ctx.moveTo(0, NAVE_Y + 20)
    ctx.lineTo(ANCHO, NAVE_Y + 20)
    ctx.stroke()
  }, [])

  useEffect(() => {
    if (config) dibujar()
  }, [config, fase, dibujar])

  /* ------------------------------------------------------ el ciclo vivo */

  useEffect(() => {
    // Sin config es que se fue a "Cambiar modo": el ciclo no puede seguir vivo detrás.
    if (fase !== 'jugando' || !config) return
    const m = mundo.current
    const s = marcador.current
    let pedido = 0
    let antes = performance.now()
    let enfriamiento = 0

    const disparar = () => {
      if (s.balas <= 0 || enfriamiento > 0) return
      s.balas--
      enfriamiento = 0.28
      m.disparos.push({ x: m.naveX, y: NAVE_Y - 16 })
      setHud({ ...s })
    }

    const abajo = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' ', 'a', 'd'].includes(e.key)) e.preventDefault()
      if (e.key === ' ' && !e.repeat) disparar()
      m.teclas.add(e.key)
    }
    const arriba = (e: KeyboardEvent) => m.teclas.delete(e.key)
    window.addEventListener('keydown', abajo)
    window.addEventListener('keyup', arriba)
    // Los botones de la pantalla (para tablet) disparan por aquí.
    const disparoTactil = () => disparar()
    window.addEventListener('invasores:disparo', disparoTactil)

    const paso = (ahora: number) => {
      const dt = Math.min(0.05, (ahora - antes) / 1000)
      antes = ahora
      enfriamiento = Math.max(0, enfriamiento - dt)
      m.invencible = Math.max(0, m.invencible - dt)

      // La nave
      const izq = m.teclas.has('ArrowLeft') || m.teclas.has('a')
      const der = m.teclas.has('ArrowRight') || m.teclas.has('d')
      m.naveX += ((der ? 1 : 0) - (izq ? 1 : 0)) * 300 * dt
      m.naveX = Math.max(NAVE_ANCHO / 2, Math.min(ANCHO - NAVE_ANCHO / 2, m.naveX))

      // Los disparos
      for (const d of m.disparos) d.y -= 460 * dt
      m.disparos = m.disparos.filter((d) => d.y > -10)

      // Los invasores: más rápidos entre menos quedan, y en cada oleada.
      const vivos = m.invasores.filter((i) => i.vivo)
      const velocidad = 22 + s.oleada * 9 + (1 - vivos.length / m.invasores.length) * 55
      let tocaBorde = false
      for (const i of vivos) {
        i.x += m.dir * velocidad * dt
        if (i.x < 20 || i.x > ANCHO - 20) tocaBorde = true
      }
      if (tocaBorde) {
        m.dir = m.dir === 1 ? -1 : 1
        for (const i of vivos) {
          i.x = Math.max(20, Math.min(ANCHO - 20, i.x))
          i.y += 14
        }
      }

      // ¿Le di a alguno?
      for (const d of m.disparos) {
        const golpeado = vivos.find(
          (i) => i.vivo && Math.abs(i.x - d.x) < INVASOR / 2 && Math.abs(i.y - d.y) < INVASOR / 2,
        )
        if (golpeado) {
          golpeado.vivo = false
          d.y = -100
          s.puntos += 10 * s.oleada
          setHud({ ...s })
        }
      }

      // Las bombas de los invasores
      m.proximaBomba -= dt
      if (m.proximaBomba <= 0 && vivos.length) {
        const quien = vivos[Math.floor(Math.random() * vivos.length)]
        m.bombas.push({ x: quien.x, y: quien.y + 12 })
        m.proximaBomba = Math.max(0.55, 1.7 - s.oleada * 0.18) * (0.6 + Math.random() * 0.8)
      }
      for (const b of m.bombas) b.y += (150 + s.oleada * 12) * dt
      m.bombas = m.bombas.filter((b) => b.y < ALTO + 10)

      if (m.invencible <= 0) {
        const pega = m.bombas.find((b) => Math.abs(b.x - m.naveX) < NAVE_ANCHO / 2 && Math.abs(b.y - NAVE_Y) < 14)
        if (pega) {
          s.vidas--
          m.bombas = []
          m.invencible = 1.6
          setHud({ ...s })
          if (s.vidas <= 0) {
            dibujar()
            terminarTurno('Te quedaste sin vidas.')
            return
          }
        }
      }

      // ¿Llegaron abajo?
      if (vivos.some((i) => i.vivo && i.y + INVASOR / 2 >= NAVE_Y - 18)) {
        dibujar()
        terminarTurno('Los invasores llegaron a tu base.')
        return
      }

      // ¿Oleada limpia? Viene otra, más rápida.
      if (m.invasores.every((i) => !i.vivo)) {
        s.oleada++
        s.puntos += 50
        m.invasores = oleadaNueva(s.oleada)
        m.bombas = []
        m.disparos = []
        setHud({ ...s })
      }

      dibujar()

      // Sin balas y sin disparos en el aire: a recargar.
      if (s.balas <= 0 && m.disparos.length === 0) {
        m.teclas.clear()
        sacarCarga()
        setFase('cargando')
        return
      }

      pedido = requestAnimationFrame(paso)
    }
    pedido = requestAnimationFrame(paso)

    return () => {
      cancelAnimationFrame(pedido)
      window.removeEventListener('keydown', abajo)
      window.removeEventListener('keyup', arriba)
      window.removeEventListener('invasores:disparo', disparoTactil)
      m.teclas.clear()
    }
  }, [fase, config, dibujar, sacarCarga, terminarTurno])

  /* --------------------------------------------------------- la recarga */

  function cargarLaser() {
    if (!carga) return
    const problema = revisarCarga(carga, codigo)
    if (problema) {
      setFalta(problema)
      setTemblor((t) => t + 1)
      return
    }
    const s = marcador.current
    s.balas += conEjemplo ? BALAS_CON_EJEMPLO : BALAS_POR_CARGA
    s.cargas++
    setHud({ ...s })
    setFalta(null)
    setFase('jugando')
  }

  function botonTactil(tecla: string, apretado: boolean) {
    if (apretado) mundo.current.teclas.add(tecla)
    else mundo.current.teclas.delete(tecla)
  }

  useEffect(() => {
    if (fase !== 'final' || !config) return
    const r = resultados
    if (config.modo === 'compu' ? (r[0]?.oleada ?? 1) > 1 : true) {
      setFiesta(true)
      setTimeout(() => setFiesta(false), 2600)
    }
  }, [fase, config, resultados])

  /* -------------------------------------------------------------- vista */

  if (!config) {
    return (
      <ElegirModo
        emoji="👾"
        titulo="Invasores del código"
        reglas={[
          'Los invasores bajan. Muévete con ← → y dispara con la barra espaciadora.',
          `Pero tu láser arranca vacío: para cargarlo tienes que escribir 2 o 3 líneas de código. Cada carga te da ${BALAS_POR_CARGA} disparos.`,
          'Mientras escribes, el juego se congela. Aquí no se puede pegar: se escribe con los dedos.',
          `Si te enredas, puedes ver un ejemplo… pero esa carga solo te da ${BALAS_CON_EJEMPLO} disparos.`,
        ]}
        textoCompu="Tú contra la invasión de la compu. Cada oleada llega más rápido."
        textoDos="Por turnos: primero juega uno, después el otro. Gana quien haga más puntos."
        onEmpezar={empezar}
      />
    )
  }

  const nombreActual = config.nombres[jugador]

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <Confeti activo={fiesta} />

      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-black">
          👾 <span className="text-[#22d3ee]">Invasores</span> del código
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

      <div className="grid gap-5 lg:grid-cols-[480px_1fr]">
        {/* ------------------------------------------------------ la pantalla */}
        <section className="mx-auto w-full max-w-[480px]">
          <div className="mb-2 grid grid-cols-4 gap-2 text-center">
            <Dato titulo={config.modo === 'dos' ? nombreActual : 'Puntos'} valor={hud.puntos} color="#fbbf24" />
            <Dato titulo="Vidas" valor={'❤️'.repeat(Math.max(0, hud.vidas)) || '—'} color="#fb7185" />
            <Dato titulo="Láser" valor={hud.balas} color={hud.balas > 0 ? '#22d3ee' : '#64748b'} />
            <Dato titulo="Oleada" valor={hud.oleada} color="#a78bfa" />
          </div>
          <div className="relative overflow-hidden rounded-xl border border-[#1e2b45]">
            <canvas ref={lienzo} width={ANCHO} height={ALTO} className="block h-auto w-full" />
            {fase === 'cargando' && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#050816]/60">
                <p className="latir rounded-xl border border-[#78350f] bg-[#241a08] px-4 py-2 text-sm font-bold text-[#fde8c0]">
                  ⚡ Láser vacío: escribe el código →
                </p>
              </div>
            )}
          </div>
          {/* Controles para tablet / pantalla táctil */}
          <div className="mt-2 flex gap-2 lg:hidden">
            {(
              [
                ['◀', 'ArrowLeft'],
                ['▶', 'ArrowRight'],
              ] as const
            ).map(([t, k]) => (
              <button
                key={k}
                onPointerDown={() => botonTactil(k, true)}
                onPointerUp={() => botonTactil(k, false)}
                onPointerLeave={() => botonTactil(k, false)}
                className="boton boton-secundario flex-1 select-none text-xl"
              >
                {t}
              </button>
            ))}
            <button
              onPointerDown={() => window.dispatchEvent(new Event('invasores:disparo'))}
              className="boton boton-primario flex-1 select-none text-xl"
            >
              🔥
            </button>
          </div>
          <p className="mt-2 text-[11px] text-[#5a6b8f]">← → para moverte · espacio para disparar</p>
        </section>

        {/* ------------------------------------------------ recarga / fin */}
        {/* En pantallas angostas la recarga sube, para no tener que ir a buscarla. */}
        <section className={fase === 'jugando' ? '' : 'order-first lg:order-none'}>
          {fase === 'cargando' && carga && (
            <div className="panel overflow-hidden">
              <div className="barra-ventana">
                <span className="punto bg-[#fb7185]" />
                <span className="punto bg-[#fbbf24]" />
                <span className="punto bg-[#4ade80]" />
                <span className="ml-2 text-xs text-[#7f8fb3]">
                  Recarga del láser · {carga.lang === 'js' ? 'JavaScript' : carga.lang.toUpperCase()}
                  {config.modo === 'dos' ? ` · ${nombreActual}` : ''}
                </span>
              </div>
              <div className="p-4">
                <p className="etiqueta mb-1">Escribe esto en código</p>
                <p className="no-copiar mb-3 text-sm font-bold leading-relaxed text-[#e2e8ff]">{carga.pide}</p>
                {conEjemplo && (
                  <pre className="no-copiar mb-3 rounded-lg border border-[#3f3410] bg-[#1c1708] px-3 py-2 text-xs text-[#fcd34d]">
                    {carga.ejemplo}
                  </pre>
                )}
              </div>
              <div className="h-44 border-y border-[#1e2b45] bg-[#0a1120]">
                <Terminal
                  key={carga.id + hud.cargas + jugador}
                  lang={carga.lang}
                  inicial=""
                  onCambio={setCodigo}
                  onTeclas={() => {}}
                  onPegadoBloqueado={() => {
                    setPegados((n) => n + 1)
                    setFalta('Aquí no se pega: escríbelo tú. 😉')
                  }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 p-4">
                <button onClick={cargarLaser} className="boton boton-primario">
                  ⚡ Cargar láser ({conEjemplo ? BALAS_CON_EJEMPLO : BALAS_POR_CARGA} disparos)
                </button>
                {!conEjemplo && (
                  <button onClick={() => setConEjemplo(true)} className="boton boton-secundario">
                    👀 Ver ejemplo
                  </button>
                )}
                <button onClick={sacarCarga} className="boton boton-secundario">
                  🔄 Otro código
                </button>
              </div>
              {falta && (
                // El key reinicia la animación en cada intento fallido. Va aquí y no en
                // el panel: remontar el panel se llevaría lo que el niño ya escribió.
                <p
                  key={temblor}
                  className="temblar mx-4 mb-4 rounded-lg border border-[#7f1d3a] bg-[#2a0f1c] px-3 py-2 text-xs text-[#ffd7e2]">
                  ✗ {falta}
                </p>
              )}
            </div>
          )}

          {fase === 'jugando' && (
            <div className="panel p-5 text-sm leading-relaxed text-[#9fb0d4]">
              <p className="mb-2 text-base font-bold text-[#4ade80]">⚡ ¡Láser cargado!</p>
              <p>Muévete con ← → y dispara con la barra espaciadora.</p>
              <p className="mt-2">Cuando se acaben los disparos, el juego se congela y vuelves a cargar.</p>
              <p className="mt-4 text-xs text-[#5a6b8f]">Cargas hechas en este turno: {hud.cargas}</p>
            </div>
          )}

          {fase === 'fin-turno' && (
            <div className="panel aparecer p-6 text-center">
              <p className="mb-1 text-sm text-[#fb7185]">{motivo}</p>
              <p className="text-lg font-bold">
                {config.nombres[0]} hizo <span className="text-[#fbbf24]">{resultados[0]?.puntos ?? 0}</span> puntos
              </p>
              <p className="mt-1 text-xs text-[#7f8fb3]">
                Llegó a la oleada {resultados[0]?.oleada} con {resultados[0]?.cargas} cargas de láser.
              </p>
              <button
                onClick={() => {
                  setJugador(1)
                  empezarTurno()
                }}
                className="boton boton-primario mt-5"
              >
                Turno de {config.nombres[1]} ▶
              </button>
            </div>
          )}

          {fase === 'final' && (
            <div className="panel aparecer p-6 text-center">
              <p className="mb-3 text-sm text-[#fb7185]">{motivo}</p>
              {config.modo === 'dos' ? (
                <>
                  <p className="mb-4 text-xl font-black">
                    {resultados[0].puntos === resultados[1].puntos
                      ? '🤝 ¡Empate!'
                      : `🏆 ¡Ganó ${resultados[0].puntos > resultados[1].puntos ? config.nombres[0] : config.nombres[1]}!`}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {resultados.map((r, j) => (
                      <div key={j} className="rounded-xl border border-[#1e2b45] bg-[#0a1120] p-3">
                        <p className="etiqueta">{config.nombres[j]}</p>
                        <p className="text-2xl font-black text-[#fbbf24]">{r.puntos}</p>
                        <p className="text-[10px] text-[#5a6b8f]">
                          oleada {r.oleada} · {r.cargas} cargas
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xl font-black">
                    <span className="text-[#fbbf24]">{resultados[0]?.puntos ?? 0}</span> puntos
                  </p>
                  <p className="mt-1 text-xs text-[#7f8fb3]">
                    Llegaste a la oleada {resultados[0]?.oleada} y cargaste el láser {resultados[0]?.cargas} veces
                    escribiendo código.
                  </p>
                </>
              )}
              {pegados > 0 && (
                <p className="mt-3 text-[11px] text-[#fb7185]">Intentos de pegar bloqueados: {pegados}</p>
              )}
              <button onClick={() => empezar(config)} className="boton boton-primario mt-5">
                Jugar otra vez ▶
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

function Dato({ titulo, valor, color }: { titulo: string; valor: number | string; color: string }) {
  return (
    <div className="panel px-2 py-2">
      <p className="etiqueta truncate">{titulo}</p>
      <p className="truncate text-lg font-black tabular-nums" style={{ color }}>
        {valor}
      </p>
    </div>
  )
}
