'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  Upload,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart2,
  Download,
  Printer,
  FileSpreadsheet,
  Calendar,
  Filter,
} from 'lucide-react';
import { Card, Button, Input, Select, SummaryCard, Badge, Modal } from '@/components/ui';
import { FinancialAreaChart } from '@/components/features/Charts';
import CSVUploader from '@/components/features/CSVUploader';
import { useAppState } from '@/lib/AppState';
import { formatRupiah, toISODate, getMonthName } from '@/lib/utils';
import { exportTransactionsCSV, printLaporanKeuangan } from '@/lib/exportUtils';
import { downloadCSVTemplate } from '@/lib/csvTemplates';

const INCOME_CATEGORIES = [
  { value: 'Penjualan Telur', label: 'Penjualan Telur' },
  { value: 'Penjualan Pupuk', label: 'Penjualan Pupuk Kandang' },
  { value: 'Penjualan Ayam', label: 'Penjualan Ayam Afkir' },
  { value: 'Lainnya', label: 'Lainnya' },
];

const EXPENSE_CATEGORIES = [
  { value: 'Pembelian Pakan', label: 'Pembelian Pakan' },
  { value: 'Tenaga Kerja', label: 'Tenaga Kerja' },
  { value: 'Operasional', label: 'Operasional (Listrik, Air)' },
  { value: 'Veteriner', label: 'Veteriner & Obat' },
  { value: 'Peralatan', label: 'Peralatan Kandang' },
  { value: 'Lainnya', label: 'Lainnya' },
];

