# Pokebeck Hub - Documento Maestro

**Versión:** 3.X.X (Fundación del Proyecto)

---

# 1. Visión

**Pokebeck Hub** es una plataforma móvil enfocada en el entrenamiento del conocimiento sobre Pokémon.

Su objetivo es combinar entretenimiento y herramientas útiles para que los usuarios aprendan, practiquen y midan su conocimiento mediante diferentes juegos, un sistema de progreso y utilidades especializadas.

La aplicación está diseñada principalmente para Android.

---

# 2. Filosofía

Pokebeck Hub no busca ser una wiki, una aplicación del anime o un recopilador de contenido Pokémon.

Su propósito es convertirse en el centro de entrenamiento del conocimiento Pokémon.

Todo lo que exista dentro de la aplicación debe cumplir al menos una de estas funciones:

* Enseñar.
* Entrenar.
* Medir conocimientos.
* Ayudar al jugador mediante herramientas útiles.

---

# 3. Principios del Proyecto

## Offline First

Toda la aplicación debe funcionar completamente sin conexión a Internet.

Internet únicamente será utilizado para:

* Mostrar anuncios.
* Funciones online futuras.
* Actualizaciones cuando existan.

---

## Plataforma

Android será la plataforma principal.

---

## Monetización

La fuente principal de ingresos será AdMob.

No se utilizarán servidores de pago durante la primera versión del proyecto.

---

## Simplicidad

La aplicación debe ser simple de utilizar.

Pocas opciones.

Pocas configuraciones.

Mucho contenido.

---

## Reutilización

Cada dato añadido al proyecto debe poder reutilizarse por varios módulos.

La información nunca debe existir únicamente para una sola función si puede aprovecharse en otras.

---

# 4. Módulos de la Aplicación

## Juegos

El corazón de Pokebeck Hub.

Su objetivo es entrenar el conocimiento Pokémon mediante diferentes mecánicas.

Juegos confirmados:

* Type Guess.
* Who's That Pokémon? (Siluetas).
* ¿Quién soy? (Sistema de pistas).
* Impostor.
* Trivia General.
* Adivina la habilidad mediante su descripción.

---

## Herramientas

Herramientas útiles para jugadores casuales y competitivos.

Confirmadas:

* Pokédex.
* Calculadora de tipos.
* Team Builder.
* Team Analyzer.
* Coverage Calculator.

---

## Perfil

El usuario dispondrá de un perfil donde podrá consultar su progreso, estadísticas y logros.

---

# 5. Sistema Hexium (HX)

Hexium (HX) será el sistema principal para medir el conocimiento del usuario.

Principios:

* Todos comienzan con el mismo HX.
* Existe un único HX global.
* Todos los juegos modifican el mismo HX.
* El HX puede aumentar o disminuir.
* La dificultad de los juegos dependerá del HX del jugador.
* El cálculo del HX se realizará al finalizar cada sesión.
* La fórmula exacta será diseñada cuando todos los juegos tengan su estructura definitiva.

---

# 6. Contenido del Proyecto

Pokebeck Hub se centrará en los siguientes bloques de conocimiento:

* Pokémon.
* Tipos.
* Movimientos.
* Habilidades.
* Objetos.
* Estadísticas.
* Formas.
* Clasificaciones.

Todo el contenido futuro deberá pertenecer a alguno de estos bloques.

---

# 7. Modelo Principal: Pokémon

La entidad principal del proyecto es el Pokémon.

Toda la aplicación gira alrededor de esta entidad.

Cada Pokémon podrá contener información como:

## Identidad

* ID Nacional.
* Nombre.
* Generación.
* Categoría.

## Apariencia

* Sprite normal.
* Sprite shiny.
* Artwork oficial.
* Cry.
* Color.
* Forma del cuerpo.
* Altura.
* Peso.

## Combate

* Tipo 1.
* Tipo 2.
* HP.
* Ataque.
* Defensa.
* Ataque Especial.
* Defensa Especial.
* Velocidad.
* Total de stats.
* Habilidades.
* Habilidad oculta.

## Biología

* Grupo huevo.
* Ratio de género.
* Tasa de captura.
* Experiencia base.
* EV Yield.

## Clasificaciones

* Inicial.
* Legendario.
* Singular.
* Pseudolegendario.
* Fósil.
* Bebé.
* Ultraente.
* Paradox.

## Evolución

* Cadena evolutiva.
* Método de evolución.

## Formas

* Regionales.
* Megaevoluciones.
* Gigamax.
* Formas especiales.

## Movimientos

* Movimientos por nivel.
* MT/MO.
* Tutor.
* Huevo.
* Eventos (opcional).

## Pokédex

* Descripción.
* Región de origen.
* Número regional.

---

# 8. Perfil del Usuario

Cada usuario almacenará únicamente la información necesaria.

## Progreso

* HX.
* Nivel.
* Experiencia.

## Estadísticas

* Partidas jugadas.
* Preguntas respondidas.
* Respuestas correctas.
* Respuestas incorrectas.
* Precisión global.
* Mejor racha.

## Equipos

Equipos creados mediante Team Builder.

## Logros

Listado de logros desbloqueados.

## Configuración

* Idioma.
* Música (activar/desactivar).
* Sonidos (activar/desactivar).

---

# 9. Arquitectura de los Juegos

Todos los juegos utilizarán el mismo motor de sesión.

Flujo general:

Seleccionar juego

↓

Configurar partida

↓

Jugar

↓

Resultados

↓

Actualizar HX y estadísticas

↓

Volver al menú

Cada juego únicamente modificará su propia lógica de preguntas, manteniendo el mismo sistema de progreso y resultados.

---

# 10. Reglas de Diseño

* Todo debe funcionar offline.
* Todo debe reutilizar datos.
* Todo juego debe utilizar el mismo motor de sesión.
* El HX representa únicamente el conocimiento Pokémon.
* La aplicación debe mantenerse simple, rápida y escalable.
* Si una función no mejora la experiencia principal, se pospone para futuras versiones.

---

# Estado Actual

## Completado

* Identidad del proyecto.
* Filosofía.
* Módulos principales.
* Sistema Hexium (conceptual).
* Contenido de la aplicación.
* Modelo principal del Pokémon.
* Modelo del usuario.
* Arquitectura general de los juegos.

## Pendiente

* Diseño detallado de cada juego.
* Diseño de la base de datos SQLite.
* Arquitectura del código.
* Diseño UI/UX.
* Sistema de logros.
* Fórmula matemática del Hexium.
* Roadmap de desarrollo.
