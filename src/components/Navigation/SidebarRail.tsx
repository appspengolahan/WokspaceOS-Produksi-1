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
  ChevronLeft,
  ChevronRight,
  Gauge,
  SlidersHorizontal,
  Award,
  Edit2,
  Bot
} from 'lucide-react';
import { UserRole, SidebarMenuItem } from '../../types';
import { PWAInstallButton } from '../PWAInstallButton';

interface SidebarRailProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userRole: UserRole;
  stockAlertCount: number;
  menuItems: SidebarMenuItem[];
  onOpenEditMenuModal?: () => void;
}

// Icon mapper for dynamic and robust rendering
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
  Bot,
};

export const SidebarRail: React.FC<SidebarRailProps> = ({
  currentModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
  userRole,
  stockAlertCount,
  menuItems,
  onOpenEditMenuModal,
}) => {
  const isDeveloper = userRole === 'developer';

  const filteredNavItems = menuItems.filter(item => {
    // 1. If hidden from sidebar, do not render in navigation
    if (item.isHidden) {
      return false;
    }

    // 2. Role permission check: if allowedRoles is configured, check if current user's role is permitted
    if (item.allowedRoles && item.allowedRoles.length > 0) {
      if (!item.allowedRoles.includes(userRole)) {
        return false;
      }
    }

    // 3. Fallback core protections for developer-only administrative modules
    if (item.adminOnly) {
      if (item.id === 'gas_router' && userRole !== 'developer' && userRole !== 'super_admin') {
        return false;
      }
      if (userRole === 'staff_operasional' || userRole === 'kepala_admin_1') {
        return false;
      }
    }
    return true;
  });

  return (
    <aside 
      className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 text-slate-200 transition-all duration-300 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-3.5 border-b border-slate-800/80 bg-slate-950/40">
        <div 
          onClick={() => onSelectModule('single_board')}
          className="flex items-center gap-3 cursor-pointer overflow-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-amber-600 p-0.5 shadow-md shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <span className="font-extrabold text-sm text-amber-400 tracking-wider">PP1</span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="font-bold text-sm tracking-tight text-white leading-tight truncate">
                PT BATU KARANG
              </div>
              <div className="text-xs text-sky-400 font-semibold tracking-wide truncate">
                Divisi Produksi 1
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
          title={isCollapsed ? 'Buka Sidebar Penuh' : 'Ciutkan Sidebar (Rail Mode)'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2.5 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
        {!isCollapsed && (
          <div className="px-3 py-1.5 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>MENU OPERASIONAL PP1</span>
            {isDeveloper && onOpenEditMenuModal && (
              <button
                onClick={onOpenEditMenuModal}
                className="flex items-center gap-1 text-[11px] font-semibold text-sky-400 hover:text-sky-300 normal-case px-2 py-0.5 rounded-md hover:bg-sky-500/10 transition cursor-pointer"
                title="Edit Nama-Nama Menu Sidebar (Khusus Developer)"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>
        )}

        {filteredNavItems.map((item) => {
          const Icon = ICON_MAP[item.iconName] || LayoutGrid;
          const isActive = currentModule === item.id;
          const dynamicBadge = item.id === 'stock_monitoring' && stockAlertCount > 0 ? stockAlertCount : item.badge;

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full group relative flex items-center gap-3.5 px-3 py-3 rounded-xl font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md font-semibold ring-1 ring-blue-400/30'
                  : 'text-slate-300 hover:bg-slate-800/90 hover:text-white'
              } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-amber-400 group-hover:scale-105'}`} />
              
              {!isCollapsed && (
                <span className="truncate flex-1 text-left text-sm tracking-wide">
                  {item.name}
                </span>
              )}

              {/* Dynamic Badge */}
              {dynamicBadge !== undefined && (
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full shadow-xs ${
                  item.id === 'stock_monitoring' 
                    ? 'bg-amber-500 text-slate-950 font-extrabold' 
                    : item.badgeColor || 'bg-blue-600 text-white'
                } ${isCollapsed ? 'absolute -top-1 -right-1 text-[10px] px-1.5' : ''}`}>
                  {dynamicBadge}
                </span>
              )}

              {/* Floating Tooltip in Collapsed Rail Mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-3 py-2 bg-slate-950 text-white text-sm font-semibold rounded-xl shadow-2xl border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* PWA Install Quick Trigger in Expanded Sidebar */}
      {!isCollapsed && (
        <div className="px-3 pt-2 pb-1">
          <PWAInstallButton variant="drawer" />
        </div>
      )}

      {/* Rail Mode Footer Info & Quick Developer Edit Trigger */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className={`flex items-center justify-between ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="GAS V2 Online" />
            {!isCollapsed && (
              <div className="text-xs text-slate-400 truncate">
                <span className="text-emerald-400 font-semibold">GAS V2</span> Connected
              </div>
            )}
          </div>

          {!isCollapsed && isDeveloper && onOpenEditMenuModal && (
            <button
              onClick={onOpenEditMenuModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition cursor-pointer"
              title="Kustomisasi Nama Menu Sidebar"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
