import type { Leccion, Practica } from '../tipos'

/*
 * Curso de preparación para el examen de Python: puntos 6 a 15.
 * Mismo formato que parte1.ts: un punto del examen por lección, en el mismo
 * orden, con "Prepárate" al final y tres retos de menos a más.
 */

export const LECCIONES_2: Leccion[] = [
  {
    id: 'pre-6',
    numero: 6,
    titulo: 'Nombres de variables que sí funcionan',
    emoji: '🏷️',
    minutos: 10,
    explicacion: [
      { t: 'p', texto: 'Punto 6. Ya sabes crear variables. Ahora: ¿qué nombres les puedes poner?' },
      {
        t: 'p',
        texto:
          'Un nombre de variable puede tener letras, números y el guion bajo `_`. Pero tiene tres reglas: no puede tener espacios, no puede empezar con un número y no puede tener guion `-`.',
      },
      { t: 'codigo', codigo: 'mi_edad = 12\nnombre2 = "Ana"\nprint(mi_edad)\nprint(nombre2)' },
      {
        t: 'p',
        texto:
          'Cuando el nombre tiene dos palabras, se unen con guion bajo: `mi_edad`, `cada_uno`, `total_ruedas`. Así lo leen bien las personas y también Python.',
      },
      {
        t: 'ojo',
        texto:
          '`mi edad` (con espacio), `2edad` (empieza con número) y `mi-edad` (con guion) dan error. Python cree que `mi-edad` es una resta: `mi` menos `edad`. La solución casi siempre es el guion bajo: `mi_edad`.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 6 del examen es de selección múltiple: te muestran cuatro nombres de variable y tienes que escoger el que sí funciona. Revisa las tres reglas con cada uno: ¿tiene espacio? ¿empieza con número? ¿tiene guion?',
      },
    ],
    retos: [
      {
        id: 'pre-6-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Crea una variable llamada `mi_color` que guarde el texto "azul" y muéstrala con print.',
        inicial: '',
        pista: 'Las dos palabras van unidas con guion bajo: `mi_color = "azul"` y después `print(mi_color)`.',
        solucion: 'mi_color = "azul"\nprint(mi_color)',
        pruebas: [
          { t: 'expr', code: 'mi_color', igual: "'azul'", msg: 'mi_color vale "azul"' },
          { t: 'src', re: '\\bprint\\s*\\(\\s*mi_color\\s*\\)', msg: 'Muestra la variable con print(mi_color)' },
          { t: 'salida', igual: 'azul', msg: 'Sale azul' },
        ],
      },
      {
        id: 'pre-6-2',
        titulo: 'Arregla los nombres',
        enunciado:
          'Este programa tiene nombres que no funcionan. Arréglalo cambiando los nombres por `mi_edad` y `edad2` (los valores se quedan igual), para que muestre 11 y después 12.',
        inicial: 'mi edad = 11\n2edad = 12\nprint(mi edad)\nprint(2edad)\n',
        pista: 'Cambia `mi edad` por `mi_edad` (en las dos partes donde aparece) y `2edad` por `edad2`.',
        solucion: 'mi_edad = 11\nedad2 = 12\nprint(mi_edad)\nprint(edad2)',
        pruebas: [
          { t: 'expr', code: 'mi_edad', igual: '11', msg: 'mi_edad vale 11' },
          { t: 'expr', code: 'edad2', igual: '12', msg: 'edad2 vale 12' },
          { t: 'salida', igual: '11\n12', msg: 'Sale 11 y después 12' },
        ],
      },
      {
        id: 'pre-6-3',
        titulo: 'Como en el examen',
        enunciado:
          'Crea tres variables con nombres que sí funcionan:\n\n• `numero_de_hermanos` que valga 2\n• `nota_final` que valga 4.5\n• `jugador1` que valga "Sofi"\n\nMuestra las tres, cada una en su renglón.',
        inicial: '',
        pista: 'Cada nombre se escribe exactamente así, con guion bajo y sin espacios. Después, un print para cada una.',
        solucion: 'numero_de_hermanos = 2\nnota_final = 4.5\njugador1 = "Sofi"\nprint(numero_de_hermanos)\nprint(nota_final)\nprint(jugador1)',
        pruebas: [
          { t: 'expr', code: 'numero_de_hermanos', igual: '2', msg: 'numero_de_hermanos vale 2' },
          { t: 'expr', code: 'nota_final', igual: '4.5', msg: 'nota_final vale 4.5' },
          { t: 'expr', code: 'jugador1', igual: "'Sofi'", msg: 'jugador1 vale "Sofi"' },
          { t: 'salida', igual: '2\n4.5\nSofi', msg: 'Muestra las tres, en orden' },
        ],
      },
    ],
  },
  {
    id: 'pre-7',
    numero: 7,
    titulo: 'input(): preguntarle al usuario',
    emoji: '💬',
    minutos: 12,
    explicacion: [
      { t: 'p', texto: 'Punto 7. Hasta ahora tus programas siempre hacen lo mismo. Con `input()` pueden preguntarle algo a quien los usa.' },
      {
        t: 'p',
        texto:
          '`input("pregunta")` muestra la pregunta, espera a que la persona escriba y devuelve lo que escribió. Eso se guarda en una variable. Corre el ejemplo (aquí la respuesta ya viene escrita):',
      },
      { t: 'codigo', codigo: 'nombre = input("¿Cómo te llamas? ")\nprint("Hola", nombre)', entradas: ['Luna'] },
      {
        t: 'p',
        texto:
          'Lo importante: `input()` SIEMPRE devuelve un texto (str), aunque la persona escriba un número. Mira lo que pasa si escriben 5 y le sumamos "5":',
      },
      { t: 'codigo', codigo: 'n = input("Escribe un número: ")\nprint(n + n)\nprint(type(n))', entradas: ['5'] },
      {
        t: 'ojo',
        texto:
          'Salió `55`, no `10`: el 5 que escribieron es un texto, y los textos se pegan (como en la lección 2). `type(n)` lo confirma: dice `str`, que es texto. Para hacer cuentas hay que convertirlo, y eso lo vemos en la lección 9.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 7 del examen es de falso o verdadero, sobre lo que guarda `input()` cuando escriben un número. Acuérdate de lo que dijo `type(n)` en el ejemplo.',
      },
    ],
    retos: [
      {
        id: 'pre-7-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Pregunta el nombre con input() y después muestra:\n\nHola, (el nombre)\n\nSi escriben Tomás, sale: Hola, Tomás',
        inicial: '',
        entradas: ['Tomás'],
        pista: '`nombre = input("¿Cómo te llamas? ")` y después `print("Hola,", nombre)`.',
        solucion: 'nombre = input("¿Cómo te llamas? ")\nprint("Hola,", nombre)',
        pruebas: [
          { t: 'src', re: '\\binput\\s*\\(', msg: 'Usa input()' },
          { t: 'linea', n: -1, igual: 'Hola, Tomás', msg: 'Con Tomás, sale “Hola, Tomás”' },
          { t: 'linea', n: -1, igual: 'Hola, Vale', entradas: ['Vale'], msg: 'Con Vale, sale “Hola, Vale”' },
        ],
      },
      {
        id: 'pre-7-2',
        titulo: 'Texto que se pega',
        enunciado:
          'Pregunta un número con input() (sin convertirlo) y muestra lo que sale al sumarlo consigo mismo con +. Si escriben 3, sale 33: así ves con tus ojos que input() devuelve texto.',
        inicial: '',
        entradas: ['3'],
        pista: '`n = input("Número: ")` y después `print(n + n)`. Sin int().',
        solucion: 'n = input("Número: ")\nprint(n + n)',
        pruebas: [
          { t: 'src', re: '\\binput\\s*\\(', msg: 'Usa input()' },
          { t: 'src', re: '\\bint\\s*\\(', not: true, msg: 'No lo convierte (aquí queremos ver el texto)' },
          { t: 'linea', n: -1, igual: '33', msg: 'Con 3, sale 33' },
          { t: 'linea', n: -1, igual: '77', entradas: ['7'], msg: 'Con 7, sale 77' },
        ],
      },
      {
        id: 'pre-7-3',
        titulo: '¿De qué tipo es?',
        enunciado:
          'Pregunta la edad con input() y guárdala en la variable `edad`. Después muestra `type(edad)` para ver de qué tipo quedó.',
        inicial: '',
        entradas: ['12'],
        pista: '`edad = input("¿Cuántos años tienes? ")` y `print(type(edad))`.',
        solucion: 'edad = input("¿Cuántos años tienes? ")\nprint(type(edad))',
        pruebas: [
          { t: 'src', re: '\\binput\\s*\\(', msg: 'Usa input()' },
          { t: 'src', re: '\\btype\\s*\\(\\s*edad\\s*\\)', msg: 'Muestra type(edad)' },
          { t: 'expr', code: 'edad', igual: "'12'", msg: 'En edad queda el texto "12"' },
          { t: 'linea', n: -1, contiene: 'str', msg: 'Sale str: es un texto' },
        ],
      },
    ],
  },
  {
    id: 'pre-8',
    numero: 8,
    titulo: 'f-strings: variables dentro de una frase',
    emoji: '🧵',
    minutos: 12,
    explicacion: [
      { t: 'p', texto: 'Punto 8. Muchas veces quieres mostrar una frase con variables adentro. Para eso está el f-string.' },
      {
        t: 'p',
        texto:
          'Se escribe una `f` pegada antes de las comillas, y las variables van entre llaves `{ }` dentro de la frase. Python cambia cada `{variable}` por lo que tiene guardado.',
      },
      { t: 'codigo', codigo: 'nombre = "Sara"\nedad = 10\nprint(f"Me llamo {nombre} y tengo {edad} años")' },
      { t: 'p', texto: 'Adentro de las llaves también puede ir una cuenta:' },
      { t: 'codigo', codigo: 'precio = 2000\nprint(f"Tres panes cuestan {precio * 3} pesos")' },
      {
        t: 'ojo',
        texto:
          'Las variables van entre llaves `{ }`, no entre corchetes `[ ]`: `[nombre]` sale tal cual, con corchetes. Y no se te olvide la `f` antes de las comillas: sin la f, sale `{nombre}` escrito, en vez del nombre. Revisa que estén TODAS las variables que te piden.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 8 del examen te da dos variables ya escritas y te pide una frase con un f-string usando las dos. Revisa: la f, las llaves, las dos variables y la frase exacta.',
      },
    ],
    retos: [
      {
        id: 'pre-8-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Ya está escrita la variable `ciudad`. Con un f-string, muestra:\n\nVivo en Neiva',
        inicial: 'ciudad = "Neiva"\n',
        pista: '`print(f"Vivo en {ciudad}")`: la f pegada a las comillas y la variable entre llaves.',
        solucion: 'ciudad = "Neiva"\nprint(f"Vivo en {ciudad}")',
        pruebas: [
          { t: 'src', re: '\\bf["\']', msg: 'Usa un f-string' },
          { t: 'src', re: '\\{\\s*ciudad\\s*\\}', msg: 'Pone {ciudad} adentro' },
          { t: 'salida', igual: 'Vivo en Neiva', msg: 'Sale “Vivo en Neiva”' },
        ],
      },
      {
        id: 'pre-8-2',
        titulo: 'Ahora con dos variables',
        enunciado: 'Ya están escritas `mascota` y `patas`. Con un f-string que use las dos, muestra:\n\nMi gato tiene 4 patas',
        inicial: 'mascota = "gato"\npatas = 4\n',
        pista: '`print(f"Mi {mascota} tiene {patas} patas")`',
        solucion: 'mascota = "gato"\npatas = 4\nprint(f"Mi {mascota} tiene {patas} patas")',
        pruebas: [
          { t: 'src', re: '\\bf["\']', msg: 'Usa un f-string' },
          { t: 'src', re: '\\{\\s*mascota\\s*\\}', msg: 'Pone {mascota} adentro' },
          { t: 'src', re: '\\{\\s*patas\\s*\\}', msg: 'Pone {patas} adentro' },
          { t: 'salida', igual: 'Mi gato tiene 4 patas', msg: 'Sale la frase completa' },
        ],
      },
      {
        id: 'pre-8-3',
        titulo: 'Como en el examen',
        enunciado:
          'Ya están escritas las variables `equipo` y `goles`. Usando un f-string con esas dos variables, muestra:\n\nMi equipo es Millonarios y metió 3 goles',
        inicial: 'equipo = "Millonarios"\ngoles = 3\n',
        pista: 'La frase completa dentro de `print(f"…")`, con `{equipo}` y `{goles}` en su lugar.',
        solucion: 'equipo = "Millonarios"\ngoles = 3\nprint(f"Mi equipo es {equipo} y metió {goles} goles")',
        pruebas: [
          { t: 'src', re: '\\bf["\']', msg: 'Usa un f-string' },
          { t: 'src', re: '\\{\\s*equipo\\s*\\}', msg: 'Pone {equipo} adentro' },
          { t: 'src', re: '\\{\\s*goles\\s*\\}', msg: 'Pone {goles} adentro' },
          { t: 'salida', igual: 'Mi equipo es Millonarios y metió 3 goles', msg: 'Sale la frase completa' },
        ],
      },
    ],
  },
  {
    id: 'pre-9',
    numero: 9,
    titulo: 'int(input()): pedir números para hacer cuentas',
    emoji: '🔢',
    minutos: 14,
    explicacion: [
      {
        t: 'p',
        texto:
          'Punto 9. En la lección 7 viste que `input()` devuelve texto. Para hacer cuentas con lo que escriben, hay que convertirlo en número con `int()`.',
      },
      { t: 'p', texto: 'Se envuelve el input dentro del int: `int(input("…"))`. Así lo que escriben se vuelve un número entero.' },
      { t: 'codigo', codigo: 'n = int(input("Escribe un número: "))\nprint(n + n)', entradas: ['5'] },
      { t: 'p', texto: 'Ahora sí sale 10. Y con el número ya convertido se puede multiplicar, restar, lo que quieras:' },
      { t: 'codigo', codigo: 'n = int(input("Escribe un número: "))\nprint(n * 2)', entradas: ['8'] },
      {
        t: 'ojo',
        texto:
          'Tres errores que vimos en el examen: escribir la cuenta dentro del input (`input(7 * 3)`), olvidar el int (`input()` solo), y hacer la cuenta sin mostrarla (`n * 3` sin print: Python la calcula, pero no sale nada). Y se escribe `int`, no `in` ni `inout`.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 9 del examen pide un número con input() y mostrar una cuenta con él. Tres cosas: int(input()), la cuenta con la variable (no con el número del ejemplo) y el print.',
      },
    ],
    retos: [
      {
        id: 'pre-9-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Pide un número con input() y muestra ese número más 10. Si escriben 5, sale 15.',
        inicial: '',
        entradas: ['5'],
        pista: '`n = int(input("Número: "))` y después `print(n + 10)`.',
        solucion: 'n = int(input("Número: "))\nprint(n + 10)',
        pruebas: [
          { t: 'src', re: '\\binput\\s*\\(', msg: 'Usa input()' },
          { t: 'src', re: '\\bint\\s*\\(', msg: 'Convierte con int()' },
          { t: 'linea', n: -1, igual: '15', msg: 'Con 5, sale 15' },
          { t: 'linea', n: -1, igual: '30', entradas: ['20'], msg: 'Con 20, sale 30' },
        ],
      },
      {
        id: 'pre-9-2',
        titulo: 'Ahora el doble',
        enunciado: 'Pide un número con input() y muestra su doble. Si escriben 6, sale 12.',
        inicial: '',
        entradas: ['6'],
        pista: 'Convierte con int() y multiplica por 2 dentro del print.',
        solucion: 'n = int(input("Número: "))\nprint(n * 2)',
        pruebas: [
          { t: 'src', re: '\\binput\\s*\\(', msg: 'Usa input()' },
          { t: 'src', re: '\\bint\\s*\\(', msg: 'Convierte con int()' },
          { t: 'linea', n: -1, igual: '12', msg: 'Con 6, sale 12' },
          { t: 'linea', n: -1, igual: '50', entradas: ['25'], msg: 'Con 25, sale 50' },
        ],
      },
      {
        id: 'pre-9-3',
        titulo: 'Como en el examen',
        enunciado: 'Pide un número con input() y muestra su cuádruple (el número por 4). Si escriben 3, sale 12.',
        inicial: '',
        entradas: ['3'],
        pista: '`n = int(input("Escribe un número: "))` y después muestra `n * 4`.',
        solucion: 'n = int(input("Escribe un número: "))\nprint(n * 4)',
        pruebas: [
          { t: 'src', re: '\\binput\\s*\\(', msg: 'Usa input()' },
          { t: 'src', re: '\\bint\\s*\\(', msg: 'Convierte con int()' },
          { t: 'linea', n: -1, contiene: '12', msg: 'Con 3, sale 12' },
          { t: 'linea', n: -1, contiene: '40', entradas: ['10'], msg: 'Con 10, sale 40' },
        ],
      },
    ],
  },
  {
    id: 'pre-10',
    numero: 10,
    titulo: 'if, elif y else: leer decisiones',
    emoji: '🚦',
    minutos: 14,
    explicacion: [
      { t: 'p', texto: 'Punto 10. Con `if` el programa toma decisiones: hace algo solo si se cumple una condición.' },
      {
        t: 'p',
        texto:
          'Cuando hay varios casos, se encadenan: `if` (si…), `elif` (si no, pero si…) y `else` (si no se cumplió ninguno). Python revisa de arriba hacia abajo y se queda con el PRIMERO que se cumpla. Los demás ni los mira.',
      },
      {
        t: 'codigo',
        codigo:
          'puntos = 75\nif puntos >= 90:\n    print("Oro")\nelif puntos >= 60:\n    print("Plata")\nelif puntos >= 30:\n    print("Bronce")\nelse:\n    print("Sigue intentando")',
      },
      {
        t: 'p',
        texto:
          'Salió solo "Plata". Ojo: 75 también es mayor o igual que 30, pero como "Plata" ya se cumplió, Python ya no revisa el resto. Cambia el número en tu cabeza y adivina qué saldría con 95, con 40 y con 10.',
      },
      {
        t: 'ojo',
        texto:
          'De una cadena if/elif/else sale UNA sola cosa, nunca dos. Y los signos: `>=` es "mayor o igual", `>` es "mayor" (sin el igual), `<` "menor", `==` "igual".',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 10 del examen es de selección múltiple: te muestran un if/elif/else con una nota y tienes que decir qué sale. Revisa las condiciones de arriba hacia abajo y detente en la primera que se cumpla.',
      },
    ],
    retos: [
      {
        id: 'pre-10-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Crea la variable `edad` con 15. Si edad es mayor o igual a 13, muestra:\n\nPuede entrar',
        inicial: '',
        pista: '`edad = 15`, después `if edad >= 13:` y en el renglón de abajo, con 4 espacios, el print.',
        solucion: 'edad = 15\nif edad >= 13:\n    print("Puede entrar")',
        pruebas: [
          { t: 'expr', code: 'edad', igual: '15', msg: 'edad vale 15' },
          { t: 'src', re: '\\bif\\b', msg: 'Usa if' },
          { t: 'salida', igual: 'Puede entrar', msg: 'Sale “Puede entrar”' },
        ],
      },
      {
        id: 'pre-10-2',
        titulo: 'Ahora con tres casos',
        enunciado:
          'Ya está escrita la variable `puntos`. Muestra:\n\n• Oro si puntos es 90 o más\n• Plata si es 60 o más\n• Bronce en cualquier otro caso',
        inicial: 'puntos = 64\n',
        pista: '`if puntos >= 90:` … `elif puntos >= 60:` … `else:` … cada print con 4 espacios.',
        solucion: 'puntos = 64\nif puntos >= 90:\n    print("Oro")\nelif puntos >= 60:\n    print("Plata")\nelse:\n    print("Bronce")',
        pruebas: [
          { t: 'src', re: '\\belif\\b', msg: 'Usa elif' },
          { t: 'src', re: '\\belse\\s*:', msg: 'Usa else' },
          { t: 'salida', igual: 'Plata', msg: 'Con 64, sale solo “Plata”' },
        ],
      },
      {
        id: 'pre-10-3',
        titulo: 'Como en el examen',
        enunciado:
          'Ya está escrita la variable `nota`. Muestra:\n\n• Excelente si la nota es 4.5 o más\n• Bien si es 3.5 o más\n• Aprobó si es 3 o más\n• Perdió en otro caso\n\nCon 3.8 debe salir solo "Bien".',
        inicial: 'nota = 3.8\n',
        pista: 'Las condiciones van de la más alta a la más baja: `if nota >= 4.5:`, `elif nota >= 3.5:`, `elif nota >= 3:`, `else:`.',
        solucion:
          'nota = 3.8\nif nota >= 4.5:\n    print("Excelente")\nelif nota >= 3.5:\n    print("Bien")\nelif nota >= 3:\n    print("Aprobó")\nelse:\n    print("Perdió")',
        pruebas: [
          { t: 'src', re: '\\belif\\b', msg: 'Usa elif' },
          { t: 'src', re: '\\belse\\s*:', msg: 'Usa else' },
          { t: 'salida', igual: 'Bien', msg: 'Con 3.8, sale solo “Bien”' },
        ],
      },
    ],
  },
  {
    id: 'pre-11',
    numero: 11,
    titulo: 'if y else con input',
    emoji: '🗳️',
    minutos: 14,
    explicacion: [
      { t: 'p', texto: 'Punto 11. Ahora juntamos tres cosas: pedir un número con `int(input())`, decidir con `if` y responder con `print`.' },
      {
        t: 'p',
        texto:
          'La forma es siempre la misma: `if condición:` con dos puntos al final, y lo que va adentro con 4 espacios de sangría. Después `else:` al mismo nivel que el if, con su propio print adentro.',
      },
      {
        t: 'codigo',
        codigo: 'estatura = int(input("¿Cuánto mides en cm? "))\nif estatura >= 120:\n    print("Puedes subir a la montaña rusa")\nelse:\n    print("Todavía no puedes subir")',
        entradas: ['130'],
      },
      { t: 'codigo', codigo: 'estatura = int(input("¿Cuánto mides en cm? "))\nif estatura >= 120:\n    print("Puedes subir a la montaña rusa")\nelse:\n    print("Todavía no puedes subir")', entradas: ['110'] },
      {
        t: 'ojo',
        texto:
          'Errores del examen: el `if` con espacios de más al principio (el if va pegado a la izquierda, solo lo de ADENTRO lleva sangría), olvidar los dos puntos, y cambiar la frase: si piden "Puede votar", "Puedes votar" no sirve. Copia las frases exactas.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 11 del examen pide una edad con input() y dos frases distintas según la edad. Fíjate en el borde: "18 o más" incluye el 18, así que es `>=`. Y copia las dos frases letra por letra.',
      },
    ],
    retos: [
      {
        id: 'pre-11-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Pide un número con input(). Si es mayor que 100, muestra:\n\nEs grande\n\nSi no, muestra:\nEs pequeño',
        inicial: '',
        entradas: ['150'],
        pista: '`n = int(input("Número: "))`, después `if n > 100:` con su print, y `else:` con el otro.',
        solucion: 'n = int(input("Número: "))\nif n > 100:\n    print("Es grande")\nelse:\n    print("Es pequeño")',
        pruebas: [
          { t: 'src', re: '\\bif\\b', msg: 'Usa if' },
          { t: 'src', re: '\\belse\\s*:', msg: 'Usa else' },
          { t: 'linea', n: -1, igual: 'Es grande', msg: 'Con 150, sale “Es grande”' },
          { t: 'linea', n: -1, igual: 'Es pequeño', entradas: ['20'], msg: 'Con 20, sale “Es pequeño”' },
        ],
      },
      {
        id: 'pre-11-2',
        titulo: 'Ahora con el borde',
        enunciado:
          'Pide la estatura en centímetros con input(). Si es 120 o más, muestra:\nPuede subir\n\nSi no, muestra:\nNo puede subir\n\nOjo: con 120 justo, sí puede.',
        inicial: '',
        entradas: ['130'],
        pista: '"120 o más" se escribe `>= 120`. Con `>` el 120 quedaría por fuera.',
        solucion: 'estatura = int(input("Estatura: "))\nif estatura >= 120:\n    print("Puede subir")\nelse:\n    print("No puede subir")',
        pruebas: [
          { t: 'src', re: '\\bif\\b', msg: 'Usa if' },
          { t: 'src', re: '\\belse\\s*:', msg: 'Usa else' },
          { t: 'linea', n: -1, igual: 'Puede subir', msg: 'Con 130, sale “Puede subir”' },
          { t: 'linea', n: -1, igual: 'Puede subir', entradas: ['120'], msg: 'Con 120 justo, también puede' },
          { t: 'linea', n: -1, igual: 'No puede subir', entradas: ['100'], msg: 'Con 100, “No puede subir”' },
        ],
      },
      {
        id: 'pre-11-3',
        titulo: 'Como en el examen',
        enunciado:
          'Pregunta la nota (un número entero de 0 a 100) con input(). Si es 60 o más, muestra:\nGanó la materia\n\nSi no, muestra:\nPerdió la materia',
        inicial: '',
        entradas: ['80'],
        pista: 'Convierte con int(). `if nota >= 60:` con su print adentro (4 espacios), y `else:` con el otro print.',
        solucion: 'nota = int(input("Nota: "))\nif nota >= 60:\n    print("Ganó la materia")\nelse:\n    print("Perdió la materia")',
        pruebas: [
          { t: 'src', re: '\\bif\\b', msg: 'Usa if' },
          { t: 'src', re: '\\belse\\s*:', msg: 'Usa else' },
          { t: 'linea', n: -1, igual: 'Ganó la materia', msg: 'Con 80, sale “Ganó la materia”' },
          { t: 'linea', n: -1, igual: 'Ganó la materia', entradas: ['60'], msg: 'Con 60 justo, también gana' },
          { t: 'linea', n: -1, igual: 'Perdió la materia', entradas: ['45'], msg: 'Con 45, “Perdió la materia”' },
        ],
      },
    ],
  },
  {
    id: 'pre-12',
    numero: 12,
    titulo: 'Texto por un número',
    emoji: '✖️',
    minutos: 10,
    explicacion: [
      { t: 'p', texto: 'Punto 12. En la lección 2 viste que texto + texto pega. ¿Y texto por un número? Lo repite.' },
      { t: 'p', texto: '`"Ja" * 3` repite "Ja" tres veces, todo pegado: `JaJaJa`.' },
      { t: 'codigo', codigo: 'print("Ja" * 3)\nprint("-" * 10)\nprint("Go" + "l" * 5)' },
      {
        t: 'p',
        texto: 'Sirve para hacer líneas, risas, gritos de gol… Fíjate en el último: primero se repite la `l` cinco veces y después se pega al "Go".',
      },
      {
        t: 'ojo',
        texto:
          'Las repeticiones salen pegadas, sin espacios: `"Ja" * 3` da `JaJaJa`, no `Ja Ja Ja`. Si quieres espacios, tienen que estar dentro de las comillas: `"Ja " * 3`.',
      },
      {
        t: 'examen',
        texto: 'La pregunta 12 del examen es de falso o verdadero: un texto multiplicado por un número. Piensa: ¿cuántas veces se repite y cómo queda pegado?',
      },
    ],
    retos: [
      {
        id: 'pre-12-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Usando * con el texto "Ja", haz que salga:\n\nJaJaJaJa',
        inicial: '',
        pista: '`print("Ja" * 4)`',
        solucion: 'print("Ja" * 4)',
        pruebas: [
          { t: 'src', re: '\\*', msg: 'Usa *' },
          { t: 'src', re: 'JaJa', not: true, msg: 'No lo escribe repetido a mano' },
          { t: 'salida', igual: 'JaJaJaJa', msg: 'Sale JaJaJaJa' },
        ],
      },
      {
        id: 'pre-12-2',
        titulo: 'Una línea',
        enunciado: 'Usando * con el texto "=", haz una línea de 20 signos igual.',
        inicial: '',
        pista: '`print("=" * 20)`',
        solucion: 'print("=" * 20)',
        pruebas: [
          { t: 'src', re: '\\*', msg: 'Usa *' },
          { t: 'src', re: '===', not: true, msg: 'No escribe los signos a mano' },
          { t: 'salida', igual: '====================', msg: 'Salen 20 signos =' },
        ],
      },
      {
        id: 'pre-12-3',
        titulo: 'El grito de gol',
        enunciado: 'Pegando "G" + "o" repetida 6 veces + "l", haz que salga:\n\nGooooool',
        inicial: '',
        pista: '`print("G" + "o" * 6 + "l")`',
        solucion: 'print("G" + "o" * 6 + "l")',
        pruebas: [
          { t: 'src', re: '\\*', msg: 'Usa *' },
          { t: 'src', re: 'oo', not: true, msg: 'No escribe las o a mano' },
          { t: 'salida', igual: 'Gooooool', msg: 'Sale Gooooool' },
        ],
      },
    ],
  },
  {
    id: 'pre-13',
    numero: 13,
    titulo: 'Tres caminos y los bordes',
    emoji: '🌡️',
    minutos: 15,
    explicacion: [
      { t: 'p', texto: 'Punto 13. Ahora tú escribes un if/elif/else completo, con input, y cuidando los bordes.' },
      {
        t: 'p',
        texto:
          'Los bordes son los números justo donde cambia la respuesta. Si te dicen "entre 10 y 20, los dos incluidos", el 10 y el 20 cuentan. Por eso importa si usas `>` o `>=`.',
      },
      {
        t: 'codigo',
        codigo: 'v = int(input("Velocidad: "))\nif v > 80:\n    print("Muy rápido")\nelif v >= 40:\n    print("Bien")\nelse:\n    print("Muy lento")',
        entradas: ['80'],
      },
      {
        t: 'p',
        texto:
          'Con 80 sale "Bien", porque "Muy rápido" es MAYOR que 80 (`>`): el 80 no entra. Prueba en tu cabeza el 40 y el 39. Un truco: siempre revisa tu programa con los números del borde.',
      },
      {
        t: 'ojo',
        texto:
          'Los tres casos van alineados: `if`, `elif` y `else` pegados a la izquierda, y cada print con 4 espacios. Si el else queda corrido, Python se queja. Y cada uno termina en dos puntos.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 13 del examen pide una temperatura con input() y tres respuestas distintas. Las pruebas usan los números del borde: revisa con cuidado si cada borde va con > o con >=.',
      },
    ],
    retos: [
      {
        id: 'pre-13-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Pide un número con input().\n\n• Si es mayor que 0: Positivo\n• Si es 0: Cero\n• Si es menor que 0: Negativo',
        inicial: '',
        entradas: ['5'],
        pista: '`if n > 0:` … `elif n == 0:` … `else:` … (igual se escribe con dos signos =).',
        solucion: 'n = int(input("Número: "))\nif n > 0:\n    print("Positivo")\nelif n == 0:\n    print("Cero")\nelse:\n    print("Negativo")',
        pruebas: [
          { t: 'src', re: '\\belif\\b', msg: 'Usa elif' },
          { t: 'linea', n: -1, igual: 'Positivo', msg: 'Con 5, “Positivo”' },
          { t: 'linea', n: -1, igual: 'Cero', entradas: ['0'], msg: 'Con 0, “Cero”' },
          { t: 'linea', n: -1, igual: 'Negativo', entradas: ['-3'], msg: 'Con -3, “Negativo”' },
        ],
      },
      {
        id: 'pre-13-2',
        titulo: 'Ahora con bordes',
        enunciado:
          'Pide la edad con input().\n\n• Si es menor que 12: Niño\n• Si está entre 12 y 17 (los dos incluidos): Adolescente\n• Si es 18 o más: Adulto',
        inicial: '',
        entradas: ['8'],
        pista: '`if edad < 12:` … `elif edad <= 17:` … `else:` …',
        solucion: 'edad = int(input("Edad: "))\nif edad < 12:\n    print("Niño")\nelif edad <= 17:\n    print("Adolescente")\nelse:\n    print("Adulto")',
        pruebas: [
          { t: 'src', re: '\\belif\\b', msg: 'Usa elif' },
          { t: 'linea', n: -1, igual: 'Niño', msg: 'Con 8, “Niño”' },
          { t: 'linea', n: -1, igual: 'Adolescente', entradas: ['12'], msg: 'Con 12 justo, “Adolescente”' },
          { t: 'linea', n: -1, igual: 'Adolescente', entradas: ['17'], msg: 'Con 17 justo, “Adolescente”' },
          { t: 'linea', n: -1, igual: 'Adulto', entradas: ['18'], msg: 'Con 18, “Adulto”' },
        ],
      },
      {
        id: 'pre-13-3',
        titulo: 'Como en el examen',
        enunciado:
          'Pregunta cuántos minutos duró la tarea (un número entero) con input().\n\n• Si es mayor que 60: Muy larga\n• Si está entre 20 y 60 (los dos incluidos): Normal\n• Si es menor que 20: Rapidita',
        inicial: '',
        entradas: ['90'],
        pista: 'Tres casos: `if m > 60:` … `elif m >= 20:` … `else:` … Con 60 y con 20 debe salir "Normal".',
        solucion: 'm = int(input("Minutos: "))\nif m > 60:\n    print("Muy larga")\nelif m >= 20:\n    print("Normal")\nelse:\n    print("Rapidita")',
        pruebas: [
          { t: 'src', re: '\\belif\\b', msg: 'Usa elif' },
          { t: 'linea', n: -1, igual: 'Muy larga', msg: 'Con 90, “Muy larga”' },
          { t: 'linea', n: -1, igual: 'Normal', entradas: ['60'], msg: 'Con 60 justo, “Normal”' },
          { t: 'linea', n: -1, igual: 'Normal', entradas: ['20'], msg: 'Con 20 justo, “Normal”' },
          { t: 'linea', n: -1, igual: 'Rapidita', entradas: ['5'], msg: 'Con 5, “Rapidita”' },
        ],
      },
    ],
  },
  {
    id: 'pre-14',
    numero: 14,
    titulo: 'for y range: contar',
    emoji: '🔁',
    minutos: 12,
    explicacion: [
      { t: 'p', texto: 'Punto 14. El `for` repite algo varias veces. Con `range` le dices qué números recorrer.' },
      {
        t: 'p',
        texto:
          '`range(1, 5)` va desde el 1 hasta ANTES del 5: 1, 2, 3, 4. El primer número entra; el segundo no. Con un solo número, `range(4)`, empieza en 0: 0, 1, 2, 3.',
      },
      { t: 'codigo', codigo: 'for i in range(1, 5):\n    print(i)' },
      { t: 'codigo', codigo: 'for i in range(4):\n    print(i)' },
      {
        t: 'ojo',
        texto:
          'El último número de range NUNCA sale. `range(1, 5)` no muestra el 5. Y el for se escribe completo: `for i in range(…):` — con `in` y con los dos puntos. `for i range(1, 11)` sin el `in` es un error que vimos varias veces.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 14 del examen es de selección múltiple: un for con range y tienes que escoger qué números salen. Pregúntate: ¿dónde empieza? ¿y cuál es el último que SÍ sale?',
      },
    ],
    retos: [
      {
        id: 'pre-14-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Con un for y range, muestra los números del 1 al 5, uno por renglón.',
        inicial: '',
        pista: 'Para que salga el 5, el range tiene que llegar hasta el 6: `for i in range(1, 6):` y adentro `print(i)`.',
        solucion: 'for i in range(1, 6):\n    print(i)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\brange\\s*\\(', msg: 'Usa range' },
          { t: 'salida', igual: '1\n2\n3\n4\n5', msg: 'Salen del 1 al 5' },
        ],
      },
      {
        id: 'pre-14-2',
        titulo: 'Desde el cero',
        enunciado: 'Con un for y range con UN solo número, muestra 0, 1, 2, uno por renglón.',
        inicial: '',
        pista: '`range(3)` da 0, 1 y 2.',
        solucion: 'for i in range(3):\n    print(i)',
        pruebas: [
          { t: 'src', re: '\\brange\\s*\\(\\s*\\d+\\s*\\)', msg: 'Usa range con un solo número' },
          { t: 'salida', igual: '0\n1\n2', msg: 'Salen 0, 1 y 2' },
        ],
      },
      {
        id: 'pre-14-3',
        titulo: 'Repetir una frase',
        enunciado: 'Con un for y range, muestra la frase "Voy a pasar el examen" 3 veces, cada una en su renglón.',
        inicial: '',
        pista: 'El print va adentro del for, con 4 espacios. `for i in range(3):`',
        solucion: 'for i in range(3):\n    print("Voy a pasar el examen")',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'salida', contiene: 'Voy a pasar el examen', veces: 3, msg: 'La frase sale 3 veces' },
        ],
      },
    ],
  },
  {
    id: 'pre-15',
    numero: 15,
    titulo: 'range de a saltos',
    emoji: '🦘',
    minutos: 12,
    explicacion: [
      { t: 'p', texto: 'Punto 15. range puede recibir un tercer número: de cuánto en cuánto salta.' },
      { t: 'p', texto: '`range(inicio, fin, salto)`. Por ejemplo `range(0, 20, 5)` da 0, 5, 10, 15. El fin, como siempre, no entra.' },
      { t: 'codigo', codigo: 'for i in range(0, 20, 5):\n    print(i)' },
      { t: 'p', texto: 'Si quieres que el último número sí salga, el fin tiene que pasarse un poquito: para llegar hasta el 20, pon 21.' },
      { t: 'codigo', codigo: 'for i in range(5, 21, 5):\n    print(i)' },
      {
        t: 'ojo',
        texto:
          'Revisa dónde empieza y dónde termina: si piden "del 3 al 30", el primero que sale es 3 y el último 30. Y el print va con sangría, adentro del for, para que salga un número por renglón.',
      },
      {
        t: 'examen',
        texto:
          'La pregunta 15 del examen pide mostrar con for y range una serie de números que van de a saltos, uno por renglón. Piensa en los tres números del range: inicio, fin (que no entra) y salto.',
      },
    ],
    retos: [
      {
        id: 'pre-15-1',
        titulo: 'Inténtalo tú',
        enunciado: 'Con un for y range, muestra 0, 10, 20, 30, 40, uno por renglón.',
        inicial: '',
        pista: '`for i in range(0, 50, 10):`',
        solucion: 'for i in range(0, 50, 10):\n    print(i)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\brange\\s*\\(', msg: 'Usa range' },
          { t: 'salida', igual: '0\n10\n20\n30\n40', msg: 'Salen 0, 10, 20, 30 y 40' },
        ],
      },
      {
        id: 'pre-15-2',
        titulo: 'Los impares',
        enunciado: 'Con un for y range, muestra los números impares del 1 al 9, uno por renglón.',
        inicial: '',
        pista: 'Empieza en 1, salta de 2 en 2, y para llegar al 9 el fin es 10: `range(1, 10, 2)`.',
        solucion: 'for i in range(1, 10, 2):\n    print(i)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\brange\\s*\\(', msg: 'Usa range' },
          { t: 'salida', igual: '1\n3\n5\n7\n9', msg: 'Salen 1, 3, 5, 7 y 9' },
        ],
      },
      {
        id: 'pre-15-3',
        titulo: 'Como en el examen',
        enunciado: 'Con un for y range, muestra los múltiplos de 3, del 3 al 30, uno por renglón.',
        inicial: '',
        pista: 'Empieza en 3, salta de 3 en 3, y el fin tiene que pasarse del 30: `range(3, 31, 3)`.',
        solucion: 'for i in range(3, 31, 3):\n    print(i)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\brange\\s*\\(', msg: 'Usa range' },
          { t: 'linea', n: 0, igual: '3', msg: 'Empieza en 3' },
          { t: 'linea', n: -1, igual: '30', msg: 'Termina en 30' },
          { t: 'salida', igual: '3\n6\n9\n12\n15\n18\n21\n24\n27\n30', msg: 'Salen todos, uno por renglón' },
        ],
      },
    ],
  },
]

