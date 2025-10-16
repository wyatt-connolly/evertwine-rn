import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "../types";
import { SupabaseAuthService } from "../services/supabase";

export type User = AuthUser;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  hasSeenIntro: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setOnboardingComplete: (completed: boolean) => void;
  setHasSeenIntro: (seen: boolean) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      onboardingComplete: false,
      hasSeenIntro: false,
      isLoading: false,
      isHydrated: false,

      setUser: (user) => set({ user }),

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setOnboardingComplete: (onboardingComplete) => {
        console.log("🎯 Setting onboarding complete:", onboardingComplete);
        set({ onboardingComplete });
      },

      setHasSeenIntro: (hasSeenIntro) => {
        console.log("🎬 Setting has seen intro:", hasSeenIntro);
        set({ hasSeenIntro });
      },

      setLoading: (isLoading) => set({ isLoading }),

      setHydrated: (isHydrated) => set({ isHydrated }),

      updateUserProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      logout: async () => {
        try {
          // Sign out from Supabase Auth
          await SupabaseAuthService.signOut();
        } catch (error) {
          console.error("Error signing out:", error);
        }

        // Clear local state
        set({
          user: null,
          isAuthenticated: false,
          onboardingComplete: false,
          hasSeenIntro: false,
          isLoading: false,
          isHydrated: true,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        console.log("🔄 Auth store hydrated");
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
