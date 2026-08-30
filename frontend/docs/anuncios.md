# Documentación de Anuncios - Pokebeck Hub

## Índice

- [Overview](#overview)
- [Tipos de Anuncios](#tipos-de-anuncios)
  - [1. Banner Ad](#1-banner-ad)
  - [2. Interstitial Ad](#2-interstitial-ad)
  - [3. Rewarded Ad (Anuncio Bonificado)](#3-rewarded-ad-anuncio-bonificado)
- [Contadores en LocalStorage](#contadores-en-localstorage)
- [Configuración de AdMob](#configuración-de-admob)
- [Funciones Principales en admob.js](#funciones-principales-en-admobjs)
- [Flujo de Recompensa de Anuncio Bonificado](#flujo-de-recompensa-de-anuncio-bonificado)
- [Resumen de Frecuencia de Anuncios](#resumen-de-frecuencia-de-anuncios)
- [Notas de Implementación](#notas-de-implementación)
- [Última Actualización](#última-actualización)

## Overview

Este documento describe todos los anuncios implementados en la aplicación Pokebeck Hub, incluyendo sus tipos, IDs, condiciones de visualización y lógica de funcionamiento.

## Tipos de Anuncios

### 1. Banner Ad

**IDs:**
- **BANNER_MAIN:** `ca-app-pub-1898586331132450/5546962412` - Banner principal para toda la aplicación
- **BANNER_GENERADOR:** `ca-app-pub-1898586331132450/9079259103` - Banner específico para el Generador

**Descripción:** Anuncios de banner que se muestran en la parte superior de la pantalla. Se utilizan dos IDs diferentes para optimizar el rendimiento según el contexto.

**Condiciones de Visualización:**
- **Se muestra (BANNER_MAIN):**
  - Al inicializar la aplicación
  - Al volver al menú principal
  - Al entrar a PokeType (panel principal)
  - Al entrar a Acerca del Proyecto
  - Al volver al menú desde cualquier panel

- **Se muestra (BANNER_GENERADOR):**
  - Al entrar al Generador

- **Se oculta:**
  - Al entrar a Estudio/Ligas (modo de juego)
  - Al entrar a Entrenamiento/Dificultades (modo de juego)
  - Al entrar al Desafío del Día (modo de juego)

**Gestión de Banners:**
- La función `cambarBanner(tipo)` permite cambiar entre banners sin duplicar visualizaciones
- Solo un banner está activo a la vez
- Al salir del Generador, se restaura automáticamente el banner principal

**Archivos relacionados:**
- `adsConfig.js` - Configuración de IDs de banners
- `admob.js` - Funciones `mostrarBanner(posicion, tipo)`, `ocultarBanner()`, `cambarBanner(tipo)`
- `utils.js` - Llamada a `cambarBanner('main')` en `volverAlMenu()`
- `eventosMain.js` - Llamadas a `mostrarBanner()` en navegación
- `eventosPoketype.js` - Llamada a `mostrarBanner("TOP_CENTER", "generador")`

---

### 2. Interstitial Ad

**IDs:**
- **INTERSTITIAL_DESAFIO_DIA:** `ca-app-pub-1898586331132450/4178291414` - Para el Desafío del Día
- **INTERSTITIAL_ENTRENAMIENTO:** `ca-app-pub-1898586331132450/9813756274` - Para Modo Entrenamiento
- **INTERSTITIAL_NIVELES:** `ca-app-pub-1898586331132450/6996021243` - Para Modo Estudio/Ligas
- **INTERSTITIAL_GENERADOR:** `ca-app-pub-1898586331132450/7626576636` - Para el Generador

**Descripción:** Anuncios intersticiales de pantalla completa que se muestran en momentos específicos del juego. Se utilizan 4 IDs diferentes para optimizar el rendimiento según el contexto.

**Condiciones de Visualización:**

#### 2.1. Desafío del Día
- **ID:** `INTERSTITIAL_DESAFIO_DIA`
- **Cuándo:** Al finalizar el desafío del día (completar las 10 rondas)
- **Archivo:** `desafio-dia.js` - Función `finalizarSesion()`

#### 2.2. Modo Entrenamiento - Pérdidas
- **ID:** `INTERSTITIAL_ENTRENAMIENTO`
- **Cuándo:** Cada 5 veces que el usuario pierde en el modo entrenamiento
- **Contador:** `contadorPerdidasEntrenamiento` (localStorage)
- **Límite:** 5 pérdidas
- **Archivo:** `entrenamiento.js` - Lógica de pérdida en `campistaLogica()`

#### 2.3. Modo Estudio - Niveles Específicos (Múltiplos de 4)
- **ID:** `INTERSTITIAL_NIVELES`
- **Cuándo:** Al completar niveles específicos según la liga:
  - **Campista:** Niveles 4, 8
  - **As:** Niveles 4, 8, 12
  - **Campeón:** Niveles 4, 8, 12, 16
- **Archivo:** `estudio.js` - Función `verificarNivelEspecificoIntersticial()`

#### 2.4. Generador
- **ID:** `INTERSTITIAL_GENERADOR`
- **Cuándo:** Cada 7 generaciones de tipos en el Generador
- **Contador:** `contadorGenerador` (localStorage)
- **Límite:** 7 generaciones
- **Archivo:** `generador.js` - Función `generarTipos()`

**Archivos relacionados:**
- `adsConfig.js` - Configuración de IDs de intersticiales
- `admob.js` - Funciones `mostrarIntersticial(adUnitId)`, `prepararIntersticial(adUnitId)`, y funciones de contadores
- `desafio-dia.js` - Llamada a `mostrarIntersticial(ADS_CONFIG.INTERSTITIAL_DESAFIO_DIA)`
- `entrenamiento.js` - Llamada a `incrementarContadorPerdidasEntrenamiento()`
- `estudio.js` - Llamada a `verificarNivelEspecificoIntersticial()`
- `generador.js` - Llamada a `incrementarContadorGenerador()`

---

### 3. Rewarded Ad (Anuncio Bonificado)

**IDs:**
- **REWARDED_VIDAS:** `ca-app-pub-1898586331132450/8031266354` - Para recuperar vidas generales
- **REWARDED_ENTRENAMIENTO:** `ca-app-pub-1898586331132450/8142843731` - Para revivir en entrenamiento y otros modos
- **REWARDED_DESAFIO_DIA:** `ca-app-pub-1898586331132450/1315379800` - Para revivir en Desafío del Día

**Descripción:** Anuncios con recompensa que el usuario ve voluntariamente a cambio de beneficios en el juego. Se utilizan 3 IDs diferentes para optimizar el rendimiento según el contexto.

**Condiciones de Visualización:**

#### 3.1. Recuperar Vida General
- **ID:** `REWARDED_VIDAS`
- **Cuándo:** Al hacer click en el botón "Recuperar Vida" en PokeType
- **Recompensa:** Restaura 1 vida general
- **Modo:** `vidas-generales`
- **Archivo:** `eventosPoketype.js` - Botón `btnRecuperarVidaPoketype`

#### 3.2. Revivir en Entrenamiento
- **ID:** `REWARDED_ENTRENAMIENTO`
- **Cuándo:** Al hacer click en el botón "Revivir" durante el modo entrenamiento
- **Recompensa:** Continúa la sesión de entrenamiento con el score anterior
- **Modo:** `campista`
- **Archivo:** `entrenamiento.js` - Botón `btnRevivirCampista`

#### 3.3. Revivir en Desafío del Día
- **ID:** `REWARDED_DESAFIO_DIA`
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
- `adsConfig.js` - Configuración de IDs de rewarded ads
- `admob.js` - Funciones `mostrarBonificado(adUnitId)`, `prepararBonificado(adUnitId)`, `clickRevivir(modo)`, y lógica de eventos
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
| `contadorPerdidasEntrenamiento` | Pérdidas en entrenamiento | 5 | Sí |
| `contadorGenerador` | Generaciones de tipos en el Generador | 7 | Sí |

### Constantes en adsConfig.js

```javascript
export const CONTADOR_PERDIDAS_ENTRENAMIENTO_KEY = 'contadorPerdidasEntrenamiento';
export const LIMITE_PERDIDAS_ENTRENAMIENTO = 5;
export const CONTADOR_GENERADOR_KEY = 'contadorGenerador';
export const LIMITE_GENERADOR = 7;
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
- `InicializarAdMob()` - Inicializa AdMob con protección contra inicialización doble, muestra banner, prepara intersticial y bonificado

### Banner
- `mostrarBanner(posicionBanner, tipoBanner)` - Muestra banner en posición especificada con tipo específico ('main' o 'generador')
- `ocultarBanner()` - Oculta el banner actual
- `cambarBanner(tipoBanner)` - Cambia entre banners sin duplicar visualizaciones

### Intersticial
- `prepararIntersticial(adUnitId)` - Prepara el anuncio intersticial con ID específico
- `mostrarIntersticial(adUnitId)` - Muestra el anuncio intersticial con ID específico

### Bonificado
- `prepararBonificado(adUnitId)` - Prepara el anuncio bonificado con ID específico
- `mostrarBonificado(adUnitId)` - Muestra el anuncio bonificado con ID específico
- `clickRevivir(modo)` - Maneja el flujo de revivir con anuncio bonificado, seleccionando el ID según el modo

### Contadores
- `incrementarContadorPerdidasEntrenamiento()` - Incrementa y verifica contador de pérdidas en entrenamiento
- `incrementarContadorGenerador()` - Incrementa y verifica contador de generaciones
- `verificarNivelEspecificoIntersticial(nivelId, liga)` - Verifica si el nivel es múltiplo de 4 y muestra intersticial

### Web Fallback
- `esPlataformaNativa()` - Verifica si la aplicación está en plataforma nativa
- `simularBanner()` - Simula banner en navegador (para desarrollo)
- `simularRewarded(callbackRecompensa)` - Simula anuncio bonificado en navegador
- `simularInterstitial(callbackCierre)` - Simula interstitial en navegador

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
- **IDs:** 2 (BANNER_MAIN para general, BANNER_GENERADOR para el Generador)

### Intersticial
- **Desafío del Día:** 1 por sesión (al finalizar) - ID: INTERSTITIAL_DESAFIO_DIA
- **Entrenamiento (pérdidas):** 1 cada 5 pérdidas - ID: INTERSTITIAL_ENTRENAMIENTO
- **Estudio (niveles específicos):** 1 al completar niveles múltiplos de 4 - ID: INTERSTITIAL_NIVELES
- **Generador:** 1 cada 7 generaciones - ID: INTERSTITIAL_GENERADOR

### Bonificado
- **Frecuencia:** Bajo demanda (usuario decide verlo)
- **Recompensas:** Vida general, revivir en entrenamiento, revivir en desafío
- **IDs:** 3 (REWARDED_VIDAS, REWARDED_ENTRENAMIENTO, REWARDED_DESAFIO_DIA)

---

## Notas de Implementación

1. **Persistencia:** Todos los contadores se guardan en localStorage para persistir entre sesiones
2. **Conexión a internet:** Los anuncios requieren conexión a internet para funcionar
3. **Testing:** Los IDs de anuncio están configurados para producción (`isTesting: false`)
4. **Consistencia:** El banner solo se oculta en modos de juego activos para no interrumpir la experiencia
5. **UX:** Los anuncios intersticiales se muestran en momentos naturales de transición (fin de nivel, selección, etc.)
6. **Múltiples IDs:** Se utilizan IDs específicos para diferentes contextos (banners, intersticiales, rewarded) para optimizar el rendimiento
7. **Protección contra duplicados:** La inicialización de AdMob tiene protección contra inicialización doble y listeners duplicados
8. **Web Fallback:** En entorno de desarrollo (npm run dev), los anuncios se simulan para permitir testing sin plataforma nativa
9. **Seguridad de recompensas:** El sistema de rewarded ads tiene protección contra doble entrega de recompensas
10. **Gestión de banners:** Solo un banner está activo a la vez, con función para cambiar entre tipos sin duplicar visualizaciones

---

## Última Actualización

**Fecha:** 30 de agosto de 2026
**Versión:** 2.2.6
**Cambios recientes:**
- Implementación de múltiples IDs de AdMob para optimizar el rendimiento:
  - 2 IDs de banners (BANNER_MAIN, BANNER_GENERADOR)
  - 4 IDs de intersticiales (DESAFIO_DIA, ENTRENAMIENTO, NIVELES, GENERADOR)
  - 3 IDs de rewarded ads (VIDAS, ENTRENAMIENTO, DESAFIO_DIA)
- Implementación de contador del generador (cada 7 generaciones)
- Implementación de web fallback para desarrollo (npm run dev)
- Implementación de protección contra inicialización doble y listeners duplicados
- Implementación de función `cambarBanner()` para cambiar entre banners sin duplicar
- Actualización de funciones de anuncios para aceptar parámetro `adUnitId` específico
- Migración de IDs de anuncios a archivo `adsConfig.js` centralizado
- Corrección de documentación: eliminación de contadores inexistentes (selección dificultad, repeticiones nivel)
- Actualización precisa de contadores existentes (pérdidas entrenamiento, generador)
