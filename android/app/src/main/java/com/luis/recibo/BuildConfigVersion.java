package com.luis.recibo;

import android.content.Context;

/** Version instalada de la app (para mostrarla y para el registro del navegador). */
final class BuildConfigVersion {
    private BuildConfigVersion() { }

    static String nombre(Context c) {
        try {
            return c.getPackageManager().getPackageInfo(c.getPackageName(), 0).versionName;
        } catch (Exception e) {
            return "?";
        }
    }
}
