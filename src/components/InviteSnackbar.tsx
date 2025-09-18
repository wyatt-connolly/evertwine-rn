import React, { useEffect, useRef } from "react";
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

interface InviteSnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  onInvite: () => void;
  message?: string;
  actionText?: string;
  type?: "invite" | "share" | "connect";
}

export default function InviteSnackbar({
  visible,
  onDismiss,
  onInvite,
  message,
  actionText = "Invite Friends",
  type = "invite",
}: InviteSnackbarProps) {
  const { colors } = useThemeStore();
  const translateY = useRef(new Animated.Value(100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        onDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getIcon = () => {
    switch (type) {
      case "share":
        return "share-outline";
      case "connect":
        return "people-outline";
      default:
        return "person-add-outline";
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case "share":
        return "Share this with your friends!";
      case "connect":
        return "Connect with more people like you";
      default:
        return "Invite friends to join you on Evertwine!";
    }
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={getIcon() as any} size={24} color={colors.primary} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.message, { color: colors.text }]}>
            {message || getDefaultMessage()}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={onInvite}
        >
          <Text style={[styles.actionButtonText, { color: colors.onPrimary }]}>
            {actionText}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
          <Ionicons name="close" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  dismissButton: {
    padding: 4,
  },
});
