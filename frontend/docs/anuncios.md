# Documentación de Anuncios - Pokebeck Hub

## Overview

Este documento describe todos los anuncios implementados en la aplicación Pokebeck Hub, incluyendo sus tipos, IDs, condiciones de visualización y lógica de funcionamiento.

## Tipos de Anuncios

### 1. Banner Ad

**ID:** `ca-app-pub-1898586331132450/5546962412`

**Descripción:** Anuncio de banner que se muestra en la parte superior de la pantalla.

**Condiciones de Visualización:**
- **Se muestra:**
  - Al inicializar la aplicación
  - Al volver al menú principal
  - Al entrar a PokeType (panel principal)
  - Al entrar a Acerca del Proyecto
  - Al entrar al Generador
  - Al volver al menú desde cualquier panel

- **Se oculta:**
  - Al entrar a Estudio/Ligas (modo de juego)
  - Al entrar a Entrenamiento/Dificultades (modo de juego)
  - Al entrar al Desafío del Día (modo de juego)

**Archivos relacionados:**
- `admob.js` - Funciones `mostrarBanner()` y `ocultarBanner()`
- `utils.js` - Llamada a `mostrarBanner()` en `volverAlMenu()`
- `eventosMain.js` - Llamadas a `mostrarBanner()` en navegación
- `eventosPoketype.js` - Llamadas a `mostrarBanner()` y `ocultarBanner()`

---

### 2. Interstitial Ad

**ID:** `ca-app-pub-1898586331132450/4178291414`

**Descripción:** Anuncio intersticial de pantalla completa que se muestra en momentos específicos del juego.

**Condiciones de Visualización:**

#### 2.1. Desafío del Día
- **Cuándo:** Al finalizar el desafío del día (completar las 10 rondas)
- **Archivo:** `desafio-dia.js` - Función `finalizarSesion()`

#### 2.2. Modo Entrenamiento - Selección de Dificultad
- **Cuándo:** Cada 3 veces que el usuario selecciona cualquier dificultad (en total)
- **Contador:** `contadorSeleccionDificultad` (localStorage)
- **Límite:** 3 selecciones
- **Archivo:** `eventosEntrenamiento.js` - Event listeners de dificultades

#### 2.3. Modo Entrenamiento - Pérdidas
- **Cuándo:** Cada 5 veces que el usuario pierde y vuelve a jugar (en general)
- **Contador:** `contadorPerdidasEntrenamiento` (localStorage)
- **Límite:** 5 pérdidas
- **Archivo:** `entrenamiento.js` - Lógica de pérdida en `campistaLogica()`

#### 2.4. Modo Estudio - Repeticiones de Nivel
- **Cuándo:** Cada 2 veces que el usuario repite un nivel ya completado
- **Contador:** `contadorRepeticionesNivel_{nivelId}` (localStorage, uno por nivel)
- **Límite:** 2 repeticiones por nivel
- **Archivo:** `estudio.js` - Función `iniciarNivelEstudio()`

#### 2.5. Modo Estudio - Niveles Específicos (Múltiplos de 4)
- **Cuándo:** Al completar niveles específicos según la liga:
  - **Campista:** Niveles 4, 8
  - **As:** Niveles 4, 8, 12
  - **Campeón:** Niveles 4, 8, 12, 16
- **Archivo:** `estudio.js` - Función `finalizarNivel()`

**Archivos relacionados:**
- `admob.js` - Funciones `mostrarIntersticial()`, `prepararIntersticial()`, y funciones de contadores
- `desafio-dia.js` - Llamada a `mostrarIntersticial()`
- `eventosEntrenamiento.js` - Llamadas a `incrementarContadorSeleccionDificultad()`
- `entrenamiento.js` - Llamada a `incrementarContadorPerdidasEntrenamiento()`
- `estudio.js` - Llamadas a `incrementarContadorRepeticionesNivel()` y `verificarNivelEspecificoIntersticial()`

---

### 3. Rewarded Ad (Anuncio Bonificado)

**ID:** `ca-app-pub-1898586331132450/8031266354`

**Descripción:** Anuncio con recompensa que el usuario ve voluntariamente a cambio de beneficios en el juego.

**Condiciones de Visualización:**

#### 3.1. Recuperar Vida General
- **Cuándo:** Al hacer click en el botón "Recuperar Vida" en PokeType
- **Recompensa:** Restaura 1 vida general
- **Modo:** `vidas-generales`
- **Archivo:** `eventosPoketype.js` - Botón `btnRecuperarVidaPoketype`

#### 3.2. Revivir en Entrenamiento
- **Cuándo:** Al hacer click en el botón "Revivir" durante el modo entrenamiento
- **Recompensa:** Continúa la sesión de entrenamiento con el score anterior
- **Modo:** `campista`
- **Archivo:** `entrenamiento.js` - Botón `btnRevivirCampista`

#### 3.3. Revivir en Desafío del Día
- **Cuándo:** Al hacer click en el botón "Revivir" durante el desafío del día
- **Recompensa:** Continúa el desafío del día
- **Modo:** `desafio`
- **Archivo:** `desafio-dia.js` - Botón `btnRevivirDesafio`

**Eventos de AdMob:**
- `onRewardedVideoAdLoaded` - Anuncio cargado
- `onRewardedVideoAdFailedToLoad` - Error al cargar
- `onRewardedVideoAdReward` - Recompensa otorgada
- `onRewardedVideoAdDismissed` - Anuncio cerrado

