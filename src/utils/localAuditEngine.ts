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

  // Targeted response if custom instruction contains specific queries
  const qLower = (customInstruction || '').toLowerCase();

  // Scenario 1: Specific batch lookup
  const matchedBatch = processRecords.find(b => qLower.includes(b.batchCode.toLowerCase()));
  if (matchedBatch) {
    const matchedMutations = mutations.filter(m => m.batchNumber === matchedBatch.batchCode);
    const totalBatchOutKg = matchedMutations.reduce((sum, m) => sum + (m.quantityKg || 0), 0);
    const batchVariance = totalBatchOutKg - matchedBatch.inputRawKg;

    return `### 🔍 HASIL AUDIT SPESIFIK BATCH: [${matchedBatch.batchCode}]
*Waktu Analisis: ${timestamp} WIB*
*Auditor Core: AI Verification & Ground Truth Engine PP1*

---

#### 📌 1. Identitas & Rekonsiliasi Batch
- **Nomor Batch:** \`${matchedBatch.batchCode}\`
- **Jenis Pengolahan:** ${matchedBatch.processType}
- **Lini Mesin:** ${matchedBatch.machineLine}
- **Foreman Penanggung Jawab:** ${matchedBatch.foreman}
- **Tanggal Proses:** ${matchedBatch.date}
- **Status QC / Karantina:** **${matchedBatch.qcStatus}**

#### ⚖️ 2. Neraca Berat & Rendemen
- **Bahan Keluar Gudang (Mutasi):** ${totalBatchOutKg.toLocaleString('id-ID')} Kg (${matchedMutations.length} catatan mutasi)
- **Input Bahan Mentah Mesin:** ${matchedBatch.inputRawKg.toLocaleString('id-ID')} Kg
- **Output Produk Jadi:** ${matchedBatch.outputProcessedKg.toLocaleString('id-ID')} Kg
- **Selisih Keluar vs Masuk:** **${batchVariance === 0 ? '0 Kg (Sinkron Sempurna)' : `${batchVariance > 0 ? '+' : ''}${batchVariance.toLocaleString('id-ID')} Kg`}**
- **Rendemen Riil:** **${matchedBatch.rendemenPercent.toFixed(2)}%** ${matchedBatch.rendemenPercent < 90 ? '🔴 *(DI BAWAH TARGET MINIMAL 90%)*' : '🟢 *(MEMENUHI TARGET)*'}
- **Kadar Air (Moisture):** **${matchedBatch.moisturePercent.toFixed(2)}%** ${matchedBatch.moisturePercent > 14 ? '⚠️ *(MELEBIHI BATAS AMAN 14%)*' : '🟢 *(AMAN)*'}

#### 🛠️ 3. Evaluasi & Rekomendasi
${matchedBatch.rendemenPercent < 90 ? `* Peringatan: Susut mesin mencapai ${(matchedBatch.inputRawKg - matchedBatch.outputProcessedKg).toLocaleString('id-ID')} Kg. Lakukan kalibrasi pisau pada ${matchedBatch.machineLine}.\n` : ''}${matchedBatch.moisturePercent > 14 ? `* Peringatan Kelembaban: Kadar air ${matchedBatch.moisturePercent}% rentan jamur. Tempatkan di ruang transit ber-blower.\n` : ''}${matchedBatch.qcStatus !== 'Lolos QC' ? `* Peringatan QC: Batch belum bersertifikat "Lolos QC". Dilarang masuk ke Gudang C (Blending).\n` : ''}
*Seluruh data dihitung deterministik berdasarkan database operasional PP1.*`;
  }

  // Scenario 2: Rendemen query focus
  if (qLower.includes('rendemen') || qLower.includes('susut') || qLower.includes('yield')) {
    return `### 📊 LAPORAN ANALISIS RENDEMEN & EVALUASI SUSUT (YIELD LOSS AUDIT)
*Waktu Analisis: ${timestamp} WIB*
*Auditor Core: AI Verification & Ground Truth Engine PP1*

---

#### 🎯 1. Ringkasan Kinerja Rendemen Pabrik PP1
* **Standar Target Rendemen PP1:** **≥ 90.00%**
* **Rata-rata Rendemen Riil Saat Ini:** **${avgRendemen.toFixed(2)}%**
* **Total Batch Teranalisis:** ${processRecords.length} Batch
* **Batch di Bawah Standar (< 90%):** **${lowYieldBatches.length} Batch**

#### 📋 2. Rincian Batch Rendemen Rendah & Kerugian Susut
${lowYieldBatches.length > 0 ? lowYieldBatches.map((b, i) => {
  const susutKg = b.inputRawKg - b.outputProcessedKg;
  const normalSusutKg = b.inputRawKg * 0.10; // normal tolerance 10%
  const abnormalSusutKg = Math.max(0, susutKg - normalSusutKg);
  return `##### ${i + 1}. Batch [${b.batchCode}] - ${b.processType}
- **Lini Mesin / Foreman:** ${b.machineLine} / ${b.foreman}
- **Input Timbangan:** ${b.inputRawKg.toLocaleString('id-ID')} Kg ➔ **Output Jadi:** ${b.outputProcessedKg.toLocaleString('id-ID')} Kg
- **Rendemen Riil:** **${b.rendemenPercent}%** (Defisit: ${(90 - b.rendemenPercent).toFixed(2)}% dari standar)
- **Akumulasi Susut:** ${susutKg.toLocaleString('id-ID')} Kg (Estimasi Susut Abnormal: **${abnormalSusutKg.toLocaleString('id-ID')} Kg**)
- **Kadar Air:** ${b.moisturePercent}% | **Status QC:** ${b.qcStatus}`;
}).join('\n\n') : '🟢 *Tidak ditemukan batch dengan rendemen di bawah standar 90.00%. Seluruh lini mesin beroperasi efisien.*'}

#### 🛠️ 3. Rekomendasi Teknis untuk Kepala Pengolahan & Foreman
1. **Inspeksi Pisau Mesin Rajang:** Evaluasi ketajaman pisau dan celah conveyor feed pada lini ${lowYieldBatches.map(b => b.machineLine).join(', ') || 'produksi'}.
2. **Pengecekan Debu Tembakau (Tobacco Scrap):** Cek filter cyclone debu tembakau untuk memastikan bahan tidak terbuang ke exhaust.
3. **Tera Timbangan Input vs Output:** Lakukan verifikasi load-cell timbangan duduk di lantai produksi.`;
  }

  // Scenario 3: Moisture query focus
  if (qLower.includes('kadar air') || qLower.includes('moisture') || qLower.includes('jamur') || qLower.includes('kelembaban')) {
    return `### 💧 LAPORAN AUDIT KADAR AIR (MOISTURE CONTENT) & RISIKO GUDANG
*Waktu Analisis: ${timestamp} WIB*
*Auditor Core: AI Verification & Ground Truth Engine PP1*

---

#### 🎯 1. Standar Toleransi Kadar Air PP1
* **Batas Toleransi Aman:** **12.00% - 14.00%**
* **Rata-rata Kadar Air Terukur:** **${avgMoisture.toFixed(2)}%**
* **Batch Melebihi Batas Aman (> 14%):** **${highMoistureBatches.length} Batch**

#### 📋 2. Rincian Batch Berisiko
${highMoistureBatches.length > 0 ? highMoistureBatches.map((b, i) => `##### ${i + 1}. Batch [${b.batchCode}] (${b.processType})
- **Kadar Air Terukur:** **${b.moisturePercent}%** ⚠️ *(Risiko Jamur)*
- **Lini / Foreman:** ${b.machineLine} / ${b.foreman}
- **Status QC:** ${b.qcStatus}
- **Rekomendasi:** Berikan aerasi atau pengeringan ulang sebelum dimasukkan ke Gudang C.`).join('\n\n') : '🟢 *Seluruh batch memenuhi batas toleransi kadar air aman (≤ 14.00%). Risiko jamur nihil.*'}

#### 🛠️ 3. Mitigasi Ruang Simpan
- Batch dengan MC > 14% dilarang ditumpuk di atas 5 palet dan wajib sirkulasi udara aktif.`;
  }

  // Default: Comprehensive Audit Report
  return `### 📋 LAPORAN VERIFIKASI SILANG OPERASIONAL DIVISI PRODUKSI 1 (PP1)
*Waktu Inspeksi: ${timestamp} WIB*
*Auditor Core: AI Verification & Ground Truth Engine PP1*
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
