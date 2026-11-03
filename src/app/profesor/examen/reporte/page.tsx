'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { correrCon, motorDe } from '@/lib/cursos/motor'
import { EXAMEN_PYTHON } from '@/lib/examen/python-basico'
import { contestada, puntuar, type Puntaje } from '@/lib/examen/puntuar'
import { PUNTOS_POR_PREGUNTA, type Presentacion } from '@/lib/examen/tipos'

/*
 * El reporte del examen de Python, armado en el momento con los datos de la
 * nube y detrás de la clave del profesor. Aquí no hay ni un nombre escrito: el
 * repo es público y los alumnos son menores; los nombres llegan de Supabase.
 * Se descarga en PDF con el "Guardar como PDF" de la ventana de imprimir.
 *
 * Junta todos los grupos que presentaron este examen (cada grupo tiene su
 * propio id, que empieza igual: python-basico, python-basico-30oct…).
 */

const PREGUNTAS = EXAMEN_PYTHON.preguntas
const MAXIMO = PREGUNTAS.length * PUNTOS_POR_PREGUNTA
const PREFIJO = 'python-basico'
const LLAVE_OCULTOS = 'profesor:reporte:ocultos'
/** Por aquí le pasa la clave /profesor/examen, para no tener que escribirla otra vez. */
const LLAVE_CLAVE = 'profesor:clave-reporte'

const CODIGO = PREGUNTAS.filter((q) => q.tipo === 'codigo')
const MAX_CODIGO = CODIGO.length * PUNTOS_POR_PREGUNTA
const MAX_LEER = MAXIMO - MAX_CODIGO

interface Fila {
  p: Presentacion
  grupo: string
  puntajes: Puntaje[]
  total: number
  nota: number
  codigo: number
  leer: number
  contesto: number
  pistas: number
}

