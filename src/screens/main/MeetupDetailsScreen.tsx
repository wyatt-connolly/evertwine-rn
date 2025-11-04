import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useFavoritesStore } from "../../hooks/useFavoritesStore";
import { useAuthStore } from "../../hooks/useAuthStore";

import Snackbar from "../../components/Snackbar";
import ShareButton from "../../components/ShareButton";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { DataService } from "../../services/DataService";
import { Meetup, User } from "../../types";

interface MeetupDetailsScreenProps {
  route: {
    params: {
      meetupId: string;
      meetupData?: Meetup;
    };
  };
  navigation: any;
}

export default function MeetupDetailsScreen({
  route,
  navigation,
}: MeetupDetailsScreenProps) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const { addMeetupToFavorites, removeMeetupFromFavorites, isMeetupFavorite } =
    useFavoritesStore();
  const { meetupId, meetupData } = route.params;

  const [isJoined, setIsJoined] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [creator, setCreator] = useState<User | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const isOwnMeetup =
    currentUser && meetup
      ? meetup.creatorId === currentUser.uid ||
        meetup.creatorRef === currentUser.uid
      : false;

  // Update isJoined state when meetup participants or currentUser changes
  useEffect(() => {
    if (meetup && currentUser) {
      const userIsParticipant = meetup.participants.includes(currentUser.uid);
      console.log("🔄 [MeetupDetailsScreen] Updating isJoined state:", {
        meetupId: meetup.id,
        userId: currentUser.uid,
        participants: meetup.participants,
        userIsParticipant,
        currentIsJoined: isJoined,
      });
      setIsJoined(userIsParticipant);
    } else if (!currentUser) {
      setIsJoined(false);
    }
  }, [meetup?.participants?.join(","), meetup?.id, currentUser?.uid]);

  useEffect(() => {
    const fetchMeetupData = async () => {
      try {
        setLoading(true);

        // If we have meetup data passed in, fetch creator and participants from Supabase
        if (meetupData) {
          setMeetup(meetupData);

          // Fetch creator from Supabase
          if (meetupData.creatorId) {
            try {
              const creatorData = await SupabaseDataService.getUser(
                meetupData.creatorId
              );
              if (creatorData) {
                setCreator(creatorData);
              }
            } catch (error) {
              console.error("Error fetching creator:", error);
              // Use creator data if available
              if (meetupData.creatorId) {
                // Creator data will be fetched separately
              }
            }
          }

          // Fetch participants from Supabase using getUsersByIds for efficiency
          if (meetupData.participants && meetupData.participants.length > 0) {
            try {
              const participantsData = await SupabaseDataService.getUsersByIds(
                meetupData.participants
              );
              // Filter out the creator from participants list since they're displayed separately
              const otherParticipants = participantsData.filter(
                (p) => p.uid !== meetupData.creatorId
              );
              setParticipants(otherParticipants);
            } catch (error) {
              console.error("Error fetching participants:", error);
              setParticipants([]);
            }
          } else {
            setParticipants([]);
          }

          // Update isJoined based on participants
          if (currentUser && meetupData.participants) {
            const userIsParticipant = meetupData.participants.includes(
              currentUser.uid
            );
            console.log(
              "🔄 [MeetupDetailsScreen] Setting isJoined from meetupData:",
              {
                meetupId: meetupData.id,
                userId: currentUser.uid,
                participants: meetupData.participants,
                userIsParticipant,
              }
            );
            setIsJoined(userIsParticipant);
          }

          return;
        }

        // Clean the meetup ID (remove any prefixes)
        const cleanMeetupId = meetupId.replace(/^meetup-/, "");

        // Try to fetch from Supabase first
        const fetchedMeetup = await SupabaseDataService.getMeetup(
          cleanMeetupId
        );

        if (!fetchedMeetup) {
          // Meetup not found in Supabase - show error and go back
          Alert.alert("Error", "Meetup not found.");
          navigation.goBack();
          return;
        }

        setMeetup(fetchedMeetup);

        // Fetch creator information
        if (fetchedMeetup.creatorId) {
          try {
            const creatorData = await SupabaseDataService.getUser(
              fetchedMeetup.creatorId
            );
            if (creatorData) {
              setCreator(creatorData);
            }
          } catch (error) {
            console.error("Error fetching creator:", error);
            // Creator not found in Supabase - leave as null
            setCreator(null);
          }
        }

        // Fetch participants from Supabase using getUsersByIds for efficiency
        // Note: participants array from meetup includes the creatorId
        if (
          fetchedMeetup.participants &&
          fetchedMeetup.participants.length > 0
        ) {
          try {
            const participantsData = await SupabaseDataService.getUsersByIds(
              fetchedMeetup.participants
            );
            // Filter out the creator from participants list since they're displayed separately
            const otherParticipants = participantsData.filter(
              (p) => p.uid !== fetchedMeetup.creatorId
            );
            setParticipants(otherParticipants);
          } catch (error) {
            console.error("Error fetching participants:", error);
            // If error fetching participants, show empty list
            setParticipants([]);
          }
        } else {
          // No participants in the array, set empty array
          setParticipants([]);
        }

        // Update isJoined based on fetched meetup participants
        if (currentUser && fetchedMeetup.participants) {
          const userIsParticipant = fetchedMeetup.participants.includes(
            currentUser.uid
          );
          console.log(
            "🔄 [MeetupDetailsScreen] Setting isJoined from fetched meetup:",
            {
              meetupId: fetchedMeetup.id,
              userId: currentUser.uid,
              participants: fetchedMeetup.participants,
              userIsParticipant,
            }
          );
          setIsJoined(userIsParticipant);
        }
      } catch (error) {
        console.error("Error fetching meetup data:", error);
        Alert.alert("Error", "Failed to load meetup. Please try again.");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };

    fetchMeetupData();
  }, [meetupId, meetupData, currentUser]);

  // Refresh meetup data when screen comes into focus (in case it was updated elsewhere)
  useFocusEffect(
    useCallback(() => {
      const refreshMeetupData = async () => {
        if (!meetup) return;

        console.log("🔄 [MeetupDetailsScreen] Refreshing meetup data on focus");
        try {
          const refreshedMeetup = await SupabaseDataService.getMeetup(
            meetup.id
          );
          if (refreshedMeetup) {
            setMeetup(refreshedMeetup);

            // Update isJoined based on refreshed data
            if (currentUser && refreshedMeetup.participants) {
              const userIsParticipant = refreshedMeetup.participants.includes(
                currentUser.uid
              );
              console.log(
                "🔄 [MeetupDetailsScreen] Updated isJoined from refreshed meetup:",
                {
                  meetupId: refreshedMeetup.id,
                  userId: currentUser.uid,
                  participants: refreshedMeetup.participants,
                  userIsParticipant,
                }
              );
              setIsJoined(userIsParticipant);
            }

            // Refresh participants list
            if (
              refreshedMeetup.participants &&
              refreshedMeetup.participants.length > 0
            ) {
              try {
                const participantsData =
                  await SupabaseDataService.getUsersByIds(
                    refreshedMeetup.participants
                  );
                const otherParticipants = participantsData.filter(
                  (p) => p.uid !== refreshedMeetup.creatorId
                );
                setParticipants(otherParticipants);
              } catch (error) {
                console.error("Error refreshing participants:", error);
              }
            }
          }
        } catch (error) {
          console.error("Error refreshing meetup data:", error);
        }
      };

      refreshMeetupData();
    }, [meetup?.id, currentUser?.uid])
  );

  const handleJoin = async () => {
    if (!meetup || !currentUser) return;

    console.log("🔄 [MeetupDetailsScreen] handleJoin called:", {
      meetupId: meetup.id,
      userId: currentUser.uid,
      currentIsJoined: isJoined,
    });

    if (isJoined) {
      console.log("➖ [MeetupDetailsScreen] Leaving meetup");
      try {
        const updatedMeetup = await DataService.removeUserFromMeetup(
          meetup.id,
          currentUser.uid
        );
        if (updatedMeetup) {
          setMeetup(updatedMeetup);
          setIsJoined(false);
          setSnackbarMessage("Left meetup");
          console.log("✅ [MeetupDetailsScreen] Successfully left meetup");

          // Remove user from group chat
          try {
            await DataService.removeUserFromMeetupGroupChat(
              meetup.id,
              currentUser.uid
            );
            console.log(
              "✅ [MeetupDetailsScreen] Successfully removed from group chat"
            );
          } catch (error) {
            console.error(
              "❌ [MeetupDetailsScreen] Error removing from group chat:",
              error
            );
            // Don't fail the leave if group chat removal fails
          }

          // Refresh participants list
          if (
            updatedMeetup.participants &&
            updatedMeetup.participants.length > 0
          ) {
            try {
              const participantsData = await SupabaseDataService.getUsersByIds(
                updatedMeetup.participants
              );
              const otherParticipants = participantsData.filter(
                (p) => p.uid !== updatedMeetup.creatorId
              );
              setParticipants(otherParticipants);
              console.log(
                "✅ [MeetupDetailsScreen] Refreshed participants list after leave"
              );
            } catch (error) {
              console.error(
                "❌ [MeetupDetailsScreen] Error refreshing participants:",
                error
              );
            }
          } else {
            setParticipants([]);
          }
        }
      } catch (error: any) {
        console.error("❌ [MeetupDetailsScreen] Error leaving meetup:", error);
        Alert.alert(
          "Error",
          `Failed to leave meetup: ${error.message || "Unknown error"}`
        );
        return;
      }
    } else {
      if (
        meetup.maxParticipants &&
        meetup.currentParticipants >= meetup.maxParticipants
      ) {
        Alert.alert(
          "Meetup Full",
          "This meetup is currently full. You can join the waitlist."
        );
        return;
      }

      console.log("➕ [MeetupDetailsScreen] Joining meetup");
      try {
        // Add user to meetup participants
        const updatedMeetup = await DataService.addUserToMeetup(
          meetup.id,
          currentUser.uid
        );

        if (updatedMeetup) {
          setMeetup(updatedMeetup);
          setIsJoined(true);
          setSnackbarMessage("Joined meetup");
          console.log("✅ [MeetupDetailsScreen] Successfully joined meetup");

          // Create or join group chat for the meetup
          try {
            // Check if group chat already exists
            let groupChat = await DataService.findMeetupGroupChat(meetup.id);

            if (!groupChat) {
              // Create new group chat with all current participants
              const participants = [meetup.creatorId, currentUser.uid];
              groupChat = await DataService.createMeetupGroupChat(
                meetup.id,
                meetup.title,
                meetup.images?.[0] || "",
                participants
              );
            } else {
              // Add user to existing group chat
              groupChat = await DataService.addUserToMeetupGroupChat(
                meetup.id,
                currentUser.uid
              );
            }

            if (groupChat) {
              console.log(
                "✅ [MeetupDetailsScreen] Successfully joined meetup group chat:",
                groupChat.id
              );
            }
          } catch (error) {
            console.error(
              "❌ [MeetupDetailsScreen] Error creating/joining group chat:",
              error
            );
            // Don't fail the join if group chat creation fails
          }

          // TODO: Send notification to meetup creator
          if (meetup.creatorId !== currentUser.uid) {
            console.log("TODO: Send notification to meetup creator");
          }

          // Refresh participants list
          if (
            updatedMeetup.participants &&
            updatedMeetup.participants.length > 0
          ) {
            try {
              const participantsData = await SupabaseDataService.getUsersByIds(
                updatedMeetup.participants
              );
              const otherParticipants = participantsData.filter(
                (p) => p.uid !== updatedMeetup.creatorId
              );
              setParticipants(otherParticipants);
              console.log(
                "✅ [MeetupDetailsScreen] Refreshed participants list after join"
              );
            } catch (error) {
              console.error(
                "❌ [MeetupDetailsScreen] Error refreshing participants:",
                error
              );
            }
          }
        } else {
          console.error(
            "❌ [MeetupDetailsScreen] addUserToMeetup returned null"
          );
          Alert.alert("Error", "Failed to join meetup. Please try again.");
          return;
        }
      } catch (error: any) {
        console.error("❌ [MeetupDetailsScreen] Error joining meetup:", error);
        Alert.alert(
          "Error",
          `Failed to join meetup: ${error.message || "Unknown error"}`
        );
        return;
      }
    }

    setShowSnackbar(true);
  };

  const handleLike = () => {
    if (!meetup) return;

    const isFavorite = isMeetupFavorite(meetup.id);

    if (isFavorite) {
      removeMeetupFromFavorites(meetup.id);
      setSnackbarMessage("Removed from favorites");
    } else {
      addMeetupToFavorites(meetup.id);
      setSnackbarMessage("Added to favorites");
    }

    setShowSnackbar(true);
  };

  const handleSnackbarAction = () => {
    setShowSnackbar(false);
    navigation.navigate("Favorites");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading meetup details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!meetup) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={colors.error} />
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Meetup Not Found
          </Text>
          <Text style={[styles.errorMessage, { color: colors.textSecondary }]}>
            This meetup could not be found or may have been removed.
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, { color: colors.onPrimary }]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Meetup Details
        </Text>
        <View style={styles.headerActions}>
          {!isOwnMeetup && (
            <TouchableOpacity
              onPress={handleLike}
              style={styles.headerLikeButton}
            >
              <Ionicons
                name={
                  meetup && isMeetupFavorite(meetup.id)
                    ? "heart"
                    : "heart-outline"
                }
                size={24}
                color={
                  meetup && isMeetupFavorite(meetup.id)
                    ? colors.error
                    : colors.text
                }
              />
            </TouchableOpacity>
          )}
          <ShareButton
            type="meetup"
            data={meetup}
            variant="icon"
            size="large"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Cover Image */}
        {meetup.coverImage && (
          <Image
            source={{ uri: meetup.coverImage }}
            style={styles.coverImage}
          />
        )}

        {/* Meetup Header */}
        <View
          style={[styles.meetupHeader, { backgroundColor: colors.surface }]}
        >
          <View style={styles.meetupTitleContainer}>
            <Text style={[styles.meetupTitle, { color: colors.text }]}>
              {meetup.title}
            </Text>
            {meetup.isRecurring && (
              <View
                style={[
                  styles.recurringBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="repeat" size={12} color={colors.onPrimary} />
                <Text
                  style={[styles.recurringText, { color: colors.onPrimary }]}
                >
                  Recurring
                </Text>
              </View>
            )}
          </View>

          <Text
            style={[styles.meetupDescription, { color: colors.textSecondary }]}
          >
            {meetup.description}
          </Text>

          <View style={styles.meetupStats}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.text }]}>
                {meetup.currentParticipants || 0}/{meetup.maxParticipants || 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Time & Location */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons name="time-outline" size={20} color={colors.primary} />
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                When
              </Text>
            </View>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {meetup.time ? formatDate(meetup.time) : "Date not specified"}
            </Text>
            <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
              {meetup.time ? formatTime(meetup.time) : "Time not specified"} •{" "}
              {meetup.duration || "Duration not specified"} minutes
            </Text>
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Where
              </Text>
            </View>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {meetup.locationName || "Location not specified"}
            </Text>
            <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
              {meetup.address || "Address not specified"}
            </Text>
          </View>
        </View>

        {/* Participants */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={styles.infoHeader}>
            <Ionicons name="people-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Participants ({(creator ? 1 : 0) + (participants?.length || 0)})
            </Text>
          </View>
          <View style={styles.participantsList}>
            {/* Creator with crown icon */}
            {creator && (
              <TouchableOpacity
                style={styles.participantItem}
                onPress={() => {
                  // Don't navigate if clicking on own avatar
                  if (currentUser?.uid && creator.uid === currentUser.uid) {
                    return;
                  }
                  navigation.navigate("UserProfile", {
                    userId: creator.uid,
                    userData: creator,
                  });
                }}
                activeOpacity={currentUser?.uid === creator.uid ? 1 : 0.7}
                disabled={currentUser?.uid === creator.uid}
              >
                <View style={styles.participantAvatarContainer}>
                  {creator?.profilePictures &&
                  creator.profilePictures.length > 0 ? (
                    <Image
                      source={{
                        uri: creator.profilePictures[
                          creator.standoutPhotoIndex !== undefined
                            ? creator.standoutPhotoIndex
                            : 0
                        ],
                      }}
                      style={styles.participantAvatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.participantAvatar,
                        { backgroundColor: colors.border },
                        { justifyContent: "center", alignItems: "center" },
                      ]}
                    >
                      <Ionicons
                        name="person"
                        size={20}
                        color={colors.textTertiary}
                      />
                    </View>
                  )}
                  <View
                    style={[
                      styles.crownContainer,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Ionicons name="star" size={12} color={colors.onPrimary} />
                  </View>
                </View>
                <Text style={[styles.participantName, { color: colors.text }]}>
                  {creator?.displayName || "Creator"}
                </Text>
              </TouchableOpacity>
            )}
            {/* Other participants */}
            {participants &&
              participants.map((participant: any) => (
                <TouchableOpacity
                  key={participant.uid}
                  style={styles.participantItem}
                  onPress={() => {
                    // Don't navigate if clicking on own avatar
                    if (currentUser?.uid && participant.uid === currentUser.uid) {
                      return;
                    }
                    navigation.navigate("UserProfile", {
                      userId: participant.uid,
                      userData: participant,
                    });
                  }}
                  activeOpacity={currentUser?.uid === participant.uid ? 1 : 0.7}
                  disabled={currentUser?.uid === participant.uid}
                >
                  {participant?.profilePictures &&
                  participant.profilePictures.length > 0 ? (
                    <Image
                      source={{
                        uri: participant.profilePictures[
                          participant.standoutPhotoIndex !== undefined
                            ? participant.standoutPhotoIndex
                            : 0
                        ],
                      }}
                      style={styles.participantAvatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.participantAvatar,
                        { backgroundColor: colors.border },
                        { justifyContent: "center", alignItems: "center" },
                      ]}
                    >
                      <Ionicons
                        name="person"
                        size={20}
                        color={colors.textTertiary}
                      />
                    </View>
                  )}
                  <Text
                    style={[styles.participantName, { color: colors.text }]}
                  >
                    {participant?.displayName || "Participant"}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={[
          styles.actionBar,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        {isOwnMeetup ? (
          <TouchableOpacity
            style={[
              styles.joinButton,
              {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => {
              navigation.navigate("EditMeetup", { meetupId: meetup?.id || "" });
            }}
          >
            <Ionicons
              name="create-outline"
              size={20}
              color={colors.onPrimary}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.joinButtonText, { color: colors.onPrimary }]}>
              Edit Meetup
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.joinButton,
              {
                backgroundColor: isJoined ? colors.error : colors.primary,
              },
            ]}
            onPress={handleJoin}
          >
            <Text style={[styles.joinButtonText, { color: colors.onPrimary }]}>
              {isJoined ? "Leave Meetup" : "Join Meetup"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Snackbar */}
      <Snackbar
        visible={showSnackbar}
        message={snackbarMessage}
        actionText="View Favorites"
        onAction={handleSnackbarAction}
        onDismiss={() => setShowSnackbar(false)}
        type="success"
        duration={4000}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLikeButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
    marginLeft: 4,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  coverImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  meetupHeader: {
    padding: 20,
    marginBottom: 16,
  },
  meetupTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  meetupTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  recurringBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  recurringText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  meetupDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  meetupStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "500",
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
  },
  organizerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  organizerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  organizerDetails: {
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  organizerBio: {
    fontSize: 14,
  },
  participantsList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  participantItem: {
    alignItems: "center",
    marginRight: 16,
    marginBottom: 16,
  },
  participantAvatarContainer: {
    position: "relative",
    marginBottom: 4,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  crownContainer: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  participantName: {
    fontSize: 12,
    textAlign: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  requirementsList: {
    marginTop: 8,
  },
  requirementText: {
    fontSize: 14,
    marginBottom: 4,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  joinButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
