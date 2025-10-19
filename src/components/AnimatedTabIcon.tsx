import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";

interface AnimatedTabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  focused: boolean;
  size?: number;
  color?: string;
  activeColor?: string;
  inactiveColor?: string;
}

export default function AnimatedTabIcon({
  name,
  focused,
  size = 24,
  color,
  activeColor,
  inactiveColor,
}: AnimatedTabIconProps) {
  const { colors } = useThemeStore();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const finalActiveColor = activeColor || colors.primary;
  const finalInactiveColor = inactiveColor || colors.textTertiary;

  useEffect(() => {
    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: focused ? 1.1 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();

    // Color animation
    Animated.timing(colorAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const animatedColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [finalInactiveColor, finalActiveColor],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Ionicons name={name} size={size} color={color || animatedColor} />
    </Animated.View>
  );
}
