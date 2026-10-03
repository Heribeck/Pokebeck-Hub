package com.heribeck.PokeTypeGuess;

import com.getcapacitor.BridgeActivity;
import com.heribeck.PokeTypeGuess.ads.NativeAdsPlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(NativeAdsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
