import type { Curso, Leccion } from './tipos'

/*
 * La segunda parte del curso de Python: 10 lecciones de 5 retos, para unas
 * 4 horas y media de clase. Se abre cuando el alumno termina "Python desde cero".
 *
 * Cuatro bloques: estructuras de datos (L1 a L6), funciones a fondo (L7 y L8),
 * errores y módulos (L9) y clases (L10, que cierra con una mascota virtual).
 * Igual que en la primera parte, cuando se puede, lo nuevo se pone al lado del
 * JavaScript que ya conocen.
 *
 * Los retos con azar (L9) no dependen de la suerte: las pruebas lanzan el dado
 * cientos de veces y miran que salga de todo y nada por fuera.
 *
 * Cada reto tiene su solución de referencia. /verificar-curso las corre todas
 * contra sus pruebas: si se cambia un reto, abrir esa página.
 */

/** Una comprensión de lista: corchetes con un for adentro. */
const COMPRENSION = '\\[[^\\]\\n]*\\bfor\\b[^\\]\\n]*\\bin\\b[^\\]\\n]*\\]'
const SIN_CICLOS = { t: 'src', re: '\\b(for|while)\\b', not: true, msg: 'Sin for ni while: con recursión' } as const

const L1: Leccion = {
  id: 'pya-1',
  numero: 1,
  titulo: 'Listas a fondo',
  emoji: '📦',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Ya sabes crear listas, recorrerlas y agregarles cosas. Ahora vienen los trucos que hacen famoso a Python. El primero: las rebanadas. `lista[1:3]` saca un pedazo, desde la posición 1 hasta antes de la 3. Es el `slice` de JavaScript, pero más corto.',
    },
    {
      t: 'compara',
      js: 'let letras = ["a", "b", "c", "d", "e"];\nconsole.log(letras.slice(1, 3));',
      py: 'letras = ["a", "b", "c", "d", "e"]\nprint(letras[1:3])',
    },
    {
      t: 'codigo',
      codigo:
        'letras = ["a", "b", "c", "d", "e"]\nprint(letras[:2])    # los dos primeros\nprint(letras[2:])    # del 2 en adelante\nprint(letras[::-1])  # al revés',
    },
    {
      t: 'p',
      texto:
        'Para saber si algo está en la lista se usa `in` (en JavaScript era `includes`). `sorted()` te da una lista nueva ordenada y `.sort()` ordena la misma lista. `.remove(x)` quita un dato y `.pop()` saca el último y te lo entrega.',
    },
    { t: 'compara', js: 'frutas.includes("kiwi")', py: '"kiwi" in frutas' },
    {
      t: 'codigo',
      codigo: 'numeros = [5, 2, 9, 1]\nprint(9 in numeros)\nprint(sorted(numeros))\nnumeros.remove(2)\nultimo = numeros.pop()\nprint(ultimo, numeros)',
    },
    {
      t: 'p',
      texto: 'Y `enumerate` te da la posición y el dato al mismo tiempo, para no llevar la cuenta a mano:',
    },
    { t: 'codigo', codigo: 'for i, color in enumerate(["rojo", "azul", "verde"]):\n    print(i, color)' },
    {
      t: 'ojo',
      texto:
        '`.sort()` ordena pero no devuelve nada. Si escribes `numeros = numeros.sort()`, numeros queda en None. Escribe solo `numeros.sort()`, o `numeros = sorted(numeros)`.',
    },
  ],
  retos: [
    {
      id: 'pya-1-1',
      titulo: 'El podio',
      enunciado: 'Los corredores están en el orden en que llegaron. Muestra solo los tres primeros, con una rebanada.',
      inicial: 'corredores = ["Ana", "Luis", "Sara", "Pedro", "Lina", "Juan"]\n',
      pista: 'corredores[:3] son los de las posiciones 0, 1 y 2. Muéstralo con print.',
      solucion: 'corredores = ["Ana", "Luis", "Sara", "Pedro", "Lina", "Juan"]\nprint(corredores[:3])',
      pruebas: [
        { t: 'src', re: 'corredores\\s*\\[\\s*0?\\s*:\\s*3\\s*\\]', msg: 'Usas una rebanada: corredores[:3]' },
        { t: 'salida', igual: "['Ana', 'Luis', 'Sara']", msg: 'Salen Ana, Luis y Sara' },
      ],
    },
    {
      id: 'pya-1-2',
      titulo: '¿Estás en la lista?',
      enunciado:
        'Pregunta el nombre con input. Si está en la lista de invitados (usa in), muestra: Pasa, (nombre). Si no está: No estás en la lista',
      inicial: 'invitados = ["Ana", "Luis", "Sara"]\n',
      entradas: ['Sara'],
      pista: 'if nombre in invitados: … else: …',
      solucion:
        'invitados = ["Ana", "Luis", "Sara"]\nnombre = input("¿Cómo te llamas? ")\nif nombre in invitados:\n    print(f"Pasa, {nombre}")\nelse:\n    print("No estás en la lista")',
      pruebas: [
        { t: 'src', re: '\\bin\\s+invitados\\b', msg: 'Usas in invitados' },
        { t: 'linea', n: -1, igual: 'Pasa, Sara', msg: 'A Sara la deja pasar' },
        { t: 'linea', n: -1, igual: 'Pasa, Ana', entradas: ['Ana'], msg: 'A Ana también' },
        { t: 'linea', n: -1, igual: 'No estás en la lista', entradas: ['Pepe'], msg: 'A Pepe no lo deja pasar' },
      ],
    },
    {
      id: 'pya-1-3',
      titulo: 'Del más bajo al más alto',
      enunciado:
        'Ordena las estaturas (con sort o sorted) y muestra la lista ordenada. Después muestra la más alta usando la posición [-1] de la lista ordenada.',
      inicial: 'estaturas = [142, 135, 150, 128, 139]\n',
      pista: 'estaturas.sort() y print(estaturas). Ya ordenada, la última es la más alta: estaturas[-1].',
      solucion: 'estaturas = [142, 135, 150, 128, 139]\nestaturas.sort()\nprint(estaturas)\nprint(estaturas[-1])',
      pruebas: [
        { t: 'src', re: '\\.sort\\s*\\(|\\bsorted\\s*\\(', msg: 'Usas sort o sorted' },
        { t: 'src', re: '\\[\\s*-1\\s*\\]', msg: 'Usas [-1]' },
        { t: 'salida', igual: '[128, 135, 139, 142, 150]\n150', msg: 'Sale la lista ordenada y después 150' },
      ],
    },
    {
      id: 'pya-1-4',
      titulo: 'La fila del bus',
      enunciado:
        'Luis se bajó del bus: quítalo de la fila con remove. Después el último de la fila también se fue: sácalo con pop y muestra quién era. Al final muestra cómo quedó la fila.',
      inicial: 'fila = ["Ana", "Luis", "Sara", "Pedro"]\n',
      pista: 'fila.remove("Luis"). Después se_fue = fila.pop(), print(se_fue) y print(fila).',
      solucion: 'fila = ["Ana", "Luis", "Sara", "Pedro"]\nfila.remove("Luis")\nse_fue = fila.pop()\nprint(se_fue)\nprint(fila)',
      pruebas: [
        { t: 'src', re: '\\.remove\\s*\\(', msg: 'Usas remove' },
        { t: 'src', re: '\\.pop\\s*\\(', msg: 'Usas pop' },
        { t: 'expr', code: 'fila', igual: "['Ana', 'Sara']", msg: 'En la fila quedan Ana y Sara' },
        { t: 'salida', igual: "Pedro\n['Ana', 'Sara']", msg: 'Sale Pedro y después la fila' },
      ],
    },
    {
      id: 'pya-1-5',
      titulo: 'La tabla de posiciones',
      enunciado:
        'Recorre los equipos con enumerate y muestra la tabla así: 1. Nacional, 2. Millonarios… (ojo: la posición de la lista empieza en 0, y la tabla en 1).',
      inicial: 'equipos = ["Nacional", "Millonarios", "Junior", "Cali"]\n',
      pista: 'for i, equipo in enumerate(equipos): y adentro print(f"{i + 1}. {equipo}")',
      solucion: 'equipos = ["Nacional", "Millonarios", "Junior", "Cali"]\nfor i, equipo in enumerate(equipos):\n    print(f"{i + 1}. {equipo}")',
      pruebas: [
        { t: 'src', re: '\\benumerate\\s*\\(', msg: 'Usas enumerate' },
        { t: 'salida', igual: '1. Nacional\n2. Millonarios\n3. Junior\n4. Cali', msg: 'Sale la tabla del 1 al 4' },
      ],
    },
  ],
}

