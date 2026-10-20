import type { ErrorDelPrograma } from './calificar'
import type { ErrorExplicado } from './errores-python'

/**
 * Los errores de TypeScript ya vienen en español (el compilador trae sus
 * mensajes traducidos), pero con palabras de adulto: "no se puede asignar al
 * tipo". Aquí se vuelven una pista corta, y se cazan los vicios de quien viene
 * de Python: print, input, True, elif.
 *
 * Los que empiezan por TS son errores de tipos: el programa ni se corrió. Los
 * demás pasaron mientras corría.
 *
 * Nunca es un regaño: dice qué pasó y qué probar.
 */
export function explicarErrorTS(e: ErrorDelPrograma, codigo: string): ErrorExplicado {
  const linea = e.linea ? codigo.split('\n')[e.linea - 1] ?? '' : ''
  const donde = e.linea ? `Línea ${e.linea} · ` : ''
  const deTipos = /^TS\d+$/.test(e.tipo)
  const original = deTipos ? `${e.mensaje.split('\n')[0]} (${e.tipo})` : e.mensaje ? `${e.tipo}: ${e.mensaje}` : e.tipo
  const [titulo, base] = traducir(e, linea.trim(), codigo)
  let pista = base
  if (deTipos) pista += ' Por eso no se corrió: TypeScript revisa antes de correr.'
  if (e.cuantos && e.cuantos > 1) {
    pista += ` Hay ${e.cuantos - 1} error${e.cuantos > 2 ? 'es' : ''} más: arregla este primero, que a veces los otros se van solos.`
  }
  return { titulo: donde + titulo, pista, original }
}

/** Los nombres entre comillas del mensaje: 'string', "number", "{ nombre: string; }". */
function entreComillas(mensaje: string) {
  return [...mensaje.split('\n')[0].matchAll(/'([^']*)'|"([^"]*)"/g)].map((m) => m[1] ?? m[2])
}

/**
 * ¿El alumno creó ese tipo como una unión? `type Figura = Circulo | Cuadrado`,
 * o en varios renglones, cada uno empezando con `|`. `Resultado<number>` se
 * busca como Resultado.
 */
