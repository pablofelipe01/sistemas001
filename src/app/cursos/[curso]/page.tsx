import { notFound } from 'next/navigation'
import { MapaDelCurso } from '@/components/cursos/MapaDelCurso'
import { CURSOS, cursoPorId } from '@/lib/cursos'

export function generateStaticParams() {
  return CURSOS.map((c) => ({ curso: c.id }))
}

export default async function PaginaDelCurso({ params }: { params: Promise<{ curso: string }> }) {
  const { curso: id } = await params
  const curso = cursoPorId(id)
  if (!curso) notFound()
  return <MapaDelCurso curso={curso} />
}
