import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/** El profesor saca un juego de la galería (o lo vuelve a mostrar). No borra nada. */
export async function POST(req: Request) {
  const esperada = process.env.PROFESOR_CLAVE
  if (!esperada) return NextResponse.json({ error: 'Falta configurar PROFESOR_CLAVE.' }, { status: 503 })

  let b: { clave?: string; slug?: string; juego?: string; oculto?: boolean }
  try {
    b = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  if (b.clave !== esperada) return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
  if (!b.slug || !b.juego || typeof b.oculto !== 'boolean') {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ error: 'Supabase no está configurado.' }, { status: 503 })

  const { error } = await db.from('arena').update({ oculto: b.oculto }).eq('slug', b.slug).eq('juego', b.juego)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
