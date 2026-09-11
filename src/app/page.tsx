'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listarLocales, olvidarLocal } from '@/lib/storage'
import { slugificar } from '@/lib/progress'
import { TOTAL } from '@/lib/challenges'

const REGLAS = [
  {
    emoji: '⌨️',
    titulo: 'Aquí se escribe',
    texto:
      'No puedes pegar código en la terminal, ni copiar el enunciado. Puedes preguntarle a quien quieras, incluso a una inteligencia artificial: pero la pregunta y la respuesta las escribes tú, letra por letra. Eso es lo que se te va a quedar.',
  },
  {
    emoji: '🔒',
    titulo: 'Una puerta a la vez',
    texto:
      'Solo pasas al siguiente reto cuando el actual queda bien de verdad. Tu código se ejecuta y se le corren pruebas: no basta con que se parezca a la respuesta, tiene que funcionar.',
  },
  {
    emoji: '🎁',
    titulo: 'Tres comodines por sección',
    texto:
      'Pista, media respuesta o saltar el reto. Tienes 3 en HTML, 3 en CSS y 3 en JavaScript. Gastarlos cuesta puntos, no vergüenza: para eso están.',
  },
]

export default function Entrada() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [guardados, setGuardados] = useState<{ slug: string; nombre: string; puntos: number }[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    setGuardados(listarLocales())
  }, [])

  function entrar(valor: string) {
    const limpio = valor.trim()
    if (limpio.length < 2) {
      setError('Escribe tu nombre completo, con al menos 2 letras.')
      return
    }
    if (!slugificar(limpio)) {
      setError('Ese nombre no tiene ninguna letra ni número. Prueba con otro.')
      return
    }
    localStorage.setItem('examen-web:activo', limpio)
    router.push('/examen')
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center gap-10 px-5 py-14">
      <header className="text-center">
        <p className="etiqueta mb-3">Guías 1 · 2 · 3 — Los tres lenguajes de la web</p>
        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          <span className="text-[#4ade80]">ARENA</span> <span className="text-[#7f8fb3]">DE</span>{' '}
          <span className="text-[#22d3ee]">CÓDIGO</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#9fb0d4]">
          {TOTAL} retos: {TOTAL / 3} de HTML, {TOTAL / 3} de CSS y {TOTAL / 3} de JavaScript. De lo más fácil a lo
          que hoy te parece imposible. Se resuelven en orden y solo se avanza acertando.
        </p>
      </header>

      <section className="panel p-6 sm:p-8">
        <label htmlFor="nombre" className="etiqueta mb-2 block">
          ¿Cómo te llamas?
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="nombre"
            value={nombre}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => {
              setNombre(e.target.value)
              setError('')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') entrar(nombre)
            }}
            placeholder="Tu nombre y tu apellido"
            className="flex-1 rounded-xl border border-[#1e2b45] bg-[#0a1120] px-4 py-3.5 text-base outline-none placeholder:text-[#3f5074] focus:border-[#4ade80]"
          />
          <button onClick={() => entrar(nombre)} className="boton boton-primario px-8 py-3.5 text-base">
            Empezar ▶
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-[#fb7185]">{error}</p> : null}
        <p className="mt-3 text-xs leading-relaxed text-[#7f8fb3]">
          Tu nombre es tu llave: con él se guarda tu progreso y con él vuelves a entrar donde te quedaste. Escríbelo
          siempre igual.
        </p>

        {guardados.length > 0 && (
          <div className="mt-7 border-t border-[#1e2b45] pt-5">
            <p className="etiqueta mb-3">Ya jugaron en este computador</p>
            <ul className="flex flex-wrap gap-2">
              {guardados.map((g) => (
                <li key={g.slug} className="group flex items-center overflow-hidden rounded-lg border border-[#1e2b45] bg-[#101a2e]">
                  <button
                    onClick={() => entrar(g.nombre)}
                    className="px-3 py-2 text-sm hover:bg-[#16233d]"
                    title={`Continuar como ${g.nombre}`}
                  >
                    {g.nombre} <span className="ml-1 text-[#fbbf24]">{g.puntos} pts</span>
                  </button>
                  <button
                    onClick={() => {
                      olvidarLocal(g.slug)
                      setGuardados(listarLocales())
                    }}
                    className="border-l border-[#1e2b45] px-2.5 py-2 text-xs text-[#5a6b8f] hover:bg-[#2a0f1c] hover:text-[#fb7185]"
                    title="Borrar de este computador"
                    aria-label={`Borrar el progreso local de ${g.nombre}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {REGLAS.map((r) => (
          <article key={r.titulo} className="panel p-5">
            <div className="mb-2 text-2xl">{r.emoji}</div>
            <h2 className="mb-1.5 text-sm font-bold text-[#e2e8ff]">{r.titulo}</h2>
            <p className="text-xs leading-relaxed text-[#8fa1c6]">{r.texto}</p>
          </article>
        ))}
      </section>

      <section className="panel flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="etiqueta mb-1">Antes o después del examen</p>
          <h2 className="text-sm font-bold text-[#e2e8ff]">🧩 Proyectos guiados</h2>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-[#8fa1c6]">
            Te damos un proyecto pequeño ya terminado: el HTML, el CSS, el JavaScript y el resultado funcionando. Lo
            vuelves a escribir tú en tu propia terminal y después le haces una lista de cambios. No se puede copiar
            nada. Van del más sencillo —una tarjeta con un botón— al que ya tiene piezas móviles, como una lista de
            tareas de verdad.
          </p>
        </div>
        <a href="/proyecto" className="boton boton-primario">
          Ver los proyectos ▶
        </a>
      </section>

      <footer className="text-center text-xs text-[#4b5b80]">
        <a href="/profesor" className="hover:text-[#7f8fb3]">
          Entrada del profesor
        </a>
      </footer>
    </main>
  )
}
