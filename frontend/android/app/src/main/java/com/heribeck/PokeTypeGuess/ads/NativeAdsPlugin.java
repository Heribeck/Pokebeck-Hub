package com.heribeck.PokeTypeGuess.ads;

import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.util.TypedValue;
import android.view.LayoutInflater;
import android.view.View;
import android.view.animation.DecelerateInterpolator;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.TextView;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdLoader;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.nativead.AdChoicesView;
import com.google.android.gms.ads.nativead.MediaView;
import com.google.android.gms.ads.nativead.NativeAd;
import com.google.android.gms.ads.nativead.NativeAdView;
import com.heribeck.PokeTypeGuess.R;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;

@CapacitorPlugin(name = "NativeAds")
public class NativeAdsPlugin extends Plugin {
    private final Map<String, NativeAdInstance> nativeAds = new HashMap<>();
    private final Map<String, NativeAd> preloadedNativeAds = new HashMap<>();
    private final Map<String, Long> loadRequestIds = new HashMap<>();
    private final HashSet<String> preloadingSizes = new HashSet<>();

    @PluginMethod
    public void preloadNativeAd(PluginCall call) {
        String size = call.getString("size");
        String adUnitId = call.getString("adUnitId");
        if (!"large".equals(size) && !"compact".equals(size)) {
            call.reject("A supported native ad size is required.");
            return;
        }
        if (adUnitId == null || adUnitId.trim().isEmpty()) {
            call.reject("A native ad unit ID is required.");
            return;
        }

        getActivity().runOnUiThread(() -> {
            if (preloadedNativeAds.containsKey(size)) {
                call.resolve();
                return;
            }
            if (!preloadingSizes.add(size)) {
                call.resolve();
                return;
            }

            AdLoader adLoader = new AdLoader.Builder(getContext(), adUnitId)
                .forNativeAd(nativeAd -> {
                    preloadingSizes.remove(size);
                    NativeAd previousAd = preloadedNativeAds.put(size, nativeAd);
                    if (previousAd != null) {
                        previousAd.destroy();
                    }
                    call.resolve();
                })
                .withAdListener(new AdListener() {
                    @Override
                    public void onAdFailedToLoad(LoadAdError error) {
                        preloadingSizes.remove(size);
                        call.reject("Native ad preload failed: " + error.getMessage());
                    }
                })
                .build();

            adLoader.loadAd(new AdRequest.Builder().build());
        });
    }

    @PluginMethod
    public void showNativeAd(PluginCall call) {
        String slotId = call.getString("slotId");
        String size = call.getString("size");
        String adUnitId = call.getString("adUnitId");
        if (slotId == null || slotId.trim().isEmpty()) {
            call.reject("A native ad slot ID is required.");
            return;
        }
        if (adUnitId == null || adUnitId.trim().isEmpty()) {
            call.reject("A native ad unit ID is required.");
            return;
        }
        if (!"large".equals(size) && !"compact".equals(size)) {
            call.reject("A supported native ad size is required.");
            return;
        }

        getActivity().runOnUiThread(() -> {
            removeNativeAdView(slotId);
            long requestId = nextRequestId(slotId);
            NativeAd preloadedAd = preloadedNativeAds.remove(size);
            if (preloadedAd != null) {
                displayNativeAd(slotId, size, preloadedAd, call, requestId);
                return;
            }

            AdLoader adLoader = new AdLoader.Builder(getContext(), adUnitId)
                .forNativeAd(nativeAd -> {
                    if (!isCurrentRequest(slotId, requestId)) {
                        nativeAd.destroy();
                        return;
                    }

                    displayNativeAd(slotId, size, nativeAd, call, requestId);
                })
                .withAdListener(new AdListener() {
                    @Override
                    public void onAdFailedToLoad(LoadAdError error) {
                        if (isCurrentRequest(slotId, requestId)) {
                            call.reject("Native ad failed to load: " + error.getMessage());
                        }
                    }
                })
                .build();

            adLoader.loadAd(new AdRequest.Builder().build());
        });
    }

