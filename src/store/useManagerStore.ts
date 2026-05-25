import { create } from "zustand";

interface ManagerData {
  id: string;
  name: string;
  role: string;
}

interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowth: number; // percentage
  totalOrders: number;
  orderGrowth: number;
  activeTables: number;
  lowStockItems: number;
  newCustomers: number;
  customerGrowth: number;
  rewardRedemptions: number;
}

interface RevenueDataPoint {
  date: string;
  revenue: number;
}

interface PopularMenuItem {
  name: string;
  value: number;
}

interface ManagerState {
  managerData: ManagerData | null;
  isAuthenticated: boolean;
  metrics: DashboardMetrics;
  revenueData: RevenueDataPoint[];
  popularMenuData: PopularMenuItem[];
  
  // Actions
  login: (data: ManagerData) => void;
  logout: () => void;
}

export const useManagerStore = create<ManagerState>((set) => ({
  // Authenticaton state
  managerData: null,
  isAuthenticated: false,
  
  // Dummy data for analytics
  metrics: {
    totalRevenue: 24500000,
    revenueGrowth: 12.5,
    totalOrders: 845,
    orderGrowth: 5.2,
    activeTables: 12,
    lowStockItems: 3,
    newCustomers: 156,
    customerGrowth: 8.4,
    rewardRedemptions: 42,
  },
  
  revenueData: [
    { date: "Mon", revenue: 2100000 },
    { date: "Tue", revenue: 2400000 },
    { date: "Wed", revenue: 2300000 },
    { date: "Thu", revenue: 3100000 },
    { date: "Fri", revenue: 4500000 },
    { date: "Sat", revenue: 5200000 },
    { date: "Sun", revenue: 4900000 },
  ],
  
  popularMenuData: [
    { name: "Espresso", value: 400 },
    { name: "Nasi Goreng Spesial", value: 300 },
    { name: "Matcha Latte", value: 300 },
    { name: "Chicken Cordon Bleu", value: 200 },
  ],

  login: (data) => set({ managerData: data, isAuthenticated: true }),
  logout: () => set({ managerData: null, isAuthenticated: false }),
}));
