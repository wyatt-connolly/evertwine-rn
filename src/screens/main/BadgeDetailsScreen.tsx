import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Badge } from "../../types";

const { width, height } = Dimensions.get("window");

interface BadgeDetailsScreenProps {
  route: {
    params: {
      badge: Badge;
    };
  };
  navigation: any;
}

export default function BadgeDetailsScreen({
  route,
  navigation,
}: BadgeDetailsScreenProps) {
  const { colors } = useThemeStore();
  const { badge } = route.params;

  // Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const glowValue = useRef(new Animated.Value(0)).current;
  const floatValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start all animations
    startAnimations();
  }, []);

  const startAnimations = () => {
    // Spinning animation (continuous)
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Scale animation (bounce in)
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();

    // Glow animation (pulsing)
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowValue, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    ).start();

    // Floating animation (up and down)
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatValue, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "#4CAF50"; // Green
      case "rare":
        return "#2196F3"; // Blue
      case "epic":
        return "#9C27B0"; // Purple
      case "legendary":
        return "#FF9800"; // Orange
      default:
        return colors.primary;
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case "common":
        return ["#4CAF50", "#8BC34A"];
      case "rare":
        return ["#2196F3", "#03A9F4"];
      case "epic":
        return ["#9C27B0", "#E91E63"];
      case "legendary":
        return ["#FF9800", "#FFC107"];
      default:
        return [colors.primary, colors.secondary];
    }
  };

  // Transform values for animations
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const float = floatValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const glowOpacity = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  const glowScale = glowValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.2],
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Badge Details
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Badge Display Area */}
      <View style={styles.badgeContainer}>
        {/* Glow Effect */}
        <Animated.View
          style={[
            styles.glowEffect,
            {
              backgroundColor: getBadgeColor(badge.rarity),
              opacity: glowOpacity,
              transform: [{ scale: glowScale }, { translateY: float }],
            },
          ]}
        />

        {/* Main Badge */}
        <Animated.View
          style={[
            styles.badgeWrapper,
            {
              transform: [
                { rotateY: spin },
                { scale: scaleValue },
                { translateY: float },
              ],
            },
          ]}
        >
          <View
            style={[
              styles.badgeIcon,
              {
                backgroundColor: getBadgeColor(badge.rarity) + "20",
                borderColor: getBadgeColor(badge.rarity),
                shadowColor: getBadgeColor(badge.rarity),
              },
            ]}
          >
            <Text style={styles.badgeEmoji}>{badge.icon}</Text>
          </View>
        </Animated.View>

        {/* Badge Info */}
        <Animated.View
          style={[
            styles.badgeInfo,
            {
              transform: [{ translateY: float }],
            },
          ]}
        >
          <Text style={[styles.badgeName, { color: colors.text }]}>
            {badge.name}
          </Text>
          <Text
            style={[styles.badgeRarity, { color: getBadgeColor(badge.rarity) }]}
          >
            {badge.rarity.toUpperCase()} BADGE
          </Text>
          <Text
            style={[styles.badgeDescription, { color: colors.textSecondary }]}
          >
            {badge.description}
          </Text>
        </Animated.View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
          <Ionicons
            name="calendar-outline"
            size={24}
            color={getBadgeColor(badge.rarity)}
          />
          <View style={styles.statContent}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Unlocked On
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {badge.unlockedAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>
        </View>

        <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
          <Ionicons
            name="trophy-outline"
            size={24}
            color={getBadgeColor(badge.rarity)}
          />
          <View style={styles.statContent}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Category
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {badge.category.charAt(0).toUpperCase() + badge.category.slice(1)}
            </Text>
          </View>
        </View>

        <View style={[styles.statItem, { backgroundColor: colors.surface }]}>
          <Ionicons
            name="star-outline"
            size={24}
            color={getBadgeColor(badge.rarity)}
          />
          <View style={styles.statContent}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Rarity
            </Text>
            <Text
              style={[styles.statValue, { color: getBadgeColor(badge.rarity) }]}
            >
              {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[
            styles.shareButton,
            { backgroundColor: getBadgeColor(badge.rarity) },
          ]}
        >
          <Ionicons name="share-outline" size={20} color="white" />
          <Text style={styles.shareButtonText}>Share Achievement</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  badgeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  glowEffect: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.3,
  },
  badgeWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  badgeIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  badgeEmoji: {
    fontSize: 48,
  },
  badgeInfo: {
    alignItems: "center",
    marginTop: 40,
  },
  badgeName: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  badgeRarity: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 16,
  },
  badgeDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  statContent: {
    marginLeft: 16,
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  shareButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
