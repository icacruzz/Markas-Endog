import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  variant?: 'full' | 'icon';
}

export default function BrandLogo({
  size = 'md',
  showText = true,
  className = '',
  variant = 'full',
}: BrandLogoProps) {
  const heights = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12',
  };

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        {/* Official Markas Endog Logo */}
        <div className="relative flex items-center flex-shrink-0">
          <img
            src="/logo-markas-endog.png"
            alt="Markas Endog Logo"
            className={`${heights[size]} w-auto object-contain`}
          />
        </div>

        {showText && (
          <div className="leading-tight pl-2.5 border-l border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-orange-600 dark:text-orange-400">
              Sistem Peternakan
            </span>
            <span className="text-xs font-semibold block text-slate-700 dark:text-slate-300">
              Ayam Petelur
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon only */}
      <div className="relative flex items-center justify-center flex-shrink-0">
        <img
          src="/logo-icon.png"
          alt="Markas Endog"
          className={`${heights[size]} w-auto object-contain`}
        />
      </div>

      {showText && (
        <div className="leading-tight">
          <span className="font-bold text-base tracking-tight block text-slate-900 dark:text-slate-100">
            Markas Endog
          </span>
          <span className="text-xs font-medium block text-orange-600 dark:text-orange-400">
            Sistem Peternakan
          </span>
        </div>
      )}
    </div>
  );
}
