import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../hooks/useThemeStore";
import { SupabaseDataService } from "../../services/SupabaseDataService";

export default function EditMeetupScreen({ navigation, route }: any) {
  const { meetupId } = route.params;
  const { colors } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMeetupData();
  }, [meetupId]);

  const loadMeetupData = async () => {
    try {
      setIsLoading(true);
      const meetup = await SupabaseDataService.getMeetup(meetupId);

      if (meetup) {
        // Transform meetup data to match the form structure
        const formData = {
          title: meetup.title,
          description: meetup.description,
          locationName: meetup.locationName,
          address: meetup.address,
          activity: meetup.activity,
          activityCategory: meetup.activityCategory,
          tags: meetup.tags.join(", "),
          maxParticipants: meetup.maxParticipants.toString(),
          time: meetup.time.toISOString(),
          duration: meetup.duration.toString(),
          isRecurring: meetup.isRecurring,
          verificationRequired: meetup.requirements.verificationRequired,
          coverImage: meetup.coverImage,
          images: meetup.images || [],
        };

        // Navigate to the new multi-step edit flow
        navigation.replace("EditMeetupStep1", {
          meetupId,
          formData,
          onUpdate: (_data: any) => {
            // This will be handled by the individual step screens
          },
        });
      } else {
        Alert.alert("Error", "Meetup not found.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error loading meetup:", error);
      Alert.alert("Error", "Failed to load meetup data.");
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading meetup...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // This should not be reached as the component redirects to EditMeetupStep1
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});
