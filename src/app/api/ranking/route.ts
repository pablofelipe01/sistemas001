import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/** Tabla de posiciones del salón. Solo datos públicos: nombre, puntos y avance. */
export async function GET() {
  const db = supabaseAdmin()
  if (!db) return NextResponse.json({ nube: false, ranking: [] })

  const { data, error } = await db
    .from('alumnos')
    .select('nombre, puntos, resueltos, mejor_racha')
    .order('puntos', { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ nube: false, ranking: [], error: error.message })
  return NextResponse.json({ nube: true, ranking: data ?? [] })
}
