import type { Curso, Leccion } from './tipos'

/*
 * El curso de Rust: 10 lecciones de 5 retos, para unas 4 horas de clase. Es
 * una introducción muy básica, abierta para todos: los niños ya saben
 * JavaScript de la arena, así que cada lección pone lado a lado lo que ya
 * conocen y lo nuevo.
 *
 * Rust no corre en el navegador: el código se compila en el Rust Playground
 * oficial (ver corredor-rust.ts y /api/rust), así que cada corrida tarda un
 * par de segundos. Las pruebas `expr` son expresiones de Rust que se imprimen
 * con {:?}: un texto sale con comillas ("hola") y un f64 redondo con su punto
 * (12.0).
 *
 * Para preguntar, la arena le da al alumno `preguntar("…")`, que devuelve un
 * String: en el Playground no hay teclado.
 *
 * Ojo al escribir textos: ConCodigo usa las comillas invertidas para marcar
 * código, así que en las explicaciones, enunciados y pistas no pueden ir
 * comillas invertidas sueltas.
 *
 * Cada reto tiene su solución de referencia. /verificar-curso?curso=rust las
 * corre todas contra sus pruebas: si se cambia un reto, abrir esa página.
 */

/** Una anotación de tipo: `nombre: tipo`, con espacios o sin ellos. */
const anotado = (nombre: string, tipo: string) => `\\b${nombre}\\s*:\\s*${tipo}`

/** El main vacío con que arrancan casi todos los retos. */
const MAIN_VACIO = 'fn main() {\n    \n}\n'

const L1: Leccion = {
  id: 'rs-1',
  numero: 1,
  titulo: '¡Hola, Rust!',
  emoji: '🦀',
  minutos: 20,
  explicacion: [
    {
      t: 'p',
      texto:
        'Rust es un lenguaje muy rápido y muy cuidadoso: lo usan en Firefox, Discord, Windows y Android. Su mascota es un cangrejo que se llama Ferris 🦀, y a quienes programan en Rust les dicen rustáceos.',
    },
    {
      t: 'p',
      texto:
        'Todo programa de Rust empieza en `fn main()`. Lo que va adentro de las llaves es lo que hace el programa. Para mostrar algo se usa `println!`.',
    },
    { t: 'compara', js: 'console.log("¡Hola!");', py: 'fn main() {\n    println!("¡Hola!");\n}' },
    { t: 'codigo', codigo: 'fn main() {\n    println!("¡Hola, Rust!");\n    println!("Soy Ferris 🦀");\n}' },
    {
      t: 'p',
      texto:
        'Fíjate en dos cosas. `println!` lleva un signo de admiración: en Rust eso quiere decir que es una macro, una función con superpoderes. Y cada línea termina en punto y coma.',
    },
    {
      t: 'ojo',
      texto:
        'Rust revisa todo antes de correr. Si falta un `;` o un `!`, no corre nada y te dice dónde está el error. Y ten paciencia: tu programa se compila en internet, así que tarda un par de segundos.',
    },
  ],
  retos: [
    {
      id: 'rs-1-1',
      titulo: 'Hola, mundo',
      enunciado: 'El primer programa de todo programador: muestra ¡Hola, mundo!',
      inicial: MAIN_VACIO,
      pista: 'Adentro de las llaves: println!("¡Hola, mundo!");',
      solucion: 'fn main() {\n    println!("¡Hola, mundo!");\n}',
      pruebas: [
        { t: 'src', re: '\\bprintln!\\s*\\(', msg: 'Usas println!' },
        { t: 'salida', igual: '¡Hola, mundo!', msg: 'Sale ¡Hola, mundo!' },
      ],
    },
    {
      id: 'rs-1-2',
      titulo: 'Tres renglones',
      enunciado: 'Muestra estos tres renglones, cada uno con su println!:\n\nMe llamo Ferris\nVivo en el mar\nMe encanta Rust',
      inicial: MAIN_VACIO,
      pista: 'Tres líneas de println!("…"); una debajo de la otra, cada una con su punto y coma.',
      solucion: 'fn main() {\n    println!("Me llamo Ferris");\n    println!("Vivo en el mar");\n    println!("Me encanta Rust");\n}',
      pruebas: [
        { t: 'src', re: '\\bprintln!\\s*\\(', min: 3, msg: 'Usas tres println!' },
        { t: 'salida', igual: 'Me llamo Ferris\nVivo en el mar\nMe encanta Rust', msg: 'Salen los tres renglones, en orden' },
      ],
    },
    {
      id: 'rs-1-3',
      titulo: 'Arregla el saludo',
      enunciado: 'Dale ▶ Correr y lee el error. A esta línea le faltan dos cosas que lleva todo println!. Arréglala para que muestre Hola, Ferris',
      inicial: 'fn main() {\n    println("Hola, Ferris")\n}\n',
      pista: 'Le falta el ! después de println, y el ; al final de la línea.',
      solucion: 'fn main() {\n    println!("Hola, Ferris");\n}',
      pruebas: [
        { t: 'src', re: '\\bprintln!\\s*\\([^\\n]*\\)\\s*;', msg: 'println! lleva su ! y su punto y coma' },
        { t: 'salida', igual: 'Hola, Ferris', msg: 'Sale Hola, Ferris' },
      ],
    },
    {
      id: 'rs-1-4',
      titulo: 'La escalera',
      enunciado: 'Dibuja esta escalera de estrellas, un renglón por println!:\n\n*\n**\n***\n****',
      inicial: MAIN_VACIO,
      pista: 'Cuatro println!, cada uno con una estrella más que el anterior.',
      solucion: 'fn main() {\n    println!("*");\n    println!("**");\n    println!("***");\n    println!("****");\n}',
      pruebas: [
        { t: 'src', re: '\\bprintln!\\s*\\(', min: 4, msg: 'Usas cuatro println!' },
        { t: 'salida', igual: '*\n**\n***\n****', msg: 'Sale la escalera de cuatro escalones' },
      ],
    },
    {
      id: 'rs-1-5',
      titulo: 'Sin main no hay programa',
      enunciado: 'Corre el programa: Rust no sabe por dónde empezar. Arréglalo para que muestre ¡Arranqué!',
      inicial: 'fn principal() {\n    println!("¡Arranqué!");\n}\n',
      pista: 'Todo programa empieza en una función que se llama main.',
      solucion: 'fn main() {\n    println!("¡Arranqué!");\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+main\\s*\\(', msg: 'Está fn main()' },
        { t: 'salida', igual: '¡Arranqué!', msg: 'Sale ¡Arranqué!' },
      ],
    },
  ],
}

