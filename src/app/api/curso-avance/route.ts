import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cursoPorId } from '@/lib/cursos'

export const dynamic = 'force-dynamic'

/** Lee el avance guardado de un alumno en un curso. */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const slug = params.get('slug')
  const curso = params.get('curso')
  if (!slug || !curso) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false, avance: null })

  const { data, error } = await db
    .from('cursos')
    .select('hechos, intentos, pistas, teclas, pegados, codigo')
    .eq('slug', slug)
    .eq('curso', curso)
    .maybeSingle()
  if (error) return NextResponse.json({ nube: false, avance: null, error: error.message })

  return NextResponse.json({ nube: true, avance: data ?? null })
}

/** Guarda (o actualiza) el avance de un alumno en un curso. */
export async function POST(req: Request) {
  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false })

  let b: {
    slug?: string
    nombre?: string
    curso?: string
    hechos?: string[]
    intentos?: Record<string, number>
    pistas?: string[]
    teclas?: number
    pegados?: number
    codigo?: Record<string, string>
  }
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  if (!b.slug || !b.nombre || !b.curso || !cursoPorId(b.curso)) {
    return NextResponse.json({ error: 'Avance incompleto' }, { status: 400 })
  }

  const { error } = await db.from('cursos').upsert(
    {
      slug: b.slug,
      curso: b.curso,
      nombre: b.nombre,
      hechos: Array.isArray(b.hechos) ? b.hechos : [],
      intentos: b.intentos ?? {},
      pistas: Array.isArray(b.pistas) ? b.pistas : [],
      teclas: b.teclas ?? 0,
      pegados: b.pegados ?? 0,
      codigo: b.codigo ?? {},
      actualizado: new Date().toISOString(),
    },
    { onConflict: 'slug,curso' },
  )

  if (error) return NextResponse.json({ nube: false, error: error.message }, { status: 500 })
  return NextResponse.json({ nube: true, ok: true })
}
