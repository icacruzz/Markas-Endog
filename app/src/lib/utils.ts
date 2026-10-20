import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format angka ke format Rupiah Indonesia
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format angka dengan separator ribuan
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format tanggal ke format Indonesia
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Format tanggal pendek
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Hitung total butir telur
 * total_butir = egg_trays * 30 + loose_eggs
 */
export function calculateTotalEggs(trays: number, looseEggs: number): number {
  return trays * 30 + looseEggs;
}

/**
 * Hitung estimasi hari habis stok pakan
 */
export function calculateFeedDaysLeft(stockKg: number, dailyUsageKg: number): number {
  if (dailyUsageKg <= 0) return 0;
  return Math.floor(stockKg / dailyUsageKg);
}

/**
 * Dapatkan warna status stok pakan
 */
export function getFeedStockStatus(daysLeft: number): 'critical' | 'warning' | 'good' {
  if (daysLeft <= 3) return 'critical';
  if (daysLeft <= 7) return 'warning';
  return 'good';
}

/**
 * Format tanggal ke format ISO (YYYY-MM-DD) untuk input
 */
export function toISODate(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

/**
 * Dapatkan nama hari dalam Bahasa Indonesia
 */
export function getDayName(dateStr: string): string {
  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  const date = new Date(dateStr);
  return days[date.getDay()];
}

/**
 * Dapatkan nama bulan dalam Bahasa Indonesia
 */
export function getMonthName(monthIndex: number): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  return months[monthIndex];
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
