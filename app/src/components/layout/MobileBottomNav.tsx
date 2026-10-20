'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Egg,
  Warehouse,
  BarChart3,
  User,
} from 'lucide-react';

const navItems = [
  { href: '/beranda', label: 'Beranda', icon: LayoutDashboard },
  { href: '/produksi', label: 'Panen', icon: Egg },
  { href: '/inventaris', label: 'Pakan', icon: Warehouse },
  { href: '/laporan', label: 'Buku Kas', icon: BarChart3 },
  { href: '/profil', label: 'Profil', icon: User },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden border-t"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-color)',
        boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.08)',
      }}
      aria-label="Navigasi Bawah Ponsel"
    >
      <div className="flex items-center justify-around px-1 py-1.5 safe-area-pb">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all min-h-[54px]
                ${
                  isActive
                    ? 'bg-orange-100 dark:bg-orange-950/70 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-800 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                }
              `}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.6 : 2}
                className={isActive ? 'text-orange-700 dark:text-orange-400' : 'text-slate-600 dark:text-slate-400'}
              />
              <span
                className={`text-[11px] font-bold mt-1 tracking-tight leading-none ${
                  isActive ? 'text-orange-900 dark:text-orange-200' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
