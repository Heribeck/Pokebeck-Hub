# Pokebeck Hub

Aplicación móvil de juegos y herramientas educativas sobre Pokémon. El proyecto utiliza React y Vite para la interfaz, y Capacitor para integrarla con Android.

## Índice

- [Descripción del proyecto](#descripción-del-proyecto)
- [Estado actual](#estado-actual)
- [Distribución e identificadores](#distribución-e-identificadores)
- [Tecnologías utilizadas](#tecnologías-utilizadas)
- [Requisitos previos](#requisitos-previos)
- [Instalación](#instalación)
- [Desarrollo con Vite](#desarrollo-con-vite)
- [Ejecución y compilación Android con Capacitor](#ejecución-y-compilación-android-con-capacitor)
- [Funcionalidades disponibles](#funcionalidades-disponibles)
- [Persistencia de datos](#persistencia-de-datos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Arquitectura y decisiones técnicas](#arquitectura-y-decisiones-técnicas)
- [Scripts disponibles](#scripts-disponibles)
- [Estado del proyecto y próximos pasos](#estado-del-proyecto-y-próximos-pasos)
- [Permisos de Android](#permisos-de-android)
- [Limitaciones conocidas](#limitaciones-conocidas)
- [Licencia](#licencia)
- [Repositorio](#repositorio)

## Descripción del proyecto

Pokebeck Hub reúne el juego PokeType Guess y herramientas para aprender y practicar los tipos Pokémon. La aplicación tiene navegación propia entre Inicio, Juegos, Herramientas, Perfil e Información.

La interfaz está implementada con React y se empaqueta para Android mediante Capacitor. Vite también permite ejecutar la aplicación en un navegador durante el desarrollo; las funciones que requieren plugins nativos deben probarse en Android.

## Estado actual

- La aplicación principal, las pantallas de navegación y el catálogo están implementados.
- PokeType Guess ofrece los modos Estudio, Entrenamiento y Desafío del Día.
- El Generador de tipos está disponible desde las secciones Herramientas y PokeType.
- Pokédex, Team Builder y Type Coverage Calculator aparecen en el catálogo como funciones próximas; aún no están disponibles.
- El perfil muestra HX y racha diaria. Favoritos, historial, logros, ranking y copia de seguridad se presentan como funciones próximas.
- El progreso se guarda localmente. No hay un backend ni sincronización entre dispositivos.

## Distribución e identificadores

Android es la plataforma móvil configurada actualmente. La aplicación está publicada en [Google Play](https://play.google.com/store/apps/details?id=com.heribeck.PokeTypeGuess).

La configuración nativa de [build.gradle](./frontend/android/app/build.gradle) declara el identificador `com.heribeck.PokeTypeGuess`, `versionCode` 12 y `versionName` 2.2.7. El [capacitor.config.json](./frontend/capacitor.config.json), en cambio, declara `appId` `com.heribeck.poketype`. Estos identificadores no coinciden y deben revisarse antes de futuras sincronizaciones o publicaciones. La pantalla de perfil muestra 2.3.7, distinto del `versionName` Android.

## Tecnologías utilizadas

- **JavaScript** (ES modules), **React 19** y **React DOM 19** para la aplicación.
- **Vite 8** para el servidor de desarrollo y la compilación web.
- **Capacitor 8** para el contenedor nativo Android.
- Plugins de Capacitor para la aplicación, preferencias, notificaciones locales y anuncios.
- **Google AdMob** para anuncios nativos, bonificados e intersticiales.
- **Font Awesome** y **Tom Select** se cargan desde CDN en `frontend/index.html`.

El proyecto también conserva dependencias de Firebase y notificaciones push, pero no inicializa Firebase Analytics ni registra notificaciones push desde el arranque actual de la aplicación.

## Requisitos previos

- Node.js compatible con la versión de Vite del proyecto.
- npm.
- Android Studio y Android SDK para compilar o ejecutar la aplicación Android.
- Un dispositivo o emulador Android para validar el comportamiento de los plugins nativos.

## Instalación

```bash
git clone https://github.com/Heribeck/poketype-guess.git
cd poketype-guess/frontend
npm install
```

## Desarrollo con Vite

Desde `frontend/`, inicia el servidor de desarrollo:

```bash
npm run dev
```

Para crear una compilación web optimizada:

```bash
npm run build
```

Vite genera la salida en `frontend/dist/`. Para servir esa compilación localmente:

```bash
npm run preview
```

## Ejecución y compilación Android con Capacitor

Después de compilar la aplicación web, sincroniza los archivos con el proyecto Android:

```bash
npm run build
npx cap sync android
npx cap open android
```

Desde Android Studio se puede ejecutar en un dispositivo o emulador y generar un APK o AAB firmado. La firma de release requiere una configuración local de keystore; no se deben guardar keystores ni contraseñas en el repositorio.

## Funcionalidades disponibles

### PokeType Guess

- **Estudio:** ligas Campista, As y Campeón, con niveles, progreso guardado y recompensas HX.
- **Entrenamiento:** dificultades Fácil, Normal y Difícil, con desbloqueos por progreso y récords guardados.
- **Desafío del Día:** reto diario con intentos y progreso persistentes.
- **Generador:** genera combinaciones de tipos Pokémon.

### Sistemas de la aplicación

- **Vidas:** hasta tres vidas, con regeneración de una vida por hora y opción de recuperar una mediante un anuncio bonificado.
- **HX:** moneda de progreso usada por el juego.
- **Racha diaria:** progreso de actividad consecutiva.
- **Anuncios:** formatos nativo, bonificado e intersticial integrados con AdMob.
- **Notificaciones locales:** permiso y programación de notificaciones, incluida la notificación de vidas completas.
- **Audio:** música y efectos de sonido de la aplicación y los modos.

## Persistencia de datos

El proyecto no tiene backend. El progreso y las preferencias se guardan en el dispositivo usando Capacitor Preferences. Esto incluye, entre otros datos, HX, racha, vidas, niveles de Estudio, progreso del Desafío del Día y récords de Entrenamiento.

Los datos estáticos del juego, la Pokédex y los recursos visuales y de audio se distribuyen en `frontend/public/assets/`. Desinstalar la aplicación puede eliminar el progreso local; actualmente no hay sincronización ni copia de seguridad entre dispositivos.

## Estructura del proyecto

El código de la aplicación vive en `frontend/`. La lógica de negocio de PokeType se organiza bajo `src/features/poketype/`; las pantallas React la conectan con la interfaz.

```text
frontend/
├── public/
│   └── assets/
│       ├── data/
│       ├── icons/
│       ├── img/
│       └── sonidos/
├── src/
│   ├── app.jsx
│   ├── config/
│   ├── home/
│   ├── features/poketype/
│   │   ├── data/
│   │   ├── modes/
│   │   │   ├── daily-challenge/
│   │   │   ├── generator/
│   │   │   ├── study/
│   │   │   └── training/
│   │   ├── state/
│   │   ├── storage/
│   │   └── systems/
│   ├── screens/
│   ├── components/
│   ├── shared/
│   └── styles/
├── android/
├── index.html
├── capacitor.config.json
├── vite.config.js
└── package.json
```

- `src/app.jsx` monta React y conecta la navegación de la aplicación.
- `src/screens/` contiene las pantallas principales y las pantallas específicas de PokeType.
- `src/features/` contiene las reglas, los datos y la persistencia propios de las funcionalidades.
- `src/home/` contiene el arranque, el estado global y sistemas como HX y racha.
- `src/shared/` contiene servicios reutilizables, incluidos AdMob, audio, notificaciones, almacenamiento y utilidades.
- `src/styles/` contiene los estilos de la aplicación.
- `public/assets/` contiene los recursos que se cargan como archivos estáticos.
- `android/` contiene el proyecto nativo generado y mantenido por Capacitor.

## Configuración

- `frontend/capacitor.config.json`: nombre de la aplicación, identificador de Capacitor y directorio de build.
- `frontend/src/config/admob.js`: identificadores de unidades de anuncios de AdMob.
- `frontend/src/features/poketype/`: configuración interna de cada modo, como niveles intersticiales y parámetros de juego.
- `frontend/src/shared/storage/preferencesKeys.js`: claves usadas para guardar datos con Capacitor Preferences.
- `frontend/android/app/src/main/AndroidManifest.xml`: permisos y metadatos nativos de Android.

No se requieren archivos `.env` para ejecutar el proyecto según la configuración actual. No agregues al repositorio keystores, contraseñas ni credenciales privadas.

## Arquitectura y decisiones técnicas

- La aplicación usa React con navegación basada en el estado de pantalla definido en `src/app.jsx`.
- Vite sirve la aplicación durante el desarrollo y crea la compilación web que Capacitor sincroniza con Android.
- Las pantallas y componentes de interfaz consumen la lógica organizada en `features/`; las integraciones reutilizables se encuentran en `shared/`.
- La persistencia del usuario es local y usa Capacitor Preferences. Los datos estáticos se sirven desde `public/assets/`.
- AdMob y las notificaciones locales dependen de plugins nativos y de los permisos correspondientes. Su disponibilidad puede variar en navegador.
- No se debe considerar Firebase Analytics o FCM como una integración activa del arranque actual: aunque quedan dependencias y archivos relacionados, la inicialización no está conectada en el flujo de inicio.

## Scripts disponibles

Ejecuta estos comandos desde `frontend/`:

```bash
npm run dev      # Inicia Vite en modo desarrollo
npm run build    # Compila la aplicación en frontend/dist/
npm run preview  # Previsualiza la compilación
```

## Estado del proyecto y próximos pasos

El núcleo de PokeType Guess, la navegación principal, el almacenamiento local y las integraciones actuales de AdMob y notificaciones locales están implementados.

El catálogo y el perfil indican las funciones que aún no están disponibles, como Pokédex independiente, Team Builder, cobertura de tipos, favoritos, estadísticas detalladas, logros, ranking y copia de seguridad. La sincronización de progreso entre dispositivos tampoco está implementada.

## Permisos de Android

El manifiesto Android declara los siguientes permisos:

- `INTERNET`: acceso de red, necesario para servicios como AdMob.
- `VIBRATE`: vibración.
- `com.google.android.gms.permission.AD_ID`: acceso al identificador publicitario.
- `POST_NOTIFICATIONS`: notificaciones.
- `SCHEDULE_EXACT_ALARM`: programación de alarmas exactas para notificaciones.

La disponibilidad y el efecto de cada permiso dependen de la versión de Android y de la autorización concedida por el usuario.

## Limitaciones conocidas

- El progreso se almacena en el dispositivo y no se sincroniza con una cuenta ni con otros dispositivos.
- La desinstalación puede eliminar los datos locales.
- Los anuncios requieren conectividad y disponibilidad del servicio AdMob.
- Los plugins nativos y los permisos de Android no se comportan necesariamente igual en el navegador.
- Algunas opciones del catálogo y del perfil están marcadas como próximas y todavía no tienen funcionalidad.
- El `appId` de Capacitor no coincide con el `applicationId` nativo de Android; revisar esa diferencia antes de una sincronización o publicación.

## Licencia

ISC.

## Repositorio

[Heribeck/poketype-guess](https://github.com/Heribeck/poketype-guess)
