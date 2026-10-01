import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
        title="Install Web App di PC / HP"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors"
          title="Install App di iPhone/iPad"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-500" />
                  Install di iPhone / iPad
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <ol className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300 list-decimal list-inside">
                <li>Buka menu bagikan (<strong>Share</strong> icon) di Safari bawah.</li>
                <li>Gulir ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambahkan ke Layar Utama).</li>
                <li>Ketuk <strong>"Add"</strong> di pojok kanan atas untuk menyelesaikan instalasi.</li>
              </ol>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-lg bg-slate-900 dark:bg-slate-800 py-2 text-xs font-medium text-white hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback direct browser info button
  return (
    <button
      onClick={() => alert('Untuk menginstal di PC/Desktop: klik ikon unduh di sebelah kanan address bar browser (Chrome/Edge), atau pilih menu browser > Install App.')}
      className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/80 transition-colors"
      title="Instalasi Web App"
    >
      <Download className="w-3.5 h-3.5 text-sky-400" />
      <span>Install PWA</span>
    </button>
  );
};
