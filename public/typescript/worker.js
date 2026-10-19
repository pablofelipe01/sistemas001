/*
 * El TypeScript del curso, corriendo en un Web Worker.
 *
 * Igual que el de Python: va aparte de la página para que un `while (true)`
 * cuelgue este hilo y no la pestaña. La página le da unos segundos y, si no
 * contesta, lo apaga y levanta uno nuevo.
 *
 * Trae del CDN el compilador de verdad (unos 1,5 MB comprimido), sus mensajes
 * en español y los lib.*.d.ts, que son los tipos de JavaScript. La primera vez
 * tarda; después el navegador lo guarda en su caché. La versión es la misma
 * que la de package.json, para que la llave de respuestas se pruebe en Node
 * con el mismo compilador.
 */
import { crearCorredor, leerLibs } from './corredor.js'

const CDN = 'https://cdn.jsdelivr.net/npm/typescript@5.9.3/lib/'

async function texto(archivo) {
  const r = await fetch(CDN + archivo)
  if (!r.ok) throw new Error(`No se pudo traer ${archivo} (${r.status})`)
  return r.text()
}

const listo = (async () => {
  const [fuente, mensajes, libs] = await Promise.all([texto('typescript.js'), texto('es/diagnosticMessages.generated.json'), leerLibs(texto)])
  // typescript.js no es un módulo: deja todo en una variable ts.
  const ts = new Function(fuente.replace(/\/\/# sourceMappingURL=.*$/m, '') + '\nreturn ts')()
  ts.setLocalizedDiagnosticMessages(JSON.parse(mensajes))
  const corredor = crearCorredor(ts, libs)
  // La primera revisión es la más lenta: mejor que pase antes de que el alumno corra algo.
  corredor.correr({ codigo: 'const listo: boolean = true' })
  return corredor
})()

listo.then(
  () => postMessage({ tipo: 'listo' }),
  (e) => postMessage({ tipo: 'fallo-carga', mensaje: String(e) }),
)

onmessage = async (e) => {
  const { id, pedido } = e.data
  try {
    const corredor = await listo
    postMessage({ tipo: 'resultado', id, resultado: corredor.correr(pedido) })
  } catch (err) {
    postMessage({ tipo: 'resultado', id, resultado: { salida: '', valores: [], error: { tipo: 'FalloInterno', mensaje: String(err), linea: null } } })
  }
}
