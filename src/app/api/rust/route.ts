import { NextResponse } from 'next/server'
import type { Pedido, Resultado } from '@/lib/cursos/calificar'
import { correrRust, desdeElPlayground, type Ejecucion } from '@/lib/cursos/corredor-rust'

export const dynamic = 'force-dynamic'

/*
 * Compila y corre el Rust del curso en el Rust Playground oficial
 * (play.rust-lang.org). Va por el servidor y no desde el navegador para poder
 * guardar en caché lo repetido: si 25 niños corren el mismo ejemplo de la
 * explicación, se compila una sola vez. El Playground es un servicio gratuito
 * de la comunidad de Rust: hay que tratarlo con cariño.
 */

const PLAYGROUND = 'https://play.rust-lang.org/execute'

/* Límites para que nadie use esto como su compilador personal. */
const MAX_CODIGO = 20000
const MAX_PEDIDOS = 6
const MAX_EXPRESIONES = 30

/* Lo último que se corrió, por si se repite. La instancia se reutiliza entre pedidos. */
const CACHE_MAX = 300
const cache = new Map<string, Resultado[]>()

async function ejecutarEnElPlayground(programa: string): Promise<Ejecucion> {
  try {
    const r = await fetch(PLAYGROUND, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: 'stable', mode: 'debug', edition: '2024', crateType: 'bin', tests: false, code: programa, backtrace: false }),
      signal: AbortSignal.timeout(20000),
    })
    if (!r.ok && r.status !== 400) return { compilo: false, stdout: '', stderr: '', falla: `El Playground contestó ${r.status}` }
    return desdeElPlayground(await r.json())
  } catch (e) {
    const tiempo = e instanceof Error && e.name === 'TimeoutError'
    return { compilo: false, stdout: '', stderr: '', falla: tiempo ? 'timed out' : 'No se pudo hablar con el Playground' }
  }
}

export async function POST(req: Request) {
  let pedidos: Pedido[]
  try {
    const cuerpo = await req.json()
    pedidos = cuerpo?.pedidos
  } catch {
    return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 })
  }
  if (!Array.isArray(pedidos) || !pedidos.length || pedidos.length > MAX_PEDIDOS) {
    return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 })
  }
  const codigo = pedidos[0]?.codigo
  const valido =
    typeof codigo === 'string' &&
    codigo.length <= MAX_CODIGO &&
    pedidos.every(
      (p) =>
        p.codigo === codigo &&
        (p.entradas ?? []).every((x) => typeof x === 'string') &&
        (p.expresiones ?? []).every((x) => typeof x === 'string') &&
        (p.expresiones ?? []).length <= MAX_EXPRESIONES,
    )
  if (!valido) return NextResponse.json({ error: 'Pedido inválido' }, { status: 400 })

  const llave = JSON.stringify(pedidos.map((p) => [p.codigo, p.entradas ?? [], p.expresiones ?? []]))
  const guardado = cache.get(llave)
  if (guardado) return NextResponse.json({ resultados: guardado })

  const resultados = await correrRust(pedidos, ejecutarEnElPlayground)
  // Si falló el Playground (y no el programa), no se guarda: la próxima vez puede que sí conteste.
  const fallo = resultados.some((r) => r.error?.tipo === 'FalloInterno')
  if (!fallo) {
    if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value!)
    cache.set(llave, resultados)
  }
  return NextResponse.json({ resultados })
}