function esUnionDelAlumno(nombre: string | undefined, codigo: string) {
  const base = nombre?.match(/^\w+/)?.[0]
  if (!base) return false
  const m = codigo.match(new RegExp(`\\btype\\s+${base}\\b[^=]*=([\\s\\S]*?)(\\n\\s*\\n|$)`))
  return Boolean(m && /^\s*\|/.test(m[1])) || Boolean(m && /^[^\n{]*\|/.test(m[1]))
}

function traducir({ tipo, mensaje }: ErrorDelPrograma, linea: string, codigo: string): [string, string] {
  const [a, b, c] = entreComillas(mensaje)

  /* ------------------------------------------------- los de la página --- */
  if (tipo === 'SinRespuestas') {
    return [
      'Faltan respuestas para prompt()',
      'Tu programa hizo más preguntas que respuestas hay en las cajitas. Agrega otra respuesta, o revisa si pusiste un prompt() de más.',
    ]
  }
  if (tipo === 'DemasiadoTexto') {
    return [
      'Tu programa no paraba de escribir',
      'Seguro hay un while que nunca termina. Revisa que adentro del while cambie algo que haga falsa la condición.',
    ]
  }

  /* ---------------------------------------------------- los de Python --- */
  if (tipo === 'TS2304' || tipo === 'TS2552') {
    if (a === 'print') return ['Eso es de Python', 'En TypeScript, como en JavaScript, se escribe console.log(…).']
    if (a === 'input') return ['Eso es de Python', 'Aquí las preguntas se hacen con prompt("…"), y lo que responden llega como texto.']
    if (a === 'True' || a === 'False') return ['Eso es de Python', 'En TypeScript es true y false, en minúscula.']
    if (a === 'elif') return ['Eso es de Python', 'En TypeScript es else if, separado.']
    if (a === 'def') return ['Eso es de Python', 'En TypeScript las funciones se crean con function nombre(…) { … }.']
    if (a === 'len') return ['Eso es de Python', 'En TypeScript el largo se pide con .length: lista.length, texto.length.']
  }
  if (/^\s*#(\s|$)/.test(linea)) return ['Eso es de Python', 'En TypeScript los comentarios empiezan con //, no con #.']

  /* ------------------------------------------------ errores de tipos --- */
  switch (tipo) {
    case 'TS2322':
      if (b === 'never' && /:\s*never\b/.test(linea)) {
        // La alarma del switch: llegó un caso que nadie atendió.
        const caso = a?.match(/"([^"]+)"/)?.[1] ?? a
        return ['Te faltó un caso', `${caso} llegó hasta el never: nadie lo atendió. Agrégale su case al switch.`]
      }
      if (b === 'never') {
        return ['Ahí no cabe nada', 'Esa lista o variable quedó sin tipo. Dile qué guarda: let lista: string[] = []']
      }
      if (/^return\b/.test(linea)) {
        return [
          `La función devuelve un ${a}`,
          `Pero arriba dice que devuelve un ${b}. Cambia lo que devuelve, o el tipo que va después del paréntesis.`,
        ]
      }
      return [
        `Ahí va un ${b}, no un ${a}`,
        `Esa caja es de tipo ${b} y le estás guardando un ${a}. Cambia el valor, o el tipo si te equivocaste al ponerlo.`,
      ]
    case 'TS2820':
      return ['Casi', `Ahí solo se vale ${b}. ¿Quisiste escribir ${c}? Revisa letra por letra.`]
    case 'TS2345':
      return [
        `La función esperaba un ${b}`,
        `Le diste un ${a}. Mira de qué tipo es el parámetro en la línea donde se crea la función.`,
      ]
    case 'TS2304':
      return [`No conozco “${a}”`, '¿Ya lo creaste con let, const, function o class? Revisa cómo se escribe: las mayúsculas cuentan.']
    case 'TS2552':
      return [`No conozco “${a}”`, `¿Quisiste decir ${b}?`]
    case 'TS2339':
      if (b?.includes('|')) {
        return [`Puede que no tenga “${a}”`, `Puede ser ${b}, y no todos tienen ${a}. Pregunta primero con typeof cuál es.`]
      }
      if (esUnionDelAlumno(b, codigo)) {
        return [
          `Puede que no tenga “${a}”`,
          `${b} es una unión, y no todas sus formas tienen ${a}. Pregunta primero cuál es: por su etiqueta (como .tipo o .ok), con in o con typeof.`,
        ]
      }
      if (b?.startsWith('readonly ')) {
        return ['Esa lista es de solo lectura', `Tiene readonly: no se le puede hacer ${a} ni cambiarla.`]
      }
      if (b && /^[A-Z]$/.test(b)) {
        return [
          `TypeScript no sabe si ${b} tiene “${a}”`,
          `${b} puede ser cualquier tipo. Ponle una regla: <${b} extends { ${a}: … }>.`,
        ]
      }
      return [`Un ${b} no tiene “${a}”`, 'Revisa cómo se escribe, o el tipo de esa variable: a lo mejor no es lo que crees.']
    case 'TS2551':
      return [`Un ${b} no tiene “${a}”`, `¿Quisiste decir ${c}?`]
    case 'TS2554': {
      const [pide, dio] = mensaje.match(/\d+/g) ?? []
      return ['No cuadra el número de datos', pide ? `La función recibe ${pide} y le diste ${dio}.` : 'Revisa cuántos datos recibe la función.']
    }
    case 'TS7006':
      return [`¿De qué tipo es “${a}”?`, `TypeScript necesita que se lo digas: (${a}: number), (${a}: string)…`]
    case 'TS7005':
    case 'TS7034':
      return [`¿Qué guarda “${a}”?`, `Dale un tipo cuando la creas: let ${a}: number[] = []`]
    case 'TS2588':
      return [`“${a}” es const`, 'Una const no se puede cambiar. Si tiene que cambiar, créala con let.']
    case 'TS2540':
      return [`“${a}” es de solo lectura`, 'Tiene readonly: se pone al crearlo y después no se cambia.']
    case 'TS2451':
      return [`Ya creaste “${a}”`, 'Para cambiarle el valor no le pongas let otra vez: solo nombre = valor.']
    case 'TS2741':
      return [`Le falta “${a}”`, `El tipo ${c} pide ${a} y aquí no está.`]
    case 'TS2739':
    case 'TS2740':
      return ['Le faltan datos', `El tipo ${b} pide más cosas de las que le diste. Mira cómo se definió.`]
    case 'TS2353':
      return [`“${a}” no va ahí`, `El tipo ${b} no tiene ${a}. ¿Está mal escrito, o falta agregarlo al tipo?`]
    case 'TS18048':
    case 'TS18047':
    case 'TS2532':
    case 'TS18049':
      return [
        a ? `“${a}” puede estar vacío` : 'Eso puede estar vacío',
        'Puede ser undefined. Pregunta antes con un if, o dale un valor por si acaso con ??.',
      ]
    case 'TS2355':
    case 'TS2366':
      return ['Falta el return', 'Dijiste qué tipo devuelve la función, pero hay un camino donde no devuelve nada.']
    case 'TS2362':
    case 'TS2363':
      return ['Las cuentas son con números', '¿Es un texto? Conviértelo antes con Number(…).']
    case 'TS2365':
      return ['No se pueden juntar así', `El ${a} no funciona entre un ${b} y un ${c}. ¿Falta un Number(…)?`]
    case 'TS2367':
      return ['Esa comparación nunca da true', `Un ${a} nunca va a ser igual a un ${b}. Revisa cómo se escribe.`]
    case 'TS2678':
      return ['Ese case nunca pasa', `${a} no es uno de los valores posibles. Revisa cómo se escribe.`]
    case 'TS2349':
      return ['Eso no es una función', 'Le pusiste paréntesis a algo que no se puede llamar.']
    case 'TS2693':
      return [`“${a}” es un tipo`, 'Los tipos van después de los dos puntos: let edad: number = 10.']
    case 'TS2448':
    case 'TS2454':
      return [`Usas “${a}” antes de tiempo`, 'Primero se crea (y se le da un valor) y después se usa.']
    case 'TS1155':
      return ['La const necesita valor', 'Una const se crea con su valor: const nombre = "Ana"']
    case 'TS2564':
      return [`“${a}” no tiene valor`, `Dale un valor ahí mismo, o en el constructor con this.${a} = …`]
    case 'TS2341':
    case 'TS2445':
      return [`“${a}” es privado`, 'Solo se puede usar adentro de la clase. Desde afuera, usa un método.']
    case 'TS18046':
    case 'TS2571':
      return [
        a ? `¿Qué es “${a}”?` : '¿Qué es eso?',
        'Es unknown: antes de usarlo, pregunta qué es con typeof, o con instanceof Error si viene de un catch.',
      ]
    case 'TS2493':
      return ['Esa posición no existe', `La tupla ${a} tiene ${b} posiciones: de la 0 a la ${Number(b) - 1}.`]
    case 'TS2344':
      return ['No cumple la regla', `El tipo ${a} no cumple con ${b}, la regla que va después del extends.`]
    case 'TS2769':
      return ['Así no se llama esa función', 'Revisa qué datos le estás dando y de qué tipo son.']
    case 'TS7053':
      return ['Esa llave no está en el tipo', 'Si las llaves cambian, usa Record<string, …> como tipo.']
    case 'TS2394':
    case 'TS2416':
      return ['No cumple con el tipo', 'La clase o función no tiene la forma que pide el tipo. Revisa nombres y tipos uno por uno.']
    case 'TS2420':
      return ['A la clase le falta algo', `Dijiste que cumple con ${b}, pero le falta lo que pide. Mira el mensaje de abajo.`]
    case 'TS1005':
      return [`Falta ${a ? `un ${a}` : 'algo'}`, 'Revisa que estén cerrados los paréntesis, las llaves y las comillas.']
    case 'TS1109':
    case 'TS1128':
    case 'TS1003':
    case 'TS1434':
    case 'TS1435':
      return ['Algo está mal escrito', 'Revisa la línea: paréntesis, llaves, comillas, comas.']
    case 'TS1002':
      return ['Falta cerrar un texto', 'Un texto que abre comillas tiene que cerrarlas en la misma línea.']
  }
  if (/^TS\d+$/.test(tipo)) {
    return ['Los tipos no cuadran', 'Lee el mensaje de abajo: dice qué esperaba TypeScript y qué encontró.']
  }

  /* ----------------------------------------------- mientras corría --- */
  if (tipo === 'RangeError' && /call stack/i.test(mensaje)) {
    return [
      'Una función que se llama a sí misma sin parar',
      'Le falta el caso base (el if que responde sin llamarse otra vez), o el paso no se acerca a él.',
    ]
  }
  if (tipo === 'TypeError' && /undefined|null/.test(mensaje)) {
    return ['Eso estaba vacío', 'Algo era undefined cuando lo usaste. ¿Esa posición de la lista existe? ¿Ese dato tiene valor?']
  }
  if (tipo === 'TypeError' && /is not a function/.test(mensaje)) {
    return ['Eso no es una función', 'Revisa cómo se escribe: ¿push, toUpperCase, includes?']
  }
  if (tipo === 'Error' || tipo === 'FalloInterno') {
    const atrapar = tipo === 'Error' && !/\btry\s*\{/.test(codigo) ? ' Si quieres que el programa siga, atrápalo con try { … } catch (e) { … }.' : ''
    return ['Tu programa lanzó un error', (mensaje ? `El mensaje dice: ${mensaje}${/[.!?]$/.test(mensaje) ? '' : '.'}` : 'Lee el mensaje de abajo.') + atrapar]
  }
  return ['Algo falló mientras corría', 'Lee el mensaje de abajo y busca qué línea lo pudo causar.']
}
