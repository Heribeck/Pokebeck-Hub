import { Capacitor, registerPlugin } from '@capacitor/core';
import { ADS_CONFIG } from '../../../config/index.js';

export const NativeAds = registerPlugin('NativeAds');

export function preloadNativeAds() {
  if (Capacitor.getPlatform() !== 'android') return;

  for (const size of ['large', 'compact']) {
    NativeAds.preloadNativeAd({ size, adUnitId: ADS_CONFIG.NATIVE_AD }).catch((error) => {
      console.warn(`No se pudo precargar el anuncio nativo ${size}:`, error);
    });
  }
}
