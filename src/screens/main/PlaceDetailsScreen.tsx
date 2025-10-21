import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useFavoritesStore } from "../../hooks/useFavoritesStore";
import { Place, PlaceReview } from "../../types";
import { getMockPlaces, getMockPlaceReviews } from "../../data/mockData";
import Snackbar from "../../components/Snackbar";

const { width } = Dimensions.get("window");

interface PlaceDetailsScreenProps {
  route: {
    params: {
      placeId: string;
      place?: Place;
    };
  };
  navigation: any;
}

export default function PlaceDetailsScreen({
  route,
  navigation,
}: PlaceDetailsScreenProps) {
  const { colors } = useThemeStore();
  const {
    favoritePlaces,
    addPlaceToFavorites,
    removePlaceFromFavorites,
    isPlaceFavorite,
  } = useFavoritesStore();
  const placeId = route.params?.placeId;
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Get place data - use provided place or find from mock data
  const mockPlaces = getMockPlaces();
  const place = route.params?.place || mockPlaces.find((p) => p.id === placeId);
  const reviews = getMockPlaceReviews(placeId);

  // If no place is found, show error or go back
  if (!place) {

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
            Place Details
          </Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons
            name="location-outline"
            size={64}
            color={colors.textTertiary}
          />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Place not found
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
            This place may have been removed or the link is invalid.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleFavorite = () => {
    if (!place) return;

    const isFavorite = isPlaceFavorite(place.id);

    if (isFavorite) {
      removePlaceFromFavorites(place.id);
      setSnackbarMessage("Removed from favorites");
    } else {
      addPlaceToFavorites(place.id);
      setSnackbarMessage("Added to favorites");
    }

    setShowSnackbar(true);
  };

  const handleSnackbarAction = () => {
    setShowSnackbar(false);
    navigation.navigate("Favorites");
  };

  const handleShare = () => {
    Alert.alert("Share", "Share functionality coming soon!");
  };

  const handleGetDirections = () => {
    Alert.alert("Directions", "Opening directions in maps app...");
  };

  const handleCall = () => {
    Alert.alert("Call", "Calling place...");
  };

  const handleWebsite = () => {
    Alert.alert("Website", "Opening website...");
  };

  const formatHours = () => {
    const today = new Date()
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const todayHours = place.hours[today];

    if (todayHours?.closed) {
      return "Closed today";
    }

    if (todayHours) {
      return `Open today ${todayHours.open} - ${todayHours.close}`;
    }

    return "Hours not available";
  };

  const renderImageCarousel = () => (
    <View style={styles.imageCarousel}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setSelectedImageIndex(index);
        }}
      >
        {place.photos.map((photo, index) => (
          <Image
            key={index}
            source={{ uri: photo }}
            style={styles.placeImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {place.photos.length > 1 && (
        <View style={styles.imageIndicators}>
          {place.photos.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index === selectedImageIndex
                      ? colors.primary
                      : colors.textTertiary + "40",
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.surface }]}
        onPress={handleFavorite}
      >
        <Ionicons
          name={place && isPlaceFavorite(place.id) ? "heart" : "heart-outline"}
          size={20}
          color={
            place && isPlaceFavorite(place.id) ? colors.error : colors.primary
          }
        />
        <Text style={[styles.actionButtonText, { color: colors.primary }]}>
          {place && isPlaceFavorite(place.id) ? "Saved" : "Save"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.surface }]}
        onPress={handleShare}
      >
        <Ionicons name="share-outline" size={20} color={colors.primary} />
        <Text style={[styles.actionButtonText, { color: colors.primary }]}>
          Share
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.surface }]}
        onPress={handleGetDirections}
      >
        <Ionicons name="navigate-outline" size={20} color={colors.primary} />
        <Text style={[styles.actionButtonText, { color: colors.primary }]}>
          Directions
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContactInfo = () => (
    <View style={[styles.contactSection, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Contact & Info
      </Text>

      <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
        <Ionicons name="call-outline" size={20} color={colors.primary} />
        <Text style={[styles.contactText, { color: colors.text }]}>Call</Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.textTertiary}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.contactItem} onPress={handleWebsite}>
        <Ionicons name="globe-outline" size={20} color={colors.primary} />
        <Text style={[styles.contactText, { color: colors.text }]}>
          Website
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={colors.textTertiary}
        />
      </TouchableOpacity>

      <View style={styles.contactItem}>
        <Ionicons name="time-outline" size={20} color={colors.primary} />
        <Text style={[styles.contactText, { color: colors.text }]}>
          {formatHours()}
        </Text>
      </View>
    </View>
  );

  const renderFeatures = () => (
    <View style={[styles.featuresSection, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Features
      </Text>
      <View style={styles.featuresGrid}>
        {place.features.map((feature, index) => (
          <View
            key={index}
            style={[
              styles.featureTag,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Text style={[styles.featureText, { color: colors.primary }]}>
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderReviews = () => (
    <View style={[styles.reviewsSection, { backgroundColor: colors.surface }]}>
      <View style={styles.reviewsHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Reviews ({place.reviewCount})
        </Text>
        <TouchableOpacity>
          <Text style={[styles.seeAllText, { color: colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {reviews.slice(0, 3).map((review) => (
        <View key={review.id} style={styles.reviewItem}>
          <View style={styles.reviewHeader}>
            <Image
              source={{ uri: review.userAvatar }}
              style={styles.reviewerAvatar}
            />
            <View style={styles.reviewerInfo}>
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
            {review.verified && (
              <View
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="checkmark" size={12} color={colors.onPrimary} />
              </View>
            )}
          </View>

          <Text style={[styles.reviewText, { color: colors.text }]}>
            {review.review}
          </Text>

          <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
            {review.visitDate.toLocaleDateString()}
          </Text>
        </View>
      ))}
    </View>
  );

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
          {place.name}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderImageCarousel()}

        <View style={styles.content}>
          <View style={styles.placeHeader}>
            <View style={styles.placeTitleContainer}>
              <Text style={[styles.placeName, { color: colors.text }]}>
                {place.name}
              </Text>
              <Text
                style={[styles.placeCategory, { color: colors.textSecondary }]}
              >
                {place.category}
              </Text>
            </View>

            <View style={styles.ratingContainer}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={[styles.rating, { color: colors.text }]}>
                  {place.rating}
                </Text>
              </View>
              <Text
                style={[styles.reviewCount, { color: colors.textSecondary }]}
              >
                {place.reviewCount} reviews
              </Text>
            </View>
          </View>

          <View style={styles.priceAndLocation}>
            <View style={styles.priceLevel}>
              {Array.from({ length: place.priceLevel }, (_, i) => (
                <Text
                  key={i}
                  style={[styles.dollarSign, { color: colors.primary }]}
                >
                  $
                </Text>
              ))}
            </View>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={[styles.address, { color: colors.textSecondary }]}>
                {place.address}
              </Text>
            </View>
          </View>

          {place.description && (
            <Text style={[styles.description, { color: colors.text }]}>
              {place.description}
            </Text>
          )}

          {renderActionButtons()}
          {renderContactInfo()}
          {renderFeatures()}
          {renderReviews()}
        </View>
      </ScrollView>

      <Snackbar
        visible={showSnackbar}
        message={snackbarMessage}
        actionText="View Favorites"
        onAction={handleSnackbarAction}
        onDismiss={() => setShowSnackbar(false)}
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
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerRight: {
    width: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  imageCarousel: {
    position: "relative",
  },
  placeImage: {
    width: width,
    height: 250,
  },
  imageIndicators: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  content: {
    padding: 16,
  },
  placeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  placeTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  placeName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  placeCategory: {
    fontSize: 16,
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
  },
  priceAndLocation: {
    marginBottom: 16,
  },
  priceLevel: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dollarSign: {
    fontSize: 16,
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  address: {
    fontSize: 14,
    marginLeft: 4,
    flex: 1,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  contactSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  featuresSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewsSection: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  contactText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  featureTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featureText: {
    fontSize: 14,
    fontWeight: "500",
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  reviewItem: {
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  reviewerInfo: {
    flex: 1,
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
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  reviewText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
  },
});
