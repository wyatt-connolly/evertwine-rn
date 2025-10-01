import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import EnhancedMeetupCard from "../../components/EnhancedMeetupCard";
import EnhancedPostCard from "../../components/EnhancedPostCard";
import HappyHourCarousel from "../../components/HappyHourCarousel";
import FilterTabs, { FilterType } from "../../components/FilterTabs";
import QuickActionsBar, { DateFilter } from "../../components/QuickActionsBar";
import SkeletonLoader from "../../components/SkeletonLoader";
import ContentPrompt from "../../components/ContentPrompt";
import ExpandableFAB from "../../components/ExpandableFAB";
import {
  getMockMeetups,
  getMockPosts,
  getUserNotifications,
} from "../../data/mockData";
import { DataService } from "../../services/DataService";
import LoadingIndicator from "../../components/LoadingIndicator";
import { testFirebaseData } from "../../utils/devTesting";
import { Meetup, Notification, Post } from "../../types";

type FeedItem = {
  id: string;
  type:
    | "happy_hour_header"
    | "happy_hour"
    | "recommended_header"
    | "recommended_meetup"
    | "header"
    | "post"
    | "meetup"
    | "prompt";
  data?: Post | Meetup;
  timestamp?: Date;
  priority?: number;
  promptType?: "introduction" | "rate_meetup" | "share_experience";
};

