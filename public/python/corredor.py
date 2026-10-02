# ----------------------------------------------------------------------------
#  El corredor del curso de Python.
#
#  Lo carga public/python/worker.js dentro de Pyodide. Recibe el código del
#  alumno, lo ejecuta aislado (cada vez con un ámbito limpio), le da las
#  respuestas para input() que vengan en el pedido y devuelve lo que imprimió,
#  el error si lo hubo y el valor de las expresiones que pida la revisión.
# ----------------------------------------------------------------------------

import builtins
import contextlib
import io
import json
import random

ARCHIVO = 'tu_codigo.py'

# Un print dentro de un while infinito llena la memoria en un segundo. Con este
# tope el programa se detiene antes y el alumno recibe una pista clara.
LIMITE_DE_TEXTO = 20000


class DemasiadoTexto(Exception):
    pass


class SinRespuestas(Exception):
    pass


class Salida(io.StringIO):
    def write(self, s):
        if self.tell() + len(s) > LIMITE_DE_TEXTO:
            raise DemasiadoTexto()
        return super().write(s)


def _linea_del_error(e):
    """La línea del código del alumno donde pasó el error (no la del corredor)."""
    if isinstance(e, SyntaxError) and e.filename == ARCHIVO:
        return e.lineno
    linea = None
    tb = e.__traceback__
    while tb is not None:
        if tb.tb_frame.f_code.co_filename == ARCHIVO:
            linea = tb.tb_lineno
        tb = tb.tb_next
    return linea


def _describir(e):
    mensaje = e.msg if isinstance(e, SyntaxError) else str(e)
    return {'tipo': type(e).__name__, 'mensaje': mensaje, 'linea': _linea_del_error(e)}


def correr(codigo, entradas, expresiones, semilla):
    salida = Salida()
    pendientes = list(entradas or [])

    def entrada_del_alumno(mensaje=''):
        # Se escribe la pregunta y la respuesta, como se vería en una terminal.
        salida.write(str(mensaje))
        if not pendientes:
            raise SinRespuestas()
        respuesta = pendientes.pop(0)
        salida.write(respuesta + '\n')
        return respuesta

    propias = dict(vars(builtins))
    propias['input'] = entrada_del_alumno
    ambito = {'__name__': '__main__', '__builtins__': propias}

    if semilla is None:
        random.seed()
    else:
        random.seed(semilla)

    error = None
    try:
        compilado = compile(codigo, ARCHIVO, 'exec')
        with contextlib.redirect_stdout(salida):
            exec(compilado, ambito)
    except SystemExit:
        pass
    except BaseException as e:  # noqa: BLE001 — cualquier cosa que rompa el programa se le cuenta al alumno
        error = _describir(e)

    texto = salida.getvalue()
    valores = []

    if error is None:
        # La revisión puede mirar lo que se imprimió desde una expresión.
        ambito['__salida__'] = texto
        for expresion in expresiones or []:
            aparte = io.StringIO()
            try:
                with contextlib.redirect_stdout(aparte):
                    valor = eval(expresion, ambito)
                valores.append({'valor': repr(valor), 'salida': aparte.getvalue()})
            except BaseException as e:  # noqa: BLE001
                valores.append({'error': _describir(e)})

    return {'salida': texto, 'error': error, 'valores': valores}


def correr_json(pedido_json):
    p = json.loads(pedido_json)
    r = correr(p.get('codigo', ''), p.get('entradas'), p.get('expresiones'), p.get('semilla'))
    return json.dumps(r, ensure_ascii=False)
