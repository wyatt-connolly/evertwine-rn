import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Meetup } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";
import { useAuthStore } from "../hooks/useAuthStore";
import ShareButton from "./ShareButton";
import { DataService } from "../services/DataService";

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
  hideActionButtons?: boolean;
  customActionButton?: React.ReactNode;
  matchesPreferences?: boolean;
  onJoinChange?: (meetupId: string, updatedMeetup: Meetup) => void;
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
  hideActionButtons = false,
  customActionButton,
  matchesPreferences = false,
  onJoinChange,
}: EnhancedMeetupCardProps) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const navigation = useNavigation<any>();
  const [localInterested, setLocalInterested] = useState(isInterested);
  const [localIsJoined, setLocalIsJoined] = useState(
    currentUser ? meetup.participants.includes(currentUser.uid) : false
  );

  // Sync localIsJoined when meetup.participants changes (e.g., when navigating back)
  useEffect(() => {
    if (currentUser) {
      const userIsParticipant = meetup.participants.includes(currentUser.uid);
      console.log(
        "🔄 [EnhancedMeetupCard] Syncing localIsJoined from meetup prop:",
        {
          meetupId: meetup.id,
          userId: currentUser.uid,
          participants: meetup.participants,
          userIsParticipant,
          currentLocalState: localIsJoined,
        }
      );
      // Always sync to meetup prop - this is the source of truth
      if (localIsJoined !== userIsParticipant) {
        console.log("🔄 [EnhancedMeetupCard] Updating localIsJoined:", {
          from: localIsJoined,
          to: userIsParticipant,
        });
        setLocalIsJoined(userIsParticipant);
      }
    } else {
      setLocalIsJoined(false);
    }
  }, [meetup.participants?.length, meetup.participants?.join(","), meetup.id, currentUser?.uid]);

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

  const handleJoin = async (e: any) => {
    e.stopPropagation();

    console.log("🔄 [EnhancedMeetupCard] Join button pressed");
    console.log("🔄 [EnhancedMeetupCard] Meetup ID:", meetup.id);
    console.log("🔄 [EnhancedMeetupCard] Current user:", currentUser?.uid);
    console.log("🔄 [EnhancedMeetupCard] Current join state:", localIsJoined);
    console.log(
      "🔄 [EnhancedMeetupCard] Meetup participants:",
      meetup.participants
    );

    if (!currentUser) {
      console.error("❌ [EnhancedMeetupCard] No current user");
      Alert.alert("Error", "You must be logged in to join a meetup");
      return;
    }

    try {
      if (localIsJoined) {
        console.log("➖ [EnhancedMeetupCard] Attempting to leave meetup");
        try {
          const updatedMeetup = await DataService.removeUserFromMeetup(
            meetup.id,
            currentUser.uid
          );

          if (updatedMeetup) {
            console.log(
              "✅ [EnhancedMeetupCard] Successfully left meetup via DataService"
            );
            setLocalIsJoined(false);

            // Remove user from group chat
            try {
              await DataService.removeUserFromMeetupGroupChat(
                meetup.id,
                currentUser.uid
              );
              console.log(
                "✅ [EnhancedMeetupCard] Successfully removed from group chat"
              );
            } catch (error) {
              console.error(
                "❌ [EnhancedMeetupCard] Error removing from group chat:",
                error
              );
              // Don't fail the leave if group chat removal fails
            }

            // Notify parent of the update
            onJoinChange?.(meetup.id, updatedMeetup);

            Alert.alert("Success", "You've left the meetup");
          }
        } catch (leaveError: any) {
          console.error(
            "❌ [EnhancedMeetupCard] Error leaving meetup:",
            leaveError
          );
          console.error(
            "❌ [EnhancedMeetupCard] Error details:",
            JSON.stringify(leaveError, null, 2)
          );
          Alert.alert(
            "Error",
            `Failed to leave meetup: ${leaveError.message || "Unknown error"}`
          );
        }
      } else {
        console.log("➕ [EnhancedMeetupCard] Attempting to join meetup");

        // Check if meetup is full
        if (
          meetup.maxParticipants &&
          meetup.currentParticipants >= meetup.maxParticipants
        ) {
          console.warn("⚠️ [EnhancedMeetupCard] Meetup is full");
          Alert.alert(
            "Meetup Full",
            "This meetup is currently full. You can join the waitlist."
          );
          return;
        }

        // Join meetup
        console.log(
          "➕ [EnhancedMeetupCard] Calling DataService.addUserToMeetup"
        );
        try {
          // First try to add user to meetup participants
          // Note: This method might need to be implemented in DataService
          const updatedMeetup = await DataService.addUserToMeetup(
            meetup.id,
            currentUser.uid
          );

          if (updatedMeetup) {
            console.log(
              "✅ [EnhancedMeetupCard] Successfully joined meetup via DataService"
            );
            setLocalIsJoined(true);

            // Create or join group chat
            try {
              let groupChat = await DataService.findMeetupGroupChat(meetup.id);

              if (!groupChat) {
                const participants = [meetup.creatorId, currentUser.uid];
                groupChat = await DataService.createMeetupGroupChat(
                  meetup.id,
                  meetup.title,
                  meetup.images?.[0] || "",
                  participants
                );
                console.log(
                  "✅ [EnhancedMeetupCard] Created group chat:",
                  groupChat?.id
                );
              } else {
                groupChat = await DataService.addUserToMeetupGroupChat(
                  meetup.id,
                  currentUser.uid
                );
                console.log(
                  "✅ [EnhancedMeetupCard] Added to group chat:",
                  groupChat?.id
                );
              }
            } catch (error) {
              console.error(
                "❌ [EnhancedMeetupCard] Error with group chat:",
                error
              );
              // Don't fail the join if group chat creation fails
            }

            // Notify parent of the update
            onJoinChange?.(meetup.id, updatedMeetup);

            Alert.alert("Success", "You've joined the meetup!");
          } else {
            console.warn(
              "⚠️ [EnhancedMeetupCard] addUserToMeetup returned null"
            );
            // Fallback: just update local state and create/join group chat
            setLocalIsJoined(true);
            console.log(
              "➕ [EnhancedMeetupCard] Updated local state to joined"
            );
          }
        } catch (methodError: any) {
          console.error(
            "❌ [EnhancedMeetupCard] Error calling addUserToMeetup:",
            methodError
          );
          console.error(
            "❌ [EnhancedMeetupCard] Error details:",
            JSON.stringify(methodError, null, 2)
          );

          // Fallback: Create or join group chat
          console.log(
            "➕ [EnhancedMeetupCard] Falling back to group chat creation"
          );
          try {
            let groupChat = await DataService.findMeetupGroupChat(meetup.id);
            console.log(
              "➕ [EnhancedMeetupCard] Group chat lookup result:",
              groupChat ? "found" : "not found"
            );

            if (!groupChat) {
              console.log("➕ [EnhancedMeetupCard] Creating new group chat");
              const participants = [meetup.creatorId, currentUser.uid];
              groupChat = await DataService.createMeetupGroupChat(
                meetup.id,
                meetup.title,
                meetup.images?.[0] || "",
                participants
              );
              console.log(
                "✅ [EnhancedMeetupCard] Created group chat:",
                groupChat?.id
              );
            } else {
              console.log(
                "➕ [EnhancedMeetupCard] Adding user to existing group chat"
              );
              groupChat = await DataService.addUserToMeetupGroupChat(
                meetup.id,
                currentUser.uid
              );
              console.log(
                "✅ [EnhancedMeetupCard] Added to group chat:",
                groupChat?.id
              );
            }

            setLocalIsJoined(true);
            console.log(
              "✅ [EnhancedMeetupCard] Successfully joined meetup (via group chat)"
            );

            // Notify parent - but we don't have updated meetup data here
            // This is a fallback case, so we'll create a partial update
            const partialMeetupUpdate: Meetup = {
              ...meetup,
              participants: [...meetup.participants, currentUser.uid],
              currentParticipants: meetup.currentParticipants + 1,
            };
            onJoinChange?.(meetup.id, partialMeetupUpdate);

            Alert.alert("Success", "You've joined the meetup!");
          } catch (groupChatError: any) {
            console.error(
              "❌ [EnhancedMeetupCard] Error with group chat:",
              groupChatError
            );
            Alert.alert(
              "Error",
              `Failed to join meetup: ${
                groupChatError.message || "Unknown error"
              }`
            );
          }
        }
      }
    } catch (error: any) {
      console.error(
        "❌ [EnhancedMeetupCard] Unexpected error in handleJoin:",
        error
      );
      console.error(
        "❌ [EnhancedMeetupCard] Error details:",
        JSON.stringify(error, null, 2)
      );
      Alert.alert(
        "Error",
        `Failed to ${localIsJoined ? "leave" : "join"} meetup: ${
          error.message || "Unknown error"
        }`
      );
    }
  };

  // Use meetup participants as source of truth, sync with local state
  // This ensures UI reflects actual database state
  const isJoined = currentUser
    ? meetup.participants.includes(currentUser.uid)
    : false;

  const isOwnMeetup = currentUser
    ? meetup.creatorId === currentUser.uid ||
      meetup.creatorRef === currentUser.uid
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
      {/* Meetup Icon Badge */}
      <View
        style={[
          styles.meetupIconBadge,
          { backgroundColor: colors.accentTertiary + "40" },
        ]}
      >
        <Ionicons name="people" size={16} color={colors.accentTertiary} />
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
        {customActionButton ? (
          <View style={styles.customActionContainer}>{customActionButton}</View>
        ) : !hideActionButtons ? (
          isOwnMeetup ? (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.editActionButton,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                  },
                ]}
                onPress={(e) => {
                  e.stopPropagation();
                  if (onEdit) {
                    onEdit();
                  } else if (isOwnMeetup) {
                    navigation.navigate("EditMeetup", { meetupId: meetup.id });
                  }
                }}
              >
                <Ionicons
                  name="create-outline"
                  size={16}
                  color={colors.onPrimary}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    {
                      color: colors.onPrimary,
                      fontWeight: "600",
                    },
                  ]}
                >
                  Edit Meetup
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  styles.interestedButton,
                  {
                    backgroundColor: localInterested
                      ? colors.primary + "15"
                      : colors.background,
                    borderColor: localInterested
                      ? colors.primary
                      : colors.border,
                  },
                ]}
                onPress={handleInterestedToggle}
              >
                <Ionicons
                  name={localInterested ? "star" : "star-outline"}
                  size={16}
                  color={
                    localInterested ? colors.primary : colors.textSecondary
                  }
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
                    backgroundColor: isJoined
                      ? colors.background
                      : colors.primary,
                    borderColor: isJoined ? colors.border : colors.primary,
                  },
                ]}
                onPress={handleJoin}
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
          )
        ) : null}
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
  meetupIconBadge: {
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
  customActionContainer: {
    alignItems: "center",
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
  editActionButton: {},
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
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
