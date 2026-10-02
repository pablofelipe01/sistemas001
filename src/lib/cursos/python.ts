import type { Curso, Leccion } from './tipos'

/*
 * El curso de Python: 10 lecciones de 5 retos, para unas 4 horas de clase.
 *
 * Es para niños que ya pasaron por HTML, CSS y JavaScript y ven Python por
 * primera vez. Por eso cada lección, cuando se puede, pone lado a lado cómo se
 * hacía en JavaScript y cómo se hace en Python: lo nuevo se cuelga de lo que ya
 * saben.
 *
 * Cada reto tiene su solución de referencia. /verificar-curso las corre todas
 * contra sus pruebas: si se cambia un reto, abrir esa página.
 */

const L1: Leccion = {
  id: 'py-1',
  numero: 1,
  titulo: '¡Hola, Python!',
  emoji: '👋',
  minutos: 20,
  explicacion: [
    {
      t: 'p',
      texto:
        'Python es uno de los lenguajes más usados del mundo: con él se hace inteligencia artificial, se controlan robots y se analizan los datos de la NASA. Y es de los más fáciles de leer.',
    },
    {
      t: 'p',
      texto:
        'En JavaScript, para mostrar algo usabas `console.log`. En Python se usa `print`. Y fíjate: no hace falta el punto y coma.',
    },
    { t: 'compara', js: 'console.log("Hola");', py: 'print("Hola")' },
    {
      t: 'p',
      texto:
        'Cada `print` escribe un renglón. Lo que va entre comillas es texto y sale tal cual. Si escribes `print()` sin nada, sale un renglón vacío. Lo que va después de un `#` es un comentario: Python no lo lee, es una nota para las personas.',
    },
    { t: 'codigo', codigo: '# Esto es un comentario\nprint("Hola")\nprint()\nprint("Soy Python")' },
    {
      t: 'ojo',
      texto:
        'Python distingue mayúsculas: `Print` no existe, es `print`. Y las comillas tienen que abrir y cerrar: `print("Hola)` se rompe.',
    },
  ],
  retos: [
    {
      id: 'py-1-1',
      titulo: 'Tu primer print',
      enunciado: 'Haz que Python escriba exactamente esto: Hola, Python',
      inicial: '# Escribe tu primer print aquí abajo\n',
      pista: 'Es print, paréntesis, y adentro el texto entre comillas: print("…")',
      solucion: 'print("Hola, Python")',
      pruebas: [
        { t: 'src', re: '\\bprint\\s*\\(', msg: 'Usas print( … )' },
        { t: 'salida', igual: 'Hola, Python', msg: 'Sale “Hola, Python”, con la coma' },
      ],
    },
    {
      id: 'py-1-2',
      titulo: 'Uno, dos, tres',
      enunciado: 'Escribe tres renglones: Uno, Dos y Tres. Cada uno con su propio print.',
      inicial: '',
      pista: 'Tres print, uno debajo del otro. Cada print hace su propio renglón.',
      solucion: 'print("Uno")\nprint("Dos")\nprint("Tres")',
      pruebas: [
        { t: 'src', re: '\\bprint\\s*\\(', min: 3, msg: 'Usas tres print' },
        { t: 'salida', igual: 'Uno\nDos\nTres', msg: 'Salen Uno, Dos y Tres, cada uno en su renglón' },
      ],
    },
    {
      id: 'py-1-3',
      titulo: 'Una nota para humanos',
      enunciado:
        'Escribe un comentario (con #) que diga qué hace tu programa. Debajo, un print que escriba: Python está listo',
      inicial: '',
      pista: 'El comentario empieza con # y Python se lo salta. Ejemplo: # Este programa saluda',
      solucion: '# Este programa avisa que Python arrancó\nprint("Python está listo")',
      pruebas: [
        { t: 'src', re: '#', crudo: true, msg: 'Hay un comentario con #' },
        { t: 'salida', igual: 'Python está listo', msg: 'Sale “Python está listo”' },
      ],
    },
    {
      id: 'py-1-4',
      titulo: 'Un renglón de aire',
      enunciado: 'Escribe Arriba, después un renglón vacío y después Abajo.',
      inicial: 'print("Arriba")\n',
      pista: 'Un print() sin nada adentro escribe un renglón vacío.',
      solucion: 'print("Arriba")\nprint()\nprint("Abajo")',
      pruebas: [{ t: 'salida', igual: 'Arriba\n\nAbajo', msg: 'Arriba, un renglón vacío, Abajo' }],
    },
    {
      id: 'py-1-5',
      titulo: 'El arbolito',
      enunciado:
        'Dibuja este arbolito con cuatro print. Ojo con los espacios del principio: la punta lleva 2 espacios, el segundo renglón 1, el tercero ninguno y el tronco 2.\n\n  *\n ***\n*****\n  |',
      inicial: 'print("  *")\n',
      pista: 'Los espacios también van dentro de las comillas. El tercer renglón son cinco asteriscos pegados.',
      solucion: 'print("  *")\nprint(" ***")\nprint("*****")\nprint("  |")',
      pruebas: [
        { t: 'linea', n: 0, igual: '*', msg: 'Arriba va la punta: *' },
        { t: 'salida', igual: '  *\n ***\n*****\n  |', exacto: true, msg: 'El arbolito queda igualito, con sus espacios' },
      ],
    },
  ],
}

