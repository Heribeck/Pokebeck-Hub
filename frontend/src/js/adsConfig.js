// Configuración de IDs de AdMob
export const ADS_CONFIG = {
  // Banners
  BANNER_MAIN: "ca-app-pub-1898586331132450/5546962412",
  BANNER_GENERADOR: "ca-app-pub-1898586331132450/9079259103",

  // Rewarded Ads
  REWARDED_VIDAS: "ca-app-pub-1898586331132450/8031266354",
  REWARDED_ENTRENAMIENTO: "ca-app-pub-1898586331132450/8142843731",
  REWARDED_DESAFIO_DIA: "ca-app-pub-1898586331132450/1315379800",

  // Interstitial Ads
  INTERSTITIAL_DESAFIO_DIA: "ca-app-pub-1898586331132450/4178291414",
  INTERSTITIAL_ENTRENAMIENTO: "ca-app-pub-1898586331132450/9813756274",
  INTERSTITIAL_NIVELES: "ca-app-pub-1898586331132450/6996021243",
  INTERSTITIAL_GENERADOR: "ca-app-pub-1898586331132450/7626576636",
};

//Eventos de los anuncios Bonificado
export const eventosBonificado = {
  cargado: "onRewardedVideoAdLoaded",
  falloCarga: "onRewardedVideoAdFailedToLoad",
  recompensa: "onRewardedVideoAdReward",
  cerrado: "onRewardedVideoAdDismissed",
};

//Constantes para contadores de anuncios intersticiales
export const CONTADOR_PERDIDAS_ENTRENAMIENTO_KEY = 'contadorPerdidasEntrenamiento';
export const LIMITE_PERDIDAS_ENTRENAMIENTO = 5;
export const CONTADOR_GENERADOR_KEY = 'contadorGenerador';
export const LIMITE_GENERADOR = 7;
