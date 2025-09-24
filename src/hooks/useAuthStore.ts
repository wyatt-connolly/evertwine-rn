import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "../types";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.config";

export type User = AuthUser;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setOnboardingComplete: (completed: boolean) => void;
  setLoading: (loading: boolean) => void;
  updateUserProfile: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      onboardingComplete: false,
      isLoading: false,

      setUser: (user) => set({ user }),

      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setOnboardingComplete: (onboardingComplete) =>
        set({ onboardingComplete }),

      setLoading: (isLoading) => set({ isLoading }),

      updateUserProfile: (updates) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },

      logout: async () => {
        try {
          // Sign out from Firebase Auth
          await signOut(auth);
        } catch (error) {}

        // Clear local state
        set({
          user: null,
          isAuthenticated: false,
          onboardingComplete: false,
          isLoading: false,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
