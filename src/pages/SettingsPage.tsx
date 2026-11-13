import React, { useState } from 'react';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Download, 
  Upload, 
  Tag, 
  Plus, 
  Keyboard, 
  CheckCircle2 
} from 'lucide-react';
import { useTaskStore } from '../features/tasks/taskStore';
import { useThemeStore } from '../features/theme/themeStore';
import { reminderService } from '../features/reminders/reminderService';
import { PilButton } from '../components/ui/PilButton';
import { Category } from '../types';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { categories, addCategory, exportTasks, importTasks } = useTaskStore();
  const { theme, setTheme, soundEnabled, toggleSound } = useThemeStore();

  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() =>
    reminderService.getPermissionStatus()
  );

  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState<{
    name: Category['colorName'];
    hex: string;
  }>({
    name: 'map-ungu',
    hex: '#52006B',
  });

  const availableColors: { name: Category['colorName']; hex: string; label: string }[] = [
    { name: 'map-ungu', hex: '#52006B', label: 'Ungu' },
    { name: 'map-biru', hex: '#2A1FE0', label: 'Biru' },
    { name: 'map-merah', hex: '#E30000', label: 'Merah' },
    { name: 'map-hijau', hex: '#00705A', label: 'Hijau' },
    { name: 'map-kuning', hex: '#FFE600', label: 'Kuning' },
    { name: 'map-hitam', hex: '#000000', label: 'Hitam' },
  ];

  const handleRequestNotif = async () => {
    const res = await reminderService.requestNotificationPermission();
    setNotifPermission(res);
    if (res === 'granted') {
      toast.success('Izin notifikasi browser diaktifkan!');
      // Test notification
      try {
        new Notification('TugasKu – Notifikasi Aktif', {
          body: 'Anda akan menerima pengingat tenggat tugas tepat waktu.',
          icon: '/favicon.ico',
        });
      } catch {
        // ignore
      }
    } else if (res === 'denied') {
      toast.error('Izin notifikasi ditolak oleh browser.');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim(), selectedColor.name, selectedColor.hex);
    setNewCatName('');
  };

  const handleExport = () => {
    const jsonStr = exportTasks();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TugasKu_Cadangan_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Berkas arsip cadangan berhasil diunduh.');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importTasks(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Settings Header */}
      <div className="mb-10 text-center sm:text-left">
        <span className="font-mono text-xs uppercase tracking-widest text-abu">
          KONFIGURASI SISTEM
        </span>
        <h1 className="font-display text-4xl sm:text-6xl text-tinta uppercase tracking-tight mt-1">
          PENGATURAN ARSIP
        </h1>
        <p className="font-serif text-lg text-abu mt-2">
          Sesuaikan tema, pengingat, kategori berkas, dan cadangan data.
        </p>
      </div>

      <div className="space-y-8">
        {/* 1. Theme Configuration */}
        <section className="bg-kertas text-arsip p-6 sm:p-8 rounded-[2px] shadow-kertas border border-black/10">
          <h2 className="font-display text-2xl uppercase tracking-wide mb-1">
            TEMA TAMPILAN
          </h2>
          <p className="font-serif text-sm text-black/70 mb-5">
            Pilih antara tema Arsip gelap bawaan atau tema Kertas terang bergaya lembaran buku.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('arsip')}
              className={`p-4 rounded-[2px] border-2 text-left transition-all cursor-pointer ${
                theme === 'arsip'
                  ? 'border-black bg-arsip text-tinta shadow-md'
                  : 'border-black/20 bg-black/5 text-arsip hover:border-black/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Moon className="w-5 h-5 text-map-kuning" />
                {theme === 'arsip' && (
                  <CheckCircle2 className="w-4 h-4 text-map-kuning" />
                )}
              </div>
              <div className="font-display text-xl uppercase">TEMA ARSIP (GELAP)</div>
              <div className="font-mono text-xs opacity-75 mt-1">
                Latar hitam netral #141414 dengan tab map cerah.
              </div>
            </button>

            <button
              onClick={() => setTheme('kertas')}
              className={`p-4 rounded-[2px] border-2 text-left transition-all cursor-pointer ${
                theme === 'kertas'
                  ? 'border-black bg-white text-arsip shadow-md'
                  : 'border-black/20 bg-black/5 text-arsip hover:border-black/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Sun className="w-5 h-5 text-yellow-600" />
                {theme === 'kertas' && (
                  <CheckCircle2 className="w-4 h-4 text-green-700" />
                )}
              </div>
              <div className="font-display text-xl uppercase">TEMA KERTAS (TERANG)</div>
              <div className="font-mono text-xs opacity-75 mt-1">
                Latar krem hangat #F4F1EA seperti dokumen koran/arsip.
              </div>
            </button>
          </div>
        </section>

        {/* 2. Notifications & Sounds */}
        <section className="bg-kertas text-arsip p-6 sm:p-8 rounded-[2px] shadow-kertas border border-black/10">
          <h2 className="font-display text-2xl uppercase tracking-wide mb-1">
            PENGINGAT &amp; EFEK SUARA
          </h2>
          <p className="font-serif text-sm text-black/70 mb-5">
            Pastikan browser mengizinkan notifikasi agar reminder tidak terlewat.
          </p>

          <div className="space-y-4">
            {/* Notification Permission Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded border border-black/10">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-map-biru mt-0.5" />
                <div>
                  <div className="font-serif font-bold text-base">Notifikasi Browser</div>
                  <div className="font-mono text-xs text-black/60">
                    Status saat ini:{' '}
                    <span
                      className={`font-bold uppercase ${
                        notifPermission === 'granted'
                          ? 'text-map-hijau'
                          : notifPermission === 'denied'
                          ? 'text-map-merah'
                          : 'text-amber-600'
                      }`}
                    >
                      {notifPermission === 'granted'
                        ? 'Diizinkan'
                        : notifPermission === 'denied'
                        ? 'Ditolak'
                        : 'Belum Diatur'}
                    </span>
                  </div>
                </div>
              </div>

              {notifPermission !== 'granted' ? (
                <PilButton variant="primary" size="sm" onClick={handleRequestNotif}>
                  Izinkan Notifikasi
                </PilButton>
              ) : (
                <button
                  onClick={handleRequestNotif}
                  className="px-3 py-1 bg-black/5 hover:bg-black/10 rounded font-mono text-xs cursor-pointer"
                >
                  Uji Notifikasi
                </button>
              )}
            </div>

            {/* Sound Toggle */}
            <div className="flex items-center justify-between p-4 bg-white rounded border border-black/10">
              <div className="flex items-center gap-3">
                {soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-map-hijau" />
                ) : (
                  <VolumeX className="w-5 h-5 text-black/40" />
                )}
                <div>
                  <div className="font-serif font-bold text-base">Suara Taktil Web Audio</div>
                  <div className="font-mono text-xs text-black/60">
                    Efek gemerisik kertas, centang tugas, dan lonceng reminder.
                  </div>
                </div>
              </div>

              <PilButton
                variant={soundEnabled ? 'primary' : 'secondary'}
                size="sm"
                onClick={toggleSound}
              >
                {soundEnabled ? 'Aktif' : 'Nonaktif'}
              </PilButton>
            </div>
          </div>
        </section>

        {/* 3. Category Management */}
        <section className="bg-kertas text-arsip p-6 sm:p-8 rounded-[2px] shadow-kertas border border-black/10">
          <h2 className="font-display text-2xl uppercase tracking-wide mb-1 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            <span>KELOLA KATEGORI / TAB MAP</span>
          </h2>
          <p className="font-serif text-sm text-black/70 mb-5">
            Kategori bertindak sebagai map folder arsip dengan tab warna tersendiri.
          </p>

          {/* Current Category Badges */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {categories.map((c: Category) => (
              <div
                key={c.id}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded text-white font-serif text-sm shadow-sm"
                style={{ backgroundColor: c.hex }}
              >
                <span>{c.name}</span>
                <span className="font-mono text-[10px] bg-black/20 px-1.5 py-0.5 rounded">
                  {c.colorName}
                </span>
              </div>
            ))}
          </div>

          {/* Add Category Form */}
          <form onSubmit={handleAddCategory} className="space-y-4 pt-4 border-t border-black/10">
            <div className="font-mono text-xs font-bold uppercase text-black/75">
              Tambah Kategori Baru
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Nama kategori (misal: Keuangan, Rapat)..."
                className="bg-white border-2 border-black/20 focus:border-black px-3 py-2 rounded font-serif text-sm focus:outline-none"
              />

              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-black/60">Warna Tab:</span>
                <div className="flex items-center gap-1.5">
                  {availableColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor({ name: color.name, hex: color.hex })}
                      className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                        selectedColor.name === color.name
                          ? 'scale-125 border-black shadow-md'
                          : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>

            <PilButton
              type="submit"
              variant="primary"
              size="sm"
              disabled={!newCatName.trim()}
              className="gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Simpan Kategori</span>
            </PilButton>
          </form>
        </section>

        {/* 4. Backup & Restore Data */}
        <section className="bg-kertas text-arsip p-6 sm:p-8 rounded-[2px] shadow-kertas border border-black/10">
          <h2 className="font-display text-2xl uppercase tracking-wide mb-1">
            PORTABILITAS &amp; CADANGAN ARSIP
          </h2>
          <p className="font-serif text-sm text-black/70 mb-5">
            Cadangkan semua catatan, kategori, dan reminder Anda ke berkas JSON atau pulihkan dari cadangan sebelumnya.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <PilButton variant="primary" size="md" onClick={handleExport} className="gap-2">
              <Download className="w-4 h-4" />
              <span>Ekspor Semua Data (JSON)</span>
            </PilButton>

            <label className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-black/30 hover:border-black text-arsip font-mono text-sm font-semibold cursor-pointer transition-colors bg-white">
              <Upload className="w-4 h-4" />
              <span>Impor Data Cadangan</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </section>

        {/* 5. Keyboard Shortcuts Reference */}
        <section className="bg-kertas text-arsip p-6 sm:p-8 rounded-[2px] shadow-kertas border border-black/10">
          <h2 className="font-display text-2xl uppercase tracking-wide mb-1 flex items-center gap-2">
            <Keyboard className="w-5 h-5" />
            <span>PINTASAN PAPAN KETIK</span>
          </h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
            <div className="p-3 bg-white rounded border border-black/10">
              <kbd className="px-2 py-1 bg-black/10 rounded font-bold mr-2 text-black">
                N
              </kbd>
              <span>Tambah tugas baru</span>
            </div>
            <div className="p-3 bg-white rounded border border-black/10">
              <kbd className="px-2 py-1 bg-black/10 rounded font-bold mr-2 text-black">
                Enter
              </kbd>
              <span>Simpan input cepat</span>
            </div>
            <div className="p-3 bg-white rounded border border-black/10">
              <kbd className="px-2 py-1 bg-black/10 rounded font-bold mr-2 text-black">
                Esc
              </kbd>
              <span>Tutup dialog / panel</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
