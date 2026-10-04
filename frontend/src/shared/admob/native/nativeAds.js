import { Capacitor, registerPlugin } from '@capacitor/core';
import { ADS_CONFIG } from '../../../config/index.js';
import { initAdMob } from '../admobInit.js';

export const NativeAds = registerPlugin('NativeAds');

const pendingPreloads = new Map();
let startupNativeAdPreload = null;

function preloadNativeAd(size) {
  if (Capacitor.getPlatform() !== 'android') return Promise.resolve(false);

  const existingPreload = pendingPreloads.get(size);
  if (existingPreload) return existingPreload;

  const preloadPromise = NativeAds.preloadNativeAd({
    size,
    adUnitId: ADS_CONFIG.NATIVE_AD,
  })
    .then(() => true)
    .catch((error) => {
      console.warn(`No se pudo precargar el anuncio nativo ${size}:`, error);
      return false;
    })
    .finally(() => {
      if (pendingPreloads.get(size) === preloadPromise) {
        pendingPreloads.delete(size);
      }
    });

  pendingPreloads.set(size, preloadPromise);
  return preloadPromise;
}

export function waitForNativeAdPreload(size) {
  if (size === 'large' && startupNativeAdPreload) {
    return startupNativeAdPreload;
  }

  return pendingPreloads.get(size) ?? Promise.resolve(true);
}

export function preloadNativeAds() {
  if (startupNativeAdPreload) return startupNativeAdPreload;

  startupNativeAdPreload = (async () => {
    await initAdMob();
    if (Capacitor.getPlatform() !== 'android') return false;
    return preloadNativeAd('large');
  })().catch((error) => {
    console.error('No se pudo inicializar la precarga nativa:', error);
    return false;
  });

  startupNativeAdPreload.then(() => {
    if (Capacitor.getPlatform() === 'android') {
      return preloadNativeAd('compact');
    }
  });
  return startupNativeAdPreload;
}