const L2: Leccion = {
  id: 'rs-2',
  numero: 2,
  titulo: 'Variables',
  emoji: '📦',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Las variables se crean con `let`, como en JavaScript. Para mostrarlas pones `{}` en el texto de `println!` y la variable después de una coma. Rust cambia cada `{}` por un dato, en orden.',
    },
    { t: 'compara', js: 'let edad = 11;\nconsole.log("Tengo", edad, "años");', py: 'let edad = 11;\nprintln!("Tengo {} años", edad);' },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let nombre = "Ana";\n    let edad = 11;\n    println!("{} tiene {} años", nombre, edad);\n    println!("{nombre} tiene {edad} años");\n}',
    },
    { t: 'p', texto: 'La segunda forma también sirve: el nombre de la variable adentro de las llaves.' },
    {
      t: 'p',
      texto:
        'Lo más curioso de Rust: una variable creada con `let` no se puede cambiar. Si va a cambiar, se dice desde el principio con `let mut` (de mutable, que cambia).',
    },
    { t: 'codigo', codigo: 'fn main() {\n    let mut puntos = 0;\n    puntos = puntos + 10;\n    println!("Puntos: {}", puntos);\n}' },
    {
      t: 'ojo',
      texto: 'En JavaScript, `let` sí se podía cambiar. En Rust no: su `let` es como el `const` de JavaScript, y `let mut` es como el `let`.',
    },
  ],
  retos: [
    {
      id: 'rs-2-1',
      titulo: 'Tu primera variable',
      enunciado: 'Crea la variable mascota con el texto Firulais, y muéstrala con println! y unas llaves {}.',
      inicial: 'fn main() {\n    // Crea aquí la variable mascota\n    \n}\n',
      pista: 'let mascota = "Firulais"; y después println!("{}", mascota);',
      solucion: 'fn main() {\n    let mascota = "Firulais";\n    println!("{}", mascota);\n}',
      pruebas: [
        { t: 'src', re: '\\blet\\s+mascota\\s*=', msg: 'Creas la variable mascota' },
        { t: 'src', re: '\\{\\w*\\}', msg: 'Usas las llaves {} en el println!' },
        { t: 'salida', igual: 'Firulais', msg: 'Sale Firulais' },
      ],
    },
    {
      id: 'rs-2-2',
      titulo: 'Las llaves se llenan',
      enunciado: 'Crea edad con 11 y ciudad con Bogotá. Muestra, usando las dos variables:\n\nTengo 11 años y vivo en Bogotá',
      inicial: MAIN_VACIO,
      pista: 'println!("Tengo {} años y vivo en {}", edad, ciudad);',
      solucion: 'fn main() {\n    let edad = 11;\n    let ciudad = "Bogotá";\n    println!("Tengo {} años y vivo en {}", edad, ciudad);\n}',
      pruebas: [
        { t: 'src', re: '\\blet\\s+edad\\s*=', msg: 'Creas edad' },
        { t: 'src', re: '\\blet\\s+ciudad\\s*=', msg: 'Creas ciudad' },
        { t: 'src', re: 'Tengo\\s+11|en\\s+Bogot', not: true, msg: 'Usas las variables, no escribes el 11 ni Bogotá en el texto' },
        { t: 'salida', igual: 'Tengo 11 años y vivo en Bogotá', msg: 'Sale Tengo 11 años y vivo en Bogotá' },
      ],
    },
    {
      id: 'rs-2-3',
      titulo: 'El gol',
      enunciado: 'Corre el programa: Rust no deja cambiar goles. Arréglalo para que muestre Goles: 1',
      inicial: 'fn main() {\n    let goles = 0;\n    goles = goles + 1;\n    println!("Goles: {}", goles);\n}\n',
      pista: 'Si una variable va a cambiar, se crea con let mut.',
      solucion: 'fn main() {\n    let mut goles = 0;\n    goles = goles + 1;\n    println!("Goles: {}", goles);\n}',
      pruebas: [
        { t: 'src', re: '\\blet\\s+mut\\s+goles\\b', msg: 'goles es let mut' },
        { t: 'salida', igual: 'Goles: 1', msg: 'Sale Goles: 1' },
      ],
    },
    {
      id: 'rs-2-4',
      titulo: 'Las vidas',
      enunciado: 'Crea vidas con 3 y muéstrala. Después quítale 1 y muéstrala otra vez. Y otra vez:\n\nVidas: 3\nVidas: 2\nVidas: 1',
      inicial: MAIN_VACIO,
      pista: 'let mut vidas = 3; y después vidas = vidas - 1; entre cada println!',
      solucion:
        'fn main() {\n    let mut vidas = 3;\n    println!("Vidas: {}", vidas);\n    vidas = vidas - 1;\n    println!("Vidas: {}", vidas);\n    vidas = vidas - 1;\n    println!("Vidas: {}", vidas);\n}',
      pruebas: [
        { t: 'src', re: '\\blet\\s+mut\\s+vidas\\b', msg: 'vidas es let mut' },
        { t: 'src', re: 'Vidas:\\s*[0-9]', not: true, msg: 'El número sale de la variable, no lo escribes tú' },
        { t: 'salida', igual: 'Vidas: 3\nVidas: 2\nVidas: 1', msg: 'Salen 3, 2 y 1 vidas' },
      ],
    },
    {
      id: 'rs-2-5',
      titulo: 'El cambiazo',
      enunciado:
        'Intercambia los sabores: que a quede con lo que tenía b, y b con lo que tenía a. No escribas los sabores otra vez: usa una tercera variable para no perder ninguno.',
      inicial:
        'fn main() {\n    let mut a = "chocolate";\n    let mut b = "vainilla";\n    // Intercambia a y b aquí\n\n    println!("a = {}, b = {}", a, b);\n}\n',
      pista: 'let guardado = a; después a = b; y al final b = guardado;',
      solucion:
        'fn main() {\n    let mut a = "chocolate";\n    let mut b = "vainilla";\n    let guardado = a;\n    a = b;\n    b = guardado;\n    println!("a = {}, b = {}", a, b);\n}',
      pruebas: [
        { t: 'src', re: '^\\s*[ab]\\s*=\\s*"', flags: 'm', not: true, msg: 'No vuelves a escribir los sabores' },
        { t: 'salida', igual: 'a = vainilla, b = chocolate', msg: 'Sale a = vainilla, b = chocolate' },
      ],
    },
  ],
}

const L3: Leccion = {
  id: 'rs-3',
  numero: 3,
  titulo: 'Tipos',
  emoji: '🔢',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Rust siempre sabe de qué tipo es cada dato, como TypeScript. Casi siempre lo adivina solo, pero también se lo puedes decir, después de dos puntos.',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let edad: i32 = 11;         // entero\n    let altura: f64 = 1.45;     // decimal\n    let juega: bool = true;     // true o false\n    let inicial: char = \'A\';    // una sola letra\n    let nombre: &str = "Ana";   // un texto\n    println!("{} {} {} {} {}", edad, altura, juega, inicial, nombre);\n}',
    },
    {
      t: 'p',
      texto:
        '`i32` es un entero (sin decimales) y `f64` es un número con decimales. El `char` va entre comillas sencillas, y el texto entre comillas dobles.',
    },
    {
      t: 'p',
      texto: 'Y Rust es estricto: no mezcla enteros con decimales. Para hacer una cuenta entre los dos, conviertes el entero con `as f64`.',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let galletas: i32 = 7;\n    let amigos: f64 = 2.0;\n    let a_cada_uno = galletas as f64 / amigos;\n    println!("A cada uno le tocan {}", a_cada_uno);\n}',
    },
    { t: 'ojo', texto: 'Un número con punto es decimal: `2.0` es un f64 y `2` es un entero. Para Rust no son lo mismo.' },
  ],
  retos: [
    {
      id: 'rs-3-1',
      titulo: 'Con su tipo',
      enunciado: 'Crea tres variables, cada una con su tipo: edad (i32) con 11, estatura (f64) con 1.45 y juega (bool) con true. Muéstralas en ese orden, una por renglón.',
      inicial: MAIN_VACIO,
      pista: 'let edad: i32 = 11; y lo mismo con las otras dos.',
      solucion:
        'fn main() {\n    let edad: i32 = 11;\n    let estatura: f64 = 1.45;\n    let juega: bool = true;\n    println!("{}", edad);\n    println!("{}", estatura);\n    println!("{}", juega);\n}',
      pruebas: [
        { t: 'src', re: anotado('edad', 'i32'), msg: 'edad es i32' },
        { t: 'src', re: anotado('estatura', 'f64'), msg: 'estatura es f64' },
        { t: 'src', re: anotado('juega', 'bool'), msg: 'juega es bool' },
        { t: 'salida', igual: '11\n1.45\ntrue', msg: 'Salen 11, 1.45 y true' },
      ],
    },
    {
      id: 'rs-3-2',
      titulo: 'El tipo equivocado',
      enunciado: 'Corre el programa: el precio tiene decimales, pero le pusieron tipo de entero. Cambia el tipo (no el valor) para que muestre Cuesta 2.5',
      inicial: 'fn main() {\n    let precio: i32 = 2.5;\n    println!("Cuesta {}", precio);\n}\n',
      pista: 'Los números con decimales son f64.',
      solucion: 'fn main() {\n    let precio: f64 = 2.5;\n    println!("Cuesta {}", precio);\n}',
      pruebas: [
        { t: 'src', re: anotado('precio', 'f64'), msg: 'precio es f64' },
        { t: 'salida', igual: 'Cuesta 2.5', msg: 'Sale Cuesta 2.5' },
      ],
    },
    {
      id: 'rs-3-3',
      titulo: 'La pizza',
      enunciado: 'Corre el programa: Rust no deja dividir un entero entre un decimal. Convierte pizza con as f64 para que muestre 4.5 porciones para cada uno',
      inicial:
        'fn main() {\n    let pizza: i32 = 9;\n    let personas: f64 = 2.0;\n    let porciones = pizza / personas;\n    println!("{} porciones para cada uno", porciones);\n}\n',
      pista: 'let porciones = pizza as f64 / personas;',
      solucion:
        'fn main() {\n    let pizza: i32 = 9;\n    let personas: f64 = 2.0;\n    let porciones = pizza as f64 / personas;\n    println!("{} porciones para cada uno", porciones);\n}',
      pruebas: [
        { t: 'src', re: '\\bpizza\\s+as\\s+f64\\b', msg: 'Conviertes pizza con as f64' },
        { t: 'src', re: anotado('pizza', 'i32'), msg: 'pizza sigue siendo i32' },
        { t: 'salida', igual: '4.5 porciones para cada uno', msg: 'Sale 4.5 porciones para cada uno' },
      ],
    },
    {
      id: 'rs-3-4',
      titulo: 'Una sola letra',
      enunciado: 'Crea inicial, de tipo char, con la letra R. Muestra: Mi inicial es R',
      inicial: MAIN_VACIO,
      pista: "Un char va entre comillas sencillas: let inicial: char = 'R';",
      solucion: "fn main() {\n    let inicial: char = 'R';\n    println!(\"Mi inicial es {}\", inicial);\n}",
      pruebas: [
        { t: 'src', re: anotado('inicial', 'char'), msg: 'inicial es char' },
        { t: 'src', re: 'es\\s+R"', not: true, msg: 'La R sale de la variable' },
        { t: 'salida', igual: 'Mi inicial es R', msg: 'Sale Mi inicial es R' },
      ],
    },
    {
      id: 'rs-3-5',
      titulo: 'Tarjeta de jugador',
      enunciado: 'Crea apodo (&str) con Rayo, nivel (i32) con 7 y vip (bool) con false. Muestra en un solo renglón:\n\nRayo · nivel 7 · VIP: false',
      inicial: MAIN_VACIO,
      pista: 'println!("{} · nivel {} · VIP: {}", apodo, nivel, vip);',
      solucion:
        'fn main() {\n    let apodo: &str = "Rayo";\n    let nivel: i32 = 7;\n    let vip: bool = false;\n    println!("{} · nivel {} · VIP: {}", apodo, nivel, vip);\n}',
      pruebas: [
        { t: 'src', re: anotado('apodo', '&\\s*str'), msg: 'apodo es &str' },
        { t: 'src', re: anotado('nivel', 'i32'), msg: 'nivel es i32' },
        { t: 'src', re: anotado('vip', 'bool'), msg: 'vip es bool' },
        { t: 'src', re: 'Rayo\\s*·|nivel\\s+7', not: true, msg: 'Usas las variables, no escribes todo en el texto' },
        { t: 'salida', igual: 'Rayo · nivel 7 · VIP: false', msg: 'Sale Rayo · nivel 7 · VIP: false' },
      ],
    },
  ],
}

