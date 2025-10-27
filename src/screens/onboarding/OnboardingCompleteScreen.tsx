import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { DataService } from "../../services/DataService";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { usePreferenceStore } from "../../hooks/usePreferenceStore";
import { DEFAULT_PREFERENCES } from "../../constants/preferences";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";
import AnimatedCard from "../../components/AnimatedCard";
import NotificationPermissionModal from "../../components/NotificationPermissionModal";
import { Ionicons } from "@expo/vector-icons";

type OnboardingCompleteScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "OnboardingComplete"
>;

interface Props {
  navigation: OnboardingCompleteScreenNavigationProp;
}

export default function OnboardingCompleteScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const { user, setOnboardingComplete, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();
  const { loadPreferences } = usePreferenceStore();

  const handleGetStarted = async () => {
    setLoading(true);

    try {
      // Load preferences
      await loadPreferences();

      // Update local state
      setOnboardingComplete(true);
      updateUserProfile({ onboardingComplete: true });

      // Connect to Supabase
      if (user?.uid) {
        // Write default preferences to Supabase
        const result = await SupabaseDataService.updateUser(user.uid, {
          onboardingComplete: true,
          preferences: DEFAULT_PREFERENCES,
        });

        if (result.error) {
          console.error("Error updating user preferences:", result.error);
        } else {
          console.log("User preferences updated successfully");
        }
      } else {
        console.warn("No user UID available for updating preferences");
      }

      // Show notification permission modal after onboarding is complete
      setShowNotificationModal(true);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      Alert.alert(
        "Error",
        "There was an issue completing your setup. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPermissionGranted = () => {
    setShowNotificationModal(false);
    // The AppNavigator will handle navigation to MainTabs
    // since onboardingComplete is now true
  };

  const handleNotificationPermissionDenied = () => {
    setShowNotificationModal(false);
    // The AppNavigator will handle navigation to MainTabs
    // since onboardingComplete is now true
  };

  const handleNotificationSkip = () => {
    setShowNotificationModal(false);
    // The AppNavigator will handle navigation to MainTabs
    // since onboardingComplete is now true
  };

  return (
    <GradientBackground variant="dark">
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <AnimatedCard delay={200} direction="up">
            <View style={styles.iconContainer}>
              <Ionicons
                name="checkmark-circle"
                size={100}
                color={colors.success}
              />
            </View>

            <View style={styles.header}>
              <Text style={[styles.title, { color: "#FFFFFF" }]}>
                You're All Set!
              </Text>
              <Text style={[styles.subtitle, { color: "#E5E5EA" }]}>
                Welcome to Evertwine! You're ready to start connecting with
                people who share your interests.
              </Text>
            </View>
          </AnimatedCard>

          <AnimatedCard delay={400} direction="up">
            <View style={styles.features}>
              <View style={styles.featureItem}>
                <Ionicons name="people" size={24} color={colors.primary} />
                <Text style={[styles.featureText, { color: "#FFFFFF" }]}>
                  Discover meetups
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="chatbubbles" size={24} color={colors.primary} />
                <Text style={[styles.featureText, { color: "#FFFFFF" }]}>
                  Connect with others
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="heart" size={24} color={colors.primary} />
                <Text style={[styles.featureText, { color: "#FFFFFF" }]}>
                  Build meaningful relationships
                </Text>
              </View>
            </View>
          </AnimatedCard>

          <View style={styles.buttonContainer}>
            <AnimatedButton
              title={loading ? "Getting Started..." : "Get Started"}
              onPress={handleGetStarted}
              variant="primary"
              disabled={loading}
              loading={loading}
              style={styles.primaryButton}
            />
          </View>
        </View>
      </SafeAreaView>

      {/* Notification Permission Modal */}
      <NotificationPermissionModal
        visible={showNotificationModal}
        onPermissionGranted={handleNotificationPermissionGranted}
        onPermissionDenied={handleNotificationPermissionDenied}
        onSkip={handleNotificationSkip}
      />
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  features: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 18,
    marginLeft: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    marginTop: 20,
  },
  secondaryButton: {
    marginTop: 0,
  },
});
