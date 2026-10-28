'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Terminal } from '@/components/Terminal'
import { Aviso, type TonoAviso } from '@/components/Aviso'
import { ConCodigo } from '@/components/cursos/Explicacion'
import { explicarError } from '@/lib/cursos/errores'
import { motorDe, type EstadoMotor } from '@/lib/cursos/motor'
import type { Resultado } from '@/lib/cursos/calificar'
import { EXAMEN_PYTHON } from '@/lib/examen/python-basico'
import { contestada, ordenDeOpciones } from '@/lib/examen/puntuar'
import type { Pregunta, Respuesta } from '@/lib/examen/tipos'
import { slugificar } from '@/lib/progress'

const EXAMEN = EXAMEN_PYTHON
const PREGUNTAS = EXAMEN.preguntas
const CIERRE = Date.parse(EXAMEN.cierre)
const LLAVE_LOCAL = `examen-curso:${EXAMEN.id}`

type Fase = 'cargando' | 'portada' | 'examen' | 'entregado' | 'cerrado' | 'yaTermino'

interface Contadores {
  salidas: number
  segundos_fuera: number
  pegados: number
  capturas: number
  teclas: number
}

/** Lo que se guarda en este computador: para retomar si se recarga y para no dejar presentarlo dos veces. */
interface Local {
  slug: string
  nombre: string
  terminado?: boolean
  respuestas: Record<string, Respuesta>
}

const CERO: Contadores = { salidas: 0, segundos_fuera: 0, pegados: 0, capturas: 0, teclas: 0 }

function leerLocal(): Local | null {
  try {
    const t = localStorage.getItem(LLAVE_LOCAL)
    return t ? (JSON.parse(t) as Local) : null
  } catch {
    return null
  }
}

function guardarLocal(l: Local) {
  try {
    localStorage.setItem(LLAVE_LOCAL, JSON.stringify(l))
  } catch {
    /* sin almacenamiento: la nube igual guarda */
  }
}

async function pedir(cuerpo: Record<string, unknown>, keepalive = false) {
  const r = await fetch('/api/examen', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ examen: EXAMEN.id, ...cuerpo }),
    keepalive,
  })
  return r.json()
}

