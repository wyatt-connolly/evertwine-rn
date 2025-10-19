import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "../types";
import { SupabaseAuthService } from "../services/supabase";

export type User = AuthUser;

interface OnboardingData {
  name?: string;
  age?: number;
  gender?: string;
  goals?: string[];
  obstacles?: string[];
  routine?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  hasSeenIntro: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  onboardingData: OnboardingData;
  onboardingStep: string;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setOnboardingComplete: (completed: boolean) => void;
  setHasSeenIntro: (seen: boolean) => void;
  setLoading: (loading: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  setOnboardingData: (data: Partial<OnboardingData>) => void;
  setOnboardingStep: (step: string) => void;
  getCurrentOnboardingStep: () => string;
  clearOnboardingData: () => void;
  resetOnboardingState: () => void;
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
      onboardingData: {},
      onboardingStep: "NameInput",

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

      setOnboardingData: (data) => {
        const currentData = get().onboardingData;
        set({ onboardingData: { ...currentData, ...data } });
      },

      setOnboardingStep: (onboardingStep) => {
        console.log("📍 Setting onboarding step:", onboardingStep);
        set({ onboardingStep });
      },

      // Determine current onboarding step based on existing data
      getCurrentOnboardingStep: () => {
        const { onboardingData } = get();

        if (!onboardingData.name) return "NameInput";
        if (!onboardingData.age) return "AgeSelection";
        if (!onboardingData.gender) return "GenderSelection";
        if (!onboardingData.goals || onboardingData.goals.length === 0)
          return "GoalsSelection";
        if (!onboardingData.obstacles || onboardingData.obstacles.length === 0)
          return "ObstaclesSelection";
        if (!onboardingData.routine) return "RoutineSetup";

        // If all data is present, go to BuildingProfile
        return "BuildingProfile";
      },

      clearOnboardingData: () => {
        set({ onboardingData: {} });
      },

      logout: async () => {
        try {
          // Sign out from Supabase Auth
          await SupabaseAuthService.signOut();
          // Clear browser session to allow account switching
          await SupabaseAuthService.clearBrowserSession();
        } catch (error) {
          console.error("Error signing out:", error);
        }

        // Clear local state but preserve hasSeenIntro
        const currentState = get();
        set({
          user: null,
          isAuthenticated: false,
          onboardingComplete: false,
          hasSeenIntro: currentState.hasSeenIntro, // Preserve hasSeenIntro across logout
          isLoading: false,
          isHydrated: true,
          onboardingData: {},
        });
      },

      // Reset onboarding state for new user (but keep hasSeenIntro)
      resetOnboardingState: () => {
        set({
          onboardingComplete: false,
          onboardingData: {},
          onboardingStep: "NameInput",
          // Don't reset hasSeenIntro - it should persist across app sessions
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
