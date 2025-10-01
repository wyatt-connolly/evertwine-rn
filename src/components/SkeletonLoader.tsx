import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { useThemeStore } from "../hooks/useThemeStore";

const { width } = Dimensions.get("window");

type SkeletonType = "post" | "meetup" | "carousel";

interface SkeletonLoaderProps {
  type?: SkeletonType;
  count?: number;
}

export default function SkeletonLoader({
  type = "post",
  count = 3,
}: SkeletonLoaderProps) {
  const { colors } = useThemeStore();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
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
    ).start();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const SkeletonBox = ({ style }: any) => (
    <Animated.View
      style={[style, { backgroundColor: colors.border, opacity }]}
    />
  );

  const renderPostSkeleton = () => (
    <View style={[styles.postContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.postHeader}>
        <SkeletonBox style={styles.avatar} />
        <View style={styles.postHeaderInfo}>
          <SkeletonBox style={styles.nameBox} />
          <SkeletonBox style={styles.timeBox} />
        </View>
      </View>
      <SkeletonBox style={styles.titleBox} />
      <SkeletonBox style={styles.textBox} />
      <SkeletonBox style={[styles.textBox, { width: "70%" }]} />
      <View style={styles.postActions}>
        <SkeletonBox style={styles.actionBox} />
        <SkeletonBox style={styles.actionBox} />
      </View>
    </View>
  );

  const renderMeetupSkeleton = () => (
    <View style={[styles.meetupContainer, { backgroundColor: colors.surface }]}>
      <SkeletonBox style={styles.meetupImage} />
      <View style={styles.meetupContent}>
        <SkeletonBox style={styles.titleBox} />
        <SkeletonBox style={styles.textBox} />
        <View style={styles.meetupFooter}>
          <SkeletonBox style={styles.smallBox} />
          <SkeletonBox style={styles.smallBox} />
        </View>
      </View>
    </View>
  );

  const renderCarouselSkeleton = () => (
    <View style={styles.carouselContainer}>
      <SkeletonBox style={styles.carouselCard} />
      <SkeletonBox style={styles.carouselCard} />
    </View>
  );

  const renderSkeleton = () => {
    switch (type) {
      case "meetup":
        return renderMeetupSkeleton();
      case "carousel":
        return renderCarouselSkeleton();
      case "post":
      default:
        return renderPostSkeleton();
    }
  };

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index}>{renderSkeleton()}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  postContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
  },
  postHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postHeaderInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 6,
  },
  nameBox: {
    width: "40%",
    height: 16,
    borderRadius: 4,
  },
  timeBox: {
    width: "25%",
    height: 12,
    borderRadius: 4,
  },
  titleBox: {
    width: "80%",
    height: 18,
    borderRadius: 4,
    marginBottom: 8,
  },
  textBox: {
    width: "100%",
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
  },
  postActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionBox: {
    width: 60,
    height: 32,
    borderRadius: 16,
  },
  meetupContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  meetupImage: {
    width: "100%",
    height: 180,
  },
  meetupContent: {
    padding: 16,
    gap: 8,
  },
  meetupFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  smallBox: {
    width: 80,
    height: 20,
    borderRadius: 4,
  },
  carouselContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 16,
  },
  carouselCard: {
    width: width * 0.7,
    height: 240,
    borderRadius: 16,
  },
});
