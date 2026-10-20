'use client';

import { useState, useCallback } from 'react';
import Papa from 'papaparse';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Download,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';
import { CSV_TEMPLATES, downloadCSVTemplate } from '@/lib/csvTemplates';

interface CSVUploaderProps {
  onDataParsed: (data: Record<string, string>[]) => void;
  templateType?: 'produksi' | 'transaksi' | 'inventaris';
  templateHeaders?: string[];
  templateName?: string;
  className?: string;
}

type UploadStatus = 'idle' | 'parsing' | 'success' | 'error';

export default function CSVUploader({
  onDataParsed,
  templateType,
  templateHeaders = [],
  templateName = 'template_import.csv',
  className,
}: CSVUploaderProps) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [fileName, setFileName] = useState('');
  const [rowCount, setRowCount] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<Record<string, string>[]>([]);
  const [showGuide, setShowGuide] = useState(false);

  const activeTemplate = templateType ? CSV_TEMPLATES[templateType] : null;

  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setStatus('error');
      setErrorMsg('File harus berformat CSV (.csv)');
      return;
    }
    setFileName(file.name);
    setStatus('parsing');
    setErrorMsg('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = (results.data as Record<string, string>[]).filter(row => {
          // Filter out rows where all values are empty
          return Object.values(row).some(val => typeof val === 'string' && val.trim() !== '');
        });

        if (data.length === 0) {
          setStatus('error');
          setErrorMsg('File CSV kosong atau tidak memiliki baris data yang valid.');
          return;
        }

        setRowCount(data.length);
        setPreview(data.slice(0, 4));
        setStatus('success');
        onDataParsed(data);
      },
      error: (err) => {
        setStatus('error');
        setErrorMsg(`Gagal membaca file: ${err.message}`);
      },
    });
  }, [onDataParsed]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDownloadTemplate = () => {
    if (templateType) {
      downloadCSVTemplate(templateType);
      return;
    }

    // Fallback if raw headers provided
    if (templateHeaders.length === 0) return;
    const csv = '\uFEFF' + templateHeaders.join(',') + '\r\n';
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = templateName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setStatus('idle');
    setFileName('');
    setRowCount(0);
    setErrorMsg('');
    setPreview([]);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Template Download Banner */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg border"
        style={{
          background: 'rgba(234, 88, 12, 0.04)',
          borderColor: 'rgba(234, 88, 12, 0.2)',
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-orange-600"
            style={{ background: 'rgba(234, 88, 12, 0.1)' }}
          >
            <FileSpreadsheet size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {activeTemplate?.title || 'Template Format CSV'}
            </p>
            <p className="text-xs mt-0.5 text-slate-600 dark:text-slate-300 font-medium">
              Unduh contoh template terisi untuk memastikan kolom dan data sesuai standar sistem.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {activeTemplate?.columnsHelp && (
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <HelpCircle size={15} />
              <span>Format Kolom</span>
              {showGuide ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>
          )}

          <Button
            id="download-template-btn"
            size="sm"
            variant="outline"
            onClick={handleDownloadTemplate}
            type="button"
            className="text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50 hover:bg-orange-50 dark:hover:bg-orange-950/30 font-semibold"
          >
            <Download size={14} />
            Unduh Template CSV
          </Button>
        </div>
      </div>

      {/* Guide Accordion */}
      {showGuide && activeTemplate?.columnsHelp && (
        <div
          className="rounded-lg border overflow-hidden text-xs animate-fade-in"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
        >
          <div className="p-3 border-b font-semibold bg-slate-50 dark:bg-slate-900/50" style={{ borderColor: 'var(--border-color)' }}>
            Petunjuk Pengisian Kolom CSV
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}>
                  <th className="px-3 py-2 font-semibold text-slate-500">Nama Kolom</th>
                  <th className="px-3 py-2 font-semibold text-slate-500">Tipe Data</th>
                  <th className="px-3 py-2 font-semibold text-slate-500">Wajib</th>
                  <th className="px-3 py-2 font-semibold text-slate-500">Keterangan</th>
                  <th className="px-3 py-2 font-semibold text-slate-500">Contoh</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {activeTemplate.columnsHelp.map((col) => (
                  <tr key={col.column} className="table-row-hover">
                    <td className="px-3 py-2 font-mono font-semibold text-orange-600">{col.column}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{col.type}</td>
                    <td className="px-3 py-2">
                      <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-semibold', col.required ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-100 text-slate-500')}>
                        {col.required ? 'Wajib' : 'Opsional'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{col.description}</td>
                    <td className="px-3 py-2 font-mono text-slate-500">{col.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-6 text-center transition-colors',
          isDragging && 'border-orange-500 bg-orange-50/20',
          status === 'success' && 'border-emerald-500/50 bg-emerald-50/10',
          status === 'error' && 'border-rose-500/50 bg-rose-50/10',
          status === 'idle' && 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30'
        )}
      >
        <label htmlFor="csv-upload-input" className="cursor-pointer block">
          {status === 'idle' && (
            <>
              <div
                className="w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400"
                style={{ background: 'var(--bg-card)' }}
              >
                <Upload size={20} />
              </div>
              <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                Tarik & letakkan file CSV di sini
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                atau klik untuk memilih file dari komputer
              </p>
            </>
          )}

          {status === 'parsing' && (
            <div className="py-2">
              <div className="w-8 h-8 mx-auto mb-2 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                Membaca dan memvalidasi file CSV...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-3 justify-center">
              <CheckCircle2 size={24} className="text-emerald-600 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-sm text-emerald-600">
                  {fileName}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {rowCount} baris berhasil diproses dan siap disimpan
                </p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="flex items-center gap-3 justify-center">
              <AlertCircle size={24} className="text-rose-600 flex-shrink-0" />
              <div className="text-left">
                <p className="font-semibold text-sm text-rose-600">Gagal Memproses File</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{errorMsg}</p>
              </div>
            </div>
          )}
        </label>

        <input
          id="csv-upload-input"
          type="file"
          accept=".csv"
          onChange={handleInput}
          className="sr-only"
        />

        {(status === 'success' || status === 'error') && (
          <button
            onClick={(e) => { e.preventDefault(); reset(); }}
            className="absolute top-2.5 right-2.5 p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Reset upload"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Preview table */}
      {preview.length > 0 && (
        <div className="rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
          <div
            className="px-3 py-2 text-xs font-semibold flex items-center justify-between border-b"
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}
          >
            <span>Pratinjau Data ({preview.length} baris pertama)</span>
            <span className="text-[11px] font-normal text-emerald-600 font-medium">Valid</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'var(--bg-card)' }}>
                  {Object.keys(preview[0]).map((key) => (
                    <th
                      key={key}
                      className="px-3 py-2 text-left font-semibold text-slate-500 uppercase tracking-wider text-[10px]"
                      style={{ borderBottom: '1px solid var(--border-color)' }}
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {preview.map((row, i) => (
                  <tr key={i} className="table-row-hover">
                    {Object.values(row).map((val, j) => (
                      <td key={j} className="px-3 py-2 font-mono text-slate-700 dark:text-slate-200">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
