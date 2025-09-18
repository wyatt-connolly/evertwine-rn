import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useThemeStore } from "../hooks/useThemeStore";

interface LoadingIndicatorProps {
  size?: "small" | "medium" | "large";
  text?: string;
  overlay?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: string;
}

export default function LoadingIndicator({
  size = "medium",
  text,
  overlay = false,
  style,
  textStyle,
  color,
}: LoadingIndicatorProps) {
  const { colors } = useThemeStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const getSize = () => {
    switch (size) {
      case "small":
        return 20;
      case "large":
        return 40;
      default:
        return 30;
    }
  };

  const containerStyle = overlay
    ? [styles.overlay, { backgroundColor: colors.background + "80" }]
    : [styles.container, style];

  return (
    <Animated.View style={[containerStyle, { opacity: fadeAnim }]}>
      <View style={styles.content}>
        <ActivityIndicator
          size={getSize()}
          color={color || colors.primary}
          style={styles.spinner}
        />
        {text && (
          <Text
            style={[styles.text, { color: color || colors.text }, textStyle]}
          >
            {text}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 8,
  },
});