const L2: Leccion = {
  id: 'pya-2',
  numero: 2,
  titulo: 'Texto a fondo',
  emoji: '✂️',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'El texto también tiene sus trucos. Ya conoces `upper`, `lower` y `len`. Hoy: partir, unir, cambiar y limpiar. `split` parte un texto en una lista de pedazos, y `join` los vuelve a unir. En Python, join se escribe al revés que en JavaScript: primero va el pegante.',
    },
    {
      t: 'compara',
      js: 'let partes = "a-b-c".split("-");\nconsole.log(partes.join(" "));',
      py: 'partes = "a-b-c".split("-")\nprint(" ".join(partes))',
    },
    {
      t: 'codigo',
      codigo: 'frase = "me gusta el mango"\npalabras = frase.split()\nprint(palabras)\nprint(len(palabras))\nprint("-".join(palabras))',
    },
    {
      t: 'p',
      texto:
        '`replace` cambia un pedazo por otro, `strip` quita los espacios de los bordes, `count` cuenta cuántas veces aparece algo y `startswith` pregunta cómo empieza.',
    },
    {
      t: 'codigo',
      codigo:
        'texto = "  hola mundo  "\nprint(texto.strip())\nprint(texto.replace("mundo", "Colombia"))\nprint("banana".count("a"))\nprint("Python".startswith("Py"))',
    },
    {
      t: 'ojo',
      texto:
        'Un texto no se puede cambiar por dentro: `texto[0] = "H"` da error. replace, upper y los demás te devuelven un texto nuevo, así que guárdalo: `texto = texto.upper()`.',
    },
  ],
  retos: [
    {
      id: 'pya-2-1',
      titulo: 'Palabra por palabra',
      enunciado: 'Parte la frase con split y muestra cada palabra en su propio renglón, con un for.',
      inicial: 'frase = "Python es muy divertido"\n',
      pista: 'for palabra in frase.split(): y adentro print(palabra).',
      solucion: 'frase = "Python es muy divertido"\nfor palabra in frase.split():\n    print(palabra)',
      pruebas: [
        { t: 'src', re: '\\.split\\s*\\(', msg: 'Usas split' },
        { t: 'salida', igual: 'Python\nes\nmuy\ndivertido', msg: 'Sale una palabra por renglón' },
      ],
    },
    {
      id: 'pya-2-2',
      titulo: 'El contador de palabras',
      enunciado: 'Pide una frase con input y muestra: Tu frase tiene (N) palabras',
      inicial: '',
      entradas: ['hoy juego fútbol con mis amigos'],
      pista: 'palabras = frase.split() y después len(palabras) dentro de un f-string.',
      solucion: 'frase = input("Escribe una frase: ")\npalabras = frase.split()\nprint(f"Tu frase tiene {len(palabras)} palabras")',
      pruebas: [
        { t: 'src', re: '\\.split\\s*\\(', msg: 'Usas split' },
        { t: 'linea', n: -1, igual: 'Tu frase tiene 6 palabras', msg: 'Con “hoy juego fútbol con mis amigos” dice 6' },
        { t: 'linea', n: -1, igual: 'Tu frase tiene 2 palabras', entradas: ['hola mundo'], msg: 'Con “hola mundo” dice 2' },
      ],
    },
    {
      id: 'pya-2-3',
      titulo: 'Lenguaje secreto',
      enunciado: 'Cambia todas las a por 4 y todas las o por 0, con replace. Muestra el mensaje secreto.',
      inicial: 'mensaje = "hola amigo"\n',
      pista: 'mensaje = mensaje.replace("a", "4") y después lo mismo con la o. Al final, print(mensaje).',
      solucion: 'mensaje = "hola amigo"\nmensaje = mensaje.replace("a", "4")\nmensaje = mensaje.replace("o", "0")\nprint(mensaje)',
      pruebas: [
        { t: 'src', re: '\\.replace\\s*\\(', min: 2, msg: 'Usas replace dos veces' },
        { t: 'salida', igual: 'h0l4 4mig0', msg: 'Sale h0l4 4mig0' },
      ],
    },
    {
      id: 'pya-2-4',
      titulo: 'Cuenta las vocales',
      enunciado: 'Pide una palabra y cuenta cuántas vocales tiene (a, e, i, o, u) usando count. Muestra: Tiene (N) vocales',
      inicial: 'palabra = input("Palabra: ")\n',
      entradas: ['murcielago'],
      pista: 'palabra.count("a") + palabra.count("e") + … una por cada vocal, todo sumado.',
      solucion:
        'palabra = input("Palabra: ")\nvocales = palabra.count("a") + palabra.count("e") + palabra.count("i") + palabra.count("o") + palabra.count("u")\nprint(f"Tiene {vocales} vocales")',
      pruebas: [
        { t: 'src', re: '\\.count\\s*\\(', msg: 'Usas count' },
        { t: 'linea', n: -1, igual: 'Tiene 5 vocales', msg: '“murcielago” tiene 5' },
        { t: 'linea', n: -1, igual: 'Tiene 3 vocales', entradas: ['banana'], msg: '“banana” tiene 3' },
        { t: 'linea', n: -1, igual: 'Tiene 1 vocales', entradas: ['sol'], msg: '“sol” tiene 1' },
      ],
    },
    {
      id: 'pya-2-5',
      titulo: 'Las iniciales',
      enunciado:
        'Pide un nombre completo y muestra sus iniciales en mayúscula, cada una con su punto. Gabriel García Márquez → G.G.M. Parte el nombre con split, guarda la primera letra de cada palabra en una lista y únelas con join.',
      inicial: '',
      entradas: ['Gabriel García Márquez'],
      pista:
        'iniciales = [] y for palabra in nombre.split(): iniciales.append(palabra[0].upper()). Al final: print(".".join(iniciales) + ".")',
      solucion:
        'nombre = input("Nombre completo: ")\niniciales = []\nfor palabra in nombre.split():\n    iniciales.append(palabra[0].upper())\nprint(".".join(iniciales) + ".")',
      pruebas: [
        { t: 'src', re: '\\.split\\s*\\(', msg: 'Usas split' },
        { t: 'src', re: '\\.join\\s*\\(', msg: 'Usas join' },
        { t: 'linea', n: -1, igual: 'G.G.M.', msg: 'Gabriel García Márquez → G.G.M.' },
        { t: 'linea', n: -1, igual: 'A.M.L.', entradas: ['ana maria lopez'], msg: 'ana maria lopez → A.M.L.' },
      ],
    },
  ],
}

const L3: Leccion = {
  id: 'pya-3',
  numero: 3,
  titulo: 'Diccionarios',
  emoji: '📖',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Una lista guarda los datos en fila, por posición. Un diccionario los guarda con nombre: cada dato tiene su llave. Es lo mismo que los objetos de JavaScript.',
    },
    {
      t: 'compara',
      js: 'let perro = { nombre: "Toby", edad: 3 };\nconsole.log(perro.nombre);',
      py: 'perro = {"nombre": "Toby", "edad": 3}\nprint(perro["nombre"])',
    },
    {
      t: 'p',
      texto:
        'Dos diferencias con JavaScript: las llaves van entre comillas, y para leer un dato se usan corchetes, no punto. Para cambiar o agregar un dato se le asigna con su llave. `in` pregunta si una llave existe y `len` dice cuántas hay.',
    },
    {
      t: 'codigo',
      codigo:
        'perro = {"nombre": "Toby", "edad": 3}\nperro["edad"] = 4\nperro["color"] = "café"\nprint(perro)\nprint("color" in perro)\nprint(len(perro))',
    },
    {
      t: 'p',
      texto:
        'Si pides una llave que no existe, Python se rompe con KeyError. Con `.get()` no se rompe: te devuelve None, o lo que le digas.',
    },
    { t: 'codigo', codigo: 'precios = {"pan": 500, "leche": 3200}\nprint(precios.get("queso"))\nprint(precios.get("queso", 0))' },
    {
      t: 'ojo',
      texto: '`perro.nombre` es de JavaScript. En Python es `perro["nombre"]`: corchetes y comillas.',
    },
  ],
  retos: [
    {
      id: 'pya-3-1',
      titulo: 'Tu ficha',
      enunciado:
        'Crea un diccionario llamado yo con tres llaves: "nombre", "edad" y "color" (tu color favorito). Después muestra tu nombre usando yo["nombre"].',
      inicial: '',
      pista: 'yo = {"nombre": "Ana", "edad": 11, "color": "verde"} y print(yo["nombre"]).',
      solucion: 'yo = {"nombre": "Ana", "edad": 11, "color": "verde"}\nprint(yo["nombre"])',
      pruebas: [
        {
          t: 'expr',
          code: 'isinstance(yo, dict) and {"nombre", "edad", "color"} <= set(yo)',
          igual: 'True',
          msg: 'yo es un diccionario con nombre, edad y color',
        },
        { t: 'src', re: 'yo\\s*\\[\\s*["\']nombre["\']\\s*\\]', msg: 'Usas yo["nombre"]' },
        { t: 'expr', code: 'str(yo["nombre"]) in __salida__', igual: 'True', msg: 'Se ve tu nombre' },
      ],
    },
    {
      id: 'pya-3-2',
      titulo: 'El cumpleaños de Michi',
      enunciado:
        'Michi cumplió años: súmale 1 a su edad (sin escribir el 3 a mano). Agrégale también la llave "color" con el valor "gris". Al final muestra el diccionario.',
      inicial: 'gato = {"nombre": "Michi", "edad": 2}\n',
      pista: 'gato["edad"] = gato["edad"] + 1, después gato["color"] = "gris" y print(gato).',
      solucion: 'gato = {"nombre": "Michi", "edad": 2}\ngato["edad"] = gato["edad"] + 1\ngato["color"] = "gris"\nprint(gato)',
      pruebas: [
        {
          t: 'src',
          re: 'gato\\s*\\[\\s*["\']edad["\']\\s*\\]\\s*=\\s*3\\b',
          not: true,
          msg: 'Le sumas 1 a la edad, sin escribir el 3',
        },
        {
          t: 'expr',
          code: 'gato == {"nombre": "Michi", "edad": 3, "color": "gris"}',
          igual: 'True',
          msg: 'Michi queda con 3 años y color gris',
        },
        { t: 'salida', igual: "{'nombre': 'Michi', 'edad': 3, 'color': 'gris'}", msg: 'Se muestra el diccionario' },
      ],
    },
    {
      id: 'pya-3-3',
      titulo: 'La tienda',
      enunciado:
        'Pregunta qué producto quieren. Si está en precios (usa in), muestra: (producto) cuesta (precio). Si no: No vendemos eso',
      inicial: 'precios = {"pan": 500, "leche": 3200, "huevo": 600}\n',
      entradas: ['leche'],
      pista: 'if producto in precios: print(f"{producto} cuesta {precios[producto]}") y si no, el otro mensaje.',
      solucion:
        'precios = {"pan": 500, "leche": 3200, "huevo": 600}\nproducto = input("¿Qué quieres? ")\nif producto in precios:\n    print(f"{producto} cuesta {precios[producto]}")\nelse:\n    print("No vendemos eso")',
      pruebas: [
        { t: 'src', re: '\\bin\\s+precios\\b', msg: 'Usas in precios' },
        { t: 'linea', n: -1, igual: 'leche cuesta 3200', msg: 'La leche cuesta 3200' },
        { t: 'linea', n: -1, igual: 'pan cuesta 500', entradas: ['pan'], msg: 'El pan cuesta 500' },
        { t: 'linea', n: -1, igual: 'No vendemos eso', entradas: ['queso'], msg: 'Queso no venden' },
      ],
    },
    {
      id: 'pya-3-4',
      titulo: 'El traductor',
      enunciado:
        'Pide una palabra en español y muestra su traducción usando get. Si la palabra no está en el diccionario, que salga ???',
      inicial: 'traductor = {"perro": "dog", "gato": "cat", "casa": "house"}\n',
      entradas: ['perro'],
      pista: 'print(traductor.get(palabra, "???")): el segundo dato de get es lo que sale si la llave no está.',
      solucion:
        'traductor = {"perro": "dog", "gato": "cat", "casa": "house"}\npalabra = input("Palabra: ")\nprint(traductor.get(palabra, "???"))',
      pruebas: [
        { t: 'src', re: '\\.get\\s*\\(', msg: 'Usas get' },
        { t: 'linea', n: -1, igual: 'dog', msg: 'perro → dog' },
        { t: 'linea', n: -1, igual: 'house', entradas: ['casa'], msg: 'casa → house' },
        { t: 'linea', n: -1, igual: '???', entradas: ['carro'], msg: 'carro → ???' },
      ],
    },
    {
      id: 'pya-3-5',
      titulo: 'El inventario del juego',
      enunciado:
        'Pregunta cuántas monedas encontró el jugador (conviértelo con int) y súmalas a las del inventario. Después muestra: Tienes (monedas) monedas y (vidas) vidas',
      inicial: 'inventario = {"monedas": 10, "vidas": 3}\n',
      entradas: ['5'],
      pista:
        'inventario["monedas"] = inventario["monedas"] + encontradas. Dentro del f-string usa comillas sencillas: {inventario[\'monedas\']}',
      solucion:
        'inventario = {"monedas": 10, "vidas": 3}\nencontradas = int(input("¿Cuántas monedas encontraste? "))\ninventario["monedas"] = inventario["monedas"] + encontradas\nprint(f"Tienes {inventario[\'monedas\']} monedas y {inventario[\'vidas\']} vidas")',
      pruebas: [
        { t: 'expr', code: 'inventario["monedas"]', igual: '15', msg: 'Con 5 monedas encontradas quedan 15' },
        { t: 'expr', code: 'inventario["monedas"]', igual: '30', entradas: ['20'], msg: 'Con 20 encontradas quedan 30' },
        { t: 'linea', n: -1, igual: 'Tienes 15 monedas y 3 vidas', msg: 'Sale “Tienes 15 monedas y 3 vidas”' },
      ],
    },
  ],
}

