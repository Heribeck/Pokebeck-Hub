# Pokebeck Hub - Arquitectura de Datos

**Versión:** 1.0

---

# Objetivo

Definir la organización general de los datos y recursos utilizados por Pokebeck Hub.

La arquitectura debe ser simple, escalable y completamente funcional sin conexión a Internet.

---

# Filosofía

Los datos y los recursos son elementos distintos.

* Los datos describen la información del juego.
* Los recursos representan archivos utilizados por la interfaz.

Cada elemento debe existir en un único lugar para evitar duplicación.

---

# Datos

Toda la información del universo Pokémon se almacenará en archivos JSON.

Ejemplos:

* pokemon.json
* types.json
* abilities.json
* moves.json
* forms.json
* evolution_chains.json
* move_learnsets.json

Estos archivos contienen únicamente información estructurada.

---

# Recursos

Los recursos gráficos y multimedia se almacenarán en la carpeta `assets`.

Ejemplos:

* Artwork oficial.
* Sprites.
* Siluetas.
* Iconos de tipos.
* Iconos de interfaz.
* Audio.

Los recursos no forman parte de los archivos JSON.

---

# Identificador Principal

El identificador oficial de cada Pokémon será su Número de la Pokédex Nacional.

Ejemplos:

* Bulbasaur → 1
* Charizard → 6
* Pikachu → 25
* Pecharunt → 1025

Este identificador será utilizado para relacionar datos y recursos.

---

# Relación entre Datos y Recursos

Los recursos gráficos seguirán una convención basada en el ID del Pokémon.

Esto evita almacenar rutas de archivos dentro de la base de datos.

La lógica para acceder a los recursos se implementará durante la fase de desarrollo.

---

# Organización General

```text
data/
    pokemon.json
    types.json
    abilities.json
    moves.json
    forms.json
    evolution_chains.json
    move_learnsets.json

assets/
    artwork/
    sprites/
    silhouettes/
    icons/
    audio/
```

---

# Reglas

* Los archivos JSON solo contienen datos.
* Los recursos nunca se almacenan dentro de los JSON.
* Toda relación entre datos utilizará identificadores únicos.
* No se duplicará información entre archivos.

---

# Estado

## Aprobado

Esta arquitectura será la base para toda la versión 1 de Pokebeck Hub.
