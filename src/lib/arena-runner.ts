import { javascriptLanguage } from '@codemirror/lang-javascript'
import type { PasoArena } from './arena'

export interface ErrorDeJuego {
  mensaje: string
  linea: number
}

export interface ResultadoParte {
  ok: boolean
  resultados: { ok: boolean; msg: string }[]
  error?: ErrorDeJuego
  colgado?: boolean
}

const ESPERA_ARRANQUE = 6000
/** Sin latido por este tiempo: el juego se quedó en un ciclo que nunca termina. */
const SIN_LATIDO = 2500
/** La revisión entera (cientos de cuadros simulados) no debería tardar más que esto. */
const ESPERA_REVISION = 5000

interface Oyentes {
  onError?: (e: ErrorDeJuego) => void
  onLog?: (texto: string) => void
  onColgado?: () => void
}

/**
 * Le pone un guardia a cada ciclo (while, for, do) del juego: una llamada a
 * __vuelta(línea) al principio de cada vuelta. Si un ciclo da millones de
 * vueltas sin soltar el navegador, el guardia lo corta con un error claro
 * (ver public/arena.html).
 *
 * Hace falta porque un ciclo infinito no se puede matar desde afuera sin
 * dañar la pantalla: el navegador deja el proceso trabado y el siguiente juego
 * cae en el mismo proceso y no arranca. Mejor que nunca llegue a trabarse.
 *
 * Solo se agregan llaves y la llamada, sin saltos de línea: los números de
 * línea de los errores siguen siendo los del alumno.
 */
export function protegerCiclos(codigo: string): string {
  const arreglos: { pos: number; texto: string }[] = []
  javascriptLanguage.parser.parse(codigo).iterate({
    enter(n) {
      if (n.name !== 'WhileStatement' && n.name !== 'ForStatement' && n.name !== 'DoStatement') return
      const cuerpo = n.name === 'DoStatement' ? n.node.firstChild?.nextSibling : n.node.lastChild
      if (!cuerpo || cuerpo.from >= cuerpo.to || cuerpo.type.isError) return
      const linea = codigo.slice(0, n.from).split('\n').length
      arreglos.push({ pos: cuerpo.from, texto: `{ __vuelta(${linea}); ` }, { pos: cuerpo.to, texto: ' }' })
    },
  })
  let r = codigo
  for (const a of arreglos.sort((x, y) => y.pos - x.pos)) r = r.slice(0, a.pos) + a.texto + r.slice(a.pos)
  return r
}

/** Un iframe aislado con /arena.html. Nace de nuevo en cada corrida. */
function nacer(host: HTMLElement, visible: boolean): { frame: HTMLIFrameElement; listo: Promise<void> } {
  const frame = document.createElement('iframe')
  // Sin allow-same-origin: origen opaco. El juego no ve nada de la app (ni el de un compañero).
  frame.setAttribute('sandbox', 'allow-scripts')
  frame.setAttribute('title', 'El juego')
  frame.src = '/arena.html'
  frame.style.cssText = visible
    ? 'width:100%;height:100%;border:0;display:block;background:#070b16'
    : // Fuera de la pantalla, pero con tamaño: así el lienzo se pinta y se puede medir.
      'position:fixed;left:-10000px;top:0;width:600px;height:400px;border:0'
  const listo = new Promise<void>((resolve, reject) => {
    const reloj = window.setTimeout(() => {
      window.removeEventListener('message', alLlegar)
      reject(new Error('El motor del juego no arrancó.'))
    }, ESPERA_ARRANQUE)
    const alLlegar = (ev: MessageEvent) => {
      if (ev.source !== frame.contentWindow || ev.data?.__ar !== 'ready') return
      window.clearTimeout(reloj)
      window.removeEventListener('message', alLlegar)
      resolve()
    }
    window.addEventListener('message', alLlegar)
  })
  host.appendChild(frame)
  return { frame, listo }
}

/**
 * La pantalla donde se juega. Cada `jugar()` arranca un iframe nuevo: así no
 * quedan ciclos ni teclas de la corrida anterior, y un ciclo infinito se corta
 * sacando el iframe.
 */
export class PantallaDeJuego {
  private host: HTMLElement
  private frame: HTMLIFrameElement | null = null
  private oyente: ((ev: MessageEvent) => void) | null = null
  private vigia: number | null = null
  private ultimoLatido = 0
  private seq = 0

  constructor(host: HTMLElement) {
    this.host = host
  }

  detener() {
    if (this.oyente) window.removeEventListener('message', this.oyente)
    if (this.vigia) window.clearInterval(this.vigia)
    this.oyente = null
    this.vigia = null
    this.frame?.remove()
    this.frame = null
  }

