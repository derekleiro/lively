package com.lively.life;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.view.Window;
import android.view.View;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

@NativePlugin()
public class NavigationBar extends Plugin {

  @PluginMethod()
  public void setDarkColor(PluginCall call) {
    final Window window = ((Activity) getContext()).getWindow();
    final int parsedColor = Color.parseColor("black");

    View decorView = window.getDecorView();
    final int[] visibilityFlags = {decorView.getSystemUiVisibility()};

    getActivity().runOnUiThread(new Runnable() {
      @Override
      public void run() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          decorView.setSystemUiVisibility(visibilityFlags[0] &= ~View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
          window.setNavigationBarColor(parsedColor);
        }

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
          window.setStatusBarColor(parsedColor);
          decorView.setSystemUiVisibility(visibilityFlags[0] &= ~View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }
      }
    });
  }

  @PluginMethod()
  public void setLightColor(PluginCall call) {
    final Window window = ((Activity) getContext()).getWindow();
    final int parsedColor = Color.parseColor("#FAFAFA");

    View decorView = window.getDecorView();
    final int[] visibilityFlags = {decorView.getSystemUiVisibility()};
    

    getActivity().runOnUiThread(new Runnable() {
      @Override
      public void run() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          decorView.setSystemUiVisibility(visibilityFlags[0] |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
          window.setNavigationBarColor(parsedColor);
        }

        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M){
          window.setStatusBarColor(parsedColor);
          decorView.setSystemUiVisibility(visibilityFlags[0] |= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR);
        }
      }
    });
  }
}
