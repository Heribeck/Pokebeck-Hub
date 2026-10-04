import { useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { ADS_CONFIG } from '../../../config/index.js';
import { NativeAds, waitForNativeAdPreload } from './nativeAds.js';

const supportsNativeAds = Capacitor.getPlatform() === 'android';

export default function NativeAd({ placementId, size = 'compact', suspended = false }) {
  const slotRef = useRef(null);
  const loadedRef = useRef(false);
  const suspendedRef = useRef(suspended);
  const [available, setAvailable] = useState(true);
  suspendedRef.current = suspended;

  useEffect(() => {
    if (!supportsNativeAds) return undefined;

    let disposed = false;
    let positionFrame = 0;

    const getPosition = () => {
      const bounds = slotRef.current?.getBoundingClientRect();
      if (!bounds || bounds.width <= 0 || bounds.height <= 0) return null;

      return {
        x: bounds.left,
        y: bounds.top,
        width: bounds.width,
        height: bounds.height,
      };
    };

    const updatePosition = () => {
      if (!loadedRef.current || suspended) return;
      const position = getPosition();
      if (!position) return;

      NativeAds.updateNativeAdPosition({ slotId: placementId, ...position }).catch((error) => {
        if (!disposed) {
          console.error('No se pudo actualizar la posición del anuncio nativo:', error);
        }
      });
    };

    const initialPosition = getPosition();
    if (!initialPosition) {
      setAvailable(false);
      return undefined;
    }

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('orientationchange', updatePosition);
    window.visualViewport?.addEventListener('resize', updatePosition);
    window.visualViewport?.addEventListener('scroll', updatePosition);

    const showAd = async () => {
      await waitForNativeAdPreload(size);
      if (disposed) return;

      const position = getPosition();
      if (!position) {
        setAvailable(false);
        return;
      }

      await NativeAds.showNativeAd({
        slotId: placementId,
        size,
        adUnitId: ADS_CONFIG.NATIVE_AD,
        ...position,
      });

      if (disposed) {
        return NativeAds.hideNativeAd({ slotId: placementId });
      }

      loadedRef.current = true;
      NativeAds.preloadNativeAd({ size, adUnitId: ADS_CONFIG.NATIVE_AD }).catch((error) => {
        console.warn(`No se pudo reponer el anuncio nativo ${size}:`, error);
      });
      if (suspendedRef.current) {
        return NativeAds.setNativeAdVisibility({ slotId: placementId, visible: false });
      }
      positionFrame = window.requestAnimationFrame(updatePosition);
    };

    showAd().catch((error) => {
      if (!disposed) {
        console.warn('No se pudo mostrar el anuncio nativo:', error);
        setAvailable(false);
      }
    });

    return () => {
      disposed = true;
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('orientationchange', updatePosition);
      window.visualViewport?.removeEventListener('resize', updatePosition);
      window.visualViewport?.removeEventListener('scroll', updatePosition);
      window.cancelAnimationFrame(positionFrame);
      loadedRef.current = false;
      NativeAds.hideNativeAd({ slotId: placementId }).catch((error) => {
        console.error('No se pudo ocultar el anuncio nativo:', error);
      });
    };
  }, [placementId, size]);

  useEffect(() => {
    if (!supportsNativeAds || !available || !loadedRef.current) return;

    const setVisibility = async () => {
      try {
        if (suspended) {
          await NativeAds.setNativeAdVisibility({ slotId: placementId, visible: false });
          return;
        }

        const bounds = slotRef.current?.getBoundingClientRect();
        if (!bounds || bounds.width <= 0 || bounds.height <= 0) return;

        await NativeAds.updateNativeAdPosition({
          slotId: placementId,
          x: bounds.left,
          y: bounds.top,
          width: bounds.width,
          height: bounds.height,
        });
        await NativeAds.setNativeAdVisibility({ slotId: placementId, visible: true });
      } catch (error) {
        console.error('No se pudo cambiar la visibilidad del anuncio nativo:', error);
      }
    };

    setVisibility();
  }, [placementId, suspended, available]);

  if (!supportsNativeAds || !available) return null;

  return (
    <div
      className={`NativeAdSlot NativeAdSlot${size === 'large' ? 'Large' : 'Compact'} ${suspended ? 'IsSuspended' : ''}`}
      ref={slotRef}
      aria-hidden="true"
    />
  );
}