const L4: Leccion = {
  id: 'rs-4',
  numero: 4,
  titulo: 'Cuentas',
  emoji: '➗',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto: 'Las cuentas son como en JavaScript: `+`, `-`, `*`, `/` y `%`, que da lo que sobra de una división. Pero ojo con `/`: entre enteros, Rust bota los decimales.',
    },
    {
      t: 'codigo',
      codigo: 'fn main() {\n    println!("{}", 7 / 2);       // 3, entre enteros\n    println!("{}", 7.0 / 2.0);   // 3.5, entre decimales\n    println!("{}", 7 % 2);       // 1, lo que sobra\n}',
    },
    { t: 'p', texto: 'Para sumarle algo a una variable está `+=` (y también `-=` y `*=`). Claro, la variable tiene que ser `mut`.' },
    { t: 'codigo', codigo: 'fn main() {\n    let mut alcancia = 0;\n    alcancia += 500;\n    alcancia += 1000;\n    println!("Tengo {}", alcancia);\n}' },
    { t: 'p', texto: 'Y para mostrar un decimal con pocas cifras: `{:.1}` deja una cifra después del punto, y `{:.2}` deja dos.' },
    { t: 'codigo', codigo: 'fn main() {\n    let promedio = 10.0 / 3.0;\n    println!("{}", promedio);\n    println!("{:.1}", promedio);\n}' },
    { t: 'ojo', texto: 'Adentro de `println!` también van cuentas: `println!("{}", a + b);`' },
  ],
  retos: [
    {
      id: 'rs-4-1',
      titulo: 'La calculadora',
      enunciado: 'Con a y b, muestra en tres renglones la suma, la resta y la multiplicación.',
      inicial: 'fn main() {\n    let a = 12;\n    let b = 5;\n    \n}\n',
      pista: 'println!("{}", a + b); y lo mismo con - y *',
      solucion: 'fn main() {\n    let a = 12;\n    let b = 5;\n    println!("{}", a + b);\n    println!("{}", a - b);\n    println!("{}", a * b);\n}',
      pruebas: [
        { t: 'src', re: '\\ba\\s*\\+\\s*b\\b', msg: 'Sumas a + b' },
        { t: 'src', re: '\\ba\\s*-\\s*b\\b', msg: 'Restas a - b' },
        { t: 'src', re: '\\ba\\s*\\*\\s*b\\b', msg: 'Multiplicas a * b' },
        { t: 'salida', igual: '17\n7\n60', msg: 'Salen 17, 7 y 60' },
      ],
    },
    {
      id: 'rs-4-2',
      titulo: 'Repartir dulces',
      enunciado: 'Hay 17 dulces para 5 niños. Con / y % muestra:\n\nA cada uno le tocan 3 y sobran 2',
      inicial: 'fn main() {\n    let dulces = 17;\n    let ninos = 5;\n    \n}\n',
      pista: 'dulces / ninos da cuántos le tocan a cada uno, y dulces % ninos lo que sobra.',
      solucion: 'fn main() {\n    let dulces = 17;\n    let ninos = 5;\n    println!("A cada uno le tocan {} y sobran {}", dulces / ninos, dulces % ninos);\n}',
      pruebas: [
        { t: 'src', re: '\\bdulces\\s*/\\s*ninos\\b', msg: 'Divides dulces / ninos' },
        { t: 'src', re: '\\bdulces\\s*%\\s*ninos\\b', msg: 'Sacas lo que sobra con %' },
        { t: 'salida', igual: 'A cada uno le tocan 3 y sobran 2', msg: 'Sale A cada uno le tocan 3 y sobran 2' },
      ],
    },
    {
      id: 'rs-4-3',
      titulo: 'El promedio',
      enunciado: 'Saca el promedio de las tres notas y muéstralo con una sola cifra decimal:\n\nPromedio: 4.2',
      inicial: 'fn main() {\n    let mate = 4.5;\n    let ciencias = 3.0;\n    let arte = 5.0;\n    \n}\n',
      pista: 'let promedio = (mate + ciencias + arte) / 3.0; y después println!("Promedio: {:.1}", promedio);',
      solucion:
        'fn main() {\n    let mate = 4.5;\n    let ciencias = 3.0;\n    let arte = 5.0;\n    let promedio = (mate + ciencias + arte) / 3.0;\n    println!("Promedio: {:.1}", promedio);\n}',
      pruebas: [
        { t: 'src', re: '\\{:\\.1\\}', msg: 'Usas {:.1}' },
        { t: 'src', re: '/\\s*3(\\.0)?\\b', msg: 'Divides entre 3' },
        { t: 'salida', igual: 'Promedio: 4.2', msg: 'Sale Promedio: 4.2' },
      ],
    },
    {
      id: 'rs-4-4',
      titulo: 'La alcancía',
      enunciado: 'Empieza total en 0 y, con +=, mételo 1500, después 2500 y después 800. Muestra: Total: 4800',
      inicial: MAIN_VACIO,
      pista: 'let mut total = 0; y tres líneas como total += 1500;',
      solucion: 'fn main() {\n    let mut total = 0;\n    total += 1500;\n    total += 2500;\n    total += 800;\n    println!("Total: {}", total);\n}',
      pruebas: [
        { t: 'src', re: '\\btotal\\s*\\+=', min: 3, msg: 'Usas += tres veces' },
        { t: 'src', re: '4800', not: true, msg: 'El 4800 lo calcula Rust' },
        { t: 'salida', igual: 'Total: 4800', msg: 'Sale Total: 4800' },
      ],
    },
    {
      id: 'rs-4-5',
      titulo: 'Los segundos',
      enunciado: 'Una película dura 3725 segundos. Muestra cuánto es en horas, minutos y segundos:\n\n1 h 2 min 5 s',
      inicial: 'fn main() {\n    let segundos = 3725;\n    \n}\n',
      pista: 'Una hora tiene 3600 segundos: horas = segundos / 3600. Lo que sobra (segundos % 3600) se divide entre 60 para los minutos, y segundos % 60 son los segundos.',
      solucion:
        'fn main() {\n    let segundos = 3725;\n    let horas = segundos / 3600;\n    let minutos = segundos % 3600 / 60;\n    let resto = segundos % 60;\n    println!("{} h {} min {} s", horas, minutos, resto);\n}',
      pruebas: [
        { t: 'src', re: '/\\s*3600\\b', msg: 'Divides entre 3600 para las horas' },
        { t: 'src', re: '%\\s*60\\b', msg: 'Usas % 60' },
        { t: 'src', re: '"1 h|\\b2 min', not: true, msg: 'Los números los calcula Rust' },
        { t: 'salida', igual: '1 h 2 min 5 s', msg: 'Sale 1 h 2 min 5 s' },
      ],
    },
  ],
}

