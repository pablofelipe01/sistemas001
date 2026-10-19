'use client'

import type { Pedido, Resultado } from './calificar'
import type { Lenguaje } from './tipos'

export type EstadoMotor = 'apagado' | 'cargando' | 'listo' | 'fallo'

/** Segundos que se le dan a un programa antes de pensar que se quedó dando vueltas. */
const PACIENCIA_MS = 5000

/** Dónde vive el worker de cada lenguaje y cómo se llama para el alumno. */
const WORKERS: Record<Lenguaje, { url: string; nombre: string }> = {
  python: { url: '/python/worker.js', nombre: 'Python' },
  typescript: { url: '/typescript/worker.js', nombre: 'TypeScript' },
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

  constructor(private lenguaje: Lenguaje) {}

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
    const w = new Worker(WORKERS[this.lenguaje].url, { type: 'module' })
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
        rechazar(new Error(`No se pudo cargar ${WORKERS[this.lenguaje].nombre}`))
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

const motores = new Map<Lenguaje, Motor>()

export function motorDe(lenguaje: Lenguaje) {
  let m = motores.get(lenguaje)
  if (!m) {
    m = new Motor(lenguaje)
    motores.set(lenguaje, m)
  }
  return m
}

export function nombreDelLenguaje(lenguaje: Lenguaje) {
  return WORKERS[lenguaje].nombre
}
