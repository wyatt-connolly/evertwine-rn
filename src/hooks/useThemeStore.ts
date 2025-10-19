import { create } from "zustand";

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
  // Background colors - Evertwine dark theme
  background: "#1A1A2E", // Dark blue-gray from Evertwine
  surface: "rgba(26, 26, 46, 0.95)", // More opaque dark surface for navbar
  surfaceVariant: "rgba(255, 255, 255, 0.1)",

  // Text colors - All white for consistency
  text: "#FFFFFF",
  textSecondary: "#FFFFFF",
  textTertiary: "#FFFFFF",

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

  // Border and divider colors - More visible
  border: "rgba(255, 255, 255, 0.3)",
  divider: "rgba(255, 255, 255, 0.2)",

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
  colors: ThemeColors;
}

export const useThemeStore = create<ThemeState>()((set, get) => ({
  colors: darkTheme,
}));
