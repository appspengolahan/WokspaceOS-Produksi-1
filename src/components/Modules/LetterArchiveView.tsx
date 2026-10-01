import React, { useState, useMemo } from 'react';
import { 
  MailCheck, 
  FileText, 
  Printer, 
  Plus, 
  Search, 
  Download, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Eye,
  FileSignature
} from 'lucide-react';
import { LetterRecord, UserRole } from '../../types';

interface LetterArchiveViewProps {
  letters: LetterRecord[];
  onAddLetter: (letter: Omit<LetterRecord, 'id'>) => void;
  userRole: UserRole;
  onOpenGasModal: () => void;
}

export const LetterArchiveView: React.FC<LetterArchiveViewProps> = ({
  letters,
  onAddLetter,
  userRole,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [previewLetter, setPreviewLetter] = useState<LetterRecord | null>(null);

  // Form states
  const nextSeq = (letters.length + 42).toString().padStart(3, '0');
  const currentRomanMonth = 'IX'; // September
  const currentYear = '2026';
  const generatedAutoNo = `${nextSeq}/PP1-BK/${currentRomanMonth}/${currentYear}`;

  const [letterNumber, setLetterNumber] = useState(generatedAutoNo);
  const [letterType, setLetterType] = useState<LetterRecord['type']>('Surat Jalan');
  const [title, setTitle] = useState('');
  const [senderOrRecipient, setSenderOrRecipient] = useState('');
  const [classification, setClassification] = useState<'Biasa' | 'Penting' | 'Rahasia'>('Biasa');
  const [contentSnippet, setContentSnippet] = useState('');

  const filteredLetters = useMemo(() => {
    return letters.filter((letItem) => {
      const matchType = selectedTypeFilter === 'Semua' || letItem.type === selectedTypeFilter;
      const matchSearch =
        letItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        letItem.letterNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        letItem.senderOrRecipient.toLowerCase().includes(searchQuery.toLowerCase());
      return matchType && matchSearch;
    });
  }, [letters, selectedTypeFilter, searchQuery]);

  const handleCreateLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddLetter({
      letterNumber,
      type: letterType,
      title,
      senderOrRecipient: senderOrRecipient || 'Internal Divisi Produksi 1',
      date: new Date().toISOString().slice(0, 10),
      classification,
      status: 'Tercatat',
      contentSnippet: contentSnippet || 'Surat resmi operasional Divisi Produksi 1 PT Batu Karang.'
    });

    setShowAddModal(false);
    setTitle('');
    setSenderOrRecipient('');
    setContentSnippet('');
    setLetterNumber(`${(letters.length + 43).toString().padStart(3, '0')}/PP1-BK/${currentRomanMonth}/${currentYear}`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-700 text-white">
              PP1 - PERSURATAN & ARSIP
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Penomoran Otomatis Standard PT Batu Karang
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mt-1">
            Database Log Surat, Pengarsipan & Template Otomatis
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Surat / Template Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nomor surat, perihal, atau tujuan..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
            >
              <option value="Semua">Semua Jenis Surat</option>
              <option value="Surat Jalan">Surat Jalan</option>
              <option value="Surat Masuk">Surat Masuk</option>
              <option value="Surat Keluar">Surat Keluar</option>
              <option value="Surat Tugas">Surat Tugas</option>
              <option value="Berita Acara">Berita Acara</option>
              <option value="Memo Internal">Memo Internal</option>
            </select>
          </div>
        </div>

        {/* Letters Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">No. Surat Resmi</th>
                <th className="py-2.5 px-3">Jenis & Tanggal</th>
                <th className="py-2.5 px-3">Perihal / Judul Surat</th>
                <th className="py-2.5 px-3">Pihak Terkait</th>
                <th className="py-2.5 px-3 text-center">Klasifikasi</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLetters.map((letter) => (
                <tr key={letter.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-sky-400">
                    {letter.letterNumber}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white">{letter.type}</div>
                    <div className="text-[11px] text-slate-400">{letter.date}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {letter.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      {letter.contentSnippet}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {letter.senderOrRecipient}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      letter.classification === 'Penting'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        : letter.classification === 'Rahasia'
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {letter.classification}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      {letter.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => setPreviewLetter(letter)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <span>Lihat & Cetak</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Letter Preview & Print Modal */}
      {previewLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white text-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-300 my-8">
            {/* Action Bar (hidden on print) */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-200 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pratinjau Format Surat Resmi PT Batu Karang
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Surat</span>
                </button>
                <button
                  onClick={() => setPreviewLetter(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Official Letterhead (Kop Surat) */}
            <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
              <h2 className="text-lg font-black tracking-tight text-slate-950 uppercase">
                PT BATU KARANG
              </h2>
              <p className="text-xs font-bold text-slate-800 tracking-wide">
                DIVISI PRODUKSI 1 — PENGOLAHAN TEMBAKAU, CENGKEH & BLEND
              </p>
              <p className="text-[11px] text-slate-600">
                Kawasan Industri Pabrik Pengolahan No. 88, Jawa Timur · Telp: (031) 8921-BK · Email: pp1@batukarang.co.id
              </p>
            </div>

            {/* Letter Meta */}
            <div className="pt-6 pb-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <div>
                  <div><span className="font-semibold">Nomor:</span> {previewLetter.letterNumber}</div>
                  <div><span className="font-semibold">Perihal:</span> {previewLetter.title}</div>
                  <div><span className="font-semibold">Klasifikasi:</span> {previewLetter.classification}</div>
                </div>
                <div className="text-right">
                  <div>Batu Karang, {previewLetter.date}</div>
                  <div className="font-semibold text-slate-700 mt-2">{previewLetter.senderOrRecipient}</div>
                </div>
              </div>
            </div>

            {/* Letter Body */}
            <div className="py-6 text-xs text-slate-800 leading-relaxed border-t border-b border-slate-200 space-y-4">
              <p>Dengan hormat,</p>
              <p>{previewLetter.contentSnippet}</p>
              <p>
                Demikian surat {previewLetter.type.toLowerCase()} ini diterbitkan secara sah melalui Single Board Unified Workspace OS Divisi Produksi 1 PT Batu Karang untuk dipergunakan sebagaimana mestinya dengan penuh tanggung jawab.
              </p>
            </div>

            {/* Signature Area */}
            <div className="pt-8 flex justify-end text-xs">
              <div className="text-center space-y-14 w-60">
                <div>
                  <p>Hormat kami,</p>
                  <p className="font-semibold text-slate-900">Divisi Produksi 1 PT Batu Karang</p>
                </div>
                <div>
                  <p className="font-bold underline text-slate-950">Lalu M. Rahmatullah</p>
                  <p className="text-[11px] text-slate-600">Manajer Operasional PP1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Letter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSignature className="w-4 h-4 text-blue-500" />
                <span>Buat & Registrasi Surat Baru PP1</span>
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLetter} className="space-y-3.5 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nomor Surat Otomatis
                  </label>
                  <input
                    type="text"
                    value={letterNumber}
                    onChange={(e) => setLetterNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-sky-400 font-mono font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Jenis Surat
                  </label>
                  <select
                    value={letterType}
                    onChange={(e) => setLetterType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Surat Jalan">Surat Jalan</option>
                    <option value="Surat Masuk">Surat Masuk</option>
                    <option value="Surat Keluar">Surat Keluar</option>
                    <option value="Surat Tugas">Surat Tugas</option>
                    <option value="Berita Acara">Berita Acara</option>
                    <option value="Memo Internal">Memo Internal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Perihal / Judul Surat
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Pengiriman Tembakau Blend Musim Panen ke Mitra"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Pihak Pengirim / Penerima
                  </label>
                  <input
                    type="text"
                    value={senderOrRecipient}
                    onChange={(e) => setSenderOrRecipient(e.target.value)}
                    placeholder="Contoh: PT Karang Pratama Nusantara"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Klasifikasi
                  </label>
                  <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Biasa">Biasa</option>
                    <option value="Penting">Penting</option>
                    <option value="Rahasia">Rahasia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Isi / Ringkasan Surat
                </label>
                <textarea
                  rows={3}
                  value={contentSnippet}
                  onChange={(e) => setContentSnippet(e.target.value)}
                  placeholder="Keterangan rincian barang, jumlah tonase, armada pengangkut, atau instruksi kerja..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
                >
                  Simpan & Daftarkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
