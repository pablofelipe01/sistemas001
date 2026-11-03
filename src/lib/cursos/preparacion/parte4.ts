import type { Leccion, Practica } from '../tipos'

/*
 * Curso de preparación para el examen de Python: puntos 26 a 30.
 *
 * El final del examen: la sangría, sumar dentro de un for, funciones con
 * return (casi nadie las contestó en el examen de verdad, así que aquí se va
 * despacio) y la lista que se llena con input(). Mismo formato que parte1.ts.
 */

export const LECCIONES_4: Leccion[] = [
  {
    id: 'pre-26',
    numero: 26,
    titulo: 'Sangría y dos puntos: así se arman los bloques',
    emoji: '📐',
    minutos: 12,
    explicacion: [
      { t: 'p', texto: 'Punto 26. En JavaScript, lo que va dentro de un `if` o de un `for` se encierra entre llaves `{ }`. En Python no hay llaves.' },
      {
        t: 'p',
        texto:
          'Python usa dos cosas: los dos puntos `:` al final de la línea del `if`, del `for`, del `while` o del `def`, y la sangría: los 4 espacios al principio de cada línea que va adentro.',
      },
      { t: 'codigo', codigo: 'edad = 12\nif edad >= 10:\n    print("Ya tienes dos cifras")\n    print("¡Felicitaciones!")\nprint("Esto sale siempre")' },
      {
        t: 'p',
        texto:
          'Las dos líneas con sangría son del `if`: solo salen si la condición se cumple. La última no tiene sangría: ya está por fuera, y sale siempre. Con un `for` pasa lo mismo:',
      },
      { t: 'codigo', codigo: 'for i in range(3):\n    print("Vuelta", i)\nprint("Se acabó el for")' },
      {
        t: 'ojo',
        texto:
          'Tres errores típicos: olvidar los dos puntos (`if edad >= 10` sin `:`), no poner sangría a lo que va adentro, o ponerle sangría a una línea que debería ir por fuera (por ejemplo, el print del final metido dentro del for: sale en cada vuelta). Y nunca llaves `{ }`: eso es de JavaScript.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 26 del examen es de falso o verdadero, sobre cómo se marca en Python lo que va dentro de un if. Piensa: ¿Python usa llaves como JavaScript, o usa otra cosa?',
      },
    ],
    retos: [
      {
        id: 'pre-26-1',
        titulo: 'Inténtalo tú',
        enunciado:
          'Crea una variable `puntos` que valga 80. Después, con un if, si puntos es mayor que 50 muestra:\n\nGanaste\n\nNo te olvides de los dos puntos y de la sangría.',
        inicial: '',
        pista: '`if puntos > 50:` y en la línea de abajo, con 4 espacios al principio, `print("Ganaste")`.',
        solucion: 'puntos = 80\nif puntos > 50:\n    print("Ganaste")',
        pruebas: [
          { t: 'expr', code: 'puntos', igual: '80', msg: 'puntos vale 80' },
          { t: 'src', re: '\\bif\\b[^\\n]*:', msg: 'Usa un if con sus dos puntos' },
          { t: 'src', re: '\\{', not: true, msg: 'No usa llaves' },
          { t: 'salida', igual: 'Ganaste', msg: 'Sale “Ganaste”' },
        ],
      },
      {
        id: 'pre-26-2',
        titulo: 'Un paso más: if y else',
        enunciado:
          'Pregunta una nota con input() y conviértela con int(). Si es 3 o más, muestra:\nAprobaste\n\nSi no, muestra:\nA estudiar más\n\nCada print va con sangría debajo de su if o de su else.',
        inicial: '',
        entradas: ['4'],
        pista: '`if nota >= 3:` con su print adentro, y `else:` con el otro print adentro. Los dos print con 4 espacios.',
        solucion: 'nota = int(input("Nota: "))\nif nota >= 3:\n    print("Aprobaste")\nelse:\n    print("A estudiar más")',
        pruebas: [
          { t: 'src', re: '\\belse\\s*:', msg: 'Usa else con sus dos puntos' },
          { t: 'linea', n: -1, igual: 'Aprobaste', msg: 'Con 4, sale “Aprobaste”' },
          { t: 'linea', n: -1, igual: 'Aprobaste', entradas: ['3'], msg: 'Con 3 justo, también aprueba' },
          { t: 'linea', n: -1, igual: 'A estudiar más', entradas: ['2'], msg: 'Con 2, sale “A estudiar más”' },
        ],
      },
      {
        id: 'pre-26-3',
        titulo: 'Como en el examen: adentro y afuera',
        enunciado:
          'Con un for y range(3), muestra Hola tres veces. Después del for, por fuera (sin sangría), muestra una sola vez:\n\nListo\n\nSi te sale Listo tres veces, revisa la sangría.',
        inicial: '',
        pista: '`for i in range(3):` y adentro, con sangría, `print("Hola")`. Después, pegado a la izquierda, `print("Listo")`.',
        solucion: 'for i in range(3):\n    print("Hola")\nprint("Listo")',
        pruebas: [
          { t: 'src', re: '\\bfor\\b[^\\n]*:', msg: 'Usa un for con sus dos puntos' },
          { t: 'salida', contiene: 'Hola', veces: 3, msg: 'Hola sale tres veces' },
          { t: 'salida', contiene: 'Listo', veces: 1, msg: 'Listo sale una sola vez' },
          { t: 'salida', igual: 'Hola\nHola\nHola\nListo', msg: 'Listo sale al final, por fuera del for' },
        ],
      },
    ],
  },
  {
    id: 'pre-27',
    numero: 27,
    titulo: 'Sumar dentro de un for',
    emoji: '➕',
    minutos: 14,
    explicacion: [
      { t: 'p', texto: 'Punto 27. Muchas veces hay que sumar todos los números de una lista. Para eso se usa una variable que va acumulando: casi siempre se llama `total`.' },
      {
        t: 'p',
        texto:
          'La receta tiene tres pasos: 1) antes del for, `total = 0`; 2) dentro del for, en cada vuelta, `total = total + n` (le sumas el número de esa vuelta); 3) después del for, por fuera, `print(total)`.',
      },
      { t: 'codigo', codigo: 'total = 0\nfor n in [1, 2, 3, 4]:\n    total = total + n\nprint(total)' },
      {
        t: 'p',
        texto:
          'Sigámoslo vuelta por vuelta: total empieza en 0. Vuelta 1: 0 + 1 = 1. Vuelta 2: 1 + 2 = 3. Vuelta 3: 3 + 3 = 6. Vuelta 4: 6 + 4 = 10. Al final, el print muestra 10, una sola vez.',
      },
      { t: 'p', texto: '¿Y si el print estuviera DENTRO del for, con sangría? Entonces mostraría el total en cada vuelta:' },
      { t: 'codigo', codigo: 'total = 0\nfor n in [1, 2, 3, 4]:\n    total = total + n\n    print(total)' },
      {
        t: 'ojo',
        texto:
          'Fíjate siempre en dónde está el print: si está por fuera del for (sin sangría), sale un solo número, el final. Si está adentro, sale un número por cada vuelta. Y `total = total + n` es lo mismo que `total += n`.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 27 del examen es de selección múltiple: te mostrarán un for que va sumando y tendrás que escoger qué muestra. Haz la cuenta vuelta por vuelta en un papel, y mira bien si el print está adentro o afuera del for.',
      },
    ],
    retos: [
      {
        id: 'pre-27-1',
        titulo: 'Inténtalo tú',
        enunciado:
          'Con un for, suma todos los números de la lista [5, 10, 15] y muestra el total una sola vez, al final. Sin usar sum: con una variable total que empieza en 0.',
        inicial: '',
        pista: '`total = 0`, después `for n in [5, 10, 15]:` y adentro `total = total + n`. Al final, sin sangría, `print(total)`.',
        solucion: 'total = 0\nfor n in [5, 10, 15]:\n    total = total + n\nprint(total)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\bsum\\s*\\(', not: true, msg: 'No usa sum' },
          { t: 'salida', igual: '30', msg: 'Sale 30, una sola vez' },
        ],
      },
      {
        id: 'pre-27-2',
        titulo: 'Un paso más: el total en cada vuelta',
        enunciado:
          'Ahora al revés: suma los números de [2, 4, 6] y muestra cómo va el total EN CADA VUELTA. Tiene que salir:\n\n2\n6\n12',
        inicial: '',
        pista: 'Es igual al anterior, pero el print va DENTRO del for, con sangría, debajo de la suma.',
        solucion: 'total = 0\nfor n in [2, 4, 6]:\n    total = total + n\n    print(total)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\bsum\\s*\\(', not: true, msg: 'No usa sum' },
          { t: 'salida', igual: '2\n6\n12', msg: 'Sale 2, 6 y 12, uno por renglón' },
        ],
      },
      {
        id: 'pre-27-3',
        titulo: 'Como en el examen: la cuenta de la tienda',
        enunciado:
          'Ya está escrita la lista `precios`. Con un for, súmalos todos (sin sum) y al final muestra una sola línea:\n\nTotal: 4000',
        inicial: 'precios = [1500, 2000, 500]\n',
        pista: 'total = 0, el for que suma cada precio, y por fuera `print("Total:", total)`.',
        solucion: 'precios = [1500, 2000, 500]\ntotal = 0\nfor p in precios:\n    total = total + p\nprint("Total:", total)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\bsum\\s*\\(', not: true, msg: 'No usa sum' },
          { t: 'src', re: '\\b4000\\b', not: true, msg: 'No escribe el resultado a mano' },
          { t: 'salida', igual: 'Total: 4000', msg: 'Sale “Total: 4000”, una sola vez' },
        ],
      },
    ],
  },
  {
    id: 'pre-28',
    numero: 28,
    titulo: 'Funciones con return: ¿es par?',
    emoji: '🧩',
    minutos: 18,
    explicacion: [
      { t: 'p', texto: 'Punto 28. Vamos despacio, que las funciones son nuevas para muchos. Una función es una máquina: le entra algo, hace un trabajo, y te devuelve una respuesta.' },
      {
        t: 'p',
        texto:
          'Se crea con `def`, el nombre de la función, los parámetros entre paréntesis (lo que le entra) y dos puntos. Adentro, con sangría, el trabajo. Y con `return` entrega la respuesta.',
      },
      { t: 'codigo', codigo: 'def doble(n):\n    return n * 2\n\nprint(doble(4))\nprint(doble(10))' },
      {
        t: 'p',
        texto:
          'Ojo a las dos partes: el `def` solo enseña a Python a hacer el trabajo, pero no lo hace. El trabajo se hace cuando LLAMAS la función: `doble(4)`. Ahí n vale 4, y la función devuelve 8.',
      },
      {
        t: 'p',
        texto:
          'Una función también puede devolver `True` (verdadero) o `False` (falso). Por ejemplo: ¿un número es par? Es par si al dividirlo entre 2 no sobra nada, o sea, si `n % 2 == 0`. Esa comparación ya da True o False, así que se puede devolver directo:',
      },
      { t: 'codigo', codigo: 'def es_par(n):\n    return n % 2 == 0\n\nprint(es_par(6))\nprint(es_par(7))\nprint(es_par(0))' },
      {
        t: 'ojo',
        texto:
          'Una función sin `return` devuelve `None` (nada), aunque haga la cuenta. Y `print` no es lo mismo que `return`: print muestra en la pantalla, return entrega la respuesta. En el examen te piden que DEVUELVA: usa return. Recuerda: `=` guarda, `==` compara.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 28 del examen pide escribir una función que devuelva True o False según si un número cumple algo. Fíjate en el nombre exacto de la función, en usar % para ver el sobrante, y en que el 0 también cuenta.',
      },
    ],
    retos: [
      {
        id: 'pre-28-1',
        titulo: 'Inténtalo tú: tu primera función',
        enunciado: 'Escribe una función `triple(n)` que devuelva (con return) el número multiplicado por 3. Así, triple(4) da 12.',
        inicial: '',
        pista: '`def triple(n):` y en la línea de abajo, con sangría, `return n * 3`.',
        solucion: 'def triple(n):\n    return n * 3',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+triple\\s*\\(', msg: 'Define triple con def' },
          { t: 'src', re: '\\breturn\\b', msg: 'Usa return' },
          { t: 'expr', code: 'triple(4)', igual: '12', msg: 'triple(4) da 12' },
          { t: 'expr', code: 'triple(10)', igual: '30', msg: 'triple(10) da 30' },
          { t: 'expr', code: 'triple(0)', igual: '0', msg: 'triple(0) da 0' },
        ],
      },
      {
        id: 'pre-28-2',
        titulo: 'Un paso más: True o False',
        enunciado:
          'Escribe una función `es_impar(n)` que devuelva True si n es impar y False si no lo es. Pista de matemáticas: un número es impar si al dividirlo entre 2 sobra 1.',
        inicial: '',
        pista: '`def es_impar(n):` y adentro `return n % 2 == 1`.',
        solucion: 'def es_impar(n):\n    return n % 2 == 1',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+es_impar\\s*\\(', msg: 'Define es_impar con def' },
          { t: 'src', re: '%', msg: 'Usa % para ver el sobrante' },
          { t: 'expr', code: 'es_impar(3)', igual: 'True', msg: 'es_impar(3) da True' },
          { t: 'expr', code: 'es_impar(8)', igual: 'False', msg: 'es_impar(8) da False' },
          { t: 'expr', code: 'es_impar(0)', igual: 'False', msg: 'es_impar(0) da False' },
        ],
      },
      {
        id: 'pre-28-3',
        titulo: 'Como en el examen',
        enunciado: 'Escribe una función `es_multiplo_de_3(n)` que devuelva True si n es múltiplo de 3 (se puede dividir entre 3 sin que sobre nada) y False si no.',
        inicial: '',
        pista: 'Igual que es_par, pero con 3: el sobrante de dividir entre 3 tiene que ser 0. `return n % 3 == 0`.',
        solucion: 'def es_multiplo_de_3(n):\n    return n % 3 == 0',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+es_multiplo_de_3\\s*\\(', msg: 'Define es_multiplo_de_3 con def' },
          { t: 'src', re: '%', msg: 'Usa % para ver el sobrante' },
          { t: 'expr', code: 'es_multiplo_de_3(9)', igual: 'True', msg: 'es_multiplo_de_3(9) da True' },
          { t: 'expr', code: 'es_multiplo_de_3(10)', igual: 'False', msg: 'es_multiplo_de_3(10) da False' },
          { t: 'expr', code: 'es_multiplo_de_3(0)', igual: 'True', msg: 'es_multiplo_de_3(0) da True' },
        ],
      },
    ],
  },
  {
    id: 'pre-29',
    numero: 29,
    titulo: 'Funciones que deciden con if',
    emoji: '⚖️',
    minutos: 16,
    explicacion: [
      { t: 'p', texto: 'Punto 29. Dentro de una función también se puede usar `if`. Así la función decide qué devolver.' },
      {
        t: 'p',
        texto:
          'Mira la sangría: el `if` va con 4 espacios porque está dentro del `def`, y cada `return` va con 8 porque está dentro del if (o del else). Apenas la función llega a un return, entrega la respuesta y se acaba.',
      },
      { t: 'codigo', codigo: 'def aprobo(nota):\n    if nota >= 3:\n        return "Aprobó"\n    else:\n        return "Perdió"\n\nprint(aprobo(4.5))\nprint(aprobo(2))' },
      {
        t: 'p',
        texto:
          'Con lo mismo se puede saber cuál de dos números es el más pequeño: si a es menor que b, devuelve a; si no, devuelve b. Y si los dos son iguales, da lo mismo cuál devuelva: los dos valen igual.',
      },
      { t: 'codigo', codigo: 'def menor(a, b):\n    if a < b:\n        return a\n    else:\n        return b\n\nprint(menor(3, 9))\nprint(menor(12, 4))\nprint(menor(6, 6))' },
      {
        t: 'ojo',
        texto:
          'Python ya trae `max()` y `min()`, pero si el examen dice "sin usar max", no lo uses: perderías puntos. Y cuidado con la sangría del `return`: tiene que quedar dentro del if o del else, no pegado a la izquierda.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 29 del examen pide una función que compare dos números y devuelva uno de ellos, con if y sin la ayuda de Python. Piensa también qué pasa cuando los dos números son iguales.',
      },
    ],
    retos: [
      {
        id: 'pre-29-1',
        titulo: 'Inténtalo tú',
        enunciado:
          'Escribe una función `puede_entrar(edad)` que devuelva "Sí" si la edad es 12 o más, y "No" si es menor. Usa if y else, y return en los dos.',
        inicial: '',
        pista: '`def puede_entrar(edad):`, adentro `if edad >= 12:` con `return "Sí"`, y `else:` con `return "No"`.',
        solucion: 'def puede_entrar(edad):\n    if edad >= 12:\n        return "Sí"\n    else:\n        return "No"',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+puede_entrar\\s*\\(', msg: 'Define puede_entrar con def' },
          { t: 'src', re: '\\bif\\b', msg: 'Usa if' },
          { t: 'expr', code: 'puede_entrar(15)', igual: "'Sí'", msg: 'puede_entrar(15) da "Sí"' },
          { t: 'expr', code: 'puede_entrar(12)', igual: "'Sí'", msg: 'puede_entrar(12) da "Sí" (12 justo)' },
          { t: 'expr', code: 'puede_entrar(8)', igual: "'No'", msg: 'puede_entrar(8) da "No"' },
        ],
      },
      {
        id: 'pre-29-2',
        titulo: 'Un paso más: sin la ayuda de Python',
        enunciado:
          'Escribe una función `absoluto(n)` que devuelva el número sin el signo menos: si n es negativo, devuelve -n; si no, devuelve n. Así absoluto(-5) da 5 y absoluto(3) da 3. Sin usar abs: con if.',
        inicial: '',
        pista: '`if n < 0:` devuelve `-n`; en el `else:` devuelve `n`.',
        solucion: 'def absoluto(n):\n    if n < 0:\n        return -n\n    else:\n        return n',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+absoluto\\s*\\(', msg: 'Define absoluto con def' },
          { t: 'src', re: '\\babs\\s*\\(', not: true, msg: 'No usa abs' },
          { t: 'expr', code: 'absoluto(-5)', igual: '5', msg: 'absoluto(-5) da 5' },
          { t: 'expr', code: 'absoluto(3)', igual: '3', msg: 'absoluto(3) da 3' },
          { t: 'expr', code: 'absoluto(0)', igual: '0', msg: 'absoluto(0) da 0' },
        ],
      },
      {
        id: 'pre-29-3',
        titulo: 'Como en el examen',
        enunciado: 'Escribe una función `mas_caro(precio1, precio2)` que devuelva el precio más alto de los dos. Sin usar max: con if.',
        inicial: '',
        pista: 'Compara los dos precios con un if: si precio1 es mayor que precio2, devuelve precio1; si no, devuelve precio2.',
        solucion: 'def mas_caro(precio1, precio2):\n    if precio1 > precio2:\n        return precio1\n    else:\n        return precio2',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+mas_caro\\s*\\(', msg: 'Define mas_caro con def' },
          { t: 'src', re: '\\bmax\\s*\\(', not: true, msg: 'No usa max' },
          { t: 'expr', code: 'mas_caro(1500, 3000)', igual: '3000', msg: 'mas_caro(1500, 3000) da 3000' },
          { t: 'expr', code: 'mas_caro(5000, 200)', igual: '5000', msg: 'mas_caro(5000, 200) da 5000' },
          { t: 'expr', code: 'mas_caro(700, 700)', igual: '700', msg: 'mas_caro(700, 700) da 700' },
        ],
      },
    ],
  },
  {
    id: 'pre-30',
    numero: 30,
    titulo: 'Llenar una lista con input y mostrarla numerada',
    emoji: '🛒',
    minutos: 18,
    explicacion: [
      { t: 'p', texto: 'Punto 30, el último. Aquí se juntan varias cosas: una lista, `append`, `input()` y el `for`. Vamos por partes.' },
      { t: 'p', texto: 'Parte 1: una lista vacía es `[]`. Con `append` le agregas una cosa al final:' },
      { t: 'codigo', codigo: 'animales = []\nanimales.append("perro")\nanimales.append("gato")\nprint(animales)' },
      { t: 'p', texto: 'Parte 2: si lo que agregas lo escribe el usuario, metes el `input()` dentro del append. Y para preguntar tres veces, un `for` con `range(3)`:' },
      { t: 'codigo', codigo: 'frutas = []\nfor i in range(3):\n    frutas.append(input("Fruta: "))\nprint(frutas)', entradas: ['mango', 'pera', 'uva'] },
      {
        t: 'p',
        texto:
          'Parte 3: para mostrarlas numeradas se usa `range(len(frutas))`: len dice cuántas hay, y range va dando las posiciones 0, 1, 2. Como las posiciones empiezan en 0 y las personas contamos desde 1, se muestra `i + 1`.',
      },
      { t: 'codigo', codigo: 'frutas = ["mango", "pera", "uva"]\nfor i in range(len(frutas)):\n    print(f"{i + 1}. {frutas[i]}")' },
      {
        t: 'ojo',
        texto:
          'Si muestras `i` en vez de `i + 1`, la lista sale empezando en 0 ("0. mango"). `frutas[i]` es la cosa en esa posición, y `i` es solo el número. Y `append` va con punto y paréntesis: `frutas.append(…)`, no `append(frutas)`.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 30 del examen pide preguntar varias cosas con input(), guardarlas en una lista con append y mostrarlas con su número. Fíjate en el formato exacto de cada renglón: el número, un punto, un espacio y la cosa.',
      },
    ],
    retos: [
      {
        id: 'pre-30-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Crea una lista vacía `animales`. Con append, agrégale "perro", después "gato" y después "loro". Al final, muéstrala con print.',
        inicial: '',
        pista: '`animales = []` y después `animales.append("perro")`, y así con los otros dos.',
        solucion: 'animales = []\nanimales.append("perro")\nanimales.append("gato")\nanimales.append("loro")\nprint(animales)',
        pruebas: [
          { t: 'src', re: '\\.append\\s*\\(', min: 3, msg: 'Usa append tres veces' },
          { t: 'expr', code: 'animales', igual: "['perro', 'gato', 'loro']", msg: 'La lista queda con los tres animales en orden' },
          { t: 'salida', contiene: 'loro', msg: 'Muestra la lista' },
        ],
      },
      {
        id: 'pre-30-2',
        titulo: 'Un paso más: numerados',
        enunciado:
          'Ya está escrita la lista `colores`. Con un for y range(len(colores)), muestra cada color con su número, así:\n\n1. rojo\n2. verde\n3. azul',
        inicial: 'colores = ["rojo", "verde", "azul"]\n',
        pista: '`for i in range(len(colores)):` y adentro `print(f"{i + 1}. {colores[i]}")`.',
        solucion: 'colores = ["rojo", "verde", "azul"]\nfor i in range(len(colores)):\n    print(f"{i + 1}. {colores[i]}")',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\blen\\s*\\(', msg: 'Usa len' },
          { t: 'linea', n: 0, igual: '1. rojo', msg: 'Empieza en “1. rojo”' },
          { t: 'linea', n: 1, igual: '2. verde', msg: 'Sigue “2. verde”' },
          { t: 'linea', n: -1, igual: '3. azul', msg: 'Termina en “3. azul”' },
        ],
      },
      {
        id: 'pre-30-3',
        titulo: 'Como en el examen',
        enunciado:
          'Pide 3 nombres de amigos con input(), uno por uno, y guárdalos en la lista `amigos` con append. Al final, muestra cada nombre con su número, así (si escriben Ana, Luis y Sofi):\n\n1. Ana\n2. Luis\n3. Sofi',
        inicial: 'amigos = []\n',
        entradas: ['Ana', 'Luis', 'Sofi'],
        pista: 'Un for con range(3) que hace `amigos.append(input("Amigo: "))`, y otro for con range(len(amigos)) que muestra `f"{i + 1}. {amigos[i]}"`.',
        solucion: 'amigos = []\nfor i in range(3):\n    amigos.append(input("Amigo: "))\nfor i in range(len(amigos)):\n    print(f"{i + 1}. {amigos[i]}")',
        pruebas: [
          { t: 'src', re: '\\binput\\s*\\(', msg: 'Usa input()' },
          { t: 'src', re: '\\.append\\s*\\(', msg: 'Usa append' },
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'linea', n: -3, igual: '1. Ana', msg: 'Con Ana, Luis y Sofi sale “1. Ana”' },
          { t: 'linea', n: -1, igual: '3. Sofi', msg: 'y al final “3. Sofi”' },
          { t: 'linea', n: -2, igual: '2. Pedro', entradas: ['Juli', 'Pedro', 'Caro'], msg: 'Con Juli, Pedro y Caro, el segundo es “2. Pedro”' },
        ],
      },
    ],
  },
]

