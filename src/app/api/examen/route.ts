import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { examenPorId } from '@/lib/examen'

export const dynamic = 'force-dynamic'

/** Lo que llega tarde por la red se recibe hasta este margen después del cierre. */
const GRACIA_MS = 60_000

const COLUMNAS = 'slug, examen, nombre, inicio, fin, terminado_por, respuestas, salidas, segundos_fuera, pegados, capturas, teclas, actualizado'

interface Cuerpo {
  accion?: 'empezar' | 'guardar' | 'terminar' | 'profesor' | 'reabrir'
  examen?: string
  slug?: string
  nombre?: string
  clave?: string
  respuestas?: Record<string, unknown>
  salidas?: number
  segundos_fuera?: number
  pegados?: number
  capturas?: number
  teclas?: number
}

const entero = (n: unknown) => (typeof n === 'number' && Number.isFinite(n) && n >= 0 ? Math.round(n) : 0)

/**
 * El examen tiene una sola oportunidad, y eso lo cuida el servidor, no el
 * navegador: aquí se anota cuándo empezó, se rechaza volver a empezar a quien
 * ya terminó y nada se recibe después de la hora de cierre.
 *
 * Si el alumno recarga la página o se le apaga el computador a mitad del
 * examen, vuelve a entrar con su nombre y sigue donde iba, con el mismo reloj.
 */
export async function POST(req: Request) {
  let b: Cuerpo
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const ahora = Date.now()
  const db = supabaseAdmin()

  if (b.accion === 'profesor' || b.accion === 'reabrir') {
    const esperada = process.env.PROFESOR_CLAVE
    if (!esperada || b.clave !== esperada) return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
    if (!db) return NextResponse.json({ nube: false, presentaciones: [] })
    if (b.accion === 'reabrir') {
      if (!b.slug || !b.examen) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
      const { error } = await db.from('examenes').delete().eq('slug', b.slug).eq('examen', b.examen)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true })
    }
    const { data, error } = await db.from('examenes').select(COLUMNAS).order('nombre')
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ nube: true, ahora: new Date(ahora).toISOString(), presentaciones: data ?? [] })
  }

  const examen = b.examen ? examenPorId(b.examen) : undefined
  if (!examen || !b.slug) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  const cierre = Date.parse(examen.cierre)

  if (!db) {
    // Sin nube no hay cómo cuidar la única oportunidad; el examen funciona igual, guardando en el navegador.
    return NextResponse.json({ nube: false, ahora: new Date(ahora).toISOString(), cerrado: ahora >= cierre })
  }

  const { data: fila, error: errorLeer } = await db
    .from('examenes')
    .select(COLUMNAS)
    .eq('slug', b.slug)
    .eq('examen', examen.id)
    .maybeSingle()
  if (errorLeer) return NextResponse.json({ error: errorLeer.message }, { status: 500 })

  const base = { nube: true, ahora: new Date(ahora).toISOString() }

  if (b.accion === 'empezar') {
    if (fila?.fin) return NextResponse.json({ ...base, yaTermino: true, presentacion: fila })
    if (ahora >= cierre) {
      if (fila) await db.from('examenes').update({ fin: examen.cierre, terminado_por: 'cierre' }).eq('slug', b.slug).eq('examen', examen.id)
      return NextResponse.json({ ...base, cerrado: true })
    }
    if (fila) return NextResponse.json({ ...base, presentacion: fila, retomado: true })
    const nombre = (b.nombre ?? '').trim().slice(0, 120)
    if (!nombre) return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 })
    const nueva = { slug: b.slug, examen: examen.id, nombre, inicio: new Date(ahora).toISOString() }
    const { data, error } = await db.from('examenes').insert(nueva).select(COLUMNAS).single()
    // Dos pestañas a la vez: la segunda encuentra el renglón que creó la primera.
    if (error) {
      const { data: otra } = await db.from('examenes').select(COLUMNAS).eq('slug', b.slug).eq('examen', examen.id).maybeSingle()
      if (otra) return NextResponse.json({ ...base, presentacion: otra, retomado: true })
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ ...base, presentacion: data })
  }

  if (b.accion === 'guardar' || b.accion === 'terminar') {
    if (!fila) return NextResponse.json({ error: 'No has empezado el examen' }, { status: 404 })
    if (fila.fin) return NextResponse.json({ ...base, yaTermino: true })

    const tarde = ahora > cierre + GRACIA_MS
    const cambios: Record<string, unknown> = { actualizado: new Date(ahora).toISOString() }
    if (!tarde) {
      if (b.respuestas && typeof b.respuestas === 'object') cambios.respuestas = b.respuestas
      cambios.salidas = entero(b.salidas)
      cambios.segundos_fuera = entero(b.segundos_fuera)
      cambios.pegados = entero(b.pegados)
      cambios.capturas = entero(b.capturas)
      cambios.teclas = entero(b.teclas)
    }
    if (b.accion === 'terminar' || ahora >= cierre) {
      const porCierre = ahora >= cierre
      cambios.fin = porCierre ? examen.cierre : new Date(ahora).toISOString()
      cambios.terminado_por = porCierre ? 'cierre' : 'alumno'
    }
    const { error } = await db.from('examenes').update(cambios).eq('slug', b.slug).eq('examen', examen.id).is('fin', null)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ...base, ok: true, terminado: Boolean(cambios.fin), tarde })
  }

  return NextResponse.json({ error: 'Acción desconocida' }, { status: 400 })
}
