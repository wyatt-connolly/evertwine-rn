import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Event } from "../types";

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  style?: any;
}

export default function EventCard({ event, onPress, style }: EventCardProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <TouchableOpacity style={[styles.eventCard, style]} onPress={onPress}>
      <Image source={{ uri: event.coverImage }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>${event.price}</Text>
          </View>
        </View>

        <Text style={styles.eventLocation}>
          <Ionicons name="location-outline" size={12} color="#666" />
          {event.locationName}
        </Text>

        <View style={styles.eventFooter}>
          <View style={styles.eventTime}>
            <Ionicons name="calendar-outline" size={14} color="#007AFF" />
            <Text style={styles.timeText}>
              {formatDate(event.startTime)} • {formatTime(event.startTime)}
            </Text>
          </View>
          <View style={styles.eventStats}>
            <Ionicons name="people-outline" size={14} color="#666" />
            <Text style={styles.statsText}>{event.currentAttendees} going</Text>
          </View>
        </View>

        <View style={styles.eventTags}>
          {event.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.eventTag}>
              <Text style={styles.eventTagText}>{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.organizerInfo}>
          <Image
            source={{ uri: event.organizerAvatar }}
            style={styles.organizerAvatar}
          />
          <Text style={styles.organizerText}>
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
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: "100%",
    height: 120,
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
    color: "#333",
  },
  priceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
  },
  eventLocation: {
    fontSize: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    color: "#666",
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
    color: "#007AFF",
  },
  eventStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#666",
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
    backgroundColor: "#F0F0F0",
  },
  eventTagText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#666",
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
    color: "#666",
  },
});
