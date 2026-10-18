import { showToast } from '../shared/toast/index.js';

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
    title: 'TypeMatch',
    description: 'Calcula la efectividad de tipos de Pokémon.',
    status: 'Disponible',
    screen: 'typematch',
  },
  {
    title: 'Generador de tipos',
    description: 'Descubre combinaciones de tipos y pon a prueba tus conocimientos.',
    status: 'Disponible',
    screen: 'generator',
  },
  {
    title: 'Team Builder',
    description: 'Crea equipos y descubre cómo se complementan sus integrantes.',
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
