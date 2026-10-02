import type { ErrorPython } from './calificar'

/**
 * Los errores de Python vienen en inglés y con palabras de adulto. Aquí se
 * vuelven una pista en español, y se cazan a propósito los errores de quien
 * viene de JavaScript: console.log, let, llaves, &&, true en minúscula.
 *
 * Nunca es un regaño: dice qué pasó y qué probar.
 */
export interface ErrorExplicado {
  /** "Línea 3 · Falta cerrar algo" */
  titulo: string
  pista: string
  /** El mensaje original, para el que quiera aprender a leerlo. */
  original: string
}

export function explicarError(e: ErrorPython, codigo: string): ErrorExplicado {
  const linea = e.linea ? codigo.split('\n')[e.linea - 1] ?? '' : ''
  const donde = e.linea ? `Línea ${e.linea} · ` : ''
  const original = e.mensaje ? `${e.tipo}: ${e.mensaje}` : e.tipo
  const [titulo, pista] = traducir(e, linea.trim())
  return { titulo: donde + titulo, pista, original }
}

function traducir({ tipo, mensaje }: ErrorPython, linea: string): [string, string] {
  /* ------------------------------------------------- los de la página --- */
  if (tipo === 'SinRespuestas') {
    return [
      'Faltan respuestas para input()',
      'Tu programa hizo más preguntas que respuestas hay en las cajitas. Agrega otra respuesta, o revisa si pusiste un input() de más.',
    ]
  }
  if (tipo === 'DemasiadoTexto') {
    return [
      'Tu programa no paraba de escribir',
      'Seguro hay un while que nunca termina. Revisa que adentro del while cambie algo que haga falsa la condición.',
    ]
  }

  /* ----------------------------------------------- los de JavaScript --- */
  if (/console\s*\.\s*log/.test(linea)) {
    return ['Eso es de JavaScript', 'En Python no existe console.log: se usa print(…).']
  }
  if (/^(let|var|const)\s/.test(linea)) {
    return ['Eso es de JavaScript', 'En Python las variables se crean sin let, var ni const: solo nombre = valor.']
  }
  if (/^\/\//.test(linea)) {
    return ['Eso es de JavaScript', 'En Python los comentarios empiezan con #, no con //.']
  }
  if (/&&|\|\|/.test(linea)) {
    return ['Eso es de JavaScript', 'En Python se escribe and en lugar de &&, y or en lugar de ||.']
  }
  if (/\belse\s+if\b/.test(linea)) {
    return ['Eso es de JavaScript', 'En Python no es else if: es elif, todo pegado.']
  }
  if (/\{\s*$/.test(linea) || /^\}/.test(linea)) {
    return ['Eso es de JavaScript', 'Python no usa llaves { }. Después del if, for, while o def van dos puntos, y lo de adentro se corre a la derecha.']
  }
  if (tipo === 'NameError' && /'(true|false|null)'/.test(mensaje)) {
    const [, palabra] = mensaje.match(/'(true|false|null)'/)!
    const bien = palabra === 'null' ? 'None' : palabra[0].toUpperCase() + palabra.slice(1)
    return ['Eso es de JavaScript', `En Python se escribe ${bien}, con la primera letra en mayúscula.`]
  }
  if (tipo === 'AttributeError' && /'push'/.test(mensaje)) {
    return ['Eso es de JavaScript', 'En Python las listas no tienen push: se usa append.']
  }
  if (tipo === 'AttributeError' && /'length'/.test(mensaje)) {
    return ['Eso es de JavaScript', 'En Python no hay .length: se usa len(…).']
  }

  /* ---------------------------------------------------- los de Python --- */
  if (tipo === 'NameError') {
    const nombre = mensaje.match(/name '(.+?)'/)?.[1] ?? ''
    if (/^[A-Z]/.test(nombre) && nombre.toLowerCase() === 'print') {
      return ['Python no conoce ese nombre', 'Es print, todo en minúscula: Python distingue mayúsculas de minúsculas.']
    }
    return [
      `Python no conoce “${nombre}”`,
      `O no creaste ${nombre} antes de usarlo, o lo escribiste distinto (las mayúsculas cuentan). Si era un texto, le faltan las comillas.`,
    ]
  }
  if (tipo === 'IndentationError' || tipo === 'TabError') {
    if (/expected an indented block/.test(mensaje)) {
      return ['Falta correr a la derecha', 'Después de los dos puntos (:) lo de adentro va corrido a la derecha: 4 espacios o la tecla Tab.']
    }
    if (/unexpected indent/.test(mensaje)) {
      return ['Esta línea está corrida de más', 'Tiene espacios al principio que no van. Pégala a la izquierda, o alinéala con la línea de arriba.']
    }
    return ['La sangría no cuadra', 'Las líneas que van juntas tienen que empezar exactamente en la misma columna.']
  }
  if (tipo === 'SyntaxError') {
    if (/unterminated string|EOL while scanning/.test(mensaje)) {
      return ['Una comilla sin cerrar', 'Abriste unas comillas y no las cerraste. Cada texto lleva comillas al principio y al final.']
    }
    if (/was never closed/.test(mensaje)) {
      return ['Algo quedó abierto', `Abriste un ${mensaje.match(/'(.)'/)?.[1] ?? 'paréntesis'} y nunca lo cerraste. Cuenta los que abren y los que cierran.`]
    }
    if (/Missing parentheses in call to 'print'/.test(mensaje)) {
      return ['Al print le faltan paréntesis', 'Se escribe print("…"), con paréntesis.']
    }
    if (/expected ':'/.test(mensaje)) {
      return ['Faltan los dos puntos', 'Las líneas de if, elif, else, for, while y def terminan en dos puntos (:).']
    }
    if (/Maybe you meant '=='/.test(mensaje)) {
      return ['= no es lo mismo que ==', 'Para comparar se usa == (dos iguales). Un solo = es para guardar en una variable.']
    }
    if (/invalid decimal literal/.test(mensaje)) {
      return ['Un nombre no puede empezar con número', 'Los nombres de variable empiezan con letra: jugadores2 sí, 2jugadores no.']
    }
    if (/^[a-z_]\w*\s+[a-z_]\w*\s*=/.test(linea)) {
      return ['Un nombre no puede tener espacios', 'Si son dos palabras, únelas con guion bajo: mi_nombre.']
    }
    return [
      'Python no entiende cómo está escrita esta línea',
      'Revisa comillas, paréntesis, comas y dos puntos. Compárala con los ejemplos de la explicación.',
    ]
  }
  if (tipo === 'TypeError') {
    if (/can only concatenate str|unsupported operand type\(s\) for \+: 'int' and 'str'/.test(mensaje)) {
      return [
        'Estás sumando texto con número',
        'No se puede pegar texto con número usando +. Usa un f-string, separa con comas en el print, o convierte: str(numero) o int(texto).',
      ]
    }
    if (/can't multiply sequence by non-int/.test(mensaje)) {
      return ['Estás multiplicando dos textos', 'Lo que llega de input() es texto. Conviértelo con int(…) antes de hacer cuentas.']
    }
    if (/not supported between instances of 'str' and 'int'|'int' and 'str'/.test(mensaje)) {
      return ['Estás comparando texto con número', 'Lo que llega de input() es texto. Conviértelo con int(…) antes de comparar.']
    }
    if (/takes \d+ positional argument|missing \d+ required positional argument/.test(mensaje)) {
      return ['La función recibió los datos que no era', 'Revisa cuántos datos pide la función en el def y cuántos le das cuando la llamas.']
    }
    if (/object is not callable/.test(mensaje)) {
      return ['Eso no es una función', 'Le pusiste paréntesis a algo que no es una función. ¿Usaste un nombre de variable igual al de una función?']
    }
  }
  if (tipo === 'ValueError' && /invalid literal for int/.test(mensaje)) {
    const valor = mensaje.match(/: (.*)$/)?.[1] ?? ''
    return ['Eso no es un número', `int() solo convierte números, y le llegó ${valor}. Revisa la respuesta que le diste a input().`]
  }
  if (tipo === 'ZeroDivisionError') {
    return ['División por cero', 'Ni Python ni nadie puede dividir entre cero.']
  }
  if (tipo === 'IndexError') {
    return ['Esa posición no existe', 'Las posiciones empiezan en 0: en una lista de 3, son 0, 1 y 2. La última también es [-1].']
  }
  if (tipo === 'AttributeError') {
    const que = mensaje.match(/attribute '(.+?)'/)?.[1]
    return ['Eso no existe', `${que ? `“${que}” no existe ahí. ` : ''}Revisa cómo se escribe: ¿append, upper, lower?`]
  }
  if (tipo === 'RecursionError') {
    return ['Una función que se llama a sí misma sin parar', 'Revisa que la función no se llame a ella misma por dentro.']
  }
  return ['Python encontró un problema', 'Lee el mensaje de abajo: casi siempre dice en qué línea y qué esperaba encontrar.']
}
