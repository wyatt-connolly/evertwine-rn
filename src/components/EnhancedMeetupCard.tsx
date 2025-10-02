import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Meetup } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";
import { useAuthStore } from "../hooks/useAuthStore";
import ShareButton from "./ShareButton";

interface EnhancedMeetupCardProps {
  meetup: Meetup;
  onPress?: () => void;
  onEdit?: () => void;
  showEditButton?: boolean;
  style?: any;
  onInterested?: (meetupId: string, isInterested: boolean) => void;
  isInterested?: boolean;
  timeLabel?: string;
  isUpcoming?: boolean;
}

export default function EnhancedMeetupCard({
  meetup,
  onPress,
  onEdit,
  showEditButton = false,
  style,
  onInterested,
  isInterested = false,
  timeLabel,
  isUpcoming = false,
}: EnhancedMeetupCardProps) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const [localInterested, setLocalInterested] = useState(isInterested);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const handleInterestedToggle = (e: any) => {
    e.stopPropagation();
    const newState = !localInterested;
    setLocalInterested(newState);
    onInterested?.(meetup.id, newState);
  };

  const isJoined = currentUser
    ? meetup.participants.includes(currentUser.uid)
    : false;

  return (
    <TouchableOpacity
      style={[
        styles.meetupCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
        style,
      ]}
      onPress={onPress}
    >
      {/* Meetup Banner */}
      <View
        style={[
          styles.meetupBanner,
          { backgroundColor: colors.accentTertiary },
        ]}
      >
        <Ionicons name="people" size={12} color={colors.onAccent} />
        <Text style={[styles.meetupBannerText, { color: colors.onAccent }]}>
          Meetup
        </Text>
      </View>

      {meetup.coverImage && (
        <Image source={{ uri: meetup.coverImage }} style={styles.meetupImage} />
      )}

      <View style={styles.meetupContent}>
        <View style={styles.meetupHeader}>
          <View style={styles.meetupInfo}>
            <View style={styles.meetupTitleRow}>
              <Text style={[styles.meetupTitle, { color: colors.text }]}>
                {meetup.title}
              </Text>
              {timeLabel && (
                <View
                  style={[
                    styles.timeBadge,
                    {
                      backgroundColor: isUpcoming
                        ? colors.primary + "15"
                        : colors.surface,
                    },
                  ]}
                >
                  <Ionicons
                    name="calendar"
                    size={10}
                    color={isUpcoming ? colors.primary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.timeBadgeText,
                      {
                        color: isUpcoming
                          ? colors.primary
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {timeLabel}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={[styles.meetupLocation, { color: colors.textSecondary }]}
            >
              <Ionicons
                name="location-outline"
                size={12}
                color={colors.textSecondary}
              />{" "}
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
          </View>
        </View>

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

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.interestedButton,
              {
                backgroundColor: localInterested
                  ? colors.primary + "15"
                  : colors.background,
                borderColor: localInterested ? colors.primary : colors.border,
              },
            ]}
            onPress={handleInterestedToggle}
          >
            <Ionicons
              name={localInterested ? "star" : "star-outline"}
              size={16}
              color={localInterested ? colors.primary : colors.textSecondary}
            />
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: localInterested
                    ? colors.primary
                    : colors.textSecondary,
                },
              ]}
            >
              {localInterested ? "Interested" : "Interested?"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.joinButton,
              {
                backgroundColor: isJoined ? colors.background : colors.primary,
                borderColor: isJoined ? colors.border : colors.primary,
              },
            ]}
            onPress={(e) => {
              e.stopPropagation();
              // Handle join logic
            }}
          >
            <Ionicons
              name={isJoined ? "checkmark-circle" : "add-circle-outline"}
              size={16}
              color={isJoined ? colors.primary : colors.onPrimary}
            />
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: isJoined ? colors.primary : colors.onPrimary,
                  fontWeight: "600",
                },
              ]}
            >
              {isJoined ? "Joined" : "Join"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  meetupCard: {
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
  meetupBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  meetupBannerText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  meetupImage: {
    width: "100%",
    height: 180,
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
  meetupIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginLeft: 8,
  },
  meetupText: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  shareButton: {
    marginRight: 4,
  },
  editButton: {
    padding: 8,
  },
  meetupTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  meetupTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  meetupLocation: {
    fontSize: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  meetupFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
  },
  interestedButton: {},
  joinButton: {},
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
