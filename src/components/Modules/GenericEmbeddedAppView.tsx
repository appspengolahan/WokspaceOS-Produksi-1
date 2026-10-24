import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RefreshCw, 
  ArrowLeft,
  Settings,
  AlertCircle
} from 'lucide-react';
import { SidebarMenuItem, UserRole } from '../../types';

interface GenericEmbeddedAppViewProps {
  menuItem: SidebarMenuItem;
  userRole: UserRole;
  onOpenEditMenuModal?: () => void;
  onNavigateHome: () => void;
}

export const GenericEmbeddedAppView: React.FC<GenericEmbeddedAppViewProps> = ({
  menuItem,
  userRole,
  onOpenEditMenuModal,
  onNavigateHome,
}) => {
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const isDeveloper = userRole === 'developer';
  const url = menuItem.webAppUrl;

  const handleRefresh = () => {
    setIsIframeLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className={`space-y-4 animate-in fade-in duration-300 ${isExpanded ? 'fixed inset-0 z-50 bg-slate-950 p-4' : ''}`}>
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
            title="Kembali ke Portal PP1"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white truncate">
                {menuItem.name}
              </h2>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                LIVE WEB APP
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate max-w-xl font-mono mt-0.5">
              {url}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            title="Muat ulang halaman Web App"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isIframeLoading ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-sm cursor-pointer"
              title="Buka langsung di tab baru browser"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Tab Baru</span>
            </a>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
            title={isExpanded ? 'Kembalikan Ukuran Normal' : 'Layar Penuh (Full View)'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {isDeveloper && onOpenEditMenuModal && (
            <button
              onClick={onOpenEditMenuModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition cursor-pointer"
              title="Ubah URL atau pengaturan menu ini"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ubah Link</span>
            </button>
          )}
        </div>
      </div>

      {/* Embedded Iframe Container */}
      <div className={`relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl ${isExpanded ? 'h-[calc(100vh-6rem)]' : 'h-[750px] min-h-[500px]'}`}>
        {isIframeLoading && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-10 gap-3">
            <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-center">
              <p className="text-sm font-semibold text-white">Memuat Web App...</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm truncate">{url}</p>
            </div>
          </div>
        )}

        {url ? (
          <iframe
            key={iframeKey}
            src={url}
            title={menuItem.name}
            className="w-full h-full border-0 bg-white"
            onLoad={() => setIsIframeLoading(false)}
            allow="geolocation; microphone; camera; display-capture; autoplay; clipboard-read; clipboard-write"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400">
            <AlertCircle className="w-12 h-12 text-amber-400 mb-2" />
            <h3 className="text-base font-bold text-white mb-1">Tautan Web App Belum Diatur</h3>
            <p className="text-xs max-w-md text-slate-400 mb-4">
              Menu ini belum memiliki tautan URL eksternal aktif. Klik tombol di bawah untuk memasukkan link sumber Web App.
            </p>
            {isDeveloper && onOpenEditMenuModal && (
              <button
                onClick={onOpenEditMenuModal}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition"
              >
                Atur Link Menu Sekarang
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
