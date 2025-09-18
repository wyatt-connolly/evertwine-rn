import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { useThemeStore } from "../hooks/useThemeStore";

interface AppLogoProps {
  size?: "small" | "medium" | "large";
  variant?: "full" | "icon" | "text";
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function AppLogo({
  size = "medium",
  variant = "full",
  style,
  textStyle,
}: AppLogoProps) {
  const { colors } = useThemeStore();

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          container: { width: 24, height: 24 },
          icon: { width: 20, height: 20 },
          text: { fontSize: 12, marginLeft: 4 },
        };
      case "large":
        return {
          container: { width: 80, height: 80 },
          icon: { width: 60, height: 60 },
          text: { fontSize: 24, marginLeft: 12 },
        };
      default: // medium
        return {
          container: { width: 40, height: 40 },
          icon: { width: 32, height: 32 },
          text: { fontSize: 16, marginLeft: 8 },
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderIcon = () => (
    <View
      style={[
        styles.iconContainer,
        sizeStyles.icon,
        { backgroundColor: colors.primary },
      ]}
    >
      <Text style={[styles.iconText, { color: colors.onPrimary }]}>E</Text>
    </View>
  );

  const renderText = () => (
    <Text
      style={[
        styles.logoText,
        sizeStyles.text,
        { color: colors.text },
        textStyle,
      ]}
    >
      Evertwine
    </Text>
  );

  if (variant === "icon") {
    return (
      <View style={[styles.container, sizeStyles.container, style]}>
        {renderIcon()}
      </View>
    );
  }

  if (variant === "text") {
    return <View style={[styles.container, style]}>{renderText()}</View>;
  }

  // full variant
  return (
    <View style={[styles.container, styles.fullContainer, style]}>
      {renderIcon()}
      {renderText()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullContainer: {
    justifyContent: "flex-start",
  },
  iconContainer: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "System",
  },
  logoText: {
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
