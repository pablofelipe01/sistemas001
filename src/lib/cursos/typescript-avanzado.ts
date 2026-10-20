import type { Curso, Leccion } from './tipos'

/*
 * La segunda parte del curso de TypeScript: 10 lecciones de 5 retos, para unas
 * 4 horas y media de clase. Se abre cuando el alumno termina "TypeScript desde
 * JavaScript".
 *
 * Cuatro bloques: uniones con etiqueta (L1 y L2), tipos que salen de otros
 * (L3 y L4), funciones y genéricos (L5 a L7) y tuplas, unknown y errores (L8 a
 * L10, que cierra con un cajero que junta todo el curso).
 *
 * Igual que en la primera parte, el compilador es el de verdad y las pruebas
 * `rechaza` son las que comprueban que los tipos quedaron bien puestos. Ojo:
 * las pruebas `expr` se corren después de quitar los tipos, así que tienen que
 * ser JavaScript sin tipos.
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

/** La alarma de la lección 2: algo de tipo never. */
const CON_NEVER = { t: 'src', re: ':\\s*never\\b', msg: 'La alarma de never está en el default' } as const
const SIN_CICLOS = { t: 'src', re: '\\b(for|while)\\b', not: true, msg: 'Sin for ni while: con map, filter o reduce' } as const

const L1: Leccion = {
  id: 'tsa-1',
  numero: 1,
  titulo: 'Uniones con etiqueta',
  emoji: '🏷️',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'En el primer curso uniste tipos sencillos: `number | string`. Ahora vas a unir objetos. Piensa en figuras: un círculo tiene radio, y un rectángulo tiene base y altura. Para saber cuál es cuál, cada uno lleva una etiqueta: un dato `tipo` con un valor fijo.',
    },
    {
      t: 'codigo',
      codigo:
        'type Circulo = { tipo: "circulo"; radio: number }\ntype Rectangulo = { tipo: "rectangulo"; base: number; altura: number }\ntype Figura = Circulo | Rectangulo\n\nconst f: Figura = { tipo: "rectangulo", base: 4, altura: 3 }\nconsole.log(f.tipo, f.base)',
    },
    {
      t: 'p',
      texto:
        'Lo mágico pasa cuando preguntas por la etiqueta. Adentro del `if`, TypeScript ya sabe cuál de las dos es, y te deja usar sus datos.',
    },
    {
      t: 'codigo',
      codigo:
        'type Circulo = { tipo: "circulo"; radio: number }\ntype Rectangulo = { tipo: "rectangulo"; base: number; altura: number }\ntype Figura = Circulo | Rectangulo\n\nfunction area(f: Figura): number {\n  if (f.tipo === "circulo") {\n    return 3 * f.radio * f.radio   // aquí f es un Circulo\n  }\n  return f.base * f.altura         // y aquí, un Rectangulo\n}\n\nconsole.log(area({ tipo: "circulo", radio: 2 }))\nconsole.log(area({ tipo: "rectangulo", base: 4, altura: 3 }))',
    },
    {
      t: 'p',
      texto: 'Con `switch` queda todavía más ordenado: un `case` por cada etiqueta.',
    },
    {
      t: 'codigo',
      codigo:
        'type Mensaje =\n  | { tipo: "texto"; texto: string }\n  | { tipo: "foto"; url: string }\n\nfunction mostrar(m: Mensaje): string {\n  switch (m.tipo) {\n    case "texto":\n      return m.texto\n    case "foto":\n      return "Foto: " + m.url\n  }\n}\n\nconsole.log(mostrar({ tipo: "texto", texto: "¿Vamos al parque?" }))\nconsole.log(mostrar({ tipo: "foto", url: "perrito.jpg" }))',
    },
    {
      t: 'ojo',
      texto:
        'Antes de preguntar por la etiqueta solo puedes usar lo que tienen todos. `f.radio` afuera del `if` no pasa: ¿y si es un rectángulo?',
    },
  ],
  retos: [
    {
      id: 'tsa-1-1',
      titulo: 'Perro o pez',
      enunciado:
        'Ya están los tipos Perro y Pez. Crea el tipo Mascota, que puede ser uno o el otro. Después crea nemo: una Mascota de tipo pez, que se llama Nemo y es naranja. Muestra nemo.nombre.',
      inicial:
        'type Perro = { tipo: "perro"; nombre: string; raza: string }\ntype Pez = { tipo: "pez"; nombre: string; color: string }\n\n// Crea aquí el tipo Mascota y a nemo\n',
      pista: 'type Mascota = Perro | Pez, y después const nemo: Mascota = { tipo: "pez", nombre: "Nemo", color: "naranja" }',
      solucion:
        'type Perro = { tipo: "perro"; nombre: string; raza: string }\ntype Pez = { tipo: "pez"; nombre: string; color: string }\n\ntype Mascota = Perro | Pez\n\nconst nemo: Mascota = { tipo: "pez", nombre: "Nemo", color: "naranja" }\nconsole.log(nemo.nombre)',
      pruebas: [
        { t: 'src', re: '\\btype\\s+Mascota\\s*=', msg: 'Creas el tipo Mascota' },
        { t: 'src', re: anotado('nemo', 'Mascota\\b'), msg: 'nemo es una Mascota' },
        { t: 'salida', igual: 'Nemo', msg: 'Sale Nemo' },
        { t: 'rechaza', code: 'const _g: Mascota = { tipo: "gato", nombre: "Tom" }', msg: 'Una Mascota solo puede ser perro o pez' },
        { t: 'rechaza', code: 'const _d: Mascota = { tipo: "pez", nombre: "Dory", raza: "azul" }', msg: 'Un pez no tiene raza' },
      ],
    },
    {
      id: 'tsa-1-2',
      titulo: '¿Qué figura es?',
      enunciado:
        'Dale ▶ Correr: TypeScript no deja usar lado, porque la figura podría ser un círculo. Pregunta primero por f.tipo. Si es un círculo, el área es 3 * radio * radio (usamos 3 para que dé redondo); si no, es lado * lado.',
      inicial:
        'type Circulo = { tipo: "circulo"; radio: number }\ntype Cuadrado = { tipo: "cuadrado"; lado: number }\ntype Figura = Circulo | Cuadrado\n\nfunction area(f: Figura): number {\n  return f.lado * f.lado\n}\n\nconsole.log(area({ tipo: "cuadrado", lado: 5 }))\n',
      pista: 'if (f.tipo === "circulo") return 3 * f.radio * f.radio. Debajo del if, f ya es un Cuadrado.',
      solucion:
        'type Circulo = { tipo: "circulo"; radio: number }\ntype Cuadrado = { tipo: "cuadrado"; lado: number }\ntype Figura = Circulo | Cuadrado\n\nfunction area(f: Figura): number {\n  if (f.tipo === "circulo") return 3 * f.radio * f.radio\n  return f.lado * f.lado\n}\n\nconsole.log(area({ tipo: "cuadrado", lado: 5 }))',
      pruebas: [
        { t: 'src', re: '\\.tipo\\s*===?|switch\\s*\\(\\s*\\w+\\.tipo', msg: 'Preguntas por la etiqueta tipo' },
        { t: 'salida', igual: '25', msg: 'El cuadrado de lado 5 da 25' },
        { t: 'expr', code: 'area({ tipo: "circulo", radio: 2 })', igual: '12', msg: 'Un círculo de radio 2 da 12' },
        { t: 'expr', code: 'area({ tipo: "cuadrado", lado: 3 })', igual: '9', msg: 'Un cuadrado de lado 3 da 9' },
      ],
    },
    {
      id: 'tsa-1-3',
      titulo: 'Mensajes del chat',
      enunciado:
        'Escribe mostrar con un switch por m.tipo. Un texto se muestra tal cual. Una foto: Foto: (url). Un sticker: Sticker: (nombre).',
      inicial:
        'type Mensaje =\n  | { tipo: "texto"; texto: string }\n  | { tipo: "foto"; url: string }\n  | { tipo: "sticker"; nombre: string }\n\nfunction mostrar(m: Mensaje): string {\n  \n}\n\nconsole.log(mostrar({ tipo: "sticker", nombre: "gatito" }))\n',
      pista: 'switch (m.tipo) { case "texto": return m.texto; case "foto": return "Foto: " + m.url; … }',
      solucion:
        'type Mensaje =\n  | { tipo: "texto"; texto: string }\n  | { tipo: "foto"; url: string }\n  | { tipo: "sticker"; nombre: string }\n\nfunction mostrar(m: Mensaje): string {\n  switch (m.tipo) {\n    case "texto":\n      return m.texto\n    case "foto":\n      return "Foto: " + m.url\n    case "sticker":\n      return "Sticker: " + m.nombre\n  }\n}\n\nconsole.log(mostrar({ tipo: "sticker", nombre: "gatito" }))',
      pruebas: [
        { t: 'src', re: '\\bswitch\\s*\\(', msg: 'Usas switch' },
        { t: 'expr', code: 'mostrar({ tipo: "texto", texto: "hola" })', igual: '"hola"', msg: 'Un texto sale tal cual' },
        { t: 'expr', code: 'mostrar({ tipo: "foto", url: "playa.jpg" })', igual: '"Foto: playa.jpg"', msg: 'Una foto sale como “Foto: playa.jpg”' },
        { t: 'expr', code: 'mostrar({ tipo: "sticker", nombre: "gatito" })', igual: '"Sticker: gatito"', msg: 'Un sticker sale como “Sticker: gatito”' },
        { t: 'rechaza', code: 'mostrar({ tipo: "audio", segundos: 3 })', msg: 'Un audio no es un Mensaje' },
      ],
    },
    {
      id: 'tsa-1-4',
      titulo: 'Las vueltas',
      enunciado:
        'Ahora creas tú la unión. Un Pago puede ser en efectivo (con el billete, un number) o con tarjeta (con los últimos números, un string). Escribe vueltas: recibe el pago y el precio, y devuelve cuánto hay que devolver. En efectivo es billete - precio; con tarjeta, 0.',
      inicial: '',
      pista:
        'type Pago = { tipo: "efectivo"; billete: number } | { tipo: "tarjeta"; ultimos: string }. Después function vueltas(p: Pago, precio: number): number',
      solucion:
        'type Pago =\n  | { tipo: "efectivo"; billete: number }\n  | { tipo: "tarjeta"; ultimos: string }\n\nfunction vueltas(p: Pago, precio: number): number {\n  if (p.tipo === "efectivo") return p.billete - precio\n  return 0\n}\n\nconsole.log(vueltas({ tipo: "efectivo", billete: 10000 }, 7500))',
      pruebas: [
        { t: 'src', re: '\\btype\\s+Pago\\s*=', msg: 'Creas el tipo Pago' },
        { t: 'expr', code: 'vueltas({ tipo: "efectivo", billete: 10000 }, 7500)', igual: '2500', msg: 'Con un billete de 10000 y 7500 de precio: 2500' },
        { t: 'expr', code: 'vueltas({ tipo: "tarjeta", ultimos: "1234" }, 7500)', igual: '0', msg: 'Con tarjeta: 0' },
        { t: 'rechaza', code: 'vueltas({ tipo: "tarjeta", billete: 5000 }, 100)', msg: 'Una tarjeta no trae billete' },
        { t: 'rechaza', code: 'vueltas({ tipo: "efectivo" }, 100)', msg: 'El efectivo trae su billete' },
        { t: 'rechaza', code: 'vueltas({ tipo: "cheque", billete: 5000 }, 100)', msg: 'Solo hay efectivo y tarjeta' },
      ],
    },
    {
      id: 'tsa-1-5',
      titulo: 'El robot',
      enunciado:
        'El robot recibe una lista de órdenes. Escribe ejecutar: recorre la lista y, por cada orden, muestra lo que hace:\n\navanzar → Avanzo (pasos) pasos\ngirar → Giro a la (lado)\npitar → ¡Pi pi!',
      inicial:
        'type Orden =\n  | { tipo: "avanzar"; pasos: number }\n  | { tipo: "girar"; lado: "izquierda" | "derecha" }\n  | { tipo: "pitar" }\n\n// Escribe aquí la función ejecutar\n\nejecutar([\n  { tipo: "avanzar", pasos: 3 },\n  { tipo: "girar", lado: "derecha" },\n  { tipo: "pitar" },\n  { tipo: "avanzar", pasos: 2 },\n])\n',
      pista: 'function ejecutar(ordenes: Orden[]): void { for (const o of ordenes) { switch (o.tipo) { … } } }',
      solucion:
        'type Orden =\n  | { tipo: "avanzar"; pasos: number }\n  | { tipo: "girar"; lado: "izquierda" | "derecha" }\n  | { tipo: "pitar" }\n\nfunction ejecutar(ordenes: Orden[]): void {\n  for (const o of ordenes) {\n    switch (o.tipo) {\n      case "avanzar":\n        console.log("Avanzo " + o.pasos + " pasos")\n        break\n      case "girar":\n        console.log("Giro a la " + o.lado)\n        break\n      case "pitar":\n        console.log("¡Pi pi!")\n        break\n    }\n  }\n}\n\nejecutar([\n  { tipo: "avanzar", pasos: 3 },\n  { tipo: "girar", lado: "derecha" },\n  { tipo: "pitar" },\n  { tipo: "avanzar", pasos: 2 },\n])',
      pruebas: [
        { t: 'src', re: '\\bfunction\\s+ejecutar\\s*\\(\\s*\\w+\\s*:\\s*Orden\\s*\\[\\s*\\]', msg: 'ejecutar recibe una lista Orden[]' },
        { t: 'salida', igual: 'Avanzo 3 pasos\nGiro a la derecha\n¡Pi pi!\nAvanzo 2 pasos', msg: 'El robot avanza, gira, pita y vuelve a avanzar' },
        { t: 'rechaza', code: 'ejecutar([{ tipo: "volar" }])', msg: 'El robot no vuela' },
      ],
    },
  ],
}

