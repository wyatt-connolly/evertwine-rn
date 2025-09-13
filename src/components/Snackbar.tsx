import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";

const { width } = Dimensions.get("window");

interface SnackbarProps {
  visible: boolean;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss: () => void;
  type?: "success" | "error" | "info";
  duration?: number;
}

export default function Snackbar({
  visible,
  message,
  actionText,
  onAction,
  onDismiss,
  type = "success",
  duration = 3000,
}: SnackbarProps) {
  const { colors } = useThemeStore();
  const translateY = new Animated.Value(100);

  useEffect(() => {
    if (visible) {
      // Show snackbar
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      // Auto dismiss after duration
      const timer = setTimeout(() => {
        hideSnackbar();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideSnackbar();
    }
  }, [visible]);

  const hideSnackbar = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onDismiss();
    });
  };

  const getIconName = () => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "error":
        return "close-circle";
      case "info":
        return "information-circle";
      default:
        return "checkmark-circle";
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return colors.primary;
      case "error":
        return colors.error;
      case "info":
        return colors.secondary;
      default:
        return colors.primary;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.messageContainer}>
          <Ionicons
            name={getIconName()}
            size={20}
            color={colors.onPrimary}
            style={styles.icon}
          />
          <Text style={[styles.message, { color: colors.onPrimary }]}>
            {message}
          </Text>
        </View>

        {actionText && onAction && (
          <TouchableOpacity onPress={onAction} style={styles.actionButton}>
            <Text style={[styles.actionText, { color: colors.onPrimary }]}>
              {actionText}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={hideSnackbar} style={styles.dismissButton}>
          <Ionicons name="close" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 34, // Account for safe area
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});
