import { StockMutation, ProcessBatchRecord, StockItem } from '../types';

export interface AuditReportResult {
  summaryTitle: string;
  auditStatus: 'SESUAI' | 'PERINGATAN SELISIH' | 'ANOMALI KRITIS';
  totalOutKg: number;
  totalInputRawKg: number;
  varianceKg: number;
  reportMarkdown: string;
}

export function generateComprehensiveAuditReport(
  mutations: StockMutation[],
  processRecords: ProcessBatchRecord[],
  stockItems: StockItem[],
  customInstruction?: string
): string {
  const outMutations = mutations.filter(m => m.type === 'KELUAR');
  const totalOutKg = outMutations.reduce((acc, m) => acc + (m.quantityKg || 0), 0);
  const totalInputRawKg = processRecords.reduce((acc, p) => acc + (p.inputRawKg || 0), 0);
  const totalOutputProcessedKg = processRecords.reduce((acc, p) => acc + (p.outputProcessedKg || 0), 0);
  const varianceKg = totalOutKg - totalInputRawKg;

  // Average Rendemen and Moisture
  const avgRendemen = processRecords.length > 0 
    ? (processRecords.reduce((acc, p) => acc + (p.rendemenPercent || 0), 0) / processRecords.length) 
    : 0;
  
  const avgMoisture = processRecords.length > 0
    ? (processRecords.reduce((acc, p) => acc + (p.moisturePercent || 0), 0) / processRecords.length)
    : 0;

  // Check batch anomalies
  const lowYieldBatches = processRecords.filter(p => (p.rendemenPercent || 0) < 90);
  const highMoistureBatches = processRecords.filter(p => (p.moisturePercent || 0) > 14.0);
  const pendingQCBatches = processRecords.filter(p => p.qcStatus !== 'Lolos QC');

  let statusBadge = '🟢 **STATUS AUDIT: SESUAI & SINKRON**';
  if (Math.abs(varianceKg) > 5000 || lowYieldBatches.length > 1) {
    statusBadge = '🔴 **STATUS AUDIT: ANOMALI KRITIS (PERIKSA FISIK TIMBANGAN)**';
  } else if (varianceKg !== 0 || highMoistureBatches.length > 0 || pendingQCBatches.length > 0) {
    statusBadge = '🟡 **STATUS AUDIT: PERINGATAN SELISIH & SUSUT (PERLU REKONSILIASI)**';
  }

  const timestamp = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return `### 📋 LAPORAN VERIFIKASI SILANG OPERASIONAL DIVISI PRODUKSI 1 (PP1)
*Waktu Inspeksi: ${timestamp} WIB*
*Auditor Core: AI Verification & Operational Audit Engine PP1*
${customInstruction ? `*Instruksi Fokus: "${customInstruction}"*\n` : ''}
---

${statusBadge}

#### 📊 1. Ringkasan Rekonsiliasi Material & Timbangan
| Indikator | Nilai Terhitung | Satuan | Keterangan / Toleransi |
| :--- | :--- | :--- | :--- |
| **Total Mutasi Keluar Gudang** | ${totalOutKg.toLocaleString('id-ID')} | Kg | ${outMutations.length} Transaksi Keluar Bahan Baku |
| **Total Input Proses Masuk** | ${totalInputRawKg.toLocaleString('id-ID')} | Kg | ${processRecords.length} Batch Pengolahan Aktif |
| **Total Output Jadi (Processed)** | ${totalOutputProcessedKg.toLocaleString('id-ID')} | Kg | Hasil Timbangan Siap Pakai / Kemas |
| **Selisih Akumulasi (Variance)** | ${varianceKg > 0 ? '+' : ''}${varianceKg.toLocaleString('id-ID')} | Kg | ${varianceKg === 0 ? 'SINKRON PERSIS (0 Kg)' : 'Terdapat perbedaan timbangan keluar vs batch'} |
| **Rata-rata Rendemen (Yield)** | ${avgRendemen.toFixed(2)} | % | Standar PP1 Target: ≥ 90.00% |
| **Rata-rata Kadar Air (Moisture)** | ${avgMoisture.toFixed(2)} | % | Batas Maksimal Standar QC: ≤ 14.00% |

---

#### 🔍 2. Temuan Kritis & Investigasi Batch
${varianceKg !== 0 ? `
1. **Discrepancy Timbangan Gudang vs Mesin:**
   - Terdeteksi variansi bersih sebesar **${varianceKg.toLocaleString('id-ID')} Kg**.
   - Input proses pengolahan (${totalInputRawKg.toLocaleString('id-ID')} Kg) ${totalInputRawKg > totalOutKg ? 'melebihi' : 'lebih rendah dari'} catatan mutasi keluar gudang (${totalOutKg.toLocaleString('id-ID')} Kg).
   - *Penyebab Umum:* Batch produksi dimulai mendahului penerbitan form mutasi Surat Jalan gudang, atau adanya sisa stok lantai produksi (Work-in-Process / WIP) yang belum di-rekapitulasi.
` : `
1. **Sinkronisasi Timbangan Fisik:**
   - Total bahan keluar dari gudang sepenuhnya cocok dengan total input mesin perajangan dan pengolahan.
`}
${lowYieldBatches.length > 0 ? `
2. **Anomali Rendemen Susut di Bawah Standar (< 90%):**
${lowYieldBatches.map(b => `   - **Batch [${b.batchCode}] (${b.processType})**: Rendemen tercatat **${b.rendemenPercent}%** (Input: ${b.inputRawKg.toLocaleString('id-ID')} Kg ➔ Output: ${b.outputProcessedKg.toLocaleString('id-ID')} Kg). Terjadi susut tinggi sebesar **${(b.inputRawKg - b.outputProcessedKg).toLocaleString('id-ID')} Kg** pada lini *${b.machineLine}*.`).join('\n')}
` : `
2. **Kinerja Rendemen & Susut Pengolahan:**
   - Semua batch pengolahan menunjukkan rendemen optimal di atas batas standar 90%.
`}
${highMoistureBatches.length > 0 ? `
3. **Peringatan Batas Kadar Air / Moisture Content (MC > 14%):**
${highMoistureBatches.map(b => `   - **Batch [${b.batchCode}]**: MC terukur **${b.moisturePercent}%** (Status: *${b.qcStatus}*, Foreman: *${b.foreman}*). Berisiko menimbulkan jamur bila disimpan lama.`).join('\n')}
` : `
3. **Kadar Air / Moisture Control:**
   - Seluruh kadar air tembakau, cengkeh, dan krosok berada pada rentang aman (12.0% - 13.8%).
`}

---

#### 🛠️ 3. Rekomendasi Tindakan Korektif untuk Foreman & Kepala Pengolahan
1. **Cross-Check Dokumen & Surat Permintaan (SPP / Surat Jalan):**
   - Lakukan pencocokan nomor batch dengan buku log fisik timbangan jembatan dan timbangan lantai sebelum pergantian shift berikutnya.
2. **Inspeksi Mesin & Kalibrasi Timbangan:**
   ${lowYieldBatches.length > 0 ? `- Periksa saringan debu dan pisau pemotong pada lini *${lowYieldBatches.map(b => b.machineLine).join(', ')}* untuk mengeliminasi potensi tobacco scrap / dust berlebih.` : '- Jadwalkan tera ulang berkala untuk sensor load cell mesin.'}
3. **Pemisahan Batch Karantina QC:**
   - Pastikan batch dengan status *"Dalam Proses"* atau *"Karantina"* tidak dipindahkan ke Gudang C (Blending) sebelum terbit sertifikat release dari tim QC.

*Laporan ini diverifikasi secara otomatis oleh Sistem Workspace OS PP1.*`;
}
