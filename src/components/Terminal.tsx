'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Annotation, EditorState, Transaction } from '@codemirror/state'
import {
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightActiveLineGutter,
  keymap,
  lineNumbers,
  placeholder as cmPlaceholder,
} from '@codemirror/view'
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands'
import { HighlightStyle, bracketMatching, indentOnInput, indentUnit, syntaxHighlighting } from '@codemirror/language'
import { closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete'
import { html as htmlLang } from '@codemirror/lang-html'
import { css as cssLang } from '@codemirror/lang-css'
import { javascript as jsLang } from '@codemirror/lang-javascript'
import { tags as t } from '@lezer/highlight'
import type { Lang } from '@/lib/types'

/** Marca los cambios que hace la app (una ayuda, reiniciar el reto) para que el guardia los deje pasar. */
const CAMBIO_DE_LA_APP = Annotation.define<boolean>()

/** Un pegado camuflado puede llegar en trozos; más de esto de una sola vez no es alguien escribiendo. */
const MAXIMO_DE_UN_TIRÓN = 30

export interface TerminalHandle {
  /** Reemplaza todo el contenido (ayudas, reiniciar). */
  reemplazar: (texto: string) => void
  enfocar: () => void
}

interface Props {
  lang: Lang
  /** Contenido inicial. Cambiar de reto debe remontar el componente con key. */
  inicial: string
  onCambio: (texto: string) => void
  /** Cuántas teclas escribió de verdad. Es la señal de que el código se tecleó. */
  onTeclas: (cuantas: number) => void
  onPegadoBloqueado: () => void
}

const temaTerminal = EditorView.theme(
  {
    '&': { color: '#d6e4ff', backgroundColor: 'transparent', height: '100%', fontSize: '14px' },
    '.cm-content': { fontFamily: 'var(--fuente-mono)', padding: '12px 0', caretColor: '#4ade80' },
    '.cm-scroller': { fontFamily: 'var(--fuente-mono)', lineHeight: '1.65', overflow: 'auto' },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: '#3f5074',
      border: 'none',
      paddingRight: '6px',
      userSelect: 'none',
    },
    '.cm-activeLineGutter': { backgroundColor: 'rgba(74,222,128,.07)', color: '#7dd3a0' },
    '.cm-activeLine': { backgroundColor: 'rgba(148,163,255,.05)' },
    '.cm-cursor, .cm-dropCursor': { borderLeft: '2px solid #4ade80' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
      backgroundColor: 'rgba(99,102,241,.35)',
    },
    '.cm-placeholder': { color: '#3f5074', fontStyle: 'italic' },
    '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': {
      backgroundColor: 'rgba(74,222,128,.2)',
      outline: '1px solid rgba(74,222,128,.5)',
    },
  },
  { dark: true },
)

const coloresSintaxis = HighlightStyle.define([
  { tag: [t.comment], color: '#4b5b80', fontStyle: 'italic' },
  { tag: [t.tagName], color: '#7dd3fc' },
  { tag: [t.attributeName, t.propertyName], color: '#c4b5fd' },
  { tag: [t.attributeValue, t.string, t.special(t.string)], color: '#86efac' },
  { tag: [t.number, t.bool, t.null, t.atom], color: '#fbbf24' },
  { tag: [t.keyword, t.modifier], color: '#f472b6' },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: '#93c5fd' },
  { tag: [t.definition(t.variableName), t.variableName], color: '#e0e7ff' },
  { tag: [t.className, t.typeName], color: '#fcd34d' },
  { tag: [t.operator, t.punctuation, t.bracket], color: '#8ea3c9' },
  { tag: [t.angleBracket], color: '#64748b' },
  { tag: [t.invalid], color: '#fb7185' },
])

function extensionDeLenguaje(lang: Lang) {
  // autoCloseTags a propósito en false: cerrar la etiqueta sola le regalaría al
  // alumno justo lo que el reto le está pidiendo aprender.
  if (lang === 'html') return htmlLang({ autoCloseTags: false })
  if (lang === 'css') return cssLang()
  return jsLang()
}

const MARCADOR: Record<Lang, string> = {
  html: 'Escribe aquí tu HTML…',
  css: 'Escribe aquí tu CSS…',
  js: 'Escribe aquí tu JavaScript…',
}

