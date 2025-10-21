import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useFavoritesStore } from "../../hooks/useFavoritesStore";
import { getMockMeetups, getMockUsers } from "../../data/mockData";
import Snackbar from "../../components/Snackbar";

interface MeetupDetailsScreenProps {
  route: {
    params: {
      meetupId: string;
      meetupData?: any;
    };
  };
  navigation: any;
}

export default function MeetupDetailsScreen({
  route,
  navigation,
}: MeetupDetailsScreenProps) {
  const { colors } = useThemeStore();
  const { addMeetupToFavorites, removeMeetupFromFavorites, isMeetupFavorite } =
    useFavoritesStore();
  const { meetupId, meetupData } = route.params;

  const [isJoined, setIsJoined] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Use meetupData from navigation params if available, otherwise find from mock data
  // Clean the meetupId to remove "meetups/" prefix if present
  const cleanMeetupId = meetupId?.replace("meetups/", "") || meetupId;
  const meetup =
    meetupData || getMockMeetups().find((m) => m.id === cleanMeetupId);
  const creator =
    meetupData?.organizer ||
    getMockUsers().find((u) => u.uid === meetup?.creatorId) ||
    getMockUsers().find(
      (u) => u.uid === meetup?.creatorRef?.replace("users/", "")
    );

  const participants =
    meetupData?.participants ||
    getMockUsers().filter((u) => meetup?.participants?.includes(u.uid));

  if (!meetup) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>
            Meetup not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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

  const handleJoin = () => {
    if (isJoined) {
      Alert.alert(
        "Leave Meetup",
        "Are you sure you want to leave this meetup?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Leave",
            style: "destructive",
            onPress: () => setIsJoined(false),
          },
        ]
      );
    } else {
      if (meetup.currentParticipants >= meetup.maxParticipants) {
        Alert.alert(
          "Meetup Full",
          "This meetup is currently full. You can join the waitlist."
        );
        return;
      }
      setIsJoined(true);
      Alert.alert("Success", "You've joined the meetup!");
    }
  };

  const handleShare = () => {
    Alert.alert(
      "Share Meetup",
      "Share functionality will be implemented soon!"
    );
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
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
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.text }]}>
                {meetup.engagementScore || 0}% engagement
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

        {/* Organizer */}
        {creator && (
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <View style={styles.infoHeader}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Organizer
              </Text>
            </View>
            <View style={styles.organizerInfo}>
              <Image
                source={{
                  uri:
                    creator?.profilePictures?.[
                      creator.standoutPhotoIndex !== undefined
                        ? creator.standoutPhotoIndex
                        : 0
                    ] ||
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                }}
                style={styles.organizerAvatar}
              />
              <View style={styles.organizerDetails}>
                <Text style={[styles.organizerName, { color: colors.text }]}>
                  {creator?.displayName || "Organizer"}
                </Text>
                <Text
                  style={[styles.organizerBio, { color: colors.textSecondary }]}
                >
                  {creator?.bio || "No bio available"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Participants */}
        {participants && participants.length > 0 && (
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <View style={styles.infoHeader}>
              <Ionicons
                name="people-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.infoTitle, { color: colors.text }]}>
                Participants ({participants.length})
              </Text>
            </View>
            <View style={styles.participantsList}>
              {participants.map((participant: any) => (
                <View key={participant.uid} style={styles.participantItem}>
                  <Image
                    source={{
                      uri:
                        participant?.profilePictures?.[
                          participant.standoutPhotoIndex !== undefined
                            ? participant.standoutPhotoIndex
                            : 0
                        ] ||
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                    }}
                    style={styles.participantAvatar}
                  />
                  <Text
                    style={[styles.participantName, { color: colors.text }]}
                  >
                    {participant?.displayName || "Participant"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tags */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={styles.infoHeader}>
            <Ionicons
              name="pricetag-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.infoTitle, { color: colors.text }]}>Tags</Text>
          </View>
          <View style={styles.tagsContainer}>
            {meetup.tags?.map((tag: string, index: number) => (
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

        {/* Requirements */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={styles.infoHeader}>
            <Ionicons
              name="checkmark-circle-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              Requirements
            </Text>
          </View>
          <View style={styles.requirementsList}>
            {meetup.requirements?.minAge && (
              <Text
                style={[
                  styles.requirementText,
                  { color: colors.textSecondary },
                ]}
              >
                • Minimum age: {meetup.requirements?.minAge}
              </Text>
            )}
            {meetup.requirements?.maxAge && (
              <Text
                style={[
                  styles.requirementText,
                  { color: colors.textSecondary },
                ]}
              >
                • Maximum age: {meetup.requirements?.maxAge}
              </Text>
            )}
            {meetup.requirements?.verificationRequired && (
              <Text
                style={[
                  styles.requirementText,
                  { color: colors.textSecondary },
                ]}
              >
                • ID verification required
              </Text>
            )}
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
  backButton: {
    padding: 8,
    marginRight: 8,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
  },
  meetupHeader: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
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
    fontSize: 10,
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
    justifyContent: "space-around",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  infoCard: {
    padding: 20,
    marginBottom: 16,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
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
    marginBottom: 12,
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 4,
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
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  coverImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
});
