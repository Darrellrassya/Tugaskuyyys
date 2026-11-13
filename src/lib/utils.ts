import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, isToday, isTomorrow, isPast, parseISO, isValid } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns a stable, deterministic slight rotation (-3deg to 3deg)
 * based on the string ID so cards don't jitter on re-renders.
 */
export function getTaskRotation(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const angles = [-3, -2, -1, 1, 2, 3, -1.5, 1.5];
  const index = Math.abs(hash) % angles.length;
  return angles[index];
}

export function formatDateTime(isoString?: string): string {
  if (!isoString) return '';
  const date = parseISO(isoString);
  if (!isValid(date)) return '';
  return format(date, "d MMM yyyy, HH:mm", { locale: idLocale });
}

export function formatDueLabel(isoString?: string): { label: string; isOverdue: boolean } {
  if (!isoString) return { label: 'Tanpa tenggat', isOverdue: false };
  const date = parseISO(isoString);
  if (!isValid(date)) return { label: 'Tanpa tenggat', isOverdue: false };

  const isOverdue = isPast(date) && !isToday(date);
  const timeStr = format(date, 'HH:mm');

  if (isToday(date)) {
    return { label: `Hari ini, ${timeStr}`, isOverdue: isPast(date) };
  }
  if (isTomorrow(date)) {
    return { label: `Besok, ${timeStr}`, isOverdue: false };
  }
  return {
    label: format(date, "d MMM, HH:mm", { locale: idLocale }),
    isOverdue,
  };
}

export function formatShortDate(date: Date): string {
  return format(date, "d MMMM yyyy", { locale: idLocale });
}

export function formatDayHeader(date: Date = new Date()): string {
  const dayName = format(date, "EEEE, d MMMM yyyy", { locale: idLocale });
  return dayName.toUpperCase();
}
