import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  Dimensions
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { getMockPlaces, getMockPlaceReviews, getMockEvents } from "../../data/mockData";
import { Place, PlaceReview, Event } from "../../types";

const { width } = Dimensions.get("window");

export default function ExploreScreen() {
  const { colors } = useThemeStore();
  const [activeTab, setActiveTab] = useState<"places" | "events" | "reviews">("places");
  const [searchQuery, setSearchQuery] = useState("");

  const mockPlaces = getMockPlaces();
  const mockEvents = getMockEvents();
  const mockReviews = getMockPlaceReviews("place1");

  const renderPlaceCard = (place: Place) => (
    <TouchableOpacity 
      key={place.id}
      style={[styles.placeCard, { backgroundColor: colors.surface }]}
    >
      <Image source={{ uri: place.photos[0] }} style={styles.placeImage} />
      <View style={styles.placeContent}>
        <View style={styles.placeHeader}>
          <Text style={[styles.placeName, { color: colors.text }]}>
            {place.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.rating, { color: colors.text }]}>
              {place.rating}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.placeCategory, { color: colors.textSecondary }]}>
          {place.category}
        </Text>
        
        <Text style={[styles.placeAddress, { color: colors.textSecondary }]}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          {place.address}
        </Text>
        
        <View style={styles.placeFeatures}>
          {place.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={[styles.featureTag, { backgroundColor: colors.primary + "20" }]}>
              <Text style={[styles.featureText, { color: colors.primary }]}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.placeFooter}>
          <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
            {place.reviewCount} reviews
          </Text>
          <View style={styles.priceLevel}>
            {Array.from({ length: place.priceLevel }, (_, i) => (
              <Text key={i} style={[styles.dollarSign, { color: colors.textSecondary }]}>$</Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          {event.locationName}
        </Text>
        
        <View style={styles.eventFooter}>
          <View style={styles.eventTime}>
            <Ionicons name="calendar-outline" size={14} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.primary }]}>
              {event.startTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </Text>
          </View>
          <View style={styles.eventStats}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              {event.currentAttendees} going
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderReviewCard = (review: PlaceReview) => (
    <View 
      key={review.id}
      style={[styles.reviewCard, { backgroundColor: colors.surface }]}
    >
      <View style={styles.reviewHeader}>
        <View style={styles.reviewerInfo}>
          <Image source={{ uri: review.userAvatar }} style={styles.reviewerAvatar} />
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
          <View style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}>
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
          <Ionicons name="thumbs-up-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.helpfulText, { color: colors.textSecondary }]}>
            {review.helpful} helpful
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
        <TouchableOpacity style={styles.mapButton}>
          <Ionicons name="map-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search places, events..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {(["places", "events", "reviews"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: colors.primary }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.onPrimary : colors.textSecondary }
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
                Popular Places
              </Text>
              {mockPlaces.map(renderPlaceCard)}
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

          {activeTab === "reviews" && (
            <>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Recent Reviews
              </Text>
              {mockReviews.map(renderReviewCard)}
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
  placeCard: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  placeImage: {
    width: 100,
    height: 100,
  },
  placeContent: {
    flex: 1,
    padding: 12,
  },
  placeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  placeCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  placeFeatures: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  featureTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 4,
  },
  featureText: {
    fontSize: 10,
    fontWeight: "500",
  },
  placeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewCount: {
    fontSize: 12,
  },
  priceLevel: {
    flexDirection: "row",
  },
  dollarSign: {
    fontSize: 12,
    fontWeight: "600",
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
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  eventStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    fontSize: 12,
    marginLeft: 4,
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
