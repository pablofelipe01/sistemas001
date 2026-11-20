'use client'

import { useEffect, useRef } from 'react'
import { EditorState, RangeSetBuilder } from '@codemirror/state'
import { Decoration, EditorView, lineNumbers } from '@codemirror/view'
import { syntaxHighlighting } from '@codemirror/language'
import { coloresSintaxis, extensionDeLenguaje, temaTerminal, type LangEditor } from './Terminal'

/**
 * El código del modelo: se lee con los ojos, se pasa con los dedos.
 *
 * Es un editor de verdad (mismos colores, mismos números de línea que la
 * terminal del alumno) pero de solo lectura y, sobre todo, imposible de
 * seleccionar: sin selección no hay copiar, y sin copiar toca escribir.
 * Quien abra las herramientas del navegador se lo salta, claro; no se trata de
 * blindar nada, sino de que el camino cómodo sea teclear.
 */
/** Las líneas nuevas de una parte (la arena de juegos), pintadas de verde. */
const lineaNueva = Decoration.line({ class: 'cm-linea-nueva' })
const temaResaltado = EditorView.theme({
  '.cm-linea-nueva': { backgroundColor: 'rgba(74, 222, 128, 0.13)', boxShadow: 'inset 3px 0 0 #4ade80' },
})

function resaltarLineas(state: EditorState, lineas: number[]) {
  const b = new RangeSetBuilder<Decoration>()
  for (const n of [...lineas].sort((x, y) => x - y)) {
    if (n >= 1 && n <= state.doc.lines) {
      const l = state.doc.line(n)
      b.add(l.from, l.from, lineaNueva)
    }
  }
  return EditorView.decorations.of(b.finish())
}

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
  resaltar,
}: {
  lang: LangEditor
  codigo: string
  onIntentoDeCopia: () => void
  /** Números de línea (desde 1) que se pintan de verde. */
  resaltar?: number[]
}) {
  const claveResaltar = (resaltar ?? []).join(',')
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

    const lineas = claveResaltar ? claveResaltar.split(',').map(Number) : []
    const base = EditorState.create({ doc: codigo })
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
          ...(lineas.length ? [temaResaltado, resaltarLineas(base, lineas)] : []),
        ],
      }),
    })

    // Que se vea de una la primera línea nueva.
    if (lineas.length) {
      const primera = view.state.doc.line(Math.min(Math.min(...lineas), view.state.doc.lines))
      requestAnimationFrame(() => view.dispatch({ effects: EditorView.scrollIntoView(primera.from, { y: 'center' }) }))
    }

    return () => view.destroy()
  }, [lang, codigo, claveResaltar])

  return <div ref={caja} className="h-full overflow-hidden" />
}