function reloj(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const ss = String(s % 60).padStart(2, '0')
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`
}

/** Nombre y al menos un apellido, cada uno de dos letras o más. */
function nombreCompleto(n: string) {
  return n.trim().split(/\s+/).filter((p) => p.replace(/[^\p{L}]/gu, '').length >= 2).length >= 2
}

export default function ExamenPython() {
  const [fase, setFase] = useState<Fase>('cargando')
  const [nombre, setNombre] = useState('')
  const [slug, setSlug] = useState('')
  const [aceptado, setAceptado] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const [respuestas, setRespuestas] = useState<Record<string, Respuesta>>({})
  const [contadores, setContadores] = useState<Contadores>(CERO)
  const [actual, setActual] = useState(0)
  const [inicio, setInicio] = useState(0)
  const [fin, setFin] = useState(0)
  const [desfase, setDesfase] = useState(0)
  const [ahora, setAhora] = useState(() => Date.now())
  const [confirmar, setConfirmar] = useState(false)
  const [tapado, setTapado] = useState(false)
  const [aviso, setAviso] = useState<{ texto: string; tono: TonoAviso } | null>(null)
  const [motor, setMotor] = useState<EstadoMotor>('apagado')

  // Lo último, para guardar desde los temporizadores sin depender del render.
  const ultimo = useRef({ slug, nombre, respuestas, contadores })
  ultimo.current = { slug, nombre, respuestas, contadores }
  const terminando = useRef(false)

  const avisar = useCallback((texto: string, tono: TonoAviso = 'alerta') => setAviso({ texto, tono }), [])
  const enHoraDelServidor = ahora + desfase

  /* ------------------------------------------------------------- arranque */

  const python = motorDe('python')
  useEffect(() => python.escuchar(setMotor), [python])
  useEffect(() => {
    void python.arrancar().catch(() => {})
  }, [python])

  const abrir = useCallback(
    async (slugAbrir: string, nombreAbrir: string) => {
      setEnviando(true)
      setError('')
      try {
        const d = await pedir({ accion: 'empezar', slug: slugAbrir, nombre: nombreAbrir })
        if (d.error) throw new Error(d.error)
        if (d.ahora) setDesfase(Date.parse(d.ahora) - Date.now())
        const local = leerLocal()
        if (d.yaTermino) {
          guardarLocal({ slug: slugAbrir, nombre: d.presentacion?.nombre ?? nombreAbrir, terminado: true, respuestas: {} })
          setNombre(d.presentacion?.nombre ?? nombreAbrir)
          setFase('yaTermino')
          return
        }
        if (d.cerrado) {
          setFase('cerrado')
          return
        }
        const p = d.presentacion
        // Si la nube perdió algo (se fue el internet un rato), se completa con lo de este computador.
        const deLaNube: Record<string, Respuesta> = p?.respuestas ?? {}
        const deAqui = local?.slug === slugAbrir ? local.respuestas : {}
        const juntas = { ...deAqui, ...deLaNube }
        setSlug(slugAbrir)
        setNombre(p?.nombre ?? nombreAbrir)
        setRespuestas(juntas)
        setContadores(
          p
            ? { salidas: p.salidas, segundos_fuera: p.segundos_fuera, pegados: p.pegados, capturas: p.capturas, teclas: p.teclas }
            : CERO,
        )
        setInicio(p ? Date.parse(p.inicio) : Date.now() + (d.ahora ? Date.parse(d.ahora) - Date.now() : 0))
        guardarLocal({ slug: slugAbrir, nombre: p?.nombre ?? nombreAbrir, respuestas: juntas })
        const pendiente = PREGUNTAS.findIndex((q) => !contestada(q, juntas[q.id]))
        setActual(pendiente === -1 ? 0 : pendiente)
        setFase('examen')
        if (d.retomado) avisar('Seguiste donde ibas. El reloj no se detuvo.', 'info')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'No se pudo conectar. Revisa el internet e inténtalo otra vez.')
        setFase((f) => (f === 'cargando' ? 'portada' : f))
      } finally {
        setEnviando(false)
      }
    },
    [avisar],
  )

  // Al abrir la página: si este computador ya lo entregó, no se deja volver; si lo estaba presentando, se retoma.
  useEffect(() => {
    const local = leerLocal()
    if (local?.terminado) {
      setNombre(local.nombre)
      setFase('yaTermino')
    } else if (local?.slug) {
      void abrir(local.slug, local.nombre)
    } else {
      setFase(Date.now() >= CIERRE ? 'cerrado' : 'portada')
    }
  }, [abrir])

  /* -------------------------------------------------------------- guardar */

  const guardar = useCallback(async (accion: 'guardar' | 'terminar', keepalive = false) => {
    const u = ultimo.current
    if (!u.slug) return null
    guardarLocal({ slug: u.slug, nombre: u.nombre, respuestas: u.respuestas, terminado: accion === 'terminar' || undefined })
    try {
      return await pedir({ accion, slug: u.slug, respuestas: u.respuestas, ...u.contadores }, keepalive)
    } catch {
      return null
    }
  }, [])

  const terminar = useCallback(
    async (porCierre: boolean) => {
      if (terminando.current) return
      terminando.current = true
      setConfirmar(false)
      setEnviando(true)
      let d = await guardar('terminar')
      // Un reintento por si el internet parpadeó justo en ese momento.
      if (!d) d = await guardar('terminar')
      setEnviando(false)
      const u = ultimo.current
      guardarLocal({ slug: u.slug, nombre: u.nombre, respuestas: u.respuestas, terminado: true })
      setFin(Date.now() + desfase)
      setFase('entregado')
      if (porCierre) avisar('Se acabó el tiempo: el examen se entregó solo con lo que llevabas.', 'info')
    },
    [guardar, desfase, avisar],
  )

  // Guarda poquito después de cada cambio, y cada 20 segundos de todos modos (para los contadores).
  useEffect(() => {
    if (fase !== 'examen') return
    const t = window.setTimeout(() => void guardar('guardar'), 2000)
    return () => window.clearTimeout(t)
  }, [respuestas, contadores, fase, guardar])

  useEffect(() => {
    if (fase !== 'examen') return
    const t = window.setInterval(() => void guardar('guardar'), 20000)
    return () => window.clearInterval(t)
  }, [fase, guardar])

  // El reloj, y el cierre automático a la hora.
  useEffect(() => {
    if (fase !== 'examen' && fase !== 'portada') return
    const t = window.setInterval(() => setAhora(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [fase])

  useEffect(() => {
    if (fase === 'examen' && enHoraDelServidor >= CIERRE) void terminar(true)
    if (fase === 'portada' && enHoraDelServidor >= CIERRE) setFase('cerrado')
  }, [fase, enHoraDelServidor, terminar])

  /* ------------------------------------------------- vigilancia del examen */

  useEffect(() => {
    if (fase !== 'examen') return
    let fueraDesde: number | null = null

    const salir = () => {
      if (fueraDesde !== null) return
      fueraDesde = Date.now()
      setTapado(true)
      void guardar('guardar', true)
    }
    const volver = () => {
      if (fueraDesde === null || document.visibilityState === 'hidden' || !document.hasFocus()) return
      const segundos = Math.round((Date.now() - fueraDesde) / 1000)
      fueraDesde = null
      setTapado(false)
      // Un parpadeo de menos de un segundo no es haberse ido.
      if (segundos < 1) return
      setContadores((c) => {
        const n = { ...c, salidas: c.salidas + 1, segundos_fuera: c.segundos_fuera + segundos }
        avisar(`Saliste de la página del examen (${n.salidas} ${n.salidas === 1 ? 'vez' : 'veces'}). Queda registrado para el profesor.`)
        return n
      })
    }
    const alCambiarVisibilidad = () => (document.visibilityState === 'hidden' ? salir() : volver())

    // Capturas de pantalla: no hay forma de impedirlas del todo, pero sí de esconder el examen al primer aviso.
    let tapadoPorTeclas = false
    const alTeclear = (e: KeyboardEvent) => {
      const k = e.key
      const combo = (e.metaKey && e.shiftKey) || (k === 'Meta' && e.shiftKey) || (k === 'Shift' && e.metaKey)
      if (k === 'PrintScreen' || combo) {
        if (!tapadoPorTeclas) {
          tapadoPorTeclas = true
          setTapado(true)
          setContadores((c) => ({ ...c, capturas: c.capturas + 1 }))
          avisar('📸 Nada de capturas de pantalla. Queda registrado para el profesor.')
        }
        if (k === 'PrintScreen') {
          void navigator.clipboard?.writeText('').catch(() => {})
          window.setTimeout(() => {
            tapadoPorTeclas = false
            setTapado(false)
          }, 1500)
        }
        e.preventDefault()
        return
      }
      const mod = e.ctrlKey || e.metaKey
      const herramientas =
        k === 'F12' ||
        (mod && e.shiftKey && /^[ijc]$/i.test(k)) ||
        (e.metaKey && e.altKey && /^[ijcu]$/i.test(k)) ||
        (mod && /^[upsp]$/i.test(k))
      if (herramientas) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    const alSoltar = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        void navigator.clipboard?.writeText('').catch(() => {})
        setContadores((c) => ({ ...c, capturas: c.capturas + (tapadoPorTeclas ? 0 : 1) }))
        return
      }
      if (tapadoPorTeclas && (e.key === 'Meta' || e.key === 'Shift')) {
        tapadoPorTeclas = false
        if (fueraDesde === null) setTapado(false)
      }
    }
    const bloquear = (e: Event) => {
      e.preventDefault()
      if (e.type === 'copy' || e.type === 'cut') avisar('📋 En el examen no se copia nada.')
    }

    window.addEventListener('blur', salir)
    window.addEventListener('focus', volver)
    document.addEventListener('visibilitychange', alCambiarVisibilidad)
    window.addEventListener('keydown', alTeclear, true)
    window.addEventListener('keyup', alSoltar, true)
    document.addEventListener('copy', bloquear, true)
    document.addEventListener('cut', bloquear, true)
    document.addEventListener('contextmenu', bloquear, true)
    document.addEventListener('dragstart', bloquear, true)
    const alCerrar = () => void guardar('guardar', true)
    window.addEventListener('pagehide', alCerrar)
    return () => {
      window.removeEventListener('blur', salir)
      window.removeEventListener('focus', volver)
      document.removeEventListener('visibilitychange', alCambiarVisibilidad)
      window.removeEventListener('keydown', alTeclear, true)
      window.removeEventListener('keyup', alSoltar, true)
      document.removeEventListener('copy', bloquear, true)
      document.removeEventListener('cut', bloquear, true)
      document.removeEventListener('contextmenu', bloquear, true)
      document.removeEventListener('dragstart', bloquear, true)
      window.removeEventListener('pagehide', alCerrar)
    }
  }, [fase, guardar, avisar])

  const responder = useCallback((id: string, r: Respuesta) => {
    setRespuestas((rs) => {
      const n = { ...rs, [id]: r }
      const u = ultimo.current
      guardarLocal({ slug: u.slug, nombre: u.nombre, respuestas: n })
      return n
    })
  }, [])

  const hechas = PREGUNTAS.filter((q) => contestada(q, respuestas[q.id])).length

  /* ----------------------------------------------------------------- vista */

  if (fase === 'cargando') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-[#7f8fb3]">Cargando el examen…</p>
      </main>
    )
  }

  if (fase === 'yaTermino' || fase === 'entregado') {
    return (
      <main className="no-copiar mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 text-center">
        <Aviso mensaje={aviso?.texto ?? null} tono={aviso?.tono} onCerrar={() => setAviso(null)} />
        <p className="mb-3 text-5xl">{fase === 'entregado' ? '✅' : '🔒'}</p>
        <h1 className="mb-2 text-2xl font-black text-[#e8eeff]">
          {fase === 'entregado' ? '¡Examen entregado!' : 'Ya presentaste este examen'}
        </h1>
        <p className="text-sm leading-relaxed text-[#9fb0d4]">
          {nombre && <span className="font-bold text-[#e2e8ff]">{nombre}</span>}
          {fase === 'entregado' ? (
            <>
              , contestaste {hechas} de {PREGUNTAS.length} preguntas en {reloj(fin - inicio)}. Tu profesor revisa el
              examen y te cuenta cómo te fue. ¡Buen trabajo!
            </>
          ) : (
            <>
              {nombre ? ', el' : 'El'} examen tiene una sola oportunidad y ya la usaste. Si crees que es un error, habla
              con tu profesor.
            </>
          )}
        </p>
      </main>
    )
  }

  if (fase === 'cerrado') {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 text-center">
        <p className="mb-3 text-5xl">⏰</p>
        <h1 className="mb-2 text-2xl font-black text-[#e8eeff]">El examen ya se cerró</h1>
        <p className="text-sm text-[#9fb0d4]">Se podía presentar hasta {EXAMEN.cierreTexto}. Habla con tu profesor.</p>
      </main>
    )
  }

  if (fase === 'portada') {
    const listo = nombreCompleto(nombre) && aceptado && !enviando
    return (
      <main className="no-copiar mx-auto max-w-2xl space-y-5 px-5 py-10">
        <header className="text-center">
          <p className="etiqueta mb-2">Python desde cero</p>
          <h1 className="text-3xl font-black text-[#e8eeff]">
            {EXAMEN.emoji} {EXAMEN.titulo}
          </h1>
          <p className="mt-2 text-sm text-[#9fb0d4]">
            {PREGUNTAS.length} preguntas: escribir código, selección múltiple y falso o verdadero.
          </p>
        </header>

        <section className="panel space-y-3 border-[#7f1d3a] p-5">
          <h2 className="text-base font-black text-[#ffd7e2]">⚠️ Lee esto antes de empezar</h2>
          <ul className="space-y-2.5 text-sm leading-relaxed text-[#d6e4ff]">
            <li>
              <b>☝️ Tienes una sola oportunidad.</b> Cuando le des <b>Empezar</b>, arranca el tiempo y ya no hay vuelta
              atrás: no se puede volver a empezar ni presentarlo otra vez.
            </li>
            <li>
              <b>⏱ El tiempo corre desde que empiezas.</b> Puedes moverte entre las preguntas y cambiar tus respuestas
              mientras no hayas terminado.
            </li>
            <li>
              <b>🏁 Cuando acabes, dale Terminar.</b> Después de eso ya no puedes volver a ninguna pregunta.
            </li>
            <li>
              <b>🕡 Si se acaba la clase y no has terminado, el examen se cierra solo {EXAMEN.cierreTexto}</b>, y se
              entrega con lo que lleves.
            </li>
            <li>
              <b>⭐ Cada pregunta vale de 0 a 5 puntos.</b> Si la tienes a medias, también suma: escribe lo que sepas.
            </li>
            <li>
              <b>⌨️ Todo se escribe con tus dedos.</b> No se puede copiar ni pegar, y no se vale usar inteligencia
              artificial (ChatGPT, Gemini, Copilot ni ninguna otra).
            </li>
            <li>
              <b>🎧 Puedes oír música</b>, pero solo puedes tener abiertas tres páginas: <b>Teams</b> (la clase),{' '}
              <b>YouTube</b> para la música y <b>esta página del examen</b>. Pon la música y vuelve aquí: cada vez que
              te sales de esta página queda registrado, con cuántas veces y cuánto tiempo.
            </li>
            <li>
              <b>📸 Nada de capturas de pantalla.</b> El examen lleva tu nombre marcado y los intentos de captura
              quedan registrados.
            </li>
          </ul>
        </section>

        <section className="panel space-y-4 p-5">
          <label className="block">
            <span className="etiqueta mb-1.5 block">Tu nombre completo (nombre y apellido)</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              placeholder="Ej: Valentina Gómez Ruiz"
              className="w-full rounded-lg border border-[#1e2b45] bg-[#0a1120] px-3 py-2.5 text-base outline-none placeholder:text-[#3f5074] focus:border-[#4ade80]"
            />
          </label>
          {nombre.trim() && !nombreCompleto(nombre) && (
            <p className="text-xs text-[#fbbf24]">Escribe tu nombre y tu apellido, como en la lista del salón.</p>
          )}
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-[#d6e4ff]">
            <input type="checkbox" checked={aceptado} onChange={(e) => setAceptado(e.target.checked)} className="mt-1" />
            Leí las reglas. Sé que tengo una sola oportunidad y que el examen se cierra solo {EXAMEN.cierreTexto}.
          </label>
          {error && <p className="text-sm text-[#fb7185]">{error}</p>}
          <button
            disabled={!listo}
            onClick={() => void abrir(slugificar(nombre), nombre.trim().replace(/\s+/g, ' '))}
            className="boton boton-primario w-full disabled:opacity-40"
          >
            {enviando ? 'Un momento…' : '🚀 Empezar el examen'}
          </button>
          <p className="text-center text-[11px] text-[#5a6b8f]">
            {motor === 'listo' ? '🐍 Python ya cargó en este computador.' : '🐍 Cargando Python… (la primera vez tarda unos segundos)'}
            {' · '}Faltan {reloj(CIERRE - enHoraDelServidor)} para el cierre.
          </p>
        </section>
      </main>
    )
  }

  /* --------------------------------------------------------- el examen */

  const p = PREGUNTAS[actual]
  const faltan = CIERRE - enHoraDelServidor

  return (
    <div className="no-copiar relative flex min-h-screen flex-col lg:h-screen lg:overflow-hidden">
      <MarcaDeAgua nombre={nombre} />
      <Aviso mensaje={aviso?.texto ?? null} tono={aviso?.tono} onCerrar={() => setAviso(null)} />

      {tapado && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#05080f] px-6 text-center">
          <div>
            <p className="mb-3 text-5xl">🙈</p>
            <p className="text-lg font-black text-[#e8eeff]">El examen se esconde cuando no estás aquí</p>
            <p className="mt-2 text-sm text-[#9fb0d4]">Haz clic en esta página para volver. Cada salida queda registrada.</p>
          </div>
        </div>
      )}

      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#1e2b45] bg-[#0b1222] px-4 py-2.5">
        <div className="min-w-0">
          <p className="etiqueta">
            {EXAMEN.emoji} {EXAMEN.titulo}
          </p>
          <h1 className="truncate text-base font-black text-[#e8eeff]">{nombre}</h1>
        </div>
        <div className="text-xs text-[#9fb0d4]">
          ⏱ Llevas <b className="font-mono text-[#e8eeff]">{reloj(enHoraDelServidor - inicio)}</b>
        </div>
        <div className={`text-xs ${faltan < 10 * 60_000 ? 'animate-pulse text-[#fb7185]' : 'text-[#9fb0d4]'}`}>
          🕡 Se cierra en <b className="font-mono">{reloj(faltan)}</b>
        </div>
        <div className="text-xs text-[#9fb0d4]">
          ✍️ {hechas} de {PREGUNTAS.length}
        </div>
        <button onClick={() => setConfirmar(true)} className="boton boton-primario ml-auto">
          🏁 Terminar
        </button>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav className="panel h-fit p-3 lg:max-h-full lg:overflow-auto" aria-label="Preguntas">
          <p className="etiqueta mb-2">Preguntas</p>
          <ol className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
            {PREGUNTAS.map((q, i) => {
              const lista = contestada(q, respuestas[q.id])
              return (
                <li key={q.id}>
                  <button
                    onClick={() => setActual(i)}
                    title={`${i + 1}. ${q.titulo}`}
                    className={`flex h-8 w-full items-center justify-center rounded-md border text-[11px] font-bold transition ${
                      lista ? 'border-[#166534] bg-[#166534] text-[#c9f7d8]' : 'border-[#2a3a5c] text-[#9fb0d4]'
                    } ${i === actual ? 'ring-2 ring-[#22d3ee] ring-offset-2 ring-offset-[#0b1222]' : ''}`}
                  >
                    {i + 1}
                  </button>
                </li>
              )
            })}
          </ol>
          <p className="mt-3 text-[10px] leading-relaxed text-[#5a6b8f]">
            Verde: ya la contestaste. Puedes volver a cualquiera hasta que le des Terminar.
          </p>
        </nav>

        <section className="flex min-h-0 flex-col gap-3">
          <VistaPregunta
            key={p.id}
            pregunta={p}
            numero={actual + 1}
            slug={slug}
            respuesta={respuestas[p.id]}
            motor={motor}
            onResponder={(r) => responder(p.id, r)}
            onTeclas={(n) => setContadores((c) => ({ ...c, teclas: c.teclas + n }))}
            onPegado={() => {
              setContadores((c) => ({ ...c, pegados: c.pegados + 1 }))
              avisar('✋ Nada de pegar. Aquí se escribe con los dedos.')
            }}
          />
          <div className="flex items-center justify-between gap-2">
            <button disabled={actual === 0} onClick={() => setActual(actual - 1)} className="boton boton-secundario disabled:opacity-30">
              ← Anterior
            </button>
            <span className="text-xs text-[#5a6b8f]">
              Pregunta {actual + 1} de {PREGUNTAS.length}
            </span>
            {actual < PREGUNTAS.length - 1 ? (
              <button onClick={() => setActual(actual + 1)} className="boton boton-primario">
                Siguiente →
              </button>
            ) : (
              <button onClick={() => setConfirmar(true)} className="boton boton-primario">
                🏁 Terminar
              </button>
            )}
          </div>
        </section>
      </main>

      {confirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
          <div className="panel aparecer max-w-md p-6 text-center">
            <p className="mb-2 text-4xl">🏁</p>
            <h2 className="mb-2 text-lg font-black text-[#e8eeff]">¿Terminar el examen?</h2>
            <p className="text-sm leading-relaxed text-[#9fb0d4]">
              Contestaste {hechas} de {PREGUNTAS.length}.
              {hechas < PREGUNTAS.length && ` Te faltan ${PREGUNTAS.length - hechas}.`} Después de terminar{' '}
              <b className="text-[#ffd7e2]">ya no puedes volver a ninguna pregunta</b>.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button onClick={() => setConfirmar(false)} className="boton boton-secundario">
                Seguir respondiendo
              </button>
              <button onClick={() => void terminar(false)} disabled={enviando} className="boton boton-primario">
                {enviando ? 'Entregando…' : 'Sí, terminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ========================================================================== */

/** El nombre del alumno repetido en diagonal: si sale una foto o una captura, se sabe de quién es. */
function MarcaDeAgua({ nombre }: { nombre: string }) {
  const svg = useMemo(() => {
    const texto = nombre.replace(/[<>&"']/g, '')
    const s = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="200"><text x="20" y="120" transform="rotate(-20 180 100)" fill="rgba(148,163,255,0.07)" font-family="sans-serif" font-size="20" font-weight="700">${texto}</text></svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(s)}")`
  }, [nombre])
  return <div aria-hidden className="pointer-events-none fixed inset-0 z-40" style={{ backgroundImage: svg }} />
}