const L2: Leccion = {
  id: 'py-2',
  numero: 2,
  titulo: 'La compu calculadora',
  emoji: '🧮',
  minutos: 20,
  explicacion: [
    {
      t: 'p',
      texto:
        'Si a `print` le das una cuenta sin comillas, Python la hace y te muestra el resultado. Con comillas, es solo texto: `print("2 + 3")` escribe 2 + 3, no 5.',
    },
    { t: 'codigo', codigo: 'print(2 + 3)\nprint("2 + 3")\nprint(10 - 4)\nprint(6 * 7)' },
    {
      t: 'p',
      texto:
        'Los signos: `+` suma, `-` resta, `*` multiplica, `/` divide. Y tres que en JavaScript no tenías así: `**` es potencia, `//` es la división entera (sin decimales) y `%` es lo que sobra de la división.',
    },
    { t: 'codigo', codigo: 'print(10 / 3)\nprint(10 // 3)\nprint(10 % 3)\nprint(2 ** 3)' },
    {
      t: 'p',
      texto:
        'En un mismo `print` puedes poner varias cosas separadas por comas. Python les pone un espacio en medio.',
    },
    { t: 'codigo', codigo: 'print("Tengo", 5 + 8, "años")' },
    {
      t: 'ojo',
      texto:
        'La división `/` siempre da con decimal: `10 / 2` da 5.0. Si quieres el número entero, usa `//`. Y como en las matemáticas del colegio, primero se hacen las multiplicaciones: usa paréntesis para cambiar el orden.',
    },
  ],
  retos: [
    {
      id: 'py-2-1',
      titulo: 'Que la compu sume',
      enunciado: 'Muestra el resultado de 125 + 378. No hagas la cuenta tú: escríbela y deja que Python la haga.',
      inicial: '',
      pista: 'print(125 + 378), sin comillas.',
      solucion: 'print(125 + 378)',
      pruebas: [
        { t: 'src', re: '125\\s*\\+\\s*378', msg: 'Escribiste la cuenta 125 + 378' },
        { t: 'src', re: '503', not: true, msg: 'No escribiste el resultado a mano' },
        { t: 'salida', igual: '503', msg: 'Sale 503' },
      ],
    },
    {
      id: 'py-2-2',
      titulo: 'Los minutos de un día',
      enunciado: 'Un día tiene 24 horas y cada hora 60 minutos. Muestra cuántos minutos tiene un día, con una multiplicación.',
      inicial: '',
      pista: 'Multiplicar en Python es con asterisco: *',
      solucion: 'print(24 * 60)',
      pruebas: [
        { t: 'src', re: '\\*', msg: 'Usas * para multiplicar' },
        { t: 'src', re: '1440', not: true, msg: 'No escribiste el resultado a mano' },
        { t: 'salida', igual: '1440', msg: 'Sale 1440' },
      ],
    },
    {
      id: 'py-2-3',
      titulo: 'Repartir dulces',
      enunciado:
        'Hay 47 dulces para repartir entre 5 amigos, todos con la misma cantidad. En un renglón muestra cuántos le tocan a cada uno y en otro cuántos sobran.',
      inicial: '# Cuántos le tocan a cada uno\n\n# Cuántos sobran\n',
      pista: '// da la división sin decimales y % da lo que sobra. 47 // 5 y 47 % 5.',
      solucion: 'print(47 // 5)\nprint(47 % 5)',
      pruebas: [
        { t: 'src', re: '//', msg: 'Usas // para repartir' },
        { t: 'src', re: '%', msg: 'Usas % para lo que sobra' },
        { t: 'salida', igual: '9\n2', msg: 'Salen 9 y 2, cada uno en su renglón' },
      ],
    },
    {
      id: 'py-2-4',
      titulo: 'La potencia',
      enunciado: 'Muestra cuánto es 2 elevado a la 10, usando la potencia de Python.',
      inicial: '',
      pista: 'La potencia son dos asteriscos seguidos: 2 ** 10',
      solucion: 'print(2 ** 10)',
      pruebas: [
        { t: 'src', re: '\\*\\*', msg: 'Usas ** para la potencia' },
        { t: 'salida', igual: '1024', msg: 'Sale 1024' },
      ],
    },
    {
      id: 'py-2-5',
      titulo: 'Las horas de un año',
      enunciado:
        'Con un solo print, y separando con comas, muestra: Un año tiene 8760 horas. El 8760 lo calcula Python con 365 * 24.',
      inicial: 'print("Un año tiene", )\n',
      pista: 'print("Un año tiene", 365 * 24, "horas"). Las comas separan las partes y Python les pone espacio.',
      solucion: 'print("Un año tiene", 365 * 24, "horas")',
      pruebas: [
        { t: 'src', re: '365\\s*\\*\\s*24|24\\s*\\*\\s*365', msg: 'La cuenta 365 * 24 está en tu código' },
        { t: 'src', re: '8760', not: true, msg: 'No escribiste el 8760 a mano' },
        { t: 'salida', igual: 'Un año tiene 8760 horas', msg: 'Sale “Un año tiene 8760 horas”' },
      ],
    },
  ],
}

const L3: Leccion = {
  id: 'py-3',
  numero: 3,
  titulo: 'Cajitas con nombre',
  emoji: '📦',
  minutos: 20,
  explicacion: [
    {
      t: 'p',
      texto:
        'Una variable es una cajita con nombre donde guardas un dato. En JavaScript usabas `let`. En Python no hace falta: escribes el nombre, un igual y el valor.',
    },
    { t: 'compara', js: 'let edad = 13;\nconsole.log(edad);', py: 'edad = 13\nprint(edad)' },
    {
      t: 'p',
      texto:
        'Los nombres van en minúscula y, si son varias palabras, unidas con guion bajo: `mi_nombre`, `puntos_totales`. No pueden tener espacios ni empezar con un número.',
    },
    {
      t: 'p',
      texto:
        'Una variable puede cambiar. `puntos = puntos + 10` toma lo que había, le suma 10 y lo vuelve a guardar. Hay una forma corta: `puntos += 10`.',
    },
    { t: 'codigo', codigo: 'puntos = 0\npuntos = puntos + 10\npuntos += 5\nprint("Tengo", puntos, "puntos")' },
    {
      t: 'ojo',
      texto:
        '`print(edad)` muestra lo que hay en la cajita (13). `print("edad")`, con comillas, muestra la palabra edad. Y si escribes un nombre que no existe, Python te dice NameError.',
    },
  ],
  retos: [
    {
      id: 'py-3-1',
      titulo: 'Tu mascota',
      enunciado:
        'Crea una variable llamada mascota y guárdale el nombre de una mascota (la tuya o una inventada), entre comillas. Después muéstrala con print.',
      inicial: '',
      pista: 'mascota = "Firulais" y en el siguiente renglón print(mascota), sin comillas en el print.',
      solucion: 'mascota = "Firulais"\nprint(mascota)',
      pruebas: [
        { t: 'expr', code: "isinstance(mascota, str) and mascota.strip() != ''", igual: 'True', msg: 'Existe la variable mascota y tiene un nombre adentro' },
        { t: 'src', re: 'print\\s*\\(\\s*mascota\\s*\\)', msg: 'Haces print(mascota), sin comillas' },
        { t: 'expr', code: 'mascota in __salida__', igual: 'True', msg: 'Se ve el nombre de la mascota' },
      ],
    },
    {
      id: 'py-3-2',
      titulo: 'El área del rectángulo',
      enunciado:
        'Crea base con 8 y altura con 5. Después crea area, que sea base por altura (con las variables, no con los números). Muestra area.',
      inicial: 'base = 8\n',
      pista: 'area = base * altura. Así, si cambias la base, el área se recalcula sola.',
      solucion: 'base = 8\naltura = 5\narea = base * altura\nprint(area)',
      pruebas: [
        { t: 'expr', code: 'base', igual: '8', msg: 'base vale 8' },
        { t: 'expr', code: 'altura', igual: '5', msg: 'altura vale 5' },
        { t: 'src', re: 'area\\s*=\\s*(base\\s*\\*\\s*altura|altura\\s*\\*\\s*base)', msg: 'area = base * altura' },
        { t: 'salida', igual: '40', msg: 'Sale 40' },
      ],
    },
    {
      id: 'py-3-3',
      titulo: 'Los puntos del juego',
      enunciado:
        'Empieza con puntos = 0. Súmale 10, después súmale 25 y después réstale 5, siempre cambiando la misma variable. Al final muestra puntos.',
      inicial: 'puntos = 0\n',
      pista: 'puntos += 10 suma. Para restar: puntos -= 5.',
      solucion: 'puntos = 0\npuntos += 10\npuntos += 25\npuntos -= 5\nprint(puntos)',
      pruebas: [
        { t: 'src', re: 'puntos\\s*(\\+=|=\\s*puntos\\s*\\+)', min: 2, msg: 'Le sumas dos veces a puntos' },
        { t: 'src', re: 'puntos\\s*(-=|=\\s*puntos\\s*-)', msg: 'Le restas a puntos' },
        { t: 'src', re: '\\b30\\b', not: true, msg: 'No escribiste el 30 a mano' },
        { t: 'salida', igual: '30', msg: 'Sale 30' },
      ],
    },
    {
      id: 'py-3-4',
      titulo: '¿Cuántos años tienes?',
      enunciado:
        'Crea anio_nacimiento = 2013 y anio_actual = 2026. Calcula edad restando las dos variables y muestra: Tengo 13 años (con print y comas).',
      inicial: 'anio_nacimiento = 2013\nanio_actual = 2026\n',
      pista: 'edad = anio_actual - anio_nacimiento y luego print("Tengo", edad, "años")',
      solucion: 'anio_nacimiento = 2013\nanio_actual = 2026\nedad = anio_actual - anio_nacimiento\nprint("Tengo", edad, "años")',
      pruebas: [
        { t: 'src', re: 'anio_actual\\s*-\\s*anio_nacimiento', msg: 'edad sale de restar las dos variables' },
        { t: 'expr', code: 'edad', igual: '13', msg: 'edad vale 13' },
        { t: 'salida', igual: 'Tengo 13 años', msg: 'Sale “Tengo 13 años”' },
      ],
    },
    {
      id: 'py-3-5',
      titulo: 'Nombres rotos',
      enunciado:
        'Este programa tiene nombres de variable que Python no acepta. Arréglalo: la primera variable debe llamarse jugadores y la segunda mi_nombre. Tiene que salir: Luna juega con 2 amigos',
      inicial: '2jugadores = 2\nmi nombre = "Luna"\nprint(mi nombre, "juega con", 2jugadores, "amigos")\n',
      pista: 'Un nombre no puede empezar con número ni tener espacios. Cambia los nombres en todas partes donde aparecen.',
      solucion: 'jugadores = 2\nmi_nombre = "Luna"\nprint(mi_nombre, "juega con", jugadores, "amigos")',
      pruebas: [
        { t: 'expr', code: 'jugadores', igual: '2', msg: 'Existe jugadores y vale 2' },
        { t: 'expr', code: 'mi_nombre', igual: "'Luna'", msg: 'Existe mi_nombre y vale "Luna"' },
        { t: 'salida', igual: 'Luna juega con 2 amigos', msg: 'Sale “Luna juega con 2 amigos”' },
      ],
    },
  ],
}

