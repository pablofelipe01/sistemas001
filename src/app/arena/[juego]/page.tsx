import { notFound } from 'next/navigation'
import { TallerArena } from '@/components/arena/TallerArena'
import { JUEGOS_ARENA, LIBRE, juegoPorId } from '@/lib/arena'

export function generateStaticParams() {
  return [...JUEGOS_ARENA.map((j) => ({ juego: j.id })), { juego: LIBRE }]
}

export default async function PaginaDelJuego({ params }: { params: Promise<{ juego: string }> }) {
  const { juego } = await params
  if (juego === LIBRE) return <TallerArena juego={null} />
  const j = juegoPorId(juego)
  if (!j) notFound()
  return <TallerArena juego={j} />
}
