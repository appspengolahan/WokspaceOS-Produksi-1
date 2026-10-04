import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Laptop, 
  Monitor, 
  X, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'navbar' | 'drawer' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '',
  variant = 'navbar'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop'>('mobile');

  // If already running standalone inside app window
  if (isInstalled) {
    if (variant === 'drawer') {
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Aplikasi Terinstal (Mode Native)</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (!outcome) {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* 1. Trigger Button */}
      {variant === 'drawer' ? (
        <button
          onClick={handleInstallClick}
          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md transition-all cursor-pointer font-bold text-xs ${className}`}
        >
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <span>Instal Aplikasi PP1 OS</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/20 uppercase tracking-wider font-extrabold">
            HP & PC
          </span>
        </button>
      ) : (
        <button
          onClick={handleInstallClick}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xs transition-all cursor-pointer active:scale-95 ${className}`}
          title="Instal Aplikasi di HP (Android/iOS) atau PC/Laptop (Windows/Mac)"
        >
          <Download className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Instal App</span>
        </button>
      )}

      {/* 2. Interactive Step-by-Step Guide Modal for HP & PC */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-blue-950/60 to-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/30 border border-blue-500/40 text-sky-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    Instalasi Divisi Produksi 1 (PP1 OS)
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Aplikasi Progressive Web App (PWA) Resmi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Device Switcher Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
              <button
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'mobile'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Handphone (Android / iOS)</span>
              </button>
              <button
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span>PC & Laptop (Windows / Mac)</span>
              </button>
            </div>

            {/* Modal Body Instructions */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed">
              {activeTab === 'mobile' ? (
                <div className="space-y-4">
                  {/* Android Instruction */}
                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-sky-400">
                      <Smartphone className="w-4 h-4" />
                      <span>Untuk Pengguna HP Android (Google Chrome / Edge):</span>
                    </div>
                    {isInstallable ? (
                      <div className="pt-1">
                        <button
                          onClick={async () => {
                            await install();
                            setShowModal(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-md transition cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Klik Di Sini Untuk Instal Otomatis</span>
                        </button>
                      </div>
                    ) : (
                      <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                        <li>Ketuk menu titik tiga (<strong>⋮</strong>) di pojok kanan atas browser Chrome.</li>
                        <li>Pilih opsi <strong>"Instal Aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                        <li>Ketuk <strong>Instal</strong>. Ikon PP1 Workspace akan muncul di layar handphone Anda seperti aplikasi Play Store.</li>
                      </ol>
                    )}
                  </div>

                  {/* iOS Instruction */}
                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 font-bold text-amber-400">
                      <Share2 className="w-4 h-4" />
                      <span>Untuk Pengguna iPhone / iPad (Safari):</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                      <li>Buka website ini di browser <strong>Safari</strong>.</li>
                      <li>Ketuk tombol <strong>Bagikan / Share</strong> (ikon kotak dengan panah ke atas di bilah bawah).</li>
                      <li>Gulir menu ke bawah lalu pilih <strong>"Tambahkan ke Layar Utama" (Add to Home Screen)</strong>.</li>
                      <li>Ketuk <strong>"Tambah / Add"</strong> di pojok kanan atas.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-2 font-bold text-sky-400">
                      <Laptop className="w-4 h-4" />
                      <span>Instal di Laptop / Komputer (Chrome, Microsoft Edge, Brave):</span>
                    </div>
                    {isInstallable ? (
                      <button
                        onClick={async () => {
                          await install();
                          setShowModal(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-md transition cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Instal Aplikasi ke Desktop Sekarang</span>
                      </button>
                    ) : (
                      <ol className="list-decimal list-inside space-y-2 text-slate-300 pl-1">
                        <li>
                          Perhatikan <strong>Address Bar (bilah alamat URL)</strong> di bagian atas browser Anda.
                        </li>
                        <li>
                          Klik ikon <strong>Instal / Komputer dengan panah bawah</strong> (<Download className="w-3.5 h-3.5 inline mx-1 text-sky-400" />) di ujung kanan address bar.
                        </li>
                        <li>
                          Atau klik tombol <strong>Menu Titik Tiga (⋮)</strong> di browser &gt; pilih <strong>"Instal Divisi Produksi 1 - Workspace OS"</strong>.
                        </li>
                        <li>
                          Aplikasi akan terbuka di jendela khusus tanpa tab browser dan shortcut desktop akan otomatis dibuat.
                        </li>
                      </ol>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-slate-300 space-y-1">
                    <div className="font-bold text-blue-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      <span>Keuntungan Menginstal di PC/Laptop:</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      Aplikasi berjalan standalone lebih cepat, tanpa bilah url browser, mendukung shortcut keyboard, dan siap digunakan langsung dari desktop/taskbar seperti software bawaan Windows/Mac.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Standalone PWA v1.3.0 · PT Batu Karang
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
