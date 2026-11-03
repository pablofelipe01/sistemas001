import type { Curso } from './tipos'
import { LECCIONES_1, PRACTICAS_1 } from './preparacion/parte1'
import { LECCIONES_2, PRACTICAS_2 } from './preparacion/parte2'
import { LECCIONES_3, PRACTICAS_3 } from './preparacion/parte3'
import { LECCIONES_4, PRACTICAS_4 } from './preparacion/parte4'

/*
 * Curso de preparación para el examen de Python desde cero (como el
 * "preicfes" del colegio). Una lección por cada punto del examen, en el mismo
 * orden, y cada cinco puntos un examen de práctica opcional que dice qué
 * lecciones repasar. El examen de verdad (src/lib/examen/python-basico.ts) no
 * se toca: aquí las preguntas se parecen, pero no son las mismas.
 *
 * El contenido está partido en cuatro archivos solo para que no sea uno
 * gigante: puntos 1-5, 6-15, 16-25 y 26-30.
 */
export const CURSO_PREPARACION_PYTHON: Curso = {
  id: 'preparacion-python',
  titulo: 'Preparación para el examen de Python',
  emoji: '🎯',
  descripcion:
    'Repasamos el examen de Python punto por punto, en el mismo orden: qué es cada cosa, para qué sirve, ejemplos, y a practicar. Cada cinco puntos hay un pequeño examen de práctica que te dice qué te falta reforzar.',
  lenguaje: 'python',
  despedida: 'Repasaste los 30 puntos del examen. Ya sabes de qué se trata cada pregunta: ¡a por ese cinco!',
  lecciones: [...LECCIONES_1, ...LECCIONES_2, ...LECCIONES_3, ...LECCIONES_4],
  practicas: [...PRACTICAS_1, ...PRACTICAS_2, ...PRACTICAS_3, ...PRACTICAS_4],
}
