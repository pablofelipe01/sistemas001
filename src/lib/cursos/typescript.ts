import type { Curso, Leccion } from './tipos'

/*
 * El curso de TypeScript: 10 lecciones de 5 retos, para unas 4 horas de clase.
 * Está abierto para todos: es para niños que ya saben JavaScript de la arena.
 *
 * TypeScript es JavaScript con tipos, así que cada lección pone lado a lado el
 * JavaScript que ya saben y lo que TypeScript le agrega. El compilador es el de
 * verdad (public/typescript/worker.js): si los tipos no cuadran, el programa no
 * se corre, y ese es el corazón del curso. Por eso varios retos arrancan con un
 * error de tipos que hay que arreglar.
 *
 * Las pruebas `rechaza` pegan un pedazo de código al final y miran que los
 * tipos lo atajen: así se comprueba que el alumno puso los tipos bien (y que no
 * se salió con la suya usando any).
 *
 * Ojo al escribir textos: ConCodigo usa las comillas invertidas para marcar
 * código, así que en las explicaciones, enunciados y pistas no se pueden
 * mostrar textos de plantilla. En los bloques de código sí.
 *
 * Cada reto tiene su solución de referencia. /verificar-curso las corre todas
 * contra sus pruebas: si se cambia un reto, abrir esa página.
 */

/** Una anotación de tipo: `nombre: tipo`, con espacios o sin ellos. */
const anotado = (nombre: string, tipo: string) => `\\b${nombre}\\s*:\\s*${tipo}`

const L1: Leccion = {
  id: 'ts-1',
  numero: 1,
  titulo: '¡Hola, TypeScript!',
  emoji: '👋',
  minutos: 20,
  explicacion: [
    {
      t: 'p',
      texto:
        'TypeScript es JavaScript con superpoderes. Todo lo que ya sabes sigue igual: `console.log`, `let`, `const`, `if`, las funciones. Lo nuevo es que le puedes decir a la compu de qué tipo es cada cosa. Lo usan en Microsoft, en Google y en casi todas las páginas grandes que conoces.',
    },
    {
      t: 'p',
      texto:
        'Los tipos van después de dos puntos. Los tres más básicos son `number` (números), `string` (textos) y `boolean` (true o false).',
    },
    {
      t: 'compara',
      js: 'let edad = 11;\nlet nombre = "Ana";\nlet juegaFutbol = true;',
      py: 'let edad: number = 11\nlet nombre: string = "Ana"\nlet juegaFutbol: boolean = true',
    },
    { t: 'codigo', codigo: 'let edad: number = 11\nlet nombre: string = "Ana"\nconsole.log(nombre, "tiene", edad, "años")' },
    {
      t: 'p',
      texto:
        '¿Y para qué? Porque antes de correr tu programa, TypeScript revisa que los tipos cuadren. Si escribes `let edad: number = "once"`, te avisa del error y no lo corre. En JavaScript ese error se escondía hasta que algo se rompía.',
    },
    {
      t: 'ojo',
      texto:
        'Los tipos van en minúscula: `number`, no `Number`. Y el punto y coma al final es opcional: aquí no lo vamos a usar.',
    },
  ],
  retos: [
    {
      id: 'ts-1-1',
      titulo: 'Tu primera caja con tipo',
      enunciado: 'Crea una variable nombre de tipo string que guarde el texto Luna, y muéstrala con console.log.',
      inicial: '// Crea aquí tu variable con su tipo\n',
      pista: 'let nombre: string = "Luna" y después console.log(nombre)',
      solucion: 'let nombre: string = "Luna"\nconsole.log(nombre)',
      pruebas: [
        { t: 'src', re: anotado('nombre', 'string'), msg: 'nombre tiene el tipo string' },
        { t: 'salida', igual: 'Luna', msg: 'Sale “Luna”' },
      ],
    },
    {
      id: 'ts-1-2',
      titulo: 'Tres tipos',
      enunciado:
        'Crea tres variables con su tipo: edad (number) con 11, ciudad (string) con Bogotá y tieneMascota (boolean) con true. Muéstralas en ese orden, cada una con su console.log.',
      inicial: '',
      pista: 'let edad: number = 11, y lo mismo con las otras dos. Ojo: true va sin comillas.',
      solucion:
        'let edad: number = 11\nlet ciudad: string = "Bogotá"\nlet tieneMascota: boolean = true\nconsole.log(edad)\nconsole.log(ciudad)\nconsole.log(tieneMascota)',
      pruebas: [
        { t: 'src', re: anotado('edad', 'number'), msg: 'edad es number' },
        { t: 'src', re: anotado('ciudad', 'string'), msg: 'ciudad es string' },
        { t: 'src', re: anotado('tieneMascota', 'boolean'), msg: 'tieneMascota es boolean' },
        { t: 'salida', igual: '11\nBogotá\ntrue', msg: 'Salen 11, Bogotá y true' },
      ],
    },
    {
      id: 'ts-1-3',
      titulo: 'Arregla la caja',
      enunciado:
        'Dale ▶ Correr y mira el error: puntos es un number pero le están guardando un texto. Arregla el valor (sin cambiar el tipo) para que muestre 100.',
      inicial: 'let puntos: number = "cien"\nconsole.log(puntos)\n',
      pista: 'Un número va sin comillas: 100, no "cien".',
      solucion: 'let puntos: number = 100\nconsole.log(puntos)',
      pruebas: [
        { t: 'src', re: anotado('puntos', 'number'), msg: 'puntos sigue siendo number' },
        { t: 'salida', igual: '100', msg: 'Sale 100' },
      ],
    },
    {
      id: 'ts-1-4',
      titulo: 'El tipo equivocado',
      enunciado:
        'Esta vez el valor está bien y el que se equivocó es el tipo: estaLloviendo guarda true o false. Cambia el tipo para que cuadre.',
      inicial: 'let estaLloviendo: string = true\nconsole.log(estaLloviendo)\n',
      pista: 'true y false son de tipo boolean.',
      solucion: 'let estaLloviendo: boolean = true\nconsole.log(estaLloviendo)',
      pruebas: [
        { t: 'src', re: anotado('estaLloviendo', 'boolean'), msg: 'estaLloviendo es boolean' },
        { t: 'salida', igual: 'true', msg: 'Sale true' },
      ],
    },
    {
      id: 'ts-1-5',
      titulo: 'Tarjeta de jugador',
      enunciado:
        'Crea apodo (string) con Rayo, nivel (number) con 7 y vip (boolean) con false. Después muestra en un solo renglón:\n\nRayo · nivel 7 · VIP: false',
      inicial: '',
      pista: 'Puedes pegar todo con +: apodo + " · nivel " + nivel + … o usar un texto de plantilla.',
      solucion:
        'let apodo: string = "Rayo"\nlet nivel: number = 7\nlet vip: boolean = false\nconsole.log(`${apodo} · nivel ${nivel} · VIP: ${vip}`)',
      pruebas: [
        { t: 'src', re: anotado('apodo', 'string'), msg: 'apodo es string' },
        { t: 'src', re: anotado('nivel', 'number'), msg: 'nivel es number' },
        { t: 'src', re: anotado('vip', 'boolean'), msg: 'vip es boolean' },
        { t: 'src', re: 'Rayo[^\\n]*\\bnivel\\b[^\\n]*VIP', not: true, msg: 'Usas las variables, no escribes todo en un solo texto' },
        { t: 'salida', igual: 'Rayo · nivel 7 · VIP: false', msg: 'Sale “Rayo · nivel 7 · VIP: false”' },
      ],
    },
  ],
}

