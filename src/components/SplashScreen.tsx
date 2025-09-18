import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from "react-native";
import { useThemeStore } from "../hooks/useThemeStore";

const { width, height } = Dimensions.get("window");

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { colors } = useThemeStore();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const animationSequence = Animated.sequence([
      // Fade in and scale logo
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Slide in text
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(1000),
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start(() => {
      onFinish();
    });
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* App Logo */}
        <View
          style={[styles.logoContainer, { backgroundColor: colors.onPrimary }]}
        >
          <Text style={[styles.logoText, { color: colors.primary }]}>E</Text>
        </View>

        {/* App Name */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={[styles.appName, { color: colors.onPrimary }]}>
            Evertwine
          </Text>
          <Text style={[styles.tagline, { color: colors.onPrimary }]}>
            Connect. Network. Grow.
          </Text>
        </Animated.View>
      </Animated.View>

      {/* Loading indicator */}
      <Animated.View style={[styles.loadingContainer, { opacity: fadeAnim }]}>
        <View
          style={[styles.loadingDot, { backgroundColor: colors.onPrimary }]}
        />
        <View
          style={[styles.loadingDot, { backgroundColor: colors.onPrimary }]}
        />
        <View
          style={[styles.loadingDot, { backgroundColor: colors.onPrimary }]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "700",
    fontFamily: "System",
  },
  textContainer: {
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    opacity: 0.9,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 100,
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    opacity: 0.7,
  },
});