const L2: Leccion = {
  id: 'tsa-2',
  numero: 2,
  titulo: 'Ningún caso por fuera',
  emoji: '🚨',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        '¿Qué pasa si mañana le agregas un triángulo a Figura? Cada `switch` que pregunta por la etiqueta tendría que aprender el caso nuevo, y si se te olvida uno, nadie te avisa. Para eso está `never`: el tipo de lo que no puede pasar. Ningún valor cabe en él.',
    },
    {
      t: 'codigo',
      codigo:
        'type Luz = "rojo" | "amarillo" | "verde"\n\nfunction queHago(luz: Luz): string {\n  switch (luz) {\n    case "rojo":\n      return "Para"\n    case "amarillo":\n      return "Cuidado"\n    case "verde":\n      return "Pasa"\n    default: {\n      const nunca: never = luz   // aquí no puede llegar nada\n      return nunca\n    }\n  }\n}\n\nconsole.log(queHago("verde"))',
    },
    {
      t: 'p',
      texto:
        'Es una alarma. Si alguien agrega "azul" a Luz y no le enseña al `switch`, el "azul" cae en el `default`, y como no cabe en `never`, TypeScript se queja. El error te dice justo cuál caso se te olvidó.',
    },
    {
      t: 'p',
      texto:
        'Otra forma de preguntar es `in`: `"ruedas" in v` dice si el objeto tiene esa llave. Y si quieres guardar la pregunta en una función, haces un guardián: una función que devuelve `x is Tipo`. Así le cuentas a TypeScript lo que descubriste.',
    },
    {
      t: 'codigo',
      codigo:
        'type Gato = { nombre: string; maulla: boolean }\ntype Perro = { nombre: string; ladra: boolean }\n\nfunction esGato(a: Gato | Perro): a is Gato {\n  return "maulla" in a\n}\n\nfunction saludar(a: Gato | Perro): string {\n  if (esGato(a)) return a.nombre + " maulla: " + a.maulla\n  return a.nombre + " ladra: " + a.ladra\n}\n\nconsole.log(saludar({ nombre: "Michi", maulla: true }))\nconsole.log(saludar({ nombre: "Rex", ladra: true }))',
    },
    {
      t: 'ojo',
      texto:
        'El guardián tiene que decir la verdad: si `esGato` devuelve true para un perro, TypeScript te cree y el error aparece cuando el programa ya corre.',
    },
  ],
  retos: [
    {
      id: 'tsa-2-1',
      titulo: 'Falta un caso',
      enunciado:
        'Alguien le agregó el triángulo a Figura, pero no a la función. Corre el programa y mira cómo salta la alarma. Agrega el caso que falta: el área del triángulo es base * altura / 2.',
      inicial:
        'type Figura =\n  | { tipo: "circulo"; radio: number }\n  | { tipo: "cuadrado"; lado: number }\n  | { tipo: "triangulo"; base: number; altura: number }\n\nfunction area(f: Figura): number {\n  switch (f.tipo) {\n    case "circulo":\n      return 3 * f.radio * f.radio\n    case "cuadrado":\n      return f.lado * f.lado\n    default: {\n      const nunca: never = f\n      return nunca\n    }\n  }\n}\n\nconsole.log(area({ tipo: "triangulo", base: 6, altura: 4 }))\n',
      pista: 'Agrega case "triangulo": return f.base * f.altura / 2 antes del default.',
      solucion:
        'type Figura =\n  | { tipo: "circulo"; radio: number }\n  | { tipo: "cuadrado"; lado: number }\n  | { tipo: "triangulo"; base: number; altura: number }\n\nfunction area(f: Figura): number {\n  switch (f.tipo) {\n    case "circulo":\n      return 3 * f.radio * f.radio\n    case "cuadrado":\n      return f.lado * f.lado\n    case "triangulo":\n      return f.base * f.altura / 2\n    default: {\n      const nunca: never = f\n      return nunca\n    }\n  }\n}\n\nconsole.log(area({ tipo: "triangulo", base: 6, altura: 4 }))',
      pruebas: [
        CON_NEVER,
        { t: 'salida', igual: '12', msg: 'El triángulo de base 6 y altura 4 da 12' },
        { t: 'expr', code: 'area({ tipo: "circulo", radio: 1 })', igual: '3', msg: 'El círculo sigue bien' },
        { t: 'expr', code: 'area({ tipo: "cuadrado", lado: 3 })', igual: '9', msg: 'El cuadrado sigue bien' },
      ],
    },
    {
      id: 'tsa-2-2',
      titulo: 'Pon la alarma',
      enunciado:
        'Este switch funciona, pero no tiene alarma. Agrégale un default con una variable de tipo never, como en la explicación.',
      inicial:
        'type Animal = "perro" | "gato" | "vaca"\n\nfunction sonido(a: Animal): string {\n  switch (a) {\n    case "perro":\n      return "guau"\n    case "gato":\n      return "miau"\n    case "vaca":\n      return "muu"\n  }\n}\n\nconsole.log(sonido("vaca"))\n',
      pista: 'default: { const nunca: never = a; return nunca }',
      solucion:
        'type Animal = "perro" | "gato" | "vaca"\n\nfunction sonido(a: Animal): string {\n  switch (a) {\n    case "perro":\n      return "guau"\n    case "gato":\n      return "miau"\n    case "vaca":\n      return "muu"\n    default: {\n      const nunca: never = a\n      return nunca\n    }\n  }\n}\n\nconsole.log(sonido("vaca"))',
      pruebas: [
        { t: 'src', re: '\\bdefault\\s*:', msg: 'El switch tiene default' },
        CON_NEVER,
        { t: 'salida', igual: 'muu', msg: 'La vaca dice muu' },
        { t: 'expr', code: 'sonido("gato")', igual: '"miau"', msg: 'El gato dice miau' },
      ],
    },
    {
      id: 'tsa-2-3',
      titulo: '¿Tiene ruedas?',
      enunciado:
        'Aquí no hay etiqueta. Usa in para saber si el vehículo tiene ruedas, y devuelve (marca) tiene (ruedas) ruedas. Si no, es un barco: (marca) tiene (velas) velas.',
      inicial:
        'type Carro = { marca: string; ruedas: number }\ntype Barco = { marca: string; velas: number }\n\nfunction describir(v: Carro | Barco): string {\n  \n}\n\nconsole.log(describir({ marca: "Renault", ruedas: 4 }))\n',
      pista: 'if ("ruedas" in v) return v.marca + " tiene " + v.ruedas + " ruedas"',
      solucion:
        'type Carro = { marca: string; ruedas: number }\ntype Barco = { marca: string; velas: number }\n\nfunction describir(v: Carro | Barco): string {\n  if ("ruedas" in v) return v.marca + " tiene " + v.ruedas + " ruedas"\n  return v.marca + " tiene " + v.velas + " velas"\n}\n\nconsole.log(describir({ marca: "Renault", ruedas: 4 }))',
      pruebas: [
        { t: 'src', re: '"(ruedas|velas)"\\s+in\\b', msg: 'Usas in' },
        { t: 'salida', igual: 'Renault tiene 4 ruedas', msg: 'Sale “Renault tiene 4 ruedas”' },
        { t: 'expr', code: 'describir({ marca: "Velero", velas: 2 })', igual: '"Velero tiene 2 velas"', msg: 'Un barco de 2 velas' },
        { t: 'expr', code: 'describir({ marca: "Mazda", ruedas: 4 })', igual: '"Mazda tiene 4 ruedas"', msg: 'Un carro de 4 ruedas' },
      ],
    },
    {
      id: 'tsa-2-4',
      titulo: 'Un guardián',
      enunciado:
        'Escribe el guardián esNumero: recibe un number | string y devuelve x is number. Después úsalo en sumarNumeros, que suma solo los números de la lista y se salta los textos.\n\nsumarNumeros([1, "a", 4]) → 5',
      inicial: '',
      pista:
        'function esNumero(x: number | string): x is number { return typeof x === "number" }. En sumarNumeros, un for…of con if (esNumero(x)) total = total + x',
      solucion:
        'function esNumero(x: number | string): x is number {\n  return typeof x === "number"\n}\n\nfunction sumarNumeros(lista: (number | string)[]): number {\n  let total = 0\n  for (const x of lista) {\n    if (esNumero(x)) total = total + x\n  }\n  return total\n}\n\nconsole.log(sumarNumeros([1, "a", 4]))',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*\\w+\\s+is\\s+number\\b', msg: 'esNumero devuelve x is number' },
        { t: 'expr', code: 'esNumero(5)', igual: 'true', msg: 'esNumero(5) es true' },
        { t: 'expr', code: 'esNumero("5")', igual: 'false', msg: 'esNumero("5") es false' },
        { t: 'expr', code: 'sumarNumeros([1, "a", 4])', igual: '5', msg: 'sumarNumeros([1, "a", 4]) es 5' },
        { t: 'expr', code: 'sumarNumeros(["x", "y"])', igual: '0', msg: 'Sin números, da 0' },
        {
          t: 'rechaza',
          code: 'function _prueba(v: number | string) {\n  if (esNumero(v)) return v === "hola"\n}',
          msg: 'Adentro del if (esNumero(v)), TypeScript ya sabe que v es un número',
        },
      ],
    },
    {
      id: 'tsa-2-5',
      titulo: 'El zoológico',
      enunciado:
        'A cada animal le toca su comida. Escribe comida con un switch y su alarma de never:\n\nleón → (kilos) kilos de carne\njirafa → (hojas) hojas\npingüino → (pescados) pescados',
      inicial:
        'type Animal =\n  | { tipo: "leon"; kilos: number }\n  | { tipo: "jirafa"; hojas: number }\n  | { tipo: "pinguino"; pescados: number }\n\n// Escribe aquí la función comida\n\nconsole.log(comida({ tipo: "jirafa", hojas: 20 }))\n',
      pista: 'function comida(a: Animal): string { switch (a.tipo) { case "leon": return a.kilos + " kilos de carne" … default: … } }',
      solucion:
        'type Animal =\n  | { tipo: "leon"; kilos: number }\n  | { tipo: "jirafa"; hojas: number }\n  | { tipo: "pinguino"; pescados: number }\n\nfunction comida(a: Animal): string {\n  switch (a.tipo) {\n    case "leon":\n      return a.kilos + " kilos de carne"\n    case "jirafa":\n      return a.hojas + " hojas"\n    case "pinguino":\n      return a.pescados + " pescados"\n    default: {\n      const nunca: never = a\n      return nunca\n    }\n  }\n}\n\nconsole.log(comida({ tipo: "jirafa", hojas: 20 }))',
      pruebas: [
        { t: 'src', re: '\\bswitch\\s*\\(', msg: 'Usas switch' },
        CON_NEVER,
        { t: 'salida', igual: '20 hojas', msg: 'La jirafa come 20 hojas' },
        { t: 'expr', code: 'comida({ tipo: "leon", kilos: 3 })', igual: '"3 kilos de carne"', msg: 'El león come 3 kilos de carne' },
        { t: 'expr', code: 'comida({ tipo: "pinguino", pescados: 5 })', igual: '"5 pescados"', msg: 'El pingüino come 5 pescados' },
        { t: 'rechaza', code: 'comida({ tipo: "leon", hojas: 3 })', msg: 'El león no come hojas' },
      ],
    },
  ],
}

