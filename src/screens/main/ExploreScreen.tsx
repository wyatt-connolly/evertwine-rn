import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import {
  getMockPlaces,
  getMockPlaceReviews,
  getMockEvents,
  getMockMeetups,
} from "../../data/mockData";
import { Place, PlaceReview, Event, Meetup } from "../../types";
import PlaceCard from "../../components/PlaceCard";
import EventCard from "../../components/EventCard";
import MeetupCard from "../../components/MeetupCard";

const { width } = Dimensions.get("window");

export default function ExploreScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { meetups: localMeetups } = useMeetupStore();
  const [activeTab, setActiveTab] = useState<"places" | "events" | "meetups">(
    "places"
  );
  const [searchQuery, setSearchQuery] = useState("");

  const mockPlaces = getMockPlaces();
  const mockEvents = getMockEvents();
  const mockReviews = getMockPlaceReviews("place1");
  const mockMeetups = getMockMeetups();

  // Combine local and mock meetups
  const allMeetups = [...localMeetups, ...mockMeetups];

  const renderPlaceCard = (place: Place) => (
    <PlaceCard
      key={place.id}
      place={place}
      style={{ backgroundColor: colors.surface }}
      onPress={() => {
        navigation.navigate("PlaceDetails", { placeId: place.id, place });
      }}
    />
  );

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

  const renderReviewCard = (review: PlaceReview) => (
    <View
      key={review.id}
      style={[styles.reviewCard, { backgroundColor: colors.surface }]}
    >
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Image
            source={{ uri: review.userAvatar }}
            style={styles.reviewerAvatar}
          />
          <View>
            <Text style={[styles.reviewerName, { color: colors.text }]}>
              {review.userName}
            </Text>
            <View style={styles.reviewRating}>
              {Array.from({ length: 5 }, (_, i) => (
                <Ionicons
                  key={i}
                  name={i < review.rating ? "star" : "star-outline"}
                  size={12}
                  color="#FFD700"
                />
              ))}
            </View>
          </View>
        </View>
        {review.verified && (
          <View
            style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="checkmark" size={12} color={colors.onPrimary} />
          </View>
        )}
      </View>

      <Text style={[styles.reviewText, { color: colors.text }]}>
        {review.review}
      </Text>

      {review.photos.length > 0 && (
        <Image source={{ uri: review.photos[0] }} style={styles.reviewImage} />
      )}

      <View style={styles.reviewFooter}>
        <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
          {review.visitDate.toLocaleDateString()}
        </Text>
        <View style={styles.helpfulContainer}>
          <Ionicons
            name="thumbs-up-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={[styles.helpfulText, { color: colors.textSecondary }]}>
            {review.helpful} helpful
          </Text>
        </View>
      </View>
    </View>
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
        <TouchableOpacity
          style={styles.mapButton}
          onPress={() => navigation.navigate("Map")}
        >
          <Ionicons name="map-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View
        style={[styles.searchContainer, { backgroundColor: colors.surface }]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textSecondary}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search places, events..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {(["places", "events", "meetups"] as const).map((tab) => (
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
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {activeTab === "places" && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {searchQuery ? `Search Results` : "Popular Places"}
              </Text>
              {searchQuery
                ? mockPlaces
                    .filter(
                      (place) =>
                        place.name
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        place.description
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                    .map(renderPlaceCard)
                : mockPlaces.map(renderPlaceCard)}
            </>
          )}

          {activeTab === "events" && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Featured Events
              </Text>
              {mockEvents.map(renderEventCard)}
            </>
          )}

          {activeTab === "meetups" && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {searchQuery
                  ? `Meetups matching "${searchQuery}"`
                  : "Live Meetups"}
              </Text>
              {searchQuery
                ? allMeetups
                    .filter(
                      (meetup) =>
                        meetup.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        meetup.description
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        meetup.tags.some((tag) =>
                          tag.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                    )
                    .map(renderMeetupCard)
                : allMeetups.map(renderMeetupCard)}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  mapButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  reviewCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  reviewRating: {
    flexDirection: "row",
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  reviewImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewDate: {
    fontSize: 12,
  },
  helpfulContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  helpfulText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