    @PluginMethod
    public void updateNativeAdPosition(PluginCall call) {
        String slotId = call.getString("slotId");
        getActivity().runOnUiThread(() -> {
            NativeAdInstance instance = nativeAds.get(slotId);
            if (instance == null) {
                call.reject("No native ad is currently displayed.");
                return;
            }

            FrameLayout.LayoutParams layoutParams = createLayoutParams(call);
            if (layoutParams == null) {
                return;
            }

            NativeAdInstance currentInstance = nativeAds.get(slotId);
            if (currentInstance == null) {
                call.reject("No native ad is currently displayed.");
                return;
            }
            currentInstance.adView.setLayoutParams(layoutParams);
            call.resolve();
        });
    }

    @PluginMethod
    public void hideNativeAd(PluginCall call) {
        String slotId = call.getString("slotId");
        if (slotId == null || slotId.trim().isEmpty()) {
            call.reject("A native ad slot ID is required.");
            return;
        }

        getActivity().runOnUiThread(() -> {
            nextRequestId(slotId);
            removeNativeAdView(slotId);
            call.resolve();
        });
    }

    @PluginMethod
    public void setNativeAdVisibility(PluginCall call) {
        String slotId = call.getString("slotId");
        Boolean visible = call.getBoolean("visible");
        if (slotId == null || slotId.trim().isEmpty() || visible == null) {
            call.reject("A native ad slot ID and visibility are required.");
            return;
        }

        getActivity().runOnUiThread(() -> {
            NativeAdInstance instance = nativeAds.get(slotId);
            if (instance == null) {
                call.reject("No native ad is currently displayed.");
                return;
            }
            instance.adView.setVisibility(visible ? View.VISIBLE : View.GONE);
            call.resolve();
        });
    }

    @Override
    public void handleOnDestroy() {
        for (String slotId : new HashSet<>(loadRequestIds.keySet())) {
            nextRequestId(slotId);
        }
        for (String slotId : new HashSet<>(nativeAds.keySet())) {
            removeNativeAdView(slotId);
        }
        for (NativeAd nativeAd : preloadedNativeAds.values()) {
            nativeAd.destroy();
        }
        preloadedNativeAds.clear();
        preloadingSizes.clear();
        super.handleOnDestroy();
    }

    private void displayNativeAd(
        String slotId,
        String size,
        NativeAd nativeAd,
        PluginCall call,
        long requestId
    ) {
        if (!isCurrentRequest(slotId, requestId)) {
            nativeAd.destroy();
            return;
        }

        NativeAdView adView = createNativeAdView(nativeAd, size);
        if (!attachNativeAdView(slotId, adView, call)) {
            nativeAd.destroy();
            return;
        }

        nativeAds.put(slotId, new NativeAdInstance(nativeAd, adView));
        call.resolve();
    }

    private NativeAdView createNativeAdView(NativeAd nativeAd, String size) {
        int layoutId = "large".equals(size)
            ? R.layout.native_ad_card
            : R.layout.native_ad_compact;
        NativeAdView adView = (NativeAdView) LayoutInflater.from(getContext())
            .inflate(layoutId, null);
        TextView headline = adView.findViewById(R.id.native_ad_headline);
        TextView body = adView.findViewById(R.id.native_ad_body);
        TextView advertiser = adView.findViewById(R.id.native_ad_advertiser);
        Button callToAction = adView.findViewById(R.id.native_ad_call_to_action);
        AdChoicesView adChoices = adView.findViewById(R.id.native_ad_choices);
        MediaView media = adView.findViewById(R.id.native_ad_media);

        headline.setText(nativeAd.getHeadline());
        adView.setHeadlineView(headline);
        adView.setAdChoicesView(adChoices);

        if (nativeAd.getBody() != null) {
            body.setText(nativeAd.getBody());
            body.setVisibility(View.VISIBLE);
            adView.setBodyView(body);
        } else {
            body.setVisibility(View.GONE);
        }

        if (nativeAd.getAdvertiser() != null) {
            advertiser.setText(nativeAd.getAdvertiser());
        }
        adView.setAdvertiserView(advertiser);

        if (nativeAd.getCallToAction() != null) {
            callToAction.setText(nativeAd.getCallToAction());
            callToAction.setVisibility(View.VISIBLE);
            adView.setCallToActionView(callToAction);
        } else {
            callToAction.setVisibility(View.GONE);
        }

        if (media != null && nativeAd.getMediaContent() != null) {
            media.setMediaContent(nativeAd.getMediaContent());
            media.setVisibility(View.VISIBLE);
            adView.setMediaView(media);
        } else if (media != null) {
            media.setVisibility(View.GONE);
        }

        GradientDrawable background = new GradientDrawable();
        background.setColor(Color.rgb(34, 36, 43));
        background.setCornerRadius(dp(16));
        background.setStroke(dp(1), Color.rgb(54, 56, 64));
        adView.setBackground(background);
        adView.setNativeAd(nativeAd);
        return adView;
    }