const L3: Leccion = {
  id: 'tsa-3',
  numero: 3,
  titulo: 'Tipos que salen de otros',
  emoji: '🔑',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Hasta ahora escribías cada tipo a mano. Pero un tipo también se puede sacar de otro, y así, si cambias uno, los demás cambian solos. Tres herramientas: `keyof`, `typeof` y `as const`.',
    },
    { t: 'p', texto: '`keyof Tipo` te da la unión de sus llaves.' },
    {
      t: 'codigo',
      codigo:
        'type Jugador = { nombre: string; goles: number; asistencias: number }\ntype Dato = keyof Jugador   // "nombre" | "goles" | "asistencias"\n\nconst d: Dato = "goles"\nconsole.log(d)',
    },
    { t: 'p', texto: '`typeof variable`, en un lugar donde va un tipo, copia el tipo de esa variable.' },
    {
      t: 'codigo',
      codigo:
        'const config = { volumen: 7, musica: true }\ntype Config = typeof config   // { volumen: number; musica: boolean }\n\nconst otra: Config = { volumen: 3, musica: false }\nconsole.log(otra.volumen)',
    },
    {
      t: 'p',
      texto:
        'Y `as const` congela una lista: ya no es un `string[]` cualquiera, sino exactamente esos textos. Con `[number]` al final sacas la unión de lo que tiene adentro.',
    },
    {
      t: 'codigo',
      codigo:
        'const COLORES = ["rojo", "verde", "azul"] as const\ntype Color = (typeof COLORES)[number]   // "rojo" | "verde" | "azul"\n\nconst favorito: Color = "verde"\nconsole.log(COLORES.length, favorito)',
    },
    {
      t: 'ojo',
      texto:
        'Hay dos `typeof`. El de siempre, adentro de un `if` (`typeof x === "number"`), pregunta mientras el programa corre. El de los tipos, después de los dos puntos o de `type X =`, copia un tipo antes de correr.',
    },
  ],
  retos: [
    {
      id: 'tsa-3-1',
      titulo: 'Las llaves',
      enunciado: 'Crea el tipo Llave con las llaves de Mascota, usando keyof. Después crea campo, de tipo Llave, con edad, y muéstralo.',
      inicial: 'type Mascota = { nombre: string; edad: number; especie: string }\n\n',
      pista: 'type Llave = keyof Mascota, y const campo: Llave = "edad"',
      solucion:
        'type Mascota = { nombre: string; edad: number; especie: string }\n\ntype Llave = keyof Mascota\nconst campo: Llave = "edad"\nconsole.log(campo)',
      pruebas: [
        { t: 'src', re: '\\btype\\s+Llave\\s*=\\s*keyof\\s+Mascota\\b', msg: 'Llave es keyof Mascota' },
        { t: 'src', re: anotado('campo', 'Llave\\b'), msg: 'campo es una Llave' },
        { t: 'salida', igual: 'edad', msg: 'Sale edad' },
        { t: 'rechaza', code: 'const _l: Llave = "color"', msg: 'color no es una llave de Mascota' },
      ],
    },
    {
      id: 'tsa-3-2',
      titulo: 'Leer cualquier dato',
      enunciado:
        'Todos los datos del Marcador son números. Escribe cuanto: recibe un marcador y una llave (keyof Marcador) y devuelve ese dato.\n\ncuanto(m, "goles") → los goles de m',
      inicial:
        'type Marcador = { goles: number; asistencias: number; tarjetas: number }\n\n// Escribe aquí la función cuanto\n\nconst yo: Marcador = { goles: 3, asistencias: 1, tarjetas: 0 }\nconsole.log(cuanto(yo, "goles"))\n',
      pista: 'function cuanto(m: Marcador, llave: keyof Marcador): number { return m[llave] }',
      solucion:
        'type Marcador = { goles: number; asistencias: number; tarjetas: number }\n\nfunction cuanto(m: Marcador, llave: keyof Marcador): number {\n  return m[llave]\n}\n\nconst yo: Marcador = { goles: 3, asistencias: 1, tarjetas: 0 }\nconsole.log(cuanto(yo, "goles"))',
      pruebas: [
        { t: 'src', re: '\\bkeyof\\s+Marcador\\b', msg: 'La llave es keyof Marcador' },
        { t: 'salida', igual: '3', msg: 'Sale 3' },
        { t: 'expr', code: 'cuanto({ goles: 0, asistencias: 7, tarjetas: 2 }, "asistencias")', igual: '7', msg: 'Las asistencias: 7' },
        { t: 'expr', code: 'cuanto({ goles: 0, asistencias: 7, tarjetas: 2 }, "tarjetas")', igual: '2', msg: 'Las tarjetas: 2' },
        { t: 'rechaza', code: 'cuanto(yo, "faltas")', msg: 'faltas no es una llave del Marcador' },
      ],
    },
    {
      id: 'tsa-3-3',
      titulo: 'Copia el tipo',
      enunciado:
        'Crea el tipo Perfil copiando el tipo de perfil con typeof. Después crea amigo, un Perfil de Leo, nivel 5 y vip. Muestra: Leo nivel 5',
      inicial: 'const perfil = { nombre: "Sofi", nivel: 3, vip: false }\n\n',
      pista: 'type Perfil = typeof perfil, y const amigo: Perfil = { nombre: "Leo", nivel: 5, vip: true }',
      solucion:
        'const perfil = { nombre: "Sofi", nivel: 3, vip: false }\n\ntype Perfil = typeof perfil\nconst amigo: Perfil = { nombre: "Leo", nivel: 5, vip: true }\nconsole.log(amigo.nombre + " nivel " + amigo.nivel)',
      pruebas: [
        { t: 'src', re: '\\btype\\s+Perfil\\s*=\\s*typeof\\s+perfil\\b', msg: 'Perfil es typeof perfil' },
        { t: 'src', re: anotado('amigo', 'Perfil\\b'), msg: 'amigo es un Perfil' },
        { t: 'salida', igual: 'Leo nivel 5', msg: 'Sale “Leo nivel 5”' },
        { t: 'rechaza', code: 'const _p: Perfil = { nombre: "x", nivel: "alto", vip: true }', msg: 'El nivel es un número' },
        { t: 'rechaza', code: 'const _q: Perfil = { nombre: "x", nivel: 1 }', msg: 'A un Perfil no le puede faltar vip' },
      ],
    },
    {
      id: 'tsa-3-4',
      titulo: 'La lista congelada',
      enunciado:
        'Congela SABORES con as const y crea el tipo Sabor con lo que tiene adentro. Después cambia el tipo del parámetro de pedir para que solo acepte un Sabor.',
      inicial:
        'const SABORES = ["fresa", "mora", "limón"]\n\nfunction pedir(s: string): string {\n  return "Un helado de " + s\n}\n\nconsole.log(pedir("mora"))\n',
      pista: 'const SABORES = [ … ] as const, y type Sabor = (typeof SABORES)[number]. Después function pedir(s: Sabor)',
      solucion:
        'const SABORES = ["fresa", "mora", "limón"] as const\ntype Sabor = (typeof SABORES)[number]\n\nfunction pedir(s: Sabor): string {\n  return "Un helado de " + s\n}\n\nconsole.log(pedir("mora"))',
      pruebas: [
        { t: 'src', re: '\\]\\s*as\\s+const\\b', msg: 'SABORES tiene as const' },
        { t: 'src', re: 'typeof\\s+SABORES\\s*\\)?\\s*\\[\\s*number\\s*\\]', msg: 'Sabor sale de (typeof SABORES)[number]' },
        { t: 'salida', igual: 'Un helado de mora', msg: 'Sale “Un helado de mora”' },
        { t: 'rechaza', code: 'pedir("chicle")', msg: 'No hay helado de chicle' },
      ],
    },
    {
      id: 'tsa-3-5',
      titulo: 'Las notas',
      enunciado:
        'Todo sale de una sola lista. Congela MATERIAS, crea el tipo Materia y dale a notas el tipo Record<Materia, number>. Después escribe promedio, que recorre MATERIAS y devuelve el promedio de las notas.',
      inicial:
        'const MATERIAS = ["mate", "ciencias", "arte"]\n\nconst notas = { mate: 4.5, ciencias: 4, arte: 5 }\n\n// Escribe aquí la función promedio\n\nconsole.log(promedio())\n',
      pista: 'En promedio: let total = 0, un for (const m of MATERIAS) que sume notas[m], y return total / MATERIAS.length',
      solucion:
        'const MATERIAS = ["mate", "ciencias", "arte"] as const\ntype Materia = (typeof MATERIAS)[number]\n\nconst notas: Record<Materia, number> = { mate: 4.5, ciencias: 4, arte: 5 }\n\nfunction promedio(): number {\n  let total = 0\n  for (const m of MATERIAS) {\n    total = total + notas[m]\n  }\n  return total / MATERIAS.length\n}\n\nconsole.log(promedio())',
      pruebas: [
        { t: 'src', re: '\\]\\s*as\\s+const\\b', msg: 'MATERIAS tiene as const' },
        { t: 'src', re: anotado('notas', 'Record\\s*<\\s*Materia\\s*,\\s*number\\s*>'), msg: 'notas es Record<Materia, number>' },
        { t: 'salida', igual: '4.5', msg: 'El promedio es 4.5' },
        { t: 'rechaza', code: 'const _n: Record<Materia, number> = { mate: 1, ciencias: 2 }', msg: 'Hay que ponerle nota a todas las materias' },
        { t: 'rechaza', code: 'const _r: Materia = "recreo"', msg: 'Recreo no es una materia' },
      ],
    },
  ],
}