const L2: Leccion = {
  id: 'ts-2',
  numero: 2,
  titulo: 'La compu adivina',
  emoji: '🔮',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'No siempre hay que escribir el tipo. Si haces `let vidas = 3`, TypeScript adivina solo que vidas es un `number`, y desde ahí lo cuida igual que si se lo hubieras dicho. A eso se le llama inferencia.',
    },
    { t: 'codigo', codigo: 'let vidas = 3      // TypeScript ya sabe que es number\nvidas = vidas - 1\nconsole.log(vidas)' },
    {
      t: 'p',
      texto:
        'Para preguntarle algo a quien usa el programa está `prompt`. Lo que responden llega siempre como `string`, aunque escriban un número. Para hacer cuentas, primero se convierte con `Number(…)`.',
    },
    {
      t: 'codigo',
      codigo: 'const texto = prompt("¿Cuántos años tienes? ")\nconst edad = Number(texto)\nconsole.log("El otro año tendrás", edad + 1)',
      entradas: ['11'],
    },
    {
      t: 'p',
      texto:
        'Aquí TypeScript te salva: si intentas `texto * 2` con un texto, te avisa antes de correr. Pero ojo, que con `+` no se queja: entre dos textos, `+` los pega. "3" + "5" da "35", no 8.',
    },
    {
      t: 'ojo',
      texto:
        'Una variable `const` no se puede cambiar, y una `let` sí, pero siempre con el mismo tipo: si nació number, se queda number.',
    },
  ],
  retos: [
    {
      id: 'ts-2-1',
      titulo: 'Sin decir el tipo',
      enunciado:
        'TypeScript adivinó que vidas es un number, y la segunda línea le quiere guardar un texto. Arregla la segunda línea (sin tocar la primera) para que vidas quede en 2.',
      inicial: 'let vidas = 3\nvidas = "dos"\nconsole.log(vidas)\n',
      pista: 'vidas = 2, o vidas = vidas - 1. Los números van sin comillas.',
      solucion: 'let vidas = 3\nvidas = vidas - 1\nconsole.log(vidas)',
      pruebas: [
        { t: 'src', re: '^let\\s+vidas\\s*=\\s*3\\s*$', flags: 'm', msg: 'La primera línea sigue igual: let vidas = 3' },
        { t: 'salida', igual: '2', msg: 'Sale 2' },
      ],
    },
    {
      id: 'ts-2-2',
      titulo: 'La pregunta',
      enunciado: 'Pregunta el nombre con prompt y saluda: Hola, (nombre)',
      inicial: '',
      entradas: ['Sara'],
      pista: 'const nombre = prompt("¿Cómo te llamas? ") y después console.log("Hola, " + nombre)',
      solucion: 'const nombre = prompt("¿Cómo te llamas? ")\nconsole.log("Hola, " + nombre)',
      pruebas: [
        { t: 'src', re: '\\bprompt\\s*\\(', msg: 'Usas prompt' },
        { t: 'linea', n: -1, igual: 'Hola, Sara', msg: 'A Sara le dice “Hola, Sara”' },
        { t: 'linea', n: -1, igual: 'Hola, Leo', entradas: ['Leo'], msg: 'A Leo le dice “Hola, Leo”' },
      ],
    },
    {
      id: 'ts-2-3',
      titulo: 'El doble',
      enunciado: 'Corre el programa: TypeScript no deja multiplicar un texto. Convierte la respuesta con Number para que muestre el doble.',
      inicial: 'const texto = prompt("Un número: ")\nconsole.log(texto * 2)\n',
      entradas: ['7'],
      pista: 'const numero = Number(texto) y después console.log(numero * 2)',
      solucion: 'const texto = prompt("Un número: ")\nconst numero = Number(texto)\nconsole.log(numero * 2)',
      pruebas: [
        { t: 'src', re: '\\bNumber\\s*\\(', msg: 'Usas Number(…)' },
        { t: 'linea', n: -1, igual: '14', msg: 'Con 7 sale 14' },
        { t: 'linea', n: -1, igual: '50', entradas: ['25'], msg: 'Con 25 sale 50' },
      ],
    },
    {
      id: 'ts-2-4',
      titulo: 'La suma tramposa',
      enunciado:
        'Este programa no tiene errores de tipos, pero con 3 y 5 muestra 35. ¿Por qué? Arréglalo para que sume de verdad.',
      inicial: 'const a = prompt("Primer número: ")\nconst b = prompt("Segundo número: ")\nconsole.log(a + b)\n',
      entradas: ['3', '5'],
      pista: 'a y b son textos, y + pega textos. Conviértelos con Number antes de sumar.',
      solucion:
        'const a = prompt("Primer número: ")\nconst b = prompt("Segundo número: ")\nconsole.log(Number(a) + Number(b))',
      pruebas: [
        { t: 'src', re: '\\bNumber\\s*\\(', msg: 'Usas Number(…)' },
        { t: 'linea', n: -1, igual: '8', msg: 'Con 3 y 5 sale 8' },
        { t: 'linea', n: -1, igual: '30', entradas: ['10', '20'], msg: 'Con 10 y 20 sale 30' },
      ],
    },
    {
      id: 'ts-2-5',
      titulo: '¿Cuántos años tienes?',
      enunciado:
        'Pregunta el año en que naciste. Guarda la edad en una variable edad de tipo number (estamos en 2026) y muestra: Tienes (edad) años',
      inicial: '',
      entradas: ['2014'],
      pista: 'const edad: number = 2026 - Number(año)',
      solucion:
        'const anio = prompt("¿En qué año naciste? ")\nconst edad: number = 2026 - Number(anio)\nconsole.log("Tienes " + edad + " años")',
      pruebas: [
        { t: 'src', re: anotado('edad', 'number'), msg: 'edad tiene el tipo number' },
        { t: 'linea', n: -1, igual: 'Tienes 12 años', msg: 'Si naciste en 2014: Tienes 12 años' },
        { t: 'linea', n: -1, igual: 'Tienes 10 años', entradas: ['2016'], msg: 'Si naciste en 2016: Tienes 10 años' },
      ],
    },
  ],
}

const L3: Leccion = {
  id: 'ts-3',
  numero: 3,
  titulo: 'Funciones con tipos',
  emoji: '🧩',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'En las funciones es donde los tipos más ayudan. A cada parámetro se le dice qué tipo recibe, y después del paréntesis va el tipo de lo que devuelve.',
    },
    {
      t: 'compara',
      js: 'function doble(n) {\n  return n * 2;\n}',
      py: 'function doble(n: number): number {\n  return n * 2\n}',
    },
    { t: 'codigo', codigo: 'function doble(n: number): number {\n  return n * 2\n}\nconsole.log(doble(4))\nconsole.log(doble(10))' },
    {
      t: 'p',
      texto:
        'Ahora si alguien escribe `doble("cuatro")`, TypeScript lo ataja antes de correr. Y si se te olvida el tipo de un parámetro, también se queja: no sabe qué le va a llegar.',
    },
    {
      t: 'p',
      texto: 'Si la función no devuelve nada (solo muestra cosas), su tipo es `void`, que quiere decir “nada”.',
    },
    {
      t: 'codigo',
      codigo: 'function anunciar(texto: string): void {\n  console.log("Atención: " + texto)\n}\nanunciar("hay recreo")',
    },
    {
      t: 'ojo',
      texto:
        'Hay un tipo `any` que quiere decir “cualquier cosa” y apaga la revisión. Parece cómodo, pero es como quitarle las pilas a la alarma. En este curso no lo vamos a usar.',
    },
  ],
  retos: [
    {
      id: 'ts-3-1',
      titulo: 'Saludo con tipo',
      enunciado: 'Corre el programa: TypeScript no sabe de qué tipo es nombre. Dile que es un string.',
      inicial: 'function saludar(nombre) {\n  return "Hola, " + nombre\n}\nconsole.log(saludar("Ana"))\n',
      pista: 'Dentro del paréntesis: (nombre: string)',
      solucion: 'function saludar(nombre: string): string {\n  return "Hola, " + nombre\n}\nconsole.log(saludar("Ana"))',
      pruebas: [
        { t: 'src', re: anotado('nombre', 'string'), msg: 'nombre es string' },
        { t: 'salida', igual: 'Hola, Ana', msg: 'Sale “Hola, Ana”' },
        { t: 'expr', code: 'saludar("Leo")', igual: '"Hola, Leo"', msg: 'saludar("Leo") devuelve "Hola, Leo"' },
        { t: 'rechaza', code: 'saludar(5)', msg: 'Si alguien escribe saludar(5), TypeScript se queja' },
      ],
    },
    {
      id: 'ts-3-2',
      titulo: 'El área',
      enunciado:
        'Escribe la función area, que recibe base y altura (los dos number) y devuelve un number: base por altura. Muestra area(4, 5).',
      inicial: '',
      pista: 'function area(base: number, altura: number): number { return … }',
      solucion: 'function area(base: number, altura: number): number {\n  return base * altura\n}\nconsole.log(area(4, 5))',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*number\\s*\\{', msg: 'Dices que devuelve un number' },
        { t: 'salida', igual: '20', msg: 'area(4, 5) muestra 20' },
        { t: 'expr', code: 'area(3, 7)', igual: '21', msg: 'area(3, 7) devuelve 21' },
        { t: 'rechaza', code: 'area("3", 7)', msg: 'area("3", 7) no pasa la revisión' },
      ],
    },
    {
      id: 'ts-3-3',
      titulo: 'Anuncios',
      enunciado:
        'Escribe la función anunciar: recibe un texto (string), no devuelve nada (void) y muestra >>> seguido del texto. Llámala dos veces, con Recreo y con Almuerzo.',
      inicial: '',
      pista: 'function anunciar(texto: string): void { console.log(">>> " + texto) }',
      solucion: 'function anunciar(texto: string): void {\n  console.log(">>> " + texto)\n}\nanunciar("Recreo")\nanunciar("Almuerzo")',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*void\\b', msg: 'Su tipo de salida es void' },
        { t: 'salida', igual: '>>> Recreo\n>>> Almuerzo', msg: 'Salen “>>> Recreo” y “>>> Almuerzo”' },
        { t: 'rechaza', code: 'anunciar(10)', msg: 'anunciar(10) no pasa la revisión' },
      ],
    },
    {
      id: 'ts-3-4',
      titulo: '¿Es par?',
      enunciado:
        'Escribe esPar: recibe un number y devuelve un boolean (true si es par). Muestra esPar(8) y esPar(3).',
      inicial: '',
      pista: 'Un número es par si n % 2 === 0. Puedes devolver eso directamente.',
      solucion: 'function esPar(n: number): boolean {\n  return n % 2 === 0\n}\nconsole.log(esPar(8))\nconsole.log(esPar(3))',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*boolean\\b', msg: 'Dices que devuelve un boolean' },
        { t: 'salida', igual: 'true\nfalse', msg: 'Salen true y false' },
        { t: 'expr', code: 'esPar(10)', igual: 'true', msg: 'esPar(10) es true' },
        { t: 'expr', code: 'esPar(7)', igual: 'false', msg: 'esPar(7) es false' },
        { t: 'rechaza', code: 'esPar("4")', msg: 'esPar("4") no pasa la revisión' },
      ],
    },
    {
      id: 'ts-3-5',
      titulo: 'El error escondido',
      enunciado:
        'La función total dice que devuelve un string, pero multiplica números. Arregla el tipo de lo que devuelve para que muestre 4500.',
      inicial:
        'function total(precio: number, cantidad: number): string {\n  return precio * cantidad\n}\nconsole.log(total(1500, 3))\n',
      pista: 'precio * cantidad es un number. Cambia lo que va después del paréntesis.',
      solucion: 'function total(precio: number, cantidad: number): number {\n  return precio * cantidad\n}\nconsole.log(total(1500, 3))',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*number\\s*\\{', msg: 'total devuelve un number' },
        { t: 'salida', igual: '4500', msg: 'Sale 4500' },
        { t: 'expr', code: 'total(2000, 2)', igual: '4000', msg: 'total(2000, 2) devuelve 4000' },
      ],
    },
  ],
}

