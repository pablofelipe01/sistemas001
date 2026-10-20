import type { Curso, Leccion } from './tipos'

/*
 * La segunda parte del curso de Rust: 10 lecciones de 5 retos, para unas 4
 * horas y media de clase. Se abre cuando el alumno termina "Rust desde cero".
 *
 * Cuatro bloques: dueños y préstamos (L1 y L2), structs, enums y Option (L3 a
 * L5), colecciones e iteradores (L6 a L8), y errores y traits (L9 y L10, que
 * cierra con una mascota virtual que junta todo).
 *
 * Igual que en la primera parte, el código se compila en el Rust Playground
 * (ver corredor-rust.ts). Las pruebas `expr` son expresiones de Rust que se
 * imprimen con {:?}; pueden ser un bloque { … } que arma algo y devuelve lo
 * último, y ven lo que el alumno importó con `use`.
 *
 * Ojo: el calificador quita los comentarios tratando la comilla sencilla como
 * el inicio de un texto, así que aquí no se usan lifetimes ('a, 'static): solo
 * chars como 'a', que abren y cierran.
 *
 * Ojo al escribir textos: ConCodigo usa las comillas invertidas para marcar
 * código, así que en las explicaciones, enunciados y pistas no pueden ir
 * comillas invertidas sueltas.
 *
 * Cada reto tiene su solución de referencia. /verificar-curso?curso=rust-avanzado
 * las corre todas contra sus pruebas: si se cambia un reto, abrir esa página.
 */

/** El main vacío con que arrancan varios retos. */
const MAIN_VACIO = 'fn main() {\n    \n}\n'
const SIN_CLONE = { t: 'src', re: '\\.clone\\s*\\(', not: true, msg: 'Sin .clone(): con un préstamo' } as const
const SIN_CICLOS = { t: 'src', re: '\\b(for|while|loop)\\b', not: true, msg: 'Sin for, while ni loop: con iteradores' } as const

const L1: Leccion = {
  id: 'rsa-1',
  numero: 1,
  titulo: 'Cada cosa tiene un dueño',
  emoji: '🏷️',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Esta es la idea más famosa de Rust. Cada dato tiene un dueño, y solo uno. Cuando le pasas un `String` a otra variable, no se copia: se lo regalas. A eso se le llama mover, y la variable de antes queda vacía.',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let a = String::from("balón");\n    let b = a;            // a le regala el balón a b\n    println!("{}", b);\n    // println!("{}", a); ← esto no pasa: a ya no tiene nada\n}',
    },
    {
      t: 'p',
      texto:
        '¿Por qué? Así Rust sabe exactamente cuándo botar cada dato de la memoria: cuando su dueño se acaba. No hace falta un recolector de basura, y por eso Rust es tan rápido.',
    },
    {
      t: 'p',
      texto:
        'Los números (`i32`, `f64`), los `bool` y los `char` sí se copian solos: son pequeñitos. Y si de verdad quieres una copia de un `String`, la pides con `.clone()`.',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let x = 5;\n    let y = x;                   // los números se copian\n    println!("{} {}", x, y);\n\n    let a = String::from("balón");\n    let b = a.clone();           // una copia nueva\n    println!("{} y {}", a, b);\n}',
    },
    {
      t: 'p',
      texto:
        'Con las funciones pasa lo mismo: si una función recibe un `String`, se queda con él. Para pedirlo solo prestado, el parámetro lleva `&` y se llama con `&`.',
    },
    {
      t: 'codigo',
      codigo:
        'fn largo(s: &String) -> usize {\n    s.len()\n}\n\nfn main() {\n    let nombre = String::from("Ferris");\n    println!("{} tiene {} letras", nombre, largo(&nombre));\n}',
    },
    {
      t: 'ojo',
      texto: '`.clone()` siempre funciona, pero hace una copia completa. Úsalo solo cuando de verdad necesitas dos. Casi siempre basta con prestar.',
    },
  ],
  retos: [
    {
      id: 'rsa-1-1',
      titulo: 'Dos copias',
      enunciado: 'Corre el programa: original ya no tiene nada, porque se lo regaló a copia. Usa .clone() para que los dos tengan su dibujo.',
      inicial:
        'fn main() {\n    let original = String::from("dibujo de un gato");\n    let copia = original;\n    println!("Original: {}", original);\n    println!("Copia: {}", copia);\n}\n',
      pista: 'let copia = original.clone();',
      solucion:
        'fn main() {\n    let original = String::from("dibujo de un gato");\n    let copia = original.clone();\n    println!("Original: {}", original);\n    println!("Copia: {}", copia);\n}',
      pruebas: [
        { t: 'src', re: '\\boriginal\\.clone\\s*\\(', msg: 'Copias con original.clone()' },
        { t: 'salida', igual: 'Original: dibujo de un gato\nCopia: dibujo de un gato', msg: 'Los dos tienen su dibujo' },
      ],
    },
    {
      id: 'rsa-1-2',
      titulo: 'El nuevo dueño',
      enunciado: 'Otra vez el error de mover, pero aquí no hace falta una copia: el balón ya es de leo. Arregla la última línea sin usar .clone().',
      inicial:
        'fn main() {\n    let ana = String::from("balón");\n    let leo = ana;\n    println!("Leo tiene el {}", ana);\n}\n',
      pista: 'El balón ahora es de leo: muestra leo en vez de ana.',
      solucion: 'fn main() {\n    let ana = String::from("balón");\n    let leo = ana;\n    println!("Leo tiene el {}", leo);\n}',
      pruebas: [SIN_CLONE, { t: 'salida', igual: 'Leo tiene el balón', msg: 'Sale Leo tiene el balón' }],
    },
    {
      id: 'rsa-1-3',
      titulo: 'La función se lo quedó',
      enunciado:
        'Corre el programa: la primera llamada a saludar se quedó con nombre, y la segunda ya no tiene qué darle. Haz que saludar reciba el nombre prestado (&String), y llámala con &nombre. Sin .clone().',
      inicial:
        'fn saludar(nombre: String) {\n    println!("Hola, {}", nombre);\n}\n\nfn main() {\n    let nombre = String::from("Sara");\n    saludar(nombre);\n    saludar(nombre);\n}\n',
      pista: 'fn saludar(nombre: &String) y después saludar(&nombre);',
      solucion:
        'fn saludar(nombre: &String) {\n    println!("Hola, {}", nombre);\n}\n\nfn main() {\n    let nombre = String::from("Sara");\n    saludar(&nombre);\n    saludar(&nombre);\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+saludar\\s*\\(\\s*\\w+\\s*:\\s*&\\s*(String|str)\\b', msg: 'saludar recibe un préstamo' },
        { t: 'src', re: 'saludar\\s*\\(\\s*&\\s*nombre\\s*\\)', min: 2, msg: 'Las dos veces le prestas &nombre' },
        SIN_CLONE,
        { t: 'salida', igual: 'Hola, Sara\nHola, Sara', msg: 'Saluda dos veces a Sara' },
      ],
    },
    {
      id: 'rsa-1-4',
      titulo: 'Te lo devuelvo',
      enunciado:
        'Una función también puede devolver lo que recibió. Escribe emocionar: recibe un String, le agrega ¡! al final con push_str y lo devuelve. El main ya la usa.',
      inicial:
        '// Escribe aquí la función emocionar\n\nfn main() {\n    let frase = String::from("Me gusta Rust");\n    let frase = emocionar(frase);\n    println!("{}", frase);\n}\n',
      pista: 'fn emocionar(mut s: String) -> String { s.push_str("¡!"); s }',
      solucion:
        'fn emocionar(mut s: String) -> String {\n    s.push_str("¡!");\n    s\n}\n\nfn main() {\n    let frase = String::from("Me gusta Rust");\n    let frase = emocionar(frase);\n    println!("{}", frase);\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+emocionar\\s*\\([^)]*String\\s*\\)\\s*->\\s*String\\b', msg: 'emocionar recibe un String y lo devuelve' },
        { t: 'salida', igual: 'Me gusta Rust¡!', msg: 'Sale Me gusta Rust¡!' },
        { t: 'expr', code: 'emocionar(String::from("Hola"))', igual: '"Hola¡!"', msg: 'emocionar de Hola es Hola¡!' },
      ],
    },
    {
      id: 'rsa-1-5',
      titulo: 'Contar prestado',
      enunciado: 'Escribe vocales: recibe un texto prestado (&String) y devuelve cuántas vocales tiene (a, e, i, o, u), como usize. El main la usa y después vuelve a mostrar el texto.',
      inicial:
        '// Escribe aquí la función vocales\n\nfn main() {\n    let palabra = String::from("murcielago");\n    println!("{} vocales", vocales(&palabra));\n    println!("en {}", palabra);\n}\n',
      pista: 'Un for c in s.chars() y un contador. Para saber si es vocal: "aeiou".contains(c)',
      solucion:
        'fn vocales(s: &String) -> usize {\n    let mut cuantas = 0;\n    for c in s.chars() {\n        if "aeiou".contains(c) {\n            cuantas += 1;\n        }\n    }\n    cuantas\n}\n\nfn main() {\n    let palabra = String::from("murcielago");\n    println!("{} vocales", vocales(&palabra));\n    println!("en {}", palabra);\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+vocales\\s*\\(\\s*\\w+\\s*:\\s*&\\s*(String|str)\\s*\\)\\s*->\\s*usize\\b', msg: 'vocales recibe un préstamo y devuelve un usize' },
        { t: 'salida', igual: '5 vocales\nen murcielago', msg: 'Salen 5 vocales y la palabra' },
        { t: 'expr', code: 'vocales(&String::from("sol"))', igual: '1', msg: 'sol tiene 1 vocal' },
        { t: 'expr', code: 'vocales(&String::from("xyz"))', igual: '0', msg: 'xyz no tiene vocales' },
      ],
    },
  ],
}

