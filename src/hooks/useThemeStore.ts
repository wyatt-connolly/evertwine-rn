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
  // Background colors
  background: "#1A1A1A", // Dark grey instead of pure black
  surface: "#2A2A2A",
  surfaceVariant: "#3A3A3A",

  // Text colors
  text: "#FFFFFF",
  textSecondary: "#B0B0B0",
  textTertiary: "#808080",

  // Primary colors - White
  primary: "#FFFFFF",
  primaryVariant: "#F5F5F5",
  onPrimary: "#000000",

  // Secondary colors - Light Grey
  secondary: "#E0E0E0",
  secondaryVariant: "#BDBDBD",
  onSecondary: "#000000",

  // Accent colors - More vibrant for dark mode
  accent: "#FF6B35", // Vibrant orange
  accentVariant: "#FF5722",
  accentSecondary: "#E91E63", // Bright pink/magenta
  accentTertiary: "#42A5F5", // Bright blue (meetups)
  accentQuaternary: "#FFC107", // Bright amber
  accentQuinary: "#F44336", // Bright red
  onAccent: "#FFFFFF",

  // Status colors
  success: "#66BB6A",
  warning: "#FFB74D",
  error: "#EF5350",
  info: "#FFFFFF",

  // Border and divider colors
  border: "#404040",
  divider: "#3A3A3A",

  // Overlay colors
  overlay: "rgba(0, 0, 0, 0.8)",
  backdrop: "rgba(0, 0, 0, 0.6)",

  // Gradient colors - White to Light Grey
  gradientStart: "#FFFFFF",
  gradientEnd: "#E0E0E0",
  gradientSecondary: "#BDBDBD",

  // Special colors - Announcements now magenta
  announcement: "#E91E63",
  onAnnouncement: "#FFFFFF",
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
