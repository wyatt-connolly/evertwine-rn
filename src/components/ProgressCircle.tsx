import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useThemeStore } from "../hooks/useThemeStore";

interface ProgressCircleProps {
  targetPercentage: number;
  duration?: number;
  size?: number;
  strokeWidth?: number;
  onComplete?: () => void;
}

const ProgressCircle: React.FC<ProgressCircleProps> = ({
  targetPercentage,
  duration = 2000,
  size = 120,
  strokeWidth = 4,
  onComplete,
}) => {
  const { colors } = useThemeStore();
  const progressAnim = useRef(new Animated.Value(0)).current;
  const numberAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the progress circle
    Animated.timing(progressAnim, {
      toValue: targetPercentage,
      duration,
      useNativeDriver: false,
    }).start();

    // Animate the number counter
    Animated.timing(numberAnim, {
      toValue: targetPercentage,
      duration,
      useNativeDriver: false,
    }).start(() => {
      onComplete?.();
    });
  }, [targetPercentage, duration, onComplete]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const animatedNumber = numberAnim.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Background circle */}
      <View
        style={[
          styles.backgroundCircle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: "rgba(255, 255, 255, 0.1)",
          },
        ]}
      />

      {/* Progress circle using SVG-like approach with border */}
      <View
        style={[
          styles.progressContainer,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressCircle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              borderColor: colors.accent,
              transform: [
                {
                  rotate: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["-90deg", "270deg"],
                  }),
                },
              ],
            },
          ]}
        />
      </View>

      {/* Percentage text */}
      <View style={styles.textContainer}>
        <Animated.Text
          style={[
            styles.percentageText,
            {
              color: colors.text,
              fontSize: size * 0.2,
            },
          ]}
        >
          {animatedNumber._value ? Math.round(animatedNumber._value) : 0}%
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backgroundCircle: {
    position: "absolute",
    borderStyle: "solid",
  },
  progressContainer: {
    position: "absolute",
    overflow: "hidden",
  },
  progressCircle: {
    position: "absolute",
    borderStyle: "solid",
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
  },
  textContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  percentageText: {
    fontWeight: "700",
    textAlign: "center",
  },
});

export default ProgressCircle;
