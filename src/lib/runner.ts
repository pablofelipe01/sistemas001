import type { Assertion, Lang, RunOutcome } from './types'

export interface RunJob {
  lang: Lang
  code: string
  html?: string
  tests: Assertion[]
}

const READY_TIMEOUT = 6000
/** Si el código del alumno no responde en este tiempo, es un ciclo infinito. */
const RUN_TIMEOUT = 4000

/**
 * Maneja el iframe donde corre el código del alumno.
 *
 * Se crea un iframe nuevo en cada ejecución a propósito: garantiza que no
 * quede basura de la corrida anterior (listeners, variables, timers) y, sobre
 * todo, permite matar un ciclo infinito quitando el elemento del DOM, que es
 * lo único que detiene un hilo bloqueado.
 */
export class Runner {
  private host: HTMLElement
  private frame: HTMLIFrameElement | null = null
  private seq = 0

  constructor(host: HTMLElement) {
    this.host = host
  }

  private kill() {
    if (this.frame) {
      this.frame.remove()
      this.frame = null
    }
  }

  private spawn(): Promise<HTMLIFrameElement> {
    this.kill()
    const frame = document.createElement('iframe')
    // Sin allow-same-origin: origen opaco. No ve cookies, ni localStorage, ni la app.
    frame.setAttribute('sandbox', 'allow-scripts')
    frame.setAttribute('title', 'Resultado')
    frame.src = '/runner.html'
    frame.style.cssText = 'width:100%;height:100%;border:0;background:#fff;display:block'
    this.frame = frame

    return new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        window.removeEventListener('message', onMsg)
        reject(new Error('El motor de pruebas no arrancó.'))
      }, READY_TIMEOUT)

      const onMsg = (ev: MessageEvent) => {
        if (ev.source !== frame.contentWindow) return
        if (!ev.data || ev.data.__cw !== 'ready') return
        window.clearTimeout(timer)
        window.removeEventListener('message', onMsg)
        resolve(frame)
      }

      window.addEventListener('message', onMsg)
      this.host.appendChild(frame)
    })
  }

  async run(job: RunJob): Promise<RunOutcome> {
    const id = ++this.seq
    let frame: HTMLIFrameElement
    try {
      frame = await this.spawn()
    } catch (e) {
      return { passed: false, results: [], logs: [], error: (e as Error).message }
    }

    return new Promise<RunOutcome>((resolve) => {
      const finish = (out: RunOutcome) => {
        window.clearTimeout(timer)
        window.removeEventListener('message', onMsg)
        resolve(out)
      }

      const timer = window.setTimeout(() => {
        // Quitar el iframe es la única forma de detener un hilo bloqueado.
        this.kill()
        finish({
          passed: false,
          results: [],
          logs: [],
          timedOut: true,
          error: 'Tu código se quedó pensando para siempre. Casi seguro es un ciclo que nunca termina: revisa el i++ y la condición del for.',
        })
      }, RUN_TIMEOUT)

      const onMsg = (ev: MessageEvent) => {
        if (ev.source !== frame.contentWindow) return
        const d = ev.data
        if (!d || d.__cw !== 'result' || d.id !== id) return
        finish({
          passed: !!d.passed,
          results: d.results || [],
          logs: d.logs || [],
          error: d.error,
        })
      }

      window.addEventListener('message', onMsg)
      frame.contentWindow?.postMessage(
        { __cw: 'run', id, lang: job.lang, code: job.code, html: job.html, tests: job.tests },
        '*',
      )
    })
  }

  destroy() {
    this.kill()
  }
}
