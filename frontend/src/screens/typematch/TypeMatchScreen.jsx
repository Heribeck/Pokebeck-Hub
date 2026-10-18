import { useState } from 'react';
import { typesIcons, typesColors, typeSpanish } from '../../features/poketype/data/pokemonTypes.js';
import { calculateEffectiveness } from '../../features/typematch/index.js';
import { types } from '../../shared/data/index.js';
import { NativeAd } from '../../shared/admob/native/index.js';

export default function TypeMatchScreen({ onNavigation }) {
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [activeTab, setActiveTab] = useState('defensivo');

  const results = selectedTypes.length > 0 ? calculateEffectiveness(selectedTypes, activeTab) : {
    superWeakness: [],
    weakness: [],
    neutral: [],
    resistant: [],
    superResistant: [],
    immune: []
  };

  const handleTypeClick = (type) => {
    const index = selectedTypes.indexOf(type);
    if (index !== -1) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else if (selectedTypes.length < 2) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes([selectedTypes[1], type]);
    }
  };

  const isTypeSelected = (type) => selectedTypes.includes(type);

  return (
    <section className="TypeMatchScreen">
      <header className="TypeMatchHeader">
        <h1 className="AppTitle">TypeMatch</h1>
        <p className="TypeMatchSubtitle">Calculadora de efectividad de tipos</p>
      </header>

      <div className="TypeMatchTypeCard">
        <div className="TypeMatchTypeGrid">
          {types.map((type) => (
            <button
              key={type}
              type="button"
              className={`TypeMatchTypeButton ${isTypeSelected(type) ? 'IsActive' : ''}`}
              onClick={() => handleTypeClick(type)}
              style={{ backgroundColor: isTypeSelected(type) ? typesColors[type] : '#1a1c23' }}
              aria-label={typeSpanish[type]}
              aria-pressed={isTypeSelected(type)}
            >
              <img
                className="TypeMatchTypeIcon"
                src={typesIcons[type]}
                alt={typeSpanish[type]}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="TypeMatchTabs">
        <button
          type="button"
          className={`TypeMatchTab ${activeTab === 'defensivo' ? 'IsActive' : ''}`}
          onClick={() => setActiveTab('defensivo')}
        >
          Defensivo
        </button>
        <button
          type="button"
          className={`TypeMatchTab ${activeTab === 'ofensivo' ? 'IsActive' : ''}`}
          onClick={() => setActiveTab('ofensivo')}
        >
          Ofensivo
        </button>
      </div>

      <div className="TypeMatchResults">
        {activeTab === 'ofensivo' && selectedTypes.length > 0 && (
          <p className="TypeMatchResultNote">
            Se muestra la mejor eficacia disponible usando un movimiento de uno de los tipos seleccionados.
          </p>
        )}
        {activeTab === 'defensivo' ? (
          <>
            {results.superWeakness.length > 0 && (
              <div className="TypeMatchCategory">
                <div className="TypeMatchCategoryHeader">
                  <h2 className="TypeMatchCategoryTitle TypeMatchCategorySuperWeakness">Super debilidad</h2>
                  <span className="TypeMatchCategoryMultiplier">4×</span>
                </div>
                <div className="TypeMatchCategoryList">
                  {results.superWeakness.map((item) => (
                    <span key={item.type} className="TypeMatchResultType" style={{ backgroundColor: typesColors[item.type] }}>
                      {typeSpanish[item.type]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.weakness.length > 0 && (
              <div className="TypeMatchCategory">
                <div className="TypeMatchCategoryHeader">
                  <h2 className="TypeMatchCategoryTitle TypeMatchCategoryWeakness">Debilidad</h2>
                  <span className="TypeMatchCategoryMultiplier">2×</span>
                </div>
                <div className="TypeMatchCategoryList">
                  {results.weakness.map((item) => (
                    <span key={item.type} className="TypeMatchResultType" style={{ backgroundColor: typesColors[item.type] }}>
                      {typeSpanish[item.type]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.superResistant.length > 0 && (
              <div className="TypeMatchCategory">
                <div className="TypeMatchCategoryHeader">
                  <h2 className="TypeMatchCategoryTitle TypeMatchCategorySuperResistant">Super resistencia</h2>
                  <span className="TypeMatchCategoryMultiplier">0.25×</span>
                </div>
                <div className="TypeMatchCategoryList">
                  {results.superResistant.map((item) => (
                    <span key={item.type} className="TypeMatchResultType" style={{ backgroundColor: typesColors[item.type] }}>
                      {typeSpanish[item.type]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.resistant.length > 0 && (
              <div className="TypeMatchCategory">
                <div className="TypeMatchCategoryHeader">
                  <h2 className="TypeMatchCategoryTitle TypeMatchCategoryResistant">Resistencia</h2>
                  <span className="TypeMatchCategoryMultiplier">0.5×</span>
                </div>
                <div className="TypeMatchCategoryList">
                  {results.resistant.map((item) => (
                    <span key={item.type} className="TypeMatchResultType" style={{ backgroundColor: typesColors[item.type] }}>
                      {typeSpanish[item.type]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.immune.length > 0 && (
              <div className="TypeMatchCategory">
                <div className="TypeMatchCategoryHeader">
                  <h2 className="TypeMatchCategoryTitle TypeMatchCategoryImmune">Inmunidad</h2>
                  <span className="TypeMatchCategoryMultiplier">0×</span>
                </div>
                <div className="TypeMatchCategoryList">
                  {results.immune.map((item) => (
                    <span key={item.type} className="TypeMatchResultType" style={{ backgroundColor: typesColors[item.type] }}>
                      {typeSpanish[item.type]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {results.weakness.length > 0 && (
              <div className="TypeMatchCategory">
                <div className="TypeMatchCategoryHeader">
                  <h2 className="TypeMatchCategoryTitle TypeMatchCategorySuperEffective">Súper efectivo</h2>
                  <span className="TypeMatchCategoryMultiplier">2×</span>
                </div>
                <div className="TypeMatchCategoryList">
                  {results.weakness.map((item) => (
                    <span key={item.type} className="TypeMatchResultType" style={{ backgroundColor: typesColors[item.type] }}>
                      {typeSpanish[item.type]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.resistant.length > 0 && (
              <div className="TypeMatchCategory">
                <div className="TypeMatchCategoryHeader">
                  <h2 className="TypeMatchCategoryTitle TypeMatchCategoryNotVeryEffective">Poco efectivo</h2>
                  <span className="TypeMatchCategoryMultiplier">0.5×</span>
                </div>
                <div className="TypeMatchCategoryList">
                  {results.resistant.map((item) => (
                    <span key={item.type} className="TypeMatchResultType" style={{ backgroundColor: typesColors[item.type] }}>
                      {typeSpanish[item.type]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {results.immune.length > 0 && (
              <div className="TypeMatchCategory">
                <div className="TypeMatchCategoryHeader">
                  <h2 className="TypeMatchCategoryTitle TypeMatchCategoryNoEffect">Sin efecto</h2>
                  <span className="TypeMatchCategoryMultiplier">0×</span>
                </div>
                <div className="TypeMatchCategoryList">
                  {results.immune.map((item) => (
                    <span key={item.type} className="TypeMatchResultType" style={{ backgroundColor: typesColors[item.type] }}>
                      {typeSpanish[item.type]}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <NativeAd placementId="typematch" size="large" />
    </section>
  );
}
