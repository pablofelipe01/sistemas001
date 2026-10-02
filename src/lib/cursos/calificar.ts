import type { Prueba, Reto } from './tipos'

/* El mismo contrato que public/python/corredor.py. */

export interface ErrorPython {
  tipo: string
  mensaje: string
  linea: number | null
}

export type ValorExpr = { valor: string; salida: string } | { error: ErrorPython }

export interface PedidoPython {
  codigo: string
  entradas?: string[]
  expresiones?: string[]
  semilla?: number
}

export interface ResultadoPython {
  salida: string
  error: ErrorPython | null
  valores: ValorExpr[]
  /** El programa no terminó a tiempo: casi siempre un while que nunca para. */
  tiempoAgotado?: boolean
}

export type Correr = (p: PedidoPython) => Promise<ResultadoPython>

export interface ResultadoPrueba {
  ok: boolean
  msg: string
}

export interface Calificacion {
  ok: boolean
  resultados: ResultadoPrueba[]
  /** La corrida con las respuestas del reto: es la que se le muestra al alumno. */
  principal: ResultadoPython
  /** Si alguna corrida se rompió, esta es la que se le cuenta. */
  rota: ResultadoPython | null
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

export async function calificar(reto: Reto, codigo: string, correr: Correr): Promise<Calificacion> {
  const base = reto.entradas ?? []
  const entradasDe = (p: Prueba) => ('entradas' in p && p.entradas ? p.entradas : base)

  // Una corrida por cada juego distinto de respuestas, con todas sus expresiones juntas.
  const grupos = new Map<string, { entradas: string[]; expresiones: string[] }>()
  grupos.set(llave(base), { entradas: base, expresiones: [] })
  for (const p of reto.pruebas) {
    if (p.t === 'src') continue
    const e = entradasDe(p)
    const g = grupos.get(llave(e)) ?? { entradas: e, expresiones: [] }
    if (p.t === 'expr' && !g.expresiones.includes(p.code)) g.expresiones.push(p.code)
    grupos.set(llave(e), g)
  }

  const corridas = new Map<string, ResultadoPython>()
  for (const [k, g] of grupos) {
    corridas.set(k, await correr({ codigo, entradas: g.entradas, expresiones: g.expresiones }))
  }

  const principal = corridas.get(llave(base))!
  const rota =
    [principal, ...corridas.values()].find((r) => r.error || r.tiempoAgotado) ?? null
  const fuente = sinComentarios(codigo)

  const resultados: ResultadoPrueba[] = reto.pruebas.map((p) => {
    if (p.t === 'src') {
      const veces = ((p.crudo ? codigo : fuente).match(new RegExp(p.re, (p.flags ?? '').replace('g', '') + 'g')) ?? []).length
      const hay = veces >= (p.min ?? 1)
      return { ok: p.not ? veces === 0 : hay, msg: p.msg }
    }

    const k = llave(entradasDe(p))
    const r = corridas.get(k)!
    if (r.error || r.tiempoAgotado) return { ok: false, msg: p.msg }

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
