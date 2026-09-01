import type { Challenge } from '../types'

const FOTO =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23c7d2fe'/%3E%3Ccircle cx='200' cy='150' r='90' fill='%236366f1'/%3E%3C/svg%3E"

/**
 * 25 retos de CSS, en el orden de la Guía 2.
 * Cada reto trae su propio HTML ya hecho: el alumno solo escribe los estilos.
 */
export const CSS_CHALLENGES: Challenge[] = [
  {
    id: 'css-01',
    lang: 'css',
    n: 1,
    title: 'Que se note que llegaste',
    brief:
      'La prueba de que tu CSS está funcionando es siempre la misma: pintar el fondo de toda la página. Ponle a body un fondo azul claro (lightblue).',
    goal: ['Una regla para body', 'La propiedad del color de fondo con el valor lightblue'],
    html: '<h1>Hola</h1>\n<p>Si el fondo cambió de color, tu CSS está vivo.</p>',
    starter: '',
    hint: 'La fórmula de CSS es siempre selector, llave que abre, propiedad dos puntos valor punto y coma, llave que cierra. La propiedad del fondo es background-color.',
    skeleton: 'body {\n  __: lightblue;\n}',
    solution: 'body {\n  background-color: lightblue;\n}',
    tests: [
      { t: 'style', sel: 'body', prop: 'background-color', eq: 'lightblue', msg: 'El body debe tener background-color: lightblue' },
      { t: 'src', re: ';', msg: 'Cada valor termina en punto y coma. Es el error número uno de CSS.' },
    ],
  },
  {
    id: 'css-02',
    lang: 'css',
    n: 2,
    title: 'Color de letra',
    brief:
      'Ojo con esta trampa: la propiedad del color del texto se llama solo color, sin la palabra text. Pon todos los títulos grandes en crimson.',
    goal: ['Una regla para h1', 'Color de texto crimson'],
    html: '<h1>Este título debería salir rojo oscuro</h1>\n<p>Este párrafo se queda como está.</p>',
    starter: '',
    hint: 'background-color es el fondo; color, a secas, es la letra. Es la confusión más común de toda la guía.',
    skeleton: 'h1 {\n  __: crimson;\n}',
    solution: 'h1 {\n  color: crimson;\n}',
    tests: [
      { t: 'style', sel: 'h1', prop: 'color', eq: 'crimson', msg: 'El h1 debe tener color: crimson' },
    ],
  },
  {
    id: 'css-03',
    lang: 'css',
    n: 3,
    title: 'El punto de las clases',
    brief:
      'En el HTML la clase se escribe class="tarjeta", pero en el CSS se le habla con un punto adelante. Olvidar ese punto es el error que más tiempo hace perder. Ponle a las tarjetas fondo blanco y letra negra.',
    goal: ['Un selector de clase para tarjeta', 'Fondo white', 'Color de letra black'],
    html:
      '<div class="tarjeta">\n  <h3>Tarjeta uno</h3>\n  <p>Soy una tarjeta.</p>\n</div>\n<div class="tarjeta">\n  <h3>Tarjeta dos</h3>\n  <p>Yo también.</p>\n</div>',
    starter: '',
    hint: 'El selector se escribe .tarjeta, con punto. Sin el punto, CSS busca una etiqueta llamada tarjeta que no existe.',
    skeleton: '__tarjeta {\n  background-color: __;\n  color: __;\n}',
    solution: '.tarjeta {\n  background-color: white;\n  color: black;\n}',
    tests: [
      { t: 'style', sel: '.tarjeta', prop: 'background-color', eq: 'white', msg: 'Las tarjetas deben tener background-color: white' },
      { t: 'style', sel: '.tarjeta', prop: 'color', eq: 'black', msg: 'Las tarjetas deben tener color: black' },
      { t: 'rule', sel: '.tarjeta', prop: 'background-color', msg: 'El selector se escribe con punto: .tarjeta' },
    ],
  },
  {
    id: 'css-04',
    lang: 'css',
    n: 4,
    title: 'El numeral de los ids',
    brief:
      'Un id es único: solo un elemento en toda la página puede tenerlo. En CSS se le habla con un numeral. Píntale al menú fondo navy y letra blanca.',
    goal: ['Un selector de id para menu', 'Fondo navy', 'Letra white'],
    html:
      '<nav id="menu">\n  <a href="#">Inicio</a>\n  <a href="#">Contacto</a>\n</nav>\n<p>Un párrafo cualquiera.</p>',
    starter: '',
    hint: 'Punto para clases, numeral para ids. El numeral es el símbolo #.',
    skeleton: '__menu {\n  background-color: __;\n  color: __;\n}',
    solution: '#menu {\n  background-color: navy;\n  color: white;\n}',
    tests: [
      { t: 'style', sel: '#menu', prop: 'background-color', eq: 'navy', msg: 'El menú debe tener background-color: navy' },
      { t: 'style', sel: '#menu', prop: 'color', eq: 'white', msg: 'El menú debe tener color: white' },
      { t: 'rule', sel: '#menu', prop: 'background-color', msg: 'El selector de id se escribe con numeral: #menu' },
    ],
  },
  {
    id: 'css-05',
    lang: 'css',
    n: 5,
    title: 'Solo los de adentro',
    brief:
      'Dos selectores separados por un espacio significan "los de adentro". Pon en verde SOLO los párrafos que están dentro del main. El de afuera no se puede tocar.',
    goal: ['Un selector de dos partes separadas por un espacio', 'Los párrafos dentro de main en green'],
    html:
      '<p>Yo estoy afuera y me quedo negro.</p>\n<main>\n  <p>Yo estoy adentro y me pongo verde.</p>\n  <p>Yo también.</p>\n</main>',
    starter: '',
    hint: 'Se escribe el de afuera, un espacio, y el de adentro: primero main y después p. El espacio es el que hace todo el trabajo.',
    skeleton: '__ __ {\n  color: green;\n}',
    solution: 'main p {\n  color: green;\n}',
    tests: [
      { t: 'style', sel: 'main p', prop: 'color', eq: 'green', msg: 'Los párrafos dentro de main deben ser green' },
      { t: 'rule', sel: 'main p', prop: 'color', msg: 'Usa el selector descendiente: main p (con un espacio en medio)' },
      { t: 'src', re: '^\\s*p\\s*\\{', flags: 'm', not: true, msg: 'No le pongas la regla a todos los p: el párrafo de afuera debe quedarse negro' },
    ],
  },
  {
    id: 'css-06',
    lang: 'css',
    n: 6,
    title: 'Dos por el precio de una',
    brief:
      'Cuando dos selectores necesitan lo mismo, no se escriben dos reglas: se separan con una coma. Pon los h1 y los h2 en purple, en una sola regla.',
    goal: ['Una sola regla que le hable a h1 y a h2', 'Color purple'],
    html: '<h1>Soy un h1</h1>\n<h2>Soy un h2</h2>\n<p>Yo no me pinto.</p>',
    starter: '',
    hint: 'Se escriben los dos selectores separados por una coma, y después una sola pareja de llaves con la propiedad adentro.',
    skeleton: 'h1__ h2 {\n  color: __;\n}',
    solution: 'h1, h2 {\n  color: purple;\n}',
    tests: [
      { t: 'style', sel: 'h1', prop: 'color', eq: 'purple', msg: 'El h1 debe ser purple' },
      { t: 'style', sel: 'h2', prop: 'color', eq: 'purple', msg: 'El h2 debe ser purple' },
      { t: 'rule', sel: 'h1, h2', prop: 'color', msg: 'Debe ser una sola regla con los dos selectores separados por coma: h1, h2' },
    ],
  },
  {
    id: 'css-07',
    lang: 'css',
    n: 7,
    title: 'Grande y en el medio',
    brief:
      'Dos propiedades que se usan en absolutamente todas las páginas. Al título ponle 42 píxeles de tamaño y céntralo.',
    goal: ['h1 con font-size de 42px', 'h1 centrado con text-align'],
    html: '<h1>Mi página</h1>\n<p>Este párrafo se queda a la izquierda.</p>',
    starter: '',
    hint: 'El tamaño es font-size y no puede ir sin unidad: 42 no sirve, 42px sí. Para centrar el texto es text-align con el valor center.',
    skeleton: 'h1 {\n  __: 42px;\n  __: center;\n}',
    solution: 'h1 {\n  font-size: 42px;\n  text-align: center;\n}',
    tests: [
      { t: 'style', sel: 'h1', prop: 'font-size', eq: '42px', msg: 'El h1 debe tener font-size: 42px (con la unidad px)' },
      { t: 'style', sel: 'h1', prop: 'text-align', eq: 'center', msg: 'El h1 debe estar centrado con text-align: center' },
    ],
  },
  {
    id: 'css-08',
    lang: 'css',
    n: 8,
    title: 'Que se lea cómodo',
    brief:
      'Dos líneas cambian por completo la sensación de una página: la tipografía y el aire entre renglones. Ponle a todo el body la letra Arial (con sans-serif de respaldo) y una separación entre renglones de 1.6.',
    goal: ['body con font-family Arial y sans-serif de respaldo', 'body con line-height de 1.6'],
    html:
      '<p>Se escriben varias tipografías separadas por coma por si la primera no existe en el computador de quien te visita. La última siempre es una familia genérica.</p>',
    starter: '',
    hint: 'font-family acepta varios nombres separados por coma. line-height va sin unidad: solo el número 1.6.',
    skeleton: 'body {\n  __: Arial, __;\n  __: 1.6;\n}',
    solution: 'body {\n  font-family: Arial, sans-serif;\n  line-height: 1.6;\n}',
    tests: [
      { t: 'style', sel: 'body', prop: 'font-family', has: 'Arial', msg: 'El body debe tener font-family que empiece por Arial' },
      { t: 'style', sel: 'body', prop: 'font-family', has: 'sans-serif', msg: 'Falta sans-serif como respaldo al final del font-family' },
      { t: 'rule', sel: 'body', prop: 'line-height', eq: '1.6', msg: 'El body debe tener line-height: 1.6 (sin unidad)' },
    ],
  },
  {
    id: 'css-09',
    lang: 'css',
    n: 9,
    title: 'Enlaces sin subrayado',
    brief:
      'El subrayado azul de los enlaces es lo primero que todo diseñador quita. Quítaselo a los enlaces del menú y ponlos en white.',
    goal: ['Los enlaces sin subrayado', 'Los enlaces en color white'],
    html:
      '<nav class="menu" style="background:#1e293b;padding:12px">\n  <a href="#">Inicio</a>\n  <a href="#">Sobre mí</a>\n  <a href="#">Contacto</a>\n</nav>',
    starter: '',
    hint: 'La propiedad se llama text-decoration y el valor que quita el subrayado es none.',
    skeleton: '.menu a {\n  __: none;\n  color: __;\n}',
    solution: '.menu a {\n  text-decoration: none;\n  color: white;\n}',
    tests: [
      { t: 'style', sel: '.menu a', prop: 'text-decoration-line', eq: 'none', msg: 'Los enlaces deben llevar text-decoration: none' },
      { t: 'style', sel: '.menu a', prop: 'color', eq: 'white', msg: 'Los enlaces deben ser color: white' },
    ],
  },
  {
    id: 'css-10',
    lang: 'css',
    n: 10,
    title: 'GRITAR EN MAYÚSCULAS',
    brief:
      'Sin tocar el HTML, haz que el título salga TODO EN MAYÚSCULAS y con las letras un poco separadas: 3 píxeles de separación.',
    goal: ['h1 en mayúsculas con text-transform', 'h1 con letter-spacing de 3px'],
    html: '<h1>me gusta programar</h1>',
    starter: '',
    hint: 'text-transform con el valor uppercase pone todo en mayúsculas. letter-spacing separa las letras y necesita unidad.',
    skeleton: 'h1 {\n  __: uppercase;\n  __: 3px;\n}',
    solution: 'h1 {\n  text-transform: uppercase;\n  letter-spacing: 3px;\n}',
    tests: [
      { t: 'style', sel: 'h1', prop: 'text-transform', eq: 'uppercase', msg: 'Falta text-transform: uppercase' },
      { t: 'style', sel: 'h1', prop: 'letter-spacing', eq: '3px', msg: 'Falta letter-spacing: 3px' },
      { t: 'text', sel: 'h1', eq: 'me gusta programar', msg: 'No cambies el HTML: las mayúsculas las tiene que poner CSS' },
    ],
  },
  {
    id: 'css-11',
    lang: 'css',
    n: 11,
    title: 'Aire por dentro',
    brief:
      'El texto pegado al borde de su caja se ve apretado. padding es el relleno que empuja hacia adentro, como el icopor dentro de una caja de regalo. Ponle a la caja 24 píxeles de relleno por los cuatro lados.',
    goal: ['La clase caja con padding de 24px en los cuatro lados'],
    html: '<div class="caja" style="background:#fde68a">El texto ya no está pegado al borde.</div>',
    starter: '',
    hint: 'Con un solo valor, padding aplica lo mismo a los cuatro lados. No olvides la unidad px.',
    skeleton: '.caja {\n  __: 24px;\n}',
    solution: '.caja {\n  padding: 24px;\n}',
    tests: [
      { t: 'style', sel: '.caja', prop: 'padding-top', eq: '24px', msg: 'Falta padding de 24px arriba' },
      { t: 'style', sel: '.caja', prop: 'padding-right', eq: '24px', msg: 'Falta padding de 24px a la derecha' },
      { t: 'style', sel: '.caja', prop: 'padding-bottom', eq: '24px', msg: 'Falta padding de 24px abajo' },
      { t: 'style', sel: '.caja', prop: 'padding-left', eq: '24px', msg: 'Falta padding de 24px a la izquierda' },
    ],
  },
  {
    id: 'css-12',
    lang: 'css',
    n: 12,
    title: 'Aire por fuera',
    brief:
      'Si dos cajas están muy pegadas ENTRE SÍ, no es padding: es margin, que empuja hacia afuera. Separa las dos cajas dándoles 30 píxeles de margen por los cuatro lados.',
    goal: ['La clase caja con margin de 30px en los cuatro lados'],
    html:
      '<div class="caja" style="background:#bfdbfe">Caja uno</div>\n<div class="caja" style="background:#bbf7d0">Caja dos</div>',
    starter: '',
    hint: 'padding empuja hacia adentro, margin empuja hacia afuera. Se escribe igual que padding: un solo valor para los cuatro lados.',
    skeleton: '.caja {\n  __: 30px;\n}',
    solution: '.caja {\n  margin: 30px;\n}',
    tests: [
      { t: 'style', sel: '.caja', prop: 'margin-top', eq: '30px', msg: 'Falta margin de 30px arriba' },
      { t: 'style', sel: '.caja', prop: 'margin-right', eq: '30px', msg: 'Falta margin de 30px a la derecha' },
      { t: 'style', sel: '.caja', prop: 'margin-bottom', eq: '30px', msg: 'Falta margin de 30px abajo' },
      { t: 'style', sel: '.caja', prop: 'margin-left', eq: '30px', msg: 'Falta margin de 30px a la izquierda' },
    ],
  },
  {
    id: 'css-13',
    lang: 'css',
    n: 13,
    title: 'La caja de cartón',
    brief:
      'El borde se escribe con tres cosas en una sola línea, siempre en el mismo orden: qué tan grueso, de qué estilo y de qué color. Ponle a la tarjeta un borde de 2 píxeles, sólido y azul.',
    goal: ['La clase tarjeta con un borde de 2px, estilo solid, color blue'],
    html: '<div class="tarjeta">Mírame el borde.</div>',
    starter: '',
    hint: 'Se escribe todo junto separado por espacios: grosor, estilo y color. El estilo más común es solid.',
    skeleton: '.tarjeta {\n  border: __ __ __;\n}',
    solution: '.tarjeta {\n  border: 2px solid blue;\n}',
    tests: [
      { t: 'style', sel: '.tarjeta', prop: 'border-top-width', eq: '2px', msg: 'El borde debe medir 2px' },
      { t: 'style', sel: '.tarjeta', prop: 'border-top-style', eq: 'solid', msg: 'El estilo del borde debe ser solid' },
      { t: 'style', sel: '.tarjeta', prop: 'border-top-color', eq: 'blue', msg: 'El borde debe ser de color blue' },
    ],
  },
  {
    id: 'css-14',
    lang: 'css',
    n: 14,
    title: 'Esquinas suaves',
    brief:
      'Nada hace que una página se vea más moderna con menos esfuerzo. Redondea las esquinas de la tarjeta 12 píxeles.',
    goal: ['La clase tarjeta con esquinas redondeadas de 12px'],
    html: '<div class="tarjeta" style="background:#6366f1;color:white;padding:20px">Tarjeta con esquinas redondas</div>',
    starter: '',
    hint: 'La propiedad se llama border-radius y funciona aunque el elemento no tenga borde.',
    skeleton: '.tarjeta {\n  __: 12px;\n}',
    solution: '.tarjeta {\n  border-radius: 12px;\n}',
    tests: [
      { t: 'style', sel: '.tarjeta', prop: 'border-top-left-radius', eq: '12px', msg: 'Falta border-radius: 12px' },
      { t: 'style', sel: '.tarjeta', prop: 'border-bottom-right-radius', eq: '12px', msg: 'El border-radius debe aplicar a las cuatro esquinas' },
    ],
  },
  {
    id: 'css-15',
    lang: 'css',
    n: 15,
    title: 'Que 300 signifique 300',
    brief:
      'Por defecto, una caja de 300px con 20px de padding termina midiendo 340px, que es una locura. La regla del asterisco lo arregla para siempre y va al comienzo de todo archivo CSS. Escríbela, y después dale a la caja 300 de ancho y 150 de alto.',
    goal: [
      'Una regla con el selector universal que ponga box-sizing en border-box',
      'La clase caja con width de 300px y height de 150px',
    ],
    html: '<div class="caja" style="background:#fca5a5;padding:20px">Mido 300 de verdad.</div>',
    starter: '',
    hint: 'El selector que le habla a absolutamente todo es el asterisco. La propiedad es box-sizing y el valor es border-box.',
    skeleton: '__ {\n  box-sizing: __;\n}\n\n.caja {\n  __: 300px;\n  __: 150px;\n}',
    solution: '* {\n  box-sizing: border-box;\n}\n\n.caja {\n  width: 300px;\n  height: 150px;\n}',
    tests: [
      { t: 'rule', sel: '*', prop: 'box-sizing', eq: 'border-box', msg: 'Falta la regla del asterisco con box-sizing: border-box' },
      { t: 'style', sel: '.caja', prop: 'box-sizing', eq: 'border-box', msg: 'La regla del asterisco debe alcanzar también a la caja' },
      { t: 'style', sel: '.caja', prop: 'width', eq: '300px', msg: 'La caja debe medir 300px de ancho' },
      { t: 'style', sel: '.caja', prop: 'height', eq: '150px', msg: 'La caja debe medir 150px de alto' },
    ],
  },
  {
    id: 'css-16',
    lang: 'css',
    n: 16,
    title: 'El truco de centrar una caja',
    brief:
      'text-align centra el texto, pero no centra la caja. Para centrar la caja hay otro truco, y es de los más usados de todo CSS. El contenedor debe medir máximo 600 píxeles, ocupar el 100% si no cabe, y quedar centrado.',
    goal: ['La clase contenedor con max-width de 600px', 'width de 100%', 'Centrada con margin arriba y abajo en 0 y a los lados en auto'],
    html: '<div class="contenedor" style="background:#a7f3d0;padding:20px">Estoy centrado y nunca me salgo de la pantalla.</div>',
    starter: '',
    hint: 'max-width significa "hasta ese ancho, pero menos si no cabe". El truco de centrar es margin con dos valores: el primero para arriba y abajo, el segundo para los lados, y ese segundo es la palabra auto.',
    skeleton: '.contenedor {\n  __: 600px;\n  width: __;\n  margin: 0 __;\n}',
    solution: '.contenedor {\n  max-width: 600px;\n  width: 100%;\n  margin: 0 auto;\n}',
    tests: [
      { t: 'style', sel: '.contenedor', prop: 'max-width', eq: '600px', msg: 'Falta max-width: 600px' },
      { t: 'rule', sel: '.contenedor', prop: 'width', eq: '100%', msg: 'Falta width: 100%' },
      { t: 'rule', sel: '.contenedor', prop: 'margin', has: 'auto', msg: 'Falta margin: 0 auto, que es lo que la centra' },
    ],
  },
  {
    id: 'css-17',
    lang: 'css',
    n: 17,
    title: 'El degradado',
    brief:
      'Una sola línea y el encabezado deja de verse plano. Ponle al encabezado un degradado que vaya de azul (#2563EB) a morado (#9333EA), de izquierda a derecha.',
    goal: ['La clase encabezado con un fondo de tipo linear-gradient', 'Que vaya to right, de #2563EB a #9333EA'],
    html: '<div class="encabezado" style="padding:40px;color:white;font-size:28px">Mi página</div>',
    starter: '',
    hint: 'Se usa la propiedad background con la función linear-gradient. Dentro de los paréntesis van tres cosas separadas por comas: la dirección y los dos colores.',
    skeleton: '.encabezado {\n  background: __(to right, __, __);\n}',
    solution: '.encabezado {\n  background: linear-gradient(to right, #2563EB, #9333EA);\n}',
    tests: [
      { t: 'style', sel: '.encabezado', prop: 'background-image', has: 'linear-gradient', msg: 'Falta el linear-gradient en el fondo' },
      { t: 'style', sel: '.encabezado', prop: 'background-image', has: 'rgb(37, 99, 235)', msg: 'Falta el color #2563EB en el degradado' },
      { t: 'style', sel: '.encabezado', prop: 'background-image', has: 'rgb(147, 51, 234)', msg: 'Falta el color #9333EA en el degradado' },
      { t: 'src', re: 'to\\s+right', msg: 'El degradado debe ir to right (de izquierda a derecha)' },
    ],
  },
  {
    id: 'css-18',
    lang: 'css',
    n: 18,
    title: 'Medio transparente',
    brief:
      'rgba es rgb con un cuarto número al final: cuánto se ve, de 0 a 1. Ponle a la capa un fondo negro a la mitad de transparencia.',
    goal: ['La clase capa con background-color en rgba, negro, con 0.5 de opacidad'],
    html:
      '<div style="background:#fbbf24;padding:30px">\n  <div class="capa" style="padding:20px;color:white">Fondo negro a media transparencia</div>\n</div>',
    starter: '',
    hint: 'rgba lleva cuatro números: rojo, verde, azul y transparencia. Negro es 0, 0, 0 y la mitad de transparencia es 0.5.',
    skeleton: '.capa {\n  background-color: __(0, 0, 0, __);\n}',
    solution: '.capa {\n  background-color: rgba(0, 0, 0, 0.5);\n}',
    tests: [
      { t: 'style', sel: '.capa', prop: 'background-color', eq: 'rgba(0, 0, 0, 0.5)', msg: 'El fondo debe ser rgba(0, 0, 0, 0.5)' },
    ],
  },
  {
    id: 'css-19',
    lang: 'css',
    n: 19,
    title: 'La sombra que se ve cara',
    brief:
      'El secreto del diseño que se ve caro: sombras muy suaves. Los principiantes las ponen negras y duras. Ponle a la tarjeta una sombra sin desplazamiento horizontal, 4 píxeles hacia abajo, 12 de difuminado y negro con apenas 0.1 de opacidad.',
    goal: ['La clase tarjeta con box-shadow de 0, 4px, 12px y color rgba(0, 0, 0, 0.1)'],
    html: '<div class="tarjeta" style="background:white;padding:24px;margin:20px">Fíjate en la sombra.</div>',
    starter: '',
    hint: 'box-shadow lleva cuatro cosas separadas por espacios: horizontal, vertical, difuminado y color. El color puede ser rgba.',
    skeleton: '.tarjeta {\n  __: 0 4px 12px rgba(0, 0, 0, __);\n}',
    solution: '.tarjeta {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}',
    tests: [
      { t: 'style', sel: '.tarjeta', prop: 'box-shadow', msg: 'Falta la propiedad box-shadow' },
      { t: 'style', sel: '.tarjeta', prop: 'box-shadow', has: '4px', msg: 'La sombra debe bajar 4px' },
      { t: 'style', sel: '.tarjeta', prop: 'box-shadow', has: '12px', msg: 'La sombra debe tener 12px de difuminado' },
      { t: 'style', sel: '.tarjeta', prop: 'box-shadow', has: 'rgba(0, 0, 0, 0.1)', msg: 'El color de la sombra debe ser rgba(0, 0, 0, 0.1)' },
    ],
  },
  {
    id: 'css-20',
    lang: 'css',
    n: 20,
    title: 'La foto redonda',
    brief:
      'La foto de perfil circular necesita tres cosas juntas, y si falta una, la foto sale aplastada. Hazla de 150 por 150, perfectamente redonda, y que la imagen llene el espacio sin deformarse.',
    goal: [
      'La clase foto-perfil con width y height de 150px',
      'border-radius del 50%',
      'object-fit en cover',
    ],
    html: `<img class="foto-perfil" src="${FOTO}" alt="Foto de perfil">`,
    htmlVisible: '<img class="foto-perfil" src="perfil.jpg" alt="Foto de perfil">',
    starter: '',
    hint: 'Un cuadrado con border-radius del 50% se vuelve un círculo. object-fit: cover es lo que evita que la foto salga estirada.',
    skeleton: '.foto-perfil {\n  width: __;\n  height: __;\n  border-radius: __;\n  __: cover;\n}',
    solution: '.foto-perfil {\n  width: 150px;\n  height: 150px;\n  border-radius: 50%;\n  object-fit: cover;\n}',
    tests: [
      { t: 'style', sel: '.foto-perfil', prop: 'width', eq: '150px', msg: 'La foto debe medir 150px de ancho' },
      { t: 'style', sel: '.foto-perfil', prop: 'height', eq: '150px', msg: 'La foto debe medir 150px de alto' },
      { t: 'style', sel: '.foto-perfil', prop: 'border-top-left-radius', eq: '50%', msg: 'Falta border-radius: 50% para volverla un círculo' },
      { t: 'style', sel: '.foto-perfil', prop: 'object-fit', eq: 'cover', msg: 'Falta object-fit: cover, si no la foto sale aplastada' },
    ],
  },
  {
    id: 'css-21',
    lang: 'css',
    n: 21,
    title: 'En fila, por fin',
    brief:
      'Hasta ahora todo se apila uno debajo del otro. Flexbox lo pone en fila, y se le aplica al contenedor (el padre), nunca a los hijos. Pon los enlaces del menú en fila, separados 20 píxeles.',
    goal: ['La clase menu en modo flexible', 'Con 20px de separación entre los hijos'],
    html:
      '<nav class="menu" style="background:#1e293b;padding:16px">\n  <a href="#" style="color:white">Inicio</a>\n  <a href="#" style="color:white">Sobre mí</a>\n  <a href="#" style="color:white">Contacto</a>\n</nav>',
    starter: '',
    hint: 'Son dos líneas: display con el valor flex, y gap con la separación. Si no pones display: flex, nada de lo demás funciona.',
    skeleton: '.menu {\n  __: flex;\n  __: 20px;\n}',
    solution: '.menu {\n  display: flex;\n  gap: 20px;\n}',
    tests: [
      { t: 'style', sel: '.menu', prop: 'display', eq: 'flex', msg: 'Falta display: flex en el contenedor .menu' },
      { t: 'style', sel: '.menu', prop: 'column-gap', eq: '20px', msg: 'Falta gap: 20px' },
    ],
  },
  {
    id: 'css-22',
    lang: 'css',
    n: 22,
    title: 'Logo a un lado, menú al otro',
    brief:
      'La barra de arriba de casi todas las páginas del mundo se hace con tres líneas: modo flexible, separarlos hasta los extremos y alinearlos a la misma altura.',
    goal: ['La clase barra en modo flexible', 'Con justify-content en space-between', 'Con align-items en center'],
    html:
      '<div class="barra" style="background:#0f172a;color:white;padding:16px">\n  <strong style="font-size:24px">MiLogo</strong>\n  <nav><a href="#" style="color:white">Contacto</a></nav>\n</div>',
    starter: '',
    hint: 'justify-content los acomoda a lo largo y el valor que los manda a los extremos es space-between. align-items los acomoda a lo ancho.',
    skeleton: '.barra {\n  display: __;\n  __: space-between;\n  __: center;\n}',
    solution: '.barra {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}',
    tests: [
      { t: 'style', sel: '.barra', prop: 'display', eq: 'flex', msg: 'Falta display: flex' },
      { t: 'style', sel: '.barra', prop: 'justify-content', eq: 'space-between', msg: 'Falta justify-content: space-between' },
      { t: 'style', sel: '.barra', prop: 'align-items', eq: 'center', msg: 'Falta align-items: center' },
    ],
  },
  {
    id: 'css-23',
    lang: 'css',
    n: 23,
    title: 'Centrado perfecto',
    brief:
      'Esto es lo que más cuesta en CSS y lo que más se busca en internet. Con Flexbox son cuatro líneas. Deja la caja exactamente en el centro de un contenedor de 300 píxeles de alto.',
    goal: [
      'La clase centrado en modo flexible',
      'justify-content en center',
      'align-items en center',
      'height de 300px',
    ],
    html:
      '<div class="centrado" style="background:#e0e7ff">\n  <div style="background:#4f46e5;color:white;padding:20px">Estoy en el centro exacto</div>\n</div>',
    starter: '',
    hint: 'Sin altura no hay centro vertical posible: por eso el height es indispensable. Las otras tres son display, justify-content y align-items.',
    skeleton: '.centrado {\n  display: __;\n  __: center;\n  __: center;\n  __: 300px;\n}',
    solution: '.centrado {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 300px;\n}',
    tests: [
      { t: 'style', sel: '.centrado', prop: 'display', eq: 'flex', msg: 'Falta display: flex' },
      { t: 'style', sel: '.centrado', prop: 'justify-content', eq: 'center', msg: 'Falta justify-content: center' },
      { t: 'style', sel: '.centrado', prop: 'align-items', eq: 'center', msg: 'Falta align-items: center' },
      { t: 'style', sel: '.centrado', prop: 'height', eq: '300px', msg: 'Falta height: 300px, si no no hay centro vertical' },
    ],
  },
  {
    id: 'css-24',
    lang: 'css',
    n: 24,
    title: 'Que reaccione al mouse',
    brief:
      'Todavía no es JavaScript: esto lo hace CSS solo. El botón normal es azul (#2563EB) con letra blanca, cursor de manito y cambios suaves de 0.3 segundos. Al pasar el mouse, se pone azul oscuro (#1E40AF) y crece un 5%.',
    goal: [
      'La clase boton con fondo #2563EB, letra white, cursor pointer y transition de 0.3s',
      'La regla de hover del boton con fondo #1E40AF y transform scale de 1.05',
    ],
    html: '<button class="boton" style="border:none;padding:12px 24px;font-size:16px">Haz clic aquí</button>',
    starter: '',
    hint: 'El hover se escribe pegando dos puntos y la palabra hover al selector, sin espacios: punto-boton-dos-puntos-hover. Y ojo: transition va en la regla NORMAL, no en la de hover.',
    skeleton:
      '.boton {\n  background-color: __;\n  color: __;\n  cursor: __;\n  __: 0.3s;\n}\n\n.boton__ {\n  background-color: __;\n  transform: __(1.05);\n}',
    solution:
      '.boton {\n  background-color: #2563EB;\n  color: white;\n  cursor: pointer;\n  transition: 0.3s;\n}\n\n.boton:hover {\n  background-color: #1E40AF;\n  transform: scale(1.05);\n}',
    tests: [
      { t: 'style', sel: '.boton', prop: 'background-color', eq: '#2563EB', msg: 'El botón normal debe tener fondo #2563EB' },
      { t: 'style', sel: '.boton', prop: 'color', eq: 'white', msg: 'El botón debe tener letra blanca' },
      { t: 'style', sel: '.boton', prop: 'cursor', eq: 'pointer', msg: 'Falta cursor: pointer, los botones deben tener la manito' },
      { t: 'style', sel: '.boton', prop: 'transition-duration', eq: '0.3s', msg: 'Falta transition: 0.3s en la regla normal (no en la de hover)' },
      { t: 'rule', sel: '.boton:hover', prop: 'background-color', eq: '#1E40AF', msg: 'Falta la regla .boton:hover con background-color: #1E40AF' },
      { t: 'rule', sel: '.boton:hover', prop: 'transform', has: 'scale(1.05)', msg: 'Falta transform: scale(1.05) dentro de .boton:hover' },
    ],
  },
  {
    id: 'css-25',
    lang: 'css',
    n: 25,
    title: 'JEFE FINAL — Que se vea bien en el celular',
    brief:
      'Más de la mitad de las personas te van a visitar desde el celular. Arma la galería para pantalla grande y después, solo para pantallas de menos de 600 píxeles, cambia el menú a columna y achica el título. Las media queries van SIEMPRE al final del archivo.',
    goal: [
      'La clase galeria en modo flexible, con salto de renglón permitido y 16px de separación',
      'La clase tarjeta con width de 250px',
      'Una media query para pantallas de máximo 600px',
      'Dentro de la media query: el menu en columna y el h1 con font-size de 28px',
    ],
    html:
      '<h1>Mi galería</h1>\n<nav class="menu"><a href="#">Uno</a><a href="#">Dos</a></nav>\n<div class="galeria">\n  <div class="tarjeta" style="background:#c7d2fe;padding:16px">A</div>\n  <div class="tarjeta" style="background:#fbcfe8;padding:16px">B</div>\n  <div class="tarjeta" style="background:#bbf7d0;padding:16px">C</div>\n</div>',
    starter: '',
    hint: 'flex-wrap con el valor wrap permite que salten de renglón. La media query se escribe con arroba: @media, paréntesis, max-width dos puntos 600px, y adentro van reglas completas con su propio selector y sus propias llaves.',
    skeleton:
      '.galeria {\n  display: flex;\n  __: wrap;\n  gap: __;\n}\n\n.tarjeta {\n  width: __;\n}\n\n__ (max-width: __) {\n  .menu {\n    flex-direction: __;\n  }\n  h1 {\n    font-size: __;\n  }\n}',
    solution:
      '.galeria {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.tarjeta {\n  width: 250px;\n}\n\n@media (max-width: 600px) {\n  .menu {\n    flex-direction: column;\n  }\n  h1 {\n    font-size: 28px;\n  }\n}',
    tests: [
      { t: 'style', sel: '.galeria', prop: 'display', eq: 'flex', msg: 'La galería necesita display: flex' },
      { t: 'style', sel: '.galeria', prop: 'flex-wrap', eq: 'wrap', msg: 'Falta flex-wrap: wrap para que las tarjetas salten de renglón' },
      { t: 'style', sel: '.galeria', prop: 'column-gap', eq: '16px', msg: 'Falta gap: 16px en la galería' },
      { t: 'style', sel: '.tarjeta', prop: 'width', eq: '250px', msg: 'Las tarjetas deben medir 250px de ancho' },
      { t: 'rule', sel: '.menu', prop: 'flex-direction', eq: 'column', media: 'max-width: 600px', msg: 'Dentro de la media query falta .menu con flex-direction: column' },
      { t: 'rule', sel: 'h1', prop: 'font-size', eq: '28px', media: 'max-width: 600px', msg: 'Dentro de la media query falta h1 con font-size: 28px' },
      { t: 'src', re: '@media', msg: 'Falta la media query. Se escribe con arroba: @media' },
    ],
  },
]
