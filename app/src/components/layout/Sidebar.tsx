'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Egg,
  Warehouse,
  BarChart3,
  User,
  X,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import BrandLogo from './BrandLogo';

const navItems = [
  {
    href: '/beranda',
    label: 'Beranda',
    sublabel: 'Ringkasan operasional',
    icon: LayoutDashboard,
  },
  {
    href: '/produksi',
    label: 'Produksi Telur',
    sublabel: 'Catat hasil panen',
    icon: Egg,
  },
  {
    href: '/inventaris',
    label: 'Stok Pakan',
    sublabel: 'Pakan & estimasi habis',
    icon: Warehouse,
  },
  {
    href: '/laporan',
    label: 'Laporan Keuangan',
    sublabel: 'Buku kas & laba rugi',
    icon: BarChart3,
  },
  {
    href: '/profil',
    label: 'Profil Peternakan',
    sublabel: 'Info akun & kandang',
    icon: User,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay for mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 flex flex-col
          border-r transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          background: 'var(--sidebar-bg)',
          borderColor: 'var(--border-color)',
        }}
      >
        {/* Brand Header */}
        <div
          className="flex items-center justify-between px-4 py-3.5 border-b"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <BrandLogo size="md" />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Tutup menu navigasi"
            title="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-2.5 py-3.5 space-y-1 overflow-y-auto">
          <p className="text-[11px] font-semibold uppercase tracking-wider px-3 mb-2 text-slate-400 dark:text-slate-500">
            Menu Utama
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative
                  ${
                    isActive
                      ? 'bg-orange-600 text-white font-medium shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100 font-medium'
                  }
                `}
              >
                {/* Visual Icon */}
                <div
                  className={`
                    w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 transition-colors
                    ${
                      isActive
                        ? 'bg-orange-700/60 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:text-orange-600 dark:group-hover:text-orange-400'
                    }
                  `}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 2} />
                </div>

                {/* Text Label & Sublabel */}
                <div className="flex-1 min-w-0 leading-tight">
                  <span className="text-sm font-semibold block truncate">
                    {item.label}
                  </span>
                  <span
                    className={`text-[11px] block truncate mt-0.5 ${
                      isActive ? 'text-orange-100' : 'text-slate-400 dark:text-slate-500 font-normal'
                    }`}
                  >
                    {item.sublabel}
                  </span>
                </div>

                {/* Right Arrow indicator */}
                {isActive && (
                  <ChevronRight size={14} className="text-white/70 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Farm Status & Quick Assistance */}
        <div className="p-3 border-t space-y-2" style={{ borderColor: 'var(--border-color)' }}>
          {/* Farm Status Badge */}
          <div className="rounded-lg p-2.5 border bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Kandang Aktif Normal</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">Pencatatan harian siap</p>
            </div>
          </div>

          {/* Quick Help link */}
          <Link
            href="/profil"
            className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors w-full"
          >
            <HelpCircle size={14} />
            <span>Pusat Bantuan & Panduan</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
