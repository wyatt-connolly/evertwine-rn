import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeStore } from "../hooks/useThemeStore";

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "primary" | "secondary" | "subtle" | "dark";
}

export default function GradientBackground({
  children,
  style,
  variant = "primary",
}: GradientBackgroundProps) {
  const { colors } = useThemeStore();

  const getGradientColors = (): string[] => {
    switch (variant) {
      case "primary":
        return [colors.gradientStart, colors.gradientEnd];
      case "secondary":
        return [colors.gradientSecondary, colors.primary];
      case "subtle":
        return [colors.background, colors.surface];
      case "dark":
        // Subtle gradient with more black, less purple
        return [
          "#0a0a0a", // Very dark black
          "#1a1a2e", // Dark blue-gray
          "#0f0f0f", // Dark black
          "#0a0a0a", // Very dark black
        ];
      default:
        return [colors.gradientStart, colors.gradientEnd];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={variant === "dark" ? [0, 0.3, 0.7, 1] : undefined}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});