export const Terminal = forwardRef<TerminalHandle, Props>(function Terminal(
  { lang, inicial, onCambio, onTeclas, onPegadoBloqueado },
  ref,
) {
  const caja = useRef<HTMLDivElement>(null)
  const vista = useRef<EditorView | null>(null)
  // Los callbacks van por ref para que el editor no se reconstruya en cada render.
  const cb = useRef({ onCambio, onTeclas, onPegadoBloqueado })
  cb.current = { onCambio, onTeclas, onPegadoBloqueado }

  useImperativeHandle(ref, () => ({
    reemplazar(texto: string) {
      const v = vista.current
      if (!v) return
      v.dispatch({
        changes: { from: 0, to: v.state.doc.length, insert: texto },
        annotations: CAMBIO_DE_LA_APP.of(true),
      })
      v.focus()
    },
    enfocar() {
      vista.current?.focus()
    },
  }))

  useEffect(() => {
    if (!caja.current) return

    const avisar = () => cb.current.onPegadoBloqueado()

    /*
     * Guardia contra el copiar y pegar, en tres capas, porque una sola siempre
     * se le escapa a alguien:
     *
     *   1. beforeinput  → atrapa el pegado del celular, el del menú derecho y
     *                     el del botón del medio del mouse en Linux.
     *   2. paste/drop   → el atajo de teclado de toda la vida y arrastrar texto.
     *   3. filtro de transacciones → la red de seguridad: si algo se coló por
     *                     debajo, aquí se ve como un insertazo que nadie tecleó.
     *
     * No es a prueba de balas y no pretende serlo: quien abra las herramientas
     * de desarrollo se lo salta. Lo que sí logra es que la forma cómoda de
     * responder sea escribir, que es justo lo que queremos que practiquen.
     */
    const guardiaDom = EditorView.domEventHandlers({
      beforeinput(e) {
        const tipo = (e as InputEvent).inputType
        if (tipo === 'insertFromPaste' || tipo === 'insertFromDrop' || tipo === 'insertFromYank' || tipo === 'insertFromPasteAsQuotation') {
          e.preventDefault()
          avisar()
          return true
        }
        return false
      },
      paste(e) {
        e.preventDefault()
        avisar()
        return true
      },
      drop(e) {
        e.preventDefault()
        avisar()
        return true
      },
      dragover(e) {
        e.preventDefault()
        return true
      },
      contextmenu(e) {
        // Sin menú del clic derecho no hay opción de Pegar.
        e.preventDefault()
        return true
      },
    })

    const guardiaTransacciones = EditorState.transactionFilter.of((tr) => {
      if (!tr.docChanged) return tr
      if (tr.annotation(CAMBIO_DE_LA_APP)) return tr

      if (tr.isUserEvent('input.paste') || tr.isUserEvent('input.drop')) {
        avisar()
        return []
      }

      const evento = tr.annotation(Transaction.userEvent) ?? ''
      // Deshacer y rehacer sí pueden mover mucho texto de un tirón: son legítimos.
      const esSeguro =
        evento.startsWith('input.type') ||
        evento.startsWith('delete') ||
        evento === 'undo' ||
        evento === 'redo'

      let masGrande = 0
      tr.changes.iterChanges((_fA, _tA, _fB, _tB, insertado) => {
        masGrande = Math.max(masGrande, insertado.length)
      })

      if (masGrande > MAXIMO_DE_UN_TIRÓN && !esSeguro) {
        avisar()
        return []
      }

      return tr
    })

    const contador = EditorView.updateListener.of((u) => {
      if (!u.docChanged) return
      cb.current.onCambio(u.state.doc.toString())

      let teclas = 0
      for (const tr of u.transactions) {
        if (!tr.isUserEvent('input.type')) continue
        tr.changes.iterChanges((_a, _b, _c, _d, ins) => {
          teclas += ins.length
        })
      }
      if (teclas > 0) cb.current.onTeclas(teclas)
    })

    const view = new EditorView({
      parent: caja.current,
      state: EditorState.create({
        doc: inicial,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          highlightActiveLineGutter(),
          drawSelection(),
          history(),
          indentOnInput(),
          indentUnit.of('  '),
          bracketMatching(),
          closeBrackets(),
          // Autocompletado NO: sugerir etiquetas sería darles media respuesta.
          keymap.of([...closeBracketsKeymap, ...defaultKeymap, ...historyKeymap, indentWithTab]),
          extensionDeLenguaje(lang),
          syntaxHighlighting(coloresSintaxis),
          temaTerminal,
          cmPlaceholder(MARCADOR[lang]),
          EditorView.lineWrapping,
          guardiaDom,
          guardiaTransacciones,
          contador,
        ],
      }),
    })

    vista.current = view
    view.focus()

    return () => {
      view.destroy()
      vista.current = null
    }
    // Se monta una vez por reto: el componente se remonta con key={reto.id}.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  return <div ref={caja} className="h-full overflow-hidden" />
})
