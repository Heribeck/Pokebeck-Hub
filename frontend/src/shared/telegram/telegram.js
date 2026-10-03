import { Capacitor } from '@capacitor/core';

export function abrirTelegram(){
  const isNative = Capacitor.isNativePlatform()

  const url = isNative
    ? "tg://resolve?domain=pokebeck"
    : "https://t.me/pokebeck";

  window.open(url, isNative ? "_system" : "_blank");
}