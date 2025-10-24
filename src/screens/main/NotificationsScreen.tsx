import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { Notification, NotificationType } from "../../types";

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();

  // Simple local state - no complex store
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load notifications function
  const loadNotifications = async () => {
    if (!user?.uid) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await SupabaseDataService.getNotifications(user.uid);
      setNotifications(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load notifications"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Simple useEffect - no complex dependencies
  useEffect(() => {
    if (user?.uid) {
      loadNotifications();
    }
  }, [user?.uid]);

  const handleRefresh = async () => {
    await loadNotifications();
  };

  const handleNotificationPress = async (notification: Notification) => {
    try {
      await SupabaseDataService.markNotificationAsRead(notification.id);
      // Update local state
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, isRead: true, readAt: new Date() }
            : n
        )
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const getNotificationIcon = (notificationType: NotificationType) => {
    switch (notificationType) {
      case NotificationType.meetupRequest:
      case NotificationType.meetupAccepted:
        return "calendar-outline";
      case NotificationType.newFollower:
      case NotificationType.friendRequest:
        return "person-add-outline";
      case NotificationType.message:
        return "chatbubble-outline";
      case NotificationType.postLiked:
      case NotificationType.meetupLiked:
        return "heart-outline";
      case NotificationType.postCommented:
      case NotificationType.meetupCommented:
        return "chatbubbles-outline";
      default:
        return "notifications-outline";
    }
  };

  const getNotificationColor = (notificationType: NotificationType) => {
    switch (notificationType) {
      case NotificationType.meetupRequest:
      case NotificationType.meetupAccepted:
        return colors.primary;
      case NotificationType.newFollower:
      case NotificationType.friendRequest:
        return colors.success;
      case NotificationType.message:
        return colors.info;
      case NotificationType.postLiked:
      case NotificationType.meetupLiked:
        return colors.error;
      case NotificationType.postCommented:
      case NotificationType.meetupCommented:
        return colors.warning;
      default:
        return colors.text;
    }
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        {
          backgroundColor: notification.isRead
            ? colors.surface
            : colors.primary + "10",
          borderLeftColor: notification.isRead ? "transparent" : colors.primary,
        },
      ]}
      onPress={() => handleNotificationPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Ionicons
            name={getNotificationIcon(notification.notificationType)}
            size={20}
            color={getNotificationColor(notification.notificationType)}
            style={styles.notificationIcon}
          />
          <Text style={[styles.notificationTitle, { color: colors.text }]}>
            {notification.title}
          </Text>
        </View>

        <Text
          style={[styles.notificationMessage, { color: colors.textSecondary }]}
        >
          {notification.message}
        </Text>

        <Text
          style={[styles.notificationTime, { color: colors.textSecondary }]}
        >
          {new Date(notification.createdAt).toLocaleDateString()} at{" "}
          {new Date(notification.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={colors.error}
          />
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Error Loading Notifications
          </Text>
          <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
            {error}
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={loadNotifications}
          >
            <Text style={[styles.retryButtonText, { color: colors.surface }]}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Notifications
        </Text>
        <View style={styles.headerRight} />
      </View>

      {isLoading && notifications.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading notifications...
          </Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-outline"
            size={64}
            color={colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Notifications
          </Text>
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
            You'll see notifications from other users here when they interact
            with your content.
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {notifications.map(renderNotification)}
        </ScrollView>
      )}
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    borderLeftWidth: 4,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
