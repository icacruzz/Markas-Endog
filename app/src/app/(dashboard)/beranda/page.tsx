'use client';

import { useMemo } from 'react';
import {
  Egg,
  Package,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { SummaryCard, Alert, Card, Button } from '@/components/ui';
import { ProductionBarChart, FinancialAreaChart } from '@/components/features/Charts';
import { useAppState } from '@/lib/AppState';
import { formatRupiah, formatNumber, calculateFeedDaysLeft, getDayName, getMonthName } from '@/lib/utils';

export default function BerandaPage() {
  const { productions, transactions, getFeedStockKg, getAvgDailyUsage } = useAppState();

  const today = new Date().toISOString().split('T')[0];
  const todayProduction = productions.find(p => p.date === today) || productions[0];

  const feedStockKg = getFeedStockKg();
  const avgDailyUsage = getAvgDailyUsage();
  const feedDaysLeft = calculateFeedDaysLeft(feedStockKg, avgDailyUsage);

  // Weekly production chart data
  const weeklyData = useMemo(() => {
    return productions.slice(0, 7).reverse().map(p => ({
      day: getDayName(p.date),
      telur: p.total_eggs,
      rusak: p.broken_eggs,
      berat: p.total_weight_kg,
    }));
  }, [productions]);

  // Monthly financial data
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

  // Financial summary
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // Recent transactions
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Feed stock alert - Clean, non-intrusive */}
      {feedDaysLeft <= 7 && (
        <Alert
          type={feedDaysLeft <= 3 ? 'danger' : 'warning'}
          title={feedDaysLeft <= 3 ? 'Perhatian: Stok Pakan Kritis' : 'Peringatan: Persediaan Pakan Menipis'}
          message={`Cadangan pakan tersisa ${feedStockKg.toFixed(0)} kg (cukup untuk ±${feedDaysLeft} hari). Segera lakukan pemesanan ke pemasok.`}
          action={
            <Link href="/inventaris">
              <Button size="sm" variant={feedDaysLeft <= 3 ? 'danger' : 'primary'}>
                Kelola Stok
              </Button>
            </Link>
          }
        />
      )}

      {/* Page Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-1">
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Ikhtisar Operasional
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Data panen telur hari ini, ketersediaan pakan, dan ringkasan arus kas
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="/produksi">
            <Button size="sm">
              <Plus size={15} />
              <span>Catat Panen Baru</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <SummaryCard
          title="Produksi Hari Ini"
          value={todayProduction ? `${formatNumber(todayProduction.total_eggs)}` : '—'}
          subtitle={todayProduction ? `${todayProduction.egg_trays} tray · ${todayProduction.total_weight_kg} kg` : 'Belum tercatat'}
          icon={<Egg size={18} />}
          color="orange"
          trend={{ value: 3.2, label: 'vs kemarin' }}
        />
        <SummaryCard
          title="Sisa Stok Pakan"
          value={`${feedStockKg.toFixed(0)} kg`}
          subtitle={`Estimasi habis ±${feedDaysLeft} hari`}
          icon={<Package size={18} />}
          color={feedDaysLeft <= 7 ? 'red' : 'blue'}
        />
        <SummaryCard
          title="Total Pemasukan"
          value={formatRupiah(totalIncome)}
          subtitle="Bulan berjalan"
          icon={<TrendingUp size={18} />}
          color="green"
          trend={{ value: 8.5, label: 'vs bulan lalu' }}
        />
        <SummaryCard
          title="Total Pengeluaran"
          value={formatRupiah(totalExpense)}
          subtitle={`Laba: ${formatRupiah(totalIncome - totalExpense)}`}
          icon={<TrendingDown size={18} />}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-5">
        {/* Production Chart */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                Tren Hasil Panen Telur (7 Hari)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Perbandingan butir utuh vs retak</p>
            </div>
            <Link
              href="/produksi"
              className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
            >
              Lihat Panen <ChevronRight size={14} />
            </Link>
          </div>
          <ProductionBarChart data={weeklyData} />
        </Card>

        {/* Financial Chart */}
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                Grafik Arus Kas Bulanan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pemasukan penjualan vs pengeluaran operasional</p>
            </div>
            <Link
              href="/laporan"
              className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-semibold inline-flex items-center gap-1"
            >
              Buku Kas <ChevronRight size={14} />
            </Link>
          </div>
          <FinancialAreaChart data={monthlyData} />
        </Card>
      </div>

      {/* Bottom Row: Recent Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Recent production */}
        <Card padding="none">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Riwayat Panen Terakhir</h3>
            <Link href="/produksi" className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                  <th className="px-4 sm:px-5 py-2.5 text-left font-semibold text-slate-600 dark:text-slate-300">Tanggal</th>
                  <th className="px-3 py-2.5 text-right font-semibold text-slate-600 dark:text-slate-300">Tray</th>
                  <th className="px-3 py-2.5 text-right font-semibold text-slate-600 dark:text-slate-300">Total Butir</th>
                  <th className="px-4 sm:px-5 py-2.5 text-right font-semibold text-slate-600 dark:text-slate-300">Berat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {productions.slice(0, 5).map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 sm:px-5 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                      {new Date(p.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-slate-600 dark:text-slate-300">
                      {p.egg_trays}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-semibold text-orange-600 dark:text-orange-400">
                      {formatNumber(p.total_eggs)} butir
                    </td>
                    <td className="px-4 sm:px-5 py-2.5 text-right font-mono text-slate-600 dark:text-slate-300">
                      {p.total_weight_kg} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent transactions */}
        <Card padding="none">
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Transaksi Keuangan Terkini</h3>
            <Link href="/laporan" className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium">
              Buku Kas Lengkap
            </Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentTransactions.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: t.type === 'income' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                  }}
                >
                  {t.type === 'income' ? (
                    <ArrowUpRight size={16} className="text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDownRight size={16} className="text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate text-slate-900 dark:text-slate-100">
                    {t.description}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {new Date(t.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · {t.category}
                  </p>
                </div>
                <span
                  className="text-xs sm:text-sm font-mono font-semibold tabular-nums flex-shrink-0"
                  style={{ color: t.type === 'income' ? '#16a34a' : '#dc2626' }}
                >
                  {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
