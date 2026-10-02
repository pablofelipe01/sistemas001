import { notFound } from 'next/navigation'
import { TallerCurso } from '@/components/cursos/TallerCurso'
import { CURSOS, cursoPorId, leccionPorId } from '@/lib/cursos'

export function generateStaticParams() {
  return CURSOS.flatMap((c) => c.lecciones.map((l) => ({ curso: c.id, leccion: l.id })))
}

export default async function PaginaDeLeccion({ params }: { params: Promise<{ curso: string; leccion: string }> }) {
  const { curso: idCurso, leccion: idLeccion } = await params
  const curso = cursoPorId(idCurso)
  const leccion = curso && leccionPorId(curso, idLeccion)
  if (!curso || !leccion) notFound()
  // key: al pasar de una lección a la siguiente, el taller arranca limpio.
  return <TallerCurso key={leccion.id} curso={curso} leccion={leccion} />
}
