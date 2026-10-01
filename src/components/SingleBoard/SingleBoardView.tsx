import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ExternalLink, 
  Plus, 
  Grid3X3, 
  List, 
  Sparkles,
  ArrowRight,
  Database,
  FileSpreadsheet
} from 'lucide-react';
import { AppRegistryItem, UserRole } from '../../types';

interface SingleBoardViewProps {
  apps: AppRegistryItem[];
  onOpenApp: (app: AppRegistryItem) => void;
  userRole: UserRole;
  onOpenGasModal: () => void;
  onAddNewApp: (newApp: Partial<AppRegistryItem>) => void;
}

export const SingleBoardView: React.FC<SingleBoardViewProps> = ({
  apps,
  onOpenApp,
  userRole,
  onOpenGasModal,
  onAddNewApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua Kategori');
  const [selectedVisibility, setSelectedVisibility] = useState<string>('Semua Visibility');
  const [selectedStatus, setSelectedStatus] = useState<string>('Semua Status');
  const [layoutMode, setLayoutMode] = useState<'list' | 'grid'>('list');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for adding new app
  const [newAppName, setNewAppName] = useState('');
  const [newAppDesc, setNewAppDesc] = useState('');
  const [newAppCat, setNewAppCat] = useState<string>('Persediaan & Stok');
  const [newAppVis, setNewAppVis] = useState<'Internal Divisi' | 'Manajemen' | 'Publik'>('Internal Divisi');
  const [newAppPic, setNewAppPic] = useState('Manajer Operasional / Lalu M.');

  // Categories list
  const categories = [
    'Semua Kategori',
    'Persediaan & Stok',
    'Data Proses Produksi',
    'Administrasi & Surat',
    'HR & Ketenagakerjaan',
    'Pengadaan & SPP',
    'CRM & Mitra'
  ];

  const visibilities = ['Semua Visibility', 'Internal Divisi', 'Manajemen', 'Publik'];
  const statuses = ['Semua Status', 'Aktif', 'Pemeliharaan', 'Pengembangan'];

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Role check
      if (app.adminOnly && userRole === 'staff_operasional') {
        return false;
      }

      // Search match
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.pic.toLowerCase().includes(query) ||
        app.category.toLowerCase().includes(query);

      // Filter matches
      const matchesCategory = selectedCategory === 'Semua Kategori' || app.category === selectedCategory;
      const matchesVisibility = selectedVisibility === 'Semua Visibility' || app.visibility === selectedVisibility;
      const matchesStatus = selectedStatus === 'Semua Status' || app.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesVisibility && matchesStatus;
    });
  }, [apps, userRole, searchQuery, selectedCategory, selectedVisibility, selectedStatus]);

  // Statistics
  const totalEntries = apps.length;
  const activeCount = apps.filter((a) => a.status === 'Aktif').length;
  const adminOnlyCount = apps.filter((a) => a.adminOnly).length;

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim()) return;

    onAddNewApp({
      name: newAppName.toUpperCase(),
      description: newAppDesc || 'Aplikasi operasional Divisi Produksi 1 PT Batu Karang',
      category: newAppCat as any,
      visibility: newAppVis,
      status: 'Aktif',
      pic: newAppPic,
      moduleId: 'single_board',
      sheetTabName: `Sheet_${Date.now()}`
    });

    setNewAppName('');
    setNewAppDesc('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Filter and Search Bar Section (Matching user's reference UI) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 md:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Field */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau deskripsi app..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Kategori Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Visibility Dropdown */}
          <div>
            <select
              value={selectedVisibility}
              onChange={(e) => setSelectedVisibility(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {visibilities.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          {/* Status Dropdown */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Counter Metric Cards (Matching user's reference UI) */}
        <div className="grid grid-cols-3 sm:grid-cols-3 md:w-80 gap-3 pt-2">
          {/* Total Entri */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/60 text-center sm:text-left">
            <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {totalEntries}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Total Entri
            </div>
          </div>

          {/* Aktif */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/60 text-center sm:text-left">
            <div className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
              {activeCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Aktif
            </div>
          </div>

          {/* Admin Only */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700/60 text-center sm:text-left">
            <div className="text-xl md:text-2xl font-black text-rose-600 dark:text-rose-400 tabular-nums tracking-tight">
              {adminOnlyCount}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Admin Only
            </div>
          </div>
        </div>
      </div>

      {/* Main Apps Header with Layout & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            WEB APPS ({filteredApps.length})
          </h2>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            · Ekosistem Aplikasi Divisi Produksi 1
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout Toggle */}
          <div className="flex items-center bg-slate-200/70 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded-md text-xs transition ${
                layoutMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tampilan Tabel / List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded-md text-xs transition ${
                layoutMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Tampilan Kartu / Grid"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>

          {/* Super Admin Add Button */}
          {userRole !== 'staff_operasional' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah App</span>
            </button>
          )}

          {/* GAS V2 Router Quick Trigger */}
          <button
            onClick={onOpenGasModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition cursor-pointer"
            title="Koneksi Google Spreadsheet V2"
          >
            <Database className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">Koneksi Sheets</span>
          </button>
        </div>
      </div>

      {/* List / Table Mode (Authentic match to user's screenshot) */}
      {layoutMode === 'list' ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredApps.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-medium">Tidak ada aplikasi yang cocok dengan kriteria pencarian.</p>
              <p className="text-xs text-slate-400 mt-1">Coba ubah filter kategori, visibility, atau kata kunci.</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div 
                key={app.id} 
                className="p-4 md:px-6 md:py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors group"
              >
                {/* Left: Title, Description, and Badges */}
                <div className="space-y-1.5 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 
                      onClick={() => onOpenApp(app)}
                      className="text-xs md:text-sm font-bold text-slate-900 dark:text-white tracking-wide cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition"
                    >
                      {app.name}
                    </h3>

                    {/* Status Badge */}
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/80">
                      {app.status}
                    </span>

                    {/* App Type */}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                      Web App
                    </span>

                    {/* Visibility Tag */}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                      {app.visibility}
                    </span>

                    {app.externalUrl && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:border-sky-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                        <span>Live Vercel</span>
                      </span>
                    )}

                    {app.statsKpi && (
                      <span className="text-[10px] text-blue-600 dark:text-sky-400 font-semibold hidden lg:inline">
                        · {app.statsKpi}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-2xl">
                    {app.description}
                  </p>
                </div>

                {/* Right: Author / PIC and Action Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                    {app.pic}
                  </span>

                  {app.externalUrl && (
                    <a
                      href={app.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      title="Buka Langsung di Vercel (Tab Baru)"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={() => onOpenApp(app)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 active:scale-95 text-white transition-all shadow-xs cursor-pointer"
                  >
                    <span>Buka</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Grid Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 
                    onClick={() => onOpenApp(app)}
                    className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition cursor-pointer"
                  >
                    {app.name}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {app.status}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                  {app.description}
                </p>

                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {app.category}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {app.visibility}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 truncate max-w-[150px]">
                  {app.pic}
                </span>

                <button
                  onClick={() => onOpenApp(app)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                >
                  <span>Buka</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New App Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Daftarkan Web App / Modul Baru PP1
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Tambahkan entri sistem ke dalam Master Single Board Apps Divisi Produksi 1.
            </p>

            <form onSubmit={handleCreateApp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nama Aplikasi (Kapital)
                </label>
                <input
                  type="text"
                  required
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="Contoh: MONITORING LOGISTIK & GUDANG C"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Modul
                </label>
                <textarea
                  rows={2}
                  value={newAppDesc}
                  onChange={(e) => setNewAppDesc(e.target.value)}
                  placeholder="Penjelasan fungsi dan operasional modul..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Kategori
                  </label>
                  <select
                    value={newAppCat}
                    onChange={(e) => setNewAppCat(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {categories.filter(c => c !== 'Semua Kategori').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Hak Akses / Visibility
                  </label>
                  <select
                    value={newAppVis}
                    onChange={(e) => setNewAppVis(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="Internal Divisi">Internal Divisi</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Publik">Publik</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Penanggung Jawab (PIC)
                </label>
                <input
                  type="text"
                  value={newAppPic}
                  onChange={(e) => setNewAppPic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition shadow-sm"
                >
                  Simpan Entri
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
