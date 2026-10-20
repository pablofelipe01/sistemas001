import type { Lenguaje, Prueba, Reto } from './tipos'

/* El mismo contrato que public/python/corredor.py y public/typescript/corredor.js. */

export interface ErrorDelPrograma {
  tipo: string
  mensaje: string
  linea: number | null
  /** TypeScript: cuántos errores de tipos hubo en total (se muestra el primero). */
  cuantos?: number
}

export type ValorExpr = { valor: string; salida: string } | { error: ErrorDelPrograma }

export interface Pedido {
  codigo: string
  entradas?: string[]
  expresiones?: string[]
  semilla?: number
  /** TypeScript: pedazos de código que se pegan al final para ver si los tipos se quejan. */
  revisar?: string[]
}

export interface Resultado {
  salida: string
  error: ErrorDelPrograma | null
  valores: ValorExpr[]
  /** Uno por cada pedazo de `revisar`: true si los tipos lo atajaron. */
  rechazos?: boolean[]
  /** El programa no terminó a tiempo: casi siempre un while que nunca para. */
  tiempoAgotado?: boolean
}

export type Correr = (p: Pedido) => Promise<Resultado>

export interface ResultadoPrueba {
  ok: boolean
  msg: string
}

export interface Calificacion {
  ok: boolean
  resultados: ResultadoPrueba[]
  /** La corrida con las respuestas del reto: es la que se le muestra al alumno. */
  principal: Resultado
  /** Si alguna corrida se rompió, esta es la que se le cuenta. */
  rota: Resultado | null
}

/* ------------------------------------------------------------ comparar --- */

function sinBordes(lineas: string[]) {
  let a = 0
  let b = lineas.length
  while (a < b && lineas[a] === '') a++
  while (b > a && lineas[b - 1] === '') b--
  return lineas.slice(a, b)
}

/** Renglones de la salida, sin espacios al final ni renglones vacíos en los bordes. */
export function renglones(texto: string, exacto = false): string[] {
  const crudos = texto.replace(/\r/g, '').split('\n').map((l) => l.trimEnd())
  return sinBordes(exacto ? crudos : crudos.map(suave))
}

/** Sin mayúsculas, sin tildes y sin espacios repetidos: así un niño no pierde por "Hola  ana". */
export function suave(s: string) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[ \t]+/g, ' ')
    .trim()
}

/**
 * Quita los comentarios para que las pruebas de código fuente no se dejen
 * engañar (ni se equivoquen) por lo que el alumno escribió después de un #.
 */
export function sinComentarios(codigo: string) {
  let fuera = ''
  let comilla: string | null = null
  for (let i = 0; i < codigo.length; i++) {
    const c = codigo[i]
    if (comilla) {
      fuera += c
      if (c === '\\') {
        fuera += codigo[++i] ?? ''
      } else if (codigo.startsWith(comilla, i)) {
        fuera += comilla.slice(1)
        i += comilla.length - 1
        comilla = null
      }
      continue
    }
    if (c === '#') {
      while (i < codigo.length && codigo[i] !== '\n') i++
      fuera += '\n'
      continue
    }
    if (c === '"' || c === "'") {
      comilla = codigo.startsWith(c.repeat(3), i) ? c.repeat(3) : c
      fuera += comilla
      i += comilla.length - 1
      continue
    }
    fuera += c
  }
  return fuera
}

/** Lo mismo para TypeScript: comentarios con // y con /* *\/, y textos con comillas o acentos graves. */
export function sinComentariosTS(codigo: string) {
  let fuera = ''
  let comilla: string | null = null
  for (let i = 0; i < codigo.length; i++) {
    const c = codigo[i]
    if (comilla) {
      fuera += c
      if (c === '\\') fuera += codigo[++i] ?? ''
      else if (c === comilla) comilla = null
      continue
    }
    if (codigo.startsWith('//', i)) {
      while (i < codigo.length && codigo[i] !== '\n') i++
      fuera += '\n'
      continue
    }
    if (codigo.startsWith('/*', i)) {
      const fin = codigo.indexOf('*/', i + 2)
      const tapado = codigo.slice(i, fin === -1 ? codigo.length : fin + 2)
      // Se dejan los saltos de línea, para que los renglones sigan en su sitio.
      fuera += tapado.replace(/[^\n]/g, '')
      i += tapado.length - 1
      continue
    }
    if (c === '"' || c === "'" || c === '`') comilla = c
    fuera += c
  }
  return fuera
}

