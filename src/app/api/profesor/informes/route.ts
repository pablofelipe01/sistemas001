import { NextResponse } from 'next/server'
import { supabaseAdmin, nubeActiva } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/*
 * Los informes del profesor (PDF y Word con nombres y notas de los alumnos).
 * Viven en el bucket PRIVADO "informes" de Supabase, nunca en el repo, que es
 * público. Aquí, con la clave del profesor, se listan y se da un enlace de
 * descarga que vence a los 10 minutos.
 */
const BUCKET = 'informes'
const VENCE_EN = 600

interface Informe {
  carpeta: string
  nombre: string
  tamano: number
  subido: string
  url: string
}

export async function POST(req: Request) {
  const esperada = process.env.PROFESOR_CLAVE
  if (!esperada) return NextResponse.json({ error: 'Falta configurar PROFESOR_CLAVE.' }, { status: 503 })
  let body: { clave?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  if (body.clave !== esperada) return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
  if (!nubeActiva()) return NextResponse.json({ error: 'Supabase no está configurado.' }, { status: 503 })

  const db = supabaseAdmin()!.storage.from(BUCKET)
  // Un nivel de carpetas (una por informe, con su fecha: 2026-11-20/…).
  const { data: carpetas, error } = await db.list('', { limit: 100, sortBy: { column: 'name', order: 'desc' } })
  if (error) return NextResponse.json({ error: `No se pudo leer los informes (${error.message}).` }, { status: 500 })

  const informes: Informe[] = []
  for (const c of carpetas ?? []) {
    if (c.id) continue // un archivo suelto en la raíz: no se usa
    const { data: archivos } = await db.list(c.name, { limit: 100, sortBy: { column: 'name', order: 'asc' } })
    for (const a of archivos ?? []) {
      if (!a.id || a.name.startsWith('.')) continue
      const ruta = `${c.name}/${a.name}`
      const { data: firmada } = await db.createSignedUrl(ruta, VENCE_EN, { download: a.name })
      if (!firmada) continue
      informes.push({
        carpeta: c.name,
        nombre: a.name,
        tamano: Number(a.metadata?.size ?? 0),
        subido: a.created_at ?? '',
        url: firmada.signedUrl,
      })
    }
  }
  return NextResponse.json({ informes })
}
