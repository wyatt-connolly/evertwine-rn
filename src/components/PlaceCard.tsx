import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Place } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";

interface PlaceCardProps {
  place: Place;
  onPress?: () => void;
  style?: any;
}

export default function PlaceCard({ place, onPress, style }: PlaceCardProps) {
  const { colors } = useThemeStore();
  return (
    <TouchableOpacity
      style={[styles.placeCard, { backgroundColor: colors.surface }, style]}
      onPress={onPress}
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
          <Ionicons
            name="location-outline"
            size={12}
            color={colors.textSecondary}
          />
          {place.address}
        </Text>

        <View style={styles.placeFeatures}>
          {place.features.slice(0, 3).map((feature, index) => (
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

        <View style={styles.placeFooter}>
          <Text style={[styles.reviewCount, { color: colors.textSecondary }]}>
            {place.reviewCount} reviews
          </Text>
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
});