export const PRACTICAS_2: Practica[] = [
  {
    id: 'practica-2',
    numero: 2,
    despuesDe: 10,
    titulo: 'Práctica de los puntos 6 a 10',
    preguntas: [
      {
        tipo: 'opcion',
        leccion: 6,
        id: 'pre-p2-1',
        titulo: 'Nombres de variables',
        enunciado: '¿Cuál de estos nombres de variable sí funciona en Python?',
        opciones: [
          { texto: 'total_puntos', puntos: 5 },
          { texto: 'total puntos', puntos: 0 },
          { texto: '1total', puntos: 0 },
          { texto: 'total-puntos', puntos: 0 },
        ],
      },
      {
        tipo: 'vf',
        leccion: 7,
        id: 'pre-p2-2',
        titulo: 'Lo que devuelve input',
        codigo: 'goles = input("¿Cuántos goles metiste? ")',
        afirmacion: 'Si escriben 3, en goles queda guardado el número 3 (int), listo para hacer cuentas.',
        verdadero: false,
      },
      {
        tipo: 'codigo',
        leccion: 8,
        id: 'pre-p2-3',
        titulo: 'La mascota',
        enunciado:
          'Ya están escritas las variables `perro` y `meses`. Usando un f-string con esas dos variables, muestra:\n\nMi perro Toby tiene 8 meses',
        inicial: 'perro = "Toby"\nmeses = 8\n',
        pista: '',
        pistas: [
          'Un f-string lleva una f pegada antes de las comillas, y las variables van entre llaves { }.',
          'print(f"Mi perro {perro} tiene … meses"): completa lo que falta con la otra variable.',
        ],
        solucion: 'perro = "Toby"\nmeses = 8\nprint(f"Mi perro {perro} tiene {meses} meses")',
        pruebas: [
          { t: 'src', re: '\\bf["\']', msg: 'Usa un f-string' },
          { t: 'src', re: '\\{\\s*perro\\s*\\}', msg: 'Pone {perro} adentro' },
          { t: 'src', re: '\\{\\s*meses\\s*\\}', msg: 'Pone {meses} adentro' },
          { t: 'salida', igual: 'Mi perro Toby tiene 8 meses', msg: 'Sale la frase completa' },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 9,
        id: 'pre-p2-4',
        titulo: 'El quíntuple',
        enunciado: 'Pide un número con input() y muestra ese número por 5. Si escriben 4, sale 20.',
        inicial: '',
        entradas: ['4'],
        pista: '',
        pistas: ['input() devuelve texto: conviértelo a número con int() antes de multiplicar.', 'n = int(input("Escribe un número: ")) y después muestra n * 5.'],
        solucion: 'n = int(input("Escribe un número: "))\nprint(n * 5)',
        pruebas: [
          { t: 'src', re: '\\binput\\s*\\(', msg: 'Usa input()' },
          { t: 'src', re: '\\bint\\s*\\(', msg: 'Convierte con int()' },
          { t: 'linea', n: -1, contiene: '20', msg: 'Con 4, sale 20' },
          { t: 'linea', n: -1, contiene: '35', entradas: ['7'], msg: 'Con 7, sale 35' },
        ],
      },
      {
        tipo: 'opcion',
        leccion: 10,
        id: 'pre-p2-5',
        titulo: 'La medalla',
        enunciado: '¿Qué muestra este programa?',
        codigo: 'puntos = 55\nif puntos >= 80:\n    print("Oro")\nelif puntos >= 50:\n    print("Plata")\nelif puntos >= 20:\n    print("Bronce")\nelse:\n    print("Sin medalla")',
        opciones: [
          { texto: 'Plata', puntos: 5 },
          { texto: 'Plata y después Bronce', puntos: 2 },
          { texto: 'Bronce', puntos: 0 },
          { texto: 'Oro', puntos: 0 },
        ],
      },
    ],
  },
  {
    id: 'practica-3',
    numero: 3,
    despuesDe: 15,
    titulo: 'Práctica de los puntos 11 a 15',
    preguntas: [
      {
        tipo: 'codigo',
        leccion: 11,
        id: 'pre-p3-1',
        titulo: '¿Puede manejar?',
        enunciado:
          'Pregunta la edad con input(). Si tiene 16 años o más, muestra:\nPuede sacar el pase\n\nSi no, muestra:\nTodavía no puede manejar',
        inicial: '',
        entradas: ['17'],
        pista: '',
        pistas: ['Convierte la edad con int(). “Mayor o igual” se escribe >=.', 'if edad >= 16: con su print adentro (4 espacios de sangría), y else: con el otro print.'],
        solucion: 'edad = int(input("¿Cuántos años tienes? "))\nif edad >= 16:\n    print("Puede sacar el pase")\nelse:\n    print("Todavía no puede manejar")',
        pruebas: [
          { t: 'src', re: '\\bif\\b', msg: 'Usa if' },
          { t: 'src', re: '\\belse\\s*:', msg: 'Usa else' },
          { t: 'linea', n: -1, igual: 'Puede sacar el pase', msg: 'Con 17, sale “Puede sacar el pase”' },
          { t: 'linea', n: -1, igual: 'Puede sacar el pase', entradas: ['16'], msg: 'Con 16 justo, también puede' },
          { t: 'linea', n: -1, igual: 'Todavía no puede manejar', entradas: ['11'], msg: 'Con 11, “Todavía no puede manejar”' },
        ],
      },
      {
        tipo: 'vf',
        leccion: 12,
        id: 'pre-p3-2',
        titulo: 'Texto por un número',
        codigo: 'print("Bu" * 4)',
        afirmacion: 'Este programa muestra Bu Bu Bu Bu, con espacios entre cada uno.',
        verdadero: false,
      },
      {
        tipo: 'codigo',
        leccion: 13,
        id: 'pre-p3-3',
        titulo: 'La batería',
        enunciado:
          'Pregunta cuánta batería le queda al celular (un número entero) con input().\n\n• Si es mayor que 70: Bien cargado\n• Si está entre 20 y 70 (los dos incluidos): Más o menos\n• Si es menor que 20: Cárgalo ya',
        inicial: '',
        entradas: ['90'],
        pista: '',
        pistas: ['Son tres casos: if, elif y else. Ojo con los bordes: con 70 y con 20 es “Más o menos”.', 'if b > 70: … elif b >= 20: … else: … (cada print con sangría).'],
        solucion: 'b = int(input("Batería: "))\nif b > 70:\n    print("Bien cargado")\nelif b >= 20:\n    print("Más o menos")\nelse:\n    print("Cárgalo ya")',
        pruebas: [
          { t: 'src', re: '\\belif\\b', msg: 'Usa elif' },
          { t: 'linea', n: -1, igual: 'Bien cargado', msg: 'Con 90, “Bien cargado”' },
          { t: 'linea', n: -1, igual: 'Más o menos', entradas: ['70'], msg: 'Con 70 justo, “Más o menos”' },
          { t: 'linea', n: -1, igual: 'Más o menos', entradas: ['20'], msg: 'Con 20 justo, “Más o menos”' },
          { t: 'linea', n: -1, igual: 'Cárgalo ya', entradas: ['8'], msg: 'Con 8, “Cárgalo ya”' },
        ],
      },
      {
        tipo: 'opcion',
        leccion: 14,
        id: 'pre-p3-4',
        titulo: 'Contando con range',
        enunciado: '¿Qué números muestra este programa?',
        codigo: 'for i in range(3, 7):\n    print(i)',
        opciones: [
          { texto: '3, 4, 5, 6', puntos: 5 },
          { texto: '3, 4, 5, 6, 7', puntos: 2 },
          { texto: '0, 1, 2, 3, 4, 5, 6', puntos: 1 },
          { texto: 'Solo el 3 y el 7', puntos: 0 },
        ],
      },
      {
        tipo: 'codigo',
        leccion: 15,
        id: 'pre-p3-5',
        titulo: 'De cinco en cinco',
        enunciado: 'Con un for y range, muestra los múltiplos de 5 del 5 al 50, uno por renglón.',
        inicial: '',
        pista: '',
        pistas: [
          'range puede recibir tres números: dónde empieza, dónde para (sin incluirlo) y de cuánto en cuánto salta.',
          'for i in range(5, 51, 5): y adentro print(i).',
        ],
        solucion: 'for i in range(5, 51, 5):\n    print(i)',
        pruebas: [
          { t: 'src', re: '\\bfor\\b', msg: 'Usa for' },
          { t: 'src', re: '\\brange\\s*\\(', msg: 'Usa range' },
          { t: 'linea', n: 0, igual: '5', msg: 'Empieza en 5' },
          { t: 'linea', n: -1, igual: '50', msg: 'Termina en 50' },
          { t: 'salida', igual: '5\n10\n15\n20\n25\n30\n35\n40\n45\n50', msg: 'Salen todos, uno por renglón' },
        ],
      },
    ],
  },
]