const L4: Leccion = {
  id: 'pya-4',
  numero: 4,
  titulo: 'Recorrer diccionarios',
  emoji: '🔁',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Un for sobre un diccionario recorre sus llaves. Con `.items()` recibes la llave y el valor al mismo tiempo, cada uno en su variable.',
    },
    {
      t: 'compara',
      js: 'for (let fruta in precios) {\n  console.log(fruta, precios[fruta]);\n}',
      py: 'for fruta, precio in precios.items():\n    print(fruta, precio)',
    },
    {
      t: 'codigo',
      codigo:
        'edades = {"Ana": 10, "Luis": 11, "Sara": 9}\nfor nombre in edades:\n    print(nombre)\nfor nombre, edad in edades.items():\n    print(nombre, "tiene", edad)',
    },
    {
      t: 'p',
      texto:
        'El truco más útil de los diccionarios es contar. Empiezas con uno vacío y, por cada cosa que aparece, le sumas 1 a su llave. Con `get(voto, 0)`, la primera vez arranca en 0.',
    },
    {
      t: 'codigo',
      codigo:
        'votos = ["pizza", "helado", "pizza", "pizza", "helado"]\nconteo = {}\nfor voto in votos:\n    conteo[voto] = conteo.get(voto, 0) + 1\nprint(conteo)',
    },
    {
      t: 'p',
      texto: 'Y se pueden combinar: una lista de diccionarios es como una tabla, donde cada diccionario es una fila.',
    },
    {
      t: 'codigo',
      codigo:
        'alumnos = [\n    {"nombre": "Ana", "nota": 90},\n    {"nombre": "Luis", "nota": 75},\n]\nfor a in alumnos:\n    print(a["nombre"], a["nota"])',
    },
    {
      t: 'ojo',
      texto:
        'En `for x in diccionario`, x es la llave, no el valor. Para el valor usa `diccionario[x]`, o recorre con `.items()`.',
    },
  ],
  retos: [
    {
      id: 'pya-4-1',
      titulo: 'La lista de precios',
      enunciado: 'Recorre el diccionario con items y muestra cada producto con su precio, así: pan: 500',
      inicial: 'precios = {"pan": 500, "leche": 3200, "huevo": 600}\n',
      pista: 'for producto, precio in precios.items(): y adentro print(f"{producto}: {precio}")',
      solucion: 'precios = {"pan": 500, "leche": 3200, "huevo": 600}\nfor producto, precio in precios.items():\n    print(f"{producto}: {precio}")',
      pruebas: [
        { t: 'src', re: '\\.items\\s*\\(', msg: 'Usas items' },
        { t: 'salida', igual: 'pan: 500\nleche: 3200\nhuevo: 600', msg: 'Sale cada producto con su precio' },
      ],
    },
    {
      id: 'pya-4-2',
      titulo: 'La vaca del salón',
      enunciado:
        'Para la fiesta, cada uno puso plata. Recorre los aportes con un for, ve sumando en una variable total y al final muestra: Total: (total)',
      inicial: 'aportes = {"Ana": 2000, "Luis": 5000, "Sara": 1500, "Pedro": 3000}\n',
      pista: 'total = 0 antes del for. Adentro: total = total + aportes[nombre]. Afuera, el print.',
      solucion:
        'aportes = {"Ana": 2000, "Luis": 5000, "Sara": 1500, "Pedro": 3000}\ntotal = 0\nfor nombre in aportes:\n    total = total + aportes[nombre]\nprint(f"Total: {total}")',
      pruebas: [
        { t: 'src', re: '\\bfor\\b', msg: 'Usas un for' },
        { t: 'linea', n: -1, igual: 'Total: 11500', msg: 'Sale “Total: 11500”' },
      ],
    },
    {
      id: 'pya-4-3',
      titulo: '¿Quién ganó?',
      enunciado:
        'Recorre los puntos con un for y encuentra al que más tiene: guarda el mejor nombre y sus puntos en dos variables. Al final muestra: Ganó (nombre) con (puntos)',
      inicial: 'puntos = {"Ana": 40, "Luis": 75, "Sara": 60}\n',
      pista:
        'Empieza con mejor = "" y mas = -1. En el for, si los puntos de este son mayores que mas, cambias las dos variables.',
      solucion:
        'puntos = {"Ana": 40, "Luis": 75, "Sara": 60}\nmejor = ""\nmas = -1\nfor nombre, p in puntos.items():\n    if p > mas:\n        mas = p\n        mejor = nombre\nprint(f"Ganó {mejor} con {mas}")',
      pruebas: [
        { t: 'src', re: '\\bfor\\b', msg: 'Usas un for' },
        { t: 'src', re: '\\bif\\b', msg: 'Usas un if para comparar' },
        { t: 'linea', n: -1, igual: 'Ganó Luis con 75', msg: 'Sale “Ganó Luis con 75”' },
      ],
    },
    {
      id: 'pya-4-4',
      titulo: 'La votación',
      enunciado:
        'El salón votó por su mascota. Cuenta los votos en el diccionario conteo y después muestra cada mascota con sus votos, así: perro: 3',
      inicial: 'votos = ["perro", "gato", "perro", "loro", "perro", "gato"]\nconteo = {}\n',
      pista:
        'for voto in votos: conteo[voto] = conteo.get(voto, 0) + 1. Después otro for con conteo.items() para mostrar.',
      solucion:
        'votos = ["perro", "gato", "perro", "loro", "perro", "gato"]\nconteo = {}\nfor voto in votos:\n    conteo[voto] = conteo.get(voto, 0) + 1\nfor mascota, n in conteo.items():\n    print(f"{mascota}: {n}")',
      pruebas: [
        { t: 'expr', code: 'conteo == {"perro": 3, "gato": 2, "loro": 1}', igual: 'True', msg: 'conteo queda perro 3, gato 2, loro 1' },
        { t: 'salida', igual: 'perro: 3\ngato: 2\nloro: 1', msg: 'Sale cada mascota con sus votos' },
      ],
    },
    {
      id: 'pya-4-5',
      titulo: 'El boletín',
      enunciado:
        'Recorre la lista de alumnos. Si la nota es 60 o más, muestra: (nombre) ganó con (nota). Si no: (nombre) perdió con (nota)',
      inicial:
        'alumnos = [\n    {"nombre": "Ana", "nota": 90},\n    {"nombre": "Luis", "nota": 55},\n    {"nombre": "Sara", "nota": 78},\n]\n',
      pista: 'for a in alumnos: y adentro if a["nota"] >= 60: … Dentro del f-string, comillas sencillas: {a[\'nombre\']}',
      solucion:
        'alumnos = [\n    {"nombre": "Ana", "nota": 90},\n    {"nombre": "Luis", "nota": 55},\n    {"nombre": "Sara", "nota": 78},\n]\nfor a in alumnos:\n    if a["nota"] >= 60:\n        print(f"{a[\'nombre\']} ganó con {a[\'nota\']}")\n    else:\n        print(f"{a[\'nombre\']} perdió con {a[\'nota\']}")',
      pruebas: [
        { t: 'src', re: '\\bfor\\b', msg: 'Usas un for' },
        { t: 'src', re: '\\[\\s*["\']nota["\']\\s*\\]', msg: 'Lees la nota con ["nota"]' },
        { t: 'salida', igual: 'Ana ganó con 90\nLuis perdió con 55\nSara ganó con 78', msg: 'Ana gana, Luis pierde, Sara gana' },
      ],
    },
  ],
}

