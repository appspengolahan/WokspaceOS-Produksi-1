import React, { useState, useMemo } from 'react';
import { 
  Boxes, 
  ArrowLeftRight, 
  AlertTriangle, 
  Plus, 
  Download, 
  Filter, 
  Search, 
  CheckCircle2, 
  Clock, 
  Warehouse,
  Droplets,
  Layers,
  ExternalLink,
  Globe,
  Maximize2,
  Minimize2,
  RefreshCw,
  LayoutDashboard,
  Bot
} from 'lucide-react';
import { StockItem, StockMutation, UserRole } from '../../types';

interface StockMonitoringViewProps {
  stockItems: StockItem[];
  mutations: StockMutation[];
  onAddMutation: (mutation: Omit<StockMutation, 'id' | 'date'>) => void;
  onUpdateStock: (updatedItem: StockItem) => void;
  userRole: UserRole;
  onOpenGasModal: () => void;
  vercelUrl?: string;
  onNavigateToAIBot?: () => void;
}

export const StockMonitoringView: React.FC<StockMonitoringViewProps> = ({
  stockItems,
  mutations,
  onAddMutation,
  userRole,
  onOpenGasModal,
  vercelUrl = 'https://monitoring-stock-pp-1-pro-api.vercel.app/',
  onNavigateToAIBot,
}) => {
  const [displaySource, setDisplaySource] = useState<'vercel_live' | 'portal_native'>('vercel_live');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'mutations'>('inventory');
  const [showAddMutationModal, setShowAddMutationModal] = useState(false);

  // New mutation form state
  const [selectedStockId, setSelectedStockId] = useState(stockItems[0]?.id || '');
  const [mutationType, setMutationType] = useState<'MASUK' | 'KELUAR' | 'TRANSFER_INTERNAL'>('MASUK');
  const [quantityKg, setQuantityKg] = useState<number>(1000);
  const [sourceLoc, setSourceLoc] = useState('Pemasok Rekanan');
  const [destLoc, setDestLoc] = useState('Gudang A (Bahan Baku)');
  const [operatorName, setOperatorName] = useState('Slamet Riyadi');
  const [batchNo, setBatchNo] = useState(`LOT-${Date.now().toString().slice(-6)}`);
  const [notes, setNotes] = useState('');

  // Analytics Metrics
  const totalStockKg = useMemo(() => {
    return stockItems.reduce((acc, curr) => acc + curr.currentStockKg, 0);
  }, [stockItems]);

  const tembakauStockKg = useMemo(() => {
    return stockItems
      .filter(s => s.category === 'Tembakau' || s.category === 'Tembakau Blend')
      .reduce((acc, curr) => acc + curr.currentStockKg, 0);
  }, [stockItems]);

  const cengkehStockKg = useMemo(() => {
    return stockItems
      .filter(s => s.category === 'Cengkeh')
      .reduce((acc, curr) => acc + curr.currentStockKg, 0);
  }, [stockItems]);

  const krosokStockKg = useMemo(() => {
    return stockItems
      .filter(s => s.category === 'Krosok')
      .reduce((acc, curr) => acc + curr.currentStockKg, 0);
  }, [stockItems]);

  const criticalItems = useMemo(() => {
    return stockItems.filter(s => s.status === 'Kritis' || s.status === 'Menipis');
  }, [stockItems]);

  // Filtered Stock Table
  const filteredStock = useMemo(() => {
    return stockItems.filter(item => {
      const matchCat = selectedCategory === 'Semua' || item.category === selectedCategory;
      const matchWh = selectedWarehouse === 'Semua' || item.warehouse === selectedWarehouse;
      const matchSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchWh && matchSearch;
    });
  }, [stockItems, selectedCategory, selectedWarehouse, searchQuery]);

  const handleCreateMutation = (e: React.FormEvent) => {
    e.preventDefault();
    const item = stockItems.find(s => s.id === selectedStockId);
    if (!item) return;

    onAddMutation({
      stockItemId: item.id,
      materialName: item.name,
      type: mutationType,
      quantityKg: Number(quantityKg),
      source: sourceLoc,
      destination: destLoc,
      batchNumber: batchNo,
      operator: operatorName,
      notes: notes || 'Pencatatan mutasi operasional gudang PP1'
    });

    setShowAddMutationModal(false);
    setNotes('');
  };

  const exportStockCSV = () => {
    const headers = ['SKU', 'Nama Bahan', 'Kategori', 'Gudang', 'Stok (Kg)', 'Threshold (Kg)', 'Status', 'Kadar Air MC %'];
    const rows = stockItems.map(s => [
      s.sku,
      `"${s.name}"`,
      s.category,
      `"${s.warehouse}"`,
      s.currentStockKg,
      s.minStockThresholdKg,
      s.status,
      `${s.moistureContentAvg}%`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Stock_PP1_BatuKarang_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white">
              PP1 - INVENTORY
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Vercel Live API Connected</span>
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
            Monitoring Stock & Rekap Persediaan Bahan Baku
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher: Vercel Live App vs Portal Native View */}
          <div className="flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setDisplaySource('vercel_live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                displaySource === 'vercel_live'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Vercel Live App</span>
            </button>
            <button
              onClick={() => setDisplaySource('portal_native')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                displaySource === 'portal_native'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Tampilan Portal</span>
            </button>
          </div>

          {onNavigateToAIBot && (
            <button
              onClick={onNavigateToAIBot}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 text-sky-400 border border-sky-500/30 transition cursor-pointer shadow-xs active:scale-95"
              title="Audit rekonsiliasi data mutasi stok ini dengan rekap proses tembakau"
            >
              <Bot className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <span>Verifikasi AI</span>
            </button>
          )}

          <a
            href={vercelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            title="Buka di Tab Baru"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Buka Tab</span>
          </a>

          {displaySource === 'portal_native' && (
            <>
              <button
                onClick={exportStockCSV}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Ekspor CSV</span>
              </button>

              <button
                onClick={() => setShowAddMutationModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Catat Mutasi Stok</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* EMBEDDED VERCEL LIVE APPLICATION */}
      {displaySource === 'vercel_live' && (
        <div 
          className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${
            isExpanded 
              ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
              : 'rounded-2xl'
          }`}
        >
          {/* Sub-header for the embedded frame */}
          <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">Modul Live:</span>
              <span className="font-mono text-sky-400 truncate max-w-xs md:max-w-md">
                {vercelUrl}
              </span>
              {isExpanded && (
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-blue-600/30 text-sky-300 text-[10px] font-semibold border border-blue-500/40">
                  Mode Layar Penuh (Maximized Workspace)
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsIframeLoading(true);
                  setIframeKey(prev => prev + 1);
                }}
                className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition"
                title="Muat Ulang Frame"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isIframeLoading ? 'animate-spin' : ''}`} />
              </button>

              {/* In-Workspace Maximize / Restore Toggle */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer shadow-xs"
                title={isExpanded ? 'Kecilkan Frame (Restore)' : 'Maksimalkan Modul (Layar Penuh Workspace)'}
              >
                {isExpanded ? (
                  <>
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Perkecil</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>Layar Penuh</span>
                  </>
                )}
              </button>

              <a
                href={vercelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                title="Buka Tab Baru (External)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Iframe Viewport Container */}
          <div 
            style={{ minHeight: isExpanded ? 'calc(100vh - 46px)' : '900px', height: isExpanded ? 'calc(100vh - 46px)' : '900px' }}
            className="relative w-full bg-slate-950 flex-1 overflow-hidden"
          >
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white z-10 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
                <p className="text-xs font-medium">Memuat Modul Monitoring Stock Live Vercel...</p>
                <span className="text-[11px] text-slate-400">{vercelUrl}</span>
              </div>
            )}
            <iframe
              key={iframeKey}
              src={vercelUrl}
              title="Monitoring Stock Persediaan Bahan Baku PP1 - Live Vercel"
              className="w-full h-full border-0 block"
              style={{ width: '100%', height: '100%', minHeight: isExpanded ? 'calc(100vh - 46px)' : '900px' }}
              onLoad={() => setIsIframeLoading(false)}
              allow="camera; microphone; geolocation"
            />
          </div>
        </div>
      )}

      {/* PORTAL NATIVE VIEW (Rendered when toggled to Tampilan Portal) */}
      {displaySource === 'portal_native' && (
        <>

      {/* Real-time Analytics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total Stock */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Total Persediaan PP1</span>
            <Boxes className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {totalStockKg.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">KG</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Kapasitas Gudang 78%</span>
          </div>
        </div>

        {/* Tembakau & Blend */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Tembakau & Blend</span>
            <Layers className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {tembakauStockKg.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">KG</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Kasturi, Madura & Racikan Gold
          </div>
        </div>

        {/* Cengkeh */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Cengkeh Zanzibar & Madura</span>
            <Droplets className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {cengkehStockKg.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">KG</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            MC Rata-rata 13.0% (Ideal)
          </div>
        </div>

        {/* Krosok */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-2">
            <span>Krosok Boyolali / Temanggung</span>
            <Warehouse className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {krosokStockKg.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">KG</span>
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            <span>{criticalItems.length} SKU Perlu Restock</span>
          </div>
        </div>
      </div>

      {/* Threshold Alerts Banner (if any) */}
      {criticalItems.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-amber-900 dark:text-amber-200">
              Peringatan Stok Minimum (Safety Stock Threshold):
            </span>
            <div className="text-amber-800 dark:text-amber-300 flex flex-wrap gap-2 pt-0.5">
              {criticalItems.map(item => (
                <span key={item.id} className="bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded border border-amber-300 dark:border-amber-700/80 font-medium">
                  {item.name}: <strong>{item.currentStockKg.toLocaleString('id-ID')} KG</strong> (Min: {item.minStockThresholdKg.toLocaleString('id-ID')} KG)
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tabs and Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          {/* View Segmented Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'inventory'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Master Stock ({stockItems.length})
            </button>
            <button
              onClick={() => setActiveTab('mutations')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'mutations'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Log Mutasi ({mutations.length})
            </button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari SKU atau bahan..."
                className="pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="Semua">Semua Kategori</option>
              <option value="Cengkeh">Cengkeh</option>
              <option value="Tembakau">Tembakau</option>
              <option value="Krosok">Krosok</option>
              <option value="Tembakau Blend">Tembakau Blend</option>
            </select>

            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="Semua">Semua Gudang</option>
              <option value="Gudang A (Bahan Baku)">Gudang A</option>
              <option value="Gudang B (Sortir & Fermentasi)">Gudang B</option>
              <option value="Gudang C (Blending)">Gudang C</option>
            </select>
          </div>
        </div>

        {/* Tab Content: Master Stock Table */}
        {activeTab === 'inventory' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3">Nama Bahan Baku</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Lokasi Gudang</th>
                  <th className="py-2.5 px-3 text-right">Stok Aktual</th>
                  <th className="py-2.5 px-3 text-right">Batas Min</th>
                  <th className="py-2.5 px-3 text-center">Kadar Air</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredStock.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono font-medium text-slate-500 dark:text-slate-400">
                      {item.sku}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.qualityGrade}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {item.warehouse}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {item.currentStockKg.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400">KG</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-500 tabular-nums">
                      {item.minStockThresholdKg.toLocaleString('id-ID')} KG
                    </td>
                    <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {item.moistureContentAvg}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === 'Aman'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : item.status === 'Menipis'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Tab Content: Mutations Log Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Tanggal / Jam</th>
                  <th className="py-2.5 px-3">Bahan Baku</th>
                  <th className="py-2.5 px-3">Tipe Mutasi</th>
                  <th className="py-2.5 px-3 text-right">Jumlah</th>
                  <th className="py-2.5 px-3">Asal → Tujuan</th>
                  <th className="py-2.5 px-3">No. Batch / WO</th>
                  <th className="py-2.5 px-3">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {mutations.map((mut) => (
                  <tr key={mut.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono">
                      {mut.date}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {mut.materialName}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        mut.type === 'MASUK'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : mut.type === 'KELUAR'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                      }`}>
                        {mut.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {mut.type === 'MASUK' ? '+' : mut.type === 'KELUAR' ? '-' : ''}
                      {mut.quantityKg.toLocaleString('id-ID')} KG
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {mut.source} <span className="text-slate-400">→</span> {mut.destination}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-500">
                      {mut.batchNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                      {mut.operator}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Mutation Modal */}
      {showAddMutationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Catat Transaksi Mutasi Stok PP1
              </h3>
              <button 
                onClick={() => setShowAddMutationModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMutation} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Pilih Bahan Baku
                </label>
                <select
                  value={selectedStockId}
                  onChange={(e) => setSelectedStockId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {stockItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.sku} - {item.name} (Sisa: {item.currentStockKg.toLocaleString('id-ID')} KG)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Mutasi
                  </label>
                  <select
                    value={mutationType}
                    onChange={(e) => setMutationType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="MASUK">MASUK (Penerimaan)</option>
                    <option value="KELUAR">KELUAR (Pengiriman / Produksi)</option>
                    <option value="TRANSFER_INTERNAL">TRANSFER ANTAR GUDANG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Jumlah (KG)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Asal / Sumber
                  </label>
                  <input
                    type="text"
                    value={sourceLoc}
                    onChange={(e) => setSourceLoc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tujuan
                  </label>
                  <input
                    type="text"
                    value={destLoc}
                    onChange={(e) => setDestLoc(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Batch / Surat Jalan
                  </label>
                  <input
                    type="text"
                    value={batchNo}
                    onChange={(e) => setBatchNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Petugas / Operator
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    onChange={(e) => setOperatorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Keterangan mutu, kondisi karung, kadar air..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddMutationModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