const L2: Leccion = {
  id: 'rsa-2',
  numero: 2,
  titulo: 'Prestar para cambiar',
  emoji: '🤝',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Un préstamo con `&` es solo para mirar. Si la función necesita cambiar lo que le prestan, se pide con `&mut`: un préstamo para cambiar. La variable tiene que ser `mut`, y se presta con `&mut`.',
    },
    {
      t: 'codigo',
      codigo:
        'fn agregar(lista: &mut Vec<String>, cosa: &str) {\n    lista.push(cosa.to_string());\n}\n\nfn main() {\n    let mut maleta = Vec::new();\n    agregar(&mut maleta, "linterna");\n    agregar(&mut maleta, "agua");\n    println!("{:?}", maleta);\n}',
    },
    {
      t: 'p',
      texto:
        'Cuando te prestan un número para cambiarlo, se le pone `*` adelante para llegar al número: `*nivel += 1`. El `*` quiere decir “lo que hay adentro del préstamo”.',
    },
    {
      t: 'codigo',
      codigo: 'fn subir(nivel: &mut i32) {\n    *nivel += 1;\n}\n\nfn main() {\n    let mut nivel = 1;\n    subir(&mut nivel);\n    subir(&mut nivel);\n    println!("Nivel {}", nivel);\n}',
    },
    {
      t: 'p',
      texto:
        'La gran regla: puedes prestar algo a muchos para mirar, o a uno solo para cambiar, pero no las dos cosas al tiempo. Así nunca pasa que alguien mire una lista justo mientras otro la está cambiando.',
    },
    { t: 'ojo', texto: 'Hay tres formas de pasar algo: sin nada (lo regalas), con `&` (lo prestas para mirar) y con `&mut` (lo prestas para cambiar).' },
  ],
  retos: [
    {
      id: 'rsa-2-1',
      titulo: 'Solo para mirar',
      enunciado: 'Escribe mostrar: recibe la lista prestada (&Vec<i32>) y muestra cuántos datos tiene así: La lista tiene 3 datos. El main la llama dos veces, así que no se la puede quedar.',
      inicial: '// Escribe aquí la función mostrar\n\nfn main() {\n    let goles = vec![2, 0, 1];\n    mostrar(&goles);\n    mostrar(&goles);\n}\n',
      pista: 'fn mostrar(v: &Vec<i32>) { println!("La lista tiene {} datos", v.len()); }',
      solucion: 'fn mostrar(v: &Vec<i32>) {\n    println!("La lista tiene {} datos", v.len());\n}\n\nfn main() {\n    let goles = vec![2, 0, 1];\n    mostrar(&goles);\n    mostrar(&goles);\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+mostrar\\s*\\(\\s*\\w+\\s*:\\s*&\\s*Vec\\s*<\\s*i32\\s*>\\s*\\)', msg: 'mostrar recibe &Vec<i32>' },
        { t: 'salida', igual: 'La lista tiene 3 datos\nLa lista tiene 3 datos', msg: 'Sale dos veces La lista tiene 3 datos' },
      ],
    },
    {
      id: 'rsa-2-2',
      titulo: 'La maleta',
      enunciado: 'Escribe empacar: recibe la maleta prestada para cambiar (&mut Vec<String>) y una cosa (&str), y la mete en la maleta.',
      inicial:
        '// Escribe aquí la función empacar\n\nfn main() {\n    let mut maleta = Vec::new();\n    empacar(&mut maleta, "linterna");\n    empacar(&mut maleta, "agua");\n    empacar(&mut maleta, "mapa");\n    println!("{:?}", maleta);\n}\n',
      pista: 'fn empacar(maleta: &mut Vec<String>, cosa: &str) { maleta.push(cosa.to_string()); }',
      solucion:
        'fn empacar(maleta: &mut Vec<String>, cosa: &str) {\n    maleta.push(cosa.to_string());\n}\n\nfn main() {\n    let mut maleta = Vec::new();\n    empacar(&mut maleta, "linterna");\n    empacar(&mut maleta, "agua");\n    empacar(&mut maleta, "mapa");\n    println!("{:?}", maleta);\n}',
      pruebas: [
        { t: 'src', re: '&\\s*mut\\s+Vec\\s*<\\s*String\\s*>', msg: 'empacar recibe &mut Vec<String>' },
        { t: 'salida', igual: '["linterna", "agua", "mapa"]', msg: 'Sale ["linterna", "agua", "mapa"]' },
      ],
    },
    {
      id: 'rsa-2-3',
      titulo: 'Subir de nivel',
      enunciado: 'Escribe subir: recibe el nivel prestado para cambiar (&mut i32) y le suma 1. El main la llama tres veces y muestra Nivel 4.',
      inicial: '// Escribe aquí la función subir\n\nfn main() {\n    let mut nivel = 1;\n    subir(&mut nivel);\n    subir(&mut nivel);\n    subir(&mut nivel);\n    println!("Nivel {}", nivel);\n}\n',
      pista: 'fn subir(nivel: &mut i32) { *nivel += 1; }',
      solucion: 'fn subir(nivel: &mut i32) {\n    *nivel += 1;\n}\n\nfn main() {\n    let mut nivel = 1;\n    subir(&mut nivel);\n    subir(&mut nivel);\n    subir(&mut nivel);\n    println!("Nivel {}", nivel);\n}',
      pruebas: [
        { t: 'src', re: '&\\s*mut\\s+i32\\b', msg: 'subir recibe &mut i32' },
        { t: 'src', re: '\\*\\s*\\w+\\s*\\+=', msg: 'Cambias el número con *' },
        { t: 'salida', igual: 'Nivel 4', msg: 'Sale Nivel 4' },
      ],
    },
    {
      id: 'rsa-2-4',
      titulo: 'Arregla el préstamo',
      enunciado: 'Corre el programa: gritar quiere cambiar el texto, pero se lo prestaron solo para mirar. Arregla el parámetro y la llamada para que muestre hola!!!',
      inicial: 'fn gritar(s: &String) {\n    s.push_str("!!!");\n}\n\nfn main() {\n    let mut saludo = String::from("hola");\n    gritar(&saludo);\n    println!("{}", saludo);\n}\n',
      pista: 'fn gritar(s: &mut String) y gritar(&mut saludo);',
      solucion: 'fn gritar(s: &mut String) {\n    s.push_str("!!!");\n}\n\nfn main() {\n    let mut saludo = String::from("hola");\n    gritar(&mut saludo);\n    println!("{}", saludo);\n}',
      pruebas: [
        { t: 'src', re: '&\\s*mut\\s+String\\b', msg: 'gritar recibe &mut String' },
        { t: 'src', re: 'gritar\\s*\\(\\s*&\\s*mut\\s+saludo\\s*\\)', msg: 'Le prestas &mut saludo' },
        { t: 'salida', igual: 'hola!!!', msg: 'Sale hola!!!' },
      ],
    },
    {
      id: 'rsa-2-5',
      titulo: 'Todo al doble',
      enunciado:
        'Escribe duplicar: recibe una lista prestada para cambiar (&mut Vec<i32>) y deja cada número multiplicado por 2. Para recorrerla cambiando, usa for x in v.iter_mut() y adentro *x *= 2.',
      inicial: '// Escribe aquí la función duplicar\n\nfn main() {\n    let mut puntos = vec![1, 5, 10];\n    duplicar(&mut puntos);\n    println!("{:?}", puntos);\n}\n',
      pista: 'fn duplicar(v: &mut Vec<i32>) { for x in v.iter_mut() { *x *= 2; } }',
      solucion:
        'fn duplicar(v: &mut Vec<i32>) {\n    for x in v.iter_mut() {\n        *x *= 2;\n    }\n}\n\nfn main() {\n    let mut puntos = vec![1, 5, 10];\n    duplicar(&mut puntos);\n    println!("{:?}", puntos);\n}',
      pruebas: [
        { t: 'src', re: '&\\s*mut\\s+Vec\\s*<\\s*i32\\s*>', msg: 'duplicar recibe &mut Vec<i32>' },
        { t: 'salida', igual: '[2, 10, 20]', msg: 'Sale [2, 10, 20]' },
        { t: 'expr', code: '{ let mut v = vec![3, 0, -1]; duplicar(&mut v); v }', igual: '[6, 0, -2]', msg: 'Con [3, 0, -1] queda [6, 0, -2]' },
      ],
    },
  ],
}

const L3: Leccion = {
  id: 'rsa-3',
  numero: 3,
  titulo: 'Structs',
  emoji: '🧱',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Un `struct` junta varios datos con nombre, como un objeto de JavaScript. Primero se dice qué campos tiene y de qué tipo; después se crean los datos.',
    },
    {
      t: 'compara',
      js: 'const gato = { nombre: "Michi", edad: 3 };\nconsole.log(gato.nombre);',
      py: 'struct Mascota {\n    nombre: String,\n    edad: u32,\n}\n\nlet gato = Mascota { nombre: String::from("Michi"), edad: 3 };\nprintln!("{}", gato.nombre);',
    },
    {
      t: 'p',
      texto:
        '`u32` es un entero que no puede ser negativo: perfecto para edades. Y con `impl` le das funciones a tu struct. Las que reciben `&self` son métodos: se llaman con punto, y `self` es el dato mismo.',
    },
    {
      t: 'codigo',
      codigo:
        'struct Rectangulo {\n    ancho: u32,\n    alto: u32,\n}\n\nimpl Rectangulo {\n    fn nuevo(ancho: u32, alto: u32) -> Rectangulo {\n        Rectangulo { ancho, alto }\n    }\n\n    fn area(&self) -> u32 {\n        self.ancho * self.alto\n    }\n}\n\nfn main() {\n    let r = Rectangulo::nuevo(3, 4);\n    println!("Área: {}", r.area());\n}',
    },
    {
      t: 'p',
      texto:
        '`nuevo` no recibe self: se llama con `::`, como `String::from`. Es la costumbre para crear. Y fíjate en `Rectangulo { ancho, alto }`: si la variable se llama igual que el campo, basta con escribirla una vez.',
    },
    {
      t: 'ojo',
      texto: 'Un método que cambia el struct recibe `&mut self`, y el struct tiene que estar en una variable `mut`.',
    },
  ],
  retos: [
    {
      id: 'rsa-3-1',
      titulo: 'Tu primer struct',
      enunciado: 'Crea el struct Libro con titulo (String) y paginas (u32). Crea uno con El Principito y 96 páginas, y muestra: El Principito tiene 96 páginas',
      inicial: '// Crea aquí el struct Libro\n\nfn main() {\n    \n}\n',
      pista: 'struct Libro { titulo: String, paginas: u32 } y después let libro = Libro { titulo: String::from("El Principito"), paginas: 96 };',
      solucion:
        'struct Libro {\n    titulo: String,\n    paginas: u32,\n}\n\nfn main() {\n    let libro = Libro { titulo: String::from("El Principito"), paginas: 96 };\n    println!("{} tiene {} páginas", libro.titulo, libro.paginas);\n}',
      pruebas: [
        { t: 'src', re: '\\bstruct\\s+Libro\\b', msg: 'Creas el struct Libro' },
        { t: 'src', re: '\\bpaginas\\s*:\\s*u32\\b', msg: 'paginas es u32' },
        { t: 'salida', igual: 'El Principito tiene 96 páginas', msg: 'Sale El Principito tiene 96 páginas' },
      ],
    },
    {
      id: 'rsa-3-2',
      titulo: 'Puntos para el jugador',
      enunciado: 'El jugador hizo un gol: súmale 10 a sus puntos y muestra Rayo: 110 puntos. Ojo, para cambiar un campo la variable tiene que ser mut.',
      inicial:
        'struct Jugador {\n    apodo: String,\n    puntos: u32,\n}\n\nfn main() {\n    let jugador = Jugador { apodo: String::from("Rayo"), puntos: 100 };\n    \n    println!("{}: {} puntos", jugador.apodo, jugador.puntos);\n}\n',
      pista: 'let mut jugador = … y después jugador.puntos += 10;',
      solucion:
        'struct Jugador {\n    apodo: String,\n    puntos: u32,\n}\n\nfn main() {\n    let mut jugador = Jugador { apodo: String::from("Rayo"), puntos: 100 };\n    jugador.puntos += 10;\n    println!("{}: {} puntos", jugador.apodo, jugador.puntos);\n}',
      pruebas: [
        { t: 'src', re: '\\bjugador\\.puntos\\s*(\\+=|=)', msg: 'Cambias jugador.puntos' },
        { t: 'salida', igual: 'Rayo: 110 puntos', msg: 'Sale Rayo: 110 puntos' },
      ],
    },
    {
      id: 'rsa-3-3',
      titulo: 'El constructor',
      enunciado: 'Dale al struct Punto una función nuevo, adentro de un impl: recibe x y y y devuelve el Punto.',
      inicial:
        'struct Punto {\n    x: i32,\n    y: i32,\n}\n\n// Escribe aquí el impl con la función nuevo\n\nfn main() {\n    let p = Punto::nuevo(3, 4);\n    println!("({}, {})", p.x, p.y);\n}\n',
      pista: 'impl Punto { fn nuevo(x: i32, y: i32) -> Punto { Punto { x, y } } }',
      solucion:
        'struct Punto {\n    x: i32,\n    y: i32,\n}\n\nimpl Punto {\n    fn nuevo(x: i32, y: i32) -> Punto {\n        Punto { x, y }\n    }\n}\n\nfn main() {\n    let p = Punto::nuevo(3, 4);\n    println!("({}, {})", p.x, p.y);\n}',
      pruebas: [
        { t: 'src', re: '\\bimpl\\s+Punto\\b', msg: 'Escribes impl Punto' },
        { t: 'salida', igual: '(3, 4)', msg: 'Sale (3, 4)' },
        { t: 'expr', code: 'Punto::nuevo(-2, 7).y', igual: '7', msg: 'Punto::nuevo(-2, 7) tiene y = 7' },
      ],
    },
    {
      id: 'rsa-3-4',
      titulo: 'Un método',
      enunciado: 'Dale a Rectangulo dos métodos que reciben &self: area (ancho por alto) y es_cuadrado (true si el ancho y el alto son iguales).',
      inicial:
        'struct Rectangulo {\n    ancho: u32,\n    alto: u32,\n}\n\n// Escribe aquí el impl con area y es_cuadrado\n\nfn main() {\n    let r = Rectangulo { ancho: 3, alto: 4 };\n    println!("{} {}", r.area(), r.es_cuadrado());\n}\n',
      pista: 'fn area(&self) -> u32 { self.ancho * self.alto } y fn es_cuadrado(&self) -> bool { self.ancho == self.alto }',
      solucion:
        'struct Rectangulo {\n    ancho: u32,\n    alto: u32,\n}\n\nimpl Rectangulo {\n    fn area(&self) -> u32 {\n        self.ancho * self.alto\n    }\n\n    fn es_cuadrado(&self) -> bool {\n        self.ancho == self.alto\n    }\n}\n\nfn main() {\n    let r = Rectangulo { ancho: 3, alto: 4 };\n    println!("{} {}", r.area(), r.es_cuadrado());\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+area\\s*\\(\\s*&\\s*self\\s*\\)', msg: 'area recibe &self' },
        { t: 'salida', igual: '12 false', msg: 'Sale 12 false' },
        { t: 'expr', code: 'Rectangulo { ancho: 5, alto: 5 }.area()', igual: '25', msg: 'Un 5 por 5 tiene área 25' },
        { t: 'expr', code: 'Rectangulo { ancho: 5, alto: 5 }.es_cuadrado()', igual: 'true', msg: 'Un 5 por 5 es cuadrado' },
      ],
    },
    {
      id: 'rsa-3-5',
      titulo: 'La alcancía',
      enunciado:
        'Crea el struct Alcancia con total (u32) y su impl: nueva() devuelve una alcancía en 0, meter(&mut self, monedas: u32) suma las monedas, y cuanto(&self) -> u32 dice cuánto hay.',
      inicial: '// Escribe aquí el struct Alcancia y su impl\n\nfn main() {\n    let mut a = Alcancia::nueva();\n    a.meter(500);\n    a.meter(200);\n    println!("Hay {}", a.cuanto());\n}\n',
      pista: 'fn nueva() -> Alcancia { Alcancia { total: 0 } }. En meter: self.total += monedas;',
      solucion:
        'struct Alcancia {\n    total: u32,\n}\n\nimpl Alcancia {\n    fn nueva() -> Alcancia {\n        Alcancia { total: 0 }\n    }\n\n    fn meter(&mut self, monedas: u32) {\n        self.total += monedas;\n    }\n\n    fn cuanto(&self) -> u32 {\n        self.total\n    }\n}\n\nfn main() {\n    let mut a = Alcancia::nueva();\n    a.meter(500);\n    a.meter(200);\n    println!("Hay {}", a.cuanto());\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+meter\\s*\\(\\s*&\\s*mut\\s+self\\b', msg: 'meter recibe &mut self' },
        { t: 'salida', igual: 'Hay 700', msg: 'Sale Hay 700' },
        { t: 'expr', code: 'Alcancia::nueva().cuanto()', igual: '0', msg: 'Una alcancía nueva tiene 0' },
        { t: 'expr', code: '{ let mut a = Alcancia::nueva(); a.meter(1000); a.meter(50); a.cuanto() }', igual: '1050', msg: 'Con 1000 y 50 hay 1050' },
      ],
    },
  ],
}

