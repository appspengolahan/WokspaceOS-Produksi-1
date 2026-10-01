export type UserRole = 'super_admin' | 'project_manager' | 'staff_operasional';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  avatarUrl: string;
  division: string;
  allowedModules: string[];
}

export type AppCategory = 
  | 'Persediaan & Stok'
  | 'Data Proses Produksi'
  | 'Administrasi & Surat'
  | 'HR & Ketenagakerjaan'
  | 'Pengadaan & SPP'
  | 'CRM & Mitra';

export type AppVisibility = 'Semua Visibility' | 'Internal Divisi' | 'Manajemen' | 'Publik';
export type AppStatus = 'Semua Status' | 'Aktif' | 'Pemeliharaan' | 'Pengembangan';

export interface AppRegistryItem {
  id: string;
  moduleId: string;
  name: string;
  description: string;
  category: AppCategory;
  visibility: 'Internal Divisi' | 'Manajemen' | 'Publik';
  status: 'Aktif' | 'Pemeliharaan' | 'Pengembangan';
  pic: string;
  icon: string;
  adminOnly?: boolean;
  sheetsUrl?: string;
  sheetTabName?: string;
  externalUrl?: string;
  lastSync?: string;
  statsKpi?: string;
}

export interface StockItem {
  id: string;
  sku: string;
  name: string;
  category: 'Cengkeh' | 'Tembakau' | 'Krosok' | 'Tembakau Blend' | 'Bahan Pembantu';
  warehouse: 'Gudang A (Bahan Baku)' | 'Gudang B (Sortir & Fermentasi)' | 'Gudang C (Blending)' | 'Gudang D (Transit Produksi)';
  currentStockKg: number;
  minStockThresholdKg: number;
  unit: 'KG' | 'Bale' | 'Drum';
  moistureContentAvg: number; // Kadar air MC %
  qualityGrade: 'Grade Super A' | 'Grade A' | 'Grade B' | 'Export Quality';
  lastUpdated: string;
  status: 'Aman' | 'Menipis' | 'Kritis';
}

export interface StockMutation {
  id: string;
  date: string;
  stockItemId: string;
  materialName: string;
  type: 'MASUK' | 'KELUAR' | 'TRANSFER_INTERNAL' | 'ADJUSTMENT';
  quantityKg: number;
  source: string;
  destination: string;
  batchNumber: string;
  operator: string;
  notes: string;
}

export interface ProcessBatchRecord {
  id: string;
  processType: 'Cengkeh' | 'Tembakau' | 'Krosok' | 'Blend';
  batchCode: string;
  date: string;
  shift: 'Shift 1 (Pagi)' | 'Shift 2 (Sore)' | 'Shift 3 (Malam)';
  inputRawKg: number;
  outputProcessedKg: number;
  rendemenPercent: number; // (output / input) * 100
  moisturePercent: number; // Target 12% - 14%
  machineLine: string;
  foreman: string;
  qcStatus: 'Lolos QC' | 'Karantina' | 'Rework' | 'Dalam Proses';
  notes: string;
}

export interface LetterRecord {
  id: string;
  letterNumber: string;
  type: 'Surat Keluar' | 'Surat Masuk' | 'Surat Tugas' | 'Berita Acara' | 'Surat Jalan' | 'Memo Internal';
  title: string;
  senderOrRecipient: string;
  date: string;
  classification: 'Biasa' | 'Penting' | 'Rahasia';
  status: 'Tercatat' | 'Terkirim' | 'Diarsipkan';
  fileAttachment?: string;
  contentSnippet: string;
}

export interface EmployeeRecord {
  id: string;
  nip: string;
  fullName: string;
  type: 'Staff Tetap' | 'Pekerja Harian Lepas (PHL)' | 'Kontrak';
  position: string;
  station: 'Sortasi Cengkeh' | 'Perajangan Tembakau' | 'Mesin Blending' | 'Gudang & Logistik' | 'QC Lab' | 'Maintenance';
  phone: string;
  joinDate: string;
  status: 'Aktif' | 'Cuti' | 'Off';
  kpiScore: number; // 0 - 100
  attendanceRate: number; // %
}

export interface AttendanceGPSRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  timestamp: string;
  type: 'Check In' | 'Check Out';
  latitude: number;
  longitude: number;
  distanceFromFactoryMeters: number;
  isWithinGeofence: boolean;
  photoUrl?: string;
}

export interface PurchaseRequestRecord {
  id: string;
  sppNumber: string;
  date: string;
  requesterName: string;
  department: string;
  priority: 'Biasa' | 'Penting' | 'Darurat / Cito';
  itemDescription: string;
  quantity: number;
  unit: string;
  estimatedCostIdr: number;
  purpose: string;
  status: 'Draft' | 'Menunggu Approval' | 'Disetujui Manajer' | 'Proses Pengadaan PO' | 'Selesai';
  approvedBy?: string;
}

export interface CRMClientRecord {
  id: string;
  companyName: string;
  contactPerson: string;
  category: 'Mitra Pembeli' | 'Pemasok Bahan Baku' | 'Distributor';
  phone: string;
  email: string;
  location: string;
  activeContracts: string;
  totalVolumeDeliveredKg: number;
  status: 'Aktif' | 'Evaluasi' | 'Prospek';
}

export interface GasSheetConnectionConfig {
  moduleId: string;
  moduleName: string;
  spreadsheetId: string;
  sheetName: string;
  webAppUrl: string;
  syncFrequency: 'Real-time' | 'Setiap 15 Menit' | 'Setiap Jam' | 'Manual';
  lastSyncStatus: 'Connected' | 'Idle' | 'Syncing' | 'Error';
  lastSyncTimestamp: string;
}
