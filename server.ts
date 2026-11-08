import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { generateComprehensiveAuditReport } from './src/utils/localAuditEngine';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Persistent Server-Side Menu Settings File Path
const SETTINGS_FILE_PATH = path.resolve(process.cwd(), 'src', 'data', 'sidebar_menu_config.json');

// Endpoint: Get Shared Sidebar Menu Configuration
app.get('/api/settings/menu', (req, res) => {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const data = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8');
      return res.json({ success: true, items: JSON.parse(data) });
    }
    return res.json({ success: false, items: null });
  } catch (error: any) {
    console.error('Error reading sidebar menu config:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint: Save Shared Sidebar Menu Configuration (Syncs to all devices)
app.post('/api/settings/menu', (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Format data menu tidak valid (harus array).' });
    }
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(items, null, 2), 'utf-8');
    return res.json({ success: true, message: 'Konfigurasi menu berhasil disimpan di server.' });
  } catch (error: any) {
    console.error('Error saving sidebar menu config:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Shared Gemini API Client setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Endpoint: AI Cross-Dataset Verification & Operational Audit
app.post('/api/ai/verify', async (req, res) => {
  try {
    const { 
      taskType = 'cross_verification', 
      userQuery = '', 
      mutations = [], 
      processRecords = [], 
      stockItems = [] 
    } = req.body;

    // Server-side deterministic pre-calculation to anchor AI factual accuracy
    const outMutations = mutations.filter((m: any) => m.type === 'KELUAR');
    const inMutations = mutations.filter((m: any) => m.type === 'MASUK');
    const totalOutMutationsKg = outMutations.reduce((sum: number, m: any) => sum + (Number(m.quantityKg) || 0), 0);
    const totalInMutationsKg = inMutations.reduce((sum: number, m: any) => sum + (Number(m.quantityKg) || 0), 0);
    const totalRawInputKg = processRecords.reduce((sum: number, p: any) => sum + (Number(p.inputRawKg) || 0), 0);
    const totalOutputProcessedKg = processRecords.reduce((sum: number, p: any) => sum + (Number(p.outputProcessedKg) || 0), 0);
    const netVarianceKg = totalOutMutationsKg - totalRawInputKg;
    const avgRendemen = processRecords.length > 0 
      ? processRecords.reduce((sum: number, p: any) => sum + (Number(p.rendemenPercent) || 0), 0) / processRecords.length 
      : 0;
    const avgMoisture = processRecords.length > 0 
      ? processRecords.reduce((sum: number, p: any) => sum + (Number(p.moisturePercent) || 0), 0) / processRecords.length 
      : 0;
    const lowYieldBatches = processRecords.filter((p: any) => (Number(p.rendemenPercent) || 0) < 90);
    const highMoistureBatches = processRecords.filter((p: any) => (Number(p.moisturePercent) || 0) > 14.0);
    const pendingQCBatches = processRecords.filter((p: any) => p.qcStatus !== 'Lolos QC');

    const systemInstruction = `Anda adalah "AI Verification & Audit Bot PP1", auditor operasional cerdas tingkat tinggi (Lead Industrial Quality & Inventory Auditor) divisi operasional PT Batu Karang Divisi Produksi 1 (PP1).

STANDAR AUDIT & FORMULA MATEMATIS PABRIK PP1:
1. Rekonsiliasi Timbangan: Total Mutasi KELUAR Gudang Bahan Baku HARUS sama persis dengan Total Input Mentah (inputRawKg) Mesin Rajang.
   - Varians = (Total Mutasi Keluar Gudang) - (Total Input Bahan Baku Masuk Mesin).
   - Selisih positif (+Kg): Bahan keluar gudang belum tercatat di mesin rajang.
   - Selisih negatif (-Kg): Input mesin melebihi pengeluaran fisik gudang (indikasi unrecorded issue).
2. Standar Rendemen (Yield): outputProcessedKg / inputRawKg * 100%. Batas minimum standar PP1 adalah 90.00%.
   - Jika rendemen < 90.00%, wajib dianalisis mesin dan pisau rajangnya, serta dihitung kilogram susut abnormalnya.
3. Standar Kadar Air (Moisture Content / MC %): Batas toleransi aman penyimpanan adalah 12.00% - 14.00%.
   - MC > 14.00% wajib dilaporkan sebagai risiko jamur saat penyimpanan gudang transit.
4. Validasi QC & Karantina: Batch berstatus "Karantina", "Rework", atau "Dalam Proses" TIDAK BOLEH dipindahkan ke Gudang C (Blending) atau didistribusikan.
5. Status Kesimpulan Audit Wajib Ditetapkan Secara Tegas:
   - "🟢 STATUS AUDIT: SESUAI & SINKRON" jika variansi = 0 Kg, rendemen >= 90%, MC aman, dan semua batch Lolos QC.
   - "🟡 STATUS AUDIT: PERINGATAN SELISIH & SUSUT" jika ada selisih timbangan ringan atau batch pending QC.
   - "🔴 STATUS AUDIT: ANOMALI KRITIS" jika selisih > 5.000 Kg atau ada indikasi manipulasi lot / batch fiktif.

Format Laporan:
- Gunakan bahasa Indonesia formal, profesional, dan tegas.
- Sajikan tabel perbandingan angka presisi (Kg, %, Nama Batch, Tanggal, dan Operator/Foreman).
- Berikan rekomendasi langkah korektif taktis untuk Kepala Pengolahan, Foreman, dan Manajer Operasional.`;

    const factualMetricsContext = `
--- METRIK REKONSILIASI RIIL TERVALIDASI (SERVER-VALIDATED NUMBERS) ---
* Total Mutasi Keluar Gudang : ${totalOutMutationsKg.toLocaleString('id-ID')} Kg (${outMutations.length} transaksi)
* Total Input Mentah Masuk Mesin : ${totalRawInputKg.toLocaleString('id-ID')} Kg (${processRecords.length} batch)
* Total Output Jadi (Processed) : ${totalOutputProcessedKg.toLocaleString('id-ID')} Kg
* Variansi Bersih (Net Variance) : ${netVarianceKg > 0 ? '+' : ''}${netVarianceKg.toLocaleString('id-ID')} Kg
* Rata-rata Rendemen Pabrik : ${avgRendemen.toFixed(2)}% (Target: >= 90.00%)
* Rata-rata Kadar Air (MC) : ${avgMoisture.toFixed(2)}% (Target: 12.00% - 14.00%)
* Batch Rendemen Rendah (<90%) : ${lowYieldBatches.length} batch (${lowYieldBatches.map((b: any) => `${b.batchCode}: ${b.rendemenPercent}%`).join(', ') || 'Nihil'})
* Batch Kadar Air Tinggi (>14%) : ${highMoistureBatches.length} batch (${highMoistureBatches.map((b: any) => `${b.batchCode}: ${b.moisturePercent}%`).join(', ') || 'Nihil'})
* Batch Belum Lolos QC : ${pendingQCBatches.length} batch (${pendingQCBatches.map((b: any) => `${b.batchCode}: ${b.qcStatus}`).join(', ') || 'Nihil'})
`;

    const rawDataContext = `
--- DATA DETAIL MUTASI STOK GUDANG (${mutations.length} Record) ---
${JSON.stringify(mutations.slice(0, 50), null, 2)}

--- DATA DETAIL REKAP BATCH PROSES PRODUKSI (${processRecords.length} Record) ---
${JSON.stringify(processRecords.slice(0, 50), null, 2)}

--- DATA SALDO STOK MULTI-GUDANG (${stockItems.length} SKU) ---
${JSON.stringify(stockItems.slice(0, 30), null, 2)}
`;

    let prompt = '';
    if (taskType === 'custom_query') {
      prompt = `PERTANYAAN / INSTRUKSI SPESIFIK USER:
"${userQuery}"

Gunakan metrik terhitung berikut sebagai acuan fakta kebenaran mutlak (Ground Truth):
${factualMetricsContext}

Gunakan detail transaksi berikut untuk merinci nomor batch, operator, lini mesin, dan tanggal:
${rawDataContext}

Instruksi Analisis:
1. Jawab pertanyaan user dengan fakta akurat, angka kilogram eksak, persentase rendemen nyata, dan data batch terkait.
2. Jangan mengarang angka di luar metrik di atas.
3. Berikan saran operasional konkret.`;
    } else {
      prompt = `Lakukan Audit dan Rekonsiliasi Komprehensif Antar-Dataset Divisi Produksi 1 (PP1).

Gunakan metrik terhitung berikut sebagai acuan fakta kebenaran mutlak (Ground Truth):
${factualMetricsContext}

Detail Data Transaksi:
${rawDataContext}

Struktur Laporan yang Wajib Disajikan:
1. BADGE STATUS AUDIT (🟢 SESUAI / 🟡 PERINGATAN / 🔴 ANOMALI KRITIS)
2. TABEL REKONSILIASI NERACA BAHAN (Total Keluar Gudang vs Total Masuk Mesin vs Output vs Varians Kg)
3. ANALISIS ANOMALI BATCH SPESIFIK (Nomor Batch, Lini Mesin, Foreman, Selisih Kg, dan Persentase Rendemen/MC)
4. DETEKSI STATUS QC & RISIKO GUDANG (Karantina, Rework, Krosok/Tembakau Kritis)
5. LANGKAH TINDAKAN KOREKTIF PRIORITAS TINGGI UNTUK MANAJEMEN OPERASIONAL`;
    }

    let answer = '';

    // Only call Gemini API if GEMINI_API_KEY is configured
    if (process.env.GEMINI_API_KEY) {
      // Priority: gemini-4-argon for complex reasoning/audit, fallback to gemini-3.8-flash and gemini-flash-latest
      const candidateModels = ['gemini-4-argon', 'gemini-3.8-flash', 'gemini-flash-latest'];

      for (const modelName of candidateModels) {
        try {
          const config: any = {
            systemInstruction,
            temperature: 0.1, // Near zero temperature for strict factual analysis without hallucination
          };

          // Enable thinking for models that support it for deeper reasoning
          if (modelName === 'gemini-4-argon' || modelName === 'gemini-3.8-flash') {
            config.thinkingConfig = {
              thinkingBudget: 2048,
            };
          }

          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config,
          });

          if (response && response.text) {
            answer = response.text;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed or unavailable:`, err.message);
        }
      }
    }

    // If Gemini response is not generated, fallback to the deterministic Ground Truth audit report
    if (!answer) {
      answer = generateComprehensiveAuditReport(
        mutations,
        processRecords,
        stockItems,
        userQuery
      );
    }

    return res.json({
      success: true,
      analysis: answer,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during AI verification:', error);
    // Provide safe deterministic fallback on any error
    const fallback = generateComprehensiveAuditReport(
      req.body?.mutations || [],
      req.body?.processRecords || [],
      req.body?.stockItems || [],
      req.body?.userQuery
    );

    return res.status(200).json({
      success: true,
      analysis: fallback,
      timestamp: new Date().toISOString(),
    });
  }
});

async function startServer() {
  const currentDir = import.meta.dirname || path.resolve();

  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(currentDir, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(currentDir, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PP1 Fullstack Server with AI Bot active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
