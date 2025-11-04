import { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { DataService } from "../../services/DataService";
import LoadingIndicator from "../../components/LoadingIndicator";
import EnhancedPostCard from "../../components/EnhancedPostCard";
import EnhancedMeetupCard from "../../components/EnhancedMeetupCard";
import { User, Post, Meetup, ActivityItem } from "../../types";
import {
  getMockFollowingUsers,
  getFollowingActivity,
} from "../../data/mockData";

type FilterType = "all" | "posts" | "meetups" | "activity";

type FeedItem = {
  id: string;
  type: "post" | "meetup" | "activity_item" | "user_header";
  userId?: string;
  user?: User;
  data?: Post | Meetup | ActivityItem;
  timestamp: Date;
};

export default function FollowingScreen() {
  const navigation = useNavigation<any>();
  const { colors, isDarkMode } = useThemeStore();
  const { user: currentUser, isLoading: isInitialLoading } = useAuthStore();

  // State
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [followingSet, setFollowingSet] = useState<Set<string>>(new Set());
  const [activityData, setActivityData] = useState<{
    posts: Post[];
    meetups: Meetup[];
    activities: ActivityItem[];
  }>({ posts: [], meetups: [], activities: [] });

  // Load following users and their activity
  useEffect(() => {
    loadFollowingData();
  }, [currentUser]);

  const loadFollowingData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      // Get users the current user is following
      const following = getMockFollowingUsers(currentUser.uid);
      setFollowingUsers(following);
      setFollowingSet(new Set(following.map((u) => u.uid)));

      // Get activity from followed users
      const activity = getFollowingActivity(following.map((u) => u.uid));
      setActivityData(activity);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadFollowingData();
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setRefreshing(false);
    }
  };

  const handleUnfollow = (userId: string) => {
    // Remove from following list
    setFollowingUsers((prev) => prev.filter((u) => u.uid !== userId));
    setFollowingSet((prev) => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  // Build feed items from following activity
  const feedItems: FeedItem[] = useMemo(() => {
    const items: FeedItem[] = [];

    // Combine all activity with timestamps
    const combined: FeedItem[] = [];

    // Add posts from followed users
    if (activeFilter === "all" || activeFilter === "posts") {
      activityData.posts.forEach((post) => {
        combined.push({
          id: `post_${post.id}`,
          type: "post",
          userId: post.userId,
          user: followingUsers.find((u) => u.uid === post.userId),
          data: post,
          timestamp: post.createdAt,
        });
      });
    }

    // Add meetups from followed users
    if (activeFilter === "all" || activeFilter === "meetups") {
      activityData.meetups.forEach((meetup) => {
        combined.push({
          id: `meetup_${meetup.id}`,
          type: "meetup",
          userId: meetup.creatorId,
          user: followingUsers.find((u) => u.uid === meetup.creatorId),
          data: meetup,
          timestamp: meetup.createdAt,
        });
      });
    }

    // Add activity items
    if (activeFilter === "all" || activeFilter === "activity") {
      activityData.activities.forEach((activity) => {
        combined.push({
          id: `activity_${activity.id}`,
          type: "activity_item",
          userId: activity.userId,
          user: followingUsers.find((u) => u.uid === activity.userId),
          data: activity,
          timestamp: activity.timestamp,
        });
      });
    }

    // Sort by timestamp (most recent first)
    combined.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Group by user and add user headers
    let lastUserId: string | undefined;
    combined.forEach((item) => {
      if (item.userId !== lastUserId) {
        items.push({
          id: `header_${item.userId}_${item.timestamp.getTime()}`,
          type: "user_header",
          userId: item.userId,
          user: item.user,
          timestamp: item.timestamp,
        });
        lastUserId = item.userId;
      }
      items.push(item);
    });

    return items;
  }, [followingUsers, activityData, activeFilter]);

  const renderFilterTabs = () => {
    const filters: { type: FilterType; label: string; icon: string }[] = [
      { type: "all", label: "All", icon: "apps" },
      { type: "posts", label: "Posts", icon: "newspaper" },
      { type: "meetups", label: "Meetups", icon: "people" },
      { type: "activity", label: "Activity", icon: "pulse" },
    ];

    return (
      <View style={[styles.filterTabs, { backgroundColor: colors.background }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterTabsContent}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.type;
            return (
              <TouchableOpacity
                key={filter.type}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: isActive ? colors.primary : colors.surface,
                  },
                ]}
                onPress={() => setActiveFilter(filter.type)}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={18}
                  color={isActive ? colors.onPrimary : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.filterTabText,
                    {
                      color: isActive ? colors.onPrimary : colors.text,
                      fontWeight: isActive ? "600" : "500",
                    },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderUserHeader = (item: FeedItem) => {
    const user = item.user;
    if (!user) return null;

    const isFollowing = followingSet.has(user.uid);
    const timeAgo = getTimeAgo(item.timestamp);

    return (
      <View
        style={[
          styles.userHeader,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.userHeaderLeft}
          onPress={() =>
            navigation.navigate("UserProfile", { userId: user.uid })
          }
          activeOpacity={0.7}
        >
          {user.profilePictures && user.profilePictures.length > 0 ? (
            <Image
              source={{ uri: user.profilePictures[0] }}
              style={styles.userAvatar}
            />
          ) : (
            <View
              style={[
                styles.userAvatar,
                {
                  backgroundColor: colors.border,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <Ionicons name="person" size={20} color={colors.textTertiary} />
            </View>
          )}
          <View style={styles.userHeaderInfo}>
            <View style={styles.userHeaderNameRow}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {user.displayName}
              </Text>
              {user.isVerified === "verified" && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.accentQuaternary}
                  style={styles.verifiedBadge}
                />
              )}
            </View>
            <Text style={[styles.userMeta, { color: colors.textSecondary }]}>
              {timeAgo}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.followButton,
            {
              backgroundColor: isFollowing ? colors.surface : colors.primary,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            if (isFollowing) {
              handleUnfollow(user.uid);
            }
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.followButtonText,
              {
                color: isFollowing ? colors.text : colors.onPrimary,
                fontWeight: "600",
              },
            ]}
          >
            {isFollowing ? "Following" : "Follow"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderActivityItem = (item: FeedItem) => {
    const activity = item.data as ActivityItem;
    const user = item.user;
    if (!activity || !user) return null;

    return (
      <TouchableOpacity
        style={[
          styles.activityCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() => {
          if (activity.meetupId) {
            navigation.navigate("MeetupDetails", {
              meetupId: activity.meetupId,
            });
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.activityLeft}>
          <View
            style={[
              styles.activityIconContainer,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Ionicons
              name={getActivityIcon(activity.type)}
              size={20}
              color={colors.primary}
            />
          </View>
          <View style={styles.activityContent}>
            <Text style={[styles.activityText, { color: colors.text }]}>
              <Text style={{ fontWeight: "600" }}>{user.displayName}</Text>{" "}
              {activity.description}
            </Text>
            <Text
              style={[styles.activityTime, { color: colors.textSecondary }]}
            >
              {getTimeAgo(activity.timestamp)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: FeedItem }) => {
    switch (item.type) {
      case "user_header":
        return renderUserHeader(item);

      case "post":
        const post = item.data as Post;
        return <EnhancedPostCard post={post} />;

      case "meetup":
        const meetup = item.data as Meetup;
        return (
          <EnhancedMeetupCard
            meetup={meetup}
            onPress={() =>
              navigation.navigate("MeetupDetails", { meetupId: meetup.id })
            }
          />
        );

      case "activity_item":
        return renderActivityItem(item);

      default:
        return null;
    }
  };

  const renderEmptyState = () => {
    return (
      <View style={styles.emptyState}>
        <View
          style={[
            styles.emptyIconContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <Ionicons
            name="people-outline"
            size={64}
            color={colors.textTertiary}
          />
        </View>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          No Following Activity
        </Text>
        <Text
          style={[styles.emptyDescription, { color: colors.textSecondary }]}
        >
          Start following people to see their posts, meetups, and activity here.
        </Text>
        <TouchableOpacity
          style={[styles.emptyButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate("Explore")}
        >
          <Text style={[styles.emptyButtonText, { color: colors.onPrimary }]}>
            Discover People
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <View>
        {/* Following Stats */}
        {followingUsers.length > 0 && (
          <View
            style={[
              styles.statsContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {followingUsers.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Following
              </Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {activityData.posts.length + activityData.meetups.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Recent Posts
              </Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {activityData.activities.length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Activities
              </Text>
            </View>
          </View>
        )}

        {/* Filter Tabs */}
        {renderFilterTabs()}
      </View>
    );
  };

  if (isInitialLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* Status Bar Spacer */}
      <SafeAreaView
        edges={["top"]}
        style={{ backgroundColor: colors.background }}
      />

      {/* App Bar */}
      <View
        style={[
          styles.appBar,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Following</Text>

        <TouchableOpacity
          style={[styles.iconButton, { backgroundColor: colors.surface }]}
          onPress={() => navigation.navigate("Explore")}
        >
          <Ionicons name="person-add-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Feed */}
      {loading ? (
        <LoadingIndicator />
      ) : (
        <FlatList
          data={feedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            feedItems.length === 0 ? styles.emptyContainer : styles.feedContent
          }
        />
      )}
    </View>
  );
}

// Helper functions
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

function getActivityIcon(activityType: string): any {
  const iconMap: Record<string, any> = {
    joined_meetup: "person-add",
    created_meetup: "add-circle",
    liked_post: "heart",
    commented: "chatbubble",
    shared: "share-social",
    default: "pulse",
  };
  return iconMap[activityType] || iconMap.default;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  filterTabs: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterTabsContent: {
    gap: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  filterTabText: {
    fontSize: 14,
  },
  userHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginTop: 8,
  },
  userHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userHeaderInfo: {
    flex: 1,
  },
  userHeaderNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  verifiedBadge: {
    marginLeft: 4,
  },
  userMeta: {
    fontSize: 13,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  followButtonText: {
    fontSize: 14,
  },
  activityCard: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
  },
  feedContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