const L5: Leccion = {
  id: 'pya-5',
  numero: 5,
  titulo: 'Tuplas y tableros',
  emoji: '🎯',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Una tupla es como una lista, pero con paréntesis y no se puede cambiar. Sirve para datos que van juntos: un punto (x, y), una fecha, un color.',
    },
    { t: 'codigo', codigo: 'punto = (3, 5)\nprint(punto[0])\nx, y = punto\nprint(x, y)' },
    {
      t: 'p',
      texto:
        'Eso de `x, y = punto` se llama desempacar: cada variable recibe su parte. Sirve hasta para intercambiar dos variables en una sola línea.',
    },
    { t: 'codigo', codigo: 'a = 1\nb = 2\na, b = b, a\nprint(a, b)' },
    {
      t: 'p',
      texto:
        'Una lista también puede tener listas adentro. Así se arma un tablero: cada lista de adentro es una fila, y se llega a una casilla con dos corchetes: `tablero[fila][columna]`.',
    },
    { t: 'compara', js: 'let t = [[1, 2], [3, 4]];\nconsole.log(t[1][0]);', py: 't = [[1, 2], [3, 4]]\nprint(t[1][0])' },
    {
      t: 'codigo',
      codigo:
        'triqui = [\n    ["X", "O", "X"],\n    [" ", "X", "O"],\n    ["O", " ", "X"],\n]\nprint(triqui[0][2])\nfor fila in triqui:\n    print(" | ".join(fila))',
    },
    {
      t: 'ojo',
      texto: 'Las tuplas no se dejan cambiar: `punto[0] = 9` da TypeError. Si algo tiene que cambiar, usa una lista.',
    },
  ],
  retos: [
    {
      id: 'pya-5-1',
      titulo: 'El tesoro',
      enunciado:
        'Desempaca la tupla tesoro en dos variables, x y y. Después muestra: El tesoro está en la columna (x) y la fila (y)',
      inicial: 'tesoro = (4, 7)\n',
      pista: 'x, y = tesoro y después un print con f-string.',
      solucion: 'tesoro = (4, 7)\nx, y = tesoro\nprint(f"El tesoro está en la columna {x} y la fila {y}")',
      pruebas: [
        { t: 'src', re: '\\w+\\s*,\\s*\\w+\\s*=\\s*tesoro\\b', msg: 'Desempacas: x, y = tesoro' },
        { t: 'linea', n: -1, igual: 'El tesoro está en la columna 4 y la fila 7', msg: 'Sale la columna 4 y la fila 7' },
      ],
    },
    {
      id: 'pya-5-2',
      titulo: 'Los zapatos al revés',
      enunciado:
        'Los zapatos quedaron al revés. Intercambia izquierda y derecha en una sola línea, sin variables de más. Después muestra izquierda y después derecha.',
      inicial: 'izquierda = "zapato derecho"\nderecha = "zapato izquierdo"\n',
      pista: 'izquierda, derecha = derecha, izquierda',
      solucion:
        'izquierda = "zapato derecho"\nderecha = "zapato izquierdo"\nizquierda, derecha = derecha, izquierda\nprint(izquierda)\nprint(derecha)',
      pruebas: [
        {
          t: 'src',
          re: 'izquierda\\s*,\\s*derecha\\s*=\\s*derecha\\s*,\\s*izquierda|derecha\\s*,\\s*izquierda\\s*=\\s*izquierda\\s*,\\s*derecha',
          msg: 'Intercambias en una sola línea',
        },
        {
          t: 'expr',
          code: 'izquierda == "zapato izquierdo" and derecha == "zapato derecho"',
          igual: 'True',
          msg: 'Cada zapato queda en su pie',
        },
        { t: 'salida', igual: 'zapato izquierdo\nzapato derecho', msg: 'Sale primero el izquierdo y después el derecho' },
      ],
    },
    {
      id: 'pya-5-3',
      titulo: 'Los cumpleaños',
      enunciado:
        'cumples es una lista de tuplas (nombre, día). Recórrela desempacando en el mismo for y muestra: (nombre) cumple el (día)',
      inicial: 'cumples = [("Ana", 12), ("Luis", 3), ("Sara", 25)]\n',
      pista: 'for nombre, dia in cumples: y adentro el print.',
      solucion: 'cumples = [("Ana", 12), ("Luis", 3), ("Sara", 25)]\nfor nombre, dia in cumples:\n    print(f"{nombre} cumple el {dia}")',
      pruebas: [
        { t: 'src', re: '\\bfor\\s+\\w+\\s*,\\s*\\w+\\s+in\\s+cumples\\b', msg: 'Desempacas en el for: for nombre, dia in cumples' },
        { t: 'salida', igual: 'Ana cumple el 12\nLuis cumple el 3\nSara cumple el 25', msg: 'Sale el cumpleaños de cada uno' },
      ],
    },
    {
      id: 'pya-5-4',
      titulo: 'Tu jugada',
      enunciado:
        'Juega una O en la esquina de abajo a la derecha (fila 2, columna 2). Después muestra el tablero: una fila por renglón, con las casillas separadas por " | ".',
      inicial: 'tablero = [\n    ["X", "O", "X"],\n    ["O", "X", " "],\n    [" ", " ", " "],\n]\n',
      pista: 'tablero[2][2] = "O". Para mostrar: for fila in tablero: print(" | ".join(fila))',
      solucion:
        'tablero = [\n    ["X", "O", "X"],\n    ["O", "X", " "],\n    [" ", " ", " "],\n]\ntablero[2][2] = "O"\nfor fila in tablero:\n    print(" | ".join(fila))',
      pruebas: [
        { t: 'src', re: 'tablero\\s*\\[\\s*2\\s*\\]\\s*\\[\\s*2\\s*\\]\\s*=', msg: 'Juegas en tablero[2][2]' },
        { t: 'expr', code: 'tablero[2][2]', igual: "'O'", msg: 'En la esquina queda una O' },
        { t: 'salida', igual: 'X | O | X\nO | X |\n  |   | O', msg: 'Se ve el tablero con la O en la esquina' },
      ],
    },
    {
      id: 'pya-5-5',
      titulo: '¡Triqui!',
      enunciado:
        'Crea gano(tablero, ficha): devuelve True si esa ficha tiene una fila completa o una columna completa, y False si no. (Las diagonales, si quieres, de premio.)',
      inicial: 'def gano(tablero, ficha):\n',
      pista:
        'Primero un for por las filas: si las tres casillas son ficha, return True. Después for c in range(3): mira tablero[0][c], tablero[1][c] y tablero[2][c]. Si nada, return False al final.',
      solucion:
        'def gano(tablero, ficha):\n    for fila in tablero:\n        if fila[0] == ficha and fila[1] == ficha and fila[2] == ficha:\n            return True\n    for c in range(3):\n        if tablero[0][c] == ficha and tablero[1][c] == ficha and tablero[2][c] == ficha:\n            return True\n    return False',
      pruebas: [
        {
          t: 'expr',
          code: 'gano([["X", "X", "X"], [" ", "O", " "], ["O", " ", " "]], "X")',
          igual: 'True',
          msg: 'Tres X en la fila de arriba → True',
        },
        {
          t: 'expr',
          code: 'gano([["X", " ", "X"], ["O", "O", "O"], ["X", " ", " "]], "O")',
          igual: 'True',
          msg: 'Tres O en la fila del medio → True',
        },
        {
          t: 'expr',
          code: 'gano([["O", "X", " "], ["O", "X", " "], [" ", "X", "O"]], "X")',
          igual: 'True',
          msg: 'Tres X en la columna del medio → True',
        },
        {
          t: 'expr',
          code: 'gano([["X", "X", "O"], [" ", "O", " "], [" ", " ", " "]], "X")',
          igual: 'False',
          msg: 'Dos X nada más → False',
        },
        {
          t: 'expr',
          code: 'gano([["X", "X", "X"], [" ", "O", " "], ["O", " ", " "]], "O")',
          igual: 'False',
          msg: 'Si ganó la X, la O no → False',
        },
      ],
    },
  ],
}

