import React, { useState, useMemo } from 'react';
import { 
  Flower2, 
  Leaf, 
  Layers, 
  Shuffle, 
  Plus, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Percent,
  Sliders,
  Filter,
  Globe,
  LayoutDashboard,
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import { ProcessBatchRecord, UserRole } from '../../types';

interface ProcessDataViewProps {
  initialProcessType?: 'Cengkeh' | 'Tembakau' | 'Krosok' | 'Blend';
  processRecords: ProcessBatchRecord[];
  onAddProcessRecord: (record: Omit<ProcessBatchRecord, 'id'>) => void;
  userRole: UserRole;
  onOpenGasModal: () => void;
  tembakauVercelUrl?: string;
}

export const ProcessDataView: React.FC<ProcessDataViewProps> = ({
  initialProcessType = 'Tembakau',
  processRecords,
  onAddProcessRecord,
  userRole,
  onOpenGasModal,
  tembakauVercelUrl,
}) => {
  const [selectedType, setSelectedType] = useState<'Cengkeh' | 'Tembakau' | 'Krosok' | 'Blend'>(initialProcessType);
  const [displaySource, setDisplaySource] = useState<'vercel_live' | 'portal_native'>(
    tembakauVercelUrl && initialProcessType === 'Tembakau' ? 'vercel_live' : 'portal_native'
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isIframeLoading, setIsIframeLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedShiftFilter, setSelectedShiftFilter] = useState<string>('Semua');

  // Form states
  const [batchCode, setBatchCode] = useState(`PRC-${selectedType.toUpperCase()}-${Date.now().toString().slice(-4)}`);
  const [shift, setShift] = useState<'Shift 1 (Pagi)' | 'Shift 2 (Sore)' | 'Shift 3 (Malam)'>('Shift 1 (Pagi)');
  const [inputRawKg, setInputRawKg] = useState<number>(2500);
  const [outputProcessedKg, setOutputProcessedKg] = useState<number>(2350);
  const [moisturePercent, setMoisturePercent] = useState<number>(13.2);
  const [machineLine, setMachineLine] = useState('Rotary Cutter TC-01');
  const [foreman, setForeman] = useState('Budi Santoso');
  const [qcStatus, setQcStatus] = useState<'Lolos QC' | 'Karantina' | 'Rework' | 'Dalam Proses'>('Lolos QC');
  const [notes, setNotes] = useState('');

  // Auto calculate rendemen in form
  const calculatedRendemen = useMemo(() => {
    if (!inputRawKg || inputRawKg <= 0) return 0;
    return Number(((outputProcessedKg / inputRawKg) * 100).toFixed(2));
  }, [inputRawKg, outputProcessedKg]);

  // Filtered by active process type
  const recordsForType = useMemo(() => {
    return processRecords.filter(r => {
      const matchType = r.processType === selectedType;
      const matchShift = selectedShiftFilter === 'Semua' || r.shift === selectedShiftFilter;
      return matchType && matchShift;
    });
  }, [processRecords, selectedType, selectedShiftFilter]);

  // Analytics for active process type
  const totalInputRaw = useMemo(() => {
    return recordsForType.reduce((acc, curr) => acc + curr.inputRawKg, 0);
  }, [recordsForType]);

  const totalOutputProcessed = useMemo(() => {
    return recordsForType.reduce((acc, curr) => acc + curr.outputProcessedKg, 0);
  }, [recordsForType]);

  const averageRendemen = useMemo(() => {
    if (!totalInputRaw || totalInputRaw <= 0) return 0;
    return Number(((totalOutputProcessed / totalInputRaw) * 100).toFixed(2));
  }, [totalInputRaw, totalOutputProcessed]);

  const averageMoisture = useMemo(() => {
    if (recordsForType.length === 0) return 0;
    const sum = recordsForType.reduce((acc, curr) => acc + curr.moisturePercent, 0);
    return Number((sum / recordsForType.length).toFixed(1));
  }, [recordsForType]);

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProcessRecord({
      processType: selectedType,
      batchCode,
      date: new Date().toISOString().slice(0, 10),
      shift,
      inputRawKg: Number(inputRawKg),
      outputProcessedKg: Number(outputProcessedKg),
      rendemenPercent: calculatedRendemen,
      moisturePercent: Number(moisturePercent),
      machineLine,
      foreman,
      qcStatus,
      notes: notes || `Data proses ${selectedType} PP1`
    });

    setShowAddModal(false);
    setNotes('');
  };

  const getProcessIcon = (type: string) => {
    switch (type) {
      case 'Cengkeh': return <Flower2 className="w-4 h-4 text-emerald-500" />;
      case 'Tembakau': return <Leaf className="w-4 h-4 text-amber-500" />;
      case 'Krosok': return <Layers className="w-4 h-4 text-sky-500" />;
      case 'Blend': return <Shuffle className="w-4 h-4 text-purple-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation Switcher between Process Types */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-600 text-white">
              PP1 - PROSES PRODUKSI
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Tahap Fase 2: Monitoring Rekap Data Pengolahan
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
            Rekap Data Proses: {selectedType.toUpperCase()}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedType === 'Tembakau' && tembakauVercelUrl && (
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
          )}

          {selectedType === 'Tembakau' && tembakauVercelUrl && (
            <a
              href={tembakauVercelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
              title="Buka Live di Tab Baru"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
              <span className="hidden sm:inline">Buka Tab</span>
            </a>
          )}

          <button
            onClick={() => {
              setBatchCode(`PRC-${selectedType.toUpperCase()}-${Date.now().toString().slice(-4)}`);
              setShowAddModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Batch Proses</span>
          </button>
        </div>
      </div>

      {/* EMBEDDED VERCEL LIVE APPLICATION FOR TEMBAKAU */}
      {selectedType === 'Tembakau' && displaySource === 'vercel_live' && tembakauVercelUrl && (
        <div 
          className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col transition-all duration-300 ${
            isExpanded 
              ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' 
              : 'rounded-2xl'
          }`}
        >
          <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">Modul Live Proses Tembakau:</span>
              <span className="font-mono text-sky-400 truncate max-w-xs md:max-w-md">
                {tembakauVercelUrl}
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
                href={tembakauVercelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                title="Buka Tab Baru (External)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div 
            style={{ minHeight: isExpanded ? 'calc(100vh - 46px)' : '900px', height: isExpanded ? 'calc(100vh - 46px)' : '900px' }}
            className="relative w-full bg-slate-950 flex-1 overflow-hidden"
          >
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 text-white z-10 space-y-2">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
                <p className="text-xs font-medium">Memuat Modul Monitoring Proses Tembakau Live Vercel...</p>
                <span className="text-[11px] text-slate-400">{tembakauVercelUrl}</span>
              </div>
            )}
            <iframe
              key={iframeKey}
              src={tembakauVercelUrl}
              title="Monitoring Data Proses Tembakau - Live Vercel"
              className="w-full h-full border-0 block"
              style={{ width: '100%', height: '100%', minHeight: isExpanded ? 'calc(100vh - 46px)' : '900px' }}
              onLoad={() => setIsIframeLoading(false)}
              allow="camera; microphone; geolocation"
            />
          </div>
        </div>
      )}

      {/* Core Phase 2 Process Switcher Tabs: Cengkeh ⇄ Tembakau ⇄ Krosok ⇄ Blend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700">
        <button
          onClick={() => setSelectedType('Cengkeh')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
            selectedType === 'Cengkeh'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Flower2 className="w-4 h-4" />
          <span>Proses Cengkeh</span>
        </button>

        <button
          onClick={() => setSelectedType('Tembakau')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
            selectedType === 'Tembakau'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Leaf className="w-4 h-4" />
          <span>Proses Tembakau</span>
        </button>

        <button
          onClick={() => setSelectedType('Krosok')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
            selectedType === 'Krosok'
              ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Proses Krosok</span>
        </button>

        <button
          onClick={() => setSelectedType('Blend')}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
            selectedType === 'Blend'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Shuffle className="w-4 h-4" />
          <span>Proses Blend</span>
        </button>
      </div>

      {/* PORTAL NATIVE CONTENT (Shown when not in Vercel Live mode for Tembakau) */}
      {(selectedType !== 'Tembakau' || displaySource === 'portal_native' || !tembakauVercelUrl) && (
        <>
      {/* KPI & Yield Metric Highlights for Selected Process */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Rata-rata Rendemen</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            {averageRendemen}%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Standar Pabrik: &gt; 90.0%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Total Input Mentah</span>
            <Percent className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {totalInputRaw.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">KG</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Semua Batch Periode Ini
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Total Hasil Olahan</span>
            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {totalOutputProcessed.toLocaleString('id-ID')} <span className="text-xs font-semibold text-slate-400">KG</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Siap Masuk Gudang / Packing
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Kadar Air Rata-rata</span>
            <Sliders className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {averageMoisture}%
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Target MC: 12.5% - 14.0%</span>
          </div>
        </div>
      </div>

      {/* Process Batch Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            {getProcessIcon(selectedType)}
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              Rekap Batch Olahan {selectedType} ({recordsForType.length})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Shift:</label>
            <select
              value={selectedShiftFilter}
              onChange={(e) => setSelectedShiftFilter(e.target.value)}
              className="px-2.5 py-1 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="Semua">Semua Shift</option>
              <option value="Shift 1 (Pagi)">Shift 1 (Pagi)</option>
              <option value="Shift 2 (Sore)">Shift 2 (Sore)</option>
              <option value="Shift 3 (Malam)">Shift 3 (Malam)</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Kode Batch</th>
                <th className="py-2.5 px-3">Tanggal / Shift</th>
                <th className="py-2.5 px-3 text-right">Input Mentah</th>
                <th className="py-2.5 px-3 text-right">Output Jadi</th>
                <th className="py-2.5 px-3 text-center">Rendemen</th>
                <th className="py-2.5 px-3 text-center">Kadar Air</th>
                <th className="py-2.5 px-3">Mesin / Line</th>
                <th className="py-2.5 px-3">Mandor</th>
                <th className="py-2.5 px-3 text-center">Status QC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recordsForType.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-mono font-semibold text-slate-900 dark:text-white">
                    {rec.batchCode}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{rec.date}</div>
                    <div className="text-[11px] text-slate-400">{rec.shift}</div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                    {rec.inputRawKg.toLocaleString('id-ID')} KG
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {rec.outputProcessedKg.toLocaleString('id-ID')} KG
                  </td>
                  <td className="py-3 px-3 text-center font-mono font-black tabular-nums">
                    <span className={rec.rendemenPercent >= 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}>
                      {rec.rendemenPercent.toFixed(2)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {rec.moisturePercent}%
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {rec.machineLine}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {rec.foreman}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rec.qcStatus === 'Lolos QC'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : rec.qcStatus === 'Dalam Proses'
                        ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300'
                        : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}>
                      {rec.qcStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Batch Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {getProcessIcon(selectedType)}
                <span>Catat Batch Proses {selectedType}</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Kode Batch
                  </label>
                  <input
                    type="text"
                    required
                    value={batchCode}
                    onChange={(e) => setBatchCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Shift Kerja
                  </label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Shift 1 (Pagi)">Shift 1 (Pagi)</option>
                    <option value="Shift 2 (Sore)">Shift 2 (Sore)</option>
                    <option value="Shift 3 (Malam)">Shift 3 (Malam)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Input Bahan Baku Mentah (KG)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={inputRawKg}
                    onChange={(e) => setInputRawKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Output Hasil Olahan (KG)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={outputProcessedKg}
                    onChange={(e) => setOutputProcessedKg(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Calculated Yield Rendemen Preview */}
              <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900/60 flex items-center justify-between">
                <span className="text-xs text-blue-900 dark:text-blue-300 font-medium">
                  Kalkulasi Rendemen Otomatis:
                </span>
                <span className="text-sm font-black font-mono text-blue-700 dark:text-blue-400">
                  {calculatedRendemen}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Kadar Air / Moisture MC (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status QC
                  </label>
                  <select
                    value={qcStatus}
                    onChange={(e) => setQcStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Lolos QC">Lolos QC</option>
                    <option value="Dalam Proses">Dalam Proses</option>
                    <option value="Karantina">Karantina</option>
                    <option value="Rework">Rework</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Mesin / Jalur Produksi
                  </label>
                  <input
                    type="text"
                    value={machineLine}
                    onChange={(e) => setMachineLine(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Foreman / Mandor Bertugas
                  </label>
                  <input
                    type="text"
                    value={foreman}
                    onChange={(e) => setForeman(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Catatan Proses & Parameter Teknis
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Kondisi pisau rajang, tekanan uap conditioning, kebersihan sieve..."
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
                  Simpan Batch Olahan
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