export const PRACTICAS_4: Practica[] = [
  {
    id: 'practica-6',
    numero: 6,
    despuesDe: 30,
    titulo: 'Práctica de los puntos 26 a 30',
    preguntas: [
      {
        tipo: 'vf',
        leccion: 26,
        id: 'pre-p6-1',
        titulo: 'La sangría',
        codigo: 'for i in range(3):\nprint(i)',
        afirmacion: 'Este programa muestra 0, 1 y 2, aunque el print no tenga espacios al principio.',
        verdadero: false,
      },
      {
        tipo: 'opcion',
        leccion: 27,
        id: 'pre-p6-2',
        titulo: 'Sumando en el for',
        enunciado: '¿Qué muestra este programa?',
        codigo: 'total = 0\nfor n in [5, 10, 15]:\n    total = total + n\nprint(total)',
        opciones: [
          { texto: '30', puntos: 5 },
          { texto: '15', puntos: 1 },
          { texto: '5, 15 y 30, uno por renglón', puntos: 2 },
          { texto: '0', puntos: 0 },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 28,
        id: 'pre-p6-3',
        titulo: '¿Es múltiplo de 5?',
        enunciado: 'Escribe una función `es_multiplo_de_5(n)` que devuelva True si n es múltiplo de 5 y False si no lo es.',
        inicial: '',
        pista: '',
        pistas: [
          'Un número es múltiplo de 5 si al dividirlo entre 5 no sobra nada: n % 5 da 0.',
          'def es_multiplo_de_5(n): y adentro return n % 5 == 0',
        ],
        solucion: 'def es_multiplo_de_5(n):\n    return n % 5 == 0',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+es_multiplo_de_5\\s*\\(', msg: 'Define es_multiplo_de_5 con def' },
          { t: 'src', re: '%', msg: 'Usa % para ver el sobrante' },
          { t: 'expr', code: 'es_multiplo_de_5(10)', igual: 'True', msg: 'es_multiplo_de_5(10) da True' },
          { t: 'expr', code: 'es_multiplo_de_5(12)', igual: 'False', msg: 'es_multiplo_de_5(12) da False' },
          { t: 'expr', code: 'es_multiplo_de_5(0)', igual: 'True', msg: 'es_multiplo_de_5(0) da True' },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 29,
        id: 'pre-p6-4',
        titulo: 'El menor',
        enunciado: 'Escribe una función `menor(a, b)` que devuelva el más pequeño de los dos números. Sin usar min: con if.',
        inicial: '',
        pista: '',
        pistas: ['Compara a y b con un if, y devuelve con return el que sea más pequeño.', 'if a < b: return a, y si no (else:) return b.'],
        solucion: 'def menor(a, b):\n    if a < b:\n        return a\n    else:\n        return b',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+menor\\s*\\(', msg: 'Define menor con def' },
          { t: 'src', re: '\\bmin\\s*\\(', not: true, msg: 'No usa min' },
          { t: 'expr', code: 'menor(3, 9)', igual: '3', msg: 'menor(3, 9) da 3' },
          { t: 'expr', code: 'menor(12, 4)', igual: '4', msg: 'menor(12, 4) da 4' },
          { t: 'expr', code: 'menor(6, 6)', igual: '6', msg: 'menor(6, 6) da 6' },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 30,
        id: 'pre-p6-5',
        titulo: 'Los juegos del recreo',
        enunciado:
          'Pide 3 juegos con input(), uno por uno, y guárdalos en la lista `juegos` con append. Al final, muestra cada juego con su número, así (si escriben futbol, escondidas y lleva):\n\n1. futbol\n2. escondidas\n3. lleva',
        inicial: 'juegos = []\n',
        entradas: ['futbol', 'escondidas', 'lleva'],
        pista: '',
        pistas: [
          'Usa un for con range(3) para preguntar tres veces, y append para meter cada respuesta en la lista.',
          'Para mostrarlos, otro for con range(len(juegos)) y print(f"{i + 1}. {juegos[i]}")',
        ],
        solucion:
          'juegos = []\nfor i in range(3):\n    juegos.append(input("Juego: "))\nfor i in range(len(juegos)):\n    print(f"{i + 1}. {juegos[i]}")',
        pruebas: [
          { t: 'src', re: '\\binput\\s*\\(', msg: 'Usa input()' },
          { t: 'src', re: '\\.append\\s*\\(', msg: 'Usa append' },
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'linea', n: -3, igual: '1. futbol', msg: 'Con futbol, escondidas y lleva sale “1. futbol”' },
          { t: 'linea', n: -1, igual: '3. lleva', msg: 'y al final “3. lleva”' },
          { t: 'linea', n: -2, igual: '2. stop', entradas: ['yoyo', 'stop', 'ponchados'], msg: 'Con yoyo, stop y ponchados, el segundo es “2. stop”' },
        ],
      },
    ],
  },
]
