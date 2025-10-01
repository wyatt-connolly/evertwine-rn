import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { getMockMeetups, mockUsers } from "../../data/mockData";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { DataService } from "../../services/DataService";
import { Event } from "../../types";

// Happy Hour Events - San Diego locations
const getHappyHourEvents = (): Event[] => [
  {
    id: "hh1",
    title: "Wine & Cheese Tasting",
    description:
      "Join us for an evening of fine wines and artisanal cheeses from local producers.",
    venue: "Pacific Wine Bar",
    venueType: "Wine Bar",
    location: { latitude: 32.7941, longitude: -117.2533 },
    locationName: "Pacific Wine Bar",
    address: "1234 Garnet Ave, Pacific Beach, San Diego, CA",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ),
    timezone: "PST",
    category: "Food & Drink",
    subcategory: "Wine Tasting",
    tags: ["wine", "cheese", "tasting"],
    price: 25,
    currency: "USD",
    maxAttendees: 20,
    currentAttendees: 12,
    coverImage:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop",
    ],
    status: "published",
    isRecurring: false,
    features: {
      hasQRCode: true,
      hasTickets: true,
      hasCoupons: true,
      allowsSharing: true,
      requiresVerification: false,
    },
    views: 150,
    shares: 12,
    likes: 25,
    attendees: ["user1", "user2"],
    waitlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh2",
    title: "Craft Beer Happy Hour",
    description:
      "Sample the latest craft beers from local breweries. 50% off all drinks!",
    venue: "Mission Brewing Co.",
    venueType: "Brewery",
    location: { latitude: 32.7714, longitude: -117.2523 },
    locationName: "Mission Brewing Co.",
    address: "3456 Mission Blvd, Mission Beach, San Diego, CA",
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    endTime: new Date(
      Date.now() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ),
    timezone: "PST",
    category: "Food & Drink",
    subcategory: "Beer Tasting",
    tags: ["beer", "craft", "happy-hour"],
    price: 0,
    currency: "USD",
    maxAttendees: 50,
    currentAttendees: 28,
    coverImage:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
    ],
    status: "published",
    isRecurring: false,
    features: {
      hasQRCode: true,
      hasTickets: true,
      hasCoupons: true,
      allowsSharing: true,
      requiresVerification: false,
    },
    views: 200,
    shares: 18,
    likes: 35,
    attendees: ["user1", "user2", "user3"],
    waitlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh3",
    title: "Non-Alcoholic Mocktail Mixing",
    description:
      "Learn to create beautiful mocktails with fresh ingredients. Perfect for designated drivers!",
    venue: "La Jolla Garden Café",
    venueType: "Café",
    location: { latitude: 32.8328, longitude: -117.2713 },
    locationName: "La Jolla Garden Café",
    address: "7890 Girard Ave, La Jolla, San Diego, CA",
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    endTime: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ),
    timezone: "PST",
    category: "Food & Drink",
    subcategory: "Mocktail Mixing",
    tags: ["mocktails", "non-alcoholic", "mixology"],
    price: 15,
    currency: "USD",
    maxAttendees: 15,
    currentAttendees: 8,
    coverImage:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    ],
    status: "published",
    isRecurring: false,
    features: {
      hasQRCode: true,
      hasTickets: true,
      hasCoupons: true,
      allowsSharing: true,
      requiresVerification: false,
    },
    views: 120,
    shares: 8,
    likes: 18,
    attendees: ["user1", "user2"],
    waitlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh4",
    title: "Beachfront Sunset Cocktails",
    description:
      "Enjoy cocktails with an ocean view as the sun sets over the Pacific.",
    venue: "Pacific Terrace Lounge",
    venueType: "Beachfront Bar",
    location: { latitude: 32.7898, longitude: -117.2544 },
    locationName: "Pacific Terrace Lounge",
    address: "610 Diamond St, Pacific Beach, San Diego, CA",
    startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    endTime: new Date(
      Date.now() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ),
    timezone: "PST",
    category: "Food & Drink",
    subcategory: "Sunset Cocktails",
    tags: ["beachfront", "sunset", "cocktails"],
    price: 20,
    currency: "USD",
    maxAttendees: 30,
    currentAttendees: 18,
    coverImage:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
    ],
    status: "published",
    isRecurring: false,
    features: {
      hasQRCode: true,
      hasTickets: true,
      hasCoupons: true,
      allowsSharing: true,
      requiresVerification: false,
    },
    views: 180,
    shares: 15,
    likes: 28,
    attendees: ["user1", "user2", "user3"],
    waitlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh5",
    title: "Tapas & Sangria Night",
    description:
      "Authentic Spanish tapas paired with traditional sangria. ¡Olé!",
    venue: "La Jolla Tapas Bar",
    venueType: "Spanish Restaurant",
    location: { latitude: 32.842, longitude: -117.275 },
    locationName: "La Jolla Tapas Bar",
    address: "1155 Prospect St, La Jolla, San Diego, CA",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endTime: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ),
    timezone: "PST",
    category: "Food & Drink",
    subcategory: "Spanish Cuisine",
    tags: ["tapas", "sangria", "spanish"],
    price: 35,
    currency: "USD",
    maxAttendees: 25,
    currentAttendees: 15,
    coverImage:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    ],
    status: "published",
    isRecurring: false,
    features: {
      hasQRCode: true,
      hasTickets: true,
      hasCoupons: true,
      allowsSharing: true,
      requiresVerification: false,
    },
    views: 220,
    shares: 20,
    likes: 42,
    attendees: ["user1", "user2", "user3", "user4"],
    waitlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh6",
    title: "Surf & Sip Saturday",
    description:
      "Beach vibes with refreshing drinks and live music by the boardwalk.",
    venue: "Mission Beach Bar & Grill",
    venueType: "Beach Bar",
    location: { latitude: 32.768, longitude: -117.251 },
    locationName: "Mission Beach Bar & Grill",
    address: "3001 Ocean Front Walk, Mission Beach, San Diego, CA",
    startTime: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
    endTime: new Date(
      Date.now() + 6 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000
    ),
    timezone: "PST",
    category: "Food & Drink",
    subcategory: "Beach Party",
    tags: ["beach", "live-music", "drinks"],
    price: 10,
    currency: "USD",
    maxAttendees: 60,
    currentAttendees: 35,
    coverImage:
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    ],
    status: "published",
    isRecurring: false,
    features: {
      hasQRCode: true,
      hasTickets: true,
      hasCoupons: true,
      allowsSharing: true,
      requiresVerification: false,
    },
    views: 280,
    shares: 25,
    likes: 50,
    attendees: ["user1", "user2", "user3", "user4", "user5"],
    waitlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh7",
    title: "Wine Down Wednesday",
    description:
      "Midweek wind-down with half-price wine bottles and live acoustic music.",
    venue: "Clairemont Wine Cellar",
    venueType: "Wine Shop & Bar",
    location: { latitude: 32.8234, longitude: -117.2009 },
    locationName: "Clairemont Wine Cellar",
    address: "5500 Clairemont Mesa Blvd, Clairemont, San Diego, CA",
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    endTime: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ),
    timezone: "PST",
    category: "Food & Drink",
    subcategory: "Wine Night",
    tags: ["wine", "live-music", "midweek", "acoustic"],
    price: 15,
    currency: "USD",
    maxAttendees: 40,
    currentAttendees: 22,
    coverImage:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
    ],
    status: "published",
    isRecurring: false,
    features: {
      hasQRCode: true,
      hasTickets: true,
      hasCoupons: true,
      allowsSharing: true,
      requiresVerification: false,
    },
    views: 190,
    shares: 14,
    likes: 32,
    attendees: ["user1", "user2", "user3"],
    waitlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh8",
    title: "Local Brewery Tasting Flight",
    description:
      "Sample 6 local craft beers with complimentary pretzel bites. Perfect for beer enthusiasts!",
    venue: "Clairemont Tap House",
    venueType: "Tap House",
    location: { latitude: 32.819, longitude: -117.198 },
    locationName: "Clairemont Tap House",
    address: "4670 Clairemont Dr, Clairemont, San Diego, CA",
    startTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    endTime: new Date(
      Date.now() + 8 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ),
    timezone: "PST",
    category: "Food & Drink",
    subcategory: "Beer Tasting",
    tags: ["beer", "tasting", "craft", "local"],
    price: 18,
    currency: "USD",
    maxAttendees: 35,
    currentAttendees: 20,
    coverImage:
      "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400&h=300&fit=crop",
    ],
    status: "published",
    isRecurring: false,
    features: {
      hasQRCode: true,
      hasTickets: true,
      hasCoupons: true,
      allowsSharing: true,
      requiresVerification: false,
    },
    views: 210,
    shares: 16,
    likes: 38,
    attendees: ["user1", "user2"],
    waitlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function MapScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "meetups" | "happy_hours"
  >("all");
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Only load mock data in developer mode
  const meetups = DataService.isInDeveloperMode() ? getMockMeetups() : [];
  const happyHours = DataService.isInDeveloperMode()
    ? getHappyHourEvents()
    : [];

  const getCreatorInfo = (creatorId: string) => {
    return mockUsers.find((user) => user.uid === creatorId);
  };

  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedMarker(null);
  };

  // Get current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        setIsLoading(true);

        // Request location permission
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Location Permission",
            "Location permission is required to show your current location on the map.",
            [{ text: "OK" }]
          );
          setLocationPermission(false);
          setIsLoading(false);
          return;
        }

        setLocationPermission(true);

        // Get current location
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
      } catch (error) {
        console.error("Error getting location:", error);
        Alert.alert(
          "Location Error",
          "Unable to get your current location. Please try again.",
          [{ text: "OK" }]
        );
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentLocation();
  }, []);

  const isMeetup = (marker: any) => {
    return marker && typeof marker === "object" && "creatorId" in marker;
  };

  const isHappyHour = (marker: any) => {
    return marker && typeof marker === "object" && "venue" in marker;
  };

  const renderMap = () => {
    try {
      // Get initial region based on current location or default
      const getInitialRegion = () => {
        if (currentLocation) {
          return {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };
        }
        // Default to Pacific Beach, San Diego if no location
        return {
          latitude: 32.7941,
          longitude: -117.2533,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
      };

      return (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={getInitialRegion()}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
          >
            {/* Only show markers in developer mode */}
            {DataService.isInDeveloperMode() && (
              <>
                {/* Meetup Markers */}
                {selectedFilter !== "happy_hours" &&
                  meetups.map((meetup) => (
                    <Marker
                      key={meetup.id}
                      coordinate={{
                        latitude: meetup.location.latitude,
                        longitude: meetup.location.longitude,
                      }}
                      pinColor={colors.primary}
                      tracksViewChanges={false}
                      onPress={() => {
                        console.log("🗺️ Marker pressed for meetup:", meetup.id);
                        handleMarkerPress(meetup);
                      }}
                    />
                  ))}

                {/* Happy Hour Event Markers */}
                {selectedFilter !== "meetups" &&
                  happyHours.map((event) => (
                    <Marker
                      key={event.id}
                      coordinate={{
                        latitude: event.location.latitude,
                        longitude: event.location.longitude,
                      }}
                      pinColor="#FFB800"
                      tracksViewChanges={false}
                      onPress={() => {
                        console.log(
                          "🗺️ Marker pressed for happy hour:",
                          event.id
                        );
                        handleMarkerPress(event);
                      }}
                    />
                  ))}
              </>
            )}
          </MapView>
        </View>
      );
    } catch (error) {
      // Fallback for when react-native-maps is not available
      return (
        <View
          style={[
            styles.mapContainer,
            { backgroundColor: colors.surfaceVariant },
          ]}
        >
          <View style={styles.mapContent}>
            <Ionicons
              name="map-outline"
              size={64}
              color={colors.textTertiary}
            />
            <Text
              style={[
                styles.mapPlaceholderText,
                { color: colors.textSecondary },
              ]}
            >
              Interactive Map
            </Text>
            <Text style={[styles.mapSubtext, { color: colors.textTertiary }]}>
              Map integration requires native build
            </Text>
          </View>
        </View>
      );
    }
  };

  const renderFilterButton = (
    filter: "all" | "meetups" | "happy_hours",
    label: string,
    icon: string
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { backgroundColor: colors.surface },
        selectedFilter === filter && { backgroundColor: colors.primary },
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Ionicons
        name={icon as any}
        size={16}
        color={
          selectedFilter === filter ? colors.onPrimary : colors.textSecondary
        }
      />
      <Text
        style={[
          styles.filterButtonText,
          {
            color:
              selectedFilter === filter
                ? colors.onPrimary
                : colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Show loading state while getting location
  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Ionicons name="location-outline" size={48} color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Getting your location...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show location permission error
  if (!locationPermission) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Ionicons name="location-outline" size={48} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            Location permission required
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
            Please enable location access to use the map
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Map</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton("all", "All", "grid-outline")}
        {renderFilterButton("meetups", "Meetups", "people-outline")}
        {renderFilterButton("happy_hours", "Happy Hours", "wine-outline")}
      </View>

      {/* Map */}
      {renderMap()}

      {/* Dialog Modal */}
      <Modal
        visible={dialogVisible && selectedMarker !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDialog}
      >
        <Pressable style={styles.modalOverlay} onPress={closeDialog}>
          <Pressable
            style={[
              styles.dialogContainer,
              { backgroundColor: colors.surface },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.dialogHeader}>
              <Ionicons
                name={
                  isMeetup(selectedMarker)
                    ? "people-outline"
                    : isHappyHour(selectedMarker)
                    ? "wine-outline"
                    : "location-outline"
                }
                size={24}
                color={
                  isMeetup(selectedMarker)
                    ? colors.primary
                    : isHappyHour(selectedMarker)
                    ? "#FFB800"
                    : colors.secondary
                }
              />
              <Text style={[styles.dialogTitle, { color: colors.text }]}>
                {selectedMarker?.title || selectedMarker?.name || "Unknown"}
              </Text>
              <TouchableOpacity
                onPress={closeDialog}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Image Section */}
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri:
                    selectedMarker?.coverImage ||
                    selectedMarker?.photos?.[0] ||
                    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=200&fit=crop",
                }}
                style={styles.dialogImage}
                resizeMode="cover"
              />
            </View>

            {/* Creator Section (only for meetups) */}
            {isMeetup(selectedMarker) &&
              (() => {
                const creator = getCreatorInfo(selectedMarker.creatorId);
                return (
                  <View style={styles.creatorSection}>
                    <View style={styles.creatorInfo}>
                      <Image
                        source={{
                          uri:
                            creator?.profilePictures?.[0] ||
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                        }}
                        style={styles.creatorAvatar}
                      />
                      <View style={styles.creatorDetails}>
                        <Text
                          style={[styles.creatorName, { color: colors.text }]}
                        >
                          {creator?.displayName || "Unknown Creator"}
                        </Text>
                        <Text
                          style={[
                            styles.creatorRole,
                            { color: colors.textSecondary },
                          ]}
                        >
                          Event Organizer
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity style={styles.followButton}>
                      <Text
                        style={[
                          styles.followButtonText,
                          { color: colors.primary },
                        ]}
                      >
                        Follow
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })()}

            <Text
              style={[
                styles.dialogDescription,
                { color: colors.textSecondary },
              ]}
            >
              {selectedMarker?.description || "No description available"}
            </Text>

            <View style={styles.dialogDetails}>
              <View style={styles.detailRow}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={colors.primary}
                />
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  {selectedMarker?.locationName ||
                    selectedMarker?.address ||
                    "Location not available"}
                </Text>
              </View>

              {isMeetup(selectedMarker) ? (
                <>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={colors.primary}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {selectedMarker?.time?.toLocaleDateString() ||
                        "Date not available"}{" "}
                      at{" "}
                      {selectedMarker?.time?.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) || "Time not available"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="people-outline"
                      size={16}
                      color={colors.primary}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {selectedMarker?.currentParticipants || 0} /{" "}
                      {selectedMarker?.maxParticipants || 0} participants
                    </Text>
                  </View>
                  {selectedMarker?.activity && (
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="fitness-outline"
                        size={16}
                        color={colors.primary}
                      />
                      <Text
                        style={[
                          styles.detailText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {selectedMarker.activity}
                      </Text>
                    </View>
                  )}
                </>
              ) : isHappyHour(selectedMarker) ? (
                <>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color="#FFB800"
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {selectedMarker?.startTime?.toLocaleDateString() ||
                        "Date not available"}{" "}
                      at{" "}
                      {selectedMarker?.startTime?.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) || "Time not available"}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="people-outline" size={16} color="#FFB800" />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {selectedMarker?.currentAttendees || 0} /{" "}
                      {selectedMarker?.maxAttendees || 0} attendees
                    </Text>
                  </View>
                  {selectedMarker?.price !== undefined && (
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="pricetag-outline"
                        size={16}
                        color="#FFB800"
                      />
                      <Text
                        style={[
                          styles.detailText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {selectedMarker.price === 0
                          ? "Free"
                          : `$${selectedMarker.price}`}
                      </Text>
                    </View>
                  )}
                  {selectedMarker?.venue && (
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="business-outline"
                        size={16}
                        color="#FFB800"
                      />
                      <Text
                        style={[
                          styles.detailText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {selectedMarker.venue} ({selectedMarker.venueType})
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <>
                  <View style={styles.detailRow}>
                    <Ionicons
                      name="pricetag-outline"
                      size={16}
                      color={colors.secondary}
                    />
                    <Text
                      style={[
                        styles.detailText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {selectedMarker?.category || "Category not available"}
                    </Text>
                  </View>
                  {selectedMarker?.rating && (
                    <View style={styles.detailRow}>
                      <Ionicons name="star" size={16} color="#FFD700" />
                      <Text
                        style={[
                          styles.detailText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {selectedMarker.rating} (
                        {selectedMarker.reviewCount || 0} reviews)
                      </Text>
                    </View>
                  )}
                  {selectedMarker?.features && (
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={16}
                        color={colors.secondary}
                      />
                      <Text
                        style={[
                          styles.detailText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {selectedMarker.features.slice(0, 3).join(", ")}
                        {selectedMarker.features.length > 3 ? "..." : ""}
                      </Text>
                    </View>
                  )}
                </>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.viewDetailsButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => {
                if (isMeetup(selectedMarker)) {
                  navigation.navigate("MeetupDetails", {
                    meetupId: selectedMarker.id,
                  });
                } else if (isHappyHour(selectedMarker)) {
                  const serializedEvent = {
                    ...selectedMarker,
                    startTime: selectedMarker.startTime?.toISOString(),
                    endTime: selectedMarker.endTime?.toISOString(),
                    createdAt: selectedMarker.createdAt?.toISOString(),
                    updatedAt: selectedMarker.updatedAt?.toISOString(),
                  };
                  navigation.navigate("EventDetails", {
                    eventId: selectedMarker.id,
                    event: serializedEvent,
                  });
                }
                closeDialog();
              }}
            >
              <Text
                style={[styles.viewDetailsText, { color: colors.onPrimary }]}
              >
                View Details
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Bottom Info */}
      <View style={[styles.bottomInfo, { backgroundColor: colors.surface }]}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendMarker, { backgroundColor: colors.primary }]}
            />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Meetups ({meetups.length})
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendMarker, { backgroundColor: "#FFB800" }]}
            />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Happy Hours ({happyHours.length})
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.myLocationButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="locate" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  mapContainer: {
    flex: 1,
    height: 400,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  dialogContainer: {
    width: "100%",
    maxWidth: 400,
    maxHeight: 600,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 12,
  },
  imageContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  dialogImage: {
    width: "100%",
    height: 120,
    borderRadius: 12,
  },
  creatorSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },
  creatorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  creatorDetails: {
    flex: 1,
  },
  creatorName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  creatorRole: {
    fontSize: 12,
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 122, 255, 0.3)",
  },
  followButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  dialogHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dialogTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  dialogDescription: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  dialogDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  viewDetailsButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 16,
    fontWeight: "600",
  },
  mapContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  mapSubtext: {
    fontSize: 14,
    marginTop: 4,
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  legend: {
    flexDirection: "row",
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
  myLocationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
