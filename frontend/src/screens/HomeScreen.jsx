import { NativeAd } from '../shared/admob/native/index.js';

export default function HomeScreen({ onNavigation }) {
  return (
    <section className="HomeScreen">
      <header className="GlobalHeader HomeWelcome">
        <img src="/assets/icons/icon-512.webp" alt="" className="AppIcon" />
        <p className="HomeEyebrow">Tu aventura comienza aquí</p>
        <h1 className="AppTitle">Pokebeck Hub</h1>
        <p className="ScreenSubtitle">
          Descubre Pokémon, domina sus tipos y conviértete en un entrenador imparable.
        </p>
      </header>

      <NativeAd placementId="home" size="large" />

      <section className="HomeFeaturedGame" aria-labelledby="FeaturedGameTitle">
        <p className="HomeFeaturedEyebrow">Juego destacado</p>
        <h2 className="HomeFeaturedTitle" id="FeaturedGameTitle">PokeType Guess</h2>
        <p className="HomeFeaturedDescription">
          Pon a prueba tu conocimiento de los tipos Pokémon y descubre cuánto puedes aprender.
        </p>
        <button type="button" className="HomeFeaturedButton" onClick={() => onNavigation('poketype')}>
          Jugar ahora
        </button>
      </section>

      <nav aria-label="Explorar secciones" className="HomeCategoryLinks">
        <button type="button" className="HomeCategoryCard" onClick={() => onNavigation('games')}>
          <span className="HomeCategoryTitle">Juegos</span>
          <span className="HomeCategoryDescription">Encuentra tu próximo desafío.</span>
        </button>
        <button type="button" className="HomeCategoryCard" onClick={() => onNavigation('tools')}>
          <span className="HomeCategoryTitle">Herramientas</span>
          <span className="HomeCategoryDescription">Explora recursos para entrenadores.</span>
        </button>
      </nav>
    </section>
  );
}