const L4: Leccion = {
  id: 'rsa-4',
  numero: 4,
  titulo: 'Enums y match',
  emoji: '🎛️',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto: 'Un `enum` es un tipo que solo puede ser una de varias opciones. Es como las uniones de TypeScript, pero con nombre propio para cada opción.',
    },
    {
      t: 'codigo',
      codigo:
        'enum Luz {\n    Rojo,\n    Amarillo,\n    Verde,\n}\n\nfn que_hago(luz: Luz) -> String {\n    match luz {\n        Luz::Rojo => String::from("Para"),\n        Luz::Amarillo => String::from("Cuidado"),\n        Luz::Verde => String::from("Pasa"),\n    }\n}\n\nfn main() {\n    println!("{}", que_hago(Luz::Verde));\n}',
    },
    {
      t: 'p',
      texto:
        'Lo poderoso: cada opción puede llevar sus propios datos. Y en el `match` los sacas con un nombre. Además, Rust no te deja olvidar una opción: si falta, no compila.',
    },
    {
      t: 'codigo',
      codigo:
        'enum Figura {\n    Circulo(f64),\n    Rectangulo(f64, f64),\n}\n\nfn area(f: Figura) -> f64 {\n    match f {\n        Figura::Circulo(radio) => 3.0 * radio * radio,\n        Figura::Rectangulo(base, alto) => base * alto,\n    }\n}\n\nfn main() {\n    println!("{}", area(Figura::Circulo(2.0)));\n    println!("{}", area(Figura::Rectangulo(2.0, 5.0)));\n}',
    },
    {
      t: 'p',
      texto: 'Y si arriba del enum pones `#[derive(Debug)]`, lo puedes mostrar con `{:?}`. Más adelante verás qué es ese derive.',
    },
    { t: 'ojo', texto: 'Las opciones se escriben con el nombre del enum adelante y dos veces dos puntos: `Luz::Rojo`, no `Rojo` a secas.' },
  ],
  retos: [
    {
      id: 'rsa-4-1',
      titulo: 'El semáforo',
      enunciado: 'Escribe que_hago con un match: con Rojo devuelve Para, con Amarillo Cuidado y con Verde Pasa.',
      inicial:
        'enum Luz {\n    Rojo,\n    Amarillo,\n    Verde,\n}\n\n// Escribe aquí la función que_hago\n\nfn main() {\n    println!("{}", que_hago(Luz::Rojo));\n}\n',
      pista: 'fn que_hago(luz: Luz) -> String { match luz { Luz::Rojo => String::from("Para"), … } }',
      solucion:
        'enum Luz {\n    Rojo,\n    Amarillo,\n    Verde,\n}\n\nfn que_hago(luz: Luz) -> String {\n    match luz {\n        Luz::Rojo => String::from("Para"),\n        Luz::Amarillo => String::from("Cuidado"),\n        Luz::Verde => String::from("Pasa"),\n    }\n}\n\nfn main() {\n    println!("{}", que_hago(Luz::Rojo));\n}',
      pruebas: [
        { t: 'src', re: '\\bmatch\\b', msg: 'Usas match' },
        { t: 'salida', igual: 'Para', msg: 'Con Rojo sale Para' },
        { t: 'expr', code: 'que_hago(Luz::Amarillo)', igual: '"Cuidado"', msg: 'Con Amarillo: Cuidado' },
        { t: 'expr', code: 'que_hago(Luz::Verde)', igual: '"Pasa"', msg: 'Con Verde: Pasa' },
      ],
    },
    {
      id: 'rsa-4-2',
      titulo: 'La brújula',
      enunciado: 'Escribe girar: recibe una Direccion y devuelve la que queda a su derecha. Norte → Este → Sur → Oeste → Norte.',
      inicial:
        '#[derive(Debug)]\nenum Direccion {\n    Norte,\n    Este,\n    Sur,\n    Oeste,\n}\n\n// Escribe aquí la función girar\n\nfn main() {\n    println!("{:?}", girar(Direccion::Norte));\n}\n',
      pista: 'fn girar(d: Direccion) -> Direccion { match d { Direccion::Norte => Direccion::Este, … } }',
      solucion:
        '#[derive(Debug)]\nenum Direccion {\n    Norte,\n    Este,\n    Sur,\n    Oeste,\n}\n\nfn girar(d: Direccion) -> Direccion {\n    match d {\n        Direccion::Norte => Direccion::Este,\n        Direccion::Este => Direccion::Sur,\n        Direccion::Sur => Direccion::Oeste,\n        Direccion::Oeste => Direccion::Norte,\n    }\n}\n\nfn main() {\n    println!("{:?}", girar(Direccion::Norte));\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+girar\\s*\\(\\s*\\w+\\s*:\\s*Direccion\\s*\\)\\s*->\\s*Direccion\\b', msg: 'girar recibe y devuelve una Direccion' },
        { t: 'salida', igual: 'Este', msg: 'Del Norte se gira al Este' },
        { t: 'expr', code: 'girar(Direccion::Sur)', igual: 'Oeste', msg: 'Del Sur, al Oeste' },
        { t: 'expr', code: 'girar(Direccion::Oeste)', igual: 'Norte', msg: 'Del Oeste, al Norte' },
        { t: 'expr', code: 'girar(girar(Direccion::Este))', igual: 'Oeste', msg: 'Dos giros desde el Este: Oeste' },
      ],
    },
    {
      id: 'rsa-4-3',
      titulo: 'Figuras con datos',
      enunciado:
        'Crea el enum Figura con Circulo(f64), que trae el radio, y Cuadrado(f64), que trae el lado. Escribe area: el círculo da 3.0 * radio * radio y el cuadrado lado * lado.',
      inicial: '// Crea aquí el enum Figura y la función area\n\nfn main() {\n    println!("{}", area(Figura::Cuadrado(3.0)));\n}\n',
      pista: 'enum Figura { Circulo(f64), Cuadrado(f64) }. En el match: Figura::Circulo(r) => 3.0 * r * r,',
      solucion:
        'enum Figura {\n    Circulo(f64),\n    Cuadrado(f64),\n}\n\nfn area(f: Figura) -> f64 {\n    match f {\n        Figura::Circulo(r) => 3.0 * r * r,\n        Figura::Cuadrado(lado) => lado * lado,\n    }\n}\n\nfn main() {\n    println!("{}", area(Figura::Cuadrado(3.0)));\n}',
      pruebas: [
        { t: 'src', re: '\\benum\\s+Figura\\b', msg: 'Creas el enum Figura' },
        { t: 'salida', igual: '9', msg: 'El cuadrado de lado 3 da 9' },
        { t: 'expr', code: 'area(Figura::Circulo(2.0))', igual: '12.0', msg: 'El círculo de radio 2 da 12.0' },
        { t: 'expr', code: 'area(Figura::Cuadrado(0.5))', igual: '0.25', msg: 'El cuadrado de lado 0.5 da 0.25' },
      ],
    },
    {
      id: 'rsa-4-4',
      titulo: 'Falta un caso',
      enunciado: 'Alguien agregó el triángulo a Figura, pero no al match. Corre el programa y lee el error. Agrega el caso que falta: base * altura / 2.0.',
      inicial:
        'enum Figura {\n    Circulo(f64),\n    Cuadrado(f64),\n    Triangulo(f64, f64),\n}\n\nfn area(f: Figura) -> f64 {\n    match f {\n        Figura::Circulo(r) => 3.0 * r * r,\n        Figura::Cuadrado(lado) => lado * lado,\n    }\n}\n\nfn main() {\n    println!("{}", area(Figura::Triangulo(6.0, 4.0)));\n}\n',
      pista: 'Figura::Triangulo(base, altura) => base * altura / 2.0,',
      solucion:
        'enum Figura {\n    Circulo(f64),\n    Cuadrado(f64),\n    Triangulo(f64, f64),\n}\n\nfn area(f: Figura) -> f64 {\n    match f {\n        Figura::Circulo(r) => 3.0 * r * r,\n        Figura::Cuadrado(lado) => lado * lado,\n        Figura::Triangulo(base, altura) => base * altura / 2.0,\n    }\n}\n\nfn main() {\n    println!("{}", area(Figura::Triangulo(6.0, 4.0)));\n}',
      pruebas: [
        { t: 'src', re: '\\b_\\s*=>', not: true, msg: 'Sin _: cada figura con su caso' },
        { t: 'salida', igual: '12', msg: 'El triángulo de 6 por 4 da 12' },
        { t: 'expr', code: 'area(Figura::Circulo(1.0))', igual: '3.0', msg: 'El círculo sigue bien' },
      ],
    },
    {
      id: 'rsa-4-5',
      titulo: 'Mensajes del chat',
      enunciado:
        'Escribe mostrar: recibe un Mensaje prestado y devuelve un String. Un Texto se muestra tal cual, una Foto así: Foto: (url), y Salir así: (se fue del chat)',
      inicial:
        'enum Mensaje {\n    Texto(String),\n    Foto(String),\n    Salir,\n}\n\n// Escribe aquí la función mostrar\n\nfn main() {\n    let m = Mensaje::Foto(String::from("playa.jpg"));\n    println!("{}", mostrar(&m));\n}\n',
      pista: 'fn mostrar(m: &Mensaje) -> String { match m { Mensaje::Texto(t) => t.clone(), Mensaje::Foto(url) => format!("Foto: {}", url), Mensaje::Salir => … } }',
      solucion:
        'enum Mensaje {\n    Texto(String),\n    Foto(String),\n    Salir,\n}\n\nfn mostrar(m: &Mensaje) -> String {\n    match m {\n        Mensaje::Texto(t) => t.clone(),\n        Mensaje::Foto(url) => format!("Foto: {}", url),\n        Mensaje::Salir => String::from("(se fue del chat)"),\n    }\n}\n\nfn main() {\n    let m = Mensaje::Foto(String::from("playa.jpg"));\n    println!("{}", mostrar(&m));\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+mostrar\\s*\\(\\s*\\w+\\s*:\\s*&\\s*Mensaje\\s*\\)\\s*->\\s*String\\b', msg: 'mostrar recibe &Mensaje y devuelve un String' },
        { t: 'salida', igual: 'Foto: playa.jpg', msg: 'Sale Foto: playa.jpg' },
        { t: 'expr', code: 'mostrar(&Mensaje::Texto(String::from("hola")))', igual: '"hola"', msg: 'Un texto sale tal cual' },
        { t: 'expr', code: 'mostrar(&Mensaje::Salir)', igual: '"(se fue del chat)"', msg: 'Salir: (se fue del chat)' },
      ],
    },
  ],
}

