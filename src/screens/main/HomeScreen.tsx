import { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import EnhancedMeetupCard from "../../components/EnhancedMeetupCard";
import EnhancedPostCard from "../../components/EnhancedPostCard";
import EventCard from "../../components/EventCard";
import { getHappyHourEvents } from "../../components/HappyHourCarousel";
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
import { Meetup, Notification, Post, Event } from "../../types";

type FilterType = "all" | "meetups" | "posts" | "happy_hours";
type DateFilter = "all" | "today" | "this_week" | "this_weekend";

type FeedItem = {
  id: string;
  type:
    | "recommended_header"
    | "recommended_meetup"
    | "post"
    | "meetup"
    | "happy_hour"
    | "prompt";
  data?: Post | Meetup | Event;
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
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const { user: currentUser, isLoading: isInitialLoading } = useAuthStore();
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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [feedMode, setFeedMode] = useState<"for_you" | "favorites">("for_you");
  const [showFeedModeDropdown, setShowFeedModeDropdown] = useState(false);

  // Mock data
  const allMeetups = DataService.isInDeveloperMode()
    ? getMockMeetups()
    : meetups;

  // Get happy hour events
  const happyHourEvents = DataService.isInDeveloperMode()
    ? getHappyHourEvents()
    : [];

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

    // Combine ALL content types with priority
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

    // Add Happy Hour events (only if not filtered) - MIXED WITH OTHER CONTENT
    if (activeFilter === "all" || activeFilter === "happy_hours") {
      happyHourEvents.forEach((event) => {
        const hoursUntilEvent =
          (event.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        let priority = 100;
        // Events happening TODAY get highest priority
        if (hoursUntilEvent > 0 && hoursUntilEvent < 24) {
          priority = 3;
        }
        // Events THIS WEEK
        else if (hoursUntilEvent > 0 && hoursUntilEvent < 168) {
          priority = 15 + Math.floor(hoursUntilEvent / 24);
        }
        // Future events
        else if (hoursUntilEvent > 0) {
          priority = 40 + Math.floor(hoursUntilEvent / 24);
        }
        // Past events (lower priority)
        else {
          priority = 200;
        }

        combined.push({
          id: `happy_hour_${event.id}`,
          type: "happy_hour",
          data: event,
          timestamp: event.startTime,
          priority,
        });
      });
    }


    // Sort by priority (lower number = higher priority) - ALL ITEMS MIXED TOGETHER
    combined.sort((a, b) => (a.priority || 0) - (b.priority || 0));

    items.push(...combined);

    return items;
  }, [
    posts,
    allMeetups,
    happyHourEvents,
    activeFilter,
    selectedDateFilter,
    recommendedMeetups,
    currentPromptIndex,
  ]);

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
            userAvatar: currentUser.photoURL || "",
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
  const getMutualFriends = () => {
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
      case "happy_hour":
        const event = item.data as Event;
        return (
          <View style={styles.eventWrapper}>
            <EventCard
              event={event}
              onPress={() => {
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
              style={styles.eventCard}
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
              mutualFriends={getMutualFriends()}
            />
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
              mutualFriends={getMutualFriends()}
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
      {/* Dropdown Overlay */}
      {showFeedModeDropdown && (
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowFeedModeDropdown(false)}
        />
      )}

      {/* Clean App Bar */}
      <View style={[styles.appBar, { borderBottomColor: colors.border }]}>
        {/* Logo with Dropdown */}
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => setShowFeedModeDropdown(!showFeedModeDropdown)}
          activeOpacity={0.7}
        >
          <Text style={[styles.logoText, { color: colors.text }]}>
            Evertwine
          </Text>
          <Ionicons
            name={showFeedModeDropdown ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.text}
          />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={styles.actionBar}>
          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
            onPress={() => setShowFilterModal(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={20} color={colors.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.iconButton, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate("Notifications")}
            activeOpacity={0.7}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={colors.text}
            />
            {notifications.filter((n) => !n.isRead).length > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>
                  {notifications.filter((n) => !n.isRead).length > 9
                    ? "9+"
                    : notifications.filter((n) => !n.isRead).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Feed Mode Dropdown */}
        {showFeedModeDropdown && (
          <View
            style={[
              styles.feedModeDropdown,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: "#000",
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.feedModeOption,
                feedMode === "for_you" && {
                  backgroundColor: colors.primary + "10",
                },
              ]}
              onPress={() => {
                setFeedMode("for_you");
                setShowFeedModeDropdown(false);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.feedModeText,
                  {
                    color:
                      feedMode === "for_you" ? colors.primary : colors.text,
                    fontWeight: feedMode === "for_you" ? "600" : "500",
                  },
                ]}
              >
                For You
              </Text>
              {feedMode === "for_you" && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.feedModeOption,
                feedMode === "favorites" && {
                  backgroundColor: colors.primary + "10",
                },
              ]}
              onPress={() => {
                setFeedMode("favorites");
                setShowFeedModeDropdown(false);
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.feedModeText,
                  {
                    color:
                      feedMode === "favorites" ? colors.primary : colors.text,
                    fontWeight: feedMode === "favorites" ? "600" : "500",
                  },
                ]}
              >
                Favorites
              </Text>
              {feedMode === "favorites" && (
                <Ionicons name="checkmark" size={18} color={colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

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

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
            onStartShouldSetResponder={() => true}
          >
            <View
              style={[styles.modalHeader, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Feed Filters
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={styles.modalClose}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Content Type */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                CONTENT TYPE
              </Text>
              {[
                { type: "all", label: "All", icon: "apps" },
                { type: "meetups", label: "Meetups", icon: "people" },
                { type: "posts", label: "Posts", icon: "newspaper" },
                { type: "happy_hours", label: "Happy Hours", icon: "wine" },
              ].map((filter) => {
                const isActive = activeFilter === filter.type;
                return (
                  <TouchableOpacity
                    key={filter.type}
                    style={[
                      styles.modalOption,
                      {
                        backgroundColor: isActive
                          ? colors.primary + "10"
                          : "transparent",
                      },
                    ]}
                    onPress={() => {
                      handleFilterChange(filter.type as FilterType);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.modalOptionLeft}>
                      <Ionicons
                        name={filter.icon as any}
                        size={22}
                        color={isActive ? colors.primary : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.modalOptionText,
                          {
                            color: isActive ? colors.primary : colors.text,
                            fontWeight: isActive ? "600" : "500",
                          },
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </View>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Time Range */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                TIME RANGE
              </Text>
              {[
                { type: "all", label: "All" },
                { type: "today", label: "Today" },
                { type: "this_week", label: "This Week" },
                { type: "this_weekend", label: "This Weekend" },
              ].map((filter) => {
                const isActive = selectedDateFilter === filter.type;
                return (
                  <TouchableOpacity
                    key={filter.type}
                    style={[
                      styles.modalOption,
                      {
                        backgroundColor: isActive
                          ? colors.primary + "10"
                          : "transparent",
                      },
                    ]}
                    onPress={() => {
                      setSelectedDateFilter(filter.type as DateFilter);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.modalOptionLeft}>
                      <Ionicons
                        name="calendar-outline"
                        size={22}
                        color={isActive ? colors.primary : colors.textSecondary}
                      />
                      <Text
                        style={[
                          styles.modalOptionText,
                          {
                            color: isActive ? colors.primary : colors.text,
                            fontWeight: isActive ? "600" : "500",
                          },
                        ]}
                      >
                        {filter.label}
                      </Text>
                    </View>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowFilterModal(false)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.applyButtonText, { color: colors.onPrimary }]}
              >
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
  dropdownOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    position: "relative",
    zIndex: 10,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  feedModeDropdown: {
    position: "absolute",
    top: 50,
    left: 16,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    minWidth: 160,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  feedModeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  feedModeText: {
    fontSize: 16,
  },
  actionBar: {
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  feedContent: {
    paddingTop: 16,
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
  eventWrapper: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  eventCard: {
    marginBottom: 0,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  modalClose: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 6,
  },
  modalOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  modalOptionText: {
    fontSize: 16,
    flex: 1,
  },
  applyButton: {
    marginHorizontal: 24,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