const L6: Leccion = {
  id: 'pya-6',
  numero: 6,
  titulo: 'Listas en una línea',
  emoji: '✨',
  minutos: 20,
  explicacion: [
    {
      t: 'p',
      texto:
        'Muchas veces haces una lista nueva a partir de otra: el doble de cada número, solo los pares, todo en mayúsculas. Con for y append se puede, pero Python tiene un atajo: la comprensión de listas.',
    },
    { t: 'compara', js: 'let dobles = numeros.map(n => n * 2);', py: 'dobles = [n * 2 for n in numeros]' },
    {
      t: 'codigo',
      codigo:
        'numeros = [1, 2, 3, 4]\n\n# Con for y append\ndobles = []\nfor n in numeros:\n    dobles.append(n * 2)\nprint(dobles)\n\n# En una línea\nprint([n * 2 for n in numeros])',
    },
    {
      t: 'p',
      texto:
        'Se lee casi en español: "n por 2, para cada n en numeros". Y se le puede poner un if al final para quedarse solo con algunos, como el filter de JavaScript.',
    },
    { t: 'compara', js: 'let pares = numeros.filter(n => n % 2 == 0);', py: 'pares = [n for n in numeros if n % 2 == 0]' },
    {
      t: 'codigo',
      codigo:
        'palabras = ["sol", "montaña", "mar", "río"]\nprint([p.upper() for p in palabras])\nprint([p for p in palabras if len(p) > 3])\nprint([x * x for x in range(1, 6)])',
    },
    {
      t: 'ojo',
      texto: 'Los corchetes son los que la vuelven lista: `[n * 2 for n in numeros]`. Sin ellos, Python no entiende.',
    },
  ],
  retos: [
    {
      id: 'pya-6-1',
      titulo: 'Los cuadrados',
      enunciado: 'En una sola línea, crea la lista cuadrados con los cuadrados del 1 al 10 (1, 4, 9 … 100). Después muéstrala.',
      inicial: '',
      pista: 'cuadrados = [x * x for x in range(1, 11)]. Ojo: range(1, 11) llega hasta el 10.',
      solucion: 'cuadrados = [x * x for x in range(1, 11)]\nprint(cuadrados)',
      pruebas: [
        { t: 'src', re: COMPRENSION, msg: 'Usas una comprensión: [… for … in …]' },
        { t: 'src', re: '\\.append\\s*\\(', not: true, msg: 'Sin append: todo en una línea' },
        { t: 'expr', code: 'cuadrados', igual: '[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]', msg: 'cuadrados va del 1 al 100' },
      ],
    },
    {
      id: 'pya-6-2',
      titulo: 'Todo a mitad de precio',
      enunciado: 'Crea la lista rebajados con cada precio a la mitad (usa // para que no salgan decimales). Muéstrala.',
      inicial: 'precios = [10000, 25000, 8000]\n',
      pista: 'rebajados = [p // 2 for p in precios]',
      solucion: 'precios = [10000, 25000, 8000]\nrebajados = [p // 2 for p in precios]\nprint(rebajados)',
      pruebas: [
        { t: 'src', re: COMPRENSION, msg: 'Usas una comprensión' },
        { t: 'src', re: '\\.append\\s*\\(', not: true, msg: 'Sin append' },
        { t: 'expr', code: 'rebajados', igual: '[5000, 12500, 4000]', msg: 'rebajados queda 5000, 12500 y 4000' },
      ],
    },
    {
      id: 'pya-6-3',
      titulo: 'Solo los pares',
      enunciado: 'Crea la lista pares, solo con los números pares de numeros, en una línea. Muéstrala.',
      inicial: 'numeros = [3, 8, 15, 22, 7, 10, 41]\n',
      pista: 'pares = [n for n in numeros if n % 2 == 0]',
      solucion: 'numeros = [3, 8, 15, 22, 7, 10, 41]\npares = [n for n in numeros if n % 2 == 0]\nprint(pares)',
      pruebas: [
        { t: 'src', re: COMPRENSION, msg: 'Usas una comprensión' },
        { t: 'src', re: '\\bif\\b', msg: 'Con un if adentro' },
        { t: 'expr', code: 'pares', igual: '[8, 22, 10]', msg: 'pares queda 8, 22 y 10' },
      ],
    },
    {
      id: 'pya-6-4',
      titulo: 'Los nombres largos',
      enunciado: 'Crea la lista largos con los nombres de más de 4 letras, en MAYÚSCULAS. Todo en una línea. Muéstrala.',
      inicial: 'nombres = ["Ana", "Valentina", "Luis", "Maximiliano", "Sara"]\n',
      pista: 'Adelante va lo que quieres (n.upper()), después el for, y al final el if con len(n) > 4.',
      solucion:
        'nombres = ["Ana", "Valentina", "Luis", "Maximiliano", "Sara"]\nlargos = [n.upper() for n in nombres if len(n) > 4]\nprint(largos)',
      pruebas: [
        { t: 'src', re: COMPRENSION, msg: 'Usas una comprensión' },
        { t: 'expr', code: 'largos', igual: "['VALENTINA', 'MAXIMILIANO']", msg: 'largos queda VALENTINA y MAXIMILIANO' },
      ],
    },
    {
      id: 'pya-6-5',
      titulo: 'La sumadora de muchos',
      enunciado:
        'Pide varios números separados por espacios, en un solo input. Pártelos con split y conviértelos con int en una comprensión, en la lista numeros. Muestra la suma.',
      inicial: 'texto = input("Escribe números separados por espacios: ")\n',
      entradas: ['4 8 15 16 23 42'],
      pista: 'numeros = [int(x) for x in texto.split()] y después print(sum(numeros)).',
      solucion:
        'texto = input("Escribe números separados por espacios: ")\nnumeros = [int(x) for x in texto.split()]\nprint(sum(numeros))',
      pruebas: [
        { t: 'src', re: COMPRENSION, msg: 'Usas una comprensión' },
        { t: 'expr', code: 'numeros', igual: '[4, 8, 15, 16, 23, 42]', msg: 'numeros es una lista de números (no de textos)' },
        { t: 'linea', n: -1, igual: '108', msg: 'Sale 108' },
        { t: 'linea', n: -1, igual: '6', entradas: ['1 2 3'], msg: 'Con 1 2 3 sale 6' },
      ],
    },
  ],
}

const L7: Leccion = {
  id: 'pya-7',
  numero: 7,
  titulo: 'Funciones a fondo',
  emoji: '🧰',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Ya sabes crear funciones con def y return. Tres trucos más. El primero: un parámetro puede traer un valor listo, que se usa si no le das otro.',
    },
    {
      t: 'compara',
      js: 'function saludar(nombre = "amigo") {\n  return "Hola " + nombre;\n}',
      py: 'def saludar(nombre="amigo"):\n    return "Hola " + nombre',
    },
    { t: 'codigo', codigo: 'def saludar(nombre="amigo"):\n    return "Hola " + nombre\n\nprint(saludar("Sara"))\nprint(saludar())' },
    {
      t: 'p',
      texto:
        'El segundo: una función puede devolver varias cosas. Un return con comas devuelve una tupla, y al recibirla la desempacas.',
    },
    {
      t: 'codigo',
      codigo: 'def dividir(a, b):\n    return a // b, a % b\n\ncociente, residuo = dividir(17, 5)\nprint(cociente, residuo)',
    },
    {
      t: 'p',
      texto:
        'El tercero: lo de adentro se queda adentro. Una variable creada dentro de una función solo existe ahí; afuera, Python no la conoce. Por eso, para sacar algo de una función se usa return.',
    },
    {
      t: 'codigo',
      codigo:
        'def cocinar():\n    receta = "arepa"\n    return receta\n\nplato = cocinar()\nprint(plato)\n# print(receta) daría NameError: receta solo vive dentro de cocinar',
    },
    {
      t: 'ojo',
      texto: 'Los parámetros con valor por defecto van al final: `def f(a, b=2)` sí, `def f(a=1, b)` no.',
    },
  ],
  retos: [
    {
      id: 'pya-7-1',
      titulo: 'Saludo con valor por defecto',
      enunciado:
        'Crea saludar(nombre) donde nombre vale "amigo" si no te lo dan. Que devuelva el texto Hola, (nombre). Así, saludar() devuelve "Hola, amigo".',
      inicial: '',
      pista: 'def saludar(nombre="amigo"): y adentro return f"Hola, {nombre}"',
      solucion: 'def saludar(nombre="amigo"):\n    return f"Hola, {nombre}"',
      pruebas: [
        { t: 'src', re: 'def\\s+saludar\\s*\\(\\s*nombre\\s*=', msg: 'nombre tiene valor por defecto' },
        { t: 'expr', code: 'saludar()', igual: "'Hola, amigo'", msg: 'saludar() devuelve "Hola, amigo"' },
        { t: 'expr', code: 'saludar("Ana")', igual: "'Hola, Ana'", msg: 'saludar("Ana") devuelve "Hola, Ana"' },
      ],
    },
    {
      id: 'pya-7-2',
      titulo: 'La potencia',
      enunciado:
        'Crea potencia(base, exponente) que devuelva base elevado a exponente. Si no te dan el exponente, que sea 2 (o sea, el cuadrado).',
      inicial: '',
      pista: 'def potencia(base, exponente=2): return base ** exponente',
      solucion: 'def potencia(base, exponente=2):\n    return base ** exponente',
      pruebas: [
        { t: 'src', re: 'def\\s+potencia\\s*\\(\\s*\\w+\\s*,\\s*\\w+\\s*=\\s*2\\s*\\)', msg: 'El exponente vale 2 por defecto' },
        { t: 'expr', code: 'potencia(5)', igual: '25', msg: 'potencia(5) devuelve 25' },
        { t: 'expr', code: 'potencia(2, 10)', igual: '1024', msg: 'potencia(2, 10) devuelve 1024' },
        { t: 'expr', code: 'potencia(3, 3)', igual: '27', msg: 'potencia(3, 3) devuelve 27' },
      ],
    },
    {
      id: 'pya-7-3',
      titulo: 'El menor y el mayor',
      enunciado:
        'Crea extremos(lista) que devuelva dos cosas: el menor y el mayor. Después recíbelos así: bajo, alto = extremos([7, 2, 9, 4]) y muéstralos con print(bajo, alto).',
      inicial: '',
      pista: 'return min(lista), max(lista)',
      solucion: 'def extremos(lista):\n    return min(lista), max(lista)\n\nbajo, alto = extremos([7, 2, 9, 4])\nprint(bajo, alto)',
      pruebas: [
        { t: 'expr', code: 'extremos([7, 2, 9, 4])', igual: '(2, 9)', msg: 'extremos([7, 2, 9, 4]) devuelve 2 y 9' },
        { t: 'expr', code: 'extremos([5])', igual: '(5, 5)', msg: 'extremos([5]) devuelve 5 y 5' },
        { t: 'src', re: '\\w+\\s*,\\s*\\w+\\s*=\\s*extremos\\s*\\(', msg: 'Recibes las dos cosas: bajo, alto = extremos(…)' },
        { t: 'salida', igual: '2 9', msg: 'Sale 2 9' },
      ],
    },
    {
      id: 'pya-7-4',
      titulo: 'Repartir dulces',
      enunciado:
        'Crea repartir(dulces, ninos) que devuelva cuántos le tocan a cada uno y cuántos sobran. Después pide los dulces y los niños con input y muestra: A cada uno le tocan (n) y sobran (m)',
      inicial: 'def repartir(dulces, ninos):\n',
      entradas: ['14', '3'],
      pista: 'return dulces // ninos, dulces % ninos. Afuera: cada_uno, sobran = repartir(d, n).',
      solucion:
        'def repartir(dulces, ninos):\n    return dulces // ninos, dulces % ninos\n\nd = int(input("¿Cuántos dulces? "))\nn = int(input("¿Cuántos niños? "))\ncada_uno, sobran = repartir(d, n)\nprint(f"A cada uno le tocan {cada_uno} y sobran {sobran}")',
      pruebas: [
        { t: 'expr', code: 'repartir(17, 5)', igual: '(3, 2)', msg: 'repartir(17, 5) devuelve 3 y 2' },
        { t: 'linea', n: -1, igual: 'A cada uno le tocan 4 y sobran 2', msg: '14 dulces entre 3: tocan 4, sobran 2' },
        { t: 'linea', n: -1, igual: 'A cada uno le tocan 4 y sobran 0', entradas: ['20', '5'], msg: '20 dulces entre 5: tocan 4, sobran 0' },
      ],
    },
    {
      id: 'pya-7-5',
      titulo: 'Lo de adentro se queda adentro',
      enunciado:
        'Este programa se rompe: total vive dentro de la función y afuera no existe. Arréglalo: que la función devuelva el total con return, y afuera guárdalo en una variable y muéstralo.',
      inicial:
        'def calcular_total(precios):\n    total = 0\n    for p in precios:\n        total = total + p\n\ncalcular_total([2000, 3500, 1500])\nprint(total)\n',
      pista: 'Al final de la función, return total. Afuera: total = calcular_total([…]) y después el print.',
      solucion:
        'def calcular_total(precios):\n    total = 0\n    for p in precios:\n        total = total + p\n    return total\n\ntotal = calcular_total([2000, 3500, 1500])\nprint(total)',
      pruebas: [
        { t: 'src', re: '\\breturn\\b', msg: 'La función usa return' },
        { t: 'src', re: '\\bglobal\\b', not: true, msg: 'Sin global: con return' },
        { t: 'expr', code: 'calcular_total([1, 2, 3])', igual: '6', msg: 'calcular_total([1, 2, 3]) devuelve 6' },
        { t: 'salida', igual: '7000', msg: 'Sale 7000' },
      ],
    },
  ],
}

