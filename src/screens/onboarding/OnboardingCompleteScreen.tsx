import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
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

  const { user, setOnboardingComplete, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();
  const { loadPreferences } = usePreferenceStore();

  const handleGetStarted = async () => {
    console.log("🎯 Starting onboarding completion process...");
    setLoading(true);

    try {
      console.log("📊 Current user state:", {
        uid: user?.uid,
        displayName: user?.displayName,
        onboardingComplete: user?.onboardingComplete,
        timestamp: new Date().toISOString(),
      });

      // Load preferences
      console.log("⚙️ Loading preferences...");
      await loadPreferences();

      // Update local state
      console.log("🔄 Updating local onboarding status to true...");
      setOnboardingComplete(true);
      updateUserProfile({ onboardingComplete: true });

      // Only connect to Supabase if not in developer mode
      if (!DataService.isInDeveloperMode() && user?.uid) {
        console.log("💾 Saving onboarding completion to Supabase...");
        // Write default preferences to Supabase
        const result = await SupabaseDataService.updateUser(user.uid, {
          onboardingComplete: true,
          preferences: DEFAULT_PREFERENCES,
        });

        if (result.error) {
          console.error("❌ Failed to update onboarding status:", result.error);
        } else {
          console.log("✅ Onboarding completed with default preferences!");
          console.log("🎉 User should now be redirected to main app");
        }
      } else {
        console.log("🔧 Developer Mode: Using local storage only");
        console.log("✅ Onboarding completed with default preferences!");
        console.log("🎉 User should now be redirected to main app");
      }
    } catch (error) {
      console.error("❌ Error completing onboarding:", error);
    } finally {
      setLoading(false);
      console.log("🔄 Onboarding completion process finished");
    }
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
