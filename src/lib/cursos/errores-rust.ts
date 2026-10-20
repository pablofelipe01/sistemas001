import type { ErrorDelPrograma } from './calificar'
import type { ErrorExplicado } from './errores-python'

/**
 * Los errores de Rust llegan en inglés y con su código (E0384, E0308…). Aquí se
 * vuelven una pista corta en español, y se cazan los vicios de quien viene de
 * JavaScript: console.log, function, ===, el println sin signo de admiración.
 *
 * Los que tienen código E son errores de compilación: el programa ni se corrió.
 * Los Panic pasaron mientras corría.
 *
 * Nunca es un regaño: dice qué pasó y qué probar.
 */
export function explicarErrorRust(e: ErrorDelPrograma, codigo: string): ErrorExplicado {
  const linea = e.linea ? (codigo.split('\n')[e.linea - 1] ?? '') : ''
  const donde = e.linea ? `Línea ${e.linea} · ` : ''
  const primero = e.mensaje.split('\n')[0]
  const deCompilar = /^E\d+$/.test(e.tipo) || e.tipo === 'ErrorDeCompilacion'
  const original = /^E\d+$/.test(e.tipo) ? `${primero} (${e.tipo})` : primero ? (e.tipo === 'Panic' ? `panic: ${primero}` : primero) : e.tipo
  const [titulo, base] = traducir(e, linea.trim(), codigo)
  let pista = base
  if (deCompilar) pista += ' Por eso no se corrió: Rust revisa todo antes de correr.'
  if (e.cuantos && e.cuantos > 1) {
    pista += ` Hay ${e.cuantos - 1} error${e.cuantos > 2 ? 'es' : ''} más: arregla este primero, que a veces los otros se van solos.`
  }
  return { titulo: donde + titulo, pista, original }
}

/** Los nombres entre comillas invertidas del mensaje: `x`, `i32`. */
function entreComillas(texto: string) {
  return [...texto.matchAll(/`([^`]*)`/g)].map((m) => m[1])
}

/** "expected `i32`, found `f64`" → ['i32', 'f64']. Rust a veces dice "floating-point number" o "integer". */
function esperadoYEncontrado(mensaje: string): [string, string] | null {
  const m = mensaje.match(/expected (`[^`]+`|[a-z][\w -]*?), found (`[^`]+`|[a-z][\w -]*)/)
  if (!m) return null
  const limpio = (s: string) =>
    s
      .replace(/`/g, '')
      .replace(/^floating-point number$/, 'decimal (f64)')
      .replace(/^integer$/, 'entero')
      .replace(/^\{integer\}$/, 'entero')
      .replace(/^\{float\}$/, 'decimal (f64)')
      .replace(/^&'static str$/, '&str')
      .replace(/^\(\)$/, 'nada')
  return [limpio(m[1]), limpio(m[2])]
}

