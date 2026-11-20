'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Terminal, type TerminalHandle } from '@/components/Terminal'
import { CodigoModelo } from '@/components/CodigoModelo'
import { Aviso, type TonoAviso } from '@/components/Aviso'
import { Confeti } from '@/components/Confeti'
import {
  HERRAMIENTAS,
  JUEGOS_ARENA,
  LIBRE,
  PLANTILLA_LIBRE,
  lineasNuevas,
  type JuegoArena,
} from '@/lib/arena'
import { PantallaDeJuego, explicarError, revisarParte, type ErrorDeJuego } from '@/lib/arena-runner'
import { slugificar } from '@/lib/progress'
import { registrarEvento } from '@/lib/storage'

export interface GuardadoArena {
  codigo: string
  hechas: string[]
  teclas: number
  pegados: number
  titulo?: string
  publicado_en?: string | null
}

const VACIO: GuardadoArena = { codigo: '', hechas: [], teclas: 0, pegados: 0 }
const SIN_PARTES: JuegoArena['partes'] = []

export function llaveDeArena(juego: string, slug: string) {
  return `examen-web:arena:${juego}:${slug || 'invitado'}`
}

/** Lee lo guardado en este navegador. */
export function leerArenaLocal(juego: string, slug: string): GuardadoArena | null {
  try {
    const crudo = localStorage.getItem(llaveDeArena(juego, slug))
    return crudo ? (JSON.parse(crudo) as GuardadoArena) : null
  } catch {
    return null
  }
}

/** Gana el que tenga más partes hechas; si empatan, el que tenga más teclas. */
function elMejor(a: GuardadoArena | null, b: GuardadoArena | null) {
  if (!a) return b
  if (!b) return a
  const pa = a.hechas?.length ?? 0
  const pb = b.hechas?.length ?? 0
  if (pa !== pb) return pa > pb ? a : b
  return (a.teclas ?? 0) >= (b.teclas ?? 0) ? a : b
}

