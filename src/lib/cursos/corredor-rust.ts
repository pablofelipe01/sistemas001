import type { ErrorDelPrograma, Pedido, Resultado, ValorExpr } from './calificar'

/*
 * El corredor del curso de Rust.
 *
 * En el navegador no hay compilador de Rust, así que el código se compila en el
 * Rust Playground oficial (lo llama /api/rust desde el servidor). Este archivo
 * no hace la llamada: arma el programa que se manda y lee lo que vuelve. Por eso
 * no importa nada en tiempo de ejecución y se puede probar desde Node con el
 * rustc del computador.
 *
 * Para que un "Comprobar" sea una sola compilación (cada una tarda un par de
 * segundos), el programa del alumno se envuelve: su `fn main` pasa a llamarse
 * `main_del_alumno`, y abajo se agrega un `main` nuestro que lo corre una vez
 * por cada pedido, con sus respuestas para `preguntar`, y después evalúa las
 * expresiones de la revisión. Todo se agrega al final, para que los números de
 * línea de los errores sigan siendo los del alumno.
 *
 * Lo que imprime el envoltorio va marcado con \u{1}, que nunca sale en un
 * programa normal: así se separa de lo que imprime el alumno.
 */

/** Un programa que no termina en este tiempo se apaga desde adentro. */
const PACIENCIA_MS = 3000

export interface Ejecucion {
  /** El compilador aceptó el programa (aunque después haya hecho panic). */
  compilo: boolean
  stdout: string
  stderr: string
  /** El Playground no pudo correrlo: se pasó de tiempo, de texto o falló él. */
  falla?: string
}

const MARCA = '\u0001'

function textoRust(s: string) {
  return '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
}

export function lineasDe(codigo: string) {
  return codigo.split('\n').length
}

