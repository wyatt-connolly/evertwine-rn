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
import { getMockMeetups, getMockPlaces, mockUsers } from "../../data/mockData";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { DataService } from "../../services/DataService";

export default function MapScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "meetups" | "places"
  >("all");
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Only load mock data in developer mode
  const meetups = DataService.isInDeveloperMode() ? getMockMeetups() : [];
  const places = DataService.isInDeveloperMode() ? getMockPlaces() : [];

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
        // Default to San Francisco if no location
        return {
          latitude: 37.7749,
          longitude: -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
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
                {selectedFilter !== "places" &&
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

                {/* Place Markers */}
                {selectedFilter !== "meetups" &&
                  places.map((place) => (
                    <Marker
                      key={place.id}
                      coordinate={{
                        latitude: place.location.latitude,
                        longitude: place.location.longitude,
                      }}
                      pinColor={colors.secondary}
                      tracksViewChanges={false}
                      onPress={() => {
                        console.log("🗺️ Marker pressed for place:", place.id);
                        handleMarkerPress(place);
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
    filter: "all" | "meetups" | "places",
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
        {renderFilterButton("places", "Places", "location-outline")}
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
                    : "location-outline"
                }
                size={24}
                color={
                  isMeetup(selectedMarker) ? colors.primary : colors.secondary
                }
              />
              <Text style={[styles.dialogTitle, { color: colors.text }]}>
                {selectedMarker &&
                typeof selectedMarker === "object" &&
                "name" in selectedMarker
                  ? selectedMarker.name
                  : selectedMarker?.title || "Unknown"}
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
                  uri: isMeetup(selectedMarker)
                    ? selectedMarker?.coverImage ||
                      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400&h=200&fit=crop"
                    : selectedMarker?.photos?.[0] ||
                      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop",
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
                  {selectedMarker &&
                  typeof selectedMarker === "object" &&
                  "locationName" in selectedMarker
                    ? selectedMarker.locationName
                    : selectedMarker?.address || "Location not available"}
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
                } else if (selectedMarker) {
                  navigation.navigate("PlaceDetails", {
                    placeId: selectedMarker.id,
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
              style={[
                styles.legendMarker,
                { backgroundColor: colors.secondary },
              ]}
            />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Places ({places.length})
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