    private boolean attachNativeAdView(String slotId, NativeAdView adView, PluginCall call) {
        FrameLayout content = getActivity().findViewById(android.R.id.content);
        if (content == null) {
            call.reject("The Android content view is unavailable.");
            return false;
        }

        FrameLayout.LayoutParams layoutParams = createLayoutParams(call);
        if (layoutParams == null) {
            return false;
        }

        content.addView(adView, layoutParams);
        adView.setElevation(dp(12));
        adView.setTag(slotId);
        adView.setAlpha(0f);
        adView.setTranslationY(dp(8));
        adView.animate()
            .alpha(1f)
            .translationY(0f)
            .setDuration(260)
            .setInterpolator(new DecelerateInterpolator())
            .start();
        return true;
    }

    private FrameLayout.LayoutParams createLayoutParams(PluginCall call) {
        double x = call.getDouble("x", -1.0);
        double y = call.getDouble("y", -1.0);
        double width = call.getDouble("width", 0.0);
        double height = call.getDouble("height", 0.0);
        if (x < 0 || y < 0 || width <= 0 || height <= 0) {
            call.reject("Native ad position and dimensions must be positive.");
            return null;
        }

        float density = getContext().getResources().getDisplayMetrics().density;
        int[] webViewLocation = new int[2];
        int[] contentLocation = new int[2];
        getBridge().getWebView().getLocationOnScreen(webViewLocation);
        View content = getActivity().findViewById(android.R.id.content);
        content.getLocationOnScreen(contentLocation);

        int left = webViewLocation[0] - contentLocation[0] + Math.round((float) x * density);
        int top = webViewLocation[1] - contentLocation[1] + Math.round((float) y * density);
        int pixelWidth = Math.round((float) width * density);
        int pixelHeight = Math.round((float) height * density);
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
            pixelWidth,
            pixelHeight,
            android.view.Gravity.TOP | android.view.Gravity.LEFT
        );
        layoutParams.leftMargin = left;
        layoutParams.topMargin = top;
        return layoutParams;
    }

    private long nextRequestId(String slotId) {
        long requestId = loadRequestIds.getOrDefault(slotId, 0L) + 1;
        loadRequestIds.put(slotId, requestId);
        return requestId;
    }

    private boolean isCurrentRequest(String slotId, long requestId) {
        return loadRequestIds.getOrDefault(slotId, 0L) == requestId;
    }

    private void removeNativeAdView(String slotId) {
        NativeAdInstance instance = nativeAds.remove(slotId);
        if (instance == null) return;

        if (instance.adView.getParent() instanceof FrameLayout) {
            ((FrameLayout) instance.adView.getParent()).removeView(instance.adView);
        }
        instance.nativeAd.destroy();
    }

    private int dp(int value) {
        return (int) TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            value,
            getContext().getResources().getDisplayMetrics()
        );
    }

    private static final class NativeAdInstance {
        private final NativeAd nativeAd;
        private final NativeAdView adView;

        private NativeAdInstance(NativeAd nativeAd, NativeAdView adView) {
            this.nativeAd = nativeAd;
            this.adView = adView;
        }
    }
}
