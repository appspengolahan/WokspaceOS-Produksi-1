# 📋 MASTER BLUEPRINT & DOKUMENTASI SISTEM: DIVISI PRODUKSI 1 (PP1) WORKSPACE OS
**PT Batu Karang — Unified Industrial Workspace OS & Web Apps Ecosystem**

---

## 1. VISI & TUJUAN PROJECT
Membangun satu portal sistem terpadu (**Unified Workspace OS**) untuk **Divisi Produksi 1 (PP1) - PT Batu Karang**, menggantikan belasan tautan web apps dan spreadsheet terpisah menjadi satu aplikasi web modern dengan:
- Sistem navigasi terintegrasi (*Dual Navigation & Collapsed Sidebar Rail Mode*).
- Database Google Spreadsheet modular (*Next-Gen GAS V2*).
- Manajemen hak akses pengguna (*Role-Based Access Control / RBAC*).
- PWA multi-platform (dapat diinstall di PC pabrik dan smartphone operasional lapangan).

---

## 2. ARSITEKTUR STRUKTUR & 11+ MODUL EKOSISTEM

### A. Modul Persediaan & Gudang
1. **Monitoring Stock PP1 (Modul A)**: Data stok persediaan Cengkeh (Zanzibar, Madura), Tembakau (Kasturi, Madura Gunung), Krosok (Boyolali, Temanggung), dan Tembakau Blend di Gudang A, B, C, dan D secara real-time. *(Sudah terhubung live ke Vercel)*.
2. **Monitoring Mutasi Stock PP1**: Log pergerakan barang masuk, keluar, dan transfer internal antar-gudang dengan nomor lot/batch.

### B. Modul Data Proses Produksi
3. **General Monitoring PP1**: Telemetri OEE pabrik, status 4 lini mesin pengolahan, suhu ambience, dan kelembaban (RH).
4. **Monitoring Data Proses Cengkeh**: Rekap proses sortasi gagang, perajangan cengkeh, kadar air (MC), dan rendemen.
5. **Monitoring Data Proses Tembakau**: Rekap rotary cutter, conditioning uap, dan sortasi tembakau.
6. **Monitoring Data Proses Krosok**: Rekap daun utuh, fermentasi, dan destemming daun krosok.
7. **Monitoring Data Proses Blend**: Rekap racikan formula homogenisasi tembakau dan saus perisa.
8. **Formula Blend Lab (Admin Only)**: Formulasi rasio rahasia racikan blend premium PT Batu Karang.

### C. Modul Administrasi, Persuratan & Pengadaan
9. **Log Surat & Template PP1 (Modul C)**: Database persuratan, pengarsipan resmi, penomoran otomatis berstandar `[No]/PP1-BK/[BulanRomawi]/[Tahun]`, dan cetak surat berkop resmi.
10. **Surat Permintaan Pembelian (SPP - Modul E)**: Sistem pengajuan pengadaan suku cadang mesin dan APD dengan alur approval manajerial.
11. **CRM Clients Hub**: Direktori mitra industri rokok, pemasok bahan baku, kuota kontrak, dan tonase kirim.

### D. Modul Ketenagakerjaan (HR System)
12. **Database HR Pekerja Harian Lepas (PHL)**: Database buruh borongan/harian untuk sortasi dan grading.
13. **Database HR Staff / Karyawan Tetap**: Struktur personil operasional, mandor/foreman, teknisi mesin, dan PIC lini.
14. **Presensi GPS Geofence**: Validasi absensi berbasis koordinat radius 150 meter dari pabrik.
15. **Pengukuran KPI Karyawan**: Matriks scoring performa kerja, disiplin jam kerja, dan bonus produktivitas.
16. **Portal Rekrutmen**: Seleksi tenaga kerja musiman saat panen raya.

---

## 3. STATUS PENCAPAIAN SISTEM (TAHAP YANG SUDAH SELESAI)

