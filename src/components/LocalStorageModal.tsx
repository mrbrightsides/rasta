import { useState, useRef, ChangeEvent } from 'react';
import {
  HardDrive,
  Download,
  Upload,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  Database,
  FileSpreadsheet,
  Target,
} from 'lucide-react';
import {
  getLocalStorageMetrics,
  exportAllLocalStorageBackup,
  importLocalStorageBackup,
  resetDemo,
} from '../lib/api';

interface LocalStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged?: () => void;
}

export default function LocalStorageModal({
  isOpen,
  onClose,
  onDataChanged,
}: LocalStorageModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const metrics = getLocalStorageMetrics();

  const handleExport = () => {
    try {
      const jsonStr = exportAllLocalStorageBackup();
      const dataUri = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
      const exportFileDefaultName = `RASTA_Petanque_Backup_${new Date().toISOString().split('T')[0]}.json`;

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      linkElement.remove();

      setSuccessMsg('Seluruh data LocalStorage berhasil diunduh dalam format JSON!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Gagal mengekspor data LocalStorage.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const ok = importLocalStorageBackup(text);
        if (ok) {
          setSuccessMsg('Data LocalStorage berhasil diimpor! Halaman akan memuat data terbaru.');
          if (onDataChanged) onDataChanged();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setErrorMsg('Format file JSON tidak sesuai dengan skema RASTA.');
        }
      } catch (err) {
        setErrorMsg('Gagal membaca file cadangan.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleReset = async () => {
    if (
      window.confirm(
        'Muat ulang 3 data pertandingan resmi riset Disertasi (Tabel 1.1 Triple Men, Mixed Triple, SEA Games)? Data lokal Anda akan diperbarui.'
      )
    ) {
      await resetDemo();
      setSuccessMsg('Data 3 pertandingan resmi riset berhasil dimuat ulang!');
      if (onDataChanged) onDataChanged();
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#002395] to-[#0a35b8] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <HardDrive className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-black text-lg tracking-tight">Status Penyimpanan LocalStorage</h3>
              <p className="text-white/75 text-xs">Penyimpanan Offline Langsung di Browser Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Notifications */}
          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Explanation Banner */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-600 leading-relaxed">
            <p className="font-semibold text-slate-800 mb-1">
              ✓ 100% Tersimpan di Komputer/Browser Anda (Sesuai Arahan)
            </p>
            Semua aksi lemparan per babak, skor, atlet, serta lembar nilai <strong>Precision Shooting</strong> disimpan secara otomatis dan instan ke <strong>localStorage</strong> browser tanpa ketergantungan koneksi internet.
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <Database className="w-4 h-4 text-[#002395] mx-auto mb-1" />
              <div className="text-xl font-black text-[#002395]">{metrics.matchesCount}</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Pertandingan</div>
            </div>

            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100">
              <Target className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <div className="text-xl font-black text-amber-600">{metrics.precisionSheetsCount}</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Lembar Presisi</div>
            </div>

            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-xl font-black text-emerald-600">~{metrics.approximateKb} KB</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Ukuran Data</div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleExport}
              className="w-full py-2.5 px-4 bg-[#002395] hover:bg-[#001c77] text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Unduh Cadangan Lengkap (.JSON)</span>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4 text-emerald-600" />
              <span>Pulihkan / Impor dari File Cadangan (.JSON)</span>
            </button>

            <button
              onClick={handleReset}
              className="w-full py-2 px-4 text-slate-500 hover:text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Muat Ulang 3 Pertandingan Standar Disertasi UNP</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex justify-between items-center text-[11px] text-slate-500">
          <span>Rasyo Technology Analysis Petanque (RASTA)</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-slate-300 rounded font-bold text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
