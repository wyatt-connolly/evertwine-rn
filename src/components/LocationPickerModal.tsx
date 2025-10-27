import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";

interface LocationPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

const { width, height } = Dimensions.get("window");

export default function LocationPickerModal({
  visible,
  onClose,
  onLocationSelect,
  initialLocation,
}: LocationPickerModalProps) {
  const { colors } = useThemeStore();

  const [region, setRegion] = useState<Region>({
    latitude: initialLocation?.latitude || 0,
    longitude: initialLocation?.longitude || 0,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(initialLocation || null);
  const [address, setAddress] = useState(initialLocation?.address || "");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPlacesList, setShowPlacesList] = useState(false);
  const mapRef = useRef<MapView>(null);

  // Define allowed regions (San Diego and Arizona)
  const ALLOWED_REGIONS = [
    {
      name: "San Diego",
      bounds: {
        northeast: { latitude: 33.0, longitude: -116.9 },
        southwest: { latitude: 32.5, longitude: -117.3 },
      },
    },
    {
      name: "Arizona",
      bounds: {
        northeast: { latitude: 37.0, longitude: -109.0 },
        southwest: { latitude: 31.0, longitude: -114.8 },
      },
    },
  ];

  const PLACE_CATEGORIES = [
    { id: "all", name: "All Places", icon: "location-outline" },
    { id: "bar", name: "Bars", icon: "wine-outline" },
    { id: "restaurant", name: "Restaurants", icon: "restaurant-outline" },
    { id: "attraction", name: "Attractions", icon: "camera-outline" },
    { id: "park", name: "Parks", icon: "leaf-outline" },
    { id: "beach", name: "Beaches", icon: "water-outline" },
  ];

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  // Early return after all hooks are declared
  if (!visible) {
    return null;
  }

  // Check if location is within allowed regions
  const isLocationAllowed = (latitude: number, longitude: number): boolean => {
    return ALLOWED_REGIONS.some((region) => {
      const { northeast, southwest } = region.bounds;
      return (
        latitude >= southwest.latitude &&
        latitude <= northeast.latitude &&
        longitude >= southwest.longitude &&
        longitude <= northeast.longitude
      );
    });
  };

  // Get current region name
  const getCurrentRegion = (latitude: number, longitude: number): string => {
    const region = ALLOWED_REGIONS.find((region) => {
      const { northeast, southwest } = region.bounds;
      return (
        latitude >= southwest.latitude &&
        latitude <= northeast.latitude &&
        longitude >= southwest.longitude &&
        longitude <= northeast.longitude
      );
    });
    return region?.name || "Unknown";
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to use this feature."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      // Check if location is within allowed regions
      if (
        !isLocationAllowed(location.coords.latitude, location.coords.longitude)
      ) {
        Alert.alert(
          "Location Not Supported",
          "This app currently only supports locations in San Diego and Arizona. Please use the map to select a location in these areas."
        );
        return;
      }

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(newRegion);
      setSelectedLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Reverse geocode to get address
      await reverseGeocode(location.coords.latitude, location.coords.longitude);

      // Load nearby places
      await loadNearbyPlaces(
        location.coords.latitude,
        location.coords.longitude
      );
    } catch (error) {
      console.error("Error getting current location:", error);
      Alert.alert("Error", "Could not get your current location.");
    } finally {
      setIsLoading(false);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      setIsGeocoding(true);
      const result = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (result.length > 0) {
        const addressObj = result[0];
        const formattedAddress = [
          addressObj.street,
          addressObj.city,
          addressObj.region,
          addressObj.postalCode,
        ]
          .filter(Boolean)
          .join(", ");

        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      setAddress("Address not found");
    } finally {
      setIsGeocoding(false);
    }
  };

  const loadNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      setIsLoadingPlaces(true);

      // Mock nearby places data for San Diego and Arizona
      const mockPlaces = [
        // San Diego places
        {
          id: 1,
          name: "Mavericks",
          category: "bar",
          latitude: 32.7157,
          longitude: -117.1611,
          address: "Mavericks, San Diego, CA",
        },
        {
          id: 2,
          name: "La Jolla Cove",
          category: "beach",
          latitude: 32.8478,
          longitude: -117.2732,
          address: "La Jolla Cove, La Jolla, CA",
        },
        {
          id: 3,
          name: "Pacific Beach Pier",
          category: "beach",
          latitude: 32.77,
          longitude: -117.253,
          address: "Pacific Beach Pier, San Diego, CA",
        },
        {
          id: 4,
          name: "Balboa Park",
          category: "park",
          latitude: 32.7343,
          longitude: -117.1443,
          address: "Balboa Park, San Diego, CA",
        },
        {
          id: 5,
          name: "Gaslamp Quarter",
          category: "attraction",
          latitude: 32.7115,
          longitude: -117.1601,
          address: "Gaslamp Quarter, San Diego, CA",
        },
        {
          id: 6,
          name: "Coronado Beach",
          category: "beach",
          latitude: 32.6859,
          longitude: -117.1831,
          address: "Coronado Beach, Coronado, CA",
        },
        {
          id: 7,
          name: "Old Town San Diego",
          category: "attraction",
          latitude: 32.7543,
          longitude: -117.1961,
          address: "Old Town San Diego, CA",
        },
        {
          id: 8,
          name: "Seaport Village",
          category: "attraction",
          latitude: 32.7108,
          longitude: -117.1703,
          address: "Seaport Village, San Diego, CA",
        },

        // Arizona places
        {
          id: 9,
          name: "Grand Canyon",
          category: "attraction",
          latitude: 36.1069,
          longitude: -112.1129,
          address: "Grand Canyon, AZ",
        },
        {
          id: 10,
          name: "Sedona Red Rocks",
          category: "attraction",
          latitude: 34.8697,
          longitude: -111.7609,
          address: "Sedona, AZ",
        },
        {
          id: 11,
          name: "Phoenix Desert Botanical Garden",
          category: "park",
          latitude: 33.4619,
          longitude: -111.9444,
          address: "Desert Botanical Garden, Phoenix, AZ",
        },
        {
          id: 12,
          name: "Antelope Canyon",
          category: "attraction",
          latitude: 36.8619,
          longitude: -111.3743,
          address: "Antelope Canyon, Page, AZ",
        },
        {
          id: 13,
          name: "Horseshoe Bend",
          category: "attraction",
          latitude: 36.8808,
          longitude: -111.5026,
          address: "Horseshoe Bend, Page, AZ",
        },
        {
          id: 14,
          name: "Saguaro National Park",
          category: "park",
          latitude: 32.297,
          longitude: -111.1665,
          address: "Saguaro National Park, Tucson, AZ",
        },
        {
          id: 15,
          name: "Monument Valley",
          category: "attraction",
          latitude: 36.9989,
          longitude: -110.1107,
          address: "Monument Valley, AZ",
        },
        {
          id: 16,
          name: "Havasu Falls",
          category: "attraction",
          latitude: 36.2556,
          longitude: -112.6992,
          address: "Havasu Falls, Supai, AZ",
        },
      ];

      // Filter places based on current region and distance
      const currentRegion = getCurrentRegion(latitude, longitude);
      const filteredPlaces = mockPlaces.filter((place) => {
        const placeRegion = getCurrentRegion(place.latitude, place.longitude);
        return placeRegion === currentRegion;
      });

      setNearbyPlaces(filteredPlaces);
    } catch (error) {
      console.error("Error loading nearby places:", error);
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const geocodeAddress = async (addressText: string) => {
    if (!addressText.trim()) return;

    try {
      setIsGeocoding(true);
      const result = await Location.geocodeAsync(addressText);

      if (result.length > 0) {
        const { latitude, longitude } = result[0];

        // Check if location is within allowed regions
        if (!isLocationAllowed(latitude, longitude)) {
          Alert.alert(
            "Location Not Supported",
            "This app currently only supports locations in San Diego and Arizona. Please select a location in these areas."
          );
          return;
        }

        const newRegion = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(newRegion);
        setSelectedLocation({ latitude, longitude });

        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }

        // Load nearby places for the new location
        await loadNearbyPlaces(latitude, longitude);
      } else {
        Alert.alert("Error", "Could not find the specified address.");
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
      Alert.alert("Error", "Could not find the specified address.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleMapPress = (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;

    // Check if location is within allowed regions
    if (!isLocationAllowed(latitude, longitude)) {
      Alert.alert(
        "Location Not Supported",
        "This app currently only supports locations in San Diego and Arizona. Please select a location in these areas."
      );
      return;
    }

    setSelectedLocation({ latitude, longitude });
    reverseGeocode(latitude, longitude);
    loadNearbyPlaces(latitude, longitude);
  };

  const handlePlaceSelect = (place: any) => {
    const newRegion = {
      latitude: place.latitude,
      longitude: place.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setRegion(newRegion);
    setSelectedLocation({
      latitude: place.latitude,
      longitude: place.longitude,
    });
    setAddress(place.address);

    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }

    setShowPlacesList(false);
  };

  const filteredPlaces = nearbyPlaces.filter((place) => {
    try {
      const matchesCategory =
        selectedCategory === "all" || place.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        (place.name &&
          place.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (place.address &&
          place.address.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    } catch (error) {
      console.error("Error filtering place:", error, place);
      return false;
    }
  });

  const handleConfirm = () => {
    if (selectedLocation) {
      onLocationSelect({
        ...selectedLocation,
        address,
      });
      onClose();
    }
  };

  const handleAddressSubmit = () => {
    geocodeAddress(address);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <Text style={[styles.headerButtonText, { color: colors.text }]}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Pick Location
          </Text>
          <TouchableOpacity
            onPress={handleConfirm}
            style={[
              styles.headerButton,
              !selectedLocation && styles.headerButtonDisabled,
            ]}
            disabled={!selectedLocation}
          >
            <Text
              style={[
                styles.headerButtonText,
                {
                  color: selectedLocation
                    ? colors.primary
                    : colors.textSecondary,
                },
              ]}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>

        {/* Places Search */}
        <View
          style={[
            styles.placesSearchContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <TextInput
            style={[
              styles.placesSearchInput,
              {
                backgroundColor: colors.background,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Search nearby places..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={(text) => {
              try {
                setSearchQuery(text);
              } catch (error) {
                console.error("Error updating search query:", error);
              }
            }}
          />
          <TouchableOpacity
            onPress={() => setShowPlacesList(!showPlacesList)}
            style={[
              styles.placesToggleButton,
              { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons name="list" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          {PLACE_CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    selectedCategory === category.id
                      ? colors.primary
                      : colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => {
                try {
                  setSelectedCategory(category.id);
                } catch (error) {
                  console.error("Error selecting category:", error);
                }
              }}
            >
              <Ionicons
                name={category.icon as keyof typeof Ionicons.glyphMap}
                size={14}
                color={selectedCategory === category.id ? "white" : colors.text}
              />
              <Text
                style={[
                  styles.categoryText,
                  {
                    color:
                      selectedCategory === category.id ? "white" : colors.text,
                  },
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Places List */}
        {showPlacesList && (
          <View
            style={[
              styles.placesListContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            <View style={styles.placesListHeader}>
              <Text style={[styles.placesListTitle, { color: colors.text }]}>
                Nearby Places ({filteredPlaces.length})
              </Text>
              <TouchableOpacity onPress={() => setShowPlacesList(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredPlaces || []}
              keyExtractor={(item) =>
                item?.id?.toString() || Math.random().toString()
              }
              renderItem={({ item }) => {
                if (!item) return null;
                return (
                  <TouchableOpacity
                    style={[
                      styles.placeItem,
                      { borderBottomColor: colors.border },
                    ]}
                    onPress={() => {
                      try {
                        handlePlaceSelect(item);
                      } catch (error) {
                        console.error("Error selecting place:", error);
                      }
                    }}
                  >
                    <View style={styles.placeInfo}>
                      <Text style={[styles.placeName, { color: colors.text }]}>
                        {item.name || "Unknown Place"}
                      </Text>
                      <Text
                        style={[
                          styles.placeAddress,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {item.address || "Address not available"}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                );
              }}
              style={styles.placesList}
            />
          </View>
        )}

        {/* Map */}
        <View style={styles.mapContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Getting your location...
              </Text>
            </View>
          ) : (
            <MapView
              ref={mapRef}
              style={styles.map}
              region={region}
              onPress={handleMapPress}
              showsUserLocation
              showsMyLocationButton={false}
            >
              {selectedLocation && (
                <Marker
                  coordinate={selectedLocation}
                  title="Selected Location"
                  description={address}
                />
              )}
              {nearbyPlaces.map((place) => (
                <Marker
                  key={place.id}
                  coordinate={{
                    latitude: place.latitude,
                    longitude: place.longitude,
                  }}
                  title={place.name}
                  description={place.address}
                  pinColor={
                    place.category === selectedCategory ||
                    selectedCategory === "all"
                      ? "red"
                      : "gray"
                  }
                />
              ))}
            </MapView>
          )}
        </View>

        {/* Current Location Button */}
        <TouchableOpacity
          style={[
            styles.currentLocationButton,
            { backgroundColor: colors.primary },
          ]}
          onPress={getCurrentLocation}
          disabled={isLoading}
        >
          <Ionicons name="locate" size={20} color="white" />
        </TouchableOpacity>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text
            style={[styles.instructionsText, { color: colors.textSecondary }]}
          >
            Tap on the map to select a location or search for an address
          </Text>
        </View>
      </View>
    </Modal>
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
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerButtonDisabled: {
    opacity: 0.5,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    fontSize: 16,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  currentLocationButton: {
    position: "absolute",
    top: 120,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  instructionsContainer: {
    padding: 16,
    alignItems: "center",
  },
  instructionsText: {
    fontSize: 14,
    textAlign: "center",
  },
  placesSearchContainer: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  placesSearchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    fontSize: 16,
  },
  placesToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginRight: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  placesListContainer: {
    maxHeight: 300,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  placesListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  placesListTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  placesList: {
    maxHeight: 200,
  },
  placeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  placeAddress: {
    fontSize: 14,
  },
});
