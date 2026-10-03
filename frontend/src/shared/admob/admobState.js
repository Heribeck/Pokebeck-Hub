export const adState = {
  //===Estado del AdMob===//
  inicializado: false,
  listenersRegistrados: false,

  //===Estado del Intersticial===//
  intersticialCargado: false,
  intersticialPreparadoId: null,

  //===Estado del Bonificado===//
  bonificadoCargado: false,
  bonificadoPreparadoId: null,
  preparandoBonificado: false,
  resolverCargaBonificado: null,
  promesaCargaBonificado: null,
  timeoutCargaBonificado: null,

  //===Estado del Modo Revivir===//
  modoRevivirActivo: null,
  recompensaGanada: false,
  onRewardEarned: null
};

export function setInicializado(value) {
  adState.inicializado = value;
}

export function setListenersRegistrados(value) {
  adState.listenersRegistrados = value;
}

export function setResolverCargaBonificado(value) {
  adState.resolverCargaBonificado = value;
}

export function setPromesaCargaBonificado(value) {
  adState.promesaCargaBonificado = value;
}

export function setTimeoutCargaBonificado(value) {
  adState.timeoutCargaBonificado = value;
}