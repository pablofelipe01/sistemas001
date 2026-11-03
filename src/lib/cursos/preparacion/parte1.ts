import type { Leccion, Practica } from '../tipos'

/*
 * Curso de preparación para el examen de Python: puntos 1 a 5.
 *
 * Cada lección es un punto del examen, en el mismo orden: qué es, para qué
 * sirve, cómo se usa, ejemplos que se corren, el error típico (sacado de lo
 * que pasó en el examen de verdad) y "Prepárate: la pregunta N será sobre
 * esto". Los retos van de menos a más: "inténtalo tú", "ahora un poco más" y
 * "como en el examen". Las preguntas se parecen a las del examen, pero no son
 * las mismas: el examen no se toca.
 */

export const LECCIONES_1: Leccion[] = [
  {
    id: 'pre-1',
    numero: 1,
    titulo: 'print: mostrar cosas en la pantalla',
    emoji: '🖨️',
    minutos: 10,
    explicacion: [
      { t: 'p', texto: 'Punto 1 de 30. Empezamos por lo más básico de todo: `print`.' },
      {
        t: 'p',
        texto:
          '`print` sirve para mostrar algo en la pantalla. Todo lo que quieras que se vea, pasa por un print. Si tu programa hace una cuenta pero no tiene print, la cuenta se hace… pero nadie la ve.',
      },
      {
        t: 'p',
        texto:
          'Se usa así: la palabra `print`, un paréntesis, y adentro lo que quieres mostrar. Si es un texto, va entre comillas. Dale ▶ Correr al ejemplo:',
      },
      { t: 'codigo', codigo: 'print("Hola, mundo")' },
      { t: 'p', texto: 'Cada print sale en su propio renglón. Si quieres dos renglones, escribes dos print, uno debajo del otro:' },
      { t: 'codigo', codigo: 'print("Me llamo Python")\nprint("Y me gusta programar")' },
      {
        t: 'ojo',
        texto:
          'La frase tiene que quedar exactamente igual a la que te piden. "Bienvenido" no es lo mismo que "Bienvenidos": una letra de más o de menos hace perder puntos. Y no se te olviden las comillas: `print(Hola)` sin comillas es un error.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 1 del examen será sobre print. Te van a pedir que Python muestre dos renglones, exactamente como están escritos. Dos renglones = dos print.',
      },
    ],
    retos: [
      {
        id: 'pre-1-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Haz que Python muestre esta frase:\n\nHola, estoy aprendiendo Python',
        inicial: '',
        pista: 'La palabra print, un paréntesis, y la frase entre comillas: `print("…")`.',
        solucion: 'print("Hola, estoy aprendiendo Python")',
        pruebas: [
          { t: 'src', re: '\\bprint\\s*\\(', msg: 'Usa print' },
          { t: 'salida', igual: 'Hola, estoy aprendiendo Python', msg: 'Sale la frase, igualita' },
        ],
      },
      {
        id: 'pre-1-2',
        titulo: 'Ahora en dos renglones',
        enunciado: 'Muy bien. Ahora en dos renglones. Haz que salga esto:\n\nBuenos días\nHoy aprendo Python',
        inicial: '',
        pista: 'Dos renglones son dos print, uno debajo del otro.',
        solucion: 'print("Buenos días")\nprint("Hoy aprendo Python")',
        pruebas: [
          { t: 'src', re: '\\bprint\\s*\\(', min: 2, msg: 'Usa dos print' },
          { t: 'linea', n: 0, igual: 'Buenos días', msg: 'El primer renglón es “Buenos días”' },
          { t: 'linea', n: 1, igual: 'Hoy aprendo Python', msg: 'El segundo renglón es “Hoy aprendo Python”' },
          { t: 'salida', igual: 'Buenos días\nHoy aprendo Python', msg: 'No sale nada más' },
        ],
      },
      {
        id: 'pre-1-3',
        titulo: 'Como en el examen',
        enunciado:
          'Así viene en el examen: copia las frases exactamente, letra por letra. Haz que Python muestre estos dos renglones:\n\nYa estoy listo\nPara la primera pregunta',
        inicial: '',
        pista: 'Fíjate bien en cada letra: "listo", no "lista"; "Para la primera pregunta", completa.',
        solucion: 'print("Ya estoy listo")\nprint("Para la primera pregunta")',
        pruebas: [
          { t: 'src', re: '\\bprint\\s*\\(', msg: 'Usa print' },
          { t: 'linea', n: 0, igual: 'Ya estoy listo', msg: 'El primer renglón es “Ya estoy listo”' },
          { t: 'linea', n: 1, igual: 'Para la primera pregunta', msg: 'El segundo renglón es “Para la primera pregunta”' },
          { t: 'salida', igual: 'Ya estoy listo\nPara la primera pregunta', msg: 'No sale nada más' },
        ],
      },
    ],
  },
  {
    id: 'pre-2',
    numero: 2,
    titulo: 'Texto y números no son lo mismo',
    emoji: '🔤',
    minutos: 10,
    explicacion: [
      { t: 'p', texto: 'Punto 2. Python distingue entre números y textos, y los trata muy distinto.' },
      { t: 'p', texto: 'Un número va sin comillas: `5`. Un texto va entre comillas: `"5"`. Se ven parecidos, pero no son lo mismo.' },
      { t: 'p', texto: 'Con números, el `+` suma:' },
      { t: 'codigo', codigo: 'print(5 + 3)' },
      { t: 'p', texto: 'Con textos, el `+` no suma: los pega, uno detrás del otro. Corre este y mira lo que sale:' },
      { t: 'codigo', codigo: 'print("5" + "3")\nprint("sol" + "dado")' },
      {
        t: 'ojo',
        texto:
          '`"5" + "3"` da `53`, no `8`. Las comillas convierten el número en texto, y los textos se pegan. Si quieres que Python haga una cuenta, los números van SIN comillas.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 2 del examen es de falso o verdadero. Te mostrarán un print con números entre comillas y un +. Pregúntate: ¿tienen comillas? Entonces se pegan, no se suman.',
      },
    ],
    retos: [
      {
        id: 'pre-2-1',
        titulo: 'Inténtalo tú: sumar',
        enunciado: 'Haz que Python sume 7 y 5 y muestre el resultado. La cuenta la hace Python: escribe los números sin comillas.',
        inicial: '',
        pista: 'Dentro del print va la cuenta, sin comillas: `print(7 + 5)`.',
        solucion: 'print(7 + 5)',
        pruebas: [
          { t: 'src', re: '\\+', msg: 'Suma con +' },
          { t: 'src', re: '\\b12\\b', not: true, msg: 'No escribe el resultado a mano' },
          { t: 'salida', igual: '12', msg: 'Sale 12' },
        ],
      },
      {
        id: 'pre-2-2',
        titulo: 'Ahora pegar',
        enunciado: 'Ahora al revés: usa los textos "7" y "5" (con comillas) y el + para que salga:\n\n75',
        inicial: '',
        pista: 'Con comillas, el + pega: `print("7" + "5")`.',
        solucion: 'print("7" + "5")',
        pruebas: [
          { t: 'src', re: '"7"\\s*\\+\\s*"5"|\'7\'\\s*\\+\\s*\'5\'', msg: 'Pega "7" + "5"' },
          { t: 'salida', igual: '75', msg: 'Sale 75' },
        ],
      },
      {
        id: 'pre-2-3',
        titulo: 'Los dos en un programa',
        enunciado:
          'En un mismo programa, haz dos print:\n\n• el primero suma los números 4 y 4 (sale 8)\n• el segundo pega los textos "4" y "4" (sale 44)',
        inicial: '',
        pista: 'Uno sin comillas y otro con comillas: `print(4 + 4)` y `print("4" + "4")`.',
        solucion: 'print(4 + 4)\nprint("4" + "4")',
        pruebas: [
          { t: 'src', re: '"4"\\s*\\+\\s*"4"|\'4\'\\s*\\+\\s*\'4\'', msg: 'Pega "4" + "4"' },
          { t: 'linea', n: 0, igual: '8', msg: 'El primer renglón es 8' },
          { t: 'linea', n: 1, igual: '44', msg: 'El segundo renglón es 44' },
        ],
      },
    ],
  },
  {
    id: 'pre-3',
    numero: 3,
    titulo: 'Dividir: /, // y el sobrante %',
    emoji: '➗',
    minutos: 12,
    explicacion: [
      { t: 'p', texto: 'Punto 3. En Python hay tres maneras de dividir, y cada una sirve para algo distinto.' },
      { t: 'p', texto: '`/` es la división normal: puede dar decimales. `//` es la división entera: cuántas veces cabe, sin decimales. `%` es el sobrante: lo que queda cuando ya no cabe más.' },
      { t: 'codigo', codigo: 'print(17 / 5)\nprint(17 // 5)\nprint(17 % 5)' },
      {
        t: 'p',
        texto:
          'Piénsalo con dulces: 17 dulces para 5 amigos. A cada uno le tocan 3 (`17 // 5`), porque 5 × 3 = 15. Y sobran 2 (`17 % 5`), porque de 15 a 17 faltan 2.',
      },
      { t: 'codigo', codigo: 'print(20 // 6)\nprint(20 % 6)' },
      {
        t: 'ojo',
        texto:
          '`%` NO es porcentaje en Python: es el sobrante de una división. `17 % 5` da `2`, no `3` ni `3.4`. Para sacarlo de cabeza: ¿cuántas veces cabe? ¿cuánto falta para llegar?',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 3 del examen es de selección múltiple: te mostrarán un print con % y tendrás que escoger lo que sale. Haz la cuenta de los dulces: cuántos le tocan, y cuántos sobran.',
      },
    ],
    retos: [
      {
        id: 'pre-3-1',
        titulo: 'Inténtalo tú: el sobrante',
        enunciado: 'Haz que Python muestre cuánto sobra al repartir 20 entre 6. Usa %.',
        inicial: '',
        pista: '`print(20 % 6)`',
        solucion: 'print(20 % 6)',
        pruebas: [
          { t: 'src', re: '%', msg: 'Usa %' },
          { t: 'salida', igual: '2', msg: 'Sale 2' },
        ],
      },
      {
        id: 'pre-3-2',
        titulo: 'Ahora los dos',
        enunciado: 'En dos renglones, muestra:\n\n• cuántas veces cabe 4 en 29 (con //)\n• cuánto sobra (con %)',
        inicial: '',
        pista: 'Un print con `29 // 4` y otro con `29 % 4`.',
        solucion: 'print(29 // 4)\nprint(29 % 4)',
        pruebas: [
          { t: 'src', re: '//', msg: 'Usa //' },
          { t: 'src', re: '%', msg: 'Usa %' },
          { t: 'linea', n: 0, igual: '7', msg: 'El primer renglón es 7' },
          { t: 'linea', n: 1, igual: '1', msg: 'El segundo renglón es 1' },
        ],
      },
      {
        id: 'pre-3-3',
        titulo: 'Los dulces',
        enunciado:
          'Hay 50 dulces para repartir entre 8 niños, en partes iguales. Muestra en un renglón cuántos le tocan a cada uno y en otro cuántos sobran. Las cuentas las hace Python.',
        inicial: '',
        pista: 'Cuántos le tocan: `50 // 8`. Cuántos sobran: `50 % 8`.',
        solucion: 'print(50 // 8)\nprint(50 % 8)',
        pruebas: [
          { t: 'src', re: '//', msg: 'Usa // para lo que le toca a cada uno' },
          { t: 'src', re: '%', msg: 'Usa % para lo que sobra' },
          { t: 'linea', n: 0, igual: '6', msg: 'A cada uno le tocan 6' },
          { t: 'linea', n: 1, igual: '2', msg: 'Sobran 2' },
        ],
      },
    ],
  },
  {
    id: 'pre-4',
    numero: 4,
    titulo: 'Que la cuenta la haga Python',
    emoji: '🧮',
    minutos: 12,
    explicacion: [
      { t: 'p', texto: 'Punto 4. Python es una calculadora muy buena, pero solo si le escribes la cuenta, no el resultado.' },
      { t: 'p', texto: 'Para multiplicar se usa `*` (asterisco). Python hace primero las multiplicaciones y después las sumas, igual que en matemáticas.' },
      { t: 'codigo', codigo: 'print(3 * 4)\nprint(2 * 5 + 3 * 2)' },
      {
        t: 'p',
        texto:
          'Un problema de palabras se traduce así: "4 perros con 4 patas cada uno" es `4 * 4`; "3 gallinas con 2 patas" es `3 * 2`. Todas las patas juntas: `4 * 4 + 3 * 2`.',
      },
      { t: 'codigo', codigo: 'print(4 * 4 + 3 * 2)' },
      {
        t: 'ojo',
        texto:
          'Dos errores muy comunes: escribir el resultado a mano (`print(22)`), o poner las cosas entre comillas (`print("4 patas")`). Con comillas ya no es un número: es un texto, y Python no lo puede multiplicar.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 4 del examen es un problema con bicicletas y carros: hay que contar ruedas. Tradúcelo como los perros y las gallinas: cuántos hay × cuántas ruedas tiene cada uno, y súmalo. Todo dentro de un print, sin comillas.',
      },
    ],
    retos: [
      {
        id: 'pre-4-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Haz que Python muestre cuánto es 6 por 7. La cuenta la hace Python: no escribas el resultado.',
        inicial: '',
        pista: 'El por se escribe con asterisco: `print(6 * 7)`.',
        solucion: 'print(6 * 7)',
        pruebas: [
          { t: 'src', re: '\\*', msg: 'Multiplica con *' },
          { t: 'src', re: '\\b42\\b', not: true, msg: 'No escribe el resultado a mano' },
          { t: 'salida', igual: '42', msg: 'Sale 42' },
        ],
      },
      {
        id: 'pre-4-2',
        titulo: 'Las patas',
        enunciado:
          'En una finca hay 4 perros y 3 gallinas. Un perro tiene 4 patas y una gallina tiene 2. Haz que Python calcule cuántas patas hay en total y lo muestre.',
        inicial: '',
        pista: 'Las patas de los perros (4 * 4) más las de las gallinas (3 * 2), dentro de un print.',
        solucion: 'print(4 * 4 + 3 * 2)',
        pruebas: [
          { t: 'src', re: '\\bprint\\s*\\(', msg: 'Usa print' },
          { t: 'src', re: '\\*', msg: 'Multiplica con *' },
          { t: 'src', re: '\\b22\\b', not: true, msg: 'No escribe el resultado a mano' },
          { t: 'salida', igual: '22', msg: 'Sale 22' },
        ],
      },
      {
        id: 'pre-4-3',
        titulo: 'Como en el examen',
        enunciado:
          'Una caja trae 6 huevos y un cartón trae 30. En la tienda hay 5 cajas y 2 cartones. Haz que Python calcule cuántos huevos hay en total y lo muestre. Ojo: la cuenta la hace Python, tú no escribes el resultado.',
        inicial: '',
        pista: '5 cajas de 6 huevos, más 2 cartones de 30: `print(5 * 6 + 2 * 30)`.',
        solucion: 'print(5 * 6 + 2 * 30)',
        pruebas: [
          { t: 'src', re: '\\bprint\\s*\\(', msg: 'Usa print' },
          { t: 'src', re: '\\*', msg: 'Multiplica con *' },
          { t: 'src', re: '\\b90\\b', not: true, msg: 'No escribe el resultado a mano' },
          { t: 'salida', igual: '90', msg: 'Sale 90' },
        ],
      },
    ],
  },
  {
    id: 'pre-5',
    numero: 5,
    titulo: 'Variables: cajitas con nombre',
    emoji: '📦',
    minutos: 14,
    explicacion: [
      { t: 'p', texto: 'Punto 5. Una variable es una cajita con nombre donde guardas un valor para usarlo después.' },
      { t: 'p', texto: 'Se crea así: el nombre, un `=`, y el valor. El nombre va SIN comillas. Para ver lo que tiene adentro, `print(nombre)`, también sin comillas.' },
      { t: 'codigo', codigo: 'edad = 12\nprint(edad)' },
      { t: 'p', texto: 'Con las variables se pueden hacer cuentas, y guardar el resultado en otra variable:' },
      { t: 'codigo', codigo: 'precio = 1500\ncantidad = 3\ntotal = precio * cantidad\nprint(total)' },
      { t: 'p', texto: 'Y se juntan con lo de la lección 3: `//` para repartir y `%` para lo que sobra.' },
      { t: 'codigo', codigo: 'dulces = 17\nninos = 5\ncada_uno = dulces // ninos\nsobran = dulces % ninos\nprint(cada_uno)\nprint(sobran)' },
      {
        t: 'ojo',
        texto:
          '`print("galletas = 24")` NO crea una variable: solo muestra un texto. La variable se crea con `galletas = 24`, sin print y sin comillas. Y el nombre tiene que ser exactamente el que te piden: `sobran` no es lo mismo que `sobrantes`.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 5 del examen pide crear variables con nombres exactos, hacer cuentas con // y % usando esas variables, y mostrar los resultados. Es como el ejemplo de los dulces, con otros números.',
      },
    ],
    retos: [
      {
        id: 'pre-5-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Crea una variable `mascotas` que valga 3 y muéstrala con print.',
        inicial: '',
        pista: '`mascotas = 3` y después `print(mascotas)`, sin comillas.',
        solucion: 'mascotas = 3\nprint(mascotas)',
        pruebas: [
          { t: 'expr', code: 'mascotas', igual: '3', msg: 'mascotas vale 3' },
          { t: 'src', re: '\\bprint\\s*\\(\\s*mascotas\\s*\\)', msg: 'Muestra la variable con print(mascotas)' },
          { t: 'salida', igual: '3', msg: 'Sale 3' },
        ],
      },
      {
        id: 'pre-5-2',
        titulo: 'Una cuenta con variables',
        enunciado:
          'Crea `boletas = 4` y `precio = 8000`. Después crea la variable `total` con lo que cuestan todas las boletas (usando las variables, no el número) y muéstrala.',
        inicial: '',
        pista: '`total = boletas * precio` y después `print(total)`.',
        solucion: 'boletas = 4\nprecio = 8000\ntotal = boletas * precio\nprint(total)',
        pruebas: [
          { t: 'expr', code: 'boletas', igual: '4', msg: 'boletas vale 4' },
          { t: 'expr', code: 'precio', igual: '8000', msg: 'precio vale 8000' },
          { t: 'src', re: 'boletas\\s*\\*\\s*precio|precio\\s*\\*\\s*boletas', msg: 'Hace la cuenta con las variables' },
          { t: 'expr', code: 'total', igual: '32000', msg: 'total vale 32000' },
          { t: 'salida', igual: '32000', msg: 'Sale 32000' },
        ],
      },
      {
        id: 'pre-5-3',
        titulo: 'Como en el examen',
        enunciado:
          'Crea una variable `canicas` que valga 38 y una variable `jugadores` que valga 6.\n\nLuego crea la variable `cada_uno` con cuántas canicas enteras le tocan a cada jugador, y la variable `sobran` con cuántas sobran. Muestra las dos.',
        inicial: '',
        pista: '`cada_uno = canicas // jugadores` y `sobran = canicas % jugadores`. Después un print para cada una.',
        solucion: 'canicas = 38\njugadores = 6\ncada_uno = canicas // jugadores\nsobran = canicas % jugadores\nprint(cada_uno)\nprint(sobran)',
        pruebas: [
          { t: 'expr', code: 'canicas', igual: '38', msg: 'canicas vale 38' },
          { t: 'expr', code: 'jugadores', igual: '6', msg: 'jugadores vale 6' },
          { t: 'expr', code: 'cada_uno', igual: '6', msg: 'cada_uno vale 6' },
          { t: 'expr', code: 'sobran', igual: '2', msg: 'sobran vale 2' },
          { t: 'src', re: 'canicas\\s*(//|%)\\s*jugadores', msg: 'Hace las cuentas con las variables' },
          { t: 'salida', igual: '6\n2', msg: 'Muestra las dos' },
        ],
      },
    ],
  },
]

