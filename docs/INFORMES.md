# Informes de participación de los alumnos

Cómo se arma el informe de participación que se le entrega al profesor (el primero se hizo
el 20 de octubre de 2026, en Word). Este archivo explica el método; **no tiene datos de
alumnos, a propósito**: el repositorio es público y los alumnos son menores.

Los scripts, los datos de cada informe, el análisis por estudiante y la línea base para
comparar están en el computador del profesor, en `~/Documents/Informes de alumnos/`
(ver su `LEEME.md`). Nada de eso se sube al repo.

## Qué cubre

- Curso Python desde cero y Python avanzado (tabla `cursos`).
- Proyectos guiados (tabla `proyectos`).
- El examen (tabla `alumnos`) solo como contexto.
- El tiempo y los días de trabajo salen de la bitácora (tabla `eventos`).

Los cursos de TypeScript y Rust se pueden sumar igual: tienen sus filas en `cursos`, con los
prefijos `ts-`, `tsa-`, `rs-` y `rsa-`.

## De dónde sale cada número

| Dato | Cómo se calcula |
|---|---|
| Retos resueltos | `cursos.hechos`: los retos que pasaron todas las pruebas. |
| Lección donde va | El primer reto, en orden, que no está en `hechos`. |
| Intentos | `cursos.intentos`: cuántas veces le dio Comprobar a cada reto (Correr no cuenta). |
| Al primer intento | Retos resueltos con 1 intento. La mejor señal de que el tema estaba entendido. |
| Pistas | `cursos.pistas`: retos donde abrió la pista. |
| Pegados bloqueados | `cursos.pegados` y `proyectos.pegados`: intentos de pegar que la plataforma frenó. |
| Tiempo activo | Con la hora de cada evento del área (reto resuelto, pista, pegado bloqueado): se suman los ratos entre eventos de menos de 20 minutos, más 3 minutos por cada sesión. Es un estimado por lo bajo: no cuenta el tiempo leyendo la explicación. |
| Días de trabajo | Días distintos (hora de Bogotá) con eventos en el curso. |
| Última actividad | El `actualizado` más reciente en cualquiera de las áreas. |
| Reto difícil | Se mide por **cuántos se trabaron** (10 intentos o más) y la mediana, no por el promedio: un solo alumno con cientos de intentos dispara el promedio. |

## Reglas

- **Solo lectura.** Los datos se bajan con SELECT; el proyecto de Supabase tiene los datos
  reales del salón.
- **Un estudiante = un registro.** Los alumnos entran solo con su nombre y a veces lo
  escriben distinto (tildes, letras de más, nombre completo o solo el primero). Esos
  registros se unen y se usa el que tenga más avance. La lista de uniones vive con los
  scripts, fuera del repo.
- **Se excluyen** el profesor y los registros de prueba.
- **El análisis no es solo números:** para cada alumno pegado en un reto, se mira el código
  que lleva escrito (`cursos.codigo`), porque muestra la causa real (un error de dedo, la
  sangría, un texto entre comillas que debía ser una cuenta).
- **Cada número del análisis se revisa contra los datos** antes de entregar.
- **Tono:** es un informe para el profesor, honesto pero sin regaños; las recomendaciones
  dicen qué hacer, no quién falló.

## Estructura del informe

1. Resumen con lo más importante.
2. De dónde salen los datos y qué nombres se unieron.
3. Panorama del salón: tabla de todos y gráficas (avance, hasta qué lección llegaron, horas).
4. Python desde cero: dónde se traba el salón y cómo trabajan.
5. Python avanzado.
6. Proyectos guiados.
7. Una ficha por estudiante: números y tres párrafos (cómo va, qué le cuesta, qué hacer).
8. Recomendaciones: grupos de trabajo, temas para reforzar, alertas de asistencia.
9. Anexo: quienes solo aparecen en el examen.

Desde el segundo informe, cada ficha compara contra la **línea base** del anterior:
cuánto avanzó, si se destrabó, si volvió a clase.
