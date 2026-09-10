package br.usp.ifusp.hublabdiv;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.content.Context;
import com.getcapacitor.BridgeActivity;
import androidx.core.view.WindowCompat;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Desativa o edge-to-edge (faz o app respeitar a barra de status e não preencher até o topo)
        WindowCompat.setDecorFitsSystemWindows(getWindow(), true);

        // Otimização de Cache e Resiliência Offline para o WebView do Capacitor
        try {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                WebSettings settings = webView.getSettings();
                settings.setDomStorageEnabled(true);
                settings.setDatabaseEnabled(true);

                // Se estiver sem conexão, força o uso do cache HTTP local do WebView
                if (!isNetworkConnected()) {
                    settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
                } else {
                    settings.setCacheMode(WebSettings.LOAD_DEFAULT);
                }
            }
        } catch (Exception ignored) {
            // Garante inicialização contínua mesmo se personalização do webView falhar
        }
    }

    private boolean isNetworkConnected() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
            if (cm != null) {
                NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
                return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
            }
        } catch (Exception ignored) {}
        return false;
    }
}
