import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { Progreso } from '@/lib/progress'

export const dynamic = 'force-dynamic'

/** Lee el progreso guardado de un alumno. */
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'Falta el slug' }, { status: 400 })

  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false, progreso: null })

  const { data, error } = await db.from('alumnos').select('progreso').eq('slug', slug).maybeSingle()
  if (error) return NextResponse.json({ nube: false, progreso: null, error: error.message })

  return NextResponse.json({ nube: true, progreso: data?.progreso ?? null })
}

/** Guarda (o actualiza) el progreso completo de un alumno. */
export async function POST(req: Request) {
  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false })

  let p: Progreso
  try {
    p = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  if (!p?.slug || !p?.nombre) return NextResponse.json({ error: 'Progreso incompleto' }, { status: 400 })

  const resueltos = Object.values(p.retos ?? {}).filter((r) => r.resuelto).length

  const { error } = await db.from('alumnos').upsert(
    {
      slug: p.slug,
      nombre: p.nombre,
      puntos: p.puntos ?? 0,
      indice: p.indice ?? 0,
      resueltos,
      mejor_racha: p.mejorRacha ?? 0,
      progreso: p,
      inicio: p.inicio,
      actualizado: new Date().toISOString(),
    },
    { onConflict: 'slug' },
  )

  if (error) return NextResponse.json({ nube: false, error: error.message }, { status: 500 })
  return NextResponse.json({ nube: true, ok: true })
}