const L4: Leccion = {
  id: 'ts-4',
  numero: 4,
  titulo: 'Listas con tipo',
  emoji: '📋',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Una lista de números es `number[]` y una de textos es `string[]`: el tipo de lo que guarda, con corchetes. Así nadie le puede meter algo de otro tipo.',
    },
    {
      t: 'compara',
      js: 'let notas = [4, 5, 3];\nnotas.push("cinco"); // JavaScript lo deja',
      py: 'let notas: number[] = [4, 5, 3]\nnotas.push(5) // con "cinco" no pasaría',
    },
    {
      t: 'p',
      texto:
        'Para recorrerla, el `for…of` es el más cómodo: en cada vuelta te da un dato, y TypeScript ya sabe de qué tipo es.',
    },
    {
      t: 'codigo',
      codigo: 'const frutas: string[] = ["mango", "fresa", "kiwi"]\nfor (const fruta of frutas) {\n  console.log(fruta.toUpperCase())\n}\nconsole.log(frutas.length, "frutas")',
    },
    {
      t: 'p',
      texto:
        '`map` crea una lista nueva cambiando cada dato, y `filter` una con los que cumplen una condición. TypeScript adivina el tipo de la lista nueva.',
    },
    {
      t: 'codigo',
      codigo: 'const numeros: number[] = [1, 2, 3, 4, 5]\nconst triples = numeros.map((n) => n * 3)\nconst grandes = numeros.filter((n) => n > 2)\nconsole.log(triples)\nconsole.log(grandes)',
    },
    {
      t: 'ojo',
      texto:
        'Una lista vacía `[]` no le dice a TypeScript qué va a guardar. Cuando arranques vacío, ponle el tipo: `const nombres: string[] = []`.',
    },
  ],
  retos: [
    {
      id: 'ts-4-1',
      titulo: 'La lista de frutas',
      enunciado:
        'Crea frutas, una lista de tipo string[] con mango, fresa y kiwi. Muestra la lista y, en otro renglón, cuántas frutas tiene.',
      inicial: '',
      pista: 'const frutas: string[] = ["mango", "fresa", "kiwi"]. El largo es frutas.length.',
      solucion: 'const frutas: string[] = ["mango", "fresa", "kiwi"]\nconsole.log(frutas)\nconsole.log(frutas.length)',
      pruebas: [
        { t: 'src', re: anotado('frutas', 'string\\s*\\[\\s*\\]'), msg: 'frutas es string[]' },
        { t: 'src', re: '\\.length\\b', msg: 'Usas .length' },
        { t: 'salida', igual: '["mango", "fresa", "kiwi"]\n3', msg: 'Sale la lista y después 3' },
      ],
    },
    {
      id: 'ts-4-2',
      titulo: 'Solo números',
      enunciado:
        'puntajes arranca vacía y así TypeScript no sabe qué va a guardar. Ponle el tipo number[] para que nadie le pueda meter un texto. Deja los dos push.',
      inicial: 'const puntajes = []\npuntajes.push(10)\npuntajes.push(25)\nconsole.log(puntajes)\n',
      pista: 'const puntajes: number[] = []',
      solucion: 'const puntajes: number[] = []\npuntajes.push(10)\npuntajes.push(25)\nconsole.log(puntajes)',
      pruebas: [
        { t: 'src', re: anotado('puntajes', 'number\\s*\\[\\s*\\]'), msg: 'puntajes es number[]' },
        { t: 'salida', igual: '[10, 25]', msg: 'Sale [10, 25]' },
        { t: 'rechaza', code: 'puntajes.push("treinta")', msg: 'puntajes.push("treinta") no pasa la revisión' },
      ],
    },
    {
      id: 'ts-4-3',
      titulo: 'El promedio',
      enunciado:
        'Suma las notas con un for…of y muestra Total: (suma). Después muestra Promedio: (la suma dividida entre cuántas notas hay).',
      inicial: 'const notas: number[] = [4, 5, 3, 5]\nlet suma: number = 0\n',
      pista: 'for (const nota of notas) { suma = suma + nota }. El promedio es suma / notas.length.',
      solucion:
        'const notas: number[] = [4, 5, 3, 5]\nlet suma: number = 0\nfor (const nota of notas) {\n  suma = suma + nota\n}\nconsole.log("Total: " + suma)\nconsole.log("Promedio: " + suma / notas.length)',
      pruebas: [
        { t: 'src', re: '\\bfor\\s*\\(\\s*(const|let)\\s+\\w+\\s+of\\b', msg: 'Usas un for…of' },
        { t: 'src', re: 'notas\\.length', msg: 'Divides entre notas.length' },
        { t: 'salida', igual: 'Total: 17\nPromedio: 4.25', msg: 'Salen Total: 17 y Promedio: 4.25' },
      ],
    },
    {
      id: 'ts-4-4',
      titulo: 'Todos al doble',
      enunciado: 'Con map, crea dobles: una lista number[] con cada número multiplicado por 2. Muéstrala.',
      inicial: 'const numeros: number[] = [1, 2, 3, 4]\n',
      pista: 'const dobles: number[] = numeros.map((n) => n * 2)',
      solucion: 'const numeros: number[] = [1, 2, 3, 4]\nconst dobles: number[] = numeros.map((n) => n * 2)\nconsole.log(dobles)',
      pruebas: [
        { t: 'src', re: '\\.map\\s*\\(', msg: 'Usas map' },
        { t: 'src', re: anotado('dobles', 'number\\s*\\[\\s*\\]'), msg: 'dobles es number[]' },
        { t: 'salida', igual: '[2, 4, 6, 8]', msg: 'Sale [2, 4, 6, 8]' },
      ],
    },
    {
      id: 'ts-4-5',
      titulo: 'Los que aprueban',
      enunciado:
        'Se aprueba con 3 o más. Con filter, crea aprobadas con las notas que pasan. Muéstrala y después: Aprobaron (cuántas)',
      inicial: 'const notas: number[] = [2.5, 4, 3.8, 1.9, 5]\n',
      pista: 'notas.filter((n) => n >= 3). Cuántas son: aprobadas.length.',
      solucion:
        'const notas: number[] = [2.5, 4, 3.8, 1.9, 5]\nconst aprobadas: number[] = notas.filter((n) => n >= 3)\nconsole.log(aprobadas)\nconsole.log("Aprobaron " + aprobadas.length)',
      pruebas: [
        { t: 'src', re: '\\.filter\\s*\\(', msg: 'Usas filter' },
        { t: 'salida', igual: '[4, 3.8, 5]\nAprobaron 3', msg: 'Sale [4, 3.8, 5] y Aprobaron 3' },
      ],
    },
  ],
}

const L5: Leccion = {
  id: 'ts-5',
  numero: 5,
  titulo: 'Objetos con forma',
  emoji: '🧱',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Con `type` le pones nombre a la forma de un objeto: qué datos tiene y de qué tipo es cada uno. Después lo usas como cualquier otro tipo.',
    },
    {
      t: 'compara',
      js: 'const mia = {\n  nombre: "Firulais",\n  edad: 3,\n};',
      py: 'type Mascota = {\n  nombre: string\n  edad: number\n}\n\nconst mia: Mascota = {\n  nombre: "Firulais",\n  edad: 3,\n}',
    },
    {
      t: 'p',
      texto:
        'Si a un objeto le falta un dato, si le sobra uno que no está en el tipo, o si escribes mal `mia.nombr`, TypeScript te avisa. Se acabaron los undefined misteriosos.',
    },
    {
      t: 'codigo',
      codigo: 'type Mascota = {\n  nombre: string\n  edad: number\n}\n\nfunction presentar(m: Mascota): string {\n  return m.nombre + " tiene " + m.edad + " años"\n}\n\nconst mia: Mascota = { nombre: "Firulais", edad: 3 }\nconsole.log(presentar(mia))',
    },
    {
      t: 'p',
      texto:
        'También se puede escribir con `interface Mascota { … }`: para objetos, `type` e `interface` sirven casi igual. Y una lista de mascotas es `Mascota[]`.',
    },
    {
      t: 'ojo',
      texto:
        'Los nombres de los tipos van con mayúscula al principio (`Mascota`, `Libro`), para no confundirlos con las variables.',
    },
  ],
  retos: [
    {
      id: 'ts-5-1',
      titulo: 'Tu tipo Mascota',
      enunciado:
        'Crea el tipo Mascota con nombre (string), especie (string) y edad (number). Crea mia, de tipo Mascota: Firulais, perro, 3. Muestra:\n\nFirulais es un perro de 3 años',
      inicial: '',
      pista: 'type Mascota = { nombre: string; especie: string; edad: number }. Después const mia: Mascota = { … }',
      solucion:
        'type Mascota = {\n  nombre: string\n  especie: string\n  edad: number\n}\n\nconst mia: Mascota = { nombre: "Firulais", especie: "perro", edad: 3 }\nconsole.log(mia.nombre + " es un " + mia.especie + " de " + mia.edad + " años")',
      pruebas: [
        { t: 'src', re: '\\b(type\\s+Mascota\\s*=|interface\\s+Mascota\\b)', msg: 'Creas el tipo Mascota' },
        { t: 'src', re: anotado('mia', 'Mascota\\b'), msg: 'mia es de tipo Mascota' },
        { t: 'salida', igual: 'Firulais es un perro de 3 años', msg: 'Sale “Firulais es un perro de 3 años”' },
        {
          t: 'rechaza',
          code: 'const _sinEdad: Mascota = { nombre: "Michi", especie: "gato" }',
          msg: 'Una Mascota sin edad no pasa la revisión',
        },
        {
          t: 'rechaza',
          code: 'const _edadDeTexto: Mascota = { nombre: "Michi", especie: "gato", edad: "dos" }',
          msg: 'Una Mascota con la edad en texto no pasa',
        },
      ],
    },
    {
      id: 'ts-5-2',
      titulo: 'Le falta algo',
      enunciado: 'Corre el programa: al libro le falta un dato que el tipo pide. Agrégaselo: El Principito tiene 96 páginas.',
      inicial:
        'type Libro = {\n  titulo: string\n  autor: string\n  paginas: number\n}\n\nconst libro: Libro = { titulo: "El Principito", autor: "Saint-Exupéry" }\nconsole.log(libro.titulo + " tiene " + libro.paginas + " páginas")\n',
      pista: 'Dentro de las llaves del libro, agrega paginas: 96 (con una coma antes).',
      solucion:
        'type Libro = {\n  titulo: string\n  autor: string\n  paginas: number\n}\n\nconst libro: Libro = { titulo: "El Principito", autor: "Saint-Exupéry", paginas: 96 }\nconsole.log(libro.titulo + " tiene " + libro.paginas + " páginas")',
      pruebas: [
        { t: 'src', re: anotado('paginas', 'number'), msg: 'El tipo Libro sigue pidiendo paginas: number' },
        { t: 'salida', igual: 'El Principito tiene 96 páginas', msg: 'Sale “El Principito tiene 96 páginas”' },
      ],
    },
    {
      id: 'ts-5-3',
      titulo: 'Mal escrito',
      enunciado: 'Corre el programa: hay un dato mal escrito y TypeScript hasta te dice cuál quisiste poner. Arréglalo.',
      inicial:
        'interface Jugador {\n  nombre: string\n  goles: number\n}\n\nconst j: Jugador = { nombre: "Linda", goles: 12 }\nconsole.log(j.nombre + " lleva " + j.gols + " goles")\n',
      pista: 'Mira bien la última línea: ¿gols o goles?',
      solucion:
        'interface Jugador {\n  nombre: string\n  goles: number\n}\n\nconst j: Jugador = { nombre: "Linda", goles: 12 }\nconsole.log(j.nombre + " lleva " + j.goles + " goles")',
      pruebas: [
        { t: 'src', re: '\\binterface\\s+Jugador\\b', msg: 'Sigue la interface Jugador' },
        { t: 'salida', igual: 'Linda lleva 12 goles', msg: 'Sale “Linda lleva 12 goles”' },
      ],
    },
    {
      id: 'ts-5-4',
      titulo: 'La etiqueta del precio',
      enunciado:
        'Escribe etiqueta: recibe un Producto y devuelve un string así: Lápiz: $1500. Muestra la etiqueta del lápiz.',
      inicial: 'type Producto = {\n  nombre: string\n  precio: number\n}\n\nconst lapiz: Producto = { nombre: "Lápiz", precio: 1500 }\n',
      pista: 'function etiqueta(p: Producto): string { return p.nombre + ": $" + p.precio }',
      solucion:
        'type Producto = {\n  nombre: string\n  precio: number\n}\n\nconst lapiz: Producto = { nombre: "Lápiz", precio: 1500 }\n\nfunction etiqueta(p: Producto): string {\n  return p.nombre + ": $" + p.precio\n}\nconsole.log(etiqueta(lapiz))',
      pruebas: [
        { t: 'src', re: '\\(\\s*\\w+\\s*:\\s*Producto\\s*\\)', msg: 'etiqueta recibe un Producto' },
        { t: 'salida', igual: 'Lápiz: $1500', msg: 'Sale “Lápiz: $1500”' },
        { t: 'expr', code: 'etiqueta({ nombre: "Borrador", precio: 800 })', igual: '"Borrador: $800"', msg: 'Con el borrador: "Borrador: $800"' },
        { t: 'rechaza', code: 'etiqueta({ nombre: "Regla" })', msg: 'Un producto sin precio no pasa la revisión' },
      ],
    },
    {
      id: 'ts-5-5',
      titulo: 'La lista del curso',
      enunciado:
        'Crea curso, una lista de tipo Estudiante[] con Ana (4.5), Beto (3.2) y Caro (4.8). Recórrela y muestra cada uno así: Ana: 4.5',
      inicial: 'type Estudiante = {\n  nombre: string\n  nota: number\n}\n',
      pista: 'const curso: Estudiante[] = [{ nombre: "Ana", nota: 4.5 }, …]. Después un for…of.',
      solucion:
        'type Estudiante = {\n  nombre: string\n  nota: number\n}\n\nconst curso: Estudiante[] = [\n  { nombre: "Ana", nota: 4.5 },\n  { nombre: "Beto", nota: 3.2 },\n  { nombre: "Caro", nota: 4.8 },\n]\nfor (const e of curso) {\n  console.log(e.nombre + ": " + e.nota)\n}',
      pruebas: [
        { t: 'src', re: anotado('curso', 'Estudiante\\s*\\[\\s*\\]'), msg: 'curso es Estudiante[]' },
        { t: 'salida', igual: 'Ana: 4.5\nBeto: 3.2\nCaro: 4.8', msg: 'Salen los tres con su nota' },
        { t: 'rechaza', code: 'curso.push({ nombre: "Dani" })', msg: 'Un estudiante sin nota no se puede agregar' },
      ],
    },
  ],
}