/** El programa que se compila: el del alumno, más el envoltorio. */
export function armarPrograma(codigo: string, pedidos: Pedido[]): string {
  const propio = codigo.replace(/\bfn\s+main\s*\(/, 'fn main_del_alumno(')
  const corridas = pedidos
    .map((p, k) => {
      const respuestas = (p.entradas ?? []).map((r) => `String::from(${textoRust(String(r))})`).join(', ')
      const expresiones = (p.expresiones ?? [])
        .map(
          (e, i) =>
            `        print!("${MARCA}EXPR ${i}\\n");\n        let _ = std::panic::catch_unwind(|| println!("{:?}", ${e}));`,
        )
        .join('\n')
      return `    __arena::empezar(${k}, vec![${respuestas}]);
    if std::panic::catch_unwind(|| main_del_alumno()).is_ok() {
${expresiones}
    }`
    })
    .join('\n')

  return `${propio}


// ------------------------------------------------- lo que pone la arena ---

/// Lo que pregunta el programa. Las respuestas salen de las cajitas de la página.
#[allow(dead_code)]
fn preguntar(pregunta: &str) -> String {
    __arena::preguntar(pregunta)
}

#[allow(dead_code)]
mod __arena {
    use std::cell::RefCell;
    use std::io::Write;

    thread_local! {
        static RESPUESTAS: RefCell<Vec<String>> = RefCell::new(Vec::new());
    }

    pub fn empezar(k: usize, respuestas: Vec<String>) {
        RESPUESTAS.with(|r| *r.borrow_mut() = respuestas);
        print!("${MARCA}CORRIDA {}\\n", k);
    }

    pub fn preguntar(pregunta: &str) -> String {
        print!("{}", pregunta);
        let _ = std::io::stdout().flush();
        let siguiente = RESPUESTAS.with(|r| {
            let mut r = r.borrow_mut();
            if r.is_empty() { None } else { Some(r.remove(0)) }
        });
        match siguiente {
            Some(respuesta) => {
                println!("{}", respuesta);
                respuesta
            }
            None => panic!("${MARCA}SIN_RESPUESTAS"),
        }
    }
}

fn main() {
    std::thread::spawn(|| {
        std::thread::sleep(std::time::Duration::from_millis(${PACIENCIA_MS}));
        print!("${MARCA}TIEMPO\\n");
        std::process::exit(0);
    });
    std::panic::set_hook(Box::new(|info| {
        let linea = info.location().map(|l| l.line()).unwrap_or(0);
        let mensaje = if let Some(s) = info.payload().downcast_ref::<&str>() {
            s.to_string()
        } else if let Some(s) = info.payload().downcast_ref::<String>() {
            s.clone()
        } else {
            String::new()
        };
        print!("${MARCA}PANIC {}\\u{2}{}\\n", linea, mensaje.replace('${MARCA}', "").replace('\\n', " "));
    }));
${corridas}
    print!("${MARCA}FIN\\n");
}
`
}

/* ---------------------------------------------------------- leer lo que vuelve --- */

/** El primer error de compilación: el código (E0384), lo que dice, la línea y cuántos hubo. */
export function leerErrorDeCompilacion(stderr: string, lineasDelAlumno: number): ErrorDelPrograma {
  const renglones = stderr.replace(/\r/g, '').split('\n')
  const i = renglones.findIndex((l) => /^error(\[E\d+\])?: /.test(l) && !/^error: (aborting|could not compile)/.test(l))
  if (i === -1) return { tipo: 'ErrorDeCompilacion', mensaje: stderr.trim().split('\n').slice(-3).join('\n'), linea: null }

  const [, codigo, titulo] = renglones[i].match(/^error(?:\[(E\d+)\])?: (.*)$/)!
  // El bloque del error llega hasta el siguiente renglón vacío: ahí están "expected i32, found f64" y la ayuda.
  const bloque: string[] = [titulo]
  let linea: number | null = null
  for (let j = i + 1; j < renglones.length && renglones[j].trim() !== ''; j++) {
    const donde = renglones[j].match(/-->\s*src\/main\.rs:(\d+):\d+/)
    if (donde && linea === null) linea = Number(donde[1])
    else bloque.push(renglones[j])
  }
  // Si el error cae en lo que puso la arena (una expresión de la revisión), no se le muestra esa línea al alumno.
  if (linea !== null && linea > lineasDelAlumno) linea = null

  // Se cuentan solo los errores en el código del alumno: los de las expresiones de la revisión no son suyos.
  let cuantos = 0
  renglones.forEach((l, k) => {
    if (!/^error(\[E\d+\])?: /.test(l) || /^error: (aborting|could not compile)/.test(l)) return
    const donde = renglones.slice(k + 1, k + 4).join('\n').match(/-->\s*src\/main\.rs:(\d+):/)
    if (!donde || Number(donde[1]) <= lineasDelAlumno) cuantos++
  })
  cuantos = Math.max(cuantos, 1)
  return { tipo: codigo ?? 'ErrorDeCompilacion', mensaje: bloque.join('\n'), linea, cuantos }
}

function errorDePanic(cuerpo: string): ErrorDelPrograma {
  const [linea, mensaje = ''] = cuerpo.split('\u0002')
  if (mensaje.includes('SIN_RESPUESTAS')) return { tipo: 'SinRespuestas', mensaje: '', linea: null }
  return { tipo: 'Panic', mensaje: mensaje.trim(), linea: Number(linea) || null }
}

/**
 * Parte la salida en lo de cada pedido. Si el programa se pasó de tiempo, ese
 * pedido y los que siguen quedan con tiempoAgotado.
 */
export function leerResultados(e: Ejecucion, pedidos: Pedido[], lineasDelAlumno: number): Resultado[] {
  const vacio = (extra: Partial<Resultado>): Resultado => ({ salida: '', error: null, valores: [], ...extra })

  if (e.falla) {
    if (/bytes of output/.test(e.falla)) {
      return pedidos.map(() => vacio({ error: { tipo: 'DemasiadoTexto', mensaje: '', linea: null } }))
    }
    if (/time|timed out|tiempo/i.test(e.falla)) return pedidos.map(() => vacio({ tiempoAgotado: true }))
    return pedidos.map(() => vacio({ error: { tipo: 'FalloInterno', mensaje: e.falla!, linea: null } }))
  }
  if (!e.compilo) {
    const error = leerErrorDeCompilacion(e.stderr, lineasDelAlumno)
    return pedidos.map(() => vacio({ error }))
  }

  const resultados = pedidos.map(() => vacio({ tiempoAgotado: true }))
  // Cada pedazo empieza con su marca: "CORRIDA 0\n…", "EXPR 1\n…", "PANIC 4\u{2}mensaje", "TIEMPO\n".
  const pedazos = e.stdout.split(MARCA).slice(1)
  let actual: Resultado | null = null
  let expr: number | null = null
  for (const pedazo of pedazos) {
    const salto = pedazo.indexOf('\n')
    const cabeza = salto === -1 ? pedazo : pedazo.slice(0, salto)
    const resto = salto === -1 ? '' : pedazo.slice(salto + 1)

    if (cabeza.startsWith('CORRIDA ')) {
      actual = vacio({})
      resultados[Number(cabeza.slice(8))] = actual
      actual.salida = resto
      expr = null
    } else if (cabeza.startsWith('EXPR ') && actual) {
      expr = Number(cabeza.slice(5))
      // println!("{:?}") deja el valor y un salto de línea.
      actual.valores[expr] = { valor: resto.replace(/\n$/, ''), salida: '' } satisfies ValorExpr
    } else if (cabeza.startsWith('PANIC ') && actual) {
      const error = errorDePanic(cabeza.slice(6))
      if (expr === null) actual.error = error
      else actual.valores[expr] = { error }
    } else if (cabeza === 'TIEMPO') {
      if (actual) {
        actual.tiempoAgotado = true
        actual.error = null
      }
      break
    } else if (cabeza === 'FIN') {
      break
    } else if (actual && expr === null) {
      actual.salida += pedazo
    }
  }
  return resultados
}

/* ------------------------------------------------------------- todo junto --- */

/**
 * Corre varios pedidos del mismo código en una sola compilación. `ejecutar`
 * compila y corre el programa: en el servidor es el Playground; en las pruebas
 * de Node, el rustc del computador.
 */
export async function correrRust(pedidos: Pedido[], ejecutar: (programa: string) => Promise<Ejecucion>): Promise<Resultado[]> {
  if (!pedidos.length) return []
  const codigo = pedidos[0].codigo ?? ''
  const e = await ejecutar(armarPrograma(codigo, pedidos))
  return leerResultados(e, pedidos, lineasDe(codigo))
}

/** Lo que contesta POST https://play.rust-lang.org/execute, en nuestras palabras. */
export function desdeElPlayground(r: { success?: boolean | null; stdout?: string | null; stderr?: string | null; error?: string }): Ejecucion {
  if (r.error) return { compilo: false, stdout: '', stderr: '', falla: r.error }
  const stderr = r.stderr ?? ''
  return { compilo: !/^error(\[E\d+\])?: /m.test(stderr), stdout: r.stdout ?? '', stderr }
}