const L4: Leccion = {
  id: 'py-4',
  numero: 4,
  titulo: 'Jugando con texto',
  emoji: '🔤',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'El texto (en programación se llama string) va entre comillas, dobles o sencillas. Con `+` se pegan dos textos y con `*` se repite uno.',
    },
    { t: 'codigo', codigo: 'nombre = "Ana"\nprint("Hola, " + nombre)\nprint("ja" * 3)' },
    {
      t: 'p',
      texto:
        '`len()` cuenta las letras. `.upper()` pasa todo a mayúsculas y `.lower()` a minúsculas.',
    },
    { t: 'codigo', codigo: 'palabra = "Python"\nprint(len(palabra))\nprint(palabra.upper())\nprint(palabra.lower())' },
    {
      t: 'p',
      texto:
        'La forma más cómoda de meter variables dentro de un texto es el f-string: una f antes de las comillas y las variables entre llaves. Es como las comillas invertidas de JavaScript, pero sin el signo $.',
    },
    {
      t: 'compara',
      js: 'console.log(`Hola ${nombre}, tienes ${edad} años`);',
      py: 'print(f"Hola {nombre}, tienes {edad} años")',
    },
    {
      t: 'ojo',
      texto:
        '`"Tengo " + 13` se rompe: no se puede pegar texto con número. Usa el f-string, las comas del print o convierte el número con `str(13)`.',
    },
  ],
  retos: [
    {
      id: 'py-4-1',
      titulo: 'Jajajajaja',
      enunciado: 'Muestra "ja" repetido 5 veces, usando el * con el texto.',
      inicial: '',
      pista: '"ja" * 5 dentro del print.',
      solucion: 'print("ja" * 5)',
      pruebas: [
        { t: 'src', re: '\\*\\s*5|5\\s*\\*', msg: 'Usas * 5' },
        { t: 'salida', igual: 'jajajajaja', msg: 'Sale jajajajaja' },
      ],
    },
    {
      id: 'py-4-2',
      titulo: 'Saludo pegado',
      enunciado: 'Usando + con la variable nombre, muestra: Hola, Sofía!',
      inicial: 'nombre = "Sofía"\n',
      pista: '"Hola, " + nombre + "!" — fíjate en el espacio después de la coma.',
      solucion: 'nombre = "Sofía"\nprint("Hola, " + nombre + "!")',
      pruebas: [
        { t: 'src', re: '\\+\\s*nombre|nombre\\s*\\+', msg: 'Pegas el texto con nombre usando +' },
        { t: 'src', re: 'Hola, Sofía', not: true, msg: 'Sofía sale de la variable, no escrita a mano' },
        { t: 'salida', igual: 'Hola, Sofía!', msg: 'Sale “Hola, Sofía!”' },
      ],
    },
    {
      id: 'py-4-3',
      titulo: '¡A GRITAR!',
      enunciado: 'Muestra la frase en mayúsculas sin volver a escribirla: usa .upper()',
      inicial: 'frase = "me encanta programar"\n',
      pista: 'print(frase.upper())',
      solucion: 'frase = "me encanta programar"\nprint(frase.upper())',
      pruebas: [
        { t: 'src', re: '\\.upper\\s*\\(\\s*\\)', msg: 'Usas .upper()' },
        { t: 'salida', igual: 'ME ENCANTA PROGRAMAR', exacto: true, msg: 'Sale ME ENCANTA PROGRAMAR, todo en mayúsculas' },
      ],
    },
    {
      id: 'py-4-4',
      titulo: 'La palabra más larga',
      enunciado: '¿Cuántas letras tiene otorrinolaringologo? No las cuentes tú: muestra el len de la variable.',
      inicial: 'palabra = "otorrinolaringologo"\n',
      pista: 'print(len(palabra))',
      solucion: 'palabra = "otorrinolaringologo"\nprint(len(palabra))',
      pruebas: [
        { t: 'src', re: 'len\\s*\\(\\s*palabra\\s*\\)', msg: 'Usas len(palabra)' },
        { t: 'salida', igual: '19', msg: 'Sale 19' },
      ],
    },
    {
      id: 'py-4-5',
      titulo: 'Tarjeta de presentación',
      enunciado:
        'Con un f-string y las tres variables, muestra: Me llamo Mateo, tengo 12 años y mi juego favorito es Minecraft',
      inicial: 'nombre = "Mateo"\nedad = 12\njuego = "Minecraft"\n',
      pista: 'print(f"Me llamo {nombre}, tengo {edad} años y …"). La f va pegada a las comillas.',
      solucion:
        'nombre = "Mateo"\nedad = 12\njuego = "Minecraft"\nprint(f"Me llamo {nombre}, tengo {edad} años y mi juego favorito es {juego}")',
      pruebas: [
        { t: 'src', re: '\\bf["\']', msg: 'Usas un f-string: f"…"' },
        { t: 'src', re: '\\{\\s*nombre\\s*\\}', msg: '{nombre} va dentro del texto' },
        { t: 'src', re: '\\{\\s*edad\\s*\\}', msg: '{edad} va dentro del texto' },
        { t: 'src', re: '\\{\\s*juego\\s*\\}', msg: '{juego} va dentro del texto' },
        {
          t: 'salida',
          igual: 'Me llamo Mateo, tengo 12 años y mi juego favorito es Minecraft',
          msg: 'Sale la frase completa',
        },
      ],
    },
  ],
}

