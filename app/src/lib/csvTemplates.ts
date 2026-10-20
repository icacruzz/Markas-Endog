/**
 * CSV Templates & Helpers for Markas Endog
 * Provides realistic downloadable templates and metadata for CSV imports.
 */

export interface CSVTemplateConfig {
  id: string;
  filename: string;
  title: string;
  description: string;
  headers: string[];
  sampleRows: string[][];
  columnsHelp: {
    column: string;
    type: string;
    required: boolean;
    description: string;
    example: string;
  }[];
}

export const CSV_TEMPLATES: Record<string, CSVTemplateConfig> = {
  produksi: {
    id: 'produksi',
    filename: 'template_import_produksi_markas_endog.csv',
    title: 'Template Import Produksi Telur',
    description: 'Format data pencatatan panen harian peternakan.',
    headers: ['tanggal', 'egg_tray', 'butir_lepas', 'butir_rusak', 'berat_kg', 'catatan'],
    sampleRows: [
      ['2026-10-18', '50', '15', '4', '74.5', 'Panen pagi kandang A'],
      ['2026-10-19', '48', '20', '6', '72.0', 'Kandang B normal'],
      ['2026-10-20', '52', '12', '3', '76.8', 'Produksi meningkat'],
    ],
    columnsHelp: [
      { column: 'tanggal', type: 'Tanggal (YYYY-MM-DD)', required: true, description: 'Tanggal pengambilan/panen telur', example: '2026-10-20' },
      { column: 'egg_tray', type: 'Angka bulat', required: true, description: 'Jumlah tray lengkap (1 tray = 30 butir)', example: '50' },
      { column: 'butir_lepas', type: 'Angka bulat', required: false, description: 'Butir telur sisa di luar tray', example: '15' },
      { column: 'butir_rusak', type: 'Angka bulat', required: false, description: 'Butir retak/pecah/tidak layak jual', example: '4' },
      { column: 'berat_kg', type: 'Desimal', required: true, description: 'Berat timbangan total dalam satuan kilogram', example: '74.5' },
      { column: 'catatan', type: 'Teks', required: false, description: 'Keterangan opsional (kondisi cuaca/kandang)', example: 'Panen pagi kandang A' },
    ],
  },
  transaksi: {
    id: 'transaksi',
    filename: 'template_import_transaksi_keuangan_markas_endog.csv',
    title: 'Template Import Transaksi Keuangan',
    description: 'Format data rekapitulasi arus kas pemasukan dan pengeluaran.',
    headers: ['tanggal', 'tipe', 'kategori', 'jumlah', 'keterangan'],
    sampleRows: [
      ['2026-10-18', 'income', 'Penjualan Telur', '3250000', 'Penjualan 50 tray grosir pasar'],
      ['2026-10-19', 'expense', 'Pembelian Pakan', '2125000', 'Beli pakan layer 250 kg'],
      ['2026-10-19', 'expense', 'Operasional', '350000', 'Listrik kandang dan air'],
      ['2026-10-20', 'income', 'Penjualan Telur', '1800000', 'Penjualan 28 tray warung langganan'],
      ['2026-10-20', 'income', 'Penjualan Pupuk', '250000', 'Penjualan 25 karung pupuk kandang'],
    ],
    columnsHelp: [
      { column: 'tanggal', type: 'Tanggal (YYYY-MM-DD)', required: true, description: 'Tanggal transaksi tercatat', example: '2026-10-20' },
      { column: 'tipe', type: 'income / expense', required: true, description: 'Jenis arus kas: income (masuk) atau expense (keluar)', example: 'income' },
      { column: 'kategori', type: 'Teks', required: true, description: 'Kategori (mis: Penjualan Telur, Pembelian Pakan, Operasional, Tenaga Kerja)', example: 'Penjualan Telur' },
      { column: 'jumlah', type: 'Angka bulat', required: true, description: 'Nominal dalam rupiah tanpa titik atau tanda mata uang', example: '3250000' },
      { column: 'keterangan', type: 'Teks', required: false, description: 'Deskripsi transaksi atau nama pelanggan/toko', example: 'Penjualan 50 tray grosir' },
    ],
  },
  inventaris: {
    id: 'inventaris',
    filename: 'template_import_inventaris_pakan_markas_endog.csv',
    title: 'Template Import Pembelian Pakan',
    description: 'Format data penerimaan stok pakan ayam.',
    headers: ['tanggal', 'jenis_pakan', 'jumlah_kg', 'harga_per_kg', 'supplier', 'catatan'],
    sampleRows: [
      ['2026-10-15', 'Pakan Layer A', '500', '8500', 'UD Maju Sejahtera', 'Pengiriman tahap 1'],
      ['2026-10-18', 'Konsentrat', '200', '12000', 'PT Unggas Makmur', 'Pakan tambahan protein'],
    ],
    columnsHelp: [
      { column: 'tanggal', type: 'Tanggal (YYYY-MM-DD)', required: true, description: 'Tanggal pembelian/kedatangan pakan', example: '2026-10-15' },
      { column: 'jenis_pakan', type: 'Teks', required: true, description: 'Jenis pakan (Pakan Layer A, Pakan Layer B, Konsentrat, dll)', example: 'Pakan Layer A' },
      { column: 'jumlah_kg', type: 'Desimal/Angka', required: true, description: 'Kuantitas pembelian dalam satuan kilogram', example: '500' },
      { column: 'harga_per_kg', type: 'Angka bulat', required: true, description: 'Harga beli per kilogram dalam rupiah', example: '8500' },
      { column: 'supplier', type: 'Teks', required: false, description: 'Nama supplier atau toko ternak', example: 'UD Maju Sejahtera' },
      { column: 'catatan', type: 'Teks', required: false, description: 'Keterangan tambahan', example: 'Kondisi karung baik' },
    ],
  },
};

/**
 * Downloads a CSV template directly to the user's browser with UTF-8 BOM
 * ensuring perfect compatibility with Microsoft Excel, Google Sheets, & LibreOffice.
 */
export function downloadCSVTemplate(templateKey: 'produksi' | 'transaksi' | 'inventaris') {
  const config = CSV_TEMPLATES[templateKey];
  if (!config) return;

  const headerLine = config.headers.join(',');
  const rowLines = config.sampleRows.map(row =>
    row.map(cell => {
      // Escape if contains comma or quotes
      if (cell.includes(',') || cell.includes('"')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')
  );

  const csvContent = '\uFEFF' + [headerLine, ...rowLines].join('\r\n') + '\r\n';
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', config.filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
