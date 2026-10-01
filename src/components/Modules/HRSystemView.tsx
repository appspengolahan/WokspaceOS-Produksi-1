import React, { useState, useMemo } from 'react';
import { 
  Users, 
  MapPin, 
  Award, 
  UserPlus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  Search, 
  Navigation,
  Crosshair
} from 'lucide-react';
import { EmployeeRecord, AttendanceGPSRecord, UserRole } from '../../types';

interface HRSystemViewProps {
  initialSubTab?: 'karyawan' | 'presensi' | 'kpi' | 'rekrutmen';
  employees: EmployeeRecord[];
  onAddEmployee: (employee: Omit<EmployeeRecord, 'id'>) => void;
  userRole: UserRole;
}

export const HRSystemView: React.FC<HRSystemViewProps> = ({
  initialSubTab = 'karyawan',
  employees,
  onAddEmployee,
  userRole,
}) => {
  const [activeTab, setActiveTab] = useState<'karyawan' | 'presensi' | 'kpi' | 'rekrutmen'>(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStationFilter, setSelectedStationFilter] = useState('Semua');
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);

  // GPS Simulation state
  const FACTORY_LAT = -7.2504;
  const FACTORY_LNG = 112.7688;
  const [gpsSimLogs, setGpsSimLogs] = useState<AttendanceGPSRecord[]>([
    {
      id: 'att_1',
      employeeId: 'emp_01',
      employeeName: 'Lalu M. Rahmatullah',
      timestamp: '07:15:22 WIB',
      type: 'Check In',
      latitude: -7.25042,
      longitude: 112.76881,
      distanceFromFactoryMeters: 4,
      isWithinGeofence: true
    },
    {
      id: 'att_2',
      employeeId: 'emp_02',
      employeeName: 'Slamet Riyadi',
      timestamp: '07:22:10 WIB',
      type: 'Check In',
      latitude: -7.25055,
      longitude: 112.76892,
      distanceFromFactoryMeters: 22,
      isWithinGeofence: true
    },
    {
      id: 'att_3',
      employeeId: 'emp_04',
      employeeName: 'Supardi Hartono',
      timestamp: '07:28:45 WIB',
      type: 'Check In',
      latitude: -7.25040,
      longitude: 112.76875,
      distanceFromFactoryMeters: 12,
      isWithinGeofence: true
    }
  ]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsStatusMsg, setGpsStatusMsg] = useState('');

  // Form states for new employee
  const [newNip, setNewNip] = useState(`BK-PP1-${(employees.length + 1).toString().padStart(3, '0')}`);
  const [newFullName, setNewFullName] = useState('');
  const [newType, setNewType] = useState<EmployeeRecord['type']>('Pekerja Harian Lepas (PHL)');
  const [newPosition, setNewPosition] = useState('Operator Sortasi & Pengeringan');
  const [newStation, setNewStation] = useState<EmployeeRecord['station']>('Sortasi Cengkeh');
  const [newPhone, setNewPhone] = useState('08');

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchStation = selectedStationFilter === 'Semua' || emp.station === selectedStationFilter;
      const matchSearch = 
        emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStation && matchSearch;
    });
  }, [employees, selectedStationFilter, searchQuery]);

  const handleSimulateGPSCheckIn = () => {
    setGpsLoading(true);
    setGpsStatusMsg('Mendeteksi sinyal GPS lokasi pabrik PT Batu Karang...');

    setTimeout(() => {
      // simulate realistic 5m to 25m distance inside geofence
      const randomOffsetLat = (Math.random() - 0.5) * 0.0002;
      const randomOffsetLng = (Math.random() - 0.5) * 0.0002;
      const dist = Math.floor(Math.random() * 28) + 3;

      const newLog: AttendanceGPSRecord = {
        id: `att_${Date.now()}`,
        employeeId: 'emp_curr',
        employeeName: 'Lalu M. Rahmatullah (User Saat Ini)',
        timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
        type: 'Check In',
        latitude: FACTORY_LAT + randomOffsetLat,
        longitude: FACTORY_LNG + randomOffsetLng,
        distanceFromFactoryMeters: dist,
        isWithinGeofence: dist <= 100
      };

      setGpsSimLogs(prev => [newLog, ...prev]);
      setGpsLoading(false);
      setGpsStatusMsg(`Presensi Berhasil! Terverifikasi dalam radius pabrik (${dist} meter dari titik sentral).`);
    }, 1200);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim()) return;

    onAddEmployee({
      nip: newNip,
      fullName: newFullName,
      type: newType,
      position: newPosition,
      station: newStation,
      phone: newPhone,
      joinDate: new Date().toISOString().slice(0, 10),
      status: 'Aktif',
      kpiScore: 90,
      attendanceRate: 98.0
    });

    setShowAddEmpModal(false);
    setNewFullName('');
    setNewNip(`BK-PP1-${(employees.length + 2).toString().padStart(3, '0')}`);
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-600 text-white">
              PP1 - HR SYSTEM
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Database Karyawan, PHL, Geofence GPS & Pengukuran KPI
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
            HR & Manajemen Tenaga Kerja Divisi Produksi 1
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddEmpModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Karyawan / PHL</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-200/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('karyawan')}
          className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === 'karyawan'
              ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Database Staff & PHL ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('presensi')}
          className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === 'presensi'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Presensi GPS Pabrik</span>
        </button>

        <button
          onClick={() => setActiveTab('kpi')}
          className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === 'kpi'
              ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Pengukuran KPI</span>
        </button>

        <button
          onClick={() => setActiveTab('rekrutmen')}
          className={`flex items-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
            activeTab === 'rekrutmen'
              ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Portal Rekrutmen</span>
        </button>
      </div>

      {/* Tab 1: Database Karyawan */}
      {activeTab === 'karyawan' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari NIP, nama atau posisi..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedStationFilter}
                onChange={(e) => setSelectedStationFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="Semua">Semua Pos Lini Kerja</option>
                <option value="Sortasi Cengkeh">Sortasi Cengkeh</option>
                <option value="Perajangan Tembakau">Perajangan Tembakau</option>
                <option value="Mesin Blending">Mesin Blending</option>
                <option value="Gudang & Logistik">Gudang & Logistik</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">NIP Pegawai</th>
                  <th className="py-2.5 px-3">Nama Lengkap</th>
                  <th className="py-2.5 px-3">Tipe Hubungan</th>
                  <th className="py-2.5 px-3">Jabatan & Stasiun</th>
                  <th className="py-2.5 px-3">Kontak HP</th>
                  <th className="py-2.5 px-3 text-center">Presensi</th>
                  <th className="py-2.5 px-3 text-center">Skor KPI</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-mono font-medium text-slate-500 dark:text-slate-400">
                      {emp.nip}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-white">{emp.fullName}</div>
                      <div className="text-[11px] text-slate-400">Bergabung: {emp.joinDate}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        emp.type === 'Staff Tetap'
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-sky-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      }`}>
                        {emp.type}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">{emp.position}</div>
                      <div className="text-[11px] text-blue-600 dark:text-sky-400">{emp.station}</div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">
                      {emp.phone}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold tabular-nums text-slate-800 dark:text-slate-200">
                      {emp.attendanceRate}%
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {emp.kpiScore}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Presensi GPS Geofence */}
      {activeTab === 'presensi' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-emerald-500" />
                  <span>Sistem Presensi Geofence GPS Pabrik PT Batu Karang</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Titik Pusat Pabrik: <span className="font-mono text-slate-700 dark:text-slate-300">-7.250400, 112.768800</span> (Radius Validasi: 150 Meter)
                </p>
              </div>

              <button
                onClick={handleSimulateGPSCheckIn}
                disabled={gpsLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition cursor-pointer"
              >
                <Navigation className={`w-4 h-4 ${gpsLoading ? 'animate-spin' : ''}`} />
                <span>{gpsLoading ? 'Mendeteksi Koordinat...' : 'Lakukan Check-In GPS Sekarang'}</span>
              </button>
            </div>

            {gpsStatusMsg && (
              <div className="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{gpsStatusMsg}</span>
              </div>
            )}

            {/* Presensi Logs Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Waktu Presensi</th>
                    <th className="py-2.5 px-3">Nama Pegawai</th>
                    <th className="py-2.5 px-3">Aksi</th>
                    <th className="py-2.5 px-3 font-mono">Koordinat GPS</th>
                    <th className="py-2.5 px-3 text-right">Jarak Dari Pabrik</th>
                    <th className="py-2.5 px-3 text-center">Status Geofence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {gpsSimLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3 font-mono text-slate-700 dark:text-slate-300 font-medium">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                        {log.employeeName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-sky-300">
                          {log.type}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500">
                        {log.latitude.toFixed(6)}, {log.longitude.toFixed(6)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                        {log.distanceFromFactoryMeters} meter
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.isWithinGeofence
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        }`}>
                          {log.isWithinGeofence ? 'Di Dalam Radius' : 'Di Luar Area'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pengukuran KPI */}
      {activeTab === 'kpi' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Matriks Evaluasi KPI & Kinerja Pekerja PP1</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Penilaian berkala berdasarkan ketepatan rendemen, output tonase per shift, kehadiran, dan standar mutu SOP.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">Rata-rata Skor Divisi</span>
              <div className="text-2xl font-black text-blue-600 dark:text-sky-400 mt-1 tabular-nums">91.4 / 100</div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400">Kategori: Sangat Baik</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">Tingkat Disiplin Jam Kerja</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums">97.8%</div>
              <span className="text-[11px] text-slate-500">Tepat Waktu & Sesuai Shift</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500 dark:text-slate-400">Penerima Bonus Produktivitas</span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 tabular-nums">{employees.filter(e => e.kpiScore >= 90).length} Orang</div>
              <span className="text-[11px] text-slate-500">Skor &ge; 90 Poin</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Rekrutmen */}
      {activeTab === 'rekrutmen' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-purple-500" />
            <span>Pendaftaran & Seleksi Calon Tenaga Kerja Musim Panen PP1</span>
          </h3>
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Operator Mesin Rotary Cutter Tembakau</h4>
                <p className="text-xs text-slate-500">Kebutuhan: 4 Orang · Lokasi Lini Perajangan · Pengalaman minimal 1 tahun</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 w-fit">
                Buka Pendaftaran (8 Pelamar)
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Tenaga Harian Lepas Sortir Daun Krosok</h4>
                <p className="text-xs text-slate-500">Kebutuhan: 12 Orang · Lokasi Gudang B · Siap sistem shift panen raya</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 w-fit">
                Buka Pendaftaran (15 Pelamar)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddEmpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Daftarkan Tenaga Kerja Baru PP1
              </h3>
              <button 
                onClick={() => setShowAddEmpModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    NIP Pegawai
                  </label>
                  <input
                    type="text"
                    value={newNip}
                    onChange={(e) => setNewNip(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Tipe Karyawan
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Staff Tetap">Staff Tetap</option>
                    <option value="Pekerja Harian Lepas (PHL)">Pekerja Harian Lepas (PHL)</option>
                    <option value="Kontrak">Kontrak</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="Nama lengkap sesuai KTP..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Stasiun / Lini Kerja
                  </label>
                  <select
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Sortasi Cengkeh">Sortasi Cengkeh</option>
                    <option value="Perajangan Tembakau">Perajangan Tembakau</option>
                    <option value="Mesin Blending">Mesin Blending</option>
                    <option value="Gudang & Logistik">Gudang & Logistik</option>
                    <option value="QC Lab">QC Lab</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Jabatan / Posisi
                  </label>
                  <input
                    type="text"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddEmpModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Simpan Data Karyawan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
