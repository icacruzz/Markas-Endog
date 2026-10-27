'use client';

import { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  Download,
  Calendar,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import { Card, Button, Input, Badge, Modal } from '@/components/ui';
import { useAppState } from '@/lib/AppState';
import { formatNumber, toISODate, calculateTotalEggs } from '@/lib/utils';
import { exportProduksiExcel } from '@/lib/exportUtils';

export default function ProduksiPage() {
  const { productions, addProduction } = useAppState();

  const [showForm, setShowForm] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [searchQ, setSearchQ] = useState('');

  const [form, setForm] = useState({
    date: toISODate(),
    egg_trays: '',
    loose_eggs: '',
    broken_eggs: '',
    total_weight_kg: '',
    notes: '',
  });

  const computedTotal = calculateTotalEggs(
    parseInt(form.egg_trays) || 0,
    parseInt(form.loose_eggs) || 0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProduction({
      date: form.date,
      egg_trays: parseInt(form.egg_trays) || 0,
      loose_eggs: parseInt(form.loose_eggs) || 0,
      broken_eggs: parseInt(form.broken_eggs) || 0,
      total_weight_kg: parseFloat(form.total_weight_kg) || 0,
      notes: form.notes,
    });
    setForm({ date: toISODate(), egg_trays: '', loose_eggs: '', broken_eggs: '', total_weight_kg: '', notes: '' });
    setShowForm(false);
  };

  const handleExportProduksi = () => {
    exportProduksiExcel(filtered);
  };

  const filtered = productions.filter(p => {
    if (filterDate && p.date !== filterDate) return false;
    if (searchQ && !p.date.includes(searchQ) && !p.total_eggs.toString().includes(searchQ)) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Data Produksi Telur
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Catatan panen telur harian, perhitungan tray, butir rusak, dan total berat
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            id="btn-export-produksi"
            variant="secondary"
            size="sm"
            onClick={handleExportProduksi}
          >
            <Download size={14} />
            Export Excel
          </Button>

          <Button
            id="btn-tambah-produksi"
            size="sm"
            onClick={() => {
              setShowForm(!showForm);
            }}
          >
            <Plus size={14} />
            Catat Panen
          </Button>
        </div>
      </div>

      {/* Modal Form Input Panen */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Input Catatan Panen Baru"
        description="Isi data hasil panen hari ini dengan lengkap"
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              id="prod-date"
              label="Tanggal Panen"
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
              required
            />
            <Input
              id="prod-weight"
              label="Berat Total (kg)"
              type="number"
              step="0.1"
              placeholder="Contoh: 72.5"
              value={form.total_weight_kg}
              onChange={e => setForm({ ...form, total_weight_kg: e.target.value })}
              required
            />
            <Input
              id="prod-trays"
              label="Jumlah Egg Tray (1 tray = 30 butir)"
              type="number"
              placeholder="Contoh: 48"
              value={form.egg_trays}
              onChange={e => setForm({ ...form, egg_trays: e.target.value })}
              required
            />
            <Input
              id="prod-loose"
              label="Butir Lepas (di luar tray)"
              type="number"
              placeholder="Contoh: 12"
              value={form.loose_eggs}
              onChange={e => setForm({ ...form, loose_eggs: e.target.value })}
            />
            <Input
              id="prod-broken"
              label="Butir Rusak / Retak"
              type="number"
              placeholder="Contoh: 8"
              value={form.broken_eggs}
              onChange={e => setForm({ ...form, broken_eggs: e.target.value })}
            />

            {/* Auto-calculated total */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                Total Butir Otomatis
              </label>
              <div
                className="w-full px-3 py-2 rounded-lg text-sm border flex items-center justify-between font-mono font-semibold"
                style={{
                  background: 'rgba(234, 88, 12, 0.05)',
                  borderColor: 'rgba(234, 88, 12, 0.3)',
                  color: '#ea580c',
                }}
              >
                <span>{formatNumber(computedTotal)} butir</span>
                {parseInt(form.egg_trays) > 0 && (
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    ({form.egg_trays} tray × 30 + {form.loose_eggs || 0} lepas)
                  </span>
                )}
              </div>
            </div>
          </div>

          <Input
            id="prod-notes"
            label="Catatan Tambahan (opsional)"
            placeholder="Catatan kondisi kandang atau cuaca..."
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
          />

          <div className="flex gap-2 pt-1">
            <Button id="btn-simpan-produksi" type="submit">Simpan Catatan Panen</Button>
            <Button
              id="btn-batal-produksi"
              variant="secondary"
              type="button"
              onClick={() => setShowForm(false)}
            >
              Batal
            </Button>
          </div>
        </form>
      </Modal>


      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="produksi-search"
            placeholder="Cari berdasarkan tanggal atau jumlah butir..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border text-slate-800 dark:text-slate-100 placeholder-slate-400"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400 flex-shrink-0" />
          <input
            id="produksi-filter-date"
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-lg border text-slate-800 dark:text-slate-100"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-color)',
            }}
          />
          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-xs px-2 py-1 rounded text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 font-medium cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--bg-primary)' }}>
                {['Tanggal', 'Tray', 'Lepas', 'Rusak', 'Total Butir', 'Berat (kg)', 'Kualitas'].map((h, i) => (
                  <th
                    key={h}
                    className={`px-4 py-3 text-xs font-semibold ${i >= 1 && i <= 5 ? 'text-right' : 'text-left'}`}
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
                  <td colSpan={7} className="px-4 py-10 text-center text-xs text-slate-400">
                    Tidak ada catatan produksi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const brokenRate = p.total_eggs > 0 ? (p.broken_eggs / (p.total_eggs + p.broken_eggs)) * 100 : 0;
                  return (
                    <tr key={p.id} className="table-row-hover">
                      <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-200">
                        {new Date(p.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-right text-slate-700 dark:text-slate-300">
                        {p.egg_trays}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-right text-slate-500">
                        {p.loose_eggs}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-right text-rose-600 font-semibold">
                        {p.broken_eggs}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono font-bold text-right text-orange-600">
                        {formatNumber(p.total_eggs)}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-right text-slate-700 dark:text-slate-300">
                        {p.total_weight_kg.toFixed(1)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={brokenRate <= 2 ? 'success' : brokenRate <= 5 ? 'warning' : 'danger'}>
                          {brokenRate <= 2 ? 'Optimal' : brokenRate <= 5 ? 'Standar' : 'Perlu Evaluasi'}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div
            className="px-4 py-3 border-t flex items-center justify-between text-xs text-slate-500"
            style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}
          >
            <span>Menampilkan {filtered.length} dari {productions.length} catatan</span>
            <span>
              Total Telur Terdata:{' '}
              <strong className="font-mono text-orange-600">
                {formatNumber(filtered.reduce((s, p) => s + p.total_eggs, 0))} butir
              </strong>
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
