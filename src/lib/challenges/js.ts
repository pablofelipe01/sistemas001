import type { Challenge } from '../types'

/**
 * 25 retos de JavaScript, en el orden de la Guía 3.
 * Del 14 en adelante las pruebas llaman a las funciones del alumno con valores
 * que él nunca vio: así no sirve de nada acertar de casualidad.
 */
export const JS_CHALLENGES: Challenge[] = [
  {
    id: 'js-01',
    lang: 'js',
    n: 1,
    title: 'Hablarle a la consola',
    brief:
      'La consola es la ventana por donde JavaScript te habla. Imprime en ella, exactamente, el mensaje: Hola mundo',
    goal: ['Una sola línea impresa en la consola', 'Que diga exactamente Hola mundo'],
    starter: '',
    hint: 'Se escribe console, punto, log, y entre paréntesis el mensaje entre comillas.',
    skeleton: 'console.__("Hola mundo");',
    solution: 'console.log("Hola mundo");',
    tests: [
      { t: 'logCount', eq: 1, msg: 'Debe imprimirse exactamente un mensaje' },
      { t: 'log', at: 0, eq: 'Hola mundo', msg: 'El mensaje debe ser exactamente: Hola mundo' },
    ],
  },
  {
    id: 'js-02',
    lang: 'js',
    n: 2,
    title: 'Cajas con nombre',
    brief:
      'Una variable es una caja donde guardas un dato. Si el valor nunca va a cambiar se usa const; si va a cambiar, let. Guarda el colegio (que no cambia) y la edad (que sí), e imprime las dos.',
    goal: [
      'Una constante llamada colegio con el valor San José',
      'Una variable llamada edad con el valor 12',
      'Imprimir las dos en la consola',
    ],
    starter: '',
    hint: 'Se escribe la palabra (const o let), el nombre, un signo igual y el valor. El texto va entre comillas; el número, sin comillas.',
    skeleton: '__ colegio = "San José";\n__ edad = 12;\n\nconsole.log(__);\nconsole.log(__);',
    solution: 'const colegio = "San José";\nlet edad = 12;\n\nconsole.log(colegio);\nconsole.log(edad);',
    tests: [
      { t: 'expr', code: 'colegio', eq: 'San José', msg: 'Falta la variable colegio con el valor San José' },
      { t: 'expr', code: 'edad', eq: 12, msg: 'Falta la variable edad con el valor 12 (sin comillas: es un número)' },
      { t: 'src', re: 'const\\s+colegio', msg: 'colegio debe declararse con const, porque nunca cambia' },
      { t: 'src', re: 'let\\s+edad', msg: 'edad debe declararse con let, porque puede cambiar' },
      { t: 'logCount', min: 2, msg: 'Debes imprimir las dos variables' },
    ],
  },
  {
    id: 'js-03',
    lang: 'js',
    n: 3,
    title: 'La calculadora',
    brief:
      'Ya tienes a valiendo 10 y b valiendo 3. Crea cuatro variables nuevas con las cuatro operaciones. La última es la rara: el porcentaje NO es porcentaje, es el resto de la división.',
    goal: [
      'suma con a más b',
      'resta con a menos b',
      'producto con a por b',
      'resto con el sobrante de dividir a entre b',
    ],
    starter: 'let a = 10;\nlet b = 3;\n',
    hint: 'La multiplicación es el asterisco y el resto de la división es el símbolo de porcentaje. 10 entre 3 da 3 y sobra 1.',
    skeleton: 'let a = 10;\nlet b = 3;\n\nlet suma = a + b;\nlet resta = __;\nlet producto = a __ b;\nlet resto = a __ b;',
    solution: 'let a = 10;\nlet b = 3;\n\nlet suma = a + b;\nlet resta = a - b;\nlet producto = a * b;\nlet resto = a % b;',
    tests: [
      { t: 'expr', code: 'suma', eq: 13, msg: 'suma debe valer 13' },
      { t: 'expr', code: 'resta', eq: 7, msg: 'resta debe valer 7' },
      { t: 'expr', code: 'producto', eq: 30, msg: 'producto debe valer 30' },
      { t: 'expr', code: 'resto', eq: 1, msg: 'resto debe valer 1 (lo que sobra al dividir 10 entre 3)' },
    ],
  },
  {
    id: 'js-04',
    lang: 'js',
    n: 4,
    title: 'Los acentos graves',
    brief:
      'Pegar textos con el signo más es la forma antigua y se llena de comillas. La forma moderna usa acentos graves (la tecla a la izquierda del 1) y mete las variables con el símbolo del dólar y llaves. Arma la frase con esa forma.',
    goal: [
      'Una variable frase con el valor: Hola Camila, tienes 12 años',
      'Armada con acentos graves, no pegando textos con el signo más',
    ],
    starter: 'let nombre = "Camila";\nlet edad = 12;\n',
    hint: 'Se abre acento grave, se escribe el texto normal, y donde va la variable se pone el símbolo del dólar seguido de la variable entre llaves.',
    skeleton: 'let nombre = "Camila";\nlet edad = 12;\n\nlet frase = `Hola __, tienes __ años`;\nconsole.log(frase);',
    solution: 'let nombre = "Camila";\nlet edad = 12;\n\nlet frase = `Hola ${nombre}, tienes ${edad} años`;\nconsole.log(frase);',
    tests: [
      { t: 'expr', code: 'frase', eq: 'Hola Camila, tienes 12 años', msg: 'frase debe decir: Hola Camila, tienes 12 años' },
      { t: 'src', re: '`', msg: 'Debes usar acentos graves, no comillas normales' },
      { t: 'src', re: '\\$\\{', msg: 'Las variables se meten con el símbolo del dólar y llaves' },
    ],
  },
  {
    id: 'js-05',
    lang: 'js',
    n: 5,
    title: 'Jugar con el texto',
    brief:
      'A un texto se le pueden pedir cosas escribiendo un punto después. Sácale tres datos a la frase que ya está escrita.',
    goal: [
      'largo: cuántas letras tiene la frase',
      'gritado: la frase toda en mayúsculas',
      'tiene: si la frase contiene la palabra gusta (verdadero o falso)',
    ],
    starter: 'let frase = "Me gusta programar";\n',
    hint: 'length va sin paréntesis porque no es una acción, es un dato. toUpperCase e includes sí llevan paréntesis, y includes lleva adentro la palabra que se busca.',
    skeleton:
      'let frase = "Me gusta programar";\n\nlet largo = frase.__;\nlet gritado = frase.__();\nlet tiene = frase.__("gusta");',
    solution:
      'let frase = "Me gusta programar";\n\nlet largo = frase.length;\nlet gritado = frase.toUpperCase();\nlet tiene = frase.includes("gusta");',
    tests: [
      { t: 'expr', code: 'largo', eq: 18, msg: 'largo debe ser el número de letras de la frase (incluyendo los espacios)' },
      { t: 'expr', code: 'gritado', eq: 'ME GUSTA PROGRAMAR', msg: 'gritado debe ser la frase en mayúsculas' },
      { t: 'expr', code: 'tiene', eq: true, msg: 'tiene debe ser true, porque la frase sí contiene la palabra gusta' },
    ],
  },
  {
    id: 'js-06',
    lang: 'js',
    n: 6,
    title: 'La primera decisión',
    brief:
      'Aquí el programa empieza a pensar. La edad ya está guardada. Escribe un if con su else que guarde en la variable mensaje el texto que corresponde: Eres mayor de edad si tiene 18 o más, y Eres menor de edad si no.',
    goal: ['Una variable mensaje', 'Un if con su else que decida el valor', 'Usar la comparación de mayor o igual'],
    starter: 'let edad = 12;\nlet mensaje = "";\n',
    hint: 'La pregunta va entre paréntesis y solo puede responderse con sí o no. Mayor o igual se escribe con el símbolo de mayor pegado al igual.',
    skeleton:
      'let edad = 12;\nlet mensaje = "";\n\nif (edad __ 18) {\n  mensaje = "__";\n} __ {\n  mensaje = "__";\n}\n\nconsole.log(mensaje);',
    solution:
      'let edad = 12;\nlet mensaje = "";\n\nif (edad >= 18) {\n  mensaje = "Eres mayor de edad";\n} else {\n  mensaje = "Eres menor de edad";\n}\n\nconsole.log(mensaje);',
    tests: [
      { t: 'expr', code: 'mensaje', eq: 'Eres menor de edad', msg: 'Con edad de 12, mensaje debe quedar en: Eres menor de edad' },
      { t: 'src', re: '\\bif\\s*\\(', msg: 'Debes usar un if' },
      { t: 'src', re: '\\belse\\b', msg: 'Debes usar un else' },
      { t: 'src', re: '>=', msg: 'Usa la comparación de mayor o igual (>=) contra 18' },
    ],
  },
  {
    id: 'js-07',
    lang: 'js',
    n: 7,
    title: 'La cadena de decisiones',
    brief:
      'JavaScript revisa de arriba hacia abajo y se detiene en la primera que sea verdadera, así que el orden importa muchísimo. Con la nota que ya está guardada, deja en mensaje: Excelente si es 4.5 o más, Bien si es 3.5 o más, Aceptable si es 3.0 o más, y Hay que estudiar más en cualquier otro caso.',
    goal: ['Una cadena de if, else if y else', 'Que deje el texto correcto en la variable mensaje'],
    starter: 'let nota = 4.2;\nlet mensaje = "";\n',
    hint: 'Después del primer if, cada nuevo caso se escribe con else if y su propia pregunta entre paréntesis. El último else no lleva pregunta. Ponlos de mayor a menor o la cadena falla.',
    skeleton:
      'let nota = 4.2;\nlet mensaje = "";\n\nif (nota >= 4.5) {\n  mensaje = "Excelente";\n} __ __ (nota >= __) {\n  mensaje = "__";\n} else if (nota >= __) {\n  mensaje = "__";\n} else {\n  mensaje = "__";\n}',
    solution:
      'let nota = 4.2;\nlet mensaje = "";\n\nif (nota >= 4.5) {\n  mensaje = "Excelente";\n} else if (nota >= 3.5) {\n  mensaje = "Bien";\n} else if (nota >= 3.0) {\n  mensaje = "Aceptable";\n} else {\n  mensaje = "Hay que estudiar más";\n}',
    tests: [
      { t: 'expr', code: 'mensaje', eq: 'Bien', msg: 'Con nota 4.2, mensaje debe quedar en: Bien' },
      { t: 'src', re: 'else\\s+if', msg: 'Debes usar al menos un else if' },
      { t: 'src', re: '4\\.5', msg: 'Falta el caso de 4.5 o más (Excelente)' },
      { t: 'src', re: '3\\.5', msg: 'Falta el caso de 3.5 o más (Bien)' },
      { t: 'src', re: '3(\\.0)?\\s*\\)', msg: 'Falta el caso de 3.0 o más (Aceptable)' },
      { t: 'src', re: 'Hay que estudiar más', msg: 'Falta el caso final: Hay que estudiar más' },
    ],
  },
  {
    id: 'js-08',
    lang: 'js',
    n: 8,
    title: 'Y, O',
    brief:
      'Dos condiciones se pueden juntar: con Y tienen que cumplirse las dos, con O basta con una. Usa las dos para responder dos preguntas sobre los datos que ya están guardados.',
    goal: [
      'esAdolescente: verdadero si la edad está entre 13 y 19, los dos incluidos',
      'esFinDeSemana: verdadero si el día es sábado o es domingo',
    ],
    starter: 'let edad = 15;\nlet dia = "domingo";\n',
    hint: 'El Y son dos ampersand pegados y el O son dos barras verticales pegadas. Para comparar si dos cosas son iguales se usan tres signos igual, no uno.',
    skeleton:
      'let edad = 15;\nlet dia = "domingo";\n\nlet esAdolescente = edad >= 13 __ edad <= 19;\nlet esFinDeSemana = dia __ "sábado" __ dia === "domingo";',
    solution:
      'let edad = 15;\nlet dia = "domingo";\n\nlet esAdolescente = edad >= 13 && edad <= 19;\nlet esFinDeSemana = dia === "sábado" || dia === "domingo";',
    tests: [
      { t: 'expr', code: 'esAdolescente', eq: true, msg: 'esAdolescente debe ser true (15 está entre 13 y 19)' },
      { t: 'expr', code: 'esFinDeSemana', eq: true, msg: 'esFinDeSemana debe ser true (domingo es fin de semana)' },
      { t: 'src', re: '&&', msg: 'Debes usar el operador Y (&&) en esAdolescente' },
      { t: 'src', re: '\\|\\|', msg: 'Debes usar el operador O (||) en esFinDeSemana' },
      { t: 'src', re: '===', msg: 'Para comparar se usan tres signos igual (===), no uno solo' },
    ],
  },
  {
    id: 'js-09',
    lang: 'js',
    n: 9,
    title: 'Cinco vueltas',
    brief:
      'Cuando hay que hacer algo muchas veces no se copia y se pega: se usa un ciclo. Imprime cinco líneas seguidas: Vuelta número 1, Vuelta número 2, y así hasta la 5.',
    goal: ['Un ciclo for', 'Exactamente 5 mensajes impresos', 'Del 1 al 5, en ese orden'],
    starter: '',
    hint: 'Entre paréntesis van tres pedazos separados por punto y coma: dónde empieza el contador, hasta cuándo sigue, y cuánto suma cada vuelta. Usa acentos graves para meter el número en el texto.',
    skeleton: 'for (let i = __; i <= __; i__) {\n  console.log(`Vuelta número ${__}`);\n}',
    solution: 'for (let i = 1; i <= 5; i++) {\n  console.log(`Vuelta número ${i}`);\n}',
    tests: [
      { t: 'logCount', eq: 5, msg: 'Deben imprimirse exactamente 5 mensajes' },
      { t: 'log', at: 0, eq: 'Vuelta número 1', msg: 'El primer mensaje debe ser: Vuelta número 1' },
      { t: 'log', at: 4, eq: 'Vuelta número 5', msg: 'El último mensaje debe ser: Vuelta número 5' },
      { t: 'src', re: '\\bfor\\s*\\(', msg: 'Tiene que hacerse con un ciclo for, no con cinco console.log' },
    ],
  },
  {
    id: 'js-10',
    lang: 'js',
    n: 10,
    title: 'La tabla del 7',
    brief:
      'La tarea que en el cuaderno toma diez renglones, aquí toma tres. Imprime la tabla del 7 completa, del 1 al 10, con este formato exacto: 7 x 1 = 7',
    goal: ['Diez líneas impresas', 'Con el formato 7 x 1 = 7, usando la equis minúscula y espacios alrededor'],
    starter: '',
    hint: 'Es el mismo for de antes, pero adentro del texto van dos cosas: el número de la vuelta y el resultado de multiplicar 7 por ese número.',
    skeleton: 'for (let i = 1; i <= 10; i++) {\n  console.log(`7 x ${i} = ${__}`);\n}',
    solution: 'for (let i = 1; i <= 10; i++) {\n  console.log(`7 x ${i} = ${7 * i}`);\n}',
    tests: [
      { t: 'logCount', eq: 10, msg: 'Deben imprimirse exactamente 10 líneas' },
      { t: 'log', at: 0, eq: '7 x 1 = 7', msg: 'La primera línea debe ser: 7 x 1 = 7' },
      { t: 'log', at: 6, eq: '7 x 7 = 49', msg: 'La séptima línea debe ser: 7 x 7 = 49' },
      { t: 'log', at: 9, eq: '7 x 10 = 70', msg: 'La última línea debe ser: 7 x 10 = 70' },
      { t: 'src', re: '\\bfor\\s*\\(', msg: 'Tiene que hacerse con un ciclo for' },
    ],
  },
  {
    id: 'js-11',
    lang: 'js',
    n: 11,
    title: 'La cuenta regresiva',
    brief:
      'Un ciclo también puede ir hacia atrás: basta con empezar arriba, terminar abajo y restar en vez de sumar. Imprime la cuenta regresiva del 10 al 1, un número por línea.',
    goal: ['Un ciclo for que va hacia atrás', 'Diez líneas: 10, 9, 8... hasta 1'],
    starter: '',
    hint: 'Empieza en 10, sigue mientras sea mayor o igual a 1, y en vez de sumar uno, resta uno. Restar uno se escribe con dos signos menos pegados.',
    skeleton: 'for (let i = __; i __ 1; i__) {\n  console.log(i);\n}',
    solution: 'for (let i = 10; i >= 1; i--) {\n  console.log(i);\n}',
    tests: [
      { t: 'logCount', eq: 10, msg: 'Deben imprimirse exactamente 10 números' },
      { t: 'log', at: 0, eq: '10', msg: 'El primero debe ser el 10' },
      { t: 'log', at: 9, eq: '1', msg: 'El último debe ser el 1' },
      { t: 'log', at: 5, eq: '5', msg: 'El sexto número debe ser el 5' },
      { t: 'src', re: '\\bfor\\s*\\(', msg: 'Tiene que hacerse con un ciclo for' },
    ],
  },
  {
    id: 'js-12',
    lang: 'js',
    n: 12,
    title: 'La receta con nombre',
    brief:
      'Una función es un pedazo de código con nombre: la escribes una vez y la usas cuantas veces quieras. Ojo con la trampa: definirla no hace nada, hay que llamarla. Escribe la función y llámala DOS veces.',
    goal: [
      'Una función llamada saludar que imprima ¡Hola a todos!',
      'Llamarla dos veces, así que deben salir dos mensajes',
    ],
    starter: '',
    hint: 'Se escribe la palabra function, el nombre, paréntesis vacíos y las llaves con el código adentro. Para llamarla, se escribe el nombre con los paréntesis y punto y coma.',
    skeleton: '__ saludar() {\n  console.log("¡Hola a todos!");\n}\n\n__;\n__;',
    solution: 'function saludar() {\n  console.log("¡Hola a todos!");\n}\n\nsaludar();\nsaludar();',
    tests: [
      { t: 'expr', code: 'typeof saludar', eq: 'function', msg: 'Falta la función llamada saludar' },
      { t: 'logCount', eq: 2, msg: 'Debes llamar la función dos veces, así que deben salir 2 mensajes' },
      { t: 'log', at: 0, eq: '¡Hola a todos!', msg: 'El mensaje debe ser exactamente: ¡Hola a todos!' },
      { t: 'log', at: 1, eq: '¡Hola a todos!', msg: 'El segundo mensaje también debe ser: ¡Hola a todos!' },
    ],
  },
  {
    id: 'js-13',
    lang: 'js',
    n: 13,
    title: 'Los ingredientes',
    brief:
      'Lo que va entre los paréntesis de una función se llama parámetro: es la información que necesita para trabajar, como los ingredientes de una receta. Haz que saludar reciba un nombre y salude a quien sea.',
    goal: [
      'Una función saludar que reciba un parámetro llamado nombre',
      'Que imprima: Hola Camila, qué bueno verte (cambiando el nombre según quien llegue)',
      'Llamarla una vez con Camila',
    ],
    starter: '',
    hint: 'El parámetro se escribe dentro de los paréntesis de la definición, sin comillas y sin let. Adentro se usa como cualquier variable, con acentos graves.',
    skeleton:
      'function saludar(__) {\n  console.log(`Hola ${__}, qué bueno verte`);\n}\n\nsaludar("__");',
    solution:
      'function saludar(nombre) {\n  console.log(`Hola ${nombre}, qué bueno verte`);\n}\n\nsaludar("Camila");',
    tests: [
      { t: 'expr', code: 'typeof saludar', eq: 'function', msg: 'Falta la función saludar' },
      { t: 'expr', code: 'saludar.length', eq: 1, msg: 'La función saludar debe recibir exactamente un parámetro' },
      { t: 'log', at: 0, eq: 'Hola Camila, qué bueno verte', msg: 'Al llamarla con Camila debe imprimir: Hola Camila, qué bueno verte' },
      { t: 'log', has: 'qué bueno verte', msg: 'El mensaje debe terminar en: qué bueno verte' },
    ],
  },
  {
    id: 'js-14',
    lang: 'js',
    n: 14,
    title: 'Devolver en vez de imprimir',
    brief:
      'Hasta ahora las funciones imprimían. Esta va a ENTREGAR el resultado, que es distinto y mucho más útil: lo que entrega se puede guardar y volver a usar. Y cuidado, todo lo que se escriba después de un return nunca se ejecuta.',
    goal: ['Una función sumar que reciba dos números', 'Que devuelva la suma (no que la imprima)'],
    starter: '',
    hint: 'La palabra clave es return. La función no debe llevar ningún console.log adentro: solo devuelve.',
    skeleton: 'function sumar(a, b) {\n  __ a + b;\n}',
    solution: 'function sumar(a, b) {\n  return a + b;\n}',
    tests: [
      { t: 'expr', code: 'typeof sumar', eq: 'function', msg: 'Falta la función sumar' },
      { t: 'expr', code: 'sumar(5, 3)', eq: 8, msg: 'sumar(5, 3) debe devolver 8' },
      { t: 'expr', code: 'sumar(10, 20)', eq: 30, msg: 'sumar(10, 20) debe devolver 30' },
      { t: 'expr', code: 'sumar(-4, 4)', eq: 0, msg: 'sumar(-4, 4) debe devolver 0' },
      { t: 'expr', code: 'sumar(1.5, 2.5)', eq: 4, msg: 'sumar(1.5, 2.5) debe devolver 4' },
      { t: 'src', re: '\\breturn\\b', msg: 'La función debe devolver el resultado con return' },
    ],
  },
  {
    id: 'js-15',
    lang: 'js',
    n: 15,
    title: 'Par o impar',
    brief:
      'El resto de la división es la herramienta secreta para saber si un número es par: si al dividirlo entre 2 no sobra nada, es par. Escribe una función que lo responda con verdadero o falso.',
    goal: ['Una función esPar que reciba un número', 'Que devuelva true si es par y false si no'],
    starter: '',
    hint: 'Un número es par cuando el resto de dividirlo entre 2 da exactamente 0. Puedes hacerlo con un if y dos return, o devolviendo directamente la comparación.',
    skeleton: 'function esPar(numero) {\n  if (numero __ 2 === 0) {\n    return __;\n  } else {\n    return __;\n  }\n}',
    solution: 'function esPar(numero) {\n  if (numero % 2 === 0) {\n    return true;\n  } else {\n    return false;\n  }\n}',
    tests: [
      { t: 'expr', code: 'typeof esPar', eq: 'function', msg: 'Falta la función esPar' },
      { t: 'expr', code: 'esPar(4)', eq: true, msg: 'esPar(4) debe devolver true' },
      { t: 'expr', code: 'esPar(7)', eq: false, msg: 'esPar(7) debe devolver false' },
      { t: 'expr', code: 'esPar(0)', eq: true, msg: 'esPar(0) debe devolver true: el cero es par' },
      { t: 'expr', code: 'esPar(101)', eq: false, msg: 'esPar(101) debe devolver false' },
      { t: 'src', re: '%', msg: 'Usa el operador de resto (%) para saber si es par' },
    ],
  },
  {
    id: 'js-16',
    lang: 'js',
    n: 16,
    title: 'El más grande',
    brief:
      'Una función que recibe dos números y devuelve el mayor de los dos. Y si son iguales, devuelve ese mismo. Las pruebas la van a llamar con números que tú no viste, así que tiene que funcionar de verdad.',
    goal: ['Una función mayor que reciba dos números', 'Que devuelva el más grande de los dos'],
    starter: '',
    hint: 'Un if que compare los dos, un return en cada rama. Si el primero es más grande devuelve el primero; si no, devuelve el segundo.',
    skeleton: 'function mayor(a, b) {\n  if (a __ b) {\n    return __;\n  } else {\n    return __;\n  }\n}',
    solution: 'function mayor(a, b) {\n  if (a > b) {\n    return a;\n  } else {\n    return b;\n  }\n}',
    tests: [
      { t: 'expr', code: 'typeof mayor', eq: 'function', msg: 'Falta la función mayor' },
      { t: 'expr', code: 'mayor(3, 9)', eq: 9, msg: 'mayor(3, 9) debe devolver 9' },
      { t: 'expr', code: 'mayor(10, 2)', eq: 10, msg: 'mayor(10, 2) debe devolver 10' },
      { t: 'expr', code: 'mayor(5, 5)', eq: 5, msg: 'mayor(5, 5) debe devolver 5' },
      { t: 'expr', code: 'mayor(-8, -3)', eq: -3, msg: 'mayor(-8, -3) debe devolver -3: con negativos, el mayor es el que está más cerca del cero' },
    ],
  },
  {
    id: 'js-17',
    lang: 'js',
    n: 17,
    title: 'La lista',
    brief:
      'Un array guarda muchos valores en orden, dentro de corchetes. Lo más raro del mundo al principio: se empieza a contar desde CERO. Crea la lista y sácale tres datos.',
    goal: [
      'Un array frutas con manzana, banano y mango, en ese orden',
      'primera: el primer elemento de la lista',
      'ultima: el último elemento de la lista',
      'cuantas: cuántos elementos tiene',
    ],
    starter: '',
    hint: 'Los elementos se piden con corchetes y el número de la posición. El primero es el cero. Para saber cuántos hay se usa length, sin paréntesis.',
    skeleton:
      'let frutas = ["manzana", "__", "__"];\n\nlet primera = frutas[__];\nlet ultima = frutas[__];\nlet cuantas = frutas.__;',
    solution:
      'let frutas = ["manzana", "banano", "mango"];\n\nlet primera = frutas[0];\nlet ultima = frutas[2];\nlet cuantas = frutas.length;',
    tests: [
      { t: 'expr', code: 'frutas', eq: ['manzana', 'banano', 'mango'], msg: 'El array frutas debe ser: manzana, banano, mango (en ese orden)' },
      { t: 'expr', code: 'primera', eq: 'manzana', msg: 'primera debe ser manzana. Acuérdate: la primera posición es la 0' },
      { t: 'expr', code: 'ultima', eq: 'mango', msg: 'ultima debe ser mango' },
      { t: 'expr', code: 'cuantas', eq: 3, msg: 'cuantas debe valer 3' },
    ],
  },
  {
    id: 'js-18',
    lang: 'js',
    n: 18,
    title: 'Modificar la lista',
    brief:
      'Una lista no es de piedra: se le agrega al final, se le cambia una posición y se le puede preguntar cosas. Haz los tres cambios en el orden que se piden.',
    goal: [
      'Agregar pera al final de la lista',
      'Cambiar el primer elemento por fresa',
      'tieneMango: si la lista contiene mango',
      'posicionMango: en qué posición está mango',
    ],
    starter: 'let frutas = ["manzana", "banano", "mango"];\n',
    hint: 'push agrega al final. Para cambiar una posición se usa el corchete con el número y un igual. includes responde verdadero o falso, indexOf responde el número de la posición.',
    skeleton:
      'let frutas = ["manzana", "banano", "mango"];\n\nfrutas.__("pera");\nfrutas[__] = "fresa";\n\nlet tieneMango = frutas.__("mango");\nlet posicionMango = frutas.__("mango");',
    solution:
      'let frutas = ["manzana", "banano", "mango"];\n\nfrutas.push("pera");\nfrutas[0] = "fresa";\n\nlet tieneMango = frutas.includes("mango");\nlet posicionMango = frutas.indexOf("mango");',
    tests: [
      { t: 'expr', code: 'frutas', eq: ['fresa', 'banano', 'mango', 'pera'], msg: 'La lista final debe quedar: fresa, banano, mango, pera' },
      { t: 'expr', code: 'tieneMango', eq: true, msg: 'tieneMango debe ser true' },
      { t: 'expr', code: 'posicionMango', eq: 2, msg: 'posicionMango debe ser 2 (contando desde cero)' },
      { t: 'src', re: '\\.push\\s*\\(', msg: 'Usa push para agregar pera al final' },
    ],
  },
  {
    id: 'js-19',
    lang: 'js',
    n: 19,
    title: 'El promedio',
    brief:
      'Recorrer una lista sumando es el ejercicio que aparece en todos los cursos de programación del mundo, y con razón. Recorre las notas con un ciclo for, suma todas y saca el promedio.',
    goal: ['Una variable suma con el total de todas las notas', 'Una variable promedio con el resultado de dividir la suma entre cuántas notas hay', 'Hecho con un ciclo for'],
    starter: 'let notas = [4.5, 3.8, 5.0, 2.9, 4.1];\nlet suma = 0;\n',
    hint: 'El ciclo empieza en cero y sigue mientras el contador sea menor que la cantidad de elementos. Adentro, se le va sumando a suma el elemento de esa posición. El promedio se calcula después, fuera del ciclo.',
    skeleton:
      'let notas = [4.5, 3.8, 5.0, 2.9, 4.1];\nlet suma = 0;\n\nfor (let i = 0; i < notas.__; i++) {\n  suma += notas[__];\n}\n\nlet promedio = suma / notas.__;',
    solution:
      'let notas = [4.5, 3.8, 5.0, 2.9, 4.1];\nlet suma = 0;\n\nfor (let i = 0; i < notas.length; i++) {\n  suma += notas[i];\n}\n\nlet promedio = suma / notas.length;',
    tests: [
      { t: 'expr', code: 'suma', eq: 20.3, msg: 'suma debe valer 20.3' },
      { t: 'expr', code: 'promedio', eq: 4.06, msg: 'promedio debe valer 4.06' },
      { t: 'src', re: '\\bfor\\s*\\(', msg: 'La suma debe hacerse con un ciclo for, no a mano' },
      { t: 'src', re: '\\.length', msg: 'Usa .length en vez de escribir el 5 a mano: así funciona con cualquier lista' },
    ],
  },
  {
    id: 'js-20',
    lang: 'js',
    n: 20,
    title: 'La forma corta de recorrer',
    brief:
      'forEach hace lo mismo que el for pero más corto y más claro: le entrega uno por uno los elementos a una función. Imprime los tres nombres del equipo, uno por línea, usando forEach.',
    goal: ['Recorrer el array con forEach', 'Tres líneas impresas: Ana, Luis y Sara'],
    starter: 'let equipo = ["Ana", "Luis", "Sara"];\n',
    hint: 'Se escribe el array, punto, forEach, y entre paréntesis va una function que recibe un parámetro. Ese parámetro es cada elemento, uno a la vez.',
    skeleton:
      'let equipo = ["Ana", "Luis", "Sara"];\n\nequipo.__(function (persona) {\n  console.log(__);\n});',
    solution:
      'let equipo = ["Ana", "Luis", "Sara"];\n\nequipo.forEach(function (persona) {\n  console.log(persona);\n});',
    tests: [
      { t: 'logCount', eq: 3, msg: 'Deben imprimirse exactamente 3 líneas' },
      { t: 'log', at: 0, eq: 'Ana', msg: 'La primera línea debe ser Ana' },
      { t: 'log', at: 1, eq: 'Luis', msg: 'La segunda línea debe ser Luis' },
      { t: 'log', at: 2, eq: 'Sara', msg: 'La tercera línea debe ser Sara' },
      { t: 'src', re: '\\.forEach\\s*\\(', msg: 'Este reto es específicamente con forEach' },
    ],
  },
  {
    id: 'js-21',
    lang: 'js',
    n: 21,
    title: 'Hablarle al HTML',
    brief:
      'Aquí empieza lo bueno: JavaScript deja de hablarle solo a la consola y empieza a modificar la página de verdad. El HTML de la derecha ya existe. Búscalo por su id y cámbiale el texto a: Nuevo título',
    goal: ['Buscar el elemento por su id, que es titulo', 'Cambiarle el texto a Nuevo título'],
    html: '<h1 id="titulo">Hola</h1>\n<p>El h1 de arriba debería cambiar.</p>',
    starter: '',
    hint: 'document.getElementById busca por id y el id va entre comillas. Para cambiar el texto se usa textContent con un igual, como cualquier variable.',
    skeleton: 'let titulo = document.__("titulo");\ntitulo.__ = "Nuevo título";',
    solution: 'let titulo = document.getElementById("titulo");\ntitulo.textContent = "Nuevo título";',
    tests: [
      { t: 'text', sel: '#titulo', eq: 'Nuevo título', msg: 'El h1 debe quedar diciendo: Nuevo título' },
      { t: 'src', re: 'getElementById', msg: 'Búscalo con document.getElementById' },
      { t: 'src', re: 'textContent', msg: 'Cámbiale el texto con textContent' },
    ],
  },
  {
    id: 'js-22',
    lang: 'js',
    n: 22,
    title: 'Cambiar cómo se ve',
    brief:
      'Hay dos formas de cambiar el estilo desde JavaScript, y aquí vas a usar las dos. Ojo con la trampa: en CSS se escribe font-size con guion, pero en JavaScript se escribe fontSize sin guion y con mayúscula.',
    goal: [
      'Poner el párrafo de tamaño 30px usando style',
      'Agregarle la clase destacado usando classList',
    ],
    html:
      '<style>.destacado { background: gold; padding: 8px; }</style>\n<p id="parrafo">Cámbiame el tamaño y agrégame la clase.</p>',
    starter: 'let parrafo = document.getElementById("parrafo");\n',
    hint: 'Para el tamaño: parrafo.style.algo igual al valor entre comillas, con el px incluido. Para la clase: parrafo.classList.algo con el nombre de la clase entre paréntesis.',
    skeleton:
      'let parrafo = document.getElementById("parrafo");\n\nparrafo.style.__ = "30px";\nparrafo.classList.__("destacado");',
    solution:
      'let parrafo = document.getElementById("parrafo");\n\nparrafo.style.fontSize = "30px";\nparrafo.classList.add("destacado");',
    tests: [
      { t: 'style', sel: '#parrafo', prop: 'font-size', eq: '30px', msg: 'El párrafo debe quedar de 30px. En JavaScript la propiedad se llama fontSize, sin guion' },
      { t: 'class', sel: '#parrafo', name: 'destacado', msg: 'Al párrafo le falta la clase destacado' },
      { t: 'src', re: 'classList', msg: 'La clase se agrega con classList' },
    ],
  },
  {
    id: 'js-23',
    lang: 'js',
    n: 23,
    title: 'Reaccionar a un clic',
    brief:
      'El patrón que se repite en todo JavaScript de páginas web: buscar el elemento, escuchar el evento, cambiar algo. Todo lo demás son variaciones de eso. Haz que al hacer clic en el botón, el párrafo vacío diga: ¡Me hiciste clic!',
    goal: [
      'Escuchar el evento click del botón que tiene id miBoton',
      'Que al hacer clic, el elemento con id salida diga ¡Me hiciste clic!',
      'Que ANTES del clic, salida siga vacío',
    ],
    html: '<button id="miBoton">Haz clic</button>\n<p id="salida"></p>',
    starter: '',
    hint: 'Se le pide al botón addEventListener con dos cosas entre paréntesis: el nombre del evento entre comillas, y una function sin parámetros con el código adentro. Fíjate en cerrar el paréntesis después de la llave.',
    skeleton:
      'let boton = document.getElementById("miBoton");\nlet salida = document.getElementById("salida");\n\nboton.__("__", function () {\n  salida.__ = "¡Me hiciste clic!";\n});',
    solution:
      'let boton = document.getElementById("miBoton");\nlet salida = document.getElementById("salida");\n\nboton.addEventListener("click", function () {\n  salida.textContent = "¡Me hiciste clic!";\n});',
    tests: [
      { t: 'src', re: 'addEventListener', msg: 'Debes usar addEventListener' },
      { t: 'expr', code: 'document.getElementById("salida").textContent', eq: '', msg: 'Antes del clic el párrafo debe estar vacío: el texto solo se pone cuando ocurre el evento' },
      {
        t: 'expr',
        code: '(document.getElementById("miBoton").click(), document.getElementById("salida").textContent)',
        eq: '¡Me hiciste clic!',
        msg: 'Al hacer clic, el párrafo debe decir: ¡Me hiciste clic!',
      },
    ],
  },
  {
    id: 'js-24',
    lang: 'js',
    n: 24,
    title: 'Leer lo que escribió',
    brief:
      'Los formularios por fin sirven para algo. Al hacer clic en el botón: si el nombre está vacío, el saludo dice Falta tu nombre. Si no, dice el saludo completo con la edad sumada. Cuidado con la trampa de siempre: lo que sale de una casilla SIEMPRE es texto, aunque el input sea de números.',
    goal: [
      'Al hacer clic en el botón con id saludar, leer los valores de nombre y edad',
      'Si el nombre está vacío, poner en el h2 con id saludo el texto: Falta tu nombre',
      'Si no, poner: Hola Ana, en 10 años tendrás 22 años (con el nombre y la cuenta que correspondan)',
    ],
    html:
      '<input type="text" id="nombre" placeholder="Tu nombre">\n<input type="number" id="edad" placeholder="Tu edad">\n<button id="saludar">Saludar</button>\n<h2 id="saludo"></h2>',
    starter: '',
    hint: 'Lo que la persona escribió se lee con .value. Para que la edad se sume en vez de pegarse, hay que envolverla en Number(...). Y la comparación de vacío es contra dos comillas sin nada en medio.',
    skeleton:
      'document.getElementById("saludar").addEventListener("click", function () {\n  let nombre = document.getElementById("nombre").__;\n  let edad = __(document.getElementById("edad").value);\n  let saludo = document.getElementById("saludo");\n\n  if (nombre __ "") {\n    saludo.textContent = "__";\n  } else {\n    saludo.textContent = `Hola ${nombre}, en 10 años tendrás ${__} años`;\n  }\n});',
    solution:
      'document.getElementById("saludar").addEventListener("click", function () {\n  let nombre = document.getElementById("nombre").value;\n  let edad = Number(document.getElementById("edad").value);\n  let saludo = document.getElementById("saludo");\n\n  if (nombre === "") {\n    saludo.textContent = "Falta tu nombre";\n  } else {\n    saludo.textContent = `Hola ${nombre}, en 10 años tendrás ${edad + 10} años`;\n  }\n});',
    tests: [
      { t: 'src', re: '\\.value', msg: 'Lo que la persona escribe se lee con .value' },
      { t: 'src', re: 'Number\\s*\\(', msg: 'La edad hay que convertirla con Number(), si no se pega en vez de sumarse' },
      {
        t: 'expr',
        code: '(document.getElementById("saludar").click(), document.getElementById("saludo").textContent)',
        eq: 'Falta tu nombre',
        msg: 'Con la casilla del nombre vacía, el saludo debe decir: Falta tu nombre',
      },
      {
        t: 'expr',
        code: '(document.getElementById("nombre").value = "Ana", document.getElementById("edad").value = "12", document.getElementById("saludar").click(), document.getElementById("saludo").textContent)',
        eq: 'Hola Ana, en 10 años tendrás 22 años',
        msg: 'Con Ana y 12 debe decir: Hola Ana, en 10 años tendrás 22 años. Si te sale 1210, te faltó el Number()',
      },
      {
        t: 'expr',
        code: '(document.getElementById("nombre").value = "Luis", document.getElementById("edad").value = "30", document.getElementById("saludar").click(), document.getElementById("saludo").textContent)',
        eq: 'Hola Luis, en 10 años tendrás 40 años',
        msg: 'Con Luis y 30 debe decir: Hola Luis, en 10 años tendrás 40 años',
      },
    ],
  },
  {
    id: 'js-25',
    lang: 'js',
    n: 25,
    title: 'JEFE FINAL — La lista de tareas',
    brief:
      'El último reto del examen. Este patrón (guardar los datos en un array y tener una función que dibuja) es la base de casi todas las aplicaciones web modernas. Si lo sacas, entendiste algo grande.',
    goal: [
      'Un array tareas que empieza vacío',
      'Una función dibujar que borre la lista y vuelva a crear un li por cada tarea, con createElement y appendChild',
      'Al hacer clic en agregar: si la casilla no está vacía, meter la tarea al array, limpiar la casilla y volver a dibujar',
      'Si la casilla está vacía, no debe agregar nada',
    ],
    html: '<input type="text" id="nueva" placeholder="Nueva tarea">\n<button id="agregar">Agregar</button>\n<ul id="lista"></ul>',
    starter: '',
    hint: 'Borrar la lista entera es ponerle innerHTML igual a comillas vacías. Crear un elemento son tres pasos: createElement("li"), ponerle textContent, y appendChild dentro de la lista. Limpiar la casilla es ponerle value igual a comillas vacías.',
    skeleton:
      'let tareas = [];\nlet lista = document.getElementById("lista");\n\nfunction dibujar() {\n  lista.innerHTML = "";\n  tareas.forEach(function (tarea) {\n    let li = document.__("li");\n    li.__ = tarea;\n    lista.__(li);\n  });\n}\n\ndocument.getElementById("agregar").addEventListener("click", function () {\n  let texto = document.getElementById("nueva").__;\n  if (texto __ "") {\n    tareas.__(texto);\n    document.getElementById("nueva").value = "__";\n    __();\n  }\n});',
    solution:
      'let tareas = [];\nlet lista = document.getElementById("lista");\n\nfunction dibujar() {\n  lista.innerHTML = "";\n  tareas.forEach(function (tarea) {\n    let li = document.createElement("li");\n    li.textContent = tarea;\n    lista.appendChild(li);\n  });\n}\n\ndocument.getElementById("agregar").addEventListener("click", function () {\n  let texto = document.getElementById("nueva").value;\n  if (texto !== "") {\n    tareas.push(texto);\n    document.getElementById("nueva").value = "";\n    dibujar();\n  }\n});',
    tests: [
      { t: 'src', re: 'createElement', msg: 'Los li deben crearse con document.createElement' },
      { t: 'src', re: 'appendChild', msg: 'Los li deben meterse en la lista con appendChild' },
      { t: 'expr', code: 'document.querySelectorAll("#lista li").length', eq: 0, msg: 'Al comienzo la lista debe estar vacía' },
      {
        t: 'expr',
        code: '(document.getElementById("nueva").value = "Estudiar", document.getElementById("agregar").click(), document.querySelectorAll("#lista li").length)',
        eq: 1,
        msg: 'Después de escribir Estudiar y hacer clic, debe haber 1 elemento en la lista',
      },
      { t: 'expr', code: 'document.querySelector("#lista li").textContent', eq: 'Estudiar', msg: 'El primer elemento de la lista debe decir: Estudiar' },
      { t: 'expr', code: 'document.getElementById("nueva").value', eq: '', msg: 'Después de agregar, la casilla debe quedar limpia' },
      {
        t: 'expr',
        code: '(document.getElementById("nueva").value = "Entrenar", document.getElementById("agregar").click(), document.querySelectorAll("#lista li").length)',
        eq: 2,
        msg: 'Al agregar una segunda tarea deben quedar 2 elementos en la lista',
      },
      {
        t: 'expr',
        code: '(document.getElementById("agregar").click(), document.querySelectorAll("#lista li").length)',
        eq: 2,
        msg: 'Con la casilla vacía no debe agregarse nada: deben seguir siendo 2',
      },
      {
        t: 'expr',
        code: 'Array.prototype.map.call(document.querySelectorAll("#lista li"), function (x) { return x.textContent })',
        eq: ['Estudiar', 'Entrenar'],
        msg: 'La lista final debe decir Estudiar y Entrenar, en ese orden',
      },
    ],
  },
]
