import type { Reto } from '../cursos/tipos'

/*
 * Los exámenes de los cursos: preguntas de escribir código, de selección
 * múltiple y de falso o verdadero, intercaladas. Cada una vale de 0 a 5
 * puntos: el código gana puntos por cada prueba que pasa, y en la selección
 * múltiple hay respuestas "a medio camino" que también dan algo.
 *
 * Igual que tipos.ts de los cursos, este archivo no importa nada en tiempo de
 * ejecución, para que la llave se pueda probar fuera del navegador.
 */

/** Escribir un programa. Se califica con las pruebas del reto, igual que en el curso. */
export type PreguntaCodigo = { tipo: 'codigo' } & Reto

export interface Opcion {
  texto: string
  /** De 0 a 5. La buena vale 5; una que va por buen camino puede valer algo. */
  puntos: number
}

export interface PreguntaOpcion {
  tipo: 'opcion'
  id: string
  titulo: string
  enunciado: string
  /** Un programa para leer (no se puede correr). */
  codigo?: string
  opciones: Opcion[]
}

export interface PreguntaVF {
  tipo: 'vf'
  id: string
  titulo: string
  afirmacion: string
  codigo?: string
  verdadero: boolean
}

export type Pregunta = PreguntaCodigo | PreguntaOpcion | PreguntaVF

export interface Examen {
  id: string
  titulo: string
  emoji: string
  /** Hasta cuándo se puede presentar, en ISO con zona horaria. A esa hora se cierra solo. */
  cierre: string
  /** Cómo se le dice la hora de cierre al alumno. */
  cierreTexto: string
  preguntas: Pregunta[]
}

/** Lo que el alumno contestó: el código, o el número de la opción (en el orden original), o true/false. */
export type Respuesta = string | number | boolean

/** Lo que se guarda en la nube de cada alumno en un examen. */
export interface Presentacion {
  slug: string
  examen: string
  nombre: string
  inicio: string
  fin: string | null
  /** 'alumno': le dio Terminar; 'cierre': se acabó la hora. */
  terminado_por: 'alumno' | 'cierre' | null
  respuestas: Record<string, Respuesta>
  /** Cuántas veces salió de la página del examen y cuántos segundos estuvo afuera en total. */
  salidas: number
  segundos_fuera: number
  pegados: number
  capturas: number
  teclas: number
  actualizado: string
}

export const PUNTOS_POR_PREGUNTA = 5
