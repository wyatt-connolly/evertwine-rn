import { useEffect } from "react";
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
import { useNotificationStore } from "../../hooks/useNotificationStore";
import { Notification, NotificationType } from "../../types";

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadNotifications,
    refreshNotifications,
    markAsRead,
    markAllAsRead,
    clearError,
    startSubscription,
    stopSubscription,
  } = useNotificationStore();

  // Load notifications on mount and start subscription
  useEffect(() => {
    if (user?.uid) {
      loadNotifications();
      startSubscription();
    } else {
      stopSubscription();
    }

    // Cleanup subscription on unmount
    return () => {
      stopSubscription();
    };
  }, [user?.uid]);

  const handleRefresh = async () => {
    await refreshNotifications();
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    // Navigate to notification context
    if (notification.metadata?.deepLink) {
      // Handle deep linking
      console.log("Navigate to:", notification.metadata.deepLink);
      // TODO: Implement navigation based on deep link
    }
  };

  const getNotificationIcon = (notificationType: NotificationType) => {
    switch (notificationType) {
      case NotificationType.profileView:
      case NotificationType.profileLike:
        return "person";
      case NotificationType.newFollower:
      case NotificationType.friendRequest:
        return "person-add";
      case NotificationType.message:
        return "chatbubble";
      case NotificationType.meetupRequest:
      case NotificationType.meetupAccepted:
      case NotificationType.meetupDeclined:
      case NotificationType.meetupReminder:
      case NotificationType.meetupStartingSoon:
      case NotificationType.meetupCancelled:
        return "calendar";
      case NotificationType.postLiked:
      case NotificationType.meetupLiked:
        return "heart";
      case NotificationType.postCommented:
      case NotificationType.commentReply:
      case NotificationType.commentLiked:
        return "chatbubble-outline";
      case NotificationType.verificationComplete:
      case NotificationType.newFeature:
        return "information-circle";
      case NotificationType.happyHourInvite:
      case NotificationType.happyHourStartingSoon:
        return "wine";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (notificationType: NotificationType) => {
    switch (notificationType) {
      case NotificationType.postLiked:
      case NotificationType.meetupLiked:
        return "#EF4444";
      case NotificationType.newFollower:
      case NotificationType.friendRequest:
        return "#3B82F6";
      case NotificationType.message:
        return "#10B981";
      case NotificationType.meetupRequest:
      case NotificationType.meetupAccepted:
      case NotificationType.meetupReminder:
      case NotificationType.meetupStartingSoon:
        return "#8B5CF6";
      case NotificationType.postCommented:
      case NotificationType.commentReply:
      case NotificationType.commentLiked:
        return "#F59E0B";
      case NotificationType.verificationComplete:
      case NotificationType.newFeature:
        return "#6B7280";
      case NotificationType.happyHourInvite:
      case NotificationType.happyHourStartingSoon:
        return "#EC4899";
      default:
        return "#6B7280";
    }
  };

  const formatTimestamp = (createdAt: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return createdAt.toLocaleDateString();
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        {
          backgroundColor: notification.isRead
            ? colors.surface
            : colors.background,
          borderBottomColor: colors.border,
        },
      ]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationContent}>
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

        <View style={styles.notificationText}>
          <Text style={[styles.notificationTitle, { color: colors.text }]}>
            {notification.title}
          </Text>
          <Text
            style={[
              styles.notificationMessage,
              { color: colors.textSecondary },
            ]}
          >
            {notification.message}
          </Text>
          <Text
            style={[styles.notificationTime, { color: colors.textTertiary }]}
          >
            {formatTimestamp(notification.createdAt)}
          </Text>
        </View>

        {!notification.isRead && (
          <View
            style={[styles.unreadDot, { backgroundColor: colors.primary }]}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            Notifications
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading notifications...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Clear any errors when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={markAllAsRead}
            style={styles.markAllButton}
          >
            <Text style={[styles.markAllText, { color: colors.primary }]}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-outline"
            size={64}
            color={colors.textTertiary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No notifications yet
          </Text>
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
            When you get likes, follows, or messages, they'll appear here
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  markAllButton: {
    padding: 4,
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
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
  notificationItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  notificationContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
});