const L5: Leccion = {
  id: 'rs-5',
  numero: 5,
  titulo: 'Textos',
  emoji: '🔤',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'En Rust hay dos clases de texto. El que escribes entre comillas, `"hola"`, es un `&str`: un texto fijo. Y el `String` es un texto que puede crecer: se crea con `String::from("…")`.',
    },
    {
      t: 'p',
      texto: 'Para armar textos, Rust no usa `+` como JavaScript: usa `format!`, que funciona igual que `println!`, pero en vez de mostrar el texto te lo devuelve.',
    },
    { t: 'compara', js: 'let saludo = "Hola, " + nombre;', py: 'let saludo = format!("Hola, {}", nombre);' },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let nombre = "Sara";\n    let saludo = format!("Hola, {}", nombre);\n    println!("{}", saludo);\n    println!("{} tiene {} letras", nombre, nombre.len());\n    println!("{}", nombre.to_uppercase());\n}',
    },
    { t: 'p', texto: 'Y un `String` con `mut` crece con `push_str`:' },
    { t: 'codigo', codigo: 'fn main() {\n    let mut frase = String::from("Me gusta");\n    frase.push_str(" Rust");\n    println!("{}", frase);\n}' },
    {
      t: 'ojo',
      texto: '`.len()` cuenta bien las letras sin tilde. Con tildes o eñes cuenta de más, porque esas letras ocupan dos espacios por dentro. Por ahora, úsalo con palabras sin tilde.',
    },
  ],
  retos: [
    {
      id: 'rs-5-1',
      titulo: 'Arma la frase',
      enunciado: 'Con format!, arma la frase Mi animal favorito es el gato usando la variable animal. Guárdala en frase y muéstrala.',
      inicial: 'fn main() {\n    let animal = "gato";\n    \n}\n',
      pista: 'let frase = format!("Mi animal favorito es el {}", animal);',
      solucion: 'fn main() {\n    let animal = "gato";\n    let frase = format!("Mi animal favorito es el {}", animal);\n    println!("{}", frase);\n}',
      pruebas: [
        { t: 'src', re: '\\blet\\s+frase\\s*=\\s*format!\\s*\\(', msg: 'frase sale de format!' },
        { t: 'src', re: 'el\\s+gato', not: true, msg: 'gato sale de la variable' },
        { t: 'salida', igual: 'Mi animal favorito es el gato', msg: 'Sale Mi animal favorito es el gato' },
      ],
    },
    {
      id: 'rs-5-2',
      titulo: '¿Cuántas letras?',
      enunciado: 'Usa .len() para mostrar: cangrejo tiene 8 letras',
      inicial: 'fn main() {\n    let palabra = "cangrejo";\n    \n}\n',
      pista: 'println!("{} tiene {} letras", palabra, palabra.len());',
      solucion: 'fn main() {\n    let palabra = "cangrejo";\n    println!("{} tiene {} letras", palabra, palabra.len());\n}',
      pruebas: [
        { t: 'src', re: '\\.len\\s*\\(\\s*\\)', msg: 'Usas .len()' },
        { t: 'src', re: '\\b8\\s+letras', not: true, msg: 'El 8 lo cuenta Rust' },
        { t: 'salida', igual: 'cangrejo tiene 8 letras', msg: 'Sale cangrejo tiene 8 letras' },
      ],
    },
    {
      id: 'rs-5-3',
      titulo: '¡A gritos!',
      enunciado: 'Muestra la palabra en mayúsculas con .to_uppercase(): HOLA',
      inicial: 'fn main() {\n    let palabra = "hola";\n    \n}\n',
      pista: 'println!("{}", palabra.to_uppercase());',
      solucion: 'fn main() {\n    let palabra = "hola";\n    println!("{}", palabra.to_uppercase());\n}',
      pruebas: [
        { t: 'src', re: '\\.to_uppercase\\s*\\(', msg: 'Usas .to_uppercase()' },
        { t: 'salida', igual: 'HOLA', exacto: true, msg: 'Sale HOLA, en mayúsculas' },
      ],
    },
    {
      id: 'rs-5-4',
      titulo: 'La frase que crece',
      enunciado: 'Crea frase con String::from("Me gusta"). Después, con push_str, agrégale " programar" y luego " en Rust". Muestra: Me gusta programar en Rust',
      inicial: MAIN_VACIO,
      pista: 'let mut frase = String::from("Me gusta"); y después frase.push_str(" programar");',
      solucion: 'fn main() {\n    let mut frase = String::from("Me gusta");\n    frase.push_str(" programar");\n    frase.push_str(" en Rust");\n    println!("{}", frase);\n}',
      pruebas: [
        { t: 'src', re: '\\bString::from\\s*\\(', msg: 'Usas String::from' },
        { t: 'src', re: '\\.push_str\\s*\\(', min: 2, msg: 'Usas push_str dos veces' },
        { t: 'salida', igual: 'Me gusta programar en Rust', msg: 'Sale Me gusta programar en Rust' },
      ],
    },
    {
      id: 'rs-5-5',
      titulo: 'La risa',
      enunciado: 'Los textos tienen .repeat(n), que los repite n veces. Úsalo con "ja" para mostrar: jajajaja',
      inicial: MAIN_VACIO,
      pista: 'let risa = "ja".repeat(4);',
      solucion: 'fn main() {\n    let risa = "ja".repeat(4);\n    println!("{}", risa);\n}',
      pruebas: [
        { t: 'src', re: '\\.repeat\\s*\\(', msg: 'Usas .repeat()' },
        { t: 'src', re: 'jajaja', not: true, msg: 'La risa la repite Rust' },
        { t: 'salida', igual: 'jajajaja', msg: 'Sale jajajaja' },
      ],
    },
  ],
}

