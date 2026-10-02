import React, { useState } from 'react';
import { SidebarMenuItem, UserRole } from '../../types';
import { X, Check, RotateCcw, Edit2, ShieldAlert } from 'lucide-react';

interface EditSidebarMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: SidebarMenuItem[];
  onSaveMenuItems: (updatedItems: SidebarMenuItem[]) => void;
  onResetToDefault: () => void;
  userRole: UserRole;
}

export const EditSidebarMenuModal: React.FC<EditSidebarMenuModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onSaveMenuItems,
  onResetToDefault,
  userRole,
}) => {
  const [editedItems, setEditedItems] = useState<SidebarMenuItem[]>(menuItems);

  // Sync state if menuItems changes externally
  React.useEffect(() => {
    setEditedItems(menuItems);
  }, [menuItems, isOpen]);

  if (!isOpen) return null;

  const canEdit = userRole === 'developer'; // Specifically developer / apps engineer and site engineer

  const handleNameChange = (id: string, newName: string) => {
    setEditedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, name: newName } : item))
    );
  };

  const handleShortNameChange = (id: string, newShortName: string) => {
    setEditedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, shortName: newShortName } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMenuItems(editedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Kustomisasi Nama Menu Sidebar
              </h2>
              <p className="text-xs text-slate-400">
                Otorisasi Khusus Peran Developer & Apps Engineer PP1
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice Banner */}
        {!canEdit ? (
          <div className="m-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-3 text-xs">
            <ShieldAlert className="w-5 h-5 shrink-0 text-amber-400" />
            <div>
              <span className="font-bold">Akses Dibatasi:</span> Hanya pengguna dengan peran <b>Developer / Apps Engineer</b> yang dapat mengubah dan menyimpan label menu navigasi.
            </div>
          </div>
        ) : (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sky-300 text-xs">
            💡 <b>Info:</b> Perubahan nama menu ini akan langsung diterapkan pada tampilan sidebar desktop, rail-mode tooltip, dan drawer mobile di semua perangkat.
          </div>
        )}

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="grid grid-cols-1 gap-2.5">
            {editedItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-slate-600 transition"
              >
                <div className="flex items-center gap-2.5 sm:w-1/3 min-w-0">
                  <span className="text-[11px] font-mono text-slate-500 w-5">
                    {index + 1}.
                  </span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-300 truncate block">
                      ID: <span className="font-mono text-sky-400">{item.id}</span>
                    </span>
                    {item.adminOnly && (
                      <span className="text-[10px] text-amber-400 font-medium">Khusus Dev/Admin</span>
                    )}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Nama Menu Utama (Sidebar)
                    </label>
                    <input
                      type="text"
                      disabled={!canEdit}
                      value={item.name}
                      onChange={(e) => handleNameChange(item.id, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-sm bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="Nama menu..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Singkatan (Mobile / Mini-Rail)
                    </label>
                    <input
                      type="text"
                      disabled={!canEdit}
                      value={item.shortName}
                      onChange={(e) => handleShortNameChange(item.id, e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg text-sm bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      placeholder="Singkatan..."
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => {
                if (window.confirm('Kembalikan semua nama menu ke standar default awal PP1?')) {
                  onResetToDefault();
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-40 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Bawaan</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              >
                Batal
              </button>
              {canEdit && (
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