const L4: Leccion = {
  id: 'tsa-4',
  numero: 4,
  titulo: 'Moldes de tipos',
  emoji: '🧰',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'TypeScript trae moldes que reciben un tipo y te dan otro. Se escriben como los genéricos, con `< >`. `Partial` vuelve todo opcional, `Pick` escoge unas llaves y `Omit` quita unas llaves.',
    },
    {
      t: 'codigo',
      codigo:
        'type Usuario = { nombre: string; edad: number; correo: string }\n\ntype Cambios = Partial<Usuario>                  // todo opcional\ntype Tarjeta = Pick<Usuario, "nombre" | "edad">   // solo esas dos\ntype Publico = Omit<Usuario, "correo">            // todo menos el correo\n\nconst c: Cambios = { edad: 12 }\nconst t: Tarjeta = { nombre: "Ana", edad: 11 }\nconst p: Publico = { nombre: "Leo", edad: 10 }\nconsole.log(c.edad, t.nombre, p.nombre)',
    },
    { t: 'p', texto: '`Partial` sirve para actualizar: solo dices lo que cambia, y el resto queda igual.' },
    {
      t: 'codigo',
      codigo:
        'type Usuario = { nombre: string; edad: number }\n\nfunction actualizar(u: Usuario, cambios: Partial<Usuario>): Usuario {\n  return { ...u, ...cambios }\n}\n\nconsole.log(actualizar({ nombre: "Ana", edad: 11 }, { edad: 12 }))',
    },
    {
      t: 'p',
      texto:
        'Y `Readonly` congela un objeto: nadie le puede cambiar nada. Para las listas se escribe `readonly string[]`, y así no dejan hacer `push`.',
    },
    {
      t: 'codigo',
      codigo:
        'const tablero: Readonly<{ filas: number; columnas: number }> = { filas: 3, columnas: 3 }\nconst nombres: readonly string[] = ["Ana", "Leo"]\nconsole.log(tablero.filas * tablero.columnas, nombres.length)',
    },
    {
      t: 'ojo',
      texto: 'Los moldes no cambian el tipo original: crean uno nuevo. `Usuario` sigue igual que antes.',
    },
  ],
  retos: [
    {
      id: 'tsa-4-1',
      titulo: 'Solo lo que cambia',
      enunciado:
        'Corre el programa: actualizar pide un Perfil completo, y solo le quieren cambiar el nivel. Cambia el tipo de cambios con Partial para que sea opcional.',
      inicial:
        'type Perfil = { nombre: string; color: string; nivel: number }\n\nfunction actualizar(p: Perfil, cambios: Perfil): Perfil {\n  return { ...p, ...cambios }\n}\n\nconst yo: Perfil = { nombre: "Leo", color: "azul", nivel: 3 }\nconsole.log(actualizar(yo, { nivel: 4 }).nivel)\n',
      pista: 'cambios: Partial<Perfil>',
      solucion:
        'type Perfil = { nombre: string; color: string; nivel: number }\n\nfunction actualizar(p: Perfil, cambios: Partial<Perfil>): Perfil {\n  return { ...p, ...cambios }\n}\n\nconst yo: Perfil = { nombre: "Leo", color: "azul", nivel: 3 }\nconsole.log(actualizar(yo, { nivel: 4 }).nivel)',
      pruebas: [
        { t: 'src', re: '\\bPartial\\s*<\\s*Perfil\\s*>', msg: 'Usas Partial<Perfil>' },
        { t: 'salida', igual: '4', msg: 'El nivel queda en 4' },
        { t: 'expr', code: 'actualizar(yo, { nivel: 4 }).color', igual: '"azul"', msg: 'El color sigue azul' },
        { t: 'rechaza', code: 'actualizar(yo, { nivel: "diez" })', msg: 'El nivel sigue siendo un número' },
      ],
    },
    {
      id: 'tsa-4-2',
      titulo: 'La tarjeta',
      enunciado:
        'Crea el tipo Tarjeta con Pick: solo el nombre y el curso del Estudiante. Escribe tarjeta: recibe un Estudiante y devuelve su Tarjeta.',
      inicial:
        'type Estudiante = { nombre: string; curso: string; nota: number; acudiente: string }\n\n// Escribe aquí el tipo Tarjeta y la función tarjeta\n\nconst sara: Estudiante = { nombre: "Sara", curso: "5B", nota: 4.8, acudiente: "Marta" }\nconsole.log(tarjeta(sara))\n',
      pista: 'type Tarjeta = Pick<Estudiante, "nombre" | "curso">. La función devuelve { nombre: e.nombre, curso: e.curso }',
      solucion:
        'type Estudiante = { nombre: string; curso: string; nota: number; acudiente: string }\n\ntype Tarjeta = Pick<Estudiante, "nombre" | "curso">\n\nfunction tarjeta(e: Estudiante): Tarjeta {\n  return { nombre: e.nombre, curso: e.curso }\n}\n\nconst sara: Estudiante = { nombre: "Sara", curso: "5B", nota: 4.8, acudiente: "Marta" }\nconsole.log(tarjeta(sara))',
      pruebas: [
        { t: 'src', re: '\\btype\\s+Tarjeta\\s*=\\s*Pick\\s*<\\s*Estudiante\\b', msg: 'Tarjeta sale de Pick<Estudiante, …>' },
        { t: 'expr', code: 'Object.keys(tarjeta(sara)).sort().join(",")', igual: '"curso,nombre"', msg: 'La tarjeta trae solo nombre y curso' },
        { t: 'expr', code: 'tarjeta(sara).curso', igual: '"5B"', msg: 'El curso de Sara es 5B' },
        { t: 'rechaza', code: 'const _t: Tarjeta = { nombre: "x", curso: "y", nota: 5 }', msg: 'Una Tarjeta no lleva la nota' },
        { t: 'rechaza', code: 'const _u: Tarjeta = { nombre: "x" }', msg: 'Una Tarjeta lleva el curso' },
      ],
    },
    {
      id: 'tsa-4-3',
      titulo: 'Sin la clave',
      enunciado:
        'Crea el tipo CuentaPublica con Omit: todo lo de Cuenta menos la clave. Escribe publica: recibe una Cuenta y devuelve su CuentaPublica, sin la clave.',
      inicial:
        'type Cuenta = { usuario: string; clave: string; puntos: number }\n\n// Escribe aquí el tipo CuentaPublica y la función publica\n\nconst mia: Cuenta = { usuario: "leo10", clave: "secreta", puntos: 120 }\nconsole.log(publica(mia))\n',
      pista: 'type CuentaPublica = Omit<Cuenta, "clave">. La función devuelve { usuario: c.usuario, puntos: c.puntos }',
      solucion:
        'type Cuenta = { usuario: string; clave: string; puntos: number }\n\ntype CuentaPublica = Omit<Cuenta, "clave">\n\nfunction publica(c: Cuenta): CuentaPublica {\n  return { usuario: c.usuario, puntos: c.puntos }\n}\n\nconst mia: Cuenta = { usuario: "leo10", clave: "secreta", puntos: 120 }\nconsole.log(publica(mia))',
      pruebas: [
        { t: 'src', re: '\\btype\\s+CuentaPublica\\s*=\\s*Omit\\s*<\\s*Cuenta\\b', msg: 'CuentaPublica sale de Omit<Cuenta, …>' },
        { t: 'salida', no: 'secreta', msg: 'La clave no se muestra' },
        { t: 'expr', code: '"clave" in publica(mia)', igual: 'false', msg: 'publica no trae la clave' },
        { t: 'expr', code: 'publica(mia).puntos', igual: '120', msg: 'Los puntos sí están' },
        { t: 'rechaza', code: 'const _c: CuentaPublica = { usuario: "a", clave: "123", puntos: 1 }', msg: 'Una CuentaPublica no tiene clave' },
      ],
    },
    {
      id: 'tsa-4-4',
      titulo: 'Las reglas no se cambian',
      enunciado:
        'Alguien hace trampa con las reglas del juego. Dale a reglas el tipo Readonly<Reglas>: TypeScript se va a quejar de la trampa. Bórrala.',
      inicial:
        'type Reglas = { jugadores: number; rondas: number }\n\nconst reglas: Reglas = { jugadores: 2, rondas: 3 }\nreglas.rondas = 100\nconsole.log(reglas.jugadores + " jugadores, " + reglas.rondas + " rondas")\n',
      pista: 'const reglas: Readonly<Reglas> = …, y borra la línea reglas.rondas = 100',
      solucion:
        'type Reglas = { jugadores: number; rondas: number }\n\nconst reglas: Readonly<Reglas> = { jugadores: 2, rondas: 3 }\nconsole.log(reglas.jugadores + " jugadores, " + reglas.rondas + " rondas")',
      pruebas: [
        { t: 'src', re: anotado('reglas', 'Readonly\\s*<\\s*Reglas\\s*>'), msg: 'reglas es Readonly<Reglas>' },
        { t: 'salida', igual: '2 jugadores, 3 rondas', msg: 'Sale “2 jugadores, 3 rondas”' },
        { t: 'rechaza', code: 'reglas.jugadores = 5', msg: 'Nadie cambia los jugadores' },
      ],
    },
    {
      id: 'tsa-4-5',
      titulo: 'La tienda',
      enunciado:
        'Dos funciones con moldes. crear recibe los datos de un Producto sin el id (Omit) y el id aparte, y devuelve el Producto completo. cambiar recibe un Producto y unos cambios que pueden traer cualquier dato menos el id (Partial de un Omit), y devuelve el Producto cambiado.',
      inicial:
        'type Producto = { id: number; nombre: string; precio: number; stock: number }\n\n// Escribe aquí crear y cambiar\n\nconst lapiz = crear({ nombre: "lápiz", precio: 1500, stock: 10 }, 1)\nconsole.log(cambiar(lapiz, { stock: 9 }).stock)\n',
      pista:
        'function crear(datos: Omit<Producto, "id">, id: number): Producto { return { id, ...datos } }. Para cambiar: cambios: Partial<Omit<Producto, "id">>',
      solucion:
        'type Producto = { id: number; nombre: string; precio: number; stock: number }\n\nfunction crear(datos: Omit<Producto, "id">, id: number): Producto {\n  return { id, ...datos }\n}\n\nfunction cambiar(p: Producto, cambios: Partial<Omit<Producto, "id">>): Producto {\n  return { ...p, ...cambios }\n}\n\nconst lapiz = crear({ nombre: "lápiz", precio: 1500, stock: 10 }, 1)\nconsole.log(cambiar(lapiz, { stock: 9 }).stock)',
      pruebas: [
        { t: 'src', re: '\\bOmit\\s*<\\s*Producto\\b', msg: 'Usas Omit<Producto, "id">' },
        { t: 'src', re: '\\bPartial\\s*<\\s*Omit\\s*<', msg: 'Los cambios son Partial<Omit<…>>' },
        { t: 'salida', igual: '9', msg: 'El stock queda en 9' },
        { t: 'expr', code: 'crear({ nombre: "borrador", precio: 800, stock: 3 }, 7).id', igual: '7', msg: 'crear le pone el id' },
        { t: 'expr', code: 'cambiar(lapiz, { precio: 2000 }).nombre', igual: '"lápiz"', msg: 'cambiar deja igual lo que no cambia' },
        { t: 'rechaza', code: 'cambiar(lapiz, { id: 99 })', msg: 'El id no se cambia' },
        { t: 'rechaza', code: 'crear({ nombre: "a", precio: 1 }, 2)', msg: 'Para crear hacen falta todos los datos menos el id' },
      ],
    },
  ],
}

const L5: Leccion = {
  id: 'tsa-5',
  numero: 5,
  titulo: 'Funciones como tipo',
  emoji: '📞',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'En JavaScript, una función se puede guardar en una variable y pasar a otra función. En TypeScript, además, tiene tipo: `(a: number, b: number) => number` es “una función que recibe dos números y devuelve un número”.',
    },
    {
      t: 'codigo',
      codigo:
        'type Operacion = (a: number, b: number) => number\n\nconst sumar: Operacion = (a, b) => a + b\nconst multiplicar: Operacion = (a, b) => a * b\nconsole.log(sumar(2, 3), multiplicar(2, 3))',
    },
    {
      t: 'p',
      texto: 'Fíjate: en `sumar` no escribiste el tipo de a ni de b. TypeScript lo sacó de Operacion. Ahora, una función que recibe otra:',
    },
    {
      t: 'codigo',
      codigo:
        'function dosVeces(f: (x: number) => number, x: number): number {\n  return f(f(x))\n}\n\nconsole.log(dosVeces((n) => n + 10, 1))',
    },
    { t: 'p', texto: 'Y una función que devuelve otra función. Es como una fábrica:' },
    {
      t: 'codigo',
      codigo:
        'function multiplicarPor(n: number): (x: number) => number {\n  return (x) => x * n\n}\n\nconst triple = multiplicarPor(3)\nconsole.log(triple(5))',
    },
    {
      t: 'ojo',
      texto: 'Si la función no devuelve nada, su tipo de salida es `void`: `(texto: string) => void`.',
    },
  ],
  retos: [
    {
      id: 'tsa-5-1',
      titulo: 'La calculadora',
      enunciado: 'Crea restar y dividir, las dos de tipo Operacion, como sumar.',
      inicial:
        'type Operacion = (a: number, b: number) => number\n\nconst sumar: Operacion = (a, b) => a + b\n\n// Crea aquí restar y dividir\n\nconsole.log(sumar(10, 4))\n',
      pista: 'const restar: Operacion = (a, b) => a - b',
      solucion:
        'type Operacion = (a: number, b: number) => number\n\nconst sumar: Operacion = (a, b) => a + b\nconst restar: Operacion = (a, b) => a - b\nconst dividir: Operacion = (a, b) => a / b\n\nconsole.log(sumar(10, 4))',
      pruebas: [
        { t: 'src', re: anotado('restar', 'Operacion\\b'), msg: 'restar es una Operacion' },
        { t: 'src', re: anotado('dividir', 'Operacion\\b'), msg: 'dividir es una Operacion' },
        { t: 'expr', code: 'restar(10, 4)', igual: '6', msg: 'restar(10, 4) es 6' },
        { t: 'expr', code: 'dividir(9, 3)', igual: '3', msg: 'dividir(9, 3) es 3' },
        { t: 'rechaza', code: 'restar("5", 1)', msg: 'restar("5", 1) no pasa la revisión' },
      ],
    },
    {
      id: 'tsa-5-2',
      titulo: 'Aplicar a todos',
      enunciado:
        'Escribe aplicar: recibe una lista de números y una función f de tipo (n: number) => number, y devuelve una lista nueva con f aplicada a cada número.\n\naplicar([1, 2, 3], (n) => n * 10) → [10, 20, 30]',
      inicial: '',
      pista: 'function aplicar(lista: number[], f: (n: number) => number): number[]. Adentro, un for…of que haga push de f(x).',
      solucion:
        'function aplicar(lista: number[], f: (n: number) => number): number[] {\n  const nueva: number[] = []\n  for (const x of lista) {\n    nueva.push(f(x))\n  }\n  return nueva\n}\n\nconsole.log(aplicar([1, 2, 3], (n) => n * 10))',
      pruebas: [
        { t: 'src', re: '\\(\\s*\\w+\\s*:\\s*number\\s*\\)\\s*=>\\s*number', msg: 'f es de tipo (n: number) => number' },
        { t: 'expr', code: 'aplicar([1, 2, 3], (n) => n * 10)', igual: '[10, 20, 30]', msg: 'Por 10: [10, 20, 30]' },
        { t: 'expr', code: 'aplicar([5, 6], (n) => n - 1)', igual: '[4, 5]', msg: 'Menos 1: [4, 5]' },
        { t: 'expr', code: 'aplicar([], (n) => n)', igual: '[]', msg: 'Una lista vacía da []' },
        { t: 'rechaza', code: 'aplicar([1], (t: string) => t.length)', msg: 'f tiene que recibir un número' },
      ],
    },
    {
      id: 'tsa-5-3',
      titulo: 'La fábrica de saludos',
      enunciado:
        'Escribe crearSaludo: recibe un saludo y devuelve una función que recibe un nombre y devuelve (saludo), (nombre).\n\nconst hola = crearSaludo("Hola")\nhola("Ana") → Hola, Ana',
      inicial: '',
      pista: 'function crearSaludo(saludo: string): (nombre: string) => string { return (nombre) => saludo + ", " + nombre }',
      solucion:
        'function crearSaludo(saludo: string): (nombre: string) => string {\n  return (nombre) => saludo + ", " + nombre\n}\n\nconst hola = crearSaludo("Hola")\nconsole.log(hola("Ana"))',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*\\(\\s*\\w+\\s*:\\s*string\\s*\\)\\s*=>\\s*string', msg: 'Devuelve una (nombre: string) => string' },
        { t: 'expr', code: 'crearSaludo("Hola")("Ana")', igual: '"Hola, Ana"', msg: 'Hola, Ana' },
        { t: 'expr', code: 'crearSaludo("Quiubo")("Leo")', igual: '"Quiubo, Leo"', msg: 'Quiubo, Leo' },
        { t: 'rechaza', code: 'crearSaludo("Hola")(5)', msg: 'El nombre es un texto' },
      ],
    },
    {
      id: 'tsa-5-4',
      titulo: 'Avísame',
      enunciado:
        'Escribe contarHasta: recibe un número n y una función alContar de tipo (i: number) => void, y la llama con 1, 2, … hasta n. El programa ya la usa para mostrar Voy en 1, Voy en 2 y Voy en 3.',
      inicial: '// Escribe aquí la función contarHasta\n\ncontarHasta(3, (i) => console.log("Voy en " + i))\n',
      pista: 'function contarHasta(n: number, alContar: (i: number) => void): void { for (let i = 1; i <= n; i++) alContar(i) }',
      solucion:
        'function contarHasta(n: number, alContar: (i: number) => void): void {\n  for (let i = 1; i <= n; i++) {\n    alContar(i)\n  }\n}\n\ncontarHasta(3, (i) => console.log("Voy en " + i))',
      pruebas: [
        { t: 'src', re: '\\(\\s*\\w+\\s*:\\s*number\\s*\\)\\s*=>\\s*void', msg: 'alContar es de tipo (i: number) => void' },
        { t: 'salida', igual: 'Voy en 1\nVoy en 2\nVoy en 3', msg: 'Sale Voy en 1, 2 y 3' },
        {
          t: 'expr',
          code: '(() => { const vistos = []; contarHasta(4, (i) => vistos.push(i)); return vistos })()',
          igual: '[1, 2, 3, 4]',
          msg: 'Con 4, avisa 1, 2, 3 y 4',
        },
        { t: 'rechaza', code: 'contarHasta(2, (i: string) => {})', msg: 'alContar recibe un número' },
      ],
    },
    {
      id: 'tsa-5-5',
      titulo: 'El contador',
      enunciado:
        'Escribe crearContador: no recibe nada y devuelve una función de tipo () => number. Cada vez que la llamas, devuelve el siguiente número: 1, 2, 3… Cada contador lleva su propia cuenta.',
      inicial: '',
      pista: 'Adentro de crearContador: let cuenta = 0, y return () => { cuenta++; return cuenta }',
      solucion:
        'function crearContador(): () => number {\n  let cuenta = 0\n  return () => {\n    cuenta++\n    return cuenta\n  }\n}\n\nconst c = crearContador()\nconsole.log(c())\nconsole.log(c())',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*\\(\\s*\\)\\s*=>\\s*number', msg: 'Devuelve una () => number' },
        { t: 'expr', code: '(() => { const c = crearContador(); c(); c(); return c() })()', igual: '3', msg: 'A la tercera vez, 3' },
        {
          t: 'expr',
          code: '(() => { const a = crearContador(); const b = crearContador(); a(); a(); return b() })()',
          igual: '1',
          msg: 'Cada contador lleva su propia cuenta',
        },
        { t: 'rechaza', code: 'const _t: string = crearContador()()', msg: 'El contador devuelve números' },
      ],
    },
  ],
}

