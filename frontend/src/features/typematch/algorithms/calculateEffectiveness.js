import { typeEffectivenessTable } from '../data/typeEffectiveness.js';
import { types } from '../../../shared/data/index.js';

function getTypeIndex(type) {
  return types.indexOf(type);
}

function formatMultiplier(value) {
  if (value === 0) return '0×';
  if (value === 0.25) return '0.25×';
  if (value === 0.5) return '0.5×';
  if (value === 1) return '1×';
  if (value === 2) return '2×';
  if (value === 4) return '4×';
  return `${value}×`;
}

export function calculateEffectiveness(selectedTypes, mode) {
  if (selectedTypes.length === 0) {
    return {
      superWeakness: [],
      weakness: [],
      resistant: [],
      superResistant: [],
      immune: []
    };
  }

  const allTypes = types;
  const results = {};

  for (const targetType of allTypes) {
    let multiplier = 1;

    if (selectedTypes.length === 1) {
      const type = selectedTypes[0];
      if (mode === 'defensivo') {
        multiplier = typeEffectivenessTable[targetType][type];
      } else {
        multiplier = typeEffectivenessTable[type][targetType];
      }
    } else if (selectedTypes.length === 2) {
      const type1 = selectedTypes[0];
      const type2 = selectedTypes[1];

      if (mode === 'defensivo') {
        const mult1 = typeEffectivenessTable[targetType][type1];
        const mult2 = typeEffectivenessTable[targetType][type2];

        if (mult1 === 0 || mult2 === 0) {
          multiplier = 0;
        } else {
          multiplier = mult1 * mult2;
        }
      } else {
        const mult1 = typeEffectivenessTable[type1][targetType];
        const mult2 = typeEffectivenessTable[type2][targetType];
        multiplier = Math.max(mult1, mult2);
      }
    }

    results[targetType] = multiplier;
  }

  const superWeakness = [];
  const weakness = [];
  const resistant = [];
  const superResistant = [];
  const immune = [];

  for (const type of allTypes) {
    const multiplier = results[type];

    if (multiplier === 0) {
      immune.push({ type, multiplier: formatMultiplier(multiplier) });
    } else if (multiplier >= 4) {
      superWeakness.push({ type, multiplier: formatMultiplier(multiplier) });
    } else if (multiplier > 1) {
      weakness.push({ type, multiplier: formatMultiplier(multiplier) });
    } else if (multiplier <= 0.25) {
      superResistant.push({ type, multiplier: formatMultiplier(multiplier) });
    } else if (multiplier < 1) {
      resistant.push({ type, multiplier: formatMultiplier(multiplier) });
    }
  }

  superWeakness.sort((a, b) => {
    const multA = parseFloat(a.multiplier);
    const multB = parseFloat(b.multiplier);
    if (multA !== multB) {
      return multB - multA;
    }
    return getTypeIndex(a.type) - getTypeIndex(b.type);
  });

  weakness.sort((a, b) => {
    const multA = parseFloat(a.multiplier);
    const multB = parseFloat(b.multiplier);
    if (multA !== multB) {
      return multB - multA;
    }
    return getTypeIndex(a.type) - getTypeIndex(b.type);
  });

  superResistant.sort((a, b) => {
    const multA = parseFloat(a.multiplier);
    const multB = parseFloat(b.multiplier);
    if (multA !== multB) {
      return multA - multB;
    }
    return getTypeIndex(a.type) - getTypeIndex(b.type);
  });

  resistant.sort((a, b) => {
    const multA = parseFloat(a.multiplier);
    const multB = parseFloat(b.multiplier);
    if (multA !== multB) {
      return multA - multB;
    }
    return getTypeIndex(a.type) - getTypeIndex(b.type);
  });

  immune.sort((a, b) => {
    return getTypeIndex(a.type) - getTypeIndex(b.type);
  });

  return {
    superWeakness,
    weakness,
    resistant,
    superResistant,
    immune
  };
}
