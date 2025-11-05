import React, { useEffect, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, Platform, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeStore } from "../hooks/useThemeStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { colors, isDarkMode } = useThemeStore();
  const insets = useSafeAreaInsets();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(100)).current;
  const scaleAnims = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;
  
  // Tab indicator animation
  const indicatorPosition = useRef(new Animated.Value(state.index)).current;
  const tabWidth = (SCREEN_WIDTH - 24 - 16) / state.routes.length; // Screen width minus margins and padding divided by tabs

  // Fade-in and slide-up animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Animate indicator position when tab changes
  useEffect(() => {
    Animated.spring(indicatorPosition, {
      toValue: state.index,
      tension: 68,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [state.index]);

  const handlePressIn = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 0.9,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = (index: number) => {
    Animated.spring(scaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const TabBarContent = () => {
    // Calculate the actual tab width based on content container
    const contentWidth = SCREEN_WIDTH - 24 - 16; // Screen width minus container margins and padding
    const actualTabWidth = contentWidth / state.routes.length;
    
    const translateX = indicatorPosition.interpolate({
      inputRange: state.routes.map((_, i) => i),
      outputRange: state.routes.map((_, i) => i * actualTabWidth + (actualTabWidth - 40) / 2),
    });

    return (
      <View style={styles.content}>
        {/* Animated indicator background */}
        <Animated.View
          style={[
            styles.indicator,
            {
              transform: [{ translateX }],
            },
          ]}
        />
        
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <Animated.View
              key={route.key}
              style={[
                styles.tabWrapper,
                {
                  transform: [{ scale: scaleAnims[index] }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.tab}
                onPress={onPress}
                onLongPress={onLongPress}
                onPressIn={() => handlePressIn(index)}
                onPressOut={() => handlePressOut(index)}
                activeOpacity={0.8}
              >
                {options.tabBarIcon &&
                  options.tabBarIcon({
                    focused: isFocused,
                    color: isFocused 
                      ? (isDarkMode ? "#FFFFFF" : colors.primary)
                      : (isDarkMode ? "rgba(255, 255, 255, 0.6)" : colors.textTertiary),
                    size: 24,
                  })}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          marginBottom: Math.max(insets.bottom, 16),
        },
      ]}
    >
      <BlurView
        intensity={30}
        tint={isDarkMode ? "dark" : "light"}
        style={styles.blurContainer}
      >
        <View style={styles.glassContainer}>
          <TabBarContent />
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 70,
    zIndex: 1000,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  glassContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 24,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  tabWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  indicator: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#007AFF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
});
