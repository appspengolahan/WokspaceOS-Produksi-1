import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Mail, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Check, 
  AlertCircle,
  KeyRound,
  Shield,
  UserCheck
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface AccessManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserProfile[];
  onUpdateUser: (user: UserProfile) => void;
  onAddUser: (user: Omit<UserProfile, 'id'>) => void;
  onDeleteUser: (userId: string) => void;
  currentUser: UserProfile;
}

export const AccessManagementModal: React.FC<AccessManagementModalProps> = ({
  isOpen,
  onClose,
  users,
  onUpdateUser,
  onAddUser,
  onDeleteUser,
  currentUser,
}) => {
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('staff_operasional');
  const [editRoleTitle, setEditRoleTitle] = useState('');
  const [editDivision, setEditDivision] = useState('');

  // Add new user state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('staff_operasional');
  const [newRoleTitle, setNewRoleTitle] = useState('');
  const [newDivision, setNewDivision] = useState('');

  if (!isOpen) return null;

  // Role permissions check: Developer & Project Manager can manage users
  const canManage = currentUser.role === 'developer' || currentUser.role === 'project_manager' || currentUser.role === 'super_admin';

  const roleLabels: Record<UserRole, { title: string; color: string; badgeBg: string }> = {
    developer: { 
      title: 'Developer / Apps Engineer (Full Akses)', 
      color: 'text-purple-400', 
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40' 
    },
    project_manager: { 
      title: 'Manajer Operasional / Project Manager', 
      color: 'text-sky-400', 
      badgeBg: 'bg-blue-500/20 text-sky-300 border-blue-500/40' 
    },
    super_admin: { 
      title: 'Super Admin Sistem', 
      color: 'text-amber-400', 
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
    },
    kepala_admin_1: { 
      title: 'Kepala Admin 1', 
      color: 'text-rose-400', 
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
    },
    kepala_pengolahan_1: { 
      title: 'Kepala Pengolahan 1 (Cengkeh & Tembakau)', 
      color: 'text-emerald-400', 
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
    },
    kepala_pengolahan_2: { 
      title: 'Kepala Pengolahan 2 (Krosok & Blend)', 
      color: 'text-cyan-400', 
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' 
    },
    staff_operasional: { 
      title: 'Staff Operasional Pabrik', 
      color: 'text-slate-400', 
      badgeBg: 'bg-slate-500/20 text-slate-300 border-slate-500/40' 
    },
  };

  const handleStartEdit = (user: UserProfile) => {
    setEditingUserId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditRoleTitle(user.roleTitle);
    setEditDivision(user.division);
  };

  const handleSaveEdit = (user: UserProfile) => {
    onUpdateUser({
      ...user,
      name: editName,
      email: editEmail,
      role: editRole,
      roleTitle: editRoleTitle || roleLabels[editRole].title,
      division: editDivision || user.division,
      canManageUsers: editRole === 'developer' || editRole === 'project_manager' || editRole === 'super_admin',
      canManageLinks: editRole === 'developer' || editRole === 'project_manager' || editRole === 'super_admin',
    });
    setEditingUserId(null);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newName.trim()) return;

    onAddUser({
      name: newName,
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      roleTitle: newRoleTitle || roleLabels[newRole].title,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      division: newDivision || 'Divisi Produksi 1 (PP1)',
      allowedModules: newRole === 'developer' || newRole === 'project_manager' || newRole === 'super_admin' ? ['all'] : ['single_board', 'stock_monitoring', 'hr_presensi'],
      canManageUsers: newRole === 'developer' || newRole === 'project_manager' || newRole === 'super_admin',
      canManageLinks: newRole === 'developer' || newRole === 'project_manager' || newRole === 'super_admin',
    });

    setNewName('');
    setNewEmail('');
    setNewRole('staff_operasional');
    setNewRoleTitle('');
    setNewDivision('');
    setShowAddForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 border border-blue-500/30 text-sky-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Pengaturan Akses Pengguna & Role PP1
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  RBAC Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Kelola email resmi dan hak akses untuk 7 tingkatan pengguna Divisi Produksi 1 PT Batu Karang
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-slate-50 dark:bg-slate-800/50 px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <KeyRound className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Wewenang Edit: <strong>Developer / Apps Engineer</strong> & <strong>Manajer Operasional</strong> memiliki hak mengedit & menambah email pengguna.
            </span>
          </div>

          {canManage && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Tutup Form' : 'Tambah Pengguna'}</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Add User Form Drawer */}
          {showAddForm && canManage && (
            <form onSubmit={handleCreateUser} className="bg-blue-50/50 dark:bg-slate-800/80 rounded-2xl p-4 border border-blue-200 dark:border-blue-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Daftarkan Pengguna / Email Baru
                </h4>
                <span className="text-[11px] text-blue-600 dark:text-sky-400">
                  Tentukan Email & Tingkat Akses
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Ir. Herman Jaya"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email Pengguna (Google / Perusahaan)
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tingkat Akses (Role)
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => {
                      const r = e.target.value as UserRole;
                      setNewRole(r);
                      setNewRoleTitle(roleLabels[r].title);
                    }}
                    className="w-full px-2.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="developer">1. Developer/Apps Engineer (Full Akses)</option>
                    <option value="project_manager">2. Manajer Operasional/Project Manager</option>
                    <option value="super_admin">3. Super Admin</option>
                    <option value="kepala_admin_1">4. Kepala Admin 1</option>
                    <option value="kepala_pengolahan_1">5. Kepala Pengolahan 1 (Cengkeh & Tembakau)</option>
                    <option value="kepala_pengolahan_2">6. Kepala Pengolahan 2 (Krosok & Blend)</option>
                    <option value="staff_operasional">7. Staff Operasional</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          )}

          {/* User Table / List */}
          <div className="space-y-2.5">
            {users.map((user) => {
              const isEditing = editingUserId === user.id;
              const roleMeta = roleLabels[user.role] || roleLabels.staff_operasional;

              return (
                <div
                  key={user.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isEditing 
                      ? 'bg-blue-50/80 dark:bg-slate-800/90 border-blue-500 shadow-md' 
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  {isEditing ? (
                    /* Inline Editing Mode */
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Role Akses
                          </label>
                          <select
                            value={editRole}
                            onChange={(e) => {
                              const r = e.target.value as UserRole;
                              setEditRole(r);
                              setEditRoleTitle(roleLabels[r].title);
                            }}
                            className="w-full px-2 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                          >
                            <option value="developer">1. Developer/Apps Engineer (Full Akses)</option>
                            <option value="project_manager">2. Manajer Operasional/Project Manager</option>
                            <option value="super_admin">3. Super Admin</option>
                            <option value="kepala_admin_1">4. Kepala Admin 1</option>
                            <option value="kepala_pengolahan_1">5. Kepala Pengolahan 1 (Cengkeh & Tembakau)</option>
                            <option value="kepala_pengolahan_2">6. Kepala Pengolahan 2 (Krosok & Blend)</option>
                            <option value="staff_operasional">7. Staff Operasional</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-200 dark:border-slate-700">
                        <button
                          type="button"
                          onClick={() => setEditingUserId(null)}
                          className="px-3 py-1 rounded-lg text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                        >
                          Batal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(user)}
                          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Simpan Perubahan</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xs font-bold text-white shadow-xs shrink-0">
                          {user.name.charAt(0)}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                              {user.name}
                            </h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${roleMeta.badgeBg}`}>
                              {roleMeta.title}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 font-mono text-[11px] text-sky-600 dark:text-sky-400">
                              <Mail className="w-3 h-3 text-slate-400" />
                              {user.email || 'Email belum diisi'}
                            </span>
                            <span>•</span>
                            <span className="text-[11px]">{user.division}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-center">
                        {canManage && (
                          <button
                            onClick={() => handleStartEdit(user)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                            title="Edit email & role"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                            <span className="hidden sm:inline">Ubah</span>
                          </button>
                        )}

                        {canManage && users.length > 1 && (
                          <button
                            onClick={() => {
                              if (confirm(`Hapus pengguna ${user.name} (${user.email})?`)) {
                                onDeleteUser(user.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition cursor-pointer"
                            title="Hapus pengguna"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="text-slate-500 dark:text-slate-400">
            Total Terdaftar: <strong className="text-slate-800 dark:text-slate-200">{users.length} Akun</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-medium bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
