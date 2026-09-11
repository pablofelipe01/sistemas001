import { notFound } from 'next/navigation'
import { TallerProyecto } from '@/components/TallerProyecto'
import { PROYECTOS, proyectoPorId } from '@/lib/proyectos'

export function generateStaticParams() {
  return PROYECTOS.map((p) => ({ id: p.id }))
}

export default async function PaginaDelProyecto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const proyecto = proyectoPorId(id)
  if (!proyecto) notFound()
  return <TallerProyecto proyecto={proyecto} />
}
