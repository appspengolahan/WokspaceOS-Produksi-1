import React, { useState, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  FileCheck,
  ShieldAlert
} from 'lucide-react';
import { PurchaseRequestRecord, UserRole } from '../../types';

interface PurchaseRequestViewProps {
  requests: PurchaseRequestRecord[];
  onAddRequest: (req: Omit<PurchaseRequestRecord, 'id'>) => void;
  onApproveRequest: (id: string, approverName: string) => void;
  userRole: UserRole;
  currentUserName: string;
}

export const PurchaseRequestView: React.FC<PurchaseRequestViewProps> = ({
  requests,
  onAddRequest,
  onApproveRequest,
  userRole,
  currentUserName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('Semua');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const nextSppNo = `SPP/PP1/2026/09/${(requests.length + 10).toString().padStart(3, '0')}`;
  const [sppNumber, setSppNumber] = useState(nextSppNo);
  const [requesterName, setRequesterName] = useState(currentUserName);
  const [department, setDepartment] = useState('Divisi Produksi 1 - Lini Perajangan');
  const [priority, setPriority] = useState<PurchaseRequestRecord['priority']>('Penting');
  const [itemDescription, setItemDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('Unit / Set');
  const [estimatedCostIdr, setEstimatedCostIdr] = useState<number>(5000000);
  const [purpose, setPurpose] = useState('');

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchStatus = selectedStatusFilter === 'Semua' || req.status === selectedStatusFilter;
      const matchSearch = 
        req.sppNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.itemDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requesterName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [requests, selectedStatusFilter, searchQuery]);

  const totalCostPending = useMemo(() => {
    return requests
      .filter(r => r.status === 'Menunggu Approval')
      .reduce((acc, curr) => acc + curr.estimatedCostIdr, 0);
  }, [requests]);

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemDescription.trim()) return;

    onAddRequest({
      sppNumber,
      date: new Date().toISOString().slice(0, 10),
      requesterName,
      department,
      priority,
      itemDescription,
      quantity: Number(quantity),
      unit,
      estimatedCostIdr: Number(estimatedCostIdr),
      purpose: purpose || 'Kebutuhan operasional mesin pabrik PP1',
      status: 'Menunggu Approval'
    });

    setShowAddModal(false);
    setItemDescription('');
    setPurpose('');
    setSppNumber(`SPP/PP1/2026/09/${(requests.length + 11).toString().padStart(3, '0')}`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-600 text-white">
              PP1 - PROCUREMENT (SPP)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Workflow Pengajuan & Persetujuan Barang Suku Cadang Mesin
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
            Surat Permintaan Pembelian (SPP) & Pengadaan
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajukan SPP Baru</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Pengajuan SPP</span>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums">
            {requests.length} Berkas
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Menunggu Approval</span>
          <div className="text-xl md:text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 tabular-nums">
            {requests.filter(r => r.status === 'Menunggu Approval').length} SPP
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Disetujui Manajer</span>
          <div className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">
            {requests.filter(r => r.status === 'Disetujui Manajer' || r.status === 'Proses Pengadaan PO').length} SPP
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Estimasi Pending (IDR)</span>
          <div className="text-base md:text-lg font-black text-blue-600 dark:text-sky-400 mt-1 tabular-nums truncate">
            Rp {totalCostPending.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor SPP atau deskripsi..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="Semua">Semua Status SPP</option>
              <option value="Menunggu Approval">Menunggu Approval</option>
              <option value="Disetujui Manajer">Disetujui Manajer</option>
              <option value="Proses Pengadaan PO">Proses Pengadaan PO</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">No. SPP</th>
                <th className="py-2.5 px-3">Tanggal / Pemohon</th>
                <th className="py-2.5 px-3">Deskripsi Barang</th>
                <th className="py-2.5 px-3 text-center">Jumlah</th>
                <th className="py-2.5 px-3 text-right">Estimasi Biaya</th>
                <th className="py-2.5 px-3 text-center">Prioritas</th>
                <th className="py-2.5 px-3 text-center">Status Workflow</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    {req.sppNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{req.requesterName}</div>
                    <div className="text-[11px] text-slate-400">{req.date} · {req.department}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{req.itemDescription}</div>
                    <div className="text-[11px] text-slate-500">{req.purpose}</div>
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-medium text-slate-800 dark:text-slate-200">
                    {req.quantity} {req.unit}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    Rp {req.estimatedCostIdr.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.priority === 'Darurat / Cito'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : req.priority === 'Penting'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.status === 'Disetujui Manajer' || req.status === 'Proses Pengadaan PO'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {req.status}
                    </span>
                    {req.approvedBy && (
                      <div className="text-[10px] text-slate-400 mt-0.5">by {req.approvedBy}</div>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right">
                    {req.status === 'Menunggu Approval' && userRole !== 'staff_operasional' ? (
                      <button
                        onClick={() => onApproveRequest(req.id, currentUserName)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition cursor-pointer shadow-xs"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Setujui</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Terverifikasi</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SPP Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-blue-500" />
                <span>Pengajuan SPP (Surat Permintaan Pembelian)</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    No. Dokumen SPP
                  </label>
                  <input
                    type="text"
                    value={sppNumber}
                    onChange={(e) => setSppNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tingkat Prioritas
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Darurat / Cito">Darurat / Cito</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Barang / Sparepart / Material
                </label>
                <input
                  type="text"
                  required
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  placeholder="Contoh: Pisau Rotary Cutter TC-01 Baja HSS 400mm"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Satuan
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Estimasi (IDR)
                  </label>
                  <input
                    type="number"
                    step="100000"
                    value={estimatedCostIdr}
                    onChange={(e) => setEstimatedCostIdr(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Tujuan & Alasan Kebutuhan
                </label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Penjelasan urgensi penggantian atau kebutuhan lini produksi..."
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
                  Kirim Pengajuan SPP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
