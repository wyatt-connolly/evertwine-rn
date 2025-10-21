import { create } from "zustand";
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

export const darkTheme: ThemeColors = {
  // Background colors - Dark mode aesthetic
  background: "#1C1C1E", // Dark background
  surface: "rgba(28, 28, 30, 0.95)", // Dark surface
  surfaceVariant: "rgba(58, 58, 60, 0.9)", // Slightly lighter dark surface

  // Text colors - Light text on dark
  text: "#FFFFFF", // Pure white primary text
  textSecondary: "#E5E5EA", // Light secondary text
  textTertiary: "#AEAEB2", // Muted tertiary text

  // Primary colors - Neutral white (Instagram-like)
  primary: "#FFFFFF", // White primary (Instagram-like)
  primaryVariant: "#F5F5F5", // Off-white variant
  onPrimary: "#000000", // Black text on white

  // Secondary colors - Consistent with primary
  secondary: "#FFFFFF", // Same as primary for consistency
  secondaryVariant: "#F5F5F5",
  onSecondary: "#000000",

  // Accent colors - Subtle, muted colors
  accent: "#FFFFFF", // White for call-to-action buttons
  accentVariant: "#F5F5F5",
  accentSecondary: "#8E8E93", // Gray for subtle accents
  accentTertiary: "#6B7280", // Muted gray for meetups
  accentQuaternary: "#9CA3AF", // Muted gray for happy hours
  accentQuinary: "#EF4444", // Red for errors only
  onAccent: "#000000", // Black text on light accents

  // Status colors - Muted system colors
  success: "#10B981", // Muted green
  warning: "#F59E0B", // Muted orange
  error: "#EF4444", // Red for errors
  info: "#6B7280", // Muted gray for info

  // Border and divider colors - Very subtle
  border: "rgba(255, 255, 255, 0.12)", // Very subtle
  divider: "rgba(255, 255, 255, 0.08)", // Even more subtle

  // Overlay colors
  overlay: "rgba(0, 0, 0, 0.65)",
  backdrop: "rgba(0, 0, 0, 0.4)",

  // Gradient colors - Neutral gradients
  gradientStart: "#FFFFFF",
  gradientEnd: "#F5F5F5",
  gradientSecondary: "#6B7280",

  // Special colors - Neutral
  announcement: "#6B7280", // Muted gray for announcements
  onAnnouncement: "#FFFFFF",
};

export const lightTheme: ThemeColors = {
  // Background colors - Light mode aesthetic
  background: "#FFFFFF", // Pure white background
  surface: "#FAFAFA", // Light gray surface
  surfaceVariant: "#F5F5F5", // Slightly darker light surface

  // Text colors - Dark text on light
  text: "#262626", // Near-black primary text (Instagram-like)
  textSecondary: "#525252", // Dark gray secondary text
  textTertiary: "#9CA3AF", // Muted tertiary text

  // Primary colors - Dark neutral (Instagram-like)
  primary: "#262626", // Near-black primary (Instagram-like)
  primaryVariant: "#171717", // Darker variant
  onPrimary: "#FFFFFF", // White text on dark

  // Secondary colors - Consistent with primary
  secondary: "#262626", // Same as primary for consistency
  secondaryVariant: "#171717",
  onSecondary: "#FFFFFF",

  // Accent colors - Subtle, muted colors
  accent: "#262626", // Dark for call-to-action buttons
  accentVariant: "#171717",
  accentSecondary: "#6B7280", // Gray for subtle accents
  accentTertiary: "#4B5563", // Darker gray for meetups
  accentQuaternary: "#6B7280", // Gray for happy hours
  accentQuinary: "#EF4444", // Red for errors only
  onAccent: "#FFFFFF", // White text on dark accents

  // Status colors - Muted system colors
  success: "#059669", // Darker green for light mode
  warning: "#D97706", // Darker orange for light mode
  error: "#DC2626", // Darker red for light mode
  info: "#4B5563", // Darker gray for info

  // Border and divider colors - Subtle
  border: "rgba(0, 0, 0, 0.12)", // Subtle dark border
  divider: "rgba(0, 0, 0, 0.08)", // Even more subtle

  // Overlay colors
  overlay: "rgba(0, 0, 0, 0.65)",
  backdrop: "rgba(0, 0, 0, 0.4)",

  // Gradient colors - Neutral gradients
  gradientStart: "#262626",
  gradientEnd: "#171717",
  gradientSecondary: "#4B5563",

  // Special colors - Neutral
  announcement: "#4B5563", // Dark gray for announcements
  onAnnouncement: "#FFFFFF",
};

interface ThemeState {
  isDarkMode: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
  initializeTheme: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  isDarkMode: true, // Default to dark mode per user preference
  colors: darkTheme,

  toggleTheme: () => {
    const { isDarkMode } = get();
    const newIsDarkMode = !isDarkMode;
    const newColors = newIsDarkMode ? darkTheme : lightTheme;

    set({ isDarkMode: newIsDarkMode, colors: newColors });

    // Persist theme preference
    AsyncStorage.setItem("theme", newIsDarkMode ? "dark" : "light");
  },

  initializeTheme: async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      const isDarkMode = savedTheme !== "light"; // Default to dark if no saved preference
      const colors = isDarkMode ? darkTheme : lightTheme;

      set({ isDarkMode, colors });
    } catch (error) {

      // Fallback to dark mode
      set({ isDarkMode: true, colors: darkTheme });
    }
  },
}));
