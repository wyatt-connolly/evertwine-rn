import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import { Notification } from "../types";

interface NotificationToastProps {
  notification: Notification | null;
  onPress?: (notification: Notification) => void;
  onDismiss?: () => void;
  visible: boolean;
  duration?: number; // Auto-dismiss duration in milliseconds
}

const { width: screenWidth } = Dimensions.get("window");

export default function NotificationToast({
  notification,
  onPress,
  onDismiss,
  visible,
  duration = 4000,
}: NotificationToastProps) {
  const { colors } = useThemeStore();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible && notification) {
      // Show animation
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after duration
      timeoutRef.current = setTimeout(() => {
        handleDismiss();
      }, duration);
    } else {
      handleDismiss();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [visible, notification, duration]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss?.();
    });
  };

  const handlePress = () => {
    if (notification) {
      onPress?.(notification);
      handleDismiss();
    }
  };

  if (!visible || !notification) {
    return null;
  }

  const getNotificationIcon = (notificationType: string) => {
    switch (notificationType) {
      case "profile_view":
      case "profile_like":
        return "person";
      case "new_follower":
      case "friend_request":
        return "person-add";
      case "message":
        return "chatbubble";
      case "meetup_request":
      case "meetup_accepted":
      case "meetup_reminder":
      case "meetup_starting_soon":
        return "calendar";
      case "post_liked":
      case "meetup_liked":
        return "heart";
      case "post_commented":
      case "comment_reply":
        return "chatbubble-outline";
      case "verification_complete":
      case "new_feature":
        return "information-circle";
      case "happy_hour_invite":
      case "happy_hour_starting_soon":
        return "wine";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (notificationType: string) => {
    switch (notificationType) {
      case "post_liked":
      case "meetup_liked":
        return "#EF4444";
      case "new_follower":
      case "friend_request":
        return "#3B82F6";
      case "message":
        return "#10B981";
      case "meetup_request":
      case "meetup_accepted":
      case "meetup_reminder":
      case "meetup_starting_soon":
        return "#8B5CF6";
      case "post_commented":
      case "comment_reply":
        return "#F59E0B";
      case "verification_complete":
      case "new_feature":
        return "#6B7280";
      case "happy_hour_invite":
      case "happy_hour_starting_soon":
        return "#EC4899";
      default:
        return "#6B7280";
    }
  };

  return (
    <SafeAreaView style={styles.container} pointerEvents="box-none">
      <Animated.View
        style={[
          styles.toast,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            transform: [{ translateY: slideAnim }],
            opacity: opacityAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.toastContent}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <View style={styles.toastLeft}>
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor: getNotificationColor(
                    notification.notificationType
                  ),
                },
              ]}
            >
              <Ionicons
                name={getNotificationIcon(notification.notificationType) as any}
                size={20}
                color="#FFFFFF"
              />
            </View>
            <View style={styles.textContainer}>
              <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={1}
              >
                {notification.title}
              </Text>
              <Text
                style={[styles.message, { color: colors.textSecondary }]}
                numberOfLines={2}
              >
                {notification.message}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={handleDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  toast: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  toastLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
  dismissButton: {
    padding: 4,
    marginLeft: 8,
  },
});