const CONTENT_PROMPTS = [
  {
    id: "introduction",
    icon: "hand-right" as const,
    title: "Introduce Yourself",
    description:
      "Let the community know who you are and what you're looking for!",
    actionText: "Create Introduction",
  },
  {
    id: "rate_meetup",
    icon: "star" as const,
    title: "Rate Your Last Meetup",
    description: "Help others by sharing your experience",
    actionText: "Rate Now",
  },
  {
    id: "share_experience",
    icon: "chatbubbles" as const,
    title: "Share Your Experience",
    description: "Tell us about your latest meetup or event",
    actionText: "Share Now",
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const { currentUser, isInitialLoading } = useAuthStore();
  const { meetups } = useMeetupStore();
  const flatListRef = useRef<FlatList>(null);

  // State
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedDateFilter, setSelectedDateFilter] =
    useState<DateFilter>("all");
  const [interestedMeetups, setInterestedMeetups] = useState<Set<string>>(
    new Set()
  );
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);

  // Mock data
  const allMeetups = DataService.isInDeveloperMode()
    ? getMockMeetups()
    : meetups;

  // Initialize posts from mock data
  useEffect(() => {
    if (DataService.isInDeveloperMode()) {
      setPosts(getMockPosts());
    }
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  }, []);

  useEffect(() => {
    if (currentUser && DataService.isInDeveloperMode()) {
      setNotifications(getUserNotifications(currentUser.uid));
    }
  }, [currentUser]);

  useEffect(() => {
    if (__DEV__ && !DataService.isInDeveloperMode()) {
      testFirebaseData();
    }
  }, []);

  // Rotate content prompts every 5 items
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % CONTENT_PROMPTS.length);
    }, 30000); // Change every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Get personalized/recommended meetups
  const recommendedMeetups = useMemo(() => {
    if (!currentUser?.interests) return [];

    // Filter meetups that match user's interests
    return allMeetups
      .filter((meetup) => {
        const hasMatchingTag = meetup.tags.some((tag) =>
          currentUser.interests?.includes(tag.toLowerCase())
        );
        const isFuture = meetup.time.getTime() > Date.now();
        return hasMatchingTag && isFuture;
      })
      .slice(0, 3); // Top 3 recommendations
  }, [allMeetups, currentUser]);

  // Smart feed algorithm with filtering
  const feedItems: FeedItem[] = useMemo(() => {
    const items: FeedItem[] = [];
    const now = new Date();

    // Add Happy Hour section (only if not filtered)
    if (activeFilter === "all" || activeFilter === "happy_hours") {
      items.push({
        id: "happy_hour_header",
        type: "happy_hour_header",
        priority: 0,
      });
      items.push({
        id: "happy_hour",
        type: "happy_hour",
        priority: 0,
      });
    }

    // Add Recommended section (only for "all" and "meetups")
    if (
      (activeFilter === "all" || activeFilter === "meetups") &&
      recommendedMeetups.length > 0
    ) {
      items.push({
        id: "recommended_header",
        type: "recommended_header",
        priority: 1,
      });
      recommendedMeetups.forEach((meetup, index) => {
        items.push({
          id: `recommended_${meetup.id}`,
          type: "recommended_meetup",
          data: meetup,
          priority: 1 + index * 0.1,
        });
      });
    }

    // Add feed header
    if (activeFilter === "all") {
      items.push({
        id: "feed_header",
        type: "header",
        priority: 2,
      });
    }

    // Combine posts and meetups with priority
    const combined: FeedItem[] = [];
    let itemCount = 0;

    // Add posts with priority based on type and recency
    if (activeFilter === "all" || activeFilter === "posts") {
      posts.forEach((post) => {
        const hoursSincePost =
          (now.getTime() - post.createdAt.getTime()) / (1000 * 60 * 60);
        let priority = 100;

        // Announcements always high priority
        if (post.isAnnouncement) {
          priority = 2;
        }
        // Recent posts (< 6 hours) get higher priority
        else if (hoursSincePost < 6) {
          priority = 10 + hoursSincePost;
        }
        // Popular posts (lots of engagement)
        else if (post.likes.length + post.comments.length > 5) {
          priority = 20 + hoursSincePost;
        }
        // Older posts
        else {
          priority = 50 + hoursSincePost;
        }

        combined.push({
          id: `post_${post.id}`,
          type: "post",
          data: post,
          timestamp: post.createdAt,
          priority,
        });
        itemCount++;

        // Insert content prompt every 5 items
        if (itemCount % 5 === 0 && activeFilter === "all") {
          combined.push({
            id: `prompt_${itemCount}`,
            type: "prompt",
            priority: priority + 0.5,
            promptType: CONTENT_PROMPTS[currentPromptIndex].id as any,
          });
        }
      });
    }

    // Add meetups with priority based on timing and date filter
    if (activeFilter === "all" || activeFilter === "meetups") {
      allMeetups.forEach((meetup) => {
        const hoursUntilMeetup =
          (meetup.time.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Apply date filter
        let includeInFeed = false;
        switch (selectedDateFilter) {
          case "today":
            includeInFeed = hoursUntilMeetup > 0 && hoursUntilMeetup < 24;
            break;
          case "this_week":
            includeInFeed = hoursUntilMeetup > 0 && hoursUntilMeetup < 168;
            break;
          case "this_weekend":
            const meetupDay = meetup.time.getDay();
            includeInFeed =
              hoursUntilMeetup > 0 &&
              hoursUntilMeetup < 168 &&
              (meetupDay === 0 || meetupDay === 6);
            break;
          case "all":
          default:
            includeInFeed = true;
            break;
        }

        if (!includeInFeed) return;

        let priority = 100;

        // Meetups happening TODAY get highest priority
        if (hoursUntilMeetup > 0 && hoursUntilMeetup < 24) {
          priority = 3;
        }
        // Meetups THIS WEEK
        else if (hoursUntilMeetup > 0 && hoursUntilMeetup < 168) {
          priority = 15 + Math.floor(hoursUntilMeetup / 24);
        }
        // Future meetups
        else if (hoursUntilMeetup > 0) {
          priority = 40 + Math.floor(hoursUntilMeetup / 24);
        }
        // Past meetups (lower priority)
        else {
          priority = 200;
        }

        combined.push({
          id: `meetup_${meetup.id}`,
          type: "meetup",
          data: meetup,
          timestamp: meetup.time,
          priority,
        });
      });
    }

    // Sort by priority (lower number = higher priority)
    combined.sort((a, b) => (a.priority || 0) - (b.priority || 0));

    items.push(...combined);

    return items;
  }, [
    posts,
    allMeetups,
    activeFilter,
    selectedDateFilter,
    recommendedMeetups,
    currentPromptIndex,
  ]);

  // Filter counts
  const filterCounts = useMemo(() => {
    const now = new Date();
    const futureMeetups = allMeetups.filter(
      (m) => m.time.getTime() > now.getTime()
    );

    return {
      all: posts.length + futureMeetups.length,
      meetups: futureMeetups.length,
      posts: posts.length,
      happy_hours: 5, // Mock count from carousel
    };
  }, [posts, allMeetups]);

  // Nearby count (mock)
  const nearbyCount = useMemo(() => {
    return allMeetups.filter((m) => m.time.getTime() > Date.now()).length;
  }, [allMeetups]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handlePostLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId && currentUser) {
          const isLiked = post.likes.includes(currentUser.uid);
          return {
            ...post,
            likes: isLiked
              ? post.likes.filter((uid) => uid !== currentUser.uid)
              : [...post.likes, currentUser.uid],
          };
        }
        return post;
      })
    );
  };

  const handlePostComment = (postId: string, message: string) => {
    if (!currentUser) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `comment_${Date.now()}`,
            userId: currentUser.uid,
            userName: currentUser.displayName || "User",
            userAvatar: currentUser.profilePictures?.[0] || "",
            message,
            createdAt: new Date(),
          };
          return {
            ...post,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const handleMeetupInterested = (meetupId: string, isInterested: boolean) => {
    setInterestedMeetups((prev) => {
      const newSet = new Set(prev);
      if (isInterested) {
        newSet.add(meetupId);
      } else {
        newSet.delete(meetupId);
      }
      return newSet;
    });
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);

    // Always scroll to top when changing filters
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const getTimeUntilMeetup = (meetupTime: Date): string => {
    const now = new Date();
    const diffMs = meetupTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffHours < 0) return "Past event";
    if (diffHours < 1) return "Starting soon!";
    if (diffHours < 24) return "Today";
    if (diffDays < 2) return "Tomorrow";
    if (diffDays < 7) return "This week";
    return meetupTime.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  // Mock mutual friends generator
  const getMutualFriends = (meetup: Meetup) => {
    // This would be calculated from real friend data
    if (Math.random() > 0.6) {
      return [
        {
          id: "friend1",
          name: "Sarah M.",
          avatar:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
        },
        {
          id: "friend2",
          name: "Mike C.",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        },
      ];
    }
    return [];
  };

  const renderItem = ({ item }: { item: FeedItem }) => {
    switch (item.type) {
      case "happy_hour_header":
        return (
          <View
            style={[
              styles.sectionHeader,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.sectionHeaderContent}>
              <Ionicons name="wine" size={20} color={colors.primary} />
              <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>
                Happy Hour Events
              </Text>
            </View>
          </View>
        );

      case "happy_hour":
        return (
          <View style={styles.happyHourCarouselWrapper}>
            <HappyHourCarousel
              onEventPress={(event) => {
                const serializedEvent = {
                  ...event,
                  startTime: event.startTime?.toISOString(),
                  endTime: event.endTime?.toISOString(),
                  createdAt: event.createdAt?.toISOString(),
                  updatedAt: event.updatedAt?.toISOString(),
                };
                navigation.navigate("EventDetails", {
                  eventId: event.id,
                  event: serializedEvent,
                });
              }}
            />
          </View>
        );

      case "recommended_header":
        return (
          <View
            style={[
              styles.sectionHeader,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.sectionHeaderContent}>
              <Ionicons name="sparkles" size={20} color={colors.primary} />
              <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>
                Recommended for You
              </Text>
            </View>
            <Text
              style={[
                styles.sectionHeaderSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              Based on your interests
            </Text>
          </View>
        );

      case "recommended_meetup":
        const recommendedMeetup = item.data as Meetup;
        return (
          <View style={styles.recommendedMeetupWrapper}>
            <EnhancedMeetupCard
              meetup={recommendedMeetup}
              onPress={() =>
                navigation.navigate("MeetupDetails", {
                  meetupId: recommendedMeetup.id,
                })
              }
              onInterested={handleMeetupInterested}
              isInterested={interestedMeetups.has(recommendedMeetup.id)}
              mutualFriends={getMutualFriends(recommendedMeetup)}
            />
          </View>
        );

      case "header":
        return (
          <View
            style={[
              styles.sectionHeader,
              { backgroundColor: colors.background },
            ]}
          >
            <View style={styles.sectionHeaderContent}>
              <Ionicons name="newspaper" size={20} color={colors.primary} />
              <Text style={[styles.sectionHeaderTitle, { color: colors.text }]}>
                Your Feed
              </Text>
            </View>
          </View>
        );

      case "prompt":
        const prompt = CONTENT_PROMPTS.find((p) => p.id === item.promptType);
        if (!prompt) return null;
        return (
          <ContentPrompt
            icon={prompt.icon}
            title={prompt.title}
            description={prompt.description}
            actionText={prompt.actionText}
            onAction={() => {
              // Handle prompt action
              if (
                prompt.id === "introduction" ||
                prompt.id === "share_experience"
              ) {
                navigation.navigate("CreatePost");
              } else if (prompt.id === "rate_meetup") {
                navigation.navigate("ActivityFeed");
              }
            }}
          />
        );

      case "post":
        const post = item.data as Post;
        return (
          <EnhancedPostCard
            post={post}
            onLike={handlePostLike}
            onComment={handlePostComment}
          />
        );

      case "meetup":
        const meetup = item.data as Meetup;
        const timeLabel = getTimeUntilMeetup(meetup.time);
        const isUpcoming =
          meetup.time.getTime() > new Date().getTime() &&
          meetup.time.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

        return (
          <View
            style={[
              styles.meetupWrapper,
              {
                backgroundColor: colors.surface,
                borderLeftColor: isUpcoming ? colors.primary : colors.border,
              },
            ]}
          >
            <View style={styles.meetupTimeBadge}>
              <Ionicons
                name="calendar"
                size={14}
                color={isUpcoming ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.meetupTimeText,
                  {
                    color: isUpcoming ? colors.primary : colors.textSecondary,
                  },
                ]}
              >
                {timeLabel}
              </Text>
            </View>
            <EnhancedMeetupCard
              meetup={meetup}
              onPress={() =>
                navigation.navigate("MeetupDetails", { meetupId: meetup.id })
              }
              onInterested={handleMeetupInterested}
              isInterested={interestedMeetups.has(meetup.id)}
              mutualFriends={getMutualFriends(meetup)}
            />
          </View>
        );

      default:
        return null;
    }
  };

  const renderEmptyState = () => {
    if (activeFilter === "posts") {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="newspaper-outline"
            size={64}
            color={colors.textTertiary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Posts Yet
          </Text>
          <Text
            style={[styles.emptyDescription, { color: colors.textSecondary }]}
          >
            Be the first to share something with the community!
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("CreatePost")}
          >
            <Text style={[styles.emptyButtonText, { color: colors.onPrimary }]}>
              Create Post
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (activeFilter === "meetups") {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="people-outline"
            size={64}
            color={colors.textTertiary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Meetups Found
          </Text>
          <Text
            style={[styles.emptyDescription, { color: colors.textSecondary }]}
          >
            Try adjusting your filters or create a new meetup
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: colors.primary }]}
            onPress={() =>
              navigation.navigate("CreateMeetupStep1", {
                formData: {},
                onUpdate: () => {},
              })
            }
          >
            <Text style={[styles.emptyButtonText, { color: colors.onPrimary }]}>
              Create Meetup
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name="happy-outline" size={64} color={colors.textTertiary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Welcome to Evertwine!
        </Text>
        <Text
          style={[styles.emptyDescription, { color: colors.textSecondary }]}
        >
          {DataService.isInDeveloperMode()
            ? "Your feed is empty. Posts and meetups will appear here."
            : "Sign in with Developer Login to see posts and meetups"}
        </Text>
      </View>
    );
  };

  if (isInitialLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <LoadingIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        activeFilter === "happy_hours"
          ? styles.containerCompact
          : styles.container,
        { backgroundColor: colors.background },
      ]}
    >
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
        <View style={styles.appBarContent}>
          <View style={styles.appBarTitleContainer}>
            <Ionicons name="home" size={22} color={colors.primary} />
            <Text style={[styles.appBarTitle, { color: colors.text }]}>
              Evertwine
            </Text>
          </View>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate("Notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={22}
              color={colors.text}
            />
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <View
                style={[
                  styles.notificationBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.notificationBadgeText}>
                  {notifications.filter((n) => !n.isRead).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        counts={filterCounts}
      />

      {/* Quick Actions Bar */}
      <QuickActionsBar
        onLocationPress={() => navigation.navigate("Map")}
        onDateFilterChange={setSelectedDateFilter}
        onMapPress={() => navigation.navigate("Map")}
        onSearchPress={() => navigation.navigate("Search")}
        selectedDateFilter={selectedDateFilter}
        nearbyCount={nearbyCount}
      />

      {/* Feed */}
      {loading ? (
        <SkeletonLoader type="post" count={3} />
      ) : (
        <FlatList
          ref={flatListRef}
          data={feedItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={activeFilter === "happy_hours" ? { flex: 0 } : undefined}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={
            feedItems.length === 0
              ? styles.emptyContainer
              : activeFilter === "happy_hours"
              ? styles.feedContentCompact
              : styles.feedContent
          }
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 100));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0,
              });
            });
          }}
        />
      )}

      {/* Expandable Floating Action Button */}
      <ExpandableFAB
        options={[
          {
            icon: "newspaper",
            label: "Create Post",
            onPress: () => navigation.navigate("CreatePost"),
            color: colors.primary,
          },
          {
            icon: "people",
            label: "Create Meetup",
            onPress: () =>
              navigation.navigate("CreateMeetupStep1", {
                formData: {},
                onUpdate: () => {},
              }),
            color: colors.primary,
          },
        ]}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCompact: {
    flex: 1,
    flexShrink: 1,
  },
  appBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  appBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appBarTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  appBarTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  notificationButton: {
    padding: 4,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  feedContent: {
    paddingBottom: 100,
  },
  feedContentCompact: {
    paddingBottom: 20,
    flexGrow: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sectionHeaderSubtitle: {
    fontSize: 13,
    marginLeft: 28,
  },
  happyHourCarouselWrapper: {
    marginBottom: 8,
  },
  recommendedMeetupWrapper: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  meetupWrapper: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    overflow: "hidden",
  },
  meetupTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  meetupTimeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
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