| No | Fitur / Komponen | Status | Keterangan |
|---|---|---|---|
| 1 | **Portal Shell & Dual Navigation** | ✅ Selesai | Mini Sidebar Rail Mode (Desktop/Tablet) + Drawer & Bottom Tab Bar (Mobile). |
| 2 | **Single Board Master Apps PP1** | ✅ Selesai | Filter Kategori, Status, Visibility, Counter Cards, dan List/Grid View. |
| 3 | **Theme Switcher** | ✅ Selesai | Dukungan Mode Terang (Light) dan Mode Gelap (Dark) kontras tinggi. |
| 4 | **PWA & Fullscreen Capability** | ✅ Selesai | Installable di Desktop/PC dan Handphone (Android/iOS) + Fullscreen mode. |
| 5 | **Role-Based Access Control (RBAC)** | ✅ Selesai | Profil switcher: Super Admin, Project Manager (Lalu M.), dan Staff Operasional. |
| 6 | **Integrasi Live Vercel Modul A** | ✅ Selesai | Terhubung live ke `https://monitoring-stock-pp-1-pro-api.vercel.app/` dengan switcher Vercel Live vs Tampilan Portal. |
| 7 | **Arsitektur GAS V2 Modular Router** | ✅ Selesai | Panel konfigurasi endpoint per modul + Generator skrip Google Apps Script V2. |
| 8 | **Deployment Production** | ✅ Selesai | Terintegrasi ke GitHub dan live di Vercel dengan routing `vercel.json` aktif. |

---

## 4. INSTRUKSI TAHAP SELANJUTNYA: MODUL HR PEKERJA & HR STAFF

Fokus berikutnya adalah mematangkan modul **HR Pekerja Harian Lepas (PHL)**, disusul oleh modul **HR Staff Tetap PP1**.

### A. Rencana Modul HR Pekerja Harian Lepas (PHL)
Pekerja Harian Lepas memiliki karakteristik dinamis, sistem upah borongan/harian, dan perputaran cepat saat musim panen:
1. **Data Pokok Pekerja PHL**:
   - NIP Khusus (format: `BK-PP1-PHL-xxx`), Foto, Nama Lengkap, No KTP, Alamat Asal, No HP/WA Darurat.
   - Pos Penugasan Lini: *Sortasi Cengkeh, Grading Daun Krosok, Packing & Karung, Kebersihan Area*.
2. **Sistem Pencatatan Hari Kerja & Upah Borongan**:
   - Rekap harian absensi mandor (*Foreman Attendance Check*).
   - Perhitungan tonase hasil kerja harian (misal: Supardi berhasil sortir 180 Kg cengkeh/hari).
   - Kalkulasi estimasi upah mingguan berdasarkan hasil kerja / kehadiran.
3. **Kartu Tanda Pengenal / QR Card PHL**:
   - ID card sederhana ber-QR code untuk tap presensi cepat di pos satpam pabrik.

### B. Rencana Modul HR Staff / Karyawan Tetap
Staf tetap memiliki tanggung jawab struktural, jam kerja shift tetap, dan evaluasi KPI berkala:
1. **Data Pokok Staff**:
   - NIP Staff (format: `BK-PP1-xxx`), Jabatan (*Manajer, Foreman, Teknisi, Admin Lab QC, Operator Senior*).
   - Hak Akses Role (terkoneksi langsung ke RBAC sistem).
   - Jadwal Rotasi Shift Kerja (*Shift 1 Pagi, Shift 2 Sore, Shift 3 Malam*).
2. **Presensi GPS Geofence & Riwayat Lembur (Overtime)**:
   - Validasi radius 150 meter dari titik pabrik `(-7.2504, 112.7688)`.
   - Form pengajuan dan persetujuan lembur saat maintenance mesin rajang / overload order.
3. **Pengukuran KPI & Kinerja Bulanan**:
   - Evaluasi pencapaian rendemen target (min. 90%), zero-accident K3, dan kepatuhan SOP sanitasi pabrik.

---

## 5. REKOMENDASI TAHAP SETELAH MODUL HR SELESAI
1. **Two-Way Live Sync Google Sheets**: Menghubungkan Google Sheet riil divisi untuk tab `Data_Pekerja_PHL` dan `Data_Staff_PP1`.
2. **Scanner Kamera Barcode/QR Code**: Kamera bawaan web app untuk scan ID pekerja atau scan karung bahan baku.
3. **Cetak Slip Gaji & Rekap Absensi PDF**: Fitur cetak 1-klik untuk rekap laporan bulanan ke Manajemen Pusat.