const L5: Leccion = {
  id: 'rsa-5',
  numero: 5,
  titulo: 'Option: algo o nada',
  emoji: '🎁',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'En JavaScript, cuando algo no está, sale `undefined` o `null`, y si te olvidas de revisarlo, el programa se rompe. En Rust no existen. En su lugar está `Option`: un enum que es `Some(dato)` cuando hay algo, o `None` cuando no hay nada.',
    },
    {
      t: 'codigo',
      codigo:
        'fn buscar(lista: &Vec<&str>, nombre: &str) -> Option<usize> {\n    for i in 0..lista.len() {\n        if lista[i] == nombre {\n            return Some(i);\n        }\n    }\n    None\n}\n\nfn main() {\n    let curso = vec!["Ana", "Leo", "Sara"];\n    println!("{:?}", buscar(&curso, "Leo"));\n    println!("{:?}", buscar(&curso, "Tom"));\n}',
    },
    {
      t: 'p',
      texto:
        'Para usar lo que hay adentro, Rust te obliga a preguntar. Con `match`, o con `if let` cuando solo te importa un caso. Y `unwrap_or` te da el dato o, si no hay, uno por si acaso.',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let notas = vec![4, 5, 3];\n\n    match notas.get(1) {\n        Some(n) => println!("La segunda nota es {}", n),\n        None => println!("No hay segunda nota"),\n    }\n\n    if let Some(n) = notas.get(10) {\n        println!("La nota 10 es {}", n);\n    } else {\n        println!("No hay nota 10");\n    }\n\n    let apodo: Option<&str> = None;\n    println!("Hola, {}", apodo.unwrap_or("amigo"));\n}',
    },
    {
      t: 'ojo',
      texto: '`lista[10]` detiene el programa si no existe, pero `lista.get(10)` te devuelve `None`. Cuando no sepas si la posición existe, usa `get`.',
    },
  ],
  retos: [
    {
      id: 'rsa-5-1',
      titulo: '¿Dónde está?',
      enunciado: 'Escribe buscar: recibe la lista y un nombre, y devuelve Some(posición) si lo encuentra o None si no está. Su tipo de salida es Option<usize>.',
      inicial: '// Escribe aquí la función buscar\n\nfn main() {\n    let curso = vec!["Ana", "Leo", "Sara"];\n    println!("{:?}", buscar(&curso, "Sara"));\n}\n',
      pista: 'Recorre con for i in 0..lista.len(). Si lista[i] == nombre, return Some(i). Al final, None.',
      solucion:
        'fn buscar(lista: &Vec<&str>, nombre: &str) -> Option<usize> {\n    for i in 0..lista.len() {\n        if lista[i] == nombre {\n            return Some(i);\n        }\n    }\n    None\n}\n\nfn main() {\n    let curso = vec!["Ana", "Leo", "Sara"];\n    println!("{:?}", buscar(&curso, "Sara"));\n}',
      pruebas: [
        { t: 'src', re: '->\\s*Option\\s*<\\s*usize\\s*>', msg: 'buscar devuelve Option<usize>' },
        { t: 'salida', igual: 'Some(2)', msg: 'Sara está en la posición 2' },
        { t: 'expr', code: 'buscar(&vec!["Ana", "Leo"], "Ana")', igual: 'Some(0)', msg: 'Ana está en la 0' },
        { t: 'expr', code: 'buscar(&vec!["Ana", "Leo"], "Tom")', igual: 'None', msg: 'Tom no está: None' },
      ],
    },
    {
      id: 'rsa-5-2',
      titulo: '¿Hay o no hay?',
      enunciado: 'Escribe describir con un match: con Some(n) devuelve Hay (n), y con None devuelve No hay nada.',
      inicial: '// Escribe aquí la función describir\n\nfn main() {\n    println!("{}", describir(Some(3)));\n    println!("{}", describir(None));\n}\n',
      pista: 'fn describir(o: Option<i32>) -> String { match o { Some(n) => format!("Hay {}", n), None => … } }',
      solucion:
        'fn describir(o: Option<i32>) -> String {\n    match o {\n        Some(n) => format!("Hay {}", n),\n        None => String::from("No hay nada"),\n    }\n}\n\nfn main() {\n    println!("{}", describir(Some(3)));\n    println!("{}", describir(None));\n}',
      pruebas: [
        { t: 'src', re: '\\bmatch\\b', msg: 'Usas match' },
        { t: 'salida', igual: 'Hay 3\nNo hay nada', msg: 'Salen Hay 3 y No hay nada' },
        { t: 'expr', code: 'describir(Some(42))', igual: '"Hay 42"', msg: 'Con Some(42): Hay 42' },
      ],
    },
    {
      id: 'rsa-5-3',
      titulo: 'El apodo',
      enunciado: 'Escribe saludo: recibe un apodo que puede no estar (Option<&str>) y el nombre. Saluda con el apodo si hay, o con el nombre si no: Hola, (quien). Usa unwrap_or.',
      inicial: '// Escribe aquí la función saludo\n\nfn main() {\n    println!("{}", saludo(Some("Rayo"), "Andrés"));\n    println!("{}", saludo(None, "Sofía"));\n}\n',
      pista: 'format!("Hola, {}", apodo.unwrap_or(nombre))',
      solucion:
        'fn saludo(apodo: Option<&str>, nombre: &str) -> String {\n    format!("Hola, {}", apodo.unwrap_or(nombre))\n}\n\nfn main() {\n    println!("{}", saludo(Some("Rayo"), "Andrés"));\n    println!("{}", saludo(None, "Sofía"));\n}',
      pruebas: [
        { t: 'src', re: '\\.unwrap_or\\s*\\(', msg: 'Usas unwrap_or' },
        { t: 'salida', igual: 'Hola, Rayo\nHola, Sofía', msg: 'Salen Hola, Rayo y Hola, Sofía' },
        { t: 'expr', code: 'saludo(None, "Leo")', igual: '"Hola, Leo"', msg: 'Sin apodo, con el nombre' },
      ],
    },
    {
      id: 'rsa-5-4',
      titulo: 'La posición que pidan',
      enunciado: 'Pregunta una posición y, con if let y .get(), muestra El premio es (premio). Si esa posición no existe: No hay premio ahí',
      inicial: 'fn main() {\n    let premios = vec!["balón", "medalla", "libro"];\n    let i: usize = preguntar("¿Qué posición? ").parse().unwrap();\n    \n}\n',
      entradas: ['1'],
      pista: 'if let Some(p) = premios.get(i) { … } else { … }',
      solucion:
        'fn main() {\n    let premios = vec!["balón", "medalla", "libro"];\n    let i: usize = preguntar("¿Qué posición? ").parse().unwrap();\n    if let Some(p) = premios.get(i) {\n        println!("El premio es {}", p);\n    } else {\n        println!("No hay premio ahí");\n    }\n}',
      pruebas: [
        { t: 'src', re: '\\bif\\s+let\\s+Some\\b', msg: 'Usas if let Some' },
        { t: 'src', re: '\\.get\\s*\\(', msg: 'Usas .get()' },
        { t: 'linea', n: -1, igual: 'El premio es medalla', msg: 'En la 1 está la medalla' },
        { t: 'linea', n: -1, igual: 'El premio es balón', entradas: ['0'], msg: 'En la 0 está el balón' },
        { t: 'linea', n: -1, igual: 'No hay premio ahí', entradas: ['7'], msg: 'En la 7 no hay nada' },
      ],
    },
    {
      id: 'rsa-5-5',
      titulo: 'La división segura',
      enunciado: 'Escribe dividir: devuelve None si b es 0, o Some(a / b) si no. Después pregunta dos números y muestra Da (resultado) o No se puede dividir por cero.',
      inicial: MAIN_VACIO,
      entradas: ['10', '2'],
      pista: 'fn dividir(a: i32, b: i32) -> Option<i32>. En el main, match dividir(a, b) { Some(r) => …, None => … }',
      solucion:
        'fn dividir(a: i32, b: i32) -> Option<i32> {\n    if b == 0 {\n        None\n    } else {\n        Some(a / b)\n    }\n}\n\nfn main() {\n    let a: i32 = preguntar("a: ").parse().unwrap();\n    let b: i32 = preguntar("b: ").parse().unwrap();\n    match dividir(a, b) {\n        Some(r) => println!("Da {}", r),\n        None => println!("No se puede dividir por cero"),\n    }\n}',
      pruebas: [
        { t: 'src', re: '->\\s*Option\\s*<\\s*i32\\s*>', msg: 'dividir devuelve Option<i32>' },
        { t: 'linea', n: -1, igual: 'Da 5', msg: '10 entre 2: Da 5' },
        { t: 'linea', n: -1, igual: 'No se puede dividir por cero', entradas: ['7', '0'], msg: '7 entre 0: No se puede' },
        { t: 'expr', code: 'dividir(9, 3)', igual: 'Some(3)', msg: 'dividir(9, 3) es Some(3)' },
        { t: 'expr', code: 'dividir(1, 0)', igual: 'None', msg: 'dividir(1, 0) es None' },
      ],
    },
  ],
}

