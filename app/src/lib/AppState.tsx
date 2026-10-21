'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { EggProduction, FeedInventory, FeedUsage, Transaction, MarketPrice } from '@/types';
import { calculateTotalEggs } from '@/lib/utils';

// ─── Mock Data ────────────────────────────────────────────────────────────────

const today = new Date();
const d = (offset: number) => {
  const dt = new Date(today);
  dt.setDate(dt.getDate() - offset);
  return dt.toISOString().split('T')[0];
};

const initialProductions: EggProduction[] = [
  { id: '1', user_id: 'u1', date: d(0), egg_trays: 48, loose_eggs: 12, broken_eggs: 8, total_weight_kg: 71.4, total_eggs: 1452, created_at: d(0) },
  { id: '2', user_id: 'u1', date: d(1), egg_trays: 45, loose_eggs: 18, broken_eggs: 5, total_weight_kg: 68.2, total_eggs: 1368, created_at: d(1) },
  { id: '3', user_id: 'u1', date: d(2), egg_trays: 50, loose_eggs: 8, broken_eggs: 10, total_weight_kg: 73.0, total_eggs: 1508, created_at: d(2) },
  { id: '4', user_id: 'u1', date: d(3), egg_trays: 42, loose_eggs: 20, broken_eggs: 6, total_weight_kg: 64.8, total_eggs: 1280, created_at: d(3) },
  { id: '5', user_id: 'u1', date: d(4), egg_trays: 47, loose_eggs: 15, broken_eggs: 9, total_weight_kg: 69.5, total_eggs: 1425, created_at: d(4) },
  { id: '6', user_id: 'u1', date: d(5), egg_trays: 44, loose_eggs: 10, broken_eggs: 7, total_weight_kg: 66.0, total_eggs: 1330, created_at: d(5) },
  { id: '7', user_id: 'u1', date: d(6), egg_trays: 49, loose_eggs: 5, broken_eggs: 11, total_weight_kg: 70.8, total_eggs: 1475, created_at: d(6) },
];

const initialFeedInventory: FeedInventory[] = [
  { id: 'f1', user_id: 'u1', date: d(2), feed_type: 'Pakan Layer A', quantity_kg: 500, price_per_kg: 8500, total_price: 4250000, supplier: 'UD. Maju Jaya', created_at: d(2) },
  { id: 'f2', user_id: 'u1', date: d(10), feed_type: 'Pakan Layer B', quantity_kg: 300, price_per_kg: 9000, total_price: 2700000, supplier: 'PT. Ternak Sejahtera', created_at: d(10) },
];

const initialFeedUsages: FeedUsage[] = [
  { id: 'u1', user_id: 'u1', date: d(0), quantity_kg: 85, created_at: d(0) },
  { id: 'u2', user_id: 'u1', date: d(1), quantity_kg: 82, created_at: d(1) },
  { id: 'u3', user_id: 'u1', date: d(2), quantity_kg: 80, created_at: d(2) },
  { id: 'u4', user_id: 'u1', date: d(3), quantity_kg: 83, created_at: d(3) },
  { id: 'u5', user_id: 'u1', date: d(4), quantity_kg: 84, created_at: d(4) },
  { id: 'u6', user_id: 'u1', date: d(5), quantity_kg: 86, created_at: d(5) },
  { id: 'u7', user_id: 'u1', date: d(6), quantity_kg: 81, created_at: d(6) },
];

const initialTransactions: Transaction[] = [
  { id: 't1', user_id: 'u1', date: d(0), type: 'income', category: 'Penjualan Telur', amount: 3500000, description: 'Jual 48 tray ke pasar Padasuka', created_at: d(0) },
  { id: 't2', user_id: 'u1', date: d(1), type: 'income', category: 'Penjualan Telur', amount: 3200000, description: 'Jual 45 tray ke warung Bu Sari', created_at: d(1) },
  { id: 't3', user_id: 'u1', date: d(2), type: 'expense', category: 'Pembelian Pakan', amount: 4250000, description: 'Beli pakan Layer A 500kg', created_at: d(2) },
  { id: 't4', user_id: 'u1', date: d(3), type: 'income', category: 'Penjualan Telur', amount: 2950000, description: 'Jual 42 tray retail', created_at: d(3) },
  { id: 't5', user_id: 'u1', date: d(4), type: 'expense', category: 'Operasional', amount: 450000, description: 'Bayar listrik dan air', created_at: d(4) },
  { id: 't6', user_id: 'u1', date: d(5), type: 'income', category: 'Penjualan Telur', amount: 3100000, description: 'Jual 44 tray', created_at: d(5) },
  { id: 't7', user_id: 'u1', date: d(6), type: 'expense', category: 'Tenaga Kerja', amount: 800000, description: 'Gaji 2 orang pekerja harian', created_at: d(6) },
  { id: 't8', user_id: 'u1', date: d(7), type: 'expense', category: 'Pembelian Pakan', amount: 2700000, description: 'Beli pakan Layer B 300kg', created_at: d(7) },
  { id: 't9', user_id: 'u1', date: d(8), type: 'income', category: 'Penjualan Telur', amount: 3400000, description: 'Jual grosir ke pengepul', created_at: d(8) },
  { id: 't10', user_id: 'u1', date: d(9), type: 'income', category: 'Penjualan Pupuk', amount: 200000, description: 'Jual kotoran ayam', created_at: d(9) },
];