function BloqueCodigo({ codigo }: { codigo: string }) {
  return (
    <pre className="mt-3 overflow-auto rounded-xl border border-[#1e2b45] bg-[#0a1120] p-4 font-mono text-[13px] leading-relaxed text-[#d6e4ff]">
      {codigo}
    </pre>
  )
}

function Encabezado({ numero, pregunta }: { numero: number; pregunta: Pregunta }) {
  const tipo = { codigo: '⌨️ Escribe el código', opcion: '🔘 Selección múltiple', vf: '⚖️ Falso o verdadero' }[pregunta.tipo]
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <span className="rounded-md border border-[#1e2b45] bg-[#101a2e] px-2 py-1 text-[10px] font-bold tracking-wider text-[#22d3ee]">
        Pregunta {numero}
      </span>
      <span className="text-[11px] text-[#7f8fb3]">{tipo}</span>
      <span className="text-[11px] text-[#5a6b8f]">· vale hasta 5 puntos</span>
    </div>
  )
}

function VistaPregunta({
  pregunta: p,
  numero,
  slug,
  respuesta,
  motor,
  onResponder,
  onTeclas,
  onPegado,
}: {
  pregunta: Pregunta
  numero: number
  slug: string
  respuesta: Respuesta | undefined
  motor: EstadoMotor
  onResponder: (r: Respuesta) => void
  onTeclas: (n: number) => void
  onPegado: () => void
}) {
  if (p.tipo === 'codigo') {
    return (
      <PreguntaDeCodigo
        pregunta={p}
        numero={numero}
        codigoGuardado={typeof respuesta === 'string' ? respuesta : p.inicial}
        motor={motor}
        onResponder={onResponder}
        onTeclas={onTeclas}
        onPegado={onPegado}
      />
    )
  }

  if (p.tipo === 'vf') {
    return (
      <div className="panel p-5">
        <Encabezado numero={numero} pregunta={p} />
        <h2 className="mb-2 text-xl font-black text-[#e8eeff]">{p.titulo}</h2>
        {p.codigo && <BloqueCodigo codigo={p.codigo} />}
        <p className="mt-4 text-base leading-relaxed text-[#d6e4ff]">
          <ConCodigo texto={p.afirmacion} />
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[true, false].map((v) => (
            <button
              key={String(v)}
              onClick={() => onResponder(v)}
              className={`rounded-xl border px-4 py-3 text-base font-bold transition ${
                respuesta === v
                  ? 'border-[#4ade80] bg-[#0d2418] text-[#c9f7d8]'
                  : 'border-[#2a3a5c] text-[#9fb0d4] hover:border-[#4ade80]'
              }`}
            >
              {v ? '✔ Verdadero' : '✘ Falso'}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const orden = ordenDeOpciones(slug, p.id, p.opciones.length)
  return (
    <div className="panel p-5">
      <Encabezado numero={numero} pregunta={p} />
      <h2 className="mb-2 text-xl font-black text-[#e8eeff]">{p.titulo}</h2>
      <p className="text-base leading-relaxed text-[#d6e4ff]">
        <ConCodigo texto={p.enunciado} />
      </p>
      {p.codigo && <BloqueCodigo codigo={p.codigo} />}
      <div className="mt-5 grid gap-2.5">
        {orden.map((i, pos) => (
          <button
            key={i}
            onClick={() => onResponder(i)}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition ${
              respuesta === i
                ? 'border-[#4ade80] bg-[#0d2418] text-[#c9f7d8]'
                : 'border-[#2a3a5c] text-[#d6e4ff] hover:border-[#4ade80]'
            }`}
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-bold">
              {'abcd'[pos]}
            </span>
            <span className="font-mono">{p.opciones[i].texto}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function PreguntaDeCodigo({
  pregunta: p,
  numero,
  codigoGuardado,
  motor,
  onResponder,
  onTeclas,
  onPegado,
}: {
  pregunta: Extract<Pregunta, { tipo: 'codigo' }>
  numero: number
  codigoGuardado: string
  motor: EstadoMotor
  onResponder: (r: Respuesta) => void
  onTeclas: (n: number) => void
  onPegado: () => void
}) {
  const [codigo, setCodigo] = useState(codigoGuardado)
  const [entradas, setEntradas] = useState<string[]>(p.entradas ? [...p.entradas] : [''])
  const [corrida, setCorrida] = useState<{ r: Resultado; codigo: string } | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const pregunta = /\binput\s*\(/.test(codigo) || Boolean(p.entradas)

  async function correr() {
    if (ocupado) return
    setOcupado(true)
    const r = await motorDe('python').correr({ codigo, entradas })
    setCorrida({ r, codigo })
    setOcupado(false)
  }

  const explicado = corrida?.r.error ? explicarError('python', corrida.r.error, corrida.codigo) : null

  return (
    <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 xl:grid-cols-[minmax(280px,380px)_minmax(0,1fr)]">
      <div className="panel overflow-auto p-5">
        <Encabezado numero={numero} pregunta={p} />
        <h2 className="mb-3 text-xl font-black text-[#e8eeff]">{p.titulo}</h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#a9bad9]">
          <ConCodigo texto={p.enunciado} />
        </p>
        <p className="mt-4 text-[11px] leading-relaxed text-[#5a6b8f]">
          Puedes correr tu programa las veces que quieras. Lo que quede escrito en el editor es tu respuesta: se guarda
          solo.
        </p>
      </div>

      <div className="flex min-h-0 flex-col gap-3">
        <div className="panel flex min-h-[300px] flex-1 flex-col overflow-hidden">
          <div className="barra-ventana">
            <span className="punto bg-[#fb7185]" />
            <span className="punto bg-[#fbbf24]" />
            <span className="punto bg-[#4ade80]" />
            <span className="ml-2 text-xs text-[#7f8fb3]">pregunta_{numero}.py</span>
            <span className="ml-auto text-[10px] text-[#3f5074]">aquí no se pega</span>
          </div>
          <div className="min-h-0 flex-1 overflow-hidden bg-[#0a1120]">
            <Terminal
              lang="python"
              inicial={codigoGuardado}
              onCambio={(t) => {
                setCodigo(t)
                onResponder(t)
              }}
              onTeclas={onTeclas}
              onPegadoBloqueado={onPegado}
            />
          </div>
          {pregunta && (
            <div className="border-t border-[#1e2b45] bg-[#0b1222] px-3 py-2.5">
              <p className="mb-1.5 text-[10px] text-[#7f8fb3]">
                💬 Respuestas para <span className="text-[#86efac]">input()</span> — cada input() se lleva la siguiente
              </p>
              <div className="flex flex-wrap items-center gap-1.5">
                {entradas.map((e, i) => (
                  <input
                    key={i}
                    value={e}
                    spellCheck={false}
                    autoComplete="off"
                    onChange={(ev) => setEntradas(entradas.map((x, k) => (k === i ? ev.target.value : x)))}
                    placeholder={`respuesta ${i + 1}`}
                    className="w-24 rounded-md border border-[#1e2b45] bg-[#0a1120] px-2 py-1 text-xs outline-none placeholder:text-[#3f5074] focus:border-[#4ade80]"
                  />
                ))}
                <button onClick={() => setEntradas([...entradas, ''])} className="rounded-md border border-[#1e2b45] px-2 py-1 text-xs text-[#7f8fb3]">
                  +
                </button>
                {entradas.length > 1 && (
                  <button onClick={() => setEntradas(entradas.slice(0, -1))} className="rounded-md border border-[#1e2b45] px-2 py-1 text-xs text-[#7f8fb3]">
                    −
                  </button>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 border-t border-[#1e2b45] p-3">
            <span className="text-[10px] text-[#3f5074]">{motor === 'listo' ? '🐍 Python listo' : '🐍 Cargando Python…'}</span>
            <button onClick={() => void correr()} disabled={ocupado} className="boton boton-secundario ml-auto">
              {ocupado ? 'Corriendo…' : '▶ Correr'}
            </button>
          </div>
        </div>

        <div className="panel max-h-[40%] min-h-[120px] overflow-auto bg-[#060a14] p-4">
          {!corrida ? (
            <p className="text-xs text-[#3f5074]">Aquí sale lo que imprime tu programa cuando le das ▶ Correr.</p>
          ) : (
            <div className="space-y-3">
              {corrida.r.salida ? (
                <pre className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-[#d6e4ff]">{corrida.r.salida}</pre>
              ) : (
                !corrida.r.error &&
                !corrida.r.tiempoAgotado && <p className="text-xs italic text-[#5a6b8f]">(Tu programa no imprimió nada.)</p>
              )}
              {corrida.r.tiempoAgotado && (
                <p className="text-sm font-bold text-[#ffd7e2]">⏱ Tu programa no terminaba y lo detuvimos. ¿Un ciclo que nunca para?</p>
              )}
              {explicado && (
                <div className="rounded-xl border border-[#7f1d3a] bg-[#2a0f1c] p-3">
                  <p className="text-sm font-bold text-[#ffd7e2]">⚠ {explicado.titulo}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#fbc4d2]">{explicado.pista}</p>
                  <p className="mt-2 font-mono text-[10px] text-[#9f6b7a]">Python dice: {explicado.original}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
