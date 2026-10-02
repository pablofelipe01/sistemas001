'use client'

import { Fragment, useState } from 'react'
import { CodigoModelo } from '@/components/CodigoModelo'
import { motorPython } from '@/lib/cursos/motor-python'
import { explicarError } from '@/lib/cursos/errores-python'
import type { Bloque } from '@/lib/cursos/tipos'

/** Pinta `así` como código dentro de un párrafo. */
export function ConCodigo({ texto }: { texto: string }) {
  const partes = texto.split('`')
  return (
    <>
      {partes.map((p, i) =>
        i % 2 ? (
          <code key={i} className="rounded bg-[#101a2e] px-1 py-0.5 text-[0.92em] text-[#86efac]">
            {p}
          </code>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  )
}

function EjemploQueCorre({ codigo, entradas, onIntentoDeCopia }: { codigo: string; entradas?: string[]; onIntentoDeCopia: () => void }) {
  const [salida, setSalida] = useState<string | null>(null)
  const [corriendo, setCorriendo] = useState(false)

  async function correr() {
    setCorriendo(true)
    const r = await motorPython().correr({ codigo, entradas })
    setCorriendo(false)
    if (r.tiempoAgotado) setSalida('⏱ Se demoró demasiado.')
    else if (r.error) setSalida(r.salida + '⚠ ' + explicarError(r.error, codigo).titulo)
    else setSalida(r.salida)
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#1e2b45] bg-[#0a1120]">
      <div>
        <CodigoModelo lang="python" codigo={codigo} onIntentoDeCopia={onIntentoDeCopia} />
      </div>
      <div className="flex items-center gap-2 border-t border-[#1e2b45] px-3 py-1.5">
        <button onClick={correr} disabled={corriendo} className="text-[11px] font-bold text-[#4ade80] hover:underline disabled:opacity-50">
          {corriendo ? 'Corriendo…' : '▶ Correr el ejemplo'}
        </button>
        {entradas?.length ? (
          <span className="text-[10px] text-[#5a6b8f]">respondiendo: {entradas.join(', ')}</span>
        ) : null}
      </div>
      {salida !== null && (
        <pre className="aparecer whitespace-pre-wrap border-t border-[#1e2b45] bg-[#060a14] px-3 py-2 text-[12px] leading-relaxed text-[#d6e4ff]">
          {salida || '(no imprimió nada)'}
        </pre>
      )}
    </div>
  )
}

export function Explicacion({ bloques, onIntentoDeCopia }: { bloques: Bloque[]; onIntentoDeCopia: () => void }) {
  return (
    <div className="space-y-4">
      {bloques.map((b, i) => {
        if (b.t === 'p') {
          return (
            <p key={i} className="text-sm leading-relaxed text-[#a9bad9]">
              <ConCodigo texto={b.texto} />
            </p>
          )
        }
        if (b.t === 'ojo') {
          return (
            <div key={i} className="rounded-xl border border-[#78350f] bg-[#241a08] p-3">
              <p className="etiqueta mb-1 text-[#fbbf24]">👀 Ojo</p>
              <p className="text-[13px] leading-relaxed text-[#fde8c0]">
                <ConCodigo texto={b.texto} />
              </p>
            </div>
          )
        }
        if (b.t === 'compara') {
          return (
            <div key={i} className="grid gap-2">
              <div className="overflow-hidden rounded-lg border border-[#1e2b45] bg-[#0a1120] opacity-80">
                <p className="border-b border-[#1e2b45] px-3 py-1 text-[10px] text-[#fbbf24]">JavaScript · ya lo sabes</p>
                <div>
                  <CodigoModelo lang="js" codigo={b.js} onIntentoDeCopia={onIntentoDeCopia} />
                </div>
              </div>
              <div className="overflow-hidden rounded-lg border border-[#166534] bg-[#0a1120]">
                <p className="border-b border-[#166534] px-3 py-1 text-[10px] text-[#4ade80]">Python · lo nuevo</p>
                <div>
                  <CodigoModelo lang="python" codigo={b.py} onIntentoDeCopia={onIntentoDeCopia} />
                </div>
              </div>
            </div>
          )
        }
        return <EjemploQueCorre key={i} codigo={b.codigo} entradas={b.entradas} onIntentoDeCopia={onIntentoDeCopia} />
      })}
    </div>
  )
}