const L6: Leccion = {
  id: 'ts-6',
  numero: 6,
  titulo: 'Lo que puede faltar',
  emoji: '❓',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'A veces un dato puede estar o no. Un signo de pregunta lo vuelve opcional: `apodo?: string` quiere decir que puede haber apodo… o no. Cuando no está, vale `undefined`.',
    },
    {
      t: 'codigo',
      codigo: 'type Amigo = {\n  nombre: string\n  apodo?: string\n}\n\nconst a: Amigo = { nombre: "Felipe", apodo: "Pipe" }\nconst b: Amigo = { nombre: "Laura" }\nconsole.log(a.apodo)\nconsole.log(b.apodo)',
    },
    {
      t: 'p',
      texto:
        'TypeScript no te deja usar algo que puede ser `undefined` como si siempre estuviera. Tienes dos salidas: preguntar con un `if`, o dar un valor por si acaso con `??`.',
    },
    {
      t: 'codigo',
      codigo: 'let apodo: string | undefined = undefined\n\nif (apodo) {\n  console.log("Te dicen " + apodo)\n} else {\n  console.log("No tienes apodo")\n}\n\nconsole.log(apodo ?? "sin apodo")',
    },
    {
      t: 'p',
      texto:
        'Los parámetros también pueden ser opcionales: `function saludar(nombre: string, saludo?: string)`. Y `find`, que busca en una lista, puede no encontrar nada: por eso devuelve el dato o `undefined`.',
    },
    {
      t: 'ojo',
      texto:
        '`??` usa lo de la derecha solo si lo de la izquierda es undefined (o null). `apodo ?? "sin apodo"` se lee: el apodo, y si no hay, "sin apodo".',
    },
  ],
  retos: [
    {
      id: 'ts-6-1',
      titulo: 'El apodo opcional',
      enunciado:
        'Laura no tiene apodo y TypeScript se queja. Vuelve opcional el apodo. Después escribe comoLlamar: recibe un Amigo y devuelve su apodo, o su nombre si no tiene (usa ??).',
      inicial:
        'type Amigo = {\n  nombre: string\n  apodo: string\n}\n\nconst pipe: Amigo = { nombre: "Felipe", apodo: "Pipe" }\nconst laura: Amigo = { nombre: "Laura" }\n',
      pista: 'apodo?: string en el tipo. La función: return a.apodo ?? a.nombre',
      solucion:
        'type Amigo = {\n  nombre: string\n  apodo?: string\n}\n\nconst pipe: Amigo = { nombre: "Felipe", apodo: "Pipe" }\nconst laura: Amigo = { nombre: "Laura" }\n\nfunction comoLlamar(a: Amigo): string {\n  return a.apodo ?? a.nombre\n}\nconsole.log(comoLlamar(pipe))\nconsole.log(comoLlamar(laura))',
      pruebas: [
        { t: 'src', re: '\\bapodo\\s*\\?\\s*:', msg: 'apodo es opcional (apodo?:)' },
        { t: 'src', re: '\\?\\?', msg: 'Usas ??' },
        { t: 'expr', code: 'comoLlamar({ nombre: "Felipe", apodo: "Pipe" })', igual: '"Pipe"', msg: 'A Felipe le dice Pipe' },
        { t: 'expr', code: 'comoLlamar({ nombre: "Tomás" })', igual: '"Tomás"', msg: 'A Tomás, sin apodo, le dice Tomás' },
      ],
    },
    {
      id: 'ts-6-2',
      titulo: 'Un saludo por defecto',
      enunciado:
        'Escribe saludar: recibe un nombre y, si quieren, un saludo (opcional). Devuelve el saludo, una coma y el nombre. Sin saludo, usa Hola.\n\nsaludar("Ana") → Hola, Ana\nsaludar("Ana", "Buenos días") → Buenos días, Ana',
      inicial: '',
      pista: 'function saludar(nombre: string, saludo?: string): string. Adentro: (saludo ?? "Hola") + ", " + nombre',
      solucion:
        'function saludar(nombre: string, saludo?: string): string {\n  return (saludo ?? "Hola") + ", " + nombre\n}\nconsole.log(saludar("Ana"))\nconsole.log(saludar("Ana", "Buenos días"))',
      pruebas: [
        { t: 'expr', code: 'saludar("Ana")', igual: '"Hola, Ana"', msg: 'saludar("Ana") da "Hola, Ana"' },
        { t: 'expr', code: 'saludar("Leo", "Buenas noches")', igual: '"Buenas noches, Leo"', msg: 'saludar("Leo", "Buenas noches") da "Buenas noches, Leo"' },
        { t: 'rechaza', code: 'saludar()', msg: 'Sin nombre no pasa la revisión' },
        { t: 'rechaza', code: 'saludar("Ana", 5)', msg: 'Un saludo que no es texto no pasa' },
      ],
    },
    {
      id: 'ts-6-3',
      titulo: 'Buscar en la lista',
      enunciado:
        'Corre el programa: find puede no encontrar a nadie, y entonces encontrado es undefined. Pregunta con un if: si hay, muéstralo en mayúsculas; si no, muestra No hay nadie',
      inicial:
        'const nombres: string[] = ["Pedro", "Marta", "Luis"]\nconst encontrado = nombres.find((n) => n.startsWith("M"))\nconsole.log(encontrado.toUpperCase())\n',
      pista: 'if (encontrado) { console.log(encontrado.toUpperCase()) } else { … }',
      solucion:
        'const nombres: string[] = ["Pedro", "Marta", "Luis"]\nconst encontrado = nombres.find((n) => n.startsWith("M"))\nif (encontrado) {\n  console.log(encontrado.toUpperCase())\n} else {\n  console.log("No hay nadie")\n}',
      pruebas: [
        { t: 'src', re: '\\.find\\s*\\(', msg: 'Sigues buscando con find' },
        { t: 'src', re: '\\bif\\s*\\(', msg: 'Preguntas con un if' },
        { t: 'src', re: '\\w!\\s*\\.|\\bas\\s+string\\b', not: true, msg: 'Sin trucos: ni ! ni as string' },
        { t: 'salida', igual: 'MARTA', msg: 'Sale MARTA' },
        { t: 'src', re: 'No hay nadie', msg: 'Tienes el “No hay nadie” para cuando no encuentre' },
      ],
    },
    {
      id: 'ts-6-4',
      titulo: 'El pedido',
      enunciado:
        'Escribe describir: recibe un Pedido y devuelve "(plato) con (bebida)", o "(plato) sin bebida" si no pidieron.\n\nArroz con limonada\nSopa sin bebida',
      inicial:
        'type Pedido = {\n  plato: string\n  bebida?: string\n}\n\nconsole.log(describir({ plato: "Arroz", bebida: "limonada" }))\nconsole.log(describir({ plato: "Sopa" }))\n',
      pista: 'if (p.bebida) { return p.plato + " con " + p.bebida } y si no, el otro return.',
      solucion:
        'type Pedido = {\n  plato: string\n  bebida?: string\n}\n\nfunction describir(p: Pedido): string {\n  if (p.bebida) {\n    return p.plato + " con " + p.bebida\n  }\n  return p.plato + " sin bebida"\n}\n\nconsole.log(describir({ plato: "Arroz", bebida: "limonada" }))\nconsole.log(describir({ plato: "Sopa" }))',
      pruebas: [
        { t: 'src', re: '\\(\\s*\\w+\\s*:\\s*Pedido\\s*\\)', msg: 'describir recibe un Pedido' },
        { t: 'salida', igual: 'Arroz con limonada\nSopa sin bebida', msg: 'Salen “Arroz con limonada” y “Sopa sin bebida”' },
        { t: 'expr', code: 'describir({ plato: "Pasta", bebida: "jugo" })', igual: '"Pasta con jugo"', msg: 'Pasta con jugo' },
        { t: 'rechaza', code: 'describir({ bebida: "agua" })', msg: 'Un pedido sin plato no pasa la revisión' },
      ],
    },
    {
      id: 'ts-6-5',
      titulo: '¿Quién tiene la camiseta?',
      enunciado:
        'Escribe quienTiene: recibe un número y devuelve el nombre de quien tiene esa camiseta en el equipo. Si nadie la tiene: Nadie tiene la (número)',
      inicial:
        'type Jugador = {\n  nombre: string\n  numero: number\n}\n\nconst equipo: Jugador[] = [\n  { nombre: "Luis", numero: 10 },\n  { nombre: "Juana", numero: 7 },\n  { nombre: "Pedro", numero: 1 },\n]\n',
      pista: 'const j = equipo.find((x) => x.numero === numero). Si j existe, devuelve j.nombre.',
      solucion:
        'type Jugador = {\n  nombre: string\n  numero: number\n}\n\nconst equipo: Jugador[] = [\n  { nombre: "Luis", numero: 10 },\n  { nombre: "Juana", numero: 7 },\n  { nombre: "Pedro", numero: 1 },\n]\n\nfunction quienTiene(numero: number): string {\n  const j = equipo.find((x) => x.numero === numero)\n  if (j) {\n    return j.nombre\n  }\n  return "Nadie tiene la " + numero\n}\nconsole.log(quienTiene(7))\nconsole.log(quienTiene(9))',
      pruebas: [
        { t: 'expr', code: 'quienTiene(10)', igual: '"Luis"', msg: 'La 10 es de Luis' },
        { t: 'expr', code: 'quienTiene(7)', igual: '"Juana"', msg: 'La 7 es de Juana' },
        { t: 'expr', code: 'quienTiene(9)', igual: '"Nadie tiene la 9"', msg: 'La 9 no es de nadie' },
        { t: 'rechaza', code: 'quienTiene("10")', msg: 'quienTiene("10") no pasa la revisión' },
      ],
    },
  ],
}

