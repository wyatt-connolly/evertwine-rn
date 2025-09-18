import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, ViewStyle } from "react-native";
import { useThemeStore } from "../hooks/useThemeStore";

interface SkeletonLoaderProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({
  width = 200,
  height = 20,
  borderRadius = 4,
  style,
}: SkeletonLoaderProps) {
  const { colors } = useThemeStore();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.textTertiary,
          opacity,
        },
        style,
      ]}
    />
  );
}

interface SkeletonCardProps {
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
}

export function SkeletonCard({
  showAvatar = true,
  showImage = false,
  lines = 3,
}: SkeletonCardProps) {
  const { colors } = useThemeStore();

  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      {showImage && (
        <SkeletonLoader
          width={300}
          height={150}
          borderRadius={8}
          style={styles.image}
        />
      )}

      <View style={styles.cardContent}>
        {showAvatar && (
          <View style={styles.header}>
            <SkeletonLoader width={40} height={40} borderRadius={20} />
            <View style={styles.headerText}>
              <SkeletonLoader width={120} height={16} />
              <SkeletonLoader width={80} height={12} style={styles.subtitle} />
            </View>
          </View>
        )}

        <View style={styles.content}>
          {Array.from({ length: lines }).map((_, index) => (
            <SkeletonLoader
              key={index}
              width={index === lines - 1 ? 140 : 200}
              height={14}
              style={styles.line}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <SkeletonLoader width={80} height={12} />
          <SkeletonLoader width={60} height={12} />
        </View>
      </View>
    </View>
  );
}

interface SkeletonListProps {
  itemCount?: number;
  showAvatar?: boolean;
  showImage?: boolean;
}

export function SkeletonList({
  itemCount = 3,
  showAvatar = true,
  showImage = false,
}: SkeletonListProps) {
  return (
    <View style={styles.list}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <SkeletonCard
          key={index}
          showAvatar={showAvatar}
          showImage={showImage}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#E0E0E0",
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    flex: 1,
    marginLeft: 12,
  },
  subtitle: {
    marginTop: 4,
  },
  content: {
    marginBottom: 12,
  },
  line: {
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  list: {
    padding: 16,
  },
});
