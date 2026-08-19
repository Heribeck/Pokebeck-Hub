# DATABASE_SCHEMA.md

**Proyecto:** Pokebeck Hub
**Versión:** 1.0 (V1)

---

# Filosofía

La base de datos de Pokebeck Hub está diseñada para ser:

* Offline.
* Escalable.
* Fácil de mantener.
* Preparada para múltiples idiomas.
* Basada en identificadores oficiales cuando existan.
* Sin duplicación de información.

---

# Reglas Globales

## Regla 1

Los JSON contienen datos.

El código contiene la lógica.

---

## Regla 2

Los recursos (sprites, artworks, siluetas, iconos y audio) nunca se almacenan dentro de los JSON.

Todos viven dentro de `assets/`.

---

## Regla 3

Siempre que exista un identificador oficial estable (Número Nacional, PokéAPI, etc.) se utilizará dicho identificador.

---

## Regla 4

Los datos repetibles se almacenan una sola vez y se referencian mediante IDs.

---

## Regla 5

Las formas nunca serán consideradas Pokémon independientes.

Siempre pertenecen a un Pokémon base.

---

# Estructura

```text
data/

pokemon.json

types.json

categories.json

abilities.json

moves.json

move_categories.json

evolution_methods.json

evolutions.json

forms.json

items.json

move_learn_methods.json

move_learnsets.json
```

---

# Esquemas

## pokemon.json

```text
id
slug
name
generation
region
categories
types
abilities
hiddenAbility
baseStats
bst
height
weight
species
description
evolutionChain
```

---

## types.json

```text
id
slug
name
color
doubleDamageTo
halfDamageTo
noDamageTo
```

---

## categories.json

```text
id
slug
name
```

---

## abilities.json

```text
id
slug
name
description
generation
```

---

## moves.json

```text
id
slug
name
type
category
power
accuracy
pp
description
generation
priority
```

---

## move_categories.json

```text
id
slug
name
```

---

## evolution_methods.json

```text
id
slug
name
```

---

## evolutions.json

```text
id
fromPokemon
toPokemon
method
value
condition
```

---

## forms.json

```text
id
pokemonId
name
formType
types
abilities
hiddenAbility
baseStats
height
weight
```

Solo almacena las diferencias respecto al Pokémon base.

---

## items.json

```text
id
slug
name
category
description
```

---

## move_learn_methods.json

```text
id
slug
name
```

---

## move_learnsets.json

```text
id
pokemonId
moveId
method
value
```

---

# Relaciones

```text
pokemon
 ├── categories
 ├── types
 ├── abilities
 └── evolutions

moves
 ├── types
 └── move_categories

forms
 └── pokemon

move_learnsets
 ├── pokemon
 ├── moves
 └── move_learn_methods

evolutions
 ├── pokemon
 ├── evolution_methods
 └── items
```

---

# Recursos

Los recursos visuales y multimedia estarán separados de los datos.

```text
assets/

artwork/

sprites/

silhouettes/

type-icons/

audio/
```

---

# Estado

**Arquitectura de la base de datos aprobada para Pokebeck Hub V1.**

Toda modificación futura deberá corresponder a una nueva versión del esquema (V2 o superior).
