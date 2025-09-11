import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useThemeStore } from "../hooks/useThemeStore";

interface GradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "primary" | "secondary" | "subtle";
}

export default function GradientBackground({
  children,
  style,
  variant = "primary",
}: GradientBackgroundProps) {
  const { colors } = useThemeStore();

  const getGradientColors = (): [string, string] => {
    switch (variant) {
      case "primary":
        return [colors.gradientStart, colors.gradientEnd];
      case "secondary":
        return [colors.gradientSecondary, colors.primary];
      case "subtle":
        return [colors.background, colors.surface];
      default:
        return [colors.gradientStart, colors.gradientEnd];
    }
  };

  return (
    <LinearGradient
      colors={getGradientColors()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
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
