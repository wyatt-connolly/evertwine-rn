import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Meetup } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";
import ShareButton from "./ShareButton";

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
  const { colors } = useThemeStore();
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <TouchableOpacity
      style={[styles.meetupCard, { backgroundColor: colors.surface }, style]}
      onPress={onPress}
    >
      {meetup.coverImage && (
        <Image source={{ uri: meetup.coverImage }} style={styles.meetupImage} />
      )}

      <View style={styles.meetupContent}>
        <View style={styles.meetupHeader}>
          <View style={styles.meetupInfo}>
            <Text style={[styles.meetupTitle, { color: colors.text }]}>
              {meetup.title}
            </Text>
            <Text
              style={[styles.meetupLocation, { color: colors.textSecondary }]}
            >
              <Ionicons
                name="location-outline"
                size={12}
                color={colors.textSecondary}
              />
              {meetup.locationName}
            </Text>
          </View>
          <View style={styles.meetupActions}>
            <ShareButton
              type="meetup"
              data={meetup}
              variant="icon"
              size="small"
              style={styles.shareButton}
            />
            {showEditButton && (
              <TouchableOpacity
                style={styles.editButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
        </View>

        <Text
          style={[styles.meetupDescription, { color: colors.textSecondary }]}
        >
          {meetup.description}
        </Text>

        <View style={styles.meetupFooter}>
          <View style={styles.meetupTime}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.primary }]}>
              {formatTime(meetup.time)} • {formatDate(meetup.time)}
            </Text>
          </View>
          <View style={styles.meetupStats}>
            <Ionicons
              name="people-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              {meetup.currentParticipants}/{meetup.maxParticipants}
            </Text>
          </View>
        </View>

        <View style={styles.meetupTags}>
          {meetup.tags.slice(0, 3).map((tag, index) => (
            <View
              key={index}
              style={[styles.tag, { backgroundColor: colors.primary + "20" }]}
            >
              <Text style={[styles.tagText, { color: colors.primary }]}>
                {tag}
              </Text>
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
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meetupImage: {
    width: "100%",
    height: 240, // 3:4 aspect ratio (180 * 4/3 = 240)
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
  shareButton: {
    marginRight: 4,
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  meetupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  meetupLocation: {
    fontSize: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#FF6B35",
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
  },
  meetupStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    fontSize: 12,
    marginLeft: 4,
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
  },
  tagText: {
    fontSize: 10,
    fontWeight: "500",
  },
});
