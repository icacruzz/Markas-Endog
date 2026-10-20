'use client';

import Link from 'next/link';
import { useTheme } from './ThemeProvider';
import { Menu, Sun, Moon, Calendar } from 'lucide-react';

interface TopbarProps {
  onMenuClick: () => void;
  title: string;
  subtitle?: string;
}

export default function Topbar({ onMenuClick, title, subtitle }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  const formattedDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 sm:py-3 border-b bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border-slate-200 dark:border-slate-800"
    >
      {/* Left: Mobile Toggle + Logo (Mobile) + Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          id="mobile-menu-btn"
          onClick={onMenuClick}
          className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex-shrink-0"
          aria-label="Buka Menu Navigasi"
          title="Buka Menu Navigasi"
        >
          <Menu size={20} />
        </button>

        {/* Quick Brand Icon for Mobile view */}
        <div className="lg:hidden flex-shrink-0">
          <img src="/logo-icon.png" alt="Markas Endog" className="h-7 w-auto object-contain" />
        </div>

        <div className="min-w-0">
          <h1 className="text-base sm:text-lg font-bold tracking-tight truncate text-slate-900 dark:text-slate-100">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Date, Mode Toggle, and User Profile */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs font-medium text-slate-600 dark:text-slate-300">
          <Calendar size={13} className="text-orange-600 dark:text-orange-400" />
          <span>{formattedDate}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          id="theme-toggle-btn"
          onClick={toggleTheme}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs font-medium"
          aria-label="Ganti Mode Tampilan"
          title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
          {theme === 'dark' ? (
            <>
              <Sun size={15} className="text-amber-400" />
              <span className="hidden lg:inline">Mode Terang</span>
            </>
          ) : (
            <>
              <Moon size={15} className="text-slate-600" />
              <span className="hidden lg:inline">Mode Gelap</span>
            </>
          )}
        </button>

        {/* User Profile Card */}
        <Link
          href="/profil"
          className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800 hover:opacity-90 transition-opacity"
          title="Buka Profil Peternakan"
        >
          <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center text-xs font-bold shadow-xs flex-shrink-0">
            AS
          </div>
          <div className="hidden sm:block leading-tight text-left">
            <span className="text-xs font-semibold block text-slate-900 dark:text-slate-100">
              Pak Ahmad
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
              Pemilik Kandang
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}
