import { create } from 'zustand';

export type AppTheme = 'arsip' | 'kertas';

interface ThemeState {
  theme: AppTheme;
  soundEnabled: boolean;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
  toggleSound: () => void;
}

const STORAGE_KEY_THEME = 'tugasku_theme_v1';
const STORAGE_KEY_SOUND = 'tugasku_sound_enabled_v1';

export const useThemeStore = create<ThemeState>((set, get) => {
  const savedTheme = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_THEME) : null) as AppTheme | null;
  const initialTheme: AppTheme = savedTheme === 'kertas' ? 'kertas' : 'arsip';

  const savedSound = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_SOUND) : null;
  const initialSound = savedSound !== 'false';

  // Apply initially
  if (typeof document !== 'undefined') {
    if (initialTheme === 'kertas') {
      document.documentElement.setAttribute('data-theme', 'kertas');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  return {
    theme: initialTheme,
    soundEnabled: initialSound,
    setTheme: (theme) => {
      if (typeof document !== 'undefined') {
        if (theme === 'kertas') {
          document.documentElement.setAttribute('data-theme', 'kertas');
        } else {
          document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem(STORAGE_KEY_THEME, theme);
      }
      set({ theme });
    },
    toggleTheme: () => {
      const nextTheme = get().theme === 'arsip' ? 'kertas' : 'arsip';
      get().setTheme(nextTheme);
    },
    toggleSound: () => {
      const nextSound = !get().soundEnabled;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_SOUND, String(nextSound));
      }
      set({ soundEnabled: nextSound });
    },
  };
});