export default function LaporanPage() {
  const { transactions, marketPrices, addTransaction, addMarketPrice, bulkAddTransactions } = useAppState();

  const [showForm, setShowForm] = useState(false);
  const [showCSV, setShowCSV] = useState(false);
  const [showPriceForm, setShowPriceForm] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [txType, setTxType] = useState<'income' | 'expense'>('income');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');

  // Export options state
  const [exportFilterType, setExportFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [exportStartDate, setExportStartDate] = useState<string>('');
  const [exportEndDate, setExportEndDate] = useState<string>('');

  const [form, setForm] = useState({
    date: toISODate(),
    category: 'Penjualan Telur',
    amount: '',
    description: '',
    notes: '',
  });

  const [priceForm, setPriceForm] = useState({
    date: toISODate(),
    price_per_kg: '',
    price_per_tray: '',
    notes: '',
  });

  // Calculate filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterMonth !== 'all') {
        const d = new Date(t.date);
        const mKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (mKey !== filterMonth) return false;
      }
      return true;
    });
  }, [transactions, filterType, filterMonth]);

  const totalIncome = useMemo(() => {
    return filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  }, [filtered]);

  const totalExpense = useMemo(() => {
    return filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  }, [filtered]);

  const netProfit = totalIncome - totalExpense;

  // Monthly chart data
  const monthlyData = useMemo(() => {
    const months: Record<string, { pemasukan: number; pengeluaran: number; laba: number }> = {};
    transactions.forEach(t => {
      const d = new Date(t.date);
      const key = getMonthName(d.getMonth());
      if (!months[key]) months[key] = { pemasukan: 0, pengeluaran: 0, laba: 0 };
      if (t.type === 'income') months[key].pemasukan += t.amount;
      else months[key].pengeluaran += t.amount;
    });
    return Object.entries(months).map(([month, v]) => ({
      month,
      ...v,
      laba: v.pemasukan - v.pengeluaran,
    }));
  }, [transactions]);

  // Unique months available for filter
  const availableMonths = useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => {
      const d = new Date(t.date);
      set.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    return Array.from(set).sort().reverse();
  }, [transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction({
      date: form.date,
      type: txType,
      category: form.category,
      amount: parseInt(form.amount) || 0,
      description: form.description,
      notes: form.notes,
    });
    setForm({ date: toISODate(), category: 'Penjualan Telur', amount: '', description: '', notes: '' });
    setShowForm(false);
  };

  const handlePriceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMarketPrice({
      date: priceForm.date,
      price_per_kg: parseFloat(priceForm.price_per_kg) || 0,
      price_per_tray: parseFloat(priceForm.price_per_tray) || 0,
      notes: priceForm.notes,
    });
    setPriceForm({ date: toISODate(), price_per_kg: '', price_per_tray: '', notes: '' });
    setShowPriceForm(false);
  };

  const handleTriggerExport = () => {
    exportTransactionsCSV(transactions, {
      filterType: exportFilterType,
      startDate: exportStartDate || undefined,
      endDate: exportEndDate || undefined,
    });
    setShowExportModal(false);
  };

  const categories = txType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Laporan Keuangan & Kas
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Rekapitulasi arus kas masuk, pengeluaran operasional, dan laba bersih peternakan
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            id="btn-export-laporan"
            variant="secondary"
            size="sm"
            onClick={() => setShowExportModal(true)}
          >
            <Download size={14} />
            Export Laporan
          </Button>

          <Button
            id="btn-import-csv-laporan"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowCSV(!showCSV);
              setShowForm(false);
              setShowPriceForm(false);
            }}
          >
            <Upload size={14} />
            Import CSV
          </Button>

          <Button
            id="btn-harga-pasar"
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowPriceForm(!showPriceForm);
              setShowForm(false);
              setShowCSV(false);
            }}
          >
            <BarChart2 size={14} />
            Harga Pasar
          </Button>

          <Button
            id="btn-tambah-transaksi"
            size="sm"
            onClick={() => {
              setShowForm(!showForm);
              setShowCSV(false);
              setShowPriceForm(false);
            }}
          >
            <Plus size={14} />
            Catat Transaksi
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Pemasukan"
          value={formatRupiah(totalIncome)}
          subtitle={`${filtered.filter(t => t.type === 'income').length} transaksi masuk`}
          icon={<TrendingUp size={18} />}
          color="green"
        />
        <SummaryCard
          title="Total Pengeluaran"
          value={formatRupiah(totalExpense)}
          subtitle={`${filtered.filter(t => t.type === 'expense').length} transaksi keluar`}
          icon={<TrendingDown size={18} />}
          color="red"
        />
        <SummaryCard
          title="Laba / (Rugi) Bersih"
          value={formatRupiah(netProfit)}
          subtitle={netProfit >= 0 ? 'Surplus Operasional' : 'Defisit Operasional'}
          icon={<DollarSign size={18} />}
          color={netProfit >= 0 ? 'orange' : 'red'}
        />
      </div>

      {/* Monthly Chart */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Tren Arus Kas Bulanan
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Perbandingan pendapatan, beban pakan/operasional, dan margin laba
            </p>
          </div>
        </div>
        <FinancialAreaChart data={monthlyData} />
      </Card>

      {/* CSV Uploader */}
      {showCSV && (
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Import Riwayat Transaksi dari CSV
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadCSVTemplate('transaksi')}
              className="text-xs"
            >
              <Download size={13} />
              Unduh Template Transaksi
            </Button>
          </div>
          <CSVUploader
            templateType="transaksi"
            onDataParsed={(data) => {
              bulkAddTransactions(data);
              setShowCSV(false);
            }}
          />
        </Card>
      )}

      {/* Market Price Form */}
      {showPriceForm && (
        <Card padding="md">
          <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
            Input Acuan Harga Pasar Telur
          </h3>
          <form onSubmit={handlePriceSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                id="price-date"
                label="Tanggal Acuan"
                type="date"
                value={priceForm.date}
                onChange={e => setPriceForm({ ...priceForm, date: e.target.value })}
                required
              />
              <Input
                id="price-kg"
                label="Harga Telur / kg (IDR)"
                type="number"
                placeholder="28000"
                value={priceForm.price_per_kg}
                onChange={e => setPriceForm({ ...priceForm, price_per_kg: e.target.value })}
                required
              />
              <Input
                id="price-tray"
                label="Harga Telur / tray (IDR)"
                type="number"
                placeholder="55000"
                value={priceForm.price_per_tray}
                onChange={e => setPriceForm({ ...priceForm, price_per_tray: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button id="btn-simpan-harga" type="submit">Simpan Harga Pasar</Button>
              <Button
                id="btn-batal-harga"
                variant="secondary"
                type="button"
                onClick={() => setShowPriceForm(false)}
              >
                Batal
              </Button>
            </div>
          </form>

          {/* Market prices table */}
          {marketPrices.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--border-color)' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: 'var(--bg-primary)' }}>
                    {['Tanggal', 'Harga / kg', 'Harga / tray'].map(h => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left font-semibold"
                        style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                  {marketPrices.slice(0, 5).map(p => (
                    <tr key={p.id} className="table-row-hover">
                      <td className="px-4 py-2 text-slate-600 dark:text-slate-300">
                        {new Date(p.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-orange-600">
                        {formatRupiah(p.price_per_kg)}
                      </td>
                      <td className="px-4 py-2 font-mono font-semibold text-blue-600">
                        {formatRupiah(p.price_per_tray)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Transaction Form */}
      {showForm && (
        <Card padding="md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Catat Transaksi Baru
            </h3>
            {/* Toggle income/expense */}
            <div className="flex rounded-lg border overflow-hidden p-0.5" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}>
              <button
                id="tx-type-income"
                type="button"
                onClick={() => { setTxType('income'); setForm({ ...form, category: 'Penjualan Telur' }); }}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  txType === 'income' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Pemasukan (Masuk)
              </button>
              <button
                id="tx-type-expense"
                type="button"
                onClick={() => { setTxType('expense'); setForm({ ...form, category: 'Pembelian Pakan' }); }}
                className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                  txType === 'expense' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                Pengeluaran (Keluar)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="tx-date"
                label="Tanggal Transaksi"
                type="date"
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                required
              />
              <Select
                id="tx-category"
                label="Kategori"
                options={categories}
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              />
              <Input
                id="tx-amount"
                label="Nominal (IDR)"
                type="number"
                placeholder="Contoh: 1500000"
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                required
              />
              <Input
                id="tx-desc"
                label="Deskripsi / Keterangan"
                placeholder="Penjualan grosir / beli pakan konsentrat"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button id="btn-simpan-tx" type="submit">Simpan Transaksi</Button>
              <Button
                id="btn-batal-tx"
                variant="secondary"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter and Table Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Type tabs */}
        <div className="flex rounded-lg border p-1 gap-1" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}>
          {(['all', 'income', 'expense'] as const).map(type => (
            <button
              key={type}
              id={`filter-${type}`}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterType === type
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {type === 'all' ? 'Semua Arus Kas' : type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </button>
          ))}
        </div>

        {/* Month Filter */}
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            id="filter-month-select"
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border text-slate-700 dark:text-slate-200 cursor-pointer"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          >
            <option value="all">Semua Periode</option>
            {availableMonths.map(m => {
              const [y, mth] = m.split('-');
              return (
                <option key={m} value={m}>
                  {getMonthName(parseInt(mth) - 1)} {y}
                </option>
              );
            })}
          </select>

          <Button
            id="btn-quick-export"
            variant="ghost"
            size="sm"
            onClick={() => exportTransactionsCSV(filtered, {
              filename: `laporan_transaksi_${filterMonth !== 'all' ? filterMonth : 'semua'}.csv`,
              filterType,
            })}
            title="Download CSV tabel saat ini"
          >
            <Download size={13} />
            CSV
          </Button>

          <Button
            id="btn-quick-print"
            variant="ghost"
            size="sm"
            onClick={() => printLaporanKeuangan()}
            title="Cetak atau simpan ke PDF"
          >
            <Printer size={13} />
            Cetak
          </Button>
        </div>
      </div>

      {/* Transactions Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                {['Tanggal', 'Status Arus', 'Kategori', 'Keterangan', 'Nominal'].map((h, idx) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-xs font-semibold ${idx === 4 ? 'text-right' : 'text-left'}`}
                    style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-xs text-slate-400">
                    Tidak ada transaksi pada filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filtered.map(t => (
                  <tr key={t.id} className="table-row-hover">
                    <td className="px-4 py-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                      {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={t.type === 'income' ? 'success' : 'danger'}>
                        {t.type === 'income' ? 'Masuk' : 'Keluar'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                      {t.category}
                    </td>
                    <td className="px-4 py-3 text-xs max-w-[220px] truncate text-slate-800 dark:text-slate-200">
                      {t.description}
                    </td>
                    <td
                      className="px-4 py-3 text-xs font-mono font-bold text-right tabular-nums"
                      style={{ color: t.type === 'income' ? '#059669' : '#e11d48' }}
                    >
                      {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Summary Bar */}
        <div
          className="px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-2"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}
        >
          <p className="text-xs text-slate-500">
            Total {filtered.length} transaksi tercatat
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500">
              Pemasukan: <strong className="text-emerald-600 font-mono">{formatRupiah(totalIncome)}</strong>
            </span>
            <span className="text-slate-500">
              Pengeluaran: <strong className="text-rose-600 font-mono">{formatRupiah(totalExpense)}</strong>
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              Saldo: <strong className="font-mono" style={{ color: netProfit >= 0 ? '#059669' : '#e11d48' }}>
                {formatRupiah(netProfit)}
              </strong>
            </span>
          </div>
        </div>
      </Card>

      {/* Export Modal */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Laporan Keuangan"
        description="Unduh data laporan ke dalam format spreadsheet CSV (kompatibel Microsoft Excel & Google Sheets) atau cetak laporan."
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Tipe Transaksi
            </label>
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Semua Transaksi' },
                { id: 'income', label: 'Pemasukan Saja' },
                { id: 'expense', label: 'Pengeluaran Saja' },
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExportFilterType(opt.id as any)}
                  className={`flex-1 py-1.5 px-3 text-xs font-medium rounded-lg border transition-colors ${
                    exportFilterType === opt.id
                      ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="export-start-date"
              label="Dari Tanggal (Opsional)"
              type="date"
              value={exportStartDate}
              onChange={e => setExportStartDate(e.target.value)}
            />
            <Input
              id="export-end-date"
              label="Sampai Tanggal (Opsional)"
              type="date"
              value={exportEndDate}
              onChange={e => setExportEndDate(e.target.value)}
            />
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border text-xs space-y-1 text-slate-500">
            <p className="font-semibold text-slate-700 dark:text-slate-300">Format File Export:</p>
            <p>• Menggunakan UTF-8 BOM agar angka nominal & tanggal terbaca otomatis oleh Excel tanpa error encoding.</p>
            <p>• Menyertakan baris ringkasan total pemasukan, pengeluaran, dan status surplus/defisit di bagian akhir file.</p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setShowExportModal(false);
                printLaporanKeuangan();
              }}
            >
              <Printer size={14} />
              Cetak / PDF
            </Button>
            <Button
              size="sm"
              onClick={handleTriggerExport}
            >
              <Download size={14} />
              Download CSV (.csv)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
