/*
 * El corredor del curso de TypeScript.
 *
 * Lo usa public/typescript/worker.js en el navegador, y también se puede
 * importar desde Node para probar la llave de respuestas: por eso no carga
 * nada por su cuenta. Recibe el compilador (`ts`) y los archivos lib.*.d.ts
 * ya leídos.
 *
 * Hace dos cosas, en orden, igual que tsc:
 *   1. Revisa los tipos con el compilador de verdad. Si hay un error de tipos,
 *      el programa no se corre: así se ve que TypeScript lo atrapa antes.
 *   2. Quita los tipos y corre el JavaScript que queda, con un console.log y
 *      un prompt propios (las respuestas vienen en el pedido).
 *
 * Devuelve lo mismo que el corredor de Python: la salida, el error si lo hubo
 * y el valor de las expresiones que pida la revisión. Además, `rechazos` dice
 * si cada pedazo de `revisar`, pegado al final del programa, hace que los
 * tipos se quejen.
 */

const ARCHIVO = 'tu_codigo.ts'
const AMBIENTE = 'ambiente.d.ts'

/* Un console.log dentro de un while infinito llena la memoria en un segundo. */
const LIMITE_DE_TEXTO = 20000

/*
 * Lo que existe en el mundo del alumno, además de JavaScript: console.log y
 * prompt. En el navegador prompt puede devolver null; aquí siempre devuelve
 * texto, para no meter ese lío en la primera clase.
 */
const TIPOS_DEL_AMBIENTE = `
interface Console {
  log(...datos: unknown[]): void
  info(...datos: unknown[]): void
  warn(...datos: unknown[]): void
  error(...datos: unknown[]): void
}
declare var console: Console
declare function prompt(pregunta?: string): string
`

export function crearCorredor(ts, libs) {
  const opciones = {
    strict: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    // Cada programa es su propio mundo: una variable "name" no choca con nada.
    moduleDetection: ts.ModuleDetectionKind.Force,
    noLib: true,
    types: [],
    noEmit: true,
  }

  // Leer lib.es5.d.ts es lo que más tarda: se hace una sola vez y se reutiliza.
  const fijos = new Map()
  for (const [nombre, texto] of Object.entries(libs)) {
    fijos.set(nombre, ts.createSourceFile(nombre, texto, ts.ScriptTarget.ES2022, true))
  }
  fijos.set(AMBIENTE, ts.createSourceFile(AMBIENTE, TIPOS_DEL_AMBIENTE, ts.ScriptTarget.ES2022, true))
  const raices = [...fijos.keys(), ARCHIVO]
  let anterior

  /** Los errores de tipos del código, del primero al último. */
  function revisarTipos(codigo) {
    const propio = ts.createSourceFile(ARCHIVO, codigo, ts.ScriptTarget.ES2022, true)
    const host = {
      getSourceFile: (nombre) => (nombre === ARCHIVO ? propio : fijos.get(nombre)),
      getDefaultLibFileName: () => 'lib.d.ts',
      writeFile: () => {},
      getCurrentDirectory: () => '/',
      getCanonicalFileName: (f) => f,
      useCaseSensitiveFileNames: () => true,
      getNewLine: () => '\n',
      fileExists: (f) => f === ARCHIVO || fijos.has(f),
      readFile: () => undefined,
    }
    const programa = ts.createProgram({ rootNames: raices, options: opciones, host, oldProgram: anterior })
    anterior = programa
    const sintaxis = programa.getSyntacticDiagnostics(propio)
    const errores = sintaxis.length ? sintaxis : programa.getSemanticDiagnostics(propio)
    return errores
      .filter((d) => d.category === ts.DiagnosticCategory.Error)
      .map((d) => ({
        tipo: `TS${d.code}`,
        mensaje: ts.flattenDiagnosticMessageText(d.messageText, '\n'),
        linea: d.file && d.start !== undefined ? d.file.getLineAndCharacterOfPosition(d.start).line + 1 : null,
      }))
  }

  function quitarTipos(codigo) {
    const js = ts.transpileModule(codigo, {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleDetection: ts.ModuleDetectionKind.Force },
    }).outputText
    return js.replace(/^export \{\};?\s*$/m, '')
  }

  function correr(pedido) {
    const codigo = pedido.codigo ?? ''
    const expresiones = pedido.expresiones ?? []
    const errores = revisarTipos(codigo)

    // Cada pedazo de revisar se pega al final, para ver si los tipos lo atajan.
    const rechazos = (pedido.revisar ?? []).map((extra) => errores.length > 0 || revisarTipos(`${codigo}\n${extra}\n`).length > 0)

    if (errores.length) {
      return { salida: '', error: { ...errores[0], cuantos: errores.length }, valores: [], rechazos }
    }

    let salida = ''
    const escribir = (s) => {
      if (salida.length + s.length > LIMITE_DE_TEXTO) throw ajeno('DemasiadoTexto')
      salida += s
    }
    const log = (...datos) => escribir(datos.map((d) => mostrar(d, 0)).join(' ') + '\n')
    const consola = { log, info: log, warn: log, error: log, debug: log }

    const pendientes = [...(pedido.entradas ?? [])]
    const preguntar = (pregunta = '') => {
      // Se escribe la pregunta y la respuesta, como se vería en una terminal.
      escribir(String(pregunta))
      if (!pendientes.length) throw ajeno('SinRespuestas')
      const respuesta = String(pendientes.shift())
      escribir(respuesta + '\n')
      return respuesta
    }

    const matematicas = Object.create(Math)
    if (pedido.semilla !== undefined && pedido.semilla !== null) matematicas.random = azarConSemilla(pedido.semilla)

    let error = null
    let mirar = []
    try {
      const js = quitarTipos(codigo)
      // Las expresiones se arman adentro, para que vean las variables del programa.
      const cuerpo = `"use strict";\n${js}\n;return [${expresiones.map((e) => `() => (${e})`).join(', ')}]`
      mirar = new Function('console', 'prompt', 'Math', cuerpo)(consola, preguntar, matematicas)
    } catch (e) {
      error = describir(e)
    }

    const valores = []
    if (!error) {
      for (const f of mirar) {
        const antes = salida
        try {
          const valor = f()
          valores.push({ valor: mostrar(valor, 1), salida: salida.slice(antes.length) })
        } catch (e) {
          valores.push({ error: describir(e) })
        }
        salida = antes
      }
    }

    return { salida, error, valores, rechazos }
  }

  return { correr, revisarTipos }
}

