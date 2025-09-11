import React, { useRef, useEffect } from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";
import { useThemeStore } from "../hooks/useThemeStore";

interface AnimatedCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function AnimatedCard({
  children,
  style,
  delay = 0,
  direction = "up",
}: AnimatedCardProps) {
  const { colors } = useThemeStore();
  const translateAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const getInitialValue = () => {
      switch (direction) {
        case "up":
          return 50;
        case "down":
          return -50;
        case "left":
          return 50;
        case "right":
          return -50;
        default:
          return 50;
      }
    };

    const getFinalValue = () => {
      switch (direction) {
        case "up":
          return 0;
        case "down":
          return 0;
        case "left":
          return 0;
        case "right":
          return 0;
        default:
          return 0;
      }
    };

    const getTransformProperty = () => {
      switch (direction) {
        case "up":
        case "down":
          return "translateY";
        case "left":
        case "right":
          return "translateX";
        default:
          return "translateY";
      }
    };

    translateAnim.setValue(getInitialValue());

    Animated.parallel([
      Animated.timing(translateAnim, {
        toValue: getFinalValue(),
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, direction, translateAnim, opacityAnim]);

  const getTransform = () => {
    switch (direction) {
      case "up":
      case "down":
        return { translateY: translateAnim };
      case "left":
      case "right":
        return { translateX: translateAnim };
      default:
        return { translateY: translateAnim };
    }
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: opacityAnim,
          transform: [getTransform()],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
