import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Event } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";
import ShareButton from "./ShareButton";

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  style?: any;
  customActionButton?: React.ReactNode;
  matchesPreferences?: boolean;
}

export default function EventCard({
  event,
  onPress,
  style,
  customActionButton,
  matchesPreferences = false,
}: EventCardProps) {
  const { colors } = useThemeStore();

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <TouchableOpacity
      style={[
        styles.eventCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          borderTopColor: colors.warning,
          borderTopWidth: 4,
        },
        style,
      ]}
      onPress={onPress}
    >
      {/* Content Type Banner */}
      <View
        style={[
          styles.typeBanner,
          { backgroundColor: colors.warning },
        ]}
      >
        <Ionicons name="wine" size={12} color="#FFFFFF" />
        <Text style={[styles.typeBannerText, { color: "#FFFFFF" }]}>
          HAPPY HOUR
        </Text>
      </View>

      {/* Happy Hour Icon Badge */}
      <View
        style={[
          styles.happyHourIconBadge,
          { backgroundColor: colors.accentQuaternary + "40" },
        ]}
      >
        <Ionicons name="wine" size={16} color={colors.accentQuaternary} />
      </View>

      {/* Preference Match Indicator */}
      {matchesPreferences && (
        <View
          style={[
            styles.preferenceMatchBadge,
            { backgroundColor: colors.accent + "20" },
          ]}
        >
          <Ionicons name="sparkles" size={12} color={colors.accent} />
        </View>
      )}

      {event.coverImage && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: event.coverImage }} style={styles.eventImage} />

          {/* Overlay discount badge on image for happy hours */}
          {event.isHappyHour && event.happyHourDetails?.discountPercentage && (
            <View style={styles.imageOverlay}>
              <View
                style={[
                  styles.overlayDiscountBadge,
                  { backgroundColor: colors.accent },
                ]}
              >
                <Text
                  style={[
                    styles.overlayDiscountText,
                    { color: colors.onAccent },
                  ]}
                >
                  {event.happyHourDetails.discountPercentage}% OFF
                </Text>
              </View>
            </View>
          )}
        </View>
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
          </View>
        </View>

        {/* Show time window for happy hours, description for regular events */}
        {event.isHappyHour && event.happyHourDetails?.dealTimeWindow ? (
          <View style={styles.dealTimeRow}>
            <Ionicons
              name="time-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text style={[styles.dealTimeText, { color: colors.text }]}>
              {event.happyHourDetails.dealTimeWindow}
            </Text>
          </View>
        ) : !event.isHappyHour ? (
          <Text
            style={[styles.eventDescription, { color: colors.textSecondary }]}
          >
            {event.description}
          </Text>
        ) : null}

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

        {/* Custom Action Button */}
        {customActionButton && (
          <View style={styles.customActionContainer}>{customActionButton}</View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 12,
  },
  happyHourIconBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
  },
  eventImage: {
    width: "100%",
    height: 240, // 3:4 aspect ratio (180 * 4/3 = 240)
  },
  imageOverlay: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  overlayDiscountBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  overlayDiscountText: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  happyHourText: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  dealTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  dealTimeText: {
    fontSize: 14,
    fontWeight: "600",
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  customActionContainer: {
    alignItems: "center",
    marginTop: 12,
  },
  typeBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  typeBannerText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  preferenceMatchBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
});
