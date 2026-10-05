import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

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

    const systemInstruction = `Anda adalah "AI Verification & Audit Bot PP1", sistem inspeksi kecerdasan buatan divisi operasional PT Batu Karang Divisi Produksi 1 (PP1).
Tugas utama Anda adalah:
1. Memverifikasi relasi data yang saling berkaitan antara Mutasi Stock Persediaan Gudang (khususnya mutasi KELUAR untuk produksi) dengan Rekap Data Proses Pengolahan Tembakau & Cengkeh (input bahan baku / inputRawKg).
2. Menemukan selisih (discrepancy) kuantitas timbangan, inkonsistensi nomor batch, selisih tanggal atau shift, serta anomali rendemen susut (yield/loss) dan moisture content (MC %).
3. Memberikan status audit yang tegas: "SESUAI", "PERINGATAN SELISIH", atau "ANOMALI KRITIS".
4. Menghasilkan ringkasan audit terstruktur dan rekomendasi investigasi fisik/administrasi untuk Kepala Pengolahan, Foreman, dan Manajer Operasional.
Gunakan format markdown yang rapi, profesional, berbahasa Indonesia, jelas, dengan bullet points dan tabel atau badge status.`;

    const dataContext = `
--- DATA MUTASI STOK TERBARU (Gudang & Logistik) ---
${JSON.stringify(mutations.slice(0, 30), null, 2)}

--- DATA PROSES PRODUKSI (Tembakau, Cengkeh, Krosok, Blend) ---
${JSON.stringify(processRecords.slice(0, 30), null, 2)}

--- DATA STOK PERSEDIAAN GUDANG ---
${JSON.stringify(stockItems.slice(0, 20), null, 2)}
`;

    let prompt = '';
    if (taskType === 'custom_query') {
      prompt = `Instruksi / Pertanyaan Pengguna:
${userQuery}

Berdasarkan dataset operasional PP1 di atas, lakukan analisis dan verifikasi data yang saling berkaitan tersebut dan berikan jawaban yang akurat, detail per nomor batch dan kuantitas kilogramnya:
${dataContext}`;
    } else {
      prompt = `Lakukan verifikasi komprehensif atas keterkaitan data:
1. Rekonsiliasi Mutasi KELUAR Bahan Baku vs Input Proses Pengolahan (khususnya Tembakau dan Cengkeh): Cek apakah kuantitas dan nomor batch cocok.
2. Analisis Anomali Rendemen / Susut: Cek apakah rendemen atau kadar air berada di luar batas toleransi wajar.
3. Cek Inkonsistensi Catatan: Apakah ada mutasi keluar tanpa batch proses terkait, atau batch proses tanpa mutasi persediaan tercatat.
4. Buat daftar temuan dan tindakan korektif konkret.

Dataset:
${dataContext}`;
    }

    let answer = '';
    const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction,
            temperature: 0.2, // low temperature for precise factual verification
          }
        });

        if (response && response.text) {
          answer = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed, trying next candidate:`, err.message);
        lastError = err;
      }
    }

    if (!answer) {
      throw lastError || new Error('Tidak ada respons yang berhasil didapatkan dari AI Model.');
    }

    res.json({
      success: true,
      analysis: answer,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error during AI verification:', error);
    let errMsg = error.message || 'Terjadi kesalahan saat memproses verifikasi AI.';
    try {
      const parsed = JSON.parse(errMsg);
      if (parsed?.error?.message) {
        errMsg = parsed.error.message;
      }
    } catch {
      // not a json string
    }

    res.status(200).json({
      success: false,
      error: errMsg,
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