const L8: Leccion = {
  id: 'pya-8',
  numero: 8,
  titulo: 'Funciones que se llaman a sí mismas',
  emoji: '🪆',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Una función puede llamarse a sí misma. Se llama recursión, y es como las muñecas rusas: cada una tiene adentro otra más pequeña, hasta llegar a la última, que ya no se abre.',
    },
    {
      t: 'p',
      texto:
        'Toda función recursiva tiene dos partes: el caso base, que responde directo y frena, y el paso, que se llama a sí misma con un problema un poquito más pequeño.',
    },
    {
      t: 'codigo',
      codigo:
        'def cuenta_regresiva(n):\n    if n == 0:\n        print("¡Despegue!")\n    else:\n        print(n)\n        cuenta_regresiva(n - 1)\n\ncuenta_regresiva(3)',
    },
    {
      t: 'p',
      texto:
        'El factorial de 4 es 4 × 3 × 2 × 1. Pero también es 4 × (el factorial de 3). Y el factorial de 1 es 1: ese es el caso base. Funciona igual en JavaScript.',
    },
    {
      t: 'compara',
      js: 'function factorial(n) {\n  if (n === 1) return 1;\n  return n * factorial(n - 1);\n}',
      py: 'def factorial(n):\n    if n == 1:\n        return 1\n    return n * factorial(n - 1)',
    },
    { t: 'codigo', codigo: 'def factorial(n):\n    if n == 1:\n        return 1\n    return n * factorial(n - 1)\n\nprint(factorial(4))\nprint(factorial(10))' },
    {
      t: 'ojo',
      texto:
        'Sin caso base, la función se llama para siempre y Python la frena con RecursionError. Y el paso tiene que acercarse al caso base: n - 1, no n + 1.',
    },
  ],
  retos: [
    {
      id: 'pya-8-1',
      titulo: 'Despegue',
      enunciado:
        'Crea cuenta_regresiva(n) sin for ni while: que muestre los números de n a 1 y después ¡Despegue! Llámala con 5.',
      inicial: 'def cuenta_regresiva(n):\n',
      pista: 'Caso base: si n == 0, print("¡Despegue!"). Si no: print(n) y cuenta_regresiva(n - 1).',
      solucion:
        'def cuenta_regresiva(n):\n    if n == 0:\n        print("¡Despegue!")\n    else:\n        print(n)\n        cuenta_regresiva(n - 1)\n\ncuenta_regresiva(5)',
      pruebas: [
        SIN_CICLOS,
        { t: 'src', re: 'cuenta_regresiva\\s*\\(\\s*\\w+\\s*-\\s*1\\s*\\)', msg: 'Se llama a sí misma con n - 1' },
        { t: 'salida', igual: '5\n4\n3\n2\n1\n¡Despegue!', msg: 'Sale 5, 4, 3, 2, 1 y ¡Despegue!' },
      ],
    },
    {
      id: 'pya-8-2',
      titulo: 'El factorial',
      enunciado: 'Crea factorial(n) con recursión, sin mirar el ejemplo. El factorial de 1 es 1.',
      inicial: 'def factorial(n):\n',
      pista: 'Si n == 1, return 1. Si no, return n * factorial(n - 1).',
      solucion: 'def factorial(n):\n    if n == 1:\n        return 1\n    return n * factorial(n - 1)',
      pruebas: [
        SIN_CICLOS,
        { t: 'src', re: 'return\\b.*\\bfactorial\\s*\\(', msg: 'Se llama a sí misma en el return' },
        { t: 'expr', code: 'factorial(1)', igual: '1', msg: 'factorial(1) es 1' },
        { t: 'expr', code: 'factorial(5)', igual: '120', msg: 'factorial(5) es 120' },
        { t: 'expr', code: 'factorial(10)', igual: '3628800', msg: 'factorial(10) es 3628800' },
      ],
    },
    {
      id: 'pya-8-3',
      titulo: 'Suma hasta n',
      enunciado:
        'Crea suma(n) que sume todos los números del 1 hasta n, con recursión. La suma hasta 0 es 0. (Piensa: suma(4) es 4 + suma(3).)',
      inicial: 'def suma(n):\n',
      pista: 'Si n == 0, return 0. Si no, return n + suma(n - 1).',
      solucion: 'def suma(n):\n    if n == 0:\n        return 0\n    return n + suma(n - 1)',
      pruebas: [
        SIN_CICLOS,
        { t: 'src', re: '\\bsum\\s*\\(', not: true, msg: 'Sin sum(): con recursión' },
        { t: 'expr', code: 'suma(0)', igual: '0', msg: 'suma(0) es 0' },
        { t: 'expr', code: 'suma(3)', igual: '6', msg: 'suma(3) es 6' },
        { t: 'expr', code: 'suma(100)', igual: '5050', msg: 'suma(100) es 5050' },
      ],
    },
    {
      id: 'pya-8-4',
      titulo: 'La potencia, con muñecas rusas',
      enunciado:
        'Crea potencia(base, exp) con recursión, sin usar **. Cualquier número elevado a 0 da 1. (Piensa: 2 elevado a 5 es 2 × 2 elevado a 4.)',
      inicial: 'def potencia(base, exp):\n',
      pista: 'Si exp == 0, return 1. Si no, return base * potencia(base, exp - 1).',
      solucion: 'def potencia(base, exp):\n    if exp == 0:\n        return 1\n    return base * potencia(base, exp - 1)',
      pruebas: [
        SIN_CICLOS,
        { t: 'src', re: '\\*\\*', not: true, msg: 'Sin **: con recursión' },
        { t: 'expr', code: 'potencia(5, 0)', igual: '1', msg: 'potencia(5, 0) es 1' },
        { t: 'expr', code: 'potencia(2, 10)', igual: '1024', msg: 'potencia(2, 10) es 1024' },
        { t: 'expr', code: 'potencia(3, 4)', igual: '81', msg: 'potencia(3, 4) es 81' },
      ],
    },
    {
      id: 'pya-8-5',
      titulo: 'Al revés',
      enunciado:
        'Crea al_reves(texto) que devuelva el texto al revés, con recursión y sin [::-1]. El texto vacío al revés es el texto vacío. (Piensa: "hola" al revés es "ola" al revés, más la "h" al final.)',
      inicial: 'def al_reves(texto):\n',
      pista: 'Si texto == "", return "". Si no, return al_reves(texto[1:]) + texto[0].',
      solucion: 'def al_reves(texto):\n    if texto == "":\n        return ""\n    return al_reves(texto[1:]) + texto[0]',
      pruebas: [
        SIN_CICLOS,
        { t: 'src', re: '\\[\\s*:\\s*:\\s*-\\s*1\\s*\\]', not: true, msg: 'Sin [::-1]: con recursión' },
        { t: 'expr', code: 'al_reves("")', igual: "''", msg: 'al_reves("") es ""' },
        { t: 'expr', code: 'al_reves("hola")', igual: "'aloh'", msg: 'al_reves("hola") es "aloh"' },
        { t: 'expr', code: 'al_reves("Python")', igual: "'nohtyP'", msg: 'al_reves("Python") es "nohtyP"' },
      ],
    },
  ],
}