const L5: Leccion = {
  id: 'py-5',
  numero: 5,
  titulo: 'La compu te pregunta',
  emoji: '💬',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        '`input()` hace una pregunta y espera a que alguien escriba la respuesta. Lo que escriban queda guardado en una variable.',
    },
    { t: 'codigo', codigo: 'nombre = input("¿Cómo te llamas? ")\nprint("Mucho gusto,", nombre)', entradas: ['Valentina'] },
    {
      t: 'p',
      texto:
        'Aquí en la página, las respuestas se escriben antes de correr, en las cajitas que dicen “Respuestas para input()”. Cada input() se lleva la siguiente cajita, en orden.',
    },
    {
      t: 'p',
      texto:
        'Algo muy importante: input() siempre devuelve texto, aunque escriban un número. Para hacer cuentas hay que convertirlo con `int()`.',
    },
    { t: 'codigo', codigo: 'edad = int(input("¿Cuántos años tienes? "))\nprint("El otro año tendrás", edad + 1)', entradas: ['13'] },
    {
      t: 'ojo',
      texto:
        'Sin `int()`, el número es texto: `"5" + "5"` da 55, no 10. Y `"5" + 1` se rompe con TypeError.',
    },
  ],
  retos: [
    {
      id: 'py-5-1',
      titulo: 'El saludo',
      enunciado: 'Pregunta el nombre con input() y después saluda así: Hola, (el nombre)',
      inicial: '',
      entradas: ['Valentina'],
      pista: 'nombre = input("¿Cómo te llamas? ") y después print("Hola,", nombre)',
      solucion: 'nombre = input("¿Cómo te llamas? ")\nprint("Hola,", nombre)',
      pruebas: [
        { t: 'src', re: 'input\\s*\\(', msg: 'Usas input()' },
        { t: 'linea', n: -1, contiene: 'Hola, Valentina', msg: 'Si escriben Valentina, sale “Hola, Valentina”' },
        { t: 'linea', n: -1, contiene: 'Hola, Tomás', entradas: ['Tomás'], msg: 'Si escriben Tomás, sale “Hola, Tomás”' },
      ],
    },
    {
      id: 'py-5-2',
      titulo: 'El doble',
      enunciado: 'Pide un número y muestra su doble. Acuérdate de convertirlo con int().',
      inicial: 'numero = input("Escribe un número: ")\n',
      entradas: ['7'],
      pista: 'int(input(…)) convierte la respuesta en número. Si no, "7" * 2 da "77".',
      solucion: 'numero = int(input("Escribe un número: "))\nprint(numero * 2)',
      pruebas: [
        { t: 'src', re: 'int\\s*\\(', msg: 'Conviertes con int()' },
        { t: 'linea', n: -1, contiene: '14', msg: 'Con 7, sale 14' },
        { t: 'linea', n: -1, contiene: '42', entradas: ['21'], msg: 'Con 21, sale 42' },
      ],
    },
    {
      id: 'py-5-3',
      titulo: '¿En qué año naciste?',
      enunciado: 'Pregunta la edad y muestra en qué año nació esa persona (más o menos): 2026 menos la edad.',
      inicial: '',
      entradas: ['13'],
      pista: 'edad = int(input("¿Cuántos años tienes? ")) y luego print(2026 - edad)',
      solucion: 'edad = int(input("¿Cuántos años tienes? "))\nprint("Naciste en", 2026 - edad)',
      pruebas: [
        { t: 'src', re: 'int\\s*\\(', msg: 'Conviertes con int()' },
        { t: 'linea', n: -1, contiene: '2013', msg: 'Con 13 años, sale 2013' },
        { t: 'linea', n: -1, contiene: '2016', entradas: ['10'], msg: 'Con 10 años, sale 2016' },
      ],
    },
    {
      id: 'py-5-4',
      titulo: 'La sumadora',
      enunciado: 'Pide dos números (dos input) y muestra la suma.',
      inicial: '',
      entradas: ['8', '5'],
      pista: 'Dos variables, cada una con int(input(…)), y luego print(a + b).',
      solucion: 'a = int(input("Primer número: "))\nb = int(input("Segundo número: "))\nprint("La suma es", a + b)',
      pruebas: [
        { t: 'src', re: 'input\\s*\\(', min: 2, msg: 'Usas dos input()' },
        { t: 'linea', n: -1, contiene: '13', msg: 'Con 8 y 5, sale 13' },
        { t: 'linea', n: -1, contiene: '123', entradas: ['100', '23'], msg: 'Con 100 y 23, sale 123' },
      ],
    },
    {
      id: 'py-5-5',
      titulo: 'El cuento loco',
      enunciado:
        'Pide un animal, un color y un número, en ese orden. Después muestra: Había una vez un (animal) (color) que tenía (número) patas.',
      inicial: '',
      entradas: ['dragón', 'morado', '7'],
      pista: 'Tres input, cada uno en su variable. Para la frase, un f-string: f"Había una vez un {animal} {color} que tenía {numero} patas."',
      solucion:
        'animal = input("Un animal: ")\ncolor = input("Un color: ")\nnumero = input("Un número: ")\nprint(f"Había una vez un {animal} {color} que tenía {numero} patas.")',
      pruebas: [
        { t: 'src', re: 'input\\s*\\(', min: 3, msg: 'Usas tres input()' },
        { t: 'linea', n: -1, contiene: 'Había una vez un dragón morado que tenía 7 patas', msg: 'Con dragón, morado y 7 sale el cuento' },
        {
          t: 'linea',
          n: -1,
          contiene: 'Había una vez un pato azul que tenía 100 patas',
          entradas: ['pato', 'azul', '100'],
          msg: 'Y con pato, azul y 100 también',
        },
      ],
    },
  ],
}

