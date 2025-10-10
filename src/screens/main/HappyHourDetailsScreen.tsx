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

interface HappyHourDetailsScreenProps {
  route: {
    params: {
      eventId: string;
      event?: Event;
    };
  };
  navigation: any;
}

export default function HappyHourDetailsScreen({
  route,
  navigation,
}: HappyHourDetailsScreenProps) {
  const { colors } = useThemeStore();
  const { addEventToFavorites, removeEventFromFavorites, isEventFavorite } =
    useFavoritesStore();
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
            Happy Hour Details
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
            The requested happy hour event could not be loaded.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const [isGoing, setIsGoing] = useState(false);
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

  const handleGoingToEvent = () => {
    if (isGoing) {
      Alert.alert(
        "Leave Event",
        "Are you sure you want to leave this happy hour?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Leave",
            style: "destructive",
            onPress: () => setIsGoing(false),
          },
        ]
      );
    } else {
      Alert.alert("Join Happy Hour", `Join "${event.title}"?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "I'm Going!",
          onPress: () => setIsGoing(true),
        },
      ]);
    }
  };

  const handleShareEvent = () => {
    Alert.alert("Share Happy Hour", "Share functionality coming soon!");
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

  const happyHourDetails = event.happyHourDetails;

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
          Happy Hour Deal
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

        {/* Deal Banner - Prominent */}
        {happyHourDetails?.discount && (
          <View
            style={[
              styles.dealBanner,
              {
                backgroundColor: colors.accent + "15",
                borderColor: colors.accent,
              },
            ]}
          >
            <View style={styles.dealBannerContent}>
              <Ionicons
                name="pricetag"
                size={28}
                color={colors.accent}
                style={styles.dealIcon}
              />
              <View style={styles.dealTextContainer}>
                <Text style={[styles.dealTitle, { color: colors.accent }]}>
                  SPECIAL DEAL
                </Text>
                <Text style={[styles.dealText, { color: colors.text }]}>
                  {happyHourDetails.discount}
                </Text>
              </View>
            </View>
            {happyHourDetails.discountPercentage && (
              <View
                style={[
                  styles.percentageBadge,
                  { backgroundColor: colors.accent },
                ]}
              >
                <Text
                  style={[styles.percentageText, { color: colors.onAccent }]}
                >
                  {happyHourDetails.discountPercentage}% OFF
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Event Content */}
        <View style={styles.content}>
          {/* Title and Venue Type */}
          <View style={styles.titleSection}>
            <Text style={[styles.eventTitle, { color: colors.text }]}>
              {event.title}
            </Text>
            {event.venueType && (
              <View
                style={[
                  styles.venueTypeBadge,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Ionicons
                  name="business-outline"
                  size={16}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.venueTypeText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {event.venueType}
                </Text>
              </View>
            )}
          </View>

          {/* Deal Time Window - Prominent */}
          {happyHourDetails?.dealTimeWindow && (
            <View
              style={[
                styles.timeWindowCard,
                {
                  backgroundColor: colors.primary + "10",
                  borderColor: colors.primary,
                },
              ]}
            >
              <Ionicons name="time" size={24} color={colors.primary} />
              <View style={styles.timeWindowContent}>
                <Text
                  style={[
                    styles.timeWindowLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Deal Available
                </Text>
                <Text
                  style={[styles.timeWindowText, { color: colors.primary }]}
                >
                  {happyHourDetails.dealTimeWindow}
                </Text>
              </View>
            </View>
          )}

          {/* Deal Highlights */}
          {happyHourDetails?.dealHighlights &&
            happyHourDetails.dealHighlights.length > 0 && (
              <View
                style={[styles.section, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  What's Included
                </Text>
                {happyHourDetails.dealHighlights.map((highlight, index) => (
                  <View key={index} style={styles.highlightRow}>
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={colors.accentTertiary}
                    />
                    <Text
                      style={[styles.highlightText, { color: colors.text }]}
                    >
                      {highlight}
                    </Text>
                  </View>
                ))}
              </View>
            )}

          {/* Special Menu Items */}
          {happyHourDetails?.specialMenuItems &&
            happyHourDetails.specialMenuItems.length > 0 && (
              <View
                style={[styles.section, { backgroundColor: colors.surface }]}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Special Menu
                </Text>
                {happyHourDetails.specialMenuItems.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.menuItem,
                      index < happyHourDetails.specialMenuItems!.length - 1 && {
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <View style={styles.menuItemHeader}>
                      <Text
                        style={[styles.menuItemName, { color: colors.text }]}
                      >
                        {item.name}
                      </Text>
                      <View style={styles.priceContainer}>
                        <Text
                          style={[
                            styles.originalPrice,
                            { color: colors.textTertiary },
                          ]}
                        >
                          ${item.originalPrice}
                        </Text>
                        <Text
                          style={[styles.dealPrice, { color: colors.accent }]}
                        >
                          ${item.dealPrice}
                        </Text>
                      </View>
                    </View>
                    {item.description && (
                      <Text
                        style={[
                          styles.menuItemDescription,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {item.description}
                      </Text>
                    )}
                    <View
                      style={[
                        styles.savingsBadge,
                        { backgroundColor: colors.accentTertiary + "20" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.savingsText,
                          { color: colors.accentTertiary },
                        ]}
                      >
                        Save ${(item.originalPrice - item.dealPrice).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

          {/* Venue & Time Information */}
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
                  Event Date & Time
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
          </View>

          {/* Who's Going */}
          {event.whosGoing && event.whosGoing.length > 0 && (
            <View style={[styles.section, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Who's Going ({event.whosGoing.length})
              </Text>
              <View style={styles.attendeesContainer}>
                {event.whosGoing.slice(0, 6).map((person, index) => (
                  <View key={person.id} style={styles.attendeeItem}>
                    <View
                      style={[
                        styles.attendeeAvatar,
                        {
                          backgroundColor: colors.surface,
                          borderColor: person.isCheckedIn
                            ? colors.primary
                            : colors.border,
                          borderWidth: person.isCheckedIn ? 2 : 1,
                        },
                      ]}
                    >
                      <Image
                        source={{ uri: person.avatar }}
                        style={styles.attendeeAvatarImage}
                      />
                      {person.isCheckedIn && (
                        <View
                          style={[
                            styles.checkInIndicator,
                            { backgroundColor: colors.primary },
                          ]}
                        >
                          <Ionicons
                            name="checkmark"
                            size={10}
                            color={colors.onPrimary}
                          />
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.attendeeName,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {person.name}
                    </Text>
                  </View>
                ))}
                {event.whosGoing.length > 6 && (
                  <View style={styles.attendeeItem}>
                    <View
                      style={[
                        styles.attendeeAvatar,
                        styles.moreAttendeesAvatar,
                        { backgroundColor: colors.border },
                      ]}
                    >
                      <Text
                        style={[
                          styles.moreAttendeesText,
                          { color: colors.text },
                        ]}
                      >
                        +{event.whosGoing.length - 6}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* About Section */}
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              About This Happy Hour
            </Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {event.description}
            </Text>
          </View>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
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
          )}
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
          style={[
            styles.goingButton,
            {
              backgroundColor: isGoing ? colors.accentTertiary : colors.accent,
            },
          ]}
          onPress={handleGoingToEvent}
        >
          <Ionicons
            name={isGoing ? "checkmark" : "wine"}
            size={20}
            color={colors.onAccent}
          />
          <Text style={[styles.goingButtonText, { color: colors.onAccent }]}>
            {isGoing ? "I'm Going!" : "Join Happy Hour"}
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
  dealBanner: {
    margin: 20,
    marginBottom: 0,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  dealBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dealIcon: {
    marginRight: 12,
  },
  dealTextContainer: {
    flex: 1,
  },
  dealTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  dealText: {
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 26,
  },
  percentageBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  eventTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 34,
  },
  venueTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  venueTypeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  timeWindowCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
  },
  timeWindowContent: {
    marginLeft: 12,
    flex: 1,
  },
  timeWindowLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  timeWindowText: {
    fontSize: 18,
    fontWeight: "700",
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  highlightRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  highlightText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },
  menuItem: {
    paddingVertical: 16,
  },
  menuItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: "700",
  },
  menuItemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  savingsBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  savingsText: {
    fontSize: 12,
    fontWeight: "600",
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  attendeesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  attendeeItem: {
    alignItems: "center",
    width: 60,
  },
  attendeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
    marginBottom: 6,
  },
  attendeeAvatarImage: {
    width: "100%",
    height: "100%",
  },
  checkInIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  attendeeName: {
    fontSize: 11,
    textAlign: "center",
  },
  moreAttendeesAvatar: {
    justifyContent: "center",
    alignItems: "center",
  },
  moreAttendeesText: {
    fontSize: 14,
    fontWeight: "600",
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
  goingButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  goingButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  errorDescription: {
    fontSize: 16,
    textAlign: "center",
  },
});