const initialMarketPrices: MarketPrice[] = [
  { id: 'm1', user_id: 'u1', date: d(0), price_per_kg: 28000, price_per_tray: 55000, created_at: d(0) },
  { id: 'm2', user_id: 'u1', date: d(1), price_per_kg: 27500, price_per_tray: 54000, created_at: d(1) },
];

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppStateContextType {
  productions: EggProduction[];
  feedInventory: FeedInventory[];
  feedUsages: FeedUsage[];
  transactions: Transaction[];
  marketPrices: MarketPrice[];
  // Pengaturan pemakaian harian
  dailyUsageTarget: number | null;   // null = otomatis dari rata-rata
  setDailyUsageTarget: (val: number | null) => void;
  addProduction: (data: Omit<EggProduction, 'id' | 'user_id' | 'total_eggs' | 'created_at'>) => void;
  addFeedInventory: (data: Omit<FeedInventory, 'id' | 'user_id' | 'total_price' | 'created_at'>) => void;
  addFeedUsage: (data: Omit<FeedUsage, 'id' | 'user_id' | 'created_at'>) => void;
  addTransaction: (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => void;
  addMarketPrice: (data: Omit<MarketPrice, 'id' | 'user_id' | 'created_at'>) => void;
  getFeedStockKg: () => number;
  getAvgDailyUsage: () => number;    // mengembalikan target jika diset, atau rata-rata historis
  getAutoAvgDailyUsage: () => number; // selalu rata-rata historis murni
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [productions, setProductions] = useState<EggProduction[]>(initialProductions);
  const [feedInventory, setFeedInventory] = useState<FeedInventory[]>(initialFeedInventory);
  const [feedUsages, setFeedUsages] = useState<FeedUsage[]>(initialFeedUsages);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>(initialMarketPrices);
  // null = mode otomatis (rata-rata historis), angka = target manual
  const [dailyUsageTarget, setDailyUsageTarget] = useState<number | null>(null);

  const getFeedStockKg = () => {
    const totalIn = feedInventory.reduce((s, f) => s + f.quantity_kg, 0);
    const totalOut = feedUsages.reduce((s, u) => s + u.quantity_kg, 0);
    return Math.max(0, totalIn - totalOut);
  };

  // Rata-rata murni dari data historis pemakaian
  const getAutoAvgDailyUsage = () => {
    if (feedUsages.length === 0) return 83;
    return feedUsages.reduce((s, u) => s + u.quantity_kg, 0) / feedUsages.length;
  };

  // Gunakan target manual jika diset, fallback ke rata-rata historis
  const getAvgDailyUsage = () => {
    if (dailyUsageTarget !== null && dailyUsageTarget > 0) return dailyUsageTarget;
    return getAutoAvgDailyUsage();
  };

  const addProduction = (data: Omit<EggProduction, 'id' | 'user_id' | 'total_eggs' | 'created_at'>) => {
    const total_eggs = calculateTotalEggs(data.egg_trays, data.loose_eggs);
    const newRecord: EggProduction = {
      ...data,
      id: `p${Date.now()}`,
      user_id: 'u1',
      total_eggs,
      created_at: new Date().toISOString(),
    };
    setProductions((prev) => [newRecord, ...prev]);
  };

  const addFeedInventory = (data: Omit<FeedInventory, 'id' | 'user_id' | 'total_price' | 'created_at'>) => {
    const total_price = data.quantity_kg * data.price_per_kg;
    const newRecord: FeedInventory = {
      ...data,
      id: `fi${Date.now()}`,
      user_id: 'u1',
      total_price,
      created_at: new Date().toISOString(),
    };
    setFeedInventory((prev) => [newRecord, ...prev]);
  };

  const addFeedUsage = (data: Omit<FeedUsage, 'id' | 'user_id' | 'created_at'>) => {
    const newRecord: FeedUsage = {
      ...data,
      id: `fu${Date.now()}`,
      user_id: 'u1',
      created_at: new Date().toISOString(),
    };
    setFeedUsages((prev) => [newRecord, ...prev]);
  };

  const addTransaction = (data: Omit<Transaction, 'id' | 'user_id' | 'created_at'>) => {
    const newRecord: Transaction = {
      ...data,
      id: `tr${Date.now()}`,
      user_id: 'u1',
      created_at: new Date().toISOString(),
    };
    setTransactions((prev) => [newRecord, ...prev]);
  };

  const addMarketPrice = (data: Omit<MarketPrice, 'id' | 'user_id' | 'created_at'>) => {
    const newRecord: MarketPrice = {
      ...data,
      id: `mp${Date.now()}`,
      user_id: 'u1',
      created_at: new Date().toISOString(),
    };
    setMarketPrices((prev) => [newRecord, ...prev]);
  };

  return (
    <AppStateContext.Provider value={{
      productions,
      feedInventory,
      feedUsages,
      transactions,
      marketPrices,
      dailyUsageTarget,
      setDailyUsageTarget,
      addProduction,
      addFeedInventory,
      addFeedUsage,
      addTransaction,
      addMarketPrice,
      getFeedStockKg,
      getAvgDailyUsage,
      getAutoAvgDailyUsage,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
