import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Search, 
  Plus, 
  CheckCircle2, 
  Package
} from 'lucide-react';
import { CRMClientRecord, UserRole } from '../../types';

interface CRMClientsViewProps {
  clients: CRMClientRecord[];
  onAddClient: (client: Omit<CRMClientRecord, 'id'>) => void;
  userRole: UserRole;
}

export const CRMClientsView: React.FC<CRMClientsViewProps> = ({
  clients,
  onAddClient,
  userRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [category, setCategory] = useState<CRMClientRecord['category']>('Mitra Pembeli');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [activeContracts, setActiveContracts] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchCat = selectedCategoryFilter === 'Semua' || c.category === selectedCategoryFilter;
      const matchSearch =
        c.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [clients, selectedCategoryFilter, searchQuery]);

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    onAddClient({
      companyName,
      contactPerson,
      category,
      phone,
      email,
      location,
      activeContracts: activeContracts || 'Kontrak reguler pengolahan hasil panen',
      totalVolumeDeliveredKg: 0,
      status: 'Aktif'
    });

    setShowAddModal(false);
    setCompanyName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setLocation('');
    setActiveContracts('');
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-600 text-white">
              PP1 - CRM & MITRA INDUSTRI
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Direktori Pabrik Rokok Mitra, Pemasok & Rekanan
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
            CRM Clients Hub & Manajemen Mitra
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mitra Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Client Cards Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama perusahaan atau kota..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Mitra Pembeli">Mitra Pembeli</option>
              <option value="Pemasok Bahan Baku">Pemasok Bahan Baku</option>
              <option value="Distributor">Distributor</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3 flex flex-col justify-between hover:shadow-xs transition"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {client.companyName}
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                    {client.status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>PIC: {client.contactPerson}</span>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{client.location}</span>
                </div>

                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{client.phone}</span>
                </div>

                <div className="pt-2 text-xs font-medium text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Kontrak Aktif</div>
                  <div className="mt-0.5">{client.activeContracts}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="text-slate-500">Volume Terkirim:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                  {client.totalVolumeDeliveredKg.toLocaleString('id-ID')} KG
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daftarkan Mitra Klien Baru
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nama Perusahaan Mitra
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Contoh: PT Kretek Jaya Nusantara"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    PIC / Contact Person
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Nama penanggung jawab..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Mitra
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Mitra Pembeli">Mitra Pembeli</option>
                    <option value="Pemasok Bahan Baku">Pemasok Bahan Baku</option>
                    <option value="Distributor">Distributor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="031-xxx / 0812-xxx"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Lokasi Pabrik / Gudang
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Contoh: Kudus, Jawa Tengah"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Rincian Kontrak Kerjasama
                </label>
                <textarea
                  rows={2}
                  value={activeContracts}
                  onChange={(e) => setActiveContracts(e.target.value)}
                  placeholder="Kebutuhan tonase suplai bulanan, spesifikasi kadar air, termin pembayaran..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Simpan Mitra
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
