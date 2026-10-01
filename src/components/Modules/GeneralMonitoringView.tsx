import React from 'react';
import { 
  Gauge, 
  Activity, 
  Flame, 
  Droplets, 
  Clock, 
  CheckCircle2, 
  Cpu, 
  ArrowRight,
  Zap,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface GeneralMonitoringViewProps {
  onNavigateToModule: (moduleId: string) => void;
}

export const GeneralMonitoringView: React.FC<GeneralMonitoringViewProps> = ({
  onNavigateToModule,
}) => {
  const machineLines = [
    {
      id: 'rc-01',
      name: 'Lini 1: Mesin Rajang Cengkeh RC-01',
      status: 'Beroperasi Normal',
      speed: '480 Kg / Jam',
      temperature: '38.2 °C',
      moisture: '12.8%',
      operator: 'Slamet Riyadi',
      batch: 'PRC-CGH-20260930-01',
      targetModule: 'process_cengkeh'
    },
    {
      id: 'tc-03',
      name: 'Lini 2: Rotary Tobacco Cutter TC-03',
      status: 'Beroperasi Normal',
      speed: '820 Kg / Jam',
      temperature: '42.5 °C',
      moisture: '13.4%',
      operator: 'Budi Santoso',
      batch: 'PRC-TBK-20260930-01',
      targetModule: 'process_tembakau'
    },
    {
      id: 'k-02',
      name: 'Lini 3: Threshing & Destemming Krosok K-02',
      status: 'Beroperasi Normal',
      speed: '1,150 Kg / Jam',
      temperature: '31.0 °C',
      moisture: '14.2%',
      operator: 'Agus Purnomo',
      batch: 'PRC-KRS-20260930-01',
      targetModule: 'process_krosok'
    },
    {
      id: 'bm-01',
      name: 'Lini 4: Blending Silo & Flavouring Drum BM-01',
      status: 'Siklus Homogenisasi',
      speed: '1,500 Kg / Jam',
      temperature: '36.8 °C',
      moisture: '13.5%',
      operator: 'Lalu M. Rahmatullah',
      batch: 'PRC-BLD-20260930-01',
      targetModule: 'process_blend'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600 text-white">
              PP1 - GENERAL MONITORING
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Memonitor Seluruh Titik Data Pengolahan Pabrik Real-Time
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
            General Monitoring Operasional & Telemetri Mesin PP1
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Semua Lini Aktif (4/4)</span>
          </span>
        </div>
      </div>

      {/* Primary Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Overall OEE Plant</span>
            <Gauge className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            91.4%
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            Availability 94% · Perf 92%
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Throughput Kumulatif Hari Ini</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            18,450 <span className="text-xs font-semibold text-slate-400">KG</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            104% Dari Target Shift
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Suhu Ambience Gudang</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            24.5 °C
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            HVAC Pendingin Stabil
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
            <span>Kelembaban Udara (RH)</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            62% RH
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
            Standar Mutu Tembakau (60-65%)
          </div>
        </div>
      </div>

      {/* Machine Lines Live Telemetry Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Status Operasional Lini Pengolahan Mesin
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {machineLines.map((line) => (
            <div
              key={line.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4 hover:border-blue-400 dark:hover:border-blue-700 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {line.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Batch: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{line.batch}</span>
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                  {line.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">Kecepatan</div>
                  <div className="text-xs font-black font-mono text-slate-900 dark:text-white mt-0.5">{line.speed}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Suhu Uap</div>
                  <div className="text-xs font-black font-mono text-amber-600 dark:text-amber-400 mt-0.5">{line.temperature}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Kadar Air MC</div>
                  <div className="text-xs font-black font-mono text-sky-600 dark:text-sky-400 mt-0.5">{line.moisture}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-500">
                  Mandor: <strong className="text-slate-700 dark:text-slate-300">{line.operator}</strong>
                </span>

                <button
                  onClick={() => onNavigateToModule(line.targetModule)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition cursor-pointer"
                >
                  <span>Detail Data</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
