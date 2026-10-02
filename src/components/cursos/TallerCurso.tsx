'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Terminal, type TerminalHandle } from '@/components/Terminal'
import { Aviso, type TonoAviso } from '@/components/Aviso'
import { Confeti } from '@/components/Confeti'
import { ConCodigo, Explicacion } from './Explicacion'
import { useAvanceCurso } from './useAvanceCurso'
import { leccionAbierta, retosHechos, totalRetos } from '@/lib/cursos'
import { calificar, type Calificacion, type ResultadoPython } from '@/lib/cursos/calificar'
import { explicarError } from '@/lib/cursos/errores-python'
import { motorPython, type EstadoMotor } from '@/lib/cursos/motor-python'
import type { Curso, Leccion } from '@/lib/cursos/tipos'
import { registrarEvento } from '@/lib/storage'

const BURLAS_AL_PEGAR = [
  '✋ Nada de pegar. Aquí se escribe con los dedos.',
  '🚫 Ese atajo está sellado. Escríbelo, que para eso viniste.',
  '⌨️ Bloqueado. Pregúntale a quien quieras, pero teclea tú.',
]

/** ¿El programa usa input()? Entonces hacen falta las cajitas de respuestas. */
const USA_INPUT = /\binput\s*\(/

export function TallerCurso({ curso, leccion }: { curso: Curso; leccion: Leccion }) {
  const { nombre, slug, avance, setAvance, cargado } = useAvanceCurso(curso.id)
  const indiceLeccion = curso.lecciones.indexOf(leccion)
  const siguienteLeccion = curso.lecciones[indiceLeccion + 1]

  const [vista, setVista] = useState<'explicacion' | 'reto'>('explicacion')
  const [indiceReto, setIndiceReto] = useState(0)
  const [codigo, setCodigo] = useState('')
  const [entradas, setEntradas] = useState<string[]>([])
  const [corrida, setCorrida] = useState<{ r: ResultadoPython; codigo: string } | null>(null)
  const [calificacion, setCalificacion] = useState<Calificacion | null>(null)
  const [ocupado, setOcupado] = useState(false)
  const [pistaAbierta, setPistaAbierta] = useState(false)
  const [motor, setMotor] = useState<EstadoMotor>('apagado')
  const [aviso, setAviso] = useState<{ texto: string; tono: TonoAviso } | null>(null)
  const [fiesta, setFiesta] = useState(false)
  const [temblando, setTemblando] = useState(false)

  const terminal = useRef<TerminalHandle>(null)
  const arrancado = useRef(false)

  const reto = leccion.retos[indiceReto]
  const hechos = retosHechos(leccion, avance)
  const leccionTerminada = hechos === leccion.retos.length
  const cursoTerminado = avance.hechos.length >= totalRetos(curso)
  const resuelto = avance.hechos.includes(reto.id)
  const abierta = !cargado || leccionAbierta(curso, indiceLeccion, avance)

  const avisar = useCallback((texto: string, tono: TonoAviso = 'info') => setAviso({ texto, tono }), [])

  /* ------------------------------------------------------------- arranque */

  useEffect(() => motorPython().escuchar(setMotor), [])
  useEffect(() => {
    void motorPython().arrancar().catch(() => {})
  }, [])

  // Al cargar el avance: se abre en el primer reto sin hacer. Si la lección ya
  // estaba empezada, directo al reto; si es nueva, primero la explicación.
  useEffect(() => {
    if (!cargado || arrancado.current) return
    arrancado.current = true
    const pendiente = leccion.retos.findIndex((r) => !avance.hechos.includes(r.id))
    setIndiceReto(pendiente === -1 ? leccion.retos.length - 1 : pendiente)
    const empezada = leccion.retos.some((r) => avance.hechos.includes(r.id) || avance.codigo[r.id])
    setVista(empezada ? 'reto' : 'explicacion')
  }, [cargado, avance, leccion])

  // Cada reto arranca con lo último que el alumno escribió en él.
  useEffect(() => {
    if (!cargado) return
    setCodigo(avance.codigo[reto.id] ?? reto.inicial)
    setEntradas(reto.entradas ? [...reto.entradas] : [''])
    setCorrida(null)
    setCalificacion(null)
    setPistaAbierta(false)
    // Solo al cambiar de reto: el avance cambia con cada tecla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargado, reto.id])

  /* -------------------------------------------------------------- acciones */

  const correr = useCallback(async () => {
    if (ocupado) return
    setOcupado(true)
    setCalificacion(null)
    const r = await motorPython().correr({ codigo, entradas })
    setCorrida({ r, codigo })
    setOcupado(false)
  }, [codigo, entradas, ocupado])

  async function comprobar() {
    if (ocupado) return
    setOcupado(true)
    setAvance((a) => ({ ...a, intentos: { ...a.intentos, [reto.id]: (a.intentos[reto.id] ?? 0) + 1 } }))
    const c = await calificar(reto, codigo, (p) => motorPython().correr(p))
    setCalificacion(c)
    setCorrida({ r: c.rota ?? c.principal, codigo })
    setOcupado(false)

    if (c.ok) {
      if (!resuelto) {
        setAvance((a) => ({ ...a, hechos: [...a.hechos, reto.id] }))
        if (slug) registrarEvento(slug, 'resuelto', reto.id, `${curso.titulo} · ${reto.titulo}`)
      }
      setFiesta(true)
      setTimeout(() => setFiesta(false), 2600)
      const ultimo = hechos + (resuelto ? 0 : 1) === leccion.retos.length
      avisar(ultimo ? '¡Lección terminada! Cinco de cinco.' : '¡Reto cumplido! Vamos con el siguiente.', 'bien')
    } else {
      setTemblando(true)
      setTimeout(() => setTemblando(false), 450)
      avisar(
        c.rota ? 'Tu programa se detuvo antes de terminar. Mira el aviso rojo.' : 'Todavía no. A la derecha te digo qué falta.',
        'alerta',
      )
    }
  }

  function irAReto(i: number) {
    setIndiceReto(i)
    setVista('reto')
  }

  function abrirPista() {
    setPistaAbierta((v) => !v)
    if (!avance.pistas.includes(reto.id)) {
      setAvance((a) => ({ ...a, pistas: [...a.pistas, reto.id] }))
      if (slug) registrarEvento(slug, 'ayuda', reto.id, `${curso.titulo} · pista`)
    }
  }

  const pegadoBloqueado = useCallback(() => {
    setAvance((a) => ({ ...a, pegados: a.pegados + 1 }))
    if (slug) registrarEvento(slug, 'pegado-bloqueado', reto.id)
    avisar(BURLAS_AL_PEGAR[Math.floor(Math.random() * BURLAS_AL_PEGAR.length)], 'alerta')
  }, [avisar, slug, reto.id, setAvance])

  const copiaBloqueada = useCallback(() => {
    avisar('📋 Esto no se copia. Si se lo vas a preguntar a alguien, escríbelo tú.', 'alerta')
    if (slug) registrarEvento(slug, 'copia-bloqueada', vista === 'reto' ? reto.id : leccion.id)
  }, [avisar, slug, vista, reto.id, leccion.id])

  const bloquear = (e: React.SyntheticEvent) => {
    e.preventDefault()
    copiaBloqueada()
  }

  // Ctrl/Cmd + Enter corre el programa, como en el examen.
  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        e.stopPropagation()
        void correr()
      }
    }
    window.addEventListener('keydown', alTeclear, true)
    return () => window.removeEventListener('keydown', alTeclear, true)
  }, [correr])

  /* ----------------------------------------------------------------- vista */

  if (!cargado) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-[#7f8fb3]">Cargando tu avance…</p>
      </main>
    )
  }

  if (!abierta) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 text-center">
        <p className="mb-3 text-4xl">🔒</p>
        <h1 className="mb-2 text-xl font-black">Esta lección todavía está cerrada</h1>
        <p className="mb-6 text-sm text-[#9fb0d4]">Se abre cuando termines los cinco retos de la lección anterior.</p>
        <Link href={`/cursos/${curso.id}`} className="boton boton-primario">
          ← Ver las lecciones
        </Link>
      </main>
    )
  }

  const mostrarEntradas = Boolean(reto.entradas) || USA_INPUT.test(codigo)
  const fallidas = calificacion?.resultados.filter((r) => !r.ok) ?? []

  return (
    <div className="flex min-h-screen flex-col lg:h-screen lg:overflow-hidden">
      <Confeti activo={fiesta} />
      <Aviso mensaje={aviso?.texto ?? null} tono={aviso?.tono} onCerrar={() => setAviso(null)} />

      {/* ------------------------------------------------------ barra de arriba */}
      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#1e2b45] bg-[#0b1222] px-4 py-2.5">
        <div className="min-w-0">
          <p className="etiqueta">
            {curso.emoji} {curso.titulo} · Lección {leccion.numero} de {curso.lecciones.length}
          </p>
          <h1 className="truncate text-base font-black text-[#e8eeff]">
            {leccion.emoji} {leccion.titulo}
          </h1>
        </div>

        <ol className="flex items-center gap-1.5" aria-label="Retos de la lección">
          {leccion.retos.map((r, i) => {
            const hecho = avance.hechos.includes(r.id)
            const disponible = hecho || i === 0 || avance.hechos.includes(leccion.retos[i - 1].id)
            const actual = vista === 'reto' && i === indiceReto
            return (
              <li key={r.id}>
                <button
                  onClick={() => disponible && irAReto(i)}
                  disabled={!disponible}
                  title={`Reto ${i + 1}: ${r.titulo}`}
                  className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold transition ${
                    hecho
                      ? 'border-[#166534] bg-[#166534] text-[#c9f7d8]'
                      : disponible
                        ? 'border-[#4ade80] text-[#4ade80]'
                        : 'border-[#1e2b45] text-[#3f5074]'
                  } ${actual ? 'ring-2 ring-[#22d3ee] ring-offset-2 ring-offset-[#0b1222]' : ''}`}
                >
                  {hecho ? '✓' : i + 1}
                </button>
              </li>
            )
          })}
        </ol>

        <div className="ml-auto flex items-center gap-3">
          <EstadoPython estado={motor} />
          <Link href={`/cursos/${curso.id}`} className="boton boton-secundario">
            ← Lecciones
          </Link>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 lg:grid-cols-[minmax(300px,400px)_minmax(0,1fr)_minmax(300px,420px)]">
        {/* ------------------------------------------- explicación y enunciado */}
        <section className="panel flex min-h-0 flex-col overflow-hidden">
          <div className="flex border-b border-[#1e2b45]">
            <Pestana activa={vista === 'explicacion'} onClick={() => setVista('explicacion')}>
              📖 Explicación
            </Pestana>
            <Pestana activa={vista === 'reto'} onClick={() => setVista('reto')}>
              🎯 Reto {indiceReto + 1}/{leccion.retos.length}
            </Pestana>
          </div>

          <div
            className="no-copiar min-h-0 flex-1 overflow-auto p-5"
            onCopy={bloquear}
            onCut={bloquear}
            onContextMenu={bloquear}
            onDragStart={bloquear}
          >
            {vista === 'explicacion' ? (
              <>
                <p className="etiqueta mb-3">⏱ Unos {leccion.minutos} minutos, con todo y retos</p>
                <Explicacion bloques={leccion.explicacion} onIntentoDeCopia={copiaBloqueada} />
                <button onClick={() => setVista('reto')} className="boton boton-primario mt-6 w-full">
                  {hechos > 0 ? 'Volver a los retos →' : '¡Entendido! A los retos →'}
                </button>
              </>
            ) : (
              <>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-[#1e2b45] bg-[#101a2e] px-2 py-1 text-[10px] font-bold tracking-wider text-[#22d3ee]">
                    Reto {indiceReto + 1} de {leccion.retos.length}
                  </span>
                  {resuelto && (
                    <span className="rounded-md border border-[#166534] bg-[#0d2418] px-2 py-1 text-[10px] font-bold text-[#4ade80]">
                      ✓ Resuelto
                    </span>
                  )}
                  {(avance.intentos[reto.id] ?? 0) > 0 && (
                    <span className="text-[10px] text-[#5a6b8f]">
                      {avance.intentos[reto.id]} intento{avance.intentos[reto.id] === 1 ? '' : 's'}
                    </span>
                  )}
                </div>

                <h2 className="mb-3 text-xl font-black leading-tight text-[#e8eeff]">{reto.titulo}</h2>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#a9bad9]">
                  <ConCodigo texto={reto.enunciado} />
                </p>

                <button onClick={abrirPista} className="boton boton-secundario mt-5">
                  {pistaAbierta ? 'Esconder la pista' : '💡 Pista'}
                </button>
                {pistaAbierta && (
                  <div className="aparecer mt-3 rounded-xl border border-[#78350f] bg-[#241a08] p-4">
                    <p className="text-sm leading-relaxed text-[#fde8c0]">
                      <ConCodigo texto={reto.pista} />
                    </p>
                  </div>
                )}

                {leccionTerminada && (
                  <FinDeLeccion
                    curso={curso}
                    siguiente={siguienteLeccion}
                    cursoTerminado={cursoTerminado}
                    teclas={avance.teclas}
                  />
                )}
              </>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------- el editor */}
        <section className={`panel flex min-h-[380px] flex-col overflow-hidden lg:min-h-0 ${temblando ? 'temblar' : ''}`}>
          <div className="barra-ventana">
            <span className="punto bg-[#fb7185]" />
            <span className="punto bg-[#fbbf24]" />
            <span className="punto bg-[#4ade80]" />
            <span className="ml-2 text-xs text-[#7f8fb3]">
              reto_{leccion.numero}_{indiceReto + 1}.py{nombre ? ` — ${nombre}` : ''}
            </span>
            <span className="ml-auto text-[10px] text-[#3f5074]">aquí no se pega</span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden bg-[#0a1120]">
            <Terminal
              key={reto.id}
              ref={terminal}
              lang="python"
              inicial={avance.codigo[reto.id] ?? reto.inicial}
              onCambio={(t) => {
                setCodigo(t)
                setAvance((a) => ({ ...a, codigo: { ...a.codigo, [reto.id]: t } }))
              }}
              onTeclas={(n) => setAvance((a) => ({ ...a, teclas: a.teclas + n }))}
              onPegadoBloqueado={pegadoBloqueado}
            />
          </div>

          {mostrarEntradas && (
            <CajitasDeEntrada entradas={entradas} onCambio={setEntradas} />
          )}

          <div className="flex flex-wrap items-center gap-2 border-t border-[#1e2b45] p-3">
            <button
              onClick={() => {
                terminal.current?.reemplazar(reto.inicial)
                setCorrida(null)
                setCalificacion(null)
              }}
              className="boton boton-secundario"
            >
              Empezar de nuevo
            </button>
            <span className="hidden text-[10px] text-[#3f5074] sm:block">Ctrl + Enter corre</span>
            <div className="ml-auto flex gap-2">
              <button onClick={() => void correr()} disabled={ocupado} className="boton boton-secundario">
                ▶ Correr
              </button>
              {resuelto && indiceReto < leccion.retos.length - 1 ? (
                <button onClick={() => irAReto(indiceReto + 1)} className="boton boton-primario latir">
                  Siguiente reto →
                </button>
              ) : (
                <button onClick={() => void comprobar()} disabled={ocupado} className="boton boton-primario">
                  {ocupado ? 'Un momento…' : '✔ Comprobar'}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- lo que sale */}
        <section className="panel flex min-h-[300px] flex-col overflow-hidden lg:min-h-0">
          <div className="barra-ventana">
            <span className="text-xs text-[#7f8fb3]">🖥️ Lo que sale</span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-[#060a14] p-4">
            <Salida corrida={corrida} motor={motor} />
          </div>
          {calificacion && (
            <div className="max-h-[45%] overflow-auto border-t border-[#1e2b45] p-4">
              <p className="etiqueta mb-2">
                {calificacion.ok
                  ? '✅ Todo bien'
                  : `Revisión · ${calificacion.resultados.length - fallidas.length} de ${calificacion.resultados.length}`}
              </p>
              <ul className="space-y-1">
                {calificacion.resultados.map((r, i) => (
                  <li key={i} className={`text-xs leading-snug ${r.ok ? 'text-[#86efac]' : 'text-[#fb7185]'}`}>
                    {r.ok ? '✓' : '✗'} {r.msg}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

/* ========================================================================== */

function Pestana({ activa, onClick, children }: { activa: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-4 py-2.5 text-xs font-bold transition ${
        activa ? 'border-b-2 border-[#4ade80] text-[#e2e8ff]' : 'text-[#5a6b8f] hover:text-[#9fb0d4]'
      }`}
    >
      {children}
    </button>
  )
}

function EstadoPython({ estado }: { estado: EstadoMotor }) {
  if (estado === 'listo') return <span className="text-[11px] text-[#4ade80]">🐍 Python listo</span>
  if (estado === 'fallo') {
    return (
      <button
        onClick={() => void motorPython().arrancar().catch(() => {})}
        className="text-[11px] text-[#fb7185] hover:underline"
      >
        ⚠ No cargó Python · reintentar
      </button>
    )
  }
  return <span className="animate-pulse text-[11px] text-[#fbbf24]">🐍 Despertando a Python…</span>
}

/**
 * Las respuestas que recibe input(), en orden. En una terminal de verdad el
 * programa se detendría a esperar; aquí se escriben antes de correr.
 */
function CajitasDeEntrada({ entradas, onCambio }: { entradas: string[]; onCambio: (e: string[]) => void }) {
  return (
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
            onChange={(ev) => onCambio(entradas.map((x, k) => (k === i ? ev.target.value : x)))}
            placeholder={`respuesta ${i + 1}`}
            className="w-28 rounded-md border border-[#1e2b45] bg-[#0a1120] px-2 py-1 text-xs outline-none placeholder:text-[#3f5074] focus:border-[#4ade80]"
          />
        ))}
        <button
          onClick={() => onCambio([...entradas, ''])}
          className="rounded-md border border-[#1e2b45] px-2 py-1 text-xs text-[#7f8fb3] hover:text-[#e2e8ff]"
          title="Otra respuesta"
        >
          +
        </button>
        {entradas.length > 1 && (
          <button
            onClick={() => onCambio(entradas.slice(0, -1))}
            className="rounded-md border border-[#1e2b45] px-2 py-1 text-xs text-[#7f8fb3] hover:text-[#e2e8ff]"
            title="Quitar la última"
          >
            −
          </button>
        )}
      </div>
    </div>
  )
}

