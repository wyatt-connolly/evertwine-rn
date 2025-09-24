import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useFavoritesStore } from "../../hooks/useFavoritesStore";
import { Event } from "../../types";
import Snackbar from "../../components/Snackbar";

const { width } = Dimensions.get("window");

interface EventDetailsScreenProps {
  route: {
    params: {
      eventId: string;
      event?: Event;
    };
  };
  navigation: any;
}

export default function EventDetailsScreen({
  route,
  navigation,
}: EventDetailsScreenProps) {
  const { colors } = useThemeStore();
  const {
    favoriteEvents,
    addEventToFavorites,
    removeEventFromFavorites,
    isEventFavorite,
  } = useFavoritesStore();
  const eventId = route.params?.eventId;
  const rawEvent = route.params?.event;

  // Deserialize the event data (convert ISO strings back to Date objects)
  const event = rawEvent
    ? {
        ...rawEvent,
        startTime: rawEvent.startTime
          ? new Date(rawEvent.startTime)
          : undefined,
        endTime: rawEvent.endTime ? new Date(rawEvent.endTime) : undefined,
        createdAt: rawEvent.createdAt
          ? new Date(rawEvent.createdAt)
          : undefined,
        updatedAt: rawEvent.updatedAt
          ? new Date(rawEvent.updatedAt)
          : undefined,
      }
    : undefined;

  // If no event is provided, show error or go back
  if (!event) {
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
            Event Details
          </Text>
          <View style={styles.headerRight} />
        </View>
        <View style={styles.content}>
          <Text style={[styles.errorTitle, { color: colors.text }]}>
            Event not found
          </Text>
          <Text
            style={[styles.errorDescription, { color: colors.textSecondary }]}
          >
            The requested event could not be loaded.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const [isJoined, setIsJoined] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleJoinEvent = () => {
    if (isJoined) {
      Alert.alert("Leave Event", "Are you sure you want to leave this event?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => setIsJoined(false),
        },
      ]);
    } else {
      Alert.alert("Join Event", `Join "${event.title}"?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Join",
          onPress: () => setIsJoined(true),
        },
      ]);
    }
  };

  const handleShareEvent = () => {
    Alert.alert("Share Event", "Share functionality coming soon!");
  };

  const handleContactOrganizer = () => {
    Alert.alert("Contact Organizer", "Message functionality coming soon!");
  };

  const handleFavorite = () => {
    if (!event) return;

    const isFavorite = isEventFavorite(event.id);

    if (isFavorite) {
      removeEventFromFavorites(event.id);
      setSnackbarMessage("Removed from favorites");
    } else {
      addEventToFavorites(event.id);
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
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Event Details
        </Text>
        <TouchableOpacity onPress={handleShareEvent} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Event Image */}
        <Image source={{ uri: event.coverImage }} style={styles.eventImage} />

        {/* Event Content */}
        <View style={styles.content}>
          {/* Title and Price */}
          <View style={styles.titleSection}>
            <Text style={[styles.eventTitle, { color: colors.text }]}>
              {event.title}
            </Text>
            <View
              style={[styles.priceTag, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.priceText, { color: colors.onPrimary }]}>
                ${event.price}
              </Text>
            </View>
          </View>

          {/* Date and Time */}
          <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
            <View style={styles.infoRow}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Date & Time
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {formatDate(event.startTime)} at {formatTime(event.startTime)}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Location
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {event.locationName}
                </Text>
                <Text
                  style={[styles.infoSubtext, { color: colors.textTertiary }]}
                >
                  {event.address}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Ionicons
                name="people-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.infoContent}>
                <Text
                  style={[styles.infoLabel, { color: colors.textSecondary }]}
                >
                  Attendees
                </Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>
                  {event.currentAttendees} of {event.maxAttendees} people
                </Text>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              About This Event
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {event.description}
            </Text>
          </View>

          {/* Tags */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Tags
            </Text>
            <View style={styles.tagsContainer}>
              {event.tags.map((tag, index) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Text style={[styles.tagText, { color: colors.primary }]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Organizer */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Organizer
            </Text>
            <TouchableOpacity
              style={styles.organizerCard}
              onPress={() => {
                navigation.navigate("UserProfile", {
                  userId: event.organizerId,
                  userData: {
                    uid: event.organizerId,
                    displayName: event.organizerName,
                    photoURL: event.organizerAvatar,
                    bio: "Event Organizer",
                  },
                });
              }}
            >
              <Image
                source={{ uri: event.organizerAvatar }}
                style={styles.organizerAvatar}
              />
              <View style={styles.organizerInfo}>
                <Text style={[styles.organizerName, { color: colors.text }]}>
                  {event.organizerName}
                </Text>
                <Text
                  style={[styles.organizerBio, { color: colors.textSecondary }]}
                >
                  Event Organizer
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
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
          style={[styles.favoriteButton, { borderColor: colors.border }]}
          onPress={handleFavorite}
        >
          <Ionicons
            name={
              event && isEventFavorite(event.id) ? "heart" : "heart-outline"
            }
            size={24}
            color={
              event && isEventFavorite(event.id)
                ? colors.error
                : colors.textSecondary
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.contactButton, { borderColor: colors.border }]}
          onPress={handleContactOrganizer}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.contactButtonText, { color: colors.primary }]}>
            Contact
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.joinButton,
            {
              backgroundColor: isJoined ? colors.error : colors.primary,
            },
          ]}
          onPress={handleJoinEvent}
        >
          <Ionicons
            name={isJoined ? "checkmark" : "add"}
            size={20}
            color={colors.onPrimary}
          />
          <Text style={[styles.joinButtonText, { color: colors.onPrimary }]}>
            {isJoined ? "Joined" : "Join Event"}
          </Text>
        </TouchableOpacity>
      </View>

      <Snackbar
        visible={showSnackbar}
        message={snackbarMessage}
        actionText="View Favorites"
        onAction={handleSnackbarAction}
        onDismiss={() => setShowSnackbar(false)}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 32,
  },
  shareButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  eventImage: {
    width: "100%",
    height: 250,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
    marginRight: 16,
  },
  priceTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  infoSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
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
    fontSize: 14,
    fontWeight: "500",
  },
  organizerCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  organizerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  organizerInfo: {
    flex: 1,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  organizerBio: {
    fontSize: 14,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  joinButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    textAlign: "center",
  },
});
