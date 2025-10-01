import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Event } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";
import ShareButton from "./ShareButton";

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  style?: any;
}

export default function EventCard({ event, onPress, style }: EventCardProps) {
  const { colors } = useThemeStore();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: colors.surface }, style]}
      onPress={onPress}
    >
      {event.coverImage && (
        <Image source={{ uri: event.coverImage }} style={styles.eventImage} />
      )}

      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <View style={styles.eventInfo}>
            <Text style={[styles.eventTitle, { color: colors.text }]}>
              {event.title}
            </Text>
            <Text
              style={[styles.eventLocation, { color: colors.textSecondary }]}
            >
              <Ionicons
                name="location-outline"
                size={12}
                color={colors.textSecondary}
              />
              {event.locationName}
            </Text>
          </View>
          <View style={styles.eventActions}>
            <ShareButton
              type="event"
              data={event}
              variant="icon"
              size="small"
              style={styles.shareButton}
            />
            <View style={styles.happyHourIndicator}>
              <Ionicons name="wine-outline" size={12} color={colors.textSecondary} />
              <Text style={[styles.happyHourText, { color: colors.textSecondary }]}>Happy Hour</Text>
            </View>
          </View>
        </View>

        <Text
          style={[styles.eventDescription, { color: colors.textSecondary }]}
        >
          {event.description}
        </Text>

        <View style={styles.eventFooter}>
          <View style={styles.eventTime}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.primary }]}>
              {formatTime(event.startTime)} • {formatDate(event.startTime)}
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
              style={[styles.tag, { backgroundColor: colors.primary + "20" }]}
            >
              <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    borderRadius: 12,
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
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  eventInfo: {
    flex: 1,
  },
  eventActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  shareButton: {
    marginRight: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  happyHourIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  happyHourText: {
    fontSize: 10,
    fontWeight: "500",
    marginLeft: 4,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
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
