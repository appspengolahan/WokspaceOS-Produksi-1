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
  Award
} from 'lucide-react';
import { UserRole } from '../../types';

interface SidebarRailProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  userRole: UserRole;
  stockAlertCount: number;
}

interface NavItem {
  id: string;
  name: string;
  shortName: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeColor?: string;
  adminOnly?: boolean;
}

export const SidebarRail: React.FC<SidebarRailProps> = ({
  currentModule,
  onSelectModule,
  isCollapsed,
  onToggleCollapse,
  userRole,
  stockAlertCount,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'single_board',
      name: 'Single Board Apps PP1',
      shortName: 'Board',
      icon: LayoutGrid,
    },
    {
      id: 'stock_monitoring',
      name: 'Monitoring Stock PP1',
      shortName: 'Stok',
      icon: Boxes,
      badge: stockAlertCount > 0 ? stockAlertCount : undefined,
      badgeColor: 'bg-amber-500 text-white',
    },
    {
      id: 'stock_mutation',
      name: 'Mutasi Stock PP1',
      shortName: 'Mutasi',
      icon: ArrowLeftRight,
    },
    {
      id: 'general_monitoring',
      name: 'General Monitoring',
      shortName: 'General',
      icon: Gauge,
    },
    {
      id: 'process_cengkeh',
      name: 'Data Proses Cengkeh',
      shortName: 'Cengkeh',
      icon: Flower2,
    },
    {
      id: 'process_tembakau',
      name: 'Data Proses Tembakau',
      shortName: 'Tembakau',
      icon: Leaf,
    },
    {
      id: 'process_krosok',
      name: 'Data Proses Krosok',
      shortName: 'Krosok',
      icon: Layers,
    },
    {
      id: 'process_blend',
      name: 'Data Proses Blend',
      shortName: 'Blend',
      icon: Shuffle,
    },
    {
      id: 'log_surat',
      name: 'Log Surat & Template',
      shortName: 'Surat',
      icon: MailCheck,
    },
    {
      id: 'hr_karyawan',
      name: 'HR & Pekerja Harian',
      shortName: 'HR',
      icon: Users,
    },
    {
      id: 'hr_presensi',
      name: 'Presensi GPS Lokasi',
      shortName: 'GPS',
      icon: MapPin,
    },
    {
      id: 'hr_kpi',
      name: 'Pengukuran KPI',
      shortName: 'KPI',
      icon: Award,
      adminOnly: true,
    },
    {
      id: 'purchase_spp',
      name: 'Surat Permintaan (SPP)',
      shortName: 'SPP',
      icon: ShoppingCart,
      badge: 5,
      badgeColor: 'bg-blue-600 text-white',
    },
    {
      id: 'crm_clients',
      name: 'CRM Clients Hub',
      shortName: 'CRM',
      icon: Building2,
    },
    {
      id: 'formula_blend',
      name: 'Formula Blend Lab',
      shortName: 'Formula',
      icon: SlidersHorizontal,
      adminOnly: true,
    },
    {
      id: 'gas_router',
      name: 'GAS V2 Sync Router',
      shortName: 'GAS V2',
      icon: Database,
      adminOnly: true,
    },
  ];

  const filteredNavItems = navItems.filter(item => {
    if (item.adminOnly && userRole === 'staff_operasional') {
      return false;
    }
    return true;
  });

  return (
    <aside 
      className={`hidden md:flex flex-col bg-slate-900 border-r border-slate-800 text-slate-200 transition-all duration-300 select-none z-30 shrink-0 ${
        isCollapsed ? 'w-18' : 'w-64'
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
              <span className="font-extrabold text-xs text-amber-400 tracking-wider">PP1</span>
            </div>
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <div className="font-bold text-sm tracking-tight text-white leading-tight truncate">
                PT BATU KARANG
              </div>
              <div className="text-[11px] text-sky-400 font-medium tracking-wide truncate">
                Divisi Produksi 1
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={onToggleCollapse}
          className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          title={isCollapsed ? 'Buka Sidebar' : 'Ciutkan Sidebar (Rail Mode)'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
        {!isCollapsed && (
          <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Menu Operasional PP1
          </div>
        )}

        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`w-full group relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
            >
              <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-amber-400'}`} />
              
              {!isCollapsed && (
                <span className="truncate flex-1 text-left">
                  {item.name}
                </span>
              )}

              {/* Badge */}
              {item.badge !== undefined && (
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'} ${isCollapsed ? 'absolute -top-1 -right-1' : ''}`}>
                  {item.badge}
                </span>
              )}

              {/* Floating Tooltip in Collapsed Rail Mode */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-950 text-white text-xs font-medium rounded-lg shadow-xl border border-slate-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                  {item.name}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Rail Mode Footer Info */}
      <div className="p-2 border-t border-slate-800/80 bg-slate-950/30">
        <div className={`flex items-center gap-2 p-1.5 rounded-lg ${isCollapsed ? 'justify-center' : 'justify-start'}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" title="GAS V2 Online" />
          {!isCollapsed && (
            <div className="text-[11px] text-slate-400 truncate">
              <span className="text-emerald-400 font-semibold">GAS V2</span> Connected
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
