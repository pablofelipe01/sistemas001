import type { Leccion, Practica } from '../tipos'

/*
 * Curso de preparación para el examen de Python: puntos 16 a 25.
 *
 * Es la parte donde el examen se cayó: for con tabla, while, listas y
 * funciones. Por eso aquí se explica más despacio y con más ejemplos. Igual
 * que en parte1.ts: cada lección es un punto del examen, con su "Prepárate",
 * y los retos van de "inténtalo tú" a "como en el examen".
 */

export const LECCIONES_3: Leccion[] = [
  {
    id: 'pre-16',
    numero: 16,
    titulo: 'La tabla de multiplicar con for',
    emoji: '✖️',
    minutos: 16,
    explicacion: [
      { t: 'p', texto: 'Punto 16. Aquí se juntan tres cosas que ya viste: `input()`, el `for` con `range` y el f-string.' },
      {
        t: 'p',
        texto:
          'El `for` sirve para repetir. `range(1, 11)` da los números del 1 al 10 (el 11 no entra: range para justo antes). En cada vuelta, la variable `i` toma el siguiente número.',
      },
      { t: 'codigo', codigo: 'for i in range(1, 4):\n    print(i)' },
      {
        t: 'p',
        texto:
          'Lo que va adentro del for lleva 4 espacios al principio (la sangría). Así Python sabe qué se repite. Ahora con un f-string: las llaves `{ }` se cambian por lo que valga la variable en esa vuelta.',
      },
      { t: 'codigo', codigo: 'n = 5\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")' },
      { t: 'p', texto: 'Y si el número lo escribe la persona, se pide con `input()` y se convierte con `int()`:' },
      { t: 'codigo', codigo: 'n = int(input("¿Qué tabla? "))\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")', entradas: ['7'] },
      {
        t: 'ojo',
        texto:
          'En la tabla se MULTIPLICA: `{n * i}`, no `{n + i}`. Con el +, "3 x 2" daría 5 en vez de 6. Revisa también que el for tenga el `in` y los dos puntos: `for i in range(1, 11):`.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 16 del examen es de escribir código: pedir un número y mostrar su tabla del 1 al 10, renglón por renglón, con un formato exacto. Fíjate en el range (¿hasta dónde llega?), en la sangría y en que la cuenta sea una multiplicación.',
      },
    ],
    retos: [
      {
        id: 'pre-16-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Con un for y range, muestra los números del 1 al 5, uno por renglón.',
        inicial: '',
        pista: '`for i in range(1, 6):` y adentro, con 4 espacios, `print(i)`.',
        solucion: 'for i in range(1, 6):\n    print(i)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\brange\\s*\\(', msg: 'Usa range' },
          { t: 'salida', igual: '1\n2\n3\n4\n5', msg: 'Salen del 1 al 5, uno por renglón' },
        ],
      },
      {
        id: 'pre-16-2',
        titulo: 'La tabla del 4',
        enunciado:
          'Sin input todavía: con un for y un f-string, muestra la tabla del 4, del 1 al 10, así:\n\n4 x 1 = 4\n4 x 2 = 8\n…\n4 x 10 = 40',
        inicial: '',
        pista: '`for i in range(1, 11):` y adentro `print(f"4 x {i} = {4 * i}")`.',
        solucion: 'for i in range(1, 11):\n    print(f"4 x {i} = {4 * i}")',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\bf["\']', msg: 'Usa un f-string' },
          { t: 'linea', n: 0, igual: '4 x 1 = 4', msg: 'Empieza en “4 x 1 = 4”' },
          { t: 'salida', contiene: '4 x 7 = 28', msg: 'Aparece “4 x 7 = 28”' },
          { t: 'linea', n: -1, igual: '4 x 10 = 40', msg: 'Termina en “4 x 10 = 40”' },
        ],
      },
      {
        id: 'pre-16-3',
        titulo: 'Como en el examen',
        enunciado:
          'Pide un número con input() y muestra su tabla del 1 al 10, pero escrita con la palabra "por", así (si escriben 6):\n\n6 por 1 = 6\n6 por 2 = 12\n…\n6 por 10 = 60',
        inicial: '',
        entradas: ['6'],
        pista: 'Convierte con `int()`, usa `for i in range(1, 11):` y adentro `print(f"{n} por {i} = {n * i}")`.',
        solucion: 'n = int(input("¿Qué tabla? "))\nfor i in range(1, 11):\n    print(f"{n} por {i} = {n * i}")',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\bint\\s*\\(', msg: 'Convierte con int()' },
          { t: 'linea', n: -10, igual: '6 por 1 = 6', msg: 'Con 6, empieza en “6 por 1 = 6”' },
          { t: 'salida', contiene: '6 por 7 = 42', msg: 'Con 6, aparece “6 por 7 = 42”' },
          { t: 'linea', n: -1, igual: '6 por 10 = 60', msg: 'Con 6, termina en “6 por 10 = 60”' },
          { t: 'linea', n: -1, igual: '8 por 10 = 80', entradas: ['8'], msg: 'Con 8, termina en “8 por 10 = 80”' },
        ],
      },
    ],
  },
  {
    id: 'pre-17',
    numero: 17,
    titulo: 'El while: repetir mientras',
    emoji: '🔁',
    minutos: 15,
    explicacion: [
      {
        t: 'p',
        texto:
          'Punto 17. El `while` también repite, pero de otra manera: repite MIENTRAS una condición sea verdadera. Cuando la condición se vuelve falsa, para.',
      },
      {
        t: 'p',
        texto:
          'Para que pare, algo tiene que cambiar adentro. Casi siempre es un contador que va subiendo: `contador += 1` (que es lo mismo que `contador = contador + 1`).',
      },
      { t: 'codigo', codigo: 'contador = 0\nwhile contador < 3:\n    print("hola")\n    contador += 1' },
      {
        t: 'p',
        texto:
          'Síguelo vuelta por vuelta: contador vale 0 (0 < 3, sí: imprime y sube a 1), vale 1 (sí: imprime, sube a 2), vale 2 (sí: imprime, sube a 3), vale 3 (3 < 3, no: para). Tres "hola".',
      },
      { t: 'codigo', codigo: 'n = 1\nwhile n <= 5:\n    print(n)\n    n = n + 1' },
      {
        t: 'ojo',
        texto:
          'Si se te olvida la línea que cambia el contador, el while NUNCA para. Por ejemplo, `contador = 0` y `while contador < 3:` con solo `print("hola")` adentro: contador se queda en 0 para siempre, y 0 < 3 siempre es verdad. Eso se llama un ciclo infinito.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 17 del examen es de falso o verdadero: te muestran un while y te preguntan si termina. Busca adentro del while: ¿hay una línea que cambie la variable de la condición? Si no la hay, nunca para.',
      },
    ],
    retos: [
      {
        id: 'pre-17-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Con un while, muestra la palabra Python 4 veces, una por renglón.',
        inicial: '',
        pista: '`veces = 0`, `while veces < 4:` y adentro `print("Python")` y `veces += 1`.',
        solucion: 'veces = 0\nwhile veces < 4:\n    print("Python")\n    veces += 1',
        pruebas: [
          { t: 'src', re: '\\bwhile\\b', msg: 'Usa while' },
          { t: 'salida', igual: 'Python\nPython\nPython\nPython', msg: 'Sale Python 4 veces' },
        ],
      },
      {
        id: 'pre-17-2',
        titulo: 'Contando con while',
        enunciado: 'Ahora sin for: con un while, muestra los números del 1 al 6, uno por renglón.',
        inicial: '',
        pista: '`n = 1`, `while n <= 6:` y adentro `print(n)` y `n += 1`.',
        solucion: 'n = 1\nwhile n <= 6:\n    print(n)\n    n += 1',
        pruebas: [
          { t: 'src', re: '\\bwhile\\b', msg: 'Usa while' },
          { t: 'src', re: '\\bfor\\b', not: true, msg: 'No usa for' },
          { t: 'salida', igual: '1\n2\n3\n4\n5\n6', msg: 'Salen del 1 al 6' },
        ],
      },
      {
        id: 'pre-17-3',
        titulo: 'Como en el examen: arréglalo',
        enunciado:
          'Este programa nunca para (córrelo y verás). Arréglalo para que muestre "una vuelta más" 3 veces y, al final, una sola vez: Listo',
        inicial: 'vueltas = 0\nwhile vueltas < 3:\n    print("una vuelta más")\n',
        pista: 'Adentro del while falta `vueltas += 1`. Y el `print("Listo")` va al final, SIN sangría, por fuera del while.',
        solucion: 'vueltas = 0\nwhile vueltas < 3:\n    print("una vuelta más")\n    vueltas += 1\nprint("Listo")',
        pruebas: [
          { t: 'src', re: '\\bwhile\\b', msg: 'Usa while' },
          { t: 'salida', igual: 'una vuelta más\nuna vuelta más\nuna vuelta más\nListo', msg: 'Sale “una vuelta más” 3 veces y después “Listo”' },
          { t: 'linea', n: -1, igual: 'Listo', msg: 'Termina con “Listo”, una sola vez' },
        ],
      },
    ],
  },
  {
    id: 'pre-18',
    numero: 18,
    titulo: 'Listas: cada cosa tiene su posición',
    emoji: '📋',
    minutos: 13,
    explicacion: [
      {
        t: 'p',
        texto:
          'Punto 18. Una lista guarda varias cosas en una sola variable. Va entre corchetes `[ ]` y las cosas van separadas por comas.',
      },
      {
        t: 'p',
        texto:
          'Cada cosa tiene una posición, y aquí viene lo importante: la primera posición es la 0, no la 1. Para sacar una cosa, el nombre de la lista y la posición entre corchetes.',
      },
      { t: 'codigo', codigo: 'frutas = ["mango", "pera", "uva"]\nprint(frutas[0])\nprint(frutas[1])\nprint(frutas[2])' },
      { t: 'p', texto: 'Posición 0: mango. Posición 1: pera. Posición 2: uva. Y hay un truco: la posición -1 es la última.' },
      { t: 'codigo', codigo: 'frutas = ["mango", "pera", "uva"]\nprint(frutas[-1])' },
      {
        t: 'ojo',
        texto:
          'Las posiciones empiezan en 0. Entonces `frutas[1]` NO es la primera: es la segunda. Y si pides una posición que no existe (`frutas[3]` en una lista de tres), Python da un error.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 18 del examen es de selección múltiple: te muestran una lista y un print con una posición entre corchetes. Cuenta desde 0: la primera es la 0, la segunda es la 1…',
      },
    ],
    retos: [
      {
        id: 'pre-18-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Ya está escrita la lista `animales`. Muestra el PRIMER animal usando su posición.',
        inicial: 'animales = ["perro", "gato", "loro"]\n',
        pista: 'La primera posición es la 0: `print(animales[0])`.',
        solucion: 'animales = ["perro", "gato", "loro"]\nprint(animales[0])',
        pruebas: [
          { t: 'src', re: 'animales\\s*\\[\\s*0\\s*\\]', msg: 'Usa la posición 0' },
          { t: 'salida', igual: 'perro', msg: 'Sale perro' },
        ],
      },
      {
        id: 'pre-18-2',
        titulo: 'Dos posiciones',
        enunciado: 'Ya está la lista `dias`. Usando posiciones, muestra primero el TERCER día y después el SEGUNDO, uno por renglón.',
        inicial: 'dias = ["lunes", "martes", "miércoles", "jueves"]\n',
        pista: 'El tercero es la posición 2 y el segundo es la posición 1.',
        solucion: 'dias = ["lunes", "martes", "miércoles", "jueves"]\nprint(dias[2])\nprint(dias[1])',
        pruebas: [
          { t: 'src', re: 'dias\\s*\\[\\s*2\\s*\\]', msg: 'Usa la posición 2 para el tercero' },
          { t: 'src', re: 'dias\\s*\\[\\s*1\\s*\\]', msg: 'Usa la posición 1 para el segundo' },
          { t: 'salida', igual: 'miércoles\nmartes', msg: 'Sale miércoles y después martes' },
        ],
      },
      {
        id: 'pre-18-3',
        titulo: 'Como en el examen',
        enunciado:
          'Ya está la lista `numeros`. Crea la variable `primero` con el primer número de la lista y la variable `ultimo` con el último, sacándolos con posiciones (no los escribas a mano). Muestra las dos.',
        inicial: 'numeros = [10, 20, 30, 40]\n',
        pista: '`primero = numeros[0]` y `ultimo = numeros[-1]` (o `numeros[3]`). Después un print para cada una.',
        solucion: 'numeros = [10, 20, 30, 40]\nprimero = numeros[0]\nultimo = numeros[-1]\nprint(primero)\nprint(ultimo)',
        pruebas: [
          { t: 'src', re: 'primero\\s*=\\s*numeros\\s*\\[', msg: 'Saca primero con una posición' },
          { t: 'src', re: 'ultimo\\s*=\\s*numeros\\s*\\[', msg: 'Saca ultimo con una posición' },
          { t: 'expr', code: 'primero', igual: '10', msg: 'primero vale 10' },
          { t: 'expr', code: 'ultimo', igual: '40', msg: 'ultimo vale 40' },
          { t: 'salida', igual: '10\n40', msg: 'Muestra las dos' },
        ],
      },
    ],
  },
  {
    id: 'pre-19',
    numero: 19,
    titulo: 'Cuenta regresiva con while',
    emoji: '🚀',
    minutos: 15,
    explicacion: [
      {
        t: 'p',
        texto:
          'Punto 19. Un while también puede contar hacia atrás: la variable empieza alta y en cada vuelta se le resta 1. `n -= 1` es lo mismo que `n = n - 1`.',
      },
      { t: 'codigo', codigo: 'n = 5\nwhile n >= 1:\n    print(n)\n    n -= 1' },
      {
        t: 'p',
        texto:
          'Vuelta por vuelta: n vale 5, 4, 3, 2, 1 y se imprime cada uno. Cuando n llega a 0, `0 >= 1` es falso y el while para.',
      },
      {
        t: 'p',
        texto:
          'Lo que va DESPUÉS del while, sin sangría, pasa una sola vez, cuando el while ya terminó. Así se pone un mensaje al final:',
      },
      { t: 'codigo', codigo: 'n = 3\nwhile n >= 1:\n    print(n)\n    n -= 1\nprint("¡Ya!")' },
      { t: 'p', texto: 'Ahora mira qué pasa si el print del final queda con sangría, metido dentro del while:' },
      { t: 'codigo', codigo: 'n = 3\nwhile n >= 1:\n    print(n)\n    n -= 1\n    print("¡Ya!")' },
      {
        t: 'ojo',
        texto:
          'El mensaje del final va pegado a la izquierda, sin espacios. Si le pones sangría, queda adentro del while y sale en cada vuelta. Y no olvides el `n -= 1`: sin él, n nunca baja y el while nunca para.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 19 del examen es de escribir código: una cuenta regresiva con while y un mensaje al final. Fíjate en tres cosas: dónde empieza la variable, que baje de 1 en 1 adentro del while, y que el mensaje final quede por fuera (sin sangría).',
      },
    ],
    retos: [
      {
        id: 'pre-19-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Con un while, muestra los números del 5 al 1, uno por renglón.',
        inicial: '',
        pista: '`n = 5`, `while n >= 1:` y adentro `print(n)` y `n -= 1`.',
        solucion: 'n = 5\nwhile n >= 1:\n    print(n)\n    n -= 1',
        pruebas: [
          { t: 'src', re: '\\bwhile\\b', msg: 'Usa while' },
          { t: 'salida', igual: '5\n4\n3\n2\n1', msg: 'Salen del 5 al 1' },
        ],
      },
      {
        id: 'pre-19-2',
        titulo: 'Con mensaje al final',
        enunciado: 'Con un while, muestra del 3 al 1 y al final, una sola vez: ¡Fuera!',
        inicial: '',
        pista: 'El `print("¡Fuera!")` va después del while, pegado a la izquierda (sin sangría).',
        solucion: 'n = 3\nwhile n >= 1:\n    print(n)\n    n -= 1\nprint("¡Fuera!")',
        pruebas: [
          { t: 'src', re: '\\bwhile\\b', msg: 'Usa while' },
          { t: 'salida', igual: '3\n2\n1\n¡Fuera!', msg: 'Sale 3, 2, 1 y ¡Fuera! una sola vez' },
        ],
      },
      {
        id: 'pre-19-3',
        titulo: 'Como en el examen',
        enunciado: 'Con un while, muestra los números del 12 al 1, uno por renglón. Al final, muestra: ¡A comer!',
        inicial: '',
        pista: 'Empieza con `n = 12`. Adentro del while, `print(n)` y `n -= 1`. El `print("¡A comer!")` va por fuera.',
        solucion: 'n = 12\nwhile n >= 1:\n    print(n)\n    n -= 1\nprint("¡A comer!")',
        pruebas: [
          { t: 'src', re: '\\bwhile\\b', msg: 'Usa while' },
          { t: 'linea', n: 0, igual: '12', msg: 'Empieza en 12' },
          { t: 'linea', n: -2, igual: '1', msg: 'El último número es 1' },
          { t: 'linea', n: -1, contiene: 'A comer', msg: 'Termina con “¡A comer!”' },
          { t: 'salida', contiene: '12\n11\n10\n9\n8\n7\n6\n5\n4\n3\n2\n1', msg: 'Salen todos, del 12 al 1' },
        ],
      },
    ],
  },
  {
    id: 'pre-20',
    numero: 20,
    titulo: 'Ir sumando: el acumulador',
    emoji: '🐷',
    minutos: 18,
    explicacion: [
      {
        t: 'p',
        texto:
          'Punto 20. Un acumulador es una variable que va guardando una suma, poquito a poquito. Empieza en 0 y cada vez se le suma algo con `+=`.',
      },
      { t: 'codigo', codigo: 'total = 0\ntotal += 5\ntotal += 3\ntotal += 10\nprint(total)' },
      {
        t: 'p',
        texto:
          'Como una alcancía: empieza vacía, y cada moneda que entra se suma a lo que ya había. Con un while se puede ir sumando lo que la persona escribe, hasta que escriba 0.',
      },
      {
        t: 'p',
        texto:
          'El orden es este: (1) total en 0; (2) pedir el primer número ANTES del while; (3) mientras no sea 0, sumarlo y pedir el siguiente; (4) al final, mostrar el total.',
      },
      {
        t: 'codigo',
        codigo: 'total = 0\nn = int(input("Número: "))\nwhile n != 0:\n    total += n\n    n = int(input("Número: "))\nprint("Total:", total)',
        entradas: ['4', '6', '0'],
      },
      { t: 'p', texto: '`!=` quiere decir "es distinto de". `while n != 0` se lee: "mientras n no sea 0".' },
      {
        t: 'ojo',
        texto:
          'Dos errores típicos: no volver a pedir el número adentro del while (entonces n nunca cambia y el while no para), y meter el `print` del total adentro del while (sale en cada vuelta). El total se muestra UNA vez, al final, sin sangría.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 20 del examen es de escribir código: pedir números uno tras otro, irlos sumando y parar cuando escriban 0. Arma los cuatro pasos de arriba: total en 0, primer input, while que suma y vuelve a preguntar, y el print al final.',
      },
    ],
    retos: [
      {
        id: 'pre-20-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Crea `total = 0`. Después, con `+=`, súmale 10, luego 20 y luego 5. Muestra el total. No escribas el resultado a mano.',
        inicial: '',
        pista: 'Tres líneas con `total += …` y al final `print(total)`.',
        solucion: 'total = 0\ntotal += 10\ntotal += 20\ntotal += 5\nprint(total)',
        pruebas: [
          { t: 'src', re: '\\+=', msg: 'Usa +=' },
          { t: 'src', re: '\\b35\\b', not: true, msg: 'No escribe el resultado a mano' },
          { t: 'expr', code: 'total', igual: '35', msg: 'total vale 35' },
          { t: 'salida', igual: '35', msg: 'Sale 35' },
        ],
      },
      {
        id: 'pre-20-2',
        titulo: 'Sumar con un while',
        enunciado: 'Con un while, suma todos los números del 1 al 10 y muestra la suma (sin usar sum y sin escribir el resultado).',
        inicial: '',
        pista: '`total = 0` y `n = 1`. Mientras `n <= 10`: `total += n` y `n += 1`. Al final, `print(total)`.',
        solucion: 'total = 0\nn = 1\nwhile n <= 10:\n    total += n\n    n += 1\nprint(total)',
        pruebas: [
          { t: 'src', re: '\\bwhile\\b', msg: 'Usa while' },
          { t: 'src', re: '\\bsum\\s*\\(', not: true, msg: 'No usa sum' },
          { t: 'src', re: '\\b55\\b', not: true, msg: 'No escribe el resultado a mano' },
          { t: 'salida', igual: '55', msg: 'Sale 55' },
        ],
      },
      {
        id: 'pre-20-3',
        titulo: 'Como en el examen',
        enunciado:
          'Pide con input() los goles de cada partido, uno tras otro, y ve sumándolos. Cuando escriban -1, se deja de preguntar y se muestra:\n\nGoles: (la suma)\n\nSi escriben 2, 3, 1 y -1, sale Goles: 6',
        inicial: '',
        entradas: ['2', '3', '1', '-1'],
        pista: 'Igual que la alcancía, pero el while sigue mientras `g != -1`. Pide el primero antes del while y el siguiente al final de cada vuelta.',
        solucion: 'total = 0\ng = int(input("Goles: "))\nwhile g != -1:\n    total += g\n    g = int(input("Goles: "))\nprint("Goles:", total)',
        pruebas: [
          { t: 'src', re: '\\bwhile\\b', msg: 'Usa while' },
          { t: 'linea', n: -1, contiene: 'Goles', msg: 'Al final dice “Goles”' },
          { t: 'linea', n: -1, contiene: '6', msg: 'Con 2, 3, 1 y -1, salen 6 goles' },
          { t: 'linea', n: -1, contiene: '4', entradas: ['0', '4', '-1'], msg: 'Con 0, 4 y -1, salen 4 (el 0 también cuenta como partido)' },
          { t: 'linea', n: -1, contiene: '24', entradas: ['7', '8', '9', '-1'], msg: 'Con tres partidos también suma bien' },
        ],
      },
    ],
  },
  {
    id: 'pre-21',
    numero: 21,
    titulo: 'append: agregar al final de la lista',
    emoji: '➕',
    minutos: 12,
    explicacion: [
      {
        t: 'p',
        texto:
          'Punto 21. Las listas pueden crecer. `append` sirve para agregar una cosa nueva, y siempre la pone AL FINAL, de última.',
      },
      {
        t: 'p',
        texto: 'Se escribe con un punto: el nombre de la lista, `.append(`, y lo que quieres agregar entre los paréntesis.',
      },
      { t: 'codigo', codigo: 'frutas = ["mango", "pera"]\nfrutas.append("uva")\nprint(frutas)' },
      { t: 'p', texto: 'Una lista puede empezar vacía, `[ ]`, y llenarse con varios append. Cada uno queda detrás del anterior:' },
      { t: 'codigo', codigo: 'compras = []\ncompras.append("pan")\ncompras.append("leche")\nprint(compras)\nprint(compras[-1])' },
      {
        t: 'ojo',
        texto:
          '`append` no pone la cosa de primera ni en la mitad: siempre de última. Y se escribe `frutas.append("uva")`, con punto y paréntesis; `frutas = "uva"` borraría la lista entera y dejaría solo un texto.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 21 del examen es de falso o verdadero sobre append: te dicen dónde queda lo que se agregó. Acuérdate: append siempre agrega al final.',
      },
    ],
    retos: [
      {
        id: 'pre-21-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Ya está la lista `juguetes`. Agrégale "trompo" con append y muestra la lista completa.',
        inicial: 'juguetes = ["balón", "yoyo"]\n',
        pista: '`juguetes.append("trompo")` y después `print(juguetes)`.',
        solucion: 'juguetes = ["balón", "yoyo"]\njuguetes.append("trompo")\nprint(juguetes)',
        pruebas: [
          { t: 'src', re: '\\.append\\s*\\(', msg: 'Usa append' },
          { t: 'expr', code: 'juguetes', igual: "['balón', 'yoyo', 'trompo']", msg: 'trompo queda de último' },
          { t: 'salida', contiene: 'trompo', msg: 'Muestra la lista' },
        ],
      },
      {
        id: 'pre-21-2',
        titulo: 'Desde una lista vacía',
        enunciado:
          'Crea la lista vacía `amigos = []`. Con append, agrégale "Ana", después "Luis" y después "Sofi". Muestra el último amigo usando la posición -1.',
        inicial: '',
        pista: 'Tres líneas con `amigos.append(…)` y al final `print(amigos[-1])`.',
        solucion: 'amigos = []\namigos.append("Ana")\namigos.append("Luis")\namigos.append("Sofi")\nprint(amigos[-1])',
        pruebas: [
          { t: 'src', re: '\\.append\\s*\\(', min: 3, msg: 'Usa append tres veces' },
          { t: 'src', re: '\\[\\s*-1\\s*\\]', msg: 'Usa la posición -1' },
          { t: 'expr', code: 'amigos', igual: "['Ana', 'Luis', 'Sofi']", msg: 'La lista queda Ana, Luis, Sofi' },
          { t: 'salida', igual: 'Sofi', msg: 'Sale Sofi' },
        ],
      },
      {
        id: 'pre-21-3',
        titulo: 'Como en el examen',
        enunciado:
          'Ya está la lista `frutas`. Pide una fruta con input(), agrégala con append y muestra la fruta que quedó de última en la lista (usando una posición).',
        inicial: 'frutas = ["mango", "pera"]\n',
        entradas: ['uva'],
        pista: '`frutas.append(input("Fruta: "))` y después `print(frutas[-1])`.',
        solucion: 'frutas = ["mango", "pera"]\nfrutas.append(input("Fruta: "))\nprint(frutas[-1])',
        pruebas: [
          { t: 'src', re: '\\.append\\s*\\(', msg: 'Usa append' },
          { t: 'src', re: '\\binput\\s*\\(', msg: 'Usa input()' },
          { t: 'expr', code: 'frutas', igual: "['mango', 'pera', 'uva']", msg: 'Con uva, la lista queda mango, pera, uva' },
          { t: 'linea', n: -1, igual: 'uva', msg: 'Con uva, sale uva' },
          { t: 'linea', n: -1, igual: 'kiwi', entradas: ['kiwi'], msg: 'Con kiwi, sale kiwi' },
        ],
      },
    ],
  },
  {
    id: 'pre-22',
    numero: 22,
    titulo: 'Listas: crear, agregar y contar con len',
    emoji: '🔢',
    minutos: 14,
    explicacion: [
      {
        t: 'p',
        texto:
          'Punto 22. Aquí juntas todo lo de listas: crearla, agregarle cosas con append y contar cuántas tiene con `len`.',
      },
      {
        t: 'p',
        texto:
          'Para crear una lista con textos: corchetes, cada texto entre comillas, separados por comas. `len(lista)` dice cuántas cosas tiene. Para verlo, va dentro de un print.',
      },
      { t: 'codigo', codigo: 'numeros = [3, 7, 9]\nprint(len(numeros))' },
      { t: 'codigo', codigo: 'mascotas = ["perro", "gato"]\nmascotas.append("pez")\nprint(mascotas)\nprint(len(mascotas))' },
      {
        t: 'p',
        texto: 'Fíjate que después del append, len ya cuenta la cosa nueva: antes había 2, ahora hay 3.',
      },
      {
        t: 'ojo',
        texto:
          'Los textos van exactamente como te los piden: "rojo" no es lo mismo que "Rojo", y el orden importa. Y `len` se escribe `len(mascotas)`, con la lista adentro del paréntesis; para que salga en la pantalla, `print(len(mascotas))`.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 22 del examen es de escribir código: crear una lista con unos textos en un orden exacto, agregarle uno con append y mostrar cuántos tiene con len. Tres pasos, tres renglones.',
      },
    ],
    retos: [
      {
        id: 'pre-22-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Crea una lista `numeros` con 4, 8, 15 y 16 (en ese orden) y muestra cuántos números tiene, usando len.',
        inicial: '',
        pista: '`numeros = [4, 8, 15, 16]` y `print(len(numeros))`.',
        solucion: 'numeros = [4, 8, 15, 16]\nprint(len(numeros))',
        pruebas: [
          { t: 'expr', code: 'numeros', igual: '[4, 8, 15, 16]', msg: 'La lista tiene 4, 8, 15 y 16' },
          { t: 'src', re: '\\blen\\s*\\(', msg: 'Usa len' },
          { t: 'salida', igual: '4', msg: 'Sale 4' },
        ],
      },
      {
        id: 'pre-22-2',
        titulo: 'Agregar y mostrar',
        enunciado: 'Crea la lista `deportes` con "fútbol" y "baloncesto". Agrégale "natación" con append y muestra la lista completa.',
        inicial: '',
        pista: '`deportes = ["fútbol", "baloncesto"]`, `deportes.append("natación")` y `print(deportes)`.',
        solucion: 'deportes = ["fútbol", "baloncesto"]\ndeportes.append("natación")\nprint(deportes)',
        pruebas: [
          { t: 'src', re: '\\.append\\s*\\(', msg: 'Usa append' },
          { t: 'expr', code: 'deportes', igual: "['fútbol', 'baloncesto', 'natación']", msg: 'La lista queda con los tres en orden' },
          { t: 'salida', contiene: 'natación', msg: 'Muestra la lista' },
        ],
      },
      {
        id: 'pre-22-3',
        titulo: 'Como en el examen',
        enunciado:
          'Crea una lista `planetas` con "mercurio", "venus" y "tierra" (en minúscula y en ese orden).\n\nDespués agrégale "marte" con append, y muestra cuántos planetas tiene la lista usando len.',
        inicial: '',
        pista: 'Tres renglones: crear la lista, `planetas.append("marte")` y `print(len(planetas))`.',
        solucion: 'planetas = ["mercurio", "venus", "tierra"]\nplanetas.append("marte")\nprint(len(planetas))',
        pruebas: [
          { t: 'src', re: '\\[', msg: 'Crea una lista con [ ]' },
          { t: 'src', re: '\\.append\\s*\\(', msg: 'Usa append' },
          { t: 'src', re: '\\blen\\s*\\(', msg: 'Usa len' },
          { t: 'expr', code: 'planetas', igual: "['mercurio', 'venus', 'tierra', 'marte']", msg: 'La lista queda con los cuatro planetas en orden' },
          { t: 'linea', n: -1, contiene: '4', msg: 'Sale 4' },
        ],
      },
    ],
  },
  {
    id: 'pre-23',
    numero: 23,
    titulo: 'return no es lo mismo que print',
    emoji: '↩️',
    minutos: 15,
    explicacion: [
      {
        t: 'p',
        texto:
          'Punto 23. Una función es un pedazo de código con nombre que se puede usar muchas veces. Se crea con `def`, el nombre, los paréntesis y dos puntos; lo de adentro lleva sangría.',
      },
      {
        t: 'p',
        texto:
          '`return` hace que la función DEVUELVA un valor a quien la llamó. Ojo: devolver no es mostrar. El valor queda guardado, pero en la pantalla no sale nada. Corre este ejemplo:',
      },
      { t: 'codigo', codigo: 'def doble(n):\n    return n * 2\n\nresultado = doble(4)' },
      { t: 'p', texto: 'No imprimió nada. El 8 quedó guardado en `resultado`, pero nadie le hizo print. Ahora sí:' },
      { t: 'codigo', codigo: 'def doble(n):\n    return n * 2\n\nresultado = doble(4)\nprint(resultado)\nprint(doble(10))' },
      {
        t: 'p',
        texto:
          'Piénsalo así: `return` es como cuando le pides a alguien que haga una cuenta y te la entregue en un papelito. Te la entregó, pero si no la lees en voz alta (print), nadie más se entera.',
      },
      {
        t: 'ojo',
        texto:
          'return NO muestra nada en la pantalla. Si en todo el programa no hay un print, la pantalla queda vacía, aunque la función haya hecho la cuenta.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 23 del examen es de selección múltiple: te muestran una función con return y te preguntan qué se ve en la pantalla. Busca si en algún lado hay un print. Si no hay, piensa bien antes de escoger.',
      },
    ],
    retos: [
      {
        id: 'pre-23-1',
        titulo: 'Inténtalo tú',
        enunciado:
          'Este programa hace la cuenta pero no muestra nada. Agrégale lo que falta para que se vea el valor de x (sin escribir el resultado a mano).',
        inicial: 'def triple(n):\n    return n * 3\n\nx = triple(5)\n',
        pista: 'Falta un print: `print(x)`.',
        solucion: 'def triple(n):\n    return n * 3\n\nx = triple(5)\nprint(x)',
        pruebas: [
          { t: 'src', re: '\\bprint\\s*\\(', msg: 'Usa print' },
          { t: 'src', re: '\\b15\\b', not: true, msg: 'No escribe el resultado a mano' },
          { t: 'salida', igual: '15', msg: 'Sale 15' },
        ],
      },
      {
        id: 'pre-23-2',
        titulo: 'Tu propia función',
        enunciado:
          'Escribe una función `saludo(nombre)` que DEVUELVA (con return) el texto "Hola " seguido del nombre. Después muestra lo que devuelve saludo("Ana").',
        inicial: '',
        pista: '`def saludo(nombre):` y adentro `return "Hola " + nombre`. Afuera, `print(saludo("Ana"))`.',
        solucion: 'def saludo(nombre):\n    return "Hola " + nombre\n\nprint(saludo("Ana"))',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+saludo\\s*\\(', msg: 'Define saludo con def' },
          { t: 'src', re: '\\breturn\\b', msg: 'Usa return' },
          { t: 'expr', code: 'saludo("Luis")', igual: "'Hola Luis'", msg: 'saludo("Luis") devuelve "Hola Luis"' },
          { t: 'salida', igual: 'Hola Ana', msg: 'Sale “Hola Ana”' },
        ],
      },
      {
        id: 'pre-23-3',
        titulo: 'Como en el examen',
        enunciado:
          'Escribe una función `mitad(n)` que devuelva (con return, no con print) la mitad de n. Guarda en la variable `m` lo que devuelve mitad(10) y muéstrala.',
        inicial: '',
        pista: '`def mitad(n):` y adentro `return n / 2`. Afuera, `m = mitad(10)` y `print(m)`.',
        solucion: 'def mitad(n):\n    return n / 2\n\nm = mitad(10)\nprint(m)',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+mitad\\s*\\(', msg: 'Define mitad con def' },
          { t: 'src', re: '\\breturn\\b', msg: 'Usa return' },
          { t: 'expr', code: 'mitad(8)', igual: '4.0', msg: 'mitad(8) devuelve 4.0' },
          { t: 'expr', code: 'm', igual: '5.0', msg: 'm vale 5.0' },
          { t: 'salida', igual: '5.0', msg: 'Sale 5.0' },
        ],
      },
    ],
  },
  {
    id: 'pre-24',
    numero: 24,
    titulo: 'Recorrer una lista con for',
    emoji: '📊',
    minutos: 16,
    explicacion: [
      {
        t: 'p',
        texto:
          'Punto 24. El `for` también sirve para recorrer una lista: en cada vuelta, la variable toma la siguiente cosa de la lista.',
      },
      { t: 'codigo', codigo: 'numeros = [2, 4, 6]\nfor n in numeros:\n    print(n)' },
      {
        t: 'p',
        texto:
          'Si juntas el for con un acumulador (lección 20), puedes sumar todo lo de la lista. El total empieza en 0 ANTES del for, y adentro se le suma cada número.',
      },
      { t: 'codigo', codigo: 'numeros = [2, 4, 6]\ntotal = 0\nfor n in numeros:\n    total += n\nprint(total)' },
      {
        t: 'p',
        texto:
          'Y el promedio es la suma dividida entre cuántos hay. Cuántos hay lo dice `len`:',
      },
      { t: 'codigo', codigo: 'numeros = [2, 4, 6]\ntotal = 0\nfor n in numeros:\n    total += n\nprint(total / len(numeros))' },
      {
        t: 'ojo',
        texto:
          'Si pones `total = 0` ADENTRO del for, se vuelve a poner en 0 en cada vuelta y la suma se pierde. Y el print del promedio va DESPUÉS del for, sin sangría; si queda adentro, sale un promedio a medias en cada vuelta.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 24 del examen es de escribir código: sacar el promedio de una lista con un for, sin usar sum. Ojo con dónde va el total = 0, con la sangría de cada línea y con dividir entre len.',
      },
    ],
    retos: [
      {
        id: 'pre-24-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Ya está la lista `puntos`. Con un for, muestra cada número, uno por renglón.',
        inicial: 'puntos = [5, 8, 2]\n',
        pista: '`for p in puntos:` y adentro `print(p)`.',
        solucion: 'puntos = [5, 8, 2]\nfor p in puntos:\n    print(p)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'salida', igual: '5\n8\n2', msg: 'Salen 5, 8 y 2' },
        ],
      },
      {
        id: 'pre-24-2',
        titulo: 'Sumar la lista',
        enunciado: 'Ya está la lista `edades`. Con un for (sin usar sum), súmalas todas y muestra el total.',
        inicial: 'edades = [10, 12, 11, 13]\n',
        pista: '`total = 0` antes del for; adentro `total += e`; después del for, `print(total)`.',
        solucion: 'edades = [10, 12, 11, 13]\ntotal = 0\nfor e in edades:\n    total += e\nprint(total)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\bsum\\s*\\(', not: true, msg: 'No usa sum' },
          { t: 'src', re: '\\b46\\b', not: true, msg: 'No escribe el resultado a mano' },
          { t: 'salida', igual: '46', msg: 'Sale 46' },
        ],
      },
      {
        id: 'pre-24-3',
        titulo: 'Como en el examen',
        enunciado:
          'Ya está la lista `goles`. Con un for, súmalos todos (sin usar sum) y muestra el promedio: la suma dividida entre cuántos hay.',
        inicial: 'goles = [2, 0, 3, 1, 4]\n',
        pista: 'Suma con el for como en el reto anterior, y al final `print(total / len(goles))`.',
        solucion: 'goles = [2, 0, 3, 1, 4]\ntotal = 0\nfor g in goles:\n    total += g\nprint(total / len(goles))',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\bsum\\s*\\(', not: true, msg: 'No usa sum' },
          { t: 'src', re: '/', msg: 'Divide' },
          { t: 'linea', n: -1, igual: '2.0', msg: 'Sale 2.0' },
        ],
      },
    ],
  },
  {
    id: 'pre-25',
    numero: 25,
    titulo: 'Funciones que devuelven un cálculo',
    emoji: '📐',
    minutos: 16,
    explicacion: [
      {
        t: 'p',
        texto:
          'Punto 25. Una función puede recibir datos (los parámetros) y devolver un resultado con `return`. Así la cuenta se escribe una vez y sirve para cualquier número.',
      },
      {
        t: 'p',
        texto:
          'Las partes: `def`, el nombre exacto, los parámetros entre paréntesis separados por coma, y los dos puntos. Adentro, con sangría, el `return` con la cuenta.',
      },
      { t: 'codigo', codigo: 'def suma(a, b):\n    return a + b\n\nprint(suma(2, 3))\nprint(suma(10, 5))' },
      {
        t: 'p',
        texto:
          'Cuando escribes `suma(2, 3)`, `a` vale 2 y `b` vale 3. Cuando escribes `suma(10, 5)`, `a` vale 10 y `b` vale 5. La misma función sirve para los dos.',
      },
      { t: 'codigo', codigo: 'def area_rectangulo(base, altura):\n    return base * altura\n\nprint(area_rectangulo(4, 3))\nprint(area_rectangulo(10, 2))' },
      {
        t: 'ojo',
        texto:
          'Usa los parámetros, no números fijos: `return 4 * 3` solo sirve para un rectángulo. Y cuidado con el orden de las cuentas: "a más b, dividido entre 2" se escribe `(a + b) / 2`, con paréntesis. Dividir con `/` da decimales: 10 / 2 da 5.0.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 25 del examen pide escribir una función con un nombre y unos parámetros exactos que devuelva una fórmula con return. Copia bien el nombre, usa los parámetros en la cuenta y no te olvides del return.',
      },
    ],
    retos: [
      {
        id: 'pre-25-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Escribe una función `doble(n)` que devuelva (con return) el doble de n.',
        inicial: '',
        pista: '`def doble(n):` y adentro, con sangría, `return n * 2`.',
        solucion: 'def doble(n):\n    return n * 2',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+doble\\s*\\(', msg: 'Define doble con def' },
          { t: 'src', re: '\\breturn\\b', msg: 'Usa return' },
          { t: 'expr', code: 'doble(4)', igual: '8', msg: 'doble(4) da 8' },
          { t: 'expr', code: 'doble(7)', igual: '14', msg: 'doble(7) da 14' },
        ],
      },
      {
        id: 'pre-25-2',
        titulo: 'El perímetro',
        enunciado: 'Escribe una función `perimetro_cuadrado(lado)` que devuelva el perímetro de un cuadrado: el lado por 4.',
        inicial: '',
        pista: '`def perimetro_cuadrado(lado):` y adentro `return lado * 4`.',
        solucion: 'def perimetro_cuadrado(lado):\n    return lado * 4',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+perimetro_cuadrado\\s*\\(', msg: 'Define perimetro_cuadrado con def' },
          { t: 'src', re: '\\breturn\\b', msg: 'Usa return' },
          { t: 'expr', code: 'perimetro_cuadrado(5)', igual: '20', msg: 'perimetro_cuadrado(5) da 20' },
          { t: 'expr', code: 'perimetro_cuadrado(2)', igual: '8', msg: 'perimetro_cuadrado(2) da 8' },
        ],
      },
      {
        id: 'pre-25-3',
        titulo: 'Como en el examen',
        enunciado:
          'Escribe una función `promedio_dos(a, b)` que devuelva (con return) el promedio de los dos números: a más b, dividido entre 2.',
        inicial: '',
        pista: '`def promedio_dos(a, b):` y adentro `return (a + b) / 2`. Los paréntesis hacen que primero se sume.',
        solucion: 'def promedio_dos(a, b):\n    return (a + b) / 2',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+promedio_dos\\s*\\(', msg: 'Define promedio_dos con def' },
          { t: 'src', re: '\\breturn\\b', msg: 'Usa return' },
          { t: 'expr', code: 'promedio_dos(4, 6)', igual: '5.0', msg: 'promedio_dos(4, 6) da 5.0' },
          { t: 'expr', code: 'promedio_dos(3, 4)', igual: '3.5', msg: 'promedio_dos(3, 4) da 3.5' },
        ],
      },
    ],
  },
]

