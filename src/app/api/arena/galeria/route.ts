import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { juegoValido, nombreCorto } from '@/lib/arena'

export const dynamic = 'force-dynamic'

/**
 * La galería del salón: los juegos publicados que el profesor no ha ocultado.
 * Es pública, así que del autor solo sale el nombre corto ("Emily O.").
 */
export async function GET() {
  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false, juegos: [] })

  const { data, error } = await db
    .from('arena')
    .select('slug, juego, nombre, titulo, codigo_publicado, publicado_en, jugadas')
    .not('codigo_publicado', 'is', null)
    .eq('oculto', false)
    .order('publicado_en', { ascending: false })
    .limit(200)
  if (error) return NextResponse.json({ nube: false, juegos: [], error: error.message })

  return NextResponse.json({
    nube: true,
    juegos: (data ?? []).map((j) => ({
      slug: j.slug,
      juego: j.juego,
      autor: nombreCorto(j.nombre),
      titulo: j.titulo,
      codigo: j.codigo_publicado,
      publicado_en: j.publicado_en,
      jugadas: j.jugadas,
    })),
  })
}

/** Alguien abrió un juego de la galería: una jugada más. */
export async function POST(req: Request) {
  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false })

  let b: { slug?: string; juego?: string }
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  if (!b.slug || !b.juego || !juegoValido(b.juego)) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })

  const { data } = await db.from('arena').select('jugadas').eq('slug', b.slug).eq('juego', b.juego).maybeSingle()
  if (!data) return NextResponse.json({ error: 'No existe' }, { status: 404 })
  await db
    .from('arena')
    .update({ jugadas: (data.jugadas ?? 0) + 1 })
    .eq('slug', b.slug)
    .eq('juego', b.juego)
  return NextResponse.json({ ok: true })
}
