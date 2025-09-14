import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Meetup } from "../types";

interface MeetupCardProps {
  meetup: Meetup;
  onPress?: () => void;
  onEdit?: () => void;
  showEditButton?: boolean;
  style?: any;
}

export default function MeetupCard({
  meetup,
  onPress,
  onEdit,
  showEditButton = false,
  style,
}: MeetupCardProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <TouchableOpacity style={[styles.meetupCard, style]} onPress={onPress}>
      {meetup.coverImage && (
        <Image source={{ uri: meetup.coverImage }} style={styles.meetupImage} />
      )}

      <View style={styles.meetupContent}>
        <View style={styles.meetupHeader}>
          <View style={styles.meetupInfo}>
            <Text style={styles.meetupTitle}>{meetup.title}</Text>
            <Text style={styles.meetupLocation}>
              <Ionicons name="location-outline" size={12} color="#666" />
              {meetup.locationName}
            </Text>
          </View>
          <View style={styles.meetupActions}>
            {showEditButton && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
              >
                <Ionicons name="create-outline" size={16} color="#007AFF" />
              </TouchableOpacity>
            )}
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
        </View>

        <Text style={styles.meetupDescription}>{meetup.description}</Text>

        <View style={styles.meetupFooter}>
          <View style={styles.meetupTime}>
            <Ionicons name="time-outline" size={14} color="#007AFF" />
            <Text style={styles.timeText}>
              {formatTime(meetup.time)} • {formatDate(meetup.time)}
            </Text>
          </View>
          <View style={styles.meetupStats}>
            <Ionicons name="people-outline" size={14} color="#666" />
            <Text style={styles.statsText}>
              {meetup.currentParticipants}/{meetup.maxParticipants}
            </Text>
          </View>
        </View>

        <View style={styles.meetupTags}>
          {meetup.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  meetupCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meetupImage: {
    width: "100%",
    height: 140,
  },
  meetupContent: {
    padding: 16,
  },
  meetupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  meetupInfo: {
    flex: 1,
  },
  meetupActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  meetupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  meetupLocation: {
    fontSize: 12,
    flexDirection: "row",
    alignItems: "center",
    color: "#666",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FF4444",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
    backgroundColor: "#FFF",
  },
  liveText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFF",
  },
  meetupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    color: "#666",
  },
  meetupFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  meetupTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
    color: "#007AFF",
  },
  meetupStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    fontSize: 12,
    marginLeft: 4,
    color: "#666",
  },
  meetupTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    backgroundColor: "#007AFF20",
  },
  tagText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#007AFF",
  },
});
