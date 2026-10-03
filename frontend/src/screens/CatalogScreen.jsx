import { showToast } from '../shared/toast/index.js';
import { NativeAd } from '../shared/admob/native/index.js';

const gameItems = [
  {
    title: 'PokeType Guess',
    description: 'Explora Estudio, Entrenamiento y Desafío del Día.',
    status: 'Disponible',
    screen: 'poketype',
  },
];

const toolItems = [
  {
    title: 'Generador de tipos',
    description: 'Descubre combinaciones de tipos y pon a prueba tus conocimientos.',
    status: 'Disponible',
    screen: 'generator',
  },
  {
    title: 'Pokédex',
    description: 'Consulta datos, características y relaciones entre Pokémon.',
    status: 'Próximamente',
  },
  {
    title: 'Team Builder',
    description: 'Crea equipos y descubre cómo se complementan sus integrantes.',
    status: 'Próximamente',
  },
  {
    title: 'Type Coverage Calculator',
    description: 'Analiza la cobertura de tipos de tu equipo.',
    status: 'Próximamente',
  },
];

export default function CatalogScreen({ section, onNavigation }) {
  const isTools = section === 'tools';
  const items = isTools ? toolItems : gameItems;
  const title = isTools ? 'Herramientas' : 'Juegos';

  function handleItemSelection(item) {
    if (item.screen) {
      onNavigation(item.screen);
      return;
    }

    showToast('Disponible en próximas actualizaciones.');
  }

  return (
    <section className="CatalogScreen">
      <header className="CatalogHeader">
        <p className="CatalogEyebrow">Pokebeck Hub</p>
        <h1 className="AppTitle CatalogTitle">{title}</h1>
        <p className="CatalogDescription">
          {isTools
            ? 'Recursos para explorar, aprender y preparar tu próxima estrategia.'
            : 'Elige una aventura y demuestra lo que sabes del mundo Pokémon.'}
        </p>
      </header>

      <NativeAd
        key={section}
        placementId={`catalog-${section}`}
        size="compact"
      />

      <div className="CatalogCardList">
        {items.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => handleItemSelection(item)}
            className={`CatalogCard ${item.screen ? '' : 'CatalogCardUpcoming'}`}
          >
            <span className="CatalogCardTitle">{item.title}</span>
            <span className="CatalogCardDescription">{item.description}</span>
            <span className="CatalogCardStatus">{item.status}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