const L6: Leccion = {
  id: 'tsa-6',
  numero: 6,
  titulo: 'map, filter y reduce',
  emoji: '⚙️',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Las listas traen funciones que reciben funciones. `map` transforma cada dato, `filter` deja los que cumplen y `reduce` los junta en uno solo. Con tipos, TypeScript sabe qué sale de cada una.',
    },
    {
      t: 'codigo',
      codigo:
        'const precios = [1000, 2500, 400]\n\nconst dobles = precios.map((p) => p * 2)         // number[]\nconst caros = precios.filter((p) => p > 900)     // number[]\nconst textos = precios.map((p) => "$" + p)       // string[]\nconsole.log(dobles)\nconsole.log(caros)\nconsole.log(textos)',
    },
    {
      t: 'p',
      texto:
        '`reduce` recibe dos cosas: la función que junta y el valor con que arranca. Lo que devuelve es del tipo de ese valor inicial.',
    },
    {
      t: 'codigo',
      codigo: 'const goles = [2, 0, 3, 1]\nconst total = goles.reduce((suma, g) => suma + g, 0)\nconsole.log(total)',
    },
    { t: 'p', texto: 'Y se pueden encadenar: primero filtras y después transformas.' },
    {
      t: 'codigo',
      codigo:
        'type Alumno = { nombre: string; nota: number }\n\nconst curso: Alumno[] = [\n  { nombre: "Ana", nota: 4.5 },\n  { nombre: "Leo", nota: 2.8 },\n  { nombre: "Sara", nota: 3.9 },\n]\n\nconst aprobados = curso.filter((a) => a.nota >= 3).map((a) => a.nombre)\nconsole.log(aprobados)',
    },
    {
      t: 'ojo',
      texto: 'A `reduce` siempre dale el valor inicial (el 0 del ejemplo). Sin él, con una lista vacía, el programa se rompe.',
    },
  ],
  retos: [
    {
      id: 'tsa-6-1',
      titulo: 'A gritos',
      enunciado: 'Escribe gritar con map: recibe una lista de palabras y las devuelve en mayúsculas.\n\ngritar(["hola", "sol"]) → ["HOLA", "SOL"]',
      inicial: '',
      pista: 'function gritar(palabras: string[]): string[] { return palabras.map((p) => p.toUpperCase()) }',
      solucion:
        'function gritar(palabras: string[]): string[] {\n  return palabras.map((p) => p.toUpperCase())\n}\n\nconsole.log(gritar(["hola", "sol"]))',
      pruebas: [
        { t: 'src', re: '\\.map\\s*\\(', msg: 'Usas map' },
        SIN_CICLOS,
        { t: 'expr', code: 'gritar(["hola", "sol"])', igual: '["HOLA", "SOL"]', msg: 'gritar(["hola", "sol"])' },
        { t: 'expr', code: 'gritar([])', igual: '[]', msg: 'gritar([]) es []' },
        { t: 'rechaza', code: 'const _n: number[] = gritar(["a"])', msg: 'gritar devuelve textos' },
      ],
    },
    {
      id: 'tsa-6-2',
      titulo: 'Los pares',
      enunciado: 'Escribe soloPares con filter: recibe una lista de números y deja solo los pares.\n\nsoloPares([1, 2, 3, 4]) → [2, 4]',
      inicial: '',
      pista: 'Un número es par si n % 2 === 0.',
      solucion:
        'function soloPares(numeros: number[]): number[] {\n  return numeros.filter((n) => n % 2 === 0)\n}\n\nconsole.log(soloPares([1, 2, 3, 4]))',
      pruebas: [
        { t: 'src', re: '\\.filter\\s*\\(', msg: 'Usas filter' },
        SIN_CICLOS,
        { t: 'expr', code: 'soloPares([1, 2, 3, 4])', igual: '[2, 4]', msg: 'soloPares([1, 2, 3, 4]) es [2, 4]' },
        { t: 'expr', code: 'soloPares([7, 9])', igual: '[]', msg: 'Sin pares, []' },
        { t: 'rechaza', code: 'soloPares(["2"])', msg: 'soloPares recibe números' },
      ],
    },
    {
      id: 'tsa-6-3',
      titulo: 'La cuenta',
      enunciado: 'Escribe total con reduce: recibe los precios y devuelve la suma. Con una lista vacía, 0.',
      inicial: '',
      pista: 'return precios.reduce((suma, p) => suma + p, 0)',
      solucion:
        'function total(precios: number[]): number {\n  return precios.reduce((suma, p) => suma + p, 0)\n}\n\nconsole.log(total([1000, 2500]))',
      pruebas: [
        { t: 'src', re: '\\.reduce\\s*\\(', msg: 'Usas reduce' },
        SIN_CICLOS,
        { t: 'expr', code: 'total([1000, 2500])', igual: '3500', msg: 'total([1000, 2500]) es 3500' },
        { t: 'expr', code: 'total([])', igual: '0', msg: 'total([]) es 0' },
        { t: 'rechaza', code: 'const _s: string = total([1])', msg: 'total devuelve un número' },
      ],
    },
    {
      id: 'tsa-6-4',
      titulo: 'Los que pasan',
      enunciado: 'Escribe aprobados: recibe la lista de alumnos y devuelve los nombres de los que sacaron 3 o más. Encadena filter y map.',
      inicial:
        'type Alumno = { nombre: string; nota: number }\n\n// Escribe aquí la función aprobados\n\nconsole.log(aprobados([{ nombre: "Ana", nota: 4.5 }, { nombre: "Leo", nota: 2.8 }]))\n',
      pista: 'return curso.filter((a) => a.nota >= 3).map((a) => a.nombre)',
      solucion:
        'type Alumno = { nombre: string; nota: number }\n\nfunction aprobados(curso: Alumno[]): string[] {\n  return curso.filter((a) => a.nota >= 3).map((a) => a.nombre)\n}\n\nconsole.log(aprobados([{ nombre: "Ana", nota: 4.5 }, { nombre: "Leo", nota: 2.8 }]))',
      pruebas: [
        { t: 'src', re: '\\.filter\\s*\\(', msg: 'Usas filter' },
        { t: 'src', re: '\\.map\\s*\\(', msg: 'Usas map' },
        SIN_CICLOS,
        {
          t: 'expr',
          code: 'aprobados([{ nombre: "Ana", nota: 4.5 }, { nombre: "Leo", nota: 2.8 }, { nombre: "Sara", nota: 3 }])',
          igual: '["Ana", "Sara"]',
          msg: 'Pasan Ana y Sara (con 3 justo también se pasa)',
        },
        { t: 'expr', code: 'aprobados([])', igual: '[]', msg: 'Un curso vacío da []' },
        { t: 'rechaza', code: 'const _a: Alumno[] = aprobados([])', msg: 'aprobados devuelve nombres, no alumnos' },
      ],
    },
    {
      id: 'tsa-6-5',
      titulo: 'El inventario',
      enunciado:
        'Dos funciones, sin for ni while. valorTotal devuelve cuánto vale todo el inventario (precio por cantidad de cada cosa, sumado). agotados devuelve los nombres de lo que tiene cantidad 0.',
      inicial:
        'type Item = { nombre: string; precio: number; cantidad: number }\n\nconst bodega: Item[] = [\n  { nombre: "balón", precio: 30000, cantidad: 2 },\n  { nombre: "pito", precio: 5000, cantidad: 0 },\n  { nombre: "cono", precio: 2000, cantidad: 10 },\n]\n\n// Escribe aquí valorTotal y agotados\n\nconsole.log(valorTotal(bodega))\nconsole.log(agotados(bodega))\n',
      pista: 'valorTotal: items.reduce((suma, i) => suma + i.precio * i.cantidad, 0). agotados: un filter y un map.',
      solucion:
        'type Item = { nombre: string; precio: number; cantidad: number }\n\nconst bodega: Item[] = [\n  { nombre: "balón", precio: 30000, cantidad: 2 },\n  { nombre: "pito", precio: 5000, cantidad: 0 },\n  { nombre: "cono", precio: 2000, cantidad: 10 },\n]\n\nfunction valorTotal(items: Item[]): number {\n  return items.reduce((suma, i) => suma + i.precio * i.cantidad, 0)\n}\n\nfunction agotados(items: Item[]): string[] {\n  return items.filter((i) => i.cantidad === 0).map((i) => i.nombre)\n}\n\nconsole.log(valorTotal(bodega))\nconsole.log(agotados(bodega))',
      pruebas: [
        { t: 'src', re: '\\.reduce\\s*\\(', msg: 'Usas reduce' },
        SIN_CICLOS,
        { t: 'salida', igual: '80000\n["pito"]', msg: 'Sale 80000 y ["pito"]' },
        { t: 'expr', code: 'valorTotal([])', igual: '0', msg: 'Una bodega vacía vale 0' },
        {
          t: 'expr',
          code: 'agotados([{ nombre: "a", precio: 1, cantidad: 0 }, { nombre: "b", precio: 1, cantidad: 0 }])',
          igual: '["a", "b"]',
          msg: 'Si no queda nada, todos están agotados',
        },
        { t: 'rechaza', code: 'valorTotal([{ nombre: "x", precio: "caro", cantidad: 1 }])', msg: 'El precio es un número' },
      ],
    },
  ],
}

