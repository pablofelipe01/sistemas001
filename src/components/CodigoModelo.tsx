'use client'

import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, lineNumbers } from '@codemirror/view'
import { syntaxHighlighting } from '@codemirror/language'
import { coloresSintaxis, extensionDeLenguaje, temaTerminal } from './Terminal'
import type { Lang } from '@/lib/types'

/**
 * El código del modelo: se lee con los ojos, se pasa con los dedos.
 *
 * Es un editor de verdad (mismos colores, mismos números de línea que la
 * terminal del alumno) pero de solo lectura y, sobre todo, imposible de
 * seleccionar: sin selección no hay copiar, y sin copiar toca escribir.
 * Quien abra las herramientas del navegador se lo salta, claro; no se trata de
 * blindar nada, sino de que el camino cómodo sea teclear.
 */
const sinSeleccion = EditorView.theme({
  '.cm-content, .cm-line': {
    userSelect: 'none',
    WebkitUserSelect: 'none',
    cursor: 'default',
  },
})

export function CodigoModelo({
  lang,
  codigo,
  onIntentoDeCopia,
}: {
  lang: Lang
  codigo: string
  onIntentoDeCopia: () => void
}) {
  const caja = useRef<HTMLDivElement>(null)
  const avisar = useRef(onIntentoDeCopia)
  avisar.current = onIntentoDeCopia

  useEffect(() => {
    if (!caja.current) return

    const guardia = EditorView.domEventHandlers({
      copy(e) {
        e.preventDefault()
        avisar.current()
        return true
      },
      cut(e) {
        e.preventDefault()
        avisar.current()
        return true
      },
      contextmenu(e) {
        e.preventDefault()
        avisar.current()
        return true
      },
      dragstart(e) {
        e.preventDefault()
        return true
      },
    })

    const view = new EditorView({
      parent: caja.current,
      state: EditorState.create({
        doc: codigo,
        extensions: [
          lineNumbers(),
          EditorState.readOnly.of(true),
          EditorView.editable.of(false),
          extensionDeLenguaje(lang),
          syntaxHighlighting(coloresSintaxis),
          temaTerminal,
          sinSeleccion,
          EditorView.lineWrapping,
          guardia,
        ],
      }),
    })

    return () => view.destroy()
  }, [lang, codigo])

  return <div ref={caja} className="h-full overflow-hidden" />
}
