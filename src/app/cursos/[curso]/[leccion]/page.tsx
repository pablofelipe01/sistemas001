import { notFound } from 'next/navigation'
import { PracticaCurso } from '@/components/cursos/PracticaCurso'
import { TallerCurso } from '@/components/cursos/TallerCurso'
import { CURSOS, cursoPorId, leccionPorId, practicaPorId } from '@/lib/cursos'

export function generateStaticParams() {
  return CURSOS.flatMap((c) => [
    ...c.lecciones.map((l) => ({ curso: c.id, leccion: l.id })),
    // Los exámenes de práctica viven en la misma dirección que las lecciones: /cursos/<curso>/practica-1.
    ...(c.practicas ?? []).map((p) => ({ curso: c.id, leccion: p.id })),
  ])
}

export default async function PaginaDeLeccion({ params }: { params: Promise<{ curso: string; leccion: string }> }) {
  const { curso: idCurso, leccion: idLeccion } = await params
  const curso = cursoPorId(idCurso)
  if (!curso) notFound()
  const practica = practicaPorId(curso, idLeccion)
  if (practica) return <PracticaCurso key={practica.id} curso={curso} practica={practica} />
  const leccion = leccionPorId(curso, idLeccion)
  if (!leccion) notFound()
  // key: al pasar de una lección a la siguiente, el taller arranca limpio.
  return <TallerCurso key={leccion.id} curso={curso} leccion={leccion} />
}