const L7: Leccion = {
  id: 'tsa-7',
  numero: 7,
  titulo: 'Genéricos con reglas',
  emoji: '📏',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'En el primer curso, `<T>` aceptaba cualquier tipo. A veces necesitas que T tenga algo. Con `extends` le pones una regla: `<T extends { nombre: string }>` quiere decir “cualquier tipo, siempre que tenga nombre”.',
    },
    {
      t: 'codigo',
      codigo:
        'function presentar<T extends { nombre: string }>(cosa: T): string {\n  return "Te presento a " + cosa.nombre\n}\n\nconsole.log(presentar({ nombre: "Rex", raza: "pug" }))\nconsole.log(presentar({ nombre: "Marte", lunas: 2 }))',
    },
    {
      t: 'p',
      texto: 'Sin la regla, `cosa.nombre` no pasaría: ¿y si T es un número? Y con la regla, `presentar(5)` no pasa.',
    },
    {
      t: 'p',
      texto:
        'La regla más útil es `K extends keyof T`: una llave que de verdad exista en T. Y con `T[K]` TypeScript sabe hasta de qué tipo es lo que sacas.',
    },
    {
      t: 'codigo',
      codigo:
        'function sacar<T, K extends keyof T>(obj: T, llave: K): T[K] {\n  return obj[llave]\n}\n\nconst peli = { titulo: "Coco", estreno: 2017 }\nconsole.log(sacar(peli, "titulo").toUpperCase())   // TypeScript sabe que es string\nconsole.log(sacar(peli, "estreno") + 1)            // y aquí, que es number',
    },
    {
      t: 'ojo',
      texto: '`T[K]` se lee “el tipo de la llave K adentro de T”. Si K es "titulo", es string.',
    },
  ],
  retos: [
    {
      id: 'tsa-7-1',
      titulo: 'El más largo',
      enunciado:
        'Escribe masLargo con un T que tenga length: recibe dos cosas del mismo tipo y devuelve la más larga. Si miden lo mismo, la primera. Sirve con textos y con listas.\n\nmasLargo("sol", "luna") → "luna"',
      inicial: '',
      pista: 'function masLargo<T extends { length: number }>(a: T, b: T): T { … }',
      solucion:
        'function masLargo<T extends { length: number }>(a: T, b: T): T {\n  if (b.length > a.length) return b\n  return a\n}\n\nconsole.log(masLargo("sol", "luna"))',
      pruebas: [
        { t: 'src', re: '<\\s*\\w+\\s+extends\\s*\\{\\s*length\\s*:\\s*number', msg: 'T tiene la regla extends { length: number }' },
        { t: 'expr', code: 'masLargo("sol", "luna")', igual: '"luna"', msg: 'Entre sol y luna: luna' },
        { t: 'expr', code: 'masLargo([1, 2, 3], [1])', igual: '[1, 2, 3]', msg: 'Funciona con listas' },
        { t: 'expr', code: 'masLargo("ab", "cd")', igual: '"ab"', msg: 'Si miden lo mismo, la primera' },
        { t: 'rechaza', code: 'masLargo(10, 20)', msg: 'Un número no tiene length' },
      ],
    },
    {
      id: 'tsa-7-2',
      titulo: 'Con nombre',
      enunciado: 'Corre el programa: TypeScript no sabe si T tiene nombre. Ponle a T la regla extends { nombre: string }.',
      inicial:
        'function saludar<T>(cosa: T): string {\n  return "Hola, " + cosa.nombre\n}\n\nconsole.log(saludar({ nombre: "Kiwi", especie: "loro" }))\n',
      pista: 'function saludar<T extends { nombre: string }>(cosa: T): string',
      solucion:
        'function saludar<T extends { nombre: string }>(cosa: T): string {\n  return "Hola, " + cosa.nombre\n}\n\nconsole.log(saludar({ nombre: "Kiwi", especie: "loro" }))',
      pruebas: [
        { t: 'src', re: '<\\s*\\w+\\s+extends\\s*\\{\\s*nombre\\s*:\\s*string', msg: 'T tiene la regla extends { nombre: string }' },
        { t: 'salida', igual: 'Hola, Kiwi', msg: 'Sale “Hola, Kiwi”' },
        { t: 'expr', code: 'saludar({ nombre: "Luna", lunas: 0 })', igual: '"Hola, Luna"', msg: 'Funciona con cualquier cosa que tenga nombre' },
        { t: 'rechaza', code: 'saludar(5)', msg: 'saludar(5) no pasa' },
        { t: 'rechaza', code: 'saludar({ apodo: "x" })', msg: 'Sin nombre no pasa' },
      ],
    },
    {
      id: 'tsa-7-3',
      titulo: 'Sacar un dato',
      enunciado: 'Escribe sacar, como en la explicación: recibe un objeto y una de sus llaves, y devuelve ese dato con su tipo, T[K].',
      inicial: '',
      pista: 'function sacar<T, K extends keyof T>(obj: T, llave: K): T[K] { return obj[llave] }',
      solucion:
        'function sacar<T, K extends keyof T>(obj: T, llave: K): T[K] {\n  return obj[llave]\n}\n\nconsole.log(sacar({ fruta: "mango", kilos: 2 }, "fruta"))',
      pruebas: [
        { t: 'src', re: '\\b\\w+\\s+extends\\s+keyof\\s+\\w+', msg: 'La llave tiene la regla extends keyof T' },
        { t: 'expr', code: 'sacar({ fruta: "mango", kilos: 2 }, "kilos")', igual: '2', msg: 'Saca los kilos: 2' },
        { t: 'expr', code: 'sacar({ fruta: "mango", kilos: 2 }, "fruta")', igual: '"mango"', msg: 'Saca la fruta: mango' },
        { t: 'rechaza', code: 'sacar({ a: 1 }, "b")', msg: 'b no es una llave de { a: 1 }' },
        { t: 'rechaza', code: 'const _s: string = sacar({ n: 5 }, "n")', msg: 'TypeScript sabe que el n es un número' },
      ],
    },
    {
      id: 'tsa-7-4',
      titulo: 'Tu propio filter',
      enunciado:
        'Escribe filtrar sin usar .filter: recibe una lista T[] y una prueba (x: T) => boolean, y devuelve una lista T[] con los que pasan.\n\nfiltrar([1, 5, 8], (n) => n > 4) → [5, 8]',
      inicial: '',
      pista: 'const quedan: T[] = [], un for…of y push de los que pasen la prueba.',
      solucion:
        'function filtrar<T>(lista: T[], prueba: (x: T) => boolean): T[] {\n  const quedan: T[] = []\n  for (const x of lista) {\n    if (prueba(x)) quedan.push(x)\n  }\n  return quedan\n}\n\nconsole.log(filtrar([1, 5, 8], (n) => n > 4))',
      pruebas: [
        { t: 'src', re: '\\bfiltrar\\s*<\\s*\\w+\\s*>', msg: 'filtrar tiene su <T>' },
        { t: 'src', re: '\\.filter\\s*\\(', not: true, msg: 'Sin usar .filter' },
        { t: 'expr', code: 'filtrar([1, 5, 8], (n) => n > 4)', igual: '[5, 8]', msg: 'Mayores que 4: [5, 8]' },
        { t: 'expr', code: 'filtrar(["sol", "luna", "mar"], (p) => p.length === 3)', igual: '["sol", "mar"]', msg: 'Palabras de 3 letras' },
        { t: 'rechaza', code: 'const _f: string[] = filtrar([1, 2], (n) => n > 1)', msg: 'Filtrar números da números' },
        { t: 'rechaza', code: 'filtrar([1, 2], (p: string) => p.length > 1)', msg: 'La prueba recibe el mismo tipo de la lista' },
      ],
    },
    {
      id: 'tsa-7-5',
      titulo: 'El buscador',
      enunciado:
        'Escribe buscar: recibe una lista de cosas que tengan nombre y un texto, y devuelve las que tienen ese texto en el nombre, sin importar mayúsculas. Lo que devuelve es del mismo tipo de la lista.',
      inicial:
        '// Escribe aquí la función buscar\n\nconst pelis = [\n  { nombre: "Coco", estreno: 2017 },\n  { nombre: "Encanto", estreno: 2021 },\n  { nombre: "Cars", estreno: 2006 },\n]\nconsole.log(buscar(pelis, "co").map((p) => p.nombre))\n',
      pista:
        'function buscar<T extends { nombre: string }>(lista: T[], texto: string): T[]. Para no fijarse en mayúsculas: x.nombre.toLowerCase().includes(texto.toLowerCase())',
      solucion:
        'function buscar<T extends { nombre: string }>(lista: T[], texto: string): T[] {\n  return lista.filter((x) => x.nombre.toLowerCase().includes(texto.toLowerCase()))\n}\n\nconst pelis = [\n  { nombre: "Coco", estreno: 2017 },\n  { nombre: "Encanto", estreno: 2021 },\n  { nombre: "Cars", estreno: 2006 },\n]\nconsole.log(buscar(pelis, "co").map((p) => p.nombre))',
      pruebas: [
        { t: 'src', re: '<\\s*\\w+\\s+extends\\s*\\{\\s*nombre\\s*:\\s*string', msg: 'T tiene la regla extends { nombre: string }' },
        { t: 'salida', igual: '["Coco"]', msg: 'Con co solo sale Coco' },
        { t: 'expr', code: 'buscar(pelis, "C").length', igual: '3', msg: 'Con C salen las tres: Coco, Encanto y Cars' },
        { t: 'expr', code: 'buscar(pelis, "zzz")', igual: '[]', msg: 'Si no hay, []' },
        {
          t: 'rechaza',
          code: 'const _p: { nombre: string; estreno?: string }[] = buscar(pelis, "co")',
          msg: 'Lo que devuelve es del tipo de la lista: pelis con su estreno de tipo number',
        },
        { t: 'rechaza', code: 'buscar([1, 2], "1")', msg: 'Los números no tienen nombre' },
      ],
    },
  ],
}

const L8: Leccion = {
  id: 'tsa-8',
  numero: 8,
  titulo: 'Tuplas',
  emoji: '📍',
  minutos: 25,
  explicacion: [
    {
      t: 'p',
      texto:
        'Una tupla es una lista cortica donde el largo es fijo y cada posición tiene su tipo. `[number, number]` es exactamente dos números: perfecto para un punto en el mapa.',
    },
    {
      t: 'codigo',
      codigo: 'type Punto = [number, number]\n\nconst casa: Punto = [3, 5]\nconst [x, y] = casa\nconsole.log("x:", x, "y:", y)',
    },
    {
      t: 'p',
      texto:
        'Esa línea `const [x, y] = casa` desarma la tupla en dos variables. Y sirve para que una función devuelva dos cosas:',
    },
    {
      t: 'codigo',
      codigo:
        'function dividir(a: number, b: number): [number, number] {\n  return [Math.floor(a / b), a % b]\n}\n\nconst [cociente, residuo] = dividir(17, 5)\nconsole.log(cociente, residuo)',
    },
    {
      t: 'p',
      texto:
        'Las posiciones pueden tener nombre y tipos distintos: `[nombre: string, puntos: number]`. Y TypeScript cuida el largo: un Punto solo tiene las posiciones 0 y 1, así que `casa[2]` no pasa.',
    },
    {
      t: 'codigo',
      codigo:
        'type Fila = [nombre: string, puntos: number]\n\nconst tabla: Fila[] = [["Ana", 30], ["Leo", 45]]\nfor (const [nombre, puntos] of tabla) {\n  console.log(nombre + ": " + puntos)\n}',
    },
    {
      t: 'ojo',
      texto: 'Si no le dices que es una tupla, TypeScript cree que `[3, 5]` es un `number[]` de cualquier largo. Ponle el tipo.',
    },
  ],
  retos: [
    {
      id: 'tsa-8-1',
      titulo: 'El tesoro',
      enunciado: 'Crea el tipo Punto, una tupla de dos números, y tesoro: un Punto en 4, 7. Muestra: El tesoro está en 4, 7',
      inicial: '',
      pista: 'type Punto = [number, number] y const tesoro: Punto = [4, 7]. Las posiciones son tesoro[0] y tesoro[1].',
      solucion:
        'type Punto = [number, number]\n\nconst tesoro: Punto = [4, 7]\nconsole.log("El tesoro está en " + tesoro[0] + ", " + tesoro[1])',
      pruebas: [
        { t: 'src', re: '\\btype\\s+Punto\\s*=\\s*\\[', msg: 'Punto es una tupla' },
        { t: 'src', re: anotado('tesoro', 'Punto\\b'), msg: 'tesoro es un Punto' },
        { t: 'salida', igual: 'El tesoro está en 4, 7', msg: 'Sale “El tesoro está en 4, 7”' },
        { t: 'rechaza', code: 'const _p: Punto = [1, 2, 3]', msg: 'Un Punto tiene dos números, no tres' },
        { t: 'rechaza', code: 'const _q: Punto = [1, "2"]', msg: 'Los dos son números' },
      ],
    },
    {
      id: 'tsa-8-2',
      titulo: 'Moverse',
      enunciado: 'Escribe mover: recibe un Punto, cuánto moverse en x y cuánto en y, y devuelve el Punto nuevo.\n\nmover([1, 1], 2, -1) → [3, 0]',
      inicial: 'type Punto = [number, number]\n\n',
      pista: 'function mover(p: Punto, dx: number, dy: number): Punto { return [p[0] + dx, p[1] + dy] }',
      solucion:
        'type Punto = [number, number]\n\nfunction mover(p: Punto, dx: number, dy: number): Punto {\n  return [p[0] + dx, p[1] + dy]\n}\n\nconsole.log(mover([1, 1], 2, -1))',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*(Punto\\b|\\[\\s*number\\s*,\\s*number\\s*\\])', msg: 'mover devuelve un Punto' },
        { t: 'expr', code: 'mover([1, 1], 2, -1)', igual: '[3, 0]', msg: 'mover([1, 1], 2, -1) es [3, 0]' },
        { t: 'expr', code: 'mover([0, 0], 0, 5)', igual: '[0, 5]', msg: 'mover([0, 0], 0, 5) es [0, 5]' },
        { t: 'rechaza', code: 'const _z = mover([0, 0], 1, 1)[2]', msg: 'El punto que devuelve no tiene posición 2' },
        { t: 'rechaza', code: 'mover([0], 1, 1)', msg: 'mover recibe un Punto completo' },
      ],
    },
    {
      id: 'tsa-8-3',
      titulo: 'El menor y el mayor',
      enunciado:
        'Escribe extremos: recibe una lista de números y devuelve una tupla con el menor y el mayor. Después desarma la tupla en dos variables y muestra: menor: 2, mayor: 9',
      inicial: 'const numeros = [5, 2, 9, 4]\n\n',
      pista: 'Math.min(...lista) da el menor. Para desarmar: const [menor, mayor] = extremos(numeros)',
      solucion:
        'const numeros = [5, 2, 9, 4]\n\nfunction extremos(lista: number[]): [number, number] {\n  return [Math.min(...lista), Math.max(...lista)]\n}\n\nconst [menor, mayor] = extremos(numeros)\nconsole.log("menor: " + menor + ", mayor: " + mayor)',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*\\[\\s*(\\w+\\s*:\\s*)?number\\s*,\\s*(\\w+\\s*:\\s*)?number\\s*\\]', msg: 'extremos devuelve [number, number]' },
        { t: 'src', re: '\\b(const|let)\\s*\\[\\s*\\w+\\s*,\\s*\\w+\\s*\\]\\s*=', msg: 'Desarmas la tupla en dos variables' },
        { t: 'salida', igual: 'menor: 2, mayor: 9', msg: 'Sale “menor: 2, mayor: 9”' },
        { t: 'expr', code: 'extremos([3, 1, 2])', igual: '[1, 3]', msg: 'extremos([3, 1, 2]) es [1, 3]' },
        { t: 'rechaza', code: 'const _t: [number, number, number] = extremos([1])', msg: 'Devuelve dos números, no tres' },
      ],
    },
    {
      id: 'tsa-8-4',
      titulo: 'La tabla de posiciones',
      enunciado: 'Escribe lider: recibe la tabla (una lista de Fila) y devuelve el nombre del que tiene más puntos.',
      inicial:
        'type Fila = [nombre: string, puntos: number]\n\n// Escribe aquí la función lider\n\nconst tabla: Fila[] = [["Ana", 30], ["Leo", 45], ["Sara", 38]]\nconsole.log(lider(tabla))\n',
      pista: 'Guarda el mejor en una variable y recorre con for (const [nombre, puntos] of tabla). Si alguien tiene más, ese es el nuevo mejor.',
      solucion:
        'type Fila = [nombre: string, puntos: number]\n\nfunction lider(tabla: Fila[]): string {\n  let mejor = tabla[0]\n  for (const fila of tabla) {\n    if (fila[1] > mejor[1]) mejor = fila\n  }\n  return mejor[0]\n}\n\nconst tabla: Fila[] = [["Ana", 30], ["Leo", 45], ["Sara", 38]]\nconsole.log(lider(tabla))',
      pruebas: [
        { t: 'src', re: '\\bfunction\\s+lider\\s*\\(\\s*\\w+\\s*:\\s*Fila\\s*\\[\\s*\\]', msg: 'lider recibe una lista Fila[]' },
        { t: 'salida', igual: 'Leo', msg: 'Gana Leo' },
        { t: 'expr', code: 'lider([["Ana", 10], ["Leo", 5]])', igual: '"Ana"', msg: 'Si Ana tiene más, gana Ana' },
        { t: 'expr', code: 'lider([["Solo", 1]])', igual: '"Solo"', msg: 'Con uno solo, gana ese' },
        { t: 'rechaza', code: 'lider([["Ana", "30"]])', msg: 'Los puntos son números' },
      ],
    },
    {
      id: 'tsa-8-5',
      titulo: 'Las vecinas del triqui',
      enunciado:
        'En el tablero del triqui (filas y columnas de 0 a 2), escribe vecinas: recibe una Casilla y devuelve las casillas de arriba, abajo, izquierda y derecha, en ese orden, sin las que se salen del tablero.\n\nvecinas([0, 0]) → [[1, 0], [0, 1]]',
      inicial: 'type Casilla = [fila: number, columna: number]\n\n',
      pista:
        'Arma las cuatro posibles: [f - 1, c], [f + 1, c], [f, c - 1], [f, c + 1]. Después quédate con las que tengan los dos números entre 0 y 2.',
      solucion:
        'type Casilla = [fila: number, columna: number]\n\nfunction dentro(c: Casilla): boolean {\n  return c[0] >= 0 && c[0] <= 2 && c[1] >= 0 && c[1] <= 2\n}\n\nfunction vecinas(c: Casilla): Casilla[] {\n  const [f, col] = c\n  const posibles: Casilla[] = [\n    [f - 1, col],\n    [f + 1, col],\n    [f, col - 1],\n    [f, col + 1],\n  ]\n  return posibles.filter(dentro)\n}\n\nconsole.log(vecinas([0, 0]))',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*Casilla\\s*\\[\\s*\\]', msg: 'vecinas devuelve Casilla[]' },
        { t: 'expr', code: 'vecinas([0, 0])', igual: '[[1, 0], [0, 1]]', msg: 'La esquina tiene dos vecinas' },
        { t: 'expr', code: 'vecinas([1, 1])', igual: '[[0, 1], [2, 1], [1, 0], [1, 2]]', msg: 'El centro tiene cuatro' },
        { t: 'expr', code: 'vecinas([2, 1])', igual: '[[1, 1], [2, 0], [2, 2]]', msg: 'La de abajo en el medio tiene tres' },
        { t: 'rechaza', code: 'vecinas([1])', msg: 'Una casilla tiene fila y columna' },
      ],
    },
  ],
}

