import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { juegoValido } from '@/lib/arena'

export const dynamic = 'force-dynamic'

/** Un juego no debería pasar de esto; más es casi seguro algo raro. */
const MAXIMO_CODIGO = 60_000

/** Lee el avance de un alumno en un juego de la arena. */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams
  const slug = params.get('slug')
  const juego = params.get('juego')
  if (!slug || !juego) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false, avance: null })

  const { data, error } = await db
    .from('arena')
    .select('hechas, teclas, pegados, codigo, titulo, publicado_en')
    .eq('slug', slug)
    .eq('juego', juego)
    .maybeSingle()
  if (error) return NextResponse.json({ nube: false, avance: null, error: error.message })

  return NextResponse.json({ nube: true, avance: data ?? null })
}

/** Guarda (o actualiza) el avance. No toca lo publicado: eso lo hace /api/arena/publicar. */
export async function POST(req: Request) {
  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false })

  let b: { slug?: string; nombre?: string; juego?: string; hechas?: string[]; teclas?: number; pegados?: number; codigo?: string }
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  if (!b.slug || !b.nombre || !b.juego || !juegoValido(b.juego) || typeof b.codigo !== 'string') {
    return NextResponse.json({ error: 'Avance incompleto' }, { status: 400 })
  }
  if (b.codigo.length > MAXIMO_CODIGO) return NextResponse.json({ error: 'El juego es demasiado largo' }, { status: 413 })

  const { error } = await db.from('arena').upsert(
    {
      slug: b.slug,
      juego: b.juego,
      nombre: b.nombre,
      hechas: Array.isArray(b.hechas) ? b.hechas.slice(0, 50) : [],
      teclas: Math.max(0, Number(b.teclas) || 0),
      pegados: Math.max(0, Number(b.pegados) || 0),
      codigo: b.codigo,
      actualizado: new Date().toISOString(),
    },
    { onConflict: 'slug,juego' },
  )

  if (error) return NextResponse.json({ nube: false, error: error.message }, { status: 500 })
  return NextResponse.json({ nube: true, ok: true })
}
