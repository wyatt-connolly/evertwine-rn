import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";

interface CreateMeetupConfirmationScreenProps {
  navigation: any;
  route: {
    params: {
      formData: any;
      onUpdate?: (data: any) => void;
    };
  };
}

export default function CreateMeetupConfirmationScreen({
  navigation,
  route,
}: CreateMeetupConfirmationScreenProps) {
  const { colors } = useThemeStore();
  const { formData } = route.params;
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

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
    if (step === 3) {
      // Step 3 was removed, redirect to Step 2
      navigation.navigate("CreateMeetupStep2", {
        formData,
        onUpdate: () => {},
      });
    } else {
      navigation.navigate(`CreateMeetupStep${step}`, {
        formData,
        onUpdate: () => {},
      });
    }
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
            Final Step
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Basic Info */}
        {renderSection(
          "Basic Information",
          1,
          <View style={styles.sectionContent}>
            {renderDetail("Title", formData.title, "text-outline")}
            {renderDetail(
              "Description",
              formData.description,
              "document-text-outline"
            )}
            {renderDetail("Activity", formData.activity, "star-outline")}
            {formData.coverImage && (
              <View style={styles.imagePreview}>
                <Text
                  style={[styles.imageLabel, { color: colors.textSecondary }]}
                >
                  Cover Image
                </Text>
                <View
                  style={[
                    styles.imageContainer,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Ionicons
                    name="image"
                    size={24}
                    color={colors.textSecondary}
                  />
                </View>
              </View>
            )}
          </View>
        )}

        {/* Location & Time */}
        {renderSection(
          "Location & Time",
          2,
          <View style={styles.sectionContent}>
            {renderDetail(
              "Location",
              formData.locationName,
              "location-outline"
            )}
            {formData.address &&
              renderDetail("Address", formData.address, "map-outline")}
            {formData.time &&
              renderDetail(
                "Date & Time",
                formatDateTime(formData.time),
                "calendar-outline"
              )}
            {renderDetail(
              "Duration",
              formatDuration(formData.duration),
              "time-outline"
            )}
          </View>
        )}

        {/* Additional Info */}
        {renderSection(
          "Additional Information",
          2,
          <View style={styles.sectionContent}>
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
          <Ionicons
            name={isPublishing ? "hourglass-outline" : "checkmark-circle"}
            size={20}
            color={colors.onPrimary}
          />
          <Text style={[styles.publishButtonText, { color: colors.onPrimary }]}>
            {isPublishing ? "Creating Meetup..." : "Publish Meetup"}
          </Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  stepIndicator: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  sectionContent: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  detailIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    lineHeight: 20,
  },
  imagePreview: {
    marginTop: 8,
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  imageContainer: {
    height: 80,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderStyle: "dashed",
  },
  verificationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  verificationText: {
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  publishButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
