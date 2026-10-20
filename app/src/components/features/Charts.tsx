'use client';

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { useTheme } from '@/components/layout/ThemeProvider';

interface ProductionChartProps {
  data: { day: string; telur: number; rusak: number }[];
}

export function ProductionBarChart({ data }: ProductionChartProps) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const tooltipBg = theme === 'dark' ? '#131b2e' : '#ffffff';

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 6, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="day" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: tooltipBg,
            border: '1px solid ' + (theme === 'dark' ? '#1e293b' : '#e2e8f0'),
            borderRadius: 8,
            fontSize: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
          cursor={{ fill: 'rgba(234, 88, 12, 0.04)' }}
        />
        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: textColor }} />
        <Bar dataKey="telur" name="Telur Utuh (Baik)" fill="#ea580c" radius={[4, 4, 0, 0]} maxBarSize={36} />
        <Bar dataKey="rusak" name="Telur Rusak/Retak" fill="#e11d48" radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface FinancialChartProps {
  data: { month: string; pemasukan: number; pengeluaran: number; laba: number }[];
}

export function FinancialAreaChart({ data }: FinancialChartProps) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const tooltipBg = theme === 'dark' ? '#131b2e' : '#ffffff';

  const formatK = (val: number) =>
    val >= 1000000 ? `${(val / 1000000).toFixed(1)}jt` : val >= 1000 ? `${(val / 1000).toFixed(0)}rb` : `${val}`;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 6, right: 6, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="gradPemasukan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradPengeluaran" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#e11d48" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#e11d48" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradLaba" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tickFormatter={formatK} tick={{ fill: textColor, fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(val: any) => (val != null ? `Rp ${Number(val).toLocaleString('id-ID')}` : 'Rp 0')}
          contentStyle={{
            background: tooltipBg,
            border: '1px solid ' + (theme === 'dark' ? '#1e293b' : '#e2e8f0'),
            borderRadius: 8,
            fontSize: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        />
        <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, color: textColor }} />
        <Area type="monotone" dataKey="pemasukan" name="Pemasukan" stroke="#059669" fill="url(#gradPemasukan)" strokeWidth={2} dot={{ r: 2.5 }} />
        <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran" stroke="#e11d48" fill="url(#gradPengeluaran)" strokeWidth={1.75} dot={{ r: 2.5 }} />
        <Area type="monotone" dataKey="laba" name="Laba Bersih" stroke="#ea580c" fill="url(#gradLaba)" strokeWidth={2} dot={{ r: 2.5 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface LineChartProps {
  data: { date: string; value: number }[];
  label: string;
  color?: string;
}

export function SimpleLine({ data, label, color = '#ea580c' }: LineChartProps) {
  const { theme } = useTheme();
  const textColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const tooltipBg = theme === 'dark' ? '#131b2e' : '#ffffff';

  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="date" tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: textColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: tooltipBg,
            border: `1px solid ${theme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
            borderRadius: 6,
            fontSize: 11,
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          name={label}
          stroke={color}
          strokeWidth={2}
          dot={{ r: 2.5, fill: color }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
