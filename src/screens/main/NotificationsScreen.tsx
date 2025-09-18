import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Notification, NotificationType } from "../../types";
import { DataService } from "../../services/DataService";
import { useAuthStore } from "../../hooks/useAuthStore";

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.uid) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const { notifications: fetchedNotifications, error: fetchError } =
          await DataService.getNotifications(user.uid);

        if (fetchError) {
          setError(fetchError);
        } else {
          setNotifications(fetchedNotifications);
        }
      } catch (err) {
        setError("Failed to load notifications");
        console.error("Error loading notifications:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [user?.uid]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.meetupReminder:
        return "time-outline";
      case NotificationType.message:
        return "chatbubble-outline";
      case NotificationType.meetupAccepted:
        return "people-outline";
      case NotificationType.friendRequest:
        return "person-add-outline";
      case NotificationType.meetupCancelled:
        return "close-circle-outline";
      case NotificationType.meetupRequest:
        return "calendar-outline";
      default:
        return "notifications-outline";
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.meetupReminder:
        return colors.warning;
      case NotificationType.message:
        return colors.primary;
      case NotificationType.meetupAccepted:
        return colors.success;
      case NotificationType.friendRequest:
        return colors.secondary;
      case NotificationType.meetupCancelled:
        return colors.error;
      case NotificationType.meetupRequest:
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (hours > 24) {
      return date.toLocaleDateString();
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return "Just now";
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    markAsRead(notification.id);

    // Navigate based on notification type
    if (notification.meetupRef) {
      navigation.navigate("MeetupDetails", {
        meetupId: notification.meetupRef,
      });
    } else if (notification.senderRef) {
      navigation.navigate("UserProfile", { userId: notification.senderRef });
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Notifications
          </Text>
        </View>
        <View style={styles.rightContainer}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllAsRead}>
              <Text style={[styles.markAllText, { color: colors.primary }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <Ionicons name="hourglass-outline" size={48} color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading notifications...
          </Text>
        </View>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <View style={styles.errorContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={48}
            color={colors.error}
          />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Failed to load notifications
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
            {error}
          </Text>
        </View>
      )}

      {/* Notifications List */}
      {!isLoading && !error && (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="notifications-off-outline"
                size={64}
                color={colors.textTertiary}
              />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                No Notifications
              </Text>
              <Text
                style={[styles.emptySubtitle, { color: colors.textSecondary }]}
              >
                You're all caught up! New notifications will appear here.
              </Text>
            </View>
          ) : (
            <View style={styles.notificationsList}>
              {notifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={[
                    styles.notificationItem,
                    {
                      backgroundColor: notification.isRead
                        ? colors.surface
                        : colors.primary + "10",
                      borderLeftColor: getNotificationColor(
                        notification.notificationType
                      ),
                    },
                  ]}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <View style={styles.notificationContent}>
                    <View
                      style={[
                        styles.iconContainer,
                        {
                          backgroundColor:
                            getNotificationColor(
                              notification.notificationType
                            ) + "20",
                        },
                      ]}
                    >
                      <Ionicons
                        name={getNotificationIcon(
                          notification.notificationType
                        )}
                        size={20}
                        color={getNotificationColor(
                          notification.notificationType
                        )}
                      />
                    </View>

                    <View style={styles.textContent}>
                      <View style={styles.titleRow}>
                        <Text
                          style={[
                            styles.notificationTitle,
                            {
                              color: colors.text,
                              fontWeight: notification.isRead ? "400" : "600",
                            },
                          ]}
                        >
                          {notification.title}
                        </Text>
                        {!notification.isRead && (
                          <View
                            style={[
                              styles.unreadDot,
                              { backgroundColor: colors.primary },
                            ]}
                          />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.notificationMessage,
                          { color: colors.textSecondary },
                        ]}
                        numberOfLines={2}
                      >
                        {notification.message}
                      </Text>
                      <Text
                        style={[
                          styles.notificationTime,
                          { color: colors.textTertiary },
                        ]}
                      >
                        {formatTime(notification.createdAt)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  rightContainer: {
    width: 80,
    alignItems: "flex-end",
  },
  markAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: "row",
    padding: 16,
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