export const PRACTICAS_3: Practica[] = [
  {
    id: 'practica-4',
    numero: 4,
    despuesDe: 20,
    titulo: 'Práctica de los puntos 16 a 20',
    preguntas: [
      {
        tipo: 'codigo',
        leccion: 16,
        id: 'pre-p4-1',
        titulo: 'La tabla larga',
        enunciado:
          'Pide un número con input() y muestra su tabla de multiplicar del 1 al 12, así (si escriben 4):\n\n4 x 1 = 4\n4 x 2 = 8\n…\n4 x 12 = 48',
        inicial: '',
        entradas: ['4'],
        pista: '',
        pistas: [
          'Convierte el número con int() y usa un for con range. Ojo: range para justo antes del último número.',
          'for i in range(1, 13): y adentro print(f"{n} x {i} = {n * i}")',
        ],
        solucion: 'n = int(input("¿Qué tabla? "))\nfor i in range(1, 13):\n    print(f"{n} x {i} = {n * i}")',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'linea', n: -12, igual: '4 x 1 = 4', msg: 'Con 4, empieza en “4 x 1 = 4”' },
          { t: 'salida', contiene: '4 x 11 = 44', msg: 'Con 4, aparece “4 x 11 = 44”' },
          { t: 'linea', n: -1, igual: '4 x 12 = 48', msg: 'Con 4, termina en “4 x 12 = 48”' },
          { t: 'linea', n: -1, igual: '7 x 12 = 84', entradas: ['7'], msg: 'Con 7, termina en “7 x 12 = 84”' },
        ],
      },
      {
        tipo: 'vf',
        leccion: 17,
        id: 'pre-p4-2',
        titulo: 'El while',
        codigo: 'n = 5\nwhile n > 0:\n    print(n)\n    n = n - 1',
        afirmacion: 'Este programa nunca para: se queda repitiendo para siempre.',
        verdadero: false,
      },
      {
        tipo: 'opcion',
        leccion: 18,
        id: 'pre-p4-3',
        titulo: 'La posición',
        enunciado: '¿Qué muestra este programa?',
        codigo: 'frutas = ["mango", "pera", "uva", "kiwi"]\nprint(frutas[2])',
        opciones: [
          { texto: 'uva', puntos: 5 },
          { texto: 'pera', puntos: 2 },
          { texto: 'kiwi', puntos: 0 },
          { texto: 'Un error', puntos: 0 },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 19,
        id: 'pre-p4-4',
        titulo: 'A jugar',
        enunciado: 'Con un while, muestra los números del 6 al 1, uno por renglón. Al final, muestra: ¡A jugar!',
        inicial: '',
        pista: '',
        pistas: [
          'Crea una variable que empiece en 6 y réstale 1 en cada vuelta. El print del final va por fuera del while (sin sangría).',
          'n = 6 y while n >= 1:, adentro print(n) y n -= 1. Al final, print("¡A jugar!").',
        ],
        solucion: 'n = 6\nwhile n >= 1:\n    print(n)\n    n -= 1\nprint("¡A jugar!")',
        pruebas: [
          { t: 'src', re: '\\bwhile\\b', msg: 'Usa while' },
          { t: 'linea', n: 0, igual: '6', msg: 'Empieza en 6' },
          { t: 'linea', n: -2, igual: '1', msg: 'El último número es 1' },
          { t: 'linea', n: -1, contiene: 'A jugar', msg: 'Termina con “¡A jugar!”' },
          { t: 'salida', contiene: '6\n5\n4\n3\n2\n1', msg: 'Salen todos, del 6 al 1' },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 20,
        id: 'pre-p4-5',
        titulo: 'La cuenta de la tienda',
        enunciado:
          'Pide precios con input(), uno tras otro, y ve sumándolos. Cuando escriban 0, se deja de preguntar y se muestra:\n\nCuenta: (la suma)\n\nSi escriben 1000, 2500, 500 y 0, sale Cuenta: 4000',
        inicial: '',
        entradas: ['1000', '2500', '500', '0'],
        pista: '',
        pistas: [
          'Necesitas una variable total que empiece en 0, y un while que siga mientras el precio no sea 0 (!=).',
          'Pide el primer precio antes del while; adentro súmalo (total += p) y pide el siguiente. Al final, print("Cuenta:", total).',
        ],
        solucion: 'total = 0\np = int(input("Precio: "))\nwhile p != 0:\n    total += p\n    p = int(input("Precio: "))\nprint("Cuenta:", total)',
        pruebas: [
          { t: 'src', re: '\\bwhile\\b', msg: 'Usa while' },
          { t: 'linea', n: -1, contiene: 'Cuenta', msg: 'Al final dice “Cuenta”' },
          { t: 'linea', n: -1, contiene: '4000', msg: 'Con 1000, 2500, 500 y 0, la cuenta es 4000' },
          { t: 'linea', n: -1, contiene: '300', entradas: ['300', '0'], msg: 'Con 300 y 0, la cuenta es 300' },
          { t: 'linea', n: -1, contiene: '1000', entradas: ['100', '200', '300', '400', '0'], msg: 'Con cuatro precios también suma bien' },
        ],
      },
    ],
  },
  {
    id: 'practica-5',
    numero: 5,
    despuesDe: 25,
    titulo: 'Práctica de los puntos 21 a 25',
    preguntas: [
      {
        tipo: 'vf',
        leccion: 21,
        id: 'pre-p5-1',
        titulo: 'append',
        codigo: 'numeros = [1, 2]\nnumeros.append(3)',
        afirmacion: 'Después de estas dos líneas, el 3 queda de primero en la lista numeros.',
        verdadero: false,
      },
      {
        tipo: 'codigo',
        leccion: 22,
        id: 'pre-p5-2',
        titulo: 'Los animales',
        enunciado:
          'Crea una lista `animales` con "perro" y "gato" (en minúscula y en ese orden).\n\nDespués agrégale "loro" y luego "pez" con append, y muestra cuántos animales tiene la lista usando len.',
        inicial: '',
        pista: '',
        pistas: [
          'Una lista va entre corchetes, con los textos entre comillas y separados por comas.',
          'animales = ["perro", "gato"], después animales.append("loro"), animales.append("pez") y print(len(animales)).',
        ],
        solucion: 'animales = ["perro", "gato"]\nanimales.append("loro")\nanimales.append("pez")\nprint(len(animales))',
        pruebas: [
          { t: 'src', re: '\\[', msg: 'Crea una lista con [ ]' },
          { t: 'src', re: '\\.append\\s*\\(', msg: 'Usa append' },
          { t: 'src', re: '\\blen\\s*\\(', msg: 'Usa len' },
          { t: 'expr', code: 'animales', igual: "['perro', 'gato', 'loro', 'pez']", msg: 'La lista queda con los cuatro animales en orden' },
          { t: 'linea', n: -1, contiene: '4', msg: 'Sale 4' },
        ],
      },
      {
        tipo: 'opcion',
        leccion: 23,
        id: 'pre-p5-3',
        titulo: 'return y print',
        enunciado: '¿Qué se ve en la pantalla cuando corre este programa?',
        codigo: 'def doble(n):\n    return n * 2\n\nprint(doble(6))',
        opciones: [
          { texto: '12', puntos: 5 },
          { texto: 'Nada: return no muestra nada', puntos: 1 },
          { texto: '6', puntos: 0 },
          { texto: 'n * 2', puntos: 0 },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 24,
        id: 'pre-p5-4',
        titulo: 'La temperatura promedio',
        enunciado:
          'Ya está escrita la lista `temperaturas`. Con un for, súmalas todas (sin usar sum) y muestra el promedio: la suma dividida entre cuántas hay.',
        inicial: 'temperaturas = [20, 25, 18, 21]\n',
        pista: '',
        pistas: [
          'Crea total = 0 antes del for y en cada vuelta súmale la temperatura. len(temperaturas) dice cuántas hay.',
          'for t in temperaturas: y adentro total += t. Al final, print(total / len(temperaturas)).',
        ],
        solucion: 'temperaturas = [20, 25, 18, 21]\ntotal = 0\nfor t in temperaturas:\n    total += t\nprint(total / len(temperaturas))',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\bsum\\s*\\(', not: true, msg: 'No usa sum' },
          { t: 'src', re: '/', msg: 'Divide' },
          { t: 'linea', n: -1, contiene: '21.0', msg: 'Sale 21.0' },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 25,
        id: 'pre-p5-5',
        titulo: 'El rectángulo',
        enunciado:
          'Escribe una función `area_rectangulo(base, altura)` que devuelva (con return) el área de un rectángulo: base por altura.',
        inicial: '',
        pista: '',
        pistas: [
          'Una función empieza con def, el nombre y los parámetros entre paréntesis, y termina en dos puntos.',
          'def area_rectangulo(base, altura): y adentro return base * altura',
        ],
        solucion: 'def area_rectangulo(base, altura):\n    return base * altura',
        pruebas: [
          { t: 'src', re: '\\bdef\\s+area_rectangulo\\s*\\(', msg: 'Define area_rectangulo con def' },
          { t: 'src', re: '\\breturn\\b', msg: 'Usa return' },
          { t: 'expr', code: 'area_rectangulo(4, 5)', igual: '20', msg: 'area_rectangulo(4, 5) da 20' },
          { t: 'expr', code: 'area_rectangulo(3, 7)', igual: '21', msg: 'area_rectangulo(3, 7) da 21' },
        ],
      },
    ],
  },
]
