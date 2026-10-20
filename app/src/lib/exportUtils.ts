import type { Transaction } from '@/types';
import { formatRupiah } from '@/lib/utils';

interface ExportCSVOptions {
  filename?: string;
  startDate?: string;
  endDate?: string;
  filterType?: 'all' | 'income' | 'expense';
}

/**
 * Exports financial transactions to an Excel-friendly CSV with UTF-8 BOM
 * and an executive summary ledger at the bottom.
 */
export function exportTransactionsCSV(
  transactions: Transaction[],
  options: ExportCSVOptions = {}
) {
  const {
    filename = `laporan_keuangan_markas_endog_${new Date().toISOString().split('T')[0]}.csv`,
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

  const escapeCell = (val: string | number) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows: string[] = [];

  // Metadata headers
  rows.push(['MARKAS ENDOG - SISTEM INFORMASI PETERNAKAN AYAM PETELUR'].map(escapeCell).join(','));
  rows.push(['Laporan Rekapitulasi Arus Kas & Keuangan'].map(escapeCell).join(','));
  rows.push([`Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`].map(escapeCell).join(','));
  rows.push([`Periode: ${startDate || 'Awal'} s.d. ${endDate || 'Sekarang'} | Filter: ${filterType.toUpperCase()}`].map(escapeCell).join(','));
  rows.push(''); // empty spacer

  // Table Columns
  const headers = ['No', 'Tanggal', 'Tipe', 'Kategori', 'Keterangan', 'Pemasukan (IDR)', 'Pengeluaran (IDR)', 'Nominal Bersih (IDR)'];
  rows.push(headers.map(escapeCell).join(','));

  // Data rows
  filtered.forEach((tx, idx) => {
    const isIncome = tx.type === 'income';
    const row = [
      idx + 1,
      tx.date,
      isIncome ? 'Pemasukan' : 'Pengeluaran',
      tx.category,
      tx.description || '-',
      isIncome ? tx.amount : 0,
      !isIncome ? tx.amount : 0,
      isIncome ? tx.amount : -tx.amount,
    ];
    rows.push(row.map(escapeCell).join(','));
  });

  // Footer summary
  rows.push('');
  rows.push(['', '', '', '', 'RINGKASAN TOTAL', '', '', ''].map(escapeCell).join(','));
  rows.push(['', '', '', '', 'Total Pemasukan', totalIncome, '', ''].map(escapeCell).join(','));
  rows.push(['', '', '', '', 'Total Pengeluaran', '', totalExpense, ''].map(escapeCell).join(','));
  rows.push(['', '', '', '', 'Laba / (Rugi) Bersih', '', '', netProfit].map(escapeCell).join(','));
  rows.push(['', '', '', '', 'Status Keuangan', '', '', netProfit >= 0 ? 'SURPLUS' : 'DEFISIT'].map(escapeCell).join(','));

  // Build CSV with UTF-8 BOM
  const csvContent = '\uFEFF' + rows.join('\r\n') + '\r\n';
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers clean print-friendly view for Laporan
 */
export function printLaporanKeuangan() {
  window.print();
}
