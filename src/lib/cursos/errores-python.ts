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
  // Un diccionario que sigue en el otro renglón (d = {) sí es Python.
  if ((/\{\s*$/.test(linea) && !/[=(\[,:]\s*\{\s*$/.test(linea)) || /^\}\s*(else\b.*)?$/.test(linea)) {
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
  if (tipo === 'NameError' && /'this'/.test(mensaje)) {
    return ['Eso es de JavaScript', 'En Python no es this: es self. Y self va de primer parámetro en cada método: def jugar(self):']
  }
  if (/\bnew\s+[A-Z]\w*\s*\(/.test(linea)) {
    return ['Eso es de JavaScript', 'En Python los objetos se crean sin new: toby = Perro("Toby").']
  }
  if (tipo === 'AttributeError' && /^'dict' object has no attribute/.test(mensaje)) {
    const que = mensaje.match(/attribute '(.+?)'/)?.[1] ?? 'llave'
    return ['Eso es de JavaScript', `En un diccionario no se usa punto: se escribe con corchetes y comillas, así: ["${que}"].`]
  }
  if (tipo === 'NameError' && /^name '\w+' is not defined/.test(mensaje) && /\{[^}]*\b\w+\s*:/.test(linea) && !/["']\s*:/.test(linea)) {
    return ['Eso es de JavaScript', 'En un diccionario de Python las llaves van entre comillas: {"nombre": "Toby"}.']
  }

  /* ---------------------------------------------------- los de Python --- */
  if (tipo === 'NameError' && /'(random|math)'/.test(mensaje)) {
    const modulo = mensaje.match(/'(random|math)'/)![1]
    return [`Falta abrir ${modulo}`, `Escribe import ${modulo} arriba del todo, antes de usarlo.`]
  }
  if (tipo === 'NameError' && /'(randint|choice|shuffle|sqrt|pi|floor|ceil)'/.test(mensaje)) {
    const que = mensaje.match(/'(\w+)'/)![1]
    const modulo = ['randint', 'choice', 'shuffle'].includes(que) ? 'random' : 'math'
    return ['Falta decir de qué módulo es', `Se escribe ${modulo}.${que}, con el nombre del módulo y un punto adelante.`]
  }
  if (tipo === 'NameError' && /'self'/.test(mensaje)) {
    return ['self solo existe dentro de los métodos', 'Revisa que esta línea esté dentro de un def de la clase, y que ese def tenga self de primer parámetro.']
  }
  if (tipo === 'UnboundLocalError' || (tipo === 'NameError' && /cannot access local variable/.test(mensaje))) {
    const nombre = mensaje.match(/variable '(.+?)'/)?.[1] ?? 'esa variable'
    return [
      'Lo de afuera no se cambia desde adentro',
      `Dentro de la función usas ${nombre} antes de crearla ahí. Pásala como parámetro y devuelve el resultado con return.`,
    ]
  }
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
    if (/takes 0 positional arguments but 1 was given/.test(mensaje) && /\./.test(mensaje)) {
      return ['A este método le falta self', 'Todo método de una clase lleva self de primer parámetro: def jugar(self):']
    }
    if (/^\w+\(\) takes no arguments/.test(mensaje)) {
      return ['La clase no sabe recibir datos', 'Le falta el __init__, o está mal escrito: son dos guiones bajos a cada lado, def __init__(self, …):']
    }
    if (/takes \d+ positional argument|missing \d+ required positional argument/.test(mensaje)) {
      return ['La función recibió los datos que no era', 'Revisa cuántos datos pide la función en el def y cuántos le das cuando la llamas.']
    }
    if (/'tuple' object does not support item assignment/.test(mensaje)) {
      return ['Las tuplas no se cambian', 'Una tupla queda como se creó. Si necesitas cambiarla, usa una lista, con corchetes.']
    }
    if (/'str' object does not support item assignment/.test(mensaje)) {
      return ['Un texto no se cambia por dentro', 'Crea un texto nuevo y guárdalo: texto = texto.replace("a", "4").']
    }
    if (/'NoneType' object is not (subscriptable|iterable)/.test(mensaje)) {
      return ['Eso está vacío (None)', '¿Guardaste lo que devuelve sort() o una función sin return? Esas no devuelven nada.']
    }
    if (/'int' object is not iterable/.test(mensaje)) {
      return ['Un número no se puede recorrer', 'Para repetir varias veces se usa range: for i in range(5):']
    }
    if (/object is not callable/.test(mensaje)) {
      return ['Eso no es una función', 'Le pusiste paréntesis a algo que no es una función. ¿Usaste un nombre de variable igual al de una función?']
    }
  }
  if (tipo === 'ValueError' && /invalid literal for int/.test(mensaje)) {
    const valor = mensaje.match(/: (.*)$/)?.[1] ?? ''
    return ['Eso no es un número', `int() solo convierte números, y le llegó ${valor}. Revisa la respuesta que le diste a input().`]
  }
  if (tipo === 'ValueError' && /too many values to unpack/.test(mensaje)) {
    return ['Sobran datos al desempacar', 'Hay más datos que variables a la izquierda del =. Pon una variable por cada dato.']
  }
  if (tipo === 'ValueError' && /not enough values to unpack/.test(mensaje)) {
    return ['Faltan datos al desempacar', 'Hay más variables a la izquierda del = que datos. Pon una variable por cada dato.']
  }
  if (tipo === 'ValueError' && /x not in list/.test(mensaje)) {
    return ['Eso no está en la lista', 'remove no encontró ese dato. Revisa cómo se escribe, con mayúsculas y todo.']
  }
  if (tipo === 'KeyError') {
    return [
      `La llave ${mensaje} no está en el diccionario`,
      'Revisa cómo se escribe (las mayúsculas y las tildes cuentan). Si puede no estar, pregunta antes con in, o usa .get().',
    ]
  }
  if (tipo === 'ModuleNotFoundError') {
    return ['Ese módulo no existe', 'Revisa cómo se escribe: import random, import math.']
  }
  if (tipo === 'ZeroDivisionError') {
    return ['División por cero', 'Ni Python ni nadie puede dividir entre cero.']
  }
  if (tipo === 'IndexError') {
    return ['Esa posición no existe', 'Las posiciones empiezan en 0: en una lista de 3, son 0, 1 y 2. La última también es [-1].']
  }
  if (tipo === 'AttributeError') {
    const que = mensaje.match(/attribute '(.+?)'/)?.[1]
    if (/^'NoneType' object/.test(mensaje)) {
      return ['Eso está vacío (None)', '¿Guardaste lo que devuelve sort() o una función sin return? Esas no devuelven nada.']
    }
    const tipoDelObjeto = mensaje.match(/^'(\w+)' object/)?.[1]
    if (tipoDelObjeto && /^[A-Z]/.test(tipoDelObjeto)) {
      return [
        `Tu ${tipoDelObjeto} no tiene “${que}”`,
        `¿Lo guardaste en el __init__ con self.${que}? ¿O el método se llama distinto? Revisa también la sangría: los métodos van dentro de la clase.`,
      ]
    }
    return ['Eso no existe', `${que ? `“${que}” no existe ahí. ` : ''}Revisa cómo se escribe: ¿append, upper, lower?`]
  }
  if (tipo === 'RecursionError') {
    return [
      'Una función que se llama a sí misma sin parar',
      'Le falta el caso base (el if que responde sin llamarse otra vez), o el paso no se acerca a él: tiene que ser n - 1, no n + 1.',
    ]
  }
  return ['Python encontró un problema', 'Lee el mensaje de abajo: casi siempre dice en qué línea y qué esperaba encontrar.']
}
