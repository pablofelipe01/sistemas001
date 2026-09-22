'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Terminal, type TerminalHandle } from '@/components/Terminal'
import { CodigoModelo } from '@/components/CodigoModelo'
import { Aviso, type TonoAviso } from '@/components/Aviso'
import { Confeti } from '@/components/Confeti'
import { ProyectoRunner, type ResultadoPrueba } from '@/lib/proyecto-runner'
import type { Proyecto } from '@/lib/proyectos'
import { slugificar } from '@/lib/progress'
import { registrarEvento } from '@/lib/storage'
import type { Lang } from '@/lib/types'

const LENGUAJES: Lang[] = ['html', 'css', 'js']
const NOMBRE_LENGUAJE: Record<Lang, string> = { html: 'HTML', css: 'CSS', js: 'JavaScript' }
const OFICIO: Record<Lang, string> = {
  html: 'pone las cosas',
  css: 'las viste',
  js: 'las hace reaccionar',
}

interface Guardado {
  codigo: Record<Lang, string>
  hechas: string[]
  teclas: number
  pegados: number
}

const VACIO: Record<Lang, string> = { html: '', css: '', js: '' }

export function llaveDeProyecto(idProyecto: string, slug: string) {
  return `examen-web:proyecto:${idProyecto}:${slug || 'invitado'}`
}