const L6: Leccion = {
  id: 'rsa-6',
  numero: 6,
  titulo: 'Iteradores',
  emoji: '⚙️',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'En JavaScript usabas `map` y `filter` con funciones flecha. En Rust también, con dos detalles: primero se pide `.iter()` para recorrer, y al final `.collect()` para volver a armar una lista. Las funciones cortas se escriben entre barras: `|x| x * 2`. Se llaman closures.',
    },
    {
      t: 'compara',
      js: 'const dobles = nums.map((x) => x * 2);',
      py: 'let dobles: Vec<i32> = nums.iter().map(|x| x * 2).collect();',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let nums = vec![1, 2, 3, 4, 5, 6];\n\n    let dobles: Vec<i32> = nums.iter().map(|x| x * 2).collect();\n    let pares: Vec<i32> = nums.iter().copied().filter(|x| x % 2 == 0).collect();\n    let total: i32 = nums.iter().sum();\n    let grandes = nums.iter().filter(|x| **x > 3).count();\n\n    println!("{:?}", dobles);\n    println!("{:?}", pares);\n    println!("{} {}", total, grandes);\n}',
    },
    {
      t: 'p',
      texto:
        '`.iter()` presta cada dato. Por eso, para quedarte con copias de los números, va `.copied()`. Y `filter` presta otra vez: si necesitas comparar el número, se escribe `**x > 3`, o `*x > 3` si antes usaste `copied()`.',
    },
    {
      t: 'p',
      texto: 'Las listas también se ordenan: `.sort()` las deja de menor a mayor y `.reverse()` les da la vuelta. Las dos cambian la lista, así que tiene que ser `mut`.',
    },
    { t: 'ojo', texto: 'Si Rust no sabe en qué armar el `collect`, dile el tipo: `let v: Vec<i32> = … .collect();`' },
  ],
  retos: [
    {
      id: 'rsa-6-1',
      titulo: 'Todos al doble',
      enunciado: 'Escribe dobles con iter, map y collect, sin ciclos: recibe una lista prestada y devuelve otra con cada número por 2.',
      inicial: '// Escribe aquí la función dobles\n\nfn main() {\n    println!("{:?}", dobles(&vec![1, 2, 3]));\n}\n',
      pista: 'fn dobles(v: &Vec<i32>) -> Vec<i32> { v.iter().map(|x| x * 2).collect() }',
      solucion: 'fn dobles(v: &Vec<i32>) -> Vec<i32> {\n    v.iter().map(|x| x * 2).collect()\n}\n\nfn main() {\n    println!("{:?}", dobles(&vec![1, 2, 3]));\n}',
      pruebas: [
        { t: 'src', re: '\\.map\\s*\\(', msg: 'Usas map' },
        { t: 'src', re: '\\.collect\\b', msg: 'Usas collect' },
        SIN_CICLOS,
        { t: 'salida', igual: '[2, 4, 6]', msg: 'Sale [2, 4, 6]' },
        { t: 'expr', code: 'dobles(&vec![])', igual: '[]', msg: 'Una lista vacía da []' },
      ],
    },
    {
      id: 'rsa-6-2',
      titulo: 'Solo los pares',
      enunciado: 'Escribe pares con iter, copied, filter y collect: devuelve solo los números pares de la lista.',
      inicial: '// Escribe aquí la función pares\n\nfn main() {\n    println!("{:?}", pares(&vec![1, 2, 3, 4, 5, 6]));\n}\n',
      pista: 'v.iter().copied().filter(|x| x % 2 == 0).collect()',
      solucion: 'fn pares(v: &Vec<i32>) -> Vec<i32> {\n    v.iter().copied().filter(|x| x % 2 == 0).collect()\n}\n\nfn main() {\n    println!("{:?}", pares(&vec![1, 2, 3, 4, 5, 6]));\n}',
      pruebas: [
        { t: 'src', re: '\\.filter\\s*\\(', msg: 'Usas filter' },
        SIN_CICLOS,
        { t: 'salida', igual: '[2, 4, 6]', msg: 'Sale [2, 4, 6]' },
        { t: 'expr', code: 'pares(&vec![7, 9])', igual: '[]', msg: 'Sin pares: []' },
        { t: 'expr', code: 'pares(&vec![0, -2, 3])', igual: '[0, -2]', msg: 'El 0 y el -2 también son pares' },
      ],
    },
    {
      id: 'rsa-6-3',
      titulo: 'Los que aprueban',
      enunciado: 'Escribe aprobados: cuenta cuántas notas son 3 o más, con filter y count, sin ciclos. Devuelve un usize.',
      inicial: '// Escribe aquí la función aprobados\n\nfn main() {\n    println!("{}", aprobados(&vec![4, 2, 5, 3, 1]));\n}\n',
      pista: 'v.iter().filter(|n| **n >= 3).count()',
      solucion: 'fn aprobados(v: &Vec<i32>) -> usize {\n    v.iter().filter(|n| **n >= 3).count()\n}\n\nfn main() {\n    println!("{}", aprobados(&vec![4, 2, 5, 3, 1]));\n}',
      pruebas: [
        { t: 'src', re: '\\.count\\s*\\(', msg: 'Usas count' },
        SIN_CICLOS,
        { t: 'salida', igual: '3', msg: 'Aprueban 3' },
        { t: 'expr', code: 'aprobados(&vec![1, 2])', igual: '0', msg: 'Si nadie llega a 3: 0' },
      ],
    },
    {
      id: 'rsa-6-4',
      titulo: 'La cuenta del mercado',
      enunciado:
        'Escribe total: recibe los precios y las cantidades (en el mismo orden) y devuelve cuánto es todo. Pista de Rust: .zip() junta dos listas de a parejas. Sin ciclos.',
      inicial: '// Escribe aquí la función total\n\nfn main() {\n    let precios = vec![1000, 2500, 400];\n    let cantidades = vec![2, 1, 5];\n    println!("{}", total(&precios, &cantidades));\n}\n',
      pista: 'precios.iter().zip(cantidades.iter()).map(|(p, c)| p * c).sum()',
      solucion:
        'fn total(precios: &Vec<i32>, cantidades: &Vec<i32>) -> i32 {\n    precios.iter().zip(cantidades.iter()).map(|(p, c)| p * c).sum()\n}\n\nfn main() {\n    let precios = vec![1000, 2500, 400];\n    let cantidades = vec![2, 1, 5];\n    println!("{}", total(&precios, &cantidades));\n}',
      pruebas: [
        { t: 'src', re: '\\.zip\\s*\\(', msg: 'Usas zip' },
        { t: 'src', re: '\\.sum\\b', msg: 'Usas sum' },
        SIN_CICLOS,
        { t: 'salida', igual: '6500', msg: 'Sale 6500' },
        { t: 'expr', code: 'total(&vec![3], &vec![4])', igual: '12', msg: 'Uno de 3 por 4: 12' },
      ],
    },
    {
      id: 'rsa-6-5',
      titulo: 'El podio',
      enunciado: 'Escribe podio: recibe los puntajes (la lista entera, no prestada) y devuelve los tres más altos, del mayor al menor. Ordena con sort y reverse, y saca los tres primeros con take(3).',
      inicial: '// Escribe aquí la función podio\n\nfn main() {\n    println!("{:?}", podio(vec![5, 9, 2, 8, 1]));\n}\n',
      pista: 'fn podio(mut v: Vec<i32>) -> Vec<i32> { v.sort(); v.reverse(); v.into_iter().take(3).collect() }',
      solucion: 'fn podio(mut v: Vec<i32>) -> Vec<i32> {\n    v.sort();\n    v.reverse();\n    v.into_iter().take(3).collect()\n}\n\nfn main() {\n    println!("{:?}", podio(vec![5, 9, 2, 8, 1]));\n}',
      pruebas: [
        { t: 'src', re: '\\.sort\\s*\\(', msg: 'Usas sort' },
        { t: 'src', re: '\\.take\\s*\\(\\s*3\\s*\\)', msg: 'Usas take(3)' },
        { t: 'salida', igual: '[9, 8, 5]', msg: 'Sale [9, 8, 5]' },
        { t: 'expr', code: 'podio(vec![1, 2])', igual: '[2, 1]', msg: 'Con dos puntajes, salen los dos' },
      ],
    },
  ],
}

const L7: Leccion = {
  id: 'rsa-7',
  numero: 7,
  titulo: 'Letra por letra',
  emoji: '🔤',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Un texto también se recorre como iterador. `.chars()` te da sus letras una por una (y sí cuenta bien las tildes). `.split_whitespace()` te da sus palabras.',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let s = "Hola, Ferris";\n    println!("{}", s.chars().count());\n\n    let al_reves: String = s.chars().rev().collect();\n    println!("{}", al_reves);\n\n    for palabra in "el cangrejo baila".split_whitespace() {\n        println!("- {}", palabra);\n    }\n}',
    },
    {
      t: 'p',
      texto:
        'Fíjate: un `collect()` de letras arma un `String`. Y un `char` tiene sus propias preguntas: `c.is_alphabetic()` (¿es letra?), `c.is_numeric()` (¿es número?), `c.to_ascii_uppercase()`.',
    },
    { t: 'ojo', texto: 'Las letras van entre comillas sencillas: `\'a\'` es un char y `"a"` es un texto. Rust los distingue.' },
  ],
  retos: [
    {
      id: 'rsa-7-1',
      titulo: 'Al revés',
      enunciado: 'Escribe al_reves: recibe un texto y lo devuelve al revés, con chars, rev y collect.',
      inicial: '// Escribe aquí la función al_reves\n\nfn main() {\n    println!("{}", al_reves("cangrejo"));\n}\n',
      pista: 'fn al_reves(s: &str) -> String { s.chars().rev().collect() }',
      solucion: 'fn al_reves(s: &str) -> String {\n    s.chars().rev().collect()\n}\n\nfn main() {\n    println!("{}", al_reves("cangrejo"));\n}',
      pruebas: [
        { t: 'src', re: '\\.rev\\s*\\(', msg: 'Usas rev' },
        { t: 'salida', igual: 'ojergnac', msg: 'Sale ojergnac' },
        { t: 'expr', code: 'al_reves("ñandú")', igual: '"údnañ"', msg: 'Funciona con tildes y eñes' },
      ],
    },
    {
      id: 'rsa-7-2',
      titulo: 'Contar vocales',
      enunciado: 'Escribe vocales con chars, filter y count, sin ciclos: cuenta cuántas a, e, i, o, u tiene el texto (en minúscula y sin tilde).',
      inicial: '// Escribe aquí la función vocales\n\nfn main() {\n    println!("{}", vocales("murcielago"));\n}\n',
      pista: 's.chars().filter(|c| "aeiou".contains(*c)).count()',
      solucion: 'fn vocales(s: &str) -> usize {\n    s.chars().filter(|c| "aeiou".contains(*c)).count()\n}\n\nfn main() {\n    println!("{}", vocales("murcielago"));\n}',
      pruebas: [
        { t: 'src', re: '\\.chars\\s*\\(', msg: 'Usas chars' },
        SIN_CICLOS,
        { t: 'salida', igual: '5', msg: 'murcielago tiene 5 vocales' },
        { t: 'expr', code: 'vocales("rst")', igual: '0', msg: 'rst no tiene vocales' },
      ],
    },
    {
      id: 'rsa-7-3',
      titulo: '¿Cuántas palabras?',
      enunciado: 'Escribe palabras: cuenta las palabras del texto con split_whitespace. Los espacios de más no cuentan.',
      inicial: '// Escribe aquí la función palabras\n\nfn main() {\n    println!("{}", palabras("el cangrejo   baila salsa"));\n}\n',
      pista: 's.split_whitespace().count()',
      solucion: 'fn palabras(s: &str) -> usize {\n    s.split_whitespace().count()\n}\n\nfn main() {\n    println!("{}", palabras("el cangrejo   baila salsa"));\n}',
      pruebas: [
        { t: 'src', re: '\\.split_whitespace\\s*\\(', msg: 'Usas split_whitespace' },
        { t: 'salida', igual: '4', msg: 'Son 4 palabras' },
        { t: 'expr', code: 'palabras("")', igual: '0', msg: 'Un texto vacío tiene 0' },
      ],
    },
    {
      id: 'rsa-7-4',
      titulo: '¿Es palíndromo?',
      enunciado: 'Un palíndromo se lee igual al derecho y al revés, sin contar espacios ni mayúsculas: Anita lava la tina. Escribe es_palindromo, que devuelve un bool.',
      inicial: '// Escribe aquí la función es_palindromo\n\nfn main() {\n    println!("{}", es_palindromo("Anita lava la tina"));\n}\n',
      pista:
        'Primero limpia: let limpio: String = s.to_lowercase().chars().filter(|c| *c != \' \').collect(); Después compara limpio con limpio al revés.',
      solucion:
        'fn es_palindromo(s: &str) -> bool {\n    let limpio: String = s.to_lowercase().chars().filter(|c| *c != \' \').collect();\n    let al_reves: String = limpio.chars().rev().collect();\n    limpio == al_reves\n}\n\nfn main() {\n    println!("{}", es_palindromo("Anita lava la tina"));\n}',
      pruebas: [
        { t: 'src', re: '\\bfn\\s+es_palindromo\\s*\\([^)]*\\)\\s*->\\s*bool\\b', msg: 'es_palindromo devuelve un bool' },
        { t: 'salida', igual: 'true', msg: 'Anita lava la tina es palíndromo' },
        { t: 'expr', code: 'es_palindromo("Oso")', igual: 'true', msg: 'Oso es palíndromo' },
        { t: 'expr', code: 'es_palindromo("cangrejo")', igual: 'false', msg: 'cangrejo no' },
      ],
    },
    {
      id: 'rsa-7-5',
      titulo: 'Las iniciales',
      enunciado: 'Escribe iniciales: devuelve la primera letra de cada palabra, en mayúscula y pegadas.\n\niniciales("ana maría lópez") → "AML"',
      inicial: '// Escribe aquí la función iniciales\n\nfn main() {\n    println!("{}", iniciales("ana maría lópez"));\n}\n',
      pista: 's.split_whitespace().map(|p| p.chars().next().unwrap().to_ascii_uppercase()).collect()',
      solucion:
        'fn iniciales(s: &str) -> String {\n    s.split_whitespace().map(|p| p.chars().next().unwrap().to_ascii_uppercase()).collect()\n}\n\nfn main() {\n    println!("{}", iniciales("ana maría lópez"));\n}',
      pruebas: [
        { t: 'src', re: '\\.split_whitespace\\s*\\(', msg: 'Usas split_whitespace' },
        { t: 'salida', igual: 'AML', exacto: true, msg: 'Sale AML, en mayúsculas' },
        { t: 'expr', code: 'iniciales("ferris el cangrejo")', igual: '"FEC"', msg: 'ferris el cangrejo: FEC' },
      ],
    },
  ],
}