const L6: Leccion = {
  id: 'py-6',
  numero: 6,
  titulo: 'Tomando decisiones',
  emoji: '🔀',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Con `if` el programa decide. En Python no hay paréntesis obligatorios ni llaves: la condición termina en dos puntos y lo que va adentro se corre hacia la derecha (4 espacios, o la tecla Tab).',
    },
    {
      t: 'compara',
      js: 'if (edad >= 13) {\n  console.log("Puedes entrar");\n} else {\n  console.log("Todavía no");\n}',
      py: 'if edad >= 13:\n    print("Puedes entrar")\nelse:\n    print("Todavía no")',
    },
    {
      t: 'p',
      texto:
        'Para más de dos caminos está `elif` (en JavaScript era `else if`). Python revisa de arriba para abajo y entra solo al primero que se cumpla.',
    },
    {
      t: 'codigo',
      codigo:
        'nota = int(input("Tu nota: "))\nif nota >= 90:\n    print("¡Excelente!")\nelif nota >= 60:\n    print("Pasaste")\nelse:\n    print("A repasar")',
      entradas: ['75'],
    },
    {
      t: 'p',
      texto:
        'Para comparar: `==` igual, `!=` distinto, `<`, `>`, `<=`, `>=`. Para juntar condiciones se usan palabras: `and` (y), `or` (o), `not` (no). En JavaScript eran &&, || y !.',
    },
    {
      t: 'ojo',
      texto:
        'La sangría (los espacios del principio) en Python es obligatoria: así sabe qué va dentro del if. Si se te olvidan, sale IndentationError. Y no confundas `=` (guardar) con `==` (comparar).',
    },
  ],
  retos: [
    {
      id: 'py-6-1',
      titulo: 'La montaña rusa',
      enunciado:
        'Pregunta la estatura en centímetros. Si mide 140 o más, muestra ¡Puedes subir! y si no, Todavía no, ¡crece un poquito!',
      inicial: 'estatura = int(input("¿Cuánto mides en cm? "))\n',
      entradas: ['150'],
      pista: 'if estatura >= 140: y debajo, corrido a la derecha, el print. Después else: con su print.',
      solucion:
        'estatura = int(input("¿Cuánto mides en cm? "))\nif estatura >= 140:\n    print("¡Puedes subir!")\nelse:\n    print("Todavía no, ¡crece un poquito!")',
      pruebas: [
        { t: 'src', re: '\\bif\\b', msg: 'Usas if' },
        { t: 'src', re: '\\belse\\s*:', msg: 'Usas else:' },
        { t: 'salida', contiene: 'Puedes subir', no: 'Todavía', msg: 'Con 150 cm, puede subir (y solo eso)' },
        { t: 'salida', contiene: 'Todavía no', no: 'Puedes subir', entradas: ['120'], msg: 'Con 120 cm, todavía no' },
        { t: 'salida', contiene: 'Puedes subir', entradas: ['140'], msg: 'Con 140 justos, sí puede' },
      ],
    },
    {
      id: 'py-6-2',
      titulo: 'Par o impar',
      enunciado: 'Pide un número. Si es par, muestra solo la palabra par; si no, solo la palabra impar.',
      inicial: '',
      entradas: ['8'],
      pista: 'Un número es par si al dividirlo entre 2 no sobra nada: numero % 2 == 0',
      solucion: 'numero = int(input("Un número: "))\nif numero % 2 == 0:\n    print("par")\nelse:\n    print("impar")',
      pruebas: [
        { t: 'src', re: '%\\s*2', msg: 'Usas % 2' },
        { t: 'linea', n: -1, igual: 'par', msg: 'Con 8, sale par' },
        { t: 'linea', n: -1, igual: 'impar', entradas: ['13'], msg: 'Con 13, sale impar' },
        { t: 'linea', n: -1, igual: 'par', entradas: ['0'], msg: 'Con 0, sale par' },
      ],
    },
    {
      id: 'py-6-3',
      titulo: 'El semáforo',
      enunciado:
        'Pide un color. verde → Avanza, amarillo → Cuidado, rojo → Para. Cualquier otro → Ese color no existe. Usa elif.',
      inicial: 'color = input("¿De qué color está el semáforo? ")\n',
      entradas: ['verde'],
      pista: 'if color == "verde": … elif color == "amarillo": … elif color == "rojo": … else: …',
      solucion:
        'color = input("¿De qué color está el semáforo? ")\nif color == "verde":\n    print("Avanza")\nelif color == "amarillo":\n    print("Cuidado")\nelif color == "rojo":\n    print("Para")\nelse:\n    print("Ese color no existe")',
      pruebas: [
        { t: 'src', re: '\\belif\\b', msg: 'Usas elif' },
        { t: 'linea', n: -1, igual: 'Avanza', msg: 'verde → Avanza' },
        { t: 'linea', n: -1, igual: 'Cuidado', entradas: ['amarillo'], msg: 'amarillo → Cuidado' },
        { t: 'linea', n: -1, igual: 'Para', entradas: ['rojo'], msg: 'rojo → Para' },
        { t: 'linea', n: -1, igual: 'Ese color no existe', entradas: ['morado'], msg: 'morado → Ese color no existe' },
      ],
    },
    {
      id: 'py-6-4',
      titulo: 'La nota',
      enunciado:
        'Pide una nota de 0 a 100. Con 90 o más: Excelente. Con 70 o más: Aprobaste. Con menos: A estudiar más. Piensa bien en qué orden van.',
      inicial: '',
      entradas: ['95'],
      pista: 'Empieza por la condición más alta (>= 90). Si pones primero >= 70, un 95 nunca llega a Excelente.',
      solucion:
        'nota = int(input("Tu nota: "))\nif nota >= 90:\n    print("Excelente")\nelif nota >= 70:\n    print("Aprobaste")\nelse:\n    print("A estudiar más")',
      pruebas: [
        { t: 'linea', n: -1, igual: 'Excelente', msg: 'Con 95 → Excelente' },
        { t: 'linea', n: -1, igual: 'Excelente', entradas: ['90'], msg: 'Con 90 justo → Excelente' },
        { t: 'linea', n: -1, igual: 'Aprobaste', entradas: ['75'], msg: 'Con 75 → Aprobaste' },
        { t: 'linea', n: -1, igual: 'A estudiar más', entradas: ['40'], msg: 'Con 40 → A estudiar más' },
      ],
    },
    {
      id: 'py-6-5',
      titulo: 'La puerta secreta',
      enunciado:
        'Pide un usuario y una clave. Solo si el usuario es admin y la clave es python123, muestra Bienvenido. Si no, Acceso denegado. Usa and.',
      inicial: 'usuario = input("Usuario: ")\nclave = input("Clave: ")\n',
      entradas: ['admin', 'python123'],
      pista: 'if usuario == "admin" and clave == "python123":',
      solucion:
        'usuario = input("Usuario: ")\nclave = input("Clave: ")\nif usuario == "admin" and clave == "python123":\n    print("Bienvenido")\nelse:\n    print("Acceso denegado")',
      pruebas: [
        { t: 'src', re: '\\band\\b', msg: 'Usas and' },
        { t: 'linea', n: -1, igual: 'Bienvenido', msg: 'admin y python123 → Bienvenido' },
        { t: 'linea', n: -1, igual: 'Acceso denegado', entradas: ['admin', '1234'], msg: 'Clave equivocada → Acceso denegado' },
        { t: 'linea', n: -1, igual: 'Acceso denegado', entradas: ['pepe', 'python123'], msg: 'Usuario equivocado → Acceso denegado' },
      ],
    },
  ],
}

const L7: Leccion = {
  id: 'py-7',
  numero: 7,
  titulo: 'Repetir sin cansarse',
  emoji: '🔁',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'El `for` repite algo varias veces. En Python se cuenta con `range`. Mira qué cortico queda comparado con JavaScript:',
    },
    {
      t: 'compara',
      js: 'for (let i = 0; i < 5; i++) {\n  console.log(i);\n}',
      py: 'for i in range(5):\n    print(i)',
    },
    {
      t: 'p',
      texto:
        '`range(5)` cuenta 0, 1, 2, 3, 4: empieza en cero y no llega al 5. `range(1, 6)` cuenta del 1 al 5. Y con un tercer número das saltos: `range(0, 20, 5)` es 0, 5, 10, 15.',
    },
    { t: 'codigo', codigo: 'for i in range(1, 4):\n    print("Vuelta", i)\n\nfor n in range(0, 20, 5):\n    print(n)' },
    {
      t: 'p',
      texto: 'El for también recorre un texto, letra por letra:',
    },
    { t: 'codigo', codigo: 'for letra in "hola":\n    print(letra)' },
    {
      t: 'ojo',
      texto:
        'Lo que se repite es solo lo que está corrido a la derecha debajo del for. Lo que esté pegado a la izquierda se hace una sola vez, cuando el for termina.',
    },
  ],
  retos: [
    {
      id: 'py-7-1',
      titulo: 'Del 1 al 10',
      enunciado: 'Con un for, muestra los números del 1 al 10, uno por renglón.',
      inicial: '',
      pista: 'range(1, 11): el segundo número no se alcanza, por eso es 11.',
      solucion: 'for i in range(1, 11):\n    print(i)',
      pruebas: [
        { t: 'src', re: '\\bfor\\b.*\\bin\\s+range\\s*\\(', msg: 'Usas for … in range(…)' },
        { t: 'salida', igual: '1\n2\n3\n4\n5\n6\n7\n8\n9\n10', msg: 'Salen del 1 al 10' },
      ],
    },
    {
      id: 'py-7-2',
      titulo: 'La tabla del 7',
      enunciado: 'Muestra la tabla del 7, del 1 al 10, así: 7 x 1 = 7 … hasta 7 x 10 = 70',
      inicial: 'for i in range(1, 11):\n',
      pista: 'Dentro del for: print(f"7 x {i} = {7 * i}")',
      solucion: 'for i in range(1, 11):\n    print(f"7 x {i} = {7 * i}")',
      pruebas: [
        { t: 'src', re: '\\bfor\\b', msg: 'Usas for' },
        { t: 'linea', n: 0, igual: '7 x 1 = 7', msg: 'El primer renglón es 7 x 1 = 7' },
        { t: 'linea', n: 4, igual: '7 x 5 = 35', msg: 'El quinto es 7 x 5 = 35' },
        { t: 'linea', n: -1, igual: '7 x 10 = 70', msg: 'El último es 7 x 10 = 70' },
        { t: 'salida', contiene: ' x ', veces: 10, msg: 'Son 10 renglones' },
      ],
    },
    {
      id: 'py-7-3',
      titulo: 'De cinco en cinco',
      enunciado: 'Muestra 5, 10, 15 … hasta 50, uno por renglón. Usa el tercer número de range para dar saltos.',
      inicial: '',
      pista: 'range(5, 51, 5): empieza en 5, no llega a 51, salta de 5 en 5.',
      solucion: 'for n in range(5, 51, 5):\n    print(n)',
      pruebas: [
        { t: 'src', re: 'range\\s*\\([^)]*,[^)]*,\\s*5\\s*\\)', msg: 'range con salto de 5' },
        { t: 'salida', igual: '5\n10\n15\n20\n25\n30\n35\n40\n45\n50', msg: 'Salen 5, 10, 15 … 50' },
      ],
    },
    {
      id: 'py-7-4',
      titulo: 'Deletrear',
      enunciado: 'Pide una palabra y muestra cada letra en su propio renglón.',
      inicial: 'palabra = input("Una palabra: ")\n',
      entradas: ['gato'],
      pista: 'for letra in palabra: y adentro print(letra)',
      solucion: 'palabra = input("Una palabra: ")\nfor letra in palabra:\n    print(letra)',
      pruebas: [
        { t: 'src', re: '\\bfor\\b', msg: 'Usas for' },
        { t: 'salida', contiene: 'g\na\nt\no', msg: 'Con gato salen g, a, t, o' },
        { t: 'salida', contiene: 's\no\nl', entradas: ['sol'], msg: 'Con sol salen s, o, l' },
      ],
    },
    {
      id: 'py-7-5',
      titulo: 'Sumar del 1 al 100',
      enunciado:
        'Dicen que un niño llamado Gauss sumó del 1 al 100 en un minuto. Hazlo tú con un for: empieza con total = 0, súmale cada número y al final muestra total.',
      inicial: 'total = 0\n',
      pista: 'for i in range(1, 101): total += i. El print va afuera del for (pegado a la izquierda), para que salga una sola vez.',
      solucion: 'total = 0\nfor i in range(1, 101):\n    total += i\nprint(total)',
      pruebas: [
        { t: 'src', re: '\\bfor\\b', msg: 'Usas for' },
        { t: 'src', re: '5050', not: true, msg: 'No escribiste el 5050 a mano' },
        { t: 'salida', igual: '5050', msg: 'Sale una sola vez: 5050' },
      ],
    },
  ],
}

