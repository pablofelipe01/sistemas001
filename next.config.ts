import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Hay un package-lock.json en la carpeta personal del usuario, y sin esto
  // Next se confunde y toma esa carpeta como raíz del proyecto.
  outputFileTracingRoot: __dirname,
}

export default nextConfig
