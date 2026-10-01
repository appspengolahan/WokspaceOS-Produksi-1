import React, { useState } from 'react';
import { 
  Maximize, 
  Minimize, 
  Sun, 
  Moon, 
  RefreshCw, 
  ShieldCheck, 
  Menu,
  Database,
  FileDown
} from 'lucide-react';
import { PWAInstallButton } from '../PWAInstallButton';
import { UserProfile, UserRole } from '../../types';

interface TopNavbarProps {
  onToggleMobileMenu: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  currentUser: UserProfile;
  availableUsers: UserProfile[];
  onSelectUser: (user: UserProfile) => void;
  onOpenGasModal: () => void;
  isSyncing: boolean;
  onManualSync: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onToggleMobileMenu,
  isDark,
  onToggleTheme,
  currentUser,
  availableUsers,
  onSelectUser,
  onOpenGasModal,
  isSyncing,
  onManualSync,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.warn('Fullscreen error:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">Super Admin</span>;
      case 'project_manager':
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-sky-300 border border-blue-500/40">Manager PP1</span>;
      default:
        return <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">Staff PP1</span>;
    }
  };

  return (
    <header className="h-16 bg-[#0B192C] text-white border-b border-slate-800 flex items-center justify-between px-3 md:px-5 shrink-0 z-20 shadow-md">
      {/* Left Lockup */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Badge */}
        <div className="flex items-center gap-2.5">
          <div className="px-2 py-1 rounded bg-blue-600 text-white font-extrabold text-xs tracking-wider shadow-inner">
            PP1
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold tracking-tight text-white leading-tight">
              Single Board Apps PP1
            </h1>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              Divisi Produksi I — Pusat Navigasi Web App & Sistem
            </p>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* GAS V2 Sync Button */}
        <button
          onClick={onManualSync}
          disabled={isSyncing}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all cursor-pointer"
          title="Sinkronisasi manual dengan Google Spreadsheet GAS V2"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="hidden xl:inline text-slate-300">GAS V2 Sync</span>
        </button>

        {/* GAS V2 Config Modal Button */}
        <button
          onClick={onOpenGasModal}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all"
          title="Buka Pengaturan Spreadsheet & Endpoint Router"
        >
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden md:inline">Sheets Hub</span>
        </button>

        {/* Fullscreen Toggle */}
        <button
          onClick={toggleFullscreen}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
          title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
          title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-300" />}
        </button>

        {/* Download Blueprint PDF Button */}
        <a
          href="/BLUEPRINT_WORKSPACE_PP1_BATU_KARANG.pdf"
          download="BLUEPRINT_WORKSPACE_PP1_BATU_KARANG.pdf"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
          title="Download Master Blueprint & Roadmap (PDF Resmi)"
        >
          <FileDown className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Unduh PDF</span>
        </a>

        {/* Install PWA Button */}
        <PWAInstallButton />

        {/* RBAC Role Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 transition text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden md:block leading-tight">
              <div className="text-xs font-medium text-white truncate max-w-[130px]">
                {currentUser.name}
              </div>
              <div className="flex items-center gap-1">
                {getRoleBadge(currentUser.role)}
              </div>
            </div>
          </button>

          {/* Role Dropdown */}
          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-slate-800">
                <div className="text-xs text-slate-400">Login Sebagai:</div>
                <div className="text-sm font-semibold text-white">{currentUser.name}</div>
                <div className="text-[11px] text-sky-400">{currentUser.roleTitle}</div>
              </div>

              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Ganti Role Akses (RBAC Switcher)
              </div>

              <div className="space-y-1 px-1">
                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSelectUser(u);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                      u.id === currentUser.id
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-[10px] opacity-75">{u.roleTitle}</div>
                    </div>
                    {u.id === currentUser.id && (
                      <ShieldCheck className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-800 px-3 text-[11px] text-slate-400">
                <span>Status: </span>
                <span className="text-emerald-400 font-medium">RBAC Terverifikasi</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
