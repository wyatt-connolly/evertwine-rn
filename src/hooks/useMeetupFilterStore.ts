import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type FilterType = "for-you" | "following";

interface MeetupFilterState {
  activeFilter: FilterType;
  selectedFilters: string[];
  setActiveFilter: (filter: FilterType) => void;
  setSelectedFilters: (filters: string[]) => void;
  clearFilters: () => void;
}

export const useMeetupFilterStore = create<MeetupFilterState>()(
  persist(
    (set) => ({
      activeFilter: "for-you",
      selectedFilters: [],

      setActiveFilter: (filter) => set({ activeFilter: filter }),

      setSelectedFilters: (filters) => set({ selectedFilters: filters }),

      clearFilters: () => set({ selectedFilters: [] }),
    }),
    {
      name: "meetup-filter-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