const L7: Leccion = {
  id: 'ts-7',
  numero: 7,
  titulo: 'Esto o aquello',
  emoji: '🔀',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Una variable puede aceptar más de un tipo si los juntas con una barra: `string | number` quiere decir “un texto o un número”. Se llama unión.',
    },
    { t: 'codigo', codigo: 'let codigo: string | number = 1234\nconsole.log(codigo)\ncodigo = "A-77"\nconsole.log(codigo)' },
    {
      t: 'p',
      texto:
        'Pero con una unión, TypeScript no te deja usar lo que es solo de uno: `codigo.toUpperCase()` no pasa, porque si es número se rompería. Primero pregunta con `typeof`, y adentro del if TypeScript ya sabe cuál es.',
    },
    {
      t: 'codigo',
      codigo: 'function mostrar(dato: string | number): void {\n  if (typeof dato === "string") {\n    console.log("Texto:", dato.toUpperCase())\n  } else {\n    console.log("Número:", dato * 10)\n  }\n}\nmostrar("hola")\nmostrar(5)',
    },
    {
      t: 'p',
      texto:
        'Una lista que mezcla tipos se escribe con paréntesis: `(string | number)[]`. Y `null` sirve para decir “todavía nada”: `let ganador: string | null = null`.',
    },
    {
      t: 'ojo',
      texto: 'Con `typeof` se compara con el nombre del tipo entre comillas: `typeof x === "number"`, no `typeof x === number`.',
    },
  ],
  retos: [
    {
      id: 'ts-7-1',
      titulo: 'Número o texto',
      enunciado: 'Corre el programa: codigo empieza como número y después le guardan un texto. Cambia el tipo para que acepte los dos.',
      inicial: 'let codigo: number = 1234\nconsole.log(codigo)\ncodigo = "A-77"\nconsole.log(codigo)\n',
      pista: 'let codigo: number | string = 1234',
      solucion: 'let codigo: number | string = 1234\nconsole.log(codigo)\ncodigo = "A-77"\nconsole.log(codigo)',
      pruebas: [
        { t: 'src', re: anotado('codigo', '(number\\s*\\|\\s*string|string\\s*\\|\\s*number)'), msg: 'codigo es number | string' },
        { t: 'salida', igual: '1234\nA-77', msg: 'Salen 1234 y A-77' },
        { t: 'rechaza', code: 'codigo = true', msg: 'Un boolean no se puede guardar en codigo' },
      ],
    },
    {
      id: 'ts-7-2',
      titulo: 'typeof al rescate',
      enunciado:
        'Escribe describir: recibe un string | number. Si es texto devuelve Texto de (letras) letras; si es número devuelve Número (el número).\n\ndescribir("sol") → Texto de 3 letras\ndescribir(42) → Número 42',
      inicial: '',
      pista: 'if (typeof dato === "string") { return "Texto de " + dato.length + " letras" }',
      solucion:
        'function describir(dato: string | number): string {\n  if (typeof dato === "string") {\n    return "Texto de " + dato.length + " letras"\n  }\n  return "Número " + dato\n}\nconsole.log(describir("sol"))\nconsole.log(describir(42))',
      pruebas: [
        { t: 'src', re: '\\btypeof\\b', msg: 'Usas typeof' },
        { t: 'expr', code: 'describir("sol")', igual: '"Texto de 3 letras"', msg: 'describir("sol") → Texto de 3 letras' },
        { t: 'expr', code: 'describir("estrella")', igual: '"Texto de 8 letras"', msg: 'describir("estrella") → Texto de 8 letras' },
        { t: 'expr', code: 'describir(42)', igual: '"Número 42"', msg: 'describir(42) → Número 42' },
        { t: 'rechaza', code: 'describir(true)', msg: 'describir(true) no pasa la revisión' },
      ],
    },
    {
      id: 'ts-7-3',
      titulo: 'El precio con decimales',
      enunciado:
        'Corre el programa: toFixed es de los números, y precio también puede ser texto. Usa typeof: si es número, devuelve "$" + precio.toFixed(2); si es texto, devuelve "$" + precio, tal cual.',
      inicial:
        'function formatear(precio: number | string): string {\n  return "$" + precio.toFixed(2)\n}\nconsole.log(formatear(5))\nconsole.log(formatear("7.50"))\n',
      pista: 'if (typeof precio === "number") { return "$" + precio.toFixed(2) } y después el otro return.',
      solucion:
        'function formatear(precio: number | string): string {\n  if (typeof precio === "number") {\n    return "$" + precio.toFixed(2)\n  }\n  return "$" + precio\n}\nconsole.log(formatear(5))\nconsole.log(formatear("7.50"))',
      pruebas: [
        { t: 'src', re: '\\btypeof\\b', msg: 'Usas typeof' },
        { t: 'salida', igual: '$5.00\n$7.50', msg: 'Salen $5.00 y $7.50' },
        { t: 'expr', code: 'formatear(3.5)', igual: '"$3.50"', msg: 'formatear(3.5) → $3.50' },
      ],
    },
    {
      id: 'ts-7-4',
      titulo: 'La cartuchera',
      enunciado:
        'cosas mezcla textos y números. Ponle el tipo (string | number)[]. Recórrela: suma los números y junta los textos en otra lista. Muestra:\n\nTextos: lápiz,borrador\nSuma: 13',
      inicial: 'const cosas = ["lápiz", 3, "borrador", 10]\nconst textos: string[] = []\nlet suma = 0\n',
      pista: 'Dentro del for…of: if (typeof c === "number") { suma = suma + c } else { textos.push(c) }. Al final "Textos: " + textos.',
      solucion:
        'const cosas: (string | number)[] = ["lápiz", 3, "borrador", 10]\nconst textos: string[] = []\nlet suma = 0\nfor (const c of cosas) {\n  if (typeof c === "number") {\n    suma = suma + c\n  } else {\n    textos.push(c)\n  }\n}\nconsole.log("Textos: " + textos)\nconsole.log("Suma: " + suma)',
      pruebas: [
        {
          t: 'src',
          re: anotado('cosas', '(\\(\\s*(string\\s*\\|\\s*number|number\\s*\\|\\s*string)\\s*\\)\\s*\\[\\s*\\]|Array\\s*<)'),
          msg: 'cosas es (string | number)[]',
        },
        { t: 'src', re: '\\btypeof\\b', msg: 'Usas typeof' },
        { t: 'salida', igual: 'Textos: lápiz,borrador\nSuma: 13', msg: 'Salen los textos y la suma 13' },
      ],
    },
    {
      id: 'ts-7-5',
      titulo: 'Todavía nada',
      enunciado:
        'Escribe ganador: recibe los puntos de A y de B y devuelve "A", "B" o null si empatan. Su tipo de salida es string | null. Muestra ganador(5, 8) y ganador(4, 4), y cuando sea null muestra Empate (con ??).',
      inicial: '',
      pista: 'if (a > b) return "A"; if (b > a) return "B"; return null. Al mostrar: ganador(4, 4) ?? "Empate"',
      solucion:
        'function ganador(a: number, b: number): string | null {\n  if (a > b) return "A"\n  if (b > a) return "B"\n  return null\n}\nconsole.log(ganador(5, 8) ?? "Empate")\nconsole.log(ganador(4, 4) ?? "Empate")',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*(string\\s*\\|\\s*null|null\\s*\\|\\s*string)\\b', msg: 'Devuelve string | null' },
        { t: 'src', re: '\\?\\?', msg: 'Usas ??' },
        { t: 'salida', igual: 'B\nEmpate', msg: 'Salen B y Empate' },
        { t: 'expr', code: 'ganador(3, 1)', igual: '"A"', msg: 'ganador(3, 1) es "A"' },
        { t: 'expr', code: 'ganador(2, 2)', igual: 'null', msg: 'ganador(2, 2) es null' },
      ],
    },
  ],
}

