import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
// Removed useFavoritesStore - using Supabase only
import { useAuthStore } from "../../hooks/useAuthStore";
// Removed mock data imports - using Supabase only
import { Meetup, Event } from "../../types";
import EventCard from "../../components/EventCard";
import EnhancedMeetupCard from "../../components/EnhancedMeetupCard";
import { SupabaseDataService } from "../../services/SupabaseDataService";

export default function FavoritesScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  // Removed useFavoritesStore destructuring - using Supabase only

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"favorites" | "joined">(
    "favorites"
  );
  const [favoriteMeetupsData, setFavoriteMeetupsData] = useState<Meetup[]>([]);
  const [favoriteHappyHoursData, setFavoriteHappyHoursData] = useState<Event[]>(
    []
  );
  const [joinedMeetupsData, setJoinedMeetupsData] = useState<Meetup[]>([]);
  const [joinedHappyHoursData, setJoinedHappyHoursData] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from Supabase
  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const loadUserData = async () => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    try {
      // Use Supabase data
      const [favorites, joinedMeetups, joinedEvents] = await Promise.all([
        SupabaseDataService.getUserFavorites(currentUser.uid),
        SupabaseDataService.getUserJoinedMeetups(currentUser.uid),
        SupabaseDataService.getUserJoinedEvents(currentUser.uid),
      ]);

      setFavoriteMeetupsData(favorites.meetups);
      setFavoriteHappyHoursData(favorites.events);
      setJoinedMeetupsData(joinedMeetups);
      setJoinedHappyHoursData(joinedEvents);
    } catch (error) {
      console.error("Error loading user data:", error);
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
            if (currentUser) {
              try {
                await SupabaseDataService.removeFromFavorites(
                  currentUser.uid,
                  meetup.id,
                  "meetup"
                );
                // Reload data after removal
                await loadUserData();
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
            if (currentUser) {
              try {
                await SupabaseDataService.removeFromFavorites(
                  currentUser.uid,
                  event.id,
                  "event"
                );
                // Reload data after removal
                await loadUserData();
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
        {(["favorites", "joined"] as const).map((tab) => (
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
                : `Joined (${getTabCount(tab)})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
});
