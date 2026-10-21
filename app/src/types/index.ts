// TypeScript type definitions for Markas Endog

export interface Profile {
  id: string;
  full_name: string;
  farm_name: string;
  farm_address: string;
  phone: string;
  email: string;
  avatar_url?: string;
  total_chickens: number;
  created_at: string;
  updated_at: string;
}

export interface EggProduction {
  id: string;
  user_id: string;
  date: string;
  egg_trays: number;
  loose_eggs: number;
  broken_eggs: number;
  total_weight_kg: number;
  total_eggs: number; // auto-calculated: egg_trays * 30 + loose_eggs
  notes?: string;
  created_at: string;
}

export interface FeedInventory {
  id: string;
  user_id: string;
  date: string;
  feed_type: string;
  quantity_kg: number;
  price_per_kg: number;
  total_price: number;
  supplier?: string;
  notes?: string;
  created_at: string;
}

export interface FeedUsage {
  id: string;
  user_id: string;
  date: string;
  quantity_kg: number;
  notes?: string;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  notes?: string;
  created_at: string;
}

export interface MarketPrice {
  id: string;
  user_id: string;
  date: string;
  price_per_kg: number;
  price_per_tray: number;
  notes?: string;
  created_at: string;
}

// Summary card data
export interface DashboardSummary {
  todayProduction: number;
  todayTrays: number;
  feedStockKg: number;
  feedDaysLeft: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}

// Weekly production for chart
export interface WeeklyProductionData {
  day: string;
  telur: number;
  rusak: number;
  berat: number;
}

// Monthly financial data for chart
export interface MonthlyFinancialData {
  month: string;
  pemasukan: number;
  pengeluaran: number;
  laba: number;
}
