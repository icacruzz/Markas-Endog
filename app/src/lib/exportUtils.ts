import * as XLSX from 'xlsx';
import type { Transaction, EggProduction, FeedInventory } from '@/types';

interface ExportExcelOptions {
  filename?: string;
  startDate?: string;
  endDate?: string;
  filterType?: 'all' | 'income' | 'expense';
}

/**
 * Exports financial transactions to an Excel (.xlsx) file
 * with an executive summary ledger at the bottom.
 */
export function exportTransactionsExcel(
  transactions: Transaction[],
  options: ExportExcelOptions = {}
) {
  const {
    filename = `laporan_keuangan_markas_endog_${new Date().toISOString().split('T')[0]}.xlsx`,
    startDate,
    endDate,
    filterType = 'all',
  } = options;

  let filtered = transactions;
  if (filterType !== 'all') {
    filtered = filtered.filter(t => t.type === filterType);
  }
  if (startDate) {
    filtered = filtered.filter(t => t.date >= startDate);
  }
  if (endDate) {
    filtered = filtered.filter(t => t.date <= endDate);
  }

  // Calculate totals
  const totalIncome = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpense;

  const rows: (string | number)[][] = [
    ['MARKAS ENDOG - SISTEM INFORMASI PETERNAKAN AYAM PETELUR'],
    ['Laporan Rekapitulasi Arus Kas & Keuangan'],
    [`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`],
    [`Periode: ${startDate || 'Awal'} s.d. ${endDate || 'Sekarang'} | Filter: ${filterType.toUpperCase()}`],
    [],
    ['No', 'Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Pemasukan (IDR)', 'Pengeluaran (IDR)', 'Nominal Bersih (IDR)'],
  ];

  filtered.forEach((tx, idx) => {
    const isIncome = tx.type === 'income';
    rows.push([
      idx + 1,
      tx.date,
      isIncome ? 'Pemasukan' : 'Pengeluaran',
      tx.category,
      tx.description || '-',
      isIncome ? tx.amount : 0,
      !isIncome ? tx.amount : 0,
      isIncome ? tx.amount : -tx.amount,
    ]);
  });

  rows.push([]);
  rows.push(['', '', '', '', 'RINGKASAN TOTAL', '', '', '']);
  rows.push(['', '', '', '', 'Total Pemasukan', totalIncome, '', '']);
  rows.push(['', '', '', '', 'Total Pengeluaran', '', totalExpense, '']);
  rows.push(['', '', '', '', 'Laba / (Rugi) Bersih', '', '', netProfit]);
  rows.push(['', '', '', '', 'Status Keuangan', '', '', netProfit >= 0 ? 'SURPLUS' : 'DEFISIT']);

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws['!cols'] = [
    { wch: 6 },
    { wch: 14 },
    { wch: 14 },
    { wch: 22 },
    { wch: 32 },
    { wch: 18 },
    { wch: 18 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Laporan Keuangan');
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

// Backward-compatibility alias
export const exportTransactionsCSV = exportTransactionsExcel;

/**
 * Exports daily egg production to an Excel (.xlsx) file
 */
export function exportProduksiExcel(
  productions: EggProduction[],
  filename = `data_produksi_telur_${new Date().toISOString().split('T')[0]}.xlsx`
) {
  const headers = [
    'Tanggal',
    'Jumlah Tray',
    'Butir Lepas',
    'Butir Rusak',
    'Total Butir',
    'Total Berat (kg)',
    'Rasio Rusak (%)',
    'Catatan',
  ];

  const rows: (string | number)[][] = [
    ['MARKAS ENDOG - DATA PRODUKSI TELUR HARIAN'],
    [`Tanggal Unduh: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`],
    [],
    headers,
  ];

  productions.forEach(p => {
    const brokenRate = p.total_eggs > 0 ? ((p.broken_eggs / p.total_eggs) * 100).toFixed(1) : '0';
    rows.push([
      p.date,
      p.egg_trays,
      p.loose_eggs,
      p.broken_eggs,
      p.total_eggs,
      p.total_weight_kg,
      Number(brokenRate),
      p.notes || '-',
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 30 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Produksi Telur');
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

/**
 * Exports feed inventory purchases to an Excel (.xlsx) file
 */
export function exportInventarisExcel(
  feedInventory: FeedInventory[],
  filename = `riwayat_pembelian_pakan_${new Date().toISOString().split('T')[0]}.xlsx`
) {
  const headers = [
    'Tanggal',
    'Jenis Pakan',
    'Jumlah (kg)',
    'Harga per kg (IDR)',
    'Total Harga (IDR)',
    'Supplier',
    'Catatan',
  ];

  const rows: (string | number)[][] = [
    ['MARKAS ENDOG - RIWAYAT PEMBELIAN PAKAN AYAM'],
    [`Tanggal Unduh: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`],
    [],
    headers,
  ];

  feedInventory.forEach(f => {
    rows.push([
      f.date,
      f.feed_type,
      f.quantity_kg,
      f.price_per_kg,
      f.total_price,
      f.supplier || '-',
      f.notes || '-',
    ]);
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 14 },
    { wch: 22 },
    { wch: 14 },
    { wch: 20 },
    { wch: 20 },
    { wch: 24 },
    { wch: 30 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Inventaris Pakan');
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

/**
 * Triggers clean print-friendly view for Laporan
 */
export function printLaporanKeuangan() {
  window.print();
}
