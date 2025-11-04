import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { Meetup } from "../../types";

interface CreateMeetupStep4ScreenProps {
  navigation: any;
  route: {
    params: {
      formData: any;
      onUpdate?: (data: any) => void;
    };
  };
}

export default function CreateMeetupStep4Screen({
  navigation,
  route,
}: CreateMeetupStep4ScreenProps) {
  const { colors } = useThemeStore();
  const { createMeetup } = useMeetupStore();
  const user = useAuthStore((state) => state.user);
  const { formData, onUpdate } = route.params;

  const [isPublishing, setIsPublishing] = useState(false);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const formatDuration = (minutes: string) => {
    const mins = parseInt(minutes);
    if (mins < 60) {
      return `${mins} minutes`;
    } else if (mins === 60) {
      return "1 hour";
    } else if (mins < 120) {
      return `${mins / 60} hours`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMinutes = mins % 60;
      if (remainingMinutes === 0) {
        return `${hours} hours`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      // Validate user is authenticated
      if (!user?.uid) {
        Alert.alert("Error", "You must be logged in to create a meetup.", [
          { text: "OK" },
        ]);
        return;
      }

      // Create the meetup object with proper TypeScript typing
      const meetupData: Omit<Meetup, "id" | "createdAt" | "updatedAt"> = {
        title: formData.title,
        description: formData.description,
        creatorId: user.uid,
        creatorRef: user.uid,
        location:
          formData.latitude && formData.longitude
            ? { latitude: formData.latitude, longitude: formData.longitude }
            : { latitude: 0, longitude: 0 },
        locationName: formData.locationName,
        address: formData.address,
        time: new Date(formData.time),
        duration: parseInt(formData.duration),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        activity: formData.activity,
        activityCategory: formData.activityCategory,
        tags: formData.tags || [],
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : 50,
        currentParticipants: 1, // Creator counts as first participant
        participants: [user.uid],
        waitlist: [],
        declinedUsers: [],
        status: "active",
        isRecurring: false,
        requirements: {
          minAge: formData.ageRange?.min,
          maxAge: formData.ageRange?.max,
          verificationRequired: formData.verificationRequired || false,
        },
        coverImage: formData.coverImage,
        images: formData.images || [],
        views: 0,
        joinRequests: 0,
        completionRate: 0,
        engagementScore: 0,
      };

      await createMeetup(meetupData);

      Alert.alert(
        "Meetup Created!",
        "Your meetup has been successfully created and is now visible to others.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("MainTabs"),
          },
        ]
      );
    } catch (error) {
      console.error("Error creating meetup:", error);
      Alert.alert("Error", "Failed to create meetup. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = (step: number) => {
    navigation.navigate(`CreateMeetupStep${step}`, { formData, onUpdate });
  };

  const renderSection = (
    title: string,
    step: number,
    children: React.ReactNode
  ) => (
    <View style={[styles.section, { borderBottomColor: colors.border }]}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
        <TouchableOpacity
          style={[
            styles.editButton,
            { backgroundColor: colors.primary + "20" },
          ]}
          onPress={() => handleEdit(step)}
        >
          <Ionicons name="create-outline" size={16} color={colors.primary} />
          <Text style={[styles.editButtonText, { color: colors.primary }]}>
            Edit
          </Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );

  const renderDetail = (label: string, value: string, icon?: string) => (
    <View style={styles.detailRow}>
      {icon && (
        <Ionicons
          name={icon as any}
          size={16}
          color={colors.textSecondary}
          style={styles.detailIcon}
        />
      )}
      <View style={styles.detailContent}>
        <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <Text style={[styles.detailValue, { color: colors.text }]}>
          {value}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Review & Publish
        </Text>
        <View style={styles.stepIndicator}>
          <Text style={[styles.stepText, { color: colors.textSecondary }]}>
            Step 4 of 4
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Cover Image */}
          {formData.coverImage && (
            <View style={styles.coverImageContainer}>
              <Image
                source={{ uri: formData.coverImage }}
                style={styles.coverImage}
              />
            </View>
          )}

          {/* Basic Info Section */}
          {renderSection(
            "Basic Information",
            1,
            <View>
              <Text style={[styles.meetupTitle, { color: colors.text }]}>
                {formData.title}
              </Text>
              <Text
                style={[
                  styles.meetupDescription,
                  { color: colors.textSecondary },
                ]}
              >
                {formData.description}
              </Text>
              {renderDetail("Activity", formData.activity, "fitness-outline")}
            </View>
          )}

          {/* When & Where Section */}
          {renderSection(
            "When & Where",
            2,
            <View>
              {renderDetail(
                "Date & Time",
                formatDateTime(formData.time),
                "calendar-outline"
              )}
              {renderDetail(
                "Duration",
                formatDuration(formData.duration),
                "time-outline"
              )}
              {renderDetail(
                "Location",
                formData.locationName,
                "location-outline"
              )}
              {formData.address &&
                renderDetail("Address", formData.address, "map-outline")}
              {formData.latitude && formData.longitude && (
                <View style={styles.mapPreviewContainer}>
                  <Text
                    style={[styles.mapPreviewLabel, { color: colors.text }]}
                  >
                    📍 Location Preview
                  </Text>
                  <MapView
                    style={styles.mapPreview}
                    region={{
                      latitude: formData.latitude,
                      longitude: formData.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    scrollEnabled={false}
                    zoomEnabled={false}
                    pitchEnabled={false}
                    rotateEnabled={false}
                  >
                    <Marker
                      coordinate={{
                        latitude: formData.latitude,
                        longitude: formData.longitude,
                      }}
                      title={formData.locationName}
                      description={formData.address}
                    />
                  </MapView>
                </View>
              )}
            </View>
          )}

          {/* Settings Section */}
          {renderSection(
            "Settings",
            3,
            <View>
              {formData.maxParticipants &&
                renderDetail(
                  "Max Participants",
                  formData.maxParticipants,
                  "people-outline"
                )}
              {formData.ageRange &&
                renderDetail("Age Range", formData.ageRange, "person-outline")}
              {formData.verificationRequired && (
                <View style={styles.verificationBadge}>
                  <Ionicons
                    name="shield-checkmark"
                    size={16}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.verificationText, { color: colors.primary }]}
                  >
                    Verification Required
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.publishButton,
            {
              backgroundColor: isPublishing
                ? colors.textSecondary
                : colors.primary,
            },
          ]}
          onPress={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? (
            <Text
              style={[styles.publishButtonText, { color: colors.onPrimary }]}
            >
              Publishing...
            </Text>
          ) : (
            <Text
              style={[styles.publishButtonText, { color: colors.onPrimary }]}
            >
              Publish Meetup
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  stepIndicator: {
    alignItems: "center",
  },
  stepText: {
    fontSize: 12,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  coverImageContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  meetupTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  meetupDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  detailIcon: {
    marginTop: 2,
    marginRight: 12,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    gap: 6,
  },
  verificationText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  publishButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  mapPreviewContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  mapPreviewLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  mapPreview: {
    height: 150,
    width: "100%",
  },
});