const L8: Leccion = {
  id: 'rsa-8',
  numero: 8,
  titulo: 'HashMap',
  emoji: '🗂️',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Un `HashMap` guarda parejas de llave y valor, como un objeto de JavaScript o un diccionario de Python. Viene en la biblioteca de Rust, así que primero se trae con `use`.',
    },
    {
      t: 'codigo',
      codigo:
        'use std::collections::HashMap;\n\nfn main() {\n    let mut edades = HashMap::new();\n    edades.insert("Ana", 11);\n    edades.insert("Leo", 10);\n\n    match edades.get("Ana") {\n        Some(e) => println!("Ana tiene {} años", e),\n        None => println!("No conozco a Ana"),\n    }\n    println!("¿Está Tom? {}", edades.contains_key("Tom"));\n}',
    },
    { t: 'p', texto: '`get` devuelve un `Option`, ¡como en la lección 5!: la llave puede no estar. Y para contar cosas, el truco es `entry(…).or_insert(0)`:' },
    {
      t: 'codigo',
      codigo:
        'use std::collections::HashMap;\n\nfn main() {\n    let frutas = vec!["mango", "kiwi", "mango", "pera", "mango"];\n    let mut cuenta = HashMap::new();\n    for f in &frutas {\n        *cuenta.entry(*f).or_insert(0) += 1;\n    }\n    println!("mango: {:?}", cuenta.get("mango"));\n}',
    },
    {
      t: 'p',
      texto: 'Se lee así: “busca la entrada de esta fruta; si no está, ponla en 0; y súmale 1”. El `*` de adelante es para llegar al número, como en la lección 2.',
    },
    { t: 'ojo', texto: 'Un HashMap no guarda el orden: si lo recorres, las llaves pueden salir en cualquier orden. Si necesitas orden, ordena las llaves primero.' },
  ],
  retos: [
    {
      id: 'rsa-8-1',
      titulo: 'La agenda',
      enunciado: 'Crea un HashMap con las edades de Ana (11), Leo (10) y Sara (12). Después, con get y match, muestra: Leo tiene 10 años',
      inicial: 'use std::collections::HashMap;\n\nfn main() {\n    \n}\n',
      pista: 'let mut edades = HashMap::new(); edades.insert("Ana", 11); … y match edades.get("Leo") { Some(e) => …, None => … }',
      solucion:
        'use std::collections::HashMap;\n\nfn main() {\n    let mut edades = HashMap::new();\n    edades.insert("Ana", 11);\n    edades.insert("Leo", 10);\n    edades.insert("Sara", 12);\n    match edades.get("Leo") {\n        Some(e) => println!("Leo tiene {} años", e),\n        None => println!("No conozco a Leo"),\n    }\n}',
      pruebas: [
        { t: 'src', re: '\\.insert\\s*\\(', min: 3, msg: 'Guardas las tres edades con insert' },
        { t: 'src', re: '\\.get\\s*\\(', msg: 'Usas get' },
        { t: 'src', re: 'tiene\\s+10', not: true, msg: 'El 10 sale del HashMap' },
        { t: 'salida', igual: 'Leo tiene 10 años', msg: 'Sale Leo tiene 10 años' },
      ],
    },
    {
      id: 'rsa-8-2',
      titulo: '¿Lo conozco?',
      enunciado: 'Escribe edad_de: recibe la agenda prestada y un nombre. Si está, devuelve (nombre) tiene (edad) años; si no, No conozco a (nombre).',
      inicial:
        'use std::collections::HashMap;\n\n// Escribe aquí la función edad_de\n\nfn main() {\n    let mut agenda = HashMap::new();\n    agenda.insert("Ana", 11);\n    println!("{}", edad_de(&agenda, "Ana"));\n    println!("{}", edad_de(&agenda, "Tom"));\n}\n',
      pista: 'fn edad_de(agenda: &HashMap<&str, i32>, nombre: &str) -> String { match agenda.get(nombre) { … } }',
      solucion:
        'use std::collections::HashMap;\n\nfn edad_de(agenda: &HashMap<&str, i32>, nombre: &str) -> String {\n    match agenda.get(nombre) {\n        Some(e) => format!("{} tiene {} años", nombre, e),\n        None => format!("No conozco a {}", nombre),\n    }\n}\n\nfn main() {\n    let mut agenda = HashMap::new();\n    agenda.insert("Ana", 11);\n    println!("{}", edad_de(&agenda, "Ana"));\n    println!("{}", edad_de(&agenda, "Tom"));\n}',
      pruebas: [
        { t: 'src', re: '&\\s*HashMap\\s*<', msg: 'edad_de recibe la agenda prestada' },
        { t: 'salida', igual: 'Ana tiene 11 años\nNo conozco a Tom', msg: 'Salen Ana tiene 11 años y No conozco a Tom' },
        { t: 'expr', code: '{ let mut a = HashMap::new(); a.insert("Leo", 9); edad_de(&a, "Leo") }', igual: '"Leo tiene 9 años"', msg: 'Con Leo de 9 años' },
      ],
    },
    {
      id: 'rsa-8-3',
      titulo: 'Contar votos',
      enunciado: 'Escribe contar: recibe la lista de votos y devuelve un HashMap<String, i32> con cuántos votos tiene cada opción. Usa entry y or_insert.',
      inicial:
        'use std::collections::HashMap;\n\n// Escribe aquí la función contar\n\nfn main() {\n    let votos = vec!["perro", "gato", "perro", "loro", "perro", "gato"];\n    let cuenta = contar(&votos);\n    println!("perro: {:?}", cuenta.get("perro"));\n}\n',
      pista: 'let mut cuenta = HashMap::new(); for v in votos { *cuenta.entry(v.to_string()).or_insert(0) += 1; } y al final cuenta',
      solucion:
        'use std::collections::HashMap;\n\nfn contar(votos: &Vec<&str>) -> HashMap<String, i32> {\n    let mut cuenta = HashMap::new();\n    for v in votos {\n        *cuenta.entry(v.to_string()).or_insert(0) += 1;\n    }\n    cuenta\n}\n\nfn main() {\n    let votos = vec!["perro", "gato", "perro", "loro", "perro", "gato"];\n    let cuenta = contar(&votos);\n    println!("perro: {:?}", cuenta.get("perro"));\n}',
      pruebas: [
        { t: 'src', re: '\\.or_insert\\s*\\(', msg: 'Usas entry y or_insert' },
        { t: 'salida', igual: 'perro: Some(3)', msg: 'El perro tiene 3 votos' },
        { t: 'expr', code: 'contar(&vec!["sí", "no", "sí"]).get("sí")', igual: 'Some(2)', msg: 'Sí tiene 2' },
        { t: 'expr', code: 'contar(&vec!["sí"]).get("no")', igual: 'None', msg: 'Si nadie votó no: None' },
        { t: 'expr', code: 'contar(&vec![]).len()', igual: '0', msg: 'Sin votos, un HashMap vacío' },
      ],
    },
    {
      id: 'rsa-8-4',
      titulo: 'Contar letras',
      enunciado: 'Escribe letras: recibe un texto y devuelve un HashMap<char, i32> con cuántas veces sale cada letra.',
      inicial:
        'use std::collections::HashMap;\n\n// Escribe aquí la función letras\n\nfn main() {\n    let cuenta = letras("banana");\n    println!("a: {:?}, n: {:?}", cuenta.get(&\'a\'), cuenta.get(&\'n\'));\n}\n',
      pista: 'Igual que contar votos, pero recorriendo s.chars(): *cuenta.entry(c).or_insert(0) += 1;',
      solucion:
        'use std::collections::HashMap;\n\nfn letras(s: &str) -> HashMap<char, i32> {\n    let mut cuenta = HashMap::new();\n    for c in s.chars() {\n        *cuenta.entry(c).or_insert(0) += 1;\n    }\n    cuenta\n}\n\nfn main() {\n    let cuenta = letras("banana");\n    println!("a: {:?}, n: {:?}", cuenta.get(&\'a\'), cuenta.get(&\'n\'));\n}',
      pruebas: [
        { t: 'src', re: 'HashMap\\s*<\\s*char\\s*,\\s*i32\\s*>', msg: 'letras devuelve HashMap<char, i32>' },
        { t: 'salida', igual: 'a: Some(3), n: Some(2)', msg: 'banana tiene 3 a y 2 n' },
        { t: 'expr', code: 'letras("ferris").get(&\'r\')', igual: 'Some(2)', msg: 'ferris tiene 2 r' },
        { t: 'expr', code: 'letras("ferris").get(&\'z\')', igual: 'None', msg: 'ferris no tiene z' },
      ],
    },
    {
      id: 'rsa-8-5',
      titulo: 'La tienda',
      enunciado:
        'Escribe vender: recibe el inventario prestado para cambiar, un producto y cuántos. Si hay suficientes, los descuenta y devuelve true. Si no hay suficientes (o el producto no existe), no cambia nada y devuelve false.',
      inicial:
        'use std::collections::HashMap;\n\n// Escribe aquí la función vender\n\nfn main() {\n    let mut inventario = HashMap::new();\n    inventario.insert(String::from("lápiz"), 5);\n    println!("{}", vender(&mut inventario, "lápiz", 3));\n    println!("{}", vender(&mut inventario, "lápiz", 3));\n    println!("Quedan {:?}", inventario.get("lápiz"));\n}\n',
      pista: 'let hay = *inventario.get(producto).unwrap_or(&0); si hay < cuantos, false. Si no: inventario.insert(producto.to_string(), hay - cuantos); true',
      solucion:
        'use std::collections::HashMap;\n\nfn vender(inventario: &mut HashMap<String, i32>, producto: &str, cuantos: i32) -> bool {\n    let hay = *inventario.get(producto).unwrap_or(&0);\n    if hay < cuantos {\n        return false;\n    }\n    inventario.insert(producto.to_string(), hay - cuantos);\n    true\n}\n\nfn main() {\n    let mut inventario = HashMap::new();\n    inventario.insert(String::from("lápiz"), 5);\n    println!("{}", vender(&mut inventario, "lápiz", 3));\n    println!("{}", vender(&mut inventario, "lápiz", 3));\n    println!("Quedan {:?}", inventario.get("lápiz"));\n}',
      pruebas: [
        { t: 'src', re: '&\\s*mut\\s+HashMap\\b', msg: 'vender recibe &mut HashMap' },
        { t: 'salida', igual: 'true\nfalse\nQuedan Some(2)', msg: 'Vende 3, no alcanza para otros 3, quedan 2' },
        {
          t: 'expr',
          code: '{ let mut i = HashMap::new(); i.insert(String::from("borrador"), 2); vender(&mut i, "borrador", 2) }',
          igual: 'true',
          msg: 'Se pueden vender todos',
        },
        { t: 'expr', code: '{ let mut i = HashMap::new(); vender(&mut i, "nada", 1) }', igual: 'false', msg: 'Lo que no existe no se vende' },
      ],
    },
  ],
}