const nota = (puntos: number, maximo = MAXIMO) => (puntos / maximo) * 5
const uno = (n: number) => n.toFixed(1)
const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)} %` : '—')
const promedio = (xs: number[]) => (xs.length ? xs.reduce((s, n) => s + n, 0) / xs.length : 0)

function fechaGrupo(iso: string) {
  return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' })
}

/** Un código "en limpio" para comparar respuestas: sin espacios ni comentarios. */
function huella(codigo: string) {
  return codigo
    .split('\n')
    .map((l) => l.replace(/#.*/, ''))
    .join('')
    .replace(/\s+/g, '')
}

export default function ReporteExamen() {
  const [clave, setClave] = useState('')
  const [crudas, setCrudas] = useState<Presentacion[] | null>(null)
  const [notas, setNotas] = useState<Record<string, Puntaje[]>>({})
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const [ocultos, setOcultos] = useState<string[]>([])
  const [hoy, setHoy] = useState('')
  // Del salón (todos juntos) o individual (uno por alumno, cada uno en su hoja).
  const [vista, setVista] = useState<'salon' | 'alumnos'>('salon')
  const [elegido, setElegido] = useState('todos')
  const [conConducta, setConConducta] = useState(true)

  // Si viene de /profesor/examen, la clave ya está escrita.
  useEffect(() => {
    void motorDe('python').arrancar().catch(() => {})
    setHoy(new Date().toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' }))
    try {
      setOcultos(JSON.parse(localStorage.getItem(LLAVE_OCULTOS) || '[]'))
      const c = sessionStorage.getItem(LLAVE_CLAVE)
      if (c) {
        sessionStorage.removeItem(LLAVE_CLAVE)
        setClave(c)
        void entrar(c)
      }
    } catch {
      /* sin almacenamiento: se escribe la clave */
    }
    // Esta página es la única que se deja imprimir (el examen no).
    document.body.classList.add('se-imprime')
    return () => document.body.classList.remove('se-imprime')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function entrar(c = clave) {
    setCargando(true)
    setError('')
    try {
      const r = await fetch('/api/examen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'profesor', clave: c }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error ?? 'No se pudo entrar.')
      if (d.nube === false) throw new Error('Supabase no está configurado: no hay exámenes guardados en la nube.')
      const ps = (d.presentaciones as Presentacion[]).filter((p) => p.examen.startsWith(PREFIJO))
      setCrudas(ps)
      const correr = correrCon('python')
      for (const p of ps) {
        const puntajes: Puntaje[] = []
        for (const q of PREGUNTAS) puntajes.push(await puntuar(q, p.respuestas[q.id], correr, p.pistas?.[q.id] ?? 0))
        setNotas((n) => ({ ...n, [`${p.examen}:${p.slug}`]: puntajes }))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo hablar con el servidor.')
    } finally {
      setCargando(false)
    }
  }

  function alternar(llave: string) {
    const nuevos = ocultos.includes(llave) ? ocultos.filter((x) => x !== llave) : [...ocultos, llave]
    setOcultos(nuevos)
    try {
      localStorage.setItem(LLAVE_OCULTOS, JSON.stringify(nuevos))
    } catch {
      /* ídem */
    }
  }

  // Los grupos, en orden de fecha, nombrados por el día en que presentaron.
  const grupos = useMemo(() => {
    const porId = new Map<string, string>()
    for (const p of crudas ?? []) {
      const antes = porId.get(p.examen)
      if (!antes || p.inicio < antes) porId.set(p.examen, p.inicio)
    }
    return [...porId.entries()]
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, inicio]) => ({ id, nombre: `Grupo del ${fechaGrupo(inicio)}` }))
  }, [crudas])

  const todas: Fila[] = useMemo(() => {
    return (crudas ?? []).flatMap((p) => {
      const puntajes = notas[`${p.examen}:${p.slug}`]
      if (!puntajes) return []
      const total = puntajes.reduce((s, x) => s + x.puntos, 0)
      const codigo = PREGUNTAS.reduce((s, q, i) => s + (q.tipo === 'codigo' ? puntajes[i].puntos : 0), 0)
      return [
        {
          p,
          grupo: grupos.find((g) => g.id === p.examen)?.nombre ?? p.examen,
          puntajes,
          total,
          nota: nota(total),
          codigo,
          leer: total - codigo,
          contesto: PREGUNTAS.filter((q) => contestada(q, p.respuestas[q.id])).length,
          pistas: Object.values(p.pistas ?? {}).reduce((s, n) => s + n, 0),
        },
      ]
    })
  }, [crudas, notas, grupos])

  const filas = todas.filter((f) => !ocultos.includes(`${f.p.examen}:${f.p.slug}`))
  const calificando = crudas ? crudas.length - todas.length : 0

  if (!crudas) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5">
        <div className="panel p-7">
          <h1 className="mb-1 text-xl font-black">📄 Reporte del examen de Python</h1>
          <p className="mb-5 text-xs leading-relaxed text-[#7f8fb3]">Todos los grupos, alumno por alumno y pregunta por pregunta. Se puede bajar en PDF.</p>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && entrar()}
            placeholder="Clave"
            className="mb-3 w-full rounded-xl border border-[#1e2b45] bg-[#0a1120] px-4 py-3 outline-none focus:border-[#4ade80]"
          />
          <button onClick={() => entrar()} disabled={cargando} className="boton boton-primario w-full">
            {cargando ? 'Entrando…' : 'Entrar'}
          </button>
          {error && <p className="mt-3 text-sm text-[#fb7185]">{error}</p>}
        </div>
      </main>
    )
  }

  const porGrupo = grupos.map((g) => ({ ...g, filas: filas.filter((f) => f.p.examen === g.id) }))

  return (
    <div className="reporte min-h-screen bg-[#e9edf3] py-6 print:bg-white print:py-0">
      <style>{`
        @media print {
          @page { size: letter; margin: 14mm 12mm; }
          body.se-imprime { display: block !important; background: white !important; }
          .reporte table { break-inside: auto; }
          .reporte tr { break-inside: avoid; }
          .reporte h2 { break-after: avoid; }
        }
      `}</style>

      {/* ------------------------------------------------ barra (no se imprime) */}
      <div className="mx-auto mb-4 flex max-w-5xl flex-wrap items-center gap-3 px-5 print:hidden">
        <Link href="/profesor/examen" className="boton boton-secundario">
          ← Volver al examen
        </Link>
        <div className="flex overflow-hidden rounded-lg border border-[#c7d0de]">
          {(
            [
              ['salon', '📊 Del salón'],
              ['alumnos', '🧒 Individuales'],
            ] as const
          ).map(([v, t]) => (
            <button
              key={v}
              onClick={() => setVista(v)}
              className={`px-3 py-2 text-xs font-bold ${vista === v ? 'bg-[#14532d] text-white' : 'bg-white text-[#374151] hover:bg-[#f3f4f6]'}`}
            >
              {t}
            </button>
          ))}
        </div>
        {vista === 'alumnos' && (
          <>
            <select
              value={elegido}
              onChange={(e) => setElegido(e.target.value)}
              className="rounded-lg border border-[#c7d0de] bg-white px-2 py-2 text-xs text-[#1f2937]"
            >
              <option value="todos">Todos, uno por hoja ({filas.length})</option>
              {[...filas]
                .sort((a, b) => a.p.nombre.localeCompare(b.p.nombre))
                .map((f) => (
                  <option key={`${f.p.examen}:${f.p.slug}`} value={`${f.p.examen}:${f.p.slug}`}>
                    {f.p.nombre} · {f.grupo.replace('Grupo del ', '')}
                  </option>
                ))}
            </select>
            <label className="flex items-center gap-1.5 text-xs text-[#374151]">
              <input type="checkbox" checked={conConducta} onChange={(e) => setConConducta(e.target.checked)} />
              Incluir salidas y capturas
            </label>
          </>
        )}
        <button onClick={() => window.print()} disabled={calificando > 0} className="boton boton-primario disabled:opacity-40">
          ⬇ Descargar PDF
        </button>
        <span className="text-xs text-[#4b5b80]">Se abre la ventana de imprimir: escoge &ldquo;Guardar como PDF&rdquo;.</span>
        {calificando > 0 && <span className="animate-pulse text-xs font-bold text-[#b45309]">Calificando con Python… faltan {calificando}</span>}
        {error && <span className="text-xs text-[#be123c]">{error}</span>}
      </div>

      {/* ------------------------------------------------- las individuales */}
      {vista === 'alumnos' &&
        [...filas]
          .sort((a, b) => a.p.nombre.localeCompare(b.p.nombre))
          .filter((f) => elegido === 'todos' || elegido === `${f.p.examen}:${f.p.slug}`)
          .map((f, i) => (
            <ReporteAlumno
              key={`${f.p.examen}:${f.p.slug}`}
              f={f}
              grupo={filas.filter((x) => x.p.examen === f.p.examen)}
              hoy={hoy}
              conConducta={conConducta}
              nuevaHoja={i > 0}
            />
          ))}
      {vista === 'alumnos' && elegido !== 'todos' && !filas.some((f) => `${f.p.examen}:${f.p.slug}` === elegido) && (
        <p className="text-center text-sm text-[#6b7280]">Escoge un alumno de la lista.</p>
      )}

      {/* ------------------------------------------------------- la hoja */}
      {vista === 'salon' && (
      <article style={{ fontFamily: 'Arial, Helvetica, sans-serif' }} className="mx-auto max-w-5xl rounded-xl bg-white px-10 py-9 text-[13px] leading-relaxed text-[#1f2937] shadow print:max-w-none print:rounded-none print:p-0 print:text-[10.5px] print:shadow-none">
        <h1 className="text-2xl font-black text-[#14532d]">
          {EXAMEN_PYTHON.emoji} {EXAMEN_PYTHON.titulo} — reporte de resultados
        </h1>
        <p className="mt-1 text-[#4b5563]">
          {grupos.map((g) => g.nombre).join(' y ')} · {filas.length} presentaciones · hecho el {hoy}
        </p>
        <ul className="mt-3 list-disc space-y-0.5 pl-5 text-[#4b5563]">
          <li>
            {PREGUNTAS.length} preguntas de 0 a {PUNTOS_POR_PREGUNTA} puntos (máximo {MAXIMO}). La nota es el puntaje llevado a la escala de 0
            a 5; se aprueba con 3.0.
          </li>
          <li>
            {CODIGO.length} preguntas de <b>escribir código</b> ({MAX_CODIGO} puntos) y {PREGUNTAS.length - CODIGO.length} de{' '}
            <b>leer código</b> (selección múltiple y falso o verdadero: {MAX_LEER} puntos).
          </li>
          <li>Calificado aquí mismo, con el mismo Python y las mismas pruebas del examen. Las pistas ya están descontadas.</li>
        </ul>

        {/* -------------------------------------------------- 1. resumen */}
        <Titulo n={1}>En una mirada</Titulo>
        <Tabla
          cabeza={['', ...porGrupo.map((g) => g.nombre)]}
          filas={[
            ['Presentaron', ...porGrupo.map((g) => String(g.filas.length))],
            ['Nota promedio (0 a 5)', ...porGrupo.map((g) => <b key={g.id}>{uno(promedio(g.filas.map((f) => f.nota)))}</b>)],
            ['Aprobaron (3.0 o más)', ...porGrupo.map((g) => String(g.filas.filter((f) => f.nota >= 3).length))],
            ['Le dieron Terminar', ...porGrupo.map((g) => `${g.filas.filter((f) => f.p.terminado_por === 'alumno').length} de ${g.filas.length}`)],
            [
              'Puntos en escribir código',
              ...porGrupo.map((g) => pct(g.filas.reduce((s, f) => s + f.codigo, 0), g.filas.length * MAX_CODIGO)),
            ],
            ['Puntos en leer código', ...porGrupo.map((g) => pct(g.filas.reduce((s, f) => s + f.leer, 0), g.filas.length * MAX_LEER))],
          ]}
        />

        {/* ----------------------------------------------- 2. por alumno */}
        <Titulo n={2}>Notas por alumno</Titulo>
        <p className="mb-2 text-[#6b7280] print:hidden">
          Toca un nombre para ver su reporte individual. Puedes quitar del reporte una fila que no sea de un alumno (una prueba tuya, por ejemplo) con ✕. Las filas quitadas
          aparecen abajo, por si quieres devolverlas.
        </p>
        <Tabla
          cabeza={['Alumno', 'Grupo', 'Puntos', 'Nota', 'Contestó', `Código (de ${MAX_CODIGO})`, `Leer (de ${MAX_LEER})`, 'Pistas', 'Salidas', 'Capturas', 'Terminó', '']}
          filas={[...filas]
            .sort((a, b) => b.total - a.total)
            .map((f) => [
              <button
                key="n"
                onClick={() => {
                  setElegido(`${f.p.examen}:${f.p.slug}`)
                  setVista('alumnos')
                  window.scrollTo(0, 0)
                }}
                title="Ver su reporte individual"
                className="whitespace-nowrap text-left font-semibold hover:text-[#15803d] hover:underline print:no-underline"
              >
                {f.p.nombre}
              </button>,
              f.grupo.replace('Grupo del ', ''),
              String(f.total),
              <b key="nota" className={f.nota >= 3 ? 'text-[#15803d]' : 'text-[#b91c1c]'}>
                {uno(f.nota)}
              </b>,
              `${f.contesto}/${PREGUNTAS.length}`,
              String(f.codigo),
              String(f.leer),
              String(f.pistas),
              f.p.salidas >= 20 ? <b key="s">{f.p.salidas}</b> : String(f.p.salidas),
              f.p.capturas ? <b key="c">{f.p.capturas}</b> : '0',
              f.p.terminado_por === 'alumno' ? 'Sí' : 'No',
              <button key="x" onClick={() => alternar(`${f.p.examen}:${f.p.slug}`)} title="Quitar del reporte" className="text-[#9ca3af] hover:text-[#b91c1c] print:hidden">
                ✕
              </button>,
            ])}
        />
        {ocultos.length > 0 && (
          <p className="mt-1 text-[11px] text-[#6b7280] print:hidden">
            Quitadas del reporte:{' '}
            {todas
              .filter((f) => ocultos.includes(`${f.p.examen}:${f.p.slug}`))
              .map((f) => (
                <button key={`${f.p.examen}:${f.p.slug}`} onClick={() => alternar(`${f.p.examen}:${f.p.slug}`)} className="mr-2 underline">
                  {f.p.nombre} ↺
                </button>
              ))}
          </p>
        )}

        {/* ------------------------------------------ 3. por pregunta */}
        <Titulo n={3}>Pregunta por pregunta</Titulo>
        <p className="mb-2 text-[#6b7280]">
          Promedio de puntos (de 0 a 5) y, entre paréntesis, cuántos la contestaron. En rojo, lo que está por debajo de 1.5.
        </p>
        <Tabla
          cabeza={['#', 'Pregunta', 'Tipo', ...porGrupo.map((g) => g.nombre.replace('Grupo del ', '')), 'La prueba que más falló']}
          filas={PREGUNTAS.map((q, i) => {
            const fallas = new Map<string, number>()
            for (const f of filas) {
              if (!contestada(q, f.p.respuestas[q.id])) continue
              for (const x of f.puntajes[i].pruebas ?? []) if (!x.ok) fallas.set(x.msg, (fallas.get(x.msg) ?? 0) + 1)
            }
            const peor = [...fallas.entries()].sort((a, b) => b[1] - a[1])[0]
            return [
              String(i + 1),
              q.titulo,
              { codigo: 'código', opcion: 'selección', vf: 'V/F' }[q.tipo],
              ...porGrupo.map((g) => {
                const m = promedio(g.filas.map((f) => f.puntajes[i].puntos))
                const n = g.filas.filter((f) => contestada(q, f.p.respuestas[q.id])).length
                return (
                  <span key={g.id} className="whitespace-nowrap">
                    <b className={m < 1.5 ? 'text-[#b91c1c]' : ''}>{uno(m)}</b> <span className="text-[#9ca3af]">({n})</span>
                  </span>
                )
              }),
              peor ? `${peor[0]} (${peor[1]})` : '',
            ]
          })}
        />

        <p className="mb-2 mt-4 text-[#6b7280]">Por bloques de cinco preguntas (porcentaje de los puntos posibles):</p>
        <Tabla
          cabeza={['Preguntas', ...porGrupo.map((g) => g.nombre)]}
          filas={Array.from({ length: Math.ceil(PREGUNTAS.length / 5) }, (_, b) => [
            `${b * 5 + 1} a ${Math.min(b * 5 + 5, PREGUNTAS.length)}`,
            ...porGrupo.map((g) => {
              const pts = g.filas.reduce((s, f) => s + f.puntajes.slice(b * 5, b * 5 + 5).reduce((t, x) => t + x.puntos, 0), 0)
              const max = g.filas.length * Math.min(5, PREGUNTAS.length - b * 5) * PUNTOS_POR_PREGUNTA
              return pct(pts, max)
            }),
          ])}
        />

        {/* ---------------------------------------- 4. para mirar */}
        <Titulo n={4}>Para mirar con cuidado</Titulo>
        <ParaMirar filas={filas} />

        {/* ------------------------------------- 5. errores típicos */}
        <Titulo n={5}>Los errores que más se repitieron</Titulo>
        <p className="mb-2 text-[#6b7280]">Leyendo las respuestas de los dos primeros grupos (octubre de 2026):</p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            <b>Escribir el resultado o el texto en vez de hacer la cuenta</b>: <Code>print(&quot;3&quot; + &quot;4&quot;)</Code>,{' '}
            <Code>bicicleta = &quot;2 ruedas&quot;</Code>. Mezclan texto (entre comillas) con números.
          </li>
          <li>
            <b>Escribir la variable dentro de un texto en vez de crearla</b>: <Code>print(&quot;galletas = 24&quot;)</Code>.
          </li>
          <li>
            <b>Calcular sin mostrar</b>: <Code>n * 3</Code> sin <Code>print</Code>.
          </li>
          <li>
            <b>input() sin int()</b>: <Code>input(7 * 3)</Code>, <Code>in(input())</Code>.
          </li>
          <li>
            <b>Copiar mal la frase</b>: &ldquo;Bienvenido&rdquo; por &ldquo;Bienvenidos&rdquo;, &ldquo;Puedes votar&rdquo; por &ldquo;Puede
            votar&rdquo;.
          </li>
          <li>
            <b>El f-string a medias</b>: <Code>[nombre]</Code> con corchetes en vez de llaves.
          </li>
          <li>
            <b>La sangría, los dos puntos y el in del for</b>: <Code>for i range(1, 11)</Code>, el <Code>print</Code> del final metido
            en el ciclo.
          </li>
        </ol>
        <p className="mt-3 text-[#4b5563]">
          Para reforzar todo esto está el curso <b>Preparación para el examen de Python</b> (<Code>/cursos/preparacion-python</Code>): una
          lección por cada punto del examen y un examen de práctica cada cinco.
        </p>
      </article>
      )}
    </div>
  )
}

/**
 * Lo que vale la pena mirar, detectado solo: quién casi no contestó, quién
 * salió mucho de la página o intentó capturas, quién lo presentó dos veces y
 * respuestas de código equivocadas que se repiten igualitas entre varios.
 */
function ParaMirar({ filas }: { filas: Fila[] }) {
  const items: React.ReactNode[] = []

  const pocas = filas.filter((f) => f.contesto <= 5)
  if (pocas.length)
    items.push(
      <>
        <b>Contestaron 5 preguntas o menos</b> (su nota no refleja lo que saben; vale la pena preguntarles qué pasó):{' '}
        {pocas.map((f) => `${f.p.nombre} (${f.contesto})`).join(', ')}.
      </>,
    )

  const salieron = filas.filter((f) => f.p.salidas >= 20).sort((a, b) => b.p.salidas - a.p.salidas)
  if (salieron.length)
    items.push(
      <>
        <b>Salieron 20 veces o más de la página</b>:{' '}
        {salieron.map((f) => `${f.p.nombre} (${f.p.salidas}, ${Math.round(f.p.segundos_fuera / 60)} min fuera)`).join(', ')}.
      </>,
    )

  const capturas = filas.filter((f) => f.p.capturas >= 3).sort((a, b) => b.p.capturas - a.p.capturas)
  if (capturas.length)
    items.push(
      <>
        <b>Tres o más intentos de captura de pantalla</b>: {capturas.map((f) => `${f.p.nombre} (${f.p.capturas})`).join(', ')}. Una
        &ldquo;captura&rdquo; es oprimir Imprimir pantalla o Cmd/Win + Shift: no siempre es una foto, pero sí un intento.
      </>,
    )

  const veces = new Map<string, Fila[]>()
  for (const f of filas) veces.set(f.p.slug, [...(veces.get(f.p.slug) ?? []), f])
  const repetidos = [...veces.values()].filter((v) => v.length > 1)
  if (repetidos.length)
    items.push(
      <>
        <b>Lo presentaron más de una vez</b>:{' '}
        {repetidos.map((v) => `${v[0].p.nombre} (${v.map((f) => `${uno(f.nota)} el ${f.grupo.replace('Grupo del ', '')}`).join(', ')})`).join('; ')}.
      </>,
    )

  // La misma respuesta equivocada, igualita, en tres o más alumnos del mismo grupo.
  for (const [i, q] of PREGUNTAS.entries()) {
    if (q.tipo !== 'codigo') continue
    const grupos = new Map<string, Fila[]>()
    for (const f of filas) {
      const r = f.p.respuestas[q.id]
      if (typeof r !== 'string' || !contestada(q, r) || f.puntajes[i].puntos === PUNTOS_POR_PREGUNTA) continue
      const k = `${f.p.examen}|${huella(r)}`
      grupos.set(k, [...(grupos.get(k) ?? []), f])
    }
    for (const iguales of grupos.values()) {
      if (iguales.length < 3) continue
      items.push(
        <>
          <b>
            {iguales.length} alumnos del {iguales[0].grupo.replace('Grupo del ', '')} escribieron la misma respuesta equivocada en la
            pregunta {i + 1} ({q.titulo})
          </b>
          : {iguales.map((f) => f.p.nombre).join(', ')}. Puede ser casualidad, pero es raro que varios se equivoquen igual.
          <pre className="mt-1 whitespace-pre-wrap rounded bg-[#f3f4f6] px-2 py-1 font-mono text-[11px]">{String(iguales[0].p.respuestas[q.id])}</pre>
        </>,
      )
    }
  }

  const pegaron = filas.filter((f) => f.p.pegados > 0)
  items.push(
    pegaron.length ? (
      <>
        <b>Intentaron pegar código</b>: {pegaron.map((f) => `${f.p.nombre} (${f.p.pegados})`).join(', ')}.
      </>
    ) : (
      <>Nadie intentó pegar código.</>
    ),
  )

  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((it, k) => (
        <li key={k}>{it}</li>
      ))}
    </ul>
  )
}

function Titulo({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h2 className="mb-2 mt-7 border-b-2 border-[#bbf7d0] pb-1 text-base font-black text-[#14532d]">
      {n}. {children}
    </h2>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-[#f3f4f6] px-1 font-mono text-[0.92em]">{children}</code>
}

function Tabla({ cabeza, filas }: { cabeza: React.ReactNode[]; filas: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto print:overflow-visible">
      <table className="w-full border-collapse text-left text-[12px] print:text-[9.5px]">
        <thead>
          <tr>
            {cabeza.map((c, i) => (
              <th key={i} className="border border-[#a7c4b0] bg-[#dcfce7] px-2 py-1.5 font-bold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={i} className="even:bg-[#f9fafb]">
              {f.map((c, k) => (
                <td key={k} className="border border-[#d1d5db] px-2 py-1">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** Las lecciones del curso de preparación van en el mismo orden del examen: la pregunta N se repasa en la lección N. */
const CURSO_PREPARACION = '/cursos/preparacion-python'

const BLOQUES = [
  'print, texto y cuentas',
  'variables, input, f-string e if',
  'if, for y range',
  'for, while y listas',
  'listas y funciones',
  'sangría y funciones',
]

function minutos(desde: string, hasta: string) {
  return Math.max(0, Math.round((Date.parse(hasta) - Date.parse(desde)) / 60000))
}

/**
 * El reporte de un solo alumno, en su propia hoja: su nota frente al
 * promedio de su grupo, por temas, qué le salió bien, qué repasar (con la
 * lección del curso de preparación) y pregunta por pregunta, con lo que le
 * faltó. Escrito para que se lo puedan leer a él o a su familia.
 */
function ReporteAlumno({
  f,
  grupo,
  hoy,
  conConducta,
  nuevaHoja,
}: {
  f: Fila
  grupo: Fila[]
  hoy: string
  conConducta: boolean
  nuevaHoja: boolean
}) {
  const promGrupo = promedio(grupo.map((x) => x.nota))
  const aprobo = f.nota >= 3
  const bien = PREGUNTAS.map((q, i) => ({ q, i })).filter(({ i }) => f.puntajes[i].puntos === PUNTOS_POR_PREGUNTA)
  const repasar = PREGUNTAS.map((q, i) => ({ q, i })).filter(
    ({ q, i }) => f.puntajes[i].puntos <= 3 && contestada(q, f.p.respuestas[q.id]),
  )
  const enBlanco = PREGUNTAS.map((q, i) => ({ q, i })).filter(({ q }) => !contestada(q, f.p.respuestas[q.id]))
  const fin = f.p.fin ?? f.p.actualizado
  const fecha = new Date(f.p.inicio).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' })

  return (
    <article
      style={{ fontFamily: 'Arial, Helvetica, sans-serif', breakBefore: nuevaHoja ? 'page' : undefined }}
      className="mx-auto mb-6 max-w-4xl rounded-xl bg-white px-10 py-9 text-[13px] leading-relaxed text-[#1f2937] shadow print:mb-0 print:max-w-none print:rounded-none print:p-0 print:text-[10.5px] print:shadow-none"
    >
      <p className="text-[11px] font-bold uppercase tracking-wider text-[#15803d]">
        {EXAMEN_PYTHON.emoji} {EXAMEN_PYTHON.titulo} · reporte individual
      </p>
      <h1 className="mt-1 text-2xl font-black text-[#111827]">{f.p.nombre}</h1>
      <p className="text-[#4b5563]">
        {f.grupo} · presentado el {fecha} · reporte hecho el {hoy}
      </p>

      {/* -------------------------------------------------------- la nota */}
      <div className="mt-5 flex flex-wrap items-stretch gap-4">
        <div className={`rounded-xl border-2 px-6 py-4 text-center ${aprobo ? 'border-[#86efac] bg-[#f0fdf4]' : 'border-[#fecaca] bg-[#fef2f2]'}`}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Nota</p>
          <p className={`text-4xl font-black ${aprobo ? 'text-[#15803d]' : 'text-[#b91c1c]'}`}>{uno(f.nota)}</p>
          <p className="text-[11px] text-[#6b7280]">de 5 · {aprobo ? 'aprobó' : 'todavía no aprueba (se aprueba con 3.0)'}</p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-1 self-center sm:grid-cols-3">
          <Dato t="Puntos" v={`${f.total} de ${MAXIMO}`} />
          <Dato t="Promedio de su grupo" v={`${uno(promGrupo)} de 5`} />
          <Dato t="Preguntas contestadas" v={`${f.contesto} de ${PREGUNTAS.length}`} />
          <Dato t="Escribir código" v={`${f.codigo} de ${MAX_CODIGO} (${pct(f.codigo, MAX_CODIGO)})`} />
          <Dato t="Leer código" v={`${f.leer} de ${MAX_LEER} (${pct(f.leer, MAX_LEER)})`} />
          <Dato t="Pistas abiertas" v={String(f.pistas)} />
          <Dato t="Tiempo" v={`${minutos(f.p.inicio, fin)} min`} />
          <Dato t="Le dio Terminar" v={f.p.terminado_por === 'alumno' ? 'Sí' : 'No (se cerró a la hora)'} />
        </div>
      </div>

      {/* ------------------------------------------------------ por temas */}
      <Titulo n={1}>Por temas</Titulo>
      <div className="space-y-1.5">
        {BLOQUES.map((tema, b) => {
          const mio = f.puntajes.slice(b * 5, b * 5 + 5).reduce((s, x) => s + x.puntos, 0)
          const suyo = Math.round((mio / 25) * 100)
          const delGrupo = Math.round(
            (promedio(grupo.map((x) => x.puntajes.slice(b * 5, b * 5 + 5).reduce((s, y) => s + y.puntos, 0))) / 25) * 100,
          )
          return (
            <div key={b} className="flex items-center gap-3">
              <span className="w-56 shrink-0 text-[12px] print:w-44 print:text-[10px]">
                <b>{b * 5 + 1}–{b * 5 + 5}</b> · {tema}
              </span>
              <div className="relative h-3.5 flex-1 overflow-hidden rounded bg-[#f3f4f6] print:[print-color-adjust:exact]">
                <div
                  className={`h-full ${suyo >= 60 ? 'bg-[#4ade80]' : suyo >= 30 ? 'bg-[#fbbf24]' : 'bg-[#f87171]'} print:[print-color-adjust:exact]`}
                  style={{ width: `${suyo}%` }}
                />
                <div className="absolute top-0 h-full w-0.5 bg-[#1f2937]" style={{ left: `${delGrupo}%` }} title="Promedio del grupo" />
              </div>
              <span className="w-32 shrink-0 whitespace-nowrap text-right text-[12px] print:w-28 print:text-[10px]">
                <b>{suyo} %</b> <span className="text-[#9ca3af]">(grupo {delGrupo} %)</span>
              </span>
            </div>
          )
        })}
        <p className="text-[11px] text-[#6b7280]">La rayita negra es el promedio de su grupo.</p>
      </div>

      {/* -------------------------------------------- bien y por repasar */}
      <div className="mt-2 grid gap-5 sm:grid-cols-2 print:grid-cols-2">
        <div>
          <Titulo n={2}>Lo que le salió muy bien</Titulo>
          {bien.length ? (
            <ul className="list-disc space-y-0.5 pl-5">
              {bien.map(({ q, i }) => (
                <li key={q.id}>
                  {i + 1}. {q.titulo}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[#6b7280]">Ninguna pregunta completa todavía. ¡La próxima!</p>
          )}
        </div>
        <div>
          <Titulo n={3}>Lo que tiene que repasar</Titulo>
          {repasar.length || enBlanco.length ? (
            <>
              {repasar.length > 0 && (
                <ul className="list-disc space-y-0.5 pl-5">
                  {repasar.map(({ q, i }) => (
                    <li key={q.id}>
                      {i + 1}. {q.titulo} → <b>lección {i + 1}</b>
                    </li>
                  ))}
                </ul>
              )}
              {enBlanco.length > 0 && (
                <p className="mt-1.5">
                  <b>No las contestó:</b> {rangos(enBlanco.map(({ i }) => i + 1))} → las mismas lecciones.
                </p>
              )}
              <p className="mt-2 text-[11px] text-[#4b5563]">
                Cada pregunta tiene su lección con el mismo número en el curso <b>Preparación para el examen de Python</b> (
                <Code>{CURSO_PREPARACION}</Code>).
              </p>
            </>
          ) : (
            <p className="text-[#6b7280]">¡Nada! Todo le salió bien o casi bien.</p>
          )}
        </div>
      </div>

      {/* --------------------------------------------- pregunta por pregunta */}
      <Titulo n={4}>Pregunta por pregunta</Titulo>
      <Tabla
        cabeza={['#', 'Pregunta', 'Tipo', 'Puntos', 'Qué pasó']}
        filas={PREGUNTAS.map((q, i) => {
          const pz = f.puntajes[i]
          const r = f.p.respuestas[q.id]
          let detalle: React.ReactNode
          if (!contestada(q, r)) detalle = <span className="text-[#9ca3af]">No la contestó.</span>
          else if (pz.puntos === PUNTOS_POR_PREGUNTA) detalle = <span className="text-[#15803d]">¡Perfecta!</span>
          else if (q.tipo === 'opcion') {
            const buena = q.opciones.find((o) => o.puntos === PUNTOS_POR_PREGUNTA)?.texto
            detalle = (
              <>
                Escogió <b>{q.opciones[r as number]?.texto}</b>; la respuesta era <b>{buena}</b>.
              </>
            )
          } else if (q.tipo === 'vf') {
            detalle = (
              <>
                Dijo <b>{r ? 'Verdadero' : 'Falso'}</b>; era <b>{q.verdadero ? 'Verdadero' : 'Falso'}</b>.
              </>
            )
          } else {
            const fallas = (pz.pruebas ?? []).filter((x) => !x.ok).map((x) => x.msg)
            detalle = (
              <>
                {fallas.length > 0 && <span>Le faltó: {fallas.join(' · ')}.</span>}
                {pz.descuento ? <span className="text-[#b45309]"> Las pistas le costaron {pz.descuento}.</span> : null}
                <pre className="mt-1 max-h-40 overflow-hidden whitespace-pre-wrap rounded bg-[#f3f4f6] px-2 py-1 font-mono text-[10.5px] print:max-h-none print:text-[8.5px]">
                  {String(r)}
                </pre>
              </>
            )
          }
          return [
            String(i + 1),
            q.titulo,
            { codigo: 'código', opcion: 'selección', vf: 'V/F' }[q.tipo],
            <b
              key="p"
              className={pz.puntos === PUNTOS_POR_PREGUNTA ? 'text-[#15803d]' : pz.puntos > 0 ? 'text-[#b45309]' : 'text-[#b91c1c]'}
            >
              {pz.puntos}/{PUNTOS_POR_PREGUNTA}
            </b>,
            detalle,
          ]
        })}
      />

      {conConducta && (
        <>
          <Titulo n={5}>Durante el examen</Titulo>
          <p>
            Salió de la página del examen <b>{f.p.salidas}</b> {f.p.salidas === 1 ? 'vez' : 'veces'} (
            {Math.round(f.p.segundos_fuera / 60)} min fuera en total) · intentos de captura de pantalla: <b>{f.p.capturas}</b> ·
            intentos de pegar código: <b>{f.p.pegados}</b>.
          </p>
          <p className="mt-1 text-[11px] text-[#6b7280]">
            Una salida es irse a otra pestaña o aplicación; una captura es oprimir Imprimir pantalla o Cmd/Win + Shift.
          </p>
        </>
      )}
    </article>
  )
}

function Dato({ t, v }: { t: string; v: string }) {
  return (
    <p className="text-[12px] print:text-[10px]">
      <span className="text-[#6b7280]">{t}:</span> <b>{v}</b>
    </p>
  )
}

/** [1, 2, 3, 5, 7, 8] → "1 a 3, 5, 7 y 8". */
function rangos(ns: number[]) {
  const partes: string[] = []
  for (let i = 0; i < ns.length; ) {
    let j = i
    while (j + 1 < ns.length && ns[j + 1] === ns[j] + 1) j++
    partes.push(j - i >= 2 ? `${ns[i]} a ${ns[j]}` : j > i ? `${ns[i]}, ${ns[j]}` : `${ns[i]}`)
    i = j + 1
  }
  return partes.length > 1 ? `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}` : partes[0]
}
