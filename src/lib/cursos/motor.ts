'use client'

import type { Correr, Pedido, Resultado } from './calificar'
import type { Lenguaje } from './tipos'

export type EstadoMotor = 'apagado' | 'cargando' | 'listo' | 'fallo'

/** Segundos que se le dan a un programa antes de pensar que se quedó dando vueltas. */
const PACIENCIA_MS = 5000

/** Cómo se llama cada lenguaje para el alumno. */
const NOMBRES: Record<Lenguaje, string> = { python: 'Python', typescript: 'TypeScript', rust: 'Rust' }

/** Dónde vive el worker de los lenguajes que corren en el navegador. Rust no: se compila en el servidor. */
const WORKERS: Record<Exclude<Lenguaje, 'rust'>, string> = {
  python: '/python/worker.js',
  typescript: '/typescript/worker.js',
}

/**
 * Un solo motor por lenguaje para toda la pestaña: cargarlo pesa, así que se
 * arranca una vez y se reutiliza al pasar de una lección a otra.
 *
 * Los pedidos van en fila. Si uno no contesta a tiempo, el worker se apaga (es
 * la única forma de parar un while infinito) y se levanta otro.
 */
class Motor {
  private worker: Worker | null = null
  private estado: EstadoMotor = 'apagado'
  private oyentes = new Set<(e: EstadoMotor) => void>()
  private listo: Promise<void> | null = null
  private fila: Promise<unknown> = Promise.resolve()
  private siguienteId = 1
  private esperando = new Map<number, (r: Resultado) => void>()

  constructor(private lenguaje: Exclude<Lenguaje, 'rust'>) {}

  get actual() {
    return this.estado
  }

  escuchar(fn: (e: EstadoMotor) => void) {
    this.oyentes.add(fn)
    fn(this.estado)
    return () => {
      this.oyentes.delete(fn)
    }
  }

  private cambiar(e: EstadoMotor) {
    this.estado = e
    for (const fn of this.oyentes) fn(e)
  }

  /** Arranca el motor si no está arrancado. Se puede llamar las veces que sea. */
  arrancar(): Promise<void> {
    if (this.listo && this.estado !== 'fallo') return this.listo
    this.cambiar('cargando')
    const w = new Worker(WORKERS[this.lenguaje], { type: 'module' })
    this.worker = w
    this.listo = new Promise<void>((resolver, rechazar) => {
      w.onmessage = (e: MessageEvent) => {
        const m = e.data
        if (m.tipo === 'listo') {
          this.cambiar('listo')
          resolver()
        } else if (m.tipo === 'fallo-carga') {
          this.cambiar('fallo')
          rechazar(new Error(m.mensaje))
        } else if (m.tipo === 'resultado') {
          this.esperando.get(m.id)?.(m.resultado)
          this.esperando.delete(m.id)
        }
      }
      w.onerror = () => {
        this.cambiar('fallo')
        rechazar(new Error(`No se pudo cargar ${NOMBRES[this.lenguaje]}`))
      }
    })
    return this.listo
  }

  private reiniciar() {
    this.worker?.terminate()
    this.worker = null
    this.listo = null
    this.esperando.clear()
    void this.arrancar().catch(() => {})
  }

  correr(pedido: Pedido): Promise<Resultado> {
    const turno = this.fila.then(() => this.correrYa(pedido))
    this.fila = turno.catch(() => {})
    return turno
  }

  async correrVarios(pedidos: Pedido[]): Promise<Resultado[]> {
    const resultados: Resultado[] = []
    for (const p of pedidos) resultados.push(await this.correr(p))
    return resultados
  }

  private async correrYa(pedido: Pedido): Promise<Resultado> {
    await this.arrancar()
    const id = this.siguienteId++
    return new Promise<Resultado>((resolver) => {
      const reloj = window.setTimeout(() => {
        this.esperando.delete(id)
        this.reiniciar()
        resolver({ salida: '', error: null, valores: [], tiempoAgotado: true })
      }, PACIENCIA_MS)
      this.esperando.set(id, (r) => {
        window.clearTimeout(reloj)
        resolver(r)
      })
      this.worker!.postMessage({ id, pedido })
    })
  }
}

/**
 * Rust no cabe en el navegador: cada corrida va a /api/rust, que compila en el
 * Rust Playground. No hay nada que cargar, así que siempre está listo; lo que
 * tarda (un par de segundos) es cada corrida. Varios pedidos del mismo código
 * viajan juntos y se compilan una sola vez.
 */
class MotorRust {
  get actual(): EstadoMotor {
    return 'listo'
  }

  escuchar(fn: (e: EstadoMotor) => void) {
    fn('listo')
    return () => {}
  }

  arrancar(): Promise<void> {
    return Promise.resolve()
  }

  async correr(pedido: Pedido): Promise<Resultado> {
    return (await this.correrVarios([pedido]))[0]
  }

  async correrVarios(pedidos: Pedido[]): Promise<Resultado[]> {
    try {
      const r = await fetch('/api/rust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pedidos }),
      })
      const d = await r.json()
      if (!Array.isArray(d?.resultados)) throw new Error(d?.error ?? 'Respuesta rara')
      return d.resultados
    } catch {
      const error = { tipo: 'SinConexion', mensaje: '', linea: null }
      return pedidos.map(() => ({ salida: '', error, valores: [] }))
    }
  }
}

type MotorDeCurso = Motor | MotorRust
const motores = new Map<Lenguaje, MotorDeCurso>()

export function motorDe(lenguaje: Lenguaje): MotorDeCurso {
  let m = motores.get(lenguaje)
  if (!m) {
    m = lenguaje === 'rust' ? new MotorRust() : new Motor(lenguaje)
    motores.set(lenguaje, m)
  }
  return m
}

/** Lo que recibe calificar(): corre un pedido o, de una vez, varios. */
export function correrCon(lenguaje: Lenguaje): Correr {
  const m = motorDe(lenguaje)
  return Object.assign((p: Pedido) => m.correr(p), { varios: (ps: Pedido[]) => m.correrVarios(ps) })
}

export function nombreDelLenguaje(lenguaje: Lenguaje) {
  return NOMBRES[lenguaje]
}