const L6: Leccion = {
  id: 'rs-6',
  numero: 6,
  titulo: 'Preguntar',
  emoji: '💬',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'En Rust de verdad, leer lo que escriben en el teclado toma varias líneas. Aquí en la arena tienes una ayuda: `preguntar("…")`, que muestra la pregunta y te devuelve la respuesta como un `String`.',
    },
    { t: 'codigo', codigo: 'fn main() {\n    let nombre = preguntar("¿Cómo te llamas? ");\n    println!("Hola, {}", nombre);\n}', entradas: ['Leo'] },
    {
      t: 'p',
      texto:
        'La respuesta siempre llega como texto, aunque escriban un número. Para hacer cuentas se convierte con `.parse()`, diciendo a qué tipo. Y como el texto podría no ser un número, al final va `.unwrap()`, que quiere decir: “si no se pudo, detente”.',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let texto = preguntar("¿Cuántos años tienes? ");\n    let edad: i32 = texto.parse().unwrap();\n    println!("El otro año tendrás {}", edad + 1);\n}',
      entradas: ['11'],
    },
    {
      t: 'ojo',
      texto: '`preguntar` es una ayuda de la arena: en otro computador no existe. Escribe las respuestas en las cajitas de abajo del editor antes de correr.',
    },
  ],
  retos: [
    {
      id: 'rs-6-1',
      titulo: 'La pregunta',
      enunciado: 'Pregunta el nombre con preguntar y saluda: Hola, (nombre)',
      inicial: MAIN_VACIO,
      entradas: ['Sara'],
      pista: 'let nombre = preguntar("¿Cómo te llamas? "); y después println!("Hola, {}", nombre);',
      solucion: 'fn main() {\n    let nombre = preguntar("¿Cómo te llamas? ");\n    println!("Hola, {}", nombre);\n}',
      pruebas: [
        { t: 'src', re: '\\bpreguntar\\s*\\(', msg: 'Usas preguntar' },
        { t: 'linea', n: -1, igual: 'Hola, Sara', msg: 'A Sara le dice Hola, Sara' },
        { t: 'linea', n: -1, igual: 'Hola, Leo', entradas: ['Leo'], msg: 'A Leo le dice Hola, Leo' },
      ],
    },
    {
      id: 'rs-6-2',
      titulo: 'El doble',
      enunciado: 'Pregunta un número y muestra su doble.',
      inicial: MAIN_VACIO,
      entradas: ['7'],
      pista: 'let n: i32 = preguntar("Un número: ").parse().unwrap(); y después println!("{}", n * 2);',
      solucion: 'fn main() {\n    let texto = preguntar("Un número: ");\n    let n: i32 = texto.parse().unwrap();\n    println!("{}", n * 2);\n}',
      pruebas: [
        { t: 'src', re: '\\.parse\\s*\\(', msg: 'Usas .parse()' },
        { t: 'linea', n: -1, igual: '14', msg: 'Con 7 sale 14' },
        { t: 'linea', n: -1, igual: '50', entradas: ['25'], msg: 'Con 25 sale 50' },
      ],
    },
    {
      id: 'rs-6-3',
      titulo: 'La suma',
      enunciado: 'Pregunta dos números y muestra la suma así: 3 + 5 = 8',
      inicial: MAIN_VACIO,
      entradas: ['3', '5'],
      pista: 'Dos preguntar, dos parse, y println!("{} + {} = {}", a, b, a + b);',
      solucion:
        'fn main() {\n    let a: i32 = preguntar("Primer número: ").parse().unwrap();\n    let b: i32 = preguntar("Segundo número: ").parse().unwrap();\n    println!("{} + {} = {}", a, b, a + b);\n}',
      pruebas: [
        { t: 'src', re: '\\.parse\\s*\\(', min: 2, msg: 'Conviertes los dos con .parse()' },
        { t: 'linea', n: -1, igual: '3 + 5 = 8', msg: 'Con 3 y 5: 3 + 5 = 8' },
        { t: 'linea', n: -1, igual: '10 + 20 = 30', entradas: ['10', '20'], msg: 'Con 10 y 20: 10 + 20 = 30' },
      ],
    },
    {
      id: 'rs-6-4',
      titulo: '¿Cuántos años tienes?',
      enunciado: 'Pregunta el año en que naciste. Guarda la edad en edad, de tipo i32 (estamos en 2026), y muestra: Tienes (edad) años',
      inicial: MAIN_VACIO,
      entradas: ['2014'],
      pista: 'let anio: i32 = preguntar("¿En qué año naciste? ").parse().unwrap(); y let edad: i32 = 2026 - anio;',
      solucion:
        'fn main() {\n    let anio: i32 = preguntar("¿En qué año naciste? ").parse().unwrap();\n    let edad: i32 = 2026 - anio;\n    println!("Tienes {} años", edad);\n}',
      pruebas: [
        { t: 'src', re: anotado('edad', 'i32'), msg: 'edad es i32' },
        { t: 'linea', n: -1, igual: 'Tienes 12 años', msg: 'Si naciste en 2014: Tienes 12 años' },
        { t: 'linea', n: -1, igual: 'Tienes 10 años', entradas: ['2016'], msg: 'Si naciste en 2016: Tienes 10 años' },
      ],
    },
    {
      id: 'rs-6-5',
      titulo: 'La mitad exacta',
      enunciado: 'Pregunta un número y muestra su mitad con decimales: La mitad de 7 es 3.5. Convierte la respuesta a f64.',
      inicial: MAIN_VACIO,
      entradas: ['7'],
      pista: 'let n: f64 = preguntar("Un número: ").parse().unwrap(); y después n / 2.0',
      solucion: 'fn main() {\n    let n: f64 = preguntar("Un número: ").parse().unwrap();\n    println!("La mitad de {} es {}", n, n / 2.0);\n}',
      pruebas: [
        { t: 'src', re: ':\\s*f64\\b', msg: 'Conviertes a f64' },
        { t: 'linea', n: -1, igual: 'La mitad de 7 es 3.5', msg: 'Con 7: La mitad de 7 es 3.5' },
        { t: 'linea', n: -1, igual: 'La mitad de 10 es 5', entradas: ['10'], msg: 'Con 10: La mitad de 10 es 5' },
      ],
    },
  ],
}

const L7: Leccion = {
  id: 'rs-7',
  numero: 7,
  titulo: 'Decidir: if y match',
  emoji: '🔀',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto: 'El `if` de Rust es casi el de JavaScript, pero sin paréntesis alrededor de la condición. Las llaves sí son obligatorias, siempre.',
    },
    {
      t: 'compara',
      js: 'if (edad >= 18) {\n  console.log("adulto");\n} else {\n  console.log("niño");\n}',
      py: 'if edad >= 18 {\n    println!("adulto");\n} else {\n    println!("niño");\n}',
    },
    {
      t: 'p',
      texto: 'Un truco de Rust: el `if` puede dar un valor, y ese valor se guarda directo en una variable. Ojo: adentro de esas llaves no va punto y coma.',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let temperatura = 28;\n    let ropa = if temperatura > 25 { "pantaloneta" } else { "chaqueta" };\n    println!("Hoy toca {}", ropa);\n}',
    },
    {
      t: 'p',
      texto: 'Y cuando hay muchos casos está `match`: compara un valor con cada caso, en orden. El `_` quiere decir “cualquier otro”, y `3..=4` quiere decir “de 3 a 4”.',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let nota = 4;\n    let mensaje = match nota {\n        5 => "¡Excelente!",\n        3..=4 => "Bien",\n        _ => "A repasar",\n    };\n    println!("{}", mensaje);\n}',
    },
    {
      t: 'ojo',
      texto: 'Un `match` tiene que cubrir todos los casos posibles. Si falta alguno, Rust no corre el programa: por eso casi siempre termina con `_`.',
    },
  ],
  retos: [
    {
      id: 'rs-7-1',
      titulo: '¿Par o impar?',
      enunciado: 'Pregunta un número y di si es par o impar.',
      inicial: MAIN_VACIO,
      entradas: ['4'],
      pista: 'Un número es par si n % 2 == 0.',
      solucion:
        'fn main() {\n    let n: i32 = preguntar("Un número: ").parse().unwrap();\n    if n % 2 == 0 {\n        println!("par");\n    } else {\n        println!("impar");\n    }\n}',
      pruebas: [
        { t: 'src', re: '\\bif\\b', msg: 'Usas if' },
        { t: 'linea', n: -1, igual: 'par', msg: 'El 4 es par' },
        { t: 'linea', n: -1, igual: 'impar', entradas: ['7'], msg: 'El 7 es impar' },
        { t: 'linea', n: -1, igual: 'par', entradas: ['0'], msg: 'El 0 es par' },
      ],
    },
    {
      id: 'rs-7-2',
      titulo: '¿Puedes votar?',
      enunciado: 'Pregunta la edad. Con 18 o más, muestra Puedes votar; si no, Todavía no',
      inicial: MAIN_VACIO,
      entradas: ['20'],
      pista: 'if edad >= 18 { … } else { … }',
      solucion:
        'fn main() {\n    let edad: i32 = preguntar("¿Cuántos años tienes? ").parse().unwrap();\n    if edad >= 18 {\n        println!("Puedes votar");\n    } else {\n        println!("Todavía no");\n    }\n}',
      pruebas: [
        { t: 'linea', n: -1, igual: 'Puedes votar', msg: 'Con 20: Puedes votar' },
        { t: 'linea', n: -1, igual: 'Todavía no', entradas: ['11'], msg: 'Con 11: Todavía no' },
        { t: 'linea', n: -1, igual: 'Puedes votar', entradas: ['18'], msg: 'Con 18 justos: Puedes votar' },
      ],
    },
    {
      id: 'rs-7-3',
      titulo: 'El if que da valor',
      enunciado: 'Pregunta la temperatura. Guarda en ropa, con un if que da valor, pantaloneta si hace más de 25 grados o chaqueta si no. Muestra: Hoy toca (ropa)',
      inicial: MAIN_VACIO,
      entradas: ['30'],
      pista: 'let ropa = if temperatura > 25 { "pantaloneta" } else { "chaqueta" };',
      solucion:
        'fn main() {\n    let temperatura: i32 = preguntar("¿Cuántos grados hace? ").parse().unwrap();\n    let ropa = if temperatura > 25 { "pantaloneta" } else { "chaqueta" };\n    println!("Hoy toca {}", ropa);\n}',
      pruebas: [
        { t: 'src', re: '\\blet\\s+ropa\\s*=\\s*if\\b', msg: 'ropa sale de un if' },
        { t: 'linea', n: -1, igual: 'Hoy toca pantaloneta', msg: 'Con 30: pantaloneta' },
        { t: 'linea', n: -1, igual: 'Hoy toca chaqueta', entradas: ['15'], msg: 'Con 15: chaqueta' },
        { t: 'linea', n: -1, igual: 'Hoy toca chaqueta', entradas: ['25'], msg: 'Con 25 justos: chaqueta' },
      ],
    },
    {
      id: 'rs-7-4',
      titulo: 'Los días',
      enunciado: 'Pregunta un número del 1 al 7 y, con match, muestra el día: 1 es lunes, 2 martes… y 7 domingo. Con cualquier otro número: Ese día no existe',
      inicial: MAIN_VACIO,
      entradas: ['1'],
      pista: 'let dia = match n { 1 => "lunes", 2 => "martes", … _ => "Ese día no existe" };',
      solucion:
        'fn main() {\n    let n: i32 = preguntar("Un número del 1 al 7: ").parse().unwrap();\n    let dia = match n {\n        1 => "lunes",\n        2 => "martes",\n        3 => "miércoles",\n        4 => "jueves",\n        5 => "viernes",\n        6 => "sábado",\n        7 => "domingo",\n        _ => "Ese día no existe",\n    };\n    println!("{}", dia);\n}',
      pruebas: [
        { t: 'src', re: '\\bmatch\\b', msg: 'Usas match' },
        { t: 'linea', n: -1, igual: 'lunes', msg: 'El 1 es lunes' },
        { t: 'linea', n: -1, igual: 'miércoles', entradas: ['3'], msg: 'El 3 es miércoles' },
        { t: 'linea', n: -1, igual: 'domingo', entradas: ['7'], msg: 'El 7 es domingo' },
        { t: 'linea', n: -1, igual: 'Ese día no existe', entradas: ['9'], msg: 'El 9 no existe' },
      ],
    },
    {
      id: 'rs-7-5',
      titulo: 'La nota',
      enunciado: 'Pregunta una nota y, con match y rangos, responde:\n\n1 o 2 → A repasar\n3 → Bien\n4 o 5 → ¡Excelente!\notra → Nota inválida',
      inicial: MAIN_VACIO,
      entradas: ['5'],
      pista: 'Los rangos se escriben así: 1..=2 => "A repasar",',
      solucion:
        'fn main() {\n    let nota: i32 = preguntar("Tu nota: ").parse().unwrap();\n    let mensaje = match nota {\n        1..=2 => "A repasar",\n        3 => "Bien",\n        4..=5 => "¡Excelente!",\n        _ => "Nota inválida",\n    };\n    println!("{}", mensaje);\n}',
      pruebas: [
        { t: 'src', re: '\\bmatch\\b', msg: 'Usas match' },
        { t: 'src', re: '\\d\\s*\\.\\.=\\s*\\d', msg: 'Usas rangos como 1..=2' },
        { t: 'linea', n: -1, igual: '¡Excelente!', msg: 'Con 5: ¡Excelente!' },
        { t: 'linea', n: -1, igual: 'A repasar', entradas: ['2'], msg: 'Con 2: A repasar' },
        { t: 'linea', n: -1, igual: 'Bien', entradas: ['3'], msg: 'Con 3: Bien' },
        { t: 'linea', n: -1, igual: '¡Excelente!', entradas: ['4'], msg: 'Con 4: ¡Excelente!' },
        { t: 'linea', n: -1, igual: 'Nota inválida', entradas: ['8'], msg: 'Con 8: Nota inválida' },
      ],
    },
  ],
}

