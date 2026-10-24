import fs from 'fs';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generateBotGuidePDF() {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 Size
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  let y = 800;

  function drawHeader() {
    page.drawRectangle({
      x: 0,
      y: 760,
      width: 595.28,
      height: 82,
      color: rgb(0.043, 0.098, 0.173), // Dark Navy #0B192C
    });

    page.drawText('PT BATU KARANG - DIVISI PRODUKSI 1 (PP1)', {
      x: 35,
      y: 818,
      size: 10,
      font: fontBold,
      color: rgb(0.23, 0.51, 0.96),
    });

    page.drawText('PANDUAN & CARA KERJA FITUR AI VERIFICATION & AUDIT BOT PP1', {
      x: 35,
      y: 796,
      size: 12.5,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('Dokumen Resmi Khusus Peran Developer, Engineer & Manajemen Operasional', {
      x: 35,
      y: 778,
      size: 8.5,
      font: fontRegular,
      color: rgb(0.75, 0.85, 0.95),
    });

    y = 735;
  }

  drawHeader();

  function printLine(text: string, size = 9, isBold = false, color = rgb(0.12, 0.15, 0.2)) {
    if (y < 65) {
      page = pdfDoc.addPage([595.28, 841.89]);
      drawHeader();
    }
    page.drawText(text, {
      x: 35,
      y,
      size,
      font: isBold ? fontBold : fontRegular,
      color,
    });
    y -= (size + 5);
  }

  function printSection(title: string) {
    y -= 10;
    if (y < 85) {
      page = pdfDoc.addPage([595.28, 841.89]);
      drawHeader();
    }
    page.drawRectangle({
      x: 35,
      y: y - 3,
      width: 525,
      height: 20,
      color: rgb(0.92, 0.95, 0.99),
    });
    page.drawText(title, {
      x: 42,
      y: y + 3,
      size: 10,
      font: fontBold,
      color: rgb(0.08, 0.28, 0.65),
    });
    y -= 22;
  }

  printSection('1. PENDAHULUAN & SUMBER ACUAN DATA');
  printLine('Fitur AI Verification & Audit Bot PP1 dirancang sebagai auditor digital berbasis AI yang');
  printLine('secara proaktif memverifikasi keterkaitan silang (cross-verification) data operasional pabrik.');
  printLine('Audit dilakukan pada 3 dataset riil operasional:');
  printLine('  * Data Mutasi Stok Gudang (Bahan baku keluar ke lini produksi vs penerimaan masuk)');
  printLine('  * Data Rekap Batch Proses Produksi (Hasil proses rajangan Cengkeh, Tembakau, Krosok, & Blend)');
  printLine('  * Data Saldo Stok Persediaan Gudang & Batas Ambang Kritis (Minimum Threshold)');
  printLine('Seluruh data dianalisis secara riil dari database aplikasi PP1 dan Google Spreadsheet (GAS V2).');

  printSection('2. CARA KERJA ARSITEKTUR HYBRID DUAL-ENGINE');
  printLine('Untuk menjamin keandalan operasional pabrik tanpa kendala offline, sistem menerapkan arsitektur Dual-Engine:');
  printLine('A. Primary Engine - Google Gemini 3 Flash Large Language Model:');
  printLine('   - Diproses melalui secure server endpoint Express: /api/ai/verify.');
  printLine('   - Menggunakan temperature 0.2 untuk akurasi faktual maksimal tanpa halusinasi.');
  printLine('   - Menganalisis korelasi nomor lot, nomor batch, selisih kuantitas Kg, dan potensi kebocoran.');
  printLine('B. Fallback Engine - Local Deterministic Audit Engine:');
  printLine('   - Aktif secara otomatis jika kuota API penuh atau koneksi internet eksternal terganggu.');
  printLine('   - Menjalankan komputasi matematika persis untuk selisih timbangan (varians Kg),');
  printLine('     rata-rata rendemen (%), rata-rata kadar air (%), dan kelolosan QC.');

  printSection('3. TAHAP VERIFIKASI & METRIK YANG DI-AUDIT');
  printLine('1. Rekonsiliasi Bahan Keluar vs Input Rajang:');
  printLine('   Mencocokkan kuantitas bahan yang dikeluarkan dari gudang dengan jumlah input yang dimasukkan ke mesin.');
  printLine('2. Evaluasi Rendemen / Susut Produksi (Yield %):');
  printLine('   Standar pabrik PT Batu Karang menetapkan batas rendemen >= 90%. Jika di bawah standar,');
  printLine('   bot menandai sebagai temuan anomali untuk diperiksa oleh Foreman & Kepala Pengolahan.');
  printLine('3. Pemeriksaan Mutu Kadar Air (Moisture Content - MC %):');
  printLine('   Rentang toleransi kelembapan adalah 12.0% s/d 14.0%. Kadar air > 14.0% berisiko terhadap kualitas.');
  printLine('4. Klasifikasi Tingkat Risiko Status Audit:');
  printLine('   - SESUAI & SINKRON (Hijau)   : Seluruh kuantitas seimbang dan lolos standar QC.');
  printLine('   - PERINGATAN SELISIH (Kuning): Ditemukan selisih susut timbangan atau batch belum lolos QC.');
  printLine('   - ANOMALI KRITIS (Merah)      : Selisih berat > 5.000 KG atau terdeteksi batch tanpa mutasi.');

  printSection('4. PANDUAN PENGGUNAAN KHUSUS DEVELOPER & FOREMAN');
  printLine('1. Preset Cepat:');
  printLine('   - \"Verifikasi Komprehensif\" : Audit menyeluruh terhadap seluruh modul persediaan.');
  printLine('   - \"Cek Selisih Tembakau\"    : Rekonsiliasi khusus bahan tembakau gudang vs mesin.');
  printLine('   - \"Audit Rendemen & Air\"    : Analisis parameter teknis efisiensi produksi.');
  printLine('2. Pertanyaan Bebas (Custom Query):');
  printLine('   Pengguna dapat mengajukan pertanyaan spesifik seperti: \"Berapa total rendemen shift 1 kemarin?\"');
  printLine('3. Salin Hasil Audit:');
  printLine('   Laporan berformat Markdown yang rapi dapat langsung disalin untuk laporan berkala harian.');

  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    pages[i].drawText(`Dokumen Internal PT Batu Karang PP1 — Halaman ${i + 1} dari ${pages.length} — Khusus Akses Developer`, {
      x: 35,
      y: 22,
      size: 7.5,
      font: fontOblique,
      color: rgb(0.4, 0.45, 0.5),
    });
  }

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('public/PANDUAN_CARA_KERJA_AI_VERIFICATION_BOT_PP1.pdf', pdfBytes);
  console.log('PDF Generated Successfully at public/PANDUAN_CARA_KERJA_AI_VERIFICATION_BOT_PP1.pdf');
}

generateBotGuidePDF();
