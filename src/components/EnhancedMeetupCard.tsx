import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
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
  mutualFriends?: Array<{ id: string; name: string; avatar: string }>;
}

export default function EnhancedMeetupCard({
  meetup,
  onPress,
  onEdit,
  showEditButton = false,
  style,
  onInterested,
  isInterested = false,
  mutualFriends = [],
}: EnhancedMeetupCardProps) {
  const { colors } = useThemeStore();
  const { currentUser } = useAuthStore();
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
          borderColor: colors.primary + "60",
        },
        style,
      ]}
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
            <View
              style={[
                styles.meetupIndicator,
                { backgroundColor: colors.primary + "15" },
              ]}
            >
              <Ionicons name="calendar" size={14} color={colors.primary} />
              <Text style={[styles.meetupText, { color: colors.primary }]}>
                Meetup
              </Text>
            </View>
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

        <Text
          style={[styles.meetupDescription, { color: colors.textSecondary }]}
          numberOfLines={2}
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

        {/* Mutual Friends */}
        {mutualFriends.length > 0 && (
          <View style={styles.mutualFriendsContainer}>
            <View style={styles.avatarStack}>
              {mutualFriends.slice(0, 3).map((friend, index) => (
                <Image
                  key={friend.id}
                  source={{ uri: friend.avatar }}
                  style={[
                    styles.mutualAvatar,
                    {
                      marginLeft: index > 0 ? -8 : 0,
                      borderColor: colors.surface,
                    },
                  ]}
                />
              ))}
            </View>
            <Text
              style={[
                styles.mutualFriendsText,
                { color: colors.textSecondary },
              ]}
            >
              {mutualFriends.length === 1
                ? `${mutualFriends[0].name} is going`
                : `${mutualFriends[0].name} and ${mutualFriends.length - 1} ${
                    mutualFriends.length === 2 ? "other" : "others"
                  } are going`}
            </Text>
          </View>
        )}

        <View style={styles.meetupTags}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsScroll}
          >
            {meetup.tags.slice(0, 4).map((tag, index) => (
              <View
                key={index}
                style={[styles.tag, { backgroundColor: colors.primary + "20" }]}
              >
                <Text style={[styles.tagText, { color: colors.primary }]}>
                  {tag}
                </Text>
              </View>
            ))}
          </ScrollView>
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
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
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
  mutualFriendsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
  },
  avatarStack: {
    flexDirection: "row",
    marginRight: 8,
  },
  mutualAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  mutualFriendsText: {
    fontSize: 12,
    flex: 1,
  },
  meetupTags: {
    marginBottom: 12,
  },
  tagsScroll: {
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "500",
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
