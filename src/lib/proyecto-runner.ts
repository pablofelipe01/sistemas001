import type { Accion, PruebaProyecto } from './proyectos'

export interface TrabajoProyecto {
  html: string
  css: string
  js: string
  acciones?: Accion[]
  pruebas?: PruebaProyecto[]
}

export interface ResultadoPrueba {
  ok: boolean
  msg: string
}

export interface SalidaProyecto {
  ok: boolean
  resultados: ResultadoPrueba[]
  logs: string[]
  error?: string
  colgado?: boolean
}

const ESPERA_ARRANQUE = 6000
/** Si el proyecto del alumno no contesta en este tiempo, es un ciclo infinito. */
const ESPERA_CORRIDA = 4000

/**
 * Maneja un iframe de /proyecto.html. Sirve igual para la vista previa (montar
 * y dejar funcionando) que para la revisión (montar, dar clics y medir).
 *
 * En cada corrida nace un iframe nuevo: es lo que garantiza que no quede basura
 * de la corrida anterior y, sobre todo, lo único que detiene un ciclo infinito,
 * porque el hilo bloqueado solo muere si se saca el elemento del DOM.
 */
export class ProyectoRunner {
  private host: HTMLElement
  private frame: HTMLIFrameElement | null = null
  private listo = false
  private seq = 0

  constructor(host: HTMLElement) {
    this.host = host
  }

  private matar() {
    if (this.frame) {
      this.frame.remove()
      this.frame = null
    }
    this.listo = false
  }

  private nacer(): Promise<HTMLIFrameElement> {
    /*
     * El iframe se reutiliza entre corridas, y esa es la parte fina: uno recién
     * creado todavía no tiene maquetación, y sin maquetación no se puede medir
     * si la tarjeta quedó centrada. El que ya lleva rato en la página sí.
     * Volver a montarlo desde cero (body.innerHTML) deja igual de limpio.
     */
    if (this.frame && this.frame.isConnected && this.listo) return Promise.resolve(this.frame)

    this.matar()
    const frame = document.createElement('iframe')
    // Sin allow-same-origin: origen opaco, aislado de la app.
    frame.setAttribute('sandbox', 'allow-scripts')
    frame.setAttribute('title', 'Resultado del proyecto')
    frame.src = '/proyecto.html'
    frame.style.cssText = 'width:100%;height:100%;border:0;background:#fff;display:block'
    this.frame = frame

    return new Promise((resolve, reject) => {
      const reloj = window.setTimeout(() => {
        window.removeEventListener('message', alLlegar)
        reject(new Error('El motor del proyecto no arrancó.'))
      }, ESPERA_ARRANQUE)

      const alLlegar = (ev: MessageEvent) => {
        if (ev.source !== frame.contentWindow) return
        if (!ev.data || ev.data.__pv !== 'ready') return
        window.clearTimeout(reloj)
        window.removeEventListener('message', alLlegar)
        this.listo = true
        resolve(frame)
      }

      window.addEventListener('message', alLlegar)
      this.host.appendChild(frame)
    })
  }

  async correr(trabajo: TrabajoProyecto): Promise<SalidaProyecto> {
    const id = ++this.seq
    let frame: HTMLIFrameElement
    try {
      frame = await this.nacer()
    } catch (e) {
      return { ok: false, resultados: [], logs: [], error: (e as Error).message }
    }

    return new Promise<SalidaProyecto>((resolve) => {
      const cerrar = (s: SalidaProyecto) => {
        window.clearTimeout(reloj)
        window.removeEventListener('message', alLlegar)
        resolve(s)
      }

      const reloj = window.setTimeout(() => {
        // Sacar el iframe del DOM es lo único que detiene un hilo bloqueado; la
        // siguiente corrida arrancará uno nuevo.
        this.matar()
        cerrar({
          ok: false,
          resultados: [],
          logs: [],
          colgado: true,
          error:
            'Tu proyecto se quedó pensando para siempre. Casi seguro hay un ciclo que nunca termina: revisa los while y los for.',
        })
      }, ESPERA_CORRIDA)

      const alLlegar = (ev: MessageEvent) => {
        if (ev.source !== frame.contentWindow) return
        const d = ev.data
        if (!d || d.__pv !== 'resultado' || d.id !== id) return
        cerrar({ ok: !!d.ok, resultados: d.resultados || [], logs: d.logs || [], error: d.error })
      }

      window.addEventListener('message', alLlegar)
      frame.contentWindow?.postMessage(
        {
          __pv: 'run',
          id,
          html: trabajo.html,
          css: trabajo.css,
          js: trabajo.js,
          acciones: trabajo.acciones || [],
          pruebas: trabajo.pruebas || [],
        },
        '*',
      )
    })
  }

  destruir() {
    this.matar()
  }
}
