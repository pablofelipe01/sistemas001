import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Arena de Código — HTML, CSS y JavaScript',
  description: '75 retos de programación web. Se escribe. No se pega.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-full antialiased">{children}</body>
    </html>
  )
}
