package com.luis.recibo;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.ContentValues;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.core.content.FileProvider;
import androidx.webkit.WebViewAssetLoader;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

/**
 * Seguimiento de Recibo para Android.
 * La app trae adentro la misma pagina (funciona sin senal) y usa la misma nube del equipo y el mismo puente de Drive.
 * Agrega lo que el navegador no hace bien dentro de una app: camara, galeria, guardar PDF/Excel en Descargas
 * y abrir WhatsApp o Drive en su propia app.
 */
public class MainActivity extends Activity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String INICIO = "https://" + HOST + "/assets/web/index.html";
    private static final int CAMARA = 1, GALERIA = 2;

    private WebView web;
    private ValueCallback<Uri[]> elegido;
    private Uri fotoUri;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#0F172A"));
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        s.setSupportMultipleWindows(false);
        s.setUserAgentString(s.getUserAgentString() + " ReciboApp/" + BuildConfigVersion.nombre(this));

        final WebViewAssetLoader cargador = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                return cargador.shouldInterceptRequest(r.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if (HOST.equals(u.getHost())) return false;
                abrirAfuera(u);
                return true;
            }
        });

        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView v, ValueCallback<Uri[]> cb, FileChooserParams p) {
                if (elegido != null) elegido.onReceiveValue(null);
                elegido = cb;
                try {
                    if (p.isCaptureEnabled()) abrirCamara();
                    else abrirGaleria(p.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE);
                    return true;
                } catch (Exception e) {
                    elegido = null;
                    Toast.makeText(MainActivity.this, "No se pudo abrir la cámara o la galería", Toast.LENGTH_LONG).show();
                    return false;
                }
            }
        });

        web.addJavascriptInterface(new Puente(), "ReciboApp");

        if (b != null) web.restoreState(b);
        else web.loadUrl(INICIO + invitacion(getIntent()));
    }

    /** Si la app se abrio desde una invitacion (…/seguimiento-recibo/#equipo=XXXXX-XXXXX), se pasa el codigo a la pagina. */
    private String invitacion(Intent i) {
        Uri d = i == null ? null : i.getData();
        if (d == null) return "";
        String f = d.getFragment();
        return f != null && f.startsWith("equipo=") ? "#" + f : "";
    }

    @Override
    protected void onNewIntent(Intent i) {
        super.onNewIntent(i);
        String h = invitacion(i);
        if (!h.isEmpty()) web.loadUrl(INICIO + h);
    }

    @Override
    protected void onSaveInstanceState(Bundle b) {
        super.onSaveInstanceState(b);
        web.saveState(b);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else moveTaskToBack(true);
    }

    private void abrirAfuera(Uri u) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, u));
        } catch (ActivityNotFoundException e) {
            Toast.makeText(this, "No hay una app para abrir ese enlace", Toast.LENGTH_LONG).show();
        }
    }

    // ---------- camara y galeria ----------
    private void abrirCamara() throws Exception {
        File dir = new File(getCacheDir(), "fotos");
        if (!dir.exists() && !dir.mkdirs()) throw new Exception("sin carpeta");
        File img = File.createTempFile("foto_", ".jpg", dir);
        fotoUri = FileProvider.getUriForFile(this, "com.luis.recibo.archivos", img);
        Intent cam = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        cam.putExtra(MediaStore.EXTRA_OUTPUT, fotoUri);
        cam.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
        cam.setClipData(ClipData.newRawUri("foto", fotoUri));
        startActivityForResult(cam, CAMARA);
    }

    private void abrirGaleria(boolean varias) {
        Intent i = new Intent(Intent.ACTION_GET_CONTENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("image/*");
        if (varias) i.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        startActivityForResult(Intent.createChooser(i, "Elegir fotos"), GALERIA);
    }

    @Override
    protected void onActivityResult(int pedido, int resultado, Intent datos) {
        super.onActivityResult(pedido, resultado, datos);
        if (elegido == null) return;
        Uri[] r = null;
        if (resultado == RESULT_OK) {
            if (pedido == CAMARA && fotoUri != null) {
                r = new Uri[]{fotoUri};
            } else if (pedido == GALERIA && datos != null) {
                ClipData c = datos.getClipData();
                if (c != null && c.getItemCount() > 0) {
                    r = new Uri[c.getItemCount()];
                    for (int k = 0; k < c.getItemCount(); k++) r[k] = c.getItemAt(k).getUri();
                } else if (datos.getData() != null) {
                    r = new Uri[]{datos.getData()};
                }
            }
        }
        elegido.onReceiveValue(r);
        elegido = null;
        fotoUri = null;
    }

    // ---------- lo que la pagina le pide a la app ----------
    private class Puente {
        /** Guarda un PDF o Excel en Descargas/Seguimiento de Recibo y lo abre. Devuelve "ok" o el error. */
        @JavascriptInterface
        public String guardar(String nombre, String base64, String tipo) {
            try {
                String limpio = nombre.replaceAll("[\\\\/:*?\"<>|]+", " ").trim();
                if (limpio.isEmpty()) limpio = "archivo";
                byte[] datos = Base64.decode(base64, Base64.DEFAULT);
                Uri uri;
                if (Build.VERSION.SDK_INT >= 29) {
                    ContentValues cv = new ContentValues();
                    cv.put(MediaStore.Downloads.DISPLAY_NAME, limpio);
                    cv.put(MediaStore.Downloads.MIME_TYPE, tipo);
                    cv.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Seguimiento de Recibo");
                    uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                    if (uri == null) return "Android no dejó crear el archivo";
                    try (OutputStream o = getContentResolver().openOutputStream(uri)) {
                        if (o == null) return "Android no dejó escribir el archivo";
                        o.write(datos);
                    }
                } else {
                    File dir = new File(getExternalFilesDir(null), "Download");
                    if (!dir.exists()) dir.mkdirs();
                    File f = new File(dir, limpio);
                    try (FileOutputStream o = new FileOutputStream(f)) { o.write(datos); }
                    uri = FileProvider.getUriForFile(MainActivity.this, "com.luis.recibo.archivos", f);
                }
                final Uri abrir = uri;
                final String msj = "Guardado en Descargas: " + limpio;
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, msj, Toast.LENGTH_LONG).show();
                    try {
                        Intent v = new Intent(Intent.ACTION_VIEW);
                        v.setDataAndType(abrir, tipo);
                        v.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        startActivity(Intent.createChooser(v, "Abrir con"));
                    } catch (Exception ignored) {
                        // queda guardado en Descargas aunque no haya app para abrirlo
                    }
                });
                return "ok";
            } catch (Exception e) {
                return "No se pudo guardar: " + e.getMessage();
            }
        }

        @JavascriptInterface
        public String version() {
            return BuildConfigVersion.nombre(MainActivity.this);
        }
    }
}
