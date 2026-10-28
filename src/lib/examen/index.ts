import { EXAMEN_PYTHON } from './python-basico'
import type { Examen } from './tipos'

export const EXAMENES: Examen[] = [EXAMEN_PYTHON]

export function examenPorId(id: string): Examen | undefined {
  return EXAMENES.find((e) => e.id === id)
}