const L8: Leccion = {
  id: 'py-8',
  numero: 8,
  titulo: 'Mientras tanto…',
  emoji: '⏳',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        '`while` repite mientras una condición sea verdad. Sirve cuando no sabes cuántas vueltas van a ser: por ejemplo, seguir preguntando hasta que acierten.',
    },
    { t: 'codigo', codigo: 'n = 3\nwhile n > 0:\n    print(n)\n    n -= 1\nprint("¡Ya!")' },
    {
      t: 'p',
      texto:
        'Fíjate en `n -= 1`: cada vuelta la condición se acerca a ser falsa. Si nada cambia, el while da vueltas para siempre (un ciclo infinito). Aquí la página lo detiene a los pocos segundos, pero en un programa de verdad se queda pegado.',
    },
    {
      t: 'codigo',
      codigo: 'respuesta = input("¿Cuánto es 3 x 4? ")\nwhile respuesta != "12":\n    respuesta = input("No. Otra vez: ")\nprint("¡Correcto!")',
      entradas: ['7', '12'],
    },
    {
      t: 'ojo',
      texto:
        'Antes del while, la variable de la condición ya tiene que existir. Y lo que la cambia tiene que ir adentro del while, corrido a la derecha.',
    },
  ],
  retos: [
    {
      id: 'py-8-1',
      titulo: 'Cuenta regresiva',
      enunciado: 'Con un while, cuenta del 10 al 1, uno por renglón, y al final muestra ¡Despegue!',
      inicial: 'n = 10\n',
      pista: 'while n > 0: print(n) y n -= 1. El ¡Despegue! va afuera del while.',
      solucion: 'n = 10\nwhile n > 0:\n    print(n)\n    n -= 1\nprint("¡Despegue!")',
      pruebas: [
        { t: 'src', re: '\\bwhile\\b', msg: 'Usas while' },
        { t: 'linea', n: 0, igual: '10', msg: 'Empieza en 10' },
        { t: 'linea', n: 9, igual: '1', msg: 'Llega hasta 1' },
        { t: 'linea', n: -1, contiene: 'Despegue', msg: 'Termina con ¡Despegue!' },
        { t: 'salida', contiene: 'Despegue', veces: 1, msg: '¡Despegue! sale una sola vez' },
      ],
    },
    {
      id: 'py-8-2',
      titulo: 'Doblando',
      enunciado: 'Empieza con n = 1. Mientras n sea menor que 1000, muéstralo y duplícalo. Tiene que salir 1, 2, 4, 8 … 512.',
      inicial: 'n = 1\n',
      pista: 'while n < 1000: print(n) y después n = n * 2 (o n *= 2).',
      solucion: 'n = 1\nwhile n < 1000:\n    print(n)\n    n *= 2',
      pruebas: [
        { t: 'src', re: '\\bwhile\\b', msg: 'Usas while' },
        { t: 'salida', igual: '1\n2\n4\n8\n16\n32\n64\n128\n256\n512', msg: 'Salen 1, 2, 4 … 512' },
      ],
    },
    {
      id: 'py-8-3',
      titulo: 'La clave',
      enunciado:
        'Pide la clave. Mientras no sea python, muestra Intenta otra vez y vuelve a pedirla. Cuando acierten, muestra ¡Adentro!',
      inicial: 'clave = input("Clave: ")\n',
      entradas: ['java', 'html', 'python'],
      pista: 'while clave != "python": print("Intenta otra vez") y clave = input("Clave: ") — las dos cosas adentro del while.',
      solucion:
        'clave = input("Clave: ")\nwhile clave != "python":\n    print("Intenta otra vez")\n    clave = input("Clave: ")\nprint("¡Adentro!")',
      pruebas: [
        { t: 'src', re: '\\bwhile\\b', msg: 'Usas while' },
        { t: 'salida', contiene: 'Intenta otra vez', veces: 2, msg: 'Con java, html y python: dos veces “Intenta otra vez”' },
        { t: 'linea', n: -1, contiene: 'Adentro', msg: 'Y al final ¡Adentro!' },
        { t: 'salida', contiene: 'Adentro', no: 'Intenta', entradas: ['python'], msg: 'Si aciertan de una, entran sin regaño' },
      ],
    },
    {
      id: 'py-8-4',
      titulo: 'La alcancía',
      enunciado:
        'Quieres ahorrar 100 mil pesos guardando 15 mil cada semana. Con un while, muestra cada semana así: Semana 1: 15 … y al final: Lo lograste en 7 semanas',
      inicial: 'ahorro = 0\nsemana = 0\n',
      pista: 'while ahorro < 100: suma 1 a semana, suma 15 a ahorro y print(f"Semana {semana}: {ahorro}")',
      solucion:
        'ahorro = 0\nsemana = 0\nwhile ahorro < 100:\n    semana += 1\n    ahorro += 15\n    print(f"Semana {semana}: {ahorro}")\nprint(f"Lo lograste en {semana} semanas")',
      pruebas: [
        { t: 'src', re: '\\bwhile\\b', msg: 'Usas while' },
        { t: 'linea', n: 0, igual: 'Semana 1: 15', msg: 'Empieza con Semana 1: 15' },
        { t: 'salida', contiene: 'Semana 7: 105', msg: 'Llega a Semana 7: 105' },
        { t: 'salida', no: 'Semana 8', msg: 'No sigue a la semana 8' },
        { t: 'linea', n: -1, igual: 'Lo lograste en 7 semanas', msg: 'Termina con “Lo lograste en 7 semanas”' },
      ],
    },
    {
      id: 'py-8-5',
      titulo: 'Sumar hasta el cero',
      enunciado: 'Pide números uno tras otro y ve sumándolos. Cuando escriban 0, para y muestra el total.',
      inicial: 'total = 0\nnumero = int(input("Número (0 para terminar): "))\n',
      entradas: ['5', '10', '3', '0'],
      pista: 'while numero != 0: total += numero y vuelves a pedir el número. El print del total va afuera.',
      solucion:
        'total = 0\nnumero = int(input("Número (0 para terminar): "))\nwhile numero != 0:\n    total += numero\n    numero = int(input("Número (0 para terminar): "))\nprint("Total:", total)',
      pruebas: [
        { t: 'src', re: '\\bwhile\\b', msg: 'Usas while' },
        { t: 'linea', n: -1, contiene: '18', msg: 'Con 5, 10, 3 y 0 → 18' },
        { t: 'linea', n: -1, contiene: '14', entradas: ['7', '7', '0'], msg: 'Con 7, 7 y 0 → 14' },
        { t: 'linea', n: -1, contiene: '0', entradas: ['0'], msg: 'Si el primero es 0 → 0' },
      ],
    },
  ],
}