const TABLA_DEL_7 = Array.from({ length: 10 }, (_, i) => `7 x ${i + 1} = ${7 * (i + 1)}`).join('\n')

const L8: Leccion = {
  id: 'rs-8',
  numero: 8,
  titulo: 'Ciclos',
  emoji: '🔁',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto: 'Rust tiene tres ciclos. El más usado es `for`, que recorre un rango: `1..=5` va del 1 al 5, y `1..5` va del 1 al 4 (sin el último).',
    },
    { t: 'compara', js: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}', py: 'for i in 1..=5 {\n    println!("{}", i);\n}' },
    { t: 'p', texto: '`while` repite mientras la condición sea verdad, como en JavaScript:' },
    {
      t: 'codigo',
      codigo: 'fn main() {\n    let mut n = 3;\n    while n > 0 {\n        println!("{}...", n);\n        n -= 1;\n    }\n    println!("¡Despegue! 🚀");\n}',
    },
    { t: 'p', texto: 'Y `loop` repite para siempre, hasta que encuentra un `break`:' },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let mut vueltas = 0;\n    loop {\n        vueltas += 1;\n        if vueltas == 3 {\n            break;\n        }\n    }\n    println!("Paré a las {} vueltas", vueltas);\n}',
    },
    { t: 'ojo', texto: 'Un `loop` sin `break` nunca para. Si te pasa, la arena lo detiene a los pocos segundos.' },
  ],
  retos: [
    {
      id: 'rs-8-1',
      titulo: 'Contar',
      enunciado: 'Con un for, muestra los números del 1 al 5, uno por renglón.',
      inicial: MAIN_VACIO,
      pista: 'for i in 1..=5 { println!("{}", i); }',
      solucion: 'fn main() {\n    for i in 1..=5 {\n        println!("{}", i);\n    }\n}',
      pruebas: [
        { t: 'src', re: '\\bfor\\b', msg: 'Usas for' },
        { t: 'salida', igual: '1\n2\n3\n4\n5', msg: 'Salen del 1 al 5' },
      ],
    },
    {
      id: 'rs-8-2',
      titulo: 'La tabla del 7',
      enunciado: 'Con un for, muestra la tabla del 7, del 7 x 1 = 7 hasta el 7 x 10 = 70.',
      inicial: MAIN_VACIO,
      pista: 'for i in 1..=10 { println!("7 x {} = {}", i, 7 * i); }',
      solucion: 'fn main() {\n    for i in 1..=10 {\n        println!("7 x {} = {}", i, 7 * i);\n    }\n}',
      pruebas: [
        { t: 'src', re: '\\bfor\\b', msg: 'Usas for' },
        { t: 'salida', igual: TABLA_DEL_7, msg: 'Sale toda la tabla del 7' },
      ],
    },
    {
      id: 'rs-8-3',
      titulo: 'Cuenta regresiva',
      enunciado: 'Con un while, cuenta del 5 al 1 y al final muestra ¡Despegue!',
      inicial: MAIN_VACIO,
      pista: 'let mut n = 5; while n > 0 { …; n -= 1; }',
      solucion: 'fn main() {\n    let mut n = 5;\n    while n > 0 {\n        println!("{}", n);\n        n -= 1;\n    }\n    println!("¡Despegue!");\n}',
      pruebas: [
        { t: 'src', re: '\\bwhile\\b', msg: 'Usas while' },
        { t: 'salida', igual: '5\n4\n3\n2\n1\n¡Despegue!', msg: 'Sale 5, 4, 3, 2, 1 y ¡Despegue!' },
      ],
    },
    {
      id: 'rs-8-4',
      titulo: 'Del 1 al 100',
      enunciado: 'Suma todos los números del 1 al 100 con un for y muestra el total.',
      inicial: MAIN_VACIO,
      pista: 'let mut total = 0; for i in 1..=100 { total += i; }',
      solucion: 'fn main() {\n    let mut total = 0;\n    for i in 1..=100 {\n        total += i;\n    }\n    println!("{}", total);\n}',
      pruebas: [
        { t: 'src', re: '\\bfor\\b', msg: 'Usas for' },
        { t: 'src', re: '5050', not: true, msg: 'El total lo calcula Rust' },
        { t: 'salida', igual: '5050', msg: 'Sale 5050' },
      ],
    },
    {
      id: 'rs-8-5',
      titulo: 'Adivina el número',
      enunciado:
        'El número secreto es 7. Con un loop, pregunta Adivina: hasta que acierten. Si el número es menor, muestra Más alto; si es mayor, Más bajo. Cuando acierten, muestra ¡Adivinaste! Intentos: (cuántos) y para con break.',
      inicial: 'fn main() {\n    let secreto = 7;\n    let mut intentos = 0;\n    \n}\n',
      entradas: ['3', '9', '7'],
      pista: 'Adentro del loop: intentos += 1; pregunta y convierte; después if n == secreto { …; break; } else if n < secreto { … } else { … }',
      solucion:
        'fn main() {\n    let secreto = 7;\n    let mut intentos = 0;\n    loop {\n        intentos += 1;\n        let n: i32 = preguntar("Adivina: ").parse().unwrap();\n        if n == secreto {\n            println!("¡Adivinaste! Intentos: {}", intentos);\n            break;\n        } else if n < secreto {\n            println!("Más alto");\n        } else {\n            println!("Más bajo");\n        }\n    }\n}',
      pruebas: [
        { t: 'src', re: '\\bloop\\b', msg: 'Usas loop' },
        { t: 'src', re: '\\bbreak\\b', msg: 'Paras con break' },
        { t: 'salida', contiene: 'Más alto', msg: 'Con 3 dice Más alto' },
        { t: 'salida', contiene: 'Más bajo', msg: 'Con 9 dice Más bajo' },
        { t: 'linea', n: -1, igual: '¡Adivinaste! Intentos: 3', msg: 'Con 3, 9 y 7: ¡Adivinaste! Intentos: 3' },
        { t: 'linea', n: -1, igual: '¡Adivinaste! Intentos: 1', entradas: ['7'], msg: 'Si acierta de una: Intentos: 1' },
      ],
    },
  ],
}