**Archivos relacionados:**
- `admob.js` - Funciones `mostrarBonificado()`, `prepararBonificado()`, y lógica de eventos
- `eventosPoketype.js` - Llamada a `clickRevivir('vidas-generales')`
- `entrenamiento.js` - Llamada a `clickRevivir('campista')`
- `desafio-dia.js` - Llamada a `clickRevivir('desafio')`
- `vidasGeneralesStorage.js` - Función `restaurarVidaPorAnuncio()`
- `vidaUi.js` - Función `actualizarIndicadorVidas()`

---

## Contadores en LocalStorage

### Claves de Contadores

| Clave | Propósito | Límite | Reinicia |
|-------|-----------|--------|----------|
| `contadorSeleccionDificultad` | Selecciones de dificultad en entrenamiento | 3 | Sí |
| `contadorPerdidasEntrenamiento` | Pérdidas en entrenamiento | 5 | Sí |
| `contadorRepeticionesNivel_{nivelId}` | Repeticiones de nivel en Estudio | 2 | Sí |

### Constantes en config.js

```javascript
export const CONTADOR_SELECCION_DIFICULTAD_KEY = 'contadorSeleccionDificultad';
export const CONTADOR_PERDIDAS_ENTRENAMIENTO_KEY = 'contadorPerdidasEntrenamiento';
export const CONTADOR_REPETICIONES_NIVEL_PREFIX = 'contadorRepeticionesNivel_';
export const LIMITE_SELECCION_DIFICULTAD = 3;
export const LIMITE_PERDIDAS_ENTRENAMIENTO = 5;
export const LIMITE_REPETICIONES_NIVEL = 2;
```

---

## Configuración de AdMob

### AndroidManifest.xml

```xml
<!-- Configuración de AdMob (ACTIVO) -->
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-1898586331132450~3525783822"/>
```

### Permisos

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="com.google.android.gms.permission.AD_ID" />
```

---

## Funciones Principales en admob.js

### Inicialización
- `InicializarAdMob()` - Inicializa AdMob, muestra banner, prepara intersticial

### Banner
- `mostrarBanner(posicionBanner)` - Muestra banner en posición especificada
- `ocultarBanner()` - Oculta el banner

### Intersticial
- `prepararIntersticial()` - Prepara el anuncio intersticial
- `mostrarIntersticial()` - Muestra el anuncio intersticial

### Bonificado
- `prepararBonificado()` - Prepara el anuncio bonificado
- `mostrarBonificado()` - Muestra el anuncio bonificado
- `clickRevivir(modo)` - Maneja el flujo de revivir con anuncio bonificado

### Contadores
- `incrementarContadorSeleccionDificultad()` - Incrementa y verifica contador de selección de dificultad
- `incrementarContadorPerdidasEntrenamiento()` - Incrementa y verifica contador de pérdidas
- `incrementarContadorRepeticionesNivel(nivelId)` - Incrementa y verifica contador de repeticiones de nivel
- `verificarNivelEspecificoIntersticial(nivelId, liga)` - Verifica si el nivel es múltiplo de 4 y muestra intersticial

---

## Flujo de Recompensa de Anuncio Bonificado

1. Usuario hace click en botón de revivir/recuperar vida
2. Se llama `clickRevivir(modo)` que:
   - Verifica conexión a internet
   - Establece `adState.modoRevivirActivo` al modo correspondiente
   - Establece `adState.recompensaGanada` a false
   - Llama `mostrarBonificado()`
3. Se muestra el anuncio
4. Evento `onRewardedVideoAdReward` se dispara → `adState.recompensaGanada = true`
5. Evento `onRewardedVideoAdDismissed` se dispara:
   - Verifica si `adState.recompensaGanada` es true y el modo coincide
   - Ejecuta la acción correspondiente (restaurar vida, revivir, etc.)
   - Muestra notificación
   - Reinicia el estado
   - Prepara el siguiente anuncio bonificado

---

## Resumen de Frecuencia de Anuncios

### Banner
- **Frecuencia:** Permanente (excepto en modos de juego)
- **Posición:** TOP_CENTER

### Intersticial
- **Desafío del Día:** 1 por sesión (al finalizar)
- **Entrenamiento (selección):** 1 cada 3 selecciones
- **Entrenamiento (pérdidas):** 1 cada 5 pérdidas
- **Estudio (repeticiones):** 1 cada 2 repeticiones por nivel
- **Estudio (niveles específicos):** 1 al completar niveles múltiplos de 4

### Bonificado
- **Frecuencia:** Bajo demanda (usuario decide verlo)
- **Recompensas:** Vida general, revivir en entrenamiento, revivir en desafío

---

## Notas de Implementación

1. **Persistencia:** Todos los contadores se guardan en localStorage para persistir entre sesiones
2. **Conexión a internet:** Los anuncios requieren conexión a internet para funcionar
3. **Testing:** Los IDs de anuncio están configurados para producción (`isTesting: false`)
4. **Consistencia:** El banner solo se oculta en modos de juego activos para no interrumpir la experiencia
5. **UX:** Los anuncios intersticiales se muestran en momentos naturales de transición (fin de nivel, selección, etc.)

---

## Última Actualización

**Fecha:** 18 de agosto de 2026  
**Versión:** 2.2.4  
**Cambios recientes:**
- Implementación de contadores para intersticiales en entrenamiento
- Implementación de contador de repeticiones en Estudio
- Implementación de intersticiales en niveles específicos (múltiplos de 4)
- Extensión del banner a más paneles de la aplicación
- Corrección del sistema de recuperación de vida con anuncio bonificado
