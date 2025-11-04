import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Modal,
  ScrollView,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
// import { useMeetupStore } from "../../hooks/useMeetupStore"; // No longer needed
import { usePreferenceStore } from "../../hooks/usePreferenceStore";
import { useNotificationStore } from "../../hooks/useNotificationStore";
import EnhancedMeetupCard from "../../components/EnhancedMeetupCard";
import EnhancedPostCard from "../../components/EnhancedPostCard";
import EventCard from "../../components/EventCard";
import SkeletonLoader from "../../components/SkeletonLoader";
import ContentPrompt from "../../components/ContentPrompt";
import ExpandableFAB from "../../components/ExpandableFAB";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import LoadingIndicator from "../../components/LoadingIndicator";
import { Meetup, Post, Event } from "../../types";
import { Alert } from "react-native";

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
  const { colors, isDarkMode } = useThemeStore();
  const { user: currentUser, isLoading: isInitialLoading } = useAuthStore();
  // const { meetups } = useMeetupStore(); // No longer needed - using Supabase directly
  const { preferences } = usePreferenceStore();
  const { notifications } = useNotificationStore();
  const flatListRef = useRef<FlatList>(null);

  // State
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [notifications, setNotifications] = useState<Notification[]>([]); // Handled by useNotificationStore
  const [posts, setPosts] = useState<Post[]>([]);
  const [allMeetups, setAllMeetups] = useState<Meetup[]>([]);
  const [happyHourEvents, setHappyHourEvents] = useState<Event[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [selectedDateFilter, setSelectedDateFilter] =
    useState<DateFilter>("all");

  // Filter state for the modal (not applied until user clicks Apply)
  const [tempActiveFilter, setTempActiveFilter] = useState<FilterType>("all");
  const [tempSelectedDateFilter, setTempSelectedDateFilter] =
    useState<DateFilter>("all");
  const [tempSelectedMeetupActivities, setTempSelectedMeetupActivities] =
    useState<string[]>([]);
  const [tempSelectedHappyHourTypes, setTempSelectedHappyHourTypes] = useState<
    string[]
  >([]);
  const [tempSelectedPostTypes, setTempSelectedPostTypes] = useState<string[]>(
    []
  );

  // Applied filters (what's actually being used in the feed)
  const [appliedMeetupActivities, setAppliedMeetupActivities] = useState<
    string[]
  >([]);
  const [appliedHappyHourTypes, setAppliedHappyHourTypes] = useState<string[]>(
    []
  );
  const [appliedPostTypes, setAppliedPostTypes] = useState<string[]>([]);

  const [interestedMeetups, setInterestedMeetups] = useState<Set<string>>(
    new Set()
  );
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFeedModeDropdown, setShowFeedModeDropdown] = useState(false);

  // Scroll animation state
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isAppBarVisible, setIsAppBarVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 50; // Minimum scroll distance to trigger hide/show

  // Modal animation state
  const modalSlideY = useRef(new Animated.Value(800)).current;

  // Load data from Supabase
  const loadData = async () => {
    try {
      const [meetupsData, eventsData] = await Promise.all([
        SupabaseDataService.getMeetups(),
        SupabaseDataService.getHappyHours(),
      ]);
      setAllMeetups(meetupsData || []);
      setHappyHourEvents(eventsData || []);
    } catch (error) {
      console.error("Error loading data:", error);
      setAllMeetups([]);
      setHappyHourEvents([]);
    }
  };

  // Initialize data from Supabase
  useEffect(() => {
    const loadAllData = async () => {
      try {
        // Fetch posts from Supabase
        const postsData = await SupabaseDataService.getPosts();
        setPosts(postsData || []);

        // Load meetups and events
        await loadData();
      } catch (error) {
        console.error("Error loading initial data:", error);
        setPosts([]);
        setAllMeetups([]);
        setHappyHourEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  // Notifications are handled by useNotificationStore

  // Rotate content prompts every 5 items
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromptIndex((prev) => (prev + 1) % CONTENT_PROMPTS.length);
    }, 30000); // Change every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // Refresh data when screen comes into focus (to catch updates from other screens)
  useFocusEffect(
    React.useCallback(() => {
      // Check if we need to refresh based on route params
      const currentRoute = navigation
        .getState()
        ?.routes?.find((route: any) => route.name === "Home");
      const shouldRefresh = (currentRoute?.params as any)?.refresh;

      // Always refresh meetups when screen comes into focus (in case user joined/left from details screen)
      // This ensures the cards show the correct join state
      const refreshMeetups = async () => {
        try {
          console.log("🔄 [HomeScreen] Refreshing meetups on focus");
          const meetupsData = await SupabaseDataService.getMeetups();
          setAllMeetups(meetupsData || []);
          console.log("✅ [HomeScreen] Meetups refreshed");
        } catch (error) {
          console.error("Error refreshing meetups:", error);
        }
      };

      if (shouldRefresh) {
        // Full refresh if route param indicates it
        const refreshData = async () => {
          try {
            const [postsData, meetupsData, eventsData] = await Promise.all([
              SupabaseDataService.getPosts(),
              SupabaseDataService.getMeetups(),
              SupabaseDataService.getHappyHours(),
            ]);

            setPosts(postsData || []);
            setAllMeetups(meetupsData || []);
            setHappyHourEvents(eventsData || []);

            // Clear the refresh flag
            navigation.setParams({ refresh: false } as any);
          } catch (error) {
            console.error("Error refreshing HomeScreen data:", error);
          }
        };
        refreshData();
      } else {
        // Otherwise just refresh meetups to catch join/leave changes
        refreshMeetups();
      }
    }, [navigation])
  );

  // Helper function to check if meetup matches group size preferences
  const meetsGroupSizeFilter = (meetup: Meetup): boolean => {
    if (preferences.groupSizePreference.preferredSizes.length === 0)
      return true;

    const maxParticipants = meetup.maxParticipants;

    return preferences.groupSizePreference.preferredSizes.some((size) => {
      switch (size) {
        case "one-on-one":
          return maxParticipants === 2;
        case "small-group":
          return maxParticipants >= 2 && maxParticipants <= 4;
        case "medium-group":
          return maxParticipants >= 5 && maxParticipants <= 8;
        case "large-group":
          return maxParticipants >= 9;
        default:
          return false;
      }
    });
  };

  // Check if user already has an active meetup
  const checkExistingMeetup = async (): Promise<boolean> => {
    if (!currentUser) return false;

    try {
      const meetups = await SupabaseDataService.getMeetups(100);
      const userMeetups = meetups.filter(
        (meetup) => meetup.creatorId === currentUser.uid
      );
      return userMeetups.length >= 1;
    } catch (error) {
      console.error("Error checking existing meetups:", error);
      return false;
    }
  };

  // Handle create meetup navigation with limit check
  const handleCreateMeetup = async () => {
    const hasExistingMeetup = await checkExistingMeetup();

    if (hasExistingMeetup) {
      Alert.alert(
        "Meetup Limit Reached",
        "You can only have one active meetup at a time. Please delete your existing meetup first.",
        [{ text: "OK" }]
      );
      return;
    }

    navigation.navigate("CreateMeetupStep1", {
      formData: {},
      onUpdate: () => {},
    });
  };

  // Helper function to check if meetup/event matches time preferences
  const meetsTimePreference = (item: Meetup | Event): boolean => {
    if (preferences.timePreference.availableTimes.length === 0) return true;

    const time = "time" in item ? item.time : item.startTime;
    const hour = time.getHours();

    return preferences.timePreference.availableTimes.some((timeSlot) => {
      switch (timeSlot) {
        case "morning":
          return hour >= 6 && hour < 12;
        case "afternoon":
          return hour >= 12 && hour < 18;
        case "evening":
          return hour >= 18 && hour < 22;
        case "night":
          return hour >= 22 || hour < 6;
        default:
          return false;
      }
    });
  };

  // Helper function to check if meetup matches activity filters
  const meetsMeetupActivityFilter = (meetup: Meetup): boolean => {
    if (appliedMeetupActivities.length === 0) return true;

    const meetupActivity = meetup.activity?.toLowerCase() || "";
    const meetupCategory = meetup.activityCategory?.toLowerCase() || "";
    const meetupTags = meetup.tags.map((tag) => tag.toLowerCase());

    return appliedMeetupActivities.some((activity) => {
      switch (activity) {
        case "yoga":
          return (
            meetupActivity.includes("yoga") ||
            meetupCategory.includes("wellness") ||
            meetupTags.some((tag) => tag.includes("yoga"))
          );
        case "fitness":
          return (
            meetupActivity.includes("fitness") ||
            meetupCategory.includes("fitness") ||
            meetupTags.some((tag) => tag.includes("fitness"))
          );
        case "photography":
          return (
            meetupActivity.includes("photography") ||
            meetupTags.some((tag) => tag.includes("photography"))
          );
        case "networking":
          return (
            meetupActivity.includes("networking") ||
            meetupCategory.includes("professional") ||
            meetupTags.some((tag) => tag.includes("networking"))
          );
        case "food":
          return (
            meetupActivity.includes("cooking") ||
            meetupCategory.includes("food") ||
            meetupTags.some(
              (tag) => tag.includes("food") || tag.includes("cooking")
            )
          );
        case "art":
          return (
            meetupCategory.includes("art") ||
            meetupActivity.includes("gallery") ||
            meetupTags.some((tag) => tag.includes("art"))
          );
        case "technology":
          return (
            meetupActivity.includes("coding") ||
            meetupActivity.includes("tech") ||
            meetupCategory.includes("technology") ||
            meetupTags.some((tag) => tag.includes("tech"))
          );
        case "outdoor":
          return (
            meetupActivity.includes("hiking") ||
            meetupActivity.includes("walk") ||
            meetupTags.some(
              (tag) => tag.includes("outdoor") || tag.includes("hiking")
            )
          );
        default:
          return false;
      }
    });
  };

  // Helper function to check if meetup matches preference-based activities
  const meetsPreferenceActivityFilter = (meetup: Meetup): boolean => {
    if (preferences.activityPreference.interests.length === 0) return true;

    const meetupActivity = meetup.activity?.toLowerCase() || "";
    const meetupCategory = meetup.activityCategory?.toLowerCase() || "";
    const meetupTags = meetup.tags.map((tag) => tag.toLowerCase());

    return preferences.activityPreference.interests.some((interest) => {
      switch (interest) {
        case "coffee":
          return (
            meetupActivity.includes("coffee") ||
            meetupActivity.includes("tea") ||
            meetupTags.some(
              (tag) => tag.includes("coffee") || tag.includes("tea")
            )
          );
        case "food":
          return (
            meetupActivity.includes("cooking") ||
            meetupActivity.includes("dining") ||
            meetupCategory.includes("food") ||
            meetupTags.some(
              (tag) => tag.includes("food") || tag.includes("cooking")
            )
          );
        case "outdoor":
          return (
            meetupActivity.includes("hiking") ||
            meetupActivity.includes("walk") ||
            meetupActivity.includes("outdoor") ||
            meetupTags.some(
              (tag) => tag.includes("outdoor") || tag.includes("hiking")
            )
          );
        case "fitness":
          return (
            meetupActivity.includes("fitness") ||
            meetupActivity.includes("sports") ||
            meetupCategory.includes("fitness") ||
            meetupTags.some(
              (tag) => tag.includes("fitness") || tag.includes("sports")
            )
          );
        case "arts":
          return (
            meetupCategory.includes("art") ||
            meetupActivity.includes("gallery") ||
            meetupActivity.includes("museum") ||
            meetupTags.some(
              (tag) => tag.includes("art") || tag.includes("culture")
            )
          );
        case "music":
          return (
            meetupActivity.includes("music") ||
            meetupActivity.includes("concert") ||
            meetupTags.some(
              (tag) => tag.includes("music") || tag.includes("concert")
            )
          );
        case "movies":
          return (
            meetupActivity.includes("movie") ||
            meetupActivity.includes("cinema") ||
            meetupTags.some(
              (tag) => tag.includes("movie") || tag.includes("cinema")
            )
          );
        case "gaming":
          return (
            meetupActivity.includes("gaming") ||
            meetupActivity.includes("game") ||
            meetupTags.some(
              (tag) => tag.includes("gaming") || tag.includes("game")
            )
          );
        case "books":
          return (
            meetupActivity.includes("book") ||
            meetupActivity.includes("reading") ||
            meetupTags.some(
              (tag) => tag.includes("book") || tag.includes("reading")
            )
          );
        case "travel":
          return (
            meetupActivity.includes("travel") ||
            meetupActivity.includes("adventure") ||
            meetupTags.some(
              (tag) => tag.includes("travel") || tag.includes("adventure")
            )
          );
        case "volunteer":
          return (
            meetupActivity.includes("volunteer") ||
            meetupActivity.includes("charity") ||
            meetupTags.some(
              (tag) => tag.includes("volunteer") || tag.includes("charity")
            )
          );
        case "networking":
          return (
            meetupActivity.includes("networking") ||
            meetupActivity.includes("professional") ||
            meetupCategory.includes("professional") ||
            meetupTags.some(
              (tag) =>
                tag.includes("networking") || tag.includes("professional")
            )
          );
        case "learning":
          return (
            meetupActivity.includes("learning") ||
            meetupActivity.includes("education") ||
            meetupActivity.includes("workshop") ||
            meetupTags.some(
              (tag) => tag.includes("learning") || tag.includes("education")
            )
          );
        case "photography":
          return (
            meetupActivity.includes("photography") ||
            meetupActivity.includes("photo") ||
            meetupTags.some(
              (tag) => tag.includes("photography") || tag.includes("photo")
            )
          );
        case "cooking":
          return (
            meetupActivity.includes("cooking") ||
            meetupActivity.includes("baking") ||
            meetupTags.some(
              (tag) => tag.includes("cooking") || tag.includes("baking")
            )
          );
        default:
          return false;
      }
    });
  };

  // Helper function to check if happy hour matches type filters
  const meetsHappyHourTypeFilter = (event: Event): boolean => {
    if (appliedHappyHourTypes.length === 0) return true;

    const eventTitle = event.title?.toLowerCase() || "";
    const eventCategory = event.category?.toLowerCase() || "";
    const eventTags = event.tags.map((tag) => tag.toLowerCase());

    return appliedHappyHourTypes.some((type) => {
      switch (type) {
        case "bars":
          return (
            eventTitle.includes("bar") ||
            eventTitle.includes("pub") ||
            eventCategory.includes("bar")
          );
        case "cocktails":
          return (
            eventTitle.includes("cocktail") ||
            eventTags.some((tag) => tag.includes("cocktail"))
          );
        case "wine":
          return (
            eventTitle.includes("wine") ||
            eventTags.some((tag) => tag.includes("wine"))
          );
        case "beer":
          return (
            eventTitle.includes("beer") ||
            eventTags.some((tag) => tag.includes("beer"))
          );
        case "non-alcoholic":
          return (
            eventTitle.includes("non-alcoholic") ||
            eventTitle.includes("mocktail") ||
            eventTags.some((tag) => tag.includes("non-alcoholic"))
          );
        case "rooftop":
          return (
            eventTitle.includes("rooftop") ||
            eventTags.some((tag) => tag.includes("rooftop"))
          );
        case "dive":
          return (
            eventTitle.includes("dive") ||
            eventTags.some((tag) => tag.includes("dive"))
          );
        case "speakeasy":
          return (
            eventTitle.includes("speakeasy") ||
            eventTags.some((tag) => tag.includes("speakeasy"))
          );
        default:
          return false;
      }
    });
  };

  // Helper function to check if post matches type filters
  const meetsPostTypeFilter = (post: Post): boolean => {
    if (appliedPostTypes.length === 0) return true;

    const postTitle = post.title?.toLowerCase() || "";
    const postMessage = post.message?.toLowerCase() || "";

    return appliedPostTypes.some((type) => {
      switch (type) {
        case "announcements":
          return post.isAnnouncement || postTitle.includes("announcement");
        case "personal":
          return (
            postTitle.includes("just") ||
            postTitle.includes("first time") ||
            postMessage.includes("looking for")
          );
        case "recommendations":
          return (
            postTitle.includes("recommend") || postMessage.includes("recommend")
          );
        case "questions":
          return (
            postTitle.includes("?") ||
            postMessage.includes("?") ||
            postTitle.includes("help")
          );
        case "events":
          return postTitle.includes("event") || postMessage.includes("event");
        case "photos":
          return post.images && post.images.length > 0;
        case "discussions":
          return (
            postTitle.includes("discuss") || postMessage.includes("thoughts")
          );
        case "tips":
          return (
            postTitle.includes("tip") ||
            postTitle.includes("advice") ||
            postMessage.includes("tip")
          );
        default:
          return false;
      }
    });
  };

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
        // Apply post type filter
        if (!meetsPostTypeFilter(post)) return;

        // Apply date filter to posts
        const hoursSincePost =
          (now.getTime() - post.createdAt.getTime()) / (1000 * 60 * 60);

        let includeInFeed = false;
        switch (selectedDateFilter) {
          case "today":
            includeInFeed = hoursSincePost < 24;
            break;
          case "this_week":
            includeInFeed = hoursSincePost < 168;
            break;
          case "this_weekend":
            const postDay = post.createdAt.getDay();
            includeInFeed =
              hoursSincePost < 168 && (postDay === 0 || postDay === 6);
            break;
          case "all":
          default:
            includeInFeed = true;
            break;
        }

        if (!includeInFeed) return;

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

        // Apply activity type filter
        if (!meetsMeetupActivityFilter(meetup)) return;

        // Apply preference-based filters
        const matchesPreferenceActivity = meetsPreferenceActivityFilter(meetup);
        const matchesGroupSize = meetsGroupSizeFilter(meetup);
        const matchesTime = meetsTimePreference(meetup);

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
        // Past meetups - don't show them
        else {
          return; // Skip past meetups entirely
        }

        // Apply preference priority boost (lower number = higher priority)
        let preferenceBoost = 0;
        if (matchesPreferenceActivity) preferenceBoost += 5;
        if (matchesGroupSize) preferenceBoost += 5;
        if (matchesTime) preferenceBoost += 5;

        priority = Math.max(1, priority - preferenceBoost);

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
        // Apply happy hour type filter
        if (!meetsHappyHourTypeFilter(event)) return;

        // Apply preference-based filters for events
        const matchesTime = meetsTimePreference(event);

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
        // Past events - don't show them
        else {
          return; // Skip past events entirely
        }

        // Apply preference priority boost for events
        let preferenceBoost = 0;
        if (matchesTime) preferenceBoost += 5;

        priority = Math.max(1, priority - preferenceBoost);

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
    appliedMeetupActivities,
    appliedHappyHourTypes,
    appliedPostTypes,
  ]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Reload all data from Supabase
      const [postsData, meetupsData, eventsData] = await Promise.all([
        SupabaseDataService.getPosts(),
        SupabaseDataService.getMeetups(),
        SupabaseDataService.getHappyHours(),
      ]);

      setPosts(postsData || []);
      setAllMeetups(meetupsData || []);
      setHappyHourEvents(eventsData || []);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleMeetupJoinChange = (meetupId: string, updatedMeetup: Meetup) => {
    console.log("🔄 [HomeScreen] Updating meetup after join/leave:", meetupId);
    setAllMeetups((prevMeetups) => {
      const updatedMeetups = prevMeetups.map((m) =>
        m.id === meetupId ? updatedMeetup : m
      );
      console.log("✅ [HomeScreen] Updated meetups array");
      return updatedMeetups;
    });
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

  const handleOpenFilterModal = () => {
    // Check if user has preferences and current filters are at default
    const hasPreferences =
      preferences.activityPreference.interests.length > 0 ||
      preferences.timePreference.availableTimes.length > 0 ||
      preferences.groupSizePreference.preferredSizes.length > 0;

    const isDefaultFilter =
      activeFilter === "all" &&
      selectedDateFilter === "all" &&
      appliedMeetupActivities.length === 0 &&
      appliedHappyHourTypes.length === 0 &&
      appliedPostTypes.length === 0;

    // If user has preferences and filters are at default, pre-populate with preferences
    if (hasPreferences && isDefaultFilter) {
      // Map preference activities to filter activities
      const preferenceActivities = preferences.activityPreference.interests
        .map((interest) => {
          switch (interest) {
            case "coffee":
              return "food";
            case "food":
              return "food";
            case "outdoor":
              return "outdoor";
            case "fitness":
              return "fitness";
            case "arts":
              return "art";
            case "music":
              return "art";
            case "movies":
              return "art";
            case "gaming":
              return "technology";
            case "books":
              return "art";
            case "travel":
              return "outdoor";
            case "volunteer":
              return "networking";
            case "networking":
              return "networking";
            case "learning":
              return "technology";
            case "photography":
              return "photography";
            case "cooking":
              return "food";
            default:
              return null;
          }
        })
        .filter(Boolean) as string[];

      setTempActiveFilter(activeFilter);
      setTempSelectedDateFilter(selectedDateFilter);
      setTempSelectedMeetupActivities(preferenceActivities);
      setTempSelectedHappyHourTypes(appliedHappyHourTypes);
      setTempSelectedPostTypes(appliedPostTypes);
    } else {
      // Use current applied filters
      setTempActiveFilter(activeFilter);
      setTempSelectedDateFilter(selectedDateFilter);
      setTempSelectedMeetupActivities(appliedMeetupActivities);
      setTempSelectedHappyHourTypes(appliedHappyHourTypes);
      setTempSelectedPostTypes(appliedPostTypes);
    }

    setShowFilterModal(true);

    // Animate modal content sliding up
    Animated.timing(modalSlideY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseFilterModal = () => {
    // Animate modal content sliding down
    Animated.timing(modalSlideY, {
      toValue: 800,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setShowFilterModal(false);
      // Reset animation value for next time
      modalSlideY.setValue(800);
    });
  };

  const handleApplyFilters = () => {
    // Apply the temp filters to the actual filters
    setActiveFilter(tempActiveFilter);
    setSelectedDateFilter(tempSelectedDateFilter);
    setAppliedMeetupActivities(tempSelectedMeetupActivities);
    setAppliedHappyHourTypes(tempSelectedHappyHourTypes);
    setAppliedPostTypes(tempSelectedPostTypes);

    // Scroll to top when applying filters
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);

    handleCloseFilterModal();
  };

  // Handle scroll events for app bar visibility
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDifference = currentScrollY - lastScrollY.current;

    // Only trigger if scroll difference is significant
    if (Math.abs(scrollDifference) > scrollThreshold) {
      if (scrollDifference > 0 && currentScrollY > scrollThreshold) {
        // Scrolling down - hide app bar
        if (isAppBarVisible) {
          setIsAppBarVisible(false);
        }
      } else if (scrollDifference < 0) {
        // Scrolling up - show app bar (any upward scroll, regardless of position)
        if (!isAppBarVisible) {
          setIsAppBarVisible(true);
        }
      }
      lastScrollY.current = currentScrollY;
    }

    // Update scroll position for animations
    scrollY.setValue(currentScrollY);
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

  // Helper function to check if content matches user preferences
  const matchesUserPreferences = (item: Meetup | Event): boolean => {
    if ("time" in item) {
      // It's a meetup
      const meetup = item as Meetup;
      const matchesActivity = meetsPreferenceActivityFilter(meetup);
      const matchesGroupSize = meetsGroupSizeFilter(meetup);
      const matchesTime = meetsTimePreference(meetup);

      // Count how many preferences match
      const matchCount = [
        matchesActivity,
        matchesGroupSize,
        matchesTime,
      ].filter(Boolean).length;
      return matchCount >= 2; // Show indicator if 2+ preferences match
    } else {
      // It's an event
      const event = item as Event;
      const matchesTime = meetsTimePreference(event);
      return matchesTime;
    }
  };

  const renderItem = ({ item }: { item: FeedItem }) => {
    switch (item.type) {
      case "happy_hour":
        const event = item.data as Event;
        const eventMatchesPreferences = matchesUserPreferences(event);
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
                // Route to HappyHourDetails for happy hour events
                navigation.navigate("HappyHourDetails", {
                  eventId: event.id,
                  event: serializedEvent,
                });
              }}
              style={styles.eventCard}
              matchesPreferences={eventMatchesPreferences}
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
              <Ionicons
                name="sparkles"
                size={20}
                color={colors.accentQuaternary}
              />
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
        const recommendedMatchesPreferences =
          matchesUserPreferences(recommendedMeetup);
        const isOwnRecommendedMeetup = currentUser
          ? recommendedMeetup.creatorId === currentUser.uid ||
            recommendedMeetup.creatorRef === currentUser.uid
          : false;

        return (
          <View style={styles.recommendedMeetupWrapper}>
            <EnhancedMeetupCard
              meetup={recommendedMeetup}
              onPress={() =>
                navigation.navigate("MeetupDetails", {
                  meetupId: recommendedMeetup.id,
                })
              }
              onEdit={
                isOwnRecommendedMeetup
                  ? () =>
                      navigation.navigate("EditMeetup", {
                        meetupId: recommendedMeetup.id,
                      })
                  : undefined
              }
              onJoinChange={handleMeetupJoinChange}
              onInterested={handleMeetupInterested}
              isInterested={interestedMeetups.has(recommendedMeetup.id)}
              matchesPreferences={recommendedMatchesPreferences}
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
        return <EnhancedPostCard post={post} />;

      case "meetup":
        const meetup = item.data as Meetup;
        const timeLabel = getTimeUntilMeetup(meetup.time);
        const isUpcoming =
          meetup.time.getTime() > new Date().getTime() &&
          meetup.time.getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;
        const meetupMatchesPreferences = matchesUserPreferences(meetup);

        const isOwnMeetup = currentUser
          ? meetup.creatorId === currentUser.uid ||
            meetup.creatorRef === currentUser.uid
          : false;

        return (
          <EnhancedMeetupCard
            meetup={meetup}
            onPress={() =>
              navigation.navigate("MeetupDetails", {
                meetupId: meetup.id,
                meetupData: meetup,
              })
            }
            onEdit={
              isOwnMeetup
                ? () =>
                    navigation.navigate("EditMeetup", { meetupId: meetup.id })
                : undefined
            }
            onInterested={handleMeetupInterested}
            isInterested={interestedMeetups.has(meetup.id)}
            timeLabel={timeLabel}
            isUpcoming={isUpcoming}
            matchesPreferences={meetupMatchesPreferences}
            onJoinChange={handleMeetupJoinChange}
          />
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
          Your feed is empty. Posts and meetups will appear here.
        </Text>
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
    <>
      {/* Dropdown Overlay - Full screen overlay like Instagram */}
      {showFeedModeDropdown && (
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowFeedModeDropdown(false)}
        />
      )}

      <View
        style={[
          activeFilter === "happy_hours"
            ? styles.containerCompact
            : styles.container,
          { backgroundColor: colors.background },
        ]}
      >
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
        <Animated.View style={[styles.appBarContainer]}>
          <View
            style={[
              styles.appBar,
              {
                backgroundColor: colors.background,
                borderBottomColor: colors.border,
              },
            ]}
          >
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
                onPress={handleOpenFilterModal}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="options-outline"
                  size={20}
                  color={colors.text}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: colors.surface }]}
                onPress={() => {
                  console.log(
                    "🔔 Bell icon pressed - navigating to NotificationsList"
                  );
                  try {
                    navigation.navigate("NotificationsList");
                    console.log(
                      "🔔 Navigation to NotificationsList successful"
                    );
                  } catch (error) {
                    console.error(
                      "🔔 Error navigating to NotificationsList:",
                      error
                    );
                  }
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={colors.text}
                />
                {notifications.filter((n) => !n.isRead).length > 0 && (
                  <View style={[styles.badge, { backgroundColor: "#F44336" }]}>
                    <Text style={styles.badgeText}>
                      {notifications.filter((n) => !n.isRead).length > 9
                        ? "9+"
                        : notifications.filter((n) => !n.isRead).length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

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
            style={{ flex: 1, zIndex: 1 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
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
          animationType="fade"
          onRequestClose={handleCloseFilterModal}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCloseFilterModal}
          >
            <Animated.View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.surface,
                  transform: [{ translateY: modalSlideY }],
                },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Feed Filters
                </Text>
                <TouchableOpacity
                  onPress={handleCloseFilterModal}
                  style={styles.modalClose}
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
              >
                {/* Content Type */}
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    CONTENT TYPE
                  </Text>
                  {[
                    { type: "all", label: "All", icon: "apps" },
                    { type: "meetups", label: "Meetups", icon: "people" },
                    { type: "posts", label: "Posts", icon: "newspaper" },
                    { type: "happy_hours", label: "Happy Hours", icon: "wine" },
                  ].map((filter) => {
                    const isActive = tempActiveFilter === filter.type;
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
                        onPress={() =>
                          setTempActiveFilter(filter.type as FilterType)
                        }
                        activeOpacity={0.7}
                      >
                        <View style={styles.modalOptionLeft}>
                          <Ionicons
                            name={filter.icon as any}
                            size={22}
                            color={
                              isActive ? colors.primary : colors.textSecondary
                            }
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
                            color={colors.accentQuaternary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Time Range */}
                <View style={styles.section}>
                  <Text
                    style={[
                      styles.sectionTitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    TIME RANGE
                  </Text>
                  {[
                    { type: "all", label: "All" },
                    { type: "today", label: "Today" },
                    { type: "this_week", label: "This Week" },
                    { type: "this_weekend", label: "This Weekend" },
                  ].map((filter) => {
                    const isActive = tempSelectedDateFilter === filter.type;
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
                        onPress={() =>
                          setTempSelectedDateFilter(filter.type as DateFilter)
                        }
                        activeOpacity={0.7}
                      >
                        <View style={styles.modalOptionLeft}>
                          <Ionicons
                            name="calendar-outline"
                            size={22}
                            color={
                              isActive ? colors.primary : colors.textSecondary
                            }
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
                            color={colors.accentQuaternary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Meetup Activity Filters */}
                {(tempActiveFilter === "all" ||
                  tempActiveFilter === "meetups") && (
                  <View style={styles.section}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: colors.textSecondary },
                      ]}
                    >
                      MEETUP ACTIVITIES
                    </Text>
                    {[
                      { id: "yoga", label: "Yoga & Wellness", icon: "leaf" },
                      { id: "fitness", label: "Fitness", icon: "fitness" },
                      {
                        id: "photography",
                        label: "Photography",
                        icon: "camera",
                      },
                      { id: "networking", label: "Networking", icon: "people" },
                      {
                        id: "food",
                        label: "Food & Cooking",
                        icon: "restaurant",
                      },
                      {
                        id: "art",
                        label: "Arts & Culture",
                        icon: "color-palette",
                      },
                      { id: "technology", label: "Technology", icon: "laptop" },
                      {
                        id: "outdoor",
                        label: "Outdoor Activities",
                        icon: "trail-sign",
                      },
                    ].map((activity) => {
                      const isSelected = tempSelectedMeetupActivities.includes(
                        activity.id
                      );
                      return (
                        <TouchableOpacity
                          key={activity.id}
                          style={[
                            styles.modalOption,
                            {
                              backgroundColor: isSelected
                                ? colors.primary + "10"
                                : "transparent",
                            },
                          ]}
                          onPress={() => {
                            setTempSelectedMeetupActivities((prev) =>
                              isSelected
                                ? prev.filter((id) => id !== activity.id)
                                : [...prev, activity.id]
                            );
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.modalOptionLeft}>
                            <Ionicons
                              name={activity.icon as any}
                              size={22}
                              color={
                                isSelected
                                  ? colors.primary
                                  : colors.textSecondary
                              }
                            />
                            <Text
                              style={[
                                styles.modalOptionText,
                                {
                                  color: isSelected
                                    ? colors.primary
                                    : colors.text,
                                  fontWeight: isSelected ? "600" : "500",
                                },
                              ]}
                            >
                              {activity.label}
                            </Text>
                          </View>
                          {isSelected && (
                            <Ionicons
                              name="checkmark-circle"
                              size={24}
                              color={colors.accentQuaternary}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Happy Hour Type Filters */}
                {(tempActiveFilter === "all" ||
                  tempActiveFilter === "happy_hours") && (
                  <View style={styles.section}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: colors.textSecondary },
                      ]}
                    >
                      HAPPY HOUR TYPES
                    </Text>
                    {[
                      { id: "bars", label: "Bars & Pubs", icon: "wine" },
                      {
                        id: "cocktails",
                        label: "Cocktail Lounges",
                        icon: "wine-outline",
                      },
                      { id: "wine", label: "Wine Bars", icon: "wine" },
                      { id: "beer", label: "Craft Beer", icon: "beer" },
                      {
                        id: "non-alcoholic",
                        label: "Non-Alcoholic",
                        icon: "leaf",
                      },
                      {
                        id: "rooftop",
                        label: "Rooftop Bars",
                        icon: "business",
                      },
                      { id: "dive", label: "Dive Bars", icon: "home" },
                      {
                        id: "speakeasy",
                        label: "Speakeasies",
                        icon: "lock-closed",
                      },
                    ].map((type) => {
                      const isSelected = tempSelectedHappyHourTypes.includes(
                        type.id
                      );
                      return (
                        <TouchableOpacity
                          key={type.id}
                          style={[
                            styles.modalOption,
                            {
                              backgroundColor: isSelected
                                ? colors.primary + "10"
                                : "transparent",
                            },
                          ]}
                          onPress={() => {
                            setTempSelectedHappyHourTypes((prev) =>
                              isSelected
                                ? prev.filter((id) => id !== type.id)
                                : [...prev, type.id]
                            );
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.modalOptionLeft}>
                            <Ionicons
                              name={type.icon as any}
                              size={22}
                              color={
                                isSelected
                                  ? colors.primary
                                  : colors.textSecondary
                              }
                            />
                            <Text
                              style={[
                                styles.modalOptionText,
                                {
                                  color: isSelected
                                    ? colors.primary
                                    : colors.text,
                                  fontWeight: isSelected ? "600" : "500",
                                },
                              ]}
                            >
                              {type.label}
                            </Text>
                          </View>
                          {isSelected && (
                            <Ionicons
                              name="checkmark-circle"
                              size={24}
                              color={colors.accentQuaternary}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* Post Type Filters */}
                {(tempActiveFilter === "all" ||
                  tempActiveFilter === "posts") && (
                  <View style={styles.section}>
                    <Text
                      style={[
                        styles.sectionTitle,
                        { color: colors.textSecondary },
                      ]}
                    >
                      POST TYPES
                    </Text>
                    {[
                      {
                        id: "announcements",
                        label: "Announcements",
                        icon: "megaphone",
                      },
                      {
                        id: "personal",
                        label: "Personal Updates",
                        icon: "person",
                      },
                      {
                        id: "recommendations",
                        label: "Recommendations",
                        icon: "star",
                      },
                      {
                        id: "questions",
                        label: "Questions",
                        icon: "help-circle",
                      },
                      { id: "events", label: "Event Posts", icon: "calendar" },
                      { id: "photos", label: "Photo Posts", icon: "camera" },
                      {
                        id: "discussions",
                        label: "Discussions",
                        icon: "chatbubbles",
                      },
                      { id: "tips", label: "Tips & Advice", icon: "bulb" },
                    ].map((type) => {
                      const isSelected = tempSelectedPostTypes.includes(
                        type.id
                      );
                      return (
                        <TouchableOpacity
                          key={type.id}
                          style={[
                            styles.modalOption,
                            {
                              backgroundColor: isSelected
                                ? colors.primary + "10"
                                : "transparent",
                            },
                          ]}
                          onPress={() => {
                            setTempSelectedPostTypes((prev) =>
                              isSelected
                                ? prev.filter((id) => id !== type.id)
                                : [...prev, type.id]
                            );
                          }}
                          activeOpacity={0.7}
                        >
                          <View style={styles.modalOptionLeft}>
                            <Ionicons
                              name={type.icon as any}
                              size={22}
                              color={
                                isSelected
                                  ? colors.primary
                                  : colors.textSecondary
                              }
                            />
                            <Text
                              style={[
                                styles.modalOptionText,
                                {
                                  color: isSelected
                                    ? colors.primary
                                    : colors.text,
                                  fontWeight: isSelected ? "600" : "500",
                                },
                              ]}
                            >
                              {type.label}
                            </Text>
                          </View>
                          {isSelected && (
                            <Ionicons
                              name="checkmark-circle"
                              size={24}
                              color={colors.accentQuaternary}
                            />
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </ScrollView>

              {/* Apply Button */}
              <TouchableOpacity
                style={[styles.applyButton, { backgroundColor: colors.accent }]}
                onPress={handleApplyFilters}
                activeOpacity={0.8}
              >
                <Text
                  style={[styles.applyButtonText, { color: colors.onAccent }]}
                >
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </Modal>

        {/* Expandable Floating Action Button */}
        <ExpandableFAB
          options={[
            {
              icon: "newspaper",
              label: "Create Post",
              onPress: () => navigation.navigate("CreatePost"),
              color: colors.accentSecondary, // Pink for posts
            },
            {
              icon: "people",
              label: "Create Meetup",
              onPress: handleCreateMeetup,
              color: colors.accentTertiary, // Green for meetups
            },
          ]}
        />

        {/* Feed Mode Dropdown - Instagram style - Outside container for proper overlay */}
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
              style={styles.feedModeOption}
              onPress={() => {
                setShowFeedModeDropdown(false);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.feedModeOptionLeft}>
                <Ionicons name="people" size={18} color={colors.primary} />
                <Text
                  style={[
                    styles.feedModeText,
                    {
                      color: colors.primary,
                      fontWeight: "600",
                    },
                  ]}
                >
                  For You
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.feedModeOption}
              onPress={() => {
                setShowFeedModeDropdown(false);
                navigation.navigate("Favorites");
              }}
              activeOpacity={0.7}
            >
              <View style={styles.feedModeOptionLeft}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.feedModeText,
                    {
                      color: colors.text,
                      fontWeight: "500",
                    },
                  ]}
                >
                  My Events
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.feedModeOption}
              onPress={() => {
                setShowFeedModeDropdown(false);
                navigation.navigate("Map");
              }}
              activeOpacity={0.7}
            >
              <View style={styles.feedModeOptionLeft}>
                <Ionicons
                  name="map-outline"
                  size={18}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.feedModeText,
                    {
                      color: colors.text,
                      fontWeight: "500",
                    },
                  ]}
                >
                  Map View
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
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
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Semi-transparent overlay like Instagram
    zIndex: 300,
    width: "100%",
    height: "100%",
  },
  appBarContainer: {
    height: 60, // Reduce height to bring content closer
    zIndex: 200,
    position: "relative",
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 4, // Reduce top padding
    paddingBottom: 8, // Reduce bottom padding
    borderBottomWidth: 0, // Remove the line under the app bar
    position: "relative",
    zIndex: 200,
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
    top: 110, // Adjust for shorter app bar (60px + status bar + padding)
    left: 16, // Align with the Evertwine text
    right: "auto",
    bottom: "auto",
    paddingVertical: 8,
    minWidth: 180, // Slightly wider
    zIndex: 400, // Higher than overlay
    borderRadius: 12, // Rounded corners
    // Ensure it doesn't affect layout
    width: "auto",
    height: "auto",
  },
  feedModeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14, // More padding like Instagram
  },
  feedModeOptionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // Space between icon and text
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
    paddingBottom: 200, // Increased to account for taller navbar (80px + 20px bottom + 100px clearance)
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
    marginBottom: 0,
  },
  eventCard: {
    marginBottom: 0,
  },
  recommendedMeetupWrapper: {
    marginBottom: 0,
  },
  meetupWrapper: {
    marginBottom: 0,
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
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32,
    height: "80%",
  },
  modalScrollView: {
    flex: 1,
    paddingBottom: 16,
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