const L9: Leccion = {
  id: 'pya-9',
  numero: 9,
  titulo: 'Cuando algo falla, y cajas de herramientas',
  emoji: '🛟',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Hasta ahora, si alguien escribía "doce" donde ibas a hacer int(), tu programa se rompía. Con try y except atrapas el error y sigues. Es el try/catch de JavaScript.',
    },
    {
      t: 'compara',
      js: 'try {\n  hacerAlgo();\n} catch (e) {\n  console.log("Algo falló");\n}',
      py: 'try:\n    hacer_algo()\nexcept:\n    print("Algo falló")',
    },
    {
      t: 'codigo',
      codigo: 'texto = input("¿Cuántos años tienes? ")\ntry:\n    edad = int(texto)\n    print("Tienes", edad)\nexcept ValueError:\n    print("Eso no es un número")',
      entradas: ['doce'],
    },
    {
      t: 'p',
      texto:
        'Después de except puedes decir qué error atrapas: ValueError (un dato que no sirve), ZeroDivisionError (dividir por cero) o KeyError (una llave que no está).',
    },
    {
      t: 'p',
      texto:
        'Además, Python trae cajas de herramientas listas, que se llaman módulos. Se abren con import. `random` sirve para el azar y `math` para las matemáticas.',
    },
    { t: 'compara', js: 'Math.floor(Math.random() * 6) + 1', py: 'random.randint(1, 6)' },
    {
      t: 'codigo',
      codigo:
        'import random\nimport math\n\nprint(random.randint(1, 6))\nprint(random.choice(["piedra", "papel", "tijera"]))\nprint(math.sqrt(81))\nprint(math.pi)',
    },
    {
      t: 'ojo',
      texto:
        'El import va arriba, antes de usar el módulo. Y lo que trae se usa con punto: `random.randint`, no `randint` solo.',
    },
  ],
  retos: [
    {
      id: 'pya-9-1',
      titulo: 'A prueba de errores',
      enunciado:
        'Pregunta la edad. Con try y except ValueError: si es un número, muestra: El año que viene tendrás (edad + 1). Si no, muestra: Eso no es un número',
      inicial: 'texto = input("¿Cuántos años tienes? ")\n',
      entradas: ['11'],
      pista: 'try: edad = int(texto) y el print. except ValueError: el otro print.',
      solucion:
        'texto = input("¿Cuántos años tienes? ")\ntry:\n    edad = int(texto)\n    print(f"El año que viene tendrás {edad + 1}")\nexcept ValueError:\n    print("Eso no es un número")',
      pruebas: [
        { t: 'src', re: '\\btry\\s*:', msg: 'Usas try' },
        { t: 'src', re: '\\bexcept\\b', msg: 'Usas except' },
        { t: 'linea', n: -1, igual: 'El año que viene tendrás 12', msg: 'Con 11 dice que tendrás 12' },
        { t: 'linea', n: -1, igual: 'Eso no es un número', entradas: ['once'], msg: 'Con “once” no se rompe' },
      ],
    },
    {
      id: 'pya-9-2',
      titulo: 'La calculadora segura',
      enunciado:
        'Pide dos números y muestra el primero dividido por el segundo. Si el segundo es 0, atrapa el ZeroDivisionError y muestra: No se puede dividir por cero',
      inicial: 'a = int(input("Primer número: "))\nb = int(input("Segundo número: "))\n',
      entradas: ['10', '4'],
      pista: 'try: print(a / b) y except ZeroDivisionError: el aviso.',
      solucion:
        'a = int(input("Primer número: "))\nb = int(input("Segundo número: "))\ntry:\n    print(a / b)\nexcept ZeroDivisionError:\n    print("No se puede dividir por cero")',
      pruebas: [
        { t: 'src', re: '\\bexcept\\s+ZeroDivisionError\\b', msg: 'Usas except ZeroDivisionError' },
        { t: 'linea', n: -1, igual: '2.5', msg: '10 entre 4 es 2.5' },
        { t: 'linea', n: -1, igual: 'No se puede dividir por cero', entradas: ['7', '0'], msg: '7 entre 0 no se rompe' },
      ],
    },
    {
      id: 'pya-9-3',
      titulo: 'El dado',
      enunciado:
        'Importa random y crea lanzar_dado(), que devuelva un número al azar del 1 al 6. Muestra un lanzamiento. (La revisión lo lanza cientos de veces.)',
      inicial: '',
      pista: 'import random arriba. def lanzar_dado(): return random.randint(1, 6). Y print(lanzar_dado()).',
      solucion: 'import random\n\ndef lanzar_dado():\n    return random.randint(1, 6)\n\nprint(lanzar_dado())',
      pruebas: [
        { t: 'src', re: '^\\s*(import\\s+random|from\\s+random\\s+import)', flags: 'm', msg: 'Importas random' },
        { t: 'expr', code: 'all(lanzar_dado() in (1, 2, 3, 4, 5, 6) for _ in range(300))', igual: 'True', msg: 'Siempre sale del 1 al 6' },
        { t: 'expr', code: 'len({lanzar_dado() for _ in range(300)})', igual: '6', msg: 'Salen los seis números' },
      ],
    },
    {
      id: 'pya-9-4',
      titulo: 'El círculo',
      enunciado:
        'Importa math y crea area_circulo(radio): pi por radio al cuadrado, redondeado a 2 decimales con round(numero, 2). Usa math.pi.',
      inicial: '',
      pista: 'return round(math.pi * radio ** 2, 2)',
      solucion: 'import math\n\ndef area_circulo(radio):\n    return round(math.pi * radio ** 2, 2)',
      pruebas: [
        { t: 'src', re: 'math\\.pi\\b', msg: 'Usas math.pi' },
        { t: 'expr', code: 'area_circulo(1)', igual: '3.14', msg: 'Con radio 1 da 3.14' },
        { t: 'expr', code: 'area_circulo(10)', igual: '314.16', msg: 'Con radio 10 da 314.16' },
        { t: 'expr', code: 'area_circulo(2.5)', igual: '19.63', msg: 'Con radio 2.5 da 19.63' },
      ],
    },
    {
      id: 'pya-9-5',
      titulo: 'Contra la compu',
      enunciado:
        'Crea jugada_compu(), que devuelva al azar "piedra", "papel" o "tijera" con random.choice. Después pregunta tu jugada: si no es una de las tres, muestra Esa jugada no existe; si sí, muestra La compu sacó (jugada de la compu).',
      inicial: 'import random\n\nopciones = ["piedra", "papel", "tijera"]\n',
      entradas: ['piedra'],
      pista: 'return random.choice(opciones). Abajo: if mia in opciones: … else: …',
      solucion:
        'import random\n\nopciones = ["piedra", "papel", "tijera"]\n\ndef jugada_compu():\n    return random.choice(opciones)\n\nmia = input("¿Piedra, papel o tijera? ")\nif mia in opciones:\n    print(f"La compu sacó {jugada_compu()}")\nelse:\n    print("Esa jugada no existe")',
      pruebas: [
        { t: 'src', re: 'random\\.choice\\s*\\(', msg: 'Usas random.choice' },
        {
          t: 'expr',
          code: '{jugada_compu() for _ in range(200)} == {"piedra", "papel", "tijera"}',
          igual: 'True',
          msg: 'La compu saca de las tres, y nada más',
        },
        { t: 'linea', n: -1, contiene: 'La compu sacó', msg: 'Con piedra, dice qué sacó la compu' },
        { t: 'linea', n: -1, igual: 'Esa jugada no existe', entradas: ['lápiz'], msg: 'Con lápiz, dice que no existe' },
      ],
    },
  ],
}

/** Llama varios métodos sobre un objeto nuevo y devuelve lo último: así se prueban las clases desde una expresión. */
const enMascota = (pasos: string) => `(lambda m: (${pasos},)[-1])(Mascota("Rex"))`