function contar(pajar: string, aguja: string) {
  if (!aguja) return 0
  let n = 0
  let i = pajar.indexOf(aguja)
  while (i !== -1) {
    n++
    i = pajar.indexOf(aguja, i + aguja.length)
  }
  return n
}

/* ----------------------------------------------------------- calificar --- */

function llave(entradas: string[] | undefined) {
  return JSON.stringify(entradas ?? [])
}

export async function calificar(
  reto: Reto,
  codigo: string,
  correr: Correr,
  lenguaje: Lenguaje = 'python',
): Promise<Calificacion> {
  const base = reto.entradas ?? []
  const entradasDe = (p: Prueba) => ('entradas' in p && p.entradas ? p.entradas : base)

  // Una corrida por cada juego distinto de respuestas, con todas sus expresiones juntas.
  // Los pedazos de `rechaza` no dependen de las respuestas: van en la corrida principal.
  const grupos = new Map<string, { entradas: string[]; expresiones: string[]; revisar: string[] }>()
  grupos.set(llave(base), { entradas: base, expresiones: [], revisar: [] })
  for (const p of reto.pruebas) {
    if (p.t === 'src') continue
    if (p.t === 'rechaza') {
      const g = grupos.get(llave(base))!
      if (!g.revisar.includes(p.code)) g.revisar.push(p.code)
      continue
    }
    const e = entradasDe(p)
    const g = grupos.get(llave(e)) ?? { entradas: e, expresiones: [], revisar: [] }
    if (p.t === 'expr' && !g.expresiones.includes(p.code)) g.expresiones.push(p.code)
    grupos.set(llave(e), g)
  }

  const corridas = new Map<string, Resultado>()
  for (const [k, g] of grupos) {
    const pedido: Pedido = { codigo, entradas: g.entradas, expresiones: g.expresiones }
    if (g.revisar.length) pedido.revisar = g.revisar
    corridas.set(k, await correr(pedido))
  }

  const principal = corridas.get(llave(base))!
  const rota =
    [principal, ...corridas.values()].find((r) => r.error || r.tiempoAgotado) ?? null
  const fuente = lenguaje === 'typescript' ? sinComentariosTS(codigo) : sinComentarios(codigo)

  const resultados: ResultadoPrueba[] = reto.pruebas.map((p) => {
    if (p.t === 'src') {
      const veces = ((p.crudo ? codigo : fuente).match(new RegExp(p.re, (p.flags ?? '').replace('g', '') + 'g')) ?? []).length
      const hay = veces >= (p.min ?? 1)
      return { ok: p.not ? veces === 0 : hay, msg: p.msg }
    }

    const k = llave(entradasDe(p))
    const r = corridas.get(k)!
    if (r.error || r.tiempoAgotado) return { ok: false, msg: p.msg }

    if (p.t === 'rechaza') {
      const i = grupos.get(k)!.revisar.indexOf(p.code)
      return { ok: r.rechazos?.[i] === true, msg: p.msg }
    }

    if (p.t === 'expr') {
      const i = grupos.get(k)!.expresiones.indexOf(p.code)
      const v = r.valores[i]
      return { ok: Boolean(v && 'valor' in v && v.valor === p.igual), msg: p.msg }
    }

    const exacto = p.t === 'salida' && Boolean(p.exacto)
    const lineas = renglones(r.salida, exacto)
    const comparar = (s: string) => (exacto ? s : suave(s))

    if (p.t === 'linea') {
      const linea = lineas[p.n < 0 ? lineas.length + p.n : p.n]
      if (linea === undefined) return { ok: false, msg: p.msg }
      if (p.igual !== undefined && linea !== comparar(p.igual)) return { ok: false, msg: p.msg }
      if (p.contiene !== undefined && !linea.includes(comparar(p.contiene))) return { ok: false, msg: p.msg }
      return { ok: true, msg: p.msg }
    }

    const todo = lineas.join('\n')
    if (p.igual !== undefined && todo !== renglones(p.igual, exacto).join('\n')) return { ok: false, msg: p.msg }
    if (p.contiene !== undefined) {
      const veces = contar(todo, renglones(p.contiene, exacto).join('\n'))
      if (p.veces !== undefined ? veces !== p.veces : veces === 0) return { ok: false, msg: p.msg }
    }
    if (p.no !== undefined && todo.includes(comparar(p.no))) return { ok: false, msg: p.msg }
    return { ok: true, msg: p.msg }
  })

  return { ok: !rota && resultados.every((r) => r.ok), resultados, principal, rota }
}
