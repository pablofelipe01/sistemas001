'use client'

import type { PedidoPython, ResultadoPython } from './calificar'

export type EstadoMotor = 'apagado' | 'cargando' | 'listo' | 'fallo'

/** Segundos que se le dan a un programa antes de pensar que se quedó dando vueltas. */
const PACIENCIA_MS = 5000

/**
 * Un solo Python para toda la pestaña: cargarlo pesa, así que se arranca una vez
 * y se reutiliza al pasar de una lección a otra.
 *
 * Los pedidos van en fila. Si uno no contesta a tiempo, el worker se apaga (es
 * la única forma de parar un while infinito) y se levanta otro.
 */
class MotorPython {
  private worker: Worker | null = null
  private estado: EstadoMotor = 'apagado'
  private oyentes = new Set<(e: EstadoMotor) => void>()
  private listo: Promise<void> | null = null
  private fila: Promise<unknown> = Promise.resolve()
  private siguienteId = 1
  private esperando = new Map<number, (r: ResultadoPython) => void>()

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

  /** Arranca Python si no está arrancado. Se puede llamar las veces que sea. */
  arrancar(): Promise<void> {
    if (this.listo && this.estado !== 'fallo') return this.listo
    this.cambiar('cargando')
    const w = new Worker('/python/worker.js', { type: 'module' })
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
        rechazar(new Error('No se pudo cargar Python'))
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

  correr(pedido: PedidoPython): Promise<ResultadoPython> {
    const turno = this.fila.then(() => this.correrYa(pedido))
    this.fila = turno.catch(() => {})
    return turno
  }

  private async correrYa(pedido: PedidoPython): Promise<ResultadoPython> {
    await this.arrancar()
    const id = this.siguienteId++
    return new Promise<ResultadoPython>((resolver) => {
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

let unico: MotorPython | null = null

export function motorPython() {
  unico ??= new MotorPython()
  return unico
}