const L8: Leccion = {
  id: 'ts-8',
  numero: 8,
  titulo: 'Solo estos valores',
  emoji: '🎯',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Un tipo también puede ser una lista cerrada de valores. `type Luz = "rojo" | "amarillo" | "verde"` quiere decir que solo se valen esos tres textos. Si escribes "azul", o "verd" por un error de dedo, TypeScript te avisa.',
    },
    {
      t: 'codigo',
      codigo: 'type Luz = "rojo" | "amarillo" | "verde"\n\nlet luz: Luz = "verde"\nconsole.log(luz)\nluz = "rojo"\nconsole.log(luz)',
    },
    {
      t: 'p',
      texto:
        'Van perfecto con `switch`: un `case` por cada valor. Y si escribes un case que no existe, TypeScript también lo nota.',
    },
    {
      t: 'codigo',
      codigo: 'type Dia = "sábado" | "domingo" | "lunes"\n\nfunction plan(d: Dia): string {\n  switch (d) {\n    case "sábado":\n      return "fútbol"\n    case "domingo":\n      return "piscina"\n    case "lunes":\n      return "colegio"\n  }\n}\nconsole.log(plan("domingo"))',
    },
    {
      t: 'p',
      texto:
        'Y con `Record<Luz, number>` haces un objeto que tiene que traer una llave por cada valor: ni una de más, ni una de menos.',
    },
    {
      t: 'codigo',
      codigo: 'type Talla = "S" | "M" | "L"\n\nconst precios: Record<Talla, number> = { S: 30000, M: 35000, L: 40000 }\nconsole.log(precios.M)',
    },
    {
      t: 'ojo',
      texto: 'Las mayúsculas y las tildes cuentan: "Rojo" no es "rojo", y "sabado" no es "sábado".',
    },
  ],
  retos: [
    {
      id: 'ts-8-1',
      titulo: 'El semáforo',
      enunciado:
        'Crea el tipo Luz con rojo, amarillo y verde, y úsalo para luz. TypeScript se va a quejar de la segunda línea: cámbiala para que luz quede en amarillo.',
      inicial: 'let luz: string = "verde"\nluz = "morado"\nconsole.log(luz)\n',
      pista: 'type Luz = "rojo" | "amarillo" | "verde" arriba de todo, y let luz: Luz = "verde"',
      solucion: 'type Luz = "rojo" | "amarillo" | "verde"\n\nlet luz: Luz = "verde"\nluz = "amarillo"\nconsole.log(luz)',
      pruebas: [
        { t: 'src', re: '\\btype\\s+Luz\\s*=', msg: 'Creas el tipo Luz' },
        { t: 'src', re: anotado('luz', 'Luz\\b'), msg: 'luz es de tipo Luz' },
        { t: 'salida', igual: 'amarillo', msg: 'Sale amarillo' },
        { t: 'rechaza', code: 'luz = "azul"', msg: 'luz = "azul" no pasa la revisión' },
      ],
    },
    {
      id: 'ts-8-2',
      titulo: '¿Puedo pasar?',
      enunciado: 'Escribe queHago con un switch: con rojo devuelve Para, con amarillo Cuidado y con verde Pasa.',
      inicial: 'type Luz = "rojo" | "amarillo" | "verde"\n\nfunction queHago(luz: Luz): string {\n  \n}\nconsole.log(queHago("verde"))\n',
      pista: 'switch (luz) { case "rojo": return "Para" … }',
      solucion:
        'type Luz = "rojo" | "amarillo" | "verde"\n\nfunction queHago(luz: Luz): string {\n  switch (luz) {\n    case "rojo":\n      return "Para"\n    case "amarillo":\n      return "Cuidado"\n    case "verde":\n      return "Pasa"\n  }\n}\nconsole.log(queHago("verde"))',
      pruebas: [
        { t: 'src', re: '\\bswitch\\s*\\(', msg: 'Usas switch' },
        { t: 'expr', code: 'queHago("rojo")', igual: '"Para"', msg: 'rojo → Para' },
        { t: 'expr', code: 'queHago("amarillo")', igual: '"Cuidado"', msg: 'amarillo → Cuidado' },
        { t: 'expr', code: 'queHago("verde")', igual: '"Pasa"', msg: 'verde → Pasa' },
        { t: 'rechaza', code: 'queHago("azul")', msg: 'queHago("azul") no pasa la revisión' },
      ],
    },
    {
      id: 'ts-8-3',
      titulo: 'Piedra, papel o tijera',
      enunciado:
        'Crea el tipo Jugada (piedra, papel o tijera) y la función leGanaA: recibe una Jugada y devuelve la Jugada a la que le gana. La piedra le gana a la tijera, la tijera al papel y el papel a la piedra.',
      inicial: '',
      pista: 'function leGanaA(j: Jugada): Jugada { switch (j) { case "piedra": return "tijera" … } }',
      solucion:
        'type Jugada = "piedra" | "papel" | "tijera"\n\nfunction leGanaA(j: Jugada): Jugada {\n  switch (j) {\n    case "piedra":\n      return "tijera"\n    case "tijera":\n      return "papel"\n    case "papel":\n      return "piedra"\n  }\n}\nconsole.log(leGanaA("piedra"))',
      pruebas: [
        { t: 'src', re: '\\btype\\s+Jugada\\s*=', msg: 'Creas el tipo Jugada' },
        { t: 'expr', code: 'leGanaA("piedra")', igual: '"tijera"', msg: 'La piedra le gana a la tijera' },
        { t: 'expr', code: 'leGanaA("tijera")', igual: '"papel"', msg: 'La tijera le gana al papel' },
        { t: 'expr', code: 'leGanaA("papel")', igual: '"piedra"', msg: 'El papel le gana a la piedra' },
        { t: 'rechaza', code: 'leGanaA("lagarto")', msg: 'leGanaA("lagarto") no pasa la revisión' },
        { t: 'rechaza', code: 'const _r: "piedra" = leGanaA("papel")', msg: 'leGanaA devuelve una Jugada, no un string cualquiera' },
      ],
    },
    {
      id: 'ts-8-4',
      titulo: '¿Quién gana?',
      enunciado:
        'Usa leGanaA para escribir partida: recibe dos jugadas y devuelve "gana 1", "gana 2" o "empate". Su tipo de salida es justo esa unión de tres textos.',
      inicial:
        'type Jugada = "piedra" | "papel" | "tijera"\n\nfunction leGanaA(j: Jugada): Jugada {\n  if (j === "piedra") return "tijera"\n  if (j === "tijera") return "papel"\n  return "piedra"\n}\n',
      pista: 'Si son iguales, empate. Si leGanaA(a) === b, gana 1. Si no, gana 2.',
      solucion:
        'type Jugada = "piedra" | "papel" | "tijera"\n\nfunction leGanaA(j: Jugada): Jugada {\n  if (j === "piedra") return "tijera"\n  if (j === "tijera") return "papel"\n  return "piedra"\n}\n\nfunction partida(a: Jugada, b: Jugada): "gana 1" | "gana 2" | "empate" {\n  if (a === b) return "empate"\n  if (leGanaA(a) === b) return "gana 1"\n  return "gana 2"\n}\nconsole.log(partida("papel", "piedra"))',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*"[^"]+"\\s*\\|', msg: 'El tipo de salida es una unión de textos' },
        { t: 'expr', code: 'partida("piedra", "piedra")', igual: '"empate"', msg: 'piedra contra piedra → empate' },
        { t: 'expr', code: 'partida("piedra", "tijera")', igual: '"gana 1"', msg: 'piedra contra tijera → gana 1' },
        { t: 'expr', code: 'partida("papel", "piedra")', igual: '"gana 1"', msg: 'papel contra piedra → gana 1' },
        { t: 'expr', code: 'partida("tijera", "piedra")', igual: '"gana 2"', msg: 'tijera contra piedra → gana 2' },
        { t: 'expr', code: 'partida("papel", "tijera")', igual: '"gana 2"', msg: 'papel contra tijera → gana 2' },
        { t: 'rechaza', code: 'const _p: "empate" = partida("papel", "papel")', msg: 'La salida no es un string cualquiera' },
      ],
    },
    {
      id: 'ts-8-5',
      titulo: 'Las tallas',
      enunciado:
        'Crea el tipo Talla (S, M y L) y precios, de tipo Record<Talla, number>: S cuesta 30000, M 35000 y L 40000. Escribe precio: recibe una Talla y devuelve lo que cuesta. Muestra precio("M").',
      inicial: '',
      pista: 'const precios: Record<Talla, number> = { S: 30000, … }. La función devuelve precios[t].',
      solucion:
        'type Talla = "S" | "M" | "L"\n\nconst precios: Record<Talla, number> = { S: 30000, M: 35000, L: 40000 }\n\nfunction precio(t: Talla): number {\n  return precios[t]\n}\nconsole.log(precio("M"))',
      pruebas: [
        { t: 'src', re: '\\bRecord\\s*<\\s*Talla\\s*,\\s*number\\s*>', msg: 'precios es Record<Talla, number>' },
        { t: 'salida', igual: '35000', msg: 'precio("M") muestra 35000' },
        { t: 'expr', code: 'precio("L")', igual: '40000', msg: 'La L cuesta 40000' },
        { t: 'expr', code: 'precio("S")', igual: '30000', msg: 'La S cuesta 30000' },
        { t: 'rechaza', code: 'const _faltaL: Record<Talla, number> = { S: 1, M: 2 }', msg: 'Talla tiene las tres: S, M y L' },
        { t: 'rechaza', code: 'precio("XL")', msg: 'precio("XL") no pasa la revisión' },
      ],
    },
  ],
}