  async jugar(codigo: string, o: Oyentes = {}): Promise<void> {
    this.detener()
    const id = ++this.seq
    const { frame, listo } = nacer(this.host, true)
    this.frame = frame

    this.oyente = (ev: MessageEvent) => {
      if (ev.source !== frame.contentWindow) return
      const d = ev.data
      if (!d || typeof d.__ar !== 'string') return
      if (d.__ar === 'latido') this.ultimoLatido = Date.now()
      else if (d.__ar === 'log') o.onLog?.(String(d.texto))
      else if (d.__ar === 'error') o.onError?.({ mensaje: String(d.mensaje), linea: Number(d.linea) || 0 })
    }
    window.addEventListener('message', this.oyente)

    try {
      await listo
    } catch (e) {
      o.onError?.({ mensaje: (e as Error).message, linea: 0 })
      return
    }
    if (id !== this.seq) return

    this.ultimoLatido = Date.now()
    this.vigia = window.setInterval(() => {
      if (Date.now() - this.ultimoLatido > SIN_LATIDO) {
        this.detener()
        o.onColgado?.()
      }
    }, 500)
    frame.contentWindow?.postMessage({ __ar: 'run', id, modo: 'jugar', codigo: protegerCiclos(codigo) }, '*')
    frame.focus()
  }

  enfocar() {
    this.frame?.focus()
  }
}

/**
 * Revisa una parte: corre el juego escondido, con el reloj de mentira, y hace
 * los pasos de la parte (avanzar cuadros, oprimir teclas, mirar variables).
 */
export async function revisarParte(codigo: string, pasos: PasoArena[]): Promise<ResultadoParte> {
  const { frame, listo } = nacer(document.body, false)
  try {
    await listo
  } catch (e) {
    frame.remove()
    return { ok: false, resultados: [], error: { mensaje: (e as Error).message, linea: 0 } }
  }

  return new Promise<ResultadoParte>((resolve) => {
    let error: ErrorDeJuego | undefined
    const cerrar = (r: ResultadoParte) => {
      window.clearTimeout(reloj)
      window.removeEventListener('message', alLlegar)
      frame.remove()
      resolve(r)
    }
    const reloj = window.setTimeout(
      () => cerrar({ ok: false, resultados: [], colgado: true }),
      ESPERA_REVISION,
    )
    const alLlegar = (ev: MessageEvent) => {
      if (ev.source !== frame.contentWindow) return
      const d = ev.data
      if (d?.__ar === 'error') error = { mensaje: String(d.mensaje), linea: Number(d.linea) || 0 }
      if (d?.__ar !== 'resultado') return
      const resultados: { ok: boolean; msg: string }[] = d.resultados || []
      if (!error && d.error && d.error !== 'roto') error = { mensaje: String(d.error), linea: 0 }
      cerrar({ ok: !error && resultados.length > 0 && resultados.every((r) => r.ok), resultados, error })
    }
    window.addEventListener('message', alLlegar)
    frame.contentWindow?.postMessage({ __ar: 'run', id: 1, modo: 'revisar', codigo: protegerCiclos(codigo), pruebas: pasos }, '*')
  })
}

/** Los errores de JavaScript, dichos como pistas. */
export function explicarError(e: ErrorDeJuego): string {
  // Chrome a veces le pone adelante el nombre de la función que montó el script.
  const m = e.mensaje.replace(/Failed to execute '[^']+' on '[^']+': /, '')
  const donde = e.linea > 0 ? ` (línea ${e.linea})` : ''
  let r: RegExpMatchArray | null
  if ((r = m.match(/CICLO_INFINITO:(\d+)/)))
    return `El ciclo de la línea ${r[1]} da vueltas y vueltas y nunca termina, así que lo paramos. Revisa su condición: ¿algo adentro la vuelve falsa alguna vez?`
  if ((r = m.match(/ReferenceError: (\S+) is not defined/)))
    return `No conozco «${r[1]}»${donde}. ¿Lo escribiste igualito, con las mismas mayúsculas? ¿Lo creaste antes con let o const?`
  if ((r = m.match(/ReferenceError: Cannot access '(\S+)' before initialization/)))
    return `Usaste «${r[1]}» antes de crearlo${donde}. El let o el const tiene que ir más arriba.`
  if ((r = m.match(/TypeError: (\S+) is not a function/)))
    return `«${r[1]}» no es una función${donde}. Revisa cómo se escribe (¿fillRect? ¿getContext?) y los paréntesis.`
  if ((r = m.match(/TypeError: Cannot read properties of (undefined|null) \(reading '(\S+)'\)/)))
    return `Quisiste leer «.${r[2]}» de algo que no existe${donde}. Revisa el nombre de lo que va antes del punto.`
  if ((r = m.match(/TypeError: Assignment to constant variable/)))
    return `Quisiste cambiar algo que creaste con const${donde}. Si va a cambiar, créalo con let.`
  if ((r = m.match(/SyntaxError: Identifier '(\S+)' has already been declared/)))
    return `«${r[1]}» está creado dos veces${donde}. Borra uno de los let o const.`
  if (/missing \) after argument list/.test(m))
    return `Falta cerrar un paréntesis )${donde}. Cuenta: cada ( necesita su ).`
  if (/SyntaxError: Unexpected end of input/.test(m))
    return `Se acabó el código y algo quedó abierto${donde}. Casi seguro falta cerrar una llave } o un paréntesis ).`
  if ((r = m.match(/SyntaxError: Unexpected token '(.+)'/)))
    return `Hay un «${r[1]}» que no esperaba${donde}. Mira si sobra o falta una llave, un paréntesis o una coma.`
  if (/SyntaxError/.test(m)) return `El código está mal escrito en algún lado${donde}: ${m.replace('SyntaxError: ', '')}`
  return `${m}${donde}`
}
