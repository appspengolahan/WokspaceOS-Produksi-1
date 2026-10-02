import React, { useState } from 'react';
import { SidebarMenuItem, UserRole } from '../../types';
import { 
  X, 
  Check, 
  RotateCcw, 
  Edit2, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  CheckSquare, 
  Square,
  Users
} from 'lucide-react';

interface EditSidebarMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: SidebarMenuItem[];
  onSaveMenuItems: (updatedItems: SidebarMenuItem[]) => void;
  onResetToDefault: () => void;
  userRole: UserRole;
}

// All recognized roles within PT Batu Karang Divisi Produksi 1
const ALL_ROLES: { role: UserRole; label: string; badgeColor: string }[] = [
  { role: 'developer', label: 'Developer / Engineer', badgeColor: 'border-purple-500/40 text-purple-300 bg-purple-500/10' },
  { role: 'project_manager', label: 'Manajer Operasional', badgeColor: 'border-blue-500/40 text-blue-300 bg-blue-500/10' },
  { role: 'super_admin', label: 'Super Admin', badgeColor: 'border-amber-500/40 text-amber-300 bg-amber-500/10' },
  { role: 'kepala_admin_1', label: 'Kepala Admin 1', badgeColor: 'border-rose-500/40 text-rose-300 bg-rose-500/10' },
  { role: 'kepala_pengolahan_1', label: 'Kepala Pengolahan 1', badgeColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-500/10' },
  { role: 'kepala_pengolahan_2', label: 'Kepala Pengolahan 2', badgeColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10' },
  { role: 'staff_operasional', label: 'Staff Lapangan / Operator', badgeColor: 'border-slate-500/40 text-slate-300 bg-slate-500/10' },
];

export const EditSidebarMenuModal: React.FC<EditSidebarMenuModalProps> = ({
  isOpen,
  onClose,
  menuItems,
  onSaveMenuItems,
  onResetToDefault,
  userRole,
}) => {
  const [editedItems, setEditedItems] = useState<SidebarMenuItem[]>(() => 
    menuItems.map(item => ({
      ...item,
      isHidden: !!item.isHidden,
      // Default to all roles allowed if none specified yet
      allowedRoles: item.allowedRoles || ALL_ROLES.map(r => r.role),
    }))
  );

  // Sync state if menuItems changes externally
  React.useEffect(() => {
    setEditedItems(
      menuItems.map(item => ({
        ...item,
        isHidden: !!item.isHidden,
        allowedRoles: item.allowedRoles || ALL_ROLES.map(r => r.role),
      }))
    );
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

  // Toggle Visibility: Show / Hide grid from sidebar
  const handleToggleHide = (id: string) => {
    if (!canEdit) return;
    setEditedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isHidden: !item.isHidden } : item
      )
    );
  };

  // Toggle Checklist Role Permission for a Menu item
  const handleToggleRolePermission = (id: string, roleToToggle: UserRole) => {
    if (!canEdit) return;
    setEditedItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const currentAllowed = item.allowedRoles || ALL_ROLES.map(r => r.role);
        const exists = currentAllowed.includes(roleToToggle);
        let nextAllowed: UserRole[];
        if (exists) {
          // Do not allow unchecking all roles completely (keep at least developer)
          if (currentAllowed.length <= 1) {
            return item;
          }
          nextAllowed = currentAllowed.filter((r) => r !== roleToToggle);
        } else {
          nextAllowed = [...currentAllowed, roleToToggle];
        }
        return {
          ...item,
          allowedRoles: nextAllowed,
        };
      })
    );
  };

  // Toggle all roles at once for a menu item
  const handleToggleAllRoles = (id: string) => {
    if (!canEdit) return;
    setEditedItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const currentAllowed = item.allowedRoles || ALL_ROLES.map(r => r.role);
        const allSelected = currentAllowed.length === ALL_ROLES.length;
        return {
          ...item,
          allowedRoles: allSelected ? ['developer'] : ALL_ROLES.map(r => r.role),
        };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMenuItems(editedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Edit2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Kustomisasi Menu & Kontrol Akses Peran Sidebar
              </h2>
              <p className="text-xs text-slate-400">
                Otorisasi Khusus: Sembunyikan Grid / Menu & Checklist Peran yang Boleh Mengakses
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
              <span className="font-bold">Akses Dibatasi:</span> Hanya pengguna dengan peran <b>Developer / Apps Engineer</b> yang dapat menyembunyikan menu dan mengatur checklist hak akses peran.
            </div>
          </div>
        ) : (
          <div className="mx-4 mt-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sky-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Klik tombol mata <b>Sembunyikan/Tampilkan</b> untuk mengatur grid di sidebar, dan centang <b>Checklist Peran</b> untuk membatasi pengguna yang boleh melihat link tersebut.
              </span>
            </div>
            <div className="text-[11px] text-slate-400 shrink-0">
              {editedItems.filter(i => i.isHidden).length} menu disembunyikan
            </div>
          </div>
        )}

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="space-y-3">
            {editedItems.map((item, index) => {
              const currentAllowed = item.allowedRoles || ALL_ROLES.map(r => r.role);
              const isHidden = !!item.isHidden;
              const isAllChecked = currentAllowed.length === ALL_ROLES.length;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all duration-200 p-3.5 ${
                    isHidden
                      ? 'bg-slate-950/70 border-rose-500/30 opacity-75'
                      : 'bg-slate-800/60 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  {/* Top Bar of Card: ID, Status Badges, and Show/Hide Button */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-700/50">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] font-mono text-slate-400 font-bold">
                        #{index + 1}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-white">ID:</span>
                        <code className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-sky-400">
                          {item.id}
                        </code>
                        {item.adminOnly && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            Fitur Core
                          </span>
                        )}
                        {isHidden && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                            <EyeOff className="w-3 h-3" />
                            Disembunyikan dari Sidebar
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Sembunyikan / Tampilkan Toggle Button */}
                    <button
                      type="button"
                      disabled={!canEdit}
                      onClick={() => handleToggleHide(item.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer active:scale-95 disabled:opacity-50 ${
                        isHidden
                          ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                      }`}
                      title={isHidden ? 'Tampilkan kembali di sidebar' : 'Sembunyikan menu ini dari sidebar'}
                    >
                      {isHidden ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Tersembunyi (Klik utk Tampilkan)</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Tampil di Sidebar (Klik utk Sembunyikan)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Input Fields Row: Name and ShortName */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Nama Menu Utama (Sidebar & Breadcrumbs)
                      </label>
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={item.name}
                        onChange={(e) => handleNameChange(item.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        placeholder="Nama menu..."
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Singkatan (Mobile Bottom Bar & Mini-Rail)
                      </label>
                      <input
                        type="text"
                        disabled={!canEdit}
                        value={item.shortName}
                        onChange={(e) => handleShortNameChange(item.id, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg text-sm bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        placeholder="Singkatan..."
                        required
                      />
                    </div>
                  </div>

                  {/* Role Access Checklist Section (Checklist Peran yang Boleh Mengakses) */}
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-xs font-bold text-slate-200">
                          Checklist Peran yang Boleh Mengakses Menu Ini:
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={!canEdit}
                        onClick={() => handleToggleAllRoles(item.id)}
                        className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 transition cursor-pointer disabled:opacity-40"
                      >
                        {isAllChecked ? 'Pilih Hanya Developer' : 'Pilih Semua Peran'}
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {ALL_ROLES.map(({ role, label, badgeColor }) => {
                        const isChecked = currentAllowed.includes(role);
                        const isMandatoryDev = role === 'developer';

                        return (
                          <label
                            key={role}
                            className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer select-none transition ${
                              isChecked
                                ? `${badgeColor} border font-medium`
                                : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
                            } ${!canEdit ? 'opacity-60 cursor-not-allowed' : ''}`}
                          >
                            <input
                              type="checkbox"
                              disabled={!canEdit || isMandatoryDev}
                              checked={isChecked}
                              onChange={() => handleToggleRolePermission(item.id, role)}
                              className="sr-only"
                            />
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 shrink-0 text-sky-400" />
                            ) : (
                              <Square className="w-4 h-4 shrink-0 text-slate-600" />
                            )}
                            <span className="truncate leading-tight">{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <button
              type="button"
              disabled={!canEdit}
              onClick={() => {
                if (window.confirm('Kembalikan semua nama menu, visibilitas (tampilkan semua), dan hak akses ke standar default awal PP1?')) {
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
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition cursor-pointer"
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