const L9: Leccion = {
  id: 'ts-9',
  numero: 9,
  titulo: 'Cajas para todo',
  emoji: '🎁',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Imagina una función que devuelve el primero de una lista. Sirve igual para números, textos o mascotas. ¿Qué tipo le pones? Para eso están los genéricos: una letra entre `< >` que dice “el tipo que me den”.',
    },
    {
      t: 'codigo',
      codigo: 'function primero<T>(lista: T[]): T {\n  return lista[0]\n}\n\nconst n = primero([7, 8, 9])         // T es number\nconst p = primero(["sol", "luna"])   // T es string\nconsole.log(n + 1)\nconsole.log(p.toUpperCase())',
    },
    {
      t: 'p',
      texto:
        'La `T` se llena sola al llamar la función. Por eso TypeScript sabe que `n` es number y `p` es string, y te deja hacer `p.toUpperCase()`. Con `any` habrías perdido esa información.',
    },
    {
      t: 'p',
      texto: 'Los tipos también pueden llevar su letra. Ya conoces uno: `Array<number>` es lo mismo que `number[]`.',
    },
    {
      t: 'codigo',
      codigo: 'type Caja<T> = {\n  contenido: T\n  etiqueta: string\n}\n\nconst regalo: Caja<string> = { contenido: "balón", etiqueta: "para Leo" }\nconsole.log(regalo.etiqueta + ": " + regalo.contenido)',
    },
    {
      t: 'p',
      texto:
        'Una función también puede recibir otra función. Su tipo se escribe así: `(x: number) => boolean` es una función que recibe un número y devuelve un boolean. Como la que le pasas a `filter`.',
    },
    {
      t: 'ojo',
      texto: 'Se acostumbra usar `T` (de tipo), pero es un nombre como cualquier otro. Lo importante es ponerlo entre `< >` antes del paréntesis.',
    },
  ],
  retos: [
    {
      id: 'ts-9-1',
      titulo: 'El primero de lo que sea',
      enunciado: 'Escribe primero con un genérico T: recibe una lista T[] y devuelve el dato de la posición 0, de tipo T. Muestra primero(["mango", "kiwi"]).',
      inicial: '',
      pista: 'function primero<T>(lista: T[]): T { return lista[0] }',
      solucion: 'function primero<T>(lista: T[]): T {\n  return lista[0]\n}\nconsole.log(primero(["mango", "kiwi"]))',
      pruebas: [
        { t: 'src', re: '\\bprimero\\s*<\\s*\\w+\\s*>', msg: 'primero tiene su <T>' },
        { t: 'salida', igual: 'mango', msg: 'Sale mango' },
        { t: 'expr', code: 'primero([3, 4, 5])', igual: '3', msg: 'primero([3, 4, 5]) es 3' },
        { t: 'rechaza', code: 'const _n: number = primero(["hola"])', msg: 'El primero de una lista de textos es un texto, no un número' },
      ],
    },
    {
      id: 'ts-9-2',
      titulo: 'El último',
      enunciado:
        'Escribe ultimo: recibe una lista T[] y devuelve el último dato, o undefined si la lista está vacía. Su tipo de salida es T | undefined.',
      inicial: '',
      pista: 'function ultimo<T>(lista: T[]): T | undefined { return lista[lista.length - 1] }',
      solucion:
        'function ultimo<T>(lista: T[]): T | undefined {\n  return lista[lista.length - 1]\n}\nconsole.log(ultimo([1, 2, 3]))\nconsole.log(ultimo([]))',
      pruebas: [
        { t: 'src', re: '\\bultimo\\s*<\\s*\\w+\\s*>', msg: 'ultimo tiene su <T>' },
        { t: 'src', re: '\\)\\s*:\\s*\\w+\\s*\\|\\s*undefined\\b', msg: 'Devuelve T | undefined' },
        { t: 'expr', code: 'ultimo([1, 2, 3])', igual: '3', msg: 'ultimo([1, 2, 3]) es 3' },
        { t: 'expr', code: 'ultimo(["a", "b"])', igual: '"b"', msg: 'ultimo(["a", "b"]) es "b"' },
        { t: 'expr', code: 'ultimo([])', igual: 'undefined', msg: 'ultimo([]) es undefined' },
        { t: 'rechaza', code: 'const _s: string = ultimo(["a"])', msg: 'Hay que revisar el undefined antes de usarlo' },
      ],
    },
    {
      id: 'ts-9-3',
      titulo: 'Cajas de regalo',
      enunciado:
        'Crea el tipo Caja<T> con contenido (T) y etiqueta (string). Crea dos cajas: numeros, una Caja<number> con 42 y la etiqueta respuesta; y saludo, una Caja<string> con hola y la etiqueta palabra. Muestra:\n\nrespuesta: 42\npalabra: hola',
      inicial: '',
      pista: 'type Caja<T> = { contenido: T; etiqueta: string }. Después const numeros: Caja<number> = { … }',
      solucion:
        'type Caja<T> = {\n  contenido: T\n  etiqueta: string\n}\n\nconst numeros: Caja<number> = { contenido: 42, etiqueta: "respuesta" }\nconst saludo: Caja<string> = { contenido: "hola", etiqueta: "palabra" }\nconsole.log(numeros.etiqueta + ": " + numeros.contenido)\nconsole.log(saludo.etiqueta + ": " + saludo.contenido)',
      pruebas: [
        { t: 'src', re: '\\b(type\\s+Caja\\s*<\\s*\\w+\\s*>\\s*=|interface\\s+Caja\\s*<)', msg: 'Creas el tipo Caja<T>' },
        { t: 'src', re: anotado('numeros', 'Caja\\s*<\\s*number\\s*>'), msg: 'numeros es Caja<number>' },
        { t: 'src', re: anotado('saludo', 'Caja\\s*<\\s*string\\s*>'), msg: 'saludo es Caja<string>' },
        { t: 'salida', igual: 'respuesta: 42\npalabra: hola', msg: 'Salen las dos etiquetas con su contenido' },
        {
          t: 'rechaza',
          code: 'const _c: Caja<number> = { contenido: "cuarenta", etiqueta: "x" }',
          msg: 'Una Caja<number> no acepta un texto',
        },
      ],
    },
    {
      id: 'ts-9-4',
      titulo: 'Repetir lo que sea',
      enunciado:
        'Escribe repetir: recibe una cosa de tipo T y cuántas veces, y devuelve una lista T[] con la cosa repetida.\n\nrepetir("hola", 3) → ["hola", "hola", "hola"]',
      inicial: '',
      pista: 'Empieza con const lista: T[] = [], y un for que haga push las veces que digan.',
      solucion:
        'function repetir<T>(cosa: T, veces: number): T[] {\n  const lista: T[] = []\n  for (let i = 0; i < veces; i++) {\n    lista.push(cosa)\n  }\n  return lista\n}\nconsole.log(repetir("hola", 3))',
      pruebas: [
        { t: 'src', re: '\\brepetir\\s*<\\s*\\w+\\s*>', msg: 'repetir tiene su <T>' },
        { t: 'expr', code: 'repetir("hola", 3)', igual: '["hola", "hola", "hola"]', msg: 'repetir("hola", 3)' },
        { t: 'expr', code: 'repetir(7, 2)', igual: '[7, 7]', msg: 'repetir(7, 2) es [7, 7]' },
        { t: 'expr', code: 'repetir("x", 0)', igual: '[]', msg: 'repetir("x", 0) es []' },
        { t: 'rechaza', code: 'const _x: string[] = repetir(1, 2)', msg: 'Repetir un número da una lista de números' },
      ],
    },
    {
      id: 'ts-9-5',
      titulo: 'Contar los que cumplen',
      enunciado:
        'Escribe contarSi: recibe una lista T[] y una prueba de tipo (x: T) => boolean, y devuelve cuántos datos de la lista pasan la prueba.\n\ncontarSi([1, 5, 8], (n) => n > 4) → 2',
      inicial: '',
      pista: 'function contarSi<T>(lista: T[], prueba: (x: T) => boolean): number. Adentro, un for…of que sume 1 cuando prueba(x) dé true.',
      solucion:
        'function contarSi<T>(lista: T[], prueba: (x: T) => boolean): number {\n  let cuantos = 0\n  for (const x of lista) {\n    if (prueba(x)) cuantos++\n  }\n  return cuantos\n}\nconsole.log(contarSi([1, 5, 8], (n) => n > 4))',
      pruebas: [
        { t: 'src', re: '\\bcontarSi\\s*<\\s*\\w+\\s*>', msg: 'contarSi tiene su <T>' },
        { t: 'src', re: '\\(\\s*\\w+\\s*:\\s*\\w+\\s*\\)\\s*=>\\s*boolean', msg: 'La prueba es de tipo (x: T) => boolean' },
        { t: 'expr', code: 'contarSi([1, 5, 8], (n) => n > 4)', igual: '2', msg: 'contarSi([1, 5, 8], n > 4) es 2' },
        { t: 'expr', code: 'contarSi(["sol", "luna", "mar"], (p) => p.length === 3)', igual: '2', msg: 'Palabras de 3 letras: 2' },
        { t: 'expr', code: 'contarSi([], () => true)', igual: '0', msg: 'En una lista vacía: 0' },
        { t: 'rechaza', code: 'contarSi([1, 2], (p: string) => p.length > 1)', msg: 'La prueba tiene que recibir el mismo tipo de la lista' },
      ],
    },
  ],
}

