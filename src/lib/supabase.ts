import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente de Supabase para el servidor.
 *
 * Se usa la service role key y SOLO desde rutas de API: el navegador nunca ve
 * una llave de Supabase. Por eso las tablas van con RLS activo y sin políticas
 * públicas — nadie puede tocarlas por fuera de estas rutas. Como los alumnos
 * entran solo con un nombre (sin contraseña), dejar escribir desde el navegador
 * sería dejar que cualquiera editara el progreso de cualquiera.
 */
export function supabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

/** ¿Está configurada la nube? Si no, la app funciona igual, guardando local. */
export function nubeActiva() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
}
