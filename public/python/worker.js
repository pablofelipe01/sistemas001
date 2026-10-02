/*
 * El Python del curso, corriendo en un Web Worker.
 *
 * Va aparte de la página a propósito: si un alumno escribe un `while True` que
 * nunca termina, el que se cuelga es este hilo y no la pestaña. La página le da
 * unos segundos y, si no contesta, lo apaga y levanta uno nuevo.
 *
 * Pyodide pesa unos megas: la primera vez tarda, después el navegador lo
 * guarda en su caché.
 *
 * Es un worker de tipo módulo: con importScripts, Chrome no deja traer
 * pyodide.js desde el CDN (NetworkError), y con import sí.
 */
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs'

const listo = (async () => {
  const pyodide = await loadPyodide()
  const fuente = await (await fetch('/python/corredor.py')).text()
  pyodide.runPython(fuente)
  return pyodide.globals.get('correr_json')
})()

listo.then(
  () => postMessage({ tipo: 'listo' }),
  (e) => postMessage({ tipo: 'fallo-carga', mensaje: String(e) }),
)

onmessage = async (e) => {
  const { id, pedido } = e.data
  try {
    const correr = await listo
    const crudo = correr(JSON.stringify(pedido))
    postMessage({ tipo: 'resultado', id, resultado: JSON.parse(crudo) })
  } catch (err) {
    postMessage({ tipo: 'resultado', id, resultado: { salida: '', valores: [], error: { tipo: 'FalloInterno', mensaje: String(err), linea: null } } })
  }
}