const L9: Leccion = {
  id: 'rs-9',
  numero: 9,
  titulo: 'Funciones',
  emoji: '🧩',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Ya conoces una función: `main`. Las tuyas se crean igual, con `fn`. A cada parámetro hay que decirle su tipo, y después de `->` va el tipo de lo que devuelve.',
    },
    { t: 'compara', js: 'function doble(n) {\n  return n * 2;\n}', py: 'fn doble(n: i32) -> i32 {\n    n * 2\n}' },
    {
      t: 'p',
      texto:
        '¿Y el `return`? En Rust, la última línea de la función, si va sin punto y coma, es lo que se devuelve. También existe `return`, pero casi siempre se escribe así.',
    },
    {
      t: 'codigo',
      codigo:
        'fn doble(n: i32) -> i32 {\n    n * 2\n}\n\nfn saludar(nombre: &str) -> String {\n    format!("Hola, {}", nombre)\n}\n\nfn main() {\n    println!("{}", doble(21));\n    println!("{}", saludar("Ana"));\n}',
    },
    {
      t: 'p',
      texto: 'Los nombres en Rust van en minúscula y con guion bajo entre las palabras: `es_par`, no `esPar`. Si no, Rust te lo advierte.',
    },
    {
      t: 'ojo',
      texto: 'El punto y coma importa: `n * 2` devuelve el número, pero `n * 2;` no devuelve nada, y Rust te dirá que los tipos no cuadran.',
    },
  ],
  retos: [
    {
      id: 'rs-9-1',
      titulo: 'El saludo',
      enunciado: 'Escribe la función saludar: recibe un nombre (&str) y devuelve un String con Hola, (nombre). El main ya la usa.',
      inicial: '// Escribe aquí la función saludar\n\nfn main() {\n    println!("{}", saludar("Ana"));\n}\n',
      pista: 'fn saludar(nombre: &str) -> String { format!("Hola, {}", nombre) }',
      solucion: 'fn saludar(nombre: &str) -> String {\n    format!("Hola, {}", nombre)\n}\n\nfn main() {\n    println!("{}", saludar("Ana"));\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+saludar\\s*\\(\\s*\\w+\\s*:\\s*&\\s*str\\s*\\)\\s*->\\s*String\\b', msg: 'saludar recibe un &str y devuelve un String' },
        { t: 'salida', igual: 'Hola, Ana', msg: 'Sale Hola, Ana' },
        { t: 'expr', code: 'saludar("Leo")', igual: '"Hola, Leo"', msg: 'saludar("Leo") es "Hola, Leo"' },
      ],
    },
    {
      id: 'rs-9-2',
      titulo: 'El área',
      enunciado: 'Escribe area: recibe la base y la altura (las dos f64) y devuelve el área del rectángulo, base por altura. Muestra area(3.0, 4.0).',
      inicial: MAIN_VACIO,
      pista: 'fn area(base: f64, altura: f64) -> f64 { base * altura }',
      solucion: 'fn area(base: f64, altura: f64) -> f64 {\n    base * altura\n}\n\nfn main() {\n    println!("{}", area(3.0, 4.0));\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+area\\s*\\([^)]*f64[^)]*f64[^)]*\\)\\s*->\\s*f64\\b', msg: 'area recibe dos f64 y devuelve un f64' },
        { t: 'salida', igual: '12', msg: 'Sale 12' },
        { t: 'expr', code: 'area(2.5, 2.0)', igual: '5.0', msg: 'area(2.5, 2.0) es 5.0' },
        { t: 'expr', code: 'area(1.0, 0.5)', igual: '0.5', msg: 'area(1.0, 0.5) es 0.5' },
      ],
    },
    {
      id: 'rs-9-3',
      titulo: '¿Es par?',
      enunciado: 'Escribe es_par: recibe un i32 y devuelve un bool, true si el número es par.',
      inicial: MAIN_VACIO,
      pista: 'fn es_par(n: i32) -> bool { n % 2 == 0 }',
      solucion: 'fn es_par(n: i32) -> bool {\n    n % 2 == 0\n}\n\nfn main() {\n    println!("{}", es_par(4));\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+es_par\\s*\\(\\s*\\w+\\s*:\\s*i32\\s*\\)\\s*->\\s*bool\\b', msg: 'es_par recibe un i32 y devuelve un bool' },
        { t: 'expr', code: 'es_par(4)', igual: 'true', msg: 'es_par(4) es true' },
        { t: 'expr', code: 'es_par(7)', igual: 'false', msg: 'es_par(7) es false' },
        { t: 'expr', code: 'es_par(0)', igual: 'true', msg: 'es_par(0) es true' },
      ],
    },
    {
      id: 'rs-9-4',
      titulo: 'El punto y coma de más',
      enunciado: 'Corre el programa y lee el error: triple dice que devuelve un i32, pero no devuelve nada. Arréglalo sin agregar return.',
      inicial: 'fn triple(n: i32) -> i32 {\n    n * 3;\n}\n\nfn main() {\n    println!("{}", triple(5));\n}\n',
      pista: 'La última línea, sin punto y coma, es lo que se devuelve.',
      solucion: 'fn triple(n: i32) -> i32 {\n    n * 3\n}\n\nfn main() {\n    println!("{}", triple(5));\n}',
      pruebas: [
        { t: 'src', re: '\\breturn\\b', not: true, msg: 'Sin return' },
        { t: 'salida', igual: '15', msg: 'Sale 15' },
        { t: 'expr', code: 'triple(10)', igual: '30', msg: 'triple(10) es 30' },
      ],
    },
    {
      id: 'rs-9-5',
      titulo: 'El mayor de tres',
      enunciado: 'Escribe mayor: recibe tres i32 y devuelve el más grande.',
      inicial: MAIN_VACIO,
      pista: 'Guarda a en una variable mut grande, y con dos if cámbiala si b o c son más grandes. Al final, grande sin punto y coma.',
      solucion:
        'fn mayor(a: i32, b: i32, c: i32) -> i32 {\n    let mut grande = a;\n    if b > grande {\n        grande = b;\n    }\n    if c > grande {\n        grande = c;\n    }\n    grande\n}\n\nfn main() {\n    println!("{}", mayor(1, 5, 3));\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+mayor\\s*\\(', msg: 'Creas la función mayor' },
        { t: 'expr', code: 'mayor(1, 5, 3)', igual: '5', msg: 'mayor(1, 5, 3) es 5' },
        { t: 'expr', code: 'mayor(9, 2, 4)', igual: '9', msg: 'mayor(9, 2, 4) es 9' },
        { t: 'expr', code: 'mayor(2, 3, 8)', igual: '8', msg: 'mayor(2, 3, 8) es 8' },
        { t: 'expr', code: 'mayor(-1, -5, -3)', igual: '-1', msg: 'Con negativos: mayor(-1, -5, -3) es -1' },
      ],
    },
  ],
}

