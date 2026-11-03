'use client'

import { useState } from 'react'
import { Terminal } from '@/components/Terminal'
import { ConCodigo } from '@/components/cursos/Explicacion'
import { explicarError } from '@/lib/cursos/errores'
import { motorDe, type EstadoMotor } from '@/lib/cursos/motor'
import type { Resultado } from '@/lib/cursos/calificar'
import { ordenDeOpciones } from '@/lib/examen/puntuar'
import { COSTO_PISTAS, type Pregunta, type Respuesta } from '@/lib/examen/tipos'

/*
 * Cómo se ve una pregunta del examen: de código (editor, correr y pistas), de
 * selección múltiple o de falso o verdadero. La usan el examen de verdad
 * (/examen-python) y los exámenes de práctica del curso de preparación.
 */

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

export function VistaPregunta({
  pregunta: p,
  numero,
  slug,
  respuesta,
  pistasAbiertas,
  onAbrirPista,
  motor,
  onResponder,
  onTeclas,
  onPegado,
}: {
  pregunta: Pregunta
  numero: number
  slug: string
  respuesta: Respuesta | undefined
  pistasAbiertas: number
  onAbrirPista: () => void
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
        pistasAbiertas={pistasAbiertas}
        onAbrirPista={onAbrirPista}
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
  pistasAbiertas,
  onAbrirPista,
  motor,
  onResponder,
  onTeclas,
  onPegado,
}: {
  pregunta: Extract<Pregunta, { tipo: 'codigo' }>
  numero: number
  codigoGuardado: string
  pistasAbiertas: number
  onAbrirPista: () => void
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
        <Pistas pistas={p.pistas} abiertas={pistasAbiertas} onAbrir={onAbrirPista} />
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

/**
 * Las dos pistas de una pregunta de código. Cada una se abre con una pregunta
 * de "¿seguro?", porque cuesta puntos: la primera 1 y la segunda 2 más.
 */
function Pistas({ pistas, abiertas, onAbrir }: { pistas: [string, string]; abiertas: number; onAbrir: () => void }) {
  const [preguntando, setPreguntando] = useState(false)
  const siguiente = abiertas + 1
  const cuesta = siguiente <= 2 ? COSTO_PISTAS[siguiente] - COSTO_PISTAS[abiertas] : 0

  return (
    <div className="mt-5 space-y-2.5 border-t border-[#1e2b45] pt-4">
      <p className="etiqueta">💡 Pistas · cuestan puntos</p>
      {pistas.slice(0, abiertas).map((texto, i) => (
        <div key={i} className="aparecer rounded-xl border border-[#78350f] bg-[#241a08] p-3">
          <p className="mb-1 text-[10px] font-bold text-[#fbbf24]">
            Pista {i + 1} · −{COSTO_PISTAS[i + 1] - COSTO_PISTAS[i]} {i === 0 ? 'punto' : 'puntos'}
          </p>
          <p className="text-sm leading-relaxed text-[#fde8c0]">
            <ConCodigo texto={texto} />
          </p>
        </div>
      ))}
      {siguiente <= 2 &&
        (preguntando ? (
          <div className="rounded-xl border border-[#78350f] p-3">
            <p className="text-xs leading-relaxed text-[#fde8c0]">
              ¿Seguro? La pista {siguiente} te quita <b>{cuesta} {cuesta === 1 ? 'punto' : 'puntos'}</b> en esta pregunta
              {siguiente === 2 ? ' (con las dos, lo máximo que puedes sacar es 2 de 5)' : ' (lo máximo que puedes sacar queda en 4 de 5)'}.
              No se puede deshacer.
            </p>
            <div className="mt-2.5 flex gap-2">
              <button
                onClick={() => {
                  setPreguntando(false)
                  onAbrir()
                }}
                className="boton boton-primario"
              >
                Sí, ver la pista
              </button>
              <button onClick={() => setPreguntando(false)} className="boton boton-secundario">
                Mejor no
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => setPreguntando(true)} className="boton boton-secundario">
            Ver la pista {siguiente} (−{cuesta} {cuesta === 1 ? 'punto' : 'puntos'})
          </button>
        ))}
    </div>
  )
}
