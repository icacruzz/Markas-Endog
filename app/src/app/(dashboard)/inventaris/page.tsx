'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  AlertTriangle,
  TrendingDown,
  Package,
  Droplets,
  Settings2,
  RotateCcw,
  Check,
  Download,
  Calculator,
  SlidersHorizontal,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, Button, Input, Select, Alert, SummaryCard, Badge } from '@/components/ui';
import { SimpleLine } from '@/components/features/Charts';
import { useAppState } from '@/lib/AppState';
import { formatRupiah, calculateFeedDaysLeft, toISODate } from '@/lib/utils';
import { exportInventarisExcel } from '@/lib/exportUtils';

const FEED_TYPES = [
  { value: 'Pakan Layer A', label: 'Pakan Layer A' },
  { value: 'Pakan Layer B', label: 'Pakan Layer B' },
  { value: 'Pakan Starter', label: 'Pakan Starter' },
  { value: 'Pakan Grower', label: 'Pakan Grower' },
  { value: 'Konsentrat', label: 'Konsentrat' },
];

export default function InventarisPage() {
  const {
    feedInventory,
    feedUsages,
    addFeedInventory,
    addFeedUsage,
    getFeedStockKg,
    getAvgDailyUsage,
    getAutoAvgDailyUsage,
    dailyUsageTarget,
    setDailyUsageTarget,
  } = useAppState();

  const [showBuyForm, setShowBuyForm] = useState(false);
  const [showUsageForm, setShowUsageForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Pengaturan pemakaian harian
  const [targetDraft, setTargetDraft] = useState<string>(
    dailyUsageTarget !== null ? String(dailyUsageTarget) : ''
  );
  const [useManual, setUseManual] = useState<boolean>(dailyUsageTarget !== null);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [buyForm, setBuyForm] = useState({
    date: toISODate(),
    feed_type: 'Pakan Layer A',
    quantity_kg: '',
    price_per_kg: '',
    supplier: '',
    notes: '',
  });

  const [usageForm, setUsageForm] = useState({
    date: toISODate(),
    quantity_kg: '',
    notes: '',
  });

  const feedStockKg = getFeedStockKg();
  const effectiveDailyUsage = getAvgDailyUsage();
  const autoAvg = getAutoAvgDailyUsage();
  const daysLeft = calculateFeedDaysLeft(feedStockKg, effectiveDailyUsage);

  const statusColor = daysLeft <= 3 ? 'red' : daysLeft <= 7 ? 'yellow' : 'green';
  const totalSpent = feedInventory.reduce((s, f) => s + f.total_price, 0);

  // Chart trend pemakaian
  const usageTrend = useMemo(() => {
    return feedUsages.slice(0, 7).reverse().map(u => ({
      date: new Date(u.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
      value: u.quantity_kg,
    }));
  }, [feedUsages]);

  const handleSaveSettings = () => {
    if (useManual) {
      const val = parseFloat(targetDraft);
      if (val > 0) {
        setDailyUsageTarget(val);
      }
    } else {
      setDailyUsageTarget(null);
    }
    setSettingsSaved(true);
    setTimeout(() => { setSettingsSaved(false); setShowSettings(false); }, 1200);
  };

  const handleResetToAuto = () => {
    setUseManual(false);
    setTargetDraft('');
    setDailyUsageTarget(null);
    setSettingsSaved(true);
    setTimeout(() => { setSettingsSaved(false); setShowSettings(false); }, 1200);
  };

  const handleBuySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedInventory({
      date: buyForm.date,
      feed_type: buyForm.feed_type,
      quantity_kg: parseFloat(buyForm.quantity_kg) || 0,
      price_per_kg: parseFloat(buyForm.price_per_kg) || 0,
      supplier: buyForm.supplier,
      notes: buyForm.notes,
    });
    setBuyForm({ date: toISODate(), feed_type: 'Pakan Layer A', quantity_kg: '', price_per_kg: '', supplier: '', notes: '' });
    setShowBuyForm(false);
  };

  const handleUsageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addFeedUsage({
      date: usageForm.date,
      quantity_kg: parseFloat(usageForm.quantity_kg) || 0,
      notes: usageForm.notes,
    });
    setUsageForm({ date: toISODate(), quantity_kg: '', notes: '' });
    setShowUsageForm(false);
  };

  const handleExportFeedInventory = () => {
    exportInventarisExcel(feedInventory);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Inventaris & Manajemen Pakan
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Pantau ketersediaan stok pakan ayam, laju konsumsi harian, dan proyeksi hari habis
          </p>
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          <Button
            id="btn-export-pakan"
            variant="secondary"
            size="sm"
            onClick={handleExportFeedInventory}
          >
            <Download size={14} />
            Export Excel
          </Button>
          <Button
            id="btn-pengaturan-pemakaian"
            variant="secondary"
            size="sm"
            onClick={() => { setShowSettings(!showSettings); setShowBuyForm(false); setShowUsageForm(false); }}
          >
            <Settings2 size={14} />
            Target Pemakaian
          </Button>
          <Button
            id="btn-catat-pemakaian"
            variant="secondary"
            size="sm"
            onClick={() => { setShowUsageForm(!showUsageForm); setShowBuyForm(false); setShowSettings(false); }}
          >
            <Droplets size={14} />
            Konsumsi Harian
          </Button>
          <Button
            id="btn-beli-pakan"
            size="sm"
            onClick={() => { setShowBuyForm(!showBuyForm); setShowUsageForm(false); setShowSettings(false); }}
          >
            <Plus size={14} />
            Beli Pakan
          </Button>
        </div>
      </div>

      {/* Critical alert */}
      {daysLeft <= 7 && (
        <Alert
          type={daysLeft <= 3 ? 'danger' : 'warning'}
          title={daysLeft <= 3 ? 'Stok Pakan Sangat Kritis' : 'Peringatan: Stok Pakan Perlu Pemesanan Ulang'}
          message={`Sisa stok ${feedStockKg.toFixed(0)} kg. Dengan pemakaian rata-rata ${effectiveDailyUsage.toFixed(0)} kg/hari, persediaan diperkirakan habis dalam ${daysLeft} hari.`}
        />
      )}

      {/* Panel Pengaturan Pemakaian Harian */}
      {showSettings && (
        <Card padding="md">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-orange-600"
              style={{ background: 'rgba(234, 88, 12, 0.1)' }}
            >
              <Settings2 size={18} />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Konfigurasi Parameter Estimasi Pakan
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Tentukan dasar perhitungan sisa stok dan proyeksi hari habis
              </p>
            </div>
          </div>

          {/* Info current */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="p-3.5 rounded-lg border" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
              <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                Rata-rata Historis (Otomatis)
              </p>
              <p className="text-2xl font-bold font-mono text-blue-600">
                {autoAvg.toFixed(1)} <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">kg/hari</span>
              </p>
              <p className="text-xs mt-1 font-medium text-slate-600 dark:text-slate-300">
                Dihitung dari {feedUsages.length} riwayat pemakaian
              </p>
            </div>

            <div
              className="p-3.5 rounded-lg border"
              style={{
                background: dailyUsageTarget !== null ? 'rgba(234,88,12,0.04)' : 'var(--bg-primary)',
                borderColor: dailyUsageTarget !== null ? 'rgba(234,88,12,0.3)' : 'var(--border-color)',
              }}
            >
              <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                Target Konsumsi Manual
              </p>
              {dailyUsageTarget !== null ? (
                <>
                  <p className="text-2xl font-bold font-mono text-orange-600">
                    {dailyUsageTarget.toFixed(1)} <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">kg/hari</span>
                  </p>
                  <p className="text-xs mt-1 text-orange-700 dark:text-orange-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-orange-600 inline-block mr-1"></span>
                    Aktif digunakan sebagai dasar estimasi
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-slate-400 font-mono">—</p>
                  <p className="text-xs mt-1 font-medium text-slate-600 dark:text-slate-400">Belum diaktifkan (mengikuti rata-rata)</p>
                </>
              )}
            </div>
          </div>

          {/* Mode toggle */}
          <div className="mb-4">
            <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">
              Pilihan Mode Estimasi
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                id="mode-otomatis-btn"
                type="button"
                onClick={() => { setUseManual(false); setTargetDraft(''); }}
                className={`flex-1 flex items-start gap-3 p-3.5 rounded-lg border text-left transition-colors cursor-pointer ${
                  !useManual
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    !useManual ? 'border-blue-600' : 'border-slate-400'
                  }`}
                >
                  {!useManual && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Calculator size={18} className="text-blue-600 flex-shrink-0" />
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Otomatis (Rata-rata Historis)
                    </p>
                  </div>
                  <p className="text-xs mt-1 font-medium text-slate-600 dark:text-slate-300">
                    Mengikuti tren aktual konsumsi kandang: <strong>{autoAvg.toFixed(1)} kg/hari</strong>
                  </p>
                </div>
              </button>

              <button
                id="mode-manual-btn"
                type="button"
                onClick={() => setUseManual(true)}
                className={`flex-1 flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-colors cursor-pointer ${
                  useManual
                    ? 'border-orange-600 bg-orange-50/30 dark:bg-orange-950/30'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    useManual ? 'border-orange-600' : 'border-slate-400'
                  }`}
                >
                  {useManual && <div className="w-2.5 h-2.5 rounded-full bg-orange-600" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-orange-600 flex-shrink-0" />
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      Manual (Target Tetap)
                    </p>
                  </div>
                  <p className="text-xs mt-1 font-medium text-slate-600 dark:text-slate-300">
                    Tentukan batas jatah ransum harian standar untuk estimasi persediaan
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Manual input */}
          {useManual && (
            <div className="mb-4 animate-fade-in p-3.5 rounded-lg border border-dashed border-orange-300 dark:border-orange-800 bg-orange-50/10">
              <label htmlFor="target-usage-input" className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Target Jatah Harian (kg / hari)
              </label>
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <input
                    id="target-usage-input"
                    type="number"
                    step="0.5"
                    min="1"
                    placeholder={`Saran: ${autoAvg.toFixed(0)}`}
                    value={targetDraft}
                    onChange={e => setTargetDraft(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border font-mono font-bold pr-16"
                    style={{
                      background: 'var(--bg-card)',
                      color: '#ea580c',
                      borderColor: 'rgba(234, 88, 12, 0.4)',
                    }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    kg / hari
                  </span>
                </div>
                {targetDraft && parseFloat(targetDraft) > 0 && (
                  <span className="text-xs text-slate-500">
                    Proyeksi habis: <strong className="font-mono text-orange-600">{calculateFeedDaysLeft(feedStockKg, parseFloat(targetDraft))} hari</strong>
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 items-center pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <Button
              id="btn-simpan-pengaturan"
              size="sm"
              onClick={handleSaveSettings}
              disabled={useManual && (!targetDraft || parseFloat(targetDraft) <= 0)}
            >
              {settingsSaved ? <><Check size={14} /> Tersimpan</> : <><Check size={14} /> Terapkan Pengaturan</>}
            </Button>
            {dailyUsageTarget !== null && (
              <Button
                id="btn-reset-ke-otomatis"
                variant="ghost"
                size="sm"
                onClick={handleResetToAuto}
              >
                <RotateCcw size={14} />
                Kembalikan ke Otomatis
              </Button>
            )}
            <Button
              id="btn-tutup-settings"
              variant="secondary"
              size="sm"
              onClick={() => setShowSettings(false)}
            >
              Tutup
            </Button>
          </div>
        </Card>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Sisa Stok Pakan"
          value={`${feedStockKg.toFixed(0)} kg`}
          subtitle="Total fisik di gudang"
          icon={<Package size={18} />}
          color={statusColor}
        />
        <SummaryCard
          title="Estimasi Hari Habis"
          value={`${daysLeft} Hari`}
          subtitle={
            dailyUsageTarget !== null
              ? `Target tetap ${dailyUsageTarget.toFixed(0)} kg/hari`
              : `Rata-rata ${autoAvg.toFixed(0)} kg/hari`
          }
          icon={<AlertTriangle size={18} />}
          color={daysLeft <= 7 ? 'red' : 'blue'}
        />
        <SummaryCard
          title="Total Pembelian"
          value={`${feedInventory.length} Pengadaan`}
          subtitle="Faktur stok masuk"
          icon={<TrendingDown size={18} />}
          color="orange"
        />
        <SummaryCard
          title="Akumulasi Biaya Pakan"
          value={formatRupiah(totalSpent)}
          subtitle="Nilai persediaan masuk"
          icon={<Package size={18} />}
          color="blue"
        />
      </div>

      {/* Mode indicator badge */}
      <div className="flex items-center gap-2 text-xs">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium border"
          style={{
            background: dailyUsageTarget !== null ? 'rgba(234,88,12,0.06)' : 'rgba(37,99,235,0.06)',
            color: dailyUsageTarget !== null ? '#ea580c' : '#2563eb',
            borderColor: dailyUsageTarget !== null ? 'rgba(234,88,12,0.25)' : 'rgba(37,99,235,0.25)',
          }}
        >
          {dailyUsageTarget !== null ? (
            <>
              <SlidersHorizontal size={13} />
              <span>Mode Manual: Target {dailyUsageTarget.toFixed(0)} kg / hari</span>
            </>
          ) : (
            <>
              <Calculator size={13} />
              <span>Mode Otomatis: Rata-rata {autoAvg.toFixed(1)} kg / hari ({feedUsages.length} catatan)</span>
            </>
          )}
        </div>
        <button
          id="shortcut-atur-pemakaian-btn"
          onClick={() => { setShowSettings(true); setShowBuyForm(false); setShowUsageForm(false); }}
          className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 underline cursor-pointer"
        >
          Ubah Mode
        </button>
      </div>

      {/* Usage chart */}
      {usageTrend.length > 0 && (
        <Card padding="md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                Konsumsi Pakan Harian (7 Hari Terakhir)
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fluktuasi pakan terpakai di kandang layer</p>
            </div>
            {dailyUsageTarget !== null && (
              <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-orange-50 dark:bg-orange-950/30 text-orange-600 border border-orange-200 dark:border-orange-900/50">
                Garis Acuan: {dailyUsageTarget} kg
              </span>
            )}
          </div>
          <SimpleLine data={usageTrend} label="Konsumsi (kg)" color="#2563eb" />
        </Card>
      )}

      {/* Buy Form */}
      {showBuyForm && (
        <Card padding="md">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
            Pencatatan Pembelian Stok Pakan
          </h3>
          <form onSubmit={handleBuySubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="buy-date"
                label="Tanggal Kedatangan"
                type="date"
                value={buyForm.date}
                onChange={e => setBuyForm({ ...buyForm, date: e.target.value })}
                required
              />
              <Select
                id="buy-type"
                label="Jenis Pakan"
                options={FEED_TYPES}
                value={buyForm.feed_type}
                onChange={e => setBuyForm({ ...buyForm, feed_type: e.target.value })}
              />
              <Input
                id="buy-qty"
                label="Jumlah (kg)"
                type="number"
                step="0.1"
                placeholder="Contoh: 500"
                value={buyForm.quantity_kg}
                onChange={e => setBuyForm({ ...buyForm, quantity_kg: e.target.value })}
                required
              />
              <Input
                id="buy-price"
                label="Harga Beli / kg (IDR)"
                type="number"
                placeholder="Contoh: 8500"
                value={buyForm.price_per_kg}
                onChange={e => setBuyForm({ ...buyForm, price_per_kg: e.target.value })}
                required
              />
              <Input
                id="buy-supplier"
                label="Pemasok / Toko Pakan"
                placeholder="Nama agen atau pabrik pakan"
                value={buyForm.supplier}
                onChange={e => setBuyForm({ ...buyForm, supplier: e.target.value })}
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Total Biaya Pembelian
                </label>
                <div
                  className="w-full px-3 py-2 rounded-lg text-sm border font-mono font-bold"
                  style={{ background: 'rgba(5, 150, 105, 0.05)', borderColor: 'rgba(5, 150, 105, 0.3)', color: '#059669' }}
                >
                  {formatRupiah((parseFloat(buyForm.quantity_kg) || 0) * (parseFloat(buyForm.price_per_kg) || 0))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button id="btn-simpan-beli" type="submit">Simpan Pembelian</Button>
              <Button id="btn-batal-beli" variant="secondary" type="button" onClick={() => setShowBuyForm(false)}>
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Usage Form */}
      {showUsageForm && (
        <Card padding="md">
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
            Catat Konsumsi Pakan Harian
          </h3>
          <form onSubmit={handleUsageSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="usage-date"
                label="Tanggal Konsumsi"
                type="date"
                value={usageForm.date}
                onChange={e => setUsageForm({ ...usageForm, date: e.target.value })}
                required
              />
              <div className="space-y-1.5">
                <label htmlFor="usage-qty" className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                  Jumlah Pakan Terpakai (kg)
                </label>
                <div className="relative">
                  <input
                    id="usage-qty"
                    type="number"
                    step="0.1"
                    placeholder={`Standar: ${effectiveDailyUsage.toFixed(0)} kg`}
                    value={usageForm.quantity_kg}
                    onChange={e => setUsageForm({ ...usageForm, quantity_kg: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm border transition-all"
                    style={{
                      background: 'var(--bg-card)',
                      color: 'var(--text-primary)',
                      borderColor: 'var(--border-color)',
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setUsageForm({ ...usageForm, quantity_kg: String(effectiveDailyUsage.toFixed(1)) })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded font-medium border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Gunakan {effectiveDailyUsage.toFixed(0)} kg
                  </button>
                </div>
                {usageForm.quantity_kg && dailyUsageTarget !== null && (
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    {parseFloat(usageForm.quantity_kg) > dailyUsageTarget
                      ? `Selisih: +${(parseFloat(usageForm.quantity_kg) - dailyUsageTarget).toFixed(1)} kg di atas target`
                      : parseFloat(usageForm.quantity_kg) < dailyUsageTarget
                      ? `Selisih: -${(dailyUsageTarget - parseFloat(usageForm.quantity_kg)).toFixed(1)} kg di bawah target`
                      : 'Tepat sesuai target pemakaian'}
                  </p>
                )}
              </div>
            </div>
            <Input
              id="usage-notes"
              label="Keterangan / Catatan"
              placeholder="Pemberian makan pagi & sore kandang layer..."
              value={usageForm.notes}
              onChange={e => setUsageForm({ ...usageForm, notes: e.target.value })}
            />
            <div className="flex gap-2 pt-1">
              <Button id="btn-simpan-pemakaian" type="submit">Simpan Catatan</Button>
              <Button id="btn-batal-pemakaian" variant="secondary" type="button" onClick={() => setShowUsageForm(false)}>
                Batal
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Two tables: Inventory & Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Inventory purchases */}
        <Card padding="none">
          <div className="px-5 py-3.5 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Riwayat Pembelian & Kedatangan Pakan
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'var(--bg-primary)' }}>
                  {['Tanggal', 'Jenis', 'Jumlah', 'Total Biaya'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 font-semibold text-slate-500 ${i >= 2 ? 'text-right' : 'text-left'}`}
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {feedInventory.map(f => (
                  <tr key={f.id} className="table-row-hover">
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">
                      {new Date(f.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-800 dark:text-slate-200">
                      {f.feed_type}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-right text-slate-700 dark:text-slate-300">
                      {f.quantity_kg} kg
                    </td>
                    <td className="px-4 py-2.5 font-mono font-semibold text-right text-emerald-600">
                      {formatRupiah(f.total_price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Feed usage */}
        <Card padding="none">
          <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Riwayat Konsumsi Harian
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-200">
              Standar: {effectiveDailyUsage.toFixed(0)} kg/hari
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'var(--bg-primary)' }}>
                  {['Tanggal', 'Konsumsi', 'Variasi vs Standar'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-2.5 font-semibold text-slate-500 ${i === 1 ? 'text-right' : 'text-left'}`}
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {feedUsages.map(u => {
                  const diff = u.quantity_kg - effectiveDailyUsage;
                  return (
                    <tr key={u.id} className="table-row-hover">
                      <td className="px-4 py-2.5 text-slate-700 dark:text-slate-300">
                        {new Date(u.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-4 py-2.5 font-mono font-bold text-right text-blue-600">
                        {u.quantity_kg} kg
                      </td>
                      <td className="px-4 py-2.5">
                        <Badge variant={Math.abs(diff) <= 3 ? 'success' : diff > 3 ? 'danger' : 'info'}>
                          {Math.abs(diff) <= 3
                            ? 'Normal'
                            : diff > 3
                            ? `+${diff.toFixed(1)} kg`
                            : `${diff.toFixed(1)} kg`}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