const L9: Leccion = {
  id: 'tsa-9',
  numero: 9,
  titulo: 'unknown y los errores',
  emoji: '🧪',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Ya sabes que `any` apaga a TypeScript: con any todo pasa, hasta los errores. Su primo juicioso es `unknown`, que quiere decir “no sé qué es”. Te deja guardar cualquier cosa, pero no te deja usarla hasta que preguntes qué es.',
    },
    {
      t: 'codigo',
      codigo:
        'function describir(x: unknown): string {\n  if (typeof x === "number") return "un número: " + x * 2\n  if (typeof x === "string") return "un texto de " + x.length + " letras"\n  return "otra cosa"\n}\n\nconsole.log(describir(21))\nconsole.log(describir("hola"))\nconsole.log(describir(true))',
    },
    {
      t: 'p',
      texto:
        'Ahora, los errores. Con `throw new Error("…")` tu programa avisa que algo salió mal y se detiene. Con `try { … } catch (e) { … }` atrapas el error para que no se rompa todo.',
    },
    {
      t: 'codigo',
      codigo:
        'function dividir(a: number, b: number): number {\n  if (b === 0) throw new Error("No se puede dividir por cero")\n  return a / b\n}\n\ntry {\n  console.log(dividir(10, 2))\n  console.log(dividir(1, 0))\n  console.log("esto no sale")\n} catch (e) {\n  if (e instanceof Error) console.log("Atrapado: " + e.message)\n}',
    },
    {
      t: 'p',
      texto:
        'Fíjate en el `catch`: lo que llega, `e`, es `unknown`, porque en JavaScript se puede lanzar cualquier cosa. Por eso se pregunta con `instanceof Error` antes de leer `e.message`.',
    },
    {
      t: 'ojo',
      texto: 'Usa `unknown` cuando no sepas qué llega, y `any` casi nunca. Con unknown, TypeScript te obliga a revisar; con any, se hace el de la vista gorda.',
    },
  ],
  retos: [
    {
      id: 'tsa-9-1',
      titulo: 'De any a unknown',
      enunciado:
        'Con any, largo(5) da undefined y nadie se entera. Cambia any por unknown: TypeScript se va a quejar. Pregunta con typeof: si es un texto, devuelve su length; si no, 0.',
      inicial: 'function largo(x: any): number {\n  return x.length\n}\n\nconsole.log(largo("hola"))\nconsole.log(largo(5))\n',
      pista: 'function largo(x: unknown): number { if (typeof x === "string") return x.length; return 0 }',
      solucion:
        'function largo(x: unknown): number {\n  if (typeof x === "string") return x.length\n  return 0\n}\n\nconsole.log(largo("hola"))\nconsole.log(largo(5))',
      pruebas: [
        { t: 'src', re: '\\bany\\b', not: true, msg: 'Ya no hay any' },
        { t: 'src', re: anotado('x', 'unknown\\b'), msg: 'x es unknown' },
        { t: 'salida', igual: '4\n0', msg: 'Salen 4 y 0' },
        { t: 'expr', code: 'largo(true)', igual: '0', msg: 'largo(true) es 0' },
      ],
    },
    {
      id: 'tsa-9-2',
      titulo: '¿Qué me mandaron?',
      enunciado:
        'Escribe sumarSiSePuede: recibe dos unknown. Si los dos son números, devuelve la suma; si no, null. Su tipo de salida es number | null.',
      inicial: '',
      pista: 'if (typeof a === "number" && typeof b === "number") return a + b. Si no, return null.',
      solucion:
        'function sumarSiSePuede(a: unknown, b: unknown): number | null {\n  if (typeof a === "number" && typeof b === "number") return a + b\n  return null\n}\n\nconsole.log(sumarSiSePuede(2, 3))',
      pruebas: [
        { t: 'src', re: '\\(\\s*\\w+\\s*:\\s*unknown\\s*,\\s*\\w+\\s*:\\s*unknown\\s*\\)', msg: 'Recibe dos unknown' },
        { t: 'src', re: '\\bany\\b', not: true, msg: 'Sin any' },
        { t: 'expr', code: 'sumarSiSePuede(2, 3)', igual: '5', msg: 'sumarSiSePuede(2, 3) es 5' },
        { t: 'expr', code: 'sumarSiSePuede(2, "3")', igual: 'null', msg: 'Con un texto, null' },
        { t: 'expr', code: 'sumarSiSePuede([], 1)', igual: 'null', msg: 'Con una lista, null' },
        { t: 'rechaza', code: 'const _n: number = sumarSiSePuede(1, 1)', msg: 'Puede devolver null: hay que revisarlo antes de usarlo' },
      ],
    },
    {
      id: 'tsa-9-3',
      titulo: 'No te alcanza',
      enunciado:
        'Escribe sacarPlata: recibe el saldo y cuánto quieres sacar. Si es más de lo que hay, lanza un Error con el mensaje No te alcanza. Si no, devuelve lo que queda.',
      inicial: '',
      pista: 'if (cuanto > saldo) throw new Error("No te alcanza"). Debajo: return saldo - cuanto',
      solucion:
        'function sacarPlata(saldo: number, cuanto: number): number {\n  if (cuanto > saldo) throw new Error("No te alcanza")\n  return saldo - cuanto\n}\n\nconsole.log(sacarPlata(1000, 300))',
      pruebas: [
        { t: 'src', re: '\\bthrow\\s+new\\s+Error\\s*\\(', msg: 'Lanzas un Error con throw new Error' },
        { t: 'expr', code: 'sacarPlata(1000, 300)', igual: '700', msg: 'De 1000 sacas 300: quedan 700' },
        { t: 'expr', code: 'sacarPlata(500, 500)', igual: '0', msg: 'Sacar todo sí se puede' },
        {
          t: 'expr',
          code: '(() => { try { sacarPlata(100, 500); return "no lanzó nada" } catch (e) { return e.message } })()',
          igual: '"No te alcanza"',
          msg: 'Sacar 500 de 100 lanza “No te alcanza”',
        },
      ],
    },
    {
      id: 'tsa-9-4',
      titulo: 'Atrápalo',
      enunciado:
        'Corre el programa: la segunda vez sacarPlata lanza el error y el programa se rompe. Mete las dos líneas en un try, y en el catch muestra: Error: (el mensaje). Acuérdate de preguntar con instanceof Error.',
      inicial:
        'function sacarPlata(saldo: number, cuanto: number): number {\n  if (cuanto > saldo) throw new Error("No te alcanza")\n  return saldo - cuanto\n}\n\nconsole.log("Te quedan " + sacarPlata(1000, 300))\nconsole.log("Te quedan " + sacarPlata(100, 500))\n',
      pista: 'try { …las dos líneas… } catch (e) { if (e instanceof Error) console.log("Error: " + e.message) }',
      solucion:
        'function sacarPlata(saldo: number, cuanto: number): number {\n  if (cuanto > saldo) throw new Error("No te alcanza")\n  return saldo - cuanto\n}\n\ntry {\n  console.log("Te quedan " + sacarPlata(1000, 300))\n  console.log("Te quedan " + sacarPlata(100, 500))\n} catch (e) {\n  if (e instanceof Error) console.log("Error: " + e.message)\n}',
      pruebas: [
        { t: 'src', re: '\\btry\\s*\\{', msg: 'Usas try' },
        { t: 'src', re: '\\binstanceof\\s+Error\\b', msg: 'Preguntas con instanceof Error' },
        { t: 'salida', igual: 'Te quedan 700\nError: No te alcanza', msg: 'Salen “Te quedan 700” y “Error: No te alcanza”' },
      ],
    },
    {
      id: 'tsa-9-5',
      titulo: 'Una edad con cuidado',
      enunciado:
        'Escribe leerEdad: recibe un texto y devuelve la edad como número. Si no es un número, lanza Eso no es un número. Si es menor que 0 o mayor que 120, lanza Edad imposible. Después pregunta la edad con prompt: si todo sale bien muestra Tienes (edad) años, y si no, Ups: (el mensaje).',
      inicial: '',
      entradas: ['11'],
      pista: 'Number.isNaN(n) te dice si Number(texto) no dio un número. El prompt y el console.log van adentro del try.',
      solucion:
        'function leerEdad(texto: string): number {\n  const n = Number(texto)\n  if (Number.isNaN(n)) throw new Error("Eso no es un número")\n  if (n < 0 || n > 120) throw new Error("Edad imposible")\n  return n\n}\n\ntry {\n  const edad = leerEdad(prompt("¿Cuántos años tienes? "))\n  console.log("Tienes " + edad + " años")\n} catch (e) {\n  if (e instanceof Error) console.log("Ups: " + e.message)\n}',
      pruebas: [
        { t: 'src', re: '\\bthrow\\s+new\\s+Error\\s*\\(', msg: 'Lanzas los errores con throw new Error' },
        { t: 'linea', n: -1, igual: 'Tienes 11 años', msg: 'Con 11: Tienes 11 años' },
        { t: 'linea', n: -1, igual: 'Ups: Eso no es un número', entradas: ['once'], msg: 'Con “once”: Ups: Eso no es un número' },
        { t: 'linea', n: -1, igual: 'Ups: Edad imposible', entradas: ['500'], msg: 'Con 500: Ups: Edad imposible' },
        { t: 'expr', code: 'leerEdad("8")', igual: '8', msg: 'leerEdad("8") es 8' },
        {
          t: 'expr',
          code: '(() => { try { leerEdad("-3"); return "no lanzó nada" } catch (e) { return e.message } })()',
          igual: '"Edad imposible"',
          msg: 'Con -3 también es imposible',
        },
      ],
    },
  ],
}

