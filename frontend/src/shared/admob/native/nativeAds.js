import { Capacitor, registerPlugin } from '@capacitor/core';

export const NativeAds = registerPlugin('NativeAds');

export function preloadNativeAds(adUnitId) {
  if (Capacitor.getPlatform() !== 'android') return;

  for (const size of ['large', 'compact']) {
    NativeAds.preloadNativeAd({ size, adUnitId }).catch((error) => {
      console.warn(`No se pudo precargar el anuncio nativo ${size}:`, error);
    });
  }
}