function Salida({ corrida, motor }: { corrida: { r: ResultadoPython; codigo: string } | null; motor: EstadoMotor }) {
  if (!corrida) {
    return (
      <p className="text-xs leading-relaxed text-[#3f5074]">
        {motor === 'listo'
          ? 'Dale ▶ Correr para ver lo que hace tu programa. Correr no cuenta como intento: prueba todas las veces que quieras.'
          : 'Python se está cargando. La primera vez tarda unos segundos; después ya queda listo.'}
      </p>
    )
  }

  const { r, codigo } = corrida
  const explicado = r.error ? explicarError(r.error, codigo) : null

  return (
    <div className="space-y-3">
      {r.salida ? (
        <pre className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-[#d6e4ff]">{r.salida}</pre>
      ) : (
        !r.error && !r.tiempoAgotado && <p className="text-xs italic text-[#5a6b8f]">(Tu programa no imprimió nada. ¿Te faltó un print?)</p>
      )}
      {r.tiempoAgotado && (
        <div className="rounded-xl border border-[#7f1d3a] bg-[#2a0f1c] p-3">
          <p className="text-sm font-bold text-[#ffd7e2]">⏱ Tu programa no terminaba y lo detuvimos</p>
          <p className="mt-1 text-xs leading-relaxed text-[#fbc4d2]">
            Casi siempre es un while cuya condición nunca se vuelve falsa. Revisa que adentro cambie algo.
          </p>
        </div>
      )}
      {explicado && (
        <div className="rounded-xl border border-[#7f1d3a] bg-[#2a0f1c] p-3">
          <p className="text-sm font-bold text-[#ffd7e2]">⚠ {explicado.titulo}</p>
          <p className="mt-1 text-xs leading-relaxed text-[#fbc4d2]">{explicado.pista}</p>
          <p className="mt-2 font-mono text-[10px] text-[#9f6b7a]">Python dice: {explicado.original}</p>
        </div>
      )}
    </div>
  )
}

function FinDeLeccion({
  curso,
  siguiente,
  cursoTerminado,
  teclas,
}: {
  curso: Curso
  siguiente: Leccion | undefined
  cursoTerminado: boolean
  teclas: number
}) {
  if (cursoTerminado) {
    return (
      <div className="aparecer mt-6 rounded-xl border border-[#166534] bg-[#0d2418] p-5 text-center">
        <p className="mb-2 text-4xl">🏆</p>
        <p className="text-base font-black text-[#c9f7d8]">¡Terminaste {curso.titulo}!</p>
        <p className="mt-2 text-xs leading-relaxed text-[#9fd9b4]">
          {totalRetos(curso)} retos y {teclas} teclas, todas escritas por ti. Ya programas en dos lenguajes.
        </p>
        <Link href={`/cursos/${curso.id}`} className="boton boton-primario mt-4 inline-block">
          Ver el mapa del curso
        </Link>
      </div>
    )
  }
  return (
    <div className="aparecer mt-6 rounded-xl border border-[#166534] bg-[#0d2418] p-5">
      <p className="text-sm font-black text-[#c9f7d8]">🏁 ¡Lección terminada!</p>
      <p className="mt-1 text-xs text-[#9fd9b4]">Puedes repasar cualquier reto con los circulitos de arriba.</p>
      {siguiente && (
        <Link href={`/cursos/${curso.id}/${siguiente.id}`} className="boton boton-primario mt-4 inline-block">
          Lección {siguiente.numero}: {siguiente.titulo} →
        </Link>
      )}
    </div>
  )
}
