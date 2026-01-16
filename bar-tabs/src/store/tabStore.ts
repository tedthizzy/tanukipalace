import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getSakeById, getSakePrice } from '@/data/sake';
import { getTanukiById, getDrunkLevel, DrunkLevel } from '@/data/tanukis';

export interface OrderItem {
  sakeId: string;
  quantity: number;
  timestamp: Date;
}

export interface TanukiTab {
  tanukiId: string;
  orders: OrderItem[];
  isOpen: boolean;
  openedAt: Date;
  closedAt?: Date;
  discount: number; // percentage
  tip: number;
  notes: string;
}

interface TabStore {
  tabs: TanukiTab[];
  activeTabId: string | null;
  
  // Actions
  openTab: (tanukiId: string) => void;
  closeTab: (tanukiId: string) => void;
  addOrder: (tanukiId: string, sakeId: string, quantity: number) => void;
  removeOrder: (tanukiId: string, orderIndex: number) => void;
  setDiscount: (tanukiId: string, discount: number) => void;
  setTip: (tanukiId: string, tip: number) => void;
  setNotes: (tanukiId: string, notes: string) => void;
  setActiveTab: (tanukiId: string | null) => void;
  clearClosedTabs: () => void;
  
  // Computed helpers
  getTabTotal: (tanukiId: string) => number;
  getTabSubtotal: (tanukiId: string) => number;
  getDrunkPoints: (tanukiId: string) => number;
  getTanukiDrunkLevel: (tanukiId: string) => DrunkLevel;
}

export const useTabStore = create<TabStore>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeTabId: null,

      openTab: (tanukiId) => {
        const existingTab = get().tabs.find((t) => t.tanukiId === tanukiId && t.isOpen);
        if (existingTab) return;

        set((state) => ({
          tabs: [
            ...state.tabs,
            {
              tanukiId,
              orders: [],
              isOpen: true,
              openedAt: new Date(),
              discount: 0,
              tip: 0,
              notes: '',
            },
          ],
          activeTabId: tanukiId,
        }));
      },

      closeTab: (tanukiId) => {
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.tanukiId === tanukiId && t.isOpen
              ? { ...t, isOpen: false, closedAt: new Date() }
              : t
          ),
          activeTabId: state.activeTabId === tanukiId ? null : state.activeTabId,
        }));
      },

      addOrder: (tanukiId, sakeId, quantity) => {
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.tanukiId === tanukiId && t.isOpen
              ? {
                  ...t,
                  orders: [
                    ...t.orders,
                    { sakeId, quantity, timestamp: new Date() },
                  ],
                }
              : t
          ),
        }));
      },

      removeOrder: (tanukiId, orderIndex) => {
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.tanukiId === tanukiId && t.isOpen
              ? {
                  ...t,
                  orders: t.orders.filter((_, i) => i !== orderIndex),
                }
              : t
          ),
        }));
      },

      setDiscount: (tanukiId, discount) => {
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.tanukiId === tanukiId && t.isOpen ? { ...t, discount } : t
          ),
        }));
      },

      setTip: (tanukiId, tip) => {
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.tanukiId === tanukiId && t.isOpen ? { ...t, tip } : t
          ),
        }));
      },

      setNotes: (tanukiId, notes) => {
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.tanukiId === tanukiId && t.isOpen ? { ...t, notes } : t
          ),
        }));
      },

      setActiveTab: (tanukiId) => {
        set({ activeTabId: tanukiId });
      },

      clearClosedTabs: () => {
        set((state) => ({
          tabs: state.tabs.filter((t) => t.isOpen),
        }));
      },

      getTabSubtotal: (tanukiId) => {
        const tab = get().tabs.find((t) => t.tanukiId === tanukiId && t.isOpen);
        if (!tab) return 0;
        return tab.orders.reduce(
          (sum, order) => sum + getSakePrice(order.sakeId, order.quantity),
          0
        );
      },

      getTabTotal: (tanukiId) => {
        const tab = get().tabs.find((t) => t.tanukiId === tanukiId && t.isOpen);
        if (!tab) return 0;
        const subtotal = get().getTabSubtotal(tanukiId);
        const afterDiscount = subtotal * (1 - tab.discount / 100);
        return afterDiscount + tab.tip;
      },

      getDrunkPoints: (tanukiId) => {
        const tab = get().tabs.find((t) => t.tanukiId === tanukiId && t.isOpen);
        if (!tab) return 0;
        return tab.orders.reduce((sum, order) => {
          const sake = getSakeById(order.sakeId);
          return sum + (sake ? sake.drunkPoints * order.quantity : 0);
        }, 0);
      },

      getTanukiDrunkLevel: (tanukiId) => {
        const tanuki = getTanukiById(tanukiId);
        if (!tanuki) return 'sober';
        const drunkPoints = get().getDrunkPoints(tanukiId);
        return getDrunkLevel(tanuki, drunkPoints);
      },
    }),
    {
      name: 'tanuki-bar-tabs',
      partialize: (state) => ({ tabs: state.tabs }),
    }
  )
);
