import type { ErrorDelPrograma } from './calificar'
import { explicarError as explicarErrorPython, type ErrorExplicado } from './errores-python'
import { explicarErrorRust } from './errores-rust'
import { explicarErrorTS } from './errores-typescript'
import type { Lenguaje } from './tipos'

/** La pista en español para un error, según el lenguaje del curso. */
export function explicarError(lenguaje: Lenguaje, e: ErrorDelPrograma, codigo: string): ErrorExplicado {
  if (lenguaje === 'rust') return explicarErrorRust(e, codigo)
  return lenguaje === 'typescript' ? explicarErrorTS(e, codigo) : explicarErrorPython(e, codigo)
}