const L9: Leccion = {
  id: 'rsa-9',
  numero: 9,
  titulo: 'Result: bien o error',
  emoji: '⚠️',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        '`Option` dice si hay algo o no. `Result` va más allá: dice si salió bien, con `Ok(dato)`, o si salió mal, con `Err(por qué)`. Ya lo usaste sin saberlo: `parse()` devuelve un Result, y `unwrap()` detenía el programa si era un Err.',
    },
    {
      t: 'codigo',
      codigo:
        'fn main() {\n    let respuestas = vec!["12", "doce"];\n    for r in &respuestas {\n        match r.parse::<i32>() {\n            Ok(n) => println!("{} es el número {}", r, n),\n            Err(_) => println!("{} no es un número", r),\n        }\n    }\n}',
    },
    {
      t: 'p',
      texto: 'Tus funciones también pueden devolver un Result. El tipo dice las dos cosas: lo que da si sale bien y lo que da si sale mal, `Result<u32, String>`.',
    },
    {
      t: 'codigo',
      codigo:
        'fn sacar(saldo: u32, cuanto: u32) -> Result<u32, String> {\n    if cuanto > saldo {\n        Err(String::from("No te alcanza"))\n    } else {\n        Ok(saldo - cuanto)\n    }\n}\n\nfn main() {\n    println!("{:?}", sacar(1000, 300));\n    println!("{:?}", sacar(100, 500));\n}',
    },
    {
      t: 'p',
      texto:
        'Y el truco más querido de Rust: el signo `?`. Puesto después de un Result, quiere decir “si es Ok, dame el dato; si es Err, devuelve ese error ya mismo”. Solo se usa en funciones que también devuelven Result.',
    },
    {
      t: 'codigo',
      codigo:
        'fn a_numero(s: &str) -> Result<i32, String> {\n    match s.parse::<i32>() {\n        Ok(n) => Ok(n),\n        Err(_) => Err(format!("{} no es un número", s)),\n    }\n}\n\nfn sumar(a: &str, b: &str) -> Result<i32, String> {\n    let x = a_numero(a)?;\n    let y = a_numero(b)?;\n    Ok(x + y)\n}\n\nfn main() {\n    println!("{:?}", sumar("2", "3"));\n    println!("{:?}", sumar("2", "tres"));\n}',
    },
    { t: 'ojo', texto: '`parse::<i32>()` es otra forma de decirle el tipo a `parse`, cuando no hay una variable con tipo donde guardarlo.' },
  ],
  retos: [
    {
      id: 'rsa-9-1',
      titulo: 'Sin unwrap',
      enunciado: 'Pregunta un número. Con un match sobre el parse (sin unwrap), muestra El doble es (doble), o si no se pudo, Eso no es un número.',
      inicial: 'fn main() {\n    let texto = preguntar("Un número: ");\n    \n}\n',
      entradas: ['7'],
      pista: 'match texto.parse::<i32>() { Ok(n) => println!("El doble es {}", n * 2), Err(_) => … }',
      solucion:
        'fn main() {\n    let texto = preguntar("Un número: ");\n    match texto.parse::<i32>() {\n        Ok(n) => println!("El doble es {}", n * 2),\n        Err(_) => println!("Eso no es un número"),\n    }\n}',
      pruebas: [
        { t: 'src', re: '\\.unwrap\\s*\\(', not: true, msg: 'Sin unwrap' },
        { t: 'src', re: '\\bErr\\s*\\(', msg: 'Atiendes el Err' },
        { t: 'linea', n: -1, igual: 'El doble es 14', msg: 'Con 7: El doble es 14' },
        { t: 'linea', n: -1, igual: 'Eso no es un número', entradas: ['siete'], msg: 'Con siete: Eso no es un número' },
      ],
    },
    {
      id: 'rsa-9-2',
      titulo: 'No te alcanza',
      enunciado: 'Escribe sacar: si quieren sacar más de lo que hay, devuelve Err con el texto No te alcanza. Si no, Ok con lo que queda.',
      inicial: '// Escribe aquí la función sacar\n\nfn main() {\n    println!("{:?}", sacar(1000, 300));\n    println!("{:?}", sacar(100, 500));\n}\n',
      pista: 'fn sacar(saldo: u32, cuanto: u32) -> Result<u32, String>',
      solucion:
        'fn sacar(saldo: u32, cuanto: u32) -> Result<u32, String> {\n    if cuanto > saldo {\n        Err(String::from("No te alcanza"))\n    } else {\n        Ok(saldo - cuanto)\n    }\n}\n\nfn main() {\n    println!("{:?}", sacar(1000, 300));\n    println!("{:?}", sacar(100, 500));\n}',
      pruebas: [
        { t: 'src', re: '->\\s*Result\\s*<\\s*u32\\s*,\\s*String\\s*>', msg: 'sacar devuelve Result<u32, String>' },
        { t: 'salida', igual: 'Ok(700)\nErr("No te alcanza")', msg: 'Salen Ok(700) y Err("No te alcanza")' },
        { t: 'expr', code: 'sacar(500, 500)', igual: 'Ok(0)', msg: 'Sacar todo sí se puede' },
      ],
    },
    {
      id: 'rsa-9-3',
      titulo: 'De texto a número',
      enunciado: 'Escribe a_numero: recibe un texto y devuelve Ok(número) o Err con el texto (texto) no es un número.',
      inicial: '// Escribe aquí la función a_numero\n\nfn main() {\n    println!("{:?}", a_numero("12"));\n    println!("{:?}", a_numero("hola"));\n}\n',
      pista: 'match s.parse::<i32>() { Ok(n) => Ok(n), Err(_) => Err(format!("{} no es un número", s)) }',
      solucion:
        'fn a_numero(s: &str) -> Result<i32, String> {\n    match s.parse::<i32>() {\n        Ok(n) => Ok(n),\n        Err(_) => Err(format!("{} no es un número", s)),\n    }\n}\n\nfn main() {\n    println!("{:?}", a_numero("12"));\n    println!("{:?}", a_numero("hola"));\n}',
      pruebas: [
        { t: 'src', re: '->\\s*Result\\s*<\\s*i32\\s*,\\s*String\\s*>', msg: 'a_numero devuelve Result<i32, String>' },
        { t: 'salida', igual: 'Ok(12)\nErr("hola no es un número")', msg: 'Salen Ok(12) y el error de hola' },
        { t: 'expr', code: 'a_numero("-5")', igual: 'Ok(-5)', msg: 'Los negativos también' },
      ],
    },
    {
      id: 'rsa-9-4',
      titulo: 'El signo ?',
      enunciado: 'Usa a_numero con el signo ? para escribir sumar: suma dos textos si los dos son números, o devuelve el error del primero que no lo sea.',
      inicial:
        'fn a_numero(s: &str) -> Result<i32, String> {\n    match s.parse::<i32>() {\n        Ok(n) => Ok(n),\n        Err(_) => Err(format!("{} no es un número", s)),\n    }\n}\n\n// Escribe aquí la función sumar\n\nfn main() {\n    println!("{:?}", sumar("3", "5"));\n    println!("{:?}", sumar("3", "cinco"));\n}\n',
      pista: 'let x = a_numero(a)?; let y = a_numero(b)?; Ok(x + y)',
      solucion:
        'fn a_numero(s: &str) -> Result<i32, String> {\n    match s.parse::<i32>() {\n        Ok(n) => Ok(n),\n        Err(_) => Err(format!("{} no es un número", s)),\n    }\n}\n\nfn sumar(a: &str, b: &str) -> Result<i32, String> {\n    let x = a_numero(a)?;\n    let y = a_numero(b)?;\n    Ok(x + y)\n}\n\nfn main() {\n    println!("{:?}", sumar("3", "5"));\n    println!("{:?}", sumar("3", "cinco"));\n}',
      pruebas: [
        { t: 'src', re: '\\)\\s*\\?', min: 2, msg: 'Usas el signo ? las dos veces' },
        { t: 'src', re: '\\ba_numero\\s*\\(\\s*[ab]\\s*\\)', min: 2, msg: 'Usas a_numero con a y con b' },
        { t: 'salida', igual: 'Ok(8)\nErr("cinco no es un número")', msg: 'Salen Ok(8) y el error de cinco' },
        { t: 'expr', code: 'sumar("uno", "dos")', igual: 'Err("uno no es un número")', msg: 'Sale el error del primero' },
      ],
    },
    {
      id: 'rsa-9-5',
      titulo: 'Una edad posible',
      enunciado: 'Escribe edad: usa a_numero con ? y, si el número es menor que 0 o mayor que 120, devuelve Err con Edad imposible. Si no, Ok con la edad.',
      inicial:
        'fn a_numero(s: &str) -> Result<i32, String> {\n    match s.parse::<i32>() {\n        Ok(n) => Ok(n),\n        Err(_) => Err(format!("{} no es un número", s)),\n    }\n}\n\n// Escribe aquí la función edad\n\nfn main() {\n    println!("{:?}", edad("11"));\n    println!("{:?}", edad("500"));\n    println!("{:?}", edad("once"));\n}\n',
      pista: 'let n = a_numero(s)?; if n < 0 || n > 120 { return Err(…); } Ok(n)',
      solucion:
        'fn a_numero(s: &str) -> Result<i32, String> {\n    match s.parse::<i32>() {\n        Ok(n) => Ok(n),\n        Err(_) => Err(format!("{} no es un número", s)),\n    }\n}\n\nfn edad(s: &str) -> Result<i32, String> {\n    let n = a_numero(s)?;\n    if n < 0 || n > 120 {\n        return Err(String::from("Edad imposible"));\n    }\n    Ok(n)\n}\n\nfn main() {\n    println!("{:?}", edad("11"));\n    println!("{:?}", edad("500"));\n    println!("{:?}", edad("once"));\n}',
      pruebas: [
        { t: 'src', re: '\\)\\s*\\?', msg: 'Usas el signo ?' },
        { t: 'salida', igual: 'Ok(11)\nErr("Edad imposible")\nErr("once no es un número")', msg: 'Salen Ok(11), Edad imposible y el error de once' },
        { t: 'expr', code: 'edad("-1")', igual: 'Err("Edad imposible")', msg: '-1 también es imposible' },
        { t: 'expr', code: 'edad("120")', igual: 'Ok(120)', msg: '120 sí se puede' },
      ],
    },
  ],
}

