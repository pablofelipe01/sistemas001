import { NextResponse } from 'next/server'
import { supabaseAdmin, nubeActiva } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

/**
 * Panel del profesor. La clave vive solo en el servidor (PROFESOR_CLAVE) y se
 * compara aquí; nunca se manda al navegador.
 */
export async function POST(req: Request) {
  const esperada = process.env.PROFESOR_CLAVE
  if (!esperada) {
    return NextResponse.json(
      { error: 'Falta configurar PROFESOR_CLAVE en las variables de entorno.' },
      { status: 503 },
    )
  }

  let body: { clave?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  if (body.clave !== esperada) {
    return NextResponse.json({ error: 'Clave incorrecta' }, { status: 401 })
  }

  if (!nubeActiva()) {
    return NextResponse.json({
      nube: false,
      error: 'Supabase no está configurado, así que no hay nada guardado en la nube.',
      alumnos: [],
      eventos: [],
    })
  }

  const db = supabaseAdmin()!

  const [alumnos, eventos] = await Promise.all([
    db.from('alumnos').select('*').order('puntos', { ascending: false }),
    db.from('eventos').select('*').order('creado', { ascending: false }).limit(200),
  ])

  if (alumnos.error) {
    return NextResponse.json({ error: alumnos.error.message }, { status: 500 })
  }

  return NextResponse.json({
    nube: true,
    alumnos: alumnos.data ?? [],
    eventos: eventos.data ?? [],
  })
}
