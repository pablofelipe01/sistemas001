import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const TIPOS = new Set(['pegado-bloqueado', 'copia-bloqueada', 'ayuda', 'salto', 'resuelto', 'fallo', 'mision'])

/**
 * Registra un hecho suelto que al profesor le sirve ver: un intento de pegar,
 * una ayuda gastada, un reto saltado. Es la señal de "aquí pasó algo".
 */
export async function POST(req: Request) {
  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false })

  let body: { slug?: string; reto?: string; tipo?: string; detalle?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  if (!body.slug || !body.tipo || !TIPOS.has(body.tipo)) {
    return NextResponse.json({ error: 'Evento inválido' }, { status: 400 })
  }

  await db.from('eventos').insert({
    slug: body.slug,
    reto: body.reto ?? null,
    tipo: body.tipo,
    detalle: (body.detalle ?? '').slice(0, 300),
  })

  return NextResponse.json({ ok: true })
}