const L10: Leccion = {
  id: 'pya-10',
  numero: 10,
  titulo: 'Clases: inventa tus propios objetos',
  emoji: '🐶',
  minutos: 35,
  explicacion: [
    {
      t: 'p',
      texto:
        'Con una clase inventas tu propio tipo de dato. La clase es el molde, como el de las galletas, y cada objeto es una galleta hecha con ese molde. En JavaScript ya existían:',
    },
    {
      t: 'compara',
      js: 'class Perro {\n  constructor(nombre) {\n    this.nombre = nombre;\n  }\n  ladrar() {\n    console.log(this.nombre + " dice guau");\n  }\n}\nlet toby = new Perro("Toby");\ntoby.ladrar();',
      py: 'class Perro:\n    def __init__(self, nombre):\n        self.nombre = nombre\n\n    def ladrar(self):\n        print(self.nombre, "dice guau")\n\ntoby = Perro("Toby")\ntoby.ladrar()',
    },
    {
      t: 'p',
      texto:
        'Tres cosas cambian. `constructor` se llama `__init__`, con dos guiones bajos a cada lado. `this` se llama `self`, y va de primer parámetro en cada método. Y no se escribe `new`.',
    },
    {
      t: 'p',
      texto:
        'Lo que guardas en self son los atributos: los datos de cada objeto. Las funciones de adentro son los métodos: lo que el objeto sabe hacer. Cada objeto tiene sus propios datos:',
    },
    {
      t: 'codigo',
      codigo:
        'class Perro:\n    def __init__(self, nombre):\n        self.nombre = nombre\n        self.energia = 5\n\n    def jugar(self):\n        self.energia = self.energia - 1\n\ntoby = Perro("Toby")\nluna = Perro("Luna")\ntoby.jugar()\ntoby.jugar()\nprint(toby.nombre, toby.energia)\nprint(luna.nombre, luna.energia)',
    },
    {
      t: 'ojo',
      texto:
        'Si se te olvida self en el def de un método, Python reclama que le diste un dato de más. Y adentro, los atributos siempre llevan `self.` adelante: `self.energia`, no `energia`.',
    },
  ],
  retos: [
    {
      id: 'pya-10-1',
      titulo: 'Tu primera clase',
      enunciado:
        'Crea la clase Gato. En __init__ guarda el nombre en self.nombre. Agrégale el método maullar, que muestre: (nombre) dice miau. Después crea un gato llamado Michi y hazlo maullar.',
      inicial: 'class Gato:\n',
      pista:
        'def __init__(self, nombre): self.nombre = nombre. def maullar(self): print(self.nombre, "dice miau"). Afuera: michi = Gato("Michi") y michi.maullar().',
      solucion:
        'class Gato:\n    def __init__(self, nombre):\n        self.nombre = nombre\n\n    def maullar(self):\n        print(self.nombre, "dice miau")\n\nmichi = Gato("Michi")\nmichi.maullar()',
      pruebas: [
        { t: 'src', re: 'class\\s+Gato\\b', msg: 'Creas la clase Gato' },
        { t: 'src', re: 'def\\s+__init__\\s*\\(\\s*self\\b', msg: 'Tiene __init__ con self' },
        { t: 'expr', code: 'Gato("Tom").nombre', igual: "'Tom'", msg: 'Gato("Tom") se llama Tom' },
        { t: 'salida', igual: 'Michi dice miau', msg: 'Sale “Michi dice miau”' },
      ],
    },
    {
      id: 'pya-10-2',
      titulo: 'La alcancía',
      enunciado:
        'Crea la clase Alcancia: al crearse, self.saldo empieza en 0. El método meter(plata) le suma esa plata al saldo. Crea una alcancía, mete 2000, mete 500 y muestra el saldo.',
      inicial: 'class Alcancia:\n',
      pista: 'En __init__(self): self.saldo = 0. En meter(self, plata): self.saldo = self.saldo + plata.',
      solucion:
        'class Alcancia:\n    def __init__(self):\n        self.saldo = 0\n\n    def meter(self, plata):\n        self.saldo = self.saldo + plata\n\nmia = Alcancia()\nmia.meter(2000)\nmia.meter(500)\nprint(mia.saldo)',
      pruebas: [
        { t: 'expr', code: 'Alcancia().saldo', igual: '0', msg: 'Una alcancía nueva empieza en 0' },
        {
          t: 'expr',
          code: '(lambda a: (a.meter(100), a.meter(50), a.saldo)[-1])(Alcancia())',
          igual: '150',
          msg: 'Metiendo 100 y 50, el saldo es 150',
        },
        { t: 'salida', igual: '2500', msg: 'Sale 2500' },
      ],
    },
    {
      id: 'pya-10-3',
      titulo: 'Sacar plata',
      enunciado:
        'Agrégale a la alcancía el método sacar(plata): si alcanza, resta la plata y devuelve True. Si no alcanza, no resta nada y devuelve False.',
      inicial:
        'class Alcancia:\n    def __init__(self):\n        self.saldo = 0\n\n    def meter(self, plata):\n        self.saldo = self.saldo + plata\n\n\nmia = Alcancia()\nmia.meter(1000)\nprint(mia.sacar(300))\nprint(mia.sacar(5000))\nprint(mia.saldo)\n',
      pista:
        'def sacar(self, plata): dentro de la clase, alineado con meter. if plata <= self.saldo: resta y return True. Si no, return False.',
      solucion:
        'class Alcancia:\n    def __init__(self):\n        self.saldo = 0\n\n    def meter(self, plata):\n        self.saldo = self.saldo + plata\n\n    def sacar(self, plata):\n        if plata <= self.saldo:\n            self.saldo = self.saldo - plata\n            return True\n        return False\n\n\nmia = Alcancia()\nmia.meter(1000)\nprint(mia.sacar(300))\nprint(mia.sacar(5000))\nprint(mia.saldo)',
      pruebas: [
        {
          t: 'expr',
          code: '(lambda a: (a.meter(500), a.sacar(200), a.saldo)[-1])(Alcancia())',
          igual: '300',
          msg: 'Con 500, sacar 200 deja 300',
        },
        {
          t: 'expr',
          code: '(lambda a: (a.meter(500), a.sacar(200))[-1])(Alcancia())',
          igual: 'True',
          msg: 'Si alcanza, devuelve True',
        },
        {
          t: 'expr',
          code: '(lambda a: (a.meter(100), a.sacar(200), a.saldo)[-1])(Alcancia())',
          igual: '100',
          msg: 'Si no alcanza, no resta nada',
        },
        {
          t: 'expr',
          code: '(lambda a: (a.meter(100), a.sacar(200))[-1])(Alcancia())',
          igual: 'False',
          msg: 'Si no alcanza, devuelve False',
        },
        { t: 'salida', igual: 'True\nFalse\n700', msg: 'Sale True, False y 700' },
      ],
    },
    {
      id: 'pya-10-4',
      titulo: 'El rectángulo',
      enunciado:
        'Crea la clase Rectangulo, que recibe base y altura. Dale dos métodos: area(), que devuelve base por altura, y perimetro(), que devuelve la suma de los cuatro lados. Muestra el área y el perímetro de uno de 6 por 4.',
      inicial: 'class Rectangulo:\n',
      pista:
        '__init__(self, base, altura) guarda las dos en self. area(self): return self.base * self.altura. perimetro(self): return 2 * (self.base + self.altura).',
      solucion:
        'class Rectangulo:\n    def __init__(self, base, altura):\n        self.base = base\n        self.altura = altura\n\n    def area(self):\n        return self.base * self.altura\n\n    def perimetro(self):\n        return 2 * (self.base + self.altura)\n\nr = Rectangulo(6, 4)\nprint(r.area())\nprint(r.perimetro())',
      pruebas: [
        { t: 'expr', code: 'Rectangulo(3, 4).area()', igual: '12', msg: 'Un 3 por 4 tiene área 12' },
        { t: 'expr', code: 'Rectangulo(3, 4).perimetro()', igual: '14', msg: 'Un 3 por 4 tiene perímetro 14' },
        { t: 'expr', code: 'Rectangulo(10, 2).area()', igual: '20', msg: 'Un 10 por 2 tiene área 20' },
        { t: 'salida', igual: '24\n20', msg: 'Salen 24 y 20' },
      ],
    },
    {
      id: 'pya-10-5',
      titulo: 'La mascota virtual',
      enunciado:
        'El gran final. Crea la clase Mascota(nombre), que empieza con hambre 5 y felicidad 5.\n\n• comer(): el hambre baja 2, pero nunca menos de 0.\n• jugar(): la felicidad sube 1 y el hambre también sube 1.\n• estado(): devuelve "(nombre) tiene hambre" si el hambre es 8 o más; si no, "(nombre) está feliz" si la felicidad es 7 o más; si no, "(nombre) está bien".\n\nAl final crea tu mascota, juega con ella dos veces y muestra su estado.',
      inicial: 'class Mascota:\n',
      pista:
        'En comer: self.hambre = self.hambre - 2 y, si quedó menor que 0, lo vuelves 0. En estado, el orden de los if importa: primero el hambre.',
      solucion:
        'class Mascota:\n    def __init__(self, nombre):\n        self.nombre = nombre\n        self.hambre = 5\n        self.felicidad = 5\n\n    def comer(self):\n        self.hambre = self.hambre - 2\n        if self.hambre < 0:\n            self.hambre = 0\n\n    def jugar(self):\n        self.felicidad = self.felicidad + 1\n        self.hambre = self.hambre + 1\n\n    def estado(self):\n        if self.hambre >= 8:\n            return f"{self.nombre} tiene hambre"\n        if self.felicidad >= 7:\n            return f"{self.nombre} está feliz"\n        return f"{self.nombre} está bien"\n\n\nfirulais = Mascota("Firulais")\nfirulais.jugar()\nfirulais.jugar()\nprint(firulais.estado())',
      pruebas: [
        { t: 'expr', code: '(Mascota("Rex").hambre, Mascota("Rex").felicidad)', igual: '(5, 5)', msg: 'Empieza con hambre 5 y felicidad 5' },
        { t: 'expr', code: enMascota('m.comer(), m.hambre'), igual: '3', msg: 'Comer baja el hambre 2' },
        { t: 'expr', code: enMascota('m.comer(), m.comer(), m.comer(), m.hambre'), igual: '0', msg: 'El hambre nunca baja de 0' },
        { t: 'expr', code: enMascota('m.jugar(), (m.felicidad, m.hambre)'), igual: '(6, 6)', msg: 'Jugar sube la felicidad y el hambre' },
        {
          t: 'expr',
          code: `${enMascota('m.estado()')}.lower().replace("á", "a")`,
          igual: "'rex esta bien'",
          msg: 'Recién creada: “Rex está bien”',
        },
        {
          t: 'expr',
          code: `${enMascota('m.jugar(), m.jugar(), m.estado()')}.lower().replace("á", "a")`,
          igual: "'rex esta feliz'",
          msg: 'Después de jugar dos veces: “Rex está feliz”',
        },
        {
          t: 'expr',
          code: `${enMascota('m.jugar(), m.jugar(), m.jugar(), m.estado()')}.lower()`,
          igual: "'rex tiene hambre'",
          msg: 'Después de jugar tres veces: “Rex tiene hambre”',
        },
        { t: 'linea', n: -1, contiene: 'feliz', msg: 'Tu mascota termina feliz' },
      ],
    },
  ],
}

export const CURSO_PYTHON_AVANZADO: Curso = {
  id: 'python-avanzado',
  titulo: 'Python avanzado',
  emoji: '🚀',
  descripcion:
    'La segunda parte, para los que terminaron Python desde cero. Diccionarios, tuplas y tableros, listas en una línea, funciones que se llaman a sí mismas, errores que no rompen nada, azar, y tus propias clases: cierras con una mascota virtual.',
  lenguaje: 'python',
  requiere: 'python',
  despedida: 'Ya sabes lo que usan los programadores de Python todos los días. Lo que sigue es inventar tus propios programas.',
  lecciones: [L1, L2, L3, L4, L5, L6, L7, L8, L9, L10],
}
