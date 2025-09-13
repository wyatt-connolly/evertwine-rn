import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { getMockMeetups, getMockPlaces } from "../../data/mockData";
import { Meetup, Place } from "../../types";

const { width, height } = Dimensions.get("window");

export default function MapScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "meetups" | "places">("all");
  const [selectedItem, setSelectedItem] = useState<Meetup | Place | null>(null);

  const meetups = getMockMeetups();
  const places = getMockPlaces();

  const renderMapPlaceholder = () => (
    <View style={[styles.mapContainer, { backgroundColor: colors.surfaceVariant }]}>
      <View style={styles.mapContent}>
        <Ionicons name="map-outline" size={64} color={colors.textTertiary} />
        <Text style={[styles.mapPlaceholderText, { color: colors.textSecondary }]}>
          Interactive Map
        </Text>
        <Text style={[styles.mapSubtext, { color: colors.textTertiary }]}>
          Map integration coming soon
        </Text>
      </View>
      
      {/* Mock map markers */}
      <View style={styles.mapMarkers}>
        {meetups.slice(0, 3).map((meetup, index) => (
          <TouchableOpacity
            key={meetup.id}
            style={[
              styles.mapMarker,
              { 
                backgroundColor: colors.primary,
                left: 50 + (index * 80),
                top: 100 + (index * 60)
              }
            ]}
            onPress={() => setSelectedItem(meetup)}
          >
            <Ionicons name="people" size={16} color={colors.onPrimary} />
          </TouchableOpacity>
        ))}
        
        {places.slice(0, 2).map((place, index) => (
          <TouchableOpacity
            key={place.id}
            style={[
              styles.mapMarker,
              { 
                backgroundColor: colors.secondary,
                left: 120 + (index * 100),
                top: 200 + (index * 40)
              }
            ]}
            onPress={() => setSelectedItem(place)}
          >
            <Ionicons name="location" size={16} color={colors.onSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderSelectedItem = () => {
    if (!selectedItem) return null;

    const isMeetup = 'creatorId' in selectedItem;
    
    return (
      <View style={[styles.selectedItemCard, { backgroundColor: colors.surface }]}>
        <View style={styles.selectedItemHeader}>
          <Text style={[styles.selectedItemTitle, { color: colors.text }]}>
            {'name' in selectedItem ? selectedItem.name : selectedItem.title}
          </Text>
          <TouchableOpacity onPress={() => setSelectedItem(null)}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.selectedItemDescription, { color: colors.textSecondary }]}>
          {selectedItem.description}
        </Text>
        
        <View style={styles.selectedItemFooter}>
          <View style={styles.selectedItemInfo}>
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <Text style={[styles.selectedItemLocation, { color: colors.textSecondary }]}>
              {'locationName' in selectedItem ? selectedItem.locationName : selectedItem.address}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.viewDetailsButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              if (isMeetup) {
                navigation.navigate("MeetupDetails", { meetupId: selectedItem.id });
              } else {
                // Navigate to place details
                navigation.goBack();
              }
            }}
          >
            <Text style={[styles.viewDetailsText, { color: colors.onPrimary }]}>
              View Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFilterButton = (filter: "all" | "meetups" | "places", label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { backgroundColor: colors.surface },
        selectedFilter === filter && { backgroundColor: colors.primary }
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={selectedFilter === filter ? colors.onPrimary : colors.textSecondary} 
      />
      <Text
        style={[
          styles.filterButtonText,
          { color: selectedFilter === filter ? colors.onPrimary : colors.textSecondary }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Map</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton("all", "All", "grid-outline")}
        {renderFilterButton("meetups", "Meetups", "people-outline")}
        {renderFilterButton("places", "Places", "location-outline")}
      </View>

      {/* Map */}
      {renderMapPlaceholder()}

      {/* Selected Item Card */}
      {renderSelectedItem()}

      {/* Bottom Info */}
      <View style={[styles.bottomInfo, { backgroundColor: colors.surface }]}>
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendMarker, { backgroundColor: colors.primary }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Meetups ({meetups.length})
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendMarker, { backgroundColor: colors.secondary }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>
              Places ({places.length})
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.myLocationButton, { backgroundColor: colors.primary }]}>
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
  searchButton: {
    padding: 8,
    marginLeft: 8,
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
    margin: 16,
    borderRadius: 12,
    position: "relative",
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
  mapMarkers: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  mapMarker: {
    position: "absolute",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedItemCard: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  selectedItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  selectedItemDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  selectedItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedItemInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  selectedItemLocation: {
    fontSize: 12,
    marginLeft: 4,
  },
  viewDetailsButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    fontWeight: "600",
  },
  bottomInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
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
});