const L10: Leccion = {
  id: 'tsa-10',
  numero: 10,
  titulo: 'El tipo Resultado',
  emoji: '🏁',
  minutos: 30,
  explicacion: [
    {
      t: 'p',
      texto:
        'Lanzar errores funciona, pero tiene un problema: mirando el tipo de la función, nadie sabe que puede fallar. Hay otra forma, que usan muchos programadores: devolver el error en vez de lanzarlo. Con una unión con etiqueta, ¡como en la lección 1! Y con un genérico, para que sirva para todo.',
    },
    {
      t: 'codigo',
      codigo:
        'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\nfunction dividir(a: number, b: number): Resultado<number> {\n  if (b === 0) return { ok: false, error: "No se puede dividir por cero" }\n  return { ok: true, valor: a / b }\n}\n\nconst r = dividir(10, 4)\nif (r.ok) {\n  console.log("Dio " + r.valor)\n} else {\n  console.log("Falló: " + r.error)\n}',
    },
    {
      t: 'p',
      texto:
        'Ahora el tipo lo dice todo: `dividir` puede fallar, y TypeScript no te deja usar `r.valor` sin preguntar antes por `r.ok`. Aquí se junta todo el curso: uniones con etiqueta, genéricos y funciones.',
    },
    {
      t: 'p',
      texto: 'Un Resultado que falló se puede devolver tal cual. Así, una función usa a otra sin perder el error:',
    },
    {
      t: 'codigo',
      codigo:
        'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\nfunction dividir(a: number, b: number): Resultado<number> {\n  if (b === 0) return { ok: false, error: "No se puede dividir por cero" }\n  return { ok: true, valor: a / b }\n}\n\nfunction mitadDe(a: number, b: number): Resultado<number> {\n  const r = dividir(a, b)\n  if (!r.ok) return r            // el error sigue su camino\n  return { ok: true, valor: r.valor / 2 }\n}\n\nconsole.log(mitadDe(10, 5))\nconsole.log(mitadDe(1, 0))',
    },
    {
      t: 'ojo',
      texto: 'La etiqueta aquí es un boolean: `ok: true` y `ok: false` son tipos literales, como "rojo" o "verde".',
    },
  ],
  retos: [
    {
      id: 'tsa-10-1',
      titulo: 'Sin preguntar, no',
      enunciado:
        'Corre el programa: TypeScript no deja usar r.valor, porque dividir pudo fallar. Pregunta por r.ok: si salió bien, muestra Dio (valor); si no, Falló: (error).',
      inicial:
        'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\nfunction dividir(a: number, b: number): Resultado<number> {\n  if (b === 0) return { ok: false, error: "No se puede dividir por cero" }\n  return { ok: true, valor: a / b }\n}\n\nconst r = dividir(10, 4)\nconsole.log("Dio " + r.valor)\n',
      pista: 'if (r.ok) { console.log("Dio " + r.valor) } else { console.log("Falló: " + r.error) }',
      solucion:
        'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\nfunction dividir(a: number, b: number): Resultado<number> {\n  if (b === 0) return { ok: false, error: "No se puede dividir por cero" }\n  return { ok: true, valor: a / b }\n}\n\nconst r = dividir(10, 4)\nif (r.ok) {\n  console.log("Dio " + r.valor)\n} else {\n  console.log("Falló: " + r.error)\n}',
      pruebas: [
        { t: 'src', re: '\\br\\.ok\\b', msg: 'Preguntas por r.ok' },
        { t: 'src', re: '"Fall[oó]:', msg: 'También muestras cuando falla' },
        { t: 'salida', igual: 'Dio 2.5', msg: 'Sale “Dio 2.5”' },
      ],
    },
    {
      id: 'tsa-10-2',
      titulo: 'La raíz',
      enunciado:
        'Escribe raiz: recibe un número y devuelve un Resultado<number>. Si el número es negativo, falla con el error No hay raíz de un negativo. Si no, el valor es Math.sqrt(n).',
      inicial: 'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\n',
      pista: 'if (n < 0) return { ok: false, error: "No hay raíz de un negativo" }. Si no: return { ok: true, valor: Math.sqrt(n) }',
      solucion:
        'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\nfunction raiz(n: number): Resultado<number> {\n  if (n < 0) return { ok: false, error: "No hay raíz de un negativo" }\n  return { ok: true, valor: Math.sqrt(n) }\n}\n\nconsole.log(raiz(9))',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*Resultado\\s*<\\s*number\\s*>', msg: 'raiz devuelve un Resultado<number>' },
        { t: 'expr', code: 'raiz(9).ok', igual: 'true', msg: 'La raíz de 9 sale bien' },
        { t: 'expr', code: 'raiz(9).valor', igual: '3', msg: 'La raíz de 9 es 3' },
        { t: 'expr', code: 'raiz(-4).ok', igual: 'false', msg: 'La de -4 falla' },
        { t: 'expr', code: 'raiz(-4).error', igual: '"No hay raíz de un negativo"', msg: 'Con el error “No hay raíz de un negativo”' },
        { t: 'rechaza', code: 'const _v: number = raiz(4).valor', msg: 'Hay que preguntar por ok antes de usar el valor' },
      ],
    },
    {
      id: 'tsa-10-3',
      titulo: 'De texto a número',
      enunciado:
        'Escribe aNumero: recibe un texto y devuelve un Resultado<number>. Si Number(texto) no es un número, falla con el error (texto) no es un número.\n\naNumero("hola") → falla con hola no es un número',
      inicial: 'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\n',
      pista: 'const n = Number(texto). Si Number.isNaN(n), return { ok: false, error: texto + " no es un número" }',
      solucion:
        'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\nfunction aNumero(texto: string): Resultado<number> {\n  const n = Number(texto)\n  if (Number.isNaN(n)) return { ok: false, error: texto + " no es un número" }\n  return { ok: true, valor: n }\n}\n\nconsole.log(aNumero("12"))',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*Resultado\\s*<\\s*number\\s*>', msg: 'aNumero devuelve un Resultado<number>' },
        { t: 'src', re: '\\bthrow\\b', not: true, msg: 'Sin throw: el error se devuelve' },
        { t: 'expr', code: 'aNumero("12").valor', igual: '12', msg: '“12” da 12' },
        { t: 'expr', code: 'aNumero("hola").ok', igual: 'false', msg: '“hola” falla' },
        { t: 'expr', code: 'aNumero("hola").error', igual: '"hola no es un número"', msg: 'Con el error “hola no es un número”' },
      ],
    },
    {
      id: 'tsa-10-4',
      titulo: 'Una cosa tras otra',
      enunciado:
        'Escribe edadValida usando aNumero: si aNumero falló, devuelve ese mismo Resultado. Si salió bien pero la edad es menor que 0 o mayor que 120, falla con Edad imposible. Si no, devuelve la edad.',
      inicial:
        'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\nfunction aNumero(texto: string): Resultado<number> {\n  const n = Number(texto)\n  if (Number.isNaN(n)) return { ok: false, error: texto + " no es un número" }\n  return { ok: true, valor: n }\n}\n\n// Escribe aquí edadValida\n',
      pista: 'const r = aNumero(texto); if (!r.ok) return r. Después revisa r.valor.',
      solucion:
        'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\nfunction aNumero(texto: string): Resultado<number> {\n  const n = Number(texto)\n  if (Number.isNaN(n)) return { ok: false, error: texto + " no es un número" }\n  return { ok: true, valor: n }\n}\n\nfunction edadValida(texto: string): Resultado<number> {\n  const r = aNumero(texto)\n  if (!r.ok) return r\n  if (r.valor < 0 || r.valor > 120) return { ok: false, error: "Edad imposible" }\n  return r\n}\n\nconsole.log(edadValida("11"))',
      pruebas: [
        { t: 'src', re: '\\bedadValida\\s*\\(\\s*\\w+\\s*:\\s*string\\s*\\)\\s*:\\s*Resultado\\s*<\\s*number\\s*>', msg: 'edadValida recibe un string y devuelve un Resultado<number>' },
        { t: 'src', re: '\\baNumero\\s*\\(', min: 2, msg: 'Usas aNumero adentro de edadValida' },
        { t: 'expr', code: 'edadValida("11").valor', igual: '11', msg: '“11” da 11' },
        { t: 'expr', code: 'edadValida("abc").error', igual: '"abc no es un número"', msg: '“abc” trae el error de aNumero' },
        { t: 'expr', code: 'edadValida("200").error', igual: '"Edad imposible"', msg: '“200” es una edad imposible' },
        { t: 'expr', code: 'edadValida("-1").ok', igual: 'false', msg: '“-1” también falla' },
      ],
    },
    {
      id: 'tsa-10-5',
      titulo: 'El cajero',
      enunciado:
        'El gran final. Escribe aplicar: recibe el saldo y un Movimiento, y devuelve un Resultado<number> con el saldo nuevo. Usa un switch con su alarma de never.\n\nEn los dos, si el monto no es mayor que 0: Monto inválido\nmeter → saldo + monto\nsacar → si el monto es mayor que el saldo: No te alcanza; si no, saldo - monto\n\nEl programa ya recorre los movimientos: si sale bien muestra Saldo: (saldo) y si no, No se pudo: (error), y el saldo queda igual.',
      inicial:
        'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\ntype Movimiento =\n  | { tipo: "meter"; monto: number }\n  | { tipo: "sacar"; monto: number }\n\n// Escribe aquí la función aplicar\n\nconst movimientos: Movimiento[] = [\n  { tipo: "meter", monto: 500 },\n  { tipo: "sacar", monto: 2000 },\n  { tipo: "sacar", monto: 300 },\n  { tipo: "meter", monto: -5 },\n]\n\nlet saldo = 1000\nfor (const m of movimientos) {\n  const r = aplicar(saldo, m)\n  if (r.ok) {\n    saldo = r.valor\n    console.log("Saldo: " + saldo)\n  } else {\n    console.log("No se pudo: " + r.error)\n  }\n}\n',
      pista:
        'Primero: if (m.monto <= 0) return { ok: false, error: "Monto inválido" }. Después switch (m.tipo) con case "meter", case "sacar" y el default con never.',
      solucion:
        'type Resultado<T> =\n  | { ok: true; valor: T }\n  | { ok: false; error: string }\n\ntype Movimiento =\n  | { tipo: "meter"; monto: number }\n  | { tipo: "sacar"; monto: number }\n\nfunction aplicar(saldo: number, m: Movimiento): Resultado<number> {\n  if (m.monto <= 0) return { ok: false, error: "Monto inválido" }\n  switch (m.tipo) {\n    case "meter":\n      return { ok: true, valor: saldo + m.monto }\n    case "sacar":\n      if (m.monto > saldo) return { ok: false, error: "No te alcanza" }\n      return { ok: true, valor: saldo - m.monto }\n    default: {\n      const nunca: never = m\n      return nunca\n    }\n  }\n}\n\nconst movimientos: Movimiento[] = [\n  { tipo: "meter", monto: 500 },\n  { tipo: "sacar", monto: 2000 },\n  { tipo: "sacar", monto: 300 },\n  { tipo: "meter", monto: -5 },\n]\n\nlet saldo = 1000\nfor (const m of movimientos) {\n  const r = aplicar(saldo, m)\n  if (r.ok) {\n    saldo = r.valor\n    console.log("Saldo: " + saldo)\n  } else {\n    console.log("No se pudo: " + r.error)\n  }\n}',
      pruebas: [
        { t: 'src', re: '\\)\\s*:\\s*Resultado\\s*<\\s*number\\s*>', msg: 'aplicar devuelve un Resultado<number>' },
        { t: 'src', re: '\\bswitch\\s*\\(', msg: 'Usas switch' },
        CON_NEVER,
        {
          t: 'salida',
          igual: 'Saldo: 1500\nNo se pudo: No te alcanza\nSaldo: 1200\nNo se pudo: Monto inválido',
          msg: 'Mete 500, no alcanza para 2000, saca 300 y no deja meter -5',
        },
        { t: 'expr', code: 'aplicar(100, { tipo: "sacar", monto: 100 }).valor', igual: '0', msg: 'Sacar todo deja el saldo en 0' },
        { t: 'expr', code: 'aplicar(100, { tipo: "sacar", monto: 0 }).error', igual: '"Monto inválido"', msg: 'Sacar 0 es un monto inválido' },
        { t: 'rechaza', code: 'aplicar(0, { tipo: "prestar", monto: 5 })', msg: 'El cajero no presta' },
      ],
    },
  ],
}

export const CURSO_TYPESCRIPT_AVANZADO: Curso = {
  id: 'typescript-avanzado',
  titulo: 'TypeScript avanzado',
  emoji: '💎',
  descripcion:
    'La segunda parte: los tipos que usan los programadores de verdad. Uniones con etiqueta que no dejan olvidar un caso, tipos que salen de otros, funciones y genéricos con reglas, tuplas, unknown y errores, cerrando con un cajero que junta todo.',
  lenguaje: 'typescript',
  requiere: 'typescript',
  despedida: 'Ya escribes TypeScript como en las empresas: con tipos que piensan por ti y no dejan pasar un caso olvidado.',
  lecciones: [L1, L2, L3, L4, L5, L6, L7, L8, L9, L10],
}
