'use client';

import Link from 'next/link';
import {
  Egg,
  BarChart3,
  Shield,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  Warehouse,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from '@/components/layout/ThemeProvider';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import BrandLogo from '@/components/layout/BrandLogo';

function LoginPageInner() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <BrandLogo size="md" />
        <button
          id="landing-theme-toggle"
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-card)' }}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 px-6 py-12 max-w-6xl mx-auto w-full">
        {/* Left: Product presentation */}
        <div className="max-w-lg text-center lg:text-left animate-fade-in">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold mb-4 border"
            style={{
              background: 'rgba(234, 88, 12, 0.08)',
              color: '#ea580c',
              borderColor: 'rgba(234, 88, 12, 0.25)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
            Sistem Informasi Manajemen Peternakan Ayam Petelur
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-3" style={{ color: 'var(--text-primary)' }}>
            Kendali Penuh Produksi & Arus Kas Peternakan Telur
          </h1>

          <p className="text-sm md:text-base leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
            Platform terpadu untuk pencatatan panen telur harian, pemantauan konsumsi pakan, kalkulasi stok habis otomatis, serta rekapitulasi laba-rugi operasional.
          </p>

          {/* Value propositions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
            {[
              { text: 'Pencatatan panen per tray & butir' },
              { text: 'Monitoring stok pakan & hari habis' },
              { text: 'Laporan keuangan ekspor ke CSV & cetak' },
              { text: 'Import riwayat panen berbasis template' },
            ].map(({ text }) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-600 flex-shrink-0" />
                <span className="text-xs text-slate-700 dark:text-slate-300">{text}</span>
              </div>
            ))}
          </div>

          <Link
            href="/beranda"
            id="masuk-dashboard-btn"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm"
          >
            Buka Dashboard Peternakan
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Right: Login Card */}
        <div className="w-full max-w-sm animate-fade-in">
          <div className="card p-6" style={{ background: 'var(--bg-card)' }}>
            <div className="mb-5">
              <img
                src="/logo-markas-endog.png"
                alt="Markas Endog"
                className="h-12 w-auto object-contain mb-3"
              />
              <h2 className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>Masuk ke Dashboard</h2>
              <p className="text-xs sm:text-sm mt-0.5 text-slate-600 dark:text-slate-300 font-medium">Gunakan akun admin peternakan untuk mengelola sistem</p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Email Akun
                </label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@markasendog.com"
                  defaultValue="admin@markasendog.com"
                  className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm border transition-colors"
                  style={{
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)',
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Kata Sandi
                </label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  defaultValue="password123"
                  className="w-full px-3 py-2 rounded-lg text-xs sm:text-sm border transition-colors"
                  style={{
                    background: 'var(--bg-primary)',
                    color: 'var(--text-primary)',
                    borderColor: 'var(--border-color)',
                  }}
                />
              </div>

              <div className="pt-1">
                <Link
                  href="/beranda"
                  id="login-submit-btn"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors shadow-sm"
                >
                  Masuk Sekarang
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <p className="text-center text-[11px] mt-4 text-slate-400">
              Akses Langsung: Klik tombol &ldquo;Masuk Sekarang&rdquo; untuk membuka dashboard demo.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60">
        Markas Endog — Sistem Manajemen Produksi & Arus Kas Peternakan Ayam Petelur
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ThemeProvider>
      <LoginPageInner />
    </ThemeProvider>
  );
}