function traducir({ tipo, mensaje }: ErrorDelPrograma, linea: string, codigo: string): [string, string] {
  const primero = mensaje.split('\n')[0]
  const [a, b] = entreComillas(primero)

  /* ------------------------------------------------- los de la página --- */
  if (tipo === 'SinRespuestas') {
    return [
      'Faltan respuestas para preguntar()',
      'Tu programa hizo más preguntas que respuestas hay en las cajitas. Agrega otra respuesta, o revisa si pusiste un preguntar() de más.',
    ]
  }
  if (tipo === 'DemasiadoTexto') {
    return ['Tu programa no paraba de escribir', 'Seguro hay un loop o un while que nunca termina. Revisa que tenga su break, o que la condición se vuelva falsa.']
  }
  if (tipo === 'SinConexion') {
    return ['No hubo conexión', 'Rust se compila en internet y no hubo respuesta. Revisa la conexión y dale otra vez.']
  }
  if (tipo === 'FalloInterno') {
    return ['El compilador no contestó', 'No es culpa de tu código: el compilador de Rust está ocupado. Espera un momento y dale otra vez.']
  }

  /* ----------------------------------------------- los de JavaScript --- */
  if (/^\s*function\b/.test(linea)) return ['Eso es de JavaScript', 'En Rust las funciones se crean con fn: fn saludar() { … }']
  if (/===|!==/.test(linea)) return ['Eso es de JavaScript', 'En Rust se compara con == y con !=, de a dos signos.']
  if (tipo === 'E0425' && a === 'console') return ['Eso es de JavaScript', 'En Rust se imprime con println!("…");']
  if (tipo === 'E0425' && (a === 'True' || a === 'False')) return ['Eso es de Python', 'En Rust es true y false, en minúscula.']
  if (/^\s*(const|var)\s+\w+\s*=/.test(linea) && !/^\s*const\s+[A-Z_]+\s*:/.test(linea)) {
    return ['Eso es de JavaScript', 'En Rust las variables se crean con let, y con let mut si van a cambiar.']
  }

  /* ------------------------------------------------ los de compilar --- */
  if (/^E04(12|25|33)$/.test(tipo) && (a === 'HashMap' || a === 'HashSet')) {
    return [`Falta traer el ${a}`, `Arriba de todo, antes de fn main, escribe: use std::collections::${a};`]
  }
  if (tipo === 'E0423' || tipo === 'E0574') {
    if (/macro/.test(primero)) return ['Le falta el signo de admiración', `Se escribe ${a}!(…), con el ! pegado: es una macro.`]
  }
  if (tipo === 'E0425') {
    if (a === 'main_del_alumno') return ['Falta fn main', 'Todo programa de Rust empieza en fn main() { … }. Revisa que esté y que se escriba así.']
    if (/^[A-Z]/.test(a ?? '')) return [`No conozco “${a}”`, `¿Ya creaste el struct o el enum ${a}? Los nombres con mayúscula son tipos.`]
    if (/function/.test(primero)) return [`No conozco la función “${a}”`, '¿Ya la creaste con fn? Revisa cómo se escribe: las mayúsculas y los guiones bajos cuentan.']
    return [`No conozco “${a}”`, '¿Ya la creaste con let? Si la creaste adentro de unas llaves { }, afuera ya no existe.']
  }

  switch (tipo) {
    case 'E0384':
      return [`“${a}” no se puede cambiar`, `En Rust las variables no cambian, salvo que lo digas: créala con let mut ${a}.`]
    case 'E0596':
      if (/behind a `&` reference/.test(primero)) {
        return ['Ese préstamo es solo para mirar', 'Para cambiarlo, pídelo prestado con &mut: el parámetro es &mut (por ejemplo, s: &mut String) y se llama con &mut.']
      }
      if (/`self`/.test(primero)) return ['El método no puede cambiar nada', 'Para cambiar el struct, el método recibe &mut self en vez de &self.']
      return [`“${a}” no se puede cambiar`, `Para cambiarla (o hacerle push) hay que crearla con let mut ${a}.`]
    case 'E0594':
      if (/behind a `&` reference/.test(primero)) {
        return ['Ese préstamo es solo para mirar', /self/.test(primero) ? 'Para cambiar el struct, el método recibe &mut self en vez de &self.' : 'Para cambiarlo, pídelo prestado con &mut.']
      }
      return [`“${a}” no se puede cambiar`, 'Para cambiarla, créala con let mut.']
    case 'E0502':
    case 'E0499':
      return [`“${a}” está prestado`, 'Rust deja prestar algo a muchos para mirar o a uno solo para cambiar, pero no las dos cosas a la vez. Termina de usar un préstamo antes de pedir el otro.']
    case 'E0507':
      return ['Eso está prestado: no lo puedes regalar', 'Lo tienes solo prestado. Usa .clone() para tener tu propia copia, o sigue prestándolo con &.']
    case 'E0004': {
      const caso = primero.match(/`([^`]+)`(?: and `[^`]+`)* not covered/)?.[1]
      return [caso ? `Te faltó un caso: ${caso}` : 'Te faltó un caso', 'Un match tiene que atender todas las opciones. Agrégale su línea con =>.']
    }
    case 'E0063':
      return [`Le falta el campo “${a}”`, 'Al crear un struct hay que darle todos sus campos.']
    case 'E0560':
    case 'E0609':
      return [`Ese campo no existe: “${b ?? a}”`, 'Revisa cómo se llaman los campos del struct: las mayúsculas y los guiones bajos cuentan.']
    case 'E0046':
      return ['Al impl le falta algo', `El trait pide ${a ? `“${a}”` : 'más métodos'} y no lo escribiste. Cópiale el nombre y los tipos tal cual del trait.`]
    case 'E0407':
      return [`El trait no tiene “${a}”`, 'Revisa que el método se llame igual que en el trait.']
    case 'E0308': {
      const tipos = esperadoYEncontrado(mensaje)
      if (tipos && tipos[1] === 'nada') {
        return [
          'La función no devuelve nada',
          'Dijiste qué tipo devuelve, pero la última línea tiene punto y coma. Quítaselo: la última línea sin ; es lo que se devuelve.',
        ]
      }
      if (tipos && tipos[0] === 'nada') {
        return ['Ahí sobra un valor', 'Ahí no se esperaba nada. ¿Le falta un punto y coma a la línea? ¿O a la función le falta decir qué devuelve con -> ?']
      }
      if (tipos && /^Option</.test(tipos[0]) && !/^Option</.test(tipos[1])) {
        return ['Falta envolverlo en Some', `La función devuelve un ${tipos[0]}: el dato va como Some(dato), y la nada como None.`]
      }
      if (tipos && /^Result</.test(tipos[0]) && !/^Result</.test(tipos[1])) {
        return ['Falta envolverlo en Ok', `La función devuelve un ${tipos[0]}: lo que sale bien va como Ok(dato), y el error como Err(…).`]
      }
      if (tipos?.[0] === 'String' && tipos[1] === '&str') {
        return ['Ahí va un String, no un &str', 'Conviértelo con String::from("…") o con .to_string().']
      }
      if (tipos) {
        const numeros = tipos.every((t) => /^(i32|i64|u32|u64|usize|f64|entero|decimal \(f64\))$/.test(t))
        const extra = numeros ? ' Para pasar de entero a decimal: n as f64.' : ''
        return [`Ahí va un ${tipos[0]}, no un ${tipos[1]}`, 'Los tipos no cuadran. Cambia el valor, o el tipo si te equivocaste al ponerlo.' + extra]
      }
      return ['Los tipos no cuadran', 'Lee el mensaje de abajo: dice qué esperaba Rust y qué encontró.']
    }
    case 'E0277':
      if (/cannot (add|subtract|multiply|divide)|no implementation for `\{?(integer|float|i32|f64)/.test(primero)) {
        return ['No se mezclan enteros y decimales', 'En una cuenta de Rust, un i32 y un f64 no se mezclan así no más. Convierte el entero con as f64: n as f64 * 2.5']
      }
      if (/doesn't implement `(std::fmt::)?Debug`/.test(primero)) {
        return [`Rust no sabe mostrar ${a ? `un ${a}` : 'eso'} con {:?}`, 'Ponle #[derive(Debug)] justo encima del struct o del enum.']
      }
      if (/cannot be formatted|doesn't implement `std::fmt::Display`/.test(primero)) {
        if (/^(Vec|HashMap|Option|Result|\(|\[)/.test(a ?? '')) return ['Eso no se imprime con {}', 'Las listas, los Option y los Result se muestran con {:?} en vez de {}.']
        return [`Rust no sabe mostrar ${a ? `un ${a}` : 'eso'} con {}`, 'Escríbele impl fmt::Display, o muéstralo con {:?} si tiene #[derive(Debug)].']
      }
      if (/`\?` operator/.test(primero)) {
        return ['El ? no se puede usar aquí', 'El signo ? solo va en funciones que devuelven un Result (o un Option). Cambia lo que devuelve la función, o usa match.']
      }
      return ['Eso no se puede hacer con ese tipo', 'Lee el mensaje de abajo: dice qué tipo tiene y qué le faltó.']
    case 'E0369':
      if (/`==`|`!=`/.test(primero) && !/&str|String|i32|f64/.test(primero)) {
        return ['Esos no se pueden comparar con ==', `Ponle PartialEq al derive del tipo: #[derive(Debug, PartialEq)].`]
      }
      if (/&str|String/.test(primero)) return ['Los textos no se pegan con +', 'Para armar un texto usa format!("{} {}", uno, otro).']
      return ['Esa cuenta no se puede', 'Revisa de qué tipo son los dos lados.']
    case 'E0061':
    case 'E0057': {
      const [pide, dio] = primero.match(/\d+/g) ?? []
      return ['No cuadra el número de datos', pide ? `La función recibe ${pide} y le diste ${dio}.` : 'Revisa cuántos datos recibe la función.']
    }
    case 'E0599':
      if (/found for (struct|enum) `/.test(primero) && b && /no (function or associated item|method) named/.test(primero)) {
        const que = /no method/.test(primero) ? 'el método' : 'la función'
        return [`${b} todavía no tiene “${a}”`, `Escribe ${que} ${a} adentro de impl ${b} { … }, o revisa cómo se escribe.`]
      }
      if (/no variant/.test(primero)) return [`${b ?? 'Ese enum'} no tiene la opción “${a}”`, 'Revisa cómo se escribe: las mayúsculas cuentan.']
      return [`Eso no tiene “${a}”`, 'Revisa cómo se escribe: las mayúsculas y los guiones bajos cuentan. ¿O es de otro tipo?']
    case 'E0282':
    case 'E0284':
      return ['¿De qué tipo es?', 'Rust necesita que se lo digas. Por ejemplo: let n: i32 = texto.parse().unwrap();']
    case 'E0381':
      return [`“${a}” no tiene valor`, 'Dale un valor cuando la creas: let x = 0;']
    case 'E0382':
      return [
        `“${a}” ya no es tuyo`,
        `Se lo pasaste a otra variable o a una función, y se movió. Para prestarlo usa &${a}; si de verdad necesitas dos, ${a}.clone().`,
      ]
    case 'E0106':
      return ['Falta decir de dónde sale ese texto', 'Si la función devuelve un texto, que devuelva un String: -> String, y String::from("…").']
    case 'E0428':
      return [`Ya existe “${a}”`, 'Hay dos cosas con el mismo nombre. Cámbiale el nombre a una.']
    case 'E0433':
      if (/undeclared type/.test(primero)) return [`No conozco el tipo “${a}”`, `¿Ya creaste el struct o el enum ${a}? Revisa cómo se escribe, con su mayúscula.`]
      return ['No encuentro eso', 'Revisa cómo se escribe, con sus :: y sus mayúsculas. ¿Falta un use arriba, como use std::collections::HashMap?']
    case 'E0412':
      return [`No conozco el tipo “${a}”`, a === 'HashMap' ? 'Arriba de todo falta: use std::collections::HashMap;' : `¿Ya creaste el struct o el enum ${a}? ¿O falta un use arriba?`]
    case 'E0432':
      return ['No encuentro eso', 'Revisa cómo se escribe, con sus :: y sus mayúsculas.']
    case 'E0765':
    case 'E0766':
      return ['Falta cerrar un texto', 'Un texto que abre comillas tiene que cerrarlas.']
    case 'E0600':
      return ['Eso no se puede negar', 'El ! de “no” es para un bool (true o false).']
    case 'E0614':
      return ['Sobra un *', 'Quita el asterisco de adelante.']
  }

  if (tipo === 'ErrorDeCompilacion') {
    if (/unclosed delimiter|unexpected closing delimiter|mismatched closing delimiter/.test(primero)) {
      return ['Falta una llave o un paréntesis', 'Cada { tiene su } y cada ( tiene su ). Revisa que estén todas cerradas.']
    }
    if (/expected `;`/.test(primero)) return ['Falta un punto y coma', 'En Rust cada instrucción termina con ; (como en esta línea o la de arriba).']
    if (/positional arguments? in format string|never used|argument never used/.test(primero)) {
      return ['No cuadran los {} con los datos', 'Cuenta: tiene que haber un {} por cada dato que le pasas a println!.']
    }
    if (/invalid format string/.test(primero)) return ['Algo raro entre las llaves', 'Adentro de las llaves va el nombre de una variable, o nada: {} o {edad}.']
    if (/main.*not found|`main` function not found/.test(primero)) {
      return ['Falta fn main', 'Todo programa de Rust empieza en fn main() { … }.']
    }
    if (/expected one of|expected expression|expected item|expected identifier|expected pattern/.test(primero)) {
      return ['Algo está mal escrito', 'Revisa la línea: llaves, paréntesis, comillas, comas y puntos y comas.']
    }
    if (/unterminated double quote/.test(primero)) return ['Falta cerrar un texto', 'Un texto que abre comillas tiene que cerrarlas.']
    if (/character literal may only contain one codepoint/.test(primero)) {
      return ['Los textos van entre comillas dobles', 'Con comillas sencillas va una sola letra (un char): \'a\'. Un texto va así: "hola".']
    }
  }
  if (/^E\d+$/.test(tipo) || tipo === 'ErrorDeCompilacion') {
    return ['Rust no aceptó el programa', 'Lee el mensaje de abajo: casi siempre dice la línea y lo que esperaba.']
  }

  /* ----------------------------------------------- mientras corría --- */
  if (tipo === 'Panic') {
    if (/index out of bounds/.test(mensaje)) {
      const [largo, pos] = mensaje.match(/\d+/g) ?? []
      return ['Esa posición no existe', largo ? `La lista tiene ${largo} cosas (de la 0 a la ${Number(largo) - 1}) y pediste la ${pos}.` : 'Pediste una posición que la lista no tiene.']
    }
    if (/attempt to divide by zero|remainder with a divisor of zero/.test(mensaje)) return ['Dividiste por cero', 'Eso no se puede. Revisa con un if que el número no sea 0.']
    if (/overflow/.test(mensaje)) {
      return ['El número se salió de la caja', 'Un i32 llega hasta 2147483647 y no baja de -2147483648, y un u32 no puede ser negativo. Revisa la cuenta.']
    }
    if (/ParseIntError|ParseFloatError/.test(mensaje)) {
      return ['Eso no era un número', 'parse() no pudo convertir el texto. ¿La respuesta es un número? ¿Lleva espacios o letras?']
    }
    if (/unwrap\(\)` on a `None`/.test(mensaje)) return ['Ahí no había nada', 'unwrap() se encontró con un None.']
    return ['Tu programa se detuvo (panic)', mensaje ? `El mensaje dice: ${mensaje}` : 'Lee el mensaje de abajo.']
  }
  if (/\bloop\b|\bwhile\b/.test(codigo)) return ['Algo falló mientras corría', 'Lee el mensaje de abajo y revisa los ciclos.']
  return ['Algo falló mientras corría', 'Lee el mensaje de abajo y busca qué línea lo pudo causar.']
}
