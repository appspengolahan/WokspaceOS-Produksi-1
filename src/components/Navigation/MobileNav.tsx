import React from 'react';
import { 
  LayoutGrid, 
  Boxes, 
  ArrowLeftRight, 
  Flower2, 
  Leaf, 
  Layers, 
  Shuffle, 
  MailCheck, 
  Users, 
  MapPin, 
  ShoppingCart, 
  Building2, 
  Database,
  Gauge,
  SlidersHorizontal,
  Award,
  Menu, 
  X,
  Edit2
} from 'lucide-react';
import { UserRole, SidebarMenuItem } from '../../types';

interface MobileNavProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  isOpenDrawer: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
  userRole: UserRole;
  stockAlertCount: number;
  menuItems: SidebarMenuItem[];
  onOpenEditMenuModal?: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutGrid,
  Boxes,
  ArrowLeftRight,
  Gauge,
  Flower2,
  Leaf,
  Layers,
  Shuffle,
  MailCheck,
  Users,
  MapPin,
  Award,
  ShoppingCart,
  Building2,
  SlidersHorizontal,
  Database,
};

export const MobileNav: React.FC<MobileNavProps> = ({
  currentModule,
  onSelectModule,
  isOpenDrawer,
  onCloseDrawer,
  onOpenDrawer,
  userRole,
  stockAlertCount,
  menuItems,
  onOpenEditMenuModal,
}) => {
  const isDeveloper = userRole === 'developer';

  // Quick navigation items at bottom bar (Top 5 primary modules)
  const quickItems = [
    { id: 'single_board', label: menuItems.find(m => m.id === 'single_board')?.shortName || 'Board', icon: LayoutGrid },
    { id: 'stock_monitoring', label: menuItems.find(m => m.id === 'stock_monitoring')?.shortName || 'Stok', icon: Boxes, badge: stockAlertCount },
    { id: 'process_tembakau', label: menuItems.find(m => m.id === 'process_tembakau')?.shortName || 'Proses', icon: Leaf },
    { id: 'log_surat', label: menuItems.find(m => m.id === 'log_surat')?.shortName || 'Surat', icon: MailCheck },
    { id: 'hr_karyawan', label: menuItems.find(m => m.id === 'hr_karyawan')?.shortName || 'HR', icon: Users },
  ];

  return (
    <>
      {/* Slide-over Drawer for full menu on mobile with optimized touch targets and larger fonts */}
      {isOpenDrawer && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-in fade-in duration-200">
          <div 
            onClick={onCloseDrawer} 
            className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity" 
          />
          <div className="relative w-80 max-w-[85vw] bg-slate-900 text-white h-full flex flex-col shadow-2xl z-10 border-r border-slate-800">
            {/* Drawer Header */}
            <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-lg bg-blue-600 font-extrabold text-xs tracking-wider">PP1</span>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Menu Navigasi PP1</h3>
                  <span className="text-[11px] text-slate-400">Divisi Produksi 1</span>
                </div>
              </div>
              <button 
                onClick={onCloseDrawer}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 active:scale-95 transition"
                aria-label="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-header with Developer Edit Button */}
            <div className="px-4 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
                Daftar Modul Operasional
              </span>
              {isDeveloper && onOpenEditMenuModal && (
                <button
                  onClick={() => {
                    onCloseDrawer();
                    onOpenEditMenuModal();
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 active:scale-95 transition"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Menu</span>
                </button>
              )}
            </div>

            {/* Drawer Nav Items */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
              {menuItems.map((item) => {
                if (item.adminOnly) {
                  if (item.id === 'gas_router' && userRole !== 'developer' && userRole !== 'super_admin') {
                    return null;
                  }
                  if (userRole === 'staff_operasional' || userRole === 'kepala_admin_1') {
                    return null;
                  }
                }
                const Icon = ICON_MAP[item.iconName] || LayoutGrid;
                const isActive = currentModule === item.id;
                const dynamicBadge = item.id === 'stock_monitoring' && stockAlertCount > 0 ? stockAlertCount : item.badge;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectModule(item.id);
                      onCloseDrawer();
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition text-left cursor-pointer ${
                      isActive 
                        ? 'bg-blue-600 text-white font-bold shadow-md ring-1 ring-blue-400/40' 
                        : 'text-slate-200 hover:bg-slate-800/90 active:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-sky-400'}`} />
                      <span className="text-sm tracking-wide truncate">{item.name}</span>
                    </div>
                    {dynamicBadge ? (
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold shadow-xs ${
                        item.id === 'stock_monitoring' ? 'bg-amber-500 text-slate-950' : 'bg-blue-500 text-white'
                      }`}>
                        {dynamicBadge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 text-center text-xs text-slate-400">
              PT Batu Karang — Divisi Produksi 1
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Tab Bar (Ergonomic for Mobile One-Handed Operation) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 py-1.5 text-slate-400 shadow-xl">
        {quickItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition relative cursor-pointer active:scale-95 ${
                isActive ? 'text-sky-400 font-bold bg-slate-800/80 shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span className="text-[11px] font-medium leading-none tracking-tight">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-slate-900" />
              ) : null}
            </button>
          );
        })}
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-slate-400 hover:text-white active:scale-95 transition cursor-pointer"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-medium leading-none tracking-tight">Semua</span>
        </button>
      </nav>
    </>
  );
};
