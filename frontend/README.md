# Pokebeck Hub

**Versión Actual:** 2.2.4

---

## Índice

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Estado Actual](#estado-actual)
- [Distribución](#distribución)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Desarrollo con Vite](#desarrollo-con-vite)
- [Ejecución y Compilación Android con Capacitor](#ejecución-y-compilación-android-con-capacitor)
- [Funcionalidades](#funcionalidades)
- [Persistencia de Datos](#persistencia-de-datos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Arquitectura y Decisiones Técnicas](#arquitectura-y-decisiones-técnicas)
- [Scripts Disponibles](#scripts-disponibles)
- [Estado del Proyecto / Roadmap](#estado-del-proyecto--roadmap)
- [Permisos de Android](#permisos-de-android)
- [Limitaciones Conocidas](#limitaciones-conocidas)
- [Licencia](#licencia)
- [Repositorio](#repositorio)

---

## Descripción del Proyecto

Pokebeck Hub es una aplicación móvil Android que ofrece juegos educativos basados en el universo Pokémon. La aplicación permite a los usuarios entrenar sus conocimientos sobre tipos de Pokémon mediante diferentes modos de juego.

**Estado actual:** En desarrollo

---

## Distribución

### Google Play
- **Disponible en:** [Google Play Store](https://play.google.com/store/apps/details?id=com.heribeck.PokeTypeGuess)
- **Versión actual:** 2.2.4
- **ID de paquete:** com.heribeck.PokeTypeGuess

**Nota:** El repositorio originalmente se llamó "poketype-guess" porque la aplicación comenzó como "PokeTypeGuess". Posteriormente el proyecto evolucionó y cambió su nombre a "Pokebeck Hub", aunque el ID del paquete en Google Play mantiene el nombre original por compatibilidad.

---

## Tecnologías Utilizadas

### Build Tool y Servidor de Desarrollo
- **Vite** v8.2.2 - Herramienta de build y servidor de desarrollo

### Capacitor
- **@capacitor/core** v8.0.0 - Core de Capacitor
- **@capacitor/android** v8.0.0 - Plataforma Android
- **@capacitor/cli** v8.0.0 - CLI de Capacitor
- **@capacitor/assets** v3.0.5 - Gestión de assets

### Plugins de Capacitor
- **@capacitor/app** v8.0.0 - Información de la aplicación
- **@capacitor/preferences** v8.0.1 - Almacenamiento persistente
- **@capacitor/local-notifications** v8.2.1 - Notificaciones locales
- **@capacitor/push-notifications** v8.1.2 - Notificaciones push (FCM)
- **@capacitor-community/admob** v8.0.0 - Anuncios de Google AdMob

### Servicios de Firebase
- **Firebase Analytics** - Análisis de uso de la aplicación
- **Firebase Cloud Messaging (FCM)** - Servicio para recepción de notificaciones push

### Lenguaje
- JavaScript (ES6+)

### Librerías Externas (CDN)
- **Font Awesome** v6.4.0 - Iconos
- **Tom Select** v2.2.2 - Componente de selección

---

## Requisitos Previos

- **Node.js** - Versión recomendada: 18.x o superior
- **npm** - Gestor de paquetes de Node.js
- **Android Studio** - Para desarrollo y compilación Android
- **SDK Android** - Configurado en Android Studio

---

## Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Heribeck/poketype-guess.git
   cd poketype-guess/frontend
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configuración inicial:**
   - Firebase ya está configurado en `src/js/firebase-config.js` (apiKey, authDomain, projectId, etc. - valores públicos de Firebase Web)
   - AdMob ya está configurado en `src/js/Poketype-Guess/config.js` y `android/app/src/main/AndroidManifest.xml`

---

## Desarrollo con Vite

### Ejecutar en navegador (entorno de desarrollo)
```bash
npm run dev
```

Vite permite ejecutar el frontend en el navegador como entorno de desarrollo, facilitando la depuración y desarrollo rápido. La plataforma objetivo actual es Android, pero muchas funcionalidades pueden probarse en el navegador.

### Compilar para producción
```bash
npm run build
```

Este comando genera la carpeta `dist/` con los archivos optimizados para producción.

### Previsualizar compilación de producción
```bash
npm run preview
```

---

## Ejecución y Compilación Android con Capacitor

### Sincronizar cambios con Capacitor
```bash
npx cap sync android
```

Este comando sincroniza los cambios del código web (carpeta `dist/`) con el proyecto Android nativo.

### Abrir Android Studio
```bash
npx cap open android
```

### Ejecutar la aplicación
Desde Android Studio:
1. Selecciona el dispositivo/emulador deseado
2. Presiona el botón "Run" o usa `Shift + F10`

### Generar APK/AAB
Desde Android Studio:
1. Build > Generate Signed Bundle / APK
2. Selecciona APK o AAB
3. Configura la firma con tu keystore
4. Genera el archivo

---

## Funcionalidades

### Implementadas
- Sistema de almacenamiento persistente con Capacitor Preferences
- Sistema de notificaciones locales
- Integración con Firebase Analytics
- Integración con Firebase Cloud Messaging (FCM) para notificaciones push
- Integración con Google AdMob (banners, intersticiales, bonificados)
- Sistema de HX (Hexium) - Moneda del juego
- Sistema de vidas con regeneración
- Modo de juego Type Guess (adivinar Pokémon por sus tipos)
- Modo de juego Desafío del Día
- Modo de juego Estudio (Ligas y Niveles)
- Modo de juego Entrenamiento (Campista)
- Sistema de desbloqueos progresivos por HX
- Generador de tipos

### En desarrollo
- Completar implementación de todos los juegos documentados en la documentación del proyecto
- Sistema de estadísticas y récords
- Optimización de rendimiento
- Herramientas adicionales (Pokédex, Team Builder, Type Coverage Calculator)

---

## Persistencia de Datos

No existe backend ni base de datos externa. Toda la información se guarda localmente en el dispositivo.

### Tecnologías de almacenamiento
- **Capacitor Preferences** - Almacenamiento persistente nativo (principal en Android)
- **localStorage** - Fallback para navegadores durante el desarrollo

### Información guardada localmente
- Progreso del jugador en diferentes modos de juego
- Sistema de HX (Hexium)
- Sistema de vidas y regeneración
- Niveles completados en modo Estudio
- Configuraciones y preferencias del usuario
- Contadores para control de anuncios intersticiales

---

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── css/              # Estilos de la aplicación
│   │   ├── components/   # Componentes CSS
│   │   ├── views/        # Estilos específicos de vistas
│   │   └── ...
│   └── js/
│       ├── Poketype-Guess/  # Lógica principal de juegos
│       │   ├── Desafio del Dia/     # Lógica del modo Desafío
│       │   ├── Modo-Estudio/        # Lógica del modo Estudio
│       │   ├── Modo Entrenamiento/  # Lógica del modo Entrenamiento
│       │   ├── Generador/           # Lógica del generador de tipos
│       │   ├── config.js            # Configuración del juego y AdMob
│       │   ├── hx-storage.js        # Almacenamiento de HX
│       │   ├── notificaciones-locales.js  # Notificaciones locales
│       │   ├── vidasGeneralesStorage.js   # Almacenamiento de vidas
│       │   ├── utils.js             # Utilidades y wrapper de plugins
│       │   ├── sistema-desbloqueos.js    # Sistema de desbloqueos
│       │   └── ...
│       ├── admob.js          # Gestión de anuncios AdMob
│       ├── eventosMain.js    # Eventos principales de la app
│       ├── firebase-config.js # Configuración de Firebase
│       ├── main.js           # Punto de entrada
│       ├── celebracion.js    # Animaciones de celebración
│       └── victoria.js       # Pantalla de victoria
├── public/
│   ├── assets/          # Assets estáticos (imágenes, sonidos, datos)
│   │   ├── data/        # Archivos de datos (pokedex.json)
│   │   ├── img/         # Imágenes
│   │   └── sonidos/     # Archivos de audio
│   └── manifest.json    # Manifest de la aplicación
├── android/             # Proyecto Android nativo (generado por Capacitor)
├── index.html           # HTML principal
├── capacitor.config.json  # Configuración de Capacitor
├── capacitor-assets.config.json  # Configuración de assets
├── package.json         # Dependencias y scripts
└── package-lock.json    # Lock file de dependencias
```

---

## Configuración

El proyecto utiliza archivos de configuración en lugar de variables de entorno.

### Archivos de configuración principales

#### `capacitor.config.json`
Configuración de Capacitor:
- `appId`: com.heribeck.poketype
- `appName`: Poketype-Guess
- `webDir`: dist
- Plugins: LocalNotifications configurado para mostrar en foreground

#### `src/js/firebase-config.js`
Configuración de Firebase Web:
- apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId
- Inicializa Firebase Analytics
- **Nota:** Estos valores son públicos por diseño de Firebase y no representan un riesgo de seguridad.

#### `src/js/Poketype-Guess/config.js`
Configuración del juego:
- IDs de AdMob (Banner, Intersticial, Bonificado)
- Configuración de tipos de Pokémon
- Elementos DOM agrupados
- Estado del juego (gameState, timeState, adState, scoreState)
- Archivos de audio y música

#### `android/app/src/main/AndroidManifest.xml`
Configuración Android:
- ID de aplicación de AdMob
- Configuración de Firebase Messaging
- Permisos de la aplicación

### Archivos que NO deben incluirse en el repositorio
- Keystores de Android (*.jks, *.keystore)
- Claves privadas
- Credenciales sensibles
- Archivos de configuración con secretos reales

---

## Arquitectura y Decisiones Técnicas

### Por qué Capacitor
- Permite desarrollar la interfaz utilizando tecnologías web y empaquetarla como aplicación Android
- Proporciona acceso a APIs nativas del dispositivo mediante plugins
- Facilita el desarrollo y despliegue en múltiples plataformas

### Por qué almacenamiento local
- No requiere servidor ni backend
- Reduce costos de infraestructura
- Permite que las funcionalidades basadas en datos locales continúen funcionando sin conexión a internet
- Los datos permanecen en el dispositivo del usuario

### Por qué no existe backend actualmente
- Fase inicial del proyecto enfocada en funcionalidad core
- Reducción de complejidad y costos
- Los datos del juego no requieren sincronización entre dispositivos en esta etapa

### Wrapper de plugins seguros
El proyecto implementa un wrapper `ejecutarPluginSeguro` en `src/js/Poketype-Guess/utils.js` que:
- Verifica disponibilidad del plugin con `Capacitor.isPluginAvailable()`
- Ejecuta la función del plugin nativo
- Proporciona fallback a localStorage cuando el plugin no está disponible
- Maneja errores de forma centralizada

---

## Scripts Disponibles

```bash
npm run dev          # Inicia servidor de desarrollo con Vite
npm run build        # Compila la aplicación para producción (carpeta dist/)
npm run preview      # Previsualiza la compilación de producción
```

---

## Estado del Proyecto / Roadmap

### Terminado
- Estructura base de la aplicación
- Sistema de almacenamiento persistente con Capacitor Preferences
- Integración con Capacitor y plugins principales
- Sistema de anuncios AdMob (banners, intersticiales, bonificados)
- Integración con Firebase Analytics y FCM
- Sistema de HX (Hexium)
- Sistema de vidas con regeneración
- Modos de juego: Type Guess, Desafío del Día, Estudio, Entrenamiento
- Sistema de desbloqueos progresivos
- Generador de tipos

### En desarrollo
- Completar implementación de juegos documentados (Adivina Habilidad, Impostor, ¿Quién soy?, Trivia General, Who's That Pokémon?)
- Herramientas: Pokédex, Team Builder, Type Coverage Calculator
- Sistema de estadísticas y récords
- Optimización de rendimiento y UX

### Planeado
- Sincronización de datos entre dispositivos (opcional)
- Más juegos y herramientas
- Mejoras en el sistema de notificaciones
- Versión iOS

---

## Permisos de Android

La aplicación requiere los siguientes permisos declarados en `android/app/src/main/AndroidManifest.xml`:

- **INTERNET** - Necesario para cargar anuncios de AdMob, Firebase Analytics y notificaciones push
- **VIBRATE** - Para feedback háptico en ciertas interacciones del juego
- **com.google.android.gms.permission.AD_ID** - Requerido por AdMob para mostrar anuncios personalizados
- **POST_NOTIFICATIONS** - Para mostrar notificaciones locales y push
- **SCHEDULE_EXACT_ALARM** - Para programar alarmas exactas para notificaciones locales

---

## Limitaciones Conocidas

- Datos almacenados únicamente en el dispositivo del usuario
- Sin sincronización entre dispositivos
- Pérdida de datos si el usuario desinstala la aplicación
- Dependencia de conexión a internet para: anuncios de AdMob, Firebase Analytics, notificaciones push FCM
- Solo disponible para Android (iOS planeado para futuro)
- Las funcionalidades basadas en datos locales pueden funcionar sin conexión, pero las que dependen de servicios externos no

---

## Licencia

ISC

---

## Repositorio

https://github.com/Heribeck/poketype-guess