export const PRACTICAS_1: Practica[] = [
  {
    id: 'practica-1',
    numero: 1,
    despuesDe: 5,
    titulo: 'Práctica de los puntos 1 a 5',
    preguntas: [
      {
        tipo: 'codigo',
        leccion: 1,
        id: 'pre-p1-1',
        titulo: 'Los dos renglones',
        enunciado: 'Haz que Python muestre estos dos renglones, exactamente así:\n\nHoy hay práctica\nY voy a sacar cinco',
        inicial: '',
        pista: '',
        pistas: ['Cada renglón es un print aparte.', 'Son dos líneas: print("Hoy hay práctica") y otra igual con la segunda frase.'],
        solucion: 'print("Hoy hay práctica")\nprint("Y voy a sacar cinco")',
        pruebas: [
          { t: 'src', re: '\\bprint\\s*\\(', msg: 'Usa print' },
          { t: 'linea', n: 0, igual: 'Hoy hay práctica', msg: 'El primer renglón es “Hoy hay práctica”' },
          { t: 'linea', n: 1, igual: 'Y voy a sacar cinco', msg: 'El segundo renglón es “Y voy a sacar cinco”' },
          { t: 'salida', igual: 'Hoy hay práctica\nY voy a sacar cinco', msg: 'No sale nada más' },
        ],
      },
      {
        tipo: 'vf',
        leccion: 2,
        id: 'pre-p1-2',
        titulo: 'Texto más texto',
        codigo: 'print("2" + "2")',
        afirmacion: 'Este programa muestra 4.',
        verdadero: false,
      },
      {
        tipo: 'opcion',
        leccion: 3,
        id: 'pre-p1-3',
        titulo: 'Lo que sobra',
        enunciado: '¿Qué muestra este programa?',
        codigo: 'print(23 % 4)',
        opciones: [
          { texto: '3', puntos: 5 },
          { texto: '5', puntos: 1 },
          { texto: '5.75', puntos: 0 },
          { texto: '19', puntos: 0 },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 4,
        id: 'pre-p1-4',
        titulo: 'Las ruedas',
        enunciado:
          'Un triciclo tiene 3 ruedas y una moto tiene 2. En la calle hay 4 triciclos y 6 motos.\n\nHaz que Python calcule cuántas ruedas hay en total y lo muestre. Ojo: la cuenta la hace Python, tú no escribes el resultado.',
        inicial: '',
        pista: '',
        pistas: ['Primero las ruedas de los triciclos (3 por cada uno), después las de las motos, y súmalas.', 'Dentro de un solo print: 3 * 4 + 2 * 6'],
        solucion: 'print(3 * 4 + 2 * 6)',
        pruebas: [
          { t: 'src', re: '\\bprint\\s*\\(', msg: 'Usa print' },
          { t: 'src', re: '\\*', msg: 'Multiplica con *' },
          { t: 'src', re: '\\b24\\b', not: true, msg: 'No escribe el resultado a mano' },
          { t: 'linea', n: -1, contiene: '24', msg: 'Sale 24' },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 5,
        id: 'pre-p1-5',
        titulo: 'Los chocolates',
        enunciado:
          'Crea una variable `chocolates` que valga 30 y una variable `primos` que valga 7.\n\nLuego crea la variable `cada_uno` con cuántos chocolates enteros le tocan a cada primo, y la variable `sobran` con cuántos sobran. Muestra las dos.',
        inicial: '',
        pista: '',
        pistas: [
          'Para chocolates enteros se usa // (división entera). Para lo que sobra, % (el sobrante).',
          'cada_uno = chocolates // primos y sobran = chocolates % primos. Después, un print para cada una.',
        ],
        solucion: 'chocolates = 30\nprimos = 7\ncada_uno = chocolates // primos\nsobran = chocolates % primos\nprint(cada_uno)\nprint(sobran)',
        pruebas: [
          { t: 'expr', code: 'chocolates', igual: '30', msg: 'chocolates vale 30' },
          { t: 'expr', code: 'primos', igual: '7', msg: 'primos vale 7' },
          { t: 'expr', code: 'cada_uno', igual: '4', msg: 'cada_uno vale 4' },
          { t: 'expr', code: 'sobran', igual: '2', msg: 'sobran vale 2' },
          { t: 'src', re: 'chocolates\\s*(//|%)\\s*primos', msg: 'Hace las cuentas con las variables' },
        ],
      },
    ],
  },
]
