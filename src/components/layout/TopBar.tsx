import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FolderKanban, 
  Calendar as CalendarIcon, 
  BarChart3, 
  Settings as SettingsIcon, 
  Search, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Plus
} from 'lucide-react';
import { useTaskStore } from '../../features/tasks/taskStore';
import { useThemeStore } from '../../features/theme/themeStore';
import { PilButton } from '../ui/PilButton';
import { cn } from '../../lib/utils';

interface TopBarProps {
  onOpenNewTaskModal: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenNewTaskModal }) => {
  const location = useLocation();
  const { searchQuery, setSearchQuery } = useTaskStore();
  const { theme, toggleTheme, soundEnabled, toggleSound } = useThemeStore();

  const navItems = [
    { label: 'Laci Berkas', path: '/', icon: FolderKanban },
    { label: 'Kalender', path: '/kalender', icon: CalendarIcon },
    { label: 'Statistik', path: '/statistik', icon: BarChart3 },
    { label: 'Pengaturan', path: '/pengaturan', icon: SettingsIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-tinta/10 bg-arsip/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 group text-tinta hover:text-map-kuning transition-colors"
          >
            <div className="w-8 h-8 rounded-sm bg-map-kuning flex items-center justify-center text-arsip font-display text-xl font-bold tracking-tighter">
              T
            </div>
            <span className="font-display text-2xl sm:text-3xl tracking-tight uppercase">
              TugasKu
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 font-mono text-xs uppercase tracking-wider text-abu">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all',
                    isActive
                      ? 'bg-tinta/10 text-tinta font-semibold border border-tinta/20'
                      : 'hover:text-tinta hover:bg-tinta/5'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Input */}
          <div className="relative hidden sm:block w-48 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-abu pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berkas tugas..."
              className="w-full pl-9 pr-3 py-1.5 bg-tinta/5 hover:bg-tinta/10 focus:bg-tinta/10 border border-tinta/15 focus:border-map-kuning rounded-full font-mono text-xs text-tinta placeholder:text-abu focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-abu hover:text-tinta font-mono text-xs"
              >
                ×
              </button>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Matikan suara efek' : 'Aktifkan suara efek'}
            className="w-9 h-9 rounded-full flex items-center justify-center text-abu hover:text-tinta hover:bg-tinta/10 transition-colors cursor-pointer"
            title={soundEnabled ? 'Suara aktif (klik untuk membisukan)' : 'Suara bisu'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Switcher: Arsip (Dark) vs Kertas (Light) */}
          <button
            onClick={toggleTheme}
            aria-label={`Ubah ke tema ${theme === 'arsip' ? 'Kertas (Terang)' : 'Arsip (Gelap)'}`}
            className="w-9 h-9 rounded-full flex items-center justify-center text-abu hover:text-tinta hover:bg-tinta/10 transition-colors cursor-pointer"
            title={`Tema saat ini: ${theme === 'arsip' ? 'Arsip (Gelap)' : 'Kertas (Terang)'}`}
          >
            {theme === 'arsip' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* New Task Button */}
          <PilButton
            variant="primary"
            size="sm"
            onClick={onOpenNewTaskModal}
            className="gap-1.5 shadow-md"
            title="Tambah tugas baru (Pintasan: N)"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Tugas Baru</span>
          </PilButton>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-tinta/10 py-2 px-2 bg-arsip/95 font-mono text-[11px] text-abu">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-2 py-1 rounded transition-colors',
                isActive ? 'text-map-kuning font-semibold' : 'hover:text-tinta'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
};
