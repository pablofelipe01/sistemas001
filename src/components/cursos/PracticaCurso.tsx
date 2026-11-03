'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Aviso } from '@/components/Aviso'
import { Confeti } from '@/components/Confeti'
import { VistaPregunta } from '@/components/examen/VistaPregunta'
import { Cortina, MarcaDeAgua, useVigilancia } from '@/components/Vigilancia'
import { useAvanceCurso } from './useAvanceCurso'
import { guardarPractica, retosHechos } from '@/lib/cursos'
import { correrCon, motorDe, type EstadoMotor } from '@/lib/cursos/motor'
import type { Curso, Practica } from '@/lib/cursos/tipos'
import { contestada, puntuar, type Puntaje } from '@/lib/examen/puntuar'
import { PUNTOS_POR_PREGUNTA, type Respuesta } from '@/lib/examen/tipos'
import { registrarEvento } from '@/lib/storage'

/** Con menos de esto en una pregunta, se manda a repasar su lección. */
const PARA_REPASAR = 4

type Fase = 'portada' | 'preguntas' | 'calificando' | 'resultado'

/**
 * Un examen de práctica del curso de preparación: unas preguntas como las del
 * examen de verdad (con las mismas pistas que cuestan puntos), y al final una
 * revisión que dice qué lecciones repasar. No cuenta para nada y se puede
 * repetir las veces que quiera; el profe ve el resultado en los movimientos.
 */