const L10: Leccion = {
  id: 'ts-10',
  numero: 10,
  titulo: 'Clases con tipos',
  emoji: '🏰',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Una clase es un molde para crear objetos que tienen datos y saben hacer cosas. En TypeScript, los datos de la clase se declaran arriba con su tipo, y el `constructor` les da su valor.',
    },
    {
      t: 'compara',
      js: 'class Perro {\n  constructor(nombre) {\n    this.nombre = nombre;\n  }\n}',
      py: 'class Perro {\n  nombre: string\n\n  constructor(nombre: string) {\n    this.nombre = nombre\n  }\n}',
    },
    {
      t: 'codigo',
      codigo: 'class Perro {\n  nombre: string\n\n  constructor(nombre: string) {\n    this.nombre = nombre\n  }\n\n  ladrar(): string {\n    return this.nombre + " dice guau"\n  }\n}\n\nconst rex = new Perro("Rex")\nconsole.log(rex.ladrar())',
    },
    {
      t: 'p',
      texto:
        'Dos palabras nuevas para cuidar los datos. `private`: solo se puede usar adentro de la clase; desde afuera, nadie lo toca. `readonly`: se le da valor al crearlo y después no se puede cambiar.',
    },
    {
      t: 'codigo',
      codigo: 'class Marcador {\n  readonly equipo: string\n  private goles: number = 0\n\n  constructor(equipo: string) {\n    this.equipo = equipo\n  }\n\n  gol(): void {\n    this.goles++\n  }\n\n  ver(): string {\n    return this.equipo + ": " + this.goles\n  }\n}\n\nconst m = new Marcador("Millonarios")\nm.gol()\nm.gol()\nconsole.log(m.ver())',
    },
    {
      t: 'p',
      texto:
        'Y con `implements` una clase promete cumplir una interface: tener todos sus datos y métodos. Si se le olvida uno, TypeScript te lo dice.',
    },
    {
      t: 'ojo',
      texto: 'Adentro de la clase, los datos se usan con `this.`: `this.goles`, no `goles` a secas.',
    },
  ],
  retos: [
    {
      id: 'ts-10-1',
      titulo: 'La clase Gato',
      enunciado:
        'Crea la clase Gato con nombre (string), su constructor y el método maullar, que devuelve un string: (nombre) dice miau. Crea a Michi y muestra lo que dice.',
      inicial: '',
      pista: 'Como el Perro de la explicación: nombre: string arriba, el constructor y maullar(): string { return this.nombre + " dice miau" }',
      solucion:
        'class Gato {\n  nombre: string\n\n  constructor(nombre: string) {\n    this.nombre = nombre\n  }\n\n  maullar(): string {\n    return this.nombre + " dice miau"\n  }\n}\n\nconst michi = new Gato("Michi")\nconsole.log(michi.maullar())',
      pruebas: [
        { t: 'src', re: '\\bclass\\s+Gato\\b', msg: 'Creas la clase Gato' },
        { t: 'salida', igual: 'Michi dice miau', msg: 'Sale “Michi dice miau”' },
        { t: 'expr', code: 'new Gato("Tom").maullar()', igual: '"Tom dice miau"', msg: 'Tom dice miau' },
        { t: 'rechaza', code: 'new Gato(5)', msg: 'new Gato(5) no pasa la revisión' },
        { t: 'rechaza', code: 'const _m: number = new Gato("x").maullar()', msg: 'maullar devuelve un string' },
      ],
    },
    {
      id: 'ts-10-2',
      titulo: 'La alcancía',
      enunciado:
        'Crea la clase Alcancia con un total privado que arranca en 0, el método meter(monedas: number): void que lo suma, y cuanto(): number que lo devuelve. Mete 500 y 200 y muestra cuánto hay.',
      inicial: '',
      pista: 'private total: number = 0. En meter: this.total = this.total + monedas.',
      solucion:
        'class Alcancia {\n  private total: number = 0\n\n  meter(monedas: number): void {\n    this.total = this.total + monedas\n  }\n\n  cuanto(): number {\n    return this.total\n  }\n}\n\nconst a = new Alcancia()\na.meter(500)\na.meter(200)\nconsole.log(a.cuanto())',
      pruebas: [
        { t: 'src', re: '\\bprivate\\s+total\\b', msg: 'total es private' },
        { t: 'salida', igual: '700', msg: 'Sale 700' },
        {
          t: 'expr',
          code: '(() => { const x = new Alcancia(); x.meter(1000); x.meter(50); return x.cuanto() })()',
          igual: '1050',
          msg: 'Con 1000 y 50: 1050',
        },
        { t: 'expr', code: 'new Alcancia().cuanto()', igual: '0', msg: 'Una alcancía nueva tiene 0' },
        { t: 'rechaza', code: 'new Alcancia().total = 1000000', msg: 'Nadie puede cambiar el total desde afuera' },
      ],
    },
    {
      id: 'ts-10-3',
      titulo: 'El carné',
      enunciado:
        'El código de un carné no debería cambiar nunca. Ponle readonly a codigo. TypeScript se va a quejar de la línea que lo cambia: bórrala.',
      inicial:
        'class Carne {\n  codigo: string\n  nombre: string\n\n  constructor(codigo: string, nombre: string) {\n    this.codigo = codigo\n    this.nombre = nombre\n  }\n}\n\nconst c = new Carne("A-123", "Sofía")\nc.codigo = "HACKEADO"\nconsole.log(c.codigo + " · " + c.nombre)\n',
      pista: 'readonly codigo: string, y borra la línea c.codigo = "HACKEADO".',
      solucion:
        'class Carne {\n  readonly codigo: string\n  nombre: string\n\n  constructor(codigo: string, nombre: string) {\n    this.codigo = codigo\n    this.nombre = nombre\n  }\n}\n\nconst c = new Carne("A-123", "Sofía")\nconsole.log(c.codigo + " · " + c.nombre)',
      pruebas: [
        { t: 'src', re: '\\breadonly\\s+codigo\\b', msg: 'codigo es readonly' },
        { t: 'salida', igual: 'A-123 · Sofía', msg: 'Sale “A-123 · Sofía”' },
        { t: 'rechaza', code: 'new Carne("X", "Y").codigo = "Z"', msg: 'Nadie puede cambiar el código' },
      ],
    },
    {
      id: 'ts-10-4',
      titulo: 'Figuras',
      enunciado:
        'Escribe las clases Cuadrado (recibe el lado) y Rectangulo (recibe base y altura). Las dos implementan Figura. Después recorre la lista y muestra cada una así: cuadrado: 9',
      inicial:
        'interface Figura {\n  nombre: string\n  area(): number\n}\n\n// Escribe aquí las dos clases\n\nconst figuras: Figura[] = [new Cuadrado(3), new Rectangulo(2, 5)]\n',
      pista: 'class Cuadrado implements Figura { nombre: string = "cuadrado"; lado: number; constructor(lado: number) {…} area(): number {…} }',
      solucion:
        'interface Figura {\n  nombre: string\n  area(): number\n}\n\nclass Cuadrado implements Figura {\n  nombre: string = "cuadrado"\n  lado: number\n\n  constructor(lado: number) {\n    this.lado = lado\n  }\n\n  area(): number {\n    return this.lado * this.lado\n  }\n}\n\nclass Rectangulo implements Figura {\n  nombre: string = "rectángulo"\n  base: number\n  altura: number\n\n  constructor(base: number, altura: number) {\n    this.base = base\n    this.altura = altura\n  }\n\n  area(): number {\n    return this.base * this.altura\n  }\n}\n\nconst figuras: Figura[] = [new Cuadrado(3), new Rectangulo(2, 5)]\nfor (const f of figuras) {\n  console.log(f.nombre + ": " + f.area())\n}',
      pruebas: [
        { t: 'src', re: '\\bimplements\\s+Figura\\b', min: 2, msg: 'Las dos clases implementan Figura' },
        { t: 'salida', igual: 'cuadrado: 9\nrectángulo: 10', msg: 'Salen cuadrado: 9 y rectángulo: 10' },
        { t: 'expr', code: 'new Cuadrado(4).area()', igual: '16', msg: 'Un cuadrado de lado 4 tiene área 16' },
        { t: 'expr', code: 'new Rectangulo(3, 7).area()', igual: '21', msg: 'Un rectángulo de 3 por 7 tiene área 21' },
      ],
    },
    {
      id: 'ts-10-5',
      titulo: 'La mascota virtual',
      enunciado:
        'El gran final. Crea la clase Mascota: recibe su nombre, tiene un hambre privado que arranca en 5 y estos métodos:\n\ncomer(): void — el hambre baja 2 (pero nunca de 0)\njugar(): void — el hambre sube 1\nanimo(): Animo — "feliz" si el hambre es menor que 5, "hambrienta" si no\nestado(): string — (nombre) está (ánimo)',
      inicial:
        'type Animo = "feliz" | "hambrienta"\n\n// Escribe aquí la clase Mascota\n\nconst kiwi = new Mascota("Kiwi")\nconsole.log(kiwi.estado())\nkiwi.comer()\nconsole.log(kiwi.estado())\nkiwi.jugar()\nkiwi.jugar()\nconsole.log(kiwi.estado())\n',
      pista:
        'Para que no baje de 0: this.hambre = Math.max(0, this.hambre - 2). En animo: if (this.hambre < 5) return "feliz".',
      solucion:
        'type Animo = "feliz" | "hambrienta"\n\nclass Mascota {\n  readonly nombre: string\n  private hambre: number = 5\n\n  constructor(nombre: string) {\n    this.nombre = nombre\n  }\n\n  comer(): void {\n    this.hambre = Math.max(0, this.hambre - 2)\n  }\n\n  jugar(): void {\n    this.hambre++\n  }\n\n  animo(): Animo {\n    if (this.hambre < 5) return "feliz"\n    return "hambrienta"\n  }\n\n  estado(): string {\n    return this.nombre + " está " + this.animo()\n  }\n}\n\nconst kiwi = new Mascota("Kiwi")\nconsole.log(kiwi.estado())\nkiwi.comer()\nconsole.log(kiwi.estado())\nkiwi.jugar()\nkiwi.jugar()\nconsole.log(kiwi.estado())',
      pruebas: [
        { t: 'src', re: '\\bclass\\s+Mascota\\b', msg: 'Creas la clase Mascota' },
        { t: 'src', re: '\\bprivate\\s+hambre\\b', msg: 'hambre es private' },
        { t: 'src', re: '\\)\\s*:\\s*Animo\\b', msg: 'animo devuelve un Animo' },
        { t: 'salida', igual: 'Kiwi está hambrienta\nKiwi está feliz\nKiwi está hambrienta', msg: 'Hambrienta, feliz y otra vez hambrienta' },
        {
          t: 'expr',
          code: '(() => { const m = new Mascota("Lola"); m.comer(); m.comer(); m.comer(); m.comer(); m.jugar(); m.jugar(); m.jugar(); m.jugar(); return m.estado() })()',
          igual: '"Lola está feliz"',
          msg: 'El hambre nunca baja de 0: después de mucho comer y 4 juegos, sigue feliz',
        },
        {
          t: 'expr',
          code: '(() => { const m = new Mascota("Toby"); m.comer(); return m.animo() })()',
          igual: '"feliz"',
          msg: 'Después de comer, feliz',
        },
        { t: 'rechaza', code: 'new Mascota("x").hambre = 0', msg: 'Nadie le cambia el hambre desde afuera' },
      ],
    },
  ],
}

export const CURSO_TYPESCRIPT: Curso = {
  id: 'typescript',
  titulo: 'TypeScript desde JavaScript',
  emoji: '🔷',
  descripcion:
    'El JavaScript que ya sabes, con superpoderes: le dices a la compu de qué tipo es cada cosa y ella encuentra los errores antes de correr el programa. Diez lecciones, desde el primer number hasta tus propias clases, cerrando con una mascota virtual.',
  lenguaje: 'typescript',
  despedida: 'Ya escribes el JavaScript que se usa en las empresas: con tipos que atrapan los errores antes de que pasen.',
  lecciones: [L1, L2, L3, L4, L5, L6, L7, L8, L9, L10],
}