/** Párrafo con `código` entre comillas invertidas. */
function Parrafo({ texto }: { texto: string }) {
  const trozos = texto.split('`')
  return (
    <p className="no-copiar text-[13px] leading-relaxed text-[#b8c6e6]">
      {trozos.map((t, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded bg-[#16233d] px-1 py-0.5 font-mono text-[12px] text-[#fcd34d]">
            {t}
          </code>
        ) : (
          <span key={i}>{t}</span>
        ),
      )}
    </p>
  )
}

export function TallerArena({ juego: J }: { juego: JuegoArena | null }) {
  const id = J?.id ?? LIBRE
  const partes = J?.partes ?? SIN_PARTES
  const esLibre = !J

  const [nombre, setNombre] = useState('')
  const [codigo, setCodigo] = useState('')
  const [hechas, setHechas] = useState<string[]>([])
  const [teclas, setTeclas] = useState(0)
  const [pegados, setPegados] = useState(0)
  const [titulo, setTitulo] = useState('')
  const [publicadoEn, setPublicadoEn] = useState<string | null>(null)
  const [cargado, setCargado] = useState(false)

  const [vista, setVista] = useState(0)
  const [verModelo, setVerModelo] = useState<'codigo' | 'juego'>('codigo')
  const [jugando, setJugando] = useState(false)
  const [error, setError] = useState<ErrorDeJuego | null>(null)
  const [colgado, setColgado] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [resultados, setResultados] = useState<{ ok: boolean; msg: string }[] | null>(null)
  const [revisando, setRevisando] = useState(false)
  const [ideaDe, setIdeaDe] = useState<string | null>(null)
  const [publicando, setPublicando] = useState(false)
  const [fiesta, setFiesta] = useState(false)
  const [aviso, setAviso] = useState<{ texto: string; tono: TonoAviso } | null>(null)

  const cajaJuego = useRef<HTMLDivElement>(null)
  const cajaModelo = useRef<HTMLDivElement>(null)
  const pantalla = useRef<PantallaDeJuego | null>(null)
  const pantallaModelo = useRef<PantallaDeJuego | null>(null)
  const terminal = useRef<TerminalHandle | null>(null)
  const codigoVivo = useRef('')
  codigoVivo.current = codigo

  const slug = useMemo(() => slugificar(nombre), [nombre])
  const actual = partes.findIndex((p) => !hechas.includes(p.id))
  const terminado = !esLibre && actual === -1
  const parte = partes[vista]

  const avisar = useCallback((texto: string, tono: TonoAviso = 'info') => setAviso({ texto, tono }), [])

  const pegadoBloqueado = useCallback(() => {
    setPegados((n) => n + 1)
    if (slug) registrarEvento(slug, 'pegado-bloqueado', `arena:${id}`)
    avisar('Aquí no se pega: los juegos se escriben con los dedos. Mira el modelo y tecléalo.', 'alerta')
  }, [avisar, slug, id])

  /* ------------------------------------------------------------- arranque */

  useEffect(() => {
    let vivo = true
    ;(async () => {
      let n = ''
      try {
        n = localStorage.getItem('examen-web:activo') || ''
      } catch {
        /* sin almacenamiento: se trabaja igual, sin recordar */
      }
      const s = slugificar(n)
      const local = leerArenaLocal(id, s)
      const nube = s ? await cargarNube(id, s) : null
      if (!vivo) return
      const g = elMejor(local, nube)
      setNombre(n)
      if (g) {
        setCodigo(g.codigo || '')
        setHechas(g.hechas || [])
        setTeclas(g.teclas || 0)
        setPegados(g.pegados || 0)
        setTitulo(g.titulo || '')
        setPublicadoEn(g.publicado_en ?? null)
        const sig = partes.findIndex((p) => !(g.hechas || []).includes(p.id))
        setVista(sig === -1 ? Math.max(0, partes.length - 1) : sig)
      }
      setCargado(true)
    })()
    return () => {
      vivo = false
    }
  }, [id, partes])

  useEffect(() => {
    if (!cargado) return
    const g: GuardadoArena = { codigo, hechas, teclas, pegados, titulo, publicado_en: publicadoEn }
    try {
      localStorage.setItem(llaveDeArena(id, slug), JSON.stringify(g))
    } catch {
      /* ídem */
    }
    // A la nube cuando hace una pausa, y solo si hizo algo.
    if (!slug || (hechas.length === 0 && teclas === 0)) return
    const t = setTimeout(() => guardarNube(id, slug, nombre, g), 2500)
    return () => clearTimeout(t)
  }, [cargado, codigo, hechas, teclas, pegados, titulo, publicadoEn, slug, nombre, id])

  useEffect(() => {
    if (cajaJuego.current) pantalla.current = new PantallaDeJuego(cajaJuego.current)
    if (cajaModelo.current) pantallaModelo.current = new PantallaDeJuego(cajaModelo.current)
    return () => {
      pantalla.current?.detener()
      pantallaModelo.current?.detener()
    }
  }, [])

  /* El modelo jugable de la parte que se está viendo. */
  useEffect(() => {
    if (verModelo !== 'juego' || !parte) {
      pantallaModelo.current?.detener()
      return
    }
    pantallaModelo.current?.jugar(parte.codigo)
  }, [verModelo, parte])

  /* -------------------------------------------------------------- acciones */

  const jugar = useCallback(async () => {
    if (!pantalla.current) return
    pantallaModelo.current?.detener()
    if (verModelo === 'juego') setVerModelo('codigo')
    setError(null)
    setColgado(false)
    setLogs([])
    setJugando(true)
    cajaJuego.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    await pantalla.current.jugar(codigoVivo.current, {
      onError: (e) => setError(e),
      onLog: (t) => setLogs((l) => (l.length >= 80 ? l : [...l, t])),
      onColgado: () => {
        setColgado(true)
        setJugando(false)
      },
    })
  }, [verModelo])

  function parar() {
    pantalla.current?.detener()
    setJugando(false)
  }

  async function comprobar() {
    if (esLibre || actual === -1) return
    const p = partes[actual]
    setRevisando(true)
    setResultados(null)
    setError(null)
    setColgado(false)
    const r = await revisarParte(codigoVivo.current, p.pruebas)
    setRevisando(false)
    setResultados(r.resultados)
    if (r.error) setError(r.error)
    if (r.colgado) setColgado(true)

    if (r.ok) {
      const nuevas = [...hechas, p.id]
      setHechas(nuevas)
      if (slug) registrarEvento(slug, 'parte', `arena:${id}`, `${nuevas.length}/${partes.length} · ${p.titulo}`)
      setIdeaDe(p.id)
      setFiesta(true)
      setTimeout(() => setFiesta(false), 2600)
      const sig = partes.findIndex((x) => !nuevas.includes(x.id))
      if (sig !== -1) setVista(sig)
      avisar(
        sig === -1
          ? '¡Terminaste el juego completo! Ahora hazlo tuyo y publícalo en la galería.'
          : `¡Parte ${actual + 1} lista! Juégala y sigue con la ${sig + 1}.`,
        'bien',
      )
      jugar()
    } else if (r.colgado) {
      avisar('Tu juego se quedó pensando para siempre. ¿Hay un while que nunca termina?', 'alerta')
    } else if (r.error) {
      avisar('Tu juego se rompió antes de poder revisarlo. Mira el mensaje rojo.', 'alerta')
    } else {
      avisar('Todavía no. Abajo te digo qué falta.', 'alerta')
    }
  }

  function traer(de: string) {
    const g = leerArenaLocal(de, slug)
    if (!g?.codigo) return
    terminal.current?.reemplazar(g.codigo)
    setCodigo(g.codigo)
    avisar('Listo: tu juego quedó en la terminal. Cámbialo todo lo que quieras.', 'bien')
  }

  async function publicar() {
    if (!slug) {
      avisar('Para publicar tienes que entrar con tu nombre por la portada.', 'alerta')
      return
    }
    setPublicando(true)
    try {
      // Antes de mostrárselo a todo el salón: que arranque y aguante unos segundos sin romperse.
      const prueba = await revisarParte(codigoVivo.current, [{ t: 'cuadros', n: 180 }])
      if (prueba.error || prueba.colgado) {
        if (prueba.error) setError(prueba.error)
        if (prueba.colgado) setColgado(true)
        throw new Error('Tu juego tiene un error (míralo debajo de la pantalla). Arréglalo antes de publicarlo.')
      }
      const r = await fetch('/api/arena/publicar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, nombre: nombre.trim(), juego: id, titulo, codigo: codigoVivo.current, hechas }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'No se pudo publicar.')
      setPublicadoEn(d.publicado_en)
      setFiesta(true)
      setTimeout(() => setFiesta(false), 2600)
      avisar('¡Publicado! Ya lo pueden jugar tus compañeros en la galería.', 'bien')
    } catch (e) {
      avisar((e as Error).message, 'alerta')
    } finally {
      setPublicando(false)
    }
  }

  /* ----------------------------------------------------------------- vista */

  const resaltar = useMemo(
    () => (parte ? lineasNuevas(vista > 0 ? partes[vista - 1].codigo : '', parte.codigo) : []),
    [parte, partes, vista],
  )
  const traibles = esLibre && cargado ? JUEGOS_ARENA.filter((g) => leerArenaLocal(g.id, slug)?.codigo) : []

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6">
      <Aviso mensaje={aviso?.texto ?? null} tono={aviso?.tono} onCerrar={() => setAviso(null)} />
      <Confeti activo={fiesta} />

      <header className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="etiqueta mb-1">{J ? `${J.lema} · ${J.nivel}` : 'Modo libre'}</p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            {J ? J.emoji : '✨'}{' '}
            <span style={{ color: J?.color ?? '#fbbf24' }}>{J ? J.titulo : 'Mi propio juego'}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-relaxed text-[#8fa1c6]">
            {J
              ? J.descripcion
              : 'Aquí no hay partes ni revisión: el juego lo inventas tú. Arranca con la base de la izquierda, usa la caja de herramientas y, cuando te guste, publícalo.'}
          </p>
          {J && <p className="mt-1 text-[11px] text-[#5a6b8f]">🎮 {J.controles}</p>}
        </div>
        <div className="flex items-center gap-4 text-right">
          {!esLibre && (
            <div>
              <p className="etiqueta">Partes</p>
              <p className="text-lg font-bold text-[#4ade80]">
                {hechas.length}
                <span className="text-[#3f5074]">/{partes.length}</span>
              </p>
            </div>
          )}
          <div>
            <p className="etiqueta">Teclas escritas</p>
            <p className="text-lg font-bold text-[#fbbf24]">{teclas}</p>
          </div>
          <Link href="/arena" className="boton boton-secundario">
            ← Arena
          </Link>
        </div>
      </header>

      {!nombre && cargado && (
        <p className="mb-4 rounded-xl border border-[#3f3410] bg-[#1c1708] px-4 py-2 text-xs text-[#fcd34d]">
          No has escrito tu nombre: tu juego solo se guarda en este computador y no lo puedes publicar.{' '}
          <Link href="/" className="underline">
            Entra por la portada
          </Link>
          .
        </p>
      )}

      {/* ---------------------------------------------------------- partes */}
      {!esLibre && (
        <ol className="mb-4 flex flex-wrap gap-2">
          {partes.map((p, i) => {
            const hecha = hechas.includes(p.id)
            const abierta = hecha || i === actual
            return (
              <li key={p.id}>
                <button
                  disabled={!abierta}
                  onClick={() => {
                    setVista(i)
                    setResultados(null)
                  }}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold transition ${
                    i === vista
                      ? 'border-[#4ade80] bg-[#0d2418] text-[#c9f7d8]'
                      : hecha
                        ? 'border-[#1e2b45] bg-[#101a2e] text-[#9fb0d4] hover:border-[#2f4067]'
                        : abierta
                          ? 'border-[#4ade80]/50 bg-[#0a1120] text-[#e2e8ff]'
                          : 'cursor-not-allowed border-[#141f36] bg-[#0a1120] text-[#3f5074]'
                  }`}
                >
                  {hecha ? '✅' : i === actual ? '🎯' : '🔒'} {i + 1}. {p.titulo}
                </button>
              </li>
            )
          })}
        </ol>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ------------------------------------------------------- izquierda */}
        <section className="panel flex flex-col overflow-hidden">
          {parte ? (
            <div className="space-y-2 border-b border-[#1e2b45] p-4">
              <p className="etiqueta">
                Parte {vista + 1} de {partes.length}
                {hechas.includes(parte.id) ? ' · ✅ hecha' : ''}
              </p>
              <h2 className="text-lg font-black text-[#e2e8ff]">{parte.titulo}</h2>
              {parte.explicacion.map((t, i) => (
                <Parrafo key={i} texto={t} />
              ))}
            </div>
          ) : (
            <div className="space-y-2 border-b border-[#1e2b45] p-4">
              <p className="etiqueta">La base de todo juego</p>
              <Parrafo texto="Casi todos los juegos tienen esta forma: un `bucle` que 60 veces por segundo hace `mover()` (cambiar las cosas) y `dibujar()` (pintarlas). Escribe esta base y llena las dos funciones con tu idea." />
              {traibles.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[11px] text-[#7f8fb3]">O arranca desde uno de tus juegos:</span>
                  {traibles.map((g) => (
                    <button key={g.id} onClick={() => traer(g.id)} className="boton boton-secundario !px-2 !py-1 text-[11px]">
                      {g.emoji} {g.titulo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="barra-ventana">
            <button
              onClick={() => setVerModelo('codigo')}
              className={`rounded px-2 py-0.5 text-xs ${verModelo === 'codigo' ? 'bg-[#16233d] text-[#e2e8ff]' : 'text-[#7f8fb3]'}`}
            >
              📄 El modelo
            </button>
            {parte && (
              <button
                onClick={() => setVerModelo('juego')}
                className={`rounded px-2 py-0.5 text-xs ${verModelo === 'juego' ? 'bg-[#16233d] text-[#e2e8ff]' : 'text-[#7f8fb3]'}`}
              >
                🎮 Así queda
              </button>
            )}
            <span className="ml-auto text-[10px] text-[#5a6b8f]">
              {verModelo === 'codigo'
                ? parte
                  ? 'Las líneas verdes son las nuevas · solo para leer'
                  : 'Solo para leer'
                : 'Haz clic en el juego y usa el teclado'}
            </span>
          </div>
          <div className={verModelo === 'codigo' ? 'h-[440px]' : 'hidden'}>
            <CodigoModelo
              key={`${id}-${vista}`}
              lang="js"
              codigo={parte ? parte.codigo : PLANTILLA_LIBRE}
              resaltar={resaltar}
              onIntentoDeCopia={() => avisar('Ese código no se copia. Está ahí para leerlo y escribirlo tú.', 'alerta')}
            />
          </div>
          <div ref={cajaModelo} className={verModelo === 'juego' ? 'aspect-[3/2] w-full bg-[#070b16]' : 'hidden'} />

          <details className="border-t border-[#1e2b45] px-4 py-3">
            <summary className="cursor-pointer text-xs font-bold text-[#9fb0d4]">🧰 Caja de herramientas</summary>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {HERRAMIENTAS.map((h) => (
                <li key={h.que} className="rounded-lg border border-[#1e2b45] bg-[#0a1120] p-2">
                  <p className="text-[11px] text-[#7f8fb3]">{h.que}</p>
                  <pre className="no-copiar mt-1 whitespace-pre-wrap font-mono text-[11px] text-[#fcd34d]">{h.codigo}</pre>
                </li>
              ))}
            </ul>
          </details>
        </section>

        {/* -------------------------------------------------------- derecha */}
        <section className="panel flex flex-col overflow-hidden">
          <div className="barra-ventana">
            <span className="punto bg-[#fb7185]" />
            <span className="punto bg-[#fbbf24]" />
            <span className="punto bg-[#4ade80]" />
            <span className="ml-2 text-xs text-[#7f8fb3]">
              Tu juego{nombre ? ` — ${nombre}` : ''} · mi-juego.js
            </span>
            {pegados > 0 && <span className="ml-auto text-[10px] text-[#fb7185]">Pegados bloqueados: {pegados}</span>}
          </div>
          <div className="h-[440px]">
            {cargado && (
              <Terminal
                ref={terminal}
                lang="js"
                inicial={codigo}
                onCambio={setCodigo}
                onTeclas={(n) => setTeclas((t) => t + n)}
                onPegadoBloqueado={pegadoBloqueado}
              />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-[#1e2b45] px-4 py-2">
            <button onClick={jugar} className="boton boton-primario">
              ▶ {jugando ? 'Volver a empezar' : 'Jugar'}
            </button>
            {jugando && (
              <button onClick={parar} className="boton boton-secundario">
                ⏹ Parar
              </button>
            )}
            {!esLibre && !terminado && (
              <button onClick={comprobar} disabled={revisando} className="boton boton-secundario">
                {revisando ? 'Revisando…' : `✔ Comprobar la parte ${actual + 1}`}
              </button>
            )}
          </div>

          <div className="relative aspect-[3/2] w-full bg-[#070b16]">
            <div ref={cajaJuego} className="absolute inset-0" />
            {!jugando && (
              <button
                onClick={jugar}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#7f8fb3] hover:text-[#e2e8ff]"
              >
                <span className="text-5xl">▶</span>
                <span className="text-xs">{colgado ? 'Se detuvo: se quedó pensando para siempre' : 'Dale Jugar para ver tu juego'}</span>
              </button>
            )}
          </div>

          {(error || colgado || logs.length > 0) && (
            <div className="max-h-32 overflow-auto border-t border-[#1e2b45] bg-[#0a1120] px-4 py-2 text-xs">
              {error && <p className="text-[#fb7185]">⚠ {explicarError(error)}</p>}
              {colgado && (
                <p className="text-[#fb7185]">
                  ⚠ Tu juego se quedó pensando para siempre y lo paramos. Casi seguro hay un while o un for que nunca termina.
                </p>
              )}
              {logs.map((l, i) => (
                <p key={i} className="font-mono text-[#8fa1c6]">
                  {l}
                </p>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* --------------------------------------------------- la revisión */}
      {resultados && resultados.length > 0 && (
        <section className="panel mt-5 p-4">
          <p className="etiqueta mb-2">Lo que revisé jugando tu juego</p>
          <ul className="space-y-1">
            {resultados.map((r, k) => (
              <li key={k} className={`text-xs ${r.ok ? 'text-[#86efac]' : 'text-[#fb7185]'}`}>
                {r.ok ? '✓' : '✗'} {r.msg}
              </li>
            ))}
          </ul>
        </section>
      )}

      {ideaDe && partes.find((p) => p.id === ideaDe) && (
        <section className="aparecer mt-5 rounded-xl border border-[#3f3410] bg-[#1c1708] px-4 py-3 text-xs text-[#fcd34d]">
          🎨 <span className="font-bold">Hazlo tuyo:</span> {partes.find((p) => p.id === ideaDe)!.idea}
        </section>
      )}

      {/* ---------------------------------------------------- publicar */}
      {(terminado || esLibre) && (
        <section className="panel mt-5 p-5">
          <p className="etiqueta mb-1">La galería del salón</p>
          <h2 className="text-lg font-black text-[#e2e8ff]">
            {terminado ? '🏆 ¡Terminaste! Ahora publícalo' : '🚀 Publica tu juego'}
          </h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#9fb0d4]">
            {terminado
              ? 'Cámbiale lo que quieras (colores, velocidades, una idea tuya), ponle un nombre y publícalo para que tus compañeros lo jueguen.'
              : 'Cuando tu juego funcione, ponle un nombre y publícalo para que tus compañeros lo jueguen.'}{' '}
            En la galería solo sale tu primer nombre y la inicial del apellido.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value.slice(0, 40))}
              placeholder="El nombre de tu juego"
              className="w-64 rounded-lg border border-[#1e2b45] bg-[#0a1120] px-3 py-2 text-sm text-[#e2e8ff] outline-none focus:border-[#4ade80]"
            />
            <button
              onClick={publicar}
              disabled={publicando || !titulo.trim() || codigo.trim().length < 40}
              className="boton boton-primario"
            >
              {publicando ? 'Publicando…' : publicadoEn ? '🚀 Volver a publicar' : '🚀 Publicar en la galería'}
            </button>
            <Link href="/arena/galeria" className="boton boton-secundario">
              Ver la galería
            </Link>
          </div>
          {publicadoEn && (
            <p className="mt-2 text-[11px] text-[#7f8fb3]">
              Publicado el {new Date(publicadoEn).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}. Si
              le cambias algo, vuelve a publicar para que en la galería salga la versión nueva.
            </p>
          )}
        </section>
      )}
    </main>
  )
}

/* ----------------------------------------------------------------- nube --- */

async function cargarNube(juego: string, slug: string): Promise<GuardadoArena | null> {
  try {
    const r = await fetch(`/api/arena/avance?slug=${encodeURIComponent(slug)}&juego=${encodeURIComponent(juego)}`, {
      cache: 'no-store',
    })
    const d = await r.json()
    return d?.avance ? { ...VACIO, ...d.avance } : null
  } catch {
    return null
  }
}

function guardarNube(juego: string, slug: string, nombre: string, g: GuardadoArena) {
  // Sin await: si no hay internet, igual queda en el navegador.
  fetch('/api/arena/avance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slug, nombre: nombre.trim(), juego, hechas: g.hechas, teclas: g.teclas, pegados: g.pegados, codigo: g.codigo }),
  }).catch(() => {})
}
