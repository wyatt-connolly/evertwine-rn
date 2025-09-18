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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import MeetupCard from "../../components/MeetupCard";
import EventCard from "../../components/EventCard";
import {
  getMockMeetups,
  getMockEvents,
  getUserNotifications,
  getMockUsers,
  getActivityFeed,
  getActivityFeedTotal,
} from "../../data/mockData";
import { DataService } from "../../services/DataService";
import InviteSnackbar from "../../components/InviteSnackbar";
import ShareButton from "../../components/ShareButton";
import LoadingIndicator from "../../components/LoadingIndicator";
import { safeUserMerge } from "../../utils/firebaseDataConverter";
import { safeGet, safeArrayGet, createSafeUser } from "../../utils/safeAccess";
import { testComponentData, testFirebaseData } from "../../utils/devTesting";
import {
  EmptyMeetupsState,
  EmptyEventsState,
  EmptyActivityState,
  LoadingState,
} from "../../components/EmptyStates";
import {
  Meetup,
  Event,
  Notification,
  User,
  NotificationType,
} from "../../types";

const { width } = Dimensions.get("window");

// Helper function to get time-based greeting
const getTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  } else if (hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};

export default function HomeScreen() {
  const navigation = useNavigation();
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
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [showInviteSnackbar, setShowInviteSnackbar] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Use DataService to get data (will use Firebase or mock data based on mode)
  const [mockMeetups, setMockMeetups] = useState<Meetup[]>([]);
  const [mockEvents, setMockEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Combine mock meetups with locally created meetups
  const allMeetups = [...localMeetups, ...mockMeetups];
  const userMeetups = getUserMeetups("current_user");

  // Load initial data using DataService
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load meetups using DataService
        const meetupsResult = await DataService.getMeetups();
        if (meetupsResult.meetups) {
          setMockMeetups(meetupsResult.meetups);
        }

        // Load activity feed using DataService
        const activityResult = await DataService.getActivityFeed(0, 3);
        if (activityResult.activities) {
          setActivityFeedData(activityResult.activities);
        }

        // Load notifications using DataService
        const notificationsResult = await DataService.getNotifications(
          user?.uid || ""
        );
        if (notificationsResult.notifications) {
          setNotifications(notificationsResult.notifications);
        }

        // Load user data using DataService
        if (user?.uid) {
          const userResult = await DataService.getUser(user.uid);
          if (userResult.user) {
            // Test the user data in development
            if (__DEV__) {
              testFirebaseData(userResult.user, "user");
            }
            setCurrentUser(userResult.user);
          } else if (DataService.isInDeveloperMode()) {
            // Fallback to mock user in developer mode
            const mockUser =
              getMockUsers().find((u) => u.uid === user.uid) ||
              getMockUsers()[0];
            if (__DEV__) {
              testComponentData("HomeScreen", { user: mockUser });
            }
            setCurrentUser(mockUser);
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        // In developer mode, fallback to mock data if DataService fails
        if (DataService.isInDeveloperMode()) {
          setMockMeetups(getMockMeetups());
          setMockEvents(getMockEvents());
          setActivityFeedData(getActivityFeed(0, 3));
        }
        // In Firebase mode, keep empty arrays to show empty states - NEVER use mock data
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadData();
  }, [user?.uid]);

  // Recent activity timer - add new activity every 3 seconds (only in developer mode)
  useEffect(() => {
    if (!DataService.isInDeveloperMode()) {
      return; // Don't add mock activity in Firebase mode
    }

    const interval = setInterval(() => {
      const allActivity = getActivityFeed(0, 50); // Get more data to choose from
      const randomActivity =
        allActivity[Math.floor(Math.random() * allActivity.length)];

      if (randomActivity) {
        setRecentActivity((prev) => {
          const newActivity = {
            ...randomActivity,
            id: `recent_${Date.now()}`,
            timestamp: new Date(),
          };
          // Keep only last 5 activities
          return [newActivity, ...prev.slice(0, 4)];
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Show invite snackbar after user has been active for a while
  useEffect(() => {
    const timer = setTimeout(() => {
      if (recentActivity.length > 2) {
        setShowInviteSnackbar(true);
      }
    }, 10000); // Show after 10 seconds

    return () => clearTimeout(timer);
  }, [recentActivity]);

  const onRefresh = async () => {
    setRefreshing(true);

    try {
      // Use DataService to refresh data
      const meetupsResult = await DataService.getMeetups();
      if (meetupsResult.meetups) {
        setMockMeetups(meetupsResult.meetups);
      }

      const activityResult = await DataService.getActivityFeed(0, 3);
      if (activityResult.activities) {
        setActivityFeedData(activityResult.activities);
        setActivityFeedPage(0);
      }

      // Add a new random activity to show refresh worked
      // Only add mock activity in developer mode
      if (DataService.isInDeveloperMode()) {
        const allActivity = getActivityFeed(0, 50);
        const randomActivity =
          allActivity[Math.floor(Math.random() * allActivity.length)];

        if (randomActivity) {
          setRecentActivity((prev) => {
            const newActivity = {
              ...randomActivity,
              id: `refresh_${Date.now()}`,
              timestamp: new Date(),
            };
            return [newActivity, ...prev.slice(0, 4)];
          });
        }
      }
    } catch (error) {
      console.error("Refresh error:", error);
      // Fallback to mock data if DataService fails
      const freshActivityData = getActivityFeed(0, 3);
      setActivityFeedData(freshActivityData);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMoreActivityFeed = async () => {
    if (loadingMore) return;

    setLoadingMore(true);

    try {
      // Use DataService to load more activity
      const nextPage = activityFeedPage + 1;
      const activityResult = await DataService.getActivityFeed(nextPage, 3);

      if (activityResult.activities) {
        setActivityFeedData((prev) => [...prev, ...activityResult.activities]);
        setActivityFeedPage(nextPage);
      }

      // Add new activities to recent activity
      const allActivity = getActivityFeed(0, 50);
      const newActivities: any[] = [];

      for (let i = 0; i < 2; i++) {
        const randomActivity =
          allActivity[Math.floor(Math.random() * allActivity.length)];
        if (randomActivity) {
          newActivities.push({
            ...randomActivity,
            id: `load_more_${Date.now()}_${i}`,
            timestamp: new Date(),
          });
        }
      }

      setRecentActivity((prev) => [...prev, ...newActivities]);
    } catch (error) {
      console.error("Load more error:", error);
      // Fallback to mock data if DataService fails
      const nextPage = activityFeedPage + 1;
      const newData = getActivityFeed(nextPage, 3);
      setActivityFeedData((prev) => [...prev, ...newData]);
      setActivityFeedPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
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

  const handleInviteFriends = () => {
    setShowInviteSnackbar(false);
    // This would normally open a share dialog or invite flow
    console.log("Opening invite friends flow");
  };

  const handleDismissInvite = () => {
    setShowInviteSnackbar(false);
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

  const renderActivityItem = (activity: any) => {
    // Safety checks for activity data
    if (!activity || !activity.user) {
      return null;
    }

    const safeActivity = {
      ...activity,
      user: {
        ...activity.user,
        profilePictures: activity.user.profilePictures || [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        ],
        standoutPhotoIndex:
          activity.user.standoutPhotoIndex !== undefined
            ? activity.user.standoutPhotoIndex
            : 0,
        displayName: activity.user.displayName || "User",
      },
      description: activity.description || "No description",
      timestamp: activity.timestamp || new Date(),
    };

    return (
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
            source={{
              uri: safeActivity.user.profilePictures[
                safeActivity.user.standoutPhotoIndex
              ],
            }}
            style={styles.activityAvatar}
          />
          <View style={styles.activityInfo}>
            <Text style={[styles.activityUserName, { color: colors.text }]}>
              {safeActivity.user.displayName}
            </Text>
            <Text
              style={[
                styles.activityDescription,
                { color: colors.textSecondary },
              ]}
            >
              {safeActivity.description}
            </Text>
            {activity.meetup && (
              <Text
                style={[styles.activityMeetupTitle, { color: colors.primary }]}
              >
                "{activity.meetup.title || "Meetup"}"
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
              {formatActivityTime(safeActivity.timestamp)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderRecentActivityItem = (activity: any, index: number) => {
    // Safety checks for activity data
    if (!activity || !activity.user) {
      return null;
    }

    const safeActivity = {
      ...activity,
      user: {
        ...activity.user,
        profilePictures: activity.user.profilePictures || [
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        ],
        standoutPhotoIndex:
          activity.user.standoutPhotoIndex !== undefined
            ? activity.user.standoutPhotoIndex
            : 0,
        displayName: activity.user.displayName || "User",
      },
      description: activity.description || "No description",
      timestamp: activity.timestamp || new Date(),
    };

    return (
      <TouchableOpacity
        key={activity.id}
        style={[styles.recentActivityItem, { backgroundColor: colors.surface }]}
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
        <View style={styles.recentActivityContent}>
          <Image
            source={{
              uri: safeActivity.user.profilePictures[
                safeActivity.user.standoutPhotoIndex
              ],
            }}
            style={styles.recentActivityAvatar}
          />
          <View style={styles.recentActivityInfo}>
            <Text
              style={[styles.recentActivityUserName, { color: colors.text }]}
            >
              {safeActivity.user.displayName}
            </Text>
            <Text
              style={[
                styles.recentActivityDescription,
                { color: colors.textSecondary },
              ]}
            >
              {safeActivity.description}
            </Text>
            {activity.meetup && (
              <Text
                style={[
                  styles.recentActivityMeetupTitle,
                  { color: colors.primary },
                ]}
              >
                "{activity.meetup.title || "Meetup"}"
              </Text>
            )}
          </View>
          <View style={styles.recentActivityMeta}>
            <Ionicons
              name={getActivityIcon(activity.type)}
              size={20}
              color={getActivityColor(activity.type)}
            />
            <Text
              style={[
                styles.recentActivityTime,
                { color: colors.textTertiary },
              ]}
            >
              {formatActivityTime(safeActivity.timestamp)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
    <EventCard
      key={event.id}
      event={event}
      style={{ backgroundColor: colors.surface }}
      onPress={() => {
        navigation.navigate("EventDetails", { eventId: event.id, event });
      }}
    />
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
      edges={["top"]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: safeArrayGet(
                currentUser?.profilePictures,
                currentUser?.standoutPhotoIndex || 0,
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
              ),
            }}
            style={styles.profilePicture}
          />
          <View style={styles.welcomeContainer}>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              {getTimeBasedGreeting()}
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              {currentUser?.displayName || "User"}
            </Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <ShareButton type="app" variant="icon" style={styles.shareButton} />
          <TouchableOpacity
            style={styles.mapButton}
            onPress={() => navigation.navigate("Map")}
          >
            <Ionicons name="map-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.notificationsButton}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.primary}
            />
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: colors.error },
                ]}
              >
                <Text
                  style={[
                    styles.notificationBadgeText,
                    { color: colors.onPrimary },
                  ]}
                >
                  {notifications.filter((n) => !n.isRead).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
            title="Pull to refresh"
            titleColor={colors.textSecondary}
          />
        }
      >
        {/* Quick Stats - Only show in developer mode or with real data */}
        {DataService.isInDeveloperMode() && (
          <View
            style={[styles.statsContainer, { backgroundColor: colors.surface }]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {mockMeetups.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Meetups
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {mockEvents.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Events
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {
                  notifications.filter(
                    (n) => n.notificationType === "friendRequest"
                  ).length
                }
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Connections
              </Text>
            </View>
          </View>
        )}

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
        {isInitialLoading || !currentUser ? (
          <LoadingState style={{ margin: 20 }} />
        ) : (
          <>
            {activeTab === "live" && (
              <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Live Meetups
                </Text>
                {allMeetups.length > 0 ? (
                  allMeetups.map(renderMeetupCard)
                ) : (
                  <EmptyMeetupsState
                    onActionPress={() => navigation.navigate("Create")}
                  />
                )}
              </View>
            )}

            {activeTab === "upcoming" && (
              <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Upcoming Events
                </Text>
                {mockEvents.length > 0 ? (
                  mockEvents.map(renderEventCard)
                ) : (
                  <EmptyEventsState
                    onActionPress={() => navigation.navigate("Explore")}
                  />
                )}
              </View>
            )}

            {activeTab === "nearby" && (
              <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Nearby Activities
                </Text>
                {allMeetups.length > 0 || mockEvents.length > 0 ? (
                  <>
                    {allMeetups.slice(0, 2).map(renderMeetupCard)}
                    {mockEvents.slice(0, 1).map(renderEventCard)}
                  </>
                ) : (
                  <EmptyMeetupsState
                    onActionPress={() => navigation.navigate("Create")}
                  />
                )}
              </View>
            )}
          </>
        )}

        {/* Recent Activity Section */}
        {!isInitialLoading && currentUser && (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Activity
            </Text>
            {recentActivity.length > 0 ? (
              <>
                {recentActivity.map(renderRecentActivityItem)}

                {/* Load More Button */}
                <TouchableOpacity
                  style={[
                    styles.loadMoreButton,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={loadMoreActivityFeed}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <LoadingIndicator size="small" color={colors.primary} />
                      <Text
                        style={[
                          styles.loadMoreText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Loading more...
                      </Text>
                    </>
                  ) : (
                    <>
                      <Ionicons
                        name="chevron-down"
                        size={16}
                        color={colors.primary}
                      />
                      <Text
                        style={[styles.loadMoreText, { color: colors.primary }]}
                      >
                        Load More Activity
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <EmptyActivityState
                onActionPress={() => navigation.navigate("Explore")}
              />
            )}
          </View>
        )}
      </ScrollView>

      <InviteSnackbar
        visible={showInviteSnackbar}
        onDismiss={handleDismissInvite}
        onInvite={handleInviteFriends}
        message="Loving the activity? Invite friends to join the fun!"
        type="invite"
      />
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
    paddingVertical: 20,
    borderBottomWidth: 1,
    paddingTop: 50,
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
  shareButton: {
    marginRight: 8,
  },
  mapButton: {
    padding: 8,
    marginRight: 8,
  },
  notificationsButton: {
    padding: 8,
    marginRight: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
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
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    letterSpacing: 0.5,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "transparent",
    gap: 8,
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
  // Recent Activity Styles
  recentActivityItem: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  recentActivityContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 20,
  },
  recentActivityAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  recentActivityInfo: {
    flex: 1,
  },
  recentActivityUserName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  recentActivityDescription: {
    fontSize: 14,
    marginBottom: 4,
    lineHeight: 20,
  },
  recentActivityMeetupTitle: {
    fontSize: 13,
    fontWeight: "500",
    fontStyle: "italic",
  },
  recentActivityMeta: {
    alignItems: "center",
    marginLeft: 12,
  },
  recentActivityTime: {
    fontSize: 12,
    marginTop: 4,
  },
});
