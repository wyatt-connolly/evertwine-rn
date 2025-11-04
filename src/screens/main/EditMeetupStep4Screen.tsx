import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import { useAuthStore } from "../../hooks/useAuthStore";

interface EditMeetupStep4ScreenProps {
  navigation: any;
  route: {
    params: {
      meetupId: string;
      formData: any;
      onUpdate?: (data: any) => void;
    };
  };
}

export default function EditMeetupStep4Screen({
  navigation,
  route,
}: EditMeetupStep4ScreenProps) {
  const { colors } = useThemeStore();
  const { updateMeetup } = useMeetupStore();
  const { user } = useAuthStore();
  const { meetupId, formData } = route.params;

  const [isSaving, setIsSaving] = useState(false);

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

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Validate user is authenticated
      if (!user?.uid) {
        Alert.alert("Error", "You must be logged in to edit a meetup.", [
          { text: "OK" },
        ]);
        return;
      }

      // Create the meetup update object
      const meetupUpdates = {
        title: formData.title,
        description: formData.description,
        locationName: formData.locationName,
        address: formData.address,
        time: new Date(formData.time),
        duration: parseInt(formData.duration),
        activity: formData.activity,
        activityCategory: formData.activityCategory,
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : 50,
        requirements: {
          minAge: formData.ageRange?.min,
          maxAge: formData.ageRange?.max,
          verificationRequired: formData.verificationRequired || false,
        },
        coverImage: formData.coverImage,
        images: formData.images || [],
      };

      await updateMeetup(meetupId, meetupUpdates);

      Alert.alert("Success", "Meetup updated successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Home", { refresh: true }),
        },
      ]);
    } catch (error) {
      console.error("Error updating meetup:", error);
      Alert.alert("Error", "Failed to update meetup. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderInfoCard = (title: string, value: string, icon: string) => (
    <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
      <View style={styles.infoHeader}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
        <Text style={[styles.infoTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
        {value}
      </Text>
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
          Review & Save
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Meetup Details
            </Text>
            {renderInfoCard("Title", formData.title, "text-outline")}
            {renderInfoCard(
              "Description",
              formData.description,
              "document-text-outline"
            )}
            {renderInfoCard("Activity", formData.activity, "people-outline")}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Location & Time
            </Text>
            {renderInfoCard(
              "Location",
              formData.locationName,
              "location-outline"
            )}
            {formData.address &&
              renderInfoCard("Address", formData.address, "map-outline")}
            {renderInfoCard(
              "Date & Time",
              new Date(formData.time).toLocaleString(),
              "calendar-outline"
            )}
            {renderInfoCard(
              "Duration",
              formatDuration(formData.duration),
              "time-outline"
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Additional Info
            </Text>
            {renderInfoCard(
              "Max Participants",
              formData.maxParticipants || "50",
              "people-outline"
            )}
            {formData.ageRange &&
              renderInfoCard("Age Range", formData.ageRange, "person-outline")}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            {
              backgroundColor: isSaving ? colors.textSecondary : colors.primary,
            },
          ]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color={colors.onPrimary} />
          ) : (
            <>
              <Ionicons name="checkmark" size={20} color={colors.onPrimary} />
              <Text
                style={[styles.saveButtonText, { color: colors.onPrimary }]}
              >
                Save Changes
              </Text>
            </>
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
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
