'use client'

import { useEffect, useState, type ReactNode } from 'react'

const EVENTO = 'plegables:todos'

/** Pliega (false) o despliega (true) todas las secciones plegables de la página. */
export function plegarTodas(abiertas: boolean) {
  window.dispatchEvent(new CustomEvent<boolean>(EVENTO, { detail: abiertas }))
}

/**
 * Una sección del panel del profesor que se puede plegar y desplegar con un
 * clic en su título, para no tener que bajar por toda la página. Se acuerda de
 * cómo la dejó el profe (en este navegador).
 */
export function Plegable({
  id,
  titulo,
  resumen,
  children,
}: {
  id: string
  titulo: ReactNode
  /** Lo que se ve al lado del título, también con la sección plegada (p. ej. "· 12 alumnos"). */
  resumen?: ReactNode
  children: ReactNode
}) {
  const llave = `profesor:plegado:${id}`
  const [abierta, setAbierta] = useState(true)

  useEffect(() => {
    try {
      if (localStorage.getItem(llave) === '1') setAbierta(false)
    } catch {
      /* sin almacenamiento: arranca desplegada */
    }
  }, [llave])

  function cambiar(v: boolean) {
    setAbierta(v)
    try {
      if (v) localStorage.removeItem(llave)
      else localStorage.setItem(llave, '1')
    } catch {
      /* ídem */
    }
  }

  useEffect(() => {
    const alPedir = (e: Event) => cambiar((e as CustomEvent<boolean>).detail)
    window.addEventListener(EVENTO, alPedir)
    return () => window.removeEventListener(EVENTO, alPedir)
    // cambiar solo depende de la llave
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [llave])

  return (
    <section className="panel mb-6">
      <button
        onClick={() => cambiar(!abierta)}
        aria-expanded={abierta}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-[#101a2e]"
      >
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#1e2b45] text-[10px] text-[#7f8fb3] transition-transform ${
            abierta ? 'rotate-90' : ''
          }`}
        >
          ▶
        </span>
        <h2 className="text-sm font-bold text-[#e2e8ff]">{titulo}</h2>
        {resumen && <span className="text-sm font-normal text-[#7f8fb3]">{resumen}</span>}
        <span className="ml-auto text-[11px] text-[#5a6b8f]">{abierta ? 'Plegar' : 'Desplegar'}</span>
      </button>
      {abierta && <div className="border-t border-[#1e2b45] p-5">{children}</div>}
    </section>
  )
}
