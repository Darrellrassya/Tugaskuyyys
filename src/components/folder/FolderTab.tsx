import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FolderTabProps {
  name: string;
  count: number;
  colorHex: string;
  isOpen: boolean;
  onToggle: () => void;
  accentText?: string;
  badge?: string;
}

export const FolderTab: React.FC<FolderTabProps> = ({
  name,
  count,
  colorHex,
  isOpen,
  onToggle,
  accentText,
  badge,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'w-full flex items-center justify-between px-6 sm:px-8 py-3.5 sm:py-4 transition-all duration-300 cursor-pointer select-none rounded-t-[24px] sm:rounded-t-[28px] rounded-b-none shadow-md',
        isOpen ? 'brightness-105 z-10 -translate-y-1' : 'brightness-90 hover:brightness-100 opacity-95'
      )}
      style={{ backgroundColor: colorHex }}
      aria-expanded={isOpen}
    >
      {/* Left: Tab title in Serif */}
      <div className="flex items-center gap-3">
        <span className="font-serif font-bold text-xl sm:text-2xl text-white tracking-tight">
          {name}
        </span>
        {badge && (
          <span className="font-mono text-[10px] sm:text-xs bg-black/30 text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold">
            {badge}
          </span>
        )}
      </div>

      {/* Right: Monospace count and expansion arrow */}
      <div className="flex items-center gap-4 text-white font-mono text-xs sm:text-sm">
        <span>
          {accentText ? `${accentText} · ` : ''}
          {count} {count === 1 ? 'berkas' : 'tugas'}
        </span>
        <ChevronDown
          className={cn(
            'w-4 h-4 transition-transform duration-300 stroke-[2.5]',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
        />
      </div>
    </button>
  );
};
