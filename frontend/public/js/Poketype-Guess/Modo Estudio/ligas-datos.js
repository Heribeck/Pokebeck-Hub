// Estructura de datos de las 3 Ligas de Maestría
// Cada liga tiene 7 micro-niveles/retos

export const datosLigas = {
  campista: {
    nombre: "Liga 1: Campista (La Base)",
    color: "#43a047",
    emoji: "🏆",
    descripcion: "Acostumbrar al jugador a asociar tipos puros y las duplas más comunes sin presión excesiva de tiempo.",
    niveles: [
      {
        id: "campista-1",
        titulo: "Monotipos Básicos",
        numero: 1,
        descripcion: "Aciertos rápidos con Pokémon de un solo tipo común (Fuego, Agua, Planta, Eléctrico).",
        especificaciones: "Tipos: Fuego, Agua, Planta, Eléctrico (monotipos). Sin presión de tiempo."
      },
      {
        id: "campista-2",
        titulo: "Duplas Comunes I",
        numero: 2,
        descripcion: "Combinaciones dobles muy habituales del día a día (ej. Normal/Volador).",
        especificaciones: "Tipos dobles frecuentes. Sin presión de tiempo."
      },
      {
        id: "campista-3",
        titulo: "Duplas Comunes II",
        numero: 3,
        descripcion: "Expansión de dobles tipos frecuentes en la naturaleza (ej. Agua/Tierra).",
        especificaciones: "Tipos dobles comunes. Sin presión de tiempo."
      },
      {
        id: "campista-4",
        titulo: "El Primer Filtro",
        numero: 4,
        descripcion: "Estreno de la regla de cero repetición (ningún Pokémon se repite en la misma sesión).",
        especificaciones: "Sistema de cero repetición activado. Tipos mixtos."
      },
      {
        id: "campista-5",
        titulo: "Duplas de Kanto/Johto",
        numero: 5,
        descripcion: "Restricción de tipos dobles enfocados exclusivamente en las primeras generaciones.",
        especificaciones: "Solo generaciones 1-2. Tipos dobles específicos."
      },
      {
        id: "campista-6",
        titulo: "Memoria de Campo",
        numero: 6,
        descripcion: "Mezcla aleatoria de tipos puros y dobles con el sistema de cero repetición activo.",
        especificaciones: "Tipos puros y dobles. Cero repetición activo."
      },
      {
        id: "campista-7",
        titulo: "Examen Campista (Jefe de Liga)",
        numero: 7,
        descripcion: "Ronda de 20 aciertos seguidos con tipos comunes para graduarse de la primera liga.",
        especificaciones: "20 aciertos consecutivos. Tipos comunes. Cero repetición."
      }
    ]
  },
  as: {
    nombre: "Liga 2: As (El Desafío Técnico)",
    color: "#fbc02d",
    emoji: "🌟",
    descripcion: "Elevar la dificultad combinando el cronómetro dinámico y filtros por regiones específicas.",
    niveles: [
      {
        id: "as-1",
        titulo: "Cronómetro Acelerado I",
        numero: 1,
        descripcion: "Introducción del temporizador dinámico que se vuelve más rápido cada 5 aciertos.",
        especificaciones: "Cronómetro dinámico. Velocidad aumenta cada 5 aciertos."
      },
      {
        id: "as-2",
        titulo: "Duplas Complejas",
        numero: 2,
        descripcion: "Tipos dobles menos obvios (ej. Acero/Psíquico, Fantasma/Veneno).",
        especificaciones: "Tipos dobles complejos. Cronómetro moderado."
      },
      {
        id: "as-3",
        titulo: "Filtro por Generación",
        numero: 3,
        descripcion: "Sesiones limitadas a regiones específicas de la Pokédex donde hay que rebuscar en la memoria.",
        especificaciones: "Filtro por generación específica. Cronómetro activo."
      },
      {
        id: "as-4",
        titulo: "Cronómetro Acelerado II",
        numero: 4,
        descripcion: "Mayor velocidad base del reloj con tipos dobles mixtos.",
        especificaciones: "Cronómetro más rápido. Tipos dobles mixtos."
      },
      {
        id: "as-5",
        titulo: "Tipos Raros Intermedios",
        numero: 5,
        descripcion: "Aparición de combinaciones con baja representación en las primeras generaciones.",
        especificaciones: "Tipos raros intermedios. Cronómetro acelerado."
      },
      {
        id: "as-6",
        titulo: "Resistencia Técnica",
        numero: 6,
        descripcion: "Cero repetición + cronómetro acelerado combinados.",
        especificaciones: "Cero repetición + cronómetro acelerado. Alta dificultad."
      },
      {
        id: "as-7",
        titulo: "Examen As (Jefe de Liga)",
        numero: 7,
        descripcion: "Ronda técnica avanzada bajo alta presión de tiempo para obtener el rango de As.",
        especificaciones: "Cronómetro al máximo. Tipos complejos. Cero repetición."
      }
    ]
  },
  campeon: {
    nombre: "Liga 3: Campeón (La Cima Absoluta)",
    color: "#d32f2f",
    emoji: "🔥",
    descripcion: "Demostrar conocimiento enciclopédico enfrentando las combinaciones más raras, escasas y rebuscadas de toda la historia de Pokémon.",
    niveles: [
      {
        id: "campeon-1",
        titulo: "Rarezas Elementales",
        numero: 1,
        descripcion: "Tipos con muy poca presencia combinada (ej. Hielo/Roca, Dragón/Siniestro).",
        especificaciones: "Tipos extremadamente raros. Cronómetro rápido."
      },
      {
        id: "campeon-2",
        titulo: "Especies Escasas (⚠️ Riesgo Crítico)",
        numero: 2,
        descripcion: "Duplas de tipos con poquísimos Pokémon posibles. Regla especial: Un error cuesta los 3 corazones de golpe.",
        especificaciones: "⚠️ Riesgo Crítico: Fallo = -3 corazones. Tipos escasos."
      },
      {
        id: "campeon-3",
        titulo: "Filtro Global Estricto",
        numero: 3,
        descripcion: "Selección de toda la Pokédex aplicando el sistema de cero repetición riguroso.",
        especificaciones: "Toda la Pokédex. Cero repetición riguroso."
      },
      {
        id: "campeon-4",
        titulo: "Presión Extrema I",
        numero: 4,
        descripcion: "Cronómetro rápido al límite con tipos duales complejos.",
        especificaciones: "Cronómetro extremo. Tipos duales complejos."
      },
      {
        id: "campeon-5",
        titulo: "Presión Extrema II (⚠️ Riesgo Crítico)",
        numero: 5,
        descripcion: "Filtros de generación cruzados con las combinaciones más escasas y penalización severa por fallo.",
        especificaciones: "⚠️ Riesgo Crítico. Filtros cruzados. Penalización severa."
      },
      {
        id: "campeon-6",
        titulo: "La Antesala del Maestro",
        numero: 6,
        descripcion: "Simulación de prueba final con condiciones combinadas (tiempo al máximo, cero repetición y tipos raros).",
        especificaciones: "Condiciones combinadas extremas. Preparación final."
      },
      {
        id: "campeon-7",
        titulo: "La Gran Prueba Final (Jefe Supremo)",
        numero: 7,
        descripcion: "La sesión definitiva sin ayudas, superando los filtros más estrictos de toda la cima.",
        especificaciones: "Sin ayudas. Filtros máximos. La prueba definitiva."
      }
    ]
  }
};
