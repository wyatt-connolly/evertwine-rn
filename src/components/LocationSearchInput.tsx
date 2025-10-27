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
  const debounceRef = useRef<NodeJS.Timeout>();

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

      const response = await fetch(
        `${GOOGLE_PLACES_ENDPOINTS.AUTOCOMPLETE}?input=${encodeURIComponent(
          query
        )}&key=${GOOGLE_PLACES_API_KEY}&types=${
          GOOGLE_PLACES_CONFIG.TYPES
        }&components=${GOOGLE_PLACES_CONFIG.COMPONENTS}&location=${
          GOOGLE_PLACES_CONFIG.LOCATION
        }&radius=${GOOGLE_PLACES_CONFIG.RADIUS}&strictbounds=${
          GOOGLE_PLACES_CONFIG.STRICT_BOUNDS
        }&bounds=${bounds}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "OK") {
        const predictions = data.predictions || [];
        setSuggestions(predictions);
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

    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Reset search states when user types
    if (text.length < 2) {
      setHasSearched(false);
      setNoResults(false);
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

        setShowSuggestions(false);
        setSuggestions([]);
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
    onChangeText(place.description);
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
        <Text style={[styles.suggestionMain, { color: colors.text }]}>
          {item.structured_formatting.main_text}
        </Text>
        <Text
          style={[styles.suggestionSecondary, { color: colors.textSecondary }]}
        >
          {item.structured_formatting.secondary_text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Cleanup timeout on unmount
  useEffect(() => {
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
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        {isLoading && <ActivityIndicator size="small" color={colors.primary} />}
        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              onChangeText("");
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

      {showSuggestions && (suggestions.length > 0 || noResults) && (
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
                style={[styles.noResultsText, { color: colors.textSecondary }]}
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
  suggestionMain: {
    fontSize: 16,
    fontWeight: "500",
  },
  suggestionSecondary: {
    fontSize: 14,
    marginTop: 2,
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