const L9: Leccion = {
  id: 'py-9',
  numero: 9,
  titulo: 'Listas',
  emoji: '📋',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Una lista guarda muchos datos en una sola variable. Es igualita a los arreglos de JavaScript: entre corchetes y separados por comas.',
    },
    {
      t: 'compara',
      js: 'let frutas = ["mango", "fresa"];\nfrutas.push("kiwi");\nconsole.log(frutas.length);',
      py: 'frutas = ["mango", "fresa"]\nfrutas.append("kiwi")\nprint(len(frutas))',
    },
    {
      t: 'p',
      texto:
        'Cada dato tiene su posición, que empieza en 0: `frutas[0]` es el primero. Python tiene un truco que JavaScript no: `frutas[-1]` es el último.',
    },
    { t: 'codigo', codigo: 'frutas = ["mango", "fresa", "kiwi"]\nprint(frutas[0])\nprint(frutas[-1])\nfor fruta in frutas:\n    print("Me gusta el", fruta)' },
    {
      t: 'p',
      texto: 'Con listas de números hay ayudas listas: `sum()` suma todo, `max()` da el mayor y `min()` el menor.',
    },
    { t: 'codigo', codigo: 'puntos = [30, 85, 50]\nprint(sum(puntos))\nprint(max(puntos))\nprint(min(puntos))' },
    {
      t: 'ojo',
      texto:
        'Si pides una posición que no existe (en una lista de 3, la `[3]`), sale IndexError. Las posiciones de una lista de 3 son 0, 1 y 2.',
    },
  ],
  retos: [
    {
      id: 'py-9-1',
      titulo: 'Tus colores',
      enunciado:
        'Crea una lista llamada colores con tres colores (los que quieras). Muestra el primero con [0] y el último con [-1].',
      inicial: '',
      pista: 'colores = ["azul", "verde", "rojo"] y luego print(colores[0]) y print(colores[-1]).',
      solucion: 'colores = ["azul", "verde", "rojo"]\nprint(colores[0])\nprint(colores[-1])',
      pruebas: [
        { t: 'expr', code: 'isinstance(colores, list) and len(colores) >= 3', igual: 'True', msg: 'colores es una lista con tres colores' },
        { t: 'src', re: 'colores\\s*\\[\\s*0\\s*\\]', msg: 'Usas colores[0]' },
        { t: 'src', re: 'colores\\s*\\[\\s*-1\\s*\\]', msg: 'Usas colores[-1]' },
        { t: 'expr', code: 'str(colores[0]) in __salida__ and str(colores[-1]) in __salida__', igual: 'True', msg: 'Se ven el primero y el último' },
      ],
    },
    {
      id: 'py-9-2',
      titulo: 'La fiesta',
      enunciado: 'Agrega a Sara y a Pedro a la lista de invitados con append. Después muestra cuántos invitados hay con len.',
      inicial: 'invitados = ["Ana", "Luis"]\n',
      pista: 'invitados.append("Sara"), luego invitados.append("Pedro") y print(len(invitados)).',
      solucion: 'invitados = ["Ana", "Luis"]\ninvitados.append("Sara")\ninvitados.append("Pedro")\nprint(len(invitados))',
      pruebas: [
        { t: 'src', re: '\\.append\\s*\\(', min: 2, msg: 'Usas append dos veces' },
        { t: 'expr', code: 'invitados', igual: "['Ana', 'Luis', 'Sara', 'Pedro']", msg: 'La lista queda Ana, Luis, Sara, Pedro' },
        { t: 'src', re: 'len\\s*\\(\\s*invitados\\s*\\)', msg: 'Usas len(invitados)' },
        { t: 'linea', n: -1, contiene: '4', msg: 'Sale 4' },
      ],
    },
    {
      id: 'py-9-3',
      titulo: 'Los animales',
      enunciado: 'Recorre la lista con un for y, por cada animal, muestra: Me gusta el (animal)',
      inicial: 'animales = ["perro", "gato", "loro"]\n',
      pista: 'for animal in animales: y adentro print("Me gusta el", animal)',
      solucion: 'animales = ["perro", "gato", "loro"]\nfor animal in animales:\n    print("Me gusta el", animal)',
      pruebas: [
        { t: 'src', re: '\\bfor\\b\\s+\\w+\\s+in\\s+animales', msg: 'Recorres animales con for' },
        { t: 'salida', igual: 'Me gusta el perro\nMe gusta el gato\nMe gusta el loro', msg: 'Sale una frase por animal' },
      ],
    },
    {
      id: 'py-9-4',
      titulo: 'Las notas',
      enunciado:
        'Muestra, cada una en su renglón: la suma de las notas, el promedio (suma dividida por cuántas son), la más alta y la más baja.',
      inicial: 'notas = [80, 95, 70, 100, 65]\n',
      pista: 'sum(notas), sum(notas) / len(notas), max(notas) y min(notas).',
      solucion: 'notas = [80, 95, 70, 100, 65]\nprint(sum(notas))\nprint(sum(notas) / len(notas))\nprint(max(notas))\nprint(min(notas))',
      pruebas: [
        { t: 'src', re: 'sum\\s*\\(', msg: 'Usas sum()' },
        { t: 'src', re: 'len\\s*\\(', msg: 'Usas len() para el promedio' },
        { t: 'src', re: 'max\\s*\\(', msg: 'Usas max()' },
        { t: 'src', re: 'min\\s*\\(', msg: 'Usas min()' },
        { t: 'salida', igual: '410\n82.0\n100\n65', msg: 'Salen 410, 82.0, 100 y 65' },
      ],
    },
    {
      id: 'py-9-5',
      titulo: 'La lista del mercado',
      enunciado:
        'Empieza con una lista vacía llamada compras. Pide 3 productos con input (puedes usar un for) y agrégalos con append. Al final muestra la lista y después: Tienes 3 productos',
      inicial: 'compras = []\n',
      entradas: ['pan', 'leche', 'huevos'],
      pista: 'for i in range(3): producto = input("Producto: ") y compras.append(producto). Afuera del for, los dos print.',
      solucion:
        'compras = []\nfor i in range(3):\n    producto = input("Producto: ")\n    compras.append(producto)\nprint(compras)\nprint(f"Tienes {len(compras)} productos")',
      pruebas: [
        { t: 'src', re: '\\.append\\s*\\(', msg: 'Usas append' },
        { t: 'expr', code: 'compras', igual: "['pan', 'leche', 'huevos']", msg: 'compras queda con pan, leche y huevos' },
        { t: 'expr', code: 'compras', igual: "['arroz', 'queso', 'papa']", entradas: ['arroz', 'queso', 'papa'], msg: 'Y con otros productos, guarda esos' },
        { t: 'linea', n: -1, igual: 'Tienes 3 productos', msg: 'Termina con “Tienes 3 productos”' },
      ],
    },
  ],
}

