'use client';

import { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { AppStateProvider } from '@/lib/AppState';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/beranda': { title: 'Beranda Peternakan', subtitle: 'Ringkasan operasional harian Markas Endog' },
  '/produksi': { title: 'Produksi Telur', subtitle: 'Pencatatan hasil panen & butir telur harian' },
  '/inventaris': { title: 'Stok & Inventaris Pakan', subtitle: 'Monitoring persediaan pakan ayam & estimasi hari habis' },
  '/laporan': { title: 'Laporan Keuangan & Kas', subtitle: 'Arus kas masuk, pengeluaran pakan, dan laba bersih' },
  '/profil': { title: 'Profil & Data Peternakan', subtitle: 'Informasi pengelola kandang dan akun admin' },
};

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const pageInfo = pageTitles[pathname] || { title: 'Markas Endog', subtitle: 'Sistem Peternakan Ayam Petelur' };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
        />

        {/* Page Content with safe padding for mobile bottom nav */}
        <main className="flex-1 overflow-y-auto pb-24 lg:pb-8">
          <div className="p-4 sm:p-5 lg:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppStateProvider>
        <DashboardShell>{children}</DashboardShell>
      </AppStateProvider>
    </ThemeProvider>
  );
}
