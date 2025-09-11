import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { useThemeStore } from "../hooks/useThemeStore";

interface SimpleGradientBackgroundProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: "primary" | "secondary" | "subtle";
}

export default function SimpleGradientBackground({
  children,
  style,
  variant = "primary",
}: SimpleGradientBackgroundProps) {
  const { colors } = useThemeStore();

  const getBackgroundColor = () => {
    switch (variant) {
      case "primary":
        return colors.gradientStart;
      case "secondary":
        return colors.gradientSecondary;
      case "subtle":
        return colors.background;
      default:
        return colors.gradientStart;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
