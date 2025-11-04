import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import {
  GOOGLE_PLACES_API_KEY,
  GOOGLE_PLACES_ENDPOINTS,
  GOOGLE_PLACES_CONFIG,
} from "../config/googlePlaces";

interface Place {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  distance?: number; // Distance in miles
}

interface LocationSearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onPlaceSelect: (place: {
    place_id: string;
    description: string;
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  placeholder?: string;
  style?: any;
}

export default function LocationSearchInput({
  value,
  onChangeText,
  onPlaceSelect,
  placeholder = "Search for a location...",
  style,
}: LocationSearchInputProps) {
  const { colors } = useThemeStore();
  const [suggestions, setSuggestions] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [placeSelected, setPlaceSelected] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Calculate distance between two coordinates in miles (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Debounced search function
  const searchPlaces = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHasSearched(false);
      setNoResults(false);
      return;
    }

    // Check if API key is configured
    if (
      !GOOGLE_PLACES_API_KEY ||
      GOOGLE_PLACES_API_KEY === "YOUR_GOOGLE_PLACES_API_KEY"
    ) {
      console.warn(
        "Google Places API key not configured. Please add your API key to src/config/googlePlaces.ts"
      );
      Alert.alert(
        "Configuration Required",
        "Google Places API key is not configured. Please add your API key to enable location search."
      );
      return;
    }

    try {
      setIsLoading(true);
      const bounds = `${GOOGLE_PLACES_CONFIG.BOUNDS.southwest.lat},${GOOGLE_PLACES_CONFIG.BOUNDS.southwest.lng}|${GOOGLE_PLACES_CONFIG.BOUNDS.northeast.lat},${GOOGLE_PLACES_CONFIG.BOUNDS.northeast.lng}`;

      // Use current location if available, otherwise use default
      const locationParam = currentLocation
        ? `${currentLocation.latitude},${currentLocation.longitude}`
        : GOOGLE_PLACES_CONFIG.LOCATION;

      // Use smaller radius (5km) when we have current location to prioritize very nearby places
      const radiusParam = currentLocation ? 5000 : GOOGLE_PLACES_CONFIG.RADIUS;

      // Build URL - don't use bounds when we have current location to get nearby results
      const boundsParam = currentLocation ? "" : `&bounds=${bounds}`;
      const strictBoundsParam = currentLocation
        ? "false"
        : GOOGLE_PLACES_CONFIG.STRICT_BOUNDS;

      const url = `${
        GOOGLE_PLACES_ENDPOINTS.AUTOCOMPLETE
      }?input=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}&types=${
        GOOGLE_PLACES_CONFIG.TYPES
      }&components=${
        GOOGLE_PLACES_CONFIG.COMPONENTS
      }&location=${locationParam}&radius=${radiusParam}&strictbounds=${strictBoundsParam}${boundsParam}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "OK") {
        const predictions = data.predictions || [];

        // If we have current location, also do a Text Search to get distance-ranked results
        let textSearchResults: Place[] = [];
        if (currentLocation) {
          try {
            // Note: rankby=distance requires a type parameter, so we'll use rankby=prominence with radius instead
            // Actually, for Text Search, we can't use rankby=distance without a type. Let's use rankby=prominence with radius.
            // But we want distance-ranked results, so let's use Nearby Search instead which supports rankby=distance better.
            // Actually, let's just use Text Search with a small radius and let our distance calculation and sorting handle it.
            const textSearchUrl = `${
              GOOGLE_PLACES_ENDPOINTS.TEXT_SEARCH
            }?query=${encodeURIComponent(
              query
            )}&location=${locationParam}&radius=${Math.min(
              radiusParam,
              10000
            )}&key=${GOOGLE_PLACES_API_KEY}`;

            const textSearchResponse = await fetch(textSearchUrl);
            const textSearchData = await textSearchResponse.json();

            if (textSearchData.status === "OK" && textSearchData.results) {
              textSearchResults = textSearchData.results.map((result: any) => {
                const distance = calculateDistance(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  result.geometry.location.lat,
                  result.geometry.location.lng
                );
                return {
                  place_id: result.place_id,
                  description: result.formatted_address,
                  structured_formatting: {
                    main_text: result.name,
                    secondary_text: result.formatted_address,
                  },
                  distance,
                };
              });
            }
          } catch (error) {
            console.error("Error in Text Search:", error);
          }
        }

        // Combine autocomplete and text search results, deduplicate by place_id
        const allPlaces = [...textSearchResults, ...predictions];
        const placeMap = new Map<string, Place>();

        // Text search results first (they're already distance-ranked), then autocomplete
        textSearchResults.forEach((place) =>
          placeMap.set(place.place_id, place)
        );
        predictions.forEach((place) => {
          if (!placeMap.has(place.place_id)) {
            placeMap.set(place.place_id, place);
          }
        });

        const combinedPlaces = Array.from(placeMap.values());

        // If we have current location, fetch details for all predictions to calculate distances
        if (currentLocation && combinedPlaces.length > 0) {
          try {
            const placesWithDistance = await Promise.all(
              combinedPlaces.map(async (place: Place) => {
                // If distance already calculated from text search, use it
                if (place.distance !== undefined) {
                  return place;
                }

                try {
                  const detailsResponse = await fetch(
                    `${GOOGLE_PLACES_ENDPOINTS.DETAILS}?place_id=${place.place_id}&fields=geometry&key=${GOOGLE_PLACES_API_KEY}`
                  );
                  const detailsData = await detailsResponse.json();
                  if (
                    detailsData.status === "OK" &&
                    detailsData.result?.geometry
                  ) {
                    const { lat, lng } = detailsData.result.geometry.location;
                    const distance = calculateDistance(
                      currentLocation.latitude,
                      currentLocation.longitude,
                      lat,
                      lng
                    );
                    return { ...place, distance };
                  }
                } catch (error) {
                  // Silently fail for individual place details
                }
                return place;
              })
            );
            // Sort by distance and set suggestions
            const sortedPlaces = placesWithDistance.sort((a, b) => {
              const distA = a.distance ?? Infinity;
              const distB = b.distance ?? Infinity;
              return distA - distB;
            });
            setSuggestions(sortedPlaces);
          } catch (error) {
            // If batch fetching fails, just show predictions without distances
            setSuggestions(combinedPlaces);
          }
        } else {
          setSuggestions(combinedPlaces);
        }
        setShowSuggestions(true);
        setHasSearched(true);
        setNoResults(predictions.length === 0);
      } else if (data.status === "ZERO_RESULTS") {
        setSuggestions([]);
        setShowSuggestions(true);
        setHasSearched(true);
        setNoResults(true);
      } else {
        console.error(
          "Google Places API error:",
          data.status,
          data.error_message
        );
        setSuggestions([]);
        setShowSuggestions(false);
        setHasSearched(false);
        setNoResults(false);
        Alert.alert(
          "Search Error",
          "Unable to search for locations. Please try again."
        );
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      setSuggestions([]);
      setShowSuggestions(false);
      setHasSearched(false);
      setNoResults(false);
      Alert.alert(
        "Network Error",
        "Unable to connect to location services. Please check your internet connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle text input with debouncing
  const handleTextChange = (text: string) => {
    onChangeText(text);

    // If user is typing (changing the text), reset placeSelected flag
    if (text !== value) {
      setPlaceSelected(false);
    }

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Reset search states when user types
    if (text.length < 2) {
      setHasSearched(false);
      setNoResults(false);
      setShowSuggestions(false);
    }

    // Set new timeout for debounced search
    debounceRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 300);
  };

  // Get place details and coordinates
  const getPlaceDetails = async (placeId: string) => {
    // Check if API key is configured
    if (
      !GOOGLE_PLACES_API_KEY ||
      GOOGLE_PLACES_API_KEY === "YOUR_GOOGLE_PLACES_API_KEY"
    ) {
      Alert.alert(
        "Configuration Required",
        "Google Places API key is not configured. Please add your API key to enable location search."
      );
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `${GOOGLE_PLACES_ENDPOINTS.DETAILS}?place_id=${placeId}&fields=geometry,formatted_address&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "OK" && data.result) {
        const { geometry, formatted_address } = data.result;
        const { lat, lng } = geometry.location;

        onPlaceSelect({
          place_id: placeId,
          description: value,
          latitude: lat,
          longitude: lng,
          address: formatted_address,
        });

        // Mark that a place has been selected and hide suggestions
        setPlaceSelected(true);
        setShowSuggestions(false);
        setSuggestions([]);
        setNoResults(false);
        setHasSearched(false);
      } else {
        console.error(
          "Google Places Details API error:",
          data.status,
          data.error_message
        );
        Alert.alert(
          "Error",
          "Could not get location details. Please try again."
        );
      }
    } catch (error) {
      console.error("Error getting place details:", error);
      Alert.alert(
        "Network Error",
        "Unable to get location details. Please check your internet connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (place: Place) => {
    // Clear any pending search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Mark that a place has been selected and hide suggestions immediately
    setPlaceSelected(true);
    setSuggestions([]);
    setShowSuggestions(false);
    setHasSearched(false);
    setNoResults(false);

    // Update the input text
    onChangeText(place.description);

    // Get place details
    getPlaceDetails(place.place_id);
  };

  // Clear suggestions when input loses focus
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Render suggestion item
  const renderSuggestion = ({ item }: { item: Place }) => (
    <TouchableOpacity
      style={[styles.suggestionItem, { borderBottomColor: colors.border }]}
      onPress={() => handleSuggestionSelect(item)}
    >
      <Ionicons name="location-outline" size={20} color={colors.primary} />
      <View style={styles.suggestionText}>
        <View style={styles.suggestionHeader}>
          <Text style={[styles.suggestionMain, { color: colors.text }]}>
            {item.structured_formatting.main_text}
          </Text>
          {item.distance !== undefined && (
            <Text style={[styles.distanceText, { color: colors.textTertiary }]}>
              {item.distance.toFixed(1)} mi
            </Text>
          )}
        </View>
        <Text
          style={[styles.suggestionSecondary, { color: colors.textSecondary }]}
        >
          {item.structured_formatting.secondary_text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Cleanup timeout on unmount
  // Get current location on mount
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } else {
          console.log("Location permission denied");
        }
      } catch (error) {
        console.error("Error getting location:", error);
      }
    };

    getCurrentLocation();

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <View style={[styles.container, style]}>
      <View
        style={[styles.inputContainer, { backgroundColor: colors.surface }]}
      >
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          onFocus={() => {
            // Only show suggestions if a place hasn't been selected and there are suggestions
            if (!placeSelected && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              onChangeText("");
              // Also clear any pending search
              if (debounceRef.current) {
                clearTimeout(debounceRef.current);
              }
              setSuggestions([]);
              setShowSuggestions(false);
              setHasSearched(false);
              setNoResults(false);
            }}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {!placeSelected &&
        showSuggestions &&
        (suggestions.length > 0 || noResults) && (
          <View
            style={[
              styles.suggestionsContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            {noResults ? (
              <View style={styles.noResultsContainer}>
                <Ionicons
                  name="location-outline"
                  size={24}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.noResultsText,
                    { color: colors.textSecondary },
                  ]}
                >
                  No locations found in San Diego County
                </Text>
                <Text
                  style={[
                    styles.noResultsSubtext,
                    { color: colors.textTertiary },
                  ]}
                >
                  Try a different search term or check your spelling
                </Text>
              </View>
            ) : (
              <FlatList
                data={suggestions}
                keyExtractor={(item) => item.place_id}
                renderItem={renderSuggestion}
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
              />
            )}
          </View>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1000,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  clearButton: {
    marginLeft: 8,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    maxHeight: 200,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 4,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  suggestionsList: {
    maxHeight: 200,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  suggestionText: {
    flex: 1,
    marginLeft: 12,
  },
  suggestionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  suggestionMain: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  suggestionSecondary: {
    fontSize: 14,
    marginTop: 2,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    textAlign: "center",
  },
  noResultsSubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
    lineHeight: 20,
  },
});
