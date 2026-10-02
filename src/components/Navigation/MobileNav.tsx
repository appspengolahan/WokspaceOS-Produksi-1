import React from 'react';
import { 
  LayoutGrid, 
  Boxes, 
  Leaf, 
  MailCheck, 
  Users, 
  Menu, 
  X,
  Database,
  ShoppingCart,
  Building2,
  Flower2,
  Layers,
  Shuffle,
  Gauge
} from 'lucide-react';
import { UserRole } from '../../types';

interface MobileNavProps {
  currentModule: string;
  onSelectModule: (moduleId: string) => void;
  isOpenDrawer: boolean;
  onCloseDrawer: () => void;
  onOpenDrawer: () => void;
  userRole: UserRole;
  stockAlertCount: number;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentModule,
  onSelectModule,
  isOpenDrawer,
  onCloseDrawer,
  onOpenDrawer,
  userRole,
  stockAlertCount,
}) => {
  const quickItems = [
    { id: 'single_board', label: 'Board', icon: LayoutGrid },
    { id: 'stock_monitoring', label: 'Stok', icon: Boxes, badge: stockAlertCount },
    { id: 'process_tembakau', label: 'Proses', icon: Leaf },
    { id: 'log_surat', label: 'Surat', icon: MailCheck },
    { id: 'hr_karyawan', label: 'HR', icon: Users },
  ];

  const allDrawerItems = [
    { id: 'single_board', name: 'Single Board Apps PP1', icon: LayoutGrid },
    { id: 'stock_monitoring', name: 'Monitoring Stock PP1', icon: Boxes, badge: stockAlertCount },
    { id: 'stock_mutation', name: 'Mutasi Stock PP1', icon: Boxes },
    { id: 'general_monitoring', name: 'General Monitoring PP1', icon: Gauge },
    { id: 'process_cengkeh', name: 'Proses Cengkeh', icon: Flower2 },
    { id: 'process_tembakau', name: 'Proses Tembakau', icon: Leaf },
    { id: 'process_krosok', name: 'Proses Krosok', icon: Layers },
    { id: 'process_blend', name: 'Proses Blend', icon: Shuffle },
    { id: 'log_surat', name: 'Log Surat & Template PP1', icon: MailCheck },
    { id: 'hr_karyawan', name: 'HR Karyawan & Pekerja', icon: Users },
    { id: 'purchase_spp', name: 'Surat Permintaan (SPP)', icon: ShoppingCart },
    { id: 'crm_clients', name: 'CRM Clients Hub', icon: Building2 },
    { id: 'gas_router', name: 'Modular GAS V2 Router', icon: Database, adminOnly: true },
  ];

  return (
    <>
      {/* Slide-over Drawer for full menu on mobile */}
      {isOpenDrawer && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            onClick={onCloseDrawer} 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
          />
          <div className="relative w-72 max-w-[85vw] bg-slate-900 text-white h-full flex flex-col shadow-2xl z-10 border-r border-slate-800">
            <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-blue-600 font-bold text-xs">PP1</span>
                <span className="font-semibold text-sm">Menu Modul Ekosistem</span>
              </div>
              <button 
                onClick={onCloseDrawer}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {allDrawerItems.map((item) => {
                if (item.adminOnly) {
                  if (item.id === 'gas_router' && userRole !== 'developer' && userRole !== 'super_admin') {
                    return null;
                  }
                  if (userRole === 'staff_operasional' || userRole === 'kepala_admin_1') {
                    return null;
                  }
                }
                const Icon = item.icon;
                const isActive = currentModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectModule(item.id);
                      onCloseDrawer();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                      isActive 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-sky-400" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge ? (
                      <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-950 text-center">
              <span className="text-[11px] text-slate-400">
                PT Batu Karang — Divisi Produksi 1
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Tab Bar (under 15% mobile viewport height constraint) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex items-center justify-around px-2 py-1.5 text-slate-400">
        {quickItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] transition relative ${
                isActive ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-slate-900" />
              ) : null}
            </button>
          );
        })}
        <button
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] text-slate-400 hover:text-white"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>Lainnya</span>
        </button>
      </nav>
    </>
  );
};
