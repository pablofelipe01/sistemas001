import Link from 'next/link'

const JUEGOS = [
  {
    href: '/juegos/triqui',
    emoji: '⭕',
    titulo: 'Triqui de código',
    texto: 'Tres en línea, pero cada ficha se gana contestando una pregunta rápida de código. 15 segundos, 3 opciones.',
    color: '#4ade80',
  },
  {
    href: '/juegos/parejas',
    emoji: '🃏',
    titulo: 'Parejas de código',
    texto: 'Encuentra la pareja: lo que se ve en la página con el código que lo hace. "¡Hola Mundo!" va con <h1>.',
    color: '#22d3ee',
  },
  {
    href: '/juegos/invasores',
    emoji: '👾',
    titulo: 'Invasores del código',
    texto: 'Defiende la base de los invasores. Tu láser se carga escribiendo 2 o 3 líneas de código.',
    color: '#f472b6',
  },
  {
    href: '/juegos/buscaminas',
    emoji: '💣',
    titulo: 'Buscaminas de código',
    texto: 'El de siempre: los números dicen cuántas minas hay cerca. Si pisas una, la desactivas contestando una pregunta.',
    color: '#fbbf24',
  },
]

export default function Juegos() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12">
      <header className="mb-8 text-center">
        <p className="etiqueta mb-2">Recreo</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          Hoy se <span className="text-[#fbbf24]">juega</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#9fb0d4]">
          Cuatro juegos para repasar HTML, CSS y JavaScript sin darse cuenta. Casi todos se pueden jugar contra la compu o
          contra un compañero en el mismo computador.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {JUEGOS.map((j) => (
          <li key={j.href}>
            <Link
              href={j.href}
              className="panel flex h-full flex-col p-6 transition hover:-translate-y-1 hover:border-[#2f4067] hover:bg-[#101a2e]"
            >
              <span className="mb-3 text-5xl">{j.emoji}</span>
              <h2 className="mb-2 text-lg font-bold" style={{ color: j.color }}>
                {j.titulo}
              </h2>
              <p className="flex-1 text-xs leading-relaxed text-[#8fa1c6]">{j.texto}</p>
              <p className="mt-4 text-xs font-bold text-[#e2e8ff]">Jugar ▶</p>
            </Link>
          </li>
        ))}
      </ul>

      <footer className="mt-10 text-center text-xs text-[#4b5b80]">
        <Link href="/" className="hover:text-[#7f8fb3]">
          ← Volver a la portada
        </Link>
      </footer>
    </main>
  )
}
