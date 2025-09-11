import React, { useRef } from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useThemeStore } from "../hooks/useThemeStore";

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  loading?: boolean;
}

export default function AnimatedButton({
  title,
  onPress,
  style,
  textStyle,
  variant = "primary",
  disabled = false,
  loading = false,
}: AnimatedButtonProps) {
  const { colors } = useThemeStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button];

    switch (variant) {
      case "primary":
        return [...baseStyle, { backgroundColor: colors.primary }];
      case "secondary":
        return [
          ...baseStyle,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
          },
        ];
      case "outline":
        return [
          ...baseStyle,
          {
            backgroundColor: "transparent",
            borderColor: colors.primary,
            borderWidth: 2,
          },
        ];
      default:
        return [...baseStyle, { backgroundColor: colors.primary }];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text];

    switch (variant) {
      case "primary":
        return [...baseStyle, { color: colors.onPrimary }];
      case "secondary":
        return [...baseStyle, { color: colors.text }];
      case "outline":
        return [...baseStyle, { color: colors.primary }];
      default:
        return [...baseStyle, { color: colors.onPrimary }];
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[...getButtonStyle(), style, disabled && styles.disabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <Text style={[...getTextStyle(), textStyle]}>
          {loading ? "Loading..." : title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
});
