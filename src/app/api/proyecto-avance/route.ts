import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { proyectoPorId } from '@/lib/proyectos'

export const dynamic = 'force-dynamic'

/** Lee el avance guardado de un alumno en un proyecto guiado. */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const slug = params.get('slug')
  const proyecto = params.get('proyecto')
  if (!slug || !proyecto) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false, avance: null })

  const { data, error } = await db
    .from('proyectos')
    .select('hechas, teclas, pegados, codigo')
    .eq('slug', slug)
    .eq('proyecto', proyecto)
    .maybeSingle()
  if (error) return NextResponse.json({ nube: false, avance: null, error: error.message })

  return NextResponse.json({ nube: true, avance: data ?? null })
}

/** Guarda (o actualiza) el avance de un alumno en un proyecto guiado. */
export async function POST(req: Request) {
  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false })

  let b: {
    slug?: string
    nombre?: string
    proyecto?: string
    hechas?: string[]
    teclas?: number
    pegados?: number
    codigo?: Record<string, string>
  }
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  if (!b.slug || !b.nombre || !b.proyecto || !proyectoPorId(b.proyecto)) {
    return NextResponse.json({ error: 'Avance incompleto' }, { status: 400 })
  }

  const { error } = await db.from('proyectos').upsert(
    {
      slug: b.slug,
      proyecto: b.proyecto,
      nombre: b.nombre,
      hechas: Array.isArray(b.hechas) ? b.hechas : [],
      teclas: b.teclas ?? 0,
      pegados: b.pegados ?? 0,
      codigo: b.codigo ?? {},
      actualizado: new Date().toISOString(),
    },
    { onConflict: 'slug,proyecto' },
  )

  if (error) return NextResponse.json({ nube: false, error: error.message }, { status: 500 })
  return NextResponse.json({ nube: true, ok: true })
}
