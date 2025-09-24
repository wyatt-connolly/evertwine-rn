import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Event } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  style?: any;
}

export default function EventCard({ event, onPress, style }: EventCardProps) {
  const { colors } = useThemeStore();
  const [imageError, setImageError] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Image debugging logs
  console.log(`🖼️ EventCard - ${event.title}:`, {
    hasCoverImage: !!event.coverImage,
    coverImageUrl: event.coverImage,
    imageError: imageError,
  });

  return (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: colors.surface }, style]}
      onPress={onPress}
    >
      {event.coverImage && !imageError ? (
        <Image
          source={{ uri: event.coverImage }}
          style={styles.eventImage}
          onError={(error) => {
            console.log(
              `❌ Image load error for ${event.title}:`,
              error.nativeEvent.error
            );
            setImageError(true);
          }}
          onLoad={() => {
            console.log(`✅ Image loaded successfully for ${event.title}`);
            setImageError(false);
          }}
        />
      ) : (
        <View
          style={[
            styles.eventImage,
            styles.placeholderImage,
            { backgroundColor: colors.surface },
          ]}
        >
          <Ionicons
            name="wine-outline"
            size={40}
            color={colors.textSecondary}
          />
        </View>
      )}
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
          <Ionicons
            name="location-outline"
            size={12}
            color={colors.textSecondary}
          />
          {event.locationName}
        </Text>

        <View style={styles.eventFooter}>
          <View style={styles.eventTime}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.primary}
            />
            <Text style={[styles.timeText, { color: colors.primary }]}>
              {formatDate(event.startTime)} • {formatTime(event.startTime)}
            </Text>
          </View>
          <View style={styles.eventStats}>
            <Ionicons
              name="people-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              {event.currentAttendees} going
            </Text>
          </View>
        </View>

        <View style={styles.eventTags}>
          {event.tags.slice(0, 3).map((tag, index) => (
            <View
              key={index}
              style={[
                styles.eventTag,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Text style={[styles.eventTagText, { color: colors.primary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.organizerInfo}>
          <Image
            source={{ uri: event.organizerAvatar }}
            style={styles.organizerAvatar}
          />
          <Text style={[styles.organizerText, { color: colors.textSecondary }]}>
            Organized by {event.organizerName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    borderRadius: 12,
    marginBottom: 16, // Increased spacing for taller cards
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: "100%",
    height: 240, // 3:4 aspect ratio (180 * 4/3 = 240)
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 12,
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
  eventTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  eventTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  eventTagText: {
    fontSize: 10,
    fontWeight: "500",
  },
  organizerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  organizerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  organizerText: {
    fontSize: 12,
  },
});
