import { type PeriodMode, type ViewMode } from '../types/saved';

export const parseDateParam = (value: string | null): Date => {
  if (!value) return new Date();
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return new Date();
  return new Date(year, month - 1, day);
};

export const formatDateParam = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const isPeriodMode = (value: string | null): value is PeriodMode =>
  value === 'day' || value === 'week';

export const isViewMode = (value: string | null): value is ViewMode =>
  value === 'list' || value === 'chart';