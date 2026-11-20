import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { juegoPorId, juegoValido } from '@/lib/arena'

export const dynamic = 'force-dynamic'

const MAXIMO_CODIGO = 60_000

/**
 * Publica (o vuelve a publicar) un juego en la galería del salón. Se guarda una
 * copia aparte (codigo_publicado): lo que el alumno siga cambiando después no
 * rompe lo que los compañeros están jugando, hasta que lo publique otra vez.
 *
 * Un juego guiado solo se publica cuando todas sus partes están hechas.
 */
export async function POST(req: Request) {
  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false, error: 'La galería necesita la nube, y no está configurada.' }, { status: 503 })

  let b: { slug?: string; nombre?: string; juego?: string; titulo?: string; codigo?: string; hechas?: string[] }
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const titulo = (b.titulo ?? '').replace(/\s+/g, ' ').trim().slice(0, 40)
  if (!b.slug || !b.nombre || !b.juego || !juegoValido(b.juego) || typeof b.codigo !== 'string') {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }
  if (!titulo) return NextResponse.json({ error: 'Ponle un nombre a tu juego.' }, { status: 400 })
  if (b.codigo.trim().length < 40) return NextResponse.json({ error: 'Tu juego está vacío.' }, { status: 400 })
  if (b.codigo.length > MAXIMO_CODIGO) return NextResponse.json({ error: 'El juego es demasiado largo' }, { status: 413 })

  const guiado = juegoPorId(b.juego)
  if (guiado) {
    const hechas = new Set(Array.isArray(b.hechas) ? b.hechas : [])
    if (!guiado.partes.every((p) => hechas.has(p.id))) {
      return NextResponse.json({ error: 'Primero termina todas las partes.' }, { status: 400 })
    }
  }

  const ahora = new Date().toISOString()
  const { error } = await db.from('arena').upsert(
    {
      slug: b.slug,
      juego: b.juego,
      nombre: b.nombre,
      codigo: b.codigo,
      ...(guiado && { hechas: guiado.partes.map((p) => p.id) }),
      titulo,
      codigo_publicado: b.codigo,
      publicado_en: ahora,
      actualizado: ahora,
    },
    { onConflict: 'slug,juego' },
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await db.from('eventos').insert({ slug: b.slug, reto: `arena:${b.juego}`, tipo: 'publicado', detalle: titulo })
  return NextResponse.json({ ok: true, publicado_en: ahora })
}
