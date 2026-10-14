import Link from 'next/link'
import type { Curso } from '@/lib/cursos/tipos'

/** Lo que ve quien entra a un curso sin haber terminado el que va antes. */
export function CursoCerrado({ curso, previo }: { curso: Curso; previo: Curso }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 text-center">
      <p className="mb-3 text-4xl">🔒</p>
      <h1 className="mb-2 text-xl font-black">
        {curso.emoji} {curso.titulo} todavía está cerrado
      </h1>
      <p className="mb-6 text-sm text-[#9fb0d4]">
        Se abre cuando termines {previo.emoji} {previo.titulo}. Todo lo de aquí se arma sobre lo que aprendes allá.
      </p>
      <Link href={`/cursos/${previo.id}`} className="boton boton-primario">
        Ir a {previo.titulo} →
      </Link>
    </main>
  )
}
