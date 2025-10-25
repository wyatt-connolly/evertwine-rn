import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useFavoritesStore } from "../../hooks/useFavoritesStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { Meetup, Event, Post } from "../../types";
import EventCard from "../../components/EventCard";
import EnhancedMeetupCard from "../../components/EnhancedMeetupCard";
import { SupabaseDataService } from "../../services/SupabaseDataService";

export default function FavoritesScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const {
    favoriteMeetups,
    favoriteEvents,
    removeMeetupFromFavorites,
    removeEventFromFavorites,
  } = useFavoritesStore();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "favorites" | "joined" | "created"
  >("favorites");
  const [favoriteMeetupsData, setFavoriteMeetupsData] = useState<Meetup[]>([]);
  const [favoriteHappyHoursData, setFavoriteHappyHoursData] = useState<Event[]>(
    []
  );
  const [joinedMeetupsData, setJoinedMeetupsData] = useState<Meetup[]>([]);
  const [joinedHappyHoursData, setJoinedHappyHoursData] = useState<Event[]>([]);
  const [createdMeetupsData, setCreatedMeetupsData] = useState<Meetup[]>([]);
  const [createdHappyHoursData, setCreatedHappyHoursData] = useState<Event[]>(
    []
  );
  const [createdPostsData, setCreatedPostsData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase or fallback to mock data
  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  // Refresh data when screen comes into focus (e.g., returning from edit screens)
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser) {
        loadUserData();
      }
    }, [currentUser])
  );

  const loadUserData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Load data from Supabase
      const [allMeetups, allEvents, allPosts] = await Promise.all([
        SupabaseDataService.getMeetups(100),
        SupabaseDataService.getHappyHours(100),
        SupabaseDataService.getPosts(),
      ]);

      // Filter favorite meetups and events
      setFavoriteMeetupsData(
        allMeetups.filter((meetup) => favoriteMeetups.includes(meetup.id))
      );
      setFavoriteHappyHoursData(
        allEvents.filter((event) => favoriteEvents.includes(event.id))
      );

      // Filter created events (events where user is the creator)
      setCreatedMeetupsData(
        allMeetups.filter((meetup) => meetup.creatorId === currentUser.uid)
      );
      setCreatedHappyHoursData(
        allEvents.filter((event) => event.organizerId === currentUser.uid)
      );
      setCreatedPostsData(
        allPosts.filter((post) => post.userId === currentUser.uid)
      );

      // Filter joined events (events user joined but didn't create)
      setJoinedMeetupsData(
        allMeetups.filter(
          (meetup) =>
            meetup.participants?.includes(currentUser.uid) &&
            meetup.creatorId !== currentUser.uid
        )
      );
      setJoinedHappyHoursData(
        allEvents.filter(
          (event) =>
            event.attendees?.includes(currentUser.uid) &&
            event.organizerId !== currentUser.uid
        )
      );
    } catch (error) {
      console.error("Error loading user data:", error);
      // Fallback to empty arrays on error
      setFavoriteMeetupsData([]);
      setFavoriteHappyHoursData([]);
      setJoinedMeetupsData([]);
      setJoinedHappyHoursData([]);
      setCreatedMeetupsData([]);
      setCreatedHappyHoursData([]);
      setCreatedPostsData([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const renderFavoriteMeetupCard = (meetup: Meetup) => (
    <EnhancedMeetupCard
      key={meetup.id}
      meetup={meetup}
      onPress={() =>
        navigation.navigate("MeetupDetails", { meetupId: meetup.id })
      }
      customActionButton={
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={async () => {
            removeMeetupFromFavorites(meetup.id);
            if (currentUser) {
              try {
                await SupabaseDataService.removeFromFavorites(
                  currentUser.uid,
                  meetup.id,
                  "meetup"
                );
              } catch (error) {
                console.error("Error removing meetup from favorites:", error);
              }
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="heart-dislike" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Unfavorite</Text>
        </TouchableOpacity>
      }
    />
  );

  const renderJoinedMeetupCard = (meetup: Meetup) => (
    <EnhancedMeetupCard
      key={meetup.id}
      meetup={meetup}
      onPress={() =>
        navigation.navigate("MeetupDetails", { meetupId: meetup.id })
      }
      customActionButton={
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.textSecondary },
          ]}
          onPress={() => {
            // Handle leave meetup logic here
            alert(`Left meetup: ${meetup.title}`);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="exit-outline" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Leave</Text>
        </TouchableOpacity>
      }
    />
  );

  const renderFavoriteHappyHourCard = (event: Event) => (
    <EventCard
      key={event.id}
      event={event}
      style={{ backgroundColor: colors.surface }}
      onPress={() => {
        navigation.navigate("HappyHourDetails", { eventId: event.id, event });
      }}
      customActionButton={
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error }]}
          onPress={async () => {
            removeEventFromFavorites(event.id);
            if (currentUser) {
              try {
                await SupabaseDataService.removeFromFavorites(
                  currentUser.uid,
                  event.id,
                  "event"
                );
              } catch (error) {
                console.error("Error removing event from favorites:", error);
              }
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="heart-dislike" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Unfavorite</Text>
        </TouchableOpacity>
      }
    />
  );

  const renderJoinedHappyHourCard = (event: Event) => (
    <EventCard
      key={event.id}
      event={event}
      style={{ backgroundColor: colors.surface }}
      onPress={() => {
        navigation.navigate("HappyHourDetails", { eventId: event.id, event });
      }}
      customActionButton={
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.textSecondary },
          ]}
          onPress={() => {
            // Handle leave event logic here
            alert(`Left event: ${event.title}`);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="exit-outline" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Leave</Text>
        </TouchableOpacity>
      }
    />
  );

  const renderCreatedMeetupCard = (meetup: Meetup) => (
    <EnhancedMeetupCard
      key={meetup.id}
      meetup={meetup}
      onPress={() => {
        navigation.navigate("MeetupDetails", { meetupId: meetup.id });
      }}
      customActionButton={
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            // Navigate to edit meetup or show management options
            navigation.navigate("EditMeetup", { meetupId: meetup.id });
          }}
        >
          <Ionicons name="create-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      }
    />
  );

  const renderCreatedHappyHourCard = (event: Event) => (
    <EventCard
      key={event.id}
      event={event}
      style={{ backgroundColor: colors.surface }}
      onPress={() => {
        navigation.navigate("HappyHourDetails", { eventId: event.id, event });
      }}
      customActionButton={
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            // Navigate to edit event or show management options
            // For now, just show the event details
            navigation.navigate("HappyHourDetails", {
              eventId: event.id,
              event,
            });
          }}
        >
          <Ionicons name="create-outline" size={16} color={colors.primary} />
        </TouchableOpacity>
      }
    />
  );

  const renderCreatedPostCard = (post: Post) => (
    <View
      key={post.id}
      style={[
        styles.postCard,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <TouchableOpacity
        style={styles.postContent}
        onPress={() => {
          navigation.navigate("PostDetails", { post });
        }}
      >
        <View style={styles.postHeader}>
          <Text style={[styles.postTitle, { color: colors.text }]}>
            {post.title}
          </Text>
          <Text style={[styles.postTime, { color: colors.textSecondary }]}>
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <Text
          style={[styles.postMessage, { color: colors.text }]}
          numberOfLines={3}
        >
          {post.message}
        </Text>
        {post.images && post.images.length > 0 && (
          <View style={styles.postImages}>
            <Image source={{ uri: post.images[0] }} style={styles.postImage} />
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: colors.primary + "15" }]}
        onPress={() => {
          navigation.navigate("EditPost", { postId: post.id });
        }}
      >
        <Ionicons name="create-outline" size={16} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = (type: string) => (
    <View style={styles.emptyState}>
      <Ionicons name="heart-outline" size={64} color={colors.textTertiary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No favorite {type} yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        Start exploring and add {type} to your favorites!
      </Text>
    </View>
  );

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "favorites":
        return favoriteMeetupsData.length + favoriteHappyHoursData.length;
      case "joined":
        return joinedMeetupsData.length + joinedHappyHoursData.length;
      case "created":
        return (
          createdMeetupsData.length +
          createdHappyHoursData.length +
          createdPostsData.length
        );
      default:
        return 0;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          My Events
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {(["favorites", "joined", "created"] as const).map((tab) => (
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
                    activeTab === tab ? colors.onPrimary : colors.textSecondary,
                },
              ]}
            >
              {tab === "favorites"
                ? `Favorites (${getTabCount(tab)})`
                : tab === "joined"
                ? `Joined (${getTabCount(tab)})`
                : `Created (${getTabCount(tab)})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading your events...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.content}>
            {activeTab === "favorites" && (
              <>
                {favoriteMeetupsData.length > 0 ||
                favoriteHappyHoursData.length > 0 ? (
                  <>
                    {favoriteMeetupsData.map(renderFavoriteMeetupCard)}
                    {favoriteHappyHoursData.map(renderFavoriteHappyHourCard)}
                  </>
                ) : (
                  renderEmptyState("favorites")
                )}
              </>
            )}

            {activeTab === "joined" && (
              <>
                {joinedMeetupsData.length > 0 ||
                joinedHappyHoursData.length > 0 ? (
                  <>
                    {joinedMeetupsData.map(renderJoinedMeetupCard)}
                    {joinedHappyHoursData.map(renderJoinedHappyHourCard)}
                  </>
                ) : (
                  renderEmptyState("joined events")
                )}
              </>
            )}

            {activeTab === "created" && (
              <>
                {createdMeetupsData.length > 0 ||
                createdHappyHoursData.length > 0 ||
                createdPostsData.length > 0 ? (
                  <>
                    {createdMeetupsData.map(renderCreatedMeetupCard)}
                    {createdHappyHoursData.map(renderCreatedHappyHourCard)}
                    {createdPostsData.map(renderCreatedPostCard)}
                  </>
                ) : (
                  renderEmptyState("created events")
                )}
              </>
            )}
          </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  editButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  postCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  postContent: {
    padding: 16,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  postTime: {
    fontSize: 12,
  },
  postMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  postImages: {
    marginTop: 8,
  },
  postImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
});
