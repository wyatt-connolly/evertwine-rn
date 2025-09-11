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

  // Primary colors
  primary: "#007AFF",
  primaryVariant: "#0056CC",
  onPrimary: "#FFFFFF",

  // Secondary colors
  secondary: "#6C757D",
  secondaryVariant: "#495057",
  onSecondary: "#FFFFFF",

  // Status colors
  success: "#28A745",
  warning: "#FFC107",
  error: "#DC3545",
  info: "#17A2B8",

  // Border and divider colors
  border: "#DEE2E6",
  divider: "#E9ECEF",

  // Overlay colors
  overlay: "rgba(0, 0, 0, 0.5)",
  backdrop: "rgba(0, 0, 0, 0.3)",

  // Gradient colors
  gradientStart: "#007AFF",
  gradientEnd: "#5AC8FA",
  gradientSecondary: "#FF6B6B",
};

export const darkTheme: ThemeColors = {
  // Background colors
  background: "#121212",
  surface: "#1E1E1E",
  surfaceVariant: "#2D2D2D",

  // Text colors
  text: "#FFFFFF",
  textSecondary: "#AEAEB2",
  textTertiary: "#8E8E93",

  // Primary colors
  primary: "#0A84FF",
  primaryVariant: "#0056CC",
  onPrimary: "#FFFFFF",

  // Secondary colors
  secondary: "#8E8E93",
  secondaryVariant: "#636366",
  onSecondary: "#FFFFFF",

  // Status colors
  success: "#30D158",
  warning: "#FF9F0A",
  error: "#FF453A",
  info: "#64D2FF",

  // Border and divider colors
  border: "#38383A",
  divider: "#2C2C2E",

  // Overlay colors
  overlay: "rgba(0, 0, 0, 0.7)",
  backdrop: "rgba(0, 0, 0, 0.5)",

  // Gradient colors
  gradientStart: "#0A84FF",
  gradientEnd: "#64D2FF",
  gradientSecondary: "#FF6B6B",
};

interface ThemeState {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      isDarkMode: true, // Default to dark mode
      colors: darkTheme,

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
    }),
    {
      name: "theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
