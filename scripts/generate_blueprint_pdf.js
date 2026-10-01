import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function generatePDF() {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595.28, 841.89]); // A4 format
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const { width, height } = page.getSize();
  const margin = 40;
  let y = height - margin;

  function checkNewPage(neededSpace = 30) {
    if (y - neededSpace < margin + 30) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = height - margin;
      drawFooter(page);
    }
  }

  function drawFooter(p) {
    p.drawText('PT Batu Karang — Divisi Produksi 1 (PP1) | Master Blueprint & Technical Roadmap', {
      x: margin,
      y: 20,
      size: 8,
      font: fontOblique,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  // Draw Header on first page
  drawFooter(page);

  // Header Banner Background
  page.drawRectangle({
    x: margin,
    y: y - 55,
    width: width - margin * 2,
    height: 60,
    color: rgb(0.043, 0.098, 0.173), // #0B192C
  });

  page.drawText('PT BATU KARANG — DIVISI PRODUKSI 1 (PP1)', {
    x: margin + 15,
    y: y - 24,
    size: 14,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  page.drawText('MASTER BLUEPRINT SISTEM & ROADMAP PENGEMBANGAN WORKSPACE OS', {
    x: margin + 15,
    y: y - 42,
    size: 9,
    font: fontRegular,
    color: rgb(0.38, 0.76, 0.98), // Sky blue
  });

  y -= 75;

  // Metadata block
  page.drawText('Tanggal Rilis: 30 September 2026   |   Status: Production Ready (GitHub & Vercel Connected)', {
    x: margin,
    y: y,
    size: 9,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.2),
  });
  y -= 18;

  function drawSectionTitle(title) {
    checkNewPage(40);
    y -= 10;
    page.drawRectangle({
      x: margin,
      y: y - 4,
      width: width - margin * 2,
      height: 20,
      color: rgb(0.92, 0.95, 0.98),
    });
    page.drawText(title, {
      x: margin + 8,
      y: y + 2,
      size: 11,
      font: fontBold,
      color: rgb(0.08, 0.35, 0.65),
    });
    y -= 18;
  }

  function drawBullet(text, boldPrefix = '') {
    checkNewPage(24);
    page.drawText('•', {
      x: margin + 5,
      y: y,
      size: 10,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });
    let xOffset = margin + 16;
    if (boldPrefix) {
      page.drawText(boldPrefix + ' ', {
        x: xOffset,
        y: y,
        size: 9,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
      });
      xOffset += fontBold.widthOfTextAtSize(boldPrefix + ' ', 9);
    }
    page.drawText(text, {
      x: xOffset,
      y: y,
      size: 9,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.2),
    });
    y -= 14;
  }

  function drawParagraph(text) {
    checkNewPage(20);
    page.drawText(text, {
      x: margin,
      y: y,
      size: 9,
      font: fontRegular,
      color: rgb(0.25, 0.25, 0.25),
    });
    y -= 14;
  }

  // 1. Visi & Tujuan
  drawSectionTitle('1. VISI & PRINSIP ARSITEKTUR WORKSPACE OS');
  drawParagraph('Membangun satu portal sistem tunggal terintegrasi untuk Divisi Produksi 1 (PP1) PT Batu Karang.');
  drawBullet('Menyatukan belasan web app dan spreadsheet terpisah menjadi 1 platform OS terpusat.', 'Sentralisasi:');
  drawBullet('Google Apps Script V2 terpisah per modul, mencegah script menumpuk atau timeout.', 'Modular GAS V2:');
  drawBullet('Pemisahan ketat hak akses: Super Admin, Project Manager (Lalu M.), dan Staff Lapangan.', 'RBAC System:');
  drawBullet('Tampilan responsif di Desktop (Rail Mode 68px) dan Smartphone pekerja (Bottom Tab Bar).', 'PWA & Mobile:');

  // 2. Modul Ekosistem
  drawSectionTitle('2. EKOSISTEM MODUL OPERASIONAL PP1');
  drawBullet('Data stok Cengkeh, Tembakau, Krosok & Blend (Terhubung Live ke Vercel).', '1. Monitoring Stock PP1:');
  drawBullet('Rekap arus masuk, keluar, dan transfer antar-gudang berbasis nomor batch.', '2. Mutasi Stock:');
  drawBullet('Telemetri OEE pabrik, status 4 lini mesin pengolahan, suhu, dan kelembaban (RH).', '3. General Monitoring:');
  drawBullet('Fase 2 pengolahan: Sortasi Cengkeh, Rotary Tembakau, Destem Krosok, & Silo Blend.', '4. Data Proses (4 Komoditas):');
  drawBullet('Penomoran surat otomatis format [No]/PP1-BK/[Bulan]/[Tahun] & template kop resmi.', '5. Log Surat & Arsip:');
  drawBullet('Alur pengajuan digital suku cadang mesin dengan persetujuan manajerial.', '6. Pengadaan SPP:');
  drawBullet('Database mitra industri rokok rekanan, jadwal kuota kirim, dan volume kontrak.', '7. CRM Clients Hub:');

  // 3. Status Selesai
  drawSectionTitle('3. STATUS PENCAPAIAN SISTEM (TAHAP YANG SUDAH SELESAI)');
  drawBullet('Mini Sidebar Rail Mode (68px/256px) + Bottom Bar HP + Fullscreen & Theme Toggle.', '[SELESAI] Antarmuka Shell:');
  drawBullet('Portal direktori web apps dengan filter Kategori, Status, Visibility & Metric Counters.', '[SELESAI] Master Single Board:');
  drawBullet('Terhubung live ke Vercel (monitoring-stock-pp-1-pro-api.vercel.app) + mode switcher.', '[SELESAI] Integrasi Modul A:');
  drawBullet('Repositori terhubung ke GitHub & live di Vercel dengan routing SPA vercel.json.', '[SELESAI] CI/CD Production:');

  // 4. Instruksi Modul HR Pekerja & Staff
  drawSectionTitle('4. RENCANA KERJA TAHAP SELANJUTNYA: MODUL HR PEKERJA & HR STAFF');
  page.drawText('A. Sub-Modul 1: HR Pekerja Harian Lepas (PHL)', {
    x: margin,
    y: y,
    size: 10,
    font: fontBold,
    color: rgb(0.15, 0.4, 0.15),
  });
  y -= 15;
  drawBullet('Format NIP BK-PP1-PHL-xxx, Nama, KTP, Domisili, dan Kontak Darurat.', '1. Master Data PHL:');
  drawBullet('Sortir Gagang Cengkeh, Grading Krosok, Stacking Karung, Kebersihan Area.', '2. Pos Penugasan Lini:');
  drawBullet('Input cepat bagi mandor shift untuk mencentang pekerja yang hadir hari ini.', '3. Foreman Attendance:');
  drawBullet('Pencatatan tonase kerja harian & estimasi akumulasi upah mingguan.', '4. Output & Upah Borongan:');
  drawBullet('ID Card digital sederhana ber-QR code untuk tap presensi cepat di pos satpam.', '5. QR Badge PHL:');

  y -= 5;
  page.drawText('B. Sub-Modul 2: HR Staff / Karyawan Tetap PP1', {
    x: margin,
    y: y,
    size: 10,
    font: fontBold,
    color: rgb(0.15, 0.25, 0.55),
  });
  y -= 15;
  drawBullet('NIP BK-PP1-xxx, Jabatan Struktural (Manajer, Foreman, Teknisi, Admin Lab QC).', '1. Master Data Staff:');
  drawBullet('Rotasi Shift 1 (Pagi 07-15), Shift 2 (Sore 15-23), Shift 3 (Malam 23-07).', '2. Penjadwalan Shift:');
  drawBullet('Validasi radius 150 meter dari koordinat sentral pabrik (-7.2504, 112.7688).', '3. Presensi GPS Geofence:');
  drawBullet('Form pengajuan lembur maintenance mesin dengan persetujuan Manajer Operasional.', '4. Pengajuan Lembur / Cuti:');
  drawBullet('Scoring bulanan: Disiplin (30%), Capaian Rendemen (40%), K3 (20%), Inisiatif (10%).', '5. Matriks Scoring KPI:');

  // 5. Langkah Integrasi Lanjutan
  drawSectionTitle('5. ROADMAP INTEGRASI LANJUTAN SETELAH MODUL HR');
  drawBullet('Penyambungan spreadsheet riil untuk tab Data_Pekerja_PHL dan Data_Staff_PP1.', '1. Live Google Sheets GAS V2:');
  drawBullet('Kamera bawaan web app untuk scan ID pekerja dan scan barcode karung bahan baku.', '2. Scanner Kamera Barcode/QR:');
  drawBullet('Cetak rekapitulasi absensi bulanan dan lembar kerja untuk divisi payroll pusat.', '3. Generator Dokumen PDF:');

  const pdfBytes = await pdfDoc.save();

  // Save to public directory for direct browser download
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'BLUEPRINT_WORKSPACE_PP1_BATU_KARANG.pdf');
  fs.writeFileSync(outputPath, pdfBytes);
  console.log('PDF Generated Successfully at:', outputPath);
}

generatePDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