export function TallerProyecto({ proyecto: P }: { proyecto: Proyecto }) {
  const [nombre, setNombre] = useState('')
  const [pestana, setPestana] = useState<Lang>('html')
  const [codigo, setCodigo] = useState<Record<Lang, string>>(VACIO)
  const [teclas, setTeclas] = useState(0)
  const [pegados, setPegados] = useState(0)
  const [hechas, setHechas] = useState<string[]>([])
  const [resultados, setResultados] = useState<ResultadoPrueba[] | null>(null)
  const [errorRevision, setErrorRevision] = useState<string | null>(null)
  const [consola, setConsola] = useState<string[]>([])
  const [vistaDeRevision, setVistaDeRevision] = useState(false)
  const [errorPreview, setErrorPreview] = useState<string | null>(null)
  const [pistaAbierta, setPistaAbierta] = useState(false)
  const [revisando, setRevisando] = useState(false)
  const [corriendo, setCorriendo] = useState(false)
  const [fiesta, setFiesta] = useState(false)
  const [cargado, setCargado] = useState(false)
  const [aviso, setAviso] = useState<{ texto: string; tono: TonoAviso } | null>(null)

  const cajaModelo = useRef<HTMLDivElement>(null)
  const cajaAlumno = useRef<HTMLDivElement>(null)
  const runnerAlumno = useRef<ProyectoRunner | null>(null)
  const terminales = useRef<Partial<Record<Lang, TerminalHandle | null>>>({})
  const codigoVivo = useRef<Record<Lang, string>>(VACIO)
  codigoVivo.current = codigo

  const slug = useMemo(() => slugificar(nombre), [nombre])
  const indiceMision = Math.min(hechas.length, P.misiones.length - 1)
  const mision = P.misiones[indiceMision]
  const terminado = hechas.length === P.misiones.length

  const avisar = useCallback((texto: string, tono: TonoAviso = 'info') => {
    setAviso({ texto, tono })
  }, [])

  const pegadoBloqueado = useCallback(() => {
    setPegados((n) => n + 1)
    if (slug) registrarEvento(slug, 'pegado-bloqueado', P.id)
    avisar('Aquí no se pega: este proyecto se escribe con los dedos. Mira el modelo y tecléalo.', 'alerta')
  }, [avisar, slug, P.id])

  /* ------------------------------------------------------------- arranque */

  useEffect(() => {
    let vivo = true
    ;(async () => {
      let guardadoNombre = ''
      let local: Guardado | null = null
      try {
        guardadoNombre = localStorage.getItem('examen-web:activo') || ''
        const crudo = localStorage.getItem(llaveDeProyecto(P.id, slugificar(guardadoNombre)))
        if (crudo) local = JSON.parse(crudo) as Guardado
      } catch {
        /* almacenamiento bloqueado: se sigue trabajando, solo que sin recordar */
      }

      // Si en la nube hay más misiones hechas (porque trabajó en otro
      // computador), gana la nube. Igual que con el examen.
      const s = slugificar(guardadoNombre)
      const nube = s ? await cargarAvanceNube(P.id, s) : null
      if (!vivo) return
      const g = nube && (nube.hechas?.length ?? 0) > (local?.hechas?.length ?? 0) ? nube : local

      setNombre(guardadoNombre)
      if (g) {
        setCodigo({ ...VACIO, ...(g.codigo || {}) })
        setHechas(g.hechas || [])
        setTeclas(g.teclas || 0)
        setPegados(g.pegados || 0)
      }
      setCargado(true)
    })()
    return () => {
      vivo = false
    }
  }, [P.id])

  useEffect(() => {
    if (!cargado) return
    const g: Guardado = { codigo, hechas, teclas, pegados }
    try {
      localStorage.setItem(llaveDeProyecto(P.id, slug), JSON.stringify(g))
    } catch {
      /* ídem */
    }
    // A la nube, sin martillarla en cada tecla: se espera a que haga una pausa.
    // Un proyecto que solo se abrió y no se tocó no se manda.
    if (!slug || (g.hechas.length === 0 && g.teclas === 0)) return
    const t = setTimeout(() => guardarAvanceNube(P.id, slug, nombre, g), 2500)
    return () => clearTimeout(t)
  }, [cargado, codigo, hechas, teclas, pegados, slug, nombre, P.id])

  /* El resultado del modelo se monta una sola vez y se queda ahí, funcionando,
     para que el alumno pueda comparar y también jugar con él. */
  useEffect(() => {
    if (!cajaModelo.current) return
    const r = new ProyectoRunner(cajaModelo.current)
    r.correr({ html: P.html, css: P.css, js: P.js })
    return () => r.destruir()
  }, [P])

  useEffect(() => {
    if (!cajaAlumno.current) return
    runnerAlumno.current = new ProyectoRunner(cajaAlumno.current)
    return () => runnerAlumno.current?.destruir()
  }, [])

  useEffect(() => {
    // Al cambiar de pestaña el editor tenía display:none; el foco lo hace medirse bien.
    terminales.current[pestana]?.enfocar()
  }, [pestana])

  /* -------------------------------------------------------------- acciones */

  const verResultado = useCallback(async () => {
    if (!runnerAlumno.current) return
    setCorriendo(true)
    const s = await runnerAlumno.current.correr({ ...codigoVivo.current })
    setConsola(s.logs)
    setErrorPreview(s.error ?? null)
    setVistaDeRevision(false)
    setCorriendo(false)
  }, [])

  async function comprobar() {
    if (!runnerAlumno.current || terminado) return
    setRevisando(true)
    setResultados(null)
    setErrorRevision(null)

    /*
     * La revisión corre en la MISMA ventanita donde el alumno ve su resultado, y
     * no en un iframe escondido, por dos razones: un iframe invisible o fuera de
     * la pantalla no recibe maquetación del navegador (y entonces una misión como
     * “centra la tarjeta” no se podría medir), y así el alumno ve con sus ojos
     * los clics que le dio el revisor a su botón.
     */
    cajaAlumno.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })

    const s = await runnerAlumno.current.correr({
      ...codigoVivo.current,
      acciones: mision.acciones,
      pruebas: mision.pruebas,
    })
    setRevisando(false)
    setResultados(s.resultados)
    setErrorRevision(s.error ?? null)
    setConsola(s.logs)
    setErrorPreview(s.error ?? null)
    setVistaDeRevision(Boolean(mision.acciones?.length))

    if (s.ok) {
      const nuevas = [...hechas, mision.id]
      setHechas(nuevas)
      if (slug) registrarEvento(slug, 'mision', P.id, `${nuevas.length}/${P.misiones.length} · ${mision.titulo}`)
      setPistaAbierta(false)
      // La lista de chequeos era de la misión que acaba de pasar: dejarla ahí
      // confundiría, porque la tarjeta que se abre es ya la siguiente.
      setResultados(null)
      setFiesta(true)
      setTimeout(() => setFiesta(false), 2600)
      avisar(
        nuevas.length === P.misiones.length
          ? '¡Terminaste el proyecto completo! Y lo escribiste todo tú.'
          : `Misión cumplida: ${mision.titulo}. Sigue la siguiente.`,
        'bien',
      )
    } else if (s.error) {
      avisar('Tu código se rompió antes de poder revisarlo. Mira el mensaje rojo.', 'alerta')
    } else {
      avisar('Todavía no. Abajo te digo qué falta.', 'alerta')
    }
  }

  function empezarDeCero() {
    for (const l of LENGUAJES) terminales.current[l]?.reemplazar('')
    setCodigo(VACIO)
    setResultados(null)
    setConsola([])
    setErrorPreview(null)
    setVistaDeRevision(false)
    avisar('Terminal limpia. El progreso de las misiones no se borra.', 'info')
  }

  /* ----------------------------------------------------------------- vista */

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6">
      <Aviso mensaje={aviso?.texto ?? null} tono={aviso?.tono} onCerrar={() => setAviso(null)} />
      <Confeti activo={fiesta} />

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="etiqueta mb-1">{P.lema}</p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            <span className="text-[#22d3ee]">{P.titulo}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#8fa1c6]">{P.descripcion}</p>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div>
            <p className="etiqueta">Misiones</p>
            <p className="text-lg font-bold text-[#4ade80]">
              {hechas.length}
              <span className="text-[#3f5074]">/{P.misiones.length}</span>
            </p>
          </div>
          <div>
            <p className="etiqueta">Teclas escritas</p>
            <p className="text-lg font-bold text-[#fbbf24]">{teclas}</p>
          </div>
          <Link href="/proyecto" className="boton boton-secundario">
            ← Proyectos
          </Link>
        </div>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-[#1e3a5f] bg-[#0e1c2f] px-4 py-3 text-xs text-[#cfe4ff]">
        <span className="font-bold">⌨️ Aquí se escribe.</span>
        <span className="text-[#9fb0d4]">
          El código del modelo no se deja seleccionar y tu terminal rechaza cualquier pegado. Míralo, entiéndelo y
          tecléalo: es la única forma de que se te quede.
        </span>
        {pegados > 0 && <span className="text-[#fb7185]">Intentos de pegar bloqueados: {pegados}</span>}
      </div>

      {/* ---------------------------------------------------------- pestañas */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {LENGUAJES.map((l) => (
          <button
            key={l}
            onClick={() => setPestana(l)}
            className={`boton ${pestana === l ? 'boton-primario' : 'boton-secundario'}`}
          >
            {NOMBRE_LENGUAJE[l]}
          </button>
        ))}
        <span className="ml-1 text-xs text-[#5a6b8f]">
          El {NOMBRE_LENGUAJE[pestana]} {OFICIO[pestana]}.
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ------------------------------------------------------- el modelo */}
        <section className="panel overflow-hidden">
          <div className="barra-ventana">
            <span className="punto bg-[#fb7185]" />
            <span className="punto bg-[#fbbf24]" />
            <span className="punto bg-[#4ade80]" />
            <span className="ml-2 text-xs text-[#7f8fb3]">
              El modelo — {NOMBRE_LENGUAJE[pestana]} · solo para leer
            </span>
          </div>
          <div className="h-[340px]">
            <CodigoModelo
              key={`${P.id}-${pestana}`}
              lang={pestana}
              codigo={pestana === 'html' ? P.html : pestana === 'css' ? P.css : P.js}
              onIntentoDeCopia={() =>
                avisar('Ese código no se copia. Está ahí para leerlo y escribirlo tú.', 'alerta')
              }
            />
          </div>
          <div className="border-t border-[#1e2b45] px-4 py-2">
            <p className="etiqueta">Así se ve el modelo funcionando</p>
          </div>
          <div ref={cajaModelo} className="h-[260px] bg-white" />
        </section>

        {/* ------------------------------------------------------ tu terminal */}
        <section className="panel overflow-hidden">
          <div className="barra-ventana">
            <span className="punto bg-[#fb7185]" />
            <span className="punto bg-[#fbbf24]" />
            <span className="punto bg-[#4ade80]" />
            <span className="ml-2 text-xs text-[#7f8fb3]">
              Tu {NOMBRE_LENGUAJE[pestana]}
              {nombre ? ` — ${nombre}` : ''}
            </span>
          </div>
          <div className="h-[340px]">
            {cargado &&
              LENGUAJES.map((l) => (
                <div key={l} className={pestana === l ? 'h-full' : 'hidden'}>
                  <Terminal
                    ref={(h) => {
                      terminales.current[l] = h
                    }}
                    lang={l}
                    inicial={codigo[l]}
                    onCambio={(texto) => setCodigo((c) => ({ ...c, [l]: texto }))}
                    onTeclas={(n) => setTeclas((t) => t + n)}
                    onPegadoBloqueado={pegadoBloqueado}
                  />
                </div>
              ))}
          </div>
          <div className="flex items-center gap-2 border-t border-[#1e2b45] px-4 py-2">
            <button onClick={verResultado} disabled={corriendo} className="boton boton-primario">
              {corriendo ? 'Corriendo…' : '▶ Ver mi resultado'}
            </button>
            <button onClick={empezarDeCero} className="boton boton-secundario">
              Limpiar
            </button>
          </div>
          <div ref={cajaAlumno} className="h-[260px] bg-white" />
          {vistaDeRevision && (
            <p className="border-t border-[#1e2b45] px-4 py-2 text-[10px] text-[#7f8fb3]">
              Así quedó tu página después de los clics que le dio la revisión.
            </p>
          )}
          {(errorPreview || consola.length > 0) && (
            <div className="max-h-24 overflow-auto border-t border-[#1e2b45] bg-[#0a1120] px-4 py-2 text-xs">
              {errorPreview && <p className="text-[#fb7185]">⚠ {errorPreview}</p>}
              {consola.map((l, i) => (
                <p key={i} className="text-[#8fa1c6]">
                  {l}
                </p>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* --------------------------------------------------------- misiones */}
      <section className="panel mt-5 p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="etiqueta">Misiones</p>
          <div className="h-1.5 w-40 overflow-hidden rounded-full bg-[#16233d]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#22c55e] to-[#22d3ee] transition-all"
              style={{ width: `${(hechas.length / P.misiones.length) * 100}%` }}
            />
          </div>
        </div>

        <ol className="space-y-2">
          {P.misiones.map((m, i) => {
            const hecha = hechas.includes(m.id)
            const activa = !terminado && i === indiceMision
            return (
              <li
                key={m.id}
                className={`rounded-xl border px-4 py-3 ${
                  activa
                    ? 'border-[#4ade80] bg-[#0d2418]'
                    : hecha
                      ? 'border-[#1e2b45] bg-[#101a2e]'
                      : 'border-[#141f36] bg-[#0a1120] opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-sm">{hecha ? '✅' : activa ? '🎯' : '🔒'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#e2e8ff]">
                      {i + 1}. {m.titulo}
                    </p>
                    {(activa || hecha) && (
                      <p className="no-copiar mt-1 text-xs leading-relaxed text-[#9fb0d4]">{m.enunciado}</p>
                    )}
                    {activa && (
                      <>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button onClick={comprobar} disabled={revisando} className="boton boton-primario">
                            {revisando ? 'Revisando…' : '✔ Comprobar misión'}
                          </button>
                          <button
                            onClick={() => setPistaAbierta((v) => !v)}
                            className="boton boton-secundario"
                          >
                            {pistaAbierta ? 'Esconder la pista' : '💡 Pista'}
                          </button>
                        </div>
                        {pistaAbierta && (
                          <p className="no-copiar mt-3 rounded-lg border border-[#3f3410] bg-[#1c1708] px-3 py-2 text-xs leading-relaxed text-[#fcd34d]">
                            {m.pista}
                          </p>
                        )}
                        {errorRevision && (
                          <p className="mt-3 rounded-lg border border-[#7f1d3a] bg-[#2a0f1c] px-3 py-2 text-xs text-[#ffd7e2]">
                            ⚠ {errorRevision}
                          </p>
                        )}
                        {resultados && resultados.length > 0 && (
                          <ul className="mt-3 space-y-1">
                            {resultados.map((r, k) => (
                              <li
                                key={k}
                                className={`text-xs ${r.ok ? 'text-[#86efac]' : 'text-[#fb7185]'}`}
                              >
                                {r.ok ? '✓' : '✗'} {r.msg}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>

        {terminado && (
          <p className="aparecer mt-4 rounded-xl border border-[#166534] bg-[#0d2418] px-4 py-3 text-sm text-[#c9f7d8]">
            🏆 Proyecto terminado: {teclas} teclas escritas y ni un solo copiar y pegar. Ese código ya es tuyo.
          </p>
        )}
      </section>

    </main>
  )
}

/* ----------------------------------------------------------------- nube --- */

async function cargarAvanceNube(idProyecto: string, slug: string): Promise<Guardado | null> {
  try {
    const r = await fetch(
      `/api/proyecto-avance?slug=${encodeURIComponent(slug)}&proyecto=${encodeURIComponent(idProyecto)}`,
      { cache: 'no-store' },
    )
    const d = await r.json()
    return d?.avance ?? null
  } catch {
    return null
  }
}

function guardarAvanceNube(idProyecto: string, slug: string, nombre: string, g: Guardado) {
  // Sin await: si no hay internet, el avance igual queda en el navegador.
  fetch('/api/proyecto-avance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, nombre: nombre.trim(), proyecto: idProyecto, ...g }),
  }).catch(() => {})
}
