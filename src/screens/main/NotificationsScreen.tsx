import { useState, useEffect } from "react";
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

interface Notification {
  id: string;
  type: 'like' | 'follow' | 'message' | 'meetup' | 'comment' | 'system';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  userAvatar?: string;
  userName?: string;
  actionData?: any;
}

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from Supabase
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      
      // TODO: Replace with actual Supabase query when notifications table is ready
      // For now, show mock data
      const mockNotifications: Notification[] = [
        {
          id: "1",
          type: "like",
          title: "New Like",
          message: "Sarah liked your meetup 'Coffee & Conversation'",
          timestamp: "2 minutes ago",
          isRead: false,
          userName: "Sarah Johnson",
        },
        {
          id: "2",
          type: "follow",
          title: "New Follower",
          message: "Mike Chen started following you",
          timestamp: "1 hour ago",
          isRead: false,
          userName: "Mike Chen",
        },
        {
          id: "3",
          type: "message",
          title: "New Message",
          message: "You have a new message from Alex",
          timestamp: "3 hours ago",
          isRead: true,
          userName: "Alex Rodriguez",
        },
        {
          id: "4",
          type: "meetup",
          title: "Meetup Invitation",
          message: "You're invited to 'Weekend Hiking' by Emma",
          timestamp: "1 day ago",
          isRead: true,
          userName: "Emma Wilson",
        },
        {
          id: "5",
          type: "comment",
          title: "New Comment",
          message: "Tom commented on your meetup",
          timestamp: "2 days ago",
          isRead: true,
          userName: "Tom Anderson",
        },
        {
          id: "6",
          type: "system",
          title: "Welcome to Evertwine!",
          message: "Your account has been successfully created",
          timestamp: "1 week ago",
          isRead: true,
        },
      ];

      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotifications();
    setIsRefreshing(false);
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: Update notification as read in Supabase
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // TODO: Mark all notifications as read in Supabase
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return 'heart';
      case 'follow':
        return 'person-add';
      case 'message':
        return 'chatbubble';
      case 'meetup':
        return 'calendar';
      case 'comment':
        return 'chatbubble-outline';
      case 'system':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return '#EF4444';
      case 'follow':
        return '#3B82F6';
      case 'message':
        return '#10B981';
      case 'meetup':
        return '#8B5CF6';
      case 'comment':
        return '#F59E0B';
      case 'system':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        { 
          backgroundColor: notification.isRead ? colors.surface : colors.background,
          borderBottomColor: colors.border 
        }
      ]}
      onPress={() => markAsRead(notification.id)}
    >
      <View style={styles.notificationContent}>
        <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(notification.type) }]}>
          <Ionicons 
            name={getNotificationIcon(notification.type)} 
            size={20} 
            color="#FFFFFF" 
          />
        </View>
        
        <View style={styles.notificationText}>
          <Text style={[styles.notificationTitle, { color: colors.text }]}>
            {notification.title}
          </Text>
          <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
            {notification.message}
          </Text>
          <Text style={[styles.notificationTime, { color: colors.textTertiary }]}>
            {notification.timestamp}
          </Text>
        </View>
        
        {!notification.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
        )}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
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

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={[styles.markAllText, { color: colors.primary }]}>
              Mark all read
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-outline" size={64} color={colors.textTertiary} />
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
              refreshing={isRefreshing}
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