import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import MeetupCard from "../../components/MeetupCard";
import {
  getMockMeetups,
  getMockEvents,
  getUserNotifications,
  getMockUsers,
  getActivityFeed,
  getActivityFeedTotal,
} from "../../data/mockData";
import {
  Meetup,
  Event,
  Notification,
  User,
  NotificationType,
} from "../../types";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const { colors } = useThemeStore();
  const { meetups: localMeetups, getUserMeetups } = useMeetupStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "nearby">(
    "live"
  );
  const [activityFeedPage, setActivityFeedPage] = useState(0);
  const [activityFeedData, setActivityFeedData] = useState<any[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);

  const mockMeetups = getMockMeetups();
  const mockEvents = getMockEvents();
  const mockNotifications = getUserNotifications(user?.uid || "user1");
  const currentUser =
    getMockUsers().find((u) => u.uid === user?.uid) || getMockUsers()[0];

  // Combine mock meetups with locally created meetups
  const allMeetups = [...localMeetups, ...mockMeetups];
  const userMeetups = getUserMeetups("current_user");

  // Load initial activity feed data
  useEffect(() => {
    const initialData = getActivityFeed(0, 3); // Load first 3 items
    setActivityFeedData(initialData);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const loadMoreActivityFeed = () => {
    if (loadingMore) return;

    setLoadingMore(true);
    const nextPage = activityFeedPage + 1;
    const newData = getActivityFeed(nextPage, 3);

    setTimeout(() => {
      setActivityFeedData((prev) => [...prev, ...newData]);
      setActivityFeedPage(nextPage);
      setLoadingMore(false);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const formatActivityTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes > 0 ? `${minutes}m ago` : "now";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "meetup_created":
        return "add-circle";
      case "meetup_joined":
        return "people";
      case "meetup_liked":
        return "heart";
      case "profile_viewed":
        return "eye";
      case "friend_added":
        return "person-add";
      default:
        return "notifications";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "meetup_created":
        return colors.primary;
      case "meetup_joined":
        return colors.secondary;
      case "meetup_liked":
        return colors.error;
      case "profile_viewed":
        return colors.textSecondary;
      case "friend_added":
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const renderActivityItem = (activity: any) => (
    <TouchableOpacity
      key={activity.id}
      style={[styles.activityItem, { backgroundColor: colors.surface }]}
      onPress={() => {
        if (activity.meetup) {
          navigation.navigate("MeetupDetails", {
            meetupId: activity.meetup.id,
          });
        } else {
          navigation.navigate("Profile");
        }
      }}
    >
      <View style={styles.activityContent}>
        <Image
          source={{ uri: activity.user.profilePictures[0] }}
          style={styles.activityAvatar}
        />
        <View style={styles.activityInfo}>
          <Text style={[styles.activityUserName, { color: colors.text }]}>
            {activity.user.displayName}
          </Text>
          <Text
            style={[
              styles.activityDescription,
              { color: colors.textSecondary },
            ]}
          >
            {activity.description}
          </Text>
          {activity.meetup && (
            <Text
              style={[styles.activityMeetupTitle, { color: colors.primary }]}
            >
              "{activity.meetup.title}"
            </Text>
          )}
        </View>
        <View style={styles.activityMeta}>
          <Ionicons
            name={getActivityIcon(activity.type)}
            size={16}
            color={getActivityColor(activity.type)}
          />
          <Text style={[styles.activityTime, { color: colors.textTertiary }]}>
            {formatActivityTime(activity.timestamp)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMeetupCard = (meetup: Meetup) => {
    const isUserMeetup = meetup.creatorId === "current_user";

    return (
      <MeetupCard
        key={meetup.id}
        meetup={meetup}
        style={{ backgroundColor: colors.surface }}
        showEditButton={isUserMeetup}
        onPress={() =>
          navigation.navigate("MeetupDetails", { meetupId: meetup.id })
        }
        onEdit={() =>
          navigation.navigate("EditMeetup", { meetupId: meetup.id })
        }
      />
    );
  };

  const renderEventCard = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      style={[styles.eventCard, { backgroundColor: colors.surface }]}
    >
      <Image source={{ uri: event.coverImage }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {event.title}
          </Text>
          <View style={[styles.priceTag, { backgroundColor: colors.primary }]}>
            <Text style={[styles.priceText, { color: colors.onPrimary }]}>
              ${event.price}
            </Text>
          </View>
        </View>

        <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>
          <Ionicons
            name="location-outline"
            size={12}
            color={colors.textSecondary}
          />
          {event.locationName}
        </Text>

        <View style={styles.eventFooter}>
          <View style={styles.eventTime}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.timeText, { color: colors.primary }]}>
              {formatDate(event.startTime)} • {formatTime(event.startTime)}
            </Text>
          </View>
          <View style={styles.eventStats}>
            <Ionicons
              name="people-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              {event.currentAttendees} going
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleNotificationPress = (notification: Notification) => {
    // Navigate based on notification type
    switch (notification.notificationType) {
      case NotificationType.meetupRequest:
      case NotificationType.meetupAccepted:
        // Navigate to meetup details or activity feed for meetup-related notifications
        navigation.navigate("ActivityFeed");
        break;
      case NotificationType.message:
        // Navigate to messages
        navigation.navigate("Messages");
        break;
      case NotificationType.friendRequest:
        // Navigate to profile or friends
        navigation.navigate("Profile");
        break;
      default:
        // Default to activity feed
        navigation.navigate("ActivityFeed");
        break;
    }
  };

  const renderNotificationItem = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[styles.notificationItem, { backgroundColor: colors.surface }]}
      onPress={() => handleNotificationPress(notification)}
    >
      <View style={styles.notificationContent}>
        {/* Profile picture if available */}
        {notification.metadata?.imageUrl && (
          <Image
            source={{ uri: notification.metadata.imageUrl }}
            style={styles.notificationProfilePic}
          />
        )}
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
            {notification.createdAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
      {!notification.isRead && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: currentUser.profilePictures[0] }}
            style={styles.profilePicture}
          />
          <View style={styles.welcomeContainer}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Good morning
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              {currentUser.displayName}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.notificationsButton}
            onPress={() => navigation.navigate("ActivityFeed")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View
          style={[styles.statsContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              12
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Meetups
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              8
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Events
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>
              24
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Connections
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View
          style={[styles.tabContainer, { backgroundColor: colors.surface }]}
        >
          {(["live", "upcoming", "nearby"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && { backgroundColor: colors.primary },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === tab
                        ? colors.onPrimary
                        : colors.textSecondary,
                  },
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content based on active tab */}
        {activeTab === "live" && (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Live Meetups
            </Text>
            {allMeetups.map(renderMeetupCard)}
          </View>
        )}

        {activeTab === "upcoming" && (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Upcoming Events
            </Text>
            {mockEvents.map(renderEventCard)}
          </View>
        )}

        {activeTab === "nearby" && (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Nearby Activities
            </Text>
            {allMeetups.slice(0, 2).map(renderMeetupCard)}
            {mockEvents.slice(0, 1).map(renderEventCard)}
          </View>
        )}

        {/* Recent Notifications */}
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Notifications
          </Text>
          {mockNotifications.length > 0 ? (
            mockNotifications.map(renderNotificationItem)
          ) : (
            <View
              style={[styles.emptyState, { backgroundColor: colors.surface }]}
            >
              <Ionicons
                name="notifications-outline"
                size={48}
                color={colors.textTertiary}
              />
              <Text
                style={[styles.emptyStateText, { color: colors.textTertiary }]}
              >
                No notifications yet
              </Text>
            </View>
          )}
        </View>

        {/* Activity Feed Section */}
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Activity Feed
          </Text>
          {activityFeedData.map(renderActivityItem)}

          {activityFeedData.length < getActivityFeedTotal() && (
            <TouchableOpacity
              style={[
                styles.loadMoreButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={loadMoreActivityFeed}
              disabled={loadingMore}
            >
              <Text style={[styles.loadMoreText, { color: colors.onPrimary }]}>
                {loadingMore ? "Loading..." : "Load More Activity"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  welcomeContainer: {
    flex: 1,
  },
  notificationsButton: {
    padding: 8,
    marginRight: 8,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  eventCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: "100%",
    height: 120,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  priceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  eventLocation: {
    fontSize: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  notificationProfilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 10,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  // Activity Feed Styles
  activityItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
  },
  activityAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityUserName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    marginBottom: 2,
  },
  activityMeetupTitle: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "italic",
  },
  activityMeta: {
    alignItems: "center",
    marginLeft: 8,
  },
  activityTime: {
    fontSize: 11,
    marginTop: 2,
  },
  loadMoreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    padding: 32,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 14,
    marginTop: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  statsText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