const L10: Leccion = {
  id: 'rs-10',
  numero: 10,
  titulo: 'Listas',
  emoji: '🎒',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto: 'Una lista que puede crecer es un `Vec` (de vector). Se crea con `vec![…]`, y como en JavaScript, la primera posición es la 0.',
    },
    {
      t: 'compara',
      js: 'let frutas = ["mango", "kiwi"];\nconsole.log(frutas[0], frutas.length);',
      py: 'let frutas = vec!["mango", "kiwi"];\nprintln!("{} {}", frutas[0], frutas.len());',
    },
    {
      t: 'p',
      texto:
        'Para recorrerla: `for f in &frutas`. El `&` quiere decir “préstamela para mirarla”: así la lista sigue siendo tuya después del for. Y para mostrarla entera, `{:?}` en vez de `{}`.',
    },
    {
      t: 'codigo',
      codigo: 'fn main() {\n    let frutas = vec!["mango", "kiwi", "pera"];\n    for f in &frutas {\n        println!("Me gusta el {}", f);\n    }\n    println!("{:?}", frutas);\n}',
    },
    { t: 'p', texto: 'Para que crezca con `push`, tiene que ser `mut`:' },
    {
      t: 'codigo',
      codigo: 'fn main() {\n    let mut puntos = Vec::new();\n    puntos.push(10);\n    puntos.push(25);\n    println!("{:?} tiene {} datos", puntos, puntos.len());\n}',
    },
    { t: 'ojo', texto: 'Si pides una posición que no existe, como `frutas[10]`, el programa se detiene. Rust prefiere parar antes que darte un dato que no es.' },
  ],
  retos: [
    {
      id: 'rs-10-1',
      titulo: 'Tu lista',
      enunciado: 'Crea colores con vec! y rojo, verde y azul. Usa .len() y la posición 0 para mostrar: 3 colores, el primero es rojo',
      inicial: MAIN_VACIO,
      pista: 'let colores = vec!["rojo", "verde", "azul"]; y después colores.len() y colores[0]',
      solucion: 'fn main() {\n    let colores = vec!["rojo", "verde", "azul"];\n    println!("{} colores, el primero es {}", colores.len(), colores[0]);\n}',
      pruebas: [
        { t: 'src', re: '\\bvec!\\s*\\[', msg: 'Creas la lista con vec!' },
        { t: 'src', re: '\\.len\\s*\\(\\s*\\)', msg: 'Usas .len()' },
        { t: 'src', re: '\\[\\s*0\\s*\\]', msg: 'Usas la posición [0]' },
        { t: 'salida', igual: '3 colores, el primero es rojo', msg: 'Sale 3 colores, el primero es rojo' },
      ],
    },
    {
      id: 'rs-10-2',
      titulo: 'Recorrer la lista',
      enunciado: 'Recorre la lista con un for y muestra, por cada animal: Me gusta el (animal)',
      inicial: 'fn main() {\n    let animales = vec!["perro", "gato", "loro"];\n    \n}\n',
      pista: 'for a in &animales { println!("Me gusta el {}", a); }',
      solucion: 'fn main() {\n    let animales = vec!["perro", "gato", "loro"];\n    for a in &animales {\n        println!("Me gusta el {}", a);\n    }\n}',
      pruebas: [
        { t: 'src', re: '\\bfor\\s+\\w+\\s+in\\b', msg: 'Recorres con for … in' },
        { t: 'salida', igual: 'Me gusta el perro\nMe gusta el gato\nMe gusta el loro', msg: 'Sale un renglón por cada animal' },
      ],
    },
    {
      id: 'rs-10-3',
      titulo: 'Sumar la lista',
      enunciado: 'Escribe suma: recibe una lista prestada (&Vec<i32>) y devuelve la suma de todos sus números. El main ya la usa.',
      inicial: '// Escribe aquí la función suma\n\nfn main() {\n    let goles = vec![2, 0, 3, 1];\n    println!("{}", suma(&goles));\n}\n',
      pista: 'fn suma(numeros: &Vec<i32>) -> i32 { let mut total = 0; for n in numeros { total += n; } total }',
      solucion:
        'fn suma(numeros: &Vec<i32>) -> i32 {\n    let mut total = 0;\n    for n in numeros {\n        total += n;\n    }\n    total\n}\n\nfn main() {\n    let goles = vec![2, 0, 3, 1];\n    println!("{}", suma(&goles));\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+suma\\s*\\(', msg: 'Creas la función suma' },
        { t: 'src', re: '\\bfor\\b', msg: 'La recorres con for' },
        { t: 'salida', igual: '6', msg: 'Los goles suman 6' },
        { t: 'expr', code: 'suma(&vec![10, 20, 30])', igual: '60', msg: 'suma de 10, 20 y 30 es 60' },
        { t: 'expr', code: 'suma(&vec![])', igual: '0', msg: 'Una lista vacía suma 0' },
      ],
    },
    {
      id: 'rs-10-4',
      titulo: 'Los cuadrados',
      enunciado: 'Empieza una lista vacía con Vec::new(). Con un for del 1 al 5, mete el cuadrado de cada número (i * i) con push. Muestra la lista con {:?}:\n\n[1, 4, 9, 16, 25]',
      inicial: MAIN_VACIO,
      pista: 'let mut cuadrados = Vec::new(); for i in 1..=5 { cuadrados.push(i * i); } y println!("{:?}", cuadrados);',
      solucion: 'fn main() {\n    let mut cuadrados = Vec::new();\n    for i in 1..=5 {\n        cuadrados.push(i * i);\n    }\n    println!("{:?}", cuadrados);\n}',
      pruebas: [
        { t: 'src', re: '\\bVec::new\\s*\\(', msg: 'Empiezas con Vec::new()' },
        { t: 'src', re: '\\.push\\s*\\(', msg: 'Usas push' },
        { t: 'src', re: '\\{:\\?\\}', msg: 'Muestras la lista con {:?}' },
        { t: 'src', re: '16', not: true, msg: 'Los cuadrados los calcula Rust' },
        { t: 'salida', igual: '[1, 4, 9, 16, 25]', msg: 'Sale [1, 4, 9, 16, 25]' },
      ],
    },
    {
      id: 'rs-10-5',
      titulo: 'Piedra, papel o tijera',
      enunciado:
        'El gran final. Escribe partida: recibe dos jugadas (&str) y devuelve un String. Si alguna no está en la lista jugadas (usa .contains), devuelve Jugada inválida. Si son iguales, empate. Si la primera le gana a la segunda, gana 1; si no, gana 2. La piedra le gana a la tijera, la tijera al papel y el papel a la piedra.',
      inicial:
        '// Escribe aquí la función partida\n\nfn main() {\n    let j1 = preguntar("Jugador 1: ");\n    let j2 = preguntar("Jugador 2: ");\n    println!("{}", partida(&j1, &j2));\n}\n',
      entradas: ['piedra', 'tijera'],
      pista:
        'let jugadas = vec!["piedra", "papel", "tijera"]; y if !jugadas.contains(&a) || !jugadas.contains(&b) { … }. Para ganar: (a == "piedra" && b == "tijera") || …',
      solucion:
        'fn partida(a: &str, b: &str) -> String {\n    let jugadas = vec!["piedra", "papel", "tijera"];\n    if !jugadas.contains(&a) || !jugadas.contains(&b) {\n        return String::from("Jugada inválida");\n    }\n    if a == b {\n        return String::from("empate");\n    }\n    let gana_a = (a == "piedra" && b == "tijera") || (a == "tijera" && b == "papel") || (a == "papel" && b == "piedra");\n    if gana_a {\n        String::from("gana 1")\n    } else {\n        String::from("gana 2")\n    }\n}\n\nfn main() {\n    let j1 = preguntar("Jugador 1: ");\n    let j2 = preguntar("Jugador 2: ");\n    println!("{}", partida(&j1, &j2));\n}',
      pruebas: [
        { t: 'src', re: '\\.contains\\s*\\(', msg: 'Revisas la lista con .contains' },
        { t: 'linea', n: -1, igual: 'gana 1', msg: 'Piedra contra tijera: gana 1' },
        { t: 'linea', n: -1, igual: 'gana 2', entradas: ['piedra', 'papel'], msg: 'Piedra contra papel: gana 2' },
        { t: 'expr', code: 'partida("papel", "papel")', igual: '"empate"', msg: 'Papel contra papel: empate' },
        { t: 'expr', code: 'partida("tijera", "papel")', igual: '"gana 1"', msg: 'Tijera contra papel: gana 1' },
        { t: 'expr', code: 'partida("tijera", "piedra")', igual: '"gana 2"', msg: 'Tijera contra piedra: gana 2' },
        { t: 'expr', code: 'partida("lagarto", "piedra")', igual: '"Jugada inválida"', msg: 'Lagarto no se vale: Jugada inválida' },
      ],
    },
  ],
}

export const CURSO_RUST: Curso = {
  id: 'rust',
  titulo: 'Rust desde cero',
  emoji: '🦀',
  descripcion:
    'Tu primer paso en Rust, el lenguaje rápido y cuidadoso que usan Firefox, Discord y Windows. Desde el primer println! hasta funciones y listas, siempre al lado del JavaScript que ya sabes, cerrando con piedra, papel o tijera.',
  lenguaje: 'rust',
  despedida: 'Ya diste tus primeros pasos en Rust: ya eres un rustáceo 🦀.',
  lecciones: [L1, L2, L3, L4, L5, L6, L7, L8, L9, L10],
}