const L10: Leccion = {
  id: 'rsa-10',
  numero: 10,
  titulo: 'Traits',
  emoji: '🎭',
  minutos: 35,
  explicacion: [
    {
      t: 'p',
      texto:
        'Un `trait` es una promesa: “quien tenga este trait, sabe hacer esto”. Se parece a las interfaces de TypeScript. Primero se dice qué métodos pide, y después cada tipo lo cumple con `impl Trait for Tipo`.',
    },
    {
      t: 'codigo',
      codigo:
        'trait Sonido {\n    fn sonido(&self) -> String;\n}\n\nstruct Perro;\nstruct Vaca;\n\nimpl Sonido for Perro {\n    fn sonido(&self) -> String {\n        String::from("guau")\n    }\n}\n\nimpl Sonido for Vaca {\n    fn sonido(&self) -> String {\n        String::from("muu")\n    }\n}\n\nfn hablar(animal: &impl Sonido) {\n    println!("Dice {}", animal.sonido());\n}\n\nfn main() {\n    hablar(&Perro);\n    hablar(&Vaca);\n}',
    },
    {
      t: 'p',
      texto:
        '`&impl Sonido` quiere decir “cualquier cosa que tenga el trait Sonido”. Así una sola función sirve para todos. Y ese `#[derive(Debug)]` que ya usaste es un trait que Rust escribe solo por ti: el que sabe mostrar con `{:?}`.',
    },
    {
      t: 'p',
      texto: 'Para que tu struct se muestre con `{}` a secas, le escribes el trait `Display`. Su método `fmt` arma el texto con `write!`, que funciona como `println!`.',
    },
    {
      t: 'codigo',
      codigo:
        'use std::fmt;\n\nstruct Fraccion {\n    arriba: i32,\n    abajo: i32,\n}\n\nimpl fmt::Display for Fraccion {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, "{}/{}", self.arriba, self.abajo)\n    }\n}\n\nfn main() {\n    let mitad = Fraccion { arriba: 1, abajo: 2 };\n    println!("La mitad es {}", mitad);\n}',
    },
    { t: 'ojo', texto: 'Si quieres comparar dos opciones de un enum con ==, ponle también PartialEq al derive: `#[derive(Debug, PartialEq)]`.' },
  ],
  retos: [
    {
      id: 'rsa-10-1',
      titulo: 'Para mostrarlo',
      enunciado: 'Corre el programa: Rust no sabe mostrar un Punto con {:?}. Pídele que lo aprenda solo, con #[derive(Debug)] arriba del struct.',
      inicial: 'struct Punto {\n    x: i32,\n    y: i32,\n}\n\nfn main() {\n    let p = Punto { x: 3, y: 4 };\n    println!("{:?}", p);\n}\n',
      pista: 'Justo encima de struct Punto: #[derive(Debug)]',
      solucion: '#[derive(Debug)]\nstruct Punto {\n    x: i32,\n    y: i32,\n}\n\nfn main() {\n    let p = Punto { x: 3, y: 4 };\n    println!("{:?}", p);\n}',
      pruebas: [
        { t: 'src', re: '#\\[\\s*derive\\s*\\([^)]*\\bDebug\\b', msg: 'Usas #[derive(Debug)]' },
        { t: 'salida', igual: 'Punto { x: 3, y: 4 }', msg: 'Sale Punto { x: 3, y: 4 }' },
      ],
    },
    {
      id: 'rsa-10-2',
      titulo: 'Tu primer trait',
      enunciado: 'Ya está el trait Sonido y el Perro. Agrega el Gato (struct Gato;) y cúmplele el trait: dice miau.',
      inicial:
        'trait Sonido {\n    fn sonido(&self) -> String;\n}\n\nstruct Perro;\n\nimpl Sonido for Perro {\n    fn sonido(&self) -> String {\n        String::from("guau")\n    }\n}\n\n// Escribe aquí el Gato y su impl\n\nfn main() {\n    println!("{}", Perro.sonido());\n    println!("{}", Gato.sonido());\n}\n',
      pista: 'struct Gato; y después impl Sonido for Gato { fn sonido(&self) -> String { … } }',
      solucion:
        'trait Sonido {\n    fn sonido(&self) -> String;\n}\n\nstruct Perro;\n\nimpl Sonido for Perro {\n    fn sonido(&self) -> String {\n        String::from("guau")\n    }\n}\n\nstruct Gato;\n\nimpl Sonido for Gato {\n    fn sonido(&self) -> String {\n        String::from("miau")\n    }\n}\n\nfn main() {\n    println!("{}", Perro.sonido());\n    println!("{}", Gato.sonido());\n}',
      pruebas: [
        { t: 'src', re: '\\bimpl\\s+Sonido\\s+for\\s+Gato\\b', msg: 'Escribes impl Sonido for Gato' },
        { t: 'salida', igual: 'guau\nmiau', msg: 'Salen guau y miau' },
      ],
    },
    {
      id: 'rsa-10-3',
      titulo: 'Una función para todos',
      enunciado: 'Escribe presentar: recibe cualquier cosa con el trait Animal (&impl Animal) y devuelve (nombre) dice (sonido).',
      inicial:
        'trait Animal {\n    fn nombre(&self) -> String;\n    fn sonido(&self) -> String;\n}\n\nstruct Vaca;\nstruct Pato;\n\nimpl Animal for Vaca {\n    fn nombre(&self) -> String { String::from("La vaca") }\n    fn sonido(&self) -> String { String::from("muu") }\n}\n\nimpl Animal for Pato {\n    fn nombre(&self) -> String { String::from("El pato") }\n    fn sonido(&self) -> String { String::from("cuac") }\n}\n\n// Escribe aquí la función presentar\n\nfn main() {\n    println!("{}", presentar(&Vaca));\n    println!("{}", presentar(&Pato));\n}\n',
      pista: 'fn presentar(a: &impl Animal) -> String { format!("{} dice {}", a.nombre(), a.sonido()) }',
      solucion:
        'trait Animal {\n    fn nombre(&self) -> String;\n    fn sonido(&self) -> String;\n}\n\nstruct Vaca;\nstruct Pato;\n\nimpl Animal for Vaca {\n    fn nombre(&self) -> String { String::from("La vaca") }\n    fn sonido(&self) -> String { String::from("muu") }\n}\n\nimpl Animal for Pato {\n    fn nombre(&self) -> String { String::from("El pato") }\n    fn sonido(&self) -> String { String::from("cuac") }\n}\n\nfn presentar(a: &impl Animal) -> String {\n    format!("{} dice {}", a.nombre(), a.sonido())\n}\n\nfn main() {\n    println!("{}", presentar(&Vaca));\n    println!("{}", presentar(&Pato));\n}',
      pruebas: [
        { t: 'src', re: '&\\s*impl\\s+Animal\\b', msg: 'presentar recibe &impl Animal' },
        { t: 'salida', igual: 'La vaca dice muu\nEl pato dice cuac', msg: 'Salen la vaca y el pato' },
      ],
    },
    {
      id: 'rsa-10-4',
      titulo: 'La hora',
      enunciado: 'Escríbele Display a Hora para que se muestre con dos cifras: 07:05. Pista: {:02} rellena con un cero adelante.',
      inicial:
        'use std::fmt;\n\nstruct Hora {\n    horas: u32,\n    minutos: u32,\n}\n\n// Escribe aquí impl fmt::Display for Hora\n\nfn main() {\n    let recreo = Hora { horas: 9, minutos: 5 };\n    println!("El recreo es a las {}", recreo);\n}\n',
      pista: 'impl fmt::Display for Hora { fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result { write!(f, "{:02}:{:02}", self.horas, self.minutos) } }',
      solucion:
        'use std::fmt;\n\nstruct Hora {\n    horas: u32,\n    minutos: u32,\n}\n\nimpl fmt::Display for Hora {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, "{:02}:{:02}", self.horas, self.minutos)\n    }\n}\n\nfn main() {\n    let recreo = Hora { horas: 9, minutos: 5 };\n    println!("El recreo es a las {}", recreo);\n}',
      pruebas: [
        { t: 'src', re: '\\bimpl\\s+(fmt::|std::fmt::)?Display\\s+for\\s+Hora\\b', msg: 'Escribes Display para Hora' },
        { t: 'salida', igual: 'El recreo es a las 09:05', msg: 'Sale El recreo es a las 09:05' },
        { t: 'expr', code: 'format!("{}", Hora { horas: 14, minutos: 30 })', igual: '"14:30"', msg: 'Las 14 y 30: 14:30' },
      ],
    },
    {
      id: 'rsa-10-5',
      titulo: 'La mascota virtual',
      enunciado:
        'El gran final. Escribe el struct Mascota (nombre: String, hambre: u32) y su impl:\n\nnueva(nombre: &str) — arranca con hambre 5\ncomer(&mut self) -> Result<(), String> — si el hambre ya es 0, Err con (nombre) no tiene hambre; si no, el hambre baja 2 (sin pasar de 0) y Ok(())\njugar(&mut self) — el hambre sube 1\nanimo(&self) -> Animo — Feliz si el hambre es menor que 5; si no, Hambrienta\n\nY su Display: (nombre) está (ánimo con {:?}).',
      inicial:
        'use std::fmt;\n\n#[derive(Debug, PartialEq)]\nenum Animo {\n    Feliz,\n    Hambrienta,\n}\n\n// Escribe aquí el struct Mascota, su impl y su Display\n\nfn main() {\n    let mut kiwi = Mascota::nueva("Kiwi");\n    println!("{}", kiwi);\n    for _ in 0..4 {\n        match kiwi.comer() {\n            Ok(()) => println!("Ñam: {}", kiwi),\n            Err(e) => println!("{}", e),\n        }\n    }\n    kiwi.jugar();\n    println!("{}", kiwi);\n}\n',
      pista:
        'Para que no baje de 0: if self.hambre >= 2 { self.hambre -= 2 } else { self.hambre = 0 }. En el Display: write!(f, "{} está {:?}", self.nombre, self.animo())',
      solucion:
        'use std::fmt;\n\n#[derive(Debug, PartialEq)]\nenum Animo {\n    Feliz,\n    Hambrienta,\n}\n\nstruct Mascota {\n    nombre: String,\n    hambre: u32,\n}\n\nimpl Mascota {\n    fn nueva(nombre: &str) -> Mascota {\n        Mascota { nombre: nombre.to_string(), hambre: 5 }\n    }\n\n    fn comer(&mut self) -> Result<(), String> {\n        if self.hambre == 0 {\n            return Err(format!("{} no tiene hambre", self.nombre));\n        }\n        if self.hambre >= 2 {\n            self.hambre -= 2;\n        } else {\n            self.hambre = 0;\n        }\n        Ok(())\n    }\n\n    fn jugar(&mut self) {\n        self.hambre += 1;\n    }\n\n    fn animo(&self) -> Animo {\n        if self.hambre < 5 {\n            Animo::Feliz\n        } else {\n            Animo::Hambrienta\n        }\n    }\n}\n\nimpl fmt::Display for Mascota {\n    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {\n        write!(f, "{} está {:?}", self.nombre, self.animo())\n    }\n}\n\nfn main() {\n    let mut kiwi = Mascota::nueva("Kiwi");\n    println!("{}", kiwi);\n    for _ in 0..4 {\n        match kiwi.comer() {\n            Ok(()) => println!("Ñam: {}", kiwi),\n            Err(e) => println!("{}", e),\n        }\n    }\n    kiwi.jugar();\n    println!("{}", kiwi);\n}',
      pruebas: [
        { t: 'src', re: '\\bstruct\\s+Mascota\\b', msg: 'Creas el struct Mascota' },
        { t: 'src', re: '->\\s*Result\\s*<\\s*\\(\\s*\\)\\s*,\\s*String\\s*>', msg: 'comer devuelve Result<(), String>' },
        { t: 'src', re: '\\bimpl\\s+(fmt::|std::fmt::)?Display\\s+for\\s+Mascota\\b', msg: 'Escribes Display para Mascota' },
        {
          t: 'salida',
          igual: 'Kiwi está Hambrienta\nÑam: Kiwi está Feliz\nÑam: Kiwi está Feliz\nÑam: Kiwi está Feliz\nKiwi no tiene hambre\nKiwi está Feliz',
          msg: 'Hambrienta, tres veces ñam, ya no tiene hambre, y feliz',
        },
        { t: 'expr', code: '{ let mut m = Mascota::nueva("Lola"); m.jugar(); m.animo() }', igual: 'Hambrienta', msg: 'Jugar sin comer: hambrienta' },
        {
          t: 'expr',
          code: '{ let mut m = Mascota::nueva("Toby"); let _ = m.comer(); let _ = m.comer(); let _ = m.comer(); m.comer() }',
          igual: 'Err("Toby no tiene hambre")',
          msg: 'Después de comer tres veces, Toby no tiene hambre',
        },
        { t: 'expr', code: 'format!("{}", Mascota::nueva("Rex"))', igual: '"Rex está Hambrienta"', msg: 'Una mascota nueva está hambrienta' },
      ],
    },
  ],
}

export const CURSO_RUST_AVANZADO: Curso = {
  id: 'rust-avanzado',
  titulo: 'Rust avanzado',
  emoji: '🦾',
  descripcion:
    'La segunda parte: lo que hace especial a Rust. Dueños y préstamos, structs y enums, Option en vez de null, iteradores, HashMap, Result con su signo ?, y traits, cerrando con una mascota virtual que junta todo.',
  lenguaje: 'rust',
  requiere: 'rust',
  despedida: 'Ya entiendes lo que hace diferente a Rust: dueños, préstamos y tipos que no dejan pasar un error. Eres un rustáceo de verdad 🦀.',
  lecciones: [L1, L2, L3, L4, L5, L6, L7, L8, L9, L10],
}
