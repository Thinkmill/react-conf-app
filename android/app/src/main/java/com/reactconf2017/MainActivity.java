package com.reactconf2017;

import android.os.Bundle;
import android.widget.ImageView;

import com.facebook.react.ReactActivity;
import com.reactnativecomponent.splashscreen.RCTSplashScreen;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ReactConf2017";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        RCTSplashScreen.openSplashScreen(this, true, ImageView.ScaleType.CENTER_CROP);
        super.onCreate(savedInstanceState);
    }
}
