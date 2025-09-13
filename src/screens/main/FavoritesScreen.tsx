import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useFavoritesStore } from "../../hooks/useFavoritesStore";
import {
  getMockMeetups,
  getMockEvents,
  getMockPlaces,
} from "../../data/mockData";
import { Meetup, Event, Place } from "../../types";

export default function FavoritesScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const {
    favoriteMeetups,
    favoriteEvents,
    favoritePlaces,
    removeMeetupFromFavorites,
    removeEventFromFavorites,
    removePlaceFromFavorites,
  } = useFavoritesStore();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"meetups" | "events" | "places">(
    "meetups"
  );

  const allMeetups = getMockMeetups();
  const allEvents = getMockEvents();
  const allPlaces = getMockPlaces();

  const favoriteMeetupsData = allMeetups.filter((meetup) =>
    favoriteMeetups.includes(meetup.id)
  );
  const favoriteEventsData = allEvents.filter((event) =>
    favoriteEvents.includes(event.id)
  );
  const favoritePlacesData = allPlaces.filter((place) =>
    favoritePlaces.includes(place.id)
  );

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const renderMeetupCard = (meetup: Meetup) => (
    <TouchableOpacity
      key={meetup.id}
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={() =>
        navigation.navigate("MeetupDetails", { meetupId: meetup.id })
      }
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {meetup.title}
        </Text>
        <TouchableOpacity
          onPress={() => removeMeetupFromFavorites(meetup.id)}
          style={styles.favoriteButton}
        >
          <Ionicons name="heart" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
        {meetup.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.cardInfo}>
          <Ionicons name="location-outline" size={14} color={colors.primary} />
          <Text style={[styles.cardLocation, { color: colors.textSecondary }]}>
            {meetup.locationName}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text style={[styles.cardTime, { color: colors.textSecondary }]}>
            {formatDate(meetup.time)} • {formatTime(meetup.time)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {event.title}
        </Text>
        <TouchableOpacity
          onPress={() => removeEventFromFavorites(event.id)}
          style={styles.favoriteButton}
        >
          <Ionicons name="heart" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
        {event.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.cardInfo}>
          <Ionicons name="location-outline" size={14} color={colors.primary} />
          <Text style={[styles.cardLocation, { color: colors.textSecondary }]}>
            {event.locationName}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text style={[styles.cardTime, { color: colors.textSecondary }]}>
            {formatDate(event.startTime)} • {formatTime(event.startTime)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderPlaceCard = (place: Place) => (
    <TouchableOpacity
      key={place.id}
      style={[styles.card, { backgroundColor: colors.surface }]}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          {place.name}
        </Text>
        <TouchableOpacity
          onPress={() => removePlaceFromFavorites(place.id)}
          style={styles.favoriteButton}
        >
          <Ionicons name="heart" size={20} color={colors.error} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
        {place.description}
      </Text>

      <View style={styles.cardFooter}>
        <View style={styles.cardInfo}>
          <Ionicons name="location-outline" size={14} color={colors.primary} />
          <Text style={[styles.cardLocation, { color: colors.textSecondary }]}>
            {place.address}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={[styles.cardRating, { color: colors.textSecondary }]}>
            {place.rating}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
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
      case "meetups":
        return favoriteMeetups.length;
      case "events":
        return favoriteEvents.length;
      case "places":
        return favoritePlaces.length;
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
          Favorites
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {(["meetups", "events", "places"] as const).map((tab) => (
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
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({getTabCount(tab)})
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
          {activeTab === "meetups" && (
            <>
              {favoriteMeetupsData.length > 0
                ? favoriteMeetupsData.map(renderMeetupCard)
                : renderEmptyState("meetups")}
            </>
          )}

          {activeTab === "events" && (
            <>
              {favoriteEventsData.length > 0
                ? favoriteEventsData.map(renderEventCard)
                : renderEmptyState("events")}
            </>
          )}

          {activeTab === "places" && (
            <>
              {favoritePlacesData.length > 0
                ? favoritePlacesData.map(renderPlaceCard)
                : renderEmptyState("places")}
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
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardLocation: {
    fontSize: 12,
    marginLeft: 4,
  },
  cardTime: {
    fontSize: 12,
    marginLeft: 4,
  },
  cardRating: {
    fontSize: 12,
    marginLeft: 4,
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
