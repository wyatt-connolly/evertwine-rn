import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Place } from "../types";

interface PlaceCardProps {
  place: Place;
  onPress?: () => void;
  style?: any;
}

export default function PlaceCard({ place, onPress, style }: PlaceCardProps) {
  return (
    <TouchableOpacity style={[styles.placeCard, style]} onPress={onPress}>
      <Image source={{ uri: place.photos[0] }} style={styles.placeImage} />
      <View style={styles.placeContent}>
        <View style={styles.placeHeader}>
          <Text style={styles.placeName}>{place.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{place.rating}</Text>
          </View>
        </View>

        <Text style={styles.placeCategory}>{place.category}</Text>

        <Text style={styles.placeAddress}>
          <Ionicons name="location-outline" size={12} color="#666" />
          {place.address}
        </Text>

        <View style={styles.placeFeatures}>
          {place.features.slice(0, 3).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.placeFooter}>
          <Text style={styles.reviewCount}>{place.reviewCount} reviews</Text>
          <View style={styles.priceLevel}>
            {Array.from({ length: place.priceLevel }, (_, i) => (
              <Text key={i} style={styles.dollarSign}>
                $
              </Text>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
    color: "#333",
  },
  placeCategory: {
    fontSize: 12,
    marginBottom: 4,
    color: "#666",
  },
  placeAddress: {
    fontSize: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    color: "#666",
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
    backgroundColor: "#007AFF20",
  },
  featureText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#007AFF",
  },
  placeFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewCount: {
    fontSize: 12,
    color: "#666",
  },
  priceLevel: {
    flexDirection: "row",
  },
  dollarSign: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
});