const L10: Leccion = {
  id: 'py-10',
  numero: 10,
  titulo: 'Tus propias funciones',
  emoji: '🛠️',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Una función es un pedazo de código con nombre que puedes usar todas las veces que quieras. En JavaScript decías `function`; en Python es `def`, con dos puntos y sangría, como el if.',
    },
    {
      t: 'compara',
      js: 'function saludar(nombre) {\n  console.log("Hola " + nombre);\n}\nsaludar("Ana");',
      py: 'def saludar(nombre):\n    print("Hola", nombre)\n\nsaludar("Ana")',
    },
    {
      t: 'p',
      texto:
        'Con `return` la función devuelve un resultado, que puedes guardar o mostrar. Es distinto a print: print lo enseña en pantalla, return se lo entrega a quien llamó la función.',
    },
    { t: 'codigo', codigo: 'def triple(n):\n    return n * 3\n\nresultado = triple(5)\nprint(resultado)\nprint(triple(10) + 1)' },
    {
      t: 'p',
      texto: 'Una función puede recibir varios datos, separados por comas, y tener if adentro.',
    },
    {
      t: 'codigo',
      codigo: 'def mayor(a, b):\n    if a > b:\n        return a\n    else:\n        return b\n\nprint(mayor(7, 12))',
    },
    {
      t: 'ojo',
      texto:
        'Definir la función no la corre: hay que llamarla, con su nombre y paréntesis. Y lo que va dentro de la función tiene que estar corrido a la derecha.',
    },
  ],
  retos: [
    {
      id: 'py-10-1',
      titulo: 'Tu primera función',
      enunciado: 'Crea la función saludar, que muestre ¡Hola desde una función! Después llámala tres veces.',
      inicial: 'def saludar():\n',
      pista: 'Dentro de la función, corrido a la derecha, el print. Después, pegado a la izquierda: saludar() tres veces.',
      solucion: 'def saludar():\n    print("¡Hola desde una función!")\n\nsaludar()\nsaludar()\nsaludar()',
      pruebas: [
        { t: 'src', re: 'def\\s+saludar\\s*\\(', msg: 'Defines saludar con def' },
        { t: 'src', re: '\\bprint\\s*\\(', min: 1, msg: 'Tiene un print adentro' },
        { t: 'salida', contiene: 'Hola desde una función', veces: 3, msg: 'El saludo sale tres veces' },
      ],
    },
    {
      id: 'py-10-2',
      titulo: 'El doble, con return',
      enunciado: 'Crea la función doble(n) que devuelva (con return) el doble de n. Después muestra doble(21).',
      inicial: 'def doble(n):\n',
      pista: 'return n * 2, y afuera: print(doble(21)).',
      solucion: 'def doble(n):\n    return n * 2\n\nprint(doble(21))',
      pruebas: [
        { t: 'src', re: '\\breturn\\b', msg: 'Usas return' },
        { t: 'expr', code: 'doble(4)', igual: '8', msg: 'doble(4) devuelve 8' },
        { t: 'expr', code: 'doble(-3)', igual: '-6', msg: 'doble(-3) devuelve -6' },
        { t: 'salida', igual: '42', msg: 'Sale 42' },
      ],
    },
    {
      id: 'py-10-3',
      titulo: '¿Es par?',
      enunciado: 'Crea la función es_par(n) que devuelva True si n es par y False si no. No hace falta mostrar nada.',
      inicial: 'def es_par(n):\n',
      pista: 'if n % 2 == 0: return True, y si no, return False. (Truco: return n % 2 == 0 hace lo mismo.)',
      solucion: 'def es_par(n):\n    return n % 2 == 0',
      pruebas: [
        { t: 'src', re: 'def\\s+es_par\\s*\\(', msg: 'Defines es_par' },
        { t: 'expr', code: 'es_par(4)', igual: 'True', msg: 'es_par(4) devuelve True' },
        { t: 'expr', code: 'es_par(7)', igual: 'False', msg: 'es_par(7) devuelve False' },
        { t: 'expr', code: 'es_par(0)', igual: 'True', msg: 'es_par(0) devuelve True' },
      ],
    },
    {
      id: 'py-10-4',
      titulo: 'El área, con función',
      enunciado:
        'Crea area_rectangulo(base, altura) que devuelva base por altura. Muestra el área de un rectángulo de 6 por 4.',
      inicial: '',
      pista: 'def area_rectangulo(base, altura): return base * altura. Y afuera print(area_rectangulo(6, 4)).',
      solucion: 'def area_rectangulo(base, altura):\n    return base * altura\n\nprint(area_rectangulo(6, 4))',
      pruebas: [
        { t: 'src', re: 'def\\s+area_rectangulo\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*\\)', msg: 'Defines area_rectangulo con dos datos' },
        { t: 'expr', code: 'area_rectangulo(3, 4)', igual: '12', msg: 'area_rectangulo(3, 4) devuelve 12' },
        { t: 'expr', code: 'area_rectangulo(10, 2)', igual: '20', msg: 'area_rectangulo(10, 2) devuelve 20' },
        { t: 'salida', igual: '24', msg: 'Sale 24' },
      ],
    },
    {
      id: 'py-10-5',
      titulo: 'Piedra, papel o tijera',
      enunciado:
        'El gran final. Crea ganador(a, b): a es lo que saca el jugador 1 y b el jugador 2 ("piedra", "papel" o "tijera"). Devuelve "empate", "gana 1" o "gana 2". La piedra rompe la tijera, la tijera corta el papel y el papel envuelve la piedra.',
      inicial: 'def ganador(a, b):\n',
      pista:
        'Primero: si a == b, empate. Después, las tres formas en que gana 1, unidas con or: (a == "piedra" and b == "tijera") or … Si no es ninguna, gana 2.',
      solucion:
        'def ganador(a, b):\n    if a == b:\n        return "empate"\n    if (a == "piedra" and b == "tijera") or (a == "tijera" and b == "papel") or (a == "papel" and b == "piedra"):\n        return "gana 1"\n    return "gana 2"',
      pruebas: [
        { t: 'expr', code: "ganador('piedra', 'piedra')", igual: "'empate'", msg: 'piedra contra piedra → empate' },
        { t: 'expr', code: "ganador('piedra', 'tijera')", igual: "'gana 1'", msg: 'piedra contra tijera → gana 1' },
        { t: 'expr', code: "ganador('tijera', 'papel')", igual: "'gana 1'", msg: 'tijera contra papel → gana 1' },
        { t: 'expr', code: "ganador('papel', 'piedra')", igual: "'gana 1'", msg: 'papel contra piedra → gana 1' },
        { t: 'expr', code: "ganador('tijera', 'piedra')", igual: "'gana 2'", msg: 'tijera contra piedra → gana 2' },
        { t: 'expr', code: "ganador('piedra', 'papel')", igual: "'gana 2'", msg: 'piedra contra papel → gana 2' },
        { t: 'expr', code: "ganador('papel', 'tijera')", igual: "'gana 2'", msg: 'papel contra tijera → gana 2' },
      ],
    },
  ],
}

export const CURSO_PYTHON: Curso = {
  id: 'python',
  titulo: 'Python desde cero',
  emoji: '🐍',
  descripcion:
    'Tu primer lenguaje fuera del navegador. Diez lecciones cortas, cada una con cinco retos: desde el primer print hasta tus propias funciones, pasando por preguntas, decisiones, ciclos y listas.',
  lenguaje: 'python',
  lecciones: [L1, L2, L3, L4, L5, L6, L7, L8, L9, L10],
}
