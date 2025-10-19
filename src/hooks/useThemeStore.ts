import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;

  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;

  // Primary colors
  primary: string;
  primaryVariant: string;
  onPrimary: string;

  // Secondary colors
  secondary: string;
  secondaryVariant: string;
  onSecondary: string;

  // Accent colors
  accent: string;
  accentVariant: string;
  accentSecondary: string;
  accentTertiary: string;
  accentQuaternary: string;
  accentQuinary: string;
  onAccent: string;

  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;

  // Border and divider colors
  border: string;
  divider: string;

  // Overlay colors
  overlay: string;
  backdrop: string;

  // Gradient colors
  gradientStart: string;
  gradientEnd: string;
  gradientSecondary: string;

  // Special colors
  announcement: string;
  onAnnouncement: string;
}

export const lightTheme: ThemeColors = {
  // Background colors
  background: "#FFFFFF",
  surface: "#F8F9FA",
  surfaceVariant: "#E9ECEF",

  // Text colors
  text: "#212529",
  textSecondary: "#6C757D",
  textTertiary: "#ADB5BD",

  // Primary colors - White
  primary: "#FFFFFF",
  primaryVariant: "#F5F5F5",
  onPrimary: "#000000",

  // Secondary colors - Light Grey
  secondary: "#E0E0E0",
  secondaryVariant: "#BDBDBD",
  onSecondary: "#000000",

  // Accent colors
  accent: "#FF6B35", // Orange accent
  accentVariant: "#E55A2B",
  accentSecondary: "#9C27B0", // Purple accent
  accentTertiary: "#2196F3", // Blue accent (meetups)
  accentQuaternary: "#FF9800", // Amber accent
  accentQuinary: "#F44336", // Red accent
  onAccent: "#FFFFFF",

  // Status colors
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#FFFFFF",

  // Border and divider colors
  border: "#DEE2E6",
  divider: "#E9ECEF",

  // Overlay colors
  overlay: "rgba(0, 0, 0, 0.5)",
  backdrop: "rgba(0, 0, 0, 0.3)",

  // Gradient colors - White to Light Grey
  gradientStart: "#FFFFFF",
  gradientEnd: "#E0E0E0",
  gradientSecondary: "#BDBDBD",

  // Special colors - Announcements now magenta
  announcement: "#9C27B0",
  onAnnouncement: "#FFFFFF",
};

export const darkTheme: ThemeColors = {
  // Background colors - Evertwine dark theme
  background: "#1A1A2E", // Dark blue-gray from Evertwine
  surface: "rgba(255, 255, 255, 0.05)", // Semi-transparent dark
  surfaceVariant: "rgba(255, 255, 255, 0.1)",

  // Text colors
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  textTertiary: "#808080",

  // Primary colors - Purple/Pink gradient from Evertwine
  primary: "#8B5CF6", // Purple
  primaryVariant: "#EC4899", // Pink
  onPrimary: "#FFFFFF",

  // Secondary colors - Blue accent for buttons
  secondary: "#3B82F6", // Professional blue
  secondaryVariant: "#2563EB",
  onSecondary: "#FFFFFF",

  // Accent colors - Evertwine palette
  accent: "#3B82F6", // Blue for call-to-action buttons
  accentVariant: "#2563EB",
  accentSecondary: "#8B5CF6", // Purple for primary branding
  accentTertiary: "#10B981", // Green for success states
  accentQuaternary: "#EC4899", // Pink for secondary branding
  accentQuinary: "#F44336", // Red for errors
  onAccent: "#FFFFFF",

  // Status colors
  success: "#10B981", // Green from Evertwine
  warning: "#F59E0B", // Amber
  error: "#F44336",
  info: "#8B5CF6", // Purple

  // Border and divider colors
  border: "rgba(255, 255, 255, 0.1)",
  divider: "rgba(255, 255, 255, 0.05)",

  // Overlay colors
  overlay: "rgba(0, 0, 0, 0.8)",
  backdrop: "rgba(0, 0, 0, 0.6)",

  // Gradient colors - Purple to Pink
  gradientStart: "#8B5CF6",
  gradientEnd: "#EC4899",
  gradientSecondary: "#10B981",

  // Special colors - Announcements
  announcement: "#8B5CF6",
  onAnnouncement: "#FFFFFF",
};

interface ThemeState {
  isDarkMode: boolean;
  colors: ThemeColors;
  isHydrated: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: true, // Default to dark mode
      colors: darkTheme,
      isHydrated: false,

      toggleTheme: () => {
        const newIsDarkMode = !get().isDarkMode;
        set({
          isDarkMode: newIsDarkMode,
          colors: newIsDarkMode ? darkTheme : lightTheme,
        });
      },

      setTheme: (isDark: boolean) => {
        set({
          isDarkMode: isDark,
          colors: isDark ? darkTheme : lightTheme,
        });
      },

      setHydrated: (isHydrated: boolean) => set({ isHydrated }),
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        console.log("🎨 Theme store hydrated");
        if (state) {
          state.setHydrated(true);
        }
      },
    }
  )
);