export function PracticaCurso({ curso, practica }: { curso: Curso; practica: Practica }) {
  const { nombre, slug, avance, cargado } = useAvanceCurso(curso.id)
  const [fase, setFase] = useState<Fase>('portada')
  const [actual, setActual] = useState(0)
  const [respuestas, setRespuestas] = useState<Record<string, Respuesta>>({})
  const [pistas, setPistas] = useState<Record<string, number>>({})
  const [puntajes, setPuntajes] = useState<Puntaje[]>([])
  const [motor, setMotor] = useState<EstadoMotor>('apagado')
  const [aviso, setAviso] = useState<string | null>(null)
  const [confirmar, setConfirmar] = useState(false)
  // Se cambia al repetir, para que los editores arranquen en blanco.
  const [ronda, setRonda] = useState(0)

  const preguntas = practica.preguntas
  const p = preguntas[actual]
  const leccionDeAntes = curso.lecciones.find((l) => l.numero === practica.despuesDe)
  const siguiente = curso.lecciones.find((l) => l.numero === practica.despuesDe + 1)
  const abierta = !leccionDeAntes || retosHechos(leccionDeAntes, avance) === leccionDeAntes.retos.length
  const hechas = preguntas.filter((q) => contestada(q, respuestas[q.id])).length

  const python = motorDe('python')
  useEffect(() => python.escuchar(setMotor), [python])
  useEffect(() => {
    void python.arrancar().catch(() => {})
  }, [python])

  // Igual que en el examen: pantallazos y salidas tapan la práctica y se cuentan.
  const [vigilado, setVigilado] = useState({ capturas: 0, salidas: 0 })
  const { tapado } = useVigilancia({
    activo: fase === 'preguntas',
    onCaptura: () => {
      setVigilado((v) => ({ ...v, capturas: v.capturas + 1 }))
      if (slug) registrarEvento(slug, 'captura', practica.id, `${curso.titulo} · ${practica.titulo}`)
    },
    onSalida: () => setVigilado((v) => ({ ...v, salidas: v.salidas + 1 })),
    avisar: (texto) => setAviso(texto),
  })

  const responder = useCallback((id: string, r: Respuesta) => setRespuestas((rs) => ({ ...rs, [id]: r })), [])

  async function terminar() {
    setConfirmar(false)
    setFase('calificando')
    const correr = correrCon('python')
    const ps: Puntaje[] = []
    for (const q of preguntas) ps.push(await puntuar(q, respuestas[q.id], correr, pistas[q.id] ?? 0))
    setPuntajes(ps)
    setFase('resultado')

    const puntos = ps.map((x) => x.puntos)
    guardarPractica(curso.id, slug, practica.id, { puntos, fecha: new Date().toISOString() })
    const total = puntos.reduce((s, n) => s + n, 0)
    const repasar = preguntas.filter((_, i) => puntos[i] < PARA_REPASAR).map((q) => `L${q.leccion}`)
    if (slug) {
      registrarEvento(
        slug,
        'practica',
        practica.id,
        `${practica.titulo}: ${nota(total, preguntas.length)} de 5${repasar.length ? ` · repasar ${repasar.join(', ')}` : ' · todo bien'}` +
          (vigilado.capturas || vigilado.salidas ? ` · ${vigilado.capturas} pantallazos, ${vigilado.salidas} salidas` : ''),
      )
    }
  }

  function repetir() {
    setRespuestas({})
    setPistas({})
    setPuntajes([])
    setActual(0)
    setRonda((r) => r + 1)
    setVigilado({ capturas: 0, salidas: 0 })
    setFase('preguntas')
  }

  if (!cargado) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-[#7f8fb3]">Cargando…</p>
      </main>
    )
  }

  if (!abierta) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 text-center">
        <p className="mb-3 text-4xl">🔒</p>
        <h1 className="mb-2 text-xl font-black">Esta práctica todavía está cerrada</h1>
        <p className="mb-6 text-sm text-[#9fb0d4]">Se abre cuando termines la lección {practica.despuesDe}.</p>
        <Link href={`/cursos/${curso.id}`} className="boton boton-primario">
          ← Ver las lecciones
        </Link>
      </main>
    )
  }

  if (fase === 'portada') {
    const desde = preguntas[0]?.leccion
    const hasta = preguntas[preguntas.length - 1]?.leccion
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-5">
        <div className="panel p-7">
          <p className="etiqueta mb-2 text-[#22d3ee]">
            {curso.emoji} {curso.titulo} · Examen de práctica {practica.numero}
          </p>
          <h1 className="mb-3 text-2xl font-black text-[#e8eeff]">📝 {practica.titulo}</h1>
          <ul className="space-y-2 text-sm leading-relaxed text-[#a9bad9]">
            <li>
              • Son <b className="text-[#e2e8ff]">{preguntas.length} preguntas</b>, una por cada punto del {desde} al {hasta}, del
              mismo tipo que las del examen de verdad.
            </li>
            <li>• Cada una vale de 0 a 5. Las de código tienen dos pistas que cuestan puntos, igual que en el examen.</li>
            <li>
              • <b className="text-[#e2e8ff]">No cuenta para la nota</b>. Al final te digo cómo te fue y qué lección repasar.
            </li>
            <li>• La puedes repetir las veces que quieras.</li>
            <li>
              • <b className="text-[#ffd7e2]">📸 Igual que en el examen: nada de pantallazos ni de salirte de la página.</b> Se tapa y
              le llega al profe.
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setFase('preguntas')} className="boton boton-primario">
              ¡Empezar! →
            </button>
            <Link href={`/cursos/${curso.id}`} className="boton boton-secundario">
              ← Volver a las lecciones
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (fase === 'calificando') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3">
        <p className="text-4xl">🐍</p>
        <p className="animate-pulse text-sm text-[#9fb0d4]">Revisando tus respuestas con Python…</p>
      </main>
    )
  }

  if (fase === 'resultado') {
    return (
      <Resultado
        curso={curso}
        practica={practica}
        puntajes={puntajes}
        siguiente={siguiente}
        onRepetir={repetir}
      />
    )
  }

  return (
    <div className="no-copiar flex min-h-screen flex-col">
      <MarcaDeAgua nombre={nombre} />
      <Cortina visible={tapado} />
      <Aviso mensaje={aviso} tono="alerta" onCerrar={() => setAviso(null)} />
      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#1e2b45] bg-[#0b1222] px-4 py-2.5">
        <div className="min-w-0">
          <p className="etiqueta text-[#22d3ee]">
            {curso.emoji} Examen de práctica {practica.numero} · no cuenta para la nota
          </p>
          <h1 className="truncate text-base font-black text-[#e8eeff]">📝 {practica.titulo}</h1>
        </div>
        <ol className="flex items-center gap-1.5" aria-label="Preguntas">
          {preguntas.map((q, i) => (
            <li key={q.id}>
              <button
                onClick={() => setActual(i)}
                title={`Pregunta ${i + 1}: ${q.titulo}`}
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] font-bold transition ${
                  contestada(q, respuestas[q.id])
                    ? 'border-[#166534] bg-[#166534] text-[#c9f7d8]'
                    : 'border-[#4ade80] text-[#4ade80]'
                } ${i === actual ? 'ring-2 ring-[#22d3ee] ring-offset-2 ring-offset-[#0b1222]' : ''}`}
              >
                {i + 1}
              </button>
            </li>
          ))}
        </ol>
        <Link href={`/cursos/${curso.id}`} className="boton boton-secundario ml-auto">
          ← Lecciones
        </Link>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 lg:h-[calc(100vh-60px)]">
        <VistaPregunta
          key={`${ronda}:${p.id}`}
          pregunta={p}
          numero={actual + 1}
          slug={slug || 'invitado'}
          respuesta={respuestas[p.id]}
          pistasAbiertas={pistas[p.id] ?? 0}
          onAbrirPista={() => setPistas((ps) => ({ ...ps, [p.id]: Math.min((ps[p.id] ?? 0) + 1, 2) }))}
          motor={motor}
          onResponder={(r) => responder(p.id, r)}
          onTeclas={() => {}}
          onPegado={() => setAviso('✋ Nada de pegar. Aquí se escribe con los dedos.')}
        />
        <div className="flex items-center justify-between gap-2">
          <button disabled={actual === 0} onClick={() => setActual(actual - 1)} className="boton boton-secundario disabled:opacity-30">
            ← Anterior
          </button>
          <span className="text-xs text-[#5a6b8f]">
            Pregunta {actual + 1} de {preguntas.length}
          </span>
          {actual < preguntas.length - 1 ? (
            <button onClick={() => setActual(actual + 1)} className="boton boton-primario">
              Siguiente →
            </button>
          ) : (
            <button onClick={() => setConfirmar(true)} className="boton boton-primario">
              🏁 Terminar y ver cómo me fue
            </button>
          )}
        </div>
      </main>

      {confirmar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5">
          <div className="panel aparecer max-w-md p-6 text-center">
            <p className="mb-2 text-4xl">🏁</p>
            <h2 className="mb-2 text-lg font-black text-[#e8eeff]">¿Terminar la práctica?</h2>
            <p className="text-sm leading-relaxed text-[#9fb0d4]">
              Contestaste {hechas} de {preguntas.length}.
              {hechas < preguntas.length && ` Te faltan ${preguntas.length - hechas}: las que dejes en blanco valen 0.`}
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button onClick={() => setConfirmar(false)} className="boton boton-secundario">
                Seguir respondiendo
              </button>
              <button onClick={() => void terminar()} className="boton boton-primario">
                Sí, terminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** La nota en la escala del colegio, de 0 a 5 con un decimal. */
function nota(puntos: number, preguntas: number) {
  return ((puntos / (preguntas * PUNTOS_POR_PREGUNTA)) * 5).toFixed(1)
}

function Resultado({
  curso,
  practica,
  puntajes,
  siguiente,
  onRepetir,
}: {
  curso: Curso
  practica: Practica
  puntajes: Puntaje[]
  siguiente: Curso['lecciones'][number] | undefined
  onRepetir: () => void
}) {
  const preguntas = practica.preguntas
  const total = puntajes.reduce((s, x) => s + x.puntos, 0)
  const n = nota(total, preguntas.length)
  const flojas = preguntas.map((q, i) => ({ q, pts: puntajes[i] })).filter((x) => x.pts.puntos < PARA_REPASAR)
  // Una lección por renglón, aunque dos preguntas manden a la misma.
  const repasar = [...new Set(flojas.map((x) => x.q.leccion))]
    .map((num) => curso.lecciones.find((l) => l.numero === num))
    .filter((l): l is NonNullable<typeof l> => Boolean(l))
  const todoBien = repasar.length === 0

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <Confeti activo={todoBien} />
      <div className="panel p-6 text-center">
        <p className="etiqueta mb-2 text-[#22d3ee]">Examen de práctica {practica.numero} · resultado</p>
        <p className="text-5xl font-black text-[#e8eeff]">
          {n} <span className="text-lg font-bold text-[#7f8fb3]">de 5</span>
        </p>
        <p className="mt-1 text-xs text-[#7f8fb3]">
          {total} de {preguntas.length * PUNTOS_POR_PREGUNTA} puntos
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[#cfdaf5]">
          {todoBien
            ? '¡Muy bien! Estos puntos ya los tienes listos para el examen. Sigue así.'
            : repasar.length === preguntas.length
              ? 'Todavía no. No pasa nada: para eso es la práctica. Vamos a repasar con calma y la vuelves a intentar.'
              : 'Vas bien, pero hay cosas que todavía se te escapan. Repásalas y vuelve a intentarlo.'}
        </p>
      </div>

      {!todoBien && (
        <section className="mt-5 rounded-xl border border-[#78350f] bg-[#241a08] p-5">
          <h2 className="mb-3 text-sm font-black text-[#fde8c0]">💪 Te falta fortalecer…</h2>
          <ul className="space-y-2.5">
            {repasar.map((l) => (
              <li key={l.id} className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-[#fde8c0]">
                  {l.emoji} <b>Punto {l.numero}:</b> {l.titulo}
                </span>
                <Link href={`/cursos/${curso.id}/${l.id}`} className="boton boton-secundario text-xs">
                  Volvamos a la lección {l.numero} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-5 space-y-2">
        <h2 className="etiqueta mb-1">Pregunta por pregunta</h2>
        {preguntas.map((q, i) => {
          const pts = puntajes[i]
          const color = pts.puntos === PUNTOS_POR_PREGUNTA ? 'text-[#86efac]' : pts.puntos ? 'text-[#fbbf24]' : 'text-[#fb7185]'
          return (
            <div key={q.id} className="panel p-3.5">
              <p className="flex justify-between gap-3 text-sm font-bold text-[#e2e8ff]">
                <span>
                  {i + 1}. {q.titulo} <span className="font-normal text-[#5a6b8f]">· punto {q.leccion}</span>
                </span>
                <span className={color}>
                  {pts.puntos}/{PUNTOS_POR_PREGUNTA}
                </span>
              </p>
              {pts.descuento ? <p className="mt-1 text-[11px] text-[#fbbf24]">💡 Las pistas te costaron {pts.descuento}.</p> : null}
              {pts.pruebas && pts.puntos < PUNTOS_POR_PREGUNTA && (
                <ul className="mt-1.5 space-y-0.5">
                  {pts.pruebas.map((x, k) => (
                    <li key={k} className={`text-[11px] ${x.ok ? 'text-[#86efac]' : 'text-[#fb7185]'}`}>
                      {x.ok ? '✓' : '✗'} {x.msg}
                    </li>
                  ))}
                </ul>
              )}
              {!pts.pruebas && pts.puntos < PUNTOS_POR_PREGUNTA && (
                <p className="mt-1 text-[11px] text-[#fb7185]">
                  {pts.puntos > 0 ? 'Ibas por buen camino, pero esa no era la mejor respuesta.' : 'Esa no era.'} Repasa la lección{' '}
                  {q.leccion}.
                </p>
              )}
            </div>
          )
        })}
      </section>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button onClick={onRepetir} className="boton boton-secundario">
          ↻ Repetir la práctica
        </button>
        {siguiente ? (
          <Link href={`/cursos/${curso.id}/${siguiente.id}`} className="boton boton-primario">
            Seguir con la lección {siguiente.numero} →
          </Link>
        ) : (
          <Link href={`/cursos/${curso.id}`} className="boton boton-primario">
            Ver las lecciones
          </Link>
        )}
      </div>
    </main>
  )
}