/* ---------------------------------------------------------------- ayudas --- */

function ajeno(tipo) {
  const e = new Error(tipo)
  e.ajeno = tipo
  return e
}

function describir(e) {
  if (e && e.ajeno) return { tipo: e.ajeno, mensaje: '', linea: null }
  if (e instanceof Error) return { tipo: e.name, mensaje: e.message, linea: null }
  // throw "algo" sin new Error: igual se le cuenta.
  return { tipo: 'Error', mensaje: mostrar(e, 0), linea: null }
}

function tipoDe(v) {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v
}

/** Igual que en la arena (public/runner.html): como lo mostraría la consola de Chrome. */
export function mostrar(v, nivel) {
  const t = tipoDe(v)
  if (t === 'string') return nivel === 0 ? v : '"' + v + '"'
  if (t === 'undefined') return 'undefined'
  if (t === 'null') return 'null'
  if (t === 'number' || t === 'boolean' || t === 'bigint') return String(v)
  if (t === 'function') return 'function'
  if (t === 'array') {
    if (nivel > 3) return '[...]'
    return '[' + v.map((x) => mostrar(x, nivel + 1)).join(', ') + ']'
  }
  if (t === 'object') {
    if (nivel > 3) return '{...}'
    if (v instanceof Map) return 'Map(' + v.size + ')'
    if (v instanceof Set) return 'Set(' + v.size + ')'
    const llaves = Object.keys(v)
    if (!llaves.length) return '{}'
    return '{ ' + llaves.map((k) => k + ': ' + mostrar(v[k], nivel + 1)).join(', ') + ' }'
  }
  return String(v)
}

/** Math.random repetible: la misma semilla, los mismos números. */
function azarConSemilla(semilla) {
  let s = semilla >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Los lib.*.d.ts que hacen falta para es2022, siguiendo sus `/// <reference lib>`.
 * `leer(nombre)` trae el texto de un archivo (del CDN o del disco).
 */
export async function leerLibs(leer, primero = 'lib.es2022.d.ts') {
  const libs = {}
  let tanda = [primero]
  // Por tandas y en paralelo: son unos cuarenta archivos chiquitos.
  while (tanda.length) {
    const textos = await Promise.all(tanda.map(leer))
    const siguiente = new Set()
    tanda.forEach((nombre, i) => {
      libs[nombre] = textos[i]
      for (const m of textos[i].matchAll(/\/\/\/\s*<reference\s+lib="([^"]+)"/g)) {
        const otro = `lib.${m[1].toLowerCase()}.d.ts`
        if (libs[otro] === undefined && !tanda.includes(otro)) siguiente.add(otro)
      }
    })
    tanda = [...siguiente]
  }
  return libs
}